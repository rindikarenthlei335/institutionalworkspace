import { z } from 'zod';
import { SubdomainSchema } from '@eduportal/shared';

export const TenantOnboardSchema = z.object({
  schoolName: z.string().min(2, 'School name is required'),
  subdomain: SubdomainSchema,
  planId: z.enum(['basic', 'essential', 'pro']),
  billingCycle: z.enum(['monthly', 'yearly']).default('monthly'),
  adminFullName: z.string().min(2, 'Super Admin full name required'),
  adminEmail: z.string().email('Valid admin email required'),
  adminPhone: z.string().optional()
});

export const FeatureOverrideSchema = z.object({
  tenantId: z.string().uuid(),
  featureKey: z.string(),
  isEnabled: z.boolean()
});

export const MarkPaidSchema = z.object({
  invoiceId: z.string().uuid(),
  paidTill: z.string(),
  paymentReference: z.string().min(2, 'Payment reference required'),
  notes: z.string().optional()
});

export type TenantOnboardInput = z.infer<typeof TenantOnboardSchema>;
export type FeatureOverrideInput = z.infer<typeof FeatureOverrideSchema>;
export type MarkPaidInput = z.infer<typeof MarkPaidSchema>;
