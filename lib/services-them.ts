import { backendUrl, isConfigured } from './backend';
import type { Locale } from './i18n/config';
import type { Dictionary, ServiceEntry } from './i18n/types';

/**
 * Dịch vụ do người dùng tự thêm trong màn Nội dung.
 *
 * Chín dịch vụ gốc nằm trong code của trang này. Dịch vụ tự thêm nằm ở BeeOps
 * — cùng một dòng với dịch vụ trong danh mục báo giá, nên khách chọn được nó
 * khi gửi form và đơn định tuyến được về phòng ban. Ở đây chỉ lấy phần định
 * danh và đường dẫn; còn chữ nghĩa của trang do lớp phủ CMS quyết định, y hệt
 * chín dịch vụ gốc.
 */

export interface DichVuThem {
  key: string;
  code: string;
  name: string;
  slugVi: string;
  slugEn: string;
  sortOrder: number;
}

/** Thẻ cache riêng, để BeeOps làm mới ngay sau khi thêm một dịch vụ. */
export const DICH_VU_THEM_TAG = 'services-them';
/** Giây. Mức trần khi không ai gọi làm mới. */
const TTL = 60;

export function slugThem(sv: DichVuThem, locale: Locale): string {
  return locale === 'en-us' ? sv.slugEn : sv.slugVi;
}

export async function fetchDichVuThem(): Promise<DichVuThem[]> {
  if (!isConfigured()) return [];
  try {
    const res = await fetch(backendUrl('/services/landing'), {
      next: { revalidate: TTL, tags: [DICH_VU_THEM_TAG] },
    });
    if (!res.ok) return [];
    const body: unknown = await res.json();
    return docDanhSach(body);
  } catch {
    // Không lấy được thì trang vẫn chạy với chín dịch vụ gốc. Một dịch vụ mới
    // chưa hiện ra thì khó chịu; cả trang đổ vì backend chớp một nhịp thì tệ
    // hơn nhiều.
    return [];
  }
}

/** Bóc vỏ { success, data: { items } } của BeeOps, và chỉ nhận dòng đủ trường. */
function docDanhSach(body: unknown): DichVuThem[] {
  const tho = boVo(body);
  if (!Array.isArray(tho)) return [];
  return tho.filter(laDichVuThem);
}

function boVo(body: unknown): unknown {
  if (Array.isArray(body)) return body;
  if (typeof body !== 'object' || body === null) return null;
  const { data, items } = body as { data?: unknown; items?: unknown };
  if (Array.isArray(items)) return items;
  return data === undefined ? null : boVo(data);
}

/**
 * Thiếu một trường là thiếu một mảnh của URL hoặc của khoá nội dung, và cả hai
 * đều dẫn tới một trang hỏng chứ không phải một trang thiếu chữ. Bỏ hẳn dòng
 * đó còn hơn dựng ra một trang không có địa chỉ.
 */
function laDichVuThem(x: unknown): x is DichVuThem {
  if (typeof x !== 'object' || x === null) return false;
  const o = x as Record<string, unknown>;
  return (
    typeof o.key === 'string' && o.key.length > 0 &&
    typeof o.code === 'string' &&
    typeof o.name === 'string' &&
    typeof o.slugVi === 'string' && o.slugVi.length > 0 &&
    typeof o.slugEn === 'string' && o.slugEn.length > 0
  );
}

/* ==========================================================================
   KHUÔN NỘI DUNG
   ========================================================================== */

/**
 * Khuôn cho một dịch vụ mới: đủ mọi khối mà trang dịch vụ vẽ, với chữ mồi.
 *
 * Số mục khớp với chín dịch vụ có sẵn — ba vấn đề, BỐN bước triển khai, ba ưu
 * thế, ba câu hỏi. Đếm từ chính từ điển chứ không đoán: khuôn ba bước đứng
 * cạnh trang bốn bước là hai trang cùng một khuôn mà ra hai hình hài.
 *
 * Vì sao có chữ mồi chứ không để rỗng: trang dịch vụ dựng theo khối, khối rỗng
 * thì biến mất — người vừa thêm dịch vụ mở trang ra thấy một trang trắng và
 * không biết mình được phép viết những gì. Chữ mồi cũng chính là thứ màn quản
 * trị đem ra xem trước, nên người ta biết trước sẽ phải điền bao nhiêu ô.
 *
 * Tên lấy từ BeeOps; mọi ô còn lại người dùng sửa đè qua CMS.
 */
export function khuonDichVu(sv: DichVuThem, locale: Locale): ServiceEntry {
  return locale === 'en-us' ? khuonEn(sv) : khuonVi(sv);
}

function khuonVi(sv: DichVuThem): ServiceEntry {
  const ten = sv.name;
  return {
    name: ten,
    body: `Một dòng giới thiệu ngắn về ${ten} — viết lại ở màn Nội dung.`,
    intro: `${ten} là dịch vụ BEE Transportation cung cấp. Thay đoạn này bằng phần giới thiệu của bạn: dịch vụ này dành cho ai, giải quyết việc gì, và vì sao khách nên chọn.`,
    problems: [
      { name: 'Vấn đề thứ nhất', body: 'Điều gì thường trục trặc khi khách chưa có dịch vụ này.' },
      { name: 'Vấn đề thứ hai', body: 'Một khó khăn nữa khách hay gặp.' },
      { name: 'Vấn đề thứ ba', body: 'Rủi ro hoặc chi phí phát sinh mà khách không lường trước.' },
    ],
    approach: [
      { name: 'Bước 1 — Tiếp nhận', body: 'Mô tả việc đầu tiên đội ngũ làm khi nhận yêu cầu.' },
      { name: 'Bước 2 — Lên phương án', body: 'Cách chốt phương án và báo giá cho khách.' },
      { name: 'Bước 3 — Triển khai', body: 'Cách công việc được tổ chức và theo dõi.' },
      { name: 'Bước 4 — Nghiệm thu', body: 'Bàn giao, chứng từ và những gì khách nhận được.' },
    ],
    usps: [
      { name: 'Ưu thế thứ nhất', body: 'Một lý do cụ thể, kiểm chứng được.' },
      { name: 'Ưu thế thứ hai', body: 'Năng lực, thiết bị hoặc kinh nghiệm cụ thể.' },
      { name: 'Ưu thế thứ ba', body: 'Cam kết về thời gian, chi phí hoặc an toàn.' },
    ],
    points: [
      'Hạng mục công việc thứ nhất',
      'Hạng mục công việc thứ hai',
      'Hạng mục công việc thứ ba',
      'Hạng mục công việc thứ tư',
    ],
    faqs: [
      { q: `${ten} nhận những loại hàng nào?`, a: 'Viết câu trả lời ở màn Nội dung.' },
      { q: 'Thời gian và chi phí tính thế nào?', a: 'Viết câu trả lời ở màn Nội dung.' },
      { q: 'Cần chuẩn bị giấy tờ gì?', a: 'Viết câu trả lời ở màn Nội dung.' },
    ],
    meta: {
      title: `${ten} | BEE Transportation`,
      description: `${ten} — dịch vụ của BEE Transportation. Viết lại mô tả này cho đúng từ khoá khách tìm.`,
    },
  };
}

function khuonEn(sv: DichVuThem): ServiceEntry {
  const ten = sv.name;
  return {
    name: ten,
    body: `A one-line summary of ${ten} — rewrite this in the Content screen.`,
    intro: `${ten} is a service BEE Transportation provides. Replace this with your own introduction: who it is for, what it solves, and why a shipper should choose it.`,
    problems: [
      { name: 'First problem', body: 'What typically goes wrong without this service.' },
      { name: 'Second problem', body: 'Another difficulty shippers run into.' },
      { name: 'Third problem', body: 'A risk or hidden cost they did not plan for.' },
    ],
    approach: [
      { name: 'Step 1 — Intake', body: 'What the team does first when a request arrives.' },
      { name: 'Step 2 — Planning', body: 'How the plan and the quotation are agreed.' },
      { name: 'Step 3 — Execution', body: 'How the work is organised and tracked.' },
      { name: 'Step 4 — Handover', body: 'Delivery, paperwork and what the client receives.' },
    ],
    usps: [
      { name: 'First advantage', body: 'One concrete, verifiable reason.' },
      { name: 'Second advantage', body: 'Specific capability, equipment or experience.' },
      { name: 'Third advantage', body: 'A commitment on time, cost or safety.' },
    ],
    points: ['First scope item', 'Second scope item', 'Third scope item', 'Fourth scope item'],
    faqs: [
      { q: `What cargo does ${ten} handle?`, a: 'Write the answer in the Content screen.' },
      { q: 'How are lead time and cost worked out?', a: 'Write the answer in the Content screen.' },
      { q: 'What paperwork is needed?', a: 'Write the answer in the Content screen.' },
    ],
    meta: {
      title: `${ten} | BEE Transportation`,
      description: `${ten} — a BEE Transportation service. Rewrite this description around the words clients search for.`,
    },
  };
}

/* ==========================================================================
   GHÉP VÀO TỪ ĐIỂN
   ========================================================================== */

/**
 * Nhét dịch vụ tự thêm vào từ điển, TRƯỚC khi dán lớp phủ CMS lên.
 *
 * Đây là chỗ mấu chốt của cả tính năng: ghép ở tầng từ điển thì menu, thẻ trang
 * chủ, chân trang, trang chi tiết, danh mục ô của CMS — tất cả đều thấy dịch vụ
 * mới mà không phải sửa một dòng nào, vì chúng vốn đã đọc từ điển. Ghép ở từng
 * chỗ hiển thị thì mỗi chỗ là một lần quên.
 *
 * Và vì ghép TRƯỚC lớp phủ, mọi ô của dịch vụ mới sửa được qua CMS y hệt chín
 * dịch vụ gốc — không cần một đường lưu riêng.
 */
/** Bỏ `readonly` một tầng, chỉ để dựng bản sao rồi trả lại dạng chỉ-đọc. */
type Mutable<T> = { -readonly [K in keyof T]: T[K] };

export function ghepDichVuThem(
  dict: Dictionary,
  them: readonly DichVuThem[],
  locale: Locale,
): Dictionary {
  if (them.length === 0) return dict;

  /* Kiểu giữ nguyên hình dạng của từ điển: chín khoá gốc vẫn bắt buộc có, và
     phần chỉ số chuỗi mở đường cho khoá mới. Khai là `Record<string, …>` thuần
     thì TypeScript không còn thấy chín khoá kia nữa. */
  const items: Mutable<typeof dict.services.items> = { ...dict.services.items };
  const khoaMoi: string[] = [];
  for (const sv of them) {
    // Không đè lên khoá đã có: một dịch vụ tự thêm trùng khoá với dịch vụ gốc
    // sẽ xoá sổ trang gốc, và không ai hiểu vì sao.
    if (items[sv.key]) continue;
    items[sv.key] = {
      ...khuonDichVu(sv, locale),
      slug: slugThem(sv, locale),
      code: sv.code,
    };
    khoaMoi.push(sv.key);
  }
  if (khoaMoi.length === 0) return dict;

  return {
    ...dict,
    services: {
      ...dict.services,
      items,
      // Nối vào CUỐI thứ tự mặc định. Người dùng kéo lên xuống được ở màn Nội
      // dung như mọi mục khác — thứ tự đó nằm trong ô `services.order` và lớp
      // phủ dán đè lên sau bước này.
      order: [...dict.services.order, ...khoaMoi],
    },
  };
}
