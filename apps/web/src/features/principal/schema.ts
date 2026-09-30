import { z } from 'zod';

export const PrincipalFilterSchema = z.object({
  sessionYear: z.string().default('2024-2025'),
  classId: z.string().optional(),
  period: z.enum(['this_month', 'last_month', 'year_to_date']).default('this_month')
});

export type PrincipalFilterInput = z.infer<typeof PrincipalFilterSchema>;

export const RemindDefaulterSchema = z.object({
  studentId: z.string(),
  dueAmount: z.number().positive(),
  channel: z.enum(['sms', 'email', 'whatsapp']).default('whatsapp')
});

export type RemindDefaulterInput = z.infer<typeof RemindDefaulterSchema>;
