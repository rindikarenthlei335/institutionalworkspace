import { PlanTier, UserRole } from '@eduportal/shared';

export interface PlatformTenant {
  id: string;
  name: string;
  subdomain: string;
  status: 'active' | 'suspended' | 'pending';
  planId: PlanTier;
  billingCycle: 'monthly' | 'yearly';
  trialEndsAt?: string;
  paidTill?: string;
  subscriptionStatus: string;
  storageUsedBytes: number;
  adminEmail: string;
  adminName: string;
  createdAt: string;
}

export interface PlatformInvoice {
  id: string;
  tenantId: string;
  tenantName: string;
  amount: number;
  dueDate: string;
  status: 'paid' | 'unpaid' | 'overdue';
  paidAt?: string;
  paymentReference?: string;
}

export interface PlatformMetrics {
  totalTenants: number;
  activeTenants: number;
  mrrEstimate: number;
  totalStorageUsedGB: number;
  planBreakdown: Record<PlanTier, number>;
}
