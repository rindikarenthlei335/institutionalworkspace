import React from 'react';

export function PhoneFrame({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative mx-auto ${className}`} style={{ width: 390, height: 844 }}>
      {/* Phone shell */}
      <div
        className="absolute inset-0 rounded-[50px] border-[8px] border-elevated shadow-sm"
        style={{ background: '#0F1F18', zIndex: 0 }}
      />
      {/* Notch */}
      <div className="absolute top-[8px] left-1/2 -translate-x-1/2 w-32 h-7 bg-base rounded-full z-20" />
      {/* Screen content */}
      <div
        className="absolute inset-[8px] rounded-[44px] overflow-hidden bg-base"
        style={{ zIndex: 1 }}
      >
        {/* Status bar */}
        <div className="flex items-center justify-between px-8 pt-3 pb-1 h-12">
          <span className="text-[11px] font-semibold text-fg">9:41</span>
          <div className="flex items-center gap-1">
            <svg className="w-4 h-3 text-fg" viewBox="0 0 20 12" fill="currentColor"><rect x="0" y="4" width="4" height="8" rx="1"/><rect x="6" y="2" width="4" height="10" rx="1"/><rect x="12" y="0" width="4" height="12" rx="1"/><rect x="18" y="1" width="2" height="10" rx="1" opacity=".3"/></svg>
            <svg className="w-4 h-3 text-fg" viewBox="0 0 20 14" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 5C5 1 15 1 19 5"/><path d="M4 8c2.5-2.5 9.5-2.5 12 0"/><path d="M7.5 11c1-1 4-1 5 0"/><circle cx="10" cy="13" r="1" fill="currentColor"/></svg>
            <svg className="w-6 h-3 text-fg" viewBox="0 0 25 12" fill="currentColor"><rect x="0" y="1" width="21" height="10" rx="2.5" stroke="currentColor" strokeWidth="1.5" fill="none"/><rect x="22" y="4" width="2" height="4" rx="1" fill="currentColor" opacity=".4"/><rect x="1.5" y="2.5" width="14" height="7" rx="1.5" fill="currentColor"/></svg>
          </div>
        </div>
        <div className="h-[calc(100%-48px)] overflow-y-auto overflow-x-hidden">
          {children}
        </div>
      </div>
      {/* Home bar */}
      <div className="absolute bottom-[16px] left-1/2 -translate-x-1/2 w-32 h-1 bg-fg/30 rounded-full z-20" />
    </div>
  );
}
