import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import { cookies } from 'next/headers';
import type { RootLayoutViewProps } from '$shared';
import { parseThemeCookie, resolveThemeServer, THEME_COOKIE } from '$shared';
import { ImportMapScript } from '$widgets/remote-loader';
import { ChatCssLink } from '$widgets/root-layout/ui/ChatCssLink';
import { SkipLink } from '$widgets/root-layout/ui/SkipLink';
import { JsonLd } from '$widgets/root-layout/ui/JsonLd';
import { Providers } from '$widgets/root-layout/ui/Providers';
import { WebVitalsReporter } from '$widgets/root-layout/ui/WebVitalsReporter';

export const RootLayoutView = async ({
  children,
  fontVariable,
  fontClassName,
}: RootLayoutViewProps) => {
  const locale = await getLocale();
  const messages = await getMessages();
  const store = await cookies();
  const themePref = parseThemeCookie(store.get(THEME_COOKIE)?.value);
  const resolved = resolveThemeServer(themePref);
  const darkClass = resolved === 'dark' ? 'dark' : '';
  const needsHydrationWarning = themePref === 'system';

  return (
    <html
      lang={locale}
      className={`${fontVariable} ${darkClass}`.trim()}
      suppressHydrationWarning={needsHydrationWarning}
    >
      {}
      <head>
        <link rel="preconnect" href="https://cdn.dummyjson.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://i.dummyjson.com" crossOrigin="anonymous" />
        {process.env.NODE_ENV === 'production' && <ChatCssLink />}
        <ImportMapScript />
        <script src="/theme-init.js" />
        <JsonLd />
      </head>
      <body className={fontClassName}>
        <div id="root">
          <NextIntlClientProvider messages={messages} locale={locale}>
            <SkipLink />
            <Providers initialThemePref={themePref}>
              <WebVitalsReporter />
              {children}
            </Providers>
          </NextIntlClientProvider>
        </div>
      </body>
    </html>
  );
};