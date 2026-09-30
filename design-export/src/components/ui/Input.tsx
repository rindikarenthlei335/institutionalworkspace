import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
}

export function Input({ label, hint, error, icon, iconRight, className = '', ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-[13px] font-semibold text-fg">{label}</label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-fg-muted">{icon}</span>
        )}
        <input
          {...props}
          className={[
            'w-full h-11 bg-surface border rounded-[6px] px-4 text-sm text-fg',
            'placeholder:text-fg-muted/50 font-medium',
            'focus:outline-none focus:ring-2 focus:ring-brand/40 transition-colors duration-150',
            error ? 'border-error/70 focus:border-error' : 'border-border-default focus:border-brand focus:border-2',
            icon ? 'pl-10' : '',
            iconRight ? 'pr-10' : '',
            className,
          ].join(' ')}
        />
        {iconRight && (
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-fg-muted">{iconRight}</span>
        )}
      </div>
      {error && <p className="text-[11px] text-error-fg font-medium">{error}</p>}
      {hint && !error && <p className="text-[11px] text-fg-muted">{hint}</p>}
    </div>
  );
}

export function PasswordInput({ label, hint, error, ...props }: InputProps) {
  const [show, setShow] = useState(false);
  return (
    <Input
      {...props}
      label={label} hint={hint} error={error}
      type={show ? 'text' : 'password'}
      iconRight={
        <button type="button" onClick={() => setShow(s => !s)} className="text-fg-muted hover:text-fg transition-colors">
          {show ? <EyeOff className="w-4 h-4" strokeWidth={1.5} /> : <Eye className="w-4 h-4" strokeWidth={1.5} />}
        </button>
      }
    />
  );
}
