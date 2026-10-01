import React from 'react';
import { PlatformNavLayout } from '@/components/layout/PlatformNavLayout';

export default function PlatformOwnerLayout({ children }: { children: React.ReactNode }) {
  return <PlatformNavLayout>{children}</PlatformNavLayout>;
}
