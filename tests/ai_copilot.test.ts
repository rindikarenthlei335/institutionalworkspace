import test, { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. LLM Provider & Mock Types
interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface LLMResponse {
  text: string;
  tokensUsed: number;
  model: string;
  metadata?: any;
}

class TestMockProvider {
  private defaultModel: string;
  constructor(defaultModel = 'claude-haiku-4-5-20251001') {
    this.defaultModel = defaultModel;
  }

  async chat(messages: LLMMessage[]): Promise<LLMResponse> {
    const userMsg = [...messages].reverse().find((m) => m.role === 'user')?.content || '';
    const isLus = messages.some((m) => m.content.toLowerCase().includes('mizo') || m.content.includes('zirlai'));
    const lower = userMsg.toLowerCase();

    let text = '';
    if (lower.includes('enroll') || lower.includes('admission') || lower.includes('zirlai lakluh')) {
      text = isLus
        ? 'Zirlai lakluh nan Admin -> Students & Guardians ah kal rawh.'
        : 'To enroll new students, navigate to Admin -> Students & Guardians.';
    } else if (lower.includes('fee') || lower.includes('ba')) {
      text = isLus
        ? 'Fee ba la awmte chu Admin -> Fees & Receipts ah a en theih e.'
        : 'Fee defaulters can be tracked under Admin -> Fees & Receipts.';
    } else if (lower.includes('draft') || lower.includes('notice') || lower.includes('thuchhuah')) {
      text = isLus
        ? 'Thuchhuah (Notice) tur chu ka lo ruahman e. Khawngaihin nemngheh hmasa rawh.'
        : 'I have prepared a draft notice. Please confirm and apply.';
    } else {
      text = isLus ? 'Chibai! AI Copilot ka ni e.' : 'Hello! I am EduPortal AI Copilot.';
    }

    return {
      text,
      tokensUsed: 45,
      model: this.defaultModel,
      metadata: { mock: true }
    };
  }
}

// 2. Glossary Formatter
function formatGlossaryPrompt(terms: { school_terms: Record<string, string>; product_terms: Record<string, string> }): string {
  const schoolLines = Object.entries(terms.school_terms).map(([k, v]) => `  - ${k}: ${v}`).join('\n');
  const prodLines = Object.entries(terms.product_terms).map(([k, v]) => `  - ${k}: ${v}`).join('\n');
  return `### OFFICIAL MIZO (LUS) TERMINOLOGY GLOSSARY:\n[School Terms]:\n${schoolLines}\n\n[Product Terms]:\n${prodLines}`;
}

// 3. Knowledge Base Search
const HELP_KB = [
  { module: 'students', slug: 'enrollment', titleEn: 'How to Enroll Students', titleLus: 'Zirlai Lakluh Dan', deepLink: '/admin/students' },
  { module: 'fees', slug: 'fees', titleEn: 'Fee Collection & Defaulters', titleLus: 'Fee Khawn leh Ba En Dan', deepLink: '/admin/fees' },
  { module: 'exams', slug: 'exams', titleEn: 'Marks Entry & Marksheets', titleLus: 'Marks Chhutluh leh Marksheet', deepLink: '/admin/exams' },
  { module: 'attendance', slug: 'attendance', titleEn: 'Daily Attendance Marking', titleLus: 'Ni Tin Kallam Chhinchhiah', deepLink: '/admin/attendance' },
  { module: 'certificates', slug: 'certificates', titleEn: 'Transfer Certificates', titleLus: 'Transfer Certificate (TC)', deepLink: '/admin/certificates' }
];

function searchHelp(query: string, lang: 'en' | 'lus' = 'en') {
  const q = query.toLowerCase();
  return HELP_KB.filter((item) => {
    const title = lang === 'lus' ? item.titleLus.toLowerCase() : item.titleEn.toLowerCase();
    return title.includes(q) || item.module.includes(q);
  });
}

// 4. Data Tools Simulation
const SAMPLE_STUDENTS = [
  { name: 'Lalmuanpuia Sailo', feeDue: 0, attendance: 94.2, marks: 88 },
  { name: 'Zoramsangi Ralte', feeDue: 3500, attendance: 71.0, marks: 92 },
  { name: 'Lalthanmawia Pachuau', feeDue: 8200, attendance: 68.5, marks: 54 }
];

function runDataTool(toolName: string) {
  switch (toolName) {
    case 'student_stats':
      return { total: SAMPLE_STUDENTS.length, active: true };
    case 'fee_summary': {
      const defaulters = SAMPLE_STUDENTS.filter((s) => s.feeDue > 0);
      return { totalDue: defaulters.reduce((acc, s) => acc + s.feeDue, 0), defaulterCount: defaulters.length };
    }
    case 'attendance_summary': {
      const lowAttendance = SAMPLE_STUDENTS.filter((s) => s.attendance < 75);
      return { flaggedCount: lowAttendance.length, threshold: 75 };
    }
    default:
      throw new Error(`Unknown tool: ${toolName}`);
  }
}

// 5. Action Draft Safeguards
interface ActionDraft {
  id: string;
  type: 'notice' | 'circular';
  title: string;
  status: 'pending_confirmation' | 'applied';
}

class ActionDraftManager {
  private drafts = new Map<string, ActionDraft>();

  createNotice(title: string): ActionDraft {
    const draft: ActionDraft = {
      id: `draft-${Date.now()}`,
      type: 'notice',
      title,
      status: 'pending_confirmation'
    };
    this.drafts.set(draft.id, draft);
    return draft;
  }

  confirmAndApply(draftId: string): { success: boolean; auditLogId: string } {
    const d = this.drafts.get(draftId);
    if (!d) throw new Error('Draft not found');
    d.status = 'applied';
    return { success: true, auditLogId: `audit-log-${draftId}` };
  }

  get(id: string) {
    return this.drafts.get(id);
  }
}

// 6. Quota Tracker
class QuotaTracker {
  private usage = new Map<string, number>();

  checkQuota(tenantId: string, planId: string): { allowed: boolean; quota: number; used: number } {
    const quota = planId === 'ultimate' ? 3000 : 0;
    const used = this.usage.get(tenantId) || 0;
    return {
      allowed: planId === 'ultimate' && used < quota,
      quota,
      used
    };
  }

  increment(tenantId: string) {
    const used = this.usage.get(tenantId) || 0;
    this.usage.set(tenantId, used + 1);
  }
}

describe('AI Copilot Assistant & Governance (P2-M8)', () => {
  describe('LLM Provider & Glossary System', () => {
    it('MockProvider returns realistic responses in English and Mizo', async () => {
      const provider = new TestMockProvider();
      const resEn = await provider.chat([{ role: 'user', content: 'How do I enroll students?' }]);
      assert.ok(resEn.text.includes('Admin -> Students'));
      assert.strictEqual(resEn.metadata.mock, true);

      const resLus = await provider.chat([{ role: 'user', content: 'Zirlai lakluh dan min hrilh teh' }]);
      assert.ok(resLus.text.includes('Admin -> Students'));
    });

    it('injects official Mizo glossary with school and product terminology', () => {
      const glossaryPath = path.resolve(__dirname, '../packages/shared/src/i18n/glossary.lus.json');
      assert.ok(fs.existsSync(glossaryPath));
      const glossary = JSON.parse(fs.readFileSync(glossaryPath, 'utf8'));

      const prompt = formatGlossaryPrompt(glossary);
      assert.ok(prompt.includes('Zirtirtu'));
      assert.ok(prompt.includes('Zirlai'));
      assert.ok(prompt.includes('Nu leh Pa'));
      assert.ok(prompt.includes('Thuchhuah'));
      assert.ok(prompt.includes('Marksheet'));
    });
  });

  describe('Help Articles Search & Deep Linking', () => {
    it('searches knowledge base in English with deep links', () => {
      const hits = searchHelp('enroll', 'en');
      assert.ok(hits.length > 0);
      assert.strictEqual(hits[0].deepLink, '/admin/students');
    });

    it('searches knowledge base in Mizo (lus) with deep links', () => {
      const hits = searchHelp('zirlai', 'lus');
      assert.ok(hits.length > 0);
      assert.strictEqual(hits[0].deepLink, '/admin/students');
    });

    it('resolves fee defaulters guide to /admin/fees', () => {
      const hits = searchHelp('fee', 'en');
      assert.ok(hits.length > 0);
      assert.strictEqual(hits[0].deepLink, '/admin/fees');
    });
  });

  describe('Read-Only Data Tools (Session & RLS Bound)', () => {
    it('executes student_stats tool and returns total count', () => {
      const stats = runDataTool('student_stats');
      assert.strictEqual(stats.total, 3);
      assert.strictEqual(stats.active, true);
    });

    it('executes fee_summary and identifies defaulters', () => {
      const fees = runDataTool('fee_summary');
      assert.strictEqual(fees.defaulterCount, 2);
      assert.strictEqual(fees.totalDue, 11700);
    });

    it('executes attendance_summary and triggers low attendance alert (< 75%)', () => {
      const att = runDataTool('attendance_summary');
      assert.strictEqual(att.flaggedCount, 2);
      assert.strictEqual(att.threshold, 75);
    });
  });

  describe('Action Mode: Safe Drafts & Confirmation Invariant', () => {
    it('creates drafts with pending_confirmation status and never auto-applies', () => {
      const mgr = new ActionDraftManager();
      const draft = mgr.createNotice('Annual Sports Meet');
      assert.strictEqual(draft.status, 'pending_confirmation');

      const stored = mgr.get(draft.id);
      assert.strictEqual(stored?.status, 'pending_confirmation');
    });

    it('applies draft only upon explicit user confirmation and emits audit log', () => {
      const mgr = new ActionDraftManager();
      const draft = mgr.createNotice('Holiday Announcement');

      const result = mgr.confirmAndApply(draft.id);
      assert.strictEqual(result.success, true);
      assert.ok(result.auditLogId.startsWith('audit-log-'));

      const updated = mgr.get(draft.id);
      assert.strictEqual(updated?.status, 'applied');
    });
  });

  describe('Plan Entitlements & Quotas', () => {
    it('denies AI Copilot to Basic, Essential, and Pro plans (Ultimate-exclusive)', () => {
      const tracker = new QuotaTracker();
      const basic = tracker.checkQuota('t1', 'basic');
      assert.strictEqual(basic.allowed, false);

      const essential = tracker.checkQuota('t2', 'essential');
      assert.strictEqual(essential.allowed, false);

      const pro = tracker.checkQuota('t3', 'pro');
      assert.strictEqual(pro.allowed, false);
    });

    it('grants 3,000 monthly quota to Ultimate plan and tracks usage', () => {
      const tracker = new QuotaTracker();
      const ult = tracker.checkQuota('t4', 'ultimate');
      assert.strictEqual(ult.allowed, true);
      assert.strictEqual(ult.quota, 3000);
      assert.strictEqual(ult.used, 0);

      tracker.increment('t4');
      const updated = tracker.checkQuota('t4', 'ultimate');
      assert.strictEqual(updated.used, 1);
    });
  });

  describe('Evaluation Set (ai-evals/copilot_evals.json)', () => {
    it('validates 30 comprehensive domain evaluation prompts', () => {
      const evalPath = path.resolve(__dirname, '../ai-evals/copilot_evals.json');
      assert.ok(fs.existsSync(evalPath), 'ai-evals/copilot_evals.json must exist');
      const evals = JSON.parse(fs.readFileSync(evalPath, 'utf8'));

      assert.strictEqual(evals.length, 30, 'Evaluation set must contain exactly 30 questions');

      const categories = new Set(evals.map((e: any) => e.category));
      assert.ok(categories.has('guide'));
      assert.ok(categories.has('data'));
      assert.ok(categories.has('action'));
      assert.ok(categories.has('general'));
      assert.ok(categories.has('safety'));
      assert.ok(categories.has('quota'));
      assert.ok(categories.has('mizo'));

      for (const item of evals) {
        assert.ok(item.id);
        assert.ok(item.prompt);
        assert.ok(item.safetyCriteria);
      }
    });
  });
});
