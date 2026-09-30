import React from 'react';
import { Card } from '@/components/ui/Card';
import { HardDrive } from 'lucide-react';

export interface StorageMeterProps {
  usedBytes: number;
  limitBytes: number;
}

export function StorageMeter({ usedBytes = 420 * 1024 * 1024, limitBytes = 5 * 1024 * 1024 * 1024 }: StorageMeterProps) {
  const usedMB = Math.round(usedBytes / (1024 * 1024));
  const limitGB = Math.round(limitBytes / (1024 * 1024 * 1024));
  const percentage = Math.min(100, Math.round((usedBytes / limitBytes) * 100));

  return (
    <Card className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HardDrive className="w-4 h-4 text-[var(--brand-primary)]" />
          <h4 className="font-display font-semibold text-xs text-[var(--text-primary)]">Cloud Storage Meter</h4>
        </div>
        <span className="text-[11px] font-mono font-semibold text-[var(--brand-primary)]">
          {usedMB} MB / {limitGB} GB ({percentage}%)
        </span>
      </div>

      <div className="h-2 bg-[var(--bg-elevated)] rounded-full overflow-hidden">
        <div
          className="h-full bg-[var(--brand-primary)] rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <p className="text-[10px] text-[var(--text-secondary)]">
        Includes WebP images, notice attachments, and document uploads for your school tenant.
      </p>
    </Card>
  );
}
