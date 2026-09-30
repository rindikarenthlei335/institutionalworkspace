import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'https://eduportal.com';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/portal/', '/platform/']
    },
    sitemap: `${baseUrl}/sitemap.xml`
  };
}
