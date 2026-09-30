'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { GalleryAlbum } from '../types';
import { Plus, Pencil, Trash2, Image as ImageIcon } from 'lucide-react';

const INITIAL_ALBUMS: GalleryAlbum[] = [
  { id: 'g1', tenantId: 'a1111111-1111-1111-1111-111111111111', title: 'Annual Day Celebrations 2024', eventDate: '2024-12-01', displayOrder: 1, isPublished: true },
  { id: 'g2', tenantId: 'a1111111-1111-1111-1111-111111111111', title: 'Inter-House Sports Meet', eventDate: '2024-11-15', displayOrder: 2, isPublished: true }
];

export function CMSGalleryManager() {
  const [albums, setAlbums] = useState<GalleryAlbum[]>(INITIAL_ALBUMS);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<GalleryAlbum | null>(null);
  const [form, setForm] = useState({ title: '', eventDate: '' });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      setAlbums(albums.map(a => a.id === editing.id ? { ...a, ...form } : a));
    } else {
      const newAlbum: GalleryAlbum = {
        id: crypto.randomUUID(),
        tenantId: 'a1111111-1111-1111-1111-111111111111',
        ...form,
        displayOrder: albums.length + 1,
        isPublished: true
      };
      setAlbums([...albums, newAlbum]);
    }
    setShowModal(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-display font-bold text-base text-[var(--text-primary)]">Gallery Albums</h3>
        <Button size="sm" variant="primary" icon={<Plus className="w-4 h-4" />} onClick={() => { setEditing(null); setForm({ title: '', eventDate: '' }); setShowModal(true); }}>
          Create Album
        </Button>
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {albums.map((a) => (
          <Card key={a.id} className="space-y-3">
            <div className="h-28 bg-[var(--bg-elevated)] rounded-[6px] flex items-center justify-center text-[var(--text-secondary)]">
              <ImageIcon className="w-8 h-8 opacity-50" />
            </div>
            <div>
              <h4 className="font-display font-bold text-sm text-[var(--text-primary)]">{a.title}</h4>
              <p className="text-[11px] text-[var(--text-secondary)]">Date: {a.eventDate}</p>
            </div>
            <div className="flex justify-end gap-2 pt-1 border-t border-[var(--border-subtle)]">
              <button onClick={() => { setEditing(a); setForm({ title: a.title, eventDate: a.eventDate || '' }); setShowModal(true); }} className="text-[11px] font-semibold text-[var(--brand-primary)]">
                Edit
              </button>
              <button onClick={() => setAlbums(albums.filter(item => item.id !== a.id))} className="text-[11px] font-semibold text-[var(--status-error)]">
                Delete
              </button>
            </div>
          </Card>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md space-y-4 bg-[var(--bg-surface)]">
            <h3 className="font-display font-bold text-base text-[var(--text-primary)]">
              {editing ? 'Edit Album' : 'Create Gallery Album'}
            </h3>
            <form onSubmit={handleSave} className="space-y-4">
              <Input label="Album Title" required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
              <Input label="Event Date" type="date" value={form.eventDate} onChange={e => setForm({ ...form, eventDate: e.target.value })} />
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="secondary" type="button" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button variant="primary" type="submit">Save Album</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
