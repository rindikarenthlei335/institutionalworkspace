'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Facility } from '../types';
import { Plus, Pencil, Trash2 } from 'lucide-react';

const INITIAL_FACILITIES: Facility[] = [
  { id: 'fc1', tenantId: 'a1111111-1111-1111-1111-111111111111', title: 'Computer & AI Lab', description: '40 high-speed desktop systems with high-speed internet & coding software.', displayOrder: 1, isPublished: true },
  { id: 'fc2', tenantId: 'a1111111-1111-1111-1111-111111111111', title: 'Science Laboratories', description: 'Fully equipped Physics, Chemistry & Biology practical labs.', displayOrder: 2, isPublished: true }
];

export function CMSFacilityManager() {
  const [facilities, setFacilities] = useState<Facility[]>(INITIAL_FACILITIES);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Facility | null>(null);
  const [form, setForm] = useState({ title: '', description: '' });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      setFacilities(facilities.map(f => f.id === editing.id ? { ...f, ...form } : f));
    } else {
      const newFacility: Facility = {
        id: crypto.randomUUID(),
        tenantId: 'a1111111-1111-1111-1111-111111111111',
        ...form,
        displayOrder: facilities.length + 1,
        isPublished: true
      };
      setFacilities([...facilities, newFacility]);
    }
    setShowModal(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-display font-bold text-base text-[var(--text-primary)]">Campus Facilities</h3>
        <Button size="sm" variant="primary" icon={<Plus className="w-4 h-4" />} onClick={() => { setEditing(null); setForm({ title: '', description: '' }); setShowModal(true); }}>
          Add Facility
        </Button>
      </div>

      <Card className="p-0 overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[var(--border-default)] bg-[var(--bg-elevated)] text-[var(--text-secondary)]">
              <th className="p-3">Title</th>
              <th className="p-3">Description</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-subtle)]">
            {facilities.map((f) => (
              <tr key={f.id} className="hover:bg-[var(--bg-elevated)]/50">
                <td className="p-3 font-semibold text-[var(--text-primary)]">{f.title}</td>
                <td className="p-3 text-[var(--text-secondary)]">{f.description}</td>
                <td className="p-3 text-right space-x-2">
                  <button onClick={() => { setEditing(f); setForm({ title: f.title, description: f.description }); setShowModal(true); }} className="text-[var(--text-secondary)] hover:text-[var(--brand-primary)]">
                    <Pencil className="w-3.5 h-3.5 inline" />
                  </button>
                  <button onClick={() => setFacilities(facilities.filter(item => item.id !== f.id))} className="text-[var(--text-secondary)] hover:text-[var(--status-error)]">
                    <Trash2 className="w-3.5 h-3.5 inline" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md space-y-4 bg-[var(--bg-surface)]">
            <h3 className="font-display font-bold text-base text-[var(--text-primary)]">
              {editing ? 'Edit Facility' : 'Add Facility'}
            </h3>
            <form onSubmit={handleSave} className="space-y-4">
              <Input label="Facility Title" required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[var(--text-secondary)]">Short Description</label>
                <textarea rows={3} required className="w-full p-3 rounded-[6px] text-xs bg-[var(--bg-surface)] border border-[var(--border-default)] text-[var(--text-primary)]" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="secondary" type="button" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button variant="primary" type="submit">Save Facility</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
