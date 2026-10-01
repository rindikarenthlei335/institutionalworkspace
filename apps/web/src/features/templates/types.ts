export type PlanTier = 'basic' | 'essential' | 'pro' | 'pro_plus';

export interface SchoolTemplate {
  id: string;
  name: string;
  code: string;
  category: string;
  minTier: PlanTier;
  tierLabel: string;
  tierPrice: string;
  previewImage: string;
  description: string;
  accentColor: string;
  themeStyle: {
    primaryHex: string;
    secondaryHex: string;
    bgAccent: string;
    tagline: string;
  };
  heroTitle: string;
  heroSubtitle: string;
  heroBadge: string;
  heroCtaText: string;
  features: string[];
  sections: string[];
  stats: Array<{ label: string; value: string }>;
}
