import React, { useState } from 'react';
import {
  LayoutDashboard, FileText, CreditCard, Users, Settings, ChevronLeft, ChevronRight, Bell, Globe
} from 'lucide-react';
import { usePlan } from '../../contexts/PlanContext';
import { PlanBadge } from '../../components/ui/Badge';

export type AdminPage = 'dashboard' | 'content' | 'fees' | 'students' | 'settings';

const navItems: { id: AdminPage; label: string; icon: React.ReactNode; plan?: 'essential' | 'pro' }[] = [
  { id: 'dashboard', label: 'Dashboard',       icon: <LayoutDashboard className="w-4 h-4" strokeWidth={1.5} /> },
  { id: 'content',   label: 'Content Manager', icon: <FileText   className="w-4 h-4" strokeWidth={1.5} /> },
  { id: 'fees',      label: 'Fee Approvals',   icon: <CreditCard className="w-4 h-4" strokeWidth={1.5} />, plan: 'essential' },
  { id: 'students',  label: 'Students',        icon: <Users      className="w-4 h-4" strokeWidth={1.5} />, plan: 'essential' },
  { id: 'settings',  label: 'Settings',        icon: <Settings   className="w-4 h-4" strokeWidth={1.5} /> },
];

export function AdminLayout({ children, active, onNavigate }: {
  children: React.ReactNode;
  active: AdminPage;
  onNavigate: (page: AdminPage) => void;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const { plan, hasFeature } = usePlan();

  return (
    <div className="flex h-full bg-base overflow-hidden">
      {/* Sidebar */}
      <aside className={`${collapsed ? 'w-14' : 'w-56'} transition-all duration-200 bg-surface border-r border-border-default flex flex-col shrink-0`}>
        {/* Logo row */}
        <div className="h-14 flex items-center gap-3 px-3.5 border-b border-border-default">
          <div className="w-8 h-8 rounded-[8px] bg-brand/15 border border-brand/50 flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342" />
            </svg>
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-fg truncate">DPS Admin</p>
              <PlanBadge plan={plan} />
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-3 flex flex-col gap-0.5">
          {navItems.map((item) => {
            const locked = item.plan && !hasFeature(item.plan === 'essential' ? 'fee_payment' : 'principal_dashboard');
            const isActive = active === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                title={collapsed ? item.label : undefined}
                className={`flex items-center gap-2.5 h-9 px-2.5 rounded-[4px] border-l-[3px] w-full text-left transition-colors duration-150 relative ${
                  isActive ? 'bg-brand-soft text-brand border-brand' : locked ? 'text-fg-muted/40 border-transparent cursor-not-allowed' : 'text-fg-muted border-transparent hover:bg-elevated hover:text-fg'
                }`}
              >
                <span className="shrink-0">{item.icon}</span>
                {!collapsed && <span className="text-[13px] font-semibold truncate flex-1">{item.label}</span>}
                {!collapsed && locked && (
                  <svg className="w-3 h-3 text-fg-muted/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="px-2 pb-3 border-t border-border-default pt-2 space-y-1">
          <button
            onClick={() => setCollapsed(c => !c)}
            title={collapsed ? 'Expand' : 'Collapse'}
            className="w-full h-8 rounded-[8px] flex items-center gap-2.5 px-2.5 text-fg-muted hover:bg-elevated hover:text-fg transition-colors"
          >
            {collapsed
              ? <ChevronRight className="w-4 h-4 shrink-0" strokeWidth={1.5} />
              : <ChevronLeft  className="w-4 h-4 shrink-0" strokeWidth={1.5} />
            }
            {!collapsed && <span className="text-[12px]">Collapse</span>}
          </button>
          {!collapsed && (
            <div className="flex items-center gap-2.5 px-2.5 py-1.5">
              <div className="w-7 h-7 rounded-full bg-brand/20 border border-brand/50 flex items-center justify-center shrink-0">
                <span className="text-[11px] font-bold text-brand">AD</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-semibold text-fg truncate">Admin User</p>
                <p className="text-[10px] text-fg-muted">School Administrator</p>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-14 border-b border-border-default bg-surface flex items-center justify-between px-5 shrink-0">
          <div>
            <h1 className="font-display font-semibold text-[15px] text-fg">
              {navItems.find(n => n.id === active)?.label}
            </h1>
            <p className="text-[11px] text-fg-muted">Delhi Public School · 2024–25</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-elevated transition-colors relative">
              <Bell className="w-4 h-4 text-fg-muted" strokeWidth={1.5} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-error border border-surface" />
            </button>
            <button className="flex items-center gap-1.5 h-8 px-3 rounded-[8px] border border-border-default text-[12px] font-semibold text-fg-muted hover:text-fg hover:border-brand transition-colors">
              <Globe className="w-3.5 h-3.5" strokeWidth={1.5} />
              View Site
            </button>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
