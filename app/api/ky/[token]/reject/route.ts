import { NextResponse } from 'next/server';

import { backendUrl, isConfigured } from '@/lib/backend';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Khách từ chối ký, kèm lý do — xem app/api/ky/[token]/route.ts. */
export async function POST(req: Request, { params }: { params: Promise<{ token: string }> }) {
  if (!isConfigured()) {
    return NextResponse.json({ error: 'Chưa cấu hình máy chủ' }, { status: 503 });
  }
  const { token } = await params;
  const r = await fetch(backendUrl(`/sign/${encodeURIComponent(token)}/reject`), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: await req.text(),
    cache: 'no-store',
  });
  return NextResponse.json(await r.json(), { status: r.status });
}
