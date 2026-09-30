import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get('host') || 'localhost:3000';
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'eduportal.com';

  let tenantSlug: string | null = null;

  // 1. Dev override query param (?tenant=mountcarmel)
  const devTenant = url.searchParams.get('tenant');
  if (devTenant && (hostname.includes('localhost') || hostname.includes('127.0.0.1'))) {
    tenantSlug = devTenant;
  }
  // 2. Subdomain lookup (e.g. mountcarmel.eduportal.com or mountcarmel.localhost:3000)
  else if (hostname.endsWith(`.${rootDomain}`) || hostname.endsWith('.localhost:3000')) {
    const parts = hostname.split('.');
    if (parts.length > (hostname.includes('localhost') ? 2 : 2)) {
      tenantSlug = parts[0];
    }
  }

  // If root domain or platform path
  if (!tenantSlug || tenantSlug === 'www' || tenantSlug === 'platform') {
    return NextResponse.next();
  }

  // Create response and set tenant header for downstream components
  const response = NextResponse.next();
  response.headers.set('x-tenant-slug', tenantSlug);

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/).*)']
};
