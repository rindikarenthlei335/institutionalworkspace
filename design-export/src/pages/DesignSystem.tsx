import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Badge, PlanBadge } from '../components/ui/Badge';
import { Input, PasswordInput } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { Skeleton, SkeletonCard, SkeletonStat } from '../components/ui/Skeleton';
import { StatCard } from '../components/ui/StatCard';
import { SuccessCheck } from '../components/ui/Toast';
import { Lock, ArrowRight, Bell, Search, Building2, BookOpen, CalendarDays, GraduationCap, Receipt, Shield, Users, Zap } from 'lucide-react';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-14">
      <div className="flex items-center gap-4 mb-6">
        <p className="text-[11px] font-semibold text-fg-muted uppercase tracking-widest shrink-0">{title}</p>
        <div className="flex-1 h-px bg-border-default" />
      </div>
      {children}
    </section>
  );
}

const colorTokens = [
  { name: 'bg/base',     hex: '#EAEFEC', cls: 'bg-base',     label: 'Main background' },
  { name: 'bg/surface',  hex: '#FFFFFF', cls: 'bg-surface',  label: 'Cards & panels' },
  { name: 'bg/elevated', hex: '#E3EAE6', cls: 'bg-elevated', label: 'Inputs & hover' },
  { name: 'brand/primary', hex: '#1F4D3A', cls: 'bg-brand',  label: 'Forest green accent' },
  { name: 'brand/primary-hover', hex: '#163A2B', cls: 'bg-brand-hover', label: 'Primary hover' },
  { name: 'brand/primary-soft', hex: '#D5E6DC', cls: 'bg-brand-soft', label: 'Selected states' },
  { name: 'brand/on-primary', hex: '#FFFFFF', cls: 'bg-on-brand', label: 'On primary' },
  { name: 'text/primary', hex: '#0F1A14', cls: 'bg-fg',      label: 'Primary text' },
  { name: 'text/secondary', hex: '#46574E', cls: 'bg-fg-muted', label: 'Secondary text' },
  { name: 'border/subtle', hex: '#C5D2CB', cls: 'bg-border', label: 'Row dividers' },
  { name: 'border/default', hex: '#A9BAB1', cls: 'bg-border-default', label: 'Controls & cards' },
  { name: 'border/strong', hex: '#7F958A', cls: 'bg-border-strong', label: 'Header dividers' },
  { name: 'status/success', hex: '#2E9E6B', cls: 'bg-success', label: 'Success' },
  { name: 'status/warning', hex: '#D9A23A', cls: 'bg-warning', label: 'Warning' },
  { name: 'status/error',   hex: '#C9504A', cls: 'bg-error',   label: 'Error' },
  { name: 'status/pending', hex: '#7A8A82', cls: 'bg-pending', label: 'Pending' },
];

const darkHex: Record<string, string> = {
  'bg/base': '#0F1F18', 'bg/surface': '#16291F', 'bg/elevated': '#1F3A2C',
  'brand/primary': '#4FA37A', 'brand/primary-hover': '#63B88E',
  'brand/primary-soft': '#1D3A2B', 'brand/on-primary': '#0F1F18',
  'text/primary': '#F2F7F4', 'text/secondary': '#93A79C',
  'border/subtle': '#2E4A3D', 'border/default': '#3F6151', 'border/strong': '#5C8570',
  'status/success': '#43B982', 'status/warning': '#E8B957',
  'status/error': '#E06B65', 'status/pending': '#9AACA3',
};

const typeScale = [
  { name: 'Display',  size: '48px / 56', weight: 700, cls: 'font-display text-[40px] leading-[48px] font-bold',    font: 'Source Serif 4' },
  { name: 'H1',       size: '32px / 40', weight: 700, cls: 'font-display text-[32px] leading-[40px] font-bold',    font: 'Source Serif 4' },
  { name: 'H2',       size: '24px / 32', weight: 600, cls: 'font-display text-[24px] leading-[32px] font-semibold',font: 'Source Serif 4' },
  { name: 'H3',       size: '18px / 26', weight: 600, cls: 'font-display text-[18px] leading-[26px] font-semibold',font: 'Source Serif 4' },
  { name: 'Body',     size: '16px / 26', weight: 400, cls: 'text-[16px] leading-[26px] font-normal',               font: 'Inter' },
  { name: 'Small',    size: '14px / 22', weight: 400, cls: 'text-[14px] leading-[22px] font-normal',               font: 'Inter' },
  { name: 'Caption',  size: '12px / 16', weight: 500, cls: 'text-[12px] leading-[16px] font-medium',               font: 'Inter' },
  { name: 'Mono/Num', size: '14px / 20', weight: 500, cls: 'font-mono text-[14px] leading-[20px] tabular-nums',    font: 'JetBrains Mono' },
];

const motionSpecs = [
  { name: 'Hover',        duration: '150ms', easing: 'ease-out', use: 'Button hover, card border' },
  { name: 'UI transition',duration: '250ms', easing: 'cubic-bezier(0.22,1,0.36,1)', use: 'Sliding pill, modals, tab change' },
  { name: 'Page reveal',  duration: '400ms', easing: 'cubic-bezier(0.22,1,0.36,1)', use: 'Fade-up on scroll, hero text' },
  { name: 'Hero / enter', duration: '600ms', easing: 'cubic-bezier(0.22,1,0.36,1)', use: 'First-load hero, gallery fade' },
  { name: 'Count-up',     duration: '1200ms',easing: 'cubic-bezier(0,0,0.2,1)',     use: 'Stat card numbers' },
  { name: 'Bottom sheet', duration: '350ms', easing: 'cubic-bezier(0.22,1,0.36,1)', use: 'Mobile modals / drawers' },
];

export function DesignSystem() {
  const [loading, setLoading] = useState(false);
  const [dark, setDark] = useState(false);
  const [previewPlan, setPreviewPlan] = useState<'basic' | 'essential' | 'pro'>('essential');
  const sparkline = [30, 45, 38, 60, 52, 70, 65, 80, 72, 84];

  return (
    <div className={`${dark ? 'theme-dark' : ''} bg-base text-fg min-h-full`}>
    <div className="max-w-5xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-[4px] border border-brand/50 bg-brand/8 mb-5">
          <Shield className="w-3.5 h-3.5 text-brand" strokeWidth={1.5}/>
          <span className="text-[12px] text-brand font-semibold">EduPortal Design System v2.0</span>
        </div>
        <div className="flex items-end justify-between gap-6">
        <div>
        <h1 className="font-display font-semibold text-[32px] leading-[40px] text-fg mb-3">Design system</h1>
        <p className="text-base text-fg-muted max-w-xl leading-relaxed">
          A formal, school-swappable interface system. Source Serif 4 is used for institutional headings,
          Inter for interface text, and tabular numerals for academic and financial data.
        </p>
        </div>
        <div className="flex border border-border-default rounded-[6px] p-0.5 bg-surface shrink-0" aria-label="Color mode">
          {([false, true] as const).map(value => <button key={String(value)} onClick={() => setDark(value)}
            className={`h-8 px-3 rounded-[4px] text-[12px] font-medium ${dark === value ? 'bg-brand text-on-brand' : 'text-fg-muted hover:text-fg'}`}>
            {value ? 'Dark' : 'Light'}
          </button>)}
        </div>
        </div>
      </div>

      {/* Color tokens */}
      <Section title={`Color tokens · ${dark ? 'Dark' : 'Light'} mode`}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {colorTokens.map(c => (
            <div key={c.name} className="bg-surface border border-border-default rounded-[8px] overflow-hidden">
              <div className={`h-14 ${c.cls}`} />
              <div className="p-3">
                <p className="text-[12px] font-semibold text-fg">{c.name}</p>
                <p className="font-mono text-[10px] text-fg-muted mt-0.5">{dark ? darkHex[c.name] : c.hex}</p>
                <p className="text-[10px] text-fg-muted/60 mt-0.5">{c.label}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="School theme presets">
        <div className="grid sm:grid-cols-3 gap-3">
          {[
            ['Forest', '#1F4D3A', 'Default'],
            ['Ocean Blue', '#235A78', 'Sample preset'],
            ['Maroon', '#74353C', 'Sample preset'],
          ].map(([name, color, note]) => (
            <button key={name} className="bg-surface border border-border-default rounded-[8px] p-4 text-left hover:border-brand transition-colors">
              <span className="block h-1 w-12 rounded-[2px] mb-4" style={{ backgroundColor: color }} />
              <span className="block text-[13px] font-semibold text-fg">{name}</span>
              <span className="block text-[11px] text-fg-muted mt-1">{note} · variable-based</span>
            </button>
          ))}
        </div>
      </Section>

      <Section title="Plan preview">
        <div className="flex flex-wrap items-center gap-4 bg-surface border border-border-default rounded-[8px] p-5">
          <div className="flex border border-border-default rounded-[6px] p-0.5 bg-surface">
            {(['basic', 'essential', 'pro'] as const).map(plan => (
              <button key={plan} onClick={() => setPreviewPlan(plan)}
                className={`h-8 px-4 rounded-[4px] text-[12px] font-medium capitalize ${previewPlan === plan ? 'bg-brand text-on-brand' : 'text-fg-muted hover:text-fg'}`}>
                {plan}
              </button>
            ))}
          </div>
          <PlanBadge plan={previewPlan} />
          <p className="text-[12px] text-fg-muted">Locked and available features update without changing the school theme.</p>
        </div>
      </Section>

      {/* Typography */}
      <Section title="Typography Scale">
        <div className="bg-surface border border-border-default rounded-[8px] overflow-hidden">
          {typeScale.map((t, i) => (
            <div key={t.name} className={`px-6 py-4 flex items-baseline gap-4 ${i < typeScale.length - 1 ? 'border-b border-border-default/50' : ''}`}>
              <span className={`${t.cls} text-fg flex-1`}>
                {t.name === 'Mono/Num' ? '₹ 12,400.00' : t.name}
              </span>
              <div className="flex items-center gap-3 shrink-0 text-right">
                <span className="text-[11px] text-fg-muted font-mono">{t.size}</span>
                <span className="text-[11px] text-fg-muted">w{t.weight}</span>
                <span className="text-[10px] text-brand font-semibold px-2 py-0.5 rounded-[4px] bg-brand/10">{t.font}</span>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Motion */}
      <Section title="Motion Specs">
        <div className="bg-surface border border-border-default rounded-[8px] overflow-hidden">
          {motionSpecs.map((m, i) => (
            <div key={m.name} className={`px-5 py-4 grid grid-cols-4 gap-4 items-center ${i < motionSpecs.length - 1 ? 'border-b border-border-default/50' : ''}`}>
              <p className="text-[13px] font-semibold text-fg">{m.name}</p>
              <p className="font-mono text-[12px] text-brand">{m.duration}</p>
              <p className="font-mono text-[11px] text-fg-muted">{m.easing}</p>
              <p className="text-[11px] text-fg-muted">{m.use}</p>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-fg-muted mt-3">Note: All animations respect <code className="font-mono bg-elevated px-1 py-0.5 rounded text-fg-muted">prefers-reduced-motion</code> — durations collapse to 0.01ms.</p>
      </Section>

      {/* Buttons */}
      <Section title="Buttons · All States">
        <div className="bg-surface border border-border-default rounded-[8px] p-6 space-y-4">
          <div className="flex flex-wrap gap-3">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
            <Button variant="primary" disabled>Disabled</Button>
            <Button variant="primary" loading>Loading</Button>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button icon={<ArrowRight className="w-4 h-4" strokeWidth={1.5}/>}>With icon</Button>
            <Button variant="secondary" iconRight={<ArrowRight className="w-4 h-4" strokeWidth={1.5}/>}>Icon right</Button>
          </div>
        </div>
      </Section>

      {/* Badges */}
      <Section title="Status Badges">
        <div className="bg-surface border border-border-default rounded-[8px] p-6 flex flex-wrap gap-3">
          {(['pending', 'approved', 'rejected', 'paid', 'due', 'active', 'suspended', 'expired'] as const).map(s => (
            <Badge key={s} status={s} />
          ))}
          <div className="flex items-center gap-2">
            {(['basic', 'essential', 'pro'] as const).map(p => <PlanBadge key={p} plan={p}/>)}
          </div>
        </div>
      </Section>

      {/* Inputs */}
      <Section title="Form Inputs">
        <div className="bg-surface border border-border-default rounded-[8px] p-6 grid md:grid-cols-2 gap-4">
          <Input label="Text Input" placeholder="Enter something…" hint="Helper text appears here" />
          <PasswordInput label="Password" placeholder="Min 8 characters" />
          <Input label="Search" placeholder="Search notices…" icon={<Search className="w-4 h-4" strokeWidth={1.5}/>} />
          <Input label="With Error" placeholder="Email address" error="Please enter a valid email address" />
        </div>
      </Section>

      <Section title="Navigation and iconography">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-surface border border-border-default rounded-[8px] p-5">
            <div className="flex gap-6 border-b border-border-default h-10">
              {['Overview', 'Academics', 'Finance'].map((item, index) => (
                <button key={item} className={`relative text-[13px] font-medium ${index === 0 ? 'text-brand after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:bg-brand' : 'text-fg-muted'}`}>
                  {item}
                </button>
              ))}
            </div>
            <p className="text-[12px] text-fg-muted mt-4">Active destinations use a restrained underline rather than a filled pill.</p>
          </div>
          <div className="bg-surface border border-border-default rounded-[8px] p-5">
            <div className="flex items-center gap-5 text-fg-muted">
              {[GraduationCap, BookOpen, CalendarDays, Users, Receipt, Building2].map((Icon, index) => (
                <Icon key={index} className={index === 0 ? 'w-5 h-5 text-brand' : 'w-5 h-5'} strokeWidth={1.5} />
              ))}
            </div>
            <p className="text-[12px] text-fg-muted mt-4">Lucide outline icons use a 1.5px stroke and remain monochrome.</p>
          </div>
        </div>
      </Section>

      <Section title="Table">
        <div className="bg-surface border border-border-default rounded-[8px] overflow-hidden">
          <div className="grid grid-cols-4 gap-4 bg-elevated px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-fg-muted">
            <span>Student</span><span>Class</span><span>Receipt</span><span className="text-right">Amount</span>
          </div>
          {[
            ['Aarav Sharma', 'VIII A', 'FEE-2048', '₹ 12,400'],
            ['Mira Das', 'VII B', 'FEE-2049', '₹ 8,200'],
          ].map(row => (
            <div key={row[2]} className="grid grid-cols-4 gap-4 px-5 py-3.5 border-t border-border-default text-[13px] text-fg">
              <span className="font-medium">{row[0]}</span><span>{row[1]}</span>
              <span className="font-mono text-fg-muted">{row[2]}</span>
              <span className="text-right tabular-nums font-medium">{row[3]}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Formal tone">
        <div className="bg-surface border border-border-default rounded-[8px] p-5">
          <h3 className="font-display text-[18px] leading-[26px] font-semibold text-fg">Write with institutional clarity</h3>
          <p className="text-[14px] leading-[22px] text-fg-muted mt-2 max-w-2xl">
            Use complete sentences, neutral language and established academic terms. Prefer “Parent and Student Portal”,
            “Academic Session 2024–25”, “Proceed to payment” and “View plan details”. Avoid exclamation marks,
            promotional claims and conversational shorthand.
          </p>
        </div>
      </Section>

      {/* Cards */}
      <Section title="Cards">
        <div className="grid md:grid-cols-3 gap-4">
          <Card><p className="text-[13px] font-semibold text-fg mb-1">Default card</p><p className="text-[12px] text-fg-muted">8px radius, surface background and hairline border.</p></Card>
          <Card elevated><p className="text-[13px] font-semibold text-fg mb-1">Elevated card</p><p className="text-[12px] text-fg-muted">A minimal shadow separates layered content.</p></Card>
          <Card onClick={() => {}}><p className="text-[13px] font-semibold text-fg mb-1">Interactive card</p><p className="text-[12px] text-fg-muted">Hover uses a forest border at 30% opacity.</p></Card>
        </div>
      </Section>

      {/* Stat cards */}
      <Section title="Stat Cards · Count-up Animation">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Students" value={1840} change="+32" trend="up" sparkline={sparkline} icon={<Bell className="w-4 h-4" strokeWidth={1.5}/>}/>
          <StatCard label="Fee Collected" value={2840000} prefix="₹ " change="71%" trend="up" />
          <StatCard label="Pending" value={14} change="3 urgent" trend="warn" />
          <StatCard label="Pass Rate" value={98} suffix="%" trend="neutral" sparkline={[90,92,91,94,95,97,98]}/>
        </div>
      </Section>

      {/* Skeletons */}
      <Section title="Skeleton Loaders · Shimmer">
        <div className="grid md:grid-cols-3 gap-4">
          <SkeletonCard />
          <SkeletonStat />
          <SkeletonStat />
        </div>
      </Section>

      {/* Spacing */}
      <Section title="Spacing · 8pt Grid">
        <div className="flex items-end gap-4 bg-surface border border-border-default rounded-[8px] p-6 overflow-x-auto">
          {[1, 2, 3, 4, 6, 8, 10, 12, 16].map(n => (
            <div key={n} className="flex flex-col items-center gap-2 shrink-0">
              <div className="bg-brand/30 border border-brand/40 rounded-[4px]" style={{ width: n * 8, height: n * 8 }}/>
              <span className="font-mono text-[10px] text-fg-muted">{n * 8}px</span>
            </div>
          ))}
        </div>
      </Section>

      {/* Border radius */}
      <Section title="Corner Radius">
        <div className="flex gap-5 bg-surface border border-border-default rounded-[8px] p-6 flex-wrap">
          {[['4px', 'Chips'], ['8px', 'Buttons (sm)'], ['10px', 'Buttons / Inputs'], ['14px', 'Cards'], ['9999px', 'Avatars / Pills']].map(([r, label]) => (
            <div key={r} className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 bg-brand/20 border border-brand/40" style={{ borderRadius: r }}/>
              <p className="font-mono text-[10px] text-fg-muted">{r}</p>
              <p className="text-[10px] text-fg-muted/60 text-center">{label}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* States */}
      <Section title="System States">
        <div className="grid md:grid-cols-4 gap-4">
          {/* Empty */}
          <div className="bg-surface border border-border-default rounded-[8px] p-6 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-elevated border border-border-default flex items-center justify-center mb-3">
              <Bell className="w-5 h-5 text-fg-muted" strokeWidth={1.5}/>
            </div>
            <p className="text-[13px] font-semibold text-fg mb-1">No notices</p>
            <p className="text-[11px] text-fg-muted">New notices will appear here.</p>
          </div>
          {/* Error */}
          <div className="bg-surface border border-error/50 rounded-[8px] p-6 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-error/12 flex items-center justify-center mb-3">
              <Lock className="w-5 h-5 text-error-fg" strokeWidth={1.5}/>
            </div>
            <p className="text-[13px] font-semibold text-fg mb-1">Something went wrong</p>
            <p className="text-[11px] text-fg-muted mb-3">Could not load data.</p>
            <button className="text-[11px] text-brand font-semibold border border-brand/50 px-3 py-1.5 rounded-[4px] hover:bg-brand/10">Retry</button>
          </div>
          {/* Offline */}
          <div className="bg-surface border border-warning/50 rounded-[8px] p-6 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-warning/12 flex items-center justify-center mb-3">
              <Zap className="w-5 h-5 text-warning-fg" strokeWidth={1.5}/>
            </div>
            <p className="text-[13px] font-semibold text-fg mb-1">You're offline</p>
            <p className="text-[11px] text-fg-muted">Showing cached content.</p>
          </div>
          {/* Success */}
          <div className="bg-surface border border-success/50 rounded-[8px] p-6 flex flex-col items-center text-center">
            <SuccessCheck />
            <p className="text-[13px] font-semibold text-fg mt-3 mb-1">Payment approved</p>
            <p className="text-[11px] text-fg-muted">Animated checkmark on success.</p>
          </div>
        </div>
      </Section>

      {/* Skeleton + Loading */}
      <Section title="Loading Skeleton">
        <div className="grid md:grid-cols-2 gap-4">
          <SkeletonCard />
          <div className="space-y-2">
            <SkeletonStat />
            <Skeleton className="h-10 w-full rounded-[6px]" />
            <Skeleton className="h-10 w-3/4 rounded-[6px]" />
          </div>
        </div>
      </Section>
    </div>
    </div>
  );
}
