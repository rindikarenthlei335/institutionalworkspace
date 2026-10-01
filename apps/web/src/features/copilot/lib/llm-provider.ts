import type { LLMMessage, LLMResponse } from './types';

export interface LLMProvider {
  chat(
    messages: LLMMessage[],
    options?: {
      model?: string;
      temperature?: number;
      maxTokens?: number;
    }
  ): Promise<LLMResponse>;
}

export class AnthropicProvider implements LLMProvider {
  private apiKey: string;
  private defaultModel: string;

  constructor(apiKey?: string, defaultModel = 'claude-haiku-4-5-20251001') {
    this.apiKey = apiKey || process.env.ANTHROPIC_API_KEY || '';
    this.defaultModel = defaultModel;
  }

  async chat(
    messages: LLMMessage[],
    options?: { model?: string; temperature?: number; maxTokens?: number }
  ): Promise<LLMResponse> {
    if (!this.apiKey) {
      throw new Error('Anthropic API key is not configured.');
    }

    const systemPrompt = messages.find((m) => m.role === 'system')?.content || '';
    const conversationMessages = messages
      .filter((m) => m.role !== 'system')
      .map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content
      }));

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        model: options?.model || this.defaultModel,
        max_tokens: options?.maxTokens || 1024,
        temperature: options?.temperature ?? 0.3,
        system: systemPrompt,
        messages: conversationMessages
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Anthropic API error (${response.status}): ${errText}`);
    }

    const data = await response.json();
    const text = data.content?.[0]?.text || '';
    const tokensUsed = (data.usage?.input_tokens || 0) + (data.usage?.output_tokens || 0);

    return {
      text,
      tokensUsed,
      model: options?.model || this.defaultModel,
      metadata: data.usage
    };
  }
}

export class MockProvider implements LLMProvider {
  private defaultModel: string;

  constructor(defaultModel = 'claude-haiku-4-5-20251001') {
    this.defaultModel = defaultModel;
  }

  async chat(
    messages: LLMMessage[],
    options?: { model?: string; temperature?: number; maxTokens?: number }
  ): Promise<LLMResponse> {
    const userMessage = [...messages].reverse().find((m) => m.role === 'user')?.content || '';
    const isLus = messages.some((m) => m.content.toLowerCase().includes('mizo') || m.content.includes('Zirlai'));
    const lower = userMessage.toLowerCase();

    let responseText = '';
    const model = options?.model || this.defaultModel;

    // Detect intent
    if (lower.includes('enroll') || lower.includes('admission') || lower.includes('zirlai lakluh')) {
      responseText = isLus
        ? 'Zirlai lakluh nan **Admin -> Students & Guardians** ah kal la, "New Admission" hmet rawh. A rualin zirlai tam tak thun duh chuan Data Hub Import Center (.xlsx) hmangin a thun theih bawk e.'
        : 'To enroll new students, navigate to **Admin -> Students & Guardians** and select **New Admission**. For bulk imports, use **Admin -> Data Hub -> Import Center** with our official `.xlsx` template.';
    } else if (lower.includes('fee') || lower.includes('ba') || lower.includes('receipt') || lower.includes('defaulter')) {
      responseText = isLus
        ? 'School fee leh fee ba la pe lo zirlaite chu **Admin -> Fees & Receipts** ah a en theih e. Defaulters tab-ah class tina ba awmzat leh reminder thawnna a inpeih reng e.'
        : 'You can manage school fees and track overdue accounts under **Admin -> Fees & Receipts**. Check the **Defaulters** tab to view unpaid balances and send instant reminders.';
    } else if (lower.includes('exam') || lower.includes('mark') || lower.includes('rank') || lower.includes('result')) {
      responseText = isLus
        ? 'Exam marks chhutluh leh result siam nan **Admin -> Exams & Marksheets** ah kal la, subject marks i thun hnuah **Publish** hmet la, rank leh marksheet QR code nen a inpeih nghal ang.'
        : 'To enter exam marks and calculate ranks, open **Admin -> Exams & Marksheets**. Enter student scores in the grid, then click **Publish** to generate verified report cards with QR codes.';
    } else if (lower.includes('attendance') || lower.includes('kallam') || lower.includes('kallo') || lower.includes('absent')) {
      responseText = isLus
        ? 'Kallam chhinchhiah nan **Admin -> Attendance** ah pawl thlangin vawi khatah kal leh kallo a mark zung zung theih e. Za zela 75% tling lo te chu automatic-in an lang nghal ang.'
        : 'Mark daily attendance via **Admin -> Attendance**. The system tracks monthly ratios and automatically triggers alerts for students with attendance below 75%.';
    } else if (lower.includes('id card') || lower.includes('hriatpuina')) {
      responseText = isLus
        ? 'ID Card siam nan **Admin -> ID Card Generator** ah kal la, CR80 card mal emaw A4 sheet pakhata card 8 zel print theih a inpeih e.'
        : 'To create institutional identity cards, navigate to **Admin -> ID Card Generator**. You can print CR80 cards individually or export 8-up A4 printable sheets.';
    } else if (lower.includes('tc') || lower.includes('transfer certificate') || lower.includes('bonafide')) {
      responseText = isLus
        ? 'Transfer Certificate (TC) pek chhuah nan **Admin -> Certificates** ah kal la, zirlai thlan rualin serial number leh QR verification fel tak a insiam nghal ang.'
        : 'Issue Transfer Certificates and Bonafide certificates via **Admin -> Certificates**. Each certificate includes an official sequential serial number and public QR verification.';
    } else if (lower.includes('draft') || lower.includes('notice') || lower.includes('thuchhuah')) {
      responseText = isLus
        ? 'Thuchhuah (Notice) tur chu ka lo ruahman e. Khawngaihin a hnuaia rawtna hi lo en la, "Pawm & Tichhuak" hmetin i tichiang dawn nia.'
        : 'I have prepared a draft institutional notice for your review. Please verify the details below and click "Confirm & Apply" to publish.';
    } else {
      responseText = isLus
        ? `Chibai! EduPortal AI Tanpuitu ka ni. Sikul enkawlna, zirlai chanchin, fee, exam results, leh thuchhuah siamah ka pui thei a che. Eng nge kan buaipui ang?`
        : `Hello! I am your EduPortal AI Assistant. I can assist you with student enrollment, fee collections, exam marks, attendance tracking, and draft circulars. How may I help you today?`;
    }

    const estimatedTokens = Math.max(25, Math.ceil(responseText.length / 4) + 60);

    return {
      text: responseText,
      tokensUsed: estimatedTokens,
      model,
      metadata: { mock: true }
    };
  }
}

export function getLLMProvider(): LLMProvider {
  if (process.env.ANTHROPIC_API_KEY) {
    return new AnthropicProvider(process.env.ANTHROPIC_API_KEY);
  }
  return new MockProvider();
}
