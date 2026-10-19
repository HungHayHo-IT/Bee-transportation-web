import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';
import { CONTENT_TAG } from '@/lib/i18n/overrides';
import { REPRESENTATIVES_TAG } from '@/lib/representatives';
import { DICH_VU_THEM_TAG } from '@/lib/services-them';
import { PARTNER_LOGOS_TAG } from '@/lib/partner-logos';

/**
 * Những thẻ BeeOps được phép làm mới.
 *
 * Danh sách trắng chứ không nhận thẳng chuỗi gọi tới: `revalidateTag` với một
 * chuỗi tuỳ ý là một cách dọn sạch cache của trang bằng vài trăm request.
 */
const THE_CHO_PHEP = new Set<string>([
  CONTENT_TAG, REPRESENTATIVES_TAG, DICH_VU_THEM_TAG, PARTNER_LOGOS_TAG,
]);

/**
 * Làm mới nội dung ngay, không đợi hết cửa sổ cache.
 *
 * BeeOps gọi cửa này sau mỗi lần CMS lưu, và sau mỗi lần bật/tắt hay sửa mô
 * tả, ảnh người đại diện. Nhờ vậy trang vẫn dựng TĨNH — không phải đổi sang
 * render động chỉ để người sửa thấy ngay.
 *
 * Bí mật đi trong header chứ không trong query: query nằm lại trong log truy
 * cập của mọi lớp trung gian.
 */
export async function POST(request: Request): Promise<NextResponse> {
  const mong_doi = process.env.REVALIDATE_SECRET ?? '';
  // Chưa đặt bí mật thì KHÔNG mở cửa. Cửa này không lộ dữ liệu, nhưng gọi liên
  // tục là một cách dọn sạch cache của trang.
  if (!mong_doi) {
    return NextResponse.json({ error: 'Chưa cấu hình REVALIDATE_SECRET' }, { status: 503 });
  }
  if (request.headers.get('x-revalidate-secret') !== mong_doi) {
    return NextResponse.json({ error: 'Sai bí mật' }, { status: 401 });
  }

  /* Thân rỗng = thẻ nội dung, giữ nguyên cách gọi cũ của CMS. Đọc thân bằng
     try/catch vì một POST không có thân sẽ làm `json()` ném lỗi. */
  let the = CONTENT_TAG;
  try {
    const body = (await request.json()) as { tag?: unknown };
    if (typeof body?.tag === 'string') the = body.tag;
  } catch {
    /* không có thân — giữ mặc định */
  }
  if (!THE_CHO_PHEP.has(the)) {
    return NextResponse.json({ error: `Thẻ không hợp lệ: ${the}` }, { status: 400 });
  }

  /* Next 16 bắt khai một hồ sơ cache-life cho lần làm mới này. `{ expire: 0 }`
     nghĩa là bản đang nằm trong cache hết hạn ngay, nên lượt xem kế tiếp đi
     lấy dữ liệu mới. */
  revalidateTag(the, { expire: 0 });

  return NextResponse.json({ revalidated: the, at: Date.now() });
}
