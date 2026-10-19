import { NextResponse } from 'next/server';

import { backendUrl, isConfigured } from '@/lib/backend';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Gửi mã xác thực tới email khách — xem app/api/ky/[token]/route.ts. */
export async function POST(_req: Request, { params }: { params: Promise<{ token: string }> }) {
  if (!isConfigured()) {
    return NextResponse.json({ error: 'Chưa cấu hình máy chủ' }, { status: 503 });
  }
  const { token } = await params;
  const r = await fetch(backendUrl(`/sign/${encodeURIComponent(token)}/otp`), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
  });
  return NextResponse.json(await r.json(), { status: r.status });
}
