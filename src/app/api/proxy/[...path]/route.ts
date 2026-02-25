import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { env } from '$shared';

const API_BASE = env.NEXT_PUBLIC_API_BASE;

export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) => {
  const { path } = await params;
  const pathStr = path.join('/');
  const url = `${API_BASE}/${pathStr}${request.nextUrl.search}`;

  try {
    const res = await fetch(url, {
      headers: {
        Accept: request.headers.get('accept') ?? 'application/json',
      },
      cache: 'no-store',
    });
    const body = await res.text();
    return new NextResponse(body, {
      status: res.status,
      headers: {
        'Content-Type': res.headers.get('content-type') ?? 'application/json',
      },
    });
  } catch {
    return new NextResponse('Proxy error', { status: 502 });
  }
};
