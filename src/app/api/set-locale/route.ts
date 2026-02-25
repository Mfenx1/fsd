import { NextResponse } from 'next/server';
import { LOCALE_COOKIE, isSupportedLocale } from '$shared';

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get('locale');
  const redirectParam = searchParams.get('redirect');

  const res =
    redirectParam === 'none' || redirectParam === ''
      ? NextResponse.json({ ok: true })
      : NextResponse.redirect(new URL(redirectParam || '/', request.url));

  if (locale && isSupportedLocale(locale)) {
    res.cookies.set(LOCALE_COOKIE, locale, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
    });
  }

  return res;
};