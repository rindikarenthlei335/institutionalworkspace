'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function PayFeePage() {
  const [query, setQuery] = useState('');
  const [searched, setSearched] = useState(false);

  return (
    <div className="max-w-xl mx-auto px-4 py-12 space-y-8">
      <div>
        <span className="text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Parent Portal</span>
        <h1 className="font-display font-bold text-3xl text-[var(--text-primary)] mt-1">Online Fee Payment</h1>
      </div>

      <Card className="space-y-4">
        <h3 className="font-display font-semibold text-sm text-[var(--text-primary)]">
          Search Fee Dues by Admission Number
        </h3>
        <div className="flex gap-2">
          <Input
            placeholder="e.g. ADM-2024-0014"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <Button variant="primary" onClick={() => setSearched(true)}>
            Search
          </Button>
        </div>
      </Card>

      {searched && (
        <Card className="space-y-4 border-[var(--brand-primary)]">
          <div className="flex justify-between items-start border-b border-[var(--border-subtle)] pb-3">
            <div>
              <h4 className="font-display font-bold text-base text-[var(--text-primary)]">Aarav Sharma</h4>
              <p className="text-xs text-[var(--text-secondary)]">Class VIII-A · Roll No 14 (Day Scholar)</p>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[var(--status-warning)]/15 text-[var(--status-warning)]">
              Pending Dues
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-[var(--border-subtle)]">
              <span>Term 2 Tuition Fee</span>
              <span className="font-mono">₹ 8,400.00</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[var(--border-subtle)]">
              <span>Computer & Science Lab Fee</span>
              <span className="font-mono">₹ 4,000.00</span>
            </div>
            <div className="flex justify-between py-2 text-sm font-bold text-[var(--text-primary)]">
              <span>Total Payable</span>
              <span className="font-mono text-[var(--brand-primary)]">₹ 12,400.00</span>
            </div>
          </div>

          <Button variant="primary" className="w-full">
            Proceed to Secure Payment (Razorpay)
          </Button>
        </Card>
      )}
    </div>
  );
}
