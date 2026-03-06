import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';


export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json().catch(() => ({}));
    const signature = request.headers.get('x-webhook-signature');

    
    if (process.env.NODE_ENV === 'development') {
      
      console.log('[webhook/example]', { body, signature });
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 });
  }
};