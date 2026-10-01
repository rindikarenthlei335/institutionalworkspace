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

// 3 Core Active Plans (Basic 1499, Essential 3999, Pro 8000)
// 9999 plan omitted per user request
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
    modules: []
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

            {/* 3 Tier Cards (Basic, Essential, Pro) - 9999 plan removed, clean 3-col grid */}
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
        {/* STEP 2: DOMAIN SETUP (Custom Subdomain vs Domain Register Service) */}
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
                Choose between a free instant institutional subdomain or register a custom official domain (.edu.in, .com, .in).
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
                This official name will be configured on your website header, report cards, ID cards, and receipts.
              </span>
            </Card>

            {/* Domain Type Tabs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                onClick={() => setDomainType('subdomain')}
                className={`p-6 rounded-3xl border-2 cursor-pointer transition-all bg-white ${
                  domainType === 'subdomain'
                    ? 'border-[#163A2B] ring-4 ring-emerald-600/10 shadow-lg'
                    : 'border-slate-200 hover:border-slate-300 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-[#163A2B] uppercase tracking-wider">Option A</span>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-[#163A2B]">
                    Included Free (₹0)
                  </span>
                </div>
                <h4 className="font-extrabold text-base text-slate-900 mt-2">Instant Institutional Subdomain</h4>
                <p className="text-xs text-slate-600 mt-1 font-normal">
                  Active instantly with zero setup time. Perfect for launching right away.
                </p>
                <div className="mt-4 text-xs font-mono font-bold text-[#163A2B] bg-slate-50 p-3 rounded-xl border border-slate-200">
                  https://{subdomain || 'schoolname'}.eduportal.in
                </div>
              </div>

              <div
                onClick={() => setDomainType('custom_domain')}
                className={`p-6 rounded-3xl border-2 cursor-pointer transition-all bg-white ${
                  domainType === 'custom_domain'
                    ? 'border-[#163A2B] ring-4 ring-emerald-600/10 shadow-lg'
                    : 'border-slate-200 hover:border-slate-300 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-amber-800 uppercase tracking-wider">Option B</span>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-900">
                    Official Domain Service
                  </span>
                </div>
                <h4 className="font-extrabold text-base text-slate-900 mt-2">Register Custom Domain</h4>
                <p className="text-xs text-slate-600 mt-1 font-normal">
                  Buy official institutional domain (.edu.in, .ac.in, .com, .in) with DNS provisioning.
                </p>
                <div className="mt-4 text-xs font-mono font-bold text-amber-800 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  https://www.{customDomainName || 'schoolname'}{customDomainExt}
                </div>
              </div>
            </div>

            {/* Details for Option A: Subdomain */}
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
                  ✓ Instant SSL Certificate, CDN routing & DDoS protection included free.
                </span>
              </Card>
            )}

            {/* Details for Option B: Domain Registration Service */}
            {domainType === 'custom_domain' && (
              <div className="space-y-6">
                <Card className="p-6 bg-white border border-slate-200 rounded-3xl shadow-sm space-y-4">
                  <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Select Domain Extension & Pricing
                  </label>
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
                          <span className="font-black text-sm text-[#163A2B]">₹{d.price}/yr</span>
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

                {/* 5 Required Documents for Educational Domains (.edu.in / .ac.in) */}
                {selectedDomainOption?.requiresDocs && (
                  <Card className="p-6 bg-amber-50/50 border-2 border-amber-200 rounded-3xl shadow-sm space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-xl bg-amber-100 text-amber-800 shrink-0">
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
                    <div className="p-3.5 bg-amber-100/70 rounded-2xl border border-amber-300 flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="uploadLater"
                        checked={uploadDocsLater}
                        onChange={(e) => setUploadDocsLater(e.target.checked)}
                        className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                      />
                      <label htmlFor="uploadLater" className="text-xs text-amber-950 cursor-pointer font-bold">
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
        {/* STEP 3: ADD-ON SERVICES (Checkboxes with Prices) */}
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
                Tick the additional digital outreach services you want to bundle with your institutional workspace.
              </p>
            </div>

            <div className="space-y-4">
              
              {/* Addon 1: Google Search Console Submit */}
              <div
                onClick={() => setAddonGoogleSubmit(!addonGoogleSubmit)}
                className={`p-6 rounded-3xl border-2 transition-all cursor-pointer bg-white ${
                  addonGoogleSubmit
                    ? 'border-[#163A2B] ring-4 ring-emerald-600/10 shadow-lg bg-emerald-50/20'
                    : 'border-slate-200 hover:border-slate-300 shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className="mt-1">
                      {addonGoogleSubmit ? (
                        <CheckSquare className="w-6 h-6 text-[#163A2B]" />
                      ) : (
                        <Square className="w-6 h-6 text-slate-400" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <Search className="w-5 h-5 text-[#163A2B]" />
                        <h4 className="font-extrabold text-base text-slate-900">Google Search Console & SEO Submission</h4>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed font-normal">
                        Full XML sitemap generation, Google Search indexing submission, and Bing/IndexNow pinging so parents find your school instantly on Google.
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-black text-lg text-[#163A2B]">+₹999</span>
                    <span className="text-[10px] text-slate-500 font-bold block">One-time setup</span>
                  </div>
                </div>
              </div>

              {/* Addon 2: Google Maps Location Verification */}
              <div
                className={`p-6 rounded-3xl border-2 transition-all bg-white ${
                  addonGoogleMaps
                    ? 'border-[#163A2B] ring-4 ring-emerald-600/10 shadow-lg bg-emerald-50/20'
                    : 'border-slate-200 hover:border-slate-300 shadow-sm'
                }`}
              >
                <div
                  className="flex items-start justify-between gap-4 cursor-pointer"
                  onClick={() => setAddonGoogleMaps(!addonGoogleMaps)}
                >
                  <div className="flex items-start gap-3.5">
                    <div className="mt-1">
                      {addonGoogleMaps ? (
                        <CheckSquare className="w-6 h-6 text-[#163A2B]" />
                      ) : (
                        <Square className="w-6 h-6 text-slate-400" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-amber-700" />
                        <h4 className="font-extrabold text-base text-slate-900">Google Maps Institutional Location Pin</h4>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed font-normal">
                        Embedding live Google Maps GPS location on your school website so visiting parents and bus drivers navigate easily.
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-black text-lg text-[#163A2B]">+₹499</span>
                    <span className="text-[10px] text-slate-500 font-bold block">One-time setup</span>
                  </div>
                </div>

                {addonGoogleMaps && (
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
                        <h4 className="font-extrabold text-base text-slate-900">Google Play Store Android App Publishing</h4>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed font-normal">
                        Dedicated branded Android APK compiled, signed, and uploaded to Google Play Store under institutional developer account.
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-black text-lg text-purple-700">+₹5,000</span>
                    <span className="text-[10px] text-slate-500 font-bold block">Publishing fee</span>
                  </div>
                </div>

                {addonPlayStore && (
                  <div className="mt-4 pt-4 border-t border-purple-100">
                    <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 space-y-1.5 text-xs">
                      <span className="font-extrabold text-purple-950 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-purple-700" />
                        <span>Crucial Timeline Note: 30 – 50 Days Required</span>
                      </span>
                      <p className="text-[11px] text-purple-900 leading-relaxed font-normal">
                        Google Play Console mandates a strict 14-day closed testing period with 12 opted-in testers and D-U-N-S business organization verification before an institutional app is approved for public store download.
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
        {/* STEP 5: SUMMARY & PAYMENT SUBMISSION (QR Code, UTR & Screenshot) */}
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
                          {domainType === 'subdomain' ? 'Institutional Subdomain' : `Domain: ${customDomainName}${customDomainExt}`}
                        </span>
                        <span className="text-[10px] text-slate-500 block">
                          {domainType === 'subdomain' ? 'Included Free' : '1 Year Registration & DNS'}
                        </span>
                      </div>
                      <span className="font-bold text-slate-900 text-sm">
                        {domainPrice > 0 ? `+₹${domainPrice.toLocaleString('en-IN')}` : '₹0 (Free)'}
                      </span>
                    </div>

                    {addonGoogleSubmit && (
                      <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                        <span className="text-slate-700 font-medium">Google Search Console Submission</span>
                        <span className="font-bold text-[#163A2B] text-sm">+₹999</span>
                      </div>
                    )}

                    {addonGoogleMaps && (
                      <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                        <span className="text-slate-700 font-medium">Google Maps GPS Location Pin</span>
                        <span className="font-bold text-[#163A2B] text-sm">+₹499</span>
                      </div>
                    )}

                    {addonPlayStore && (
                      <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                        <span className="text-slate-700 font-medium">Google Play Store App Publishing</span>
                        <span className="font-bold text-purple-700 text-sm">+₹5,000</span>
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
