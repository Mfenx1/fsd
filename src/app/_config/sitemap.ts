import type { MetadataRoute } from 'next';
import { getAppBaseUrl, ROUTES } from '$shared';

const sitemap = (): MetadataRoute.Sitemap => {
  const base = getAppBaseUrl();
  const now = new Date();

  return [
    { url: base, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${base}${ROUTES.PRODUCTS}`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}${ROUTES.CHAT}`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}${ROUTES.LOGIN}`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
  ];
};

export default sitemap;