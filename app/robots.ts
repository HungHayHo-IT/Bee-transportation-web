import type { MetadataRoute } from 'next';

import { SITE_URL } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  // Preview deployments must never be indexed: they serve the same content on
  // a different host, which would compete with production for the same terms.
  const isProduction = process.env.VERCEL_ENV === 'production' || !process.env.VERCEL_ENV;

  return {
    rules: isProduction
      ? [{ userAgent: '*', allow: '/' }]
      : [{ userAgent: '*', disallow: '/' }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
