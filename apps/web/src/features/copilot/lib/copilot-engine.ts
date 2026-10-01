import type {
  ChatMessage,
  CopilotLanguage,
  CopilotMode,
  CopilotQuotaStatus,
  DeepLinkItem,
  LLMMessage
} from './types';
import { getLLMProvider } from './llm-provider';
import { getGlossaryPrompt } from './glossary-injector';
import { searchHelpArticles } from './help-search';
import { executeDataTool } from './tools';
import {
  createDraftCircular,
  createDraftNotice,
  createDraftTranslation
} from './action-drafts';

// Tenant quota tracking in memory
const TENANT_QUOTA_USAGE = new Map<string, number>();

export function getTenantQuotaStatus(
  tenantId: string,
  planId: string = 'ultimate'
): CopilotQuotaStatus {
  const isUltimate = planId === 'ultimate';
  const monthlyQuota = isUltimate ? 3000 : 0;
  const usedMessagesThisMonth = TENANT_QUOTA_USAGE.get(tenantId) || 0;
  const isAllowed = isUltimate && usedMessagesThisMonth < monthlyQuota;

  const now = new Date();
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  return {
    tenantId,
    planId,
    usedMessagesThisMonth,
    monthlyQuota,
    isAllowed,
    resetsAt: nextMonth.toISOString()
  };
}

export function recordQuotaUsage(tenantId: string): void {
  const current = TENANT_QUOTA_USAGE.get(tenantId) || 0;
  TENANT_QUOTA_USAGE.set(tenantId, current + 1);
}

export interface CopilotChatOptions {
  tenantId: string;
  userId?: string;
  userRole?: string;
  planId?: string;
  mode?: CopilotMode;
  language?: CopilotLanguage;
  history?: ChatMessage[];
}

export async function processCopilotMessage(
  userPrompt: string,
  options: CopilotChatOptions
): Promise<ChatMessage> {
  const {
    tenantId,
    userId,
    userRole = 'school_admin',
    planId = 'ultimate',
    mode = 'general',
    language = 'en',
    history = []
  } = options;

  // 1. Entitlement & Quota Check
  const quota = getTenantQuotaStatus(tenantId, planId);
  if (!quota.isAllowed) {
    if (planId !== 'ultimate') {
      return {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content:
          language === 'lus'
            ? 'AI Copilot hi Ultimate Plan neitute tan chauh a ni. Khawngaihin in school plan hi Ultimate-ah upgrade rawh u.'
            : 'AI Copilot is exclusively available on the Ultimate Plan. Please upgrade your institutional subscription to unlock AI assistance.',
        createdAt: new Date().toISOString()
      };
    }

    return {
      id: `msg-${Date.now()}`,
      role: 'assistant',
      content:
        language === 'lus'
          ? `He thlaa in message quota (3,000) chu a zo tawh e. Thla tharah a in renew leh ang.`
          : `Your institution has reached its monthly AI Copilot quota (3,000 messages). Quota resets at the beginning of the next calendar month.`,
      createdAt: new Date().toISOString()
    };
  }

  // 2. Mode-Specific Routing
  let deepLinks: DeepLinkItem[] | undefined;
  let toolResult: any | undefined;
  let actionDraft: any | undefined;

  const lower = userPrompt.toLowerCase();

  // GUIDE MODE
  if (mode === 'guide' || lower.startsWith('how do') || lower.includes('dan') || lower.includes('khawi')) {
    const searchResults = searchHelpArticles(userPrompt, language);
    if (searchResults.length > 0) {
      deepLinks = searchResults.slice(0, 3).map((r) => ({
        title: r.title,
        url: r.deepLink,
        description: r.content.substring(0, 100) + '...'
      }));
    }
  }

  // DATA MODE
  if (
    mode === 'data' ||
    lower.includes('how many students') ||
    lower.includes('stats') ||
    lower.includes('defaulter') ||
    lower.includes('attendance summary') ||
    lower.includes('exam result') ||
    lower.includes('fee summary')
  ) {
    let toolName = 'student_stats';
    if (lower.includes('defaulter')) {
      toolName = 'list_defaulters';
    } else if (lower.includes('fee')) {
      toolName = 'fee_summary';
    } else if (lower.includes('exam') || lower.includes('result') || lower.includes('rank')) {
      toolName = 'exam_results_summary';
    } else if (lower.includes('attendance') || lower.includes('kallam') || lower.includes('absent')) {
      toolName = 'attendance_summary';
    }

    const res = await executeDataTool(toolName, {}, { tenantId, userId, role: userRole });
    toolResult = res;
  }

  // ACTION MODE
  if (
    mode === 'action' ||
    lower.startsWith('draft') ||
    lower.includes('circular') ||
    lower.includes('notice') ||
    lower.includes('thuchhuah')
  ) {
    if (lower.includes('circular')) {
      actionDraft = createDraftCircular({
        title: userPrompt.replace(/draft|circular|create/gi, '').trim() || 'Parent-Teacher Meeting Circular',
        targetAudience: 'Parents & Guardians',
        body:
          language === 'lus'
            ? 'Nu leh pate hriattir in ni e: Karleh Thawhtanni chawhma dar 10:00 hian Parent-Teacher Meeting neih tur a ni a, zirlai zawng zawng nu leh pate lo tel vek tura ngen in ni e.'
            : 'All parents and guardians are cordially invited to attend the upcoming Parent-Teacher Conference scheduled for Monday at 10:00 AM in the school auditorium.',
        language
      });
    } else if (lower.includes('translate') || lower.includes('letling')) {
      actionDraft = createDraftTranslation({
        title: 'Bilingual Notice Draft',
        sourceText: userPrompt,
        translatedText:
          language === 'lus'
            ? 'Zirna in tana hriattirna pawimawh: Exam hun a hnaih tawh avangin zirlai zawng zawng te taima taka lehkha zir turin kan inngen a ni.'
            : 'Important institutional notice: With examinations approaching, all students are advised to maintain diligent study hours.',
        sourceLang: language === 'lus' ? 'en' : 'lus',
        targetLang: language === 'lus' ? 'lus' : 'en'
      });
    } else {
      actionDraft = createDraftNotice({
        title: userPrompt.replace(/draft|notice|create/gi, '').trim() || 'School Holiday Notification',
        targetAudience: 'All Students & Staff',
        body:
          language === 'lus'
            ? 'Sikul thuchhuah: Naktuk hi Chapchar Kut chawlh a nih avangin sikul chawlh a ni ang a, a tuk leh atangin class pangngai a kal leh ang.'
            : 'Notice: The institution shall remain closed tomorrow on account of public observance. Regular classes will resume following the holiday.',
        language
      });
    }
  }

  // 3. Assemble Prompts
  const systemPrompt = `You are EduPortal AI Copilot, a helpful, secure, and professional assistant for school administrators and teachers in Mizoram.
Tone: Professional, educational, supportive, and clear.
Language: ${language === 'lus' ? 'Mizo (lus)' : 'English (en)'}.
Active Mode: ${mode}.
User Role: ${userRole}.
${getGlossaryPrompt(language)}

GUIDELINES:
- Always give accurate, school-specific guidance.
- When in Guide Mode, provide clear navigation steps to the relevant admin page.
- When in Data Mode, explain the numbers clearly and respect student privacy.
- When in Action Mode, remind the user that drafts require their explicit confirmation before being posted.
- When communicating in Mizo, use standard Mizoram educational phrasing.`;

  const llmMessages: LLMMessage[] = [{ role: 'system', content: systemPrompt }];

  // Add conversation history
  for (const h of history.slice(-4)) {
    llmMessages.push({
      role: h.role,
      content: h.content
    });
  }

  // Add current prompt
  let augmentedPrompt = userPrompt;
  if (toolResult) {
    augmentedPrompt += `\n\n[CONTEXT DATA FROM DATA HUB]:\nTool: ${toolResult.toolName}\nSummary: ${toolResult.summary}`;
  }
  if (actionDraft) {
    augmentedPrompt += `\n\n[ACTION DRAFT PREPARED]:\nType: ${actionDraft.type}\nTitle: ${actionDraft.title}\nStatus: ${actionDraft.status} (REQUIRES CONFIRMATION)`;
  }

  llmMessages.push({ role: 'user', content: augmentedPrompt });

  // 4. Invoke LLM Provider
  const provider = getLLMProvider();
  const response = await provider.chat(llmMessages, {
    temperature: 0.2,
    maxTokens: 800
  });

  // 5. Record Quota Usage
  recordQuotaUsage(tenantId);

  // 6. Return Assistant Response
  return {
    id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    role: 'assistant',
    content: response.text,
    metadata: {
      deepLinks,
      toolResult,
      actionDraft,
      tokensUsed: response.tokensUsed,
      model: response.model
    },
    createdAt: new Date().toISOString()
  };
}
