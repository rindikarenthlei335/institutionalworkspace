'use client';

export const runtime = 'edge';

import React, { useState } from 'react';
import Link from 'next/link';
import { Check, Zap, ArrowRight, ShieldCheck, Sparkles, Plus, CheckSquare, Square } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export interface PlanDetail {
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  tagline: string;
  color: string;
  badge?: string;
  features: string[];
  locked: string[];
}

const PLANS: Record<'basic' | 'essential' | 'pro', PlanDetail> = {
  basic: {
    name: 'BASIC',
    monthlyPrice: 1499,
    yearlyPrice: 14990,
    tagline: 'Core digital services for standard schools',
    color: '#8A9BA0',
    features: [
      'School website with 6 public modules',
      'Logo & theme customisation (8 presets)',
      'Admin panel & CMS notice board',
      'Notice board & digital gallery',
      'Mobile-responsive PWA website',
      'EduPortal subdomain (e.g. school.eduportal.com)'
    ],
    locked: [
      'Online fee payment & Razorpay',
      'Student CRUD & admissions',
      'Principal dashboard & KPIs',
      'Exams & Marksheet generator',
      'AI Copilot assistant'
    ]
  },
  essential: {
    name: 'ESSENTIAL',
    badge: 'Most popular',
    monthlyPrice: 3999,
    yearlyPrice: 39990,
    tagline: 'Essential school administration & fee processing',
    color: '#BB9877',
    features: [
      'Everything in Basic',
      'Fee payment with UPI (Day scholar & Hosteller)',
      'Online admission with instant fee collection',
      'Student management (Class, Section, Guardian info)',
      'Admin roles: Super Admin + Data Entry Operator',
      'Fee approval queue with UTR verification',
      'Bank statement CSV auto-match'
    ],
    locked: [
      'Principal executive dashboard & KPIs',
      'Website analytics & visitor telemetry',
      'White-label mobile app publishing',
      'AI Copilot (Mizo + English)'
    ]
  },
  pro: {
    name: 'PRO',
    monthlyPrice: 8000,
    yearlyPrice: 79990,
    tagline: 'Comprehensive institutional management with AI',
    color: '#163A2B',
    features: [
      'Everything in Essential',
      'Principal dashboard with 10 real-time KPIs',
      'Website analytics & visitor telemetry',
      'Exams & Marksheet studio with QR verification',
      'PVC ID Card generator with photo upload',
      'Bank statement CSV auto-matching',
      'Google Maps & Search Console submission',
      'Discounted custom domain (.edu.in / .com)',
      'AI Copilot (Mizo + English) included'
    ],
    locked: []
  }
};

interface AddonService {
  id: string;
  name: string;
  monthlyPrice: number;
  desc: string;
  category: string;
}

const ADDON_SERVICES: AddonService[] = [
  {
    id: 'sms_whatsapp',
    name: 'SMS / WhatsApp Automated Alerts',
    monthlyPrice: 499,
    desc: 'Instant fee due reminders, attendance alerts, and holiday notifications sent to parents.',
    category: 'Communication'
  },
  {
    id: 'attendance',
    name: 'Daily Attendance & Biometric Sync',
    monthlyPrice: 799,
    desc: 'RFID / biometric attendance integration with real-time absentee SMS to parents.',
    category: 'Academics'
  },
  {
    id: 'exam_results',
    name: 'Exam Results & Marksheets Studio',
    monthlyPrice: 999,
    desc: 'CBSE & State board marksheet generator with online QR verification deed.',
    category: 'Academics'
  },
  {
    id: 'certificates',
    name: 'TC / Character & Bonafide Generator',
    monthlyPrice: 599,
    desc: 'One-click Transfer Certificate (TC) & Bonafide generation with tamper-proof tokens.',
    category: 'Documents'
  },
  {
    id: 'id_cards',
    name: 'PVC ID Card Batch Studio',
    monthlyPrice: 499,
    desc: 'Design and print student & faculty ID cards in CR80 PVC format with QR codes.',
    category: 'Documents'
  },
  {
    id: 'transport',
    name: 'Transport & Bus Tracking Hub',
    monthlyPrice: 1299,
    desc: 'School bus route management, vehicle stops, driver records, and transport fees.',
    category: 'Operations'
  },
  {
    id: 'extra_storage',
    name: 'Cloud Storage Expansion (50 GB)',
    monthlyPrice: 299,
    desc: 'High-speed Cloudflare R2 storage for annual magazines, HD galleries, and archives.',
    category: 'Infrastructure'
  },
  {
    id: 'domain_email',
    name: 'Official Institutional Email Pack',
    monthlyPrice: 399,
    desc: '5 professional Google Workspace / Zoho emails (principal@yourschool.edu.in).',
    category: 'Infrastructure'
  }
];

export default function PlansPricingPage() {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'essential' | 'pro'>('essential');
  const [selectedAddons, setSelectedAddons] = useState<string[]>(['sms_whatsapp', 'attendance']);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [schoolName, setSchoolName] = useState('');
  const [subdomain, setSubdomain] = useState('');
  const [provisionSuccess, setProvisionSuccess] = useState(false);

  const toggleAddon = (id: string) => {
    setSelectedAddons(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const planPrice = billing === 'monthly'
    ? PLANS[selectedPlan].monthlyPrice
    : Math.round(PLANS[selectedPlan].yearlyPrice / 12);

  const addonsTotalMonthly = selectedAddons.reduce((sum, id) => {
    const addon = ADDON_SERVICES.find(a => a.id === id);
    return sum + (addon ? addon.monthlyPrice : 0);
  }, 0);

  const totalPriceMonthly = planPrice + addonsTotalMonthly;

  const handleLaunchSchool = (e: React.FormEvent) => {
    e.preventDefault();
    setProvisionSuccess(true);
    setTimeout(() => {
      window.location.href = `/admin/dashboard?tenant=${subdomain || 'newschool'}&plan=${selectedPlan}`;
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] pb-24">
      {/* Top Banner */}
      <section className="bg-gradient-to-b from-[#163A2B] to-[#0F2A1F] text-white pt-16 pb-20 px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-white/90">
            <Zap className="w-3.5 h-3.5 text-yellow-300" />
            Plan options for schools of every size
          </div>
          <h1 className="font-display font-bold text-4xl md:text-5xl leading-tight">
            A complete digital platform<br className="hidden sm:inline" /> for educational institutions.
          </h1>
          <p className="text-base text-white/80 max-w-2xl mx-auto leading-relaxed">
            Manage the school website, parent portal, fees, admissions and administration through one secure, modular system.
          </p>

          {/* Billing Interval Toggle */}
          <div className="pt-6 flex justify-center">
            <div className="inline-flex items-center bg-white/10 p-1.5 rounded-xl border border-white/20">
              <button
                type="button"
                onClick={() => setBilling('monthly')}
                className={`px-5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  billing === 'monthly'
                    ? 'bg-white text-[#163A2B] shadow-sm'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setBilling('yearly')}
                className={`px-5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  billing === 'yearly'
                    ? 'bg-white text-[#163A2B] shadow-sm'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                <span>Yearly</span>
                <span className="bg-emerald-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                  Save 17%
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Core Tier Plans Grid */}
      <section className="max-w-7xl mx-auto px-4 -mt-10">
        <div className="grid md:grid-cols-3 gap-6">
          {(['basic', 'essential', 'pro'] as const).map((key) => {
            const plan = PLANS[key];
            const isSelected = selectedPlan === key;
            const price = billing === 'monthly' ? plan.monthlyPrice : Math.round(plan.yearlyPrice / 12);

            return (
              <div
                key={key}
                onClick={() => setSelectedPlan(key)}
                className={`relative flex flex-col rounded-2xl border p-7 transition-all cursor-pointer bg-white ${
                  isSelected
                    ? 'ring-2 ring-emerald-600 border-emerald-600 shadow-xl'
                    : 'border-slate-200 hover:border-slate-300 shadow-sm'
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#163A2B] text-white text-[11px] font-bold shadow-md">
                    {plan.badge}
                  </div>
                )}

                {/* Plan Header */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: plan.color }} />
                      <span className="font-mono text-xs font-bold text-slate-500 uppercase tracking-widest">{plan.name}</span>
                    </div>
                    {isSelected && (
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        ACTIVE SELECTION
                      </span>
                    )}
                  </div>

                  <div className="flex items-baseline gap-1 my-3">
                    <span className="text-2xl font-bold text-slate-400">₹</span>
                    <span className="font-display font-extrabold text-4xl text-slate-900 tabular-nums">
                      {price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">/mo</span>
                  </div>

                  {billing === 'yearly' && (
                    <p className="text-[11px] font-semibold text-emerald-700">
                      Billed ₹{plan.yearlyPrice.toLocaleString('en-IN')}/year
                    </p>
                  )}

                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {plan.tagline}
                  </p>
                </div>

                <Button
                  variant={isSelected ? 'primary' : 'secondary'}
                  className="w-full mb-6 font-bold"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPlan(key);
                  }}
                >
                  {isSelected ? '✓ Plan Selected' : 'Select this plan'}
                </Button>

                {/* Feature Inclusions */}
                <div className="space-y-3 flex-1 border-t border-slate-100 pt-5">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Features Included</p>
                  {plan.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-800">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}

                  {plan.locked.length > 0 && (
                    <div className="pt-2 space-y-2 opacity-40">
                      {plan.locked.map((lock, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-500 line-through">
                          <span className="w-4 h-4 shrink-0 flex items-center justify-center font-bold text-xs">—</span>
                          <span>{lock}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Interactive Add-On Services with Checkboxes */}
      <section className="max-w-7xl mx-auto px-4 mt-16">
        <div className="text-center max-w-3xl mx-auto mb-8 space-y-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300 uppercase tracking-wider">
            Extend Your Plan (Add-Ons)
          </span>
          <h2 className="font-display font-bold text-3xl text-slate-900">
            Custom Add-On Modules & Integrations
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Tick any additional modules and features you want for your institution. Your price updates in real-time.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ADDON_SERVICES.map((addon) => {
            const isChecked = selectedAddons.includes(addon.id);

            return (
              <div
                key={addon.id}
                onClick={() => toggleAddon(addon.id)}
                className={`p-5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isChecked
                    ? 'border-emerald-600 bg-emerald-50/60 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300 shadow-2xs'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded">
                      {addon.category}
                    </span>
                    <button
                      type="button"
                      className="text-emerald-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleAddon(addon.id);
                      }}
                    >
                      {isChecked ? (
                        <CheckSquare className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-300 hover:text-slate-400" />
                      )}
                    </button>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 mb-1.5">{addon.name}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">{addon.desc}</p>
                </div>

                <div className="flex items-baseline justify-between pt-3 border-t border-slate-100">
                  <span className="text-[11px] font-medium text-slate-500">Monthly Add-on</span>
                  <span className="font-mono font-bold text-sm text-emerald-800">
                    +₹{addon.monthlyPrice}/mo
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Floating Real-Time Plan Summary Bar */}
      <div className="fixed bottom-0 inset-x-0 bg-white border-t border-slate-200 shadow-2xl p-4 z-40">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Selected Plan:</span>
              <span className="text-sm font-bold text-slate-900 uppercase">
                {PLANS[selectedPlan].name} (₹{planPrice.toLocaleString('en-IN')}/mo)
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs text-emerald-700 font-semibold">
                {selectedAddons.length} Add-on(s) selected (+₹{addonsTotalMonthly}/mo)
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Instant activation with live database provisioning, no setup fee.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-xs text-slate-500 block leading-none">Total Estimated Investment</span>
              <span className="font-display font-extrabold text-2xl text-[#163A2B] tabular-nums leading-tight">
                ₹{totalPriceMonthly.toLocaleString('en-IN')}
                <span className="text-xs font-normal text-slate-500">/mo</span>
              </span>
            </div>

            <Button
              size="lg"
              variant="primary"
              onClick={() => setShowCheckoutModal(true)}
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md"
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Configure & Launch School →
            </Button>
          </div>
        </div>
      </div>

      {/* Onboarding & Provisioning Modal */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-5 text-slate-900">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Instant Provisioning</span>
                <h3 className="font-display font-bold text-lg text-slate-900">Launch Your School Workspace</h3>
              </div>
              <button
                onClick={() => setShowCheckoutModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            {/* Selected Summary */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-600">Base Tier:</span>
                <span className="font-bold text-slate-900">{PLANS[selectedPlan].name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Active Add-Ons:</span>
                <span className="font-bold text-slate-900">{selectedAddons.length} Selected</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-1 text-emerald-800 font-bold">
                <span>Total Monthly Billing:</span>
                <span>₹{totalPriceMonthly.toLocaleString('en-IN')}/mo</span>
              </div>
            </div>

            <form onSubmit={handleLaunchSchool} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">School / Institution Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Greenwood Higher Secondary School"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Desired School Subdomain</label>
                <div className="flex items-center">
                  <input
                    type="text"
                    required
                    placeholder="greenwood"
                    value={subdomain}
                    onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 font-mono"
                  />
                  <span className="px-3 py-2 bg-slate-100 border border-l-0 border-slate-300 rounded-r-lg font-mono text-slate-500">
                    .eduportal.com
                  </span>
                </div>
              </div>

              {provisionSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-lg text-xs font-semibold">
                  ✓ School workspace provisioned with selected tier and add-ons! Redirecting to Admin Dashboard...
                </div>
              )}

              <Button
                variant="primary"
                type="submit"
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5"
                disabled={provisionSuccess}
              >
                {provisionSuccess ? 'Launching Workspace...' : `Confirm & Launch (₹${totalPriceMonthly.toLocaleString('en-IN')}/mo)`}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
