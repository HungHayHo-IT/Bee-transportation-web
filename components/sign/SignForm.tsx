'use client';

import { useEffect, useRef, useState } from 'react';
import type { ChuTrangKy } from '@/lib/sign';

type Buoc = 'ky' | 'tuChoi' | 'xong' | 'daTuChoi';

export interface SignFormProps {
  token: string;
  chu: ChuTrangKy;
  emailAn: string;
}

/**
 * Ô ký, ô mã xác thực và hai lối ra: đồng ý hoặc từ chối.
 *
 * Chữ ký vẽ trên `<canvas>` chứ không dùng thư viện: cả việc này là theo dõi
 * con trỏ và nối các điểm lại, mà một thư viện thì kéo theo bản dựng, bản cập
 * nhật và một lớp API nữa phải đọc.
 *
 * Canvas đặt theo tỉ lệ màn hình thật (`devicePixelRatio`) — không làm vậy thì
 * trên điện thoại nét ký ra răng cưa, và đó chính là thứ sẽ in lên phiếu.
 */
export function SignForm({ token, chu, emailAn }: SignFormProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dangVe = useRef(false);

  const [ten, setTen] = useState('');
  const [dongY, setDongY] = useState(false);
  const [otp, setOtp] = useState('');
  const [daGuiMa, setDaGuiMa] = useState(false);
  const [lyDo, setLyDo] = useState('');
  const [buoc, setBuoc] = useState<Buoc>('ky');
  const [dangGui, setDangGui] = useState(false);
  const [loi, setLoi] = useState('');

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ty = window.devicePixelRatio || 1;
    const r = c.getBoundingClientRect();
    c.width = Math.round(r.width * ty);
    c.height = Math.round(r.height * ty);
    const ctx = c.getContext('2d');
    if (!ctx) return;
    ctx.scale(ty, ty);
    ctx.lineWidth = 2.2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#111827';
  }, []);

  const toaDo = (e: React.PointerEvent<HTMLCanvasElement>): [number, number] => {
    const r = e.currentTarget.getBoundingClientRect();
    return [e.clientX - r.left, e.clientY - r.top];
  };

  const batDau = (e: React.PointerEvent<HTMLCanvasElement>): void => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    // Giữ con trỏ: kéo ra ngoài khung rồi thả thì nét vẫn kết thúc đúng chỗ.
    e.currentTarget.setPointerCapture(e.pointerId);
    dangVe.current = true;
    const [x, y] = toaDo(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const ve = (e: React.PointerEvent<HTMLCanvasElement>): void => {
    if (!dangVe.current) return;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    const [x, y] = toaDo(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const ngung = (): void => {
    dangVe.current = false;
  };

  const xoaNet = (): void => {
    const c = canvasRef.current;
    const ctx = c?.getContext('2d');
    if (!c || !ctx) return;
    ctx.clearRect(0, 0, c.width, c.height);
  };

  /**
   * Khung ký có nét thật hay không — ĐỌC TỪ ẢNH, không tin một cờ đánh dấu.
   *
   * Trước đây chỗ này là một biến `coNet` bật lên khi bắt đầu vẽ. Cờ đó nói
   * "người dùng đã từng vẽ", không nói "lúc này trên khung có nét" — hai điều
   * khác nhau mỗi khi khung bị xoá mà không qua nút Ký lại: trình duyệt thu hồi
   * ngữ cảnh canvas lúc thiếu bộ nhớ, tab bị treo rồi dựng lại, máy xoay màn.
   * Đã gặp đúng cảnh khung trắng mà cờ vẫn bật.
   *
   * Hệ quả nếu tin cờ: khách gửi đi một ô chữ ký TRẮNG, máy chủ nhận PNG hợp lệ
   * nên không chặn, và nó được in vào phiếu — một văn bản ký trông bình thường
   * nhưng chỗ chữ ký trống. Quét điểm ảnh tốn vài mili giây, một lần mỗi lần
   * bấm ký, nên không có lý do gì để đoán thay vì đọc.
   */
  const coNetTrenKhung = (c: HTMLCanvasElement): boolean => {
    const ctx = c.getContext('2d');
    if (!ctx) return false;
    const d = ctx.getImageData(0, 0, c.width, c.height).data;
    for (let i = 3; i < d.length; i += 4) {
      if (d[i] > 0) return true;
    }
    return false;
  };

  const guiMa = async (): Promise<void> => {
    setLoi('');
    setDangGui(true);
    try {
      const r = await fetch(`/api/ky/${token}/otp`, { method: 'POST' });
      const b = (await r.json()) as { error?: { message?: string } };
      if (!r.ok) throw new Error(b?.error?.message ?? chu.khongKyDuoc);
      setDaGuiMa(true);
    } catch (e) {
      setLoi(e instanceof Error ? e.message : chu.khongKyDuoc);
    } finally {
      setDangGui(false);
    }
  };

  const ky = async (): Promise<void> => {
    setLoi('');
    const khung = canvasRef.current;
    if (!khung || !coNetTrenKhung(khung)) return setLoi(chu.thieuChuKy);
    if (ten.trim().length < 2) return setLoi(chu.thieuTen);
    if (!dongY) return setLoi(chu.thieuDongY);

    const anh = khung.toDataURL('image/png');

    setDangGui(true);
    try {
      const r = await fetch(`/api/ky/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp, anhKyBase64: anh, tenNguoiKy: ten.trim() }),
      });
      const b = (await r.json()) as { error?: { message?: string } };
      if (!r.ok) throw new Error(b?.error?.message ?? chu.khongKyDuoc);
      setBuoc('xong');
    } catch (e) {
      setLoi(e instanceof Error ? e.message : chu.khongKyDuoc);
    } finally {
      setDangGui(false);
    }
  };

  const tuChoi = async (): Promise<void> => {
    setLoi('');
    if (lyDo.trim().length < 3) return setLoi(chu.lyDoTuChoi);
    setDangGui(true);
    try {
      const r = await fetch(`/api/ky/${token}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lyDo: lyDo.trim() }),
      });
      const b = (await r.json()) as { error?: { message?: string } };
      if (!r.ok) throw new Error(b?.error?.message ?? chu.khongKyDuoc);
      setBuoc('daTuChoi');
    } catch (e) {
      setLoi(e instanceof Error ? e.message : chu.khongKyDuoc);
    } finally {
      setDangGui(false);
    }
  };

  if (buoc === 'xong') {
    return (
      <div className="sign__done">
        <h2>{chu.xongTieuDe}</h2>
        <p>{chu.xongDan}</p>
      </div>
    );
  }
  if (buoc === 'daTuChoi') {
    return (
      <div className="sign__done">
        <h2>{chu.tuChoi}</h2>
        <p>{chu.tuChoiXong}</p>
      </div>
    );
  }

  if (buoc === 'tuChoi') {
    return (
      <div className="sign__box">
        <label className="sign__label" htmlFor="lyDo">{chu.lyDoTuChoi}</label>
        <textarea
          id="lyDo"
          className="sign__input sign__area"
          value={lyDo}
          onChange={(e) => setLyDo(e.target.value)}
          rows={4}
        />
        {loi ? <p className="sign__err">{loi}</p> : null}
        <div className="sign__row">
          <button type="button" className="sign__btn" disabled={dangGui} onClick={() => void tuChoi()}>
            {dangGui ? chu.dangGui : chu.guiTuChoi}
          </button>
          <button type="button" className="sign__link" onClick={() => setBuoc('ky')}>
            ←
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="sign__box">
      <label className="sign__label" htmlFor="ten">{chu.tenNguoiKy}</label>
      <input
        id="ten"
        className="sign__input"
        value={ten}
        onChange={(e) => setTen(e.target.value)}
        placeholder={chu.tenGoiY}
        autoComplete="name"
      />

      <p className="sign__label">{chu.veChuKy}</p>
      <canvas
        ref={canvasRef}
        className="sign__pad"
        onPointerDown={batDau}
        onPointerMove={ve}
        onPointerUp={ngung}
        onPointerCancel={ngung}
      />
      <button type="button" className="sign__link" onClick={xoaNet}>{chu.veLai}</button>

      <label className="sign__check">
        <input type="checkbox" checked={dongY} onChange={(e) => setDongY(e.target.checked)} />
        <span>{chu.dongY}</span>
      </label>

      {daGuiMa ? (
        <>
          <p className="sign__hint">{chu.maDaGui.replace('{email}', emailAn)}</p>
          <label className="sign__label" htmlFor="otp">{chu.nhapMa}</label>
          <input
            id="otp"
            className="sign__input"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            inputMode="numeric"
            autoComplete="one-time-code"
          />
        </>
      ) : null}

      {loi ? <p className="sign__err">{loi}</p> : null}

      <div className="sign__row">
        {daGuiMa ? (
          <button type="button" className="sign__btn" disabled={dangGui} onClick={() => void ky()}>
            {dangGui ? chu.dangGui : chu.xacNhanKy}
          </button>
        ) : (
          <button type="button" className="sign__btn" disabled={dangGui} onClick={() => void guiMa()}>
            {dangGui ? chu.dangGui : chu.guiMa}
          </button>
        )}
        {daGuiMa ? (
          <button type="button" className="sign__link" disabled={dangGui} onClick={() => void guiMa()}>
            {chu.guiLaiMa}
          </button>
        ) : null}
        <button type="button" className="sign__link" onClick={() => setBuoc('tuChoi')}>
          {chu.tuChoi}
        </button>
      </div>

      <p className="sign__legal">{chu.ghiChuPhapLy}</p>
    </div>
  );
}
