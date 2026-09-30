import { z } from 'zod';

export const FeeStructureSchema = z.object({
  id: z.string().uuid().optional(),
  academicYearId: z.string().min(1, 'Academic year required'),
  classId: z.string().min(1, 'Class required'),
  residenceType: z.enum(['day', 'hosteller']),
  feeHeadId: z.string().min(1, 'Fee head required'),
  amount: z.number().positive('Amount must be greater than 0'),
  dueDate: z.string().optional()
});

export const OfflinePaymentSchema = z.object({
  invoiceId: z.string().uuid('Invoice selection required'),
  amountPaid: z.number().positive('Amount paid required'),
  paymentMode: z.enum(['cash', 'upi', 'cheque', 'dd']),
  transactionRef: z.string().optional(),
  idempotencyKey: z.string().min(1, 'Idempotency key required')
});

export type FeeStructureInput = z.infer<typeof FeeStructureSchema>;
export type OfflinePaymentInput = z.infer<typeof OfflinePaymentSchema>;
