import type { Metadata, Viewport } from 'next';
import { DM_Sans } from 'next/font/google';
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE, METADATA_TITLE_TEMPLATE, SITE_NAME, getAppBaseUrl } from '$shared';
import './_config/globals.css';
import { RootLayoutView } from './_components/RootLayoutView';

const dmSans = DM_Sans({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-dm-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(getAppBaseUrl()),
  title: {
    default: DEFAULT_TITLE,
    template: METADATA_TITLE_TEMPLATE,
  },
  description: DEFAULT_DESCRIPTION,
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: getAppBaseUrl(),
    siteName: SITE_NAME,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: '#18181b',
};

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <RootLayoutView fontVariable={dmSans.variable} fontClassName={dmSans.className}>
    {children}
  </RootLayoutView>
);

export default RootLayout;