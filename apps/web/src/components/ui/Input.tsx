'use client';

import React, { useState } from 'react';
import { clsx } from 'clsx';
import { Eye, EyeOff } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export function Input({ label, error, icon, className, id, ...props }: InputProps) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold text-[var(--text-secondary)]">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && <span className="absolute left-3 text-[var(--text-secondary)] pointer-events-none">{icon}</span>}
        <input
          id={inputId}
          className={clsx(
            'w-full h-9 px-3 rounded-[6px] text-xs bg-[var(--bg-surface)] border border-[var(--border-default)] text-[var(--text-primary)] placeholder-[var(--text-secondary)]/50 focus:outline-none focus:border-[var(--brand-primary)] focus:ring-1 focus:ring-[var(--brand-primary)] transition-all',
            icon && 'pl-9',
            error && 'border-[var(--status-error)] focus:border-[var(--status-error)] focus:ring-[var(--status-error)]',
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="text-[11px] font-medium text-[var(--status-error)]">{error}</p>}
    </div>
  );
}

export function PasswordInput(props: InputProps) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Input type={show ? 'text' : 'password'} {...props} />
      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute right-3 top-[26px] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
      >
        {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  );
}
