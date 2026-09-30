import React from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  fullWidth?: boolean;
}

export function Button({
  variant = 'primary', size = 'md', loading = false,
  icon, iconRight, fullWidth, children, disabled, className = '', ...props
}: ButtonProps) {
  const base = [
    'inline-flex items-center justify-center gap-2 font-medium rounded-[6px]',
    'transition-colors duration-150 select-none',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:ring-offset-base',
    'disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer',
    'active:bg-brand-hover',
  ].join(' ');

  const variants: Record<Variant, string> = {
    primary:   'bg-brand text-on-brand hover:bg-brand-hover',
    secondary: 'border-[1.5px] border-brand bg-transparent text-brand hover:bg-brand-soft',
    ghost:     'text-brand underline-offset-4 hover:underline',
    danger:    'bg-error/15 text-error-fg border border-error/50 hover:bg-error/25',
  };

  const sizes: Record<Size, string> = {
    sm: 'h-9 px-4 text-[13px]',
    md: 'h-11 px-5 text-[13px]',
    lg: 'h-12 px-6 text-sm',
  };

  const Spinner = () => (
    <svg className="animate-spin h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/>
      <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
    </svg>
  );

  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {loading ? <Spinner /> : icon}
      {children}
      {!loading && iconRight}
    </button>
  );
}
