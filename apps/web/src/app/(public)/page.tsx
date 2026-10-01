'use client';

import React, { useState, useEffect } from 'react';
import { InstitutionalOnboardingFlow } from '@/features/onboarding/components/InstitutionalOnboardingFlow';
import { HomeTemplateView } from '@/features/templates/components/HomeTemplateView';
import { Sparkles, Building2, CheckCircle2, ArrowRight } from 'lucide-react';

export default function PublicHomePage() {
  const [viewMode, setViewMode] = useState<'onboarding' | 'school_preview'>('onboarding');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('view') === 'school') {
        setViewMode('school_preview');
      }
    }
  }, []);

  return (
    <div>
      {/* Top Experience Switcher Banner */}
      <div className="bg-slate-900 border-b border-slate-800 py-2 px-4 text-xs text-white">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-semibold text-emerald-300">EduPortal Institutional Suite:</span>
            <span className="text-slate-400 hidden sm:inline">
              Choose to onboard a new school or preview an active campus
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setViewMode('onboarding')}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'onboarding'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>1. Plan Tier & Onboarding Funnel</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('school_preview')}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'school_preview'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>2. Preview Active School Website</span>
            </button>
          </div>
        </div>
      </div>

      {viewMode === 'onboarding' ? (
        <InstitutionalOnboardingFlow />
      ) : (
        <HomeTemplateView />
      )}
    </div>
  );
}
