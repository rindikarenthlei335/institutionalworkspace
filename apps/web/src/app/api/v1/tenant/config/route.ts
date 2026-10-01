export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tenantSlug = searchParams.get('tenant') || searchParams.get('code') || 'mountcarmel';
  const clientVersion = searchParams.get('version') || '1.0.0';
  const clientPlatform = searchParams.get('platform') || 'android';

  const isMountCarmel = tenantSlug.toLowerCase().includes('mount') || tenantSlug.toLowerCase().includes('mc');

  // Minimum supported mobile version is 1.0.0
  const minSupportedVersion = '1.0.0';
  const isForceUpdateRequired = clientVersion < minSupportedVersion;

  const tenantConfig = {
    tenant: {
      id: isMountCarmel ? '00000000-0000-0000-0000-000000000001' : '00000000-0000-0000-0000-000000000002',
      slug: isMountCarmel ? 'mountcarmel' : 'stmarys',
      name: isMountCarmel ? 'Mount Carmel Higher Secondary School' : "St. Mary's Academy",
      tagline: isMountCarmel ? 'Excellence in Education & Character' : 'Nurturing Future Leaders',
      schoolCode: isMountCarmel ? 'MC-AIZAWL' : 'SMA-KOLKATA',
      plan: isMountCarmel ? 'pro' : 'basic',
      status: 'active'
    },
    branding: {
      primaryColor: isMountCarmel ? '#163A2B' : '#235A78',
      secondaryColor: isMountCarmel ? '#C9A84C' : '#F59E0B',
      accentColor: '#10B981',
      logoUrl: isMountCarmel ? 'https://mountcarmel.eduportal.com/logo.png' : 'https://stmarys.eduportal.com/logo.png',
      crestInitials: isMountCarmel ? 'MC' : 'SM'
    },
    entitlements: {
      planId: isMountCarmel ? 'pro' : 'basic',
      features: isMountCarmel
        ? [
            'public_website',
            'parent_portal',
            'fee_management',
            'online_payment',
            'exams_module',
            'id_card_module',
            'staff_module',
            'data_hub',
            'notice_board',
            'push_notifications'
          ]
        : ['public_website', 'notice_board'],
      modulesEnabled: {
        fees: isMountCarmel,
        exams: isMountCarmel,
        digitalId: isMountCarmel,
        notices: true,
        attendance: false // will unlock with Attendance module
      }
    },
    appVersioning: {
      clientVersion,
      clientPlatform,
      latestVersion: '1.0.0',
      minSupportedVersion,
      forceUpdate: isForceUpdateRequired,
      updateUrl: clientPlatform === 'ios'
        ? 'https://apps.apple.com/app/eduportal/id123456789'
        : 'https://play.google.com/store/apps/details?id=com.eduportal.app'
    },
    compliance: {
      privacyPolicyUrl: 'https://mountcarmel.eduportal.com/about#privacy',
      termsOfServiceUrl: 'https://mountcarmel.eduportal.com/about#terms',
      accountDeletionUrl: 'https://mountcarmel.eduportal.com/portal/profile#delete-account',
      supportEmail: isMountCarmel ? 'support@mountcarmel.edu.in' : 'support@stmarys.edu.in'
    },
    reviewerDemoAccount: {
      isAvailable: true,
      username: 'apple.reviewer@mountcarmel.edu.in',
      passwordHint: 'ReviewerDemo2025!',
      role: 'parent',
      notes: 'Demo reviewer account pre-populated with realistic sample records.'
    }
  };

  return NextResponse.json(tenantConfig, {
    headers: {
      'Cache-Control': 'public, max-age=300, s-maxage=3600'
    }
  });
}
