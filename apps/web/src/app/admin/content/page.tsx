'use client';

import React, { useState } from 'react';
import { CMSNoticeManager } from '@/features/cms/components/CMSNoticeManager';
import { CMSFacultyManager } from '@/features/cms/components/CMSFacultyManager';
import { CMSFacilityManager } from '@/features/cms/components/CMSFacilityManager';
import { CMSGalleryManager } from '@/features/cms/components/CMSGalleryManager';
import { CMSHomeSlideManager } from '@/features/cms/components/CMSHomeSlideManager';

export default function AdminContentPage() {
  const [tab, setTab] = useState<'notices' | 'faculty' | 'facilities' | 'gallery' | 'slides'>('notices');

  return (
    <div className="space-y-6">
      <div>
        <span className="text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider">CMS Manager</span>
        <h1 className="font-display font-bold text-2xl text-[var(--text-primary)]">Website Content</h1>
      </div>

      {/* Navigation Tabs */}
      <div className="flex bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[6px] p-1 gap-1 w-fit">
        {[
          { id: 'notices', label: 'Notices' },
          { id: 'faculty', label: 'Faculty' },
          { id: 'facilities', label: 'Facilities' },
          { id: 'gallery', label: 'Gallery' },
          { id: 'slides', label: 'Hero Slides' }
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as any)}
            className={`px-4 h-8 rounded-[4px] text-xs font-semibold transition-all cursor-pointer ${
              tab === t.id
                ? 'bg-[var(--brand-primary)] text-white'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      {tab === 'notices' && <CMSNoticeManager />}
      {tab === 'faculty' && <CMSFacultyManager />}
      {tab === 'facilities' && <CMSFacilityManager />}
      {tab === 'gallery' && <CMSGalleryManager />}
      {tab === 'slides' && <CMSHomeSlideManager />}
    </div>
  );
}
