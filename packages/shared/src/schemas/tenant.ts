import { z } from 'zod';

export const SubdomainSchema = z
  .string()
  .min(3, 'Subdomain must be at least 3 characters')
  .max(30, 'Subdomain cannot exceed 30 characters')
  .regex(/^[a-z0-9-]+$/, 'Subdomain can only contain lowercase letters, numbers, and hyphens')
  .refine(
    val =>
      ![
        'www',
        'admin',
        'api',
        'app',
        'mail',
        'platform',
        'static',
        'cdn',
        'support',
        'dashboard',
        'login'
      ].includes(val),
    'This subdomain is reserved by the platform'
  );

export const TenantCreateSchema = z.object({
  name: z.string().min(2, 'School name must be at least 2 characters'),
  subdomain: SubdomainSchema,
  planId: z.enum(['basic', 'essential', 'pro']),
  adminEmail: z.string().email('Invalid admin email'),
  adminFullName: z.string().min(2, 'Admin name required')
});

export type TenantCreateInput = z.infer<typeof TenantCreateSchema>;
