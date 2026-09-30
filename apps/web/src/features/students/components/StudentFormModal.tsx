'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Student } from '../types';

export interface StudentFormModalProps {
  isOpen: boolean;
  editingStudent?: Student | null;
  onClose: () => void;
  onSave: (student: any) => void;
}

export function StudentFormModal({ isOpen, editingStudent, onClose, onSave }: StudentFormModalProps) {
  const [formData, setFormData] = useState({
    fullName: editingStudent?.fullName || '',
    dob: editingStudent?.dob || '2012-05-15',
    gender: editingStudent?.gender || 'male',
    residenceType: editingStudent?.residenceType || 'day',
    className: editingStudent?.className || 'Class VIII',
    sectionName: editingStudent?.sectionName || 'A',
    guardianName: editingStudent?.guardianName || '',
    guardianPhone: editingStudent?.guardianPhone || '',
    guardianEmail: editingStudent?.guardianEmail || ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const studentData = {
      id: editingStudent?.id || crypto.randomUUID(),
      tenantId: 'a1111111-1111-1111-1111-111111111111',
      admissionNo: editingStudent?.admissionNo || `ADM-2025-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'active',
      admissionDate: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      ...formData
    };
    onSave(studentData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg space-y-4 bg-[var(--bg-surface)]">
        <div className="flex justify-between items-center border-b border-[var(--border-subtle)] pb-2">
          <h3 className="font-display font-bold text-base text-[var(--text-primary)]">
            {editingStudent ? 'Edit Student Record' : 'Add New Student'}
          </h3>
          <button onClick={onClose} className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)]">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 max-h-[80vh] overflow-y-auto pr-1">
          <div className="space-y-3">
            <h4 className="font-display font-semibold text-xs text-[var(--brand-primary)]">Student Profile</h4>
            <Input
              label="Student Full Name"
              required
              value={formData.fullName}
              onChange={e => setFormData({ ...formData, fullName: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Date of Birth"
                type="date"
                required
                value={formData.dob}
                onChange={e => setFormData({ ...formData, dob: e.target.value })}
              />
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[var(--text-secondary)]">Gender</label>
                <select
                  className="w-full h-9 px-3 rounded-[6px] text-xs bg-[var(--bg-surface)] border border-[var(--border-default)]"
                  value={formData.gender}
                  onChange={e => setFormData({ ...formData, gender: e.target.value as any })}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[var(--text-secondary)]">Class</label>
                <select
                  className="w-full h-9 px-3 rounded-[6px] text-xs bg-[var(--bg-surface)] border border-[var(--border-default)]"
                  value={formData.className}
                  onChange={e => setFormData({ ...formData, className: e.target.value })}
                >
                  <option value="Class I">Class I</option>
                  <option value="Class V">Class V</option>
                  <option value="Class VIII">Class VIII</option>
                  <option value="Class X">Class X</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[var(--text-secondary)]">Section</label>
                <select
                  className="w-full h-9 px-3 rounded-[6px] text-xs bg-[var(--bg-surface)] border border-[var(--border-default)]"
                  value={formData.sectionName}
                  onChange={e => setFormData({ ...formData, sectionName: e.target.value })}
                >
                  <option value="A">Section A</option>
                  <option value="B">Section B</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[var(--text-secondary)]">Residence Type</label>
                <select
                  className="w-full h-9 px-3 rounded-[6px] text-xs bg-[var(--bg-surface)] border border-[var(--border-default)] font-semibold text-[var(--brand-primary)]"
                  value={formData.residenceType}
                  onChange={e => setFormData({ ...formData, residenceType: e.target.value as any })}
                >
                  <option value="day">Day Scholar</option>
                  <option value="hosteller">Hosteller</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-2 border-t border-[var(--border-subtle)]">
            <h4 className="font-display font-semibold text-xs text-[var(--brand-primary)]">Guardian Details</h4>
            <Input
              label="Guardian Name"
              required
              value={formData.guardianName}
              onChange={e => setFormData({ ...formData, guardianName: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Guardian Phone"
                required
                value={formData.guardianPhone}
                onChange={e => setFormData({ ...formData, guardianPhone: e.target.value })}
              />
              <Input
                label="Guardian Email"
                type="email"
                value={formData.guardianEmail}
                onChange={e => setFormData({ ...formData, guardianEmail: e.target.value })}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-[var(--border-subtle)]">
            <Button variant="secondary" type="button" onClick={onClose}>Cancel</Button>
            <Button variant="primary" type="submit">Save Student Record</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
