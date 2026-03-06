import { NextResponse } from 'next/server';
import { createHash } from 'node:crypto';
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const REMOTES: Record<string, string> = {
  products: 'remotes/products/src',
  chat: 'remotes/chat/src',
};

const CACHE_TTL_MS = 1500;

const cache = new Map<string, { hash: string; ts: number }>();

const SRC_EXT = /\.(ts|tsx|js|jsx|css|json)$/;

const buildContentHash = async (dir: string): Promise<string> => {
  const hash = createHash('sha256');
  const entries = await readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name !== 'node_modules' && !e.name.startsWith('.')) {
        hash.update(await buildContentHash(full));
      }
    } else if (SRC_EXT.test(e.name)) {
      const content = await readFile(full, 'utf-8').catch(() => '');
      hash.update(`${e.name}:${content.length}:${content.slice(0, 50000)}\n`);
    }
  }
  return hash.digest('hex').slice(0, 16);
};

export const GET = async (request: Request) => {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Dev only' }, { status: 404 });
  }
  const { searchParams } = new URL(request.url);
  const remote = searchParams.get('remote');
  if (!remote || !REMOTES[remote]) {
    return NextResponse.json({ error: 'Invalid remote' }, { status: 400 });
  }
  try {
    const now = Date.now();
    const cached = cache.get(remote);
    if (cached && now - cached.ts < CACHE_TTL_MS) {
      return NextResponse.json({ hash: cached.hash, remote });
    }
    const dir = join(process.cwd(), REMOTES[remote]);
    const hash = await buildContentHash(dir);
    cache.set(remote, { hash, ts: now });
    return NextResponse.json({ hash, remote });
  } catch {
    return NextResponse.json({ hash: '0', remote });
  }
};