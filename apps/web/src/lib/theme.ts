import { THEME_PRESETS, ThemePreset } from '@eduportal/shared';

export function getThemePreset(presetId?: string): ThemePreset {
  return THEME_PRESETS.find(p => p.id === presetId) || THEME_PRESETS[0];
}

export function applyThemeStyle(preset: ThemePreset, primaryOverride?: string) {
  const primary = primaryOverride || preset.primaryHex;
  return {
    '--brand-primary': primary,
    '--brand-primary-hover': preset.primaryHoverHex,
    '--brand-primary-soft': preset.primarySoftHex,
    '--bg-base': preset.bgBaseHex,
    '--bg-surface': preset.bgSurfaceHex
  } as React.CSSProperties;
}
