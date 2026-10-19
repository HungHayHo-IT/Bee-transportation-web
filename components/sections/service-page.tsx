import type { Metadata } from 'next';

import { JsonLd } from '@/components/JsonLd';
import { Reveal } from '@/components/Reveal';
import { CtaBand } from '@/components/sections';
import {
  ServiceHero,
  ServiceProblems,
  ServiceProcess,
  ServiceUsps,
} from '@/components/sections/service';
import {
  CrossBorder,
  Customs,
  Lifting,
  Tracking,
} from '@/components/sections/capability';
import { getContent, type Dictionary } from '@/lib/i18n';
import { HTML_LANG, LOCALES, DEFAULT_LOCALE, type Locale } from '@/lib/i18n/config';
import {
  coTrangRieng, duongDanDichVuThem, pathFor, pathForService, quotePath, serviceAlternates,
} from '@/lib/routes';
import { shareImage } from '@/lib/seo';
import { SERVICE_KEYS, type KhoaDichVu, type ServiceKey } from '@/lib/services';
import { fetchDichVuThem, slugThem } from '@/lib/services-them';
import { contactPhones } from '@/lib/representatives';
import Image from 'next/image';
import { imageProps } from '@/lib/image-slots';

/**
 * "Khảo sát hàng hoá: kích thước, trọng lượng…" -> nhãn + nội dung. Nhãn chỉ
 * nhận khi phần trước dấu hai chấm NGẮN (≤ 40 ký tự) — dấu hai chấm giữa một
 * câu dài là văn, không phải nhãn.
 */
function tachNhan(dong: string): { nhan: string | null; noiDung: string } {
  const i = dong.indexOf(':');
  if (i <= 0 || i > 40) return { nhan: null, noiDung: dong };
  const noiDung = dong.slice(i + 1).trim();
  return noiDung ? { nhan: dong.slice(0, i).trim(), noiDung } : { nhan: null, noiDung: dong };
}

/** Khoá này có phải một trong chín dịch vụ viết trong code không. */
function laKhoaGoc(key: KhoaDichVu): key is ServiceKey {
  return (SERVICE_KEYS as readonly string[]).includes(key);
}
import { ORG, SITE_URL } from '@/lib/site';

/**
 * Trang của một dịch vụ, dùng chung cho HAI tuyến đường dẫn.
 *
 * Phần lớn dịch vụ nằm dưới /dich-vu/<slug> và do route con dựng. Vận chuyển
 * nội địa có trang riêng ở cấp một, do route bắt-tất cấp một dựng. Hai route
 * khác nhau nhưng trang thì phải giống hệt nhau — nên nội dung trang nằm ở
 * đây chứ không nằm trong một trong hai route, để không có chuyện sửa một bên
 * rồi bên kia ở lại phía sau.
 */

export async function serviceMetadata(locale: Locale, key: KhoaDichVu): Promise<Metadata> {
  const entry = (await getContent(locale)).services.items[key];
  /* Dịch vụ tự thêm: đường dẫn theo từng ngôn ngữ nằm ở BeeOps chứ không trong
     bảng slug của code, nên bản dịch khác ngôn ngữ phải hỏi lại danh sách. */
  const them = entry.slug
    ? (await fetchDichVuThem()).find((sv) => sv.key === key) ?? null
    : null;
  const duongDanTheoNgonNgu = (l: Locale): string =>
    them ? duongDanDichVuThem(slugThem(them, l), l) : pathForService(key as ServiceKey, l);

  const path = duongDanTheoNgonNgu(locale);
  const bySegment = them ? null : serviceAlternates(key as ServiceKey);

  const languages: Record<string, string> = {};
  for (const other of LOCALES) {
    languages[HTML_LANG[other]] = bySegment ? bySegment[other]! : duongDanTheoNgonNgu(other);
  }
  languages['x-default'] = duongDanTheoNgonNgu(DEFAULT_LOCALE);

  return {
    title: entry.meta.title,
    description: entry.meta.description,
    alternates: { canonical: path, languages },
    openGraph: {
      type: 'website',
      siteName: ORG.name,
      locale: HTML_LANG[locale].replace('-', '_'),
      url: `${SITE_URL}${path}`,
      title: `${entry.meta.title} — ${ORG.shortName}`,
      description: entry.meta.description,
      images: shareImage(path, entry.meta.title),
    },
    twitter: {
      card: 'summary_large_image',
      title: `${entry.meta.title} — ${ORG.shortName}`,
      description: entry.meta.description,
      images: shareImage(path, entry.meta.title),
    },
  };
}

export function ServicePageBody({
  locale,
  dict,
  service: key,
}: {
  locale: Locale;
  dict: Dictionary;
  service: KhoaDichVu;
}) {
  const entry = dict.services.items[key];
  const s = dict.services;

  /**
   * Where a service is backed by a capability section, show it rather than
   * saying the same thing again in different words. Each section appears on
   * exactly one service page — two pages sharing one would be duplicate
   * content competing with itself.
   */
  /* Khoá chuỗi chứ không phải Record<ServiceKey, …>: dịch vụ tự thêm chưa có
     khối năng lực nào đi kèm, tra ra `undefined` là đúng. */
  const related: Record<string, React.ReactNode> = {
    lifting: <Lifting dict={dict} />,
    customs: <Customs dict={dict} />,
    crossborder: <CrossBorder dict={dict} />,
    domestic: <Tracking dict={dict} />,
  };

  const homePath = pathFor('home', locale);
  /* Dịch vụ tự thêm mang sẵn đoạn URL trong từ điển; chín dịch vụ gốc tra bảng. */
  const duongDan = entry.slug
    ? duongDanDichVuThem(entry.slug, locale)
    : pathForService(key as ServiceKey, locale);

  /**
   * Vụn đường dẫn: dịch vụ đứng riêng KHÔNG có "Dịch vụ" ở giữa, vì nó không
   * nằm dưới mục đó nữa — khai một cấp cha mà URL không có là nói sai với
   * Google về cấu trúc site.
   */
  /* Dịch vụ tự thêm luôn nằm dưới mục Dịch vụ; chỉ chín dịch vụ gốc mới có
     đứa được cho ra trang riêng cấp một. */
  const vun = laKhoaGoc(key) && coTrangRieng(key)
    ? [{ '@type': 'ListItem', position: 2, name: entry.name }]
    : [
        { '@type': 'ListItem', position: 2, name: dict.nav.services },
        { '@type': 'ListItem', position: 3, name: entry.name },
      ];

  return (
    <>
      <ServiceHero dict={dict} service={key} />
      <ServiceProblems dict={dict} service={key} />
      <ServiceProcess dict={dict} service={key} />
      <ServiceUsps dict={dict} service={key} />

      {/* Phạm vi dịch vụ và Câu hỏi thường gặp, dựng lại 30/09/2026.
          Gỡ ngày 14/09/2026 nhưng `points` và `faqs` vẫn nằm nguyên trong từ
          điển, nên suốt hai tuần đó màn CMS bày ra 82 ô cho người biên tập sửa
          mà không trang nào hiện — kể cả form "Thêm dịch vụ" vẫn bắt điền ba
          câu hỏi cho mỗi dịch vụ mới. Giữ dữ liệu mà bỏ chỗ hiện là để lại một
          cái bẫy.
          Breadcrumb hiển thị thì KHÔNG dựng lại: nó bị gỡ theo yêu cầu, không
          phải vì lỡ quên. */}
      {/* Hai slide riêng, mỗi slide cao một màn (CSS .service-detail). Chung
          một khối thì nó cao 1055–1197px, và SlidePager đi từng màn trong đó:
          cuộn xuống dừng một chỗ, cuộn lên dừng chỗ khác. */}
      {/* Phạm vi: lưới thẻ hai cột thay cho danh sách gạch đầu dòng trơ
          (feedback 15/10/2026 — khối cũ trống trải). Số thứ tự trong ô cam
          thay cho biểu tượng: mỗi dòng phạm vi là chữ tự do do CMS nhập, không
          có loại nào để gắn biểu tượng cho đúng. */}
      {/* Phạm vi theo Figma (16/10/2026): danh sách nhãn | nội dung bên
          trái, ảnh xe lớn tràn mép phải. Chữ lấy từ `points` của TỪNG dịch vụ
          nên tự đổi theo trang; ảnh là một ô CMS chung (scopeTruck).
          Mỗi dòng viết "Nhãn: nội dung" thì phần trước dấu hai chấm thành
          nhãn cam; dòng không có nhãn thì hiện số thứ tự thay. */}
      {entry.points?.length ? (
        <section className="section service-detail service-scope">
          <div className="wrap service-scope__grid">
            <div>
              <Reveal>
                <h2 className="page-slide__title">{entry.scopeHeading ?? s.scopeHeading}</h2>
              </Reveal>
              <Reveal as="dl" className="scope-list">
                {entry.points.map((point, i) => {
                  const { nhan, noiDung } = tachNhan(point);
                  return (
                    <div className="scope-list__row" key={point}>
                      <dt>{nhan ?? String(i + 1).padStart(2, '0')}</dt>
                      <dd>{noiDung}</dd>
                    </div>
                  );
                })}
              </Reveal>
            </div>
            <div className="service-scope__figure" aria-hidden="true">
              <Image
                {...imageProps('scopeTruck', dict.images)}
                alt=""
                fill
                sizes="(max-width: 860px) 100vw, 50vw"
                /* PNG gốc, không qua nén WebP/AVIF q75: nén làm lấm tấm vùng nền
                   phẳng, và mép ảnh hiện thành một khung mờ trên nền tối. */
                unoptimized
                className="service-scope__img"
              />
            </div>
          </div>
        </section>
      ) : null}

      {/* Câu hỏi thường gặp: hai cột — tiêu đề kèm thẻ liên hệ bên trái, câu
          hỏi mở/đóng bên phải (feedback 15/10/2026). <details> của trình
          duyệt, không JS: câu trả lời vẫn nằm trong HTML cho máy tìm kiếm và
          cho dữ liệu FAQPage. Câu đầu mở sẵn để không ai gặp một khối toàn
          dòng gập. */}
      {entry.faqs?.length ? (
        <section className="section service-detail service-faq">
          <div className="wrap service-faq__grid">
            <Reveal className="service-faq__aside">
              <h2 className="page-slide__title">{entry.faqHeading ?? s.faqHeading}</h2>
              <p className="service-faq__lead">{s.faqLead}</p>
              <div className="faq-cta">
                <p className="faq-cta__title">{s.faqCtaTitle}</p>
                <p className="faq-cta__body">{s.faqCtaBody}</p>
                <a className="btn btn--sm btn--primary" href={`${quotePath(locale, key)}#contact`}>
                  {s.faqCtaButton} →
                </a>
                {contactPhones(dict.site)[0] ? (
                  <a className="faq-cta__phone" href={contactPhones(dict.site)[0].href}>
                    {contactPhones(dict.site)[0].display}
                    {contactPhones(dict.site)[0].name ? ` · ${contactPhones(dict.site)[0].name}` : null}
                  </a>
                ) : null}
              </div>
            </Reveal>
            <Reveal className="faq-list">
              {entry.faqs.map((faq, i) => (
                <details className="faq-item" key={faq.q} open={i === 0}>
                  <summary>
                    <span className="faq-item__no" aria-hidden="true">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="faq-item__q">{faq.q}</span>
                    <span className="faq-item__toggle" aria-hidden="true" />
                  </summary>
                  <p className="faq-item__a">{faq.a}</p>
                </details>
              ))}
            </Reveal>
          </div>
        </section>
      ) : null}

      {related[key]}

      <CtaBand locale={locale} dict={dict} service={key} />

      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: entry.name,
            description: entry.meta.description,
            serviceType: entry.meta.title,
            provider: { '@id': `${SITE_URL}/#organization` },
            areaServed: 'VN',
            url: `${SITE_URL}${duongDan}`,
          },
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: ORG.shortName,
                item: `${SITE_URL}${homePath}`,
              },
              ...vun,
            ],
          },
          /* FAQPage ĐI KÈM khối FAQ hiển thị, không tách rời được: Google đòi
             structured data dạng FAQ phải khớp với nội dung người đọc nhìn
             thấy trên trang. Bỏ khối mà giữ JSON-LD là vi phạm chính sách rich
             result; nay khối đã về thì JSON-LD cũng về. */
          ...(entry.faqs?.length
            ? [{
                '@context': 'https://schema.org',
                '@type': 'FAQPage',
                mainEntity: entry.faqs.map((faq) => ({
                  '@type': 'Question',
                  name: faq.q,
                  acceptedAnswer: { '@type': 'Answer', text: faq.a },
                })),
              }]
            : []),
        ]}
      />
    </>
  );
}
