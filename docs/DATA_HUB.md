# Data Hub & Excel Import/Export Center (Phase 2 Milestone 2)

## 1. Overview
The **Institutional Data Hub** serves as the central single source of truth for the entire SaaS platform. All modules—including Student Profiles, Guardians, Staff & Faculty Roster, Curriculum Subjects, Fee Invoices, ID Cards, Exam Marksheets, and Public Website Faculty Pages—read and write from this unified foundation.

Data can be managed through interactive web forms or ingested in bulk through the **Excel Import & Export Center**.

---

## 2. Master Data Entities & Schemas

| Entity | Unique Identifier | Core Fields | Cross-Module Consumer |
|---|---|---|---|
| **Students** | `admission_no` | Name, gender, DOB, class, section, roll no, residence type, blood group, guardian | Fee invoicing, ID cards, marksheets, attendance |
| **Staff & Teachers** | `employee_id` | Name, designation, department, qualification, experience, subjects, class teacher | Public faculty page, marks moderation, staff ID cards |
| **Guardians** | `phone` | Name, relationship, phone (login key), occupation, address | Parent portal authentication, SMS/WhatsApp alerts |
| **Subjects** | `code` | Code, title, applicable class, max marks, pass marks, elective | Exam marks entry, timetable, report cards |
| **Opening Balances** | `admission_no` | Admission number, previous academic session, outstanding fee balance (₹) | Student fee ledger, overdue reminders |

---

## 3. Excel Processing Engine (`apps/web/src/features/data-hub/lib/excel-engine.ts`)

- **Bilingual Template Generation:** Generates multi-sheet `.xlsx` workbooks on the fly:
  - *Sheet 1 (`Data_Entry`):* Pre-populated column headers in English or Mizo (`lus`) with 1 realistic sample row.
  - *Sheet 2 (`Instructions_and_Rules`):* Column definitions, required vs optional flags, data types, and allowed dropdown lists.
- **Client-Side Streaming Parser:** Reads `.xlsx` and `.csv` files using SheetJS. Respects Cloudflare Workers memory thresholds and handles 20,000+ rows smoothly in browser memory.
- **Fuzzy & Bilingual Column Auto-Detection:** Automatically matches uploaded spreadsheet headers against schema keys and English/Mizo display labels, allowing manual overrides and preset persistence.
- **Dry-Run Validation & Visual Diff Engine:**
  - Evaluates row-level validity prior to database commit.
  - Detects duplicate keys within the uploaded file itself.
  - In `upsert` mode, compares existing records to compute field-level visual diffs (`old value` → `new value`).
  - Categorizes rows into: `New (Create)`, `Existing (Update)`, `Unchanged (Skip)`, and `Error / Blocked`.

---

## 4. Safety & Rollback Lifecycle

Every import batch creates an immutable record in `public.import_batches` with:
- Unique batch sequence (e.g. `IMP-2026-0041`).
- Execution counts: Total rows, Created count, Updated count, Error count.
- Status transitions: `pending` → `validating` → `dry_run_success` → `completed` → `rolled_back`.
- **One-Click Reversible Undo:** If an operator uploads bad data, clicking **Rollback** purges all newly created records and restores modified records to their pre-import snapshot state.
- **Error CSV Export:** Generates downloadable error reports detailing row numbers, invalid fields, and corrective actions.

---

## 5. Staff & Faculty Module with Website Sync

- **Location:** `/admin/staff`
- **Zero Double-Entry Sync:** Toggling `show_on_website` on any staff profile automatically synchronizes their record to the public institution Faculty page (`public.faculty` table via PostgreSQL trigger `sync_staff_to_faculty`).
- **Department Filtering:** Organizes teachers into Administration, Science, Mathematics, Humanities, Languages, and Sports & Fitness.
- **Excel Export:** Instant export to `.xlsx` and `.csv`.
- **Bulk Photo Import (ZIP):** Unpacks ZIP archives and matches photo filenames (e.g. `ADM-2024-0012.jpg` or `EMP-MC-001.png`) to master records with thumbnail previews.
