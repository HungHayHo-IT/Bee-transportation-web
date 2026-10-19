import { networkInterfaces } from 'node:os';

import type { NextConfig } from 'next';

import { DEFAULT_LOCALE } from './lib/i18n/config';

/**
 * Host chứa ảnh CMS, lấy từ S3_PUBLIC_URL_BASE (cùng biến backend dùng để dựng
 * URL công khai). Để trống thì không host ngoài nào được phép — landing chạy
 * bằng ảnh trong repo như trước.
 */
const CMS_IMAGE_HOST = (() => {
  const raw = process.env.CMS_IMAGE_BASE_URL ?? '';
  if (!raw) return null;
  try {
    const u = new URL(raw);
    return { protocol: u.protocol.replace(':', '') as 'http' | 'https', hostname: u.hostname };
  } catch {
    return null;
  }
})();

/**
 * Những origin được phép nhúng landing vào iframe — chỉ màn CMS của admin.
 *
 * Khai qua biến môi trường để mỗi môi trường một địa chỉ mà không phải sửa
 * file này. Mặc định có sẵn localhost:5173 (admin chạy cục bộ) vì thiếu nó thì
 * khung xem trước hỏng ngay trên máy lập trình viên, và lỗi hiện ra là một ô
 * xám không nói gì.
 */
const CMS_ADMIN_ORIGINS = (process.env.CMS_ADMIN_ORIGINS ?? 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

/**
 * Những host được mở trang từ máy khác lúc chạy `next dev` — để thử trên
 * điện thoại hay một máy khác cùng wifi qua http://<IP máy này>:3000.
 *
 * Next 16 chặn mọi origin lạ gọi vào tài nguyên dev, trong đó có websocket
 * HMR. Mở qua IP mà không khai thì socket đó bị trả 403, trang không hydrate:
 * hero đứng mãi ở "Đang tải trải nghiệm hình ảnh… 0%", ảnh và video do JS nạp
 * không bao giờ tới, cuộn từng slide cũng không chạy.
 *
 * Tự lấy mọi địa chỉ IPv4 LAN của máy lúc khởi động, nên đổi wifi hay đổi IP
 * thì chỉ cần chạy lại `npm run dev`. Host khác (tên máy .local, đường hầm)
 * thì thêm qua DEV_ORIGINS, cách nhau bằng dấu phẩy. Chỉ có tác dụng với
 * `next dev`; bản build không đọc tới.
 */
const DEV_ORIGINS = [
  ...Object.values(networkInterfaces())
    .flat()
    .filter((a) => a !== undefined && a.family === 'IPv4' && !a.internal)
    .map((a) => a!.address),
  ...(process.env.DEV_ORIGINS ?? '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean),
];

const nextConfig: NextConfig = {
  allowedDevOrigins: DEV_ORIGINS,

  /**
   * Cùng một tên miền ảnh, nhưng ở dạng MÃ CHẠY ĐỌC ĐƯỢC.
   *
   * `remotePatterns` ở dưới chỉ là danh sách next/image tự kiểm, và cách nó
   * từ chối là NÉM LỖI — một địa chỉ ảnh lạ trong CMS làm hỏng cả trang, trả
   * 500. Lộ tên miền ra đây để lib/image-slots tự lọc trước, và ô ảnh sai thì
   * lặng lẽ quay về ảnh trong mã nguồn thay vì kéo sập trang.
   *
   * NEXT_PUBLIC_ vì Nav và ProcessSlide là component chạy ở trình duyệt.
   */
  env: {
    NEXT_PUBLIC_CMS_IMAGE_HOST: CMS_IMAGE_HOST?.hostname ?? '',
    // Trình duyệt cần danh sách này để chỉ nhận bản nháp từ đúng màn CMS khi
    // trang mở ở TAB MỚI — ở đó không có frame-ancestors nào chặn hộ. Xem
    // laAdminCms ở lib/cms-mode.ts.
    NEXT_PUBLIC_CMS_ADMIN_ORIGINS: CMS_ADMIN_ORIGINS.join(','),
  },
  reactStrictMode: true,

  // Every page on this site is content — nothing is user-specific — so the
  // whole thing prerenders and Vercel serves it from the edge cache. Any page
  // that later needs live CMS data opts out per-route with `revalidate`.
  output: undefined,

  poweredByHeader: false,

  images: {
    /**
     * Ảnh CMS nằm trên S3 của BeeOps, không nằm trong repo, nên phải khai ở
     * đây — next/image từ chối mọi host lạ, và đúng như thế: không khai thì
     * bất kỳ ai ghi được một URL vào DB sẽ biến trình tối ưu ảnh của trang
     * thành một cái proxy tải hộ ảnh từ khắp nơi.
     *
     * Host đọc từ biến môi trường để dev, staging và production mỗi nơi một
     * bucket mà không phải sửa file này.
     */
    remotePatterns: CMS_IMAGE_HOST
      ? [{ protocol: CMS_IMAGE_HOST.protocol, hostname: CMS_IMAGE_HOST.hostname }]
      : [],

    /**
     * Next 16 chỉ nhận những mức chất lượng được khai ở đây; mức lạ bị trả 400
     * chứ không phải làm tròn. Ảnh nền hero yêu cầu quality={72} — xem
     * components/hero/HeroPoster.tsx — nên thiếu 72 trong danh sách này là ảnh
     * lớn nhất của trang chủ hỏng hẳn, mà log chỉ ghi một dòng cảnh báo.
     */
    qualities: [72, 75],

    // Default is WebP alone. AVIF is offered first and WebP kept behind it, so
    // a browser that cannot take AVIF is no worse off than before. The source
    // art here is photographic and heavy, which is where AVIF pays best.
    formats: ['image/avif', 'image/webp'],

    // 420 and 512 on top of the defaults. The service cards are the reason:
    // on a 412px phone at DPR 1.75 a card asks for ~476px, and with 384 and
    // 640 as the only neighbours it rounded up to 640 — which the optimiser
    // caps at the 604px source, so every card shipped its full-size file for
    // a 237px box. PageSpeed put 214 KiB on that. 512 is the candidate that
    // was missing.
    deviceSizes: [420, 512, 640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },

  // The Open Graph card reads the logo mark off disk at render time. File
  // tracing follows imports, and this one is a runtime path rather than an
  // import, so the asset has to be named or the deployed function renders the
  // card with a hole where the logo goes.
  outputFileTracingIncludes: {
    // Every opengraph-image route reads the lockup off disk at module scope —
    // see lib/og.tsx. A route missing from here renders its card without the
    // logo once deployed, and nothing about that fails the build.
    '/[locale]/opengraph-image': ['./public/img/logo-lockup-white.png'],
    '/[locale]/[slug]/opengraph-image': ['./public/img/logo-lockup-white.png'],
    '/[locale]/[slug]/[child]/opengraph-image': ['./public/img/logo-lockup-white.png'],
  },

  // Trailing slashes split URLs into two crawlable variants. Pick one and
  // let Next redirect the other.
  trailingSlash: false,

  async redirects() {
    return [
      // `/` has no content of its own: the site is locale-prefixed, matching
      // the URL shape the previous site already used. A permanent redirect at
      // the edge costs nothing and keeps one canonical home per language.
      {
        source: '/',
        destination: `/${DEFAULT_LOCALE}`,
        permanent: true,
      },
      // The old site's bare aliases, so existing inbound links survive.
      { source: '/vi', destination: '/vi-vn', permanent: true },
      { source: '/en', destination: '/en-us', permanent: true },
      /**
       * Vận chuyển nội địa rời khỏi mục Dịch vụ và lên cấp một. Đường dẫn cũ
       * đã nằm trong sitemap và trong kết quả tìm kiếm từ lâu, nên nó phải
       * chuyển hướng chứ không được 404 — 301 giữ lại thứ hạng đã có.
       */
      {
        source: '/vi-vn/dich-vu/van-chuyen-noi-dia',
        destination: '/vi-vn/van-chuyen-noi-dia',
        permanent: true,
      },
      {
        source: '/en-us/services/domestic-transport',
        destination: '/en-us/domestic-transport',
        permanent: true,
      },
    ];
  },

  async headers() {
    return [
      {
        // Hero footage is content-addressed by filename — a re-encode always
        // ships under a new name — so it can be cached hard and forever.
        source: '/video/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          /**
           * Chống nhúng trang vào iframe của người lạ (clickjacking), nhưng
           * CHỪA đúng màn CMS của BeeOps admin — nó nhúng trang này để người
           * biên tập vừa sửa vừa nhìn.
           *
           * Dùng CSP frame-ancestors chứ không dùng X-Frame-Options: XFO chỉ
           * có DENY và SAMEORIGIN, không khai được danh sách cho phép
           * (ALLOW-FROM đã bị mọi trình duyệt bỏ). Để cả hai thì XFO
           * SAMEORIGIN vẫn chặn, nên phải bỏ hẳn nó — mọi trình duyệt còn được
           * hỗ trợ đều hiểu frame-ancestors.
           */
          {
            key: 'Content-Security-Policy',
            value: `frame-ancestors 'self' ${CMS_ADMIN_ORIGINS.join(' ')}`,
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
          // Cloudflare sits in front of Vercel for DNS. If its proxy is ever
          // switched on, HSTS must already be correct or the first TLS
          // mismatch is cached by browsers.
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
