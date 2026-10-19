import { backendUrl, isConfigured } from '@/lib/backend';
import { danhSachDoiTuong } from '@/lib/editable-lists';
import type { Locale } from './config';
import type { Dictionary } from './types';

/**
 * Lớp phủ nội dung do CMS trên BeeOps admin ghi.
 *
 * Toàn bộ chữ nghĩa của trang vẫn nằm trong dictionaries/{vi,en}.ts và đó là
 * giá trị MẶC ĐỊNH. Bảng landing_content bên BeeOps chỉ giữ những ô đã bị sửa,
 * và chỗ này dán chúng đè lên bản mặc định.
 *
 * Hệ quả quan trọng: API chết thì trang vẫn đủ chữ. Mọi đường lỗi ở đây đều
 * dẫn tới "dùng bản trong code", không dẫn tới trang trắng.
 */

/** Giây. Mức trần khi không ai gọi làm mới; bình thường CMS gọi ngay sau khi lưu. */
const CACHE_SECONDS = 60;

/** Thẻ cache của lớp phủ. Làm mới thẻ này là mọi trang đọc lại nội dung. */
export const CONTENT_TAG = 'landing-content';

/** Đoạn khoá đụng tới nguyên mẫu Object — xem giải thích ở datSauKhoa. */
const NGUY_HIEM = new Set(['__proto__', 'constructor', 'prototype']);

type Nut = Record<string, unknown> | unknown[];

/**
 * Lấy map ghi đè. Không bao giờ ném: mọi trục trặc đều trả map rỗng.
 *
 * `revalidate` chứ không phải `no-store`: trang dựng tĩnh, một request mỗi 60
 * giây cho cả site là đủ mới mà không biến mỗi lượt xem thành một lượt gọi API.
 */
export async function fetchOverrides(locale: Locale): Promise<Record<string, string>> {
  if (!isConfigured()) return {};
  try {
    const res = await fetch(backendUrl(`/landing/content?locale=${locale}`), {
      // Gắn thẻ để CMS gọi làm mới ngay sau khi lưu — xem app/api/revalidate.
      // Không có cú gọi đó thì người sửa phải ngồi đợi hết 60 giây mới thấy,
      // và trong lúc chờ họ không biết mình lưu hụt hay trang chưa kịp.
      next: { revalidate: CACHE_SECONDS, tags: [CONTENT_TAG] },
    });
    if (!res.ok) return {};
    const body: unknown = await res.json();
    const data =
      typeof body === 'object' && body !== null && 'data' in body
        ? (body as { data: unknown }).data
        : body;
    if (typeof data !== 'object' || data === null || Array.isArray(data)) return {};
    // Chỉ nhận ô có giá trị là chuỗi. Backend đã ràng buộc, nhưng đây là dữ
    // liệu từ một tiến trình khác nên vẫn phải tự kiểm.
    return Object.fromEntries(
      Object.entries(data as Record<string, unknown>).filter(
        (e): e is [string, string] => typeof e[1] === 'string',
      ),
    );
  } catch {
    return {};
  }
}

/**
 * Gán một giá trị vào cây theo đường dẫn 'a.b.0.c'.
 *
 * Ba luật, mỗi luật chặn một kiểu hỏng:
 *
 * 1. Bỏ qua đoạn đụng nguyên mẫu. Backend đã chặn, nhưng dữ liệu đi qua mạng
 *    và qua một cơ sở dữ liệu mà nhiều người ghi được; chặn hai lớp là rẻ, còn
 *    sửa được Object.prototype của tiến trình render thì đổi được cả trang.
 * 2. Chỉ ghi đè khi ô đích ĐANG TỒN TẠI và đang là chuỗi. Khoá lạ — do đổi tên
 *    trong code hay gõ sai — im lặng rơi về bản mặc định, thay vì mọc thêm một
 *    nhánh mà không giao diện nào đọc tới.
 * 3. Không tự tạo nhánh giữa đường. Cùng lý do.
 */
function datSauKhoa(goc: Nut, keyPath: string, value: string): void {
  const doan = keyPath.split('.');
  if (doan.some((d) => NGUY_HIEM.has(d))) return;

  /* Ô ảnh là ngoại lệ có chủ ý, và TÊN Ô có thể chứa dấu chấm.
     `images` trong từ điển luôn rỗng — ảnh mặc định là file trong repo chứ
     không phải một chuỗi — nên ở nhánh này ô đích chưa tồn tại là chuyện bình
     thường, không phải dấu hiệu khoá sai.
     Phần sau 'images.' giữ NGUYÊN, không tách tiếp theo dấu chấm: ảnh của một
     dịch vụ có tên ô là 'service.consulting', và imageProps tra đúng chuỗi đó
     trong dict.images. Tách tiếp thì nó thành nhánh images.service.consulting,
     không chỗ nào đọc tới — tải ảnh lên vẫn lưu được nhưng trang không bao giờ
     dùng, và không có gì báo. */
  if (doan.length >= 2 && doan[0] === 'images') {
    if (typeof goc !== 'object' || goc === null) return;
    const anh = (goc as Record<string, unknown>).images;
    if (typeof anh !== 'object' || anh === null) return;
    (anh as Record<string, unknown>)[keyPath.slice('images.'.length)] = value;
    return;
  }

  let nut: unknown = goc;
  for (const d of doan.slice(0, -1)) {
    if (typeof nut !== 'object' || nut === null) return;
    nut = (nut as Record<string, unknown>)[d];
  }
  const cuoi = doan[doan.length - 1];
  if (cuoi === undefined) return;
  if (typeof nut !== 'object' || nut === null) return;

  const cha = nut as Record<string, unknown>;
  // Ô số giữ nguyên kiểu số. Counter nhận `to: number` rồi đưa qua
  // Intl.NumberFormat; ghi một chuỗi vào đó là trang hỏng ngay chỗ đó. Chuỗi
  // không đọc ra số thì BỎ QUA và giữ mặc định — thà hiện con số cũ còn hơn
  // hiện NaN.
  if (typeof cha[cuoi] === 'number') {
    const so = Number(value.trim());
    if (value.trim() !== '' && Number.isFinite(so)) cha[cuoi] = so;
    return;
  }
  if (typeof cha[cuoi] !== 'string') return;
  cha[cuoi] = value;
}

/**
 * Bản sao sâu của từ điển, có lớp phủ dán lên.
 *
 * Phải sao chép: từ điển là module dùng chung cho mọi request trong tiến trình,
 * sửa tại chỗ là một request làm bẩn các request sau. structuredClone có sẵn
 * trong Node 18+.
 */
/**
 * Ghi đè CẢ MỘT DANH SÁCH: giá trị là một mảng chuỗi viết dưới dạng JSON.
 *
 * Đây là thứ cho phép THÊM và ĐỔI THỨ TỰ, hai việc mà ghi đè từng ô không làm
 * được: ô thứ 7 không tồn tại thì không có gì để ghi đè, và đổi chỗ hai ô là
 * đổi nội dung của cả hai chứ không phải đổi thứ tự.
 *
 * Trả về true nếu đã thay thật, để nơi gọi biết mà bỏ qua những ô chỉ số cũ
 * của chính danh sách đó — xem applyOverrides.
 *
 * Từ chối mọi thứ không chắc chắn: JSON hỏng, không phải mảng, có phần tử
 * không phải chuỗi, hoặc đích đến vốn không phải mảng chuỗi. Sai thì GIỮ BẢN
 * TRONG CODE, vì một mảng hỏng làm trang ném lỗi chứ không chỉ mất một dòng.
 */
function datCaDanhSach(goc: Nut, keyPath: string, value: string): boolean {
  const doan = keyPath.split('.');
  if (doan.some((d) => NGUY_HIEM.has(d))) return false;

  let nut: unknown = goc;
  for (const d of doan.slice(0, -1)) {
    if (typeof nut !== 'object' || nut === null) return false;
    nut = (nut as Record<string, unknown>)[d];
  }
  const cuoi = doan[doan.length - 1];
  if (cuoi === undefined || typeof nut !== 'object' || nut === null) return false;

  const cha = nut as Record<string, unknown>;
  const dich = cha[cuoi];
  if (!Array.isArray(dich)) return false;

  let moi: unknown;
  try {
    moi = JSON.parse(value);
  } catch {
    return false;
  }
  if (!Array.isArray(moi)) return false;

  // Danh sách chứa ĐỐI TƯỢNG: chỉ nhận những danh sách đã khai, và mỗi mục
  // phải có ĐÚNG những ô đã khai. Thiếu một ô là trang ném lỗi ở chỗ đọc ô đó,
  // nên thà giữ bản trong code.
  const khai = danhSachDoiTuong(keyPath);
  if (khai) {
    /* MỌI ô đều không bắt buộc, và đó là chuyện tương thích ngược chứ không
       phải sự dễ dãi.

       Thêm một ô mới vào danh sách — công tắc ẩn/hiện, số điện thoại riêng —
       là chuyện sẽ còn xảy ra. Mỗi lần như thế, những bản ghi đè đã lưu trước
       đó đều thiếu đúng ô vừa thêm. Nếu đòi đủ thì cả danh sách bị từ chối và
       trang LẶNG LẼ quay về bản trong mã nguồn: người biên tập mất hết phần đã
       sửa mà không có lấy một thông báo, và lỗi hiện ra ở một trang khác hẳn
       chỗ vừa deploy.

       Thiếu thì điền chuỗi rỗng ngay dưới đây, nên bên đọc vẫn luôn nhận được
       một mục đủ hình dạng — thứ mà luật cũ đang bảo vệ. Chỉ ô LẠ mới bị từ
       chối: nó không tới từ màn CMS, và nhận bừa là mở đường cho dữ liệu không
       ai kiểm vào thẳng từ điển. */
    const hopLe = moi.every((x) => {
      if (typeof x !== 'object' || x === null || Array.isArray(x)) return false;
      const o = x as Record<string, unknown>;
      return Object.entries(o).every(
        ([k, v]) => khai.fields.includes(k) && typeof v === 'string',
      );
    });
    if (!hopLe) return false;

    // Điền ô còn thiếu để mọi mục cùng một hình dạng.
    moi = (moi as Record<string, string>[]).map((x) =>
      Object.fromEntries(khai.fields.map((f) => [f, x[f] ?? ''])),
    );
    const cong = khai.toggles ?? [];
    /* Mục trống trơn thì bỏ — đó là cách xoá một mục, cùng luật với danh sách
       chữ: xoá trắng các ô rồi lưu. Ô CÔNG TẮC không tính vào đây: gạt công
       tắc mà chưa gõ gì thì mục đó vẫn là mục trống, và để nó sống sót là giữ
       lại một văn phòng không tên không địa chỉ. */
    const oChu = khai.fields.filter((f) => !(khai.toggles ?? []).includes(f));
    cha[cuoi] = (moi as Record<string, string>[]).filter((x) =>
      oChu.some((f) => (x[f] ?? '').trim() !== ''),
    );
    return true;
  }

  if (!dich.every((x) => typeof x === 'string')) return false;
  if (!moi.every((x) => typeof x === 'string')) return false;

  cha[cuoi] = (moi as string[]).filter((x) => x.trim() !== '');
  return true;
}

/**
 * Ô chỉ số của một danh sách đã bị thay cả cụm.
 *
 * 'customs.scope.2' với danh sách chữ, và 'site.offices.0.street' với danh
 * sách đối tượng — ở đó chỉ số còn có một tên ô đi sau.
 */
function laOChiSoCua(keyPath: string, danhSach: Set<string>): boolean {
  for (const p of danhSach) {
    if (!keyPath.startsWith(`${p}.`)) continue;
    if (/^\d+(\..+)?$/.test(keyPath.slice(p.length + 1))) return true;
  }
  return false;
}

/**
 * Bỏ khỏi danh sách những mục đã bị xoá trắng.
 *
 * ĐÂY LÀ CÁCH BỎ BỚT MỘT MỤC. CMS ghi đè từng ô một; nó không thêm hay bớt
 * được phần tử của một mảng — làm được thế thì phải có cả một màn sắp xếp danh
 * sách, và cả hai đầu phải biết mảng nào cho thêm bớt. Xoá trắng một ô là cách
 * bỏ mục đó mà không cần gì trong số đó: danh sách gốc trong code vẫn nguyên,
 * nên sai thì khôi phục lại được ngay.
 *
 * Chỉ áp cho mảng TOÀN CHUỖI — những dải thẻ, gạch đầu dòng, con số. Mảng chứa
 * đối tượng (bước quy trình, câu hỏi thường gặp) thì không đụng tới: ở đó
 * không có "ô nào" quyết định cả mục, và đoán bừa là xoá nhầm. Khối nào cần
 * kiểu đó thì tự lọc lấy — xem ProcessSlide.
 *
 * Một chuỗi rỗng trong dải thẻ luôn là rác: nó dựng ra một cái thẻ trống.
 */
function bo_muc_trong(nut: unknown, duong = ''): void {
  if (Array.isArray(nut)) {
    if (nut.length > 0 && nut.every((x) => typeof x === 'string')) {
      const giu = (nut as string[]).filter((x) => x.trim() !== '');
      if (giu.length !== nut.length) nut.splice(0, nut.length, ...giu);
      return;
    }
    // Danh sách đối tượng ĐÃ KHAI: một mục trống trơn mọi ô cũng là đã xoá.
    // Chỉ những danh sách đã khai, vì ở các mảng đối tượng khác một mục trống
    // có thể là chỗ giữ chỗ mà component vẫn đếm.
    const khai = danhSachDoiTuong(duong);
    if (khai) {
      const giu = nut.filter(
        (x) =>
          typeof x === 'object' &&
          x !== null &&
          khai.fields.some(
            (f) => String((x as Record<string, unknown>)[f] ?? '').trim() !== '',
          ),
      );
      if (giu.length !== nut.length) nut.splice(0, nut.length, ...giu);
      return;
    }
    nut.forEach((con, i) => bo_muc_trong(con, `${duong}.${i}`));
    return;
  }
  if (typeof nut === 'object' && nut !== null) {
    for (const [k, con] of Object.entries(nut)) {
      bo_muc_trong(con, duong ? `${duong}.${k}` : k);
    }
  }
}

export function applyOverrides(
  dict: Dictionary,
  overrides: Record<string, string>,
): Dictionary {
  const khoa = Object.keys(overrides);
  if (khoa.length === 0) return dict;

  const ban_sao = structuredClone(dict) as Dictionary;

  // Hai lượt, và thứ tự này quan trọng. Lượt một thay cả danh sách; lượt hai
  // mới tới từng ô. Ngược lại thì ô sửa xong bị cả danh sách ghi đè lên.
  //
  // Danh sách nào đã thay cả cụm thì BỎ QUA những ô chỉ số cũ của nó: chỉ số
  // trỏ vào vị trí trong danh sách CŨ, mà danh sách đã đổi cả thứ tự lẫn số
  // lượng — áp vào là chữ rơi nhầm chỗ, im lặng.
  const daThay = new Set<string>();
  for (const k of khoa) {
    const v = overrides[k];
    if (v === undefined || !v.startsWith('[')) continue;
    if (datCaDanhSach(ban_sao as unknown as Nut, k, v)) daThay.add(k);
  }
  for (const k of khoa) {
    const v = overrides[k];
    if (v === undefined || daThay.has(k) || laOChiSoCua(k, daThay)) continue;
    datSauKhoa(ban_sao as unknown as Nut, k, v);
  }

  bo_muc_trong(ban_sao);
  return ban_sao;
}
