'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { InstitutionalOnboardingFlow } from '@/features/onboarding/components/InstitutionalOnboardingFlow';
import { HomeTemplateView } from '@/features/templates/components/HomeTemplateView';

function HomePageContent() {
  const searchParams = useSearchParams();
  const view = searchParams.get('view');

  // If explicitly requested to view the active school website (?view=school), show HomeTemplateView
  // Otherwise, default purely to the White & Forest Green Institutional Onboarding Flow
  if (view === 'school') {
    return <HomeTemplateView />;
  }

  return <InstitutionalOnboardingFlow />;
}

export default function PublicHomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F8FAF9]" />}>
      <HomePageContent />
    </Suspense>
  );
}
