import { PlanTier } from '@eduportal/shared';

export type ServiceCategory = 'all' | 'domains' | 'google_seo' | 'mobile_apps' | 'data_storage' | 'ai';

export type ServiceItemStatus =
  | 'awaiting_payment'
  | 'awaiting_documents'
  | 'documents_under_review'
  | 'in_progress'
  | 'awaiting_school_action'
  | 'completed'
  | 'rejected'
  | 'cancelled'
  | 'refunded';

export interface ServiceDocumentRequirement {
  key: string;
  labelEn: string;
  labelLus: string;
  types: string[]; // e.g. ['pdf', 'docx', 'png', 'jpg']
  maxMb: number;
  required: boolean;
  hasTemplate?: boolean;
}

export interface ServicePricingRule {
  priceType: 'free' | 'fixed' | 'work_fee_plus_actual';
  amountINR: number;
  discountPct?: number;
  labelBadge?: string;
}

export interface ServiceCatalogItem {
  id: string;
  slug: string;
  titleEn: string;
  titleLus: string;
  category: 'domains' | 'google_seo' | 'mobile_apps' | 'data_storage' | 'ai';
  descriptionEn: string;
  descriptionLus: string;
  oneLineBenefitEn: string;
  oneLineBenefitLus: string;
  detailsMarkdownEn?: string;
  detailsMarkdownLus?: string;
  deliverables: string[];
  requiredDocuments: ServiceDocumentRequirement[];
  etaMinDays: number;
  etaMaxDays: number;
  etaNote: string;
  isRecurring: boolean;
  recurringInterval?: 'yearly' | 'monthly' | null;
  pricing: Record<PlanTier, ServicePricingRule>;
  cancelRefundRule: string;
  displayOrder: number;
}

export interface ServiceItemDocument {
  id: string;
  itemId: string;
  documentKey: string;
  label: string;
  fileName: string;
  fileSizeBytes: number;
  mimeType: string;
  storagePath: string;
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  rejectionReason?: string;
  uploadedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface ServiceItemEvent {
  id: string;
  itemId: string;
  eventType: string;
  title: string;
  description?: string;
  createdAt: string;
  createdBy?: string;
}

export interface ServiceOrderItem {
  id: string;
  orderId: string;
  tenantId: string;
  serviceId: string;
  variantId?: string;
  serviceTitle: string;
  priceINR: number;
  recurringINR: number;
  status: ServiceItemStatus;
  clockStartedAt?: string;
  etaWorkingDays: number;
  expectedCompletionDate?: string;
  isDelayed?: boolean;
  assignedTo?: string;
  notes?: string;
  fulfillmentData?: Record<string, any>;
  documents: ServiceItemDocument[];
  events: ServiceItemEvent[];
  createdAt: string;
  completedAt?: string;
}

export interface ServiceOrder {
  id: string;
  orderNumber: string;
  tenantId: string;
  tenantName: string;
  status: 'awaiting_payment' | 'paid' | 'cancelled' | 'refunded';
  subtotalINR: number;
  discountINR: number;
  taxINR: number;
  totalAmountINR: number;
  paymentStatus: 'pending' | 'paid';
  paymentId?: string;
  paymentGateway?: string;
  termsAcceptedAt?: string;
  termsIpHash?: string;
  termsVersion?: string;
  items: ServiceOrderItem[];
  createdAt: string;
}

// Backwards-compatibility type aliases for Phase 1 components
export type ServiceType = string;
export type ServiceRequestStatus = ServiceItemStatus;
export interface ServiceRequestRecord {
  id: string;
  tenantId: string;
  tenantName: string;
  serviceType: string;
  serviceTitle: string;
  priceChargedINR: number;
  status: ServiceItemStatus;
  contactEmail: string;
  contactPhone: string;
  notes?: string;
  requestedAt: string;
  completedAt?: string;
  completionUrl?: string;
}
