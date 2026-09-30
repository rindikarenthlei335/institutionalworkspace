'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { AdmissionApplication } from '../types';
import { UserCheck } from 'lucide-react';

export interface ConvertToStudentModalProps {
  application: AdmissionApplication | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newStudent: any) => void;
}

export function ConvertToStudentModal({ application, isOpen, onClose, onSuccess }: ConvertToStudentModalProps) {
  const [section, setSection] = useState('A');
  const [rollNo, setRollNo] = useState(15);
  const [converting, setConverting] = useState(false);

  if (!isOpen || !application) return null;

  const handleConvert = (e: React.FormEvent) => {
    e.preventDefault();
    setConverting(true);
    setTimeout(() => {
      const admissionNo = `ADM-2025-${Math.floor(1000 + Math.random() * 9000)}`;
      const newStudent = {
        id: crypto.randomUUID(),
        admissionNo,
        rollNo,
        fullName: application.studentName,
        className: application.className,
        sectionName: section,
        residenceType: application.residenceType,
        guardianName: application.guardianName,
        guardianPhone: application.guardianPhone,
        status: 'active'
      };
      onSuccess(newStudent);
      setConverting(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
      {/* TODO(design): Admission Application Review & Convert-to-Student Workflow */}
      <Card className="w-full max-w-md space-y-4 bg-[var(--bg-surface)]">
        <div className="flex items-center gap-2 border-b border-[var(--border-subtle)] pb-2 text-[var(--brand-primary)]">
          <UserCheck className="w-5 h-5" />
          <h3 className="font-display font-bold text-base text-[var(--text-primary)]">
            Approve & Convert to Student
          </h3>
        </div>

        <div className="p-3 bg-[var(--brand-primary-soft)]/20 rounded text-xs space-y-1">
          <p className="font-semibold text-[var(--text-primary)]">Applicant: {application.studentName}</p>
          <p className="text-[var(--text-secondary)]">Application No: {application.applicationNo} ({application.className})</p>
          <p className="text-[var(--text-secondary)]">Residence: {application.residenceType === 'hosteller' ? 'Hosteller' : 'Day Scholar'}</p>
        </div>

        <form onSubmit={handleConvert} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[var(--text-secondary)]">Assign Section</label>
              <select
                className="w-full h-9 px-3 rounded-[6px] text-xs bg-[var(--bg-surface)] border border-[var(--border-default)] font-semibold"
                value={section}
                onChange={e => setSection(e.target.value)}
              >
                <option value="A">Section A</option>
                <option value="B">Section B</option>
              </select>
            </div>

            <Input
              label="Assign Roll No"
              type="number"
              required
              value={rollNo}
              onChange={e => setRollNo(Number(e.target.value))}
            />
          </div>

          <div className="p-2.5 bg-[var(--bg-elevated)] rounded text-[11px] text-[var(--text-secondary)] space-y-1">
            <p className="font-semibold text-[var(--text-primary)]">Automatic Actions on Approval:</p>
            <p>1. Auto-generate Admission Number (e.g. ADM-2025-XXXX)</p>
            <p>2. Create Student & Guardian records in database</p>
            <p>3. Generate initial Term 1 fee invoice for {application.residenceType}</p>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-[var(--border-subtle)]">
            <Button variant="secondary" type="button" onClick={onClose}>Cancel</Button>
            <Button variant="primary" loading={converting} type="submit">Approve & Enrol Student</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
