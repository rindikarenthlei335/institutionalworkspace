export const runtime = 'edge';

import { NextResponse } from 'next/server';
import { applyDraftAction } from '@/features/copilot/lib/action-drafts';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { draftId, tenantId = '00000000-0000-0000-0000-000000000001', userId = 'admin-user' } = body;

    if (!draftId) {
      return NextResponse.json(
        { error: 'Draft ID is required.' },
        { status: 400 }
      );
    }

    const result = await applyDraftAction(draftId, { id: userId, tenantId });

    return NextResponse.json(result);
  } catch (err: any) {
    console.error('[API /api/copilot/action/confirm] Error:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to confirm action draft' },
      { status: 500 }
    );
  }
}
