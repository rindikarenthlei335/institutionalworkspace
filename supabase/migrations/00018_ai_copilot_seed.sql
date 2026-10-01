-- Migration 00018: AI Copilot Knowledge Base & Help Articles Seed Data
-- Phase 2 Milestone 8

INSERT INTO help_articles (
  id, module, slug, title_en, title_lus, content_en, content_lus, deep_link, category
) VALUES
  (
    '00000000-0000-0000-0000-000000000801',
    'students',
    'how-to-enroll-students',
    'How to Enroll and Manage Students',
    'Zirlai Lakluh leh Enkawl Dan',
    'Navigate to Admin -> Students & Guardians or Data Hub -> Import. You can either register students individually using the New Admission form or import an entire batch using the Excel Import Center template (.xlsx). Required fields include Admission No, Full Name, Class, Section, and Guardian Contact.',
    'Admin -> Students & Guardians emaw Data Hub -> Import ah kal rawh. Zirlai mal te tein Luh Dilna Form hmangin a lakluh theih a, Excel Import Center hmangin zirlai tam tak (.xlsx) a rualin a lakluh theih bawk. Thil pawimawh zualte chu Admission No, Hming, Pawl, Section, leh Enkawltu Biakpawhna an ni.',
    '/admin/students',
    'guide'
  ),
  (
    '00000000-0000-0000-0000-000000000802',
    'fees',
    'how-to-collect-fees-and-track-defaulters',
    'Fee Collection and Defaulter Tracking',
    'Fee Khawn leh Ba En Dan',
    'Go to Admin -> Fees & Receipts. Here you can generate student invoices, record offline cash payments with instant receipts, and monitor outstanding dues. In the Defaulters tab, filter by class to see overdue balances and trigger automated SMS or WhatsApp payment reminders.',
    'Admin -> Fees & Receipts ah kal rawh. Hetah hian zirlai fee bill siam, pawisa fai lut chhinchhiah leh receipt pek chhuah, leh fee ba la awmte a en theih. Defaulters tab-ah pawl hrang hranga fee ba la awmte thliar hrangin SMS emaw WhatsApp hriattirna a thawn theih.',
    '/admin/fees',
    'guide'
  ),
  (
    '00000000-0000-0000-0000-000000000803',
    'exams',
    'how-to-enter-marks-and-generate-marksheets',
    'Marks Entry and Report Cards Generation',
    'Marks Chhutluh leh Marksheet Siam Dan',
    'Access Admin -> Exams & Marksheets. Select the Exam term, Class, and Subject to enter marks directly in the keyboard-optimized spreadsheet grid or upload via Excel. Once verified, click Publish to compute ranks and generate official printable A4/CR80 marksheets with verification QR codes.',
    'Admin -> Exams & Marksheets ah kal rawh. Exam term, Pawl, leh Subject thlang la, marks spreadsheet grid ah chhut lut rawh emaw Excel hmangin thun lut rawh. Verification zawhah Publish hmet la, rank leh result chhut chhuah niin A4/CR80 marksheet QR code nena print theih a inpeih ang.',
    '/admin/exams',
    'guide'
  ),
  (
    '00000000-0000-0000-0000-000000000804',
    'staff',
    'how-to-manage-staff-and-faculty-roster',
    'Managing Staff and Faculty Public Sync',
    'Zirtirtu leh Staff Enkawl Dan',
    'Go to Admin -> Staff & Teachers. Create employee profiles with designation, qualifications, and assigned classes. Enabling the "Show on Website" toggle automatically updates the public website Faculty page without double data entry.',
    'Admin -> Staff & Teachers ah kal rawh. Staff profile siamin hna chelh, zirna, leh pawl enkawlte dah la. "Show on Website" tih hmeh khian school website public mipuite hmuh theih turin a thun nghal vek ang.',
    '/admin/staff',
    'guide'
  ),
  (
    '00000000-0000-0000-0000-000000000805',
    'id_cards',
    'how-to-generate-id-cards',
    'Generating CR80 Student and Staff ID Cards',
    'CR80 ID Card Siama Print Dan',
    'Open Admin -> ID Card Generator. Choose between Students or Staff, select the class or department, and inspect the missing-photo preflight check. Print single cards or bulk 8-up A4 printable sheets with high-resolution QR verification.',
    'Admin -> ID Card Generator hawng rawh. Zirlai emaw Staff thlang la, class thlannaah thlalak kimlo endik hmasa rawh. Card pakhat emaw A4 sheet pakhatah card 8 zel zetin print chhuah theih a ni a, QR code hriatpuina felfai a keng tel bawk.',
    '/admin/id-cards',
    'guide'
  ),
  (
    '00000000-0000-0000-0000-000000000806',
    'attendance',
    'how-to-mark-attendance-and-send-alerts',
    'Daily Attendance Marking and Low-Attendance Alerts',
    'Ni Tin Kallam Chhinchhiah leh Hriattirna Thawn Dan',
    'Open Admin -> Attendance. Select class and date to mark Present, Absent, Late, or Excused with 1-click batch actions. The system automatically computes monthly percentages and flags students with attendance below 75% for parent notifications.',
    'Admin -> Attendance hawng rawh. Pawl leh ni thlang la, Kal, Kallo, Tlai, emaw Chawl phalna hmet zung zung rawh. System-in thla bi kallam chhutin za zela 75% tlinglo te chu nu leh pa hriattir turin a tarlang nghal thin.',
    '/admin/attendance',
    'guide'
  ),
  (
    '00000000-0000-0000-0000-000000000807',
    'certificates',
    'how-to-issue-transfer-certificates',
    'Issuing Transfer & Bonafide Certificates',
    'Transfer Certificate (TC) leh Bonafide Pekchhuah Dan',
    'Visit Admin -> Certificates. Select the student to automatically merge admission details, conduct record, and leaving date into official institutional formats. Issued certificates receive a tamper-proof sequential number (e.g. TC-MC-2024-001) and public QR verification.',
    'Admin -> Certificates ah kal rawh. Zirlai thlan rualin admission data leh nungchang record a la lut nghal ang. TC pek chhuahah serial number danglam (e.g. TC-MC-2024-001) leh QR code rintlak a inziak nghal a ni.',
    '/admin/certificates',
    'guide'
  ),
  (
    '00000000-0000-0000-0000-000000000808',
    'builder',
    'how-to-build-custom-modules',
    'Building Custom No-Code Modules',
    'No-Code Module Siam Dan',
    'Visit Admin -> Custom Module Builder. Create entities (such as Library, Transport, Inventory) with custom fields (text, number, date, relation). Data records are stored in schemaless JSONB with index support and instantly appear in navigation.',
    'Admin -> Custom Module Builder ah kal rawh. Module thar (Lehkhabu, Bus, Hmanraw Enkawlna) siamin field duhzawng dah la. System-in navigation sidebar-ah a dah nghal zung zung ang.',
    '/admin/builder',
    'guide'
  )
ON CONFLICT (slug) DO UPDATE SET
  title_en = EXCLUDED.title_en,
  title_lus = EXCLUDED.title_lus,
  content_en = EXCLUDED.content_en,
  content_lus = EXCLUDED.content_lus,
  deep_link = EXCLUDED.deep_link;

-- 2. Seed Initial AI Usage Record for Mount Carmel School
INSERT INTO ai_usage (
  id, tenant_id, mode, tokens_used, model, cost_cents
) VALUES
  (
    '00000000-0000-0000-0000-000000000810',
    '00000000-0000-0000-0000-000000000001',
    'guide',
    420,
    'claude-haiku-4-5-20251001',
    0.042
  ),
  (
    '00000000-0000-0000-0000-000000000811',
    '00000000-0000-0000-0000-000000000001',
    'data',
    850,
    'claude-sonnet-5-5',
    0.125
  );
