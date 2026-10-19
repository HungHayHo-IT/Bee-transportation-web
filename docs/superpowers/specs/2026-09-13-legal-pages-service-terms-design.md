# Chính sách & điều khoản: chuyển thể từ Bee Logistics sang dịch vụ Bee Transportation

Ngày: 2026-09-13. Trạng thái: đang triển khai.

## Yêu cầu
Bee Transportation là công ty con của Bee Logistics. Lấy bộ chính sách/điều khoản
công ty mẹ đang công bố, chuyển thể thành bản nói về dịch vụ mà Bee Transportation
thực sự cung cấp, dùng trên beetransportation.vn.

Phạm vi đã chốt: **chỉ viết lại hai trang pháp lý hiện có** (`privacy`, `terms`).
Không thêm route, không thêm slug, không đụng `LEGAL_KEYS`.

## Bee Logistics đang công bố gì
Website công ty mẹ không có trang pháp lý ở footer. Thay vào đó là một cụm bốn
quy định vận hành trong mục News:

| Quy định | Nội dung cốt lõi |
|---|---|
| Chính sách bồi thường thiệt hại | Mức bồi thường theo kg/đơn/lần cước, phân theo dịch vụ; 100% trị giá nếu khai giá hoặc mua bảo hiểm; COD tối đa 10 triệu; mất một phần mà sản phẩm còn nguyên thì bồi thường 10% |
| Thời gian toàn trình | Cam kết theo tuyến, cách tính ngày T, loại trừ thiên tai và bất khả kháng, không tính cuối tuần và ngày lễ |
| Đảm bảo an toàn, an ninh | Tiêu chuẩn bao bì (carton từ 5 lớp, xốp từ 30mm, gỗ từ 8mm), niêm phong và seal, quy trình đồng kiểm khi phát hiện bất thường |
| Danh mục hàng cấm | 11 nhóm hàng cấm kèm cơ quan quy định, cộng hàng cấm xuất nhập khẩu theo pháp luật Việt Nam và điều ước quốc tế |

Nguồn:
- https://www.beelogistics.com/news/details/quy-dinh-ve-chinh-sach-boi-thuong-thiet-hai
- https://beelogistics.com/news/details/quy-dinh-thoi-gian-toan-trinh-dich-vu-buu-chinh
- https://beelogistics.com/news/details/qui-dinh-dam-bao-an-toan-trong-cung-ung
- https://beelogistics.com/news/details/danh-muc-hang-cam-van-chuyen-qua-mang-buu-chinh

## Nguyên tắc chuyển thể
Cụm quy định trên viết cho **bưu chính và chuyển phát nhanh**: cước tính theo kg,
có COD, niêm phong bưu kiện bằng seal. Bee Transportation làm **vận tải dự án** —
chín dịch vụ trong `lib/services.ts`, không dịch vụ nào tính theo kg và không có COD.

Vì vậy: **giữ bộ khung bốn chủ đề, thay toàn bộ số liệu bưu chính bằng căn cứ
pháp lý ngành logistics.** Bê nguyên con số theo kg sang sẽ sai bản chất dịch vụ.

| Chủ đề Bee Logistics | Điều tương ứng bên Bee Transportation | Căn cứ thay thế |
|---|---|---|
| Bồi thường theo kg | Giới hạn trách nhiệm | NĐ 163/2017/NĐ-CP Điều 5 |
| Tiêu chuẩn bao bì bưu kiện | Bao bì, đóng kiện, chằng buộc | Dịch vụ `packing` của công ty; ISPM-15 cho hàng xuất |
| Danh mục hàng cấm bưu chính | Hàng hoá không nhận vận chuyển | Danh mục 11 nhóm + NĐ 34/2024/NĐ-CP hàng nguy hiểm |
| Thời gian toàn trình theo tuyến | Thời gian vận chuyển | Giấy phép lưu hành, khung giờ cấm tải, bất khả kháng |

## Căn cứ pháp lý đã xác minh
- **NĐ 163/2017/NĐ-CP Điều 5** — giới hạn trách nhiệm: khách không thông báo trước
  trị giá thì tối đa **500 triệu đồng cho mỗi yêu cầu bồi thường**; đã thông báo thì
  không vượt trị giá đó; tổ chức nhiều công đoạn thì lấy giới hạn của công đoạn cao nhất.
- **Luật Thương mại 2005 Điều 237** — miễn trách nhiệm: lỗi khách hàng, làm theo chỉ
  dẫn của khách hàng, khuyết tật vốn có của hàng hoá, **không nhận được khiếu nại
  trong 14 ngày** kể từ ngày giao hàng, không nhận được thông báo khởi kiện trong 9 tháng.
- **Luật Thương mại 2005 Điều 239** — quyền cầm giữ hàng hoá để đòi nợ đến hạn, phải
  thông báo bằng văn bản; sau **45 ngày** được định đoạt, phần vượt nợ trả lại khách.
- **NĐ 34/2024/NĐ-CP** — hàng nguy hiểm, hiệu lực 15/5/2024: cần giấy phép vận chuyển
  và chứng chỉ huấn luyện an toàn cho người điều khiển, người áp tải, người xếp dỡ.
- **Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15** — thông qua 26/6/2025, hiệu lực
  **01/01/2026**, thay thế Nghị định 13/2023/NĐ-CP.
- **Luật Kế toán 2015** — chứng từ kế toán lưu trữ 10 năm.

### Lỗi thời cần sửa
Comment code tại `lib/i18n/dictionaries/vi.ts` và nội dung điều "Cơ sở xử lý" đang
dẫn **Nghị định 13/2023/NĐ-CP**. Văn bản này đã bị Luật 91/2025/QH15 thay thế từ
01/01/2026. Phải đổi cả comment lẫn nội dung.

## Luồng dữ liệu thật, đọc từ code
Ba chỗ `[CẦN XÁC NHẬN]` trong trang quyền riêng tư không cần đoán — luồng dữ liệu
nằm ngay trong repo:

- `components/QuoteForm.tsx` → `app/api/quote/route.ts` → BeeOps (`lib/backend.ts`).
- Trường gửi đi: `customerName`, `phone`, `email`, `serviceCode`, `note`. Không hơn.
- Route **không forward Cookie** — form công khai luôn ẩn danh, kể cả khi người dùng
  đang đăng nhập trên admin site.
- Hạ tầng: Vercel (`@vercel/analytics`, `@vercel/speed-insights` trong `package.json`),
  máy chủ đặt ngoài Việt Nam.
- Không có CRM bên thứ ba, không có bên quảng cáo nào trong luồng.

Ba chỗ trống được lấp như sau:
- **Thời gian lưu trữ** — 24 tháng với hồ sơ không phát sinh hợp đồng; 10 năm với hồ
  sơ đã ký, theo nghĩa vụ lưu trữ chứng từ kế toán.
- **Ai được tiếp cận** — nhân sự kinh doanh và vận hành; hệ thống điều hành nội bộ
  BeeOps; Vercel với vai trò hạ tầng. Nêu đích danh, không nói chung chung.
- **Đầu mối thực hiện quyền** — `info@beetransportation.vn`, cam kết phản hồi trong 72 giờ.

## Cấu trúc hai trang

### Chính sách quyền riêng tư: 8 điều → 10 điều
Giữ 5 điều cũ, lấp 3 chỗ `[CẦN XÁC NHẬN]`, thêm 2 điều mới:
1. Chúng tôi thu thập dữ liệu gì — sửa cho khớp đúng payload thật
2. Mục đích xử lý — giữ
3. Cơ sở pháp lý — đổi căn cứ sang Luật 91/2025/QH15
4. Thời gian lưu trữ — **lấp**
5. Ai được tiếp cận dữ liệu — **lấp**
6. Chuyển dữ liệu ra nước ngoài — **mới**, nghĩa vụ công bố vì máy chủ đặt ngoài Việt Nam
7. Quyền của bạn — giữ, bổ sung theo luật mới
8. Cách thực hiện quyền của bạn — **lấp**
9. Đo lường truy cập — giữ, nói rõ công cụ không đặt cookie
10. Bảo mật và thay đổi chính sách — **mới**

### Điều khoản: 7 điều → 17 điều
Giữ nguyên slug `dieu-khoan-su-dung` / `terms-of-use`. Chỉ mở rộng tiêu đề thành
"Điều khoản & điều kiện dịch vụ" / "Terms & service conditions".

Nhóm website, giữ nguyên 5 điều cũ:
1. Phạm vi áp dụng
2. Thông tin trên website
3. Yêu cầu báo giá
4. Sở hữu trí tuệ
5. Liên kết tới website khác

Nhóm điều kiện dịch vụ, 11 điều mới cộng 1 điều cũ ở cuối:
6. Thông tin hàng hoá do khách hàng cung cấp
7. Bao bì, đóng kiện và chằng buộc
8. Hàng hoá không nhận vận chuyển
9. Giấy phép lưu hành và phương án vận chuyển
10. Thời gian vận chuyển
11. Giao nhận và đồng kiểm
12. Bảo hiểm và khai giá trị hàng hoá
13. Giới hạn trách nhiệm — **lấp chỗ trống**
14. Miễn trách nhiệm và bất khả kháng
15. Khiếu nại
16. Thanh toán và quyền cầm giữ hàng hoá
17. Luật áp dụng và giải quyết tranh chấp — giữ

## Quyết định
- **Giữ slug.** Đổi slug sẽ phá URL đang chạy và buộc thêm redirect, đổi lấy một
  chút chính xác trong tên đường dẫn. Không đáng.
- **Giữ `draftNotice`.** Người viết không phải luật sư. Nội dung giờ có căn cứ điều
  luật cụ thể nên pháp chế rà nhanh hơn nhiều, nhưng banner phải còn cho tới khi có
  chữ ký. Viết lại banner: bỏ ý "chưa có nội dung", giữ ý "chưa được duyệt".
- **Không còn `[CẦN XÁC NHẬN]` nào.** Mỗi điều hoặc dẫn được điều luật, hoặc đọc
  được từ code. Chỗ nào cần pháp chế quyết thì viết thành cam kết cụ thể của công ty
  để pháp chế sửa số, không để trống cho người đọc nhìn thấy.
- **Viết cả hai ngôn ngữ.** `vi.ts` là bản gốc, `en.ts` dịch sát, cùng số điều và
  cùng thứ tự — `Dictionary` là kiểu chung nên lệch một điều là lỗi biên dịch.
- **Không đụng `components/sections/legal.tsx`.** Cấu trúc `NamedBody[]` hiện tại
  chịu được 17 điều; đây thuần tuý là thay nội dung từ điển.
- `updated` đổi thành 13/09/2026 ở cả bốn chỗ.

## Kiểm chứng
`npm run typecheck` phải sạch — đủ để bắt lệch cấu trúc giữa hai từ điển, vì
`LegalPage` yêu cầu cả hai locale khai đúng bộ trường.
