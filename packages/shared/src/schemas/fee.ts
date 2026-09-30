import { z } from 'zod';

export const PaymentCollectSchema = z.object({
  invoiceId: z.string().uuid('Invalid invoice ID'),
  amountPaid: z.number().positive('Amount paid must be positive'),
  paymentMode: z.enum(['cash', 'upi', 'online', 'cheque', 'dd']),
  transactionRef: z.string().optional(),
  collectedBy: z.string().uuid().optional(),
  idempotencyKey: z.string().min(1, 'Idempotency key required')
});

export type PaymentCollectInput = z.infer<typeof PaymentCollectSchema>;
