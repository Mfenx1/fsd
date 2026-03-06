import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ROUTES } from './src/shared/config';
import { DEFAULT_LOCALE, LOCALE_COOKIE, isSupportedLocale } from './src/shared/config';

const SESSION_COOKIE_NAME = 'auth_session';

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 60;

type RateLimitEntry = { count: number; resetAt: number };

const getStore = (): Map<string, RateLimitEntry> => {
  const g = globalThis as unknown as { __rateLimitStore?: Map<string, RateLimitEntry> };
  if (!g.__rateLimitStore) g.__rateLimitStore = new Map();
  return g.__rateLimitStore;
};

const getClientId = (request: NextRequest): string =>
  request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
  request.headers.get('x-real-ip') ??
  'unknown';

const checkRateLimit = (request: NextRequest): NextResponse | null => {
  const store = getStore();
  const now = Date.now();
  const id = getClientId(request);
  const entry = store.get(id);

  if (!entry) {
    store.set(id, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return null;
  }

  if (now >= entry.resetAt) {
    store.set(id, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return null;
  }

  entry.count += 1;
  if (entry.count > RATE_LIMIT_MAX_REQUESTS) {
    return new NextResponse(JSON.stringify({ error: 'Too Many Requests' }), {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': String(Math.ceil((entry.resetAt - now) / 1000)),
      },
    });
  }

  return null;
};


export const middleware = (request: NextRequest) => {
  const { pathname, searchParams } = request.nextUrl;

  
  const localeParam = searchParams.get('locale');
  if (localeParam && isSupportedLocale(localeParam)) {
    const url = request.nextUrl.clone();
    url.searchParams.delete('locale');
    const res = NextResponse.redirect(url);
    res.cookies.set(LOCALE_COOKIE, localeParam, { path: '/', maxAge: 60 * 60 * 24 * 365 });
    return res;
  }

  if (
    pathname.startsWith('/api/') &&
    pathname !== '/api/health' &&
    !pathname.startsWith('/api/host-react/') &&
    !pathname.startsWith('/api/dev/')
  ) {
    const rateLimited = checkRateLimit(request);
    if (rateLimited) return rateLimited;
  }

  const isLoginPage = pathname === ROUTES.LOGIN;
  const isProtected = pathname === '/' || pathname.startsWith('/products');
  const hasSessionCookie = request.cookies.has(SESSION_COOKIE_NAME);

  if (isProtected && !hasSessionCookie) {
    const loginUrl = new URL(ROUTES.LOGIN, request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isLoginPage && hasSessionCookie) {
    return NextResponse.redirect(new URL(ROUTES.PRODUCTS, request.url));
  }

  if (pathname === '/' && hasSessionCookie) {
    return NextResponse.redirect(new URL(ROUTES.PRODUCTS, request.url));
  }

  
  const res = NextResponse.next();
  if (!request.cookies.has(LOCALE_COOKIE)) {
    res.cookies.set(LOCALE_COOKIE, DEFAULT_LOCALE, { path: '/', maxAge: 60 * 60 * 24 * 365 });
  }
  return res;
};

export const config = {
  matcher: ['/', '/login', '/products/:path*', '/chat', '/chat/:path*', '/api/:path*'],
};