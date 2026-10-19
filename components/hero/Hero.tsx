'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { HeroPoster } from '@/components/hero/HeroPoster';
import { dangSuaTaiCho } from '@/lib/cms-mode';
import { chayClipNghi } from '@/lib/hero/chay-clip-nghi';
import { daXemHero } from '@/lib/hero/da-xem';
import { initHeroEngine } from '@/lib/hero/engine';
import { CAPTION_BANDS } from '@/lib/hero/timing';
import type { Dictionary } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n/config';
import { imageProps } from '@/lib/image-slots';
import { pathFor } from '@/lib/routes';
import { HERO_CLIPS } from '@/lib/site';

/**
 * The hero's markup, plus the one call that hands it to the film engine.
 *
 * Everything below the `useEffect` is ordinary server-renderable markup — the
 * captions are real text in the HTML, which is the whole point of the SEO work
 * in bee-hero-DEV-HANDOFF §3. Only the driving is imperative.
 *
 * The hero is one screen, like every other slide on the page. The film plays
 * itself to its resting frame once the clips are in; the wheel and ↓ leave
 * for the next slide like anywhere else, and the ← → keys step back and forth
 * between captions — see lib/hero/engine.ts for the whole of that. Nothing
 * here needs to know which caption is up.
 */
export function Hero({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  /* Đã xem hết phim một lần thì vào thẳng khung nghỉ. Mặc định `false` để bản
     HTML dựng trên server và lần vẽ đầu ở trình duyệt giống hệt nhau — đọc
     localStorage ngay lúc render là lệch hai bên và React ném lỗi hydrate. */
  const [daXem, setDaXem] = useState(false);

  useEffect(() => {
    // Đang sửa tại chỗ thì KHÔNG chạy cỗ máy này. Nó có một vòng lặp mỗi khung
    // hình ghi thẳng opacity/transform/filter lên cả năm khung chữ — chữ đang
    // gõ dở bị mờ đi và khung khác trồi lên đè lên, nên không ai sửa nổi. CSS
    // ở chế độ sửa trải năm khung ra theo chiều dọc để sửa từng khung một.
    if (dangSuaTaiCho()) return;
    /* Đã xem rồi: KHÔNG gọi cỗ máy. Nó tải cả bốn clip ngay ở dòng đầu, nên
       dừng ở đây là tiết kiệm 3,9 MB chứ không chỉ là bỏ qua hiệu ứng.

       Đọc THẲNG localStorage trong chính effect này, không qua state. Tách ra
       một effect riêng chỉ `setDaXem` thì effect này vẫn chạy trong cùng lượt
       với `daXem` còn false — phim VẪN khởi động và VẪN tải clip, chỉ bị dẹp
       sau một lượt render nữa. Đúng lỗi "sao nó vẫn chạy lại từ đầu". */
    /* Đã xem rồi: vào thẳng khung nghỉ, và tự chạy clip nền ở đây vì cỗ máy
       KHÔNG khởi động nữa nên không ai chạy nó hộ. */
    if (daXemHero()) {
      setDaXem(true);
      const v = document.getElementById('heroRestVideo');
      return v instanceof HTMLVideoElement ? chayClipNghi(v) : undefined;
    }
    // React 19 StrictMode mounts effects twice in development. The disposer is
    // what makes that harmless: without it the second mount would leave a
    // second rAF loop running and fetch every clip again.
    const dispose = initHeroEngine({ sources: HERO_CLIPS });
    return dispose;
  }, []);

  return (
    <section
      className={daXem ? 'hero is-rest' : 'hero'}
      id="hero"
      aria-label={dict.hero.videoAlt}
    >
        <div className="hero__sticky">
          {/* Layer 0 — K3c. Pure CSS: no image, no request. The video sits on
              top and fades away over the last stretch of the film, leaving
              this as the hero's resting state. */}
          <div className="hero-backdrop" aria-hidden="true" />

          {/* Khung nghỉ: chỗ phim dừng lại. Trước đây đây là nền CSS thuần, tức
              là một màn hình đen — xong hiệu ứng thì trang chủ tối thui. Ảnh
              này nằm trên nền đó và dưới video; cỗ máy làm nó hiện dần đúng
              quãng video mờ đi, nên là một lần chuyển chứ không phải một cú
              cắt. `priority` CHỈ khi đã xem rồi: lúc đó nó là ảnh đầu tiên
              người ta thấy, còn lần đầu thì poster mới là ảnh phải tới trước. */}
          <div className="hero-rest" id="heroRest" aria-hidden="true">
            <Image
              {...imageProps('heroRest', dict.images)}
              alt=""
              className="hero-rest__img"
              priority={daXem}
              sizes="100vw"
              quality={72}
              /* Đi THẲNG, không qua bộ tối ưu ảnh của Vercel. Hạn mức tối ưu
                 của dự án đã hết: ảnh cũ đã tối ưu sẵn vẫn phục vụ được, còn
                 mọi ảnh MỚI thêm vào đều trả 402
                 OPTIMIZED_IMAGE_REQUEST_PAYMENT_REQUIRED — tức là một thẻ <img>
                 hỏng. Lớp này là nền trang trí và có clip đè lên ngay sau đó,
                 nên đổi 100 KB jpg gốc lấy việc nó hiện được là đáng. */
              unoptimized
            />
            {/* Clip bước 3 — cảnh đóng container — chạy lặp phía sau khung chữ
                cuối. Ảnh ở trên là lớp hiện NGAY trong lúc clip này tải, nên
                không có khoảnh khắc nào trống.

                `preload="none"`: không tải một byte nào cho tới khi có người
                gọi play(). Lần đầu thì cỗ máy gọi lúc phim sắp hết; lần sau đã
                xem rồi thì `autoPlay` tự gọi — và lúc đó đây là clip DUY NHẤT
                được tải, 0,8 MB thay cho 3,9 MB của cả bộ phim. */}
            <video
              id="heroRestVideo"
              className="hero-rest__video"
              src={HERO_CLIPS[2]}
              loop
              muted
              playsInline
              preload="none"
              autoPlay={daXem}
              disablePictureInPicture
            />
            {/* Cùng lớp phủ với lúc phim đang chạy. `.hero__vignette` nằm TRONG
                `.hero__stage` nên nó tan đi cùng video, còn ánh sáng của
                `.hero-backdrop` thì bị lớp này che mất — không có nó thì chữ
                trắng nằm trên một đoạn phim sáng, không đọc được. */}
            <div className="hero__vignette" />
          </div>

          <div className="hero__stage" aria-hidden="true">
            {/* One <video> per clip, in play order — the engine pairs these
                with HERO_CLIPS by position. */}
            {HERO_CLIPS.map((src, i) => (
              <video
                key={src}
                className={i === 0 ? 'hero__video is-active' : 'hero__video'}
                muted
                playsInline
                preload="auto"
                disablePictureInPicture
              />
            ))}
            <div className="hero__vignette" />
          </div>

          {/* Painted immediately; the engine fades it out once the clips
              can take over. */}
          <HeroPoster dict={dict} />

          <div className="hero__overlays" id="heroOverlays">
            {dict.hero.captions.map((cap, i) => {
              const band = CAPTION_BANDS[i]!;
              const Title = i === 0 ? 'h1' : 'h2';
              const isLast = i === dict.hero.captions.length - 1;
              return (
                <div
                  key={cap.title + cap.eyebrow}
                  className="cap"
                  data-from={band.from}
                  data-to={band.to}
                >
                  <div className="cap__eyebrow">
                    <i />
                    {cap.eyebrow}
                  </div>
                  <Title className="cap__title">
                    {cap.title} <span>{cap.titleAccent}</span>
                  </Title>
                  <p className="cap__sub">{cap.sub}</p>
                  {/* The resting caption carries the call to action — this is
                      where the hero comes to rest (K3c handoff §1). */}
                  {isLast && (
                    <Link className="btn btn--primary cap__cta" href={pathFor('contact', locale)}>
                      {dict.hero.cta}
                    </Link>
                  )}
                </div>
              );
            })}
          </div>

          <div className="hero__hud" aria-hidden="true">
            <div className="hud__chapters">
              {dict.hero.chapters.map((label, i) => (
                <span
                  key={label}
                  className={i === 0 ? 'hud__chapter is-on' : 'hud__chapter'}
                  data-ch={i}
                >
                  {label}
                </span>
              ))}
            </div>
            <div className="hud__track">
              <i id="heroProgress" />
            </div>
          </div>

          <div className="hero__hint" id="heroHint" aria-hidden="true">
            <span>{dict.hero.hint}</span>
            <div className="mouse">
              <i />
            </div>
          </div>
        </div>
    </section>
  );
}
