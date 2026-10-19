import type { Dictionary } from '@/lib/i18n';
import {
  SOCIAL_ICONS,
  SOCIAL_KEYS,
  SOCIAL_LABELS,
  diaChiMangXaHoi,
  kenhDangTat,
} from '@/lib/social';

/**
 * Hàng biểu tượng mạng xã hội ở chân trang.
 *
 * Kênh nào chưa điền địa chỉ thì KHÔNG hiện — đó cũng là cách tắt một kênh:
 * xoá trống ô địa chỉ trong CMS. Không kênh nào có địa chỉ thì cả hàng biến
 * mất, chứ không để lại một khoảng trống hay một hàng nút chết.
 */
export function SocialLinks({ dict }: { dict: Dictionary }) {
  // Hai cách tắt một kênh, và chúng khác nhau: xoá trống địa chỉ là bỏ hẳn,
  // còn gạt công tắc là tạm ẩn mà vẫn giữ địa chỉ — xem kenhDangTat.
  const tat = kenhDangTat(dict.social.off);
  const kenh = SOCIAL_KEYS.filter((key) => !tat.has(key))
    .map((key) => ({ key, url: diaChiMangXaHoi(dict.social[key]) }))
    .filter((x): x is { key: (typeof SOCIAL_KEYS)[number]; url: string } => x.url !== null);
  // Luôn dựng cái vỏ <ul>, kể cả khi rỗng — vài chục byte, và không hiện ra
  // với ai. Nó là CHỖ ĐỂ BÁM cho khung xem trước của CMS: gõ địa chỉ Facebook
  // mà hàng biểu tượng chưa có trong trang thì bản nháp không biết đắp vào
  // đâu, và người sửa tưởng mình gõ sai. Xem `cms-draft` ở components/CmsEditor.
  return (
    <ul
      className="social"
      data-cms-social=""
      hidden={kenh.length === 0}
      aria-label={dict.social.label}
    >
      {kenh.map(({ key, url }) => (
        <li key={key}>
          <a
            href={url}
            // Mở tab mới: người đọc đang xem trang này, bấm một kênh ngoài mà
            // mất trang là phải bấm quay lại. `noopener` bắt buộc đi kèm —
            // thiếu nó thì trang vừa mở đọc được window.opener của ta.
            target="_blank"
            rel="noopener noreferrer"
            // Biểu tượng không có chữ, nên phải tự xưng tên cho trình đọc
            // màn hình. Tên thương hiệu, không dịch — xem SOCIAL_LABELS.
            aria-label={SOCIAL_LABELS[key]}
            title={SOCIAL_LABELS[key]}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d={SOCIAL_ICONS[key]} />
            </svg>
          </a>
        </li>
      ))}
    </ul>
  );
}
