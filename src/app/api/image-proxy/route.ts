import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ALLOWED_IMAGE_ORIGINS = [
  'https://cdn.dummyjson.com',
] as const;

const isAllowedUrl = (urlString: string): boolean => {
  try {
    const url = new URL(urlString);
    if (url.protocol !== 'https:') return false;
    return ALLOWED_IMAGE_ORIGINS.some(
      (origin) => url.origin === origin || url.href.startsWith(origin + '/')
    );
  } catch {
    return false;
  }
};


export const GET = async (request: NextRequest) => {
  const urlParam = request.nextUrl.searchParams.get('url');
  if (!urlParam || !isAllowedUrl(urlParam)) {
    return new NextResponse('Bad Request', { status: 400 });
  }

  try {
    const res = await fetch(urlParam, {
      headers: { Accept: 'image/*' },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return new NextResponse('Upstream error', { status: res.status });
    }

    const contentType = res.headers.get('content-type') ?? 'image';
    const body = await res.arrayBuffer();

    return new NextResponse(body, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch {
    return new NextResponse('Failed to fetch image', { status: 502 });
  }
};