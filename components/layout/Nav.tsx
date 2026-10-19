'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

import type { Dictionary } from '@/lib/i18n';
import { LOCALES, LOCALE_LABEL, type Locale } from '@/lib/i18n/config';
import { HEADER_LINKS, entryHref, entryId, entryLabel } from '@/lib/navigation';
import { danhSachDichVu } from '@/lib/service-listing';
import { pageKeyFromSlug, pathFor, quotePath, serviceKeyFromPath } from '@/lib/routes';
import { ORG } from '@/lib/site';
import logoLockup from '@/public/img/logo-lockup.png';
import logoLockupWhite from '@/public/img/logo-lockup-white.png';

/**
 * The header has three looks, and this decides which one is on.
 *
 * Clear over the home hero, which owns the top of the page. Past it, the bar
 * takes the opposite tone to whatever is under it — a dark bar over the light
 * slides, a light bar over the dark ones — so it always reads against the page
 * rather than sinking into it. Off the home page it does not change as you
 * scroll: the services pages take the light bar, everything else the dark one.
 *
 * This re-runs per route because the nav lives in the layout and survives
 * client-side navigation.
 */
/**
 * The locale's flag, at the size the header shows it. Square, and rounded into
 * a disc by CSS rather than an SVG mask, so the two can share one shape.
 */
function Flag({ locale }: { locale: Locale }) {
  if (locale === 'vi-vn') {
    return (
      <svg className="nav__flag" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <rect width="24" height="24" fill="#da251d" />
        <path
          d="M12 5l1.76 5.42h5.7l-4.61 3.35 1.76 5.42L12 15.84l-4.61 3.35 1.76-5.42-4.61-3.35h5.7z"
          fill="#ff0"
        />
      </svg>
    );
  }
  return (
    <svg className="nav__flag" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <rect width="24" height="24" fill="#fff" />
      {[0, 2, 4, 6, 8, 10].map((y) => (
        <rect key={y} y={y * 2 + 1} width="24" height="1.85" fill="#b22234" />
      ))}
      <rect width="11" height="13" fill="#3c3b6e" />
    </svg>
  );
}

/** See `openedAt` in Nav. */
const TAP_GRACE_MS = 400;

/** Khoá sessionStorage giữ chỗ đang đọc qua một lần đổi ngôn ngữ. */
const GIU_VI_TRI = 'bee:giu-vi-tri';

export function Nav({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  // Mục xổ xuống dùng CHUNG danh sách với cột Dịch vụ ở chân trang và hàng
  // thẻ trên trang chủ — xem lib/service-listing.ts.
  const menu = danhSachDichVu(dict, locale);

  /* The services menu hangs 10px below its trigger, and that 10px band belongs
     to the header, not to the item that owns the hover — so a pointer on its
     way from one to the other is briefly over neither, and a plain
     mouseleave/close shuts the menu before it can be reached. The same goes
     for the corner: the menu is 300px wide against a 71px trigger, so anything
     but a straight drop leaves the item sideways first.

     Closing on a short delay covers both, and any other path across the seam,
     without the menu lingering long enough to be in the way. Re-entering
     anywhere in the group cancels it. */
  const closeTimer = useRef<number | null>(null);

  const cancelClose = useCallback(() => {
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  /** When the menu last went from closed to open. On a touch screen one tap
   *  fires a synthetic mouseenter and a focus (both open the menu) and then a
   *  click, which toggled it straight back shut: the menu flashed and was
   *  gone. A click that lands within TAP_GRACE_MS of the opening belongs to
   *  the same tap and leaves it open. */
  const openedAt = useRef(0);
  const openServices = useCallback(() => {
    cancelClose();
    setServicesOpen((was) => {
      if (!was) openedAt.current = performance.now();
      return true;
    });
  }, [cancelClose]);

  const closeServices = useCallback(() => {
    cancelClose();
    closeTimer.current = window.setTimeout(() => {
      closeTimer.current = null;
      setServicesOpen(false);
    }, 180);
  }, [cancelClose]);

  // Nothing should be able to reopen it after the nav is gone.
  useEffect(() => cancelClose, [cancelClose]);

  // A route change must close both menus — on a static site the click navigated
  // away and unmounted the page, but here the nav survives it.
  useEffect(() => {
    cancelClose();
    setOpen(false);
    setLangOpen(false);
    setServicesOpen(false);
  }, [pathname, cancelClose]);

  // A menu that can only be closed by choosing something is a trap.
  useEffect(() => {
    if (!langOpen) return;
    const onDown = (e: MouseEvent) => {
      if (!(e.target as Element | null)?.closest('.nav__lang')) setLangOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setLangOpen(false);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [langOpen]);

  useEffect(() => {
    const el = document.getElementById('nav');
    if (!el) return;

    const clear = () => el.classList.remove('nav--light', 'nav--dark');

    const parts = pathname.split('/').filter(Boolean);
    const slug = parts[1];
    const key = slug ? pageKeyFromSlug(slug, locale) : null;

    // Off the home page the bar takes one ground for the whole page once it has
    // left the photo at the top. The services key covers the index and every
    // service detail page, since they share that URL segment.

    let frame = 0;
    const apply = () => {
      frame = 0;

      // Clear over the photo that opens the page — the home hero, or the
      // .page-hero every inner page opens with — exactly as on the home page
      // (feedback 15/10/2026). Its ::before already darkens the sky under the
      // bar for this. Effects run after React has committed the page, so the
      // hero is already in the document (or already gone) by the time this asks.
      const line = el.offsetHeight + 4;
      const hero = document.getElementById('hero') ?? document.querySelector('.page-hero');
      if (hero && hero.getBoundingClientRect().bottom > line) {
        clear();
        return;
      }

      // What is directly under the bar. Hit-testing rather than tracking every
      // section's offsets: the home page's slides are full-screen and their
      // heights move with the viewport, and this cannot go stale.
      const under = document.elementFromPoint(window.innerWidth / 2, line);
      /* Kính mờ (16/10/2026) nên CÙNG tông với thứ bên dưới: trên khối sáng
         là kính trắng chữ đen, trên khối tối là kính tối chữ trắng. Dải nền
         đặc trước đây cố ý lấy tông NGƯỢC — với kính, tông ngược thành một
         dải xám đục và chữ menu chìm. Áp cho mọi trang, không riêng trang chủ. */
      const onLight = !!under?.closest('.slide-light, .legal-doc');
      el.classList.toggle('nav--light', onLight);
      el.classList.toggle('nav--dark', !onLight);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(apply);
    };

    apply();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
      clear();
    };
  }, [pathname, locale]);

  // Which page are we on, so the same page in the other language can be linked
  // rather than dumping the visitor back on the home page.
  const segments = pathname.split('/').filter(Boolean);
  const currentSlug = segments[1];
  const currentKey = currentSlug ? pageKeyFromSlug(currentSlug, locale) : null;

  /* Trang tương ứng ở ngôn ngữ kia: đọc từ <link rel="alternate" hreflang>
     mà chính trang đó khai cho Google (16/10/2026). Trước đây đoán theo đoạn
     URL đầu tiên — trang chi tiết dịch vụ /vi-vn/dich-vu/<x> ra
     /en-us/services, một trang KHÔNG tồn tại (404), còn trang dịch vụ đứng
     riêng thì rơi về trang chủ. Thẻ alternate đúng cho mọi trang, kể cả dịch
     vụ tự thêm và bài viết. Đọc lúc mở menu: sau khi chuyển trang phía máy
     khách, <head> đã là của trang mới. */
  const [altPaths, setAltPaths] = useState<Partial<Record<Locale, string>>>({});
  useEffect(() => {
    if (!langOpen) return;
    const ra: Partial<Record<Locale, string>> = {};
    document.querySelectorAll<HTMLLinkElement>('link[rel="alternate"][hreflang]').forEach((el) => {
      const lang = el.hreflang.toLowerCase();
      const l = LOCALES.find((x) => x === lang);
      if (l) ra[l] = new URL(el.href).pathname;
    });
    setAltPaths(ra);
  }, [langOpen, pathname]);
  /* Đổi ngôn ngữ GIỮ NGUYÊN chỗ đang đọc (16/10/2026). Hai bản cùng thứ tự
     khối nhưng cao thấp khác nhau theo độ dài chữ, nên nhớ "khối thứ mấy và
     lệch bao nhiêu" chứ không nhớ số pixel. Ghi lúc bấm, đọc lại khi trang
     mới đã dựng xong (effect theo pathname — Nav sống qua mọi lần chuyển). */
  const nhoViTri = (den: string): void => {
    const khoi = [...document.querySelectorAll<HTMLElement>('main > *')];
    const vach = (document.getElementById('nav')?.offsetHeight ?? 0) + 1;
    const i = khoi.findIndex((el) => el.getBoundingClientRect().bottom > vach);
    if (i < 0) return;
    try {
      sessionStorage.setItem(GIU_VI_TRI, JSON.stringify({
        den, i, lech: khoi[i].getBoundingClientRect().top,
      }));
    } catch { /* chế độ riêng tư chặn lưu: đổi ngôn ngữ vẫn chạy, chỉ về đầu trang */ }
  };
  useEffect(() => {
    let nho: { den: string; i: number; lech: number } | null = null;
    try {
      const raw = sessionStorage.getItem(GIU_VI_TRI);
      if (raw) nho = JSON.parse(raw);
      sessionStorage.removeItem(GIU_VI_TRI);
    } catch { return; }
    if (!nho || nho.den !== pathname) return;
    const el = document.querySelectorAll<HTMLElement>('main > *')[nho.i];
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - nho.lech;
    window.scrollTo({ top, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);

  const altHref = (other: Locale): string =>
    altPaths[other]
    ?? (currentKey && currentKey !== 'services' ? pathFor(currentKey, other) : pathFor('home', other));

  return (
    // data-cms-region: nói cho chế độ sửa biết vùng này thuộc khối nào, để
    // chọn "Thanh điều hướng" ở màn CMS thì giấu đúng những vùng còn lại —
    // xem components/CmsEditor.
    <header className={open ? 'nav is-open' : 'nav'} id="nav" data-cms-region="nav">
      <Link
        className="nav__brand"
        href={pathFor('home', locale)}
        onClick={(e) => {
          /* Đang ở trang chủ thì link này trỏ về đúng địa chỉ đang mở, và
             Next coi là "đã ở đây rồi": không điều hướng, cũng KHÔNG cuộn lên.
             Người đã cuộn xuống tận dải đối tác bấm logo mà trang đứng im.
             Tự cuộn về đầu. Chừa Ctrl/Cmd/Shift-click để mở tab mới. */
          if (pathname !== pathFor('home', locale)) return;
          if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
          e.preventDefault();
          setOpen(false);
          const giamChuyenDong = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
          window.scrollTo({ top: 0, behavior: giamChuyenDong ? 'auto' : 'smooth' });
        }}
      >
        {/* Logo ĐẦY ĐỦ, không cắt mảnh nào — yêu cầu của chủ thương hiệu.
            Dòng chữ "BEE TRANSPORTATION" từng đặt cạnh đây đã bỏ: logo đã có
            sẵn chữ đó bên trong, để cả hai là in tên công ty hai lần.

            Vì thế alt KHÔNG còn rỗng nữa. Trước đây nó rỗng là đúng — chữ
            bên cạnh đã xưng tên rồi, đọc lại thành thừa. Giờ không còn chữ
            nào, alt rỗng sẽ làm cái link về trang chủ không có tên để trình
            đọc màn hình đọc lên.

            .nav__logo là height:30px + width:auto nên logo rộng 2,12:1 vào
            vừa, không bị bóp méo. Eager vì nó nằm trên màn hình đầu. */}
        {/* Hai bản mực của cùng một logo, CSS chọn bản nào theo nền thanh
            điều hướng đang đứng — xem .nav__logo--on-dark ở globals.css.
            Đầu xe và dòng "Connecting Everywhere" trong logo màu xám đen:
            trên thanh trắng chúng rõ, trên nền tối chúng biến mất, nên nền
            tối dùng bản mực trắng.

            Dựng cả hai chứ không đổi src bằng JS: nền thay đổi theo từng
            khung hình khi cuộn, đổi src sẽ là một lần tải ảnh giữa chừng và
            logo chớp mất. Ảnh thứ hai nặng thêm khoảng 30KB, tải một lần. */}
        <Image
          src={logoLockupWhite}
          alt={dict.site.name}
          sizes="70px"
          loading="eager"
          className="nav__logo nav__logo--on-dark"
        />
        {/* alt rỗng: bản trên đã xưng tên rồi, hai ảnh cùng alt sẽ làm trình
            đọc màn hình đọc tên công ty hai lần. */}
        <Image
          src={logoLockup}
          alt=""
          sizes="70px"
          loading="eager"
          className="nav__logo nav__logo--on-light"
        />
      </Link>

      <nav className="nav__links" id="navLinks">
        {/* Services ▾, then the links that stand on their own — see
            lib/navigation.ts for what goes where and why. */}
        <div
          className="nav__item"
          onMouseEnter={openServices}
          onMouseLeave={closeServices}
          onFocus={openServices}
          onBlur={(e) => {
            // Only when focus has actually left the group — moving from
            // the trigger into the list is still inside it. Keyboard
            // focus lands where it is aimed, so this closes at once.
            if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
              cancelClose();
              setServicesOpen(false);
            }
          }}
        >
          <button
            className="nav__trigger"
            type="button"
            aria-expanded={servicesOpen}
            aria-current={menu.some((m) => pathname === m.href) ? 'true' : undefined}
            onClick={() => {
              cancelClose();
              if (performance.now() - openedAt.current < TAP_GRACE_MS) return;
              setServicesOpen((v) => {
                if (!v) openedAt.current = performance.now();
                return !v;
              });
            }}
          >
            {dict.nav.services}
            <svg className="nav__caret" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>

          {servicesOpen && (
            <ul className="nav__menu">
              {menu.map((m) => (
                <li key={m.key}>
                  <Link
                    href={m.href}
                    aria-current={pathname === m.href ? 'page' : undefined}
                    onClick={() => setOpen(false)}
                  >
                    {m.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {HEADER_LINKS.map((entry) => {
          const href = entryHref(entry, locale);
          return (
            <Link
              key={entryId(entry)}
              href={href}
              aria-current={pathname === href ? 'page' : undefined}
              onClick={() => setOpen(false)}
            >
              {entryLabel(entry, dict)}
            </Link>
          );
        })}

      </nav>

      <div className="nav__lang">
        <button
          className="nav__lang-btn"
          type="button"
          aria-label={dict.nav.languageLabel}
          aria-expanded={langOpen}
          onClick={() => setLangOpen((v) => !v)}
        >
          <Flag locale={locale} />
          <svg className="nav__caret" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>

        {langOpen && (
          <ul className="nav__lang-menu">
            {LOCALES.map((other) => (
              <li key={other}>
                <Link
                  // Stay on the same page when switching language; fall back to
                  // the home page if this page has no counterpart.
                  href={altHref(other)}
                  // Không để Next cuộn lên đầu — vị trí tự đặt lại, xem nhoViTri.
                  scroll={false}
                  onClick={() => nhoViTri(altHref(other))}
                  hrefLang={other}
                  aria-current={other === locale ? 'true' : undefined}
                >
                  <Flag locale={other} />
                  {LOCALE_LABEL[other]}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Carries the service when the reader is on one of its pages, so the
          quote form opens with it already chosen — see quotePath. The anchor
          used to be the page slug, which matched no element on the page; the
          contact section is #contact. */}
      <Link
        className="btn btn--sm btn--primary nav__cta"
        href={`${quotePath(locale, serviceKeyFromPath(pathname, locale))}#contact`}
      >
        {/* Khai tên ô: 'nav.contact' cũng là "Liên hệ", và đối chiếu theo chữ
            thì nút này nhận nhầm ô đó — sửa xong nút không đổi. */}
        <span data-cms-attr="nav.cta">{dict.nav.cta}</span>
      </Link>

      <button
        className="nav__burger"
        id="navBurger"
        type="button"
        aria-label={dict.nav.openMenu}
        aria-expanded={open}
        aria-controls="navLinks"
        onClick={() => setOpen((v) => !v)}
      >
        <i />
        <i />
        <i />
      </button>
    </header>
  );
}
