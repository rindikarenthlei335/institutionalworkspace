export * from './types/index.js';
export * from './constants/plans.js';
export * from './constants/roles.js';
export * from './constants/themes.js';
export * from './schemas/tenant.js';
export * from './schemas/admission.js';
export * from './schemas/fee.js';

import en from './i18n/en.json';
import mizo from './i18n/mizo.json';

export const DICTIONARIES: Record<string, typeof en> = {
  en,
  mizo
};

export function getDictionary(locale: string = 'en') {
  return DICTIONARIES[locale] || DICTIONARIES.en;
}
