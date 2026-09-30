import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  type?: ToastType;
  message: string;
  onClose: () => void;
  duration?: number;
}

const config: Record<ToastType, { icon: React.ReactNode; cls: string }> = {
  success: { icon: <CheckCircle className="w-4 h-4 text-success-fg" strokeWidth={1.5} />, cls: 'border-success/50' },
  error:   { icon: <AlertCircle  className="w-4 h-4 text-error-fg"   strokeWidth={1.5} />, cls: 'border-error/50' },
  warning: { icon: <AlertTriangle className="w-4 h-4 text-warning-fg" strokeWidth={1.5} />, cls: 'border-warning/50' },
  info:    { icon: <Info          className="w-4 h-4 text-brand"   strokeWidth={1.5} />, cls: 'border-brand/50' },
};

export function Toast({ type = 'success', message, onClose, duration = 4000 }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onClose, duration);
    return () => clearTimeout(t);
  }, [duration, onClose]);

  const { icon, cls } = config[type];

  return (
    <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[300] animate-toast-in`}>
      <div className={`glass border ${cls} rounded-[8px] px-4 py-3 flex items-center gap-3 shadow-xl min-w-[280px] max-w-sm`}>
        {icon}
        <p className="text-sm text-fg font-medium flex-1">{message}</p>
        <button onClick={onClose} className="text-fg-muted hover:text-fg transition-colors">
          <X className="w-4 h-4" strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}

export function SuccessCheck() {
  return (
    <div className="w-16 h-16 rounded-full bg-success/15 border-2 border-success/50 flex items-center justify-center">
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path
          d="M8 16L13 21L24 11"
          stroke="#2E9E6B"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="animate-check"
        />
      </svg>
    </div>
  );
}
