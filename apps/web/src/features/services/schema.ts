import { z } from 'zod';

export const ServiceRequestSchema = z.object({
  serviceType: z.enum(['google_submit', 'maps_register', 'seo_bundle', 'white_label_app']),
  schoolName: z.string().min(2, 'School name is required'),
  contactEmail: z.string().email('Valid email is required'),
  contactPhone: z.string().min(10, 'Valid 10-digit phone number is required'),
  notes: z.string().optional()
});

export type ServiceRequestInput = z.infer<typeof ServiceRequestSchema>;
