import { NextResponse } from 'next/server';

import { backendServiceCode, backendUrl, isConfigured } from '@/lib/backend';
import { fetchDichVuThem } from '@/lib/services-them';

/** Mã BeeOps của một dịch vụ người dùng tự thêm, hoặc undefined. */
async function maDichVuThem(key: string | undefined): Promise<string | undefined> {
  if (!key) return undefined;
  return (await fetchDichVuThem()).find((sv) => sv.key === key)?.code;
}

/**
 * Quotation requests from the contact form.
 *
 * Forwards to BeeOps' public quote-requests API. The origin never leaves the
 * server — the browser only ever sees this route. If BEEOPS_API_URL is not
 * configured (previews, dev without .env.local), fall back to logging the
 * payload so the form still works.
 *
 * The service field arrives as a stable key (`domestic`, `customs`, …). We
 * translate it to a backend service CODE (`DOM`, `CUS`, …) and let the
 * backend resolve the id. What the mapping doesn't cover simply lands as
 * pending on the backend, awaiting an operator.
 */

export const runtime = 'nodejs';
/** A form post is never cacheable. */
export const dynamic = 'force-dynamic';

type Payload = {
  name: string;
  phone: string;
  email?: string;
  service?: string;
  message?: string;
  /** Honeypot: a real person never fills a field they cannot see. */
  company?: string;
};

const MAX = { name: 120, phone: 40, email: 160, service: 160, message: 4000 };

function clean(value: unknown, max: number): string {
  return String(value ?? '').trim().slice(0, max);
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  const payload: Payload = {
    name: clean(body.name, MAX.name),
    phone: clean(body.phone, MAX.phone),
    email: clean(body.email, MAX.email),
    service: clean(body.service, MAX.service),
    message: clean(body.message, MAX.message),
    company: clean(body.company, 80),
  };

  // Silently accept and drop anything that filled the honeypot: telling a bot
  // it was caught only teaches it to try again differently.
  if (payload.company) return NextResponse.json({ ok: true });

  if (!payload.name || !payload.phone) {
    return NextResponse.json({ error: 'missing_required' }, { status: 422 });
  }

  /* Chín dịch vụ gốc tra bảng trong code; dịch vụ người dùng tự thêm mang mã
     của chính nó bên BeeOps. Thiếu bước thứ hai thì khách chọn dịch vụ mới ở
     form, yêu cầu vẫn tới nơi nhưng không dịch vụ nào gắn vào — không đơn nào
     được tạo, và nó nằm im ở 'pending' cho tới khi có người để ý. */
  const serviceCode =
    backendServiceCode(payload.service) ?? (await maDichVuThem(payload.service));

  // Không cấu hình endpoint (preview, dev quên .env) — vẫn nhận yêu cầu, log ra
  // để không mất khách. Đây là đường lui, không phải mode chính.
  if (!isConfigured()) {
    console.info('[quote] BEEOPS_API_URL missing — logging only', {
      name: payload.name,
      phone: payload.phone,
      email: payload.email || null,
      service: payload.service || null,
      messageLength: payload.message?.length ?? 0,
      at: new Date().toISOString(),
    });
    return NextResponse.json({ ok: true });
  }

  try {
    const upstream = await fetch(backendUrl('/quote-requests'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // IP thật của khách — backend thấy IP của Vercel, nên trần theo IP bên đó
        // đọc header này. Vercel tự ghi x-forwarded-for, phần tử đầu là client.
        'x-client-ip':
          request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
          request.headers.get('x-real-ip') ??
          '',
      },
      // Không forward Cookie — form public luôn ẩn danh, dù người dùng có
      // đăng nhập trên admin site cũng KHÔNG dùng session đó cho form khách.
      body: JSON.stringify({
        customerName: payload.name,
        phone: payload.phone,
        email: payload.email || undefined,
        serviceCode,
        note: payload.message || undefined,
      }),
      cache: 'no-store',
    });
    // Vượt giới hạn (3 yêu cầu/số/24 giờ hoặc trần theo IP) — báo đúng lý do,
    // không gộp vào "gửi thất bại".
    if (upstream.status === 429) return NextResponse.json({ error: 'limited' }, { status: 429 });
    if (!upstream.ok) {
      const detail = await upstream.text().catch(() => '');
      console.warn('[quote] backend returned', upstream.status, detail.slice(0, 300));
      return NextResponse.json({ error: 'upstream_error' }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[quote] backend unreachable', (err as Error).message);
    return NextResponse.json({ error: 'upstream_unreachable' }, { status: 502 });
  }
}
