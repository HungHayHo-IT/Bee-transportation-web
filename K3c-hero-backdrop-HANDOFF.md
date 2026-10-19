# HANDOFF — K3c: Nền chốt Hero (`.hero-backdrop`)

**Dự án:** beetransportation.vn — hero scroll video
**Ngày:** 08/09/2026
**Loại việc:** CSS thuần, không JS, không asset
**Ước lượng:** 2–4 giờ kể cả tinh chỉnh
**Phụ thuộc:** không — làm và merge độc lập được

---

## 1. Việc này là gì

Hero của trang chủ là một video scroll-driven. Ở 92–100% scroll, video mờ dần và lộ ra **một nền tĩnh** — đó là K3c. Đây là trạng thái nghỉ cuối cùng của hero, nơi đặt nút CTA. Phần lớn người dùng sẽ dừng lại và nhìn vào nó.

Bạn xây một `<div>` với class `.hero-backdrop`, nằm dưới cùng trong stack của hero (`z-index: 0`).

```
┌─ Hero container ─────────────────────┐
│  Layer 2: chữ + CTA        z-index 2 │
│  Layer 1: <video>          z-index 1 │  ← mờ dần ở 92–100% scroll
│  Layer 0: .hero-backdrop   z-index 0 │  ← VIỆC CỦA BẠN
└──────────────────────────────────────┘
```

Việc điều khiển scroll và fade video **không** thuộc phạm vi này. Bạn chỉ cần nền tĩnh, đúng thị giác, sẵn sàng để lớp trên phủ lên.

---

## 2. Vì sao là CSS, không phải ảnh

Đã cân nhắc và chốt. Đừng thay bằng `background-image`.

| | Ảnh PNG | CSS |
|---|---|---|
| Dung lượng | 150–400KB | **0 byte, 0 request** |
| Màn 2x/3x | Cần bản @2x, hoặc mờ | Luôn sắc nét |
| Sửa màu/mật độ | Gen lại ảnh | Sửa một biến |

Hero này đang phải nén ~45MB video xuống ngân sách 4MB. Vài trăm KB ở nền tĩnh là khoản tiết kiệm đáng kể.

Nếu trong repo có file `K3c.png` — đó là **tham chiếu thị giác** để bạn nhìn khi code. Không đưa lên production.

---

## 3. Đặc tả thị giác

| Thành phần | Mô tả |
|---|---|
| Nền | Gần đen, hơi ngả lạnh — **không phải `#000` thuần** |
| Lưới | Ô vuông đều, đường 1px, **rất mờ** |
| Chấm | Ở giao điểm lưới, mờ hơn đường một chút |
| Quầng sáng | 2–3 vùng hổ phách khuếch tán mạnh, lệch tâm, **không đối xứng** |
| Vignette | Tối dần ở rìa, dồn mắt vào giữa |

**Nguyên tắc chỉnh duy nhất cần nhớ:**
> Nếu bạn *nhận ra* cái lưới khi liếc qua thì nó đã quá đậm.

Nền này để đặt chữ lên, không phải để nhìn. Khi phân vân giữa hai giá trị opacity, luôn chọn cái mờ hơn.

---

## 4. Token

```css
:root {
  --hero-bg:        #08080A;                    /* nền */
  --hero-grid:      rgba(255, 255, 255, 0.032); /* đường lưới */
  --hero-dot:       rgba(255, 255, 255, 0.075); /* chấm giao điểm */
  --hero-bloom-a:   rgba(217,  83, 30, 0.10);   /* cam thương hiệu #D9531E */
  --hero-bloom-b:   rgba(255, 182, 61, 0.055);  /* hổ phách */
  --hero-cell:      80px;                       /* cạnh ô lưới */
  --hero-dot-size:  1.5px;
}
```

`#D9531E` là màu container trong video. Quầng sáng dùng đúng màu đó để nền nối liền mạch với frame cuối.

---

## 5. Implementation

```css
.hero-backdrop {
  position: absolute;
  inset: 0;
  z-index: 0;
  background-color: var(--hero-bg);
  background-image:
    radial-gradient(circle 420px at 24% 32%, var(--hero-bloom-a), transparent 70%),
    radial-gradient(circle 340px at 76% 66%, var(--hero-bloom-b), transparent 70%),
    radial-gradient(circle 260px at 58% 14%, var(--hero-bloom-b), transparent 70%);
}

/* Lưới + chấm — tách riêng để dễ chỉnh và dễ phủ vignette lên trên */
.hero-backdrop::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image:
    /* chấm ở giao điểm */
    radial-gradient(circle at 50% 50%,
      var(--hero-dot) 0 var(--hero-dot-size),
      transparent calc(var(--hero-dot-size) + 0.5px)),
    /* đường dọc */
    linear-gradient(to right, var(--hero-grid) 1px, transparent 1px),
    /* đường ngang */
    linear-gradient(to bottom, var(--hero-grid) 1px, transparent 1px);
  background-size:
    var(--hero-cell) var(--hero-cell),
    var(--hero-cell) var(--hero-cell),
    var(--hero-cell) var(--hero-cell);
  /* dịch lớp chấm nửa ô để nó rơi đúng giao điểm */
  background-position:
    calc(var(--hero-cell) / -2) calc(var(--hero-cell) / -2),
    0 0,
    0 0;
}

/* Vignette */
.hero-backdrop::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(ellipse 90% 80% at 50% 45%,
    transparent 0%, transparent 45%, rgba(0, 0, 0, 0.55) 100%);
}

/* Mobile: ô nhỏ hơn, lưới mờ hơn nữa */
@media (max-width: 1023px) {
  :root {
    --hero-cell: 48px;
    --hero-grid: rgba(255, 255, 255, 0.022);
    --hero-dot:  rgba(255, 255, 255, 0.05);
  }
}
```

⚠️ **Chưa test trên trình duyệt.** Đây là điểm khởi đầu, không phải code đã chạy. Xem Mục 6.

### Tuỳ chọn: quầng sáng trôi rất chậm

Chỉ thêm nếu product owner muốn nền "sống" một chút.

```css
@keyframes hero-bloom-drift {
  0%, 100% { transform: translate3d(0, 0, 0); }
  50%      { transform: translate3d(2%, -1.5%, 0); }
}

.hero-backdrop { animation: hero-bloom-drift 40s ease-in-out infinite; }

@media (prefers-reduced-motion: reduce) {
  .hero-backdrop { animation: none; }
}
```

Chu kỳ 40s là cố ý — đủ chậm để không ai bắt được nó đang chuyển động, chỉ cảm thấy nền không chết. Nhanh hơn sẽ kéo mắt khỏi CTA.

---

## 6. Chỗ dễ sai nhất: căn chấm vào giao điểm

`background-position` âm nửa ô là mấu chốt. Sai một chút là chấm nằm lệch khỏi giao điểm và nhìn rất bẩn — nhưng ở opacity thật thì gần như không thấy để mà sửa.

**Quy trình căn:**

1. Mở DevTools, tạm đặt:
   ```css
   --hero-grid: rgba(255,255,255,0.6);
   --hero-dot:  rgba(255,255,255,1);
   --hero-dot-size: 3px;
   ```
2. Zoom 400%. Chấm phải nằm **chính giữa** giao điểm hai đường.
3. Lệch thì chỉnh `background-position` của lớp chấm, không chỉnh lớp lưới.
4. Kiểm ở cả hai `--hero-cell`: 80px (desktop) và 48px (mobile).
5. Trả lại giá trị thật.

**Bẫy phụ:** ở màn hình có devicePixelRatio lẻ (1.5x, 2.25x), đường 1px có thể bị render dày mỏng không đều. Chấp nhận được ở opacity này — đừng cố sửa bằng `transform: translateZ(0)` hay hack tương tự, nó sẽ tạo layer thừa.

---

## 7. Điểm khớp với video — không bỏ qua bước này

`.hero-backdrop` lộ ra ngay sau khi video mờ đi. Nếu nó không giống frame cuối của video, người dùng sẽ thấy nền **"nhảy"** — hỏng đúng cái cảm giác liền mạch mà cả hero đang cố tạo ra.

**Cách kiểm:**
1. Lấy `hero_end.jpg` (frame cuối video, do khâu hậu kỳ xuất ra)
2. Screenshot `.hero-backdrop` ở cùng độ phân giải
3. Chồng hai ảnh trong Photoshop, blend mode **Difference**
4. Vùng nào sáng lên = chỗ lệch

Chỉnh `--hero-bg` và vị trí ba quầng sáng cho khớp. Đừng chỉnh lưới — lưới ở video vốn mờ hơn.

> Nếu `hero_end.jpg` chưa có, cứ code theo spec và **đánh dấu việc này là chưa xong**. Đừng coi như đã hoàn thành.

---

## 8. Acceptance

- [ ] Lưới không nhận ra được khi liếc qua; nhìn kỹ mới thấy
- [ ] Chấm rơi **đúng** giao điểm lưới ở cả 80px và 48px
- [ ] Chữ trắng trên nền đạt contrast ≥ 7:1 (WCAG AAA)
- [ ] **Không thêm request nào, không thêm byte ảnh nào**
- [ ] Sắc nét trên màn 2x và 3x
- [ ] Không "nhảy" nền khi video fade out (kiểm bằng Difference — Mục 7)
- [ ] Nếu bật animation: `prefers-reduced-motion: reduce` tắt được
- [ ] Không tạo compositing layer thừa (kiểm tab Layers trong DevTools)

---

## 9. Không làm gì

- Không thay CSS bằng `background-image` — đọc lại Mục 2
- Không thêm thư viện, không thêm JS
- Không dùng `canvas` hay WebGL cho nền tĩnh này
- Không tăng độ đậm lưới "cho dễ nhìn". Nó **được thiết kế để khó nhìn**
- Không đổi màu quầng sáng khỏi `#D9531E` — đó là màu container trong video, đổi là mất mạch
- Không animate gì ngoài quầng sáng ở Mục 5, và chỉ khi được duyệt
