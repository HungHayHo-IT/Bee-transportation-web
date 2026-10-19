/**
 * Trang ký điện tử: khách mở từ đường dẫn trong email, xem phiếu xác nhận đơn
 * rồi ký.
 *
 * Chữ của trang này nằm NGAY TẠI ĐÂY chứ không vào từ điển nội dung chung, và
 * đó là chủ ý: đây là một trang giao dịch, không phải nội dung tiếp thị. Đưa
 * vào từ điển là mở nó cho CMS sửa — mà chữ trên một tờ giấy khách ký vào thì
 * không nên đổi được bằng một cú bấm, trong khi phần thật sự ràng buộc là điều
 * khoản thì đã do backend gửi sang.
 */
import type { Locale } from './i18n/config';

/** Đoạn đường dẫn của trang ký. Cũng nằm trong danh sách slug đã chiếm chỗ. */
export const DUONG_DAN_KY = 'ky';

export interface ChuTrangKy {
  tieuDe: string;
  dan: string;
  nhanDon: string;
  nhanKhach: string;
  xemPhieu: string;
  dieuKhoan: string;
  tenNguoiKy: string;
  tenGoiY: string;
  veChuKy: string;
  veLai: string;
  dongY: string;
  guiMa: string;
  guiLaiMa: string;
  maDaGui: string;
  nhapMa: string;
  xacNhanKy: string;
  tuChoi: string;
  lyDoTuChoi: string;
  guiTuChoi: string;
  dangGui: string;
  xongTieuDe: string;
  xongDan: string;
  tuChoiXong: string;
  thieuChuKy: string;
  thieuTen: string;
  thieuDongY: string;
  khongKyDuoc: string;
  ghiChuPhapLy: string;
}

const VI: ChuTrangKy = {
  tieuDe: 'Xác nhận đơn hàng',
  dan: 'Vui lòng đọc phiếu xác nhận bên dưới. Nếu đồng ý, ký tên và bấm xác nhận.',
  nhanDon: 'Mã đơn',
  nhanKhach: 'Khách hàng',
  xemPhieu: 'Mở phiếu trong tab mới',
  dieuKhoan: 'Điều khoản',
  tenNguoiKy: 'Họ tên người ký',
  tenGoiY: 'Ví dụ: Nguyễn Văn A',
  veChuKy: 'Ký tên vào khung dưới đây',
  veLai: 'Ký lại',
  dongY: 'Tôi đã đọc và đồng ý với phiếu xác nhận cùng điều khoản ở trên.',
  guiMa: 'Gửi mã xác thực',
  guiLaiMa: 'Gửi lại mã',
  maDaGui: 'Đã gửi mã 6 số tới {email}. Mã có hiệu lực 5 phút.',
  nhapMa: 'Mã xác thực',
  xacNhanKy: 'Xác nhận ký',
  tuChoi: 'Tôi không đồng ý',
  lyDoTuChoi: 'Cho chúng tôi biết lý do',
  guiTuChoi: 'Gửi phản hồi',
  dangGui: 'Đang gửi…',
  xongTieuDe: 'Đã ký xong',
  xongDan: 'Cảm ơn Quý khách. Phiếu đã ký được gửi kèm trong email xác nhận.',
  tuChoiXong: 'Đã gửi phản hồi của Quý khách. Nhân viên phụ trách sẽ liên hệ lại.',
  thieuChuKy: 'Vui lòng ký tên vào khung.',
  thieuTen: 'Vui lòng nhập họ tên người ký.',
  thieuDongY: 'Vui lòng tích vào ô đồng ý.',
  khongKyDuoc: 'Không ký được',
  ghiChuPhapLy:
    'Chữ ký điện tử. Hệ thống ghi lại thời điểm, địa chỉ IP và thiết bị dùng để ký.',
};

const EN: ChuTrangKy = {
  tieuDe: 'Confirm your order',
  dan: 'Please read the confirmation sheet below. If you agree, sign and confirm.',
  nhanDon: 'Order',
  nhanKhach: 'Customer',
  xemPhieu: 'Open the sheet in a new tab',
  dieuKhoan: 'Terms',
  tenNguoiKy: 'Full name of signer',
  tenGoiY: 'e.g. Nguyen Van A',
  veChuKy: 'Sign in the box below',
  veLai: 'Sign again',
  dongY: 'I have read and agree to the confirmation sheet and the terms above.',
  guiMa: 'Send verification code',
  guiLaiMa: 'Send a new code',
  maDaGui: 'A 6-digit code was sent to {email}. It is valid for 5 minutes.',
  nhapMa: 'Verification code',
  xacNhanKy: 'Confirm and sign',
  tuChoi: 'I do not agree',
  lyDoTuChoi: 'Tell us why',
  guiTuChoi: 'Send feedback',
  dangGui: 'Sending…',
  xongTieuDe: 'Signed',
  xongDan: 'Thank you. The signed sheet is attached to your confirmation email.',
  tuChoiXong: 'Your feedback has been sent. Your account manager will be in touch.',
  thieuChuKy: 'Please sign in the box.',
  thieuTen: 'Please enter the signer’s full name.',
  thieuDongY: 'Please tick the agreement box.',
  khongKyDuoc: 'Cannot sign',
  ghiChuPhapLy:
    'Electronic signature. The system records the time, IP address and device used to sign.',
};

export function chuTrangKy(locale: Locale): ChuTrangKy {
  return locale === 'en-us' ? EN : VI;
}
