# Exams, Marks, Marksheets & ID Card Generator (P2-M3)

This document provides complete architecture, operational workflows, computation specifications, security safeguards, and verification rules for the examination assessment suite and identity card issuance system in EduPortal.

---

## 1. Architectural Overview & Single Source of Truth

The examination and credentialing modules directly connect with the **Data Hub**:
- **Subjects Master**: Scholastic and co-scholastic course definitions, maximum marks, pass thresholds, and elective flags.
- **Student Master Register**: Student demographics, admission numbers, rolls, classes, sections, photos, blood groups, and guardian contacts.
- **Staff Master Register**: Teachers assigned to subjects, invigilators, and faculty credential records.
- **Zero Double-Entry**: Marksheet generation, portal views, printable report cards, and digital ID cards read directly from Data Hub facts.

---

## 2. Database Schema & RLS

### Migrations
- `supabase/migrations/00008_exams_and_id_cards.sql`: Complete relational schema, indexes, and row-level security policies.
- `supabase/migrations/00009_exams_and_id_cards_seed.sql`: Seed data for CBSE 9-point scale, percentage scale, Class X curriculum subjects, half-yearly exam cycle, sample published marksheets, and CR80 ID card templates.

### Tables
1. `public.subjects`:
   - Course codes, titles, class mapping, scholastic vs co-scholastic classification, max marks, and pass marks.
2. `public.exam_types`:
   - Examination cycles (Unit Tests, Mid-Terms, Annuals), terms, weightage percentages, scheduling, and publication states (`draft` → `scheduled` → `ongoing` → `evaluating` → `published` → `locked`).
3. `public.grading_schemes`:
   - Configurable percentage bands, letter grades, grade points (GP 0.0 to 10.0), and performance remarks.
4. `public.class_subjects`:
   - Class-to-subject curriculum mappings and teacher assignments.
5. `public.student_marks`:
   - Normalized individual student scores per exam and subject, absent/exempt flags, moderation adjustments with audit reasons, and entered/verified by user tracking.
6. `public.marksheets`:
   - Computed aggregates: scholastic totals, percentage, GPA, class merit rank, pass status, frozen immutable JSON snapshot, and unique verification tokens.
7. `public.id_card_templates`:
   - Card layout configurations (Vertical CR80 / Horizontal CR80), brand color presets, and toggleable demographic fields.
8. `public.id_cards`:
   - Issued physical & digital identity credentials, sequential card numbers, validity terms, reprint counters, and QR verification tokens.
9. `public.id_card_reprint_logs`:
   - Security audit trail for replacement cards (lost, damaged, detail updates, promotions).

### Row-Level Security (RLS) & Minor Privacy
- **Staff & Administration**: Full read/write access for authorized school roles (`school_super_admin`, `school_admin`, `teacher`, `data_entry_operator`) bounded strictly to their `tenant_id`.
- **Parents & Students**: Restricted read-only access to published marksheets and active ID cards where `student_id` belongs to the authenticated guardian's children or the student's profile.
- **Public Verification Endpoints**: Minimal verification projection via token lookups without exposing sensitive minor demographics.

---

## 3. Computation Engine (`apps/web/src/features/exams/lib/computation.ts`)

The examination computation engine is pure, deterministic, and covered by automated test suites (`tests/exam_computation.test.ts`):

### 3.1 Grading Schemes
- **CBSE 9-Point Secondary Scale**:
  - `A1`: 91% – 100% (Grade Point 10.0, "Outstanding")
  - `A2`: 81% – 90.99% (Grade Point 9.0, "Excellent")
  - `B1`: 71% – 80.99% (Grade Point 8.0, "Very Good")
  - `B2`: 61% – 70.99% (Grade Point 7.0, "Good")
  - `C1`: 51% – 60.99% (Grade Point 6.0, "Above Average")
  - `C2`: 41% – 50.99% (Grade Point 5.0, "Average")
  - `D`: 33% – 40.99% (Grade Point 4.0, "Marginal Pass")
  - `E`: 0% – 32.99% (Grade Point 0.0, "Needs Improvement / Compartment")

### 3.2 Scholastic vs Co-Scholastic Separation
- **Scholastic Subjects**: Counted toward total marks, aggregate percentage, GPA, and class merit ranks.
- **Co-Scholastic Subjects** (Physical Education, Art, Moral Ethics): Evaluated with qualitative performance letter grades without affecting academic GPA totals.

### 3.3 Competition Ranking with Tie Handling
- Uses standard competition ranking (`1224` format):
  - Two students tied at 98% share Rank #1.
  - The next student at 95% is assigned Rank #3 (skips rank #2).
  - Only students achieving `passed` status receive official top merit ranks.

### 3.4 Pass / Fail / Compartment Rules
- Failing 1 scholastic subject flags the result as `compartment`.
- Failing 2 or more scholastic subjects or achieving an aggregate percentage below the minimum threshold (default 33%) flags the result as `failed`.

### 3.5 Moderation & Grace Marks
- Grace marks can be awarded by authorized examination controllers or the Principal.
- Every moderation entry requires a mandatory audit reason and records both the raw score and effective score.

---

## 4. Immutable Marksheet Snapshots & Cryptographic Verification

When marksheets are published, `freezeMarksheetSnapshot()` creates an immutable JSON document:
- Freezes institutional branding (school name, tagline, crest, CBSE affiliation number, contact details).
- Freezes student profile facts (full name, admission number, roll number, class, section, session attendance %).
- Freezes subject marks table, letter grades, grade points, teacher remarks, and Principal signature block.
- Generates a tamper-proof verification token (e.g. `MS-MC-2024-X-001-A1B9C8D7`).

Even if subsequent curriculum changes or student profile edits occur, previously issued official marksheets remain cryptographically identical to their issued physical state.

---

## 5. Public Verification Endpoints

### 5.1 Marksheet Verification (`/verify/marksheet/[token]`)
- Open to public camera scans without login credentials.
- Displays:
  - Official Verified Marksheet Confirmation Seal.
  - Issuing Institution Name.
  - Student Full Name.
  - Examination Cycle & Academic Session.
  - Overall Grade & Qualification Status.
- **Minor Data Protection Shield**: Withholds granular subject mark lists, home addresses, phone numbers, and demographic details to prevent profiling of minors.

### 5.2 ID Card Verification (`/verify/id/[token]`)
- Resolves ID card QR codes.
- Displays:
  - Credential Validity Status (`ACTIVE`, `EXPIRED`, `REVOKED`).
  - Cardholder Name & Role / Class.
  - Issuing Institution.
  - Expiry Date & Card Identification Token.
- **Privacy Shield**: Omits home residential address, parent phone number, and personal contact info from public scans.

---

## 6. ID Card Generator & Print Center

### 6.1 CR80 Standard Format
- Conforms to ISO/IEC 7810 ID-1 standard dimensions (85.60 mm × 53.98 mm).
- Supports Vertical layout (lanyards / badge holders) and Horizontal layout (faculty clips).
- Dual-sided card design:
  - **Front**: School crest, school name, cardholder photo, blood group badge, full name, class/designation, admission/employee ID, barcode, authorized signature.
  - **Back**: Emergency campus helplines, guardian phone, residential address, and tamper-proof verification QR code.

### 6.2 Pre-Generation Audit & Missing-Data Detector
- Automatically scans the cohort before card issuance.
- Detects students or staff lacking passport photos, blood groups, or guardian phone numbers.
- Provides direct 1-click links to upload missing photos via the Data Hub Bulk Photo ZIP tool.

### 6.3 Multi-Up A4 Print Sheet
- Formatted for standard paper and PVC print shops.
- Renders 8 cards per A4 sheet with 0.5pt corner cutting crop marks.
- Supports single card printing and bulk class printing.

### 6.4 Reprint Tracker & Security Log
- Tracks duplicate issues, card replacements, and lost badges.
- Prompts for replacement reasons: `Lost / Misplaced`, `Damaged / Broken`, `Detail Update`, `Promoted / Class Transfer`.
- Records reprint timestamps and incrementing serial counters.

---

## 7. Parent & Student Portal Integration

- **Results & Marksheets (`/portal/results`)**:
  - Examination performance cards with overall percentage, grade, and rank.
  - Interactive subject breakdown with progress bars.
  - Modal report card view with instant print and PDF download.
  - **Fee Defaulter Withholding**: Configurable school policy. If enabled and the student has overdue fee invoices, displays a polite administrative notice withholding marksheets until dues are cleared.
- **Digital Identity Card (`/portal/id-card`)**:
  - Interactive front/back flipping CR80 card.
  - Campus gate pass, examination hall entry pass, and library circulation pass.
