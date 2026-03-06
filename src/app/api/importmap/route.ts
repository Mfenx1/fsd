import { NextResponse } from 'next/server';
import { getEnv } from '$shared';
import { getImportMapData } from '$widgets';


export const GET = () => {
  const env = getEnv();
  const data = getImportMapData(env);

  return NextResponse.json(data, {
    headers: {
      'Content-Type': 'application/importmap+json',
      'Cache-Control': 'no-store',
    },
  });
};