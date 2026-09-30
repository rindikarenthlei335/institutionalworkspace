import { z } from 'zod';

export const AdmissionApplicationSchema = z.object({
  studentName: z.string().min(2, 'Student name must be at least 2 characters'),
  dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  gender: z.enum(['male', 'female', 'other']),
  residenceType: z.enum(['day', 'hosteller']),
  applyingClass: z.string().min(1, 'Please select a class'),
  guardianName: z.string().min(2, 'Guardian name must be at least 2 characters'),
  guardianPhone: z.string().min(10, 'Guardian phone must be at least 10 digits'),
  guardianEmail: z.string().email('Invalid guardian email address'),
  address: z.string().min(5, 'Address is required'),
  parentConsent: z.boolean().refine(val => val === true, 'Parent consent is mandatory under DPDP Act 2023')
});

export type AdmissionApplicationInput = z.infer<typeof AdmissionApplicationSchema>;
