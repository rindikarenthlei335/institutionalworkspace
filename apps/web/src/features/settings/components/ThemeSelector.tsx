'use client';

import React from 'react';
import { THEME_PRESETS } from '@eduportal/shared';

export interface ThemeSelectorProps {
  selectedPreset: string;
  onSelect: (presetId: string) => void;
}

export function ThemeSelector({ selectedPreset, onSelect }: ThemeSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold text-[var(--text-secondary)]">
        School Theme Preset
      </label>
      <div className="grid grid-cols-2 gap-2">
        {THEME_PRESETS.map((preset) => {
          const isSelected = selectedPreset === preset.id;
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => onSelect(preset.id)}
              className={`p-2.5 rounded-[6px] border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                isSelected
                  ? 'border-[var(--brand-primary)] bg-[var(--brand-primary-soft)]/20'
                  : 'border-[var(--border-default)] hover:border-[var(--brand-primary)]'
              }`}
            >
              <span
                className="w-4 h-4 rounded-full shrink-0 border border-black/10"
                style={{ backgroundColor: preset.primaryHex }}
              />
              <div className="min-w-0 flex-1">
                <span className="block text-xs font-semibold text-[var(--text-primary)] truncate">
                  {preset.name}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
