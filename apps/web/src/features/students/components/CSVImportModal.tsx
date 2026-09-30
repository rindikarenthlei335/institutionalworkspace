'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Upload, CheckCircle2, AlertTriangle } from 'lucide-react';

export interface CSVImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess: (count: number) => void;
}

export function CSVImportModal({ isOpen, onClose, onImportSuccess }: CSVImportModalProps) {
  const [fileUploaded, setFileUploaded] = useState(false);
  const [validating, setValidating] = useState(false);

  if (!isOpen) return null;

  const handleUpload = () => {
    setValidating(true);
    setTimeout(() => {
      setFileUploaded(true);
      setValidating(false);
    }, 600);
  };

  const handleConfirmImport = () => {
    onImportSuccess(12);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
      {/* TODO(design): Student CSV Import & Validation Errors Report Modal */}
      <Card className="w-full max-w-lg space-y-4 bg-[var(--bg-surface)]">
        <div className="flex justify-between items-center border-b border-[var(--border-subtle)] pb-2">
          <h3 className="font-display font-bold text-base text-[var(--text-primary)]">
            Bulk Student CSV Import
          </h3>
          <button onClick={onClose} className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)]">✕</button>
        </div>

        {!fileUploaded ? (
          <div className="border-2 border-dashed border-[var(--border-strong)] rounded-lg p-8 text-center space-y-3">
            <Upload className="w-8 h-8 text-[var(--brand-primary)] mx-auto" />
            <p className="text-xs text-[var(--text-secondary)]">
              Drag & drop student CSV file here, or click to browse.
            </p>
            <Button size="sm" variant="secondary" loading={validating} onClick={handleUpload}>
              Select CSV File
            </Button>
            <p className="text-[10px] text-[var(--text-secondary)]">
              CSV must contain headers: <code className="font-mono bg-[var(--bg-elevated)] px-1">fullName, dob, gender, residenceType, className, guardianName, guardianPhone</code>
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-3 rounded bg-[var(--status-success)]/15 border border-[var(--status-success)] text-xs space-y-1">
              <span className="font-semibold text-[var(--status-success)]">✓ CSV Validation Passed</span>
              <p className="text-[11px] text-[var(--text-secondary)]">12 valid rows found. 0 duplicate roll numbers.</p>
            </div>

            <div className="max-h-40 overflow-y-auto border border-[var(--border-default)] rounded text-xs">
              <table className="w-full text-left">
                <thead className="bg-[var(--bg-elevated)] border-b border-[var(--border-default)]">
                  <tr>
                    <th className="p-2">Name</th>
                    <th className="p-2">Class</th>
                    <th className="p-2">Residence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-subtle)]">
                  <tr><td className="p-2 font-semibold">David Lalnunmawia</td><td className="p-2">Class VIII</td><td className="p-2">Day</td></tr>
                  <tr><td className="p-2 font-semibold">Zorampari</td><td className="p-2">Class VIII</td><td className="p-2">Hosteller</td></tr>
                </tbody>
              </table>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[var(--border-subtle)]">
              <Button variant="secondary" onClick={() => setFileUploaded(false)}>Upload Different File</Button>
              <Button variant="primary" onClick={handleConfirmImport}>Confirm & Insert 12 Records</Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
