import { SERVICE_KEYS } from './services';

/**
 * Nhãn tiếng Anh của danh sách trang và danh sách khối trong màn CMS.
 *
 * Để riêng khỏi content-sections.ts thay vì gắn thêm hai trường vào từng mục:
 * file kia đã dài, và mỗi mục ở đó có bốn dòng giải thích — chèn thêm
 * labelEn/hintEn vào giữa làm phần giải thích bị đẩy xa khỏi thứ nó giải
 * thích. Ở đây chỉ có chữ, tra theo khoá.
 *
 * Vì sao cần: người biên tập bấm sang tab Tiếng Anh là đang làm việc trong
 * tiếng Anh. Để nhãn tiếng Việt quanh nội dung tiếng Anh bắt họ dịch ngược
 * trong đầu ở mọi dòng, và với người không đọc được tiếng Việt thì cả màn hình
 * không dùng được.
 *
 * Khoá nào thiếu ở đây thì rơi về nhãn tiếng Việt — thà một dòng lệch ngôn ngữ
 * còn hơn một dòng trống không nói được nó là cái gì.
 */

export interface NhanEn {
  label: string;
  hint: string;
}

/** Tên tiếng Anh của từng dịch vụ, dùng cho nhãn trang và nhãn khối. */
const TEN_DICH_VU: Record<string, string> = {
  consulting: 'Transport consulting',
  domestic: 'Domestic transportation',
  multimodal: 'Multimodal transport',
  project: 'Project & heavy-lift cargo',
  lifting: 'Lifting & relocation',
  packing: 'Crating & packing',
  crossborder: 'Transit & cross-border',
  leasing: 'Equipment leasing',
  customs: 'Customs clearance',
};

const GOI_Y_TRANG_DICH_VU = 'The detail page for this service';
const GOI_Y_KHOI_DICH_VU =
  'This service page, and the name shown on its card on the home page. ' +
  'Clearing a step name under "How we deliver" removes that step from the page.';

export const TRANG_EN: Record<string, NhanEn> = {
  nav: {
    label: 'Navigation bar',
    hint: 'On every page — the top bar and the logo',
  },
  footer: {
    label: 'Footer',
    hint: 'On every page — link columns and the copyright line',
  },
  site: {
    label: 'Company details',
    hint: 'Name, email, phone, addresses — shown in the footer, on Contact and on both legal pages',
  },
  meta: {
    label: 'SEO tags',
    hint: 'Title and description shown on Google — nowhere on the page itself',
  },
  og: {
    label: 'Social share card',
    hint: 'Text drawn on the image shown when a link is pasted into Facebook or Zalo',
  },
  home: {
    label: 'Home page',
    hint: 'Hero, about, service cards, partners, team',
  },
  capabilities: {
    label: 'Capabilities page',
    hint: 'Fleet, process, order tracking, lifting, customs',
  },
  warehousing: {
    label: 'Warehousing page',
    hint: 'The whole Warehousing page',
  },
  crossborder: {
    label: 'Cross-border page',
    hint: 'The whole Cross-border page',
  },
  blog: {
    label: 'Newsroom page',
    hint: 'The article listing page',
  },
  contact: {
    label: 'Contact page',
    hint: 'The whole Contact page, including the quote form',
  },
  privacy: {
    label: 'Privacy policy page',
    hint: 'The whole Privacy policy page',
  },
  terms: {
    label: 'Terms of service page',
    hint: 'The whole Terms of service page',
  },
  ...Object.fromEntries(
    SERVICE_KEYS.map((k) => [
      `service.${k}`,
      { label: `Service — ${TEN_DICH_VU[k] ?? k}`, hint: GOI_Y_TRANG_DICH_VU },
    ]),
  ),
};

export const MUC_EN: Record<string, NhanEn> = {
  nav: { label: 'Navigation bar', hint: 'The names of the items in the top bar' },
  footer: {
    label: 'Footer',
    hint: 'Link columns and the copyright line at the bottom of every page',
  },
  social: {
    label: 'Social channels',
    hint:
      'Channel addresses, shown as a row of icons under the logo in the footer. ' +
      'Leave one empty and that channel disappears. Type the full https:// prefix.',
  },
  site: {
    label: 'Company details',
    hint: 'Name, email, phone and addresses — shown in the footer, on Contact and on both legal pages',
  },
  meta: {
    label: 'SEO tags',
    hint: 'Title and description shown on Google — NOT on the page',
  },
  og: {
    label: 'Social share card',
    hint: 'Text on the image shown when a link is pasted into Facebook or Zalo — NOT on the page',
  },
  preloader: { label: 'Loading screen', hint: 'The line shown while the hero video loads' },
  hero: { label: 'Home hero', hint: 'Five captions timed to the video at the top of the page' },
  marquee: { label: 'Scrolling strip', hint: 'The line that scrolls sideways under the hero' },
  about: { label: 'About', hint: 'The two company introduction blocks' },
  partners: { label: 'Partners', hint: 'The partner logo strip' },
  appDownload: {
    label: 'App download',
    hint: 'QR code, Google Play / App Store buttons and phone image — below the partners. The QR code is generated from the links; a button without a link is not clickable',
  },
  homeFaq: { label: 'FAQ', hint: 'The expandable questions on the home page — add, remove, reorder' },
  team: { label: 'Team', hint: 'The representatives block' },
  fleet: { label: 'Fleet', hint: 'The truck and trailer table' },
  tracking: {
    label: 'Order tracking',
    hint: 'The tracking block — on Capabilities and on the Domestic transportation page',
  },
  lifting: {
    label: 'Lifting',
    hint: 'The lifting block — on Capabilities and on the Lifting & relocation page',
  },
  customs: {
    label: 'Customs',
    hint: 'The customs block — on Capabilities and on the Customs clearance page',
  },
  trust: {
    label: 'Commitments block',
    hint: 'The "why choose us" block — on all nine service pages and on Warehousing',
  },
  why: { label: 'Why BeeOps', hint: 'The reasons block on the Capabilities page' },
  process: {
    label: 'Process (unused)',
    hint: 'No page uses this branch today. The real process steps live inside each service.',
  },
  services: {
    label: 'Services block (shared parts)',
    hint:
      'The block heading and the card button label on the home page. Each service’s own name ' +
      'and photo live in that service’s section — or click the card on the page itself.',
  },
  warehousing: {
    label: 'Warehousing page content',
    hint: 'All the text and images on this page',
  },
  crossborder: {
    label: 'Cross-border content',
    hint: 'The Cross-border page, and part of it reused on the Transit & cross-border service page',
  },
  blog: { label: 'Newsroom content', hint: 'The headings and text around the article list' },
  contact: { label: 'Contact page content', hint: 'The page text and the whole quote form' },
  'legal.privacy': {
    label: 'Privacy policy content',
    hint: 'Every clause on this page',
  },
  'legal.terms': {
    label: 'Terms of service content',
    hint: 'Every clause on this page',
  },
  ...Object.fromEntries(
    SERVICE_KEYS.map((k) => [
      `services.items.${k}`,
      { label: `Service content — ${TEN_DICH_VU[k] ?? k}`, hint: GOI_Y_KHOI_DICH_VU },
    ]),
  ),
};
