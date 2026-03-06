import type { ReactElement } from 'react';
import { DEFAULT_DESCRIPTION, SITE_NAME, getAppBaseUrl } from '$shared';

const organizationJsonLd = () => {
  const base = getAppBaseUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${base}/#organization`,
    name: SITE_NAME,
    url: base,
    description: DEFAULT_DESCRIPTION,
  };
};

const websiteJsonLd = () => {
  const base = getAppBaseUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${base}/#website`,
    name: `${SITE_NAME} — Товары`,
    url: base,
    description: DEFAULT_DESCRIPTION,
    publisher: { '@id': `${base}/#organization` },
    inLanguage: 'ru',
  };
};

export const JsonLd = (): ReactElement => (
  <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
      suppressHydrationWarning
    />
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd()) }}
      suppressHydrationWarning
    />
  </>
);

export interface WebPageJsonLdProps {
  name: string;
  description: string;
  path?: string;
}

export const WebPageJsonLd = ({ name, description, path = '' }: WebPageJsonLdProps): ReactElement => {
  const base = getAppBaseUrl();
  const url = `${base}${path}`;
  const webPageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name,
    description,
    url,
    inLanguage: 'ru',
    isPartOf: { '@id': `${base}/#website` },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }}
      suppressHydrationWarning
    />
  );
};