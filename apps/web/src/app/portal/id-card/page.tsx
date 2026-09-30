'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CR80CardPreview } from '@/features/id-cards/components/CR80CardPreview';
import type { IssuedIDCard } from '@/features/id-cards/types';

export default function PortalIDCardPage() {
  const studentCard: IssuedIDCard = {
    id: 'card-1',
    tenantId: 't-1',
    cardNumber: 'IDC-2024-0012',
    cardType: 'student',
    personId: 'stu-101',
    personName: 'Lalrintluanga Sailo',
    identifier: 'ADM-2024-0012',
    roleOrClass: 'Class X - Section A',
    dob: '2009-05-14',
    bloodGroup: 'B+',
    phone: '+91 98621 11223',
    guardianName: 'C. Lalthansanga',
    address: 'Mission Veng, Aizawl, Mizoram',
    issueDate: '2024-04-01',
    expiryDate: '2025-03-31',
    qrVerificationToken: 'ID-VER-MC-STU-0012-9988',
    status: 'active',
    reprintCount: 0
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="border-b border-[var(--border-subtle)] pb-2">
        <h2 className="font-display font-bold text-base text-[var(--text-primary)]">
          Digital Identity Card
        </h2>
        <p className="text-[11px] text-[var(--text-secondary)]">
          Official School Credential with Tap-to-Verify QR Code
        </p>
      </div>

      {/* Security Status */}
      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold text-emerald-900">Credential Status: Active & Valid</span>
        </div>
        <span className="font-mono text-[10px] text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-300">
          2024–2025
        </span>
      </div>

      {/* Interactive CR80 Card Preview */}
      <div className="flex flex-col items-center justify-center p-4 bg-slate-100 rounded-2xl border border-slate-200 shadow-inner">
        <CR80CardPreview
          card={studentCard}
          allowFlip={true}
        />
        <p className="text-[10px] text-slate-500 mt-3 text-center">
          Tap <strong>Front</strong> or <strong>Back</strong> above to view emergency contacts & QR verification seal.
        </p>
      </div>

      {/* Actions */}
      <div className="space-y-2">
        <Button
          variant="primary"
          size="sm"
          className="w-full flex items-center justify-center gap-1.5"
          onClick={() => window.print()}
        >
          <span>📥</span>
          <span>Download Offline Digital ID</span>
        </Button>

        <Card className="p-3 text-[11px] text-slate-600 bg-slate-50 space-y-1">
          <span className="font-bold text-slate-800 block">Campus Gate & Library Pass</span>
          <p className="leading-snug">
            This digital ID is valid across Mount Carmel campus gates, examinations halls, sports complexes, and the central library.
          </p>
        </Card>
      </div>
    </div>
  );
}
