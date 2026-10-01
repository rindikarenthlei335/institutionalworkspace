'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { FacultyMember } from '../types';
import { Plus, Pencil, Trash2 } from 'lucide-react';

const INITIAL_FACULTY: FacultyMember[] = [
  { id: 'f1', tenantId: 'a1111111-1111-1111-1111-111111111111', name: 'Dr. Lalthantluanga', designation: 'Principal', qualification: 'Ph.D. in Physics', experience: '18 Years', displayOrder: 1, isPublished: true, contactVisible: false },
  { id: 'f2', tenantId: 'a1111111-1111-1111-1111-111111111111', name: 'Ms. Sunita Kapoor', designation: 'Headmistress', qualification: 'M.A., M.Ed.', experience: '12 Years', displayOrder: 2, isPublished: true, contactVisible: false }
];

export function CMSFacultyManager() {
  const [faculty, setFaculty] = useState<FacultyMember[]>(INITIAL_FACULTY);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<FacultyMember | null>(null);
  const [form, setForm] = useState({ name: '', designation: '', qualification: '', experience: '' });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      setFaculty(faculty.map(f => f.id === editing.id ? { ...f, ...form } : f));
    } else {
      const newMember: FacultyMember = {
        id: crypto.randomUUID(),
        tenantId: 'a1111111-1111-1111-1111-111111111111',
        ...form,
        displayOrder: faculty.length + 1,
        isPublished: true,
        contactVisible: false
      };
      setFaculty([...faculty, newMember]);
    }
    setShowModal(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-display font-bold text-base text-[var(--text-primary)]">Faculty & Staff Directory</h3>
        <Button size="sm" variant="primary" icon={<Plus className="w-4 h-4" />} onClick={() => { setEditing(null); setForm({ name: '', designation: '', qualification: '', experience: '' }); setShowModal(true); }}>
          Add Faculty Member
        </Button>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[var(--border-default)] bg-[var(--bg-elevated)] text-[var(--text-secondary)]">
                <th className="p-3">Name</th>
                <th className="p-3">Designation</th>
                <th className="p-3">Qualification</th>
                <th className="p-3">Experience</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {faculty.map((f) => (
                <tr key={f.id} className="hover:bg-[var(--bg-elevated)]/50">
                  <td className="p-3 font-semibold text-[var(--text-primary)]">{f.name}</td>
                  <td className="p-3 font-semibold text-[var(--brand-primary)]">{f.designation}</td>
                  <td className="p-3 text-[var(--text-secondary)]">{f.qualification}</td>
                  <td className="p-3 text-[var(--text-secondary)]">{f.experience}</td>
                  <td className="p-3 text-right space-x-2">
                    <button onClick={() => { setEditing(f); setForm({ name: f.name, designation: f.designation, qualification: f.qualification || '', experience: f.experience || '' }); setShowModal(true); }} className="text-[var(--text-secondary)] hover:text-[var(--brand-primary)]">
                      <Pencil className="w-3.5 h-3.5 inline" />
                    </button>
                    <button onClick={() => setFaculty(faculty.filter(item => item.id !== f.id))} className="text-[var(--text-secondary)] hover:text-[var(--status-error)]">
                      <Trash2 className="w-3.5 h-3.5 inline" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md space-y-4 bg-[var(--bg-surface)]">
            <h3 className="font-display font-bold text-base text-[var(--text-primary)]">
              {editing ? 'Edit Faculty Member' : 'Add Faculty Member'}
            </h3>
            <form onSubmit={handleSave} className="space-y-4">
              <Input label="Full Name" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              <Input label="Designation" required value={form.designation} onChange={e => setForm({ ...form, designation: e.target.value })} />
              <Input label="Qualification" value={form.qualification} onChange={e => setForm({ ...form, qualification: e.target.value })} />
              <Input label="Years of Experience" value={form.experience} onChange={e => setForm({ ...form, experience: e.target.value })} />
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="secondary" type="button" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button variant="primary" type="submit">Save Member</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
