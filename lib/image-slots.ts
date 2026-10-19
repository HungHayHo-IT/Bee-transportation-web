import type { StaticImageData } from 'next/image';

import { SERVICE_PHOTOS } from './service-photos';
import aboutYard from '@/public/img/about-yard.jpg';
import borderBg from '@/public/img/border-bg.jpg';
import contactBg from '@/public/img/back.jpg';
import corridor1 from '@/public/img/corridor-1.jpeg';
import corridor2 from '@/public/img/corridor-2.jpeg';
import corridor3 from '@/public/img/corridor-3.jpeg';
import crossBorderMap from '@/public/img/cross-border-map.png';
import heroPoster from '@/public/img/hero-poster.jpg';
import heroRest from '@/public/img/hero-rest.jpg';
import processTruck from '@/public/img/ic-container.png';
import scopeTruck from '@/public/img/scope-truck.png';
import partnerRoad from '@/public/img/home-section-partner-bg.webp';
import appPhone from '@/public/img/app-phone.png';
import appQr from '@/public/img/app-qr-placeholder.png';
import serviceIntroBg from '@/public/img/service-detail-intro-bg.jpg';
import uspsBg from '@/public/img/warehouse-whybee-bg.webp';
import warehouseBg from '@/public/img/warehouse-bg.jpg';
import warehouseType1 from '@/public/img/warehouse-type-1.jpeg';
import warehouseType2 from '@/public/img/warehouse-type-2.jpeg';
import warehouseType3 from '@/public/img/warehouse-type-3.jpeg';

/**
 * Những tấm ảnh CMS thay được, và ảnh trong code đứng sau mỗi ô.
 *
 * Một nguồn sự thật cho hai phía: component lấy ảnh mặc định ở đây, còn
 * /api/content-schema đọc chính danh sách này để nói cho trang CMS biết có
 * những ô ảnh nào. Khai ở hai nơi là một ngày nào đó CMS hiện một ô không ai
 * đọc tới, hoặc thiếu mất một ô đang hiển thị.
 *
 * KHÔNG có ảnh của băng CTA (cta-truck.jpg): cả khối đó chủ thương hiệu giữ
 * lại, chữ lẫn ảnh — backend cũng chặn khoá ctaBand.
 *
 * Logo KHÔNG có mặt — chủ thương hiệu giữ lại, không mở cho CMS. Gồm cả hai
 * bản mực trên thanh điều hướng và ở chân trang, lẫn biểu tượng tab trình
 * duyệt và logo vẽ trên ảnh chia sẻ. Đổi logo vẫn phải sửa mã nguồn.
 */
export interface ImageSlot {
  /** Khoá lưu trong CMS là `images.<slot>`. */
  slot: string;
  /** Nhãn hiện trên trang CMS. */
  label: string;
  /** Ảnh này đang nằm ở đâu — để người sửa biết mình đang đổi cái gì. */
  usage: string;
  /** Ảnh trong code, dùng khi CMS chưa thay. */
  fallback: StaticImageData;
  /**
   * Mục nội dung chứa ô ảnh này — cùng hệ tiền tố với CONTENT_SECTIONS.
   *
   * Nhờ nó, màn CMS xếp ảnh NGAY TRONG mục chứa chữ của cùng khối: mở "Hero
   * trang chủ" là thấy cả ảnh nền hero lẫn năm khung chữ chạy trên nó. Tách
   * ảnh ra một mục riêng bắt người sửa tự nhớ ảnh nào thuộc khối nào.
   */
  section: string;
  /**
   * Ô này có được vẽ bằng `fill` không.
   *
   * Phải khai vì next/image đòi hai thứ trái ngược nhau: ảnh KHÔNG fill bắt
   * buộc có width/height, còn ảnh fill thì cấm truyền hai cái đó. Ảnh import
   * tĩnh tự mang sẵn kích thước nên chưa bao giờ phải nghĩ tới; ảnh từ CMS chỉ
   * là một URL, không có kích thước nào đi kèm.
   */
  fill: boolean;
}

export const IMAGE_SLOTS: readonly ImageSlot[] = [
  { slot: 'heroPoster', label: 'Ảnh nền hero', usage: 'Trang chủ — khung hình đầu tiên, hiện khi video chưa tải', fallback: heroPoster, fill: false , section: 'hero' },
  { slot: 'heroRest', label: 'Ảnh hero lúc nghỉ', usage: 'Trang chủ — hiện sau khi hiệu ứng chạy xong, và ngay từ đầu với người đã xem', fallback: heroRest, fill: false , section: 'hero' },
  { slot: 'aboutYard', label: 'Ảnh khối giới thiệu', usage: 'Trang chủ — khối "Giải pháp logistics"', fallback: aboutYard, fill: true , section: 'about' },
  { slot: 'partnerRoad', label: 'Ảnh nền khối đối tác', usage: 'Trang chủ — dải đối tác', fallback: partnerRoad, fill: true , section: 'partners' },
  { slot: 'appPhone', label: 'Ảnh điện thoại', usage: 'Trang chủ — khối "Tải ứng dụng"', fallback: appPhone, fill: false , section: 'appDownload' },
  // Ảnh trong code chỉ là khung giữ chỗ, KHÔNG hiện ra trang: chưa tải ảnh thì
  // trang tự sinh mã QR từ link (xem AppDownload).
  { slot: 'appQr', label: 'Mã QR tải ứng dụng', usage: 'Trang chủ — khối "Tải ứng dụng". Chưa tải ảnh thì mã tự sinh từ link QR / link cửa hàng', fallback: appQr, fill: false , section: 'appDownload' },
  { slot: 'contactBg', label: 'Ảnh nền trang liên hệ', usage: 'Trang Liên hệ — khung hình đầu', fallback: contactBg, fill: true , section: 'contact' },
  { slot: 'serviceIntroBg', label: 'Ảnh đầu trang dịch vụ', usage: 'Mọi trang dịch vụ và trang bài viết chưa có ảnh bìa', fallback: serviceIntroBg, fill: true , section: 'services' },
  { slot: 'uspsBg', label: 'Ảnh nền khối cam kết', usage: 'Chín trang dịch vụ và trang Kho bãi', fallback: uspsBg, fill: true , section: 'trust' },
  { slot: 'warehouseBg', label: 'Ảnh đầu trang kho bãi', usage: 'Trang Kho bãi', fallback: warehouseBg, fill: true , section: 'warehousing' },
  { slot: 'warehouseType1', label: 'Kho bãi — loại 1', usage: 'Trang Kho bãi — khối các loại kho', fallback: warehouseType1, fill: true , section: 'warehousing' },
  { slot: 'warehouseType2', label: 'Kho bãi — loại 2', usage: 'Trang Kho bãi — khối các loại kho', fallback: warehouseType2, fill: true , section: 'warehousing' },
  { slot: 'warehouseType3', label: 'Kho bãi — loại 3', usage: 'Trang Kho bãi — khối các loại kho', fallback: warehouseType3, fill: true , section: 'warehousing' },
  // Xe chạy trên vạch ở khối Quy trình. Trước đây là ảnh nền CSS nên CMS không
  // với tới; giờ dựng thành thẻ ảnh thật để thay được như mọi ô khác.
  { slot: 'processTruck', label: 'Xe trên vạch quy trình', usage: 'Trang dịch vụ — khối Cách chúng tôi triển khai', fallback: processTruck, fill: true , section: 'services' },
  // Ảnh bên phải khối Phạm vi dịch vụ (Figma 16/10/2026) — chung cho mọi
  // trang dịch vụ; chữ bên trái thì riêng từng trang.
  { slot: 'scopeTruck', label: 'Ảnh khối phạm vi dịch vụ', usage: 'Trang dịch vụ — khối Phạm vi dịch vụ', fallback: scopeTruck, fill: true , section: 'services' },
  { slot: 'borderBg', label: 'Ảnh đầu trang xuyên biên giới', usage: 'Trang Xuyên biên giới', fallback: borderBg, fill: true , section: 'crossborder' },
  { slot: 'crossBorderMap', label: 'Bản đồ tuyến xuyên biên giới', usage: 'Trang Xuyên biên giới', fallback: crossBorderMap, fill: false , section: 'crossborder' },
  { slot: 'corridor1', label: 'Hành lang vận tải 1', usage: 'Trang Xuyên biên giới', fallback: corridor1, fill: true , section: 'crossborder' },
  { slot: 'corridor2', label: 'Hành lang vận tải 2', usage: 'Trang Xuyên biên giới', fallback: corridor2, fill: true , section: 'crossborder' },
  { slot: 'corridor3', label: 'Hành lang vận tải 3', usage: 'Trang Xuyên biên giới', fallback: corridor3, fill: true , section: 'crossborder' },
  // Chín ảnh dịch vụ: hiện ở thẻ dịch vụ trên trang chủ VÀ ở khối "vấn đề" của
  // chính trang dịch vụ đó — đổi một chỗ là đổi cả hai, đúng như SERVICE_PHOTOS.
  ...Object.entries(SERVICE_PHOTOS).map(([key, img]) => ({
    slot: `service.${key}`,
    label: `Ảnh dịch vụ — ${key}`,
    usage: 'Trang chủ (thẻ dịch vụ) và trang dịch vụ tương ứng',
    fallback: img as StaticImageData,
    fill: true,
    // Ảnh của một dịch vụ nằm trong đúng mục của dịch vụ đó.
    section: `services.items.${key}`,
  })),
];

const THEO_SLOT = new Map(IMAGE_SLOTS.map((s) => [s.slot, s]));

/**
 * Props ảnh cho next/image: bản CMS nếu có, không thì bản trong code.
 *
 * Ảnh trong code mang sẵn blurDataURL tính lúc build nên có hiệu ứng mờ dần khi
 * tải; ảnh từ S3 thì không — next/image không thể tính blur cho một URL bên
 * ngoài lúc dựng trang. Đây là cái giá của việc thay ảnh mà không phải deploy,
 * và nó chỉ áp cho những ô đã bị thay.
 */
/** Đúng phần props ảnh mà hàm dưới trả về, để nơi nhận khai kiểu cho gọn. */
export interface ImageProps {
  src: string | StaticImageData;
  placeholder?: 'blur';
  width?: number;
  height?: number;
  /**
   * Tên ô ảnh, đính thẳng vào thẻ <img>.
   *
   * Đây là thứ cho phép bấm vào một tấm ảnh trên trang là thay được nó. Không
   * có nó thì trình sửa phải ĐOÁN tấm ảnh đó là ô nào bằng cách so địa chỉ —
   * mà next/image viết lại src thành '/_next/image?url=...&w=...', ảnh đã thay
   * thì trỏ sang S3, và một ảnh dùng ở hai chỗ thì so kiểu gì cũng ra hai kết
   * quả. Một thuộc tính vài chục byte, khách không thấy, đổi lại là khớp chắc
   * chắn.
   */
  'data-cms-slot': string;
}

/**
 * Địa chỉ này có dùng được với next/image không.
 *
 * VÌ SAO PHẢI TỰ KIỂM: next/image từ chối một tên miền lạ bằng cách NÉM LỖI,
 * và lỗi đó làm hỏng cả trang — toàn trang trả 500, không chỉ mất một tấm ảnh.
 * Nghĩa là một địa chỉ sai trong CMS đủ để hạ cả landing. Đã gặp thật lúc kiểm
 * thử: lưu một URL ngoài tên miền ảnh, trang chủ 500 ngay.
 *
 * Nên lọc ở đây, nơi còn có ảnh trong mã nguồn để quay về. Mọi thứ không chắc
 * chắn dùng được đều bị loại: địa chỉ hỏng, giao thức lạ, tên miền không khai
 * trong next.config. Mất một tấm ảnh nhẹ hơn mất cả trang rất nhiều.
 */
function dungDuoc(url: string): boolean {
  const mienChoPhep = process.env.NEXT_PUBLIC_CMS_IMAGE_HOST;
  if (!mienChoPhep) return false;
  try {
    const u = new URL(url);
    if (u.protocol !== 'http:' && u.protocol !== 'https:') return false;
    return u.hostname === mienChoPhep;
  } catch {
    return false;
  }
}

/**
 * Ô ảnh mặc định cho dịch vụ người dùng tự thêm.
 *
 * Dịch vụ mới không có ảnh nào nằm sẵn trong mã nguồn, nhưng thẻ dịch vụ trên
 * trang chủ và khối "vấn đề" của trang đó vẫn phải có ảnh. Dùng chung ảnh đầu
 * trang dịch vụ: nó vốn là tấm chung cho mọi trang dịch vụ, nên nhìn không lạc
 * lõng, và người dùng thay bằng ảnh riêng qua màn Nội dung lúc nào cũng được.
 */
const O_ANH_DICH_VU_MAC_DINH = 'serviceIntroBg';

/** Ô ảnh này có phải của một dịch vụ không — 'service.<khoá>'. */
function laODichVu(slot: string): boolean {
  return slot.startsWith('service.');
}

export function imageProps(
  slot: string,
  overrides: Record<string, string> | undefined,
): ImageProps {
  /* Dịch vụ tự thêm chưa có ô ảnh riêng trong mã nguồn. Mượn khung của ảnh
     dùng chung, nhưng VẪN đọc ghi đè theo tên ô của chính nó — nhờ vậy mỗi
     dịch vụ mới đặt được ảnh riêng, không dùng chung một tấm. */
  const dangKy = THEO_SLOT.get(slot)
    ?? (laODichVu(slot) ? THEO_SLOT.get(O_ANH_DICH_VU_MAC_DINH) : undefined);
  // Tra theo TÊN Ô, không phải theo khoá đầy đủ: khoá lưu trong CMS là
  // 'images.aboutYard', nhưng lúc trộn vào từ điển nó nằm ở dict.images.aboutYard
  // — tiền tố 'images.' đã bị dùng làm đường đi và không còn trong tên khoá.
  if (!dangKy) throw new Error(`Ô ảnh chưa khai trong IMAGE_SLOTS: ${slot}`);

  const url = overrides?.[slot];
  if (url && dungDuoc(url)) {
    // Ô không fill phải có kích thước, và kích thước duy nhất biết được là của
    // ảnh trong code. Khai theo nó giữ nguyên khung cũ, nên ảnh mới lệch tỷ lệ
    // thì bị cắt/độn trong đúng cái khung đó chứ không làm xô lệch trang.
    return dangKy.fill
      ? { src: url, 'data-cms-slot': slot }
      : {
          src: url,
          width: dangKy.fallback.width,
          height: dangKy.fallback.height,
          'data-cms-slot': slot,
        };
  }
  return { src: dangKy.fallback, placeholder: 'blur', 'data-cms-slot': slot };
}
