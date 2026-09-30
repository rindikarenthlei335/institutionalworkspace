'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { FeeStructure } from '../types';
import { Plus, Trash2 } from 'lucide-react';

const INITIAL_STRUCTURES: FeeStructure[] = [
  { id: 'fs1', tenantId: 'a1111111-1111-1111-1111-111111111111', academicYearId: 'ay1', classId: 'c1', className: 'Class VIII', residenceType: 'day', feeHeadId: 'fh1', feeHeadName: 'Tuition Fee', amount: 8400, dueDate: '2024-12-10' },
  { id: 'fs2', tenantId: 'a1111111-1111-1111-1111-111111111111', academicYearId: 'ay1', classId: 'c1', className: 'Class VIII', residenceType: 'hosteller', feeHeadId: 'fh1', feeHeadName: 'Tuition Fee', amount: 8400, dueDate: '2024-12-10' },
  { id: 'fs3', tenantId: 'a1111111-1111-1111-1111-111111111111', academicYearId: 'ay1', classId: 'c1', className: 'Class VIII', residenceType: 'hosteller', feeHeadId: 'fh2', feeHeadName: 'Hostel & Mess Charges', amount: 15000, dueDate: '2024-12-10' }
];

export function FeeStructureBuilder() {
  const [structures, setStructures] = useState<FeeStructure[]>(INITIAL_STRUCTURES);
  const [selectedClass, setSelectedClass] = useState('Class VIII');
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState({ feeHeadName: 'Tuition Fee', residenceType: 'day' as 'day' | 'hosteller', amount: 5000 });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const newStructure: FeeStructure = {
      id: crypto.randomUUID(),
      tenantId: 'a1111111-1111-1111-1111-111111111111',
      academicYearId: 'ay1',
      classId: 'c1',
      className: selectedClass,
      residenceType: form.residenceType,
      feeHeadId: 'fh-custom',
      feeHeadName: form.feeHeadName,
      amount: form.amount,
      dueDate: '2024-12-10'
    };
    setStructures([...structures, newStructure]);
    setShowAddModal(false);
  };

  const filtered = structures.filter(s => s.className === selectedClass);

  return (
    <div className="space-y-4">
      {/* TODO(design): Fee Structure Builder (Day vs Hosteller Split) */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-[var(--text-secondary)]">Class Filter:</label>
          <select
            className="h-8 px-3 rounded text-xs bg-[var(--bg-surface)] border border-[var(--border-default)] font-semibold"
            value={selectedClass}
            onChange={e => setSelectedClass(e.target.value)}
          >
            <option value="Class I">Class I</option>
            <option value="Class V">Class V</option>
            <option value="Class VIII">Class VIII</option>
            <option value="Class X">Class X</option>
          </select>
        </div>
        <Button size="sm" variant="primary" icon={<Plus className="w-4 h-4" />} onClick={() => setShowAddModal(true)}>
          Add Fee Structure Line
        </Button>
      </div>

      <Card className="p-0 overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[var(--border-default)] bg-[var(--bg-elevated)] text-[var(--text-secondary)]">
              <th className="p-3">Fee Head</th>
              <th className="p-3">Target Residence Type</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Due Date</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-subtle)]">
            {filtered.map((s) => (
              <tr key={s.id} className="hover:bg-[var(--bg-elevated)]/50">
                <td className="p-3 font-semibold text-[var(--text-primary)]">{s.feeHeadName}</td>
                <td className="p-3">
                  {s.residenceType === 'hosteller' ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[var(--brand-primary-soft)] text-[var(--brand-primary)]">
                      Hosteller Only
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[var(--bg-elevated)] text-[var(--text-secondary)]">
                      Day Scholar
                    </span>
                  )}
                </td>
                <td className="p-3 font-mono font-bold text-[var(--brand-primary)]">
                  ₹ {s.amount.toLocaleString('en-IN')}.00
                </td>
                <td className="p-3 text-[var(--text-secondary)] tabular-nums">{s.dueDate || '—'}</td>
                <td className="p-3 text-right">
                  <button onClick={() => setStructures(structures.filter(item => item.id !== s.id))} className="text-[var(--status-error)] hover:underline">
                    <Trash2 className="w-3.5 h-3.5 inline" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md space-y-4 bg-[var(--bg-surface)]">
            <h3 className="font-display font-bold text-base text-[var(--text-primary)]">
              Add Fee Line for {selectedClass}
            </h3>
            <form onSubmit={handleAdd} className="space-y-4">
              <Input
                label="Fee Head Name"
                required
                value={form.feeHeadName}
                onChange={e => setForm({ ...form, feeHeadName: e.target.value })}
              />
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[var(--text-secondary)]">Residence Type</label>
                <select
                  className="w-full h-9 px-3 rounded-[6px] text-xs bg-[var(--bg-surface)] border border-[var(--border-default)] font-semibold text-[var(--brand-primary)]"
                  value={form.residenceType}
                  onChange={e => setForm({ ...form, residenceType: e.target.value as any })}
                >
                  <option value="day">Day Scholar</option>
                  <option value="hosteller">Hosteller</option>
                </select>
              </div>
              <Input
                label="Amount (INR)"
                type="number"
                required
                value={form.amount}
                onChange={e => setForm({ ...form, amount: Number(e.target.value) })}
              />
              <div className="flex justify-end gap-2 pt-2 border-t border-[var(--border-subtle)]">
                <Button variant="secondary" type="button" onClick={() => setShowAddModal(false)}>Cancel</Button>
                <Button variant="primary" type="submit">Save Fee Line</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
