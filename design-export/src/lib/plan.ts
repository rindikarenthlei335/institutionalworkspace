export type Plan = 'basic' | 'essential' | 'pro';
export type Feature =
  | 'website' | 'logo_upload' | 'theme_select' | 'admin_panel'
  | 'school_modules'          // Home, Activities, Faculty, Facilities, About, Notices
  | 'admin_roles'             // Essential
  | 'fee_payment'
  | 'fee_dayscholar_hosteller'
  | 'online_admission'
  | 'super_admin_login'
  | 'student_management'
  | 'website_analytics'       // Pro
  | 'principal_dashboard'
  | 'bank_statement_match'
  | 'google_maps_submit'
  | 'domain_discounted'
  | 'white_label_app'
  | 'ui_level2';

export const PLAN_FEATURES: Record<Plan, Feature[]> = {
  basic: [
    'website', 'logo_upload', 'theme_select', 'admin_panel', 'school_modules',
  ],
  essential: [
    'website', 'logo_upload', 'theme_select', 'admin_panel', 'school_modules',
    'admin_roles', 'fee_payment', 'fee_dayscholar_hosteller', 'online_admission',
    'super_admin_login', 'student_management',
  ],
  pro: [
    'website', 'logo_upload', 'theme_select', 'admin_panel', 'school_modules',
    'admin_roles', 'fee_payment', 'fee_dayscholar_hosteller', 'online_admission',
    'super_admin_login', 'student_management',
    'website_analytics', 'principal_dashboard', 'bank_statement_match',
    'google_maps_submit', 'domain_discounted', 'white_label_app', 'ui_level2',
  ],
};

export function planHasFeature(plan: Plan, feature: Feature): boolean {
  return PLAN_FEATURES[plan].includes(feature);
}

export const PLAN_DETAILS = {
  basic: {
    name: 'Basic',
    price: { monthly: 1499, yearly: 14990 },
    tagline: 'Core digital services',
    color: '#8A9BA0',
    features: [
      'School website with 6 modules',
      'Logo & theme customisation',
      'Admin panel',
      'Notice board & gallery',
      'Mobile-responsive website',
      'EduPortal subdomain',
    ],
    locked: ['Fee payments', 'Student management', 'Online admissions', 'Principal dashboard', 'Analytics'],
  },
  essential: {
    name: 'Essential',
    price: { monthly: 3999, yearly: 39990 },
    tagline: 'Essential school administration',
    color: '#BB9877',
    features: [
      'Everything in Basic',
      'Fee payment with UPI (Day scholar & Hosteller)',
      'Online admission with fee collection',
      'Student management (class, section, parent info)',
      'Admin roles: Super Admin + Data Entry',
      'Fee approval queue with UTR verification',
    ],
    locked: ['Principal dashboard', 'Analytics', 'Bank CSV auto-match', 'White-label app'],
  },
  pro: {
    name: 'Pro',
    price: { monthly: 8000, yearly: 79990 },
    tagline: 'Comprehensive institutional services',
    color: '#6FBF8E',
    features: [
      'Everything in Essential',
      'Principal dashboard with charts',
      'Website analytics',
      'Bank statement CSV auto-match',
      'Google Maps & Search Console submit',
      'Discounted custom domain',
      'White-label parent app discount',
      'UI Level 2 — rich motion & polish',
    ],
    locked: [],
  },
};

export type AddOn = {
  key: string;
  name: string;
  price: string;
  desc: string;
};

export const ADDONS: AddOn[] = [
  { key: 'sms_whatsapp', name: 'SMS / WhatsApp Reminders', price: '₹ 499/mo', desc: 'Automated fee due & notice alerts' },
  { key: 'attendance', name: 'Attendance Module', price: '₹ 799/mo', desc: 'Daily student attendance tracking' },
  { key: 'exam_results', name: 'Exam Results & Report Cards', price: '₹ 999/mo', desc: 'Mark entry, PDF report cards' },
  { key: 'certificates', name: 'TC / Certificate / ID Card', price: '₹ 599/mo', desc: 'One-click document generation' },
  { key: 'transport', name: 'Transport & Hostel', price: '₹ 1,299/mo', desc: 'Route management, hostel fee' },
  { key: 'extra_storage', name: 'Extra Storage (50GB)', price: '₹ 299/mo', desc: 'For photos, documents, backups' },
  { key: 'domain_email', name: 'Domain-Based Email', price: '₹ 399/mo', desc: 'yourname@school.edu.in' },
  { key: 'domain_register', name: 'Domain Registration Service', price: '₹ 1,200/yr', desc: 'We handle registration & renewal' },
];
