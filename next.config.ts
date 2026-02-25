import type { NextConfig } from 'next';
import bundleAnalyzer from '@next/bundle-analyzer';

const { version: appVersion } = require('./package.json') as { version: string };
import createNextIntlPlugin from 'next-intl/plugin';
import { getRemotesDevOrigins } from './src/widgets/remote-loader/config/remotesConfig';

const withNextIntl = createNextIntlPlugin('./src/shared/i18n/request.ts');

const isDev = process.env.NODE_ENV === 'development';

const { http: remoteOrigins, ws: remoteWsOrigins } = getRemotesDevOrigins();


const CSP_SCRIPT_SRC = [
  "'self'",
  "'unsafe-inline'",
  'blob:',
  'https://cdn.jsdelivr.net',
  'https://esm.sh',
  ...(isDev ? ["'unsafe-eval'", ...remoteOrigins] : []),
];

const CSP_CONNECT_SRC = [
  "'self'",
  'https:',
  'wss:',
  ...(isDev
    ? [
        ...remoteOrigins,
        'http://localhost:3000',
        'http://localhost:8080',
        'ws://localhost:8080',
        ...remoteWsOrigins,
      ]
    : []),
];

const nextConfig: NextConfig = {
  env: { NEXT_PUBLIC_APP_VERSION: appVersion },
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,

  eslint: {
    ignoreDuringBuilds: process.env.DOCKER_BUILD === '1',
  },

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.dummyjson.com', pathname: '/**' },
      { protocol: 'https', hostname: 'i.dummyjson.com', pathname: '/**' },
    ],
  },

  experimental: {
    optimizePackageImports: [
      'lucide-react',
      '@tanstack/react-query',
      '@tanstack/react-query-devtools',
      'react-hook-form',
      '@hookform/resolvers',
    ],
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              `script-src ${CSP_SCRIPT_SRC.join(' ')}`,
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https: blob: https://cdn.dummyjson.com",
              "font-src 'self' data:",
              `connect-src ${CSP_CONNECT_SRC.join(' ')}`,
              "frame-ancestors 'self'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
          },
          {
            key: 'Permissions-Policy',
            value: [
              'camera=()',
              'microphone=()',
              'geolocation=()',
              'payment=()',
              'usb=()',
              'interest-cohort=()',
            ].join(', '),
          },
        ],
      },
    ];
  },

  transpilePackages: [],

  output: process.env.DOCKER_BUILD === '1' ? 'standalone' : undefined,

  
  

  
  logging: {
    fetches: {
      fullUrl: isDev,
    },
  },
};

const withAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
  openAnalyzer: false,
});

export default withNextIntl(withAnalyzer(nextConfig));