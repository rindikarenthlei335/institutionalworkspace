'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function TrackerScript() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;

    const device = window.innerWidth < 768 ? 'Mobile' : window.innerWidth < 1024 ? 'Tablet' : 'Desktop';
    const referrer = document.referrer ? new URL(document.referrer).hostname : 'Direct / Bookmark';

    const trackEvent = {
      path: pathname,
      device,
      referrer,
      timestamp: new Date().toISOString()
    };

    // Store in local storage for local offline tracking / mock data consolidation
    try {
      const existing = JSON.parse(localStorage.getItem('eduportal_analytics_events') || '[]');
      existing.push(trackEvent);
      // Keep max 100 recent events locally
      if (existing.length > 100) existing.shift();
      localStorage.setItem('eduportal_analytics_events', JSON.stringify(existing));
    } catch {
      // Ignore storage errors in restricted iframe mode
    }
  }, [pathname]);

  return null;
}
