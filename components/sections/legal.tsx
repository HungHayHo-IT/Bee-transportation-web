import type { ReactNode } from 'react';

import { Reveal } from '@/components/Reveal';
import type { Dictionary, LegalPage, LegalSection } from '@/lib/i18n/types';
import { contactPhones } from '@/lib/representatives';
import { ORG } from '@/lib/site';
import { vanPhongDau } from '@/lib/offices';
import { chiaInDam, phanTichThan } from '@/lib/than-dieu';

function inDam(text: string): ReactNode[] {
  return chiaInDam(text).map(({ dam, chu }, i) =>
    (dam ? <strong key={i}>{chu}</strong> : <span key={i}>{chu}</span>),
  );
}

/**
 * Than cua mot dieu: cac doan ngan cach bang mot dong trong, va khoi nao gom
 * toan dong bat dau bang `- ` thi thanh danh sach.
 *
 * `khoa` la ma o trong tu dien. Gan san vao DOM luc dung trang chu khong de
 * lop phu tu do: lop phu nhan ra o bang cach so NGUYEN VAN mot nut chu voi gia
 * tri trong tu dien, ma than dieu co `**in dam**` hay gach dau dong thi bi che
 * ra nhieu nut, khong nut nao bang ca than. Hau qua: dieu do khong bam chon
 * duoc tren khung xem truoc, VA go vao o cua no ben phai thi khung xem truoc
 * khong doi gi cho toi khi bam Luu.
 *
 * Gan o day khong bat trang phai dung dong: chi so dieu va ten trang deu biet
 * tu du lieu, khong doc tham so URL hay cookie — khac voi li do neu o dau
 * CmsEditor.
 */
function ThanDieu({ body, khoa }: { body: string; khoa: string }): ReactNode {
  return (
    <div className="legal-doc__than" data-cms-key={khoa} data-cms-rich="">
      {phanTichThan(body).map((m, i) =>
        (m.gach ? (
          <ul key={i}>
            {m.dong.map((d, j) => (
              <li key={j}>{inDam(d.slice(2))}</li>
            ))}
          </ul>
        ) : (
          <p key={i}>{inDam(m.dong.join('\n'))}</p>
        )),
      )}
    </div>
  );
}

/**
 * Clauses in the runs their `group` marks out. A page that sets no group at all
 * comes back as a single unnamed run, which is what the privacy page is.
 */
function groupClauses(sections: readonly LegalSection[]) {
  const runs: { name?: string; items: { section: LegalSection; so: number }[] }[] = [];
  sections.forEach((section, so) => {
    if (section.group || runs.length === 0) runs.push({ name: section.group, items: [] });
    runs[runs.length - 1]!.items.push({ section, so });
  });
  return runs;
}

/**
 * The privacy and terms pages share a shape — a dated preamble, numbered
 * clauses, and the company's contact details at the end — so they share a
 * component.
 *
 * A document rather than a deck: these are read top to bottom and referred back
 * to, so the page scrolls normally however many clauses it grows to. It is also
 * the one light page on a dark site, which is what a document wants to be.
 *
 * Terms outgrew a flat list once the service conditions landed, so clauses now
 * run in named groups. Numbering stays continuous across them — the counter is
 * reset on the wrapper, not on each list — because clauses are cited by number
 * and restarting at each heading would give the page several clause 1s.
 *
 * Neither page carries a draft banner any more. The branch stays because
 * `draftNotice` is what marks a page provisional: set it in the dictionary and
 * the banner comes back, unset it and the page reads as settled policy.
 */
export async function LegalDocument({
  page,
  khoaGoc,
  site,
  trail,
}: {
  page: LegalPage;
  /** Tien to ma o trong tu dien, vi du 'legal.privacy.sections'. */
  khoaGoc: string;
  /** Thông tin công ty, lấy từ từ điển nên CMS sửa được — xem Dictionary.site. */
  site: Dictionary['site'];
  /** Rides at the head of the document, which is the only light ground here. */
  trail?: ReactNode;
}) {
  const phones = contactPhones(site);
  /** Trụ sở là văn phòng ĐANG HIỆN đứng đầu — xem lib/offices.ts. */
  const tru_so = vanPhongDau(site.offices);
  const runs = groupClauses(page.sections);
  /* Group headings take the h2, so clauses drop to h3 — but only on a page that
     has groups, or the privacy page would skip a level for no reason. */
  const grouped = runs.some((run) => run.name);

  return (
    <article className="legal-doc">
      <div className="wrap legal-doc__head">
        {trail}
        <p className="legal-doc__updated">{page.updated}</p>
      </div>

      <div className="wrap wrap--narrow legal-doc__body">
        <Reveal>
          <h1 className="legal-doc__title">
            {page.title} {page.titleAccent}
          </h1>
        </Reveal>

        {page.draftNotice && (
          <Reveal>
            <p className="legal-doc__draft" role="note">
              {page.draftNotice}
            </p>
          </Reveal>
        )}

        {/* Numbered because the clauses are referred to by number. The marker
            carries the number rather than the copy repeating it. */}
        <div className="legal-doc__clauses">
          {runs.map((run, runIndex) => (
            <section key={run.name ?? runIndex} className="legal-doc__run">
              {run.name && (
                <Reveal as="h2" className="legal-doc__group">
                  {run.name}
                </Reveal>
              )}
              <ol className="legal-doc__list">
                {run.items.map(({ section, so }, i) => (
                  <Reveal
                    as="li"
                    key={section.name}
                    delayIndex={i}
                    className="legal-doc__item"
                    /* `id` de dan duoc thang toi mot dieu. Trang xoa tai khoan
                       cua Google Play va App Store doi mot dia chi tro DUNG
                       cho huong dan xoa, khong phai dau trang. */
                    id={section.id || undefined}
                  >
                    {grouped ? <h3>{section.name}</h3> : <h2>{section.name}</h2>}
                    <ThanDieu body={section.body} khoa={`${khoaGoc}.${so}.body`} />
                  </Reveal>
                ))}
              </ol>
            </section>
          ))}
        </div>

        <Reveal className="legal-doc__contact">
          <h2>{page.contactHeading}</h2>
          <p>{page.contactBody}</p>
          <p className="legal-doc__lines">
            <a href={`mailto:${site.email}`}>{site.email}</a>
            {/* The same list the footer and the contact page show. A legal page
                naming a number nobody answers is worse than most stale copy. */}
            {phones.map((phone) => (
              <a key={phone.key} href={phone.href}>
                <span data-cms-attr="site.phoneNumber">{phone.display}</span>
                {phone.name ? <> - {phone.name}</> : null}
              </a>
            ))}
            <span>
              {site.name}
              {tru_so ? ` — ${tru_so.street}, ${tru_so.city}` : null}
            </span>
          </p>
        </Reveal>
      </div>
    </article>
  );
}
