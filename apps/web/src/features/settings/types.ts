export interface StorageUsage {
  usedBytes: number;
  limitBytes: number;
  usedPercentage: number;
}

export interface DomainStatus {
  subdomain: string;
  customHostname?: string;
  status: 'pending' | 'verifying' | 'active' | 'failed';
  cnameTarget: string;
  txtRecord: string;
}
