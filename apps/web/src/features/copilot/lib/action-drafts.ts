import type { ActionDraft } from './types';

// In-memory / cache store for draft actions awaiting user confirmation
const DRAFT_STORE = new Map<string, ActionDraft>();

export function createDraftNotice(params: {
  title: string;
  targetAudience: string;
  body: string;
  language?: 'en' | 'lus';
}): ActionDraft {
  const id = `draft-notice-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const draft: ActionDraft = {
    id,
    type: 'notice',
    title: params.title,
    targetAudience: params.targetAudience,
    previewContent: params.body,
    status: 'pending_confirmation',
    metadata: {
      category: 'announcement',
      language: params.language || 'en'
    },
    createdAt: new Date().toISOString()
  };

  DRAFT_STORE.set(id, draft);
  return draft;
}

export function createDraftCircular(params: {
  title: string;
  targetAudience: string;
  body: string;
  circularNo?: string;
  language?: 'en' | 'lus';
}): ActionDraft {
  const id = `draft-circ-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const circularNo = params.circularNo || `CIR-${new Date().getFullYear()}-${Math.floor(Math.random() * 900 + 100)}`;
  const draft: ActionDraft = {
    id,
    type: 'circular',
    title: `[${circularNo}] ${params.title}`,
    targetAudience: params.targetAudience,
    previewContent: params.body,
    status: 'pending_confirmation',
    metadata: {
      circularNo,
      language: params.language || 'en'
    },
    createdAt: new Date().toISOString()
  };

  DRAFT_STORE.set(id, draft);
  return draft;
}

export function createDraftTranslation(params: {
  title: string;
  sourceText: string;
  translatedText: string;
  sourceLang: string;
  targetLang: string;
}): ActionDraft {
  const id = `draft-trans-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const draft: ActionDraft = {
    id,
    type: 'translation',
    title: params.title,
    targetAudience: 'All Staff / Students',
    previewContent: params.translatedText,
    status: 'pending_confirmation',
    metadata: {
      sourceText: params.sourceText,
      sourceLang: params.sourceLang,
      targetLang: params.targetLang
    },
    createdAt: new Date().toISOString()
  };

  DRAFT_STORE.set(id, draft);
  return draft;
}

export function getDraftById(id: string): ActionDraft | undefined {
  return DRAFT_STORE.get(id);
}

export interface ApplyDraftResult {
  success: boolean;
  draft: ActionDraft;
  message: string;
  auditLogId: string;
}

export async function applyDraftAction(
  draftId: string,
  user: { id: string; role?: string; tenantId: string }
): Promise<ApplyDraftResult> {
  const draft = DRAFT_STORE.get(draftId);
  if (!draft) {
    throw new Error(`Draft ${draftId} not found or expired.`);
  }

  if (draft.status === 'applied') {
    return {
      success: true,
      draft,
      message: 'Draft has already been applied.',
      auditLogId: `audit-existing-${draft.id}`
    };
  }

  // Mark draft as confirmed & applied
  draft.status = 'applied';
  DRAFT_STORE.set(draftId, draft);

  // Generate an audit log identifier
  const auditLogId = `audit-${Date.now()}-${draft.id}`;

  return {
    success: true,
    draft,
    message: `Successfully confirmed and applied ${draft.type}: "${draft.title}".`,
    auditLogId
  };
}
