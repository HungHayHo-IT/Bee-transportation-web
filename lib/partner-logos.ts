import { backendUrl, isConfigured } from './backend';

/**
 * Logo hai dải đối tác trên trang chủ — quản lý ở màn CMS của BeeOps.
 *
 * `imageUrl` là đường dẫn tương đối `/img/logos/...` (logo có sẵn trong repo
 * này) hoặc URL S3 (logo tải lên từ CMS). `ratio` là rộng/cao phần nội dung
 * logo — dải chia kích thước theo diện tích nhờ nó.
 */
export interface PartnerLogo {
  group: 'customer' | 'membership';
  name: string;
  imageUrl: string;
  ratio: number;
}

/** Thẻ cache riêng, để BeeOps làm mới ngay sau khi thêm, xoá hay bật/tắt logo. */
export const PARTNER_LOGOS_TAG = 'partner-logos';
/** Giây. Mức trần khi không ai gọi làm mới. */
const TTL = 60;

/**
 * `null` = KHÔNG LẤY ĐƯỢC (chưa cấu hình, mạng chớp, payload lạ) — nơi gọi
 * rơi về danh sách dựng sẵn. Mảng rỗng là câu trả lời thật: người quản trị
 * đã tắt hết, và dải phải trống theo.
 */
export async function fetchPartnerLogos(): Promise<PartnerLogo[] | null> {
  if (!isConfigured()) return null;
  try {
    const res = await fetch(backendUrl('/landing/partner-logos'), {
      next: { revalidate: TTL, tags: [PARTNER_LOGOS_TAG] },
    });
    if (!res.ok) return null;
    const body: unknown = await res.json();
    const tho = Array.isArray(body) ? body : (body as { data?: unknown } | null)?.data;
    if (!Array.isArray(tho)) return null;
    return tho.filter(laLogo);
  } catch {
    // Không lấy được thì dải chạy bằng danh sách dựng sẵn. Một logo mới chưa
    // hiện thì khó chịu; cả trang chủ đổ vì backend chớp một nhịp thì tệ hơn.
    return null;
  }
}

function laLogo(x: unknown): x is PartnerLogo {
  if (typeof x !== 'object' || x === null) return false;
  const o = x as Record<string, unknown>;
  return (o.group === 'customer' || o.group === 'membership')
    && typeof o.name === 'string'
    && typeof o.imageUrl === 'string'
    && typeof o.ratio === 'number' && o.ratio > 0;
}
