import React from 'react';
import { ChevronLeft } from 'lucide-react';

interface TopAppBarProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  right?: React.ReactNode;
}

export function TopAppBar({ title, subtitle, onBack, right }: TopAppBarProps) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-surface border-b border-border-default h-[58px] shrink-0">
      {onBack && (
        <button onClick={onBack} className="w-9 h-9 rounded-[6px] flex items-center justify-center hover:bg-elevated transition-colors shrink-0">
          <ChevronLeft className="w-5 h-5 text-fg" strokeWidth={1.5}/>
        </button>
      )}
      <div className="flex-1 min-w-0">
        <h1 className="font-display font-semibold text-[15px] text-fg truncate">{title}</h1>
        {subtitle && <p className="text-[11px] text-fg-muted tabular-nums truncate">{subtitle}</p>}
      </div>
      {right && <div className="shrink-0">{right}</div>}
    </div>
  );
}
