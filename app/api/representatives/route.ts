import { NextResponse } from 'next/server';

import { backendUrl, isConfigured } from '@/lib/backend';
import { REPRESENTATIVES_TAG, REPRESENTATIVES_TTL } from '@/lib/representatives';

/**
 * Public list of representatives shown on the marketing site's "team" section.
 * Proxies to BeeOps' /api/landing/representatives — no auth, safe to expose.
 * Cached for a short window so a burst of visits doesn't hammer the backend.
 */
export const runtime = 'nodejs';
/* Cố ý KHÔNG đặt `revalidate` ở mức route: khối đội ngũ hỏi lại cửa này theo
   nhịp để tự cập nhật, mà một route bị đông cứng 60 giây thì nó hỏi mấy cũng
   nhận lại đúng bản cũ. Phần đắt đỏ — cú gọi sang BeeOps — vẫn được nhớ tạm ở
   ngay dưới, và cú gọi làm mới của BeeOps xoá được bản nhớ đó ngay lập tức. */

export async function GET() {
  if (!isConfigured()) {
    return NextResponse.json([], { headers: { 'Cache-Control': 'no-store' } });
  }
  try {
    const upstream = await fetch(backendUrl('/landing/representatives'), {
      // Gắn thẻ để BeeOps xoá được bản nhớ này ngay khi ai đó bật/tắt hoặc sửa
      // mô tả, ảnh — xem app/api/revalidate. Thiếu thẻ thì người vừa bật phải
      // đợi hết 60 giây dù cú gọi làm mới đã chạy.
      next: { revalidate: REPRESENTATIVES_TTL, tags: [REPRESENTATIVES_TAG] },
    });
    if (!upstream.ok) {
      return NextResponse.json({ error: 'upstream_error' }, { status: 502 });
    }
    const data = await upstream.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'upstream_unreachable' }, { status: 502 });
  }
}
