'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { SchoolTemplate, PlanTier } from '../types';
import { isTemplateUnlocked, TIER_CONFIG } from '../data/templates';
import { THEME_PRESETS } from '@eduportal/shared';
import {
  X,
  CheckCircle2,
  Lock,
  Sparkles,
  ArrowRight,
  Palette,
  ExternalLink,
  Layers,
  GraduationCap
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface TemplatePreviewModalProps {
  template: SchoolTemplate | null;
  currentPlan: PlanTier;
  onClose: () => void;
  onSelectTemplate: (templateId: string) => void;
  selectedTemplateId?: string;
}

export function TemplatePreviewModal({
  template,
  currentPlan,
  onClose,
  onSelectTemplate,
  selectedTemplateId
}: TemplatePreviewModalProps) {
  const [activeThemeId, setActiveThemeId] = useState('forest');

  if (!template) return null;

  const isUnlocked = isTemplateUnlocked(template.minTier, currentPlan);
  const isSelected = selectedTemplateId === template.id;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-5xl max-h-[92vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800">
        
        {/* Modal Top Header */}
        <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
              {template.code}
            </span>
            <div>
              <h3 className="font-display font-bold text-base sm:text-lg text-white leading-tight">
                {template.name}
              </h3>
              <span className="text-xs text-slate-400 block">{template.category}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isUnlocked ? (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Unlocked on your plan
              </span>
            ) : (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                Requires {TIER_CONFIG[template.minTier].name} Plan
              </span>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* Main Visual Preview Area */}
          <div className="grid lg:grid-cols-12 gap-6 items-start">
            
            {/* Left: Template Screenshot / Architecture Preview */}
            <div className="lg:col-span-7 bg-slate-950 rounded-xl overflow-hidden border border-slate-800 shadow-md">
              <div className="bg-slate-900 px-3 py-2 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
                  <span className="ml-2 font-mono text-[11px] text-slate-300">school.eduportal.com</span>
                </div>
                <span className="text-[10px] font-semibold text-emerald-400">Live Architecture Layout</span>
              </div>
              <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full bg-slate-900">
                <img
                  src={template.previewImage}
                  alt={template.name}
                  className="w-full h-full object-cover object-top hover:object-bottom transition-all duration-1000 ease-in-out cursor-ns-resize"
                  title="Hover to scroll through template preview"
                />
              </div>
              <div className="p-2 text-center text-[10px] text-slate-400 bg-slate-900/90 border-t border-slate-800">
                ↕ Hover cursor over image to scroll through full webpage sections
              </div>
            </div>

            {/* Right: Template Specs, Highlights & Actions */}
            <div className="lg:col-span-5 space-y-5">
              
              <div>
                <span className="text-xs uppercase font-bold text-emerald-600 dark:text-emerald-400 tracking-wider">
                  Template Specifications
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  {template.description}
                </p>
              </div>

              {/* Stats Ribbon */}
              <div className="grid grid-cols-2 gap-2">
                {template.stats.map((st, i) => (
                  <div key={i} className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">{st.label}</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white font-mono">{st.value}</span>
                  </div>
                ))}
              </div>

              {/* Theme Customizer Preview (Works on ANY Plan) */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-white">
                    <Palette className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Theme Colors (Any Plan)</span>
                  </div>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                    Unlimited
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {THEME_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => setActiveThemeId(preset.id)}
                      className={`px-2 py-1 rounded-md text-[11px] font-medium flex items-center gap-1.5 border transition-all ${
                        activeThemeId === preset.id
                          ? 'border-emerald-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800'
                      }`}
                    >
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: preset.primaryHex }} />
                      <span>{preset.name.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Key Features List */}
              <div>
                <span className="text-xs font-semibold text-slate-800 dark:text-white block mb-2">
                  Built-in Layout Modules:
                </span>
                <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  {template.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col gap-2">
                {isUnlocked ? (
                  <Button
                    variant={isSelected ? 'secondary' : 'primary'}
                    size="md"
                    className="w-full justify-center text-xs font-semibold shadow-sm"
                    onClick={() => {
                      onSelectTemplate(template.id);
                      onClose();
                    }}
                  >
                    {isSelected ? '✓ Currently Active Template' : 'Select This Template for My School'}
                  </Button>
                ) : (
                  <div className="space-y-2">
                    <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-xs">
                      <p className="font-bold flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5" />
                        Requires {TIER_CONFIG[template.minTier].name} Tier ({TIER_CONFIG[template.minTier].price ? `₹${TIER_CONFIG[template.minTier].price.toLocaleString('en-IN')}/mo` : ''})
                      </p>
                      <p className="text-[11px] text-amber-700 dark:text-amber-300/90 mt-0.5">
                        Upgrade your subscription to unlock this design along with {TIER_CONFIG[template.minTier].templateCount} total templates.
                      </p>
                    </div>
                    <Button
                      variant="primary"
                      size="md"
                      className="w-full justify-center text-xs bg-amber-600 hover:bg-amber-700 text-white"
                      onClick={() => {
                        window.location.href = `/plans?selectedTier=${template.minTier}`;
                      }}
                    >
                      Upgrade to {TIER_CONFIG[template.minTier].name} to Unlock →
                    </Button>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 bg-slate-100 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span>EduPortal Architecture · Tier: {template.tierLabel}</span>
          <button
            onClick={onClose}
            className="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:underline"
          >
            Close Preview
          </button>
        </div>

      </div>
    </div>
  );
}
