export type DomainStatus = 'pending' | 'verifying' | 'active' | 'failed' | 'expired';

export interface DnsRecordRequirement {
  type: 'CNAME' | 'TXT';
  name: string;
  value: string;
  purpose: string;
}

export interface CustomDomainConfig {
  hostname: string;
  status: DomainStatus;
  cnameRecord: DnsRecordRequirement;
  txtRecord: DnsRecordRequirement;
  verifiedAt?: string;
  errorMessage?: string;
}

export type DomainRequestStatus =
  | 'Requested'
  | 'Documents received'
  | 'Registered'
  | 'DNS setup'
  | 'Live'
  | 'Rejected';

export interface DomainRegistrationRequest {
  id: string;
  tenantId: string;
  tenantName: string;
  desiredDomain: string;
  tld: string;
  fullDomain: string;
  status: DomainRequestStatus;
  schoolName: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  documents: { name: string; url: string }[];
  requestedAt: string;
  registeredAt?: string;
  expiryDate?: string;
  renewalStatus: 'auto_renew' | 'manual_invoice' | 'expired';
  daysUntilExpiry?: number;
  registrar?: string;
  notes?: string;
}
