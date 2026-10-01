'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { THEME_PRESETS } from '@eduportal/shared';
import { MASTER_TEMPLATES } from '@/features/templates/data/templates';
import { SchoolTemplate, PlanTier } from '@/features/templates/types';
import {
  Check,
  CheckSquare,
  Square,
  Globe,
  Upload,
  ShieldCheck,
  Sparkles,
  Smartphone,
  MapPin,
  Search,
  CreditCard,
  ArrowRight,
  ArrowLeft,
  Copy,
  Lock,
  Unlock,
  AlertCircle,
  HelpCircle,
  Clock,
  ExternalLink,
  ChevronRight,
  LayoutDashboard,
  CheckCircle2,
  FileText
} from 'lucide-react';

export interface OnboardingOrder {
  orderId: string;
  schoolName: string;
  planTier: PlanTier;
  billingCycle: 'monthly' | 'yearly';
  domainType: 'subdomain' | 'own_domain' | 'custom_domain';
  subdomain: string;
  customDomainName: string;
  customDomainExt: string;
  educationalDocsUploaded: boolean;
  uploadDocsLater: boolean;
  uploadedDocNames: string[];
  addonGoogleSubmit: boolean;
  addonGoogleMaps: boolean;
  googleMapsLink: string;
  uploadMapsLater: boolean;
  addonPlayStore: boolean;
  themeId: string;
  templateId: string;
  payerName: string;
  payerPhone: string;
  transactionId: string;
  receiptScreenshotUrl: string;
  totalAmount: number;
  status: 'pending_approval' | 'approved';
  createdAt: string;
}

// 3 Core Active Plans (Basic 1499, Essential 3999, Pro 8000)
const ACTIVE_TIERS: PlanTier[] = ['basic', 'essential', 'pro'];

const PLANS_CONFIG: Record<
  PlanTier,
  {
    name: string;
    monthlyPrice: number;
    yearlyPrice: number;
    tagline: string;
    badge?: string;
    modules: string[];
  }
> = {
  basic: {
    name: 'BASIC',
    monthlyPrice: 1499,
    yearlyPrice: 14990,
    tagline: 'Simple school website with 6 core modules & admin data/image upload',
    modules: [
      'School Logo Upload & Identity Branding',
      'Theme Customizer (Changeable anytime in admin)',
      'Admin Panel (Data & Image upload)',
      'Module 6 (Home, Activities, Faculty, Facilities, About, Notice)',
      'Home Screen: Achievements & Auto-sliding photo gallery',
      'Faculty Directory: Interactive biodata & teacher gallery',
      'Digital Notice Board: Circulars, exam routine & urgent alerts',
      'Free Institutional Subdomain (*.eduportal.in)',
      'Free Own Domain Connect (CNAME & SSL)',
      'UI Level: Basic Clean Website'
    ]
  },
  essential: {
    name: 'ESSENTIAL',
    monthlyPrice: 3999,
    yearlyPrice: 39990,
    tagline: 'Website + Mobile App with Online Admissions & Fee payment desk',
    badge: 'Popular for High Schools',
    modules: [
      'Website + Mobile App (Shared EduPortal App & PWA)',
      'All Basic Modules (Logo, Theme, Module 6, Admin Panel)',
      'Admin Login & Role-based authentication',
      'Student Management (Class, section, roll no, parent info)',
      'Fee Payment Desk (Day Scholar / Hosteller fee structure)',
      'Online Admission Desk & Instant Fee Receipts',
      'Super Admin + Data Entry Operator Logins',
      'UI Level: Level 1 (Modern High School Design)'
    ]
  },
  pro: {
    name: 'PRO',
    monthlyPrice: 8000,
    yearlyPrice: 79990,
    tagline: 'Website + App + Full Institutional Analytics & Principal Cockpit',
    badge: 'Executive Suite',
    modules: [
      'Website + Mobile App + Full Institutional Analytics',
      'All Essential Modules + Complete Academic Management',
      'Principal Executive Dashboard (Student stats, Fee collection: thla/kum/due)',
      'Live Website Visitor Analytics Desk',
      'Google Search Console & Sitemap Submit — FREE (Included)',
      'Google Maps Location Pin & Claim — FREE (Included)',
      'Domain Register Service — Discounted at ₹3,000 (instead of ₹5,000)',
      'Accountant, Teacher & Student Management Desks',
      'UI Level: Level 2 (Collegiate / Executive Design)'
    ]
  },
  pro_plus: {
    name: 'PRO+ / ULTIMATE',
    monthlyPrice: 9999,
    yearlyPrice: 99990,
    tagline: 'Full-scale institutional automation with attendance & certificates',
    badge: 'All-Inclusive Enterprise',
    modules: []
  }
};

const DOMAIN_OPTIONS = [
  {
    ext: '.edu.in',
    name: 'Official Indian Educational Domain',
    badge: 'Recognized Institutions Only',
    rules: 'Requires registration certificate of educational trust/society & board affiliation.',
    requiresDocs: true
  },
  {
    ext: '.ac.in',
    name: 'Academic College / University Domain',
    badge: 'Colleges & Universities',
    rules: 'Requires government/university affiliation and registration proof.',
    requiresDocs: true
  },
  {
    ext: '.com',
    name: 'Global Commercial Domain',
    badge: 'Instant Setup',
    rules: 'No documents needed. Worldwide recognized activation.',
    requiresDocs: false
  },
  {
    ext: '.in',
    name: 'National Indian Domain',
    badge: 'National Registry',
    rules: 'No documents needed. Ideal for schools and academies across India.',
    requiresDocs: false
  },
  {
    ext: '.org.in',
    name: 'Non-Profit Educational Society Domain',
    badge: 'Trusts & Societies',
    rules: 'Suitable for educational trusts, societies, and NGOs.',
    requiresDocs: false
  }
];

export function InstitutionalOnboardingFlow() {
  const router = useRouter();

  // Wizard Step (1: Plan, 2: Domain, 3: Addons, 4: Theme/Template, 5: Payment, 6: Status)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State
  const [selectedPlan, setSelectedPlan] = useState<PlanTier>('basic');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [schoolName, setSchoolName] = useState<string>('Mount Carmel School');
  
  // Domain Setup: 'subdomain' (Free) | 'own_domain' (Free) | 'custom_domain' (Register Service: ₹5000 / Pro: ₹3000)
  const [domainType, setDomainType] = useState<'subdomain' | 'own_domain' | 'custom_domain'>('subdomain');
  const [subdomain, setSubdomain] = useState<string>('mountcarmel');
  const [ownDomainName, setOwnDomainName] = useState<string>('www.mountcarmelaizawl.com');
  const [customDomainName, setCustomDomainName] = useState<string>('mountcarmelaizawl');
  const [customDomainExt, setCustomDomainExt] = useState<string>('.edu.in');
  const [uploadDocsLater, setUploadDocsLater] = useState<boolean>(true);
  const [uploadedDocs, setUploadedDocs] = useState<Record<string, string>>({});

  // Add-ons
  const [addonGoogleSubmit, setAddonGoogleSubmit] = useState<boolean>(false);
  const [addonGoogleMaps, setAddonGoogleMaps] = useState<boolean>(false);
  const [googleMapsLink, setGoogleMapsLink] = useState<string>('');
  const [uploadMapsLater, setUploadMapsLater] = useState<boolean>(true);
  const [addonPlayStore, setAddonPlayStore] = useState<boolean>(false);

  // Theme & Template
  const [selectedThemeId, setSelectedThemeId] = useState<string>('forest');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('template-1-trident');

  // Payment Form
  const [payerName, setPayerName] = useState<string>('Lalhmingliana (Principal)');
  const [payerPhone, setPayerPhone] = useState<string>('9876543210');
  const [transactionId, setTransactionId] = useState<string>('');
  const [receiptImage, setReceiptImage] = useState<string>('');
  const [copiedUpi, setCopiedUpi] = useState<boolean>(false);

  // Activation & Tour State
  const [activeOrder, setActiveOrder] = useState<OnboardingOrder | null>(null);
  const [showGuidedTour, setShowGuidedTour] = useState<boolean>(false);
  const [adminSetupModal, setAdminSetupModal] = useState<boolean>(false);
  const [adminEmail, setAdminEmail] = useState<string>('admin@school.edu.in');
  const [adminPassword, setAdminPassword] = useState<string>('');

  // Load existing order from localStorage if available
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('eduportal_active_order');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setActiveOrder(parsed);
          if (parsed.status === 'approved') {
            setCurrentStep(6);
          }
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  // Calculation of Totals according to Idea Summary
  const isPro = selectedPlan === 'pro';
  const planInfo = PLANS_CONFIG[selectedPlan];
  const planPrice = billingCycle === 'monthly' ? planInfo.monthlyPrice : planInfo.yearlyPrice;
  
  // Domain Price: Subdomain = ₹0, Own Domain Connect = ₹0, Register Service = ₹5000 (Pro: ₹3000)
  const domainServicePrice = isPro ? 3000 : 5000;
  const domainPrice = domainType === 'custom_domain' ? domainServicePrice : 0;

  // Google Services: Pro tier = Free!
  // Basic / Essential: Submit = ₹500, Maps = ₹300. Both together (Bundle) = ₹700!
  let googleServicesPrice = 0;
  if (!isPro) {
    if (addonGoogleSubmit && addonGoogleMaps) {
      googleServicesPrice = 700; // Google Presence Bundle discount
    } else if (addonGoogleSubmit) {
      googleServicesPrice = 500;
    } else if (addonGoogleMaps) {
      googleServicesPrice = 300;
    }
  }

  // Play Store White-Label Android App: ₹8000 setup fee
  const playStorePrice = addonPlayStore ? 8000 : 0;

  const totalPayable = planPrice + domainPrice + googleServicesPrice + playStorePrice;

  // Selected Domain Option (for .edu.in docs requirement)
  const selectedDomainOption = DOMAIN_OPTIONS.find(d => d.ext === customDomainExt);

  // Filter templates unlocked for this tier
  const unlockedTemplates = MASTER_TEMPLATES.filter(tmpl => {
    if (selectedPlan === 'basic') return tmpl.minTier === 'basic';
    if (selectedPlan === 'essential') return tmpl.minTier === 'basic' || tmpl.minTier === 'essential';
    if (selectedPlan === 'pro') return tmpl.minTier === 'basic' || tmpl.minTier === 'essential' || tmpl.minTier === 'pro';
    return true;
  });

  // Handle Mock File Upload for Docs
  const handleDocUpload = (docKey: string, fileName: string) => {
    setUploadedDocs(prev => ({ ...prev, [docKey]: fileName }));
  };

  // Handle Mock File Upload for Screenshot
  const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReceiptImage(URL.createObjectURL(file));
    } else {
      setReceiptImage('https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=600&auto=format&fit=crop');
    }
  };

  // Submit Order
  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionId.trim()) {
      alert('Khawngaihin 12-digit UPI Transaction ID / UTR number chhu lut rawh le.');
      return;
    }

    const newOrder: OnboardingOrder = {
      orderId: `EDU-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      schoolName,
      planTier: selectedPlan,
      billingCycle,
      domainType,
      subdomain: subdomain.toLowerCase().replace(/[^a-z0-9-]/g, ''),
      customDomainName: domainType === 'own_domain' ? ownDomainName : `${customDomainName}${customDomainExt}`,
      customDomainExt,
      educationalDocsUploaded: Object.keys(uploadedDocs).length > 0,
      uploadDocsLater,
      uploadedDocNames: Object.values(uploadedDocs),
      addonGoogleSubmit: isPro ? true : addonGoogleSubmit,
      addonGoogleMaps: isPro ? true : addonGoogleMaps,
      googleMapsLink,
      uploadMapsLater,
      addonPlayStore,
      themeId: selectedThemeId,
      templateId: selectedTemplateId,
      payerName,
      payerPhone,
      transactionId,
      receiptScreenshotUrl: receiptImage || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=600&auto=format&fit=crop',
      totalAmount: totalPayable,
      status: 'pending_approval',
      createdAt: new Date().toISOString()
    };

    setActiveOrder(newOrder);
    if (typeof window !== 'undefined') {
      localStorage.setItem('eduportal_active_order', JSON.stringify(newOrder));
      localStorage.setItem('eduportal_active_template', selectedTemplateId);
      localStorage.setItem('eduportal_active_theme', selectedThemeId);
    }
    setCurrentStep(6);
  };

  // Super Admin Instant Approval Simulation
  const handleInstantApprove = () => {
    if (!activeOrder) return;
    const approvedOrder: OnboardingOrder = {
      ...activeOrder,
      status: 'approved'
    };
    setActiveOrder(approvedOrder);
    if (typeof window !== 'undefined') {
      localStorage.setItem('eduportal_active_order', JSON.stringify(approvedOrder));
    }
    setShowGuidedTour(true);
    setAdminSetupModal(true);
  };

  const handleCopyUpi = () => {
    navigator.clipboard.writeText('eduportal@icici');
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#F8FAF9] text-slate-900 pb-24 font-sans">
      
      {/* Onboarding Header Banner (Clean, Focused Forest Green #163A2B - No external desk buttons) */}
      <div className="bg-[#163A2B] text-white border-b border-[#0F2A1F] py-9 px-4 shadow-sm text-center">
        <div className="max-w-4xl mx-auto space-y-2.5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/20 text-emerald-200 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            <span>EduPortal Institutional SaaS · Automated Provisioning</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Setup & Launch Your School Digital Workspace
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/80 max-w-2xl mx-auto font-normal">
            Select your plan tier, configure domain, choose modules & theme, and submit for instant activation.
          </p>
        </div>
      </div>

      {/* Interactive Step Navigator (Polished elevated pills) */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between overflow-x-auto scrollbar-none gap-2 text-xs">
          {[
            { num: 1, label: '1. Plan & Modules' },
            { num: 2, label: '2. Domain Setup' },
            { num: 3, label: '3. Add-on Services' },
            { num: 4, label: '4. Theme & Template' },
            { num: 5, label: '5. Payment & Verification' },
            { num: 6, label: '6. Approval & Launch' },
          ].map((s) => (
            <button
              key={s.num}
              type="button"
              onClick={() => s.num <= currentStep && setCurrentStep(s.num)}
              className={`px-4 py-2 rounded-full font-bold shrink-0 transition-all flex items-center gap-2 cursor-pointer shadow-xs ${
                currentStep === s.num
                  ? 'bg-[#163A2B] text-white shadow-md ring-2 ring-emerald-600/20'
                  : currentStep > s.num
                  ? 'bg-emerald-50 text-[#163A2B] border border-emerald-300 hover:bg-emerald-100/60'
                  : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
              }`}
            >
              <span>{s.label}</span>
              {currentStep > s.num && <Check className="w-3.5 h-3.5 text-[#163A2B] stroke-[3]" />}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pt-8">

        {/* =================================================================================== */}
        {/* STEP 1: PLAN TIER SELECTION & PRE-TICKED MODULES (3 Distinct Clean Plans) */}
        {/* =================================================================================== */}
        {currentStep === 1 && (
          <div className="space-y-8 animate-in fade-in">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs uppercase font-extrabold tracking-wider text-[#163A2B] bg-emerald-50 border border-emerald-200 px-3.5 py-1 rounded-full inline-block">
                Step 1 of 5
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Choose Institutional Plan Tier
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-normal">
                All institutional core modules are pre-enabled and pre-ticked. Select the tier that matches your school size.
              </p>

              {/* Polished Billing Cycle Segmented Control */}
              <div className="inline-flex items-center p-1.5 rounded-full bg-slate-200/80 border border-slate-300 shadow-inner mt-4">
                <button
                  type="button"
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-5 py-2 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
                    billingCycle === 'monthly'
                      ? 'bg-[#163A2B] text-white shadow-md scale-[1.02]'
                      : 'text-slate-600 hover:text-slate-900 font-bold'
                  }`}
                >
                  Monthly Billing
                </button>
                <button
                  type="button"
                  onClick={() => setBillingCycle('yearly')}
                  className={`px-5 py-2 rounded-full text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer ${
                    billingCycle === 'yearly'
                      ? 'bg-[#163A2B] text-white shadow-md scale-[1.02]'
                      : 'text-slate-600 hover:text-slate-900 font-bold'
                  }`}
                >
                  <span>Yearly (Save 17%)</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black shadow-xs">
                    2 Mo Free
                  </span>
                </button>
              </div>
            </div>

            {/* 3 Tier Cards (Basic, Essential, Pro) - Clean 3-col grid matching Idea Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
              {ACTIVE_TIERS.map((tierKey) => {
                const tier = PLANS_CONFIG[tierKey];
                const isSelected = selectedPlan === tierKey;
                const price = billingCycle === 'monthly' ? tier.monthlyPrice : tier.yearlyPrice;

                return (
                  <div
                    key={tierKey}
                    onClick={() => setSelectedPlan(tierKey)}
                    className={`rounded-3xl border-2 p-7 flex flex-col justify-between transition-all duration-200 cursor-pointer relative bg-white ${
                      isSelected
                        ? 'border-[#163A2B] ring-4 ring-emerald-600/15 shadow-2xl scale-[1.02] -translate-y-1'
                        : 'border-slate-200 hover:border-slate-300 hover:shadow-xl hover:-translate-y-0.5'
                    }`}
                  >
                    {tier.badge && (
                      <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-[11px] font-black uppercase tracking-wider px-3.5 py-1 rounded-full bg-[#163A2B] text-white shadow-md border border-emerald-400/40">
                        {tier.badge}
                      </span>
                    )}

                    <div className="space-y-5">
                      <div className="border-b border-slate-100 pb-5">
                        <span className="text-xs font-extrabold uppercase tracking-widest text-[#163A2B] bg-emerald-50 px-3 py-1 rounded-md inline-block border border-emerald-200/70">
                          {tier.name}
                        </span>
                        <div className="mt-3 flex items-baseline gap-1.5">
                          <span className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
                            ₹{price.toLocaleString('en-IN')}
                          </span>
                          <span className="text-xs font-bold text-slate-500">
                            /{billingCycle === 'monthly' ? 'mo' : 'yr'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-2 font-medium leading-relaxed">
                          {tier.tagline}
                        </p>
                      </div>

                      {/* Pre-ticked Modules List */}
                      <div className="space-y-3">
                        <span className="text-[11px] uppercase font-extrabold text-slate-700 tracking-wider block">
                          Included & Pre-Enabled Modules:
                        </span>
                        <ul className="space-y-2.5 text-xs">
                          {tier.modules.map((mod, i) => (
                            <li key={i} className="flex items-start gap-2.5">
                              <div className="w-4 h-4 rounded bg-emerald-100 text-[#163A2B] flex items-center justify-center shrink-0 mt-0.5 font-bold">
                                <Check className="w-3 h-3 stroke-[3]" />
                              </div>
                              <span className="text-slate-800 font-medium leading-snug">{mod}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Unmistakable Action Button on Every Card */}
                    <div className="pt-6 mt-6 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPlan(tierKey);
                          setCurrentStep(2);
                        }}
                        className={`w-full py-4 px-5 rounded-2xl font-extrabold text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-lg active:scale-[0.98] ${
                          isSelected
                            ? 'bg-[#163A2B] hover:bg-[#0F2A1F] text-white ring-2 ring-emerald-500/20'
                            : 'bg-emerald-50 hover:bg-[#163A2B] text-[#163A2B] hover:text-white border-2 border-[#163A2B]'
                        }`}
                      >
                        <span>{isSelected ? '✓ Continue with This Plan' : 'Select Plan & Continue'}</span>
                        <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* =================================================================================== */}
        {/* STEP 2: DOMAIN SETUP (Subdomain vs Own Domain vs Domain Register Service) */}
        {/* =================================================================================== */}
        {currentStep === 2 && (
          <div className="space-y-8 max-w-4xl mx-auto animate-in fade-in">
            <div className="text-center space-y-2">
              <span className="text-xs uppercase font-extrabold tracking-wider text-[#163A2B] bg-emerald-50 border border-emerald-200 px-3.5 py-1 rounded-full inline-block">
                Step 2 of 5
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                School Name & Domain Configuration
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-normal">
                Choose between a free institutional subdomain, connect your existing domain, or have us register an official domain for your school.
              </p>
            </div>

            {/* School Name Input */}
            <Card className="p-6 bg-white border border-slate-200 rounded-3xl shadow-sm space-y-3">
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
                Full Official School Name
              </label>
              <Input
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                placeholder="e.g. Mount Carmel Higher Secondary School"
                className="bg-white border-2 border-slate-200 text-slate-900 font-semibold text-sm rounded-xl px-4 py-3 focus:border-[#163A2B] focus:ring-2 focus:ring-[#163A2B]/10"
              />
              <span className="text-[11px] text-slate-500 block">
                This official name will be configured on your website header, report cards, ID cards, and fee receipts.
              </span>
            </Card>

            {/* 3 Domain Options matching Idea Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Option A: Subdomain (Free) */}
              <div
                onClick={() => setDomainType('subdomain')}
                className={`p-6 rounded-3xl border-2 cursor-pointer transition-all bg-white flex flex-col justify-between ${
                  domainType === 'subdomain'
                    ? 'border-[#163A2B] ring-4 ring-emerald-600/10 shadow-lg'
                    : 'border-slate-200 hover:border-slate-300 shadow-sm'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-[#163A2B] uppercase tracking-wider">Option A</span>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-[#163A2B]">
                      Free (₹0)
                    </span>
                  </div>
                  <h4 className="font-extrabold text-base text-slate-900 mt-2">Institutional Subdomain</h4>
                  <p className="text-xs text-slate-600 mt-1 font-normal leading-relaxed">
                    Default instant address for all schools. Zero setup time, free wildcard SSL included.
                  </p>
                </div>
                <div className="mt-4 text-xs font-mono font-bold text-[#163A2B] bg-slate-50 p-2.5 rounded-xl border border-slate-200 break-all">
                  https://{subdomain || 'school'}.eduportal.in
                </div>
              </div>

              {/* Option B: Own Domain Connect (Free) */}
              <div
                onClick={() => setDomainType('own_domain')}
                className={`p-6 rounded-3xl border-2 cursor-pointer transition-all bg-white flex flex-col justify-between ${
                  domainType === 'own_domain'
                    ? 'border-[#163A2B] ring-4 ring-emerald-600/10 shadow-lg'
                    : 'border-slate-200 hover:border-slate-300 shadow-sm'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-indigo-700 uppercase tracking-wider">Option B</span>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-800">
                      Free (₹0)
                    </span>
                  </div>
                  <h4 className="font-extrabold text-base text-slate-900 mt-2">Connect Own Domain</h4>
                  <p className="text-xs text-slate-600 mt-1 font-normal leading-relaxed">
                    School already owns domain. Connect via CNAME pointing with free automated Cloudflare SSL.
                  </p>
                </div>
                <div className="mt-4 text-xs font-mono font-bold text-indigo-800 bg-slate-50 p-2.5 rounded-xl border border-slate-200 break-all">
                  {ownDomainName || 'www.yourschool.com'}
                </div>
              </div>

              {/* Option C: Domain Register Service */}
              <div
                onClick={() => setDomainType('custom_domain')}
                className={`p-6 rounded-3xl border-2 cursor-pointer transition-all bg-white flex flex-col justify-between ${
                  domainType === 'custom_domain'
                    ? 'border-[#163A2B] ring-4 ring-emerald-600/10 shadow-lg'
                    : 'border-slate-200 hover:border-slate-300 shadow-sm'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-amber-800 uppercase tracking-wider">Option C</span>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-900">
                      {isPro ? '₹3,000 (Pro)' : '₹5,000'}
                    </span>
                  </div>
                  <h4 className="font-extrabold text-base text-slate-900 mt-2">Domain Register Service</h4>
                  <p className="text-xs text-slate-600 mt-1 font-normal leading-relaxed">
                    We buy & manage domain (.edu.in, .com, .in) under school name with DNS setup & 1st year registration.
                  </p>
                </div>
                <div className="mt-4 text-xs font-mono font-bold text-amber-800 bg-slate-50 p-2.5 rounded-xl border border-slate-200 break-all">
                  www.{customDomainName || 'school'}{customDomainExt}
                </div>
              </div>

            </div>

            {/* Subdomain Input Configuration */}
            {domainType === 'subdomain' && (
              <Card className="p-6 bg-white border border-slate-200 rounded-3xl shadow-sm space-y-3">
                <label className="block text-xs font-bold text-slate-900">Choose Your Subdomain Slug</label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-mono">https://</span>
                  <Input
                    value={subdomain}
                    onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    placeholder="mountcarmel"
                    className="bg-white border-2 border-slate-200 text-[#163A2B] font-mono font-bold text-sm rounded-xl px-4 py-3 focus:border-[#163A2B]"
                  />
                  <span className="text-xs text-slate-500 shrink-0 font-mono font-bold">.eduportal.in</span>
                </div>
                <span className="text-[11px] text-emerald-800 font-semibold block">
                  ✓ Wildcard DNS & Automated Cloudflare SSL Certificate active immediately.
                </span>
              </Card>
            )}

            {/* Own Domain Connect Input */}
            {domainType === 'own_domain' && (
              <Card className="p-6 bg-white border border-slate-200 rounded-3xl shadow-sm space-y-3">
                <label className="block text-xs font-bold text-slate-900">Enter Your Existing Domain</label>
                <Input
                  value={ownDomainName}
                  onChange={(e) => setOwnDomainName(e.target.value.toLowerCase())}
                  placeholder="www.mountcarmelschool.com"
                  className="bg-white border-2 border-slate-200 text-indigo-900 font-mono font-bold text-sm rounded-xl px-4 py-3 focus:border-indigo-600"
                />
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1">
                  <span className="font-bold text-slate-900 block">DNS Pointing Instructions:</span>
                  <p className="text-[11px] leading-relaxed">
                    Set a <strong>CNAME</strong> record for <code>www</code> pointing to <code>sites.eduportal.in</code> in your domain registrar (GoDaddy, Namecheap, etc.).
                  </p>
                </div>
              </Card>
            )}

            {/* Domain Registration Service Setup */}
            {domainType === 'custom_domain' && (
              <div className="space-y-6">
                <Card className="p-6 bg-white border border-slate-200 rounded-3xl shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Select Domain Extension (.edu.in, .com, .in)
                    </label>
                    <span className="text-xs font-bold text-[#163A2B]">
                      {isPro ? 'Pro Special: ₹3,000 all-inclusive' : 'All-inclusive Setup: ₹5,000'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {DOMAIN_OPTIONS.map((d) => (
                      <div
                        key={d.ext}
                        onClick={() => setCustomDomainExt(d.ext)}
                        className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                          customDomainExt === d.ext
                            ? 'bg-emerald-50/50 border-[#163A2B] ring-2 ring-[#163A2B]/10 shadow-sm'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-base text-slate-900">{d.ext}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                            {d.badge}
                          </span>
                        </div>
                        <span className="text-xs font-semibold text-slate-800 block mt-1">{d.name}</span>
                        <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{d.rules}</p>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-slate-100 space-y-2">
                    <label className="block text-xs font-bold text-slate-900">Desired Domain Name</label>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 font-mono">www.</span>
                      <Input
                        value={customDomainName}
                        onChange={(e) => setCustomDomainName(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                        placeholder="mountcarmelaizawl"
                        className="bg-white border-2 border-slate-200 text-slate-900 font-mono text-sm rounded-xl px-4 py-3 focus:border-[#163A2B]"
                      />
                      <span className="text-xs font-mono font-bold text-amber-800 shrink-0">{customDomainExt}</span>
                    </div>
                  </div>
                </Card>

                {/* 5 Required Documents for Official Educational Domain (.edu.in / .ac.in) */}
                {selectedDomainOption?.requiresDocs && (
                  <Card className="p-6 bg-amber-50/50 border-2 border-amber-200 rounded-3xl shadow-sm space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-xl bg-amber-100 text-amber-800 shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-900">
                          5 Required Verification Documents for ({customDomainExt})
                        </h4>
                        <p className="text-xs text-slate-600 mt-0.5">
                          ERNET India regulations mandate registered society/trust and institutional affiliation verification.
                        </p>
                      </div>
                    </div>

                    {/* Upload Later Checkbox */}
                    <div className="p-3.5 bg-amber-100/70 rounded-2xl border border-amber-300 flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="uploadLater"
                        checked={uploadDocsLater}
                        onChange={(e) => setUploadDocsLater(e.target.checked)}
                        className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                      />
                      <label htmlFor="uploadLater" className="text-xs text-amber-950 cursor-pointer font-bold">
                        Upload documents later after payment confirmation (Pay first, submit documents within 7 days)
                      </label>
                    </div>

                    {!uploadDocsLater && (
                      <div className="space-y-3 pt-2">
                        {[
                          { key: 'doc1', title: '1. Institution Registration Certificate (Society / Trust Deed)' },
                          { key: 'doc2', title: '2. School Affiliation / Board Recognition Letter (CBSE/ICSE/State)' },
                          { key: 'doc3', title: '3. Head of Institution / Principal Photo ID (Aadhaar / PAN)' },
                          { key: 'doc4', title: '4. Authority Authorization Letter on School Letterhead with Stamp' },
                          { key: 'doc5', title: '5. Campus Address Proof (Electricity Bill / Land Allotment Deed)' }
                        ].map((doc) => (
                          <div key={doc.key} className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between gap-3 text-xs">
                            <span className="font-medium text-slate-800">{doc.title}</span>
                            <div className="shrink-0 flex items-center gap-2">
                              {uploadedDocs[doc.key] ? (
                                <span className="text-[11px] text-[#163A2B] font-bold flex items-center gap-1">
                                  <Check className="w-3.5 h-3.5" />
                                  <span>{uploadedDocs[doc.key]}</span>
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleDocUpload(doc.key, 'uploaded-doc.pdf')}
                                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1 cursor-pointer border border-slate-300"
                                >
                                  <Upload className="w-3 h-3 text-slate-500" />
                                  <span>Upload PDF</span>
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </Card>
                )}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs py-3.5 px-6 rounded-xl border border-slate-300 shadow-sm transition-all flex items-center gap-2 cursor-pointer active:scale-[0.98]"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Plans</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="bg-[#163A2B] hover:bg-[#0F2A1F] text-white font-extrabold text-sm py-3.5 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2 cursor-pointer active:scale-[0.98]"
              >
                <span>Continue to Add-on Services</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </div>
        )}

        {/* =================================================================================== */}
        {/* STEP 3: ADD-ON SERVICES (Pricing aligned with Idea Summary) */}
        {/* =================================================================================== */}
        {currentStep === 3 && (
          <div className="space-y-8 max-w-4xl mx-auto animate-in fade-in">
            <div className="text-center space-y-2">
              <span className="text-xs uppercase font-extrabold tracking-wider text-[#163A2B] bg-emerald-50 border border-emerald-200 px-3.5 py-1 rounded-full inline-block">
                Step 3 of 5
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Select Add-on Institutional Services
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-normal">
                Bundle SEO, Google Search Console, live GPS map location pin, or a dedicated white-label mobile app.
              </p>
            </div>

            {/* Bundle Note for Basic & Essential */}
            {!isPro && (
              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between gap-3 text-xs">
                <span className="text-emerald-950 font-medium">
                  💡 <strong>Google Presence Bundle:</strong> Select both Google Submit (₹500) and Google Maps (₹300) to get the complete bundle for just <strong>₹700</strong> (Save ₹100).
                </span>
              </div>
            )}

            {isPro && (
              <div className="p-3.5 bg-emerald-100/70 rounded-2xl border border-emerald-300 flex items-center gap-2 text-xs text-emerald-950 font-bold">
                <Sparkles className="w-4 h-4 text-[#163A2B]" />
                <span>Executive Pro Advantage: Google Search Console Submit and Google Maps Pin are 100% FREE & Included!</span>
              </div>
            )}

            <div className="space-y-4">
              
              {/* Addon 1: Google Search Console Submit */}
              <div
                onClick={() => !isPro && setAddonGoogleSubmit(!addonGoogleSubmit)}
                className={`p-6 rounded-3xl border-2 transition-all cursor-pointer bg-white ${
                  isPro || addonGoogleSubmit
                    ? 'border-[#163A2B] ring-4 ring-emerald-600/10 shadow-lg bg-emerald-50/20'
                    : 'border-slate-200 hover:border-slate-300 shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className="mt-1">
                      {isPro || addonGoogleSubmit ? (
                        <CheckSquare className="w-6 h-6 text-[#163A2B]" />
                      ) : (
                        <Square className="w-6 h-6 text-slate-400" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <Search className="w-5 h-5 text-[#163A2B]" />
                        <h4 className="font-extrabold text-base text-slate-900">Google Search Console & Sitemap Submission</h4>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed font-normal">
                        Domain ownership verification, XML sitemap indexing submission, and homepage indexing request so parents discover your school on Google Search.
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-black text-lg text-[#163A2B]">
                      {isPro ? 'FREE' : '+₹500'}
                    </span>
                    <span className="text-[10px] text-slate-500 font-bold block">
                      {isPro ? 'Included in Pro' : 'One-time setup'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Addon 2: Google Maps Location Verification */}
              <div
                className={`p-6 rounded-3xl border-2 transition-all bg-white ${
                  isPro || addonGoogleMaps
                    ? 'border-[#163A2B] ring-4 ring-emerald-600/10 shadow-lg bg-emerald-50/20'
                    : 'border-slate-200 hover:border-slate-300 shadow-sm'
                }`}
              >
                <div
                  className="flex items-start justify-between gap-4 cursor-pointer"
                  onClick={() => !isPro && setAddonGoogleMaps(!addonGoogleMaps)}
                >
                  <div className="flex items-start gap-3.5">
                    <div className="mt-1">
                      {isPro || addonGoogleMaps ? (
                        <CheckSquare className="w-6 h-6 text-[#163A2B]" />
                      ) : (
                        <Square className="w-6 h-6 text-slate-400" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-amber-700" />
                        <h4 className="font-extrabold text-base text-slate-900">Google Maps Location Pin & Claim</h4>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed font-normal">
                        Institutional location registration, GPS coordinates pin, campus contact details, photo uploads, and live map embed on school website.
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-black text-lg text-[#163A2B]">
                      {isPro ? 'FREE' : '+₹300'}
                    </span>
                    <span className="text-[10px] text-slate-500 font-bold block">
                      {isPro ? 'Included in Pro' : 'One-time setup'}
                    </span>
                  </div>
                </div>

                {(isPro || addonGoogleMaps) && (
                  <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="mapsLater"
                        checked={uploadMapsLater}
                        onChange={(e) => setUploadMapsLater(e.target.checked)}
                        className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                      />
                      <label htmlFor="mapsLater" className="text-xs text-slate-800 cursor-pointer font-bold">
                        Provide Google Maps link later after payment confirmation
                      </label>
                    </div>

                    {!uploadMapsLater && (
                      <Input
                        value={googleMapsLink}
                        onChange={(e) => setGoogleMapsLink(e.target.value)}
                        placeholder="Paste Google Maps URL: https://maps.app.goo.gl/..."
                        className="bg-white border-2 border-slate-200 text-xs text-slate-900 rounded-xl px-4 py-2.5 focus:border-[#163A2B]"
                      />
                    )}
                  </div>
                )}
              </div>

              {/* Addon 3: Play Store Android App Upload */}
              <div
                className={`p-6 rounded-3xl border-2 transition-all bg-white ${
                  addonPlayStore
                    ? 'border-purple-600 ring-4 ring-purple-600/10 shadow-lg bg-purple-50/20'
                    : 'border-slate-200 hover:border-slate-300 shadow-sm'
                }`}
              >
                <div
                  className="flex items-start justify-between gap-4 cursor-pointer"
                  onClick={() => setAddonPlayStore(!addonPlayStore)}
                >
                  <div className="flex items-start gap-3.5">
                    <div className="mt-1">
                      {addonPlayStore ? (
                        <CheckSquare className="w-6 h-6 text-purple-700" />
                      ) : (
                        <Square className="w-6 h-6 text-slate-400" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-5 h-5 text-purple-700" />
                        <h4 className="font-extrabold text-base text-slate-900">White-Label Custom Android App on Google Play Store</h4>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed font-normal">
                        Dedicated standalone APK branded under your school name and logo on Google Play Store. (Shared EduPortal app & PWA is already included free in Essential and Pro).
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-black text-lg text-purple-700">+₹8,000</span>
                    <span className="text-[10px] text-slate-500 font-bold block">One-time setup</span>
                  </div>
                </div>

                {addonPlayStore && (
                  <div className="mt-4 pt-4 border-t border-purple-100">
                    <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 space-y-1.5 text-xs">
                      <span className="font-extrabold text-purple-950 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-purple-700" />
                        <span>Timeline & Regulatory Requirements: 30 – 50 Days</span>
                      </span>
                      <p className="text-[11px] text-purple-900 leading-relaxed font-normal">
                        Google Play Console mandates organization D-U-N-S verification and a strict 14-day closed testing period with 12 opted-in testers before public approval.
                      </p>
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs py-3.5 px-6 rounded-xl border border-slate-300 shadow-sm transition-all flex items-center gap-2 cursor-pointer active:scale-[0.98]"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Domain</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                className="bg-[#163A2B] hover:bg-[#0F2A1F] text-white font-extrabold text-sm py-3.5 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2 cursor-pointer active:scale-[0.98]"
              >
                <span>Continue to Theme & Template</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </div>
        )}

        {/* =================================================================================== */}
        {/* STEP 4: THEME COLOR & TEMPLATE SELECTION */}
        {/* =================================================================================== */}
        {currentStep === 4 && (
          <div className="space-y-8 animate-in fade-in">
            <div className="text-center space-y-2">
              <span className="text-xs uppercase font-extrabold tracking-wider text-[#163A2B] bg-emerald-50 border border-emerald-200 px-3.5 py-1 rounded-full inline-block">
                Step 4 of 5
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Brand Color Palette & Website Design Template
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-normal">
                Pick your school color scheme (unlimited on all plans) and choose from the templates unlocked in your {PLANS_CONFIG[selectedPlan].name} plan.
              </p>
            </div>

            {/* Color Palette Selector */}
            <Card className="p-6 bg-white border border-slate-200 rounded-3xl shadow-sm space-y-3 max-w-4xl mx-auto">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Brand Color Palette
                </span>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#163A2B] font-bold">
                  Changeable anytime in admin panel
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
                {THEME_PRESETS.map((p) => {
                  const isThemeActive = selectedThemeId === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedThemeId(p.id)}
                      className={`p-3 rounded-2xl border-2 text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                        isThemeActive
                          ? 'border-[#163A2B] bg-emerald-50 text-[#163A2B] shadow-sm ring-2 ring-[#163A2B]/10 font-bold'
                          : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700 font-medium'
                      }`}
                    >
                      <span className="w-4 h-4 rounded-full shrink-0 border border-black/20" style={{ backgroundColor: p.primaryHex }} />
                      <span className="text-xs truncate">{p.name.split(' ')[0]}</span>
                      {isThemeActive && <Check className="w-3.5 h-3.5 text-[#163A2B] ml-auto stroke-[3]" />}
                    </button>
                  );
                })}
              </div>
            </Card>

            {/* Template Selection Grid */}
            <div className="space-y-4">
              <div className="flex items-center justify-between max-w-4xl mx-auto">
                <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                  Available Templates for {PLANS_CONFIG[selectedPlan].name} ({unlockedTemplates.length} Available)
                </span>
                <span className="text-xs text-slate-500 font-medium">Click a template card to select:</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {unlockedTemplates.map((tmpl) => {
                  const isSelected = selectedTemplateId === tmpl.id;
                  return (
                    <div
                      key={tmpl.id}
                      onClick={() => setSelectedTemplateId(tmpl.id)}
                      className={`rounded-3xl border-2 overflow-hidden cursor-pointer transition-all duration-200 flex flex-col justify-between bg-white ${
                        isSelected
                          ? 'border-[#163A2B] ring-4 ring-emerald-600/10 shadow-xl'
                          : 'border-slate-200 hover:border-slate-300 hover:shadow-lg'
                      }`}
                    >
                      <div>
                        <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                          <img src={tmpl.previewImage} alt={tmpl.name} className="w-full h-full object-cover object-top" />
                          <span className="absolute top-2.5 left-2.5 text-[10px] font-bold px-2 py-0.5 rounded-md bg-black/75 text-white">
                            {tmpl.code}
                          </span>
                          {isSelected && (
                            <span className="absolute top-2.5 right-2.5 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#163A2B] text-white shadow-sm flex items-center gap-1">
                              <Check className="w-3 h-3 stroke-[3]" /> Selected
                            </span>
                          )}
                        </div>
                        <div className="p-4 space-y-1">
                          <h4 className="font-extrabold text-sm text-slate-900">{tmpl.name}</h4>
                          <span className="text-[10px] text-slate-500 font-medium block">{tmpl.category}</span>
                        </div>
                      </div>

                      <div className="p-4 pt-0">
                        <button
                          type="button"
                          className={`w-full py-2.5 px-4 rounded-xl font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                            isSelected
                              ? 'bg-[#163A2B] text-white shadow-md'
                              : 'bg-slate-100 hover:bg-[#163A2B] text-slate-800 hover:text-white border border-slate-200'
                          }`}
                        >
                          {isSelected ? '✓ Selected Design' : 'Use This Template'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs py-3.5 px-6 rounded-xl border border-slate-300 shadow-sm transition-all flex items-center gap-2 cursor-pointer active:scale-[0.98]"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Add-ons</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentStep(5)}
                className="bg-[#163A2B] hover:bg-[#0F2A1F] text-white font-extrabold text-sm py-3.5 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2 cursor-pointer active:scale-[0.98]"
              >
                <span>Proceed to Payment & Checkout</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </div>
        )}

        {/* =================================================================================== */}
        {/* STEP 5: SUMMARY & PAYMENT SUBMISSION (Dynamic Itemized Invoice) */}
        {/* =================================================================================== */}
        {currentStep === 5 && (
          <form onSubmit={handleSubmitOrder} className="space-y-8 max-w-4xl mx-auto animate-in fade-in">
            <div className="text-center space-y-2">
              <span className="text-xs uppercase font-extrabold tracking-wider text-[#163A2B] bg-emerald-50 border border-emerald-200 px-3.5 py-1 rounded-full inline-block">
                Step 5 of 5
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Order Review & Instant Payment
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-normal">
                Scan the dynamic UPI QR code, complete payment, and submit your 12-digit UTR and screenshot for super admin approval.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: Itemized Invoice Summary */}
              <div className="md:col-span-6 space-y-4">
                <Card className="p-6 bg-white border border-slate-200 rounded-3xl shadow-sm space-y-4">
                  <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                    Itemized Investment Breakdown
                  </h3>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                      <div>
                        <span className="font-extrabold text-slate-900">{planInfo.name} Plan Tier</span>
                        <span className="text-[10px] text-slate-500 block">({billingCycle === 'monthly' ? 'Monthly' : 'Annual'})</span>
                      </div>
                      <span className="font-bold text-slate-900 text-sm">₹{planPrice.toLocaleString('en-IN')}</span>
                    </div>

                    <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                      <div>
                        <span className="font-medium text-slate-700">
                          {domainType === 'subdomain'
                            ? 'Institutional Subdomain (*.eduportal.in)'
                            : domainType === 'own_domain'
                            ? `Own Domain Connect (${ownDomainName})`
                            : `Domain Registration (${customDomainName}${customDomainExt})`}
                        </span>
                        <span className="text-[10px] text-slate-500 block">
                          {domainType === 'custom_domain' ? (isPro ? 'Pro Special Discount Rate' : '1 Year Registration & DNS Setup') : 'Included Free (₹0)'}
                        </span>
                      </div>
                      <span className="font-bold text-slate-900 text-sm">
                        {domainPrice > 0 ? `+₹${domainPrice.toLocaleString('en-IN')}` : '₹0 (Free)'}
                      </span>
                    </div>

                    {(isPro || addonGoogleSubmit || addonGoogleMaps) && (
                      <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                        <div>
                          <span className="text-slate-700 font-medium">
                            {isPro
                              ? 'Google Submit & Maps Pin'
                              : addonGoogleSubmit && addonGoogleMaps
                              ? 'Google Presence Bundle (Submit + Maps)'
                              : addonGoogleSubmit
                              ? 'Google Search Console Submit'
                              : 'Google Maps Location Pin'}
                          </span>
                          <span className="text-[10px] text-emerald-700 block">
                            {isPro ? 'Included Free in Pro Plan' : addonGoogleSubmit && addonGoogleMaps ? 'Bundle Discount Applied' : 'Outreach Setup'}
                          </span>
                        </div>
                        <span className="font-bold text-[#163A2B] text-sm">
                          {isPro ? '₹0 (Free)' : `+₹${googleServicesPrice.toLocaleString('en-IN')}`}
                        </span>
                      </div>
                    )}

                    {addonPlayStore && (
                      <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                        <div>
                          <span className="text-slate-700 font-medium">White-Label Play Store Android App</span>
                          <span className="text-[10px] text-purple-700 block">Dedicated APK Publishing</span>
                        </div>
                        <span className="font-bold text-purple-700 text-sm">+₹8,000</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t-2 border-slate-100 flex justify-between items-baseline">
                    <span className="font-extrabold text-base text-slate-900">Total Amount Payable</span>
                    <span className="font-black text-3xl text-[#163A2B]">
                      ₹{totalPayable.toLocaleString('en-IN')}
                    </span>
                  </div>
                </Card>

                {/* Contact Person Details */}
                <Card className="p-6 bg-white border border-slate-200 rounded-3xl shadow-sm space-y-3 text-xs">
                  <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                    School Administrator Contact
                  </h4>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-slate-600">Contact Person Name</label>
                    <Input
                      value={payerName}
                      onChange={(e) => setPayerName(e.target.value)}
                      required
                      className="bg-white border-2 border-slate-200 text-xs text-slate-900 rounded-xl px-3.5 py-2.5 focus:border-[#163A2B]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-slate-600">Mobile / WhatsApp Number (for SMS Alerts)</label>
                    <Input
                      value={payerPhone}
                      onChange={(e) => setPayerPhone(e.target.value)}
                      required
                      placeholder="9876543210"
                      className="bg-white border-2 border-slate-200 text-xs text-slate-900 rounded-xl px-3.5 py-2.5 focus:border-[#163A2B]"
                    />
                  </div>
                </Card>
              </div>

              {/* Right Column: Dynamic UPI QR Code & Payment Verification Form */}
              <div className="md:col-span-6 space-y-4">
                <Card className="p-6 bg-white border-2 border-emerald-200 rounded-3xl shadow-sm text-center space-y-4">
                  <span className="text-xs font-extrabold text-[#163A2B] uppercase tracking-wider block">
                    Instant UPI Payment QR Code
                  </span>

                  {/* QR Code Canvas Frame */}
                  <div className="p-4 bg-white rounded-3xl inline-block shadow-lg mx-auto border-4 border-emerald-500/20">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi%3A%2F%2Fpay%3Fpa%3Deduportal%40icici%26pn%3DEduPortal%26am%3D${totalPayable}%26cu%3DINR`}
                      alt="UPI Payment QR Code"
                      className="w-48 h-48 mx-auto"
                    />
                    <span className="text-xs font-black text-slate-900 block mt-2">
                      Scan to Pay ₹{totalPayable.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-slate-500 font-medium">UPI ID:</span>
                      <span className="font-mono font-bold text-[#163A2B] text-sm">eduportal@icici</span>
                      <button
                        type="button"
                        onClick={handleCopyUpi}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 font-bold text-xs cursor-pointer"
                        title="Copy UPI ID"
                      >
                        {copiedUpi ? <Check className="w-3.5 h-3.5 text-[#163A2B]" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <span className="text-[11px] text-slate-500 block font-normal">
                      Compatible with Google Pay, PhonePe, Paytm, BHIM & Any Bank UPI App
                    </span>
                  </div>
                </Card>

                {/* Transaction Proof Submission Form */}
                <Card className="p-6 bg-white border border-slate-200 rounded-3xl shadow-sm space-y-3.5 text-xs">
                  <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                    Submit Payment Verification Proof
                  </h4>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-700">
                      12-Digit UPI Transaction ID / UTR Number <span className="text-rose-500">*</span>
                    </label>
                    <Input
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      placeholder="e.g. 428901847291"
                      required
                      className="bg-white border-2 border-slate-200 text-[#163A2B] font-mono font-bold text-sm tracking-wider rounded-xl px-4 py-2.5 focus:border-[#163A2B]"
                    />
                    <span className="text-[10px] text-slate-500">
                      Found in your GPay / PhonePe / Paytm receipt details as "UPI Ref ID" or "UTR".
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-700">
                      Upload Payment Screenshot / Receipt Photo <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleReceiptUpload}
                      className="block w-full text-xs text-slate-600 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#163A2B] file:text-white hover:file:bg-[#0F2A1F] cursor-pointer"
                    />
                    {receiptImage && (
                      <div className="mt-2 p-2 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3">
                        <img src={receiptImage} alt="Receipt preview" className="w-12 h-12 object-cover rounded-lg" />
                        <span className="text-[11px] text-[#163A2B] font-bold">✓ Payment receipt uploaded</span>
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#163A2B] hover:bg-[#0F2A1F] text-white font-extrabold py-4 px-6 text-sm mt-3 rounded-2xl shadow-lg hover:shadow-xl transition-all cursor-pointer active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    <span>Submit Order & Request Instant Activation</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </Card>
              </div>

            </div>

            {/* Back Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                className="bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs py-3.5 px-6 rounded-xl border border-slate-300 shadow-sm transition-all flex items-center gap-2 cursor-pointer active:scale-[0.98]"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Theme & Template</span>
              </button>
            </div>
          </form>
        )}

        {/* =================================================================================== */}
        {/* STEP 6: APPROVAL STATUS & SUPER ADMIN SIMULATION */}
        {/* =================================================================================== */}
        {currentStep === 6 && activeOrder && (
          <div className="space-y-8 max-w-2xl mx-auto text-center animate-in fade-in">
            {activeOrder.status === 'pending_approval' ? (
              <Card className="p-8 bg-white border-2 border-amber-300 rounded-3xl shadow-lg space-y-6">
                <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto text-2xl animate-pulse">
                  ⏳
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-mono font-bold text-amber-800 px-3 py-1 rounded-full bg-amber-100">
                    Order Ref: {activeOrder.orderId}
                  </span>
                  <h3 className="font-extrabold text-2xl text-slate-900 tracking-tight">
                    Order Submitted! Waiting for Super Admin Approval
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md mx-auto font-normal">
                    Your payment verification proof (UTR: <span className="font-mono text-[#163A2B] font-bold">{activeOrder.transactionId}</span>) has been routed to the Super Admin verification desk.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">School Name:</span>
                    <span className="font-bold text-slate-900">{activeOrder.schoolName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Plan Tier:</span>
                    <span className="font-bold text-[#163A2B] uppercase">{activeOrder.planTier}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Total Paid:</span>
                    <span className="font-bold text-slate-900 font-mono text-sm">₹{activeOrder.totalAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Notification Phone:</span>
                    <span className="font-bold text-slate-900">{activeOrder.payerPhone}</span>
                  </div>
                </div>

                <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-[#163A2B] font-bold">
                  📱 "You will be notified via SMS/WhatsApp once our Super Admin approves your school!"
                </div>

                {/* Instant Super Admin Approval Demo Trigger */}
                <div className="pt-4 border-t border-slate-100 space-y-2">
                  <span className="text-[11px] text-slate-500 font-medium block">
                    Developer & Testing Shortcut:
                  </span>
                  <button
                    type="button"
                    onClick={handleInstantApprove}
                    className="w-full bg-[#163A2B] hover:bg-[#0F2A1F] text-white font-extrabold py-3 px-6 rounded-xl text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-300" />
                    <span>Super Admin Instant Approve & Provision School</span>
                  </button>
                </div>
              </Card>
            ) : (
              /* Approved State */
              <Card className="p-8 bg-white border-2 border-emerald-500 rounded-3xl shadow-xl space-y-6">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-[#163A2B] border-2 border-emerald-300 flex items-center justify-center mx-auto text-2xl font-bold">
                  ✓
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-mono font-bold text-[#163A2B] px-3.5 py-1 rounded-full bg-emerald-100">
                    Tenant Activated: {activeOrder.orderId}
                  </span>
                  <h3 className="font-extrabold text-2xl text-slate-900 tracking-tight">
                    Congratulations! {activeOrder.schoolName} is Live!
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md mx-auto font-normal">
                    Your institutional workspace has been provisioned with all {PLANS_CONFIG[activeOrder.planTier].modules.length} modules, custom theme, and templates.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowGuidedTour(true);
                      setAdminSetupModal(true);
                    }}
                    className="bg-[#163A2B] hover:bg-[#0F2A1F] text-white font-extrabold px-7 py-3 rounded-xl text-xs shadow-lg hover:shadow-xl cursor-pointer active:scale-[0.98]"
                  >
                    Setup School Admin Credentials & Take Tour →
                  </button>

                  <Link href="/?view=school">
                    <button
                      type="button"
                      className="bg-white hover:bg-slate-100 text-slate-800 font-bold border border-slate-300 text-xs px-5 py-3 rounded-xl shadow-sm flex items-center gap-1.5 cursor-pointer active:scale-[0.98]"
                    >
                      <Globe className="w-3.5 h-3.5 text-[#163A2B]" />
                      <span>Preview School Website</span>
                    </button>
                  </Link>
                </div>
              </Card>
            )}
          </div>
        )}

      </div>

      {/* =================================================================================== */}
      {/* GUIDED TOUR & ADMIN CREDENTIAL SETUP MODAL */}
      {/* =================================================================================== */}
      {adminSetupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-2xl p-7 text-slate-900 space-y-5 animate-in zoom-in-95">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#163A2B] flex items-center justify-center font-bold text-lg border border-emerald-200">
                🔐
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900">
                  Setup School Admin Credentials
                </h3>
                <span className="text-[10px] text-[#163A2B] font-bold">Initial Institutional Master Account</span>
              </div>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700">Admin Email ID</label>
                <Input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="bg-white border-2 border-slate-200 text-xs text-slate-900 rounded-xl px-4 py-2.5 focus:border-[#163A2B]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700">Set Admin Password</label>
                <Input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="bg-white border-2 border-slate-200 text-xs text-slate-900 rounded-xl px-4 py-2.5 focus:border-[#163A2B]"
                />
              </div>
            </div>

            {/* Guided Tour Tips with Arrows */}
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2 text-xs">
              <span className="font-extrabold text-[#163A2B] block">
                👉 How to Enter Your Admin Panel:
              </span>
              <p className="text-[11px] text-slate-700 leading-relaxed font-medium">
                1. <strong>Secret Gesture:</strong> On the top header, tap your school logo <strong>5 times quickly</strong> to unlock the Secret Admin Gateway!
              </p>
              <p className="text-[11px] text-slate-700 leading-relaxed font-medium">
                2. <strong>Dashboard Drawer:</strong> Or click the <strong>[☰ Dashboard]</strong> button on the left to access your Admin Panel, Principal Cockpit, and Student Portal.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setAdminSetupModal(false);
                router.push('/admin/dashboard');
              }}
              className="w-full bg-[#163A2B] hover:bg-[#0F2A1F] text-white font-extrabold py-3.5 text-xs rounded-xl shadow-md cursor-pointer transition-all active:scale-[0.98]"
            >
              Save Credentials & Enter Admin Panel →
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
