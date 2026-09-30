import React from 'react';

export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`shimmer rounded-[8px] ${className}`} />;
}

export function SkeletonCard() {
  return (
    <div className="bg-surface border border-border-default rounded-[8px] p-5 space-y-3">
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-5/6" />
      <Skeleton className="h-9 w-full rounded-[6px]" />
    </div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-5 py-3 border-b border-border-default/50">
          <Skeleton className="w-4 h-4 rounded" />
          <Skeleton className="h-3 flex-1" />
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-7 w-20 rounded-[8px]" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonStat() {
  return (
    <div className="bg-surface border border-border-default rounded-[8px] p-5">
      <Skeleton className="h-3 w-24 mb-3" />
      <Skeleton className="h-8 w-28 mb-2" />
      <Skeleton className="h-3 w-20" />
    </div>
  );
}
