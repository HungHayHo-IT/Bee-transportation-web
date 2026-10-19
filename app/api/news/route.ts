import { NextResponse } from 'next/server';

import { backendUrl, isConfigured } from '@/lib/backend';

/**
 * Published newsroom articles. Proxies BeeOps' /api/public/news — no auth,
 * safe to expose — so the backend origin stays in server env and never reaches
 * browser code.
 *
 * The response is passed through untouched, envelope and all: unwrapping is
 * the reader's job (lib/news.ts), and a proxy that reshapes its upstream is a
 * second place for the shape to drift.
 */
export const runtime = 'nodejs';
export const revalidate = 60;

/** Keep a mistyped ?limit=99999 from turning one visitor into a full table scan. */
function clamp(value: string | null, fallback: number, max: number): number {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1) return fallback;
  return Math.min(parsed, max);
}

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const page = clamp(params.get('page'), 1, 1000);
  const limit = clamp(params.get('limit'), 12, 50);

  if (!isConfigured()) {
    // Same shape the backend would send, so a caller written against the real
    // endpoint needs no special case for a site running without a backend.
    return NextResponse.json(
      { success: true, data: { items: [], total: 0, page, limit } },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  }
  try {
    const upstream = await fetch(backendUrl(`/public/news?page=${page}&limit=${limit}`), {
      next: { revalidate: 60 },
    });
    if (!upstream.ok) {
      return NextResponse.json({ error: 'upstream_error' }, { status: 502 });
    }
    return NextResponse.json(await upstream.json());
  } catch {
    return NextResponse.json({ error: 'upstream_unreachable' }, { status: 502 });
  }
}
