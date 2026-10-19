import { NextResponse } from 'next/server';

import { backendUrl, isConfigured } from '@/lib/backend';

/**
 * Cửa proxy cho trang ký: trình duyệt của khách nói chuyện với landing, landing
 * nói chuyện với BeeOps.
 *
 * Vì sao không gọi thẳng BeeOps từ trình duyệt: địa chỉ backend chỉ nằm trong
 * biến môi trường phía máy chủ, và gọi thẳng là một request khác origin cần mở
 * CORS cho cả trang công khai — mở rộng hơn hẳn thứ việc này cần.
 *
 * KHÔNG nhớ tạm gì ở đây. Trạng thái ký đổi theo từng cú bấm của chính người
 * đang xem; trả lại một bản cũ là nói với họ rằng phiếu chưa ký trong khi họ
 * vừa ký xong.
 */
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ token: string }> };

function chuaCauHinh() {
  return NextResponse.json({ error: 'Chưa cấu hình máy chủ' }, { status: 503 });
}

export async function GET(_req: Request, { params }: Ctx) {
  if (!isConfigured()) return chuaCauHinh();
  const { token } = await params;
  const r = await fetch(backendUrl(`/sign/${encodeURIComponent(token)}`), {
    cache: 'no-store',
  });
  return NextResponse.json(await r.json(), { status: r.status });
}

export async function POST(req: Request, { params }: Ctx) {
  if (!isConfigured()) return chuaCauHinh();
  const { token } = await params;
  const r = await fetch(backendUrl(`/sign/${encodeURIComponent(token)}`), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      /* Chuyển tiếp IP thật của khách: BeeOps lưu nó làm dấu vết, mà nếu không
         chuyển thì mọi chữ ký đều mang IP của máy chủ landing — một cột dữ
         liệu trông như có thật nhưng không nói được gì. */
      ...diaChiThat(req),
    },
    body: await req.text(),
    cache: 'no-store',
  });
  return NextResponse.json(await r.json(), { status: r.status });
}

export function diaChiThat(req: Request): Record<string, string> {
  const ip = req.headers.get('x-forwarded-for') ?? '';
  const ua = req.headers.get('user-agent') ?? '';
  return {
    ...(ip ? { 'x-forwarded-for': ip } : {}),
    ...(ua ? { 'user-agent': ua } : {}),
  };
}
