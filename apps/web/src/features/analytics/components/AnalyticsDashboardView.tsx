'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { StatCard } from '@/components/ui/StatCard';
import { Select } from '@/components/ui/Select';
import { AnalyticsOverview } from '../types';

export function AnalyticsDashboardView() {
  const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('30d');
  const [overview, setOverview] = useState<AnalyticsOverview>({
    totalPageViews: 14280,
    uniqueVisitors: 4890,
    avgDurationSec: 142,
    topPages: [
      { path: '/', views: 5820 },
      { path: '/admission', views: 3140 },
      { path: '/pay-fee', views: 2450 },
      { path: '/notices', views: 1890 },
      { path: '/faculty', views: 980 }
    ],
    referrers: [
      { referrer: 'Google Search', views: 7850 },
      { referrer: 'Direct / Bookmark', views: 3940 },
      { referrer: 'WhatsApp / Mobile SMS', views: 1820 },
      { referrer: 'Facebook Page', views: 670 }
    ],
    devices: [
      { device: 'Mobile', percentage: 68 },
      { device: 'Desktop', percentage: 26 },
      { device: 'Tablet', percentage: 6 }
    ]
  });

  useEffect(() => {
    // Read local storage events if available to enrich live metric counts
    try {
      const storedEvents = JSON.parse(localStorage.getItem('eduportal_analytics_events') || '[]');
      if (storedEvents.length > 0) {
        const extraViews = storedEvents.length;
        setOverview(prev => ({
          ...prev,
          totalPageViews: prev.totalPageViews + extraViews,
          uniqueVisitors: prev.uniqueVisitors + Math.min(extraViews, 5)
        }));
      }
    } catch {
      // Ignore fallback
    }
  }, []);

  const multiplier = period === '7d' ? 0.3 : period === '90d' ? 2.5 : 1;
  const currentViews = Math.round(overview.totalPageViews * multiplier);
  const currentVisitors = Math.round(overview.uniqueVisitors * multiplier);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-[11px] font-semibold text-[var(--brand-primary)] uppercase tracking-wider">Pro Tier Feature</span>
          <h1 className="font-display font-bold text-3xl text-[var(--text-primary)]">Website Analytics</h1>
          <p className="text-xs text-[var(--text-secondary)]">Traffic, visitor engagement & source attribution for Mount Carmel School</p>
        </div>
        <div className="w-44">
          <Select
            label=""
            value={period}
            onChange={(e) => setPeriod(e.target.value as '7d' | '30d' | '90d')}
            options={[
              { value: '7d', label: 'Last 7 Days' },
              { value: '30d', label: 'Last 30 Days' },
              { value: '90d', label: 'Last 90 Days' }
            ]}
          />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Total Page Views" value={currentViews} change="+14.2% vs previous period" trend="up" />
        <StatCard label="Unique Visitors" value={currentVisitors} change="+8.7% vs previous period" trend="up" />
        <StatCard label="Avg Time on Site" value={`${Math.floor(overview.avgDurationSec / 60)}m ${overview.avgDurationSec % 60}s`} change="+12s duration" trend="up" />
      </div>

      {/* Main Charts / Data Sections */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Top Visited Pages */}
        <Card>
          <h3 className="font-display font-bold text-base text-[var(--text-primary)] mb-4">Most Visited Pages</h3>
          <div className="space-y-4">
            {overview.topPages.map((page, idx) => {
              const adjustedViews = Math.round(page.views * multiplier);
              const maxViews = Math.round(overview.topPages[0].views * multiplier);
              const pct = Math.round((adjustedViews / maxViews) * 100);
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="font-mono text-[var(--text-primary)]">{page.path}</span>
                    <span className="font-mono text-[var(--brand-primary)]">{adjustedViews.toLocaleString()} views</span>
                  </div>
                  <div className="h-2 bg-[var(--bg-elevated)] rounded-full overflow-hidden">
                    <div className="h-full bg-[var(--brand-primary)] rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Traffic Sources & Device Breakdown */}
        <div className="space-y-6">
          <Card>
            <h3 className="font-display font-bold text-base text-[var(--text-primary)] mb-4">Traffic Sources (Referrers)</h3>
            <div className="space-y-3 text-xs">
              {overview.referrers.map((ref, i) => (
                <div key={i} className="flex justify-between py-2 border-b border-[var(--border-subtle)] last:border-0">
                  <span className="font-medium">{ref.referrer}</span>
                  <span className="font-mono font-semibold text-[var(--text-secondary)]">
                    {Math.round(ref.views * multiplier).toLocaleString()} visitors
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="font-display font-bold text-base text-[var(--text-primary)] mb-4">Device Breakdown</h3>
            <div className="grid grid-cols-3 gap-2 text-center">
              {overview.devices.map((dev, i) => (
                <div key={i} className="p-3 bg-[var(--bg-subtle)] rounded-lg border border-[var(--border-subtle)]">
                  <div className="text-2xl font-bold font-mono text-[var(--brand-primary)]">{dev.percentage}%</div>
                  <div className="text-xs font-medium text-[var(--text-secondary)] mt-1">{dev.device}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
