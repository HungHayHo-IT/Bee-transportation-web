import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { SignForm } from '@/components/sign/SignForm';
import { backendUrl, isConfigured } from '@/lib/backend';
import { isLocale } from '@/lib/i18n/config';
import { chuTrangKy } from '@/lib/sign';

/**
 * Trang khách ký phiếu xác nhận đơn hàng.
 *
 * KHÔNG cho máy tìm kiếm lập chỉ mục: mỗi đường dẫn mang một mã một lần và
 * trỏ tới giấy tờ của đúng một khách hàng. Một trang như vậy nằm trong kết quả
 * tìm kiếm là chuyện không nên xảy ra, kể cả khi mã đã hết hạn.
 */
export const dynamic = 'force-dynamic';

export function generateMetadata(): Metadata {
  return { robots: { index: false, follow: false } };
}

interface ThongTin {
  maDon: string;
  tenKhach: string;
  dieuKhoan: string;
  trangThai: string;
  kyDuoc: boolean;
  vi?: string;
  emailAn: string;
}

export default async function TrangKy({
  params,
}: {
  params: Promise<{ locale: string; token: string }>;
}) {
  const { locale, token } = await params;
  if (!isLocale(locale) || !isConfigured()) notFound();
  const chu = chuTrangKy(locale);

  const res = await fetch(backendUrl(`/sign/${encodeURIComponent(token)}`), {
    cache: 'no-store',
  });
  if (!res.ok) notFound();
  const body = (await res.json()) as { data?: ThongTin };
  const tt = body.data;
  if (!tt) notFound();

  return (
    <main className="sign">
      <div className="wrap sign__wrap">
        <h1 className="sign__title">{chu.tieuDe}</h1>
        <p className="sign__lead">{chu.dan}</p>

        <dl className="sign__meta">
          <dt>{chu.nhanDon}</dt>
          <dd>{tt.maDon}</dd>
          <dt>{chu.nhanKhach}</dt>
          <dd>{tt.tenKhach}</dd>
        </dl>

        {/* Khung xem phiếu ngay trên trang, kèm đường mở tab mới cho điện thoại
            — nhiều trình duyệt di động không dựng PDF trong iframe. */}
        <iframe className="sign__pdf" src={`/api/ky/${token}/pdf`} title={tt.maDon} />
        <p>
          <a className="sign__link" href={`/api/ky/${token}/pdf`} target="_blank" rel="noreferrer">
            {chu.xemPhieu}
          </a>
        </p>

        <h2 className="sign__h2">{chu.dieuKhoan}</h2>
        <div className="sign__terms">{tt.dieuKhoan}</div>

        {tt.kyDuoc ? (
          <SignForm token={token} chu={chu} emailAn={tt.emailAn} />
        ) : (
          <div className="sign__box">
            <h2>{chu.khongKyDuoc}</h2>
            <p>{tt.vi}</p>
          </div>
        )}
      </div>
    </main>
  );
}
