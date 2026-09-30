import { z } from 'zod';

export const AnalyticsFilterSchema = z.object({
  period: z.enum(['7d', '30d', '90d']).default('30d'),
  startDate: z.string().optional(),
  endDate: z.string().optional()
});

export type AnalyticsFilterInput = z.infer<typeof AnalyticsFilterSchema>;
