import React, { useState } from 'react';
import { PlanProvider, usePlan } from './contexts/PlanContext';
import { Plan, PLAN_DETAILS } from './lib/plan';

import { PhoneFrame } from './components/layout/PhoneFrame';
import { BottomTabBar, Tab } from './components/layout/BottomTabBar';
import { PlanBadge } from './components/ui/Badge';

import { Entry } from './pages/Entry';
import { DesignSystem } from './pages/DesignSystem';

import { WebsiteLayout } from './pages/website/WebsiteLayout';
import { WebsiteHome } from './pages/website/WebsiteHome';
import { WebsiteActivities, WebsiteFaculty, WebsiteFacilities, WebsiteAbout, WebsiteNotices } from './pages/website/WebsitePages';

import { AppSplash } from './pages/app/AppSplash';
import { AppLogin } from './pages/app/AppLogin';
import { AppHome } from './pages/app/AppHome';
import { AppNotices } from './pages/app/AppNotices';
import { AppFeeList } from './pages/app/AppFeeList';
import { AppFeePayment } from './pages/app/AppFeePayment';
import { AppPaymentStatus } from './pages/app/AppPaymentStatus';
import { AppAdmission } from './pages/app/AppAdmission';

import { AdminLayout, AdminPage } from './pages/admin/AdminLayout';
import { AdminDashboard, AdminContent, AdminFeeApprovals, AdminStudents, AdminSettings } from './pages/admin/AdminPages';

import { PrincipalDashboard } from './pages/principal/PrincipalDashboard';
import { SuperAdmin } from './pages/superadmin/SuperAdmin';

type Section = 'entry' | 'design' | 'website' | 'app' | 'admin' | 'principal' | 'superadmin';
type AppScreen = 'splash' | 'login' | 'main_app' | 'payment' | 'status';

const NAV_TABS: { id: Section; label: string }[] = [
  { id: 'design',      label: 'Design System' },
  { id: 'website',     label: 'Website' },
  { id: 'app',         label: 'Parent App' },
  { id: 'admin',       label: 'School Admin' },
  { id: 'principal',   label: 'Principal' },
  { id: 'superadmin',  label: 'Super Admin' },
];

// ── Primary navigation ───────────────────────────────────────────────────────
function SlidingNav({ active, tabs, onChange }: {
  active: Section;
  tabs: typeof NAV_TABS;
  onChange: (s: Section) => void;
}) {
  return (
    <div className="relative flex items-center gap-1 h-full" style={{ minWidth: 0 }}>
      {tabs.map(({ id, label }) => (
        <button
          key={id}
          onClick={() => onChange(id)}
          className={`relative px-3.5 h-full text-[12px] font-medium whitespace-nowrap transition-colors duration-150 after:absolute after:left-3.5 after:right-3.5 after:bottom-0 after:h-[3px] after:bg-[#9FD0B4] after:transition-transform ${
            active === id ? 'text-white after:scale-x-100' : 'text-white/80 hover:text-white after:scale-x-0'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

// ── Plan switcher ────────────────────────────────────────────────────────────
function PlanSwitcher() {
  const { plan, setPlan } = usePlan();
  const plans: Plan[] = ['basic', 'essential', 'pro'];

  return (
    <div className="flex items-center gap-2">
      <span className="text-[11px] text-white/80 font-medium hidden sm:block">Plan preview:</span>
      <div className="flex bg-white border border-border-default rounded-[6px] p-0.5 gap-0.5">
        {plans.map(p => (
          <button
            key={p}
            onClick={() => setPlan(p)}
            className={`px-3 h-6 rounded-[4px] text-[11px] font-semibold capitalize transition-colors ${
              plan === p ? 'bg-brand text-white' : 'text-fg-muted hover:text-fg'
            }`}
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Inner app (has access to plan context) ───────────────────────────────────
function AppInner() {
  const { plan } = usePlan();
  const [hasEntered, setHasEntered] = useState(false);
  const [section, setSection] = useState<Section>('design');
  const [websitePage, setWebsitePage] = useState('Home');
  const [appScreen, setAppScreen] = useState<AppScreen>('splash');
  const [appTab, setAppTab] = useState<Tab>('home');
  const [pendingFee, setPendingFee] = useState({ label: 'All Pending Fees', amount: '₹ 12,400' });
  const [adminPage, setAdminPage] = useState<AdminPage>('dashboard');

  if (!hasEntered) {
    return (
      <Entry onEnter={() => { setHasEntered(true); setSection('design'); }} />
    );
  }

  const renderWebsitePage = () => {
    const p = { onNavigate: setWebsitePage };
    switch (websitePage) {
      case 'Home':       return <WebsiteHome {...p} />;
      case 'Activities': return <WebsiteActivities />;
      case 'Faculty':    return <WebsiteFaculty />;
      case 'Facilities': return <WebsiteFacilities />;
      case 'About':      return <WebsiteAbout />;
      case 'Notices':    return <WebsiteNotices />;
      default:           return <WebsiteHome {...p} />;
    }
  };

  const renderAppScreen = () => {
    if (appScreen === 'splash')  return <AppSplash onContinue={() => setAppScreen('login')} />;
    if (appScreen === 'login')   return <AppLogin onLogin={() => setAppScreen('main_app')} onBack={() => setAppScreen('splash')} />;
    if (appScreen === 'payment') return (
      <AppFeePayment
        fee={pendingFee}
        onBack={() => { setAppScreen('main_app'); setAppTab('fees'); }}
        onSubmit={() => setAppScreen('status')}
      />
    );
    if (appScreen === 'status')  return (
      <AppPaymentStatus
        onBack={() => { setAppScreen('main_app'); setAppTab('fees'); }}
        onPayAgain={() => setAppScreen('payment')}
      />
    );

    const nav = (tab: string) => {
      if (tab === 'fees') setAppTab('fees');
      else if (tab === 'notices') setAppTab('notices');
      else if (tab === 'admission') setAppTab('admission');
    };

    let content: React.ReactNode;
    switch (appTab) {
      case 'home':      content = <AppHome onNavigate={nav} />; break;
      case 'notices':   content = <AppNotices />; break;
      case 'fees':      content = <AppFeeList onPay={(fee) => { setPendingFee(fee); setAppScreen('payment'); }} />; break;
      case 'admission': content = <AppAdmission onBack={() => setAppTab('home')} />; break;
      case 'profile':   content = <AppProfile />; break;
      default:          content = null;
    }
    return (
      <div className="h-full flex flex-col">
        <div className="flex-1 overflow-hidden">{content}</div>
        <BottomTabBar active={appTab} onChange={setAppTab} />
      </div>
    );
  };

  const renderAdmin = () => {
    const screen = () => {
      switch (adminPage) {
        case 'dashboard': return <AdminDashboard onNavigate={setAdminPage} />;
        case 'content':   return <AdminContent />;
        case 'fees':      return <AdminFeeApprovals />;
        case 'students':  return <AdminStudents />;
        case 'settings':  return <AdminSettings />;
        default:          return <AdminDashboard onNavigate={setAdminPage} />;
      }
    };
    return <AdminLayout active={adminPage} onNavigate={setAdminPage}>{screen()}</AdminLayout>;
  };

  return (
    <div className="min-h-screen bg-base">
      {/* Top nav */}
      <div className="sticky top-0 z-50 bg-[#163A2B] border-b border-[#0F2A1F]">
        <div className="max-w-screen-2xl mx-auto px-4 h-16 flex items-center gap-3">
          {/* Logo */}
          <button
            onClick={() => setHasEntered(false)}
            className="flex items-center gap-2 shrink-0 hover:opacity-80 transition-opacity"
          >
            <div className="w-7 h-7 rounded-[8px] border border-white/40 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342" />
              </svg>
            </div>
            <span className="text-[13px] font-semibold text-white hidden sm:block">EduPortal</span>
          </button>

          <div className="h-4 w-px bg-white/30 hidden sm:block" />

          {/* Plan badge */}
          <div className="bg-white rounded-[4px] px-1.5 py-1"><PlanBadge plan={plan} /></div>

          {/* Sliding tab nav */}
          <div className="flex-1 flex justify-center overflow-x-auto">
            <SlidingNav active={section} tabs={NAV_TABS} onChange={setSection} />
          </div>

          {/* Plan switcher */}
          <PlanSwitcher />
        </div>
      </div>

      {/* Content */}
      <div className="animate-fade-in">
        {section === 'design' && <DesignSystem />}

        {section === 'website' && (
          <WebsiteLayout active={websitePage} onNavigate={setWebsitePage}>
            {renderWebsitePage()}
          </WebsiteLayout>
        )}

        {section === 'app' && (
          <div className="min-h-[calc(100vh-64px)] bg-base flex flex-col items-center justify-center py-12 px-4">
            <div className="mb-6 text-center">
              <p className="text-xs font-semibold text-fg-muted uppercase tracking-widest mb-1">Parent Mobile App</p>
              <h2 className="font-display font-semibold text-xl text-fg">390 × 844 · iPhone 14</h2>
            </div>
            <PhoneFrame>{renderAppScreen()}</PhoneFrame>
            <div className="mt-6 flex gap-2 flex-wrap justify-center">
              <span className="text-[11px] text-fg-muted self-center">Screens:</span>
              {([['Splash', 'splash'], ['Login', 'login'], ['Fee Pay', 'payment'], ['Status', 'status'], ['Main App', 'main_app']] as const).map(([label, scr]) => (
                <button
                  key={scr}
                  onClick={() => setAppScreen(scr as AppScreen)}
                  className={`px-3 h-6 rounded-[4px] text-[11px] font-semibold border transition-colors ${
                    appScreen === scr ? 'bg-brand text-on-brand border-brand' : 'border-border-default text-fg-muted hover:border-brand hover:text-fg'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}

        {section === 'admin' && (
          <div style={{ height: 'calc(100vh - 64px)' }}>
            {renderAdmin()}
          </div>
        )}

        {section === 'principal' && (
          <div style={{ height: 'calc(100vh - 64px)', overflowY: 'auto' }}>
            <PrincipalDashboard />
          </div>
        )}

        {section === 'superadmin' && (
          <div style={{ height: 'calc(100vh - 64px)', overflowY: 'auto' }}>
            <SuperAdmin />
          </div>
        )}
      </div>
    </div>
  );
}

// ── Profile screen (inline, minimal) ─────────────────────────────────────────
function AppProfile() {
  const { plan } = usePlan();
  return (
    <div className="p-5 overflow-y-auto flex flex-col gap-5 bg-base">
      <div className="flex flex-col items-center gap-3 pt-6">
        <div className="w-20 h-20 rounded-full bg-brand/20 border-2 border-brand/40 flex items-center justify-center">
          <span className="font-display font-bold text-2xl text-brand">PS</span>
        </div>
        <div className="text-center">
          <p className="font-display font-semibold text-lg text-fg">Priya Sharma</p>
          <p className="text-sm text-fg-muted">Parent · Aarav Sharma</p>
          <p className="text-xs text-fg-muted mt-0.5">Class VII-B · Roll 14</p>
        </div>
        <PlanBadge plan={plan} />
      </div>
      <div className="bg-surface border border-border-default rounded-[8px] divide-y divide-border-default">
        {['Account Settings', 'Notification Preferences', 'Change Password', 'Language (English)', 'Help & Support', 'Sign Out'].map((item, i) => (
          <div key={item} className={`flex items-center justify-between px-4 py-3.5 ${i === 5 ? 'text-error-fg' : 'text-fg'}`}>
            <span className="text-sm font-semibold">{item}</span>
            {i < 5 && (
              <svg className="w-4 h-4 text-fg-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <PlanProvider>
      <AppInner />
    </PlanProvider>
  );
}
