import { z } from 'zod';
import { SubdomainSchema } from '@eduportal/shared';

export const SchoolSettingsSchema = z.object({
  schoolName: z.string().min(2, 'School name required'),
  tagline: z.string().optional(),
  affiliation: z.string().optional(),
  establishedYear: z.number().optional(),
  themePreset: z.string().default('forest'),
  primaryColor: z.string().default('#1F4D3A'),
  contactEmail: z.string().email('Invalid email'),
  contactPhone: z.string().optional(),
  contactAddress: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional()
});

export const CustomDomainConnectSchema = z.object({
  customDomain: z
    .string()
    .min(4, 'Domain name required')
    .regex(/^(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/, 'Invalid domain format (e.g. www.school.com)')
});

export type SchoolSettingsInput = z.infer<typeof SchoolSettingsSchema>;
export type CustomDomainConnectInput = z.infer<typeof CustomDomainConnectSchema>;
