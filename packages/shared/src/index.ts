export * from './types/index';
export * from './constants/plans';
export * from './constants/roles';
export * from './constants/themes';
export * from './schemas/tenant';
export * from './schemas/admission';
export * from './schemas/fee';

import en from './i18n/en.json';
import lus from './i18n/lus.json';

export const DICTIONARIES: Record<string, typeof en> = {
  en,
  lus,
  mizo: lus
};

export function getDictionary(locale: string = 'en') {
  return DICTIONARIES[locale] || DICTIONARIES.en;
}
