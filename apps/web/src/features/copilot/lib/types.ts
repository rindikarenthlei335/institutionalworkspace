export type CopilotMode = 'guide' | 'data' | 'action' | 'general';
export type CopilotLanguage = 'en' | 'lus';

export interface DeepLinkItem {
  title: string;
  url: string;
  icon?: string;
  description?: string;
}

export interface ActionDraft {
  id: string;
  type: 'notice' | 'circular' | 'translation';
  title: string;
  targetAudience: string;
  previewContent: string;
  status: 'pending_confirmation' | 'applied' | 'rejected';
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface ToolExecutionSummary {
  toolName: string;
  summary: string;
  data?: any;
}

export interface MessageMetadata {
  deepLinks?: DeepLinkItem[];
  toolResult?: ToolExecutionSummary;
  actionDraft?: ActionDraft;
  tokensUsed?: number;
  model?: string;
}

export interface ChatMessage {
  id: string;
  conversationId?: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  metadata?: MessageMetadata;
  createdAt: string;
}

export interface Conversation {
  id: string;
  tenantId: string;
  userId?: string;
  title: string;
  mode: CopilotMode;
  language: CopilotLanguage;
  createdAt: string;
  updatedAt: string;
}

export interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LLMResponse {
  text: string;
  tokensUsed: number;
  model: string;
  metadata?: any;
}

export interface HelpSearchResult {
  id: string;
  module: string;
  slug: string;
  title: string;
  content: string;
  deepLink: string;
  score: number;
}

export interface CopilotQuotaStatus {
  tenantId: string;
  planId: string;
  usedMessagesThisMonth: number;
  monthlyQuota: number;
  isAllowed: boolean;
  resetsAt: string;
}
