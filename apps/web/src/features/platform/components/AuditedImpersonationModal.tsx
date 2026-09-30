'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ShieldAlert } from 'lucide-react';

export interface AuditedImpersonationModalProps {
  tenantName: string;
  subdomain: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function AuditedImpersonationModal({
  tenantName,
  subdomain,
  isOpen,
  onClose,
  onConfirm
}: AuditedImpersonationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <Card className="w-full max-w-md space-y-4 bg-slate-900 border-slate-800 text-white p-6">
        <div className="flex items-center gap-3 text-rose-400">
          <ShieldAlert className="w-8 h-8" />
          <h3 className="font-display font-bold text-lg text-white">Audited Impersonation</h3>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          You are about to access the school admin panel for <strong className="text-white">{tenantName}</strong> (<span className="font-mono text-emerald-400">{subdomain}.eduportal.com</span>).
        </p>

        <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded text-[11px] text-rose-300 space-y-1">
          <p className="font-semibold">⚠️ Security Compliance Notice:</p>
          <p>Every page view, data modification, and session action performed during impersonation will be permanently logged to the platform audit log.</p>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="danger" onClick={onConfirm}>Confirm & Enter Context</Button>
        </div>
      </Card>
    </div>
  );
}
