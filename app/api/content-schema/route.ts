import { NextResponse } from 'next/server';
import { getBaseContent, getContent } from '@/lib/i18n';
import {
  CONTENT_PAGES, CONTENT_SECTIONS, khoiDichVuThem, sectionForKey, trangDichVuThem,
} from '@/lib/content-sections';
import { IMAGE_SLOTS } from '@/lib/image-slots';
import { isLocale } from '@/lib/i18n/config';
import { thuTuDichVu } from '@/lib/service-order';
import { danhSachDichVu, khoaTenMuc, khoaTrangMuc } from '@/lib/service-listing';
import { OBJECT_LISTS } from '@/lib/editable-lists';
import { allPagePaths, allServicePaths } from '@/lib/routes';
import { MUC_EN, TRANG_EN } from '@/lib/content-sections-en';
import { SOCIAL_ICONS, SOCIAL_KEYS, SOCIAL_LABELS } from '@/lib/social';
import { DUONG_DAN_KY } from '@/lib/sign';

/**
 * Danh mục những ô nội dung mà CMS sửa được, kèm giá trị mặc định.
 *
 * Vì sao cửa này nằm ở landing chứ không ở BeeOps: bản mặc định là từ điển
 * biên dịch trong chính repo này. Chép danh mục sang backend là tạo ra bản sao
 * thứ hai, và nó sẽ lệch ngay lần đầu có người sửa chữ trong code mà quên
 * đồng bộ — lệch kiểu đó không báo lỗi ở đâu cả, chỉ là CMS thiếu mất vài ô.
 *
 * Trả về map PHẲNG 'a.b.0.c' -> chuỗi. Admin dựng cây từ chính khoá này.
 */

/** Khối chủ thương hiệu giữ lại, không mở cho CMS. Trùng với chặn ở backend. */
const LOCKED_PREFIXES = ['ctaBand'];

/**
 * Hai ô của dịch vụ tự thêm KHÔNG phải nội dung: `slug` là địa chỉ trang,
 * `code` là mã dịch vụ bên BeeOps. Sửa `slug` qua màn Nội dung là gãy mọi
 * đường link đã phát ra ngoài, còn sửa `code` là form báo giá gửi về một dịch
 * vụ không tồn tại. Backend chặn ghi đè hai khoá này lần nữa.
 */
const DINH_TUYEN = /^services\.items\.[^.]+\.(slug|code)$/;

/**
 * Ô của THIẾT KẾ CŨ — còn trong từ điển nhưng không trang nào dựng ra nữa.
 *
 * Commit 29e39b1 (10/09/2026) thiết kế lại cả trang: 38 file, hơn 3.400 dòng,
 * ảnh mới. Các khối "Về chúng tôi" kiểu cũ, "Quy trình" bốn bước, dải chữ chạy
 * và vài nhãn lẻ bị THAY chứ không phải gỡ nhầm — nhưng chữ của chúng vẫn nằm
 * trong vi.ts và en.ts, nên màn CMS vẫn bày ra 49 ô cho người biên tập.
 *
 * Bày một ô mà sửa nó không đổi gì ngoài trang là nói dối người đang sửa: họ
 * gõ, bấm lưu, ra web tìm, không thấy, rồi đi báo hệ thống hỏng. Ẩn đi là cách
 * duy nhất nói thật mà không phải đắp khối cũ lên trang đã thiết kế lại.
 *
 * KHÔNG xoá chữ khỏi từ điển: muốn dựng lại khối nào thì nội dung còn nguyên
 * đó, chỉ cần bỏ dòng tương ứng ở đây — đúng như `points` và `faqs` đã nằm chờ
 * hai tuần rồi được dựng lại nguyên vẹn ngày 30/09.
 *
 * Đo bằng cách đánh dấu từng ô rồi tải hết các trang, không phải đoán.
 */
const THIET_KE_CU: readonly RegExp[] = [
  // Khối "Về chúng tôi" cũ: tiêu đề, dẫn nhập, bốn con số, hai nút.
  /^about\.(title|titleAccent|titleTail|eyebrow|lead|ctaPrimary|ctaGhost)$/,
  /^about\.stats\./,
  /^about\.detail\.cta$/,
  // Khối "Quy trình" bốn bước, đã thay bằng khối khác.
  /^process\./,
  // Dải chữ chạy ngang của thiết kế cũ.
  /^marquee$/,
  // Tiêu đề mục Dịch vụ và mô tả ngắn từng dịch vụ — thẻ dịch vụ nay chỉ in tên.
  /^services\.(title|titleAccent|titleTail|eyebrow|lead)$/,
  /^services\.items\.[^.]+\.body$/,
  // Nhãn lẻ không còn chỗ gọi.
  /^services\.(backToAll|uspHeading|relatedHeading)$/,
  /^footer\.aboutLabel$/,
  /^warehousing\.techHeading$/,
  /^crossborder\.map(Caption|Source)$/,
  /^nav\.about$/,
  // Tiêu đề chung của các khối trang dịch vụ: nay mỗi dịch vụ một ô riêng
  // (services.items.<dịch vụ>.problemsHeading) — ô chung chỉ còn là giá trị
  // mặc định, sửa nó không đổi trang nào.
  /^services\.(problemsHeading|approachHeading|scopeHeading|faqHeading)$/,
];

/**
 * Danh sách có SỐ LƯỢNG CỐ ĐỊNH — không cho thêm, không cho bớt.
 *
 * Mã nguồn ràng buộc đúng số phần tử ở những chỗ này, và ràng buộc đó không
 * nằm trong từ điển nên nhìn dữ liệu không thấy:
 *
 * * `hero.chapters` — bốn mốc chương chạy theo bốn quãng của video hero. Thêm
 *   mốc thứ năm thì nó không có quãng nào, không hiện ra, và không báo gì.
 * * `og.facts` — ba con số vẽ thành một hàng cố định trên ảnh chia sẻ.
 *
 * Khai tay, vì đây là ràng buộc của component chứ không suy ra được từ dữ liệu.
 */
const FIXED_LISTS = [
  'hero.chapters',
  'og.facts',
  // Thứ tự dịch vụ KHÔNG phải một danh sách chữ để gõ: phần tử của nó là mã
  // dịch vụ, gõ sai một chữ là mất một dịch vụ khỏi trang. Màn CMS có chỗ sắp
  // xếp riêng cho nó — xem `serviceOrder` ở dưới.
  'services.order',
];

function lam_phang(
  nut: unknown,
  tien_to: string,
  ra: Record<string, string>,
  oSo: Set<string>,
): void {
  if (typeof nut === 'string') {
    ra[tien_to] = nut;
    return;
  }
  // Số LÀ nội dung: '425 chuyến mỗi ngày', '34 tỉnh thành', '26.000 m² kho' là
  // những con số kinh doanh, đổi theo thời gian, và trước đây phải deploy lại
  // mới sửa được. Gửi đi dưới dạng chuỗi, kèm tên ô trong `numberFields` để
  // hai phía biết đường chặn: chỉ nhận chữ số, và lúc trộn vào từ điển thì
  // chuyển ngược về số — một ô số bị ghi thành chuỗi là một trang hỏng.
  if (typeof nut === 'number' && Number.isFinite(nut)) {
    ra[tien_to] = String(nut);
    oSo.add(tien_to);
    return;
  }
  if (Array.isArray(nut)) {
    nut.forEach((con, i) => lam_phang(con, `${tien_to}.${i}`, ra, oSo));
    return;
  }
  if (typeof nut === 'object' && nut !== null) {
    for (const [k, v] of Object.entries(nut)) {
      lam_phang(v, tien_to ? `${tien_to}.${k}` : k, ra, oSo);
    }
  }
  // Boolean rơi xuống đây và bị bỏ qua có chủ ý: đó là cấu hình, không phải
  // nội dung, và không có chỗ nào trên trang để người sửa nhìn thấy nó.
}

export async function GET(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const raw = searchParams.get('locale') ?? 'vi-vn';
  const locale = isLocale(raw) ? raw : 'vi-vn';

  /* `getBaseContent` chứ không phải `getDictionary`: bản mặc định phải bao
     gồm cả dịch vụ người dùng tự thêm, nếu không màn Nội dung không có ô nào
     cho dịch vụ mới — đúng thứ người ta vừa thêm xong đi tìm. */
  const goc = await getBaseContent(locale);
  const phang: Record<string, string> = {};
  const oSo = new Set<string>();
  lam_phang(goc, '', phang, oSo);

  const moKhoa = (k: string): boolean =>
    !LOCKED_PREFIXES.includes(k.split('.')[0] ?? '')
    && !DINH_TUYEN.test(k)
    && !THIET_KE_CU.some((r) => r.test(k));
  const fields = Object.fromEntries(Object.entries(phang).filter(([k]) => moKhoa(k)));

  /**
   * Giá trị ĐANG HIỆN trên trang, tức là đã trộn phần ghi đè.
   *
   * `fields` ở trên là bản MẶC ĐỊNH trong code, và màn CMS cần đúng bản đó để
   * biết ô nào đã bị sửa và để nút Khôi phục có cái mà quay về.
   *
   * Nhưng chế độ sửa tại chỗ thì cần bản đang hiện: nó nhận ra ô bằng cách đối
   * chiếu CHỮ TRÊN TRANG với danh mục. Đối chiếu với bản mặc định thì ô nào đã
   * lưu một lần là chữ trên trang không còn khớp nữa — và ô đó thôi sửa tại
   * chỗ được cho tới lần deploy sau, không báo gì cả.
   */
  const phangHienTai: Record<string, string> = {};
  lam_phang(await getContent(locale), '', phangHienTai, new Set<string>());
  const current = Object.fromEntries(
    Object.entries(phangHienTai).filter(([k]) => moKhoa(k)),
  );
  const numberFields = [...oSo].filter(moKhoa).sort();

  /**
   * Mỗi ô thuộc mục nào, và mỗi mục nằm ở trang nào.
   *
   * Gửi kèm để màn CMS không phải đoán: khoá 'services.items.consulting.intro'
   * tự nó không nói cho ai biết nó hiện ở đâu, còn admin thì không có bản đồ
   * các trang của landing.
   */
  /**
   * Nhãn theo ngôn ngữ ĐANG SỬA, không theo ngôn ngữ của người dùng admin.
   *
   * Bấm sang tab Tiếng Anh là đang làm việc trong tiếng Anh: chữ trong ô là
   * tiếng Anh, khung xem trước là trang tiếng Anh, nên nhãn quanh chúng cũng
   * phải vậy. Khoá nào chưa dịch thì giữ nhãn tiếng Việt — xem content-sections-en.
   */
  const nhan = (
    bang: Record<string, { label: string; hint: string }>,
    khoa: string,
    goc: { label: string; hint: string },
  ): { label: string; hint: string } =>
    locale === 'en-us' ? (bang[khoa] ?? goc) : goc;

  /* Dịch vụ người dùng tự thêm cũng phải có mục và khối trong danh sách bên
     CMS — không thì nó hiện ra trong thư mục Dịch vụ nhưng bấm vào không có ô
     nào, đúng cái trang người ta vừa tạo để viết. */
  const dichVuThem = Object.entries(goc.services.items)
    .filter(([, e]) => !!e.slug)
    .map(([key, e]) => ({ key, ten: e.name, slug: e.slug as string }));
  const khoiThem = dichVuThem.map((d) => khoiDichVuThem(d.key, d.ten, d.slug));
  const trangThem = dichVuThem.map((d) => trangDichVuThem(d.key, d.ten, d.slug));
  const moiKhoi = [...CONTENT_SECTIONS, ...khoiThem];
  const moiTrang = [...CONTENT_PAGES, ...trangThem];

  const sections = moiKhoi.map((m) => ({
    prefix: m.prefix,
    ...nhan(MUC_EN, m.prefix, m),
    path: m.path(locale),
    pages: m.pages,
    /* Ô MƯỢN: hiện trong khối này nhưng lưu ở chỗ khác — xem `khoaMuon` trong
       lib/content-sections.ts. Lọc theo `fields` để một ô đã bị ẩn (thiết kế
       cũ) không sống lại qua đường này. */
    khoaMuon: (m.khoaMuon ?? []).filter((k) => k in fields),
  }));

  /**
   * Các TRANG của landing, mỗi trang kèm những khối nằm trên nó.
   *
   * Đây mới là thứ hiện trong danh sách bên trái màn CMS. Trước đây danh sách
   * đó là 34 khối, và người biên tập phải tự biết "Đội xe" nằm ở trang nào.
   * Họ nghĩ theo trang: mở trang Kho bãi ra, sửa những gì thấy trên đó.
   *
   * Một khối nằm được ở nhiều trang, nên tổng số ô của các trang cộng lại LỚN
   * HƠN tổng số ô — cố ý: khối "Vì sao chọn BeeOps" thật sự hiện ở cả mười
   * trang, và giấu nó đi ở chín trang là nói dối về trang đó có gì.
   */
  const pages = moiTrang.map((t) => ({
    key: t.key,
    ...nhan(TRANG_EN, t.key, t),
    path: t.path(locale),
    preview: t.preview ?? 'page',
    sections: moiKhoi.filter((m) => m.pages.includes(t.key)).map((m) => m.prefix),
  }));

  /**
   * Những danh sách cho phép THÊM, BỚT và ĐỔI THỨ TỰ.
   *
   * Mọi mảng toàn chuỗi trong từ điển, trừ khối bị khoá và những mảng có số
   * lượng cố định ở trên. Màn CMS dựa vào đây để biết chỗ nào hiện nút Thêm —
   * đoán thì sẽ mời người dùng thêm vào đúng chỗ không nhận thêm.
   */
  const editableLists: string[] = [];
  (function timMang(nut: unknown, tien_to: string): void {
    if (Array.isArray(nut)) {
      if (nut.length > 0 && nut.every((x) => typeof x === 'string')) {
        if (moKhoa(tien_to) && !FIXED_LISTS.includes(tien_to)) editableLists.push(tien_to);
        return;
      }
      nut.forEach((con, i) => timMang(con, `${tien_to}.${i}`));
      return;
    }
    if (typeof nut === 'object' && nut !== null) {
      for (const [k, v] of Object.entries(nut)) timMang(v, tien_to ? `${tien_to}.${k}` : k);
    }
  })(goc, '');
  editableLists.sort();

  /**
   * Danh sách chứa ĐỐI TƯỢNG cũng cho thêm, bớt và đổi thứ tự.
   *
   * Gửi kèm tên các ô của một mục, vì màn CMS phải dựng đúng ngần ấy ô cho
   * mỗi dòng — mảng chuỗi thì một dòng là một ô, ở đây thì không.
   *
   * Chỉ những danh sách đã khai tay ở lib/editable-lists.ts — xem giải thích
   * vì sao không mở cho mọi mảng đối tượng ở chính file đó.
   */
  const objectLists = OBJECT_LISTS.filter((d) => moKhoa(d.prefix)).map((d) => ({
    prefix: d.prefix,
    fields: d.fields,
    // Ô nào là công tắc: màn CMS cần biết để vẽ ra công tắc thay vì ô gõ chữ.
    toggles: d.toggles ?? [],
  }));

  /**
   * Chín dịch vụ, theo đúng thứ tự đang hiển thị và kèm tên đọc được.
   *
   * Màn CMS cần cả hai để dựng thư mục Dịch vụ: thứ tự để xếp, tên để hiện —
   * hiện 'consulting' thì người biên tập phải tự đoán đó là dịch vụ nào.
   */
  const dict = goc;
  const serviceOrder = thuTuDichVu(dict).map((key) => ({
    key,
    name: dict.services.items[key].name,
    /** Khoá của chính cái tên đó, để màn CMS sửa ngay tại chỗ. */
    nameKey: `services.items.${key}.name`,
  }));

  /**
   * Thư mục "Dịch vụ" bên admin gồm những mục nào, theo đúng thứ tự đang hiện.
   *
   * KHÁC với `serviceOrder` ở trên, và phải khác: danh sách này là thứ người
   * đọc thấy trong mục Dịch vụ trên trang — bỏ dịch vụ đã có trang riêng, thêm
   * Kho bãi. Còn `serviceOrder` là chín dịch vụ theo nghĩa nghiệp vụ, thứ mà ô
   * chọn trong form báo giá và backend dùng. Để màn admin tự ghép lấy thì nó
   * phải chép lại luật ghép, và luật đó sẽ lệch với landing ngay lần sau.
   */
  /**
   * Mọi đoạn URL đang bị chiếm ở ngôn ngữ này — trang cấp một, dịch vụ đứng
   * riêng, và cả dịch vụ nằm trong mục Dịch vụ.
   *
   * Gửi sang để màn quản trị chặn TRƯỚC khi gọi backend: backend chỉ biết các
   * dịch vụ tự thêm, nó không biết 'lien-he' hay 'kho-bai' đã là trang. Landing
   * mới là nơi biết đủ đường dẫn của chính nó — chép danh sách đó sang backend
   * là tạo bản sao thứ hai, và nó lệch ngay lần đầu landing thêm một trang.
   */
  const reservedSlugs = [
    /* Trang ký điện tử: không nằm trong bảng đường dẫn vì nó không phải một
       trang nội dung — nhưng vẫn chiếm chỗ `/vi-vn/ky/...`, nên một dịch vụ
       đặt đường dẫn 'ky' sẽ bị route tĩnh nuốt mất và không ai hiểu vì sao. */
    DUONG_DAN_KY,
    ...allPagePaths()
      .filter((p) => p.locale === locale)
      .map((p) => p.slug),
    ...allServicePaths()
      .filter((p) => p.locale === locale)
      .map((p) => p.service),
    ...Object.values(dict.services.items)
      .map((e) => e.slug)
      .filter((x): x is string => !!x),
  ].sort();

  const serviceFolder = danhSachDichVu(dict, locale).map((m) => ({
    key: m.key,
    name: m.name,
    nameKey: khoaTenMuc(m.key),
    /** Mục nội dung tương ứng, để bấm vào là mở đúng trang. */
    pageKey: khoaTrangMuc(m.key),
  }));

  /**
   * Biểu tượng mạng xã hội, gửi cho riêng màn CMS.
   *
   * Hàng biểu tượng chỉ hiện khi có địa chỉ, nên lúc người sửa vừa gõ địa chỉ
   * đầu tiên thì trên trang CHƯA CÓ gì để đắp bản nháp vào. Khung xem trước
   * phải tự dựng hàng đó, và muốn dựng thì phải có hình vẽ.
   *
   * Đi qua cửa này chứ không nhét vào mã chạy của trang: gửi kèm ở đây thì chỉ
   * màn CMS tải, còn khách thật không phải tải mấy hình vẽ họ không nhìn thấy.
   */
  const socialIcons = SOCIAL_KEYS.map((key) => ({
    key,
    label: SOCIAL_LABELS[key],
    icon: SOCIAL_ICONS[key],
  }));

  const fieldSection: Record<string, string> = {};
  for (const k of Object.keys(fields)) {
    const m = sectionForKey(k, khoiThem);
    if (m) fieldSection[k] = m.prefix;
  }

  /**
   * Ô ảnh không nằm trong từ điển (ảnh mặc định là file trong repo) nên phải
   * liệt kê riêng, kèm hai thứ màn CMS không tự biết được:
   *
   * * `section` — mục nào chứa nó, để ảnh xếp chung với chữ của cùng khối.
   * * `defaultUrl` — địa chỉ tấm ảnh đang dùng khi chưa ai thay. Thiếu nó thì
   *   thẻ ảnh chỉ là một ô xám ghi "đang dùng ảnh mặc định", và người sửa phải
   *   mở trang thật ra dò xem đó là tấm nào.
   */
  const images = IMAGE_SLOTS.map(({ slot, label, usage, section, fallback }) => ({
    slot,
    label,
    usage,
    section,
    defaultUrl: fallback.src,
  }));

  /* Dịch vụ người dùng tự thêm cũng có một ô ảnh, dù không tấm nào nằm sẵn
     trong mã nguồn: ảnh mặc định là ảnh chung của trang dịch vụ, và người dùng
     thay bằng ảnh riêng ở đây. Không khai ra thì thẻ dịch vụ mới trên trang chủ
     mãi mãi mang tấm ảnh chung, không có chỗ nào để đổi. */
  const anhChung = IMAGE_SLOTS.find((x) => x.slot === 'serviceIntroBg');
  for (const [key, e] of Object.entries(goc.services.items)) {
    if (!e.slug || !anhChung) continue;
    images.push({
      slot: `service.${key}`,
      label: `Ảnh dịch vụ — ${e.name}`,
      usage: 'Trang chủ (thẻ dịch vụ) và trang dịch vụ tương ứng',
      section: `services.items.${key}`,
      defaultUrl: anhChung.fallback.src,
    });
  }

  return NextResponse.json(
    {
      locale,
      fields,
      current,
      numberFields,
      editableLists,
      objectLists,
      serviceOrder,
      serviceFolder,
      reservedSlugs,
      socialIcons,
      images,
      pages,
      sections,
      fieldSection,
    },
    {
      headers: {
        // KHÔNG cache: `current` đổi mỗi lần có người lưu, và một bản cũ nằm
        // trong cache trình duyệt nghĩa là ô vừa sửa thôi bấm được — đúng cái
        // lỗi mà `current` sinh ra để chữa.
        'Cache-Control': 'no-store',
      },
    },
  );
}
