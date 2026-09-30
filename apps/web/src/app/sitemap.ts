import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'https://eduportal.com';

  const routes = [
    '',
    '/about',
    '/faculty',
    '/facilities',
    '/activities',
    '/notices',
    '/gallery',
    '/admission',
    '/pay-fee'
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1.0 : 0.8
  }));
}
