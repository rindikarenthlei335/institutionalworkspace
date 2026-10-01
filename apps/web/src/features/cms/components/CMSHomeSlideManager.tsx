'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { HomeSlide } from '../types';
import { Plus, Pencil, Trash2 } from 'lucide-react';

const INITIAL_SLIDES: HomeSlide[] = [
  { id: 's1', tenantId: 'a1111111-1111-1111-1111-111111111111', title: 'Admissions Open 2025–26', subtitle: 'Nurturing excellence & character', imageUrl: '/banner1.webp', ctaText: 'Apply Now', ctaLink: '/admission', displayOrder: 1, isPublished: true }
];

export function CMSHomeSlideManager() {
  const [slides, setSlides] = useState<HomeSlide[]>(INITIAL_SLIDES);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<HomeSlide | null>(null);
  const [form, setForm] = useState({ title: '', subtitle: '', ctaText: '', ctaLink: '' });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      setSlides(slides.map(s => s.id === editing.id ? { ...s, ...form } : s));
    } else {
      const newSlide: HomeSlide = {
        id: crypto.randomUUID(),
        tenantId: 'a1111111-1111-1111-1111-111111111111',
        ...form,
        imageUrl: '/banner-default.webp',
        displayOrder: slides.length + 1,
        isPublished: true
      };
      setSlides([...slides, newSlide]);
    }
    setShowModal(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-display font-bold text-base text-[var(--text-primary)]">Homepage Hero Slides</h3>
        <Button size="sm" variant="primary" icon={<Plus className="w-4 h-4" />} onClick={() => { setEditing(null); setForm({ title: '', subtitle: '', ctaText: '', ctaLink: '' }); setShowModal(true); }}>
          Add Slide
        </Button>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[var(--border-default)] bg-[var(--bg-elevated)] text-[var(--text-secondary)]">
                <th className="p-3">Title</th>
                <th className="p-3">Subtitle</th>
                <th className="p-3">CTA Button</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {slides.map((s) => (
                <tr key={s.id} className="hover:bg-[var(--bg-elevated)]/50">
                  <td className="p-3 font-semibold text-[var(--text-primary)]">{s.title}</td>
                  <td className="p-3 text-[var(--text-secondary)]">{s.subtitle}</td>
                  <td className="p-3 font-mono text-[11px]">{s.ctaText || 'None'}</td>
                  <td className="p-3 text-right space-x-2">
                    <button onClick={() => { setEditing(s); setForm({ title: s.title, subtitle: s.subtitle || '', ctaText: s.ctaText || '', ctaLink: s.ctaLink || '' }); setShowModal(true); }} className="text-[var(--text-secondary)] hover:text-[var(--brand-primary)]">
                      <Pencil className="w-3.5 h-3.5 inline" />
                    </button>
                    <button onClick={() => setSlides(slides.filter(item => item.id !== s.id))} className="text-[var(--text-secondary)] hover:text-[var(--status-error)]">
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
              {editing ? 'Edit Slide' : 'Add Hero Slide'}
            </h3>
            <form onSubmit={handleSave} className="space-y-4">
              <Input label="Slide Title" required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
              <Input label="Subtitle" value={form.subtitle} onChange={e => setForm({ ...form, subtitle: e.target.value })} />
              <Input label="CTA Button Text" value={form.ctaText} onChange={e => setForm({ ...form, ctaText: e.target.value })} />
              <Input label="CTA Button Link" value={form.ctaLink} onChange={e => setForm({ ...form, ctaLink: e.target.value })} />
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="secondary" type="button" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button variant="primary" type="submit">Save Slide</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
