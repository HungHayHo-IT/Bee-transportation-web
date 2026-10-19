# BEE TRANSPORTATION — website

Next.js 16 (App Router) · React 19 · TypeScript · plain CSS.
Song ngữ `/vi-vn` và `/en-us`, toàn bộ prerender tĩnh, deploy trên Vercel với DNS ở Cloudflare.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # prerender toàn site
npm run typecheck  # tsc --noEmit
```

---

## Cấu trúc

```
app/
  [locale]/
    layout.tsx        root layout thật — đặt <html lang>, font, nav, footer, JSON-LD
    page.tsx          trang chủ (hero + tóm lược)
    [slug]/page.tsx   4 trang con, slug bản địa hoá qua lib/routes.ts
    not-found.tsx
  sitemap.ts          sinh từ bảng route, kèm hreflang
  robots.ts           chặn index trên preview deployment
  globals.css         CSS thuần, đã tinh chỉnh quanh hero
components/
  hero/Hero.tsx       markup hero + một lời gọi khởi động engine
  sections/           các section dùng chung giữa trang chủ và trang con
lib/
  hero/engine.ts      engine scrub + route overlay (port từ main.js, thêm teardown)
  hero/timing.ts      mốc thời gian caption theo tiến độ scroll
  i18n/               config, kiểu Dictionary, hai bộ từ điển
  routes.ts           bảng slug theo ngôn ngữ — nguồn duy nhất cho route/meta/hreflang/sitemap
  seo.ts              metadata + structured data
  site.ts             thông tin công ty (không phải copy)
public/video/         v1–v4.mp4, tổng 3.81MB
legacy/               bản tĩnh trước khi port, giữ để đối chiếu
encode-hero.sh        pipeline ffmpeg tái lập 4 clip
```

**Không có middleware.** `/` được `next.config.ts` redirect 308 sang `/vi-vn` ngay ở edge, và
mọi cặp `(locale, slug)` đều nằm trong `generateStaticParams`. Nghĩa là không có một dòng code
nào chạy lúc có request — Vercel phục vụ tất cả từ CDN.

**Thêm một trang** = thêm key vào `PAGE_KEYS` trong `lib/routes.ts`, thêm slug cho cả hai ngôn
ngữ, thêm `meta` vào cả hai từ điển. Routing, nav, footer, hreflang, canonical và sitemap tự
theo. TypeScript sẽ báo lỗi build nếu thiếu bản dịch.

---

## Deploy trên Vercel

1. Import repo. Framework tự nhận diện, không cần đổi build command.
2. Environment Variables — đặt cho **Production** thôi:

   | Key | Value | Scope |
   |---|---|---|
   | `NEXT_PUBLIC_SITE_URL` | `https://beetransportation.vn` | Production |

   Biến này là gốc của canonical, hreflang, sitemap và JSON-LD. Nếu đặt cho cả Preview thì
   các bản preview sẽ tự quảng cáo URL production trong sitemap của chúng. Preview không cần
   biến này: `lib/site.ts` có mặc định, và `app/robots.ts` tự chặn index mọi môi trường khác
   Production dựa trên `VERCEL_ENV`.

3. Node 20+ (`engines` trong package.json đã khai báo).

`vercel.json` chỉ đặt `regions: ["sin1"]` (Singapore) — hiện site không có serverless function
nào nên nó chưa có tác dụng gì, nhưng nếu sau này thêm route handler thì nó sẽ chạy gần người
dùng Việt Nam thay vì ở Mỹ.

Header cache/bảo mật khai báo trong `next.config.ts`, không phải `vercel.json`, để `next dev`
và production hành xử giống nhau. Video được đánh `immutable` một năm — an toàn vì mỗi lần
encode lại đều ra tên file mới.

---

## DNS trên Cloudflare

⚠️ **Để bản ghi ở chế độ DNS only (đám mây xám), không bật proxy (đám mây cam).**

Đây là chỗ hay sai nhất khi ghép Cloudflare với Vercel. Bật proxy nghĩa là:

- **Hai CDN nối tiếp nhau.** Vercel đã là CDN. Cloudflare đứng trước sẽ cache lại bản mà Vercel
  đã cache, nên khi deploy xong Vercel purge cache của nó mà Cloudflare vẫn trả bản cũ.
- **Mất IP thật của khách.** Vercel chỉ thấy IP của Cloudflare, làm hỏng analytics và rate limit.
- **Chứng chỉ có thể không gia hạn được.** Vercel cấp và tự động gia hạn cert qua Let's Encrypt;
  quá trình đó cần truy cập trực tiếp tới domain.

Các bước:

1. Trong Vercel: Project → Settings → Domains, thêm `beetransportation.vn` và `www.beetransportation.vn`.
   Vercel sẽ hiện đúng giá trị bản ghi cần tạo — **dùng giá trị nó hiện**, đừng chép từ tài liệu
   cũ, vì IP apex của Vercel có thay đổi theo thời gian.
2. Trong Cloudflare DNS: tạo bản ghi theo đúng giá trị đó, gạt **Proxy status sang DNS only**.
3. Chọn một tên miền chính. Đề xuất apex `beetransportation.vn`, và để Vercel redirect `www`
   sang nó (cấu hình ngay trong màn hình Domains).
4. **Kiểm tra bản ghi CAA.** Nếu domain đã có CAA chỉ cho phép CA của Cloudflare thì Vercel sẽ
   không cấp được chứng chỉ. Hoặc xoá bản ghi đó, hoặc thêm `letsencrypt.org`:

   ```
   beetransportation.vn.  CAA  0 issue "letsencrypt.org"
   ```

5. Nếu vì lý do nào đó buộc phải bật proxy: SSL/TLS encryption mode **bắt buộc** là
   **Full (strict)**. Để ở Flexible sẽ tạo vòng lặp redirect vô hạn, vì Vercel luôn ép HTTPS.

Cloudflare vẫn hữu ích ở chế độ DNS only: quản lý bản ghi, DNSSEC, email routing. Chỉ là đừng
để nó đứng chắn trước Vercel.

---

## Hero

Engine nằm ở `lib/hero/engine.ts`, port gần như nguyên vẹn từ bản tĩnh. Nó là code mệnh lệnh
điều khiển một vòng `requestAnimationFrame` và ghi thẳng `video.currentTime` — **đừng viết lại
nó thành React state**, sẽ vừa chậm hơn vừa sai. React chỉ render markup rồi gọi
`initHeroEngine` một lần.

Từ 25/09/2026 hero cao đúng **một màn hình** như mọi slide khác, không còn tua phim theo vị trí
cuộn. Phim **tự chạy** một lần tới khung nghỉ có CTA ngay sau khi bốn clip tải xong. Hero không
giữ con lăn: lăn chuột nhanh hay chậm, hoặc bấm ↓, đều sang slide kế như ở mọi slide khác
(`SlidePager` và scroll-snap lo việc đó). Phím **← →** trên bàn phím bước lùi/tiến từng khung
chữ khi hero đang chiếm màn hình — dành cho người muốn xem lại một khung đã trôi qua. Không vẽ
nút nào cho việc này. Tốc độ phim chỉnh bằng `PLAY_RATE` trong engine; một bước phím chạy
nhanh gấp đôi phim (`STEP_RATE`), vì người bấm cần thấy ngay là phím có tác dụng.

Phần mới so với bản tĩnh là hàm dispose. Trang tĩnh không bao giờ unmount nên bản gốc không rò
gì; dưới router thì cùng đoạn code đó sẽ để lại vòng rAF thứ hai và giữ nguyên các clip đã giải
mã. Hàm dispose huỷ vòng lặp, gỡ listener, `abort()` các fetch đang dở, thu hồi blob URL và
tháo `src` khỏi thẻ video.

Đã đo trên bản production: một request cho mỗi clip, tổng đúng 3.81MB; rời trang chủ rồi quay
lại không để lại vòng lặp nào và không nhân đôi tải.

Encode lại video: `./encode-hero.sh` (cần ffmpeg và các file `v*.orig.mp4`). Bản gốc **vẫn nằm
trong git** vì thiếu chúng thì không encode lại được, nhưng `.vercelignore` loại chúng khỏi mỗi
lần deploy — 36MB đó Vercel không cần.

---

## Việc còn treo

Port này **không** đóng các mục còn treo trong `bee-hero-DEV-HANDOFF.md`; xem file đó để biết
danh sách đầy đủ. Ba mục ảnh hưởng trực tiếp tới điểm số của site:

- **Chưa có `hero_poster.jpg`.** Hero vẫn chờ tải xong 3.81MB mới hiện, nên LCP gần như chắc
  chắn chưa đạt mốc 2.5s. Đây là mục đòn bẩy cao nhất còn lại.
- **`prefers-reduced-motion` vẫn tải video.** Spec yêu cầu hiện poster tĩnh và không request
  file video nào; hiện tại vẫn tải đủ rồi mới quyết định chế độ.
- **Mobile vẫn tải video** (ngân sách spec là ≤400KB). Cùng gốc rễ với hai mục trên.

Và một mục về nội dung: **`lib/i18n/dictionaries/en.ts` chưa được marketing duyệt.** Chỉ hai
chuỗi trong đó có nguồn chính thức; phần còn lại là bản dịch làm trong lúc port để cây `/en-us`
render được. Cần rà trước khi mở bản tiếng Anh ra công chúng.
#   B e e - t r a n s p o r t a t i o n - w e b  
 