import React from 'react';
import { Card } from '@/components/ui/Card';

export default function GalleryPage() {
  const albums = [
    { title: 'Annual Day Celebrations 2024', count: '24 Photos', date: 'Dec 2024' },
    { title: 'Inter-House Sports Meet', count: '36 Photos', date: 'Nov 2024' },
    { title: 'Science Exhibition', count: '18 Photos', date: 'Oct 2024' }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-8">
      <div>
        <span className="text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Media Gallery</span>
        <h1 className="font-display font-bold text-3xl text-[var(--text-primary)] mt-1">Photo Albums</h1>
      </div>

      <div className="grid sm:grid-cols-3 gap-6">
        {albums.map((album, i) => (
          <Card key={i} className="hover:border-[var(--brand-primary)] transition-all cursor-pointer">
            <div className="h-32 bg-[var(--bg-elevated)] rounded-[6px] flex items-center justify-center text-xs font-semibold text-[var(--text-secondary)] mb-3">
              Album Preview
            </div>
            <h3 className="font-display font-bold text-sm text-[var(--text-primary)]">{album.title}</h3>
            <div className="flex justify-between items-center text-[11px] text-[var(--text-secondary)] mt-1">
              <span>{album.count}</span>
              <span>{album.date}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
