import { z } from 'zod';

export const StudentSchema = z.object({
  id: z.string().uuid().optional(),
  admissionNo: z.string().optional(),
  rollNo: z.number().positive().optional(),
  fullName: z.string().min(2, 'Student full name required'),
  dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date format YYYY-MM-DD required'),
  gender: z.enum(['male', 'female', 'other']),
  residenceType: z.enum(['day', 'hosteller']),
  classId: z.string().min(1, 'Please select a class'),
  sectionId: z.string().optional(),
  admissionDate: z.string().optional(),
  address: z.string().optional(),
  bloodGroup: z.string().optional(),
  photoUrl: z.string().optional(),
  guardianName: z.string().min(2, 'Guardian name required'),
  guardianPhone: z.string().min(10, 'Guardian phone required'),
  guardianEmail: z.string().email().optional().or(z.literal('')),
  guardianRelation: z.string().default('parent')
});

export const PromoteStudentsSchema = z.object({
  fromClassId: z.string().min(1, 'Source class required'),
  toClassId: z.string().min(1, 'Target class required'),
  academicYearId: z.string().min(1, 'Academic year required'),
  studentIds: z.array(z.string().uuid()).min(1, 'Select at least one student')
});

export type StudentInput = z.infer<typeof StudentSchema>;
export type PromoteStudentsInput = z.infer<typeof PromoteStudentsSchema>;
