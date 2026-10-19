# Trang chủ dạng slide toàn màn hình

Ngày: 2026-09-09. Trạng thái: đang triển khai.

## Yêu cầu
- Mỗi section trang chủ chiếm vừa một màn hình.
- Cuộn là chuyển hẳn sang section kế tiếp, như chuyển slide.
- Nav luôn nổi đè lên trên; trong suốt ở hero, đặc ở các slide còn lại.
- Nội dung slide hiện ra có animation sau khi cuộn tới.

## Thứ tự slide
1. Hero (giữ cơ chế tua video theo cuộn).
2. Giới thiệu, phần 1: câu thành lập công ty và khẩu hiệu "Our best is your best".
3. Giới thiệu, phần 2: ảnh cảng bên trái, đoạn cam kết dịch vụ và ba số liệu bên phải, kèm nút Xem chi tiết.
4. Kêu gọi báo giá, nền ảnh xe tải.
5. Footer.

## Quyết định
- Slide giới thiệu dùng nền sáng, khác toàn bộ site vốn nền tối. Màu riêng khai báo trong `.slide-light`, không đụng token trang.
- Component `AboutIntro` tách riêng khỏi `About` cũ. `About` cũ vẫn phục vụ trang Giới thiệu với nội dung dài và nền tối.
- Marquee, Services, Why tạm ẩn khỏi trang chủ.

## Cơ chế
- CSS scroll-snap, không JavaScript: `html:has(.home-slides){ scroll-snap-type:y mandatory }`.
- Mỗi slide `scroll-snap-align:start`; slide sau hero thêm `scroll-snap-stop:always`.
- Chỉ trang chủ có `main.home-slides`. Trình duyệt không hỗ trợ `:has` cuộn bình thường.
- Footer trên trang chủ cao 100svh, nội dung căn giữa, dòng copyright ghim đáy.
- Hero engine: nav đặc khi vị trí cuộn đã qua hơn nửa màn hình so với cuối hero.

## Animation nội dung
- `Reveal` không dùng được cho slide: nó gắn với vị trí cuộn, mà khi snap xong slide đã lấp đầy màn hình nên animation đã kết thúc trước khi người xem thấy.
- Dùng `InView`, một component nhỏ theo dõi giao cắt. Lớp `is-in` bật tắt theo mỗi lần vào ra nên quay lại slide thì animation chạy lại.
- Nội dung chỉ bị ẩn khi script đã chạy. Nếu bộ theo dõi không báo gì trong 1,2 giây thì tự bỏ ẩn, tránh trường hợp trang không vẽ khiến nội dung mất hẳn.

## Kiểm thử
- Desktop và mobile: cuộn qua cuối hero bám vào slide giới thiệu, cuộn tiếp bám vào slide báo giá rồi footer.
- Nav trong suốt ở hero, đặc ở các slide sau.
- Trang Giới thiệu, Liên hệ không snap, footer chiều cao bình thường.

## Ghi chú slide giới thiệu phần 2
- Ảnh `public/img/about-yard.jpg` hiện là tấm xám giữ chỗ. Ghi đè đúng đường dẫn đó là xong, không phải sửa code.
- Ba số liệu lấy từ `about.stats` đã được công ty xác nhận: 425+ chuyến mỗi ngày, 34 tỉnh thành, 120+ xe và rơ-moóc. Mockup ghi 1.2M+ dặm, 98% đúng hẹn, hỗ trợ 24/7 nhưng đó là số minh hoạ tiếng Anh nên không dùng.
- Nút Xem chi tiết dẫn sang trang Giới thiệu.
