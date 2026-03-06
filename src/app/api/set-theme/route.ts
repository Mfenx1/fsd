import { NextResponse } from 'next/server';
import { THEME_COOKIE } from '$shared';

const VALID = ['light', 'dark', 'system'] as const;
const isValid = (t: string): t is (typeof VALID)[number] =>
  VALID.includes(t as (typeof VALID)[number]);

const MAX_AGE_YEAR = 60 * 60 * 24 * 365;


export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const theme = searchParams.get('theme');

  const res = NextResponse.json({ ok: true });

  if (theme && isValid(theme)) {
    res.cookies.set(THEME_COOKIE, theme, {
      path: '/',
      maxAge: MAX_AGE_YEAR,
    });
  }

  return res;
};