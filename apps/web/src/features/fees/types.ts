export interface FeeHead {
  id: string;
  tenantId: string;
  name: string;
  code: string;
  type: 'recurring' | 'one_time' | 'optional';
}

export interface FeeStructure {
  id: string;
  tenantId: string;
  academicYearId: string;
  classId: string;
  className: string;
  residenceType: 'day' | 'hosteller';
  feeHeadId: string;
  feeHeadName: string;
  amount: number;
  dueDate?: string;
}

export interface FeeInvoice {
  id: string;
  tenantId: string;
  invoiceNo: string;
  studentId: string;
  studentName: string;
  className: string;
  residenceType: 'day' | 'hosteller';
  totalAmount: number;
  paidAmount: number;
  dueDate: string;
  status: 'pending' | 'partial' | 'paid' | 'overdue';
  createdAt: string;
}

export interface FeePayment {
  id: string;
  tenantId: string;
  invoiceId: string;
  amountPaid: number;
  paymentMode: 'online' | 'cash' | 'upi' | 'cheque' | 'dd';
  gatewayPaymentId?: string;
  status: 'completed' | 'pending' | 'failed';
  idempotencyKey: string;
  paidAt: string;
  receiptNo: string;
}
