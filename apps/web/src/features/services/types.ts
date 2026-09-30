export type ServiceType = 'google_submit' | 'maps_register' | 'seo_bundle' | 'white_label_app';

export type ServiceRequestStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

export interface ServiceCatalogItem {
  id: ServiceType;
  title: string;
  description: string;
  basePriceINR: number;
  isFreeOnPro: boolean;
  deliverables: string[];
  estimatedDays: number;
}

export interface ServiceRequestRecord {
  id: string;
  tenantId: string;
  tenantName: string;
  serviceType: ServiceType;
  serviceTitle: string;
  priceChargedINR: number;
  status: ServiceRequestStatus;
  contactEmail: string;
  contactPhone: string;
  notes?: string;
  requestedAt: string;
  completedAt?: string;
  completionUrl?: string;
}
