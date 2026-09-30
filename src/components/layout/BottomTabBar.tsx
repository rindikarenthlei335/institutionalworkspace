import React from 'react';
import { Home, Bell, CreditCard, FileText, User, LucideProps } from 'lucide-react';

export type Tab = 'home' | 'notices' | 'fees' | 'admission' | 'profile';

const tabs: { id: Tab; label: string; Icon: React.FC<LucideProps> }[] = [
  { id: 'home',      label: 'Home',      Icon: Home       },
  { id: 'notices',   label: 'Notice Board', Icon: Bell       },
  { id: 'fees',      label: 'Fees',      Icon: CreditCard },
  { id: 'admission', label: 'Admission', Icon: FileText   },
  { id: 'profile',   label: 'Profile',   Icon: User       },
];

export function BottomTabBar({ active, onChange }: { active: Tab; onChange: (tab: Tab) => void }) {
  return (
    <div className="flex items-center justify-around bg-surface border-t border-border-default px-2 h-[64px] shadow-[0_-2px_8px_rgba(15,26,20,0.10)]" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      {tabs.map(({ id, label, Icon }) => {
        const isActive = id === active;
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            className="flex flex-col items-center gap-1 flex-1 min-h-[48px] justify-center transition-all duration-150"
          >
            <Icon
              className={`w-5 h-5 transition-colors ${isActive ? 'text-brand' : 'text-fg-muted'}`}
              strokeWidth={isActive ? 2 : 1.5}
            />
            <span className={`text-[10px] font-semibold transition-colors ${isActive ? 'text-brand' : 'text-fg-muted'}`}>
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
