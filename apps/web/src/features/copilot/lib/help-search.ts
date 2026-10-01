import type { HelpSearchResult } from './types';

export const HELP_KB_RECORDS: Array<{
  module: string;
  slug: string;
  titleEn: string;
  titleLus: string;
  contentEn: string;
  contentLus: string;
  deepLink: string;
}> = [
  {
    module: 'students',
    slug: 'how-to-enroll-students',
    titleEn: 'How to Enroll and Manage Students',
    titleLus: 'Zirlai Lakluh leh Enkawl Dan',
    contentEn: 'Navigate to Admin -> Students & Guardians or Data Hub -> Import. You can either register students individually using the New Admission form or import an entire batch using the Excel Import Center template (.xlsx). Required fields include Admission No, Full Name, Class, Section, and Guardian Contact.',
    contentLus: 'Admin -> Students & Guardians emaw Data Hub -> Import ah kal rawh. Zirlai mal te tein Luh Dilna Form hmangin a lakluh theih a, Excel Import Center hmangin zirlai tam tak (.xlsx) a rualin a lakluh theih bawk. Thil pawimawh zualte chu Admission No, Hming, Pawl, Section, leh Enkawltu Biakpawhna an ni.',
    deepLink: '/admin/students'
  },
  {
    module: 'fees',
    slug: 'how-to-collect-fees-and-track-defaulters',
    titleEn: 'Fee Collection and Defaulter Tracking',
    titleLus: 'Fee Khawn leh Ba En Dan',
    contentEn: 'Go to Admin -> Fees & Receipts. Here you can generate student invoices, record offline cash payments with instant receipts, and monitor outstanding dues. In the Defaulters tab, filter by class to see overdue balances and trigger automated SMS or WhatsApp payment reminders.',
    contentLus: 'Admin -> Fees & Receipts ah kal rawh. Hetah hian zirlai fee bill siam, pawisa fai lut chhinchhiah leh receipt pek chhuah, leh fee ba la awmte a en theih. Defaulters tab-ah pawl hrang hranga fee ba la awmte thliar hrangin SMS emaw WhatsApp hriattirna a thawn theih.',
    deepLink: '/admin/fees'
  },
  {
    module: 'exams',
    slug: 'how-to-enter-marks-and-generate-marksheets',
    titleEn: 'Marks Entry and Report Cards Generation',
    titleLus: 'Marks Chhutluh leh Marksheet Siam Dan',
    contentEn: 'Access Admin -> Exams & Marksheets. Select the Exam term, Class, and Subject to enter marks directly in the keyboard-optimized spreadsheet grid or upload via Excel. Once verified, click Publish to compute ranks and generate official printable A4/CR80 marksheets with verification QR codes.',
    contentLus: 'Admin -> Exams & Marksheets ah kal rawh. Exam term, Pawl, leh Subject thlang la, marks spreadsheet grid ah chhut lut rawh emaw Excel hmangin thun lut rawh. Verification zawhah Publish hmet la, rank leh result chhut chhuah niin A4/CR80 marksheet QR code nena print theih a inpeih ang.',
    deepLink: '/admin/exams'
  },
  {
    module: 'staff',
    slug: 'how-to-manage-staff-and-faculty-roster',
    titleEn: 'Managing Staff and Faculty Public Sync',
    titleLus: 'Zirtirtu leh Staff Enkawl Dan',
    contentEn: 'Go to Admin -> Staff & Teachers. Create employee profiles with designation, qualifications, and assigned classes. Enabling the "Show on Website" toggle automatically updates the public website Faculty page without double data entry.',
    contentLus: 'Admin -> Staff & Teachers ah kal rawh. Staff profile siamin hna chelh, zirna, leh pawl enkawlte dah la. "Show on Website" tih hmeh khian school website public mipuite hmuh theih turin a thun nghal vek ang.',
    deepLink: '/admin/staff'
  },
  {
    module: 'id_cards',
    slug: 'how-to-generate-id-cards',
    titleEn: 'Generating CR80 Student and Staff ID Cards',
    titleLus: 'CR80 ID Card Siama Print Dan',
    contentEn: 'Open Admin -> ID Card Generator. Choose between Students or Staff, select the class or department, and inspect the missing-photo preflight check. Print single cards or bulk 8-up A4 printable sheets with high-resolution QR verification.',
    contentLus: 'Admin -> ID Card Generator hawng rawh. Zirlai emaw Staff thlang la, class thlannaah thlalak kimlo endik hmasa rawh. Card pakhat emaw A4 sheet pakhatah card 8 zel zetin print chhuah theih a ni a, QR code hriatpuina felfai a keng tel bawk.',
    deepLink: '/admin/id-cards'
  },
  {
    module: 'attendance',
    slug: 'how-to-mark-attendance-and-send-alerts',
    titleEn: 'Daily Attendance Marking and Low-Attendance Alerts',
    titleLus: 'Ni Tin Kallam Chhinchhiah leh Hriattirna Thawn Dan',
    contentEn: 'Open Admin -> Attendance. Select class and date to mark Present, Absent, Late, or Excused with 1-click batch actions. The system automatically computes monthly percentages and flags students with attendance below 75% for parent notifications.',
    contentLus: 'Admin -> Attendance hawng rawh. Pawl leh ni thlang la, Kal, Kallo, Tlai, emaw Chawl phalna hmet zung zung rawh. System-in thla bi kallam chhutin za zela 75% tlinglo te chu nu leh pa hriattir turin a tarlang nghal thin.',
    deepLink: '/admin/attendance'
  },
  {
    module: 'certificates',
    slug: 'how-to-issue-transfer-certificates',
    titleEn: 'Issuing Transfer & Bonafide Certificates',
    titleLus: 'Transfer Certificate (TC) leh Bonafide Pekchhuah Dan',
    contentEn: 'Visit Admin -> Certificates. Select the student to automatically merge admission details, conduct record, and leaving date into official institutional formats. Issued certificates receive a tamper-proof sequential number (e.g. TC-MC-2024-001) and public QR verification.',
    contentLus: 'Admin -> Certificates ah kal rawh. Zirlai thlan rualin admission data leh nungchang record a la lut nghal ang. TC pek chhuahah serial number danglam (e.g. TC-MC-2024-001) leh QR code rintlak a inziak nghal a ni.',
    deepLink: '/admin/certificates'
  },
  {
    module: 'builder',
    slug: 'how-to-build-custom-modules',
    titleEn: 'Building Custom No-Code Modules',
    titleLus: 'No-Code Module Siam Dan',
    contentEn: 'Visit Admin -> Custom Module Builder. Create entities (such as Library, Transport, Inventory) with custom fields (text, number, date, relation). Data records are stored in schemaless JSONB with index support and instantly appear in navigation.',
    contentLus: 'Admin -> Custom Module Builder ah kal rawh. Module thar (Lehkhabu, Bus, Hmanraw Enkawlna) siamin field duhzawng dah la. System-in navigation sidebar-ah a dah nghal zung zung ang.',
    deepLink: '/admin/builder'
  }
];

export function searchHelpArticles(
  query: string,
  lang: 'en' | 'lus' = 'en',
  moduleFilter?: string
): HelpSearchResult[] {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return [];

  const results: HelpSearchResult[] = [];

  for (const item of HELP_KB_RECORDS) {
    if (moduleFilter && item.module !== moduleFilter) {
      continue;
    }

    const title = lang === 'lus' ? item.titleLus : item.titleEn;
    const content = lang === 'lus' ? item.contentLus : item.contentEn;
    const combined = `${title} ${content}`.toLowerCase();

    let score = 0;
    for (const term of terms) {
      if (title.toLowerCase().includes(term)) {
        score += 3;
      }
      if (content.toLowerCase().includes(term)) {
        score += 1;
      }
    }

    if (score > 0) {
      results.push({
        id: item.slug,
        module: item.module,
        slug: item.slug,
        title,
        content,
        deepLink: item.deepLink,
        score
      });
    }
  }

  return results.sort((a, b) => b.score - a.score);
}
