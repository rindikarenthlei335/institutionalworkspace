import type { ModuleManifest } from '@eduportal/shared';

export const MODULE_REGISTRY: Record<string, ModuleManifest> = {
  settings: {
    id: 'settings',
    name: { en: 'School Settings & Identity', lus: 'School Settings leh Hming' },
    description: {
      en: 'Core configuration for school branding, domains, academic years, and system rules.',
      lus: 'School hming, logo, rawng, domain, leh dan tlangpui vawn thatna bulpui.'
    },
    icon: '⚙️',
    category: 'administration',
    minPlan: 'basic',
    dependencies: [],
    permissions: ['school_super_admin'],
    routes: ['/admin/settings'],
    navEntries: [
      { label: { en: 'School Settings & Domain', lus: 'School Settings & Domain' }, path: '/admin/settings', icon: 'Settings' }
    ],
    settingsSchema: [
      { key: 'theme', label: { en: 'Theme Preset', lus: 'Theme Rawng' }, type: 'string', defaultValue: 'forest_emerald' },
      { key: 'allow_self_registration', label: { en: 'Self Registration', lus: 'Mahni in-register' }, type: 'boolean', defaultValue: false }
    ],
    guidedSetupSteps: [
      { step: 1, title: { en: 'School Details', lus: 'School Hming' }, description: { en: 'Set institution name and contact', lus: 'School hming leh biakpawhna dah rawh' } }
    ],
    helpArticles: ['settings/overview'],
    isCore: true,
    version: '1.0.0'
  },

  data_hub: {
    id: 'data_hub',
    name: { en: 'Institutional Data Hub', lus: 'Zirlai leh Zirtirtu Data Hub' },
    description: {
      en: 'Single source of truth for students, guardians, staff, and bulk Excel import/export center.',
      lus: 'Zirlai, chhungte, leh zirtirtu list vawn thatna leh Excel hmanga lakluhna hmunpui.'
    },
    icon: '🗄️',
    category: 'academics',
    minPlan: 'pro',
    dependencies: [],
    permissions: ['school_super_admin', 'school_admin'],
    routes: ['/admin/data-hub'],
    navEntries: [
      { label: { en: 'Data Hub & Import', lus: 'Data Hub & Lakluh' }, path: '/admin/data-hub', icon: 'Database', badge: 'PRO', proOnly: true }
    ],
    settingsSchema: [
      { key: 'sync_with_website', label: { en: 'Sync with Website', lus: 'Website-ah sync nghal rawh' }, type: 'boolean', defaultValue: true },
      { key: 'auto_clean_whitespace', label: { en: 'Auto Clean Whitespace', lus: 'Hmun awl thianfai rawh' }, type: 'boolean', defaultValue: true }
    ],
    guidedSetupSteps: [
      { step: 1, title: { en: 'Master Schema Setup', lus: 'Master Schema Ruahman' }, description: { en: 'Verify required fields for your institution', lus: 'School mamawh data fields endik rawh' } }
    ],
    helpArticles: ['data_hub/excel_import', 'data_hub/schema_guide'],
    isCore: true,
    version: '1.0.0'
  },

  cms: {
    id: 'cms',
    name: { en: 'Website Content Management (CMS)', lus: 'Website Enkawlna (CMS)' },
    description: {
      en: 'Manage school website homepage slides, about page, facilities, achievements, notices, and gallery.',
      lus: 'School public website a thlalak, chanchin, thil thleng, leh hriattirna enkawlna.'
    },
    icon: '🌐',
    category: 'communication',
    minPlan: 'basic',
    dependencies: [],
    permissions: ['school_super_admin', 'school_admin', 'data_entry_operator'],
    routes: ['/admin/content'],
    navEntries: [
      { label: { en: 'Website CMS', lus: 'Website CMS' }, path: '/admin/content', icon: 'Globe' }
    ],
    settingsSchema: [
      { key: 'enable_gallery', label: { en: 'Enable Photo Gallery', lus: 'Thlalak gallery dah tel rawh' }, type: 'boolean', defaultValue: true },
      { key: 'enable_notices', label: { en: 'Enable Public Notices', lus: 'Hriattirna chhuah theih rawh se' }, type: 'boolean', defaultValue: true }
    ],
    guidedSetupSteps: [
      { step: 1, title: { en: 'Upload Banner', lus: 'Banner Thlalak Dah' }, description: { en: 'Upload school front photo', lus: 'School kawtlai thlalak dah rawh' } }
    ],
    helpArticles: ['cms/website_editor'],
    isCore: false,
    version: '1.0.0'
  },

  students: {
    id: 'students',
    name: { en: 'Students & Guardians Module', lus: 'Zirlai leh Nu & Pa Enkawlna' },
    description: {
      en: 'Student enrollment roster, classes, sections, guardian directories, and portal accounts.',
      lus: 'Zirlai zawng zawng list, section, an nu leh pa biakpawhna, leh portal luhna.'
    },
    icon: '🎓',
    category: 'academics',
    minPlan: 'essential',
    dependencies: [],
    permissions: ['school_super_admin', 'school_admin', 'data_entry_operator', 'teacher'],
    routes: ['/admin/students'],
    navEntries: [
      { label: { en: 'Students & Guardians', lus: 'Zirlai & Nu leh Pa' }, path: '/admin/students', icon: 'Users' }
    ],
    settingsSchema: [
      { key: 'require_guardian_phone', label: { en: 'Require Guardian Phone', lus: 'Nu/Pa phone number ngai ngei se' }, type: 'boolean', defaultValue: true }
    ],
    guidedSetupSteps: [
      { step: 1, title: { en: 'Define Classes', lus: 'Pawl Hrang Siap' }, description: { en: 'Create academic standards and sections', lus: 'Pawl leh section hrang siam rawh' } }
    ],
    helpArticles: ['students/enrollment'],
    isCore: false,
    version: '1.0.0'
  },

  staff: {
    id: 'staff',
    name: { en: 'Staff & Faculty Management', lus: 'Zirtirtu leh Staff Enkawlna' },
    description: {
      en: 'Teacher profiles, designations, qualification records, subjects taught, and website faculty sync.',
      lus: 'Zirtirtute chanchin, thiamna, zirtir subject, leh website-a an thlalak tihlan zung zung theihna.'
    },
    icon: '👨‍🏫',
    category: 'administration',
    minPlan: 'pro',
    dependencies: ['data_hub'],
    permissions: ['school_super_admin', 'school_admin'],
    routes: ['/admin/staff'],
    navEntries: [
      { label: { en: 'Staff & Teachers', lus: 'Staff & Zirtirtute' }, path: '/admin/staff', icon: 'UserCheck', badge: 'PRO', proOnly: true }
    ],
    settingsSchema: [
      { key: 'auto_generate_emp_id', label: { en: 'Auto Generate Employee ID', lus: 'Employee ID siam chawp rawh se' }, type: 'boolean', defaultValue: true },
      { key: 'emp_id_prefix', label: { en: 'ID Prefix', lus: 'Hma hruai hawrawp' }, type: 'string', defaultValue: 'EMP-MC-' }
    ],
    guidedSetupSteps: [
      { step: 1, title: { en: 'Department Setup', lus: 'Department Siam' }, description: { en: 'Configure science, arts, and administration departments', lus: 'Science, Arts, leh Office department siam rawh' } }
    ],
    helpArticles: ['staff/directory_sync'],
    isCore: false,
    version: '1.0.0'
  },

  fees: {
    id: 'fees',
    name: { en: 'Fees, Invoicing & Online Collection', lus: 'School Fee, Receipt & Chawina' },
    description: {
      en: 'Tuition fees, concession rules, automated invoice generation, Razorpay checkout, and defaulter tracking.',
      lus: 'Zirlai fee chawi tur ruahmanna, online chawina, receipt siam, leh chawi lo hriattirna.'
    },
    icon: '💳',
    category: 'finance',
    minPlan: 'essential',
    dependencies: ['students'],
    permissions: ['school_super_admin', 'school_admin', 'accountant'],
    routes: ['/admin/fees'],
    navEntries: [
      { label: { en: 'Fees & Receipts', lus: 'Fee & Receipt-te' }, path: '/admin/fees', icon: 'CreditCard' }
    ],
    settingsSchema: [
      { key: 'grace_period_days', label: { en: 'Grace Period (Days)', lus: 'Nghah hun chhung (Ni)' }, type: 'number', defaultValue: 5 },
      { key: 'late_fine_daily', label: { en: 'Daily Late Fine (₹)', lus: 'Ni tina fine zat (₹)' }, type: 'number', defaultValue: 20 }
    ],
    guidedSetupSteps: [
      { step: 1, title: { en: 'Fee Structure', lus: 'Fee Zat Ruahman' }, description: { en: 'Configure monthly or term tuition fees', lus: 'Thla tina chawi tur zat dah rawh' } }
    ],
    helpArticles: ['fees/online_collection'],
    isCore: false,
    version: '1.0.0'
  },

  exams: {
    id: 'exams',
    name: { en: 'Exams, Marksheets & Grading Center', lus: 'Exam, Marksheet & Result Enkawlna' },
    description: {
      en: 'Term exams, keyboard-friendly marks entry grid, CBSE 9-point scale grading, GPA computation, and verified A4 marksheets.',
      lus: 'Exam buatsaih, mark thun luh zung zungna, grading, GPA chhut, leh official marksheet print chhuahna.'
    },
    icon: '📜',
    category: 'academics',
    minPlan: 'pro',
    dependencies: ['data_hub', 'students'],
    permissions: ['school_super_admin', 'school_admin', 'teacher', 'data_entry_operator'],
    routes: ['/admin/exams'],
    navEntries: [
      { label: { en: 'Exams & Marksheets', lus: 'Exam & Marksheet-te' }, path: '/admin/exams', icon: 'Award', badge: 'PRO', proOnly: true }
    ],
    settingsSchema: [
      { key: 'grading_scheme', label: { en: 'Default Grading Scheme', lus: 'Grade pek dan tlangpui' }, type: 'select', defaultValue: 'cbse_9point', options: [{ label: 'CBSE 9-Point Scale', value: 'cbse_9point' }, { label: 'Percentage Scale', value: 'percentage' }] },
      { key: 'withhold_results_defaulters', label: { en: 'Withhold Results for Fee Defaulters', lus: 'Fee chawi lote result thup rawh' }, type: 'boolean', defaultValue: false }
    ],
    guidedSetupSteps: [
      { step: 1, title: { en: 'Exam Cycle', lus: 'Exam Hun Ruahman' }, description: { en: 'Configure Half-Yearly or Annual exam terms', lus: 'Term exam hunbi siam rawh' } }
    ],
    helpArticles: ['exams/marksheet_generator'],
    isCore: false,
    version: '1.0.0'
  },

  id_cards: {
    id: 'id_cards',
    name: { en: 'CR80 ID Card Generator & Print Center', lus: 'ID Card Siampa & Print-na' },
    description: {
      en: 'ISO/IEC 7810 standard dual-sided ID cards with security QR verification, missing-photo pre-audit, and 8-up A4 printing.',
      lus: 'Zirlai leh staff ID card standard, QR verification seal, leh A4 pakhata card 8 print rual theihna.'
    },
    icon: '🪪',
    category: 'administration',
    minPlan: 'pro',
    dependencies: ['data_hub'],
    permissions: ['school_super_admin', 'school_admin', 'data_entry_operator'],
    routes: ['/admin/id-cards'],
    navEntries: [
      { label: { en: 'ID Card Generator', lus: 'ID Card Siampa' }, path: '/admin/id-cards', icon: 'IdCard', badge: 'PRO', proOnly: true }
    ],
    settingsSchema: [
      { key: 'orientation', label: { en: 'Card Orientation', lus: 'Card awmdan' }, type: 'select', defaultValue: 'vertical', options: [{ label: 'Vertical (Portrait)', value: 'vertical' }, { label: 'Horizontal (Landscape)', value: 'horizontal' }] },
      { key: 'include_qr', label: { en: 'Include Verification QR', lus: 'QR code dah tel rawh' }, type: 'boolean', defaultValue: true }
    ],
    guidedSetupSteps: [
      { step: 1, title: { en: 'Template Layout', lus: 'Design Thlanna' }, description: { en: 'Choose school colors and logo placement', lus: 'School rawng leh logo remdan thlang rawh' } }
    ],
    helpArticles: ['id_cards/printing_guide'],
    isCore: false,
    version: '1.0.0'
  },

  attendance: {
    id: 'attendance',
    name: { en: 'Daily Attendance & Biometric Tracking', lus: 'Ni Tin Kal / Kal Lo Enkawlna' },
    description: {
      en: 'Student and staff daily attendance logs, monthly threshold summaries, SMS/WhatsApp low attendance alerts, and marksheet sync.',
      lus: 'Zirlai leh zirtirtute ni tina school kal enna, attendance tlemte hriattirna, leh marksheet nena thlunzawmna.'
    },
    icon: '📋',
    category: 'academics',
    minPlan: 'ultimate',
    dependencies: ['students', 'staff'],
    permissions: ['school_super_admin', 'school_admin', 'teacher'],
    routes: ['/admin/attendance'],
    navEntries: [
      { label: { en: 'Attendance Roster', lus: 'Kal / Kal Lo List' }, path: '/admin/attendance', icon: 'CalendarCheck', badge: 'ULTIMATE' }
    ],
    settingsSchema: [
      { key: 'min_attendance_percentage', label: { en: 'Minimum Attendance %', lus: 'Kal ngai zat tlem ber %' }, type: 'number', defaultValue: 75 },
      { key: 'send_daily_absent_alert', label: { en: 'Send Daily Absent SMS/Notice', lus: 'Kal lote chhungte hriattir rawh' }, type: 'boolean', defaultValue: true }
    ],
    guidedSetupSteps: [
      { step: 1, title: { en: 'Session Hours', lus: 'Hunbi Ruahman' }, description: { en: 'Set morning assembly and period schedules', lus: 'Assembly leh class tan hun dah rawh' } }
    ],
    helpArticles: ['attendance/overview'],
    isCore: false,
    version: '1.0.0'
  },

  certificates: {
    id: 'certificates',
    name: { en: 'Institutional Certificates & Transfer Deeds', lus: 'Certificate & TC Siamna' },
    description: {
      en: 'Transfer Certificates (TC), Character Certificates, and Bonafide Certificates with dynamic Data Hub merge fields and QR seal.',
      lus: 'Transfer Certificate, Character, leh Bonafide certificate siamna, Data Hub atanga lak zung zung theihna.'
    },
    icon: '🏆',
    category: 'administration',
    minPlan: 'ultimate',
    dependencies: ['data_hub', 'students'],
    permissions: ['school_super_admin', 'school_admin'],
    routes: ['/admin/certificates'],
    navEntries: [
      { label: { en: 'Certificates & TC', lus: 'Certificate & TC-te' }, path: '/admin/certificates', icon: 'FileText', badge: 'ULTIMATE' }
    ],
    settingsSchema: [
      { key: 'tc_serial_prefix', label: { en: 'TC Serial Prefix', lus: 'TC No. Hmahruai' }, type: 'string', defaultValue: 'TC-MC-2024-' },
      { key: 'require_principal_approval', label: { en: 'Require Principal E-Sign', lus: 'Principal signature ngai se' }, type: 'boolean', defaultValue: true }
    ],
    guidedSetupSteps: [
      { step: 1, title: { en: 'Certificate Numbering', lus: 'Number Pek Dan' }, description: { en: 'Configure auto-incrementing serial format', lus: 'Serial number in dawt dan tur siam rawh' } }
    ],
    helpArticles: ['certificates/tc_generator'],
    isCore: false,
    version: '1.0.0'
  }
};
