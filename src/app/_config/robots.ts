import type { MetadataRoute } from 'next';
import { getAppBaseUrl } from '$shared';

const robots = (): MetadataRoute.Robots => {
  const base = getAppBaseUrl();

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/'],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
};

export default robots;