'use client';

import React, { useState } from 'react';
import { SchoolTemplate, PlanTier } from '../types';
import { MASTER_TEMPLATES, isTemplateUnlocked, TIER_CONFIG } from '../data/templates';
import { TemplatePreviewModal } from './TemplatePreviewModal';
import { THEME_PRESETS } from '@eduportal/shared';
import {
  Sparkles,
  Lock,
  CheckCircle2,
  Eye,
  Palette,
  Layers,
  ArrowRight,
  Filter,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface TemplateSelectorSectionProps {
  currentPlan?: PlanTier;
  onPlanSelect?: (tier: PlanTier) => void;
}

export function TemplateSelectorSection({
  currentPlan = 'essential',
  onPlanSelect
}: TemplateSelectorSectionProps) {
  const [selectedTierFilter, setSelectedTierFilter] = useState<'all' | PlanTier>('all');
  const [previewTemplate, setPreviewTemplate] = useState<SchoolTemplate | null>(null);
  const [activeTemplateId, setActiveTemplateId] = useState<string>('template-1-trident');
  const [activeThemeId, setActiveThemeId] = useState<string>('forest');

  const filteredTemplates = MASTER_TEMPLATES.filter((tmpl) => {
    if (selectedTierFilter === 'all') return true;
    if (selectedTierFilter === 'basic') return tmpl.minTier === 'basic';
    if (selectedTierFilter === 'essential') return tmpl.minTier === 'basic' || tmpl.minTier === 'essential';
    if (selectedTierFilter === 'pro') return tmpl.minTier === 'basic' || tmpl.minTier === 'essential' || tmpl.minTier === 'pro';
    return true; // pro_plus gets all
  });

  const handleSelectTemplate = (templateId: string) => {
    setActiveTemplateId(templateId);
    if (typeof window !== 'undefined') {
      localStorage.setItem('eduportal_active_template', templateId);
    }
  };

  const handleSelectTheme = (themeId: string) => {
    setActiveThemeId(themeId);
    if (typeof window !== 'undefined') {
      localStorage.setItem('eduportal_active_theme', themeId);
      // Dynamically apply primary color to document root
      const preset = THEME_PRESETS.find(p => p.id === themeId);
      if (preset) {
        document.documentElement.style.setProperty('--brand-primary', preset.primaryHex);
        document.documentElement.style.setProperty('--brand-primary-hover', preset.primaryHoverHex);
        document.documentElement.style.setProperty('--brand-primary-soft', preset.primarySoftHex);
      }
    }
  };

  return (
    <section className="space-y-8 py-8 border-t border-[var(--border-default)]">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-700 dark:text-emerald-300">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive Template & Design Selector</span>
        </div>
        <h2 className="font-display font-bold text-2xl sm:text-3xl text-[var(--text-primary)]">
          School Website Design Templates
        </h2>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
          Every tier unlocks distinct professional school layouts. Higher plans cumulatively include all lower plan templates. 
          <span className="font-semibold text-emerald-600 dark:text-emerald-400 block mt-1">
            ✨ Theme Color Palettes can be changed in ANY plan without restrictions!
          </span>
        </p>
      </div>

      {/* Universal Theme Palette Customizer (Available in ANY Tier) */}
      <div className="bg-[var(--bg-surface)] p-4 sm:p-5 rounded-2xl border border-[var(--border-default)] shadow-xs max-w-4xl mx-auto space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-[var(--border-subtle)] pb-3">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-emerald-600" />
            <h3 className="font-display font-bold text-sm text-[var(--text-primary)]">
              Brand Color Theme Customizer
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 font-bold">
              Included in All Plans (₹1,499+)
            </span>
          </div>
          <span className="text-xs text-[var(--text-secondary)]">
            Click to test instant live theme change:
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 pt-1">
          {THEME_PRESETS.map((preset) => {
            const isThemeActive = activeThemeId === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectTheme(preset.id)}
                className={`p-2 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
                  isThemeActive
                    ? 'border-emerald-600 bg-emerald-500/10 shadow-xs ring-1 ring-emerald-500/30'
                    : 'border-[var(--border-default)] hover:border-emerald-400 bg-[var(--bg-elevated)]/40'
                }`}
              >
                <span
                  className="w-4 h-4 rounded-full shrink-0 border border-black/10 shadow-xs"
                  style={{ backgroundColor: preset.primaryHex }}
                />
                <div className="min-w-0 flex-1">
                  <span className="block text-xs font-semibold text-[var(--text-primary)] truncate">
                    {preset.name.split(' ')[0]}
                  </span>
                </div>
                {isThemeActive && <Check className="w-3 h-3 text-emerald-600 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Plan Filter Tabs with Template Counts */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => setSelectedTierFilter('all')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            selectedTierFilter === 'all'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] border border-[var(--border-default)] hover:bg-[var(--bg-elevated)]'
          }`}
        >
          All Templates (15)
        </button>

        <button
          type="button"
          onClick={() => setSelectedTierFilter('basic')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
            selectedTierFilter === 'basic'
              ? 'bg-emerald-800 text-white shadow-sm'
              : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] border border-[var(--border-default)] hover:bg-[var(--bg-elevated)]'
          }`}
        >
          <span>Basic Plan (1 Template)</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/20">₹1,499</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedTierFilter('essential')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
            selectedTierFilter === 'essential'
              ? 'bg-amber-800 text-white shadow-sm'
              : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] border border-[var(--border-default)] hover:bg-[var(--bg-elevated)]'
          }`}
        >
          <span>Essential Plan (4 Templates)</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/20">₹3,999</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedTierFilter('pro')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
            selectedTierFilter === 'pro'
              ? 'bg-blue-800 text-white shadow-sm'
              : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] border border-[var(--border-default)] hover:bg-[var(--bg-elevated)]'
          }`}
        >
          <span>Pro Plan (10 Templates)</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/20">₹8,000</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedTierFilter('pro_plus')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
            selectedTierFilter === 'pro_plus'
              ? 'bg-purple-800 text-white shadow-sm'
              : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] border border-[var(--border-default)] hover:bg-[var(--bg-elevated)]'
          }`}
        >
          <span>Pro+ / Ultimate (15 Templates)</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/20">₹9,999</span>
        </button>
      </div>

      {/* Template Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredTemplates.map((template) => {
          const isUnlocked = isTemplateUnlocked(template.minTier, currentPlan);
          const isCurrentActive = activeTemplateId === template.id;

          return (
            <div
              key={template.id}
              className={`rounded-2xl border bg-[var(--bg-surface)] flex flex-col overflow-hidden transition-all duration-200 group hover:shadow-lg ${
                isCurrentActive
                  ? 'border-emerald-500 ring-2 ring-emerald-500/30'
                  : 'border-[var(--border-default)] hover:border-[var(--border-strong)]'
              }`}
            >
              {/* Card Screenshot Preview */}
              <div className="relative aspect-[16/10] bg-slate-900 overflow-hidden cursor-pointer" onClick={() => setPreviewTemplate(template)}>
                <img
                  src={template.previewImage}
                  alt={template.name}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Overlay Badge */}
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-black/75 text-white backdrop-blur-xs">
                    {template.code}
                  </span>
                  {isCurrentActive && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500 text-white shadow-xs">
                      Active
                    </span>
                  )}
                </div>

                <div className="absolute top-2.5 right-2.5">
                  {isUnlocked ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-600/90 text-white shadow-xs flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Unlocked</span>
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/75 text-amber-300 border border-amber-400/40 shadow-xs flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      <span>{TIER_CONFIG[template.minTier].name}</span>
                    </span>
                  )}
                </div>

                {/* Hover Preview Quick Button */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreviewTemplate(template);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-white text-slate-900 font-bold text-xs shadow-lg flex items-center gap-1.5 active:scale-95 transition-all"
                  >
                    <Eye className="w-4 h-4 text-emerald-600" />
                    <span>View Architecture Details</span>
                  </button>
                </div>
              </div>

              {/* Card Meta Content */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--brand-primary)] block">
                    {template.category}
                  </span>
                  <h4 className="font-display font-bold text-sm sm:text-base text-[var(--text-primary)] leading-snug group-hover:text-[var(--brand-primary)] transition-colors">
                    {template.name}
                  </h4>
                  <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                    {template.description}
                  </p>
                </div>

                {/* Key Stats Chips */}
                <div className="flex items-center gap-1.5 flex-wrap pt-1 text-[10px] font-medium text-[var(--text-secondary)]">
                  {template.stats.slice(0, 3).map((st, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
                      {st.label}: <strong className="text-[var(--text-primary)]">{st.value}</strong>
                    </span>
                  ))}
                </div>

                {/* Footer Buttons */}
                <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setPreviewTemplate(template)}
                    className="text-xs font-semibold text-[var(--brand-primary)] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Inspect</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>

                  {isUnlocked ? (
                    <Button
                      variant={isCurrentActive ? 'secondary' : 'primary'}
                      size="sm"
                      className="text-xs font-semibold px-3"
                      onClick={() => handleSelectTemplate(template.id)}
                    >
                      {isCurrentActive ? 'Selected' : 'Select'}
                    </Button>
                  ) : (
                    <Button
                      variant="secondary"
                      size="sm"
                      className="text-xs font-semibold text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/40 px-2.5"
                      onClick={() => {
                        if (onPlanSelect) {
                          onPlanSelect(template.minTier);
                        } else {
                          window.location.href = `/plans?selectedTier=${template.minTier}`;
                        }
                      }}
                    >
                      Unlock with {TIER_CONFIG[template.minTier].name}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Full Modal Viewer */}
      {previewTemplate && (
        <TemplatePreviewModal
          template={previewTemplate}
          currentPlan={currentPlan}
          onClose={() => setPreviewTemplate(null)}
          onSelectTemplate={handleSelectTemplate}
          selectedTemplateId={activeTemplateId}
        />
      )}

    </section>
  );
}
