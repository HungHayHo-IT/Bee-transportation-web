# SPEC BÀN GIAO KỸ THUẬT — Hero Scroll Video, beetransportation.vn

**Người nhận:** tech team / Claude Code session
**Ngày:** 08/09/2026
**Phạm vi:** hậu kỳ video + triển khai hero scroll + dọn SEO hero
**Ngoài phạm vi:** sinh ảnh/video bằng AI (đã xong ở khâu khác)

---

## 0. Đọc trước khi bắt đầu

Tài liệu này viết từ phía sản xuất nội dung, **chưa xác minh trực tiếp trên codebase**. Mọi mô tả về hiện trạng site ở Mục 1 là **suy luận từ HTML public**. Việc đầu tiên cần làm là kiểm chứng lại chúng và báo lại nếu sai — đừng code dựa trên giả định trong file này.

Các mục đánh dấu ⚠️ là chỗ tôi biết mình không chắc.

---

## 1. Hiện trạng (cần kiểm chứng)

| Hạng mục | Suy luận | Cần xác nhận |
|---|---|---|
| Nền tảng | ASP.NET, static asset dưới `/wwwroot/resource/...` | ⚠️ Phiên bản .NET, MVC hay Razor Pages |
| Routing đa ngữ | `/vi-vn` và `/en-us` | ⚠️ Cơ chế i18n đang dùng |
| Hero hiện tại | Slider ảnh tĩnh, 2 slide | ⚠️ Thư viện slider nào |
| Asset hero | `Home_1.png`, `Home_2.png`, kèm biến thể `_mb` (mobile) và `_EN` | ⚠️ Đường dẫn chính xác |
| **Vấn đề SEO** | **Toàn bộ chữ hero đang nằm bên trong file PNG** → Google không đọc được | ⚠️ Xác nhận bằng cách xem source |
| Build pipeline | Không rõ | ⚠️ Có bundler không? npm? Hay chỉ script tag? |

---

## 2. Bốn hạng mục công việc

| # | Hạng mục | Phụ thuộc | Ưu tiên |
|---|---|---|---|
| **A** | Dọn SEO hero: chữ từ PNG → HTML | Không | **Làm ngay, độc lập** |
| **B** | Pipeline hậu kỳ video (ffmpeg) | Có đủ 4 file S1–S4 | Cao |
| **C** | Triển khai hero scroll (desktop) | B xong | Cao |
| **D** | Hero mobile (không scrub video) | A xong | Cao |

**A không phụ thuộc gì cả.** Làm trước, deploy trước — thu SEO ngay mà không cần chờ video.

---

## 3. HẠNG MỤC A — Dọn SEO hero

### Vấn đề
Chữ hero đang được nướng vào ảnh PNG. Hệ quả:
- Google không index được thông điệp chính của trang chủ
- Mỗi lần sửa copy phải sửa 4 file ảnh (vi/en × desktop/mobile)
- Screen reader không đọc được
- Không đổi được màu chữ theo scroll (Hạng mục C cần điều này)

### Yêu cầu
1. Tách chữ ra khỏi ảnh, dựng thành DOM thật:
   - `<h1>` cho slogan chính
   - `<p>` cho phụ đề
   - `<a>` cho CTA
2. Chữ lấy từ hệ i18n hiện có, không hard-code
3. Ảnh nền trở thành ảnh **không chữ**
4. Giữ nguyên bố cục thị giác hiện tại — đây là refactor, không phải redesign

### Nội dung chữ

| Khoá | VI | EN |
|---|---|---|
| `hero.h1` | Vận chuyển chuyên nghiệp, Kết nối mọi nơi | Professional Transportation, Connecting Everywhere |
| `hero.sub` | *(lấy từ nội dung hero hiện tại)* | *(idem)* |
| `hero.cta` | Nhận báo giá | Get a Quote |

⚠️ Copy chính xác cần lấy từ marketing, không tự chế.

### Acceptance
- [ ] "View source" thấy được text hero (không cần chạy JS)
- [ ] Đổi copy chỉ cần sửa file i18n, không đụng ảnh
- [ ] Lighthouse SEO không giảm; LCP không tăng
- [ ] Cả `/vi-vn` và `/en-us` đều đúng

---

## 4. HẠNG MỤC B — Pipeline hậu kỳ video

### Input

| File | Nội dung | Thời lượng |
|---|---|---|
| `S1.mp4` | Toàn cảnh xe → tiến sát cửa sau | 5s |
| `S2.mp4` | Cửa container mở | 5s |
| `S3.mp4` | Vật chất tan thành wireframe | 4s |
| `S4.mp4` | Wireframe → luồng sáng → chìm | 4s |
| `K3c.png` | Nền lưới tối — **ảnh nền CSS, không phải frame video** | — |

**Đặc điểm file nguồn (đã đo trên S3/S4):** 1280×720, H.264, container 60fps nhưng nội dung thực **24fps** (97 frame / 4.02s), có audio track AAC thừa, ~2.5MB/giây.

### Bước 1 — Chuẩn hoá

```bash
for f in S1 S2 S3 S4; do
  ffmpeg -i $f.mp4 -an -r 24 -c:v libx264 -crf 18 -pix_fmt yuv420p ${f}_clean.mp4 -y
done
```
Bỏ audio, ép 24fps. CRF 18 vì đây là bản master để grade, chưa phải bản giao.

### Bước 2 — Cắt đuôi 0.25s (trừ S4)

```bash
for f in S1 S2 S3; do
  D=$(ffprobe -v error -show_entries format=duration -of csv=p=0 ${f}_clean.mp4)
  ffmpeg -i ${f}_clean.mp4 -t $(echo "$D - 0.25" | bc) -c copy ${f}_trim.mp4 -y
done
```

### Bước 3 — Grade (làm trong NLE, không phải ffmpeg)

| Việc | Chi tiết |
|---|---|
| LUT chung | Một LUT cho cả 4 đoạn |
| Khớp điểm đen/trắng | Thủ công từng đoạn. **Màu lệch giữa các đoạn là dấu hiệu "AI" rõ nhất** |
| **Sửa nhịp sáng S4** | Đo được: S4 sáng 35 → **48 ở ~2s** → 26. Cú sáng giữa đoạn cao hơn cả frame đầu, ngược nhịp với S3 đang tối dần đều. **Hạ exposure đoạn 1.5–2.5s xuống ~15%** |
| Chuyển S2→S3 | Chênh sáng lớn nhất nằm ở đây (trắng high-key → đen). Kéo dài đoạn tối dần của S2 vào S3, đừng cắt phựt |

### Bước 4 — Nối + cross-dissolve

| Mối nối | Độ dài dissolve |
|---|---|
| S1 → S2 | 3 frame |
| S2 → S3 | 3 frame |
| S3 → S4 | **6 frame** (cả hai đều tối, giấu được nhiều hơn) |

Làm trong NLE. `ffmpeg concat` chỉ nối cứng, không dissolve được.

### Bước 5 — Retime

18s thô → **~14s** (1.3x). Bật optical flow / frame interpolation. Đừng ép nhanh hơn — S3/S4 chỉ 4s, tăng tốc mạnh sẽ thành hối hả.

### Bước 6 — Encode

```bash
# MP4: mọi frame là keyframe (bắt buộc để scrub mượt)
ffmpeg -i hero_graded.mp4 -c:v libx264 -crf 24 -g 1 -keyint_min 1 \
  -sc_threshold 0 -pix_fmt yuv420p -an -movflags +faststart hero_1080.mp4

# WebM VP9
ffmpeg -i hero_graded.mp4 -c:v libvpx-vp9 -crf 32 -b:v 0 -g 1 -an hero_1080.webm

# Poster (frame đầu) + endframe
ffmpeg -i hero_graded.mp4 -frames:v 1 -q:v 2 hero_poster.jpg -y
ffmpeg -sseof -0.1 -i hero_graded.mp4 -frames:v 1 -q:v 2 hero_end.jpg -y
```

> **`-g 1` là bắt buộc.** Không có nó, `video.currentTime` phải giải mã ngược về keyframe gần nhất mỗi lần scrub → giật.

### ⚠️ Ràng buộc dung lượng — vấn đề lớn nhất của hạng mục này

File nguồn hiện ~2.5MB/giây. 18 giây ở mức đó là **~45MB**. Ngân sách là **4MB**.

Cần nén ~11 lần. Thứ tự thử:

| Bước | Cách | Ghi chú |
|---|---|---|
| 1 | `-crf 24` | Điểm khởi đầu |
| 2 | `-crf 26` → `28` | Nội dung tối/trừu tượng (S3, S4) chịu nén tốt. Nội dung sáng có phản chiếu sàn (S1, S2) thì không |
| 3 | Giảm về **1440×810** | Hero hiếm khi cần 1080p đầy đủ |
| 4 | Cắt bớt thời lượng | Rút xuống 10–12s |

**Nếu 4 bước trên vẫn không đạt 4MB:** dừng lại, báo cáo con số thực tế thay vì hạ chất lượng đến mức xấu. 5–6MB với hero đẹp có thể là đánh đổi đúng — nhưng đó là quyết định của product owner, không phải của dev.

### Acceptance
- [ ] Không mối nối nào nhìn ra được ở tốc độ phát thường
- [ ] Không có audio track
- [ ] `ffprobe` xác nhận mọi frame là keyframe
- [ ] Màu đồng nhất giữa 4 đoạn
- [ ] Có đủ: mp4, webm, poster.jpg, end.jpg
- [ ] Báo cáo dung lượng thực tế vs ngân sách 4MB

---

## 5. HẠNG MỤC C — Hero scroll (desktop)

### Kiến trúc

```
┌─ Hero container, pin ~200vh ────────────────┐
│                                              │
│  Layer 0: nền CSS  (K3c.png, tối)           │
│  Layer 1: <video>  scrub theo scroll         │
│           opacity 1 → 0 ở 92–100% scroll     │
│  Layer 2: chữ HTML (h1/p/CTA)                │
│           màu đen → trắng theo scroll        │
└──────────────────────────────────────────────┘
```

### Scroll mapping

| Scroll % | Video | Chữ | Ghi chú |
|---|---|---|---|
| 0–92% | `currentTime` = tiến độ × duration | đen → trắng | Đổi màu chữ ở khoảng 45–60% |
| 92–100% | opacity 1 → 0 | trắng | Lộ nền K3c |
| 100% | ẩn | trắng, CTA hiện rõ | Trạng thái nghỉ |

### Vì sao chữ phải đổi màu
Nền video đi từ **trắng chói** (S1–S2, kho high-key) sang **đen** (S3–S4). Không màu chữ nào đọc được ở cả hai đầu. Chuyển đen → trắng theo scroll, đồng bộ với điểm giao ở khoảng 50%.

⚠️ Nếu bộ nhận diện Bee bắt buộc một màu chữ cố định, báo lại — khi đó phải dùng phương án lớp phủ gradient thay thế, và cần product owner duyệt.

### Yêu cầu kỹ thuật

| Hạng mục | Yêu cầu |
|---|---|
| Thư viện | GSAP ScrollTrigger. Lenis nếu muốn smooth scroll — tuỳ chọn |
| Thẻ video | `muted playsinline preload="auto"` + `poster` |
| Source order | WebM trước, MP4 sau |
| Scrub | `scrub: 0.5` để làm mượt jitter, không scrub cứng |
| LCP | **Poster phải là LCP element.** `fetchpriority="high"`, preload trong `<head>` |
| Reduced motion | `prefers-reduced-motion: reduce` → hiện poster tĩnh, không load video, không pin |
| Cleanup | Kill ScrollTrigger khi rời trang (SPA navigation nếu có) |

### Bẫy đã biết

| Bẫy | Xử lý |
|---|---|
| iOS Safari không tự load video khi chưa tương tác | `preload="auto"` + `playsinline`; nếu vẫn treo, gọi `video.load()` trong `requestIdleCallback` |
| Scrub trước khi metadata sẵn sàng | Chỉ bind ScrollTrigger sau `loadedmetadata` |
| `currentTime` set quá thường xuyên gây giật | Throttle bằng `requestAnimationFrame`, không set trực tiếp trong scroll handler |
| Hero pin làm nhảy layout | Đặt chiều cao container tường minh, không để nó phụ thuộc nội dung |

### Acceptance
- [ ] Cuộn tới/lui đều mượt, không giật, không nhảy
- [ ] Chữ đọc được ở **mọi** vị trí scroll (kiểm ở 0/25/50/75/100%)
- [ ] Video fade ra sạch, lộ nền CSS + CTA
- [ ] LCP ≤ 2,5s (đo bằng Lighthouse, throttle 4G)
- [ ] `prefers-reduced-motion` hoạt động đúng
- [ ] Không lỗi console; không memory leak khi cuộn lên xuống nhiều lần

---

## 6. HẠNG MỤC D — Hero mobile

**Mobile KHÔNG scrub video.**

Lý do: iOS Safari decode video khi scrub rất tốn pin và hay giật. Tải 4MB trước khi hero dùng được trên 4G tại VN là rủi ro thoát trang. Khách hàng B2B logistics chủ yếu quyết định trên desktop.

### Thay thế
- Poster tĩnh (ảnh 9:16, không chữ)
- Parallax CSS 2 lớp
- Chữ animate theo scroll (fade/translate), **không** đổi màu — nền tĩnh nên chỉ cần một màu

### Ngân sách
**≤ 400KB** cho toàn bộ hero mobile.

### Breakpoint
`< 1024px` → mobile treatment. ⚠️ Xác nhận breakpoint hiện có của site trước khi đặt số cứng.

### Acceptance
- [ ] Không request file video nào trên mobile (kiểm tab Network)
- [ ] Tổng asset hero ≤ 400KB
- [ ] LCP mobile ≤ 2,5s
- [ ] Chữ đọc được, CTA bấm được, touch target ≥ 44px

---

## 7. Thứ tự triển khai đề xuất

```
Tuần 1   A (SEO hero)              ← độc lập, deploy được ngay
         B bước 1–2 (chuẩn hoá)    ← khi có đủ S1–S4

Tuần 2   B bước 3–6 (grade, nối, encode)
         D (mobile)                ← chỉ cần poster, làm song song

Tuần 3   C (desktop scroll)
         Đo đạc, tinh chỉnh ngân sách
```

---

## 8. Câu hỏi cần trả lời trước khi code

1. Stack chính xác? (.NET version, view engine, có bundler không)
2. Cơ chế i18n hiện tại — file resource hay database?
3. Breakpoint hiện có của site?
4. Có CDN không? Video 4MB phục vụ từ đâu?
5. Bộ nhận diện có bắt buộc màu chữ hero cố định không? (ảnh hưởng Mục 5)
6. Ai là người duyệt nếu dung lượng không đạt 4MB?

---

## 9. Không làm gì

- Không redesign hero. Đây là thay đổi kỹ thuật, giữ nguyên bố cục thị giác.
- Không dùng localStorage/sessionStorage cho state của hero.
- Không thêm thư viện animation thứ hai. GSAP là đủ.
- Không tự sửa copy marketing. Nếu chữ trong ảnh khó đọc, hỏi, đừng đoán.
- Không tăng ngân sách dung lượng để "cho đẹp". Báo cáo và để product owner quyết.
