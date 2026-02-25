import type { Metadata } from 'next';
import { SITE_NAME, getAppBaseUrl } from '$shared';

export type CreatePageMetadataOptions = {
  title: string;
  description: string;
  
  path?: string;
  
  robots?: { index?: boolean; follow?: boolean };
  
  image?: string;
};


export const createPageMetadata = ({
  title,
  description,
  path = '',
  robots,
  image,
}: CreatePageMetadataOptions): Metadata => {
  const base = getAppBaseUrl();
  const url = path ? `${base}${path}` : base;
  const fullTitle = `${title} | ${SITE_NAME}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      type: 'website',
      locale: 'ru_RU',
      siteName: SITE_NAME,
      ...(image && { images: [{ url: image }] }),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
    },
    ...(robots != null && { robots }),
  };
};