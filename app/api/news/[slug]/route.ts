import { NextResponse } from 'next/server';

import { backendUrl, isConfigured } from '@/lib/backend';

/**
 * One published article — proxies /api/public/news/:slug.
 *
 * Slugs are lowercase kebab-case coming out of the admin editor. Anything else
 * is rejected here rather than forwarded: it cannot match a record, and it
 * keeps path separators and encoded traversal out of the upstream URL.
 */
export const runtime = 'nodejs';
export const revalidate = 60;

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  if (!SLUG.test(slug)) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 });
  }
  if (!isConfigured()) {
    return NextResponse.json({ error: 'not_configured' }, { status: 503 });
  }
  try {
    const upstream = await fetch(backendUrl(`/public/news/${slug}`), {
      next: { revalidate: 60 },
    });
    if (upstream.status === 404) {
      return NextResponse.json({ error: 'not_found' }, { status: 404 });
    }
    if (!upstream.ok) {
      return NextResponse.json({ error: 'upstream_error' }, { status: 502 });
    }
    return NextResponse.json(await upstream.json());
  } catch {
    return NextResponse.json({ error: 'upstream_unreachable' }, { status: 502 });
  }
}
