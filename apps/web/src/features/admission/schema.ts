import { z } from 'zod';
import { AdmissionApplicationSchema } from '@eduportal/shared';

export const AdminApplicationReviewSchema = z.object({
  applicationId: z.string().uuid(),
  status: z.enum(['submitted', 'under_review', 'approved', 'rejected', 'waitlisted', 'enrolled']),
  notes: z.string().optional()
});

export const ConvertToStudentSchema = z.object({
  applicationId: z.string().uuid(),
  classId: z.string().min(1, 'Class required'),
  sectionId: z.string().optional(),
  residenceType: z.enum(['day', 'hosteller']),
  rollNo: z.number().optional()
});

export type AdminApplicationReviewInput = z.infer<typeof AdminApplicationReviewSchema>;
export type ConvertToStudentInput = z.infer<typeof ConvertToStudentSchema>;
export { AdmissionApplicationSchema };
