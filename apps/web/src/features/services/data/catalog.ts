import { ServiceCatalogItem } from '../types';

export const FULL_SERVICE_CATALOG: ServiceCatalogItem[] = [
  {
    id: 'domain_connect',
    slug: 'domain-connect',
    titleEn: 'Own Domain Connect',
    titleLus: 'Mahni Domain Thlunzawmna',
    category: 'domains',
    descriptionEn: 'Point your existing school domain (e.g. www.yourschool.com) through Cloudflare for SaaS with automated SSL.',
    descriptionLus: 'I sikul domain neihsa (www.yourschool.com) chu Cloudflare for SaaS hmangin awlsam takin thlunzawm rawh.',
    oneLineBenefitEn: 'Connect your existing domain for free with instant SSL certificates',
    oneLineBenefitLus: 'I domain neihsa awlsam takin a thlawna thlunzawm theih e',
    detailsMarkdownEn: `### What is Delivered
- Cloudflare for SaaS custom hostname binding
- Automated Let's Encrypt / Google Trust Services SSL certificate provisioning
- Zero downtime switchover instructions with CNAME verification
- Global CDN caching with DDoS protection

### What the School Must Do
- Add two CNAME DNS records at your current domain registrar (GoDaddy, Namecheap, Google Domains, etc.)
- Confirm DNS propagation within 24 hours`,
    detailsMarkdownLus: `### Thil Tih Tur Te
- Cloudflare SaaS hostname binding siamsak
- SSL Certificate a thlawna pek
- CNAME record hmanga thlunzawm

### Sikul Lam Atanga Mamawh
- I domain dahna hmunah CNAME record pahnih dah luh`,
    deliverables: [
      'Cloudflare for SaaS custom hostname binding',
      'Automated SSL TLS v1.3 encryption',
      'DDoS mitigation and CDN caching',
      'DNS diagnostic verification report'
    ],
    requiredDocuments: [],
    etaMinDays: 0,
    etaMaxDays: 1,
    etaNote: 'Instant upon correct DNS record addition',
    isRecurring: false,
    pricing: {
      basic: { priceType: 'free', amountINR: 0, labelBadge: 'Free for All' },
      essential: { priceType: 'free', amountINR: 0, labelBadge: 'Free for All' },
      pro: { priceType: 'free', amountINR: 0, labelBadge: 'Free for All' },
      ultimate: { priceType: 'free', amountINR: 0, labelBadge: 'Free for All' }
    },
    cancelRefundRule: 'No cancellation fee applicable.',
    displayOrder: 1
  },
  {
    id: 'domain_register_standard',
    slug: 'domain-register-standard',
    titleEn: 'Domain Registration (.in / .com / .org)',
    titleLus: 'Domain Tharlam Zawnna (.in / .com / .org)',
    category: 'domains',
    descriptionEn: 'Professional registrar search, purchase, DNS configuration, and ownership verification for .in, .com, or .org domains.',
    descriptionLus: 'I sikul pualin .in, .com, a nih loh pawhin .org domain kan zawn sak ang che a, kan buaipui vek ang.',
    oneLineBenefitEn: 'Official high-credibility web address registered and managed for your school',
    oneLineBenefitLus: 'I sikul hming dik tak pu domain tharlam rang takin kan siamsak ang che',
    detailsMarkdownEn: `### What is Delivered
- 1-Year registration of official .in, .com, or .org domain
- DNS management with automated DKIM, SPF, and DMARC for school emails
- WHOIS privacy protection where permitted by registry
- Annual auto-renewal tracking

### What the School Must Do
- Provide the desired domain name variants
- Upload Principal Photo ID for registrar identity verification`,
    deliverables: [
      '1st Year official registrar domain ownership',
      'Full DNS and nameserver setup',
      'Automated SSL certificates',
      'Renewal reminder schedule'
    ],
    requiredDocuments: [
      {
        key: 'principal_id',
        labelEn: 'Principal / Administrator Photo ID (Aadhaar / Voter ID / Passport)',
        labelLus: 'Principal / Admin Photo ID (Aadhaar / Voter ID)',
        types: ['pdf', 'jpg', 'png'],
        maxMb: 5,
        required: true
      }
    ],
    etaMinDays: 3,
    etaMaxDays: 5,
    etaNote: 'Subject to registry availability and registrar clearance',
    isRecurring: false,
    pricing: {
      basic: { priceType: 'work_fee_plus_actual', amountINR: 5000 },
      essential: { priceType: 'work_fee_plus_actual', amountINR: 5000 },
      pro: { priceType: 'work_fee_plus_actual', amountINR: 3000, discountPct: 40, labelBadge: 'Pro Discount (₹3,000)' },
      ultimate: { priceType: 'work_fee_plus_actual', amountINR: 2000, discountPct: 60, labelBadge: 'Ultimate Discount (₹2,000)' }
    },
    cancelRefundRule: 'Full refund minus gateway fee before registrar registration. Registry pass-through fee non-refundable once domain is purchased.',
    displayOrder: 2
  },
  {
    id: 'domain_register_school',
    slug: 'domain-register-school',
    titleEn: 'Specialist .school Domain Registration',
    titleLus: 'Specialist .school Domain Buaipuina',
    category: 'domains',
    descriptionEn: 'Premium official education TLD (.school) directly identifying your institution as an educational entity.',
    descriptionLus: 'Sikul pual bik .school domain hming tha tak kan zawn sak ang che.',
    oneLineBenefitEn: 'Memorable institutional identity with a dedicated .school domain extension',
    oneLineBenefitLus: 'Sikul pual bik liau liau .school domain changtlung tak',
    deliverables: [
      '1st Year .school premium TLD registration',
      'DNS records with SSL provisioning',
      'Email routing setup'
    ],
    requiredDocuments: [
      {
        key: 'school_letterhead_req',
        labelEn: 'School Request Letter on Official Letterhead',
        labelLus: 'Sikul Letterhead-a Ngenna Lehkha',
        types: ['pdf', 'docx'],
        maxMb: 5,
        required: true,
        hasTemplate: true
      }
    ],
    etaMinDays: 3,
    etaMaxDays: 5,
    etaNote: 'Immediate upon registry clearance',
    isRecurring: false,
    pricing: {
      basic: { priceType: 'work_fee_plus_actual', amountINR: 5000 },
      essential: { priceType: 'work_fee_plus_actual', amountINR: 5000 },
      pro: { priceType: 'work_fee_plus_actual', amountINR: 3000, labelBadge: 'Pro Discount (₹3,000)' },
      ultimate: { priceType: 'work_fee_plus_actual', amountINR: 2000, labelBadge: 'Ultimate Discount (₹2,000)' }
    },
    cancelRefundRule: 'Full refund before registrar submission. Pass-through cost non-refundable once allocated.',
    displayOrder: 3
  },
  {
    id: 'domain_register_edu_in',
    slug: 'domain-register-edu-in',
    titleEn: 'Official .edu.in / .ac.in Government Registration',
    titleLus: 'Sawrkar Hriatpui .edu.in / .ac.in Domain Buaipuina',
    category: 'domains',
    descriptionEn: 'Accredited educational domain registration governed by ERNET India / Ministry of Electronics & IT. We prepare, submit, and verify all institutional credentials.',
    descriptionLus: 'ERNET India hnuaia sikul domain official (.edu.in/.ac.in) lakna lehkha pawimawh zawng zawng kan buaipui sak ang che.',
    oneLineBenefitEn: 'Official recognized government institutional domain giving maximum trust',
    oneLineBenefitLus: 'Sawrkar hriatpui institution domain rintlak ber',
    detailsMarkdownEn: `### High-Trust Government Domain
ERNET India requires rigorous documentary proof of school affiliation and legal existence. EduPortal prepares all necessary declaration dossiers.

### Required Documents Checklist
1. School Recognition / Affiliation Certificate (State Board / CBSE / ICSE)
2. Authorisation Letter on School Letterhead (Use our pre-filled Word template)
3. Institution Campus Address Proof (Electricity bill / Land ownership / Lease)
4. Government Gazette / Board Affiliation Copy`,
    deliverables: [
      'ERNET India institutional portal filing',
      'Affiliation & document vetting',
      'Official .edu.in or .ac.in assignment',
      'DNS records and automated renewal scheduling'
    ],
    requiredDocuments: [
      {
        key: 'recognition_certificate',
        labelEn: 'School Recognition / Affiliation Certificate',
        labelLus: 'Sikul Hriatpuina Certificate',
        types: ['pdf', 'jpg', 'png'],
        maxMb: 10,
        required: true
      },
      {
        key: 'authorisation_letter',
        labelEn: 'Authorisation Letter on Official School Letterhead',
        labelLus: 'Sikul Letterhead-a Nemnghehna Lehkha',
        types: ['pdf', 'docx'],
        maxMb: 5,
        required: true,
        hasTemplate: true
      },
      {
        key: 'address_proof',
        labelEn: 'Institution Campus Address Proof (Electricity Bill / Lease)',
        labelLus: 'Campus Hmunhmang Nemnghehna',
        types: ['pdf', 'jpg'],
        maxMb: 5,
        required: true
      }
    ],
    etaMinDays: 7,
    etaMaxDays: 15,
    etaNote: 'Depends on ERNET India verification processing turnaround',
    isRecurring: false,
    pricing: {
      basic: { priceType: 'work_fee_plus_actual', amountINR: 5000 },
      essential: { priceType: 'work_fee_plus_actual', amountINR: 5000 },
      pro: { priceType: 'work_fee_plus_actual', amountINR: 3000, labelBadge: 'Pro Discount (₹3,000)' },
      ultimate: { priceType: 'work_fee_plus_actual', amountINR: 2000, labelBadge: 'Ultimate Discount (₹2,000)' }
    },
    cancelRefundRule: 'If ERNET India rejects due to eligibility criteria, refund the work fee minus ₹500 document processing fee.',
    displayOrder: 4
  },
  {
    id: 'domain_renewal',
    slug: 'domain-renewal',
    titleEn: 'Domain Annual Renewal Service',
    titleLus: 'Domain Kumtin Tharthawhna',
    category: 'domains',
    descriptionEn: 'Continuous domain protection preventing expiration, registry redemption, or hijacking with automated renewal reminders.',
    descriptionLus: 'I domain a thih loh nan kum tin tharthawhna le venhimna.',
    oneLineBenefitEn: 'Never lose your school web address with automated renewal protection',
    oneLineBenefitLus: 'I sikul website domain a boral loh nan tharthawh ziah a ni',
    deliverables: ['1-Year domain expiration extension', 'DNS zone health check', 'Receipt with registrar confirmation'],
    requiredDocuments: [],
    etaMinDays: 1,
    etaMaxDays: 2,
    etaNote: 'Automated reminder-driven dispatch at 60/30/15/7 days',
    isRecurring: true,
    recurringInterval: 'yearly',
    pricing: {
      basic: { priceType: 'fixed', amountINR: 400 },
      essential: { priceType: 'fixed', amountINR: 400 },
      pro: { priceType: 'fixed', amountINR: 400 },
      ultimate: { priceType: 'fixed', amountINR: 400 }
    },
    cancelRefundRule: 'Non-refundable once registry renewal is processed.',
    displayOrder: 5
  },
  {
    id: 'google_submit',
    slug: 'google-submit',
    titleEn: 'Google Search Console & Sitemap Indexation',
    titleLus: 'Google Search Console & Sitemap Buaipuina',
    category: 'google_seo',
    descriptionEn: 'Manual verification with Google Search Console, sitemap.xml submission, and priority crawl requests for all pages.',
    descriptionLus: 'Google-ah i sikul website awlsam taka an hmuh theih nan Search Console kan buaipui sak ang che.',
    oneLineBenefitEn: 'Get your school website indexed and discoverable on Google searches',
    oneLineBenefitLus: 'Google zawnnaah i sikul a lan hmasak theih nan buaipui a ni',
    deliverables: [
      'Google Search Console DNS ownership TXT verification',
      'XML sitemap submission and automated weekly ping',
      'Robots.txt configuration for search crawlers',
      'Indexation status verification report'
    ],
    requiredDocuments: [],
    etaMinDays: 3,
    etaMaxDays: 14,
    etaNote: 'Google indexation timelines vary by search algorithm update cycle',
    isRecurring: false,
    pricing: {
      basic: { priceType: 'fixed', amountINR: 1000 },
      essential: { priceType: 'fixed', amountINR: 1000 },
      pro: { priceType: 'free', amountINR: 0, labelBadge: 'Free with Pro' },
      ultimate: { priceType: 'free', amountINR: 0, labelBadge: 'Free with Ultimate' }
    },
    cancelRefundRule: 'Full refund before Google Search Console setup begins.',
    displayOrder: 6
  },
  {
    id: 'maps_register',
    slug: 'maps-register',
    titleEn: 'Google Maps Location Register & Claim',
    titleLus: 'Google Maps Hmunhma Zawnchhuahna & Dah luh',
    category: 'google_seo',
    descriptionEn: 'Establish your official Google Business Profile on Google Maps with campus photos, verified coordinates, and phone contacts.',
    descriptionLus: 'Google Maps-ah i sikul campus hmun dik tak dah a, hriat awlsam tura buaipui.',
    oneLineBenefitEn: 'Pinpoint campus location on Google Maps for parents and visitors',
    oneLineBenefitLus: 'Nu leh pa ten awlsam taka sikul hmun an hmuh theih nan Google Maps-ah dah a ni',
    deliverables: [
      'Google Business Profile claiming & category designation',
      'Campus geolocation pin placement',
      'Upload of 5+ campus photos & operating hours',
      'Postcard or video verification support'
    ],
    requiredDocuments: [
      {
        key: 'campus_photos',
        labelEn: 'Campus Front Gate & Building Photos (Min 2 photos)',
        labelLus: 'Sikul Gate leh Building Thlalak (A tlem berah 2)',
        types: ['jpg', 'png'],
        maxMb: 10,
        required: true
      }
    ],
    etaMinDays: 5,
    etaMaxDays: 14,
    etaNote: 'Subject to Google postcard or phone verification turnaround',
    isRecurring: false,
    pricing: {
      basic: { priceType: 'fixed', amountINR: 500 },
      essential: { priceType: 'fixed', amountINR: 500 },
      pro: { priceType: 'free', amountINR: 0, labelBadge: 'Free with Pro' },
      ultimate: { priceType: 'free', amountINR: 0, labelBadge: 'Free with Ultimate' }
    },
    cancelRefundRule: 'Full refund prior to Google profile dispatch.',
    displayOrder: 7
  },
  {
    id: 'seo_bundle',
    slug: 'seo-bundle',
    titleEn: 'Google Presence & Local SEO Bundle',
    titleLus: 'Google Presence & Local SEO Bundle',
    category: 'google_seo',
    descriptionEn: 'Combined Search Console indexation, Google Maps verified pin, OpenGraph social cards, and Schema.org metadata.',
    descriptionLus: 'Search Console leh Google Maps buaipui kawpna package tha ber.',
    oneLineBenefitEn: 'All-in-one search engine presence and local school map verification',
    oneLineBenefitLus: 'Google-ah kimchang takin i sikul hriat theihin a awm nghal vek',
    deliverables: [
      'All Google Search Console deliverables',
      'All Google Maps deliverables',
      'Schema.org EducationalOrganization JSON-LD tags',
      'Social media preview image (OpenGraph) card audit'
    ],
    requiredDocuments: [
      {
        key: 'campus_photos',
        labelEn: 'Campus Front Gate & Building Photos',
        labelLus: 'Sikul Gate leh Building Thlalak',
        types: ['jpg', 'png'],
        maxMb: 10,
        required: true
      }
    ],
    etaMinDays: 5,
    etaMaxDays: 14,
    etaNote: 'Complete delivery of Search Console + Maps deliverables',
    isRecurring: false,
    pricing: {
      basic: { priceType: 'fixed', amountINR: 1200 },
      essential: { priceType: 'fixed', amountINR: 1200 },
      pro: { priceType: 'free', amountINR: 0, labelBadge: 'Free with Pro' },
      ultimate: { priceType: 'free', amountINR: 0, labelBadge: 'Free with Ultimate' }
    },
    cancelRefundRule: 'Full refund prior to Google profile dispatch.',
    displayOrder: 8
  },
  {
    id: 'android_app',
    slug: 'android-app',
    titleEn: 'Android App Publish to Google Play Store',
    titleLus: 'Android App Google Play Store-a Dahna',
    category: 'mobile_apps',
    descriptionEn: 'Dedicated white-label Android APK & AAB app compiled with your school logo, name, and published to Google Play.',
    descriptionLus: 'I sikul hming leh logo pu Android App siam a, Google Play Store-a dah chhuahna.',
    oneLineBenefitEn: 'Parents download your school app directly from the Google Play Store',
    oneLineBenefitLus: 'Nu leh pa ten Play Store atangin i sikul app an download thei nghal ang',
    deliverables: [
      'Custom Android App Bundle (.aab) & signed production keystore',
      'Play Store store listing assets (Icon 512x512, Feature graphic 1024x500)',
      'Google Play Developer Console submission & policy audit',
      'Live listing URL handover'
    ],
    requiredDocuments: [
      {
        key: 'publisher_authorisation_letter',
        labelEn: 'Play Store Publisher Authorisation Letter',
        labelLus: 'Play Store Publisher Authorisation Lehkha',
        types: ['pdf', 'docx'],
        maxMb: 5,
        required: true,
        hasTemplate: true
      },
      {
        key: 'school_id_proof',
        labelEn: 'Principal / Administrator Photo ID Proof',
        labelLus: 'Principal ID Card / Aadhaar',
        types: ['pdf', 'jpg', 'png'],
        maxMb: 5,
        required: true
      },
      {
        key: 'app_icon_graphic',
        labelEn: 'High-Res School Crest / Logo (512x512 PNG)',
        labelLus: 'Sikul Logo Fiah Tha (512x512 PNG)',
        types: ['png'],
        maxMb: 5,
        required: true
      }
    ],
    etaMinDays: 7,
    etaMaxDays: 21,
    etaNote: 'Includes Google Play Console review and policy verification',
    isRecurring: false,
    pricing: {
      basic: { priceType: 'fixed', amountINR: 10000 },
      essential: { priceType: 'fixed', amountINR: 10000 },
      pro: { priceType: 'fixed', amountINR: 7000, discountPct: 30, labelBadge: 'Pro Discount (₹7,000)' },
      ultimate: { priceType: 'fixed', amountINR: 5000, discountPct: 50, labelBadge: 'Ultimate Discount (₹5,000)' }
    },
    cancelRefundRule: 'Full refund minus payment fee before binary build. 50% refund if rejected by Google for trademark issues.',
    displayOrder: 9
  },
  {
    id: 'ios_app',
    slug: 'ios-app',
    titleEn: 'iOS App Publish to Apple App Store',
    titleLus: 'iOS App Apple App Store-a Dahna',
    category: 'mobile_apps',
    descriptionEn: 'Native iOS build with school branding, App Store screenshots, privacy nutrition labels, and submission to Apple.',
    descriptionLus: 'Apple iPhone hman thei tur App Store-a i sikul app dahna.',
    oneLineBenefitEn: 'Official native Apple App Store presence for iPhone and iPad users',
    oneLineBenefitLus: 'iPhone hmangtute tana Apple App Store-a sikul app awm theihna',
    deliverables: [
      'Native iOS production IPA compiled with Apple certificates',
      'App Store Connect listing creation with screenshots for all screen sizes',
      'App Store Review Board submission and response management',
      'TestFlight beta invitation for school leadership'
    ],
    requiredDocuments: [
      {
        key: 'publisher_authorisation_letter',
        labelEn: 'Apple App Store Publisher Authorisation Letter',
        labelLus: 'Apple App Store Publisher Authorisation Lehkha',
        types: ['pdf', 'docx'],
        maxMb: 5,
        required: true,
        hasTemplate: true
      },
      {
        key: 'school_id_proof',
        labelEn: 'Principal / Administrator Photo ID Proof',
        labelLus: 'Principal ID Card / Aadhaar',
        types: ['pdf', 'jpg', 'png'],
        maxMb: 5,
        required: true
      },
      {
        key: 'app_icon_graphic',
        labelEn: 'High-Res School Crest / Logo (1024x1024 PNG, no alpha)',
        labelLus: 'Sikul Logo Fiah Tha (1024x1024 PNG)',
        types: ['png'],
        maxMb: 5,
        required: true
      }
    ],
    etaMinDays: 7,
    etaMaxDays: 21,
    etaNote: 'Includes Apple App Review Team inspection and resolution',
    isRecurring: false,
    pricing: {
      basic: { priceType: 'fixed', amountINR: 18000 },
      essential: { priceType: 'fixed', amountINR: 18000 },
      pro: { priceType: 'fixed', amountINR: 13000, discountPct: 27, labelBadge: 'Pro Discount (₹13,000)' },
      ultimate: { priceType: 'fixed', amountINR: 9000, discountPct: 50, labelBadge: 'Ultimate Discount (₹9,000)' }
    },
    cancelRefundRule: 'Full refund minus fee before build submission. 50% refund if Apple rejects for institutional guidelines.',
    displayOrder: 10
  },
  {
    id: 'app_maintenance',
    slug: 'app-maintenance',
    titleEn: 'Mobile App Annual Store Maintenance',
    titleLus: 'Mobile App Kumtin Enkawlna',
    category: 'mobile_apps',
    descriptionEn: 'Continuous Google Play / Apple App Store compliance, target SDK updates, bug fixes, and OTA releases.',
    descriptionLus: 'App thar apiang update ziahna leh buaipui rengna.',
    oneLineBenefitEn: 'Keep your store listings active and compliant with changing store policies',
    oneLineBenefitLus: 'Kum tin store policy thar zela app enkawl zui zelna',
    deliverables: [
      'Annual Google Play target API level compliance updates',
      'Annual iOS base SDK updates',
      'Push notification certificate renewals',
      'Over-the-Air (OTA) runtime security patches'
    ],
    requiredDocuments: [],
    etaMinDays: 1,
    etaMaxDays: 2,
    etaNote: 'Continuous background maintenance',
    isRecurring: true,
    recurringInterval: 'yearly',
    pricing: {
      basic: { priceType: 'fixed', amountINR: 4000 },
      essential: { priceType: 'fixed', amountINR: 4000 },
      pro: { priceType: 'fixed', amountINR: 3000, labelBadge: '₹3,000 / yr' },
      ultimate: { priceType: 'fixed', amountINR: 2000, labelBadge: '₹2,000 / yr' }
    },
    cancelRefundRule: 'Pro-rata refund for unused quarters if app is unlisted.',
    displayOrder: 11
  },
  {
    id: 'data_migration',
    slug: 'data-migration',
    titleEn: 'Data Migration & Excel Cleanup Service',
    titleLus: 'Data Lakluh & Excel Buaipuina',
    category: 'data_storage',
    descriptionEn: 'Our engineering team audits, reformats, and imports your historical student, guardian, staff, and fee records.',
    descriptionLus: 'I zirlai leh zirtirtu data hmasate fel taka kan lakluh sak ang che.',
    oneLineBenefitEn: 'Hassle-free migration of existing spreadsheets with zero data loss',
    oneLineBenefitLus: 'Excel hlui atanga fel fai taka data lakluh sak vekna',
    deliverables: [
      'Excel file parsing, normalization, and deduplication',
      'Parent and student account creation with autogenerated credentials',
      'Historical fee ledger reconciliation',
      'Data verification sign-off sheet'
    ],
    requiredDocuments: [
      {
        key: 'historical_spreadsheets',
        labelEn: 'School Historical Excel / CSV Spreadsheets (ZIP / XLSX)',
        labelLus: 'Sikul Excel / CSV Data Files (ZIP / XLSX)',
        types: ['xlsx', 'csv', 'zip'],
        maxMb: 25,
        required: true
      }
    ],
    etaMinDays: 2,
    etaMaxDays: 5,
    etaNote: 'Depends on volume and formatting readiness of source spreadsheets',
    isRecurring: false,
    pricing: {
      basic: { priceType: 'fixed', amountINR: 3000 },
      essential: { priceType: 'fixed', amountINR: 3000 },
      pro: { priceType: 'fixed', amountINR: 2000, labelBadge: 'Pro Discount (₹2,000)' },
      ultimate: { priceType: 'free', amountINR: 0, labelBadge: 'Free with Ultimate' }
    },
    cancelRefundRule: 'Full refund before data extraction scripts execute.',
    displayOrder: 12
  },
  {
    id: 'extra_storage_10gb',
    slug: 'extra-storage-10gb',
    titleEn: 'Extra Cloud Storage (10 GB Tier)',
    titleLus: 'Cloud Storage Belhna (10 GB)',
    category: 'data_storage',
    descriptionEn: 'Additional high-speed Cloudflare R2 private document and gallery storage for high-resolution photo archives.',
    descriptionLus: 'Lehkha pawimawh leh thlalak tam zawk dahna tur 10 GB belhna.',
    oneLineBenefitEn: 'Expand your document and high-resolution photo upload capacity',
    oneLineBenefitLus: 'Thlalak leh document tam zawk dah theihna tur storage belhna',
    deliverables: [
      '+10 GB Cloudflare R2 high-speed object storage quota',
      'Encrypted private access tokens',
      'Automated tenant quota expansion'
    ],
    requiredDocuments: [],
    etaMinDays: 0,
    etaMaxDays: 0,
    etaNote: 'Instant activation upon payment',
    isRecurring: true,
    recurringInterval: 'monthly',
    pricing: {
      basic: { priceType: 'fixed', amountINR: 200 },
      essential: { priceType: 'fixed', amountINR: 200 },
      pro: { priceType: 'fixed', amountINR: 200 },
      ultimate: { priceType: 'fixed', amountINR: 200 }
    },
    cancelRefundRule: 'Can be cancelled at any time; remains active until end of billing cycle.',
    displayOrder: 13
  },
  {
    id: 'ai_credit_pack',
    slug: 'ai-credit-pack',
    titleEn: 'AI Copilot Message Credit Pack (5,000 Messages)',
    titleLus: 'AI Copilot Message Credit Belhna',
    category: 'ai',
    descriptionEn: 'Top up your school monthly AI message quota with 5,000 extra Claude-powered queries and drafting operations.',
    descriptionLus: 'AI Copilot hman belhna tur message credit 5,000 belhna.',
    oneLineBenefitEn: 'Boost your staff administrative automation and drafting speed',
    oneLineBenefitLus: 'Hna awlsam taka thawh zung zung theih nan AI credit belhna',
    deliverables: [
      '+5,000 AI Copilot institutional query credits',
      'Mizo + English bilingual drafting capabilities',
      'No expiration on unused top-up credits'
    ],
    requiredDocuments: [],
    etaMinDays: 0,
    etaMaxDays: 0,
    etaNote: 'Instant credit allocation to tenant account',
    isRecurring: false,
    pricing: {
      basic: { priceType: 'fixed', amountINR: 1500 },
      essential: { priceType: 'fixed', amountINR: 1500 },
      pro: { priceType: 'fixed', amountINR: 1500 },
      ultimate: { priceType: 'fixed', amountINR: 1500 }
    },
    cancelRefundRule: 'Non-refundable once credits are allocated.',
    displayOrder: 14
  }
];
