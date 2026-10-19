import type { Locale } from '@/lib/i18n/config';
import { lienLacRieng, linkBanDo, nhanNhom, vanPhongHien, type VanPhong } from '@/lib/offices';

export function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" />
    </svg>
  );
}

export function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.4c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.3 0 .7-.2 1l-2.2 2.2z" />
    </svg>
  );
}

export function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z" />
    </svg>
  );
}

export interface NhomVanPhong {
  /** Tên nhóm — `label` của văn phòng: "Trụ sở chính", "Chi nhánh"… */
  label: string;
  offices: VanPhong[];
}

/**
 * Gom văn phòng theo NHÓM (`label`), giữ nguyên thứ tự người biên tập xếp.
 *
 * Chỉ gộp với nhóm ĐỨNG NGAY TRƯỚC: thứ tự trong CMS là thứ tự trên trang, gom
 * nhảy cóc thì đổi chỗ một mục mà nó lại không chạy đi đâu. Mục trống hẳn
 * (không địa chỉ, không thành phố) bị bỏ.
 */
export function gomTheoNhom(offices: readonly VanPhong[]): NhomVanPhong[] {
  const ra: NhomVanPhong[] = [];
  for (const o of offices) {
    if (!o.street.trim() && !o.city.trim()) continue;
    const ten = o.label.trim();
    const cuoi = ra[ra.length - 1];
    if (cuoi && cuoi.label === ten) cuoi.offices.push(o);
    else ra.push({ label: ten, offices: [o] });
  }
  return ra;
}

/**
 * Văn phòng trong cột Liên hệ ở chân trang — cùng kiểu với trang Liên hệ:
 * mỗi văn phòng MỘT dòng "địa chỉ, thành phố", nhãn nhóm in một lần.
 *
 *   TRỤ SỞ CHÍNH
 *   📍 TTC Tower…, Thành phố Hồ Chí Minh
 *   CHI NHÁNH
 *   📍 386 Xô Viết Nghệ Tĩnh…, Đà Nẵng
 *   📍 18 Phạm Hùng…, Hà Nội
 *
 * Bấm địa chỉ là mở Google Maps (tab mới) — xem linkBanDo.
 *
 * Số và email RIÊNG của văn phòng (nếu CMS có điền) nằm trên một dòng nhỏ ngay
 * dưới địa chỉ — một dòng chứ không phải hai, để chi nhánh nào có đủ cả hai
 * cũng chỉ dài thêm một dòng. Trống thì không có dòng đó; hotline và email
 * chung luôn ở cuối cột — xem lienLacRieng.
 *
 * Nhận danh sách ĐẦY ĐỦ (cả mục đã tắt) để khoá CMS của số riêng mang đúng chỉ
 * số trong `site.offices` — số đã định dạng nên phải tự khai data-cms-attr.
 */
export function FooterOffices({ offices, locale }: { offices: readonly VanPhong[]; locale: Locale }) {
  return (
    <>
      {gomTheoNhom(vanPhongHien(offices)).map((n, i) => (
        <div className="footer__group" key={`${i}-${n.label}`}>
          {n.label ? <p className="footer__groupLabel">{nhanNhom(n.label, locale)}</p> : null}
          {n.offices.map((o, j) => {
            const rieng = lienLacRieng(o);
            return (
              <div className="footer__row" key={`${j}-${o.street}-${o.city}`}>
                <PinIcon />
                <div className="footer__office">
                  {/* Hai nút chữ riêng cho đường và thành phố: chế độ sửa của CMS
                      nhận ô theo từng nút chữ, gộp thành một chuỗi là mất sửa tại chỗ. */}
                  <a href={linkBanDo(o)} target="_blank" rel="noopener noreferrer">
                    {o.street.trim()}
                    {o.street.trim() && o.city.trim() ? ', ' : ''}
                    {o.city.trim()}
                  </a>
                  {rieng.phone || rieng.email ? (
                    <span className="footer__officeContact">
                      {rieng.phone ? (
                        <a href={rieng.phone.href}>
                          <PhoneIcon />
                          <span data-cms-attr={`site.offices.${offices.indexOf(o)}.phone`}>
                            {rieng.phone.display}
                          </span>
                        </a>
                      ) : null}
                      {rieng.email ? (
                        <a href={`mailto:${rieng.email}`}>
                          <MailIcon />
                          {rieng.email}
                        </a>
                      ) : null}
                    </span>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </>
  );
}
