import { backendUrl, isConfigured } from '@/lib/backend';
import { ORG } from '@/lib/site';

/**
 * The representatives BeeOps publishes, and how their numbers are written.
 *
 * Three places show them now — the team section, the footer and the contact
 * page — so the fetch and the formatting live here rather than being copied
 * into each. Next dedupes identical `fetch` calls within a render and caches
 * them across requests for the revalidate window, so three callers still cost
 * one request upstream.
 */

export interface Representative {
  id: number;
  fullName: string;
  email: string | null;
  phone: string | null;
  departmentName: string | null;
  roles: string[];
  /** Mô tả ngắn hiện dưới tên. null = chưa viết, và thẻ chỉ thiếu một dòng. */
  description: string | null;
  /** URL ảnh. null = chưa có ảnh, thẻ vẽ chữ cái đầu tên như trước. */
  avatarUrl: string | null;
}

/** BeeOps answers with { success, data, meta }; older builds answered bare. */
interface Envelope<T> {
  success?: boolean;
  data?: T;
}

/** List endpoints wrap their rows again: data is { items, total, page, limit }. */
interface Paged<T> {
  items?: T[];
}

/** Seconds a fetched list is reused before Next refreshes it in the background. */
export const REPRESENTATIVES_TTL = 60;

/**
 * Thẻ cache của danh sách người đại diện.
 *
 * Tách khỏi thẻ nội dung CMS là cố ý: bật một người lên landing thì không có
 * lý do gì phải dựng lại toàn bộ chữ nghĩa của trang, và ngược lại.
 */
export const REPRESENTATIVES_TAG = 'representatives';

export async function fetchRepresentatives(): Promise<Representative[] | null> {
  if (!isConfigured()) return null;
  try {
    const res = await fetch(backendUrl('/landing/representatives'), {
      // Gắn thẻ để BeeOps gọi làm mới NGAY sau khi bật/tắt hoặc sửa mô tả, ảnh
      // — xem app/api/revalidate. Không có cú gọi đó thì người vừa bật phải
      // ngồi đợi hết 60 giây, và trong lúc chờ họ không phân biệt được "bật
      // hụt" với "chưa tới lượt làm mới". 60 giây chỉ còn là mức trần.
      next: { revalidate: REPRESENTATIVES_TTL, tags: [REPRESENTATIVES_TAG] },
    });
    if (!res.ok) return null;
    const body = (await res.json()) as
      | Envelope<Representative[] | Paged<Representative>>
      | Paged<Representative>
      | Representative[];
    /* The envelope is trusted only as far as it really holds a list. Returning
       `body.data` unchecked put a non-array behind a `Representative[] | null`
       signature, and every caller guards with `?? []` or `!reps` — neither
       catches an object, so it reached `.filter` and `.map` and threw during
       prerender, failing the whole build rather than one widget.

       Three shapes reach here and all three have been seen in the wild: a bare
       array, the { success, data } envelope, and — since BeeOps changed the
       shape of its list endpoints — that envelope holding { items, total,
       page, limit }. Unwrapping only the first two left the section silently
       empty on every page that shows it. */
    const list = toList(body);
    if (list === null) {
      console.warn('[representatives] unexpected payload shape from BeeOps — using fallback');
    }
    return list;
  } catch {
    return null;
  }
}

/** Peels the envelope, then the pagination wrapper, and insists on an array.
 *  Exported because the live section parses the same three shapes off the
 *  browser-side proxy route — two copies of this would drift. */
export function toList(body: unknown): Representative[] | null {
  if (Array.isArray(body)) return body as Representative[];
  if (typeof body !== 'object' || body === null) return null;
  const { data, items } = body as { data?: unknown; items?: unknown };
  if (Array.isArray(items)) return items as Representative[];
  if (data !== undefined) return toList(data);
  return null;
}

/* ==========================================================================
   PHONE NUMBERS
   Two forms of the same number, and they are deliberately different.

   What is shown is the international form, because that is how the company
   writes its numbers everywhere else on the site. What is dialled is the
   national form with its leading zero, because that is what a phone in
   Vietnam expects — handing it "+84 886 440 449" works, but handing it
   "0886440449" is what the number on the sticker actually says, and it is the
   form that survives being copied into any local system.

   Input is whatever BeeOps holds: "0886440449", "+84886440449", "84886440449",
   with or without spaces, dots or dashes.
   ========================================================================== */

/** Everything that is not a digit or a leading plus. */
function digits(raw: string): { plus: boolean; body: string } {
  const trimmed = raw.trim();
  const plus = trimmed.startsWith('+');
  return { plus, body: trimmed.replace(/\D/g, '') };
}

/**
 * The national significant number — no country code, no trunk zero.
 * "0886440449" → "886440449", "+84886440449" → "886440449".
 */
function national(raw: string): string {
  const { plus, body } = digits(raw);
  if (plus || body.startsWith('84')) {
    // 84 is the country code only when something follows it that is long
    // enough to be a subscriber number; a number that merely starts with the
    // digits 8 and 4 after a trunk zero is not one.
    const rest = body.replace(/^84/, '');
    if (rest.length >= 8) return rest.replace(/^0+/, '');
  }
  return body.replace(/^0+/, '');
}

/**
 * Grouped the way the two kinds of Vietnamese number are actually written.
 *
 * Nine digits is a mobile, read 3-3-3. Ten is a landline, whose first three
 * are the area code and must stay whole — 3-4-3, so "2363995272" reads
 * "236 3995 272" rather than being chopped at "2 363 …". Anything else falls
 * back to threes with the odd digits at the front.
 */
function group(nsn: string): string {
  if (nsn.length === 9) return `${nsn.slice(0, 3)} ${nsn.slice(3, 6)} ${nsn.slice(6)}`;
  if (nsn.length === 10) return `${nsn.slice(0, 3)} ${nsn.slice(3, 7)} ${nsn.slice(7)}`;
  const head = nsn.length % 3 || 3;
  const parts = [nsn.slice(0, head)];
  for (let i = head; i < nsn.length; i += 3) parts.push(nsn.slice(i, i + 3));
  return parts.join(' ');
}

/** How the number is written on screen: "(+84) 886 440 449". */
export function phoneDisplay(raw: string): string {
  const nsn = national(raw);
  return nsn ? `(+84) ${group(nsn)}` : raw.trim();
}

/** What `tel:` gets: the national form, leading zero kept. */
export function phoneDial(raw: string): string {
  const nsn = national(raw);
  return nsn ? `0${nsn}` : raw.replace(/[^\d+]/g, '');
}

/** Một dòng liên hệ. Số và tên để RỜI, không ghép sẵn thành một chuỗi. */
export interface PhoneEntry {
  key: string;
  /** "(+84) 886 440 449" */
  display: string;
  /** "Mr. Tiger" */
  name: string;
  /** "tel:0886440449" */
  href: string;
}

/**
 * Số gọi hiện trên trang: lấy từ TỪ ĐIỂN, tức là từ CMS.
 *
 * Trước đây số này dựng từ danh sách Người đại diện đang bật. Bỏ đi vì nó làm
 * số gọi không sửa được ở CMS: danh sách luôn thắng, nên ô ở CMS chỉ là số dự
 * phòng cho lúc danh sách rỗng — gõ vào đó mà trang không đổi.
 *
 * Danh sách Người đại diện vẫn còn nguyên tác dụng của nó: khối Đội ngũ đọc
 * thẳng fetchRepresentatives, không đi qua đây.
 *
 * Số và tên trả về RỜI NHAU, không ghép sẵn. Ghép sẵn thì chuỗi hiện trên
 * trang ('(+84) 886 440 449 - Mr. Tiger') không khớp với ô nào trong từ điển,
 * và CMS không có cách nào bấm vào mà sửa.
 *
 * `number` chứ không phải `e164`: bản mặc định viết đúng như cách bấm máy, và
 * phoneDisplay/phoneDial tự suy ra hai dạng từ đó.
 */
export function contactPhones(site: {
  phoneNumber: string;
  phoneLabel: string;
}): PhoneEntry[] {
  const raw = site.phoneNumber.trim() || ORG.phones[0]!.number;
  return [
    {
      key: raw,
      display: phoneDisplay(raw),
      name: site.phoneLabel.trim(),
      href: `tel:${phoneDial(raw)}`,
    },
  ];
}
