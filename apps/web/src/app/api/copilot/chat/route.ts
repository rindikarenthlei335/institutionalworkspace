import { NextResponse } from 'next/server';
import {
  getTenantQuotaStatus,
  processCopilotMessage
} from '@/features/copilot/lib/copilot-engine';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      prompt,
      mode = 'general',
      language = 'en',
      history = [],
      tenantId = '00000000-0000-0000-0000-000000000001',
      planId = 'ultimate',
      userRole = 'school_admin'
    } = body;

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Prompt is required.' },
        { status: 400 }
      );
    }

    const message = await processCopilotMessage(prompt, {
      tenantId,
      userRole,
      planId,
      mode,
      language,
      history
    });

    const quota = getTenantQuotaStatus(tenantId, planId);

    return NextResponse.json({
      message,
      quota
    });
  } catch (err: any) {
    console.error('[API /api/copilot/chat] Error:', err);
    return NextResponse.json(
      { error: err.message || 'Internal Copilot error' },
      { status: 500 }
    );
  }
}
