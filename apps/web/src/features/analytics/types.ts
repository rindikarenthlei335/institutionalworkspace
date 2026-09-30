export interface TopPageItem {
  path: string;
  views: number;
}

export interface ReferrerItem {
  referrer: string;
  views: number;
}

export interface DeviceBreakdown {
  device: string;
  percentage: number;
}

export interface AnalyticsOverview {
  totalPageViews: number;
  uniqueVisitors: number;
  avgDurationSec: number;
  topPages: TopPageItem[];
  referrers: ReferrerItem[];
  devices: DeviceBreakdown[];
}
