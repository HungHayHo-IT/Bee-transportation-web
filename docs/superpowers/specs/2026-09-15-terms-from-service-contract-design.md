# Điều khoản dịch vụ: chuyển thể từ hợp đồng mẫu SL01-F01E

Ngày: 2026-09-15. Trạng thái: đã triển khai.

## Yêu cầu
Nghiên cứu `SL01-F01E - Customs clearance & trucking contract - V.doc` và đưa nội
dung vào các trang chính sách, điều khoản của beetransportation.vn.

## Nguồn
Hợp đồng mẫu của Bee Logistics — *Hợp đồng dịch vụ thông quan và vận tải nội địa*,
13 điều, 10 trang, bản sửa gần nhất 03/09/2025. Đây là **hợp đồng mẫu để đàm phán**,
khác về bản chất với bốn quy định bưu chính mà spec 13/09 đã dùng: quy định bưu chính
là văn bản Bee Logistics tự công bố, còn đây là văn bản hai bên ký.

Bản `.doc` là OLE nhị phân; `antiword` phá dấu tiếng Việt (code page 1252). Trích được
bằng Word COM qua PowerShell, đọc `$doc.Paragraphs` rồi ghi UTF-8.

## Vì sao nội dung này hợp với BTN
`customs` là một trong chín dịch vụ tại `lib/services.ts`, và `ORG.customsLicence`
trong `lib/site.ts` là giấy phép đại lý hải quan thật (2569/HQHCM-GSQL). Phần thông
quan của hợp đồng vì thế áp dụng được, không phải bê nội dung của công ty mẹ về cho
một dịch vụ BTN không làm.

## Phạm vi: chỉ trang điều khoản
Hợp đồng thuần thương mại. Điều 9 (bảo mật) là bí mật kinh doanh giữa hai pháp nhân,
không phải dữ liệu cá nhân, nên nó về trang điều khoản chứ không về trang quyền riêng
tư. Trang quyền riêng tư có phạm vi là biểu mẫu báo giá; hợp đồng không chạm vào luồng
đó, nên **trang quyền riêng tư không đổi một chữ**, kể cả ngày `updated`.

## Quyết định về con số
Người dùng chốt: **nêu cơ chế, không đăng số**. Ranh giới áp dụng:

- **Đăng** con số truy được về một điều luật — 500 triệu (NĐ 163/2017 Điều 5), 14 ngày
  (LTM 2005 Điều 237), 45 ngày (LTM 2005 Điều 239). Đây là luật, không phải thế đàm phán.
- **Không đăng** con số do hợp đồng đàm phán, viết thành cơ chế: hạn mức chi hộ
  (10 triệu/lô), hạn mức công nợ (50 triệu), lãi chậm trả (0.05%/ngày), kỳ thanh toán
  (ngày 15 hàng tháng), giờ làm việc (8:00–17:30), và mọi mốc còn để trống trong hợp
  đồng mẫu (`[…ngày]`, `[15 ngày]`, `[30 ngày]`).
- **Tuyệt đối không đăng** số tài khoản ngân hàng ở Điều 6.2 — trang điều khoản công
  khai mà in số tài khoản là mở đường cho lừa đảo chuyển khoản. Thay bằng cam kết
  ngược lại: đổi thông tin tài khoản phải có văn bản ký và đóng dấu hai bên, và công ty
  không bao giờ báo đổi số tài khoản chỉ bằng email hay tin nhắn.

Tên "Beelogistics" trong hợp đồng viết lại thành BEE Transportation, theo tiền lệ
commit `d3c5542`.

## Cấu trúc: 17 → 28 điều, chia 7 nhóm
Danh sách phẳng chịu được 17 điều; 28 thì không, nhất là khi điều 1–5 nói về bản quyền
website còn điều 6–28 nói về trách nhiệm hàng hoá.

`LegalSection extends NamedBody` thêm `group?: string` — điều nào có `group` thì mở
nhóm mới, không có thì nối tiếp nhóm trên. Trang quyền riêng tư không khai `group` nào
nên ra đúng một nhóm không tên, render y như cũ.

**Số điều chạy liên tục 1–28 xuyên các nhóm.** `counter-reset:clause` chuyển từ
`.legal-doc__list` lên `.legal-doc__clauses` bọc ngoài; mỗi nhóm một `<ol>` nhưng dùng
chung một bộ đếm. Nếu để counter-reset ở mỗi list thì trang sẽ có bảy điều số 1, mà
điều khoản thì được viện dẫn bằng số.

Tiêu đề nhóm lấy `<h2>`, nên tên điều hạ xuống `<h3>` — nhưng **chỉ trên trang có
nhóm**, tính bằng `runs.some(run => run.name)`. Trang quyền riêng tư giữ `<h2>` để
không nhảy cóc một cấp heading vô cớ.

| Nhóm | Điều | Nguồn chính |
|---|---|---|
| Điều khoản website | 1–5 | giữ nguyên từ spec 13/09 |
| Dịch vụ và uỷ quyền | 6–7 | Điều 2, Điều 4 |
| Hàng hoá và chứng từ | 8–12 | Điều 3.2, 3.3, 3.9, 3.10 |
| Nhận hàng và giao hàng | 13–17 | Điều 8, Điều 10 |
| Phí và thanh toán | 18–21 | Điều 5, Điều 6, Điều 7 |
| Trách nhiệm và rủi ro | 22–25 | Điều 3.5, 4.7, Điều 11 |
| Quy định chung | 26–28 | Điều 9, Điều 12, Điều 13 |

### Điều mới đáng chú ý
- **Chấp thuận ngầm báo giá** (Điều 5.1b) — để công ty thực hiện dịch vụ là đã chấp
  thuận báo giá. Khách hàng cần biết điều này trước khi im lặng.
- **Phí chi hộ** (Điều 5.2) — cơ chế chi hộ không dùng tiền mặt, có chứng từ hợp lệ.
- **Cảnh báo đổi số tài khoản** (suy ra từ Điều 6.2) — chống lừa đảo.
- **VIAC** (Điều 13) — trọng tài là lựa chọn của nguyên đơn bên cạnh Toà án, tiếng
  Việt, TP.HCM, chung thẩm. Điều cũ chỉ có Toà án.
- **Điều kiện kinh doanh tiêu chuẩn VLA** (Điều 4.7) — bổ sung vào điều giới hạn
  trách nhiệm bên cạnh NĐ 163/2017.

### Bỏ đi
Điều 1 (Định nghĩa) không thành một điều riêng — trên trang công khai, định nghĩa tại
chỗ dễ đọc hơn một điều toàn thuật ngữ ở đầu trang.

## Kiểm chứng
- `npm run typecheck` sạch — `Dictionary` là kiểu chung nên `vi.ts` và `en.ts` lệch một
  điều là lỗi biên dịch.
- `npm run build` sạch, hai trang pháp lý vẫn tiền dựng SSG.
- Dev server: trang điều khoản 28 điều / 7 nhóm ở cả `vi-vn` và `en-us`, heading `h3`,
  số chạy liên tục qua ranh giới nhóm (5 → tiêu đề nhóm → 6). Trang quyền riêng tư
  10 điều, heading `h2`, 0 nhóm, ngày vẫn 13/09/2026. Không có lỗi console. Mobile
  375px đọc được.

## Còn lại
`draftNotice` ở nguyên trên cả hai trang. Nội dung giờ dẫn được điều luật cụ thể nên
pháp chế rà nhanh hơn, nhưng banner chỉ được gỡ khi có chữ ký — và đó là việc của pháp
chế, không phải của lần sửa nội dung sau.
