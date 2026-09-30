import React from 'react';
import { clsx } from 'clsx';

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx('animate-pulse rounded-[4px] bg-[var(--bg-elevated)]', className)}
      {...props}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[8px] p-5 space-y-3">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-8 w-1/2" />
      <Skeleton className="h-3 w-3/4" />
    </div>
  );
}
