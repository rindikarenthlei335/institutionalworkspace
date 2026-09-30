export interface ThemePreset {
  id: string;
  name: string;
  primaryHex: string;
  primaryHoverHex: string;
  primarySoftHex: string;
  bgBaseHex: string;
  bgSurfaceHex: string;
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'forest',
    name: 'Forest Green (Default)',
    primaryHex: '#1F4D3A',
    primaryHoverHex: '#163A2B',
    primarySoftHex: '#D5E6DC',
    bgBaseHex: '#EAEFEC',
    bgSurfaceHex: '#FFFFFF'
  },
  {
    id: 'ocean',
    name: 'Ocean Blue',
    primaryHex: '#235A78',
    primaryHoverHex: '#1A435A',
    primarySoftHex: '#D3E4EE',
    bgBaseHex: '#EBF1F5',
    bgSurfaceHex: '#FFFFFF'
  },
  {
    id: 'maroon',
    name: 'Royal Maroon',
    primaryHex: '#74353C',
    primaryHoverHex: '#58262C',
    primarySoftHex: '#EEDCE0',
    bgBaseHex: '#F6ECEE',
    bgSurfaceHex: '#FFFFFF'
  },
  {
    id: 'slate',
    name: 'Classic Slate',
    primaryHex: '#334155',
    primaryHoverHex: '#1E293B',
    primarySoftHex: '#E2E8F0',
    bgBaseHex: '#F1F5F9',
    bgSurfaceHex: '#FFFFFF'
  },
  {
    id: 'emerald',
    name: 'Vibrant Emerald',
    primaryHex: '#059669',
    primaryHoverHex: '#047857',
    primarySoftHex: '#D1FAE5',
    bgBaseHex: '#ECFDF5',
    bgSurfaceHex: '#FFFFFF'
  },
  {
    id: 'indigo',
    name: 'Deep Indigo',
    primaryHex: '#4338CA',
    primaryHoverHex: '#3730A3',
    primarySoftHex: '#E0E7FF',
    bgBaseHex: '#EEF2FF',
    bgSurfaceHex: '#FFFFFF'
  },
  {
    id: 'amber',
    name: 'Warm Amber',
    primaryHex: '#B45309',
    primaryHoverHex: '#92400E',
    primarySoftHex: '#FEF3C7',
    bgBaseHex: '#FFFBEB',
    bgSurfaceHex: '#FFFFFF'
  },
  {
    id: 'crimson',
    name: 'Crimson Red',
    primaryHex: '#BE123C',
    primaryHoverHex: '#9F1239',
    primarySoftHex: '#FFE4E6',
    bgBaseHex: '#FFF1F2',
    bgSurfaceHex: '#FFFFFF'
  }
];
