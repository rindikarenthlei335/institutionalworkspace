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
  domainType: 'subdomain' | 'custom_domain';
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
    tagline: 'Core digital services & public website for standard institutions',
    modules: [
      'Home Page Module (Custom Hero & Campus Facade)',
      'About Us Module (School History, Mission & Leadership)',
      'Faculty & Staff Directory Module (Teacher Profiles & Subjects)',
      'Campus Facilities Module (Labs, Library & Bus Transport)',
      'Student Activities & Sports Module (Clubs & Annual Day)',
      'Digital Notice Board Module (Circulars, Exams & Routine)',
      'School Admin Panel (Data management, notices & image upload)',
      'Mobile Responsive PWA Website (Ultra-fast & zero overflow)',
      'Brand Theme Color Customizer (Change in any plan)',
      '1 Classic Website Template (Trident Public School)'
    ]
  },
  essential: {
    name: 'ESSENTIAL',
    monthlyPrice: 3999,
    yearlyPrice: 39990,
    tagline: 'Online admissions, fee desk & 4 website template designs',
    badge: 'Popular for High Schools',
    modules: [
      'All 6 Basic Modules (Home, About, Faculty, Facilities, Activities, Notices)',
      'School Admin Panel (Full CMS & Photo Manager)',
      'Online Student Admission Desk & Application Form',
      'Online Fee Desk & Instant UPI Payment Receipts',
      '4 Website Template Styles (Trident, Bright Future, Unipix, Nuova)',
      'Student Marksheet & Result Lookup Desk',
      'Mobile Responsive PWA Website & Subdomain',
      'Direct WhatsApp Parent Connect Desk'
    ]
  },
  pro: {
    name: 'PRO',
    monthlyPrice: 8000,
    yearlyPrice: 79990,
    tagline: 'Complete enterprise suite with exams, ID cards & public AI Copilot',
    badge: 'Executive Suite',
    modules: [
      'All Essential Modules + Complete Academic ERP',
      '10 Enterprise Website Templates (Includes Eudaimonia, Eduka, Edugate, Qeducato, UnivBridge, Apex)',
      'Student ID Card Generator & Bulk PDF Export',
      'Exams & Grade Sheet Master Processing Desk',
      'Teachers & Staff Database Management',
      'Public AI Copilot (English + Mizo Admissions & Fee Assistant)',
      'School Analytics & Visitor Insights Desk',
      'Principal Executive Cockpit with 10 Live KPIs'
    ]
  },
  pro_plus: {
    name: 'PRO+ / ULTIMATE',
    monthlyPrice: 9999,
    yearlyPrice: 99990,
    tagline: 'Full-scale institutional automation with attendance & certificates',
    badge: 'All-Inclusive Enterprise',
    modules: [
      'All Pro Modules + Complete Institutional Automation',
      'Complete 15 Website Templates Suite (All Exclusive Collegiate Styles)',
      'Daily Student Attendance Tracker & Absentee Alerts',
      'Automated Transfer Certificates (TC) & Character Certificates',
      'Custom Drag-and-Drop Page Builder & Module Manager',
      'Automated Excel Bulk Import / Export Data Hub',
      'Priority 24/7 Dedicated Technical Support SLA'
    ]
  }
};

const DOMAIN_OPTIONS = [
  {
    ext: '.edu.in',
    name: 'Official Indian Educational Domain',
    price: 1800,
    badge: 'Recognized Institutions Only',
    rules: 'Requires registration certificate of educational trust/society & board affiliation.',
    requiresDocs: true
  },
  {
    ext: '.ac.in',
    name: 'Academic College / University Domain',
    price: 1800,
    badge: 'Colleges & Universities',
    rules: 'Requires government/university affiliation and registration proof.',
    requiresDocs: true
  },
  {
    ext: '.com',
    name: 'Global Commercial Domain',
    price: 1200,
    badge: 'Instant Setup',
    rules: 'No documents needed. Instant worldwide activation within 15 minutes.',
    requiresDocs: false
  },
  {
    ext: '.in',
    name: 'National Indian Domain',
    price: 850,
    badge: 'National Registry',
    rules: 'No documents needed. Ideal for schools and academies across India.',
    requiresDocs: false
  },
  {
    ext: '.org.in',
    name: 'Non-Profit Educational Society Domain',
    price: 1100,
    badge: 'Trusts & Societies',
    rules: 'No mandatory documents. Suitable for educational non-profits and NGOs.',
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
  
  // Domain Setup
  const [domainType, setDomainType] = useState<'subdomain' | 'custom_domain'>('subdomain');
  const [subdomain, setSubdomain] = useState<string>('mountcarmel');
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

  // Calculation of Totals
  const planInfo = PLANS_CONFIG[selectedPlan];
  const planPrice = billingCycle === 'monthly' ? planInfo.monthlyPrice : planInfo.yearlyPrice;
  const domainPrice = domainType === 'custom_domain' ? (DOMAIN_OPTIONS.find(d => d.ext === customDomainExt)?.price || 0) : 0;
  const googleSubmitPrice = addonGoogleSubmit ? 999 : 0;
  const googleMapsPrice = addonGoogleMaps ? 499 : 0;
  const playStorePrice = addonPlayStore ? 5000 : 0;
  const totalPayable = planPrice + domainPrice + googleSubmitPrice + googleMapsPrice + playStorePrice;

  // Handle Domain Selection
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
      customDomainName: `${customDomainName}${customDomainExt}`,
      customDomainExt,
      educationalDocsUploaded: Object.keys(uploadedDocs).length > 0,
      uploadDocsLater,
      uploadedDocNames: Object.values(uploadedDocs),
      addonGoogleSubmit,
      addonGoogleMaps,
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
    <div className="min-h-screen bg-[#F8FAF9] text-slate-900 pb-24">
      
      {/* Onboarding Header Banner (Forest Green #163A2B) */}
      <div className="bg-[#163A2B] text-white border-b border-[#0F2A1F] py-8 px-4 shadow-sm">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1.5 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-emerald-200 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
              <span>EduPortal Multi-Tenant SaaS · Automated Institutional Provisioning</span>
            </div>
            <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
              Setup & Launch Your School Digital Workspace
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/80">
              Select your plan tier, configure domain, choose modules & theme, and submit for instant activation.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link href="/find-school">
              <Button variant="secondary" size="sm" className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs">
                Find School
              </Button>
            </Link>
            <Link href="/platform/tenants">
              <Button variant="secondary" size="sm" className="bg-emerald-950/80 hover:bg-emerald-900 text-emerald-200 border border-emerald-700/50 text-xs flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                <span>Super Admin Desk</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Interactive Step Navigator (Crisp White Bar with Forest Green Accents) */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between overflow-x-auto scrollbar-none gap-2 text-xs">
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
              className={`px-3 py-1.5 rounded-full font-semibold shrink-0 transition-all flex items-center gap-1.5 cursor-pointer ${
                currentStep === s.num
                  ? 'bg-[#163A2B] text-white shadow-sm font-bold'
                  : currentStep > s.num
                  ? 'bg-emerald-50 text-[#163A2B] border border-emerald-200 font-semibold hover:bg-emerald-100/60'
                  : 'bg-slate-100 text-slate-400 opacity-70 cursor-not-allowed'
              }`}
            >
              <span>{s.label}</span>
              {currentStep > s.num && <Check className="w-3.5 h-3.5 text-[#163A2B]" />}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pt-8">

        {/* =================================================================================== */}
        {/* STEP 1: PLAN TIER SELECTION & PRE-TICKED MODULES */}
        {/* =================================================================================== */}
        {currentStep === 1 && (
          <div className="space-y-8 animate-in fade-in">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs uppercase font-bold tracking-widest text-[#163A2B] bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full inline-block">
                Step 1 of 5
              </span>
              <h2 className="font-display font-black text-2xl sm:text-3xl text-slate-900">
                Choose Institutional Plan Tier
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                All institutional core modules are pre-enabled and pre-ticked. Select the tier that matches your school size.
              </p>

              {/* Billing Cycle Toggle */}
              <div className="inline-flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200 mt-3">
                <button
                  type="button"
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    billingCycle === 'monthly' ? 'bg-[#163A2B] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Monthly Billing
                </button>
                <button
                  type="button"
                  onClick={() => setBillingCycle('yearly')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                    billingCycle === 'yearly' ? 'bg-[#163A2B] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>Yearly (Save 17%)</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-400 text-slate-950 font-black">2 Mo Free</span>
                </button>
              </div>
            </div>

            {/* 4 Tier Cards with Pre-ticked Modules */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
              {(Object.keys(PLANS_CONFIG) as PlanTier[]).map((tierKey) => {
                const tier = PLANS_CONFIG[tierKey];
                const isSelected = selectedPlan === tierKey;
                const price = billingCycle === 'monthly' ? tier.monthlyPrice : tier.yearlyPrice;

                return (
                  <div
                    key={tierKey}
                    onClick={() => setSelectedPlan(tierKey)}
                    className={`rounded-2xl border p-5 flex flex-col justify-between transition-all duration-200 cursor-pointer relative ${
                      isSelected
                        ? 'bg-emerald-50/40 border-[#163A2B] ring-2 ring-[#163A2B] shadow-lg'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-md'
                    }`}
                  >
                    {tier.badge && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#163A2B] text-white shadow-sm">
                        {tier.badge}
                      </span>
                    )}

                    <div className="space-y-4">
                      <div className="border-b border-slate-100 pb-4">
                        <span className="text-xs font-mono font-bold text-[#163A2B] tracking-wider uppercase">
                          {tier.name}
                        </span>
                        <div className="mt-1 flex items-baseline gap-1">
                          <span className="text-3xl font-display font-black text-slate-900">
                            ₹{price.toLocaleString('en-IN')}
                          </span>
                          <span className="text-xs text-slate-500">
                            /{billingCycle === 'monthly' ? 'mo' : 'yr'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                          {tier.tagline}
                        </p>
                      </div>

                      {/* Pre-ticked Modules List */}
                      <div className="space-y-2">
                        <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
                          Included & Pre-Enabled Modules:
                        </span>
                        <ul className="space-y-2 text-xs">
                          {tier.modules.map((mod, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <CheckSquare className="w-4 h-4 text-[#163A2B] shrink-0 mt-0.5" />
                              <span className="text-slate-700 leading-snug">{mod}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="pt-5 mt-4 border-t border-slate-100">
                      <Button
                        type="button"
                        variant={isSelected ? 'primary' : 'secondary'}
                        className={`w-full text-xs font-bold py-2 ${
                          isSelected
                            ? 'bg-[#163A2B] hover:bg-[#0F2A1F] text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                        }`}
                      >
                        {isSelected ? '✓ Selected This Plan' : 'Select Plan'}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Next Step Bar */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs text-slate-500">Selected Tier:</span>
                <span className="text-sm font-bold text-[#163A2B] uppercase ml-2">
                  {PLANS_CONFIG[selectedPlan].name} (₹{planPrice.toLocaleString('en-IN')}/{billingCycle === 'monthly' ? 'mo' : 'yr'})
                </span>
                <p className="text-[11px] text-emerald-700 font-medium mt-0.5">
                  ✓ All {PLANS_CONFIG[selectedPlan].modules.length} modules pre-ticked and ready for provisioning.
                </p>
              </div>

              <Button
                type="button"
                variant="primary"
                onClick={() => setCurrentStep(2)}
                className="bg-[#163A2B] hover:bg-[#0F2A1F] text-white font-bold px-6 py-2.5 text-xs flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <span>Select This Plan & Continue to Domain Setup</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* =================================================================================== */}
        {/* STEP 2: DOMAIN SETUP (Custom Subdomain vs Domain Register Service) */}
        {/* =================================================================================== */}
        {currentStep === 2 && (
          <div className="space-y-8 max-w-4xl mx-auto animate-in fade-in">
            <div className="text-center space-y-2">
              <span className="text-xs uppercase font-bold tracking-widest text-[#163A2B] bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full inline-block">
                Step 2 of 5
              </span>
              <h2 className="font-display font-black text-2xl sm:text-3xl text-slate-900">
                School Name & Domain Configuration
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Choose between a free instant institutional subdomain or register a custom official domain (.edu.in, .com, .in).
              </p>
            </div>

            {/* School Name Input */}
            <Card className="p-5 bg-white border-slate-200 shadow-sm space-y-3">
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
                Full Official School Name
              </label>
              <Input
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                placeholder="e.g. Mount Carmel Higher Secondary School"
                className="bg-slate-50 border-slate-300 text-slate-900 font-semibold text-sm focus:bg-white focus:border-[#163A2B]"
              />
              <span className="text-[11px] text-slate-500 block">
                This official name will be configured on your website header, report cards, ID cards, and receipts.
              </span>
            </Card>

            {/* Domain Type Tabs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                onClick={() => setDomainType('subdomain')}
                className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                  domainType === 'subdomain'
                    ? 'bg-emerald-50/40 border-[#163A2B] ring-2 ring-[#163A2B]/40 shadow-sm'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#163A2B] uppercase tracking-wider">Option A</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-[#163A2B]">
                    Included Free (₹0)
                  </span>
                </div>
                <h4 className="font-bold text-base text-slate-900 mt-1">Instant Institutional Subdomain</h4>
                <p className="text-xs text-slate-600 mt-1">
                  Active instantly with zero setup time. Perfect for launching right away.
                </p>
                <div className="mt-3 text-xs font-mono text-[#163A2B] font-bold bg-white p-2.5 rounded-lg border border-slate-200">
                  https://{subdomain || 'schoolname'}.eduportal.in
                </div>
              </div>

              <div
                onClick={() => setDomainType('custom_domain')}
                className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                  domainType === 'custom_domain'
                    ? 'bg-emerald-50/40 border-[#163A2B] ring-2 ring-[#163A2B]/40 shadow-sm'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Option B</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                    Official Domain Service
                  </span>
                </div>
                <h4 className="font-bold text-base text-slate-900 mt-1">Register Custom Domain</h4>
                <p className="text-xs text-slate-600 mt-1">
                  Buy official institutional domain (.edu.in, .ac.in, .com, .in) with DNS provisioning.
                </p>
                <div className="mt-3 text-xs font-mono text-amber-700 font-bold bg-white p-2.5 rounded-lg border border-slate-200">
                  https://www.{customDomainName || 'schoolname'}{customDomainExt}
                </div>
              </div>
            </div>

            {/* Details for Option A: Subdomain */}
            {domainType === 'subdomain' && (
              <Card className="p-5 bg-white border-slate-200 shadow-sm space-y-3">
                <label className="block text-xs font-bold text-slate-900">Choose Your Subdomain Slug</label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-mono">https://</span>
                  <Input
                    value={subdomain}
                    onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    placeholder="mountcarmel"
                    className="bg-slate-50 border-slate-300 text-[#163A2B] font-mono font-bold text-sm focus:bg-white focus:border-[#163A2B]"
                  />
                  <span className="text-xs text-slate-500 shrink-0 font-mono">.eduportal.in</span>
                </div>
                <span className="text-[11px] text-emerald-700 font-semibold block">
                  ✓ Instant SSL Certificate, CDN routing & DDoS protection included free.
                </span>
              </Card>
            )}

            {/* Details for Option B: Domain Registration Service */}
            {domainType === 'custom_domain' && (
              <div className="space-y-6">
                <Card className="p-5 bg-white border-slate-200 shadow-sm space-y-4">
                  <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Select Domain Extension & Pricing
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {DOMAIN_OPTIONS.map((d) => (
                      <div
                        key={d.ext}
                        onClick={() => setCustomDomainExt(d.ext)}
                        className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                          customDomainExt === d.ext
                            ? 'bg-emerald-50/50 border-[#163A2B] ring-1 ring-[#163A2B]'
                            : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-base text-slate-900">{d.ext}</span>
                          <span className="font-bold text-xs text-[#163A2B]">₹{d.price}/yr</span>
                        </div>
                        <span className="text-[11px] font-semibold text-slate-700 block mt-1">{d.name}</span>
                        <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">{d.rules}</p>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-slate-100 space-y-2">
                    <label className="block text-xs font-bold text-slate-900">Desired Domain Name</label>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 font-mono">www.</span>
                      <Input
                        value={customDomainName}
                        onChange={(e) => setCustomDomainName(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                        placeholder="mountcarmelaizawl"
                        className="bg-slate-50 border-slate-300 text-slate-900 font-mono text-sm focus:bg-white focus:border-[#163A2B]"
                      />
                      <span className="text-xs font-mono font-bold text-amber-700 shrink-0">{customDomainExt}</span>
                    </div>
                  </div>
                </Card>

                {/* 5 Required Documents for Educational Domains (.edu.in / .ac.in) */}
                {selectedDomainOption?.requiresDocs && (
                  <Card className="p-5 bg-amber-50/50 border-amber-200 shadow-sm space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-amber-100 text-amber-700 shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-900">
                          5 Required Documents for Official Educational Domain ({customDomainExt})
                        </h4>
                        <p className="text-xs text-slate-600 mt-0.5">
                          ERNET India regulations require verification of institutional accreditation and authorization.
                        </p>
                      </div>
                    </div>

                    {/* Upload Later Checkbox */}
                    <div className="p-3 bg-amber-100/70 rounded-xl border border-amber-300 flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="uploadLater"
                        checked={uploadDocsLater}
                        onChange={(e) => setUploadDocsLater(e.target.checked)}
                        className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                      />
                      <label htmlFor="uploadLater" className="text-xs text-amber-900 cursor-pointer font-medium">
                        Upload documents later after payment confirmation (Recommended - Pay first, submit documents within 7 days)
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
                                <span className="text-[11px] text-[#163A2B] font-semibold flex items-center gap-1">
                                  <Check className="w-3.5 h-3.5" />
                                  <span>{uploadedDocs[doc.key]}</span>
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleDocUpload(doc.key, 'uploaded-doc.pdf')}
                                  className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] flex items-center gap-1 cursor-pointer border border-slate-200"
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
              <Button
                type="button"
                variant="secondary"
                onClick={() => setCurrentStep(1)}
                className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs flex items-center gap-1.5 shadow-xs"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Plans</span>
              </Button>

              <Button
                type="button"
                variant="primary"
                onClick={() => setCurrentStep(3)}
                className="bg-[#163A2B] hover:bg-[#0F2A1F] text-white font-bold px-6 py-2.5 text-xs flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <span>Continue to Add-on Services</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* =================================================================================== */}
        {/* STEP 3: ADD-ON SERVICES (Checkboxes with Prices) */}
        {/* =================================================================================== */}
        {currentStep === 3 && (
          <div className="space-y-8 max-w-4xl mx-auto animate-in fade-in">
            <div className="text-center space-y-2">
              <span className="text-xs uppercase font-bold tracking-widest text-[#163A2B] bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full inline-block">
                Step 3 of 5
              </span>
              <h2 className="font-display font-black text-2xl sm:text-3xl text-slate-900">
                Select Add-on Institutional Services
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Tick the additional digital outreach services you want to bundle with your institutional workspace.
              </p>
            </div>

            <div className="space-y-4">
              
              {/* Addon 1: Google Search Console Submit */}
              <Card
                onClick={() => setAddonGoogleSubmit(!addonGoogleSubmit)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                  addonGoogleSubmit
                    ? 'bg-emerald-50/40 border-[#163A2B] ring-2 ring-[#163A2B]/40 shadow-sm'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      {addonGoogleSubmit ? (
                        <CheckSquare className="w-5 h-5 text-[#163A2B]" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <Search className="w-4 h-4 text-[#163A2B]" />
                        <h4 className="font-bold text-base text-slate-900">Google Search Console & SEO Submission</h4>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        Full XML sitemap generation, Google Search indexing submission, and Bing/IndexNow pinging so parents find your school instantly on Google.
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-mono font-bold text-base text-[#163A2B]">+₹999</span>
                    <span className="text-[10px] text-slate-500 block">One-time setup</span>
                  </div>
                </div>
              </Card>

              {/* Addon 2: Google Maps Location Verification */}
              <Card
                className={`p-5 rounded-2xl border transition-all ${
                  addonGoogleMaps
                    ? 'bg-emerald-50/40 border-[#163A2B] ring-2 ring-[#163A2B]/40 shadow-sm'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                }`}
              >
                <div
                  className="flex items-start justify-between gap-4 cursor-pointer"
                  onClick={() => setAddonGoogleMaps(!addonGoogleMaps)}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      {addonGoogleMaps ? (
                        <CheckSquare className="w-5 h-5 text-[#163A2B]" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-amber-600" />
                        <h4 className="font-bold text-base text-slate-900">Google Maps Institutional Location Pin</h4>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        Embedding live Google Maps GPS location on your school website so visiting parents and bus drivers navigate easily.
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-mono font-bold text-base text-[#163A2B]">+₹499</span>
                    <span className="text-[10px] text-slate-500 block">One-time setup</span>
                  </div>
                </div>

                {addonGoogleMaps && (
                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="mapsLater"
                        checked={uploadMapsLater}
                        onChange={(e) => setUploadMapsLater(e.target.checked)}
                        className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                      />
                      <label htmlFor="mapsLater" className="text-xs text-slate-700 cursor-pointer font-medium">
                        Provide Google Maps link later after payment confirmation
                      </label>
                    </div>

                    {!uploadMapsLater && (
                      <Input
                        value={googleMapsLink}
                        onChange={(e) => setGoogleMapsLink(e.target.value)}
                        placeholder="Paste Google Maps URL: https://maps.app.goo.gl/..."
                        className="bg-slate-50 border-slate-300 text-xs text-slate-900 focus:bg-white focus:border-[#163A2B]"
                      />
                    )}
                  </div>
                )}
              </Card>

              {/* Addon 3: Play Store Android App Upload */}
              <Card
                className={`p-5 rounded-2xl border transition-all ${
                  addonPlayStore
                    ? 'bg-purple-50/40 border-purple-600 ring-2 ring-purple-600/30 shadow-sm'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                }`}
              >
                <div
                  className="flex items-start justify-between gap-4 cursor-pointer"
                  onClick={() => setAddonPlayStore(!addonPlayStore)}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      {addonPlayStore ? (
                        <CheckSquare className="w-5 h-5 text-purple-700" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-4 h-4 text-purple-700" />
                        <h4 className="font-bold text-base text-slate-900">Google Play Store Android App Publishing</h4>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        Dedicated branded Android APK compiled, signed, and uploaded to Google Play Store under institutional developer account.
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-mono font-bold text-base text-purple-700">+₹5,000</span>
                    <span className="text-[10px] text-slate-500 block">Publishing fee</span>
                  </div>
                </div>

                {addonPlayStore && (
                  <div className="mt-4 pt-3 border-t border-purple-100">
                    <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 space-y-1 text-xs">
                      <span className="font-bold text-purple-900 flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-purple-700" />
                        <span>Crucial Timeline Note: 30 – 50 Days Required</span>
                      </span>
                      <p className="text-[11px] text-purple-800 leading-relaxed">
                        Google Play Console mandates a strict 14-day closed testing period with 12 opted-in testers and D-U-N-S business organization verification before an institutional app is approved for public store download.
                      </p>
                    </div>
                  </div>
                )}
              </Card>

            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setCurrentStep(2)}
                className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs flex items-center gap-1.5 shadow-xs"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Domain</span>
              </Button>

              <Button
                type="button"
                variant="primary"
                onClick={() => setCurrentStep(4)}
                className="bg-[#163A2B] hover:bg-[#0F2A1F] text-white font-bold px-6 py-2.5 text-xs flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <span>Continue to Theme & Template</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* =================================================================================== */}
        {/* STEP 4: THEME COLOR & TEMPLATE SELECTION */}
        {/* =================================================================================== */}
        {currentStep === 4 && (
          <div className="space-y-8 animate-in fade-in">
            <div className="text-center space-y-2">
              <span className="text-xs uppercase font-bold tracking-widest text-[#163A2B] bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full inline-block">
                Step 4 of 5
              </span>
              <h2 className="font-display font-black text-2xl sm:text-3xl text-slate-900">
                Brand Color Palette & Website Design Template
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Pick your school color scheme (unlimited on all plans) and choose from the templates unlocked in your {PLANS_CONFIG[selectedPlan].name} plan.
              </p>
            </div>

            {/* Color Palette Selector */}
            <Card className="p-5 bg-white border-slate-200 shadow-sm space-y-3 max-w-4xl mx-auto">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Brand Color Palette
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-[#163A2B] font-bold">
                  Changeable anytime in admin panel
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                {THEME_PRESETS.map((p) => {
                  const isThemeActive = selectedThemeId === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedThemeId(p.id)}
                      className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
                        isThemeActive
                          ? 'border-[#163A2B] bg-emerald-50 text-[#163A2B] shadow-xs ring-1 ring-[#163A2B]'
                          : 'border-slate-200 bg-slate-50 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <span className="w-4 h-4 rounded-full shrink-0 border border-black/20" style={{ backgroundColor: p.primaryHex }} />
                      <span className="text-xs font-semibold truncate">{p.name.split(' ')[0]}</span>
                      {isThemeActive && <Check className="w-3.5 h-3.5 text-[#163A2B] ml-auto" />}
                    </button>
                  );
                })}
              </div>
            </Card>

            {/* Template Selection Grid */}
            <div className="space-y-4">
              <div className="flex items-center justify-between max-w-4xl mx-auto">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Available Templates for {PLANS_CONFIG[selectedPlan].name} ({unlockedTemplates.length} Available)
                </span>
                <span className="text-xs text-slate-500">Click a template card to select:</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {unlockedTemplates.map((tmpl) => {
                  const isSelected = selectedTemplateId === tmpl.id;
                  return (
                    <div
                      key={tmpl.id}
                      onClick={() => setSelectedTemplateId(tmpl.id)}
                      className={`rounded-2xl border overflow-hidden cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                        isSelected
                          ? 'bg-white border-[#163A2B] ring-2 ring-[#163A2B] shadow-md'
                          : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-md'
                      }`}
                    >
                      <div>
                        <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                          <img src={tmpl.previewImage} alt={tmpl.name} className="w-full h-full object-cover object-top" />
                          <span className="absolute top-2 left-2 text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-black/70 text-white">
                            {tmpl.code}
                          </span>
                          {isSelected && (
                            <span className="absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded bg-[#163A2B] text-white shadow-sm flex items-center gap-1">
                              <Check className="w-3 h-3" /> Selected
                            </span>
                          )}
                        </div>
                        <div className="p-4 space-y-1">
                          <h4 className="font-bold text-sm text-slate-900">{tmpl.name}</h4>
                          <span className="text-[10px] text-slate-500 block">{tmpl.category}</span>
                        </div>
                      </div>

                      <div className="p-4 pt-0">
                        <Button
                          type="button"
                          variant={isSelected ? 'primary' : 'secondary'}
                          size="sm"
                          className={`w-full text-xs font-semibold ${
                            isSelected
                              ? 'bg-[#163A2B] text-white font-bold'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                          }`}
                        >
                          {isSelected ? '✓ Selected Design' : 'Use This Template'}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setCurrentStep(3)}
                className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs flex items-center gap-1.5 shadow-xs"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Add-ons</span>
              </Button>

              <Button
                type="button"
                variant="primary"
                onClick={() => setCurrentStep(5)}
                className="bg-[#163A2B] hover:bg-[#0F2A1F] text-white font-bold px-6 py-2.5 text-xs flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <span>Proceed to Payment & Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* =================================================================================== */}
        {/* STEP 5: SUMMARY & PAYMENT SUBMISSION (QR Code, UTR & Screenshot) */}
        {/* =================================================================================== */}
        {currentStep === 5 && (
          <form onSubmit={handleSubmitOrder} className="space-y-8 max-w-4xl mx-auto animate-in fade-in">
            <div className="text-center space-y-2">
              <span className="text-xs uppercase font-bold tracking-widest text-[#163A2B] bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full inline-block">
                Step 5 of 5
              </span>
              <h2 className="font-display font-black text-2xl sm:text-3xl text-slate-900">
                Order Review & Instant Payment
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Scan the dynamic UPI QR code, complete payment, and submit your 12-digit UTR and screenshot for super admin approval.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: Itemized Invoice Summary */}
              <div className="md:col-span-6 space-y-4">
                <Card className="p-5 bg-white border-slate-200 shadow-sm space-y-4">
                  <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                    Itemized Investment Breakdown
                  </h3>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center py-1 border-b border-slate-100">
                      <div>
                        <span className="font-bold text-slate-900">{planInfo.name} Plan Tier</span>
                        <span className="text-[10px] text-slate-500 block">({billingCycle === 'monthly' ? 'Monthly' : 'Annual'})</span>
                      </div>
                      <span className="font-mono font-bold text-slate-900">₹{planPrice.toLocaleString('en-IN')}</span>
                    </div>

                    <div className="flex justify-between items-center py-1 border-b border-slate-100">
                      <div>
                        <span className="font-medium text-slate-700">
                          {domainType === 'subdomain' ? 'Institutional Subdomain' : `Domain: ${customDomainName}${customDomainExt}`}
                        </span>
                        <span className="text-[10px] text-slate-500 block">
                          {domainType === 'subdomain' ? 'Included Free' : '1 Year Registration & DNS'}
                        </span>
                      </div>
                      <span className="font-mono font-bold text-slate-900">
                        {domainPrice > 0 ? `+₹${domainPrice.toLocaleString('en-IN')}` : '₹0 (Free)'}
                      </span>
                    </div>

                    {addonGoogleSubmit && (
                      <div className="flex justify-between items-center py-1 border-b border-slate-100">
                        <span className="text-slate-700">Google Search Console Submission</span>
                        <span className="font-mono font-bold text-[#163A2B]">+₹999</span>
                      </div>
                    )}

                    {addonGoogleMaps && (
                      <div className="flex justify-between items-center py-1 border-b border-slate-100">
                        <span className="text-slate-700">Google Maps GPS Location Pin</span>
                        <span className="font-mono font-bold text-[#163A2B]">+₹499</span>
                      </div>
                    )}

                    {addonPlayStore && (
                      <div className="flex justify-between items-center py-1 border-b border-slate-100">
                        <span className="text-slate-700">Google Play Store App Publishing</span>
                        <span className="font-mono font-bold text-purple-700">+₹5,000</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t-2 border-slate-100 flex justify-between items-baseline">
                    <span className="font-display font-bold text-base text-slate-900">Total Amount Payable</span>
                    <span className="font-display font-black text-2xl text-[#163A2B]">
                      ₹{totalPayable.toLocaleString('en-IN')}
                    </span>
                  </div>
                </Card>

                {/* Contact Person Details */}
                <Card className="p-5 bg-white border-slate-200 shadow-sm space-y-3 text-xs">
                  <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                    School Administrator Contact
                  </h4>
                  <div className="space-y-2">
                    <label className="text-[11px] font-semibold text-slate-600">Contact Person Name</label>
                    <Input
                      value={payerName}
                      onChange={(e) => setPayerName(e.target.value)}
                      required
                      className="bg-slate-50 border-slate-300 text-xs text-slate-900 focus:bg-white focus:border-[#163A2B]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-semibold text-slate-600">Mobile / WhatsApp Number (for SMS Alerts)</label>
                    <Input
                      value={payerPhone}
                      onChange={(e) => setPayerPhone(e.target.value)}
                      required
                      placeholder="9876543210"
                      className="bg-slate-50 border-slate-300 text-xs text-slate-900 focus:bg-white focus:border-[#163A2B]"
                    />
                  </div>
                </Card>
              </div>

              {/* Right Column: Dynamic UPI QR Code & Payment Verification Form */}
              <div className="md:col-span-6 space-y-4">
                <Card className="p-5 bg-white border-emerald-200 shadow-sm text-center space-y-4">
                  <span className="text-xs font-bold text-[#163A2B] uppercase tracking-wider block">
                    Instant UPI Payment QR Code
                  </span>

                  {/* QR Code Canvas Frame */}
                  <div className="p-4 bg-white rounded-2xl inline-block shadow-md mx-auto border-2 border-[#163A2B]/20">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi%3A%2F%2Fpay%3Fpa%3Deduportal%40icici%26pn%3DEduPortal%26am%3D${totalPayable}%26cu%3DINR`}
                      alt="UPI Payment QR Code"
                      className="w-48 h-48 mx-auto"
                    />
                    <span className="text-[10px] font-mono font-bold text-slate-900 block mt-1">
                      Scan to Pay ₹{totalPayable.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-slate-500">UPI ID:</span>
                      <span className="font-mono font-bold text-[#163A2B]">eduportal@icici</span>
                      <button
                        type="button"
                        onClick={handleCopyUpi}
                        className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
                        title="Copy UPI ID"
                      >
                        {copiedUpi ? <Check className="w-3.5 h-3.5 text-[#163A2B]" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <span className="text-[11px] text-slate-500 block">
                      Compatible with Google Pay, PhonePe, Paytm, BHIM & Any Bank UPI App
                    </span>
                  </div>
                </Card>

                {/* Transaction Proof Submission Form */}
                <Card className="p-5 bg-white border-slate-200 shadow-sm space-y-3 text-xs">
                  <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                    Submit Payment Verification Proof
                  </h4>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-slate-700">
                      12-Digit UPI Transaction ID / UTR Number <span className="text-rose-500">*</span>
                    </label>
                    <Input
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      placeholder="e.g. 428901847291"
                      required
                      className="bg-slate-50 border-slate-300 text-[#163A2B] font-mono font-bold text-sm tracking-wider focus:bg-white focus:border-[#163A2B]"
                    />
                    <span className="text-[10px] text-slate-500">
                      Found in your GPay / PhonePe / Paytm receipt details as "UPI Ref ID" or "UTR".
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-slate-700">
                      Upload Payment Screenshot / Receipt Photo <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleReceiptUpload}
                      className="block w-full text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#163A2B] file:text-white hover:file:bg-[#0F2A1F] cursor-pointer"
                    />
                    {receiptImage && (
                      <div className="mt-2 p-2 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3">
                        <img src={receiptImage} alt="Receipt preview" className="w-12 h-12 object-cover rounded-lg" />
                        <span className="text-[11px] text-[#163A2B] font-semibold">✓ Payment receipt uploaded</span>
                      </div>
                    )}
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full bg-[#163A2B] hover:bg-[#0F2A1F] text-white font-black py-3 text-sm mt-3 shadow-md cursor-pointer"
                  >
                    Submit Order & Request Instant Activation →
                  </Button>
                </Card>
              </div>

            </div>

            {/* Back Button */}
            <div className="pt-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setCurrentStep(4)}
                className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs flex items-center gap-1.5 shadow-xs"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Theme & Template</span>
              </Button>
            </div>
          </form>
        )}

        {/* =================================================================================== */}
        {/* STEP 6: APPROVAL STATUS & SUPER ADMIN SIMULATION */}
        {/* =================================================================================== */}
        {currentStep === 6 && activeOrder && (
          <div className="space-y-8 max-w-2xl mx-auto text-center animate-in fade-in">
            {activeOrder.status === 'pending_approval' ? (
              <Card className="p-8 bg-white border-amber-300 shadow-md space-y-6">
                <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto text-2xl animate-pulse">
                  ⏳
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-mono font-bold text-amber-800 px-3 py-1 rounded-full bg-amber-100">
                    Order Ref: {activeOrder.orderId}
                  </span>
                  <h3 className="font-display font-black text-2xl text-slate-900">
                    Order Submitted! Waiting for Super Admin Approval
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
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
                    <span className="font-bold text-slate-900 font-mono">₹{activeOrder.totalAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Notification Phone:</span>
                    <span className="font-bold text-slate-900">{activeOrder.payerPhone}</span>
                  </div>
                </div>

                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-[#163A2B] font-medium">
                  📱 "You will be notified via SMS/WhatsApp once our Super Admin approves your school!"
                </div>

                {/* Instant Super Admin Approval Demo Trigger */}
                <div className="pt-4 border-t border-slate-100 space-y-2">
                  <span className="text-[11px] text-slate-500 block">
                    Developer & Testing Shortcut:
                  </span>
                  <Button
                    type="button"
                    onClick={handleInstantApprove}
                    variant="primary"
                    className="w-full bg-[#163A2B] hover:bg-[#0F2A1F] text-white font-bold py-2.5 text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-300" />
                    <span>Super Admin Instant Approve & Provision School</span>
                  </Button>
                </div>
              </Card>
            ) : (
              /* Approved State */
              <Card className="p-8 bg-white border-emerald-500 shadow-lg space-y-6">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-[#163A2B] border border-emerald-200 flex items-center justify-center mx-auto text-2xl">
                  ✓
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-mono font-bold text-[#163A2B] px-3 py-1 rounded-full bg-emerald-100">
                    Tenant Activated: {activeOrder.orderId}
                  </span>
                  <h3 className="font-display font-black text-2xl text-slate-900">
                    Congratulations! {activeOrder.schoolName} is Live!
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
                    Your institutional workspace has been provisioned with all {PLANS_CONFIG[activeOrder.planTier].modules.length} modules, custom theme, and templates.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Button
                    type="button"
                    onClick={() => {
                      setShowGuidedTour(true);
                      setAdminSetupModal(true);
                    }}
                    className="bg-[#163A2B] hover:bg-[#0F2A1F] text-white font-black px-6 py-2.5 text-xs shadow-md cursor-pointer"
                  >
                    Setup School Admin Credentials & Take Tour →
                  </Button>

                  <Link href="/?view=school">
                    <Button
                      type="button"
                      variant="secondary"
                      className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs px-5 py-2.5 shadow-xs flex items-center gap-1.5"
                    >
                      <Globe className="w-3.5 h-3.5 text-[#163A2B]" />
                      <span>Preview School Website</span>
                    </Button>
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
          <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-2xl p-6 text-slate-900 space-y-5 animate-in zoom-in-95">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#163A2B] flex items-center justify-center font-bold text-lg border border-emerald-200">
                🔐
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-slate-900">
                  Setup School Admin Credentials
                </h3>
                <span className="text-[10px] text-[#163A2B] font-semibold">Initial Institutional Master Account</span>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-700">Admin Email ID</label>
                <Input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="bg-slate-50 border-slate-300 text-xs text-slate-900 focus:bg-white focus:border-[#163A2B]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-700">Set Admin Password</label>
                <Input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="bg-slate-50 border-slate-300 text-xs text-slate-900 focus:bg-white focus:border-[#163A2B]"
                />
              </div>
            </div>

            {/* Guided Tour Tips with Arrows */}
            <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 space-y-2 text-xs">
              <span className="font-bold text-[#163A2B] block">
                👉 How to Enter Your Admin Panel:
              </span>
              <p className="text-[11px] text-slate-700 leading-relaxed">
                1. <strong>Secret Gesture:</strong> On the top header, tap your school logo <strong>5 times quickly</strong> to unlock the Secret Admin Gateway!
              </p>
              <p className="text-[11px] text-slate-700 leading-relaxed">
                2. <strong>Dashboard Drawer:</strong> Or click the <strong>[☰ Dashboard]</strong> button on the left to access your Admin Panel, Principal Cockpit, and Student Portal.
              </p>
            </div>

            <Button
              type="button"
              onClick={() => {
                setAdminSetupModal(false);
                router.push('/admin/dashboard');
              }}
              className="w-full bg-[#163A2B] hover:bg-[#0F2A1F] text-white font-black py-2.5 text-xs cursor-pointer shadow-md"
            >
              Save Credentials & Enter Admin Panel →
            </Button>
          </div>
        </div>
      )}

    </div>
  );
}
