import React from 'react';
import { AppPublishingMasterView } from '@/features/apps/components/AppPublishingMasterView';

export const metadata = {
  title: 'App Publishing Console | Platform Control',
  description: 'Manage white-label store listings, asset validation, builds, and store package exports.'
};

export default function PlatformAppsPage() {
  return <AppPublishingMasterView />;
}
