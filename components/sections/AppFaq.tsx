import Image from 'next/image';
import QRCode from 'qrcode';
import type { ReactNode } from 'react';

import { InView } from '@/components/InView';
import type { Dictionary } from '@/lib/i18n';
import { imageProps } from '@/lib/image-slots';
import { SITE_URL } from '@/lib/site';
import parachute from '@/public/img/app-parachute.png';

/**
 * Khối "Tải ứng dụng" ở trang chủ, dưới dải đối tác — dựng đủ như thiết kế.
 *
 * Mã QR SINH TỪ LINK chứ không phải ảnh tĩnh: mã trong bản thiết kế là mã
 * mẫu trỏ tới một trang lạ. Link lấy theo thứ tự qrUrl → Google Play → App
 * Store → trang web, nên app lên chợ và CMS điền link là mã tự đổi theo. CMS
 * tải ảnh mã riêng thì ảnh đó thắng.
 *
 * Nút cửa hàng chưa có link vẫn hiện (giữ bố cục thiết kế) nhưng không bấm
 * được — là <span>, không phải link chết.
 */
export async function AppDownload({ dict }: { dict: Dictionary }) {
  const c = dict.appDownload;
  const anhQr = Boolean(dict.images?.appQr);
  const qrSvg = anhQr
    ? null
    : await QRCode.toString(c.qrUrl || c.googlePlayUrl || c.appStoreUrl || SITE_URL, {
        type: 'svg', margin: 0, color: { dark: '#000000', light: '#ffffff' },
      });

  return (
    <InView as="section" className="slide-light app-dl">
      <Image src={parachute} alt="" aria-hidden="true" className="app-dl__chute" />
      <div className="wrap app-dl__inner">
        <div className="app-dl__copy">
          <h2 className="app-dl__title">{c.title}</h2>
          <p className="app-dl__lead">{c.lead}</p>
          <div className="app-dl__get">
            {anhQr ? (
              <Image {...imageProps('appQr', dict.images)} alt={c.qrAlt} className="app-dl__qr" />
            ) : (
              <div
                className="app-dl__qr"
                role="img"
                aria-label={c.qrAlt}
                // SVG do thư viện qrcode sinh từ một chuỗi URL — không có HTML người dùng.
                dangerouslySetInnerHTML={{ __html: qrSvg ?? '' }}
              />
            )}
            <div className="app-dl__stores">
              <p className="app-dl__available">{c.available}</p>
              <Store href={c.googlePlayUrl} icon={<PlayIcon />} small="GET IT ON" name="Google Play" />
              <Store href={c.appStoreUrl} icon={<AppleIcon />} small="Download on the" name="App Store" />
            </div>
          </div>
        </div>
        {/* unoptimized: ảnh chụp giao diện app đầy chữ nhỏ, qua bộ nén của
            next/image (chất lượng 75) là chữ nhòe — phục vụ nguyên file. */}
        <Image {...imageProps('appPhone', dict.images)} alt={c.phoneAlt} unoptimized className="app-dl__phone" />
      </div>
    </InView>
  );
}

function Store({ href, icon, small, name }: { href: string; icon: ReactNode; small: string; name: string }) {
  const body = (
    <>
      {icon}
      <span><small>{small}</small>{name}</span>
    </>
  );
  return href ? (
    <a className="app-dl__store" href={href} target="_blank" rel="noopener noreferrer">{body}</a>
  ) : (
    <span className="app-dl__store" aria-disabled="true">{body}</span>
  );
}

/**
 * Câu hỏi thường gặp ở trang chủ. <details> của trình duyệt, không JS — câu
 * trả lời vẫn nằm trong HTML cho máy tìm kiếm. CMS xoá hết câu thì khối ẩn.
 */
export function HomeFaq({ dict }: { dict: Dictionary }) {
  const { title, items } = dict.homeFaq;
  if (!items.length) return null;
  return (
    <InView as="section" className="slide-light home-faq">
      <div className="wrap home-faq__inner">
        <h2 className="home-faq__title">{title}</h2>
        <div className="home-faq__list">
          {items.map((f, i) => (
            <details className="home-faq__item" key={i}>
              <summary>
                <span className="home-faq__q">{f.q}</span>
                <span className="home-faq__toggle" aria-hidden="true" />
              </summary>
              <p className="home-faq__a">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </InView>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 26" width="22" height="24" aria-hidden="true">
      <path d="M1 1.2 13.2 13 1 24.8c-.4-.2-.6-.7-.6-1.2V2.4c0-.5.2-1 .6-1.2Z" fill="#00d7fe" />
      <path d="m17.3 17.1-4.1-4.1 4.1-4.1 4.9 2.8c1.4.8 1.4 2 0 2.7l-4.9 2.7Z" fill="#ffce00" />
      <path d="M17.3 17.1 13.2 13 1 24.8c.5.5 1.2.5 2 .1l14.3-7.8Z" fill="#ff3a44" />
      <path d="M17.3 8.9 3 1.1C2.2.7 1.5.7 1 1.2L13.2 13l4.1-4.1Z" fill="#00f076" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="#fff">
      <path d="M16.4 12.7c0-2.6 2.1-3.8 2.2-3.9-1.2-1.8-3.1-2-3.7-2-1.6-.2-3.1.9-3.9.9-.8 0-2-.9-3.4-.9-1.7 0-3.3 1-4.2 2.6-1.8 3.1-.5 7.7 1.3 10.2.9 1.2 1.9 2.6 3.2 2.6 1.3-.1 1.8-.8 3.3-.8 1.6 0 2 .8 3.4.8 1.4 0 2.3-1.3 3.1-2.5 1-1.4 1.4-2.8 1.4-2.9 0 0-2.7-1-2.7-4.1ZM13.9 5.1c.7-.9 1.2-2 1-3.1-1 0-2.2.7-2.9 1.5-.6.7-1.2 1.9-1 3 1.1.1 2.2-.6 2.9-1.4Z" />
    </svg>
  );
}
