'use client';

import { useEffect } from 'react';

import { chiaInDam, phanTichThan } from '@/lib/than-dieu';
import { DAU_CMS, cuaSoCms, dangSuaTaiCho, dangXemTruoc, laAdminCms } from '@/lib/cms-mode';
import { danhSachDoiTuong } from '@/lib/editable-lists';

/**
 * Chế độ sửa tại chỗ: gõ thẳng lên trang, trong khung xem trước của màn CMS.
 *
 * ====================================================================
 * VÌ SAO ĐỐI CHIẾU CHỮ THAY VÌ ĐÁNH DẤU KHOÁ LÚC DỰNG TRANG
 * ====================================================================
 *
 * Cách hiển nhiên là gắn sẵn khoá vào DOM lúc render — mỗi chuỗi một
 * `data-cms-key`. Nhưng để biết khoá lúc render thì trang phải đọc tham số URL
 * hoặc cookie, mà đọc hai thứ đó là Next đẩy trang sang RENDER ĐỘNG. Cả 44
 * trang của site đang dựng tĩnh và phục vụ từ biên; đánh đổi tốc độ của mọi
 * khách thật để phục vụ một màn quản trị là sai chỗ.
 *
 * Nên chế độ sửa chạy hoàn toàn ở trình duyệt: tải danh mục ô, rồi soi từng
 * nút chữ trong trang xem nó khớp giá trị của ô nào. Trang giao đi vẫn là
 * trang tĩnh y như khách thường nhận.
 *
 * Cái giá phải trả, nói thẳng:
 *
 * * Chuỗi bị JS biến đổi trước khi vào DOM (cắt, ghép, đổi hoa thường) sẽ
 *   không khớp và không sửa tại chỗ được. Chữ in hoa bằng CSS thì vẫn khớp,
 *   vì DOM giữ nguyên chữ gốc.
 * * Chuỗi có chỗ điền như `Copyright © {year} By {name}` được so bằng mẫu, và
 *   phần điền vào thì không sửa được — sửa nó là sửa cái khác.
 * * Hai ô khác nhau mà chữ giống hệt thì ô nào đứng trước trong danh mục được
 *   nhận; trường hợp này hiếm và hậu quả nhẹ (sửa nhầm một ô cùng nội dung).
 *
 * Những chuỗi không sửa tại chỗ được vẫn sửa được ở danh sách ô của màn
 * CMS — đó là lý do danh sách đó không bị bỏ đi.
 *
 * ====================================================================
 * KHÔNG GÕ TRONG KHUNG — CHỈ CHỌN Ô
 * ====================================================================
 *
 * Khung xem trước giữ đúng bề rộng thiết bị (1440px cho máy tính) rồi bị thu
 * nhỏ cho vừa màn admin — chữ còn chừng 60%, gõ thẳng lên đó gần như không
 * đọc được. Nên trang này chỉ báo "người dùng bấm ô X, nó nằm ở đây"
 * (`cms-select` kèm toạ độ), và hộp sửa nổi ở PHÍA ADMIN, đúng cỡ chữ thật.
 * Cuộn trang thì gửi lại toạ độ (`cms-rect`) để hộp đi theo chữ.
 *
 *   trang -> admin: cms-ready, cms-select {key, rect}, cms-rect {rect|null},
 *                   cms-image {slot}
 *   admin -> trang: cms-draft {values}, cms-scope {prefixes},
 *                   cms-focus {key}, cms-clear
 */

const CO_SUA = 'cms-edit';
const DAU = 'data-cms-key';
/** Khoá ô ảnh trong CMS là 'images.<tên ô>' — trùng với lib/image-slots. */
const IMAGE_PREFIX = 'images.';

interface SchemaResponse {
  fields: Record<string, string>;
  /** Giá trị đang hiện trên trang (đã trộn ghi đè) — xem /api/content-schema. */
  current?: Record<string, string>;
  numberFields?: string[];
  images?: { slot: string; section: string }[];
  /** Hình vẽ biểu tượng mạng xã hội — xem dungLaiMangXaHoi. */
  socialIcons?: { key: string; label: string; icon: string }[];
  /** Danh sách cho THÊM/BỚT — xem themMucVaoDanhSach. */
  editableLists?: string[];
}

/** Thẻ mà Counter dựng ra — xem giải thích ở chỗ dùng. */
const O_SO = 'count';

/** Chuỗi dùng làm mẫu regex, có chừa chỗ cho phần điền `{...}`. */
function lamMau(v: string): RegExp | null {
  if (!v.includes('{')) return null;
  const esc = v.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\\\{[a-zA-Z]+\\\}/g, '(.+?)');
  return new RegExp(`^${esc}$`);
}

export function CmsEditor(): null {
  useEffect(() => {
    const xemTruoc = dangXemTruoc();
    if (!dangSuaTaiCho() && !xemTruoc) return;
    // Khung (parent) hoặc tab mở từ màn CMS (opener) — xem cuaSoCms.
    const cha = cuaSoCms()!;
    /** Chỉ nhận lệnh từ đúng cửa sổ CMS, và cửa sổ đó phải là một origin admin. */
    const tuCms = (e: MessageEvent): boolean => e.source === cha && laAdminCms(e.origin);
    const locale = window.location.pathname.split('/')[1] ?? 'vi-vn';
    // Đặt dấu NGAY, trước cả khi tải danh mục ô: CSS treo vào dấu này để tắt
    // các hiệu ứng động. Đợi đến lúc fetch xong mới đặt thì người dùng kịp
    // thấy chữ chạy một nhịp rồi mới đứng yên.
    //
    // KHÔNG đặt ở chế độ xem trước: ở đó trang phải chạy y như khách thật thấy.
    if (!xemTruoc) document.documentElement.setAttribute(DAU_CMS, '1');

    /**
     * Điều hướng: CHẶN khi đang sửa, GIỮ NGUYÊN khi đang xem trước.
     *
     * Lúc sửa — CSS đã tắt chuột cho mọi <a>, nhưng chữ sửa được và ảnh thì
     * phải bật lại, và cú bấm vào chúng vẫn NỔI LÊN thẻ <a> bọc ngoài. Next
     * bắt được là chuyển trang: đang gõ dở một dòng ở chân trang thì màn hình
     * nhảy sang trang dịch vụ, mất cả chỗ đứng lẫn tham số. Đổi trang lúc sửa
     * thì dùng danh sách mục bên trái màn CMS.
     *
     * Lúc xem trước — phải đi lại được như một landing bình thường, vì đó mới
     * là thứ đang cần xem. Nhưng điều hướng của Next giữ nguyên đường dẫn
     * trong href, tức là MẤT tham số `cms-preview`: sang trang mới thì trình
     * này không chạy nữa và bản nháp biến mất mà không có gì báo. Nên tự lái
     * bằng một lần tải trang đầy đủ, có kèm tham số. Tải lại thì bản nháp cũng
     * được màn CMS gửi sang lần nữa — xem `cms-ready` ở dưới.
     *
     * Bắt ở pha bắt, trên document, nên chạy TRƯỚC mọi tay bắt của Next.
     */
    const chanDieuHuong = (e: MouseEvent): void => {
      const dich = e.target;
      if (!(dich instanceof Element)) return;
      const a = dich.closest('a');
      if (!a) return;

      if (!xemTruoc) {
        e.preventDefault();
        return;
      }

      const href = a.getAttribute('href');
      // Neo trong trang, tel:, mailto:, link ra ngoài: để yên cho trình duyệt.
      if (!href || !href.startsWith('/')) return;
      e.preventDefault();
      const u = new URL(href, window.location.origin);
      u.searchParams.set('cms-preview', '1');
      window.location.href = u.toString();
    };
    document.addEventListener('click', chanDieuHuong, true);

    let huy = false;
    /** Việc phải gỡ khi rời chế độ sửa, gom lại vì chúng sinh ra trong hàm async. */
    const goCuoi: (() => void)[] = [];

    const chay = async (): Promise<void> => {
      const res = await fetch(`/api/content-schema?locale=${locale}`);
      if (!res.ok || huy) return;
      const { fields, current, numberFields, images, socialIcons, editableLists } =
        (await res.json()) as SchemaResponse;
      // Ô ảnh thuộc khối nào — cần cho việc thu hẹp phạm vi ở dưới. Ảnh không
      // có khoá dạng 'a.b.c' như chữ, nên không suy ra từ tên ô được.
      const khoiCuaAnh = new Map((images ?? []).map((i) => [i.slot, i.section]));
      const laSo = new Set(numberFields ?? []);

      // Chuỗi -> khoá. Ô đứng trước thắng khi trùng chữ.
      //
      // Bản ĐANG HIỆN đi trước, bản mặc định trong code đi sau. Thứ tự này là
      // cả vấn đề: ô đã lưu một lần thì chữ trên trang là bản ghi đè, không
      // còn khớp bản mặc định — chỉ dựng map từ bản mặc định là ô đó thôi sửa
      // tại chỗ được, và không có gì báo. Vẫn giữ bản mặc định làm lớp sau, để
      // ngay sau khi Khôi phục mà cache chưa kịp mới thì vẫn nhận ra.
      //
      // Giữ MỌI khoá trùng chữ, không chỉ khoá đầu tiên. Chữ "Dịch vụ" xuất
      // hiện ở ba ô khác nhau — mục trên thanh điều hướng, tiêu đề cột ở chân
      // trang, dòng nhãn của khối dịch vụ. Lấy khoá đầu là tiêu đề cột ở chân
      // trang bị gán thành ô của thanh điều hướng: mở mục Chân trang ra thì nó
      // nằm ngoài phạm vi nên không sửa được, mà sửa được thì lại đổi nhầm chỗ.
      // Chọn khoá nào để dùng thì đợi biết phạm vi — xem datPhamVi.
      const theoChu = new Map<string, string[]>();
      const mau: { key: string; re: RegExp }[] = [];
      const daCoKhoa = new Set<string>();
      // Ô SEO và thẻ chia sẻ không bao giờ là chữ trên trang. Để chúng vào bảng
      // đối chiếu thì tên dịch vụ trùng chữ với tiêu đề SEO, và bấm vào tiêu đề
      // trang lại mở ô tiêu đề SEO.
      const khongHienChu = (k: string): boolean =>
        k.startsWith('meta.') || k.startsWith('og.') || k.includes('.meta.');
      const nap = (bang: Record<string, string>): void => {
        for (const [k, v] of Object.entries(bang)) {
          const t = v.trim();
          if (!t || daCoKhoa.has(k) || khongHienChu(k)) continue;
          daCoKhoa.add(k);
          const re = lamMau(t);
          if (re) {
            mau.push({ key: k, re });
            continue;
          }
          const ds = theoChu.get(t);
          if (ds) ds.push(k);
          else theoChu.set(t, [k]);
        }
      };
      nap(current ?? fields);
      nap(fields);

      /* ---- Thêm một mục vào danh sách, ngay trên trang ------------------
       *
       * Ô thứ 11 chưa tồn tại trong từ điển nên chỉ ghi được bằng cách ghi cả
       * danh sách dưới dạng JSON. Việc ghép danh sách giờ do màn CMS làm: trang
       * này chỉ dựng chỗ cho mục mới (mang khoá 'list.<n>') rồi chọn nó, admin
       * thấy chỉ số bằng độ dài danh sách thì hiểu là thêm mục.
       */
      const danhSachSuaDuoc = new Set(editableLists ?? []);

      /** Các thẻ đang mang ô chỉ số của một danh sách, theo đúng thứ tự trang. */
      const mucCuaDanhSach = (tienTo: string): HTMLElement[] =>
        [...document.querySelectorAll<HTMLElement>(`[${DAU}^="${tienTo}."]`)]
          .filter((el) => /^\d+$/.test((el.getAttribute(DAU) ?? '').slice(tienTo.length + 1)))
          .sort((a, b) => {
            const so = (el: HTMLElement): number =>
              Number((el.getAttribute(DAU) ?? '').slice(tienTo.length + 1));
            return so(a) - so(b);
          });

      /* ---- Chọn ô ------------------------------------------------------ */
      const VIEN = '1px dashed rgba(242,106,27,.55)';
      const VIEN_CHON = '2px solid #f26a1b';
      let dangChon: HTMLElement | null = null;

      const toaDo = (el: HTMLElement): { left: number; top: number; width: number; height: number } | null => {
        if (!el.isConnected) return null;
        const r = el.getBoundingClientRect();
        // Bị giấu (display:none) thì hộp 0x0 ở góc trang — báo là mất dấu.
        if (r.width === 0 && r.height === 0) return null;
        return { left: r.left, top: r.top, width: r.width, height: r.height };
      };

      const boChon = (): void => {
        if (dangChon) dangChon.style.outline = dangChon.dataset.cmsVien ?? '';
        dangChon = null;
      };

      const chonO = (el: HTMLElement, key: string): void => {
        // Ô ngoài phạm vi mục đang mở — xem datPhamVi.
        if (el.dataset.cmsMo !== undefined) return;
        const rect = toaDo(el);
        if (!rect) return;
        boChon();
        dangChon = el;
        el.dataset.cmsVien = el.style.outline;
        el.style.outline = VIEN_CHON;
        cha.postMessage({ type: 'cms-select', key, rect }, '*');
      };

      /** Bấm vào ô: chặn mọi thứ khác (thẻ <a> bọc ngoài, ô nhập) rồi chọn nó. */
      const ganChon = (el: HTMLElement, layKhoa: () => string | null): void => {
        el.style.cursor = 'pointer';
        el.addEventListener('mousedown', (e) => {
          // mousedown chứ không phải click: tới click thì con trỏ đã nhảy vào
          // ô nhập (chữ gợi ý) và người dùng gõ vào chỗ không lưu đi đâu cả.
          e.preventDefault();
          e.stopPropagation();
          const key = layKhoa();
          if (key) chonO(el, key);
        });
      };

      // Trang cuộn (trong khung) hoặc đổi cỡ: hộp sửa ở admin phải đi theo chữ.
      // Gom theo khung hình: cuộn mượt bắn hàng trăm sự kiện, hộp sửa chỉ cần
      // một toạ độ mỗi lần vẽ.
      let choVe = false;
      const baoToaDo = (): void => {
        if (!dangChon || choVe) return;
        choVe = true;
        requestAnimationFrame(() => {
          choVe = false;
          if (dangChon) cha.postMessage({ type: 'cms-rect', rect: toaDo(dangChon) }, '*');
        });
      };
      if (!xemTruoc) {
        window.addEventListener('scroll', baoToaDo, { passive: true, capture: true });
        window.addEventListener('resize', baoToaDo);
        goCuoi.push(() => {
          window.removeEventListener('scroll', baoToaDo, { capture: true });
          window.removeEventListener('resize', baoToaDo);
        });
      }

      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      const canSua: { node: Text; key: string; ungVien: string[] }[] = [];
      /** Đoạn chữ này đã gặp mấy lần rồi — để chia ô theo thứ tự xuất hiện. */
      const daGap = new Map<string, number>();
      let n = walker.nextNode();
      while (n) {
        const node = n as Text;
        const t = node.data.trim();
        n = walker.nextNode();
        if (t.length < 2) continue;
        // Bỏ qua chữ nằm trong chính lớp phủ của trình sửa.
        if ((node.parentElement?.closest(`[${DAU}], [data-cms-attr]`) ?? null) !== null) continue;
        // Bỏ qua vùng khoá. Không bỏ thì chữ trong đó vẫn được gán cho ô nào
        // tình cờ trùng chữ ở nơi khác — xem ghi chú ở .cta-band.
        if (node.parentElement?.closest('[data-cms-region="ctaBand"]')) continue;
        /* Than dieu khoan TU KHAI ma o cua no (data-cms-rich). Bo qua chu ben
           trong: `**in dam**` va gach dau dong che than dieu thanh nhieu nut,
           khong nut nao bang ca than, nen doi chieu o day chi gan nham khoa cho
           nhung manh roi — va chinh dieu do lam dieu co dinh dang khong bam
           chon duoc, con go vao o cua no thi khung xem truoc khong doi gi. */
        if (node.parentElement?.closest('[data-cms-rich]')) continue;
        const ungVien = theoChu.get(t) ?? [];
        /* Nhiều ô mang Y HỆT một đoạn chữ thì chia theo THỨ TỰ XUẤT HIỆN: lần
           gặp thứ n trên trang nhận ô ứng viên thứ n.

           Trước đây mọi lần gặp đều nhận ứng viên ĐẦU TIÊN, nên ba nhà kho có
           cùng nhãn "Diện tích" thì chỉ nhãn của kho thứ nhất sửa được — hai
           nhãn kia gõ ở danh sách ô mà trên trang không đổi gì, và bấm vào
           chúng lại sửa nhầm sang kho thứ nhất. Đã đo: 25 ô tiếng Việt và 30 ô
           tiếng Anh kẹt kiểu này.

           Nhiều lần gặp hơn số ô thì những lần dư dùng ô cuối — thà trùng còn
           hơn bỏ trắng, vì bỏ trắng là không sửa được ở đâu cả. */
        let key: string | undefined;
        if (ungVien.length > 0) {
          const lan = daGap.get(t) ?? 0;
          key = ungVien[Math.min(lan, ungVien.length - 1)];
          daGap.set(t, lan + 1);
        } else {
          key = mau.find((m) => m.re.test(t))?.key;
        }
        if (!key) continue;
        // Ô số chỉ nhận khi nó nằm trong đúng thẻ Counter dựng ra. Giá trị của
        // chúng là những chuỗi rất ngắn — '34', '120' — và đối chiếu theo chữ
        // thì BẤT KỲ chỗ nào trên trang tình cờ ghi '34' cũng khớp, rồi sửa
        // chỗ đó lại âm thầm ghi đè số tỉnh thành. Thà bỏ sót còn hơn ghi nhầm:
        // những ô số không khớp vẫn sửa được ở danh sách ô.
        if (laSo.has(key) && !node.parentElement?.classList.contains(O_SO)) continue;
        canSua.push({ node, key, ungVien });
      }

      for (const { node, key, ungVien } of canSua) {
        const el = node.parentElement;
        if (!el) continue;
        // Bọc riêng nút chữ, không bọc cả thẻ cha: thẻ cha có thể chứa nhiều
        // nút chữ của nhiều ô khác nhau, bọc cả cụm là gán nhầm khoá.
        const span = document.createElement('span');
        span.setAttribute(DAU, key);
        // Các ô khác cũng mang đúng chữ này. Giữ lại để lúc biết phạm vi thì
        // đổi sang ô thuộc mục đang mở.
        if (ungVien.length > 1) span.dataset.cmsKeys = ungVien.join(' ');
        span.textContent = node.data;
        node.replaceWith(span);

        // Xem trước vẫn phải bọc — bản nháp cần biết chữ nào nằm ở đâu mới đắp
        // vào được. Chỉ bỏ phần nhìn thấy và phần gõ được.
        if (xemTruoc) continue;

        span.style.outline = VIEN;
        span.style.outlineOffset = '2px';
        // Đọc lại khoá từ thẻ lúc bấm: phạm vi có thể đã đổi nó sang ô khác —
        // xem datPhamVi.
        ganChon(span, () => span.getAttribute(DAU));
      }

      /* The TU KHAI ma o khong di qua vong doi chieu chu o tren, nen phai tu
         vien va gan su kien chon o day. */
      if (!xemTruoc) {
        for (const el of document.querySelectorAll<HTMLElement>(`[data-cms-rich][${DAU}]`)) {
          el.style.outline = VIEN;
          el.style.outlineOffset = '2px';
          ganChon(el, () => el.getAttribute(DAU));
        }
      }

      const themMucVaoDanhSach = (tienTo: string): void => {
        const ds = mucCuaDanhSach(tienTo);
        const cuoi = ds[ds.length - 1];
        if (!cuoi) return;
        // Nhân bản thẻ MANG chữ, rồi trèo lên đúng thẻ bao ngoài của nó (<li>):
        // dựng thẻ mới bằng tay thì mất hết class và mất cả dấu chấm/số thứ tự.
        const bao = cuoi.parentElement ?? cuoi;
        const baoMoi = bao.cloneNode(true) as HTMLElement;
        // Dòng dựng tạm: bản nháp không còn ô của nó (Esc, Huỷ) thì gỡ đi.
        baoMoi.dataset.cmsMoi = '';
        const oMoi = baoMoi.querySelector<HTMLElement>(`[${DAU}]`) ?? baoMoi;
        oMoi.setAttribute(DAU, `${tienTo}.${ds.length}`);
        oMoi.textContent = '';
        oMoi.style.outline = VIEN;
        oMoi.style.outlineOffset = '2px';
        oMoi.style.minWidth = '6ch';
        oMoi.style.minHeight = '1em';
        oMoi.style.display = 'inline-block';
        // cloneNode không chép tay bắt sự kiện — gắn lại.
        ganChon(oMoi, () => oMoi.getAttribute(DAU));
        bao.parentElement?.insertBefore(baoMoi, bao.nextSibling);
        chonO(oMoi, `${tienTo}.${ds.length}`);
      };

      if (!xemTruoc) {
        for (const tienTo of danhSachSuaDuoc) {
          const ds = mucCuaDanhSach(tienTo);
          // Không có mục nào trên trang thì không có gì để nhân bản, và cũng
          // không biết đặt nút vào đâu — danh sách đó vẫn sửa ở màn CMS.
          if (ds.length === 0) continue;

          const cuoi = ds[ds.length - 1]!;
          const bao = cuoi.parentElement ?? cuoi;
          const nut = document.createElement('button');
          nut.type = 'button';
          nut.textContent = '+ Thêm dòng';
          nut.style.cssText =
            'margin-top:10px;padding:4px 10px;font:inherit;font-size:13px;line-height:1.2;' +
            'color:#f26a1b;background:transparent;cursor:pointer;' +
            'border:1px dashed rgba(242,106,27,.65);border-radius:6px';
          nut.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            themMucVaoDanhSach(tienTo);
          });

          // Bọc nút trong đúng loại thẻ mà danh sách chứa: một <button> nằm
          // thẳng trong <ul>/<ol> là HTML sai, và trình duyệt tự sửa theo cách
          // riêng của nó — có nơi đẩy nút ra ngoài danh sách.
          const cha = bao.parentElement;
          let cho: HTMLElement = nut;
          if (cha && (cha.tagName === 'UL' || cha.tagName === 'OL')) {
            const li = document.createElement('li');
            li.style.listStyle = 'none';
            li.append(nut);
            cho = li;
          }
          cha?.appendChild(cho);
          goCuoi.push(() => cho.remove());
        }
      }

      // ---- Ảnh: bấm vào tấm ảnh trên trang là mở hộp chọn file ở màn CMS ----
      // Không dò theo địa chỉ mà đọc thẳng data-cms-slot do imageProps đính
      // vào. Xem giải thích ở ImageProps trong lib/image-slots.ts.
      const anh = document.querySelectorAll<HTMLElement>('[data-cms-slot]');
      for (const el of xemTruoc ? [] : anh) {
        const slot = el.getAttribute('data-cms-slot');
        if (!slot) continue;
        // StrictMode ở chế độ phát triển chạy effect hai lần. Nút chữ đã bọc
        // thì lần sau nhận ra và bỏ qua, còn ảnh thì không có dấu nào — thiếu
        // cờ này là mỗi cú bấm gửi đi hai lần.
        if (el.dataset.cmsBound === '1') continue;
        el.dataset.cmsBound = '1';
        el.style.outline = '2px dashed rgba(242,106,27,.75)';
        el.style.outlineOffset = '-2px';
        el.style.cursor = 'pointer';
        el.addEventListener('click', (e) => {
          // Nhiều ảnh nằm trong thẻ <a>. Không chặn thì bấm để thay ảnh lại
          // thành chuyển trang, và người sửa mất chỗ đang đứng.
          e.preventDefault();
          e.stopPropagation();
          cha.postMessage({ type: 'cms-image', slot }, '*');
        });
      }

      // ---- Ô KHÔNG gõ thẳng lên trang được ----
      // Hai loại, cùng một cách xử lý — bấm vào thì mở hộp sửa một ô ở màn CMS:
      //
      // * Ô nằm trong thuộc tính: chữ gợi ý của ô nhập ('Nguyễn Văn A'). Nó
      //   không phải một nút chữ nên cách bọc ở trên không với tới, và cũng
      //   không có gì để đặt con trỏ vào.
      // * Ô đã bị biến đổi trước khi ra màn hình: số gọi lưu là '0886440449'
      //   nhưng hiện ra '(+84) 886 440 449'. Gõ thẳng lên đó thì phải đoán
      //   ngược từ bản đã định dạng về bản gốc — đoán sai là hỏng số. Những
      //   chỗ này tự khai data-cms-attr ngay trong mã trang.
      const oThuocTinh = (el: HTMLElement, key: string): void => {
        if (el.dataset.cmsBound === '1') return;
        el.dataset.cmsBound = '1';
        el.setAttribute('data-cms-attr', key);
        el.style.outline = VIEN;
        el.style.outlineOffset = '2px';
        ganChon(el, () => key);
      };

      for (const el of xemTruoc
        ? []
        : document.querySelectorAll<HTMLElement>('[data-cms-attr]')) {
        const key = el.getAttribute('data-cms-attr');
        if (key) oThuocTinh(el, key);
      }
      for (const el of xemTruoc ? [] : document.querySelectorAll<HTMLElement>('[placeholder]')) {
        const chu = el.getAttribute('placeholder')?.trim();
        if (!chu) continue;
        const key = theoChu.get(chu)?.[0] ?? mau.find((m) => m.re.test(chu))?.key;
        if (key) oThuocTinh(el, key);
      }

      // ---- Bản nháp từ màn CMS ----
      // Màn CMS gửi sang toàn bộ những ô ĐANG SỬA MÀ CHƯA LƯU, mỗi lần có thay
      // đổi. Không có đường này thì khung xem trước luôn là trang đã lưu: tải
      // một tấm ảnh mới lên rồi nhìn vào vẫn thấy ảnh cũ, và người sửa không
      // biết mình vừa chọn đúng file chưa cho tới khi bấm Lưu.
      //
      // Chỉ nhận từ CỬA SỔ CHA. Trang này chỉ cho phép bị nhúng bởi các origin
      // khai trong CSP frame-ancestors, nên cha đã là một origin tin được —
      // xem next.config.ts.
      /**
       * Dựng lại hàng biểu tượng mạng xã hội theo bản nháp.
       *
       * Phải dựng lại cả hàng chứ không sửa từng ô như mọi chỗ khác: ở đây giá
       * trị quyết định CÓ HAY KHÔNG CÓ phần tử, không phải chữ bên trong nó.
       * Gõ địa chỉ Facebook đầu tiên thì cái nút đó chưa tồn tại — không có gì
       * để đắp vào, và người sửa tưởng mình gõ sai.
       *
       * Địa chỉ lấy từ bản nháp trước, rơi về giá trị đang hiện của trang. Lọc
       * y như trang thật: chỉ http/https, thiếu 'https://' thì bỏ — xem
       * diaChiMangXaHoi ở lib/social.ts.
       */
      const dungLaiMangXaHoi = (nhap: Record<string, unknown>): void => {
        const hang = document.querySelector<HTMLElement>('[data-cms-social]');
        if (!hang || !socialIcons) return;

        // Kênh đang TẮT bằng công tắc: vẫn còn địa chỉ, nhưng không hiện với
        // khách. Ở chế độ sửa thì vẫn vẽ ra (mờ, như kênh chưa có địa chỉ) để
        // người sửa thấy nó tồn tại mà bật lại.
        const khoaTat = 'social.off';
        const thoTat =
          typeof nhap[khoaTat] === 'string'
            ? (nhap[khoaTat] as string)
            : (current ?? fields)[khoaTat];
        const tat = new Set(
          (thoTat ?? '')
            .split(/[\s,]+/)
            .map((x) => x.trim())
            .filter(Boolean),
        );

        const dong = socialIcons.map(({ key, label, icon }) => {
          const k = `social.${key}`;
          if (tat.has(key)) return { key: k, label, icon, url: null };
          const tho = typeof nhap[k] === 'string' ? (nhap[k] as string) : (current ?? fields)[k];
          const t = (tho ?? '').trim();
          let url: string | null = null;
          try {
            const u = new URL(t);
            if (u.protocol === 'http:' || u.protocol === 'https:') url = u.toString();
          } catch {
            // Thiếu https:// thì URL() ném lỗi — coi như chưa có, đúng như
            // trang thật. Xem diaChiMangXaHoi ở lib/social.ts.
          }
          return { key: k, label, icon, url };
        });

        // Ở chế độ sửa: hiện CẢ NĂM kênh, kể cả kênh chưa có địa chỉ. Đó là
        // cách thêm một kênh ngay trên trang — bấm vào biểu tượng mờ là mở hộp
        // điền địa chỉ. Không hiện thì muốn thêm kênh phải mở danh sách ô ra dò.
        //
        // Ở chế độ xem trước và trên trang thật: chỉ kênh có địa chỉ.
        const hien = xemTruoc ? dong.filter((x) => x.url !== null) : dong;
        hang.hidden = hien.length === 0;

        hang.replaceChildren(
          ...hien.map(({ key, label, icon, url }) => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            if (url) {
              a.href = url;
              a.target = '_blank';
              a.rel = 'noopener noreferrer';
            }
            a.setAttribute('aria-label', label);
            // Kênh chưa có địa chỉ nói rõ ra, thay vì để một biểu tượng mờ mà
            // không ai biết bấm vào thì được gì.
            a.title = url ? label : `${label} — chưa có địa chỉ, bấm để thêm`;
            if (!url) a.dataset.cmsTrong = '';
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('viewBox', '0 0 24 24');
            svg.setAttribute('aria-hidden', 'true');
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', icon);
            svg.append(path);
            a.append(svg);
            li.append(a);
            // Bấm vào mở hộp điền địa chỉ. Cùng đường với chữ gợi ý trong ô
            // nhập: giá trị không phải chữ hiện trên trang nên không gõ thẳng
            // lên được.
            if (!xemTruoc) oThuocTinh(a, key);
            return li;
          }),
        );
      };

      // Dựng ngay khi vào chế độ sửa, chưa cần đợi bản nháp nào: hàng biểu
      // tượng phải có mặt thì mới bấm vào mà thêm kênh được.
      if (!xemTruoc) dungLaiMangXaHoi({});

      /*
       * Bản nháp gửi sang là TOÀN BỘ những ô đang sửa, mỗi lần có thay đổi. Ô
       * nào rời bản nháp (Esc, Huỷ thay đổi, gõ về đúng bản đã lưu) thì phải
       * trả lại đúng như trang đã dựng — trước đây chỉ đè mà không trả, nên chữ
       * nháp đứng lại trên khung như thể đã lưu.
       *
       * Cách làm: mỗi lần nhận, trả lại MỌI thứ lần trước đã đè, rồi đè lại
       * theo bản mới. Cùng một nhịp nên không nháy.
       */
      type Goc = { text?: string; con?: Node[]; placeholder?: string; img?: [string | null, string | null, string | null] };
      const goc = new Map<HTMLElement, Goc>();
      const anDi = new Map<HTMLElement, string>();
      let coMangXaHoi = false;

      const traLai = (): void => {
        for (const [el, g] of goc) {
          if (g.text !== undefined) el.textContent = g.text;
          if (g.con) el.replaceChildren(...g.con);
          if (g.placeholder !== undefined) (el as HTMLInputElement).placeholder = g.placeholder;
          if (g.img) {
            const [src, srcset, sizes] = g.img;
            for (const [a, v] of [['src', src], ['srcset', srcset], ['sizes', sizes]] as const) {
              if (v === null) el.removeAttribute(a);
              else el.setAttribute(a, v);
            }
          }
        }
        goc.clear();
        for (const [el, d] of anDi) el.style.display = d;
        anDi.clear();
      };
      const nho = (el: HTMLElement, g: Goc): void => {
        if (!goc.has(el)) goc.set(el, g);
      };

      /**
       * Than mot dieu khoan -> cac the DOM, giong het `ThanDieu` ben
       * `legal.tsx` dung ra. Mot bo phan tich, hai cach dung: trang that bang
       * JSX, khung xem truoc bang DOM.
       */
      const dungThanDieu = (body: string): Node[] =>
        phanTichThan(body).map((m) => {
          if (m.gach) {
            const ul = document.createElement('ul');
            for (const d of m.dong) {
              const li = document.createElement('li');
              li.append(...manhInDam(d.slice(2)));
              ul.append(li);
            }
            return ul;
          }
          const pEl = document.createElement('p');
          pEl.append(...manhInDam(m.dong.join('\n')));
          return pEl;
        });

      const manhInDam = (chu: string): Node[] =>
        chiaInDam(chu).map(({ dam, chu: t }) => {
          const el = document.createElement(dam ? 'strong' : 'span');
          el.textContent = t;
          return el;
        });

      const khoaCua = (el: Element): string =>
        el.getAttribute(DAU) ?? el.getAttribute('data-cms-attr') ?? '';
      const thuocMuc = (k: string, p: string): boolean => k === p || k.startsWith(`${p}.`);

      /** Vùng trên trang của một mục danh sách: thẻ bao lớn nhất chỉ chứa ô của mục đó. */
      const vungCuaMuc = (els: HTMLElement[], p: string): HTMLElement[] => {
        const sach = (x: Element): boolean =>
          [...x.querySelectorAll(`[${DAU}], [data-cms-attr]`)].every((e) => thuocMuc(khoaCua(e), p));
        const leo = (v: HTMLElement): HTMLElement => {
          while (v.parentElement && v.parentElement !== document.body && v.parentElement.tagName !== 'MAIN' && sach(v.parentElement)) {
            v = v.parentElement;
          }
          return v;
        };
        let chung: HTMLElement | null = els[0] ?? null;
        while (chung && !els.every((e) => chung!.contains(e))) chung = chung.parentElement;
        if (chung && sach(chung)) return [leo(chung)];
        // Thẻ chung còn chứa mục khác: chân trang in nhãn nhóm ("Chi nhánh")
        // MỘT lần cho cả nhóm, mang ô `label` của văn phòng đầu nhóm. Ẩn văn
        // phòng đó không được ẩn theo nhãn của cả nhóm.
        return els.filter((e) => !khoaCua(e).endsWith('.label')).map(leo);
      };

      /** Mục đã xoá, hay văn phòng tắt "Hiển thị", trong bản nháp: ẩn trên khung. */
      const anTheoDanhSach = (values: Record<string, unknown>): void => {
        for (const [ds, tho] of Object.entries(values)) {
          const doiTuong = danhSachDoiTuong(ds);
          if (typeof tho !== 'string' || (!danhSachSuaDuoc.has(ds) && !doiTuong)) continue;
          let mang: unknown;
          try { mang = JSON.parse(tho); } catch { continue; }
          if (!Array.isArray(mang)) continue;
          const theoChiSo = new Map<number, HTMLElement[]>();
          for (const el of document.querySelectorAll<HTMLElement>(`[${DAU}^="${ds}."], [data-cms-attr^="${ds}."]`)) {
            const m = /^(\d+)(?:\.|$)/.exec(khoaCua(el).slice(ds.length + 1));
            if (!m) continue;
            const i = Number(m[1]);
            theoChiSo.set(i, [...(theoChiSo.get(i) ?? []), el]);
          }
          for (const [i, els] of theoChiSo) {
            const muc = mang[i] as Record<string, unknown> | string | undefined;
            const an = muc === undefined || (doiTuong && typeof muc === 'object' && muc?.hidden === '1');
            if (!an) continue;
            for (const v of vungCuaMuc(els, `${ds}.${i}`)) {
              if (!anDi.has(v)) anDi.set(v, v.style.display);
              v.style.display = 'none';
            }
          }
        }
      };

      const nhanNhap = (e: MessageEvent): void => {
        if (!tuCms(e)) return;
        const d = e.data as { type?: string; values?: Record<string, unknown> };
        if (d?.type !== 'cms-draft' || !d.values) return;
        traLai();
        // Dòng thêm tạm mà bản nháp không còn ô của nó: gỡ.
        for (const el of document.querySelectorAll<HTMLElement>('[data-cms-moi]')) {
          const o = el.querySelector(`[${DAU}]`) ?? el;
          if (!(khoaCua(o) in d.values)) el.remove();
        }
        const coMxh = Object.keys(d.values).some((k) => k.startsWith('social.'));
        // Lần trước có kênh trong bản nháp mà lần này không: dựng lại theo trang.
        if (coMxh || coMangXaHoi) dungLaiMangXaHoi(d.values);
        coMangXaHoi = coMxh;
        for (const [key, gt] of Object.entries(d.values)) {
          if (typeof gt !== 'string') continue;

          if (key.startsWith(IMAGE_PREFIX)) {
            const slot = key.slice(IMAGE_PREFIX.length);
            for (const el of document.querySelectorAll(
              `img[data-cms-slot="${CSS.escape(slot)}"]`,
            )) {
              const img = el as HTMLImageElement;
              nho(img, { img: [img.getAttribute('src'), img.getAttribute('srcset'), img.getAttribute('sizes')] });
              // Xoá srcset trước: next/image đặt cả srcset, và srcset THẮNG
              // src. Chỉ đổi src thì trình duyệt vẫn vẽ tấm cũ.
              img.removeAttribute('srcset');
              img.removeAttribute('sizes');
              if (img.src !== gt) img.src = gt;
            }
            continue;
          }

          const chon = `[data-cms-key="${CSS.escape(key)}"], [data-cms-attr="${CSS.escape(key)}"]`;
          for (const el of document.querySelectorAll<HTMLElement>(chon)) {
            // Đừng đụng vào ô người ta đang gõ: ghi đè lúc đó là con trỏ nhảy
            // về đầu dòng giữa chừng.
            if (el === document.activeElement) continue;
            if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
              nho(el, { placeholder: el.placeholder });
              if (el.placeholder !== gt) el.placeholder = gt;
              continue;
            }
            /* Than dieu: dung LAI cac khoi thay vi gan mot chuoi chu, de khung
               xem truoc doi theo tung phim go ma van giu in dam va gach dau
               dong. Dung chung `phanTichThan` voi trang that — hai ben tu phan
               tich lay thi ban xem truoc noi doi ve trang sap len. Dung
               createElement chu khong innerHTML: chu o day la chu nguoi dung
               vua go. */
            if (el.hasAttribute('data-cms-rich')) {
              nho(el, { con: [...el.childNodes] });
              el.replaceChildren(...dungThanDieu(gt));
              continue;
            }
            let hien = gt;
            if (el.hasAttribute('data-cms-attr')) {
              // Bản đã định dạng (số gọi '(+84) …'): sửa một văn phòng là cả
              // danh sách vào bản nháp; ô nào vẫn đúng giá trị đã lưu thì giữ
              // bản trang đã dựng.
              if (gt === (current ?? fields)[key]) continue;
              // Chỗ điền (`{year}`…) thay bằng giá trị trang tự khai ở
              // data-cms-fill, để bản nháp đọc như chữ thật.
              let dien: Record<string, string> = {};
              try { dien = JSON.parse(el.dataset.cmsFill ?? '{}') as Record<string, string>; } catch { /* không có */ }
              hien = gt.replace(/\{(\w+)\}/g, (m, k: string) => dien[k] ?? m);
            }
            if (el.textContent !== hien) {
              nho(el, { text: el.textContent ?? '' });
              el.textContent = hien;
            }
          }
        }
        anTheoDanhSach(d.values);
      };
      window.addEventListener('message', nhanNhap);
      goCuoi.push(() => window.removeEventListener('message', nhanNhap));

      // ---- Thu hẹp về đúng phần đang sửa ----
      //
      // Màn CMS gửi sang danh sách tiền tố của khối thuộc mục đang mở. Mọi thứ
      // ngoài danh sách đó được GIẤU ĐI, không phải chỉ làm mờ: chọn "Thanh
      // điều hướng" mà vẫn thấy nguyên trang chủ bên dưới thì không khác gì
      // chưa chọn, và người sửa vẫn phải tự dò xem phần nào là phần mình cần.
      //
      // Giấu theo KHỐI DOM chứ không theo từng ô: ẩn từng ô sẽ để lại cái vỏ
      // rỗng — tiêu đề mất chữ, khoảng trắng lạ — trông như trang hỏng.
      const trongPhamVi = (key: string, tienTo: string[]): boolean =>
        tienTo.some((p) => key === p || key.startsWith(`${p}.`));

      /** Vùng trên trang có thể giấu cả cụm. Đủ thô để không xé vụn bố cục. */
      const vungChon =
        '[data-cms-region], header, footer, main > *, .callbar, .hero, .section, .page-slide';
      const displayGoc = new Map<HTMLElement, string>();

      const datPhamVi = (tienTo: string[] | null): void => {
        // Trả lại nguyên trạng trước, rồi mới áp phạm vi mới — nếu không thì
        // đổi mục vài lần là những vùng giấu lần trước không bao giờ hiện lại.
        for (const [el, d] of displayGoc) el.style.display = d;
        displayGoc.clear();
        for (const el of document.querySelectorAll<HTMLElement>('[data-cms-mo]')) {
          el.style.outline = el.dataset.cmsMo!;
          el.removeAttribute('data-cms-mo');
        }
        if (!tienTo || tienTo.length === 0) return;

        // Chữ trùng nhau ở nhiều ô: chọn ô THUỘC MỤC ĐANG MỞ.
        //
        // "Dịch vụ" là mục trên thanh điều hướng, cũng là tiêu đề cột ở chân
        // trang. Không chọn lại thì mở mục Chân trang ra, tiêu đề cột đó nằm
        // ngoài phạm vi nên xám đi — và nếu sửa được thì lại đổi nhầm sang
        // thanh điều hướng. Chỉ chính phạm vi mới nói được đang cần ô nào.
        for (const el of document.querySelectorAll<HTMLElement>('[data-cms-keys]')) {
          // Ô đang gán đã thuộc mục đang mở thì GIỮ NGUYÊN. Chọn lại là xoá mất
          // kết quả chia theo thứ tự xuất hiện ở trên: ba nhãn "Diện tích" của
          // ba nhà kho đều nằm trong mục Kho bãi, chọn lại thì cả ba quay về ô
          // của kho thứ nhất — đúng lỗi vừa sửa.
          const dangGan = el.getAttribute(DAU);
          if (dangGan && trongPhamVi(dangGan, tienTo)) continue;
          const ds = (el.dataset.cmsKeys ?? '').split(' ').filter(Boolean);
          const hop = ds.find((k) => trongPhamVi(k, tienTo));
          if (hop) el.setAttribute(DAU, hop);
        }

        // Ô ngoài phạm vi: bỏ viền và không cho chọn. Chúng nằm trong vùng sắp bị giấu
        // thì cũng không thấy nữa, nhưng vùng chung (ví dụ thanh gọi nổi) có
        // thể sống sót, và một ô còn viền cam ở đó là mời gõ vào nhầm chỗ.
        const ngoai = (el: HTMLElement): void => {
          el.dataset.cmsMo = el.style.outline;
          el.style.outline = 'none';
        };
        for (const el of document.querySelectorAll<HTMLElement>('[data-cms-key], [data-cms-attr]')) {
          const key = el.getAttribute('data-cms-key') ?? el.getAttribute('data-cms-attr')!;
          if (!trongPhamVi(key, tienTo)) ngoai(el);
        }
        for (const el of document.querySelectorAll<HTMLElement>('[data-cms-slot]')) {
          const khoi = khoiCuaAnh.get(el.getAttribute('data-cms-slot')!);
          if (!khoi || !trongPhamVi(khoi, tienTo)) ngoai(el);
        }

        /**
         * Giữ hay giấu một vùng. Hai luật, theo thứ tự:
         *
         * 1. Vùng TỰ KHAI mình thuộc khối nào (`data-cms-region`) thì tin nó.
         * 2. Không khai thì giữ nếu vùng còn ô nào trong phạm vi.
         *
         * Luật 1 tồn tại vì luật 2 sai ở phần khung dùng chung. Chân trang chép
         * lại tên các mục điều hướng, nên nó chứa BẢY khoá nav.* so với bốn
         * khoá của chính nó — đếm kiểu nào cũng ra "vùng này là thanh điều
         * hướng", và chọn Thanh điều hướng sẽ lôi cả chân trang lên theo. Chân
         * trang không phải thanh điều hướng; nó chỉ mượn mấy cái nhãn. Chuyện
         * đó chỉ chính trang mới biết, nên để nó khai.
         */
        for (const el of document.querySelectorAll<HTMLElement>(vungChon)) {
          const khai = el.getAttribute('data-cms-region');
          const giuLai =
            khai !== null
              ? trongPhamVi(khai, tienTo)
              : [
                  ...el.querySelectorAll<HTMLElement>(
                    '[data-cms-key], [data-cms-attr], [data-cms-slot]',
                  ),
                ].some((o) => o.dataset.cmsMo === undefined);
          if (giuLai) continue;
          displayGoc.set(el, el.style.display);
          el.style.display = 'none';
        }
      };

      const nhanPhamVi = (e: MessageEvent): void => {
        if (!tuCms(e)) return;
        const d = e.data as { type?: string; prefixes?: unknown };
        // Xem trước là xem CẢ TRANG, không thu hẹp về mục nào.
        if (d?.type !== 'cms-scope' || xemTruoc) return;
        boChon();
        datPhamVi(Array.isArray(d.prefixes) ? (d.prefixes as string[]).filter((x) => typeof x === 'string') : null);
      };
      window.addEventListener('message', nhanPhamVi);
      goCuoi.push(() => window.removeEventListener('message', nhanPhamVi));

      /**
       * Màn CMS bấm vào một ô trong danh sách: cuộn tới chữ đó trên trang.
       * Khoá danh sách ('a.list') cuộn tới mục đầu của nó; ô ảnh tới tấm ảnh.
       */
      const nhanTroToi = (e: MessageEvent): void => {
        if (!tuCms(e) || xemTruoc) return;
        const d = e.data as { type?: string; key?: unknown };
        if (d?.type === 'cms-clear') {
          boChon();
          return;
        }
        if (d?.type !== 'cms-focus' || typeof d.key !== 'string') return;
        const k = CSS.escape(d.key);
        const chon = d.key.startsWith(IMAGE_PREFIX)
          ? `[data-cms-slot="${CSS.escape(d.key.slice(IMAGE_PREFIX.length))}"]`
          : `[data-cms-key="${k}"], [data-cms-attr="${k}"], [data-cms-key^="${k}."]`;
        const el = [...document.querySelectorAll<HTMLElement>(chon)].find((x) => toaDo(x) !== null);
        if (!el) return;
        el.scrollIntoView({ block: 'center', behavior: 'smooth' });
        boChon();
        dangChon = el;
        el.dataset.cmsVien = el.style.outline;
        el.style.outline = VIEN_CHON;
      };
      window.addEventListener('message', nhanTroToi);
      goCuoi.push(() => window.removeEventListener('message', nhanTroToi));

      cha.postMessage(
        {
          type: 'cms-ready',
          // Ngôn ngữ của trang ĐANG hiện trong khung. Ở chế độ xem trước người
          // ta đi lại được, kể cả bấm nút đổi ngôn ngữ — màn CMS cần biết để
          // đắp đúng bản nháp, không thì bản tiếng Việt rơi lên trang tiếng Anh.
          locale,
          count: canSua.length + document.querySelectorAll('[data-cms-attr]').length,
          images: anh.length,
        },
        '*',
      );
    };

    void chay();
    return () => {
      huy = true;
      while (goCuoi.length) goCuoi.pop()!();
      document.removeEventListener('click', chanDieuHuong, true);
      document.documentElement.removeAttribute(DAU_CMS);
    };
  }, []);

  return null;
}
