import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * The share card every `opengraph-image` route draws.
 *
 * One layout, three callers — home, section page, service page — so a card
 * cannot end up with a different ground or a different logo depending on which
 * URL somebody happened to paste. The only things that change are the kicker
 * above the headline and the headline itself.
 *
 * Facebook, Zalo and LinkedIn all crop toward the centre at small sizes, so
 * nothing load-bearing sits in the outer margin: the mark is top left, the
 * headline is the middle band, and the figures are a foot that can be lost
 * without the card stopping making sense.
 */

/** Shared by every route file — Next reads these off the module. */
export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = 'image/png';

/**
 * The mark, inlined as a data URI: the renderer runs with no server up, so it
 * cannot fetch the file over HTTP the way a browser would. Read once at module
 * scope rather than per render, and named in `outputFileTracingIncludes` so it
 * survives into the deployed function.
 *
 * Logo ĐẦY ĐỦ, không cắt mảnh nào — yêu cầu của chủ thương hiệu. Logo không mở
 * cho CMS, nên đây là nguồn duy nhất.
 *
 * Bản mực trắng, vì thẻ này nền gần đen: trong bản chuẩn, đầu xe và dòng
 * "Connecting Everywhere" là màu xám đen và trên nền này chúng mờ gần hết.
 */
const LOGO_MARK = `data:image/png;base64,${readFileSync(
  join(process.cwd(), 'public/img/logo-lockup-white.png'),
).toString('base64')}`;

export interface OgCard {
  /** Small line above the headline — the section a page belongs to. */
  kicker?: string;
  /** The headline. Wraps to two lines on its own if it needs to. */
  title: string;
  /** Optional second line, set in brand orange. */
  accent?: string;
  /** The three figures ruled along the foot. */
  facts: readonly string[];
}

export function ogCard({ kicker, title, accent, facts }: OgCard) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: '#07090c',
        padding: '72px 80px',
        // The brand gradient, echoed as a glow behind the mark.
        backgroundImage:
          'radial-gradient(circle 520px at 22% 28%, rgba(242,106,27,0.22), transparent 70%), radial-gradient(circle 420px at 82% 78%, rgba(255,194,26,0.13), transparent 70%)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
        {/* eslint-disable-next-line @next/next/no-img-element -- the OG
            renderer draws plain <img>, not next/image. */}
        <img src={LOGO_MARK} alt="" width={149} height={70} />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ color: '#e9edf3', fontSize: 40, fontWeight: 700, letterSpacing: 1 }}>
            BEE
          </span>
          <span style={{ color: '#9aa5b4', fontSize: 19, letterSpacing: 7 }}>
            TRANSPORTATION
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {kicker ? (
          <span
            style={{
              color: '#f26a1b',
              fontSize: 26,
              letterSpacing: 4,
              textTransform: 'uppercase',
            }}
          >
            {kicker}
          </span>
        ) : null}
        <span style={{ color: '#ffffff', fontSize: 62, fontWeight: 700, lineHeight: 1.1 }}>
          {title}
        </span>
        {accent ? (
          <span style={{ color: '#f26a1b', fontSize: 62, fontWeight: 700, lineHeight: 1.1 }}>
            {accent}
          </span>
        ) : null}
      </div>

      <div style={{ display: 'flex', gap: 40, color: '#68717e', fontSize: 24 }}>
        {facts.map((fact) => (
          <span key={fact}>{fact}</span>
        ))}
      </div>
    </div>
  );
}

