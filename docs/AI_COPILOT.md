# AI Copilot: Bilingual Administrative Intelligence (Mizo + English)

## 1. Overview
The **EduPortal AI Copilot** is a school operations assistant designed specifically for institutional leaders, administrators, and teachers in Mizoram. Available exclusively on the **Ultimate Plan**, it blends natural language reasoning with native platform controls to streamline day-to-day school workflows in both **English (`en`)** and **Mizo (`lus`)**.

---

## 2. Architecture & Modes

```
+-------------------------------------------------------------+
|             Copilot UI: Floating Dock & Full Page           |
|                (English 🇬🇧  /  Mizo 🇲🇿)                    |
+------------------------------+------------------------------+
                               |
                               v
+-------------------------------------------------------------+
|                     Copilot Orchestrator                    |
|   - Entitlement Verification (Ultimate Plan Only)           |
|   - Quota Enforcement (3,000 Messages/Month Default)        |
|   - Official Glossary Injection (glossary.lus.json)         |
+------------------------------+------------------------------+
                               |
         +---------------------+---------------------+
         |                     |                     |
         v                     v                     v
+------------------+  +------------------+  +------------------+
|    Guide Mode    |  |    Data Mode     |  |   Action Mode    |
| Help KB Search   |  | Read-Only Tools  |  | Confirm Cards    |
| Deep Link Nav    |  | Session & RLS    |  | Zero Auto-Apply  |
+------------------+  +------------------+  +------------------+
```

### 2.1 Guide Mode (`guide`)
Answers questions about system capabilities (e.g., "How do I enroll students using Excel?", "Marksheet QR code nen print chhuah dan").
- Searches the curated help articles repository (`content/help/<module>/*.md` and `help_articles` DB table).
- Automatically emits actionable **Deep Links** (e.g., `/admin/students`, `/admin/fees`, `/admin/exams`, `/admin/attendance`) allowing operators to jump straight to the relevant administrative interface with one click.

### 2.2 Data Mode (`data`)
Executes real-time, read-only inspections against the school's **Data Hub**:
- `student_stats`: Demographics, gender ratios, hosteller vs day-scholar breakdowns.
- `fee_summary`: Aggregate collections, pending arrears, and defaulter tallies.
- `list_defaulters`: Pinpoints students with overdue balances without exposing sensitive financial keys.
- `exam_results_summary`: Pass rates, batch averages, and top ranks.
- `attendance_summary`: Monthly attendance ratios and automated identification of students below the 75% threshold.
- `search_students`: Fuzzy student lookups by name or admission number.

### 2.3 Action Mode (`action`)
Generates structured drafts for school communication and administrative events:
- **School Notices**: Formats announcements with target audience definitions.
- **Official Circulars**: Assigns institutional circular codes (e.g., `CIR-2024-102`).
- **Bilingual Translations**: Converts notices accurately between English and Mizo.
- **Safety Invariant (Zero Auto-Apply)**: Copilot **never** applies write operations directly. Every draft is created with status `pending_confirmation` and rendered inside an interactive **Confirm Card**. Only when an authorized staff member clicks **"Confirm & Apply"** is the record saved to the school database with an immutable audit log ID (`audit-log-...`).

### 2.4 General Mode (`general`)
Handles educational correspondence, principal speech drafting, meeting agendas, and general administrative queries with a polite, school-appropriate tone.

---

## 3. Bilingual Parity & Official Mizo Glossary
Mizo-language interactions are grounded in the official terminology dictionary (`packages/shared/src/i18n/glossary.lus.json`):
- School terms: *Zirtirtu*, *Zirlai*, *Nu leh Pa*, *Enkawltu*, *Pawl*, *Marksheet*, *Kallam*, *Fee Ba*.
- Product terms: *Thuchhuah*, *Hriatpuina Card*, *Sikul Insaun Hriatpuina (TC)*, *Data Hub*, *No-Code Module*.

---

## 4. Quotas & Platform Governance
- **Plan Entitlement**: Strictly restricted to the **Ultimate Plan** (`plan_id = 'ultimate'`). Requests from Basic, Essential, or Pro subscriptions receive an upgrade notice.
- **Monthly Message Quota**: Default allocation of **3,000 messages/month** per tenant. Tracked in table `ai_usage` and reset on the 1st of each calendar month.
- **Usage Audit**: Every request logs timestamp, tenant ID, user ID, tokens used, mode, and model tier to ensure full administrative accountability.

---

## 5. Evaluation Benchmark (`ai-evals/copilot_evals.json`)
The Copilot system is evaluated against a 30-case domain test suite covering:
1. Guide navigation in English and Mizo.
2. Read-only Data Hub metric aggregations.
3. Action draft creation and safety invariants.
4. Minor student privacy and prevention of secret credential exposure.
5. Monthly quota limit enforcement.

All 30 test cases are validated continuously via automated test suite `tests/ai_copilot.test.ts`.

---

## 6. Provider Configuration
- **Anthropic Production**: When `ANTHROPIC_API_KEY` is configured in environment variables, requests use:
  - Fast Model: `claude-haiku-4-5-20251001` (General & Guide queries).
  - Smart Model: `claude-sonnet-5-5` (Complex circular drafting & analysis).
- **Mock Fallback**: In local development or automated testing environments, `MockProvider` generates realistic, deterministic responses in English and Mizo without incurring API costs.
