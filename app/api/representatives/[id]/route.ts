import { NextResponse } from 'next/server';

import { backendUrl, isConfigured } from '@/lib/backend';

/**
 * Detail of a single representative — proxies /api/landing/representatives/:id.
 * Returns 404 if the id is not numeric so we don't forward garbage.
 */
export const runtime = 'nodejs';
export const revalidate = 60;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!/^\d+$/.test(id)) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 });
  }
  if (!isConfigured()) {
    return NextResponse.json({ error: 'not_configured' }, { status: 503 });
  }
  try {
    const upstream = await fetch(backendUrl(`/landing/representatives/${id}`), {
      next: { revalidate: 60 },
    });
    if (upstream.status === 404) {
      return NextResponse.json({ error: 'not_found' }, { status: 404 });
    }
    if (!upstream.ok) {
      return NextResponse.json({ error: 'upstream_error' }, { status: 502 });
    }
    const data = await upstream.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'upstream_unreachable' }, { status: 502 });
  }
}
