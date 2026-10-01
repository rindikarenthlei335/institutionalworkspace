'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Notice } from '../types';
import { Plus, Pencil, Trash2, Pin } from 'lucide-react';

const INITIAL_NOTICES: Notice[] = [
  {
    id: 'n1',
    tenantId: 'a1111111-1111-1111-1111-111111111111',
    title: 'Annual Sports Meet 2025',
    body: 'The Annual Sports Meet will be held on December 15th at the main ground. All students must assemble by 8:30 AM.',
    category: 'Event',
    isPinned: true,
    isPublished: true,
    publishAt: '2024-12-01T00:00:00Z',
    createdAt: '2024-12-01T00:00:00Z'
  },
  {
    id: 'n2',
    tenantId: 'a1111111-1111-1111-1111-111111111111',
    title: 'Winter Vacation Schedule',
    body: 'School will remain closed for winter break from Dec 22 to Jan 10.',
    category: 'Holiday',
    isPinned: false,
    isPublished: true,
    publishAt: '2024-12-05T00:00:00Z',
    createdAt: '2024-12-05T00:00:00Z'
  }
];

export function CMSNoticeManager() {
  const [notices, setNotices] = useState<Notice[]>(INITIAL_NOTICES);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Notice | null>(null);
  const [form, setForm] = useState({ title: '', body: '', category: 'General', isPinned: false });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      setNotices(notices.map(n => n.id === editing.id ? { ...n, ...form } : n));
    } else {
      const newNotice: Notice = {
        id: crypto.randomUUID(),
        tenantId: 'a1111111-1111-1111-1111-111111111111',
        title: form.title,
        body: form.body,
        category: form.category,
        isPinned: form.isPinned,
        isPublished: true,
        publishAt: new Date().toISOString(),
        createdAt: new Date().toISOString()
      };
      setNotices([newNotice, ...notices]);
    }
    setShowModal(false);
    setEditing(null);
    setForm({ title: '', body: '', category: 'General', isPinned: false });
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this notice?')) {
      setNotices(notices.filter(n => n.id !== id));
    }
  };

  const handleEdit = (notice: Notice) => {
    setEditing(notice);
    setForm({ title: notice.title, body: notice.body, category: notice.category, isPinned: notice.isPinned });
    setShowModal(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-display font-bold text-base text-[var(--text-primary)]">School Notices</h3>
        <Button
          size="sm"
          variant="primary"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => { setEditing(null); setForm({ title: '', body: '', category: 'General', isPinned: false }); setShowModal(true); }}
        >
          Add Notice
        </Button>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[var(--border-default)] bg-[var(--bg-elevated)] text-[var(--text-secondary)]">
                <th className="p-3">Title</th>
                <th className="p-3">Category</th>
                <th className="p-3">Pinned</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {notices.map((n) => (
                <tr key={n.id} className="hover:bg-[var(--bg-elevated)]/50">
                  <td className="p-3 font-semibold text-[var(--text-primary)]">{n.title}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-[var(--brand-primary-soft)] text-[var(--brand-primary)] font-semibold">
                      {n.category}
                    </span>
                  </td>
                  <td className="p-3">
                    {n.isPinned && <Pin className="w-3.5 h-3.5 text-[var(--status-warning)] inline" />}
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-[var(--status-success)]/15 text-[var(--status-success)] font-semibold">
                      Published
                    </span>
                  </td>
                  <td className="p-3 text-right space-x-2">
                    <button onClick={() => handleEdit(n)} className="text-[var(--text-secondary)] hover:text-[var(--brand-primary)]">
                      <Pencil className="w-3.5 h-3.5 inline" />
                    </button>
                    <button onClick={() => handleDelete(n.id)} className="text-[var(--text-secondary)] hover:text-[var(--status-error)]">
                      <Trash2 className="w-3.5 h-3.5 inline" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md space-y-4 bg-[var(--bg-surface)]">
            <h3 className="font-display font-bold text-base text-[var(--text-primary)]">
              {editing ? 'Edit Notice' : 'Add New Notice'}
            </h3>
            <form onSubmit={handleSave} className="space-y-4">
              <Input
                label="Notice Title"
                required
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
              />
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[var(--text-secondary)]">Category</label>
                <select
                  className="w-full h-9 px-3 rounded-[6px] text-xs bg-[var(--bg-surface)] border border-[var(--border-default)] text-[var(--text-primary)]"
                  value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })}
                >
                  <option value="General">General</option>
                  <option value="Event">Event</option>
                  <option value="Holiday">Holiday</option>
                  <option value="Exam">Exam</option>
                  <option value="Finance">Finance</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[var(--text-secondary)]">Notice Content</label>
                <textarea
                  rows={4}
                  required
                  className="w-full p-3 rounded-[6px] text-xs bg-[var(--bg-surface)] border border-[var(--border-default)] text-[var(--text-primary)]"
                  value={form.body}
                  onChange={e => setForm({ ...form, body: e.target.value })}
                />
              </div>
              <label className="flex items-center gap-2 text-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isPinned}
                  onChange={e => setForm({ ...form, isPinned: e.target.checked })}
                />
                <span>Pin notice to top of public homepage</span>
              </label>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="secondary" type="button" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button variant="primary" type="submit">Save Notice</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
