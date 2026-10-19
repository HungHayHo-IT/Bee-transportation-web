import type { Locale } from './i18n/config';
import { duongDanDichVuThem, pathFor, pathForService } from './routes';
import { HEADER_SERVICE } from './navigation';
import { SERVICE_KEYS, type ServiceKey } from './services';

/**
 * Nội dung của landing, xếp theo ĐÚNG CÁC TRANG mà người sửa nhìn thấy.
 *
 * Hai tầng, và lý do có hai tầng:
 *
 * * TRANG (`ContentPage`) — thứ hiện trong danh sách bên trái màn CMS. Người
 *   biên tập nghĩ theo trang: "sửa trang Kho bãi", "sửa trang chủ". Họ không
 *   nghĩ theo khối, và càng không nghĩ theo nhánh từ điển.
 * * KHỐI (`SectionInfo`) — một mảng nội dung trong trang, dùng để gom các ô
 *   thành cụm có tên khi người sửa mở danh sách ô ra.
 *
 * Một khối CÓ THỂ nằm trên nhiều trang: khối "Vì sao chọn BeeOps" hiện cả ở
 * trang Năng lực lẫn chín trang dịch vụ, tên dịch vụ hiện cả ở thẻ trang chủ
 * lẫn tiêu đề trang dịch vụ. Quan hệ ở đây là NHIỀU-NHIỀU, không phải mỗi khối
 * một trang — ép thành một trang là sẽ có trang thiếu mất nội dung của chính nó.
 *
 * Viết tay, không suy ra được: khối nào nằm ở trang nào là do component quyết
 * định khi nó chọn đọc nhánh từ điển nào.
 */

/** Khoá trang. 'shared' không phải URL mà là nhóm những gì hiện ở MỌI trang. */
export type ContentPageKey =
  | 'nav'
  | 'footer'
  | 'site'
  | 'meta'
  | 'og'
  | 'home'
  | 'capabilities'
  | 'warehousing'
  | 'crossborder'
  | 'blog'
  | 'contact'
  | 'privacy'
  | 'terms'
  | `service.${ServiceKey}`;

export interface SectionInfo {
  /** Tiền tố khoá. Khoá dài hơn vẫn thuộc khối này. */
  prefix: string;
  label: string;
  /** Mô tả ngắn hiện trong CMS: khối này là cái gì trên trang. */
  hint: string;
  /** Những trang có khối này. Một khối nằm được ở nhiều trang. */
  pages: readonly ContentPageKey[];
  /** Đường dẫn trang chứa nó, theo ngôn ngữ đang xem. */
  path: (locale: Locale) => string;
  /**
   * Ô MƯỢN: những khoá hiện trong khối này nhưng được lưu ở chỗ khác.
   *
   * Một ô chỉ thuộc đúng một mục — `sectionForKey` chọn tiền tố dài nhất — nên
   * ô nào hiện ở hai nơi sẽ chỉ sửa được ở một nơi. Thanh điều hướng là ví dụ:
   * nhãn "Vận chuyển quốc tế" là ô `nav.crossborder` của chính nó, nhưng nhãn
   * "Vận chuyển đường bộ" ngay cạnh lại là TÊN DỊCH VỤ
   * (`services.items.domestic.name`) — cố ý, để đổi tên dịch vụ là đổi luôn ở
   * thanh trên, menu, chân trang và thẻ dịch vụ cùng lúc.
   *
   * Hệ quả nếu không có danh sách này: người sửa mở "Thanh điều hướng", thấy
   * hai nhãn nằm cạnh nhau mà chỉ một cái viền cam bấm được, còn cái kia không
   * tìm thấy trong danh sách ô. Đã gặp đúng cảnh đó.
   *
   * Ô mượn KHÔNG bị lấy khỏi mục gốc của nó — nó hiện ở cả hai, cùng sửa một
   * giá trị.
   */
  khoaMuon?: readonly string[];
}

export interface ContentPage {
  key: ContentPageKey;
  label: string;
  hint: string;
  /** Trang mở trong khung xem trước khi chọn mục này. */
  path: (locale: Locale) => string;
  /**
   * Xem trước bằng cách nào.
   *
   * * `page` — nhúng chính trang đó. Mặc định.
   * * `seo` — dựng lại mẩu kết quả Google. Chữ của mục này nằm trong thẻ
   *   <title> và <meta>, KHÔNG hiện ở đâu trên trang, nên nhúng trang vào chỉ
   *   ra một màn trống.
   * * `share` — lấy chính tấm ảnh chia sẻ máy chủ vẽ ra. Cùng lý do: chữ ở đây
   *   được vẽ LÊN ẢNH chứ không nằm trong trang.
   */
  preview?: 'page' | 'seo' | 'share';
}

/** Chín trang dịch vụ, mỗi trang một mục riêng. */
const TRANG_DICH_VU: ContentPage[] = SERVICE_KEYS.map((key) => ({
  key: `service.${key}` as ContentPageKey,
  label: `Trang dịch vụ — ${key}`,
  hint: 'Trang chi tiết của dịch vụ này',
  path: (l: Locale) => pathForService(key, l),
}));

/**
 * Thứ tự hiện trong danh sách: "Dùng chung" lên đầu vì nó hiện ở mọi trang,
 * rồi đến các trang theo đúng thứ tự người đọc đi qua site.
 */
export const CONTENT_PAGES: ContentPage[] = [
  // Năm mục đầu hiện ở MỌI trang, nên chúng đứng riêng thay vì nhét vào một
  // trang nào đó: sửa thanh điều hướng là sửa cho cả site, và gộp nó vào
  // "Trang chủ" sẽ khiến người ta tưởng chỉ đổi mỗi trang chủ.
  {
    key: 'nav',
    label: 'Thanh điều hướng',
    hint: 'Hiện ở mọi trang — thanh trên cùng và logo',
    path: (l) => pathFor('home', l),
  },
  {
    key: 'footer',
    label: 'Chân trang',
    hint: 'Hiện ở mọi trang — cột liên kết và dòng bản quyền',
    path: (l) => pathFor('home', l),
  },
  {
    key: 'site',
    label: 'Thông tin công ty',
    hint: 'Tên, email, điện thoại, địa chỉ — hiện ở chân trang, trang Liên hệ và hai trang pháp lý',
    path: (l) => pathFor('contact', l),
  },
  {
    key: 'meta',
    label: 'Thẻ SEO',
    hint: 'Tiêu đề và mô tả hiện trên Google — không hiện ở đâu trên trang',
    path: (l) => pathFor('home', l),
    preview: 'seo',
  },
  {
    key: 'og',
    label: 'Thẻ chia sẻ mạng xã hội',
    hint: 'Chữ trên ảnh hiện khi dán link lên Facebook, Zalo',
    path: (l) => pathFor('home', l),
    preview: 'share',
  },
  {
    key: 'home',
    label: 'Trang chủ',
    hint: 'Hero, giới thiệu, thẻ dịch vụ, đối tác, đội ngũ',
    path: (l) => pathFor('home', l),
  },
  {
    key: 'capabilities',
    label: 'Trang Năng lực',
    hint: 'Đội xe, nâng hạ, theo dõi đơn, vì sao chọn chúng tôi',
    path: (l) => pathFor('capabilities', l),
  },
  {
    key: 'warehousing',
    label: 'Trang Kho bãi',
    hint: 'Toàn bộ trang Kho bãi',
    path: (l) => pathFor('warehousing', l),
  },
  {
    key: 'crossborder',
    label: 'Trang Xuyên biên giới',
    hint: 'Toàn bộ trang Xuyên biên giới',
    path: (l) => pathFor('crossborder', l),
  },
  {
    key: 'blog',
    label: 'Trang Tin tức',
    hint: 'Trang danh sách bài viết',
    path: (l) => pathFor('blog', l),
  },
  {
    key: 'contact',
    label: 'Trang Liên hệ',
    hint: 'Toàn bộ trang Liên hệ, gồm cả biểu mẫu báo giá',
    path: (l) => pathFor('contact', l),
  },
  {
    key: 'privacy',
    label: 'Trang Chính sách bảo mật',
    hint: 'Toàn bộ trang Chính sách bảo mật',
    path: (l) => pathFor('privacy', l),
  },
  {
    key: 'terms',
    label: 'Trang Điều khoản dịch vụ',
    hint: 'Toàn bộ trang Điều khoản dịch vụ',
    path: (l) => pathFor('terms', l),
  },
  ...TRANG_DICH_VU,
];

/** Mọi trang dịch vụ, viết gọn cho những khối hiện ở cả chín trang. */
const MOI_DICH_VU = SERVICE_KEYS.map((k) => `service.${k}` as ContentPageKey);

/** Mọi mục trong danh sách, cho những khối có mặt ở khắp nơi. */
const MOI_TRANG = CONTENT_PAGES.map((t) => t.key);

const MUC: SectionInfo[] = [
  // ---- Dùng chung: hiện ở mọi trang ----
  {
    prefix: 'nav',
    label: 'Thanh điều hướng',
    hint: 'Tên các mục trên thanh trên cùng',
    pages: ['nav'],
    path: (l) => pathFor('home', l),
    // Nhãn của dịch vụ đứng riêng trên thanh — xem HEADER_SERVICE trong
    // lib/navigation.ts. Nó là tên dịch vụ, không phải một ô nav.
    khoaMuon: [`services.items.${HEADER_SERVICE}.name`],
  },
  {
    prefix: 'footer',
    label: 'Chân trang',
    hint: 'Cột liên kết và dòng bản quyền ở chân mọi trang',
    pages: ['footer'],
    path: (l) => pathFor('home', l),
  },
  {
    prefix: 'social',
    label: 'Mạng xã hội',
    hint:
      'Địa chỉ các kênh, hiện thành hàng biểu tượng dưới logo ở chân trang. ' +
      'Để trống một ô là kênh đó không hiện. Nhớ gõ đủ https:// ở đầu.',
    pages: ['footer'],
    path: (l) => pathFor('home', l),
  },
  {
    prefix: 'site',
    label: 'Thông tin công ty',
    hint: 'Tên, email, điện thoại và địa chỉ — hiện ở chân trang, trang Liên hệ và hai trang pháp lý',
    // MỌI trang, vì nó thật sự có mặt ở mọi trang — ít nhất là dưới chân, và
    // nằm hẳn trong thân của vài trang: trang Liên hệ, hai trang pháp lý, và
    // số giấy phép hải quan giữa trang dịch vụ Khai hải quan.
    //
    // Liệt kê từng trang một là chơi trò đuổi bắt: mỗi lần ai đó đặt thêm một
    // dòng thông tin công ty vào đâu đó, dòng ấy lại lặng lẽ không sửa được.
    //
    // Không kéo theo chân trang: vùng chân trang tự khai mình là khối 'footer'
    // nên chọn mục khác vẫn giấu nó đi như thường — xem CmsEditor.
    pages: MOI_TRANG,
    path: (l) => pathFor('contact', l),
  },

  {
    prefix: 'meta',
    label: 'Thẻ SEO',
    hint: 'Tiêu đề và mô tả hiện trên Google — KHÔNG hiện trên trang',
    pages: ['meta'],
    path: (l) => pathFor('home', l),
  },
  {
    prefix: 'og',
    label: 'Thẻ chia sẻ mạng xã hội',
    hint: 'Chữ trên ảnh hiện khi dán link lên Facebook, Zalo — KHÔNG hiện trên trang',
    pages: ['og'],
    path: (l) => pathFor('home', l),
  },

  // ---- Trang chủ ----
  {
    prefix: 'preloader',
    label: 'Màn chờ tải',
    hint: 'Dòng chữ hiện trong lúc video hero đang tải',
    pages: ['home'],
    path: (l) => pathFor('home', l),
  },
  {
    prefix: 'hero',
    label: 'Hero trang chủ',
    hint: 'Năm khung chữ chạy theo video ở đầu trang',
    pages: ['home'],
    path: (l) => pathFor('home', l),
  },
  {
    prefix: 'marquee',
    label: 'Dải chữ chạy',
    hint: 'Dòng chữ trôi ngang dưới hero',
    pages: ['home'],
    path: (l) => pathFor('home', l),
  },
  {
    prefix: 'about',
    label: 'Giới thiệu',
    hint: 'Hai khối giới thiệu công ty',
    pages: ['home'],
    path: (l) => pathFor('home', l),
  },
  {
    prefix: 'partners',
    label: 'Đối tác',
    hint: 'Dải logo đối tác',
    pages: ['home'],
    path: (l) => pathFor('home', l),
  },
  {
    prefix: 'appDownload',
    label: 'Tải ứng dụng',
    hint: 'Mã QR, hai nút Google Play / App Store và ảnh điện thoại — dưới dải đối tác. Mã QR tự sinh từ link; nút chưa có link thì không bấm được',
    pages: ['home'],
    path: (l) => pathFor('home', l),
  },
  {
    prefix: 'homeFaq',
    label: 'Câu hỏi thường gặp',
    hint: 'Các câu hỏi mở/đóng ở trang chủ — thêm, bớt, đổi thứ tự được',
    pages: ['home'],
    path: (l) => pathFor('home', l),
  },
  {
    prefix: 'team',
    label: 'Đội ngũ',
    hint: 'Khối người đại diện',
    pages: ['home'],
    path: (l) => pathFor('home', l),
  },

  // ---- Trang Năng lực ----
  {
    prefix: 'fleet',
    label: 'Đội xe',
    hint: 'Bảng đầu xe và rơ-moóc',
    pages: ['capabilities'],
    path: (l) => pathFor('capabilities', l),
  },
  {
    prefix: 'tracking',
    label: 'Theo dõi đơn',
    hint: 'Khối theo dõi đơn — trang Năng lực và trang dịch vụ Vận chuyển nội địa',
    pages: ['capabilities', 'service.domestic'],
    path: (l) => pathFor('capabilities', l),
  },
  {
    prefix: 'lifting',
    label: 'Nâng hạ',
    hint: 'Khối nâng hạ — trang Năng lực và trang dịch vụ Nâng hạ, di dời',
    pages: ['capabilities', 'service.lifting'],
    path: (l) => pathFor('capabilities', l),
  },
  {
    prefix: 'customs',
    label: 'Hải quan',
    // Đo ra: trang Năng lực KHÔNG dựng khối này (chỉ Đội xe, Nâng hạ, Theo dõi
    // đơn, Vì sao) — để nó ở đó là 18 ô không tìm thấy chỗ nào trên khung.
    hint: 'Khối hải quan — trang dịch vụ Khai báo hải quan',
    pages: ['service.customs'],
    path: (l) => pathForService('customs', l),
  },

  // ---- Khối dùng ở nhiều trang ----
  //
  // Danh sách dưới đây ĐO ra, không suy: nạp từng trang ở chế độ sửa rồi đếm ô
  // theo khối. Suy từ tên khối cho kết quả sai ở ba chỗ — 'customs' tưởng chỉ
  // ở trang Năng lực nhưng còn dựng cả trang dịch vụ Khai hải quan, 'trust'
  // tưởng ở trang chủ nhưng thật ra không hề có ở đó.
  {
    prefix: 'trust',
    label: 'Khối cam kết',
    hint: 'Khối "vì sao chọn chúng tôi" — hiện ở chín trang dịch vụ và trang Kho bãi',
    pages: ['warehousing', ...MOI_DICH_VU],
    path: (l) => pathForService('consulting', l),
  },
  {
    prefix: 'why',
    label: 'Vì sao chọn BeeOps',
    hint: 'Khối lý do trên trang Năng lực',
    pages: ['capabilities'],
    path: (l) => pathFor('capabilities', l),
  },
  {
    prefix: 'process',
    label: 'Quy trình (chưa dùng)',
    // Đo ra: không trang nào dựng nhánh này, và không component nào đọc
    // dict.process. Các bước quy trình thật nằm ở 'services.items.<dịch vụ>'.
    // Giữ lại cho sửa được, nhưng nói thẳng để không ai sửa rồi ngồi đợi.
    hint: 'Hiện KHÔNG trang nào dùng nhánh này. Các bước quy trình thật nằm trong từng mục dịch vụ.',
    pages: [],
    path: (l) => pathFor('capabilities', l),
  },
  {
    prefix: 'services',
    label: 'Khối dịch vụ (phần chung)',
    hint:
      'Tiêu đề khối và nhãn nút của thẻ dịch vụ trên trang chủ. ' +
      'Tên và ảnh của từng dịch vụ nằm ở mục của dịch vụ đó — ' +
      'hoặc bấm thẳng vào thẻ trên trang.',
    pages: ['home', ...MOI_DICH_VU],
    path: (l) => pathFor('home', l),
  },

  // ---- Mỗi trang một khối ----
  {
    prefix: 'warehousing',
    label: 'Nội dung trang Kho bãi',
    hint: 'Toàn bộ chữ và ảnh của trang này',
    pages: ['warehousing'],
    path: (l) => pathFor('warehousing', l),
  },
  {
    prefix: 'crossborder',
    label: 'Nội dung Xuyên biên giới',
    hint: 'Trang Xuyên biên giới, và một phần dựng lại ở trang dịch vụ Hàng quá cảnh',
    pages: ['crossborder', 'service.crossborder'],
    path: (l) => pathFor('crossborder', l),
  },
  {
    prefix: 'blog',
    label: 'Nội dung trang Tin tức',
    hint: 'Tiêu đề và chữ quanh danh sách bài viết',
    pages: ['blog'],
    path: (l) => pathFor('blog', l),
  },
  {
    prefix: 'contact',
    label: 'Nội dung trang Liên hệ',
    hint: 'Chữ trên trang và toàn bộ biểu mẫu báo giá',
    pages: ['contact'],
    path: (l) => pathFor('contact', l),
  },
  {
    prefix: 'legal.privacy',
    label: 'Nội dung Chính sách bảo mật',
    hint: 'Toàn bộ điều khoản của trang này',
    pages: ['privacy'],
    path: (l) => pathFor('privacy', l),
  },
  {
    prefix: 'legal.terms',
    label: 'Nội dung Điều khoản dịch vụ',
    hint: 'Toàn bộ điều khoản của trang này',
    pages: ['terms'],
    path: (l) => pathFor('terms', l),
  },
];

/**
 * Nội dung riêng của một dịch vụ — chỉ liệt kê ở TRANG DỊCH VỤ đó.
 *
 * Thẻ trên trang chủ có mượn hai ô của khối này (tên dịch vụ và mấy gạch đầu
 * dòng ở mặt sau thẻ), nhưng liệt kê cả khối dưới "Trang chủ" là đổ thêm hơn
 * ba trăm ô mà 95% trong đó — vấn đề, quy trình, câu hỏi thường gặp — không
 * hề hiện trên trang chủ. Người mở trang chủ ra sẽ phải lội qua đống đó.
 *
 * Hai ô kia vẫn sửa được ngay trên trang chủ: bấm thẳng vào chữ trên thẻ.
 * Chế độ sửa tại chỗ đối chiếu theo chữ, nó không quan tâm khối nằm ở mục nào.
 */
function khoiDichVu(key: ServiceKey): SectionInfo {
  return {
    prefix: `services.items.${key}`,
    label: `Nội dung dịch vụ — ${key}`,
    hint:
      'Nội dung trang dịch vụ này, và tên của nó trên thẻ ở trang chủ. ' +
      'Xoá trống tên một bước ở khối "Cách chúng tôi triển khai" là bỏ bước đó khỏi trang.',
    pages: [`service.${key}` as ContentPageKey],
    path: (l) => pathForService(key, l),
  };
}

export const CONTENT_SECTIONS: SectionInfo[] = [...MUC, ...SERVICE_KEYS.map(khoiDichVu)];

/* --------------------------------------------------------------------------
   Dịch vụ người dùng tự thêm.

   Chín dịch vụ gốc khai sẵn ở trên vì chúng nằm trong mã nguồn. Dịch vụ tự
   thêm chỉ biết được lúc chạy, nên mục và khối của nó dựng từ chính dữ liệu —
   cùng hình dạng, cùng đường xem trước, chỉ khác nguồn gốc.
   -------------------------------------------------------------------------- */

/** Mục "trang" cho một dịch vụ tự thêm, để nó hiện trong danh sách bên CMS. */
export function trangDichVuThem(key: string, ten: string, slug: string): ContentPage {
  return {
    key: `service.${key}` as ContentPageKey,
    label: `Trang dịch vụ — ${ten}`,
    hint: 'Trang chi tiết của dịch vụ này',
    path: (l: Locale) => duongDanDichVuThem(slug, l),
  };
}

/** Khối nội dung của một dịch vụ tự thêm. */
export function khoiDichVuThem(key: string, ten: string, slug: string): SectionInfo {
  return {
    prefix: `services.items.${key}`,
    label: `Nội dung dịch vụ — ${ten}`,
    hint:
      'Nội dung trang dịch vụ này, và tên của nó trên thẻ ở trang chủ. ' +
      'Xoá trống tên một bước ở khối "Cách chúng tôi triển khai" là bỏ bước đó khỏi trang.',
    pages: [`service.${key}` as ContentPageKey],
    path: (l) => duongDanDichVuThem(slug, l),
  };
}

/**
 * Khối khớp nhất với một khoá: tiền tố dài nhất thắng.
 *
 * `them` là các khối của dịch vụ tự thêm — truyền vào chứ không đọc từ một
 * biến toàn cục, vì danh sách đó chỉ biết được sau một lần gọi mạng.
 */
export function sectionForKey(keyPath: string, them: SectionInfo[] = []): SectionInfo | null {
  let thang: SectionInfo | null = null;
  for (const m of [...CONTENT_SECTIONS, ...them]) {
    if (keyPath === m.prefix || keyPath.startsWith(`${m.prefix}.`)) {
      if (!thang || m.prefix.length > thang.prefix.length) thang = m;
    }
  }
  return thang;
}
