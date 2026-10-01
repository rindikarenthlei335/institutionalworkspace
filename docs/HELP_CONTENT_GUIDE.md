# Help Content Guide: Authoring Knowledge Base Articles

## 1. Overview
This runbook guides technical authors, school consultants, and translators on how to author and maintain help articles for the **EduPortal Help Center** and the **AI Copilot Guide Mode**.

Help articles reside in:
`content/help/<module>/<slug>.md`

---

## 2. Mandatory Bilingual Structure
Every help article MUST contain both **English (`en`)** and **Mizo (`lus`)** sections:

```markdown
# [Module Title] / [Mizo Title]

## English (en)
### How to [Perform Task]
1. Step 1 instructions...
2. Step 2 instructions...

### Deep Link
- `/admin/[module]`

---

## Mizo (lus)
### [Task in Mizo]
1. Kalphung 1...
2. Kalphung 2...
```

---

## 3. Directory Layout by Module
- `content/help/students/`: Student admission, enrollment, demographic editing, and Excel bulk imports.
- `content/help/fees/`: Fee schedules, invoice generation, offline cash receipts, and overdue defaulter follow-ups.
- `content/help/exams/`: Exam cycle configuration, marks entry grid, moderation, report cards, and QR seals.
- `content/help/staff/`: Faculty directory, teaching assignments, and website faculty synchronization.
- `content/help/id-cards/`: CR80 identity cards, missing photo audits, and A4 multi-up batch printing.
- `content/help/attendance/`: Daily student attendance, monthly reports, and low-attendance (< 75%) alerts.
- `content/help/certificates/`: Transfer Certificate (TC) and Bonafide deed generation with sequential numbering.
- `content/help/builder/`: No-code module designer, entity templates, custom fields, and schemaless records.

---

## 4. Deep Linking Invariants
Always include the exact administrative route in the `### Deep Link` block:
- Students: `/admin/students`
- Data Hub / Import: `/admin/data-hub`
- Fees & Receipts: `/admin/fees`
- Exams & Marksheets: `/admin/exams`
- Staff & Faculty: `/admin/staff`
- ID Cards: `/admin/id-cards`
- Attendance: `/admin/attendance`
- Certificates: `/admin/certificates`
- Custom Builder: `/admin/builder`
- Module Manager: `/admin/modules`
- AI Copilot: `/admin/copilot`

When AI Copilot operates in **Guide Mode**, it extracts these deep links and displays clickable quick-navigation buttons for the school administrator.

---

## 5. Synchronizing with the Database
To register new help articles in the Supabase `help_articles` table for Postgres full-text search, add corresponding SQL insert statements in `supabase/migrations/` or trigger the database sync script.
