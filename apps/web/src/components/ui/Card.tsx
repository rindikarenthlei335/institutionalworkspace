import React from 'react';
import { clsx } from 'clsx';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className, ...props }: CardProps) {
  return (
    <div
      className={clsx(
        'bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[8px] p-5 shadow-2xs',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
