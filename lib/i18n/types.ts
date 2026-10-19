/**
 * The shape every locale must fill. Declared explicitly rather than inferred
 * from the Vietnamese file so that fixed-length lists stay fixed: the hero has
 * exactly five captions and exactly four chapters because the scrub engine and
 * the stylesheet are built around those counts, and a locale that supplied six
 * would break the hero rather than just read oddly.
 */

import type { ServiceKey } from '../services';

type Tuple5<T> = readonly [T, T, T, T, T];
type Tuple4<T> = readonly [T, T, T, T];
type Tuple3<T> = readonly [T, T, T];

export interface HeroCaption {
  readonly eyebrow: string;
  /** Rendered plain. */
  readonly title: string;
  /** Rendered in the gradient accent style, after `title`. */
  readonly titleAccent: string;
  readonly sub: string;
}

export interface NamedBody {
  readonly name: string;
  readonly body: string;
}

export interface Stat {
  readonly to: number;
  readonly suffix: string;
  readonly label: string;
}

export interface MetaEntry {
  readonly title: string;
  readonly description: string;
}

/** A label/value pair — the spec rows on a warehouse or equipment card. */
export interface SpecItem {
  readonly label: string;
  readonly value: string;
}

export interface WarehouseCard {
  readonly name: string;
  readonly specs: readonly SpecItem[];
}

/**
 * One service line. `name` and `body` are the card on the services index; the
 * rest is the detail page. `points` is optional on purpose — it is filled only
 * where the company profile deck actually supplies the detail, rather than
 * padded out with invented prose.
 */
export interface Faq {
  readonly q: string;
  readonly a: string;
}

export interface ServiceEntry {
  readonly name: string;
  /** One-line summary — the card on the services index. */
  readonly body: string;
  /** Opening paragraph of the detail page: what the service is actually for. */
  readonly intro: string;
  /** What goes wrong for shippers without it. */
  readonly problems: readonly NamedBody[];
  /** How the work is actually run, in order. */
  readonly approach: readonly NamedBody[];
  /** Why us — every claim traceable to the company profile deck. */
  readonly usps: readonly NamedBody[];
  /** Scope list. Present only where the deck supplies one. */
  readonly points?: readonly string[];
  /** Feeds both the page and its FAQPage structured data. */
  readonly faqs: readonly Faq[];
  readonly meta: MetaEntry;
  /**
   * Tiêu đề các khối của trang dịch vụ — RIÊNG từng dịch vụ (13/10/2026).
   * Trước đây chín trang đọc chung `services.problemsHeading`, nên sửa tiêu đề
   * ở một trang là cả chín trang đổi theo. Để trống trong từ điển: lúc dựng
   * bản mặc định, getBaseContent điền bằng tiêu đề chung (xem tieuDeRieng).
   */
  readonly problemsHeading?: string;
  readonly approachHeading?: string;
  readonly scopeHeading?: string;
  readonly faqHeading?: string;

  /**
   * Hai trường sau CHỈ có ở dịch vụ người dùng tự thêm (xem lib/services-them).
   * Chín dịch vụ gốc để trống: đường dẫn của chúng nằm trong lib/services.ts.
   *
   * Đây là DỮ LIỆU ĐỊNH TUYẾN chứ không phải chữ nghĩa, nên màn CMS lọc chúng
   * ra khỏi danh mục ô và backend chặn ghi đè — sửa được `slug` qua CMS là gãy
   * mọi đường link đã phát ra ngoài.
   */
  readonly slug?: string;
  /** Mã dịch vụ bên BeeOps, để form báo giá gửi đúng dịch vụ. */
  readonly code?: string;
}

/**
 * A clause. `group` opens a new run of clauses under a heading; leave it off
 * and the clause continues the run above it. Numbering is continuous
 * across groups, so a grouped page still has one clause 12.
 */
export interface LegalSection extends NamedBody {
  readonly group?: string;
  /**
   * Mo neo de dan thang toi dieu nay (`/vi-vn/chinh-sach...#xoa-tai-khoan`).
   *
   * Google Play va App Store doi mot dia chi tro DUNG cho huong dan xoa tai
   * khoan, khong phai dau trang chinh sach.
   */
  readonly id?: string;
}

export interface LegalPage {
  readonly eyebrow: string;
  readonly title: string;
  readonly titleAccent: string;
  readonly updated: string;
  /**
   * A banner over the clauses. Both pages carried one while they were drafts;
   * neither sets it now. Kept optional rather than deleted so a page can be
   * marked provisional again — a rewrite awaiting review — without the type
   * and the component having to come back.
   */
  readonly draftNotice?: string;
  readonly sections: readonly LegalSection[];
  readonly contactHeading: string;
  readonly contactBody: string;
  readonly meta: MetaEntry;
}

export interface Dictionary {
  readonly nav: {
    readonly about: string;
    readonly services: string;
    readonly capabilities: string;
    readonly warehousing: string;
    readonly crossborder: string;
    readonly blog: string;
    readonly contact: string;
    readonly cta: string;
    readonly privacy: string;
    readonly terms: string;
    readonly skipToContent: string;
    readonly callNow: string;
    readonly openMenu: string;
    readonly languageLabel: string;
  };
  /**
   * Địa chỉ các kênh mạng xã hội. Để trống là kênh đó không hiện.
   *
   * Chỉ có ĐỊA CHỈ ở đây; danh sách kênh và biểu tượng nằm trong lib/social.ts,
   * vì mỗi kênh cần một hình vẽ riêng.
   */
  readonly social: {
    /** Nhãn của cả hàng, cho trình đọc màn hình. */
    readonly label: string;
    readonly facebook: string;
    readonly zalo: string;
    readonly youtube: string;
    readonly linkedin: string;
    readonly tiktok: string;
    /**
     * Những kênh đang TẮT, khoá cách nhau bằng dấu cách.
     *
     * Tách khỏi địa chỉ để tắt một kênh mà không mất địa chỉ của nó — xem
     * kenhDangTat trong lib/social.ts.
     */
    readonly off: string;
  };
  readonly preloader: { readonly note: string };
  readonly hero: {
    readonly captions: Tuple5<HeroCaption>;
    readonly chapters: Tuple4<string>;
    readonly hint: string;
    readonly cta: string;
    readonly videoAlt: string;
  };
  readonly marquee: string;
  /**
   * Heading over the slide that ticks off reasons to trust the company. Shared:
   * the service pages put their own selling points under it, the warehousing
   * page its operating technology. Longer than a run-in section title, because
   * it stands on its own half of a screen; the accent is set in brand orange.
   */
  readonly trust: {
    readonly title: string;
    readonly titleAccent: string;
  };
  readonly about: {
    readonly eyebrow: string;
    readonly title: string;
    readonly titleAccent: string;
    readonly titleTail: string;
    readonly lead: string;
    readonly body: string;
    readonly ctaPrimary: string;
    readonly ctaGhost: string;
    readonly stats: Tuple4<Stat>;
    /** The home page's opening statement, shown on its own full-screen slide. */
    readonly intro: {
      readonly founding: string;
      /** Set in brand orange, quotation marks included. */
      readonly motto: string;
      readonly mottoTail: string;
    };
    /** The second home slide: a photograph beside three figures worth quoting. */
    readonly detail: {
      readonly imageAlt: string;
      readonly cta: string;
      readonly highlights: Tuple3<{
        readonly to: number;
        readonly suffix: string;
        readonly body: string;
      }>;
    };
  };
  readonly services: {
    /**
     * Thứ tự chín dịch vụ hiện ra: thẻ trang chủ, mục xổ ở thanh điều hướng,
     * cột dịch vụ ở chân trang. Sửa được ở CMS — xem lib/service-order.ts.
     *
     * Kiểu là string[] chứ không phải ServiceKey[]: giá trị có thể đến từ CMS
     * nên coi như dữ liệu chưa tin được, dọn ở thuTuDichVu rồi mới dùng.
     */
    readonly order: readonly string[];
    readonly eyebrow: string;
    readonly title: string;
    readonly titleAccent: string;
    readonly titleTail: string;
    readonly lead: string;
    /**
     * Heading over the home page's service carousel. Its own string rather
     * than the accented `title` above: that one is the services page's H1 and
     * is written to be read on its own, this one only introduces a row of
     * cards.
     */
    readonly slideTitle: string;
    /** Names the carousel's scroll region, which has no visible label. */
    readonly railLabel: string;
    /**
     * Chín dịch vụ gốc BẮT BUỘC có đủ — thiếu một khoá là lỗi biên dịch, không
     * phải một trang trống phát hiện ra sau. Phần `Record<string, …>` mở đường
     * cho dịch vụ người dùng tự thêm, ghép vào lúc dựng từ điển.
     */
    readonly items: Readonly<Record<ServiceKey, ServiceEntry> & Record<string, ServiceEntry>>;
    readonly problemsHeading: string;
    readonly approachHeading: string;
    readonly uspHeading: string;
    readonly scopeHeading: string;
    readonly faqHeading: string;
    /** Câu dưới tiêu đề Câu hỏi thường gặp, và thẻ liên hệ ở cột trái. */
    readonly faqLead: string;
    readonly faqCtaTitle: string;
    readonly faqCtaBody: string;
    readonly faqCtaButton: string;
    /** Call to action on each service card. */
    readonly cardCta: string;
    /** Shown above the related block on a detail page. */
    readonly relatedHeading: string;
    /** Back-link on a detail page. */
    readonly backToAll: string;
  };
  readonly why: {
    readonly eyebrow: string;
    readonly title: string;
    readonly titleAccent: string;
    readonly items: readonly NamedBody[];
  };
  readonly process: {
    readonly eyebrow: string;
    readonly title: string;
    readonly titleAccent: string;
    readonly steps: readonly NamedBody[];
  };
  readonly fleet: {
    readonly eyebrow: string;
    readonly title: string;
    readonly titleAccent: string;
    readonly titleTail: string;
    readonly body: string;
    readonly cta: string;
    readonly items: readonly { readonly name: string; readonly spec: string }[];
  };
  readonly warehousing: {
    readonly eyebrow: string;
    readonly title: string;
    readonly titleAccent: string;
    readonly titleTail: string;
    readonly lead: string;
    /** Headline figures for the whole operation. */
    readonly overview: readonly Stat[];
    /**
     * Heading over the slide that shows the warehouses one at a time. Its own
     * string rather than the `lead` above: that one is the page hero's, and
     * this only introduces the three cards under it.
     */
    readonly typesHeading: string;
    /** The three functional warehouses. */
    readonly warehouses: readonly WarehouseCard[];
    readonly techHeading: string;
    readonly tech: readonly NamedBody[];
    readonly infraHeading: string;
    readonly infra: readonly string[];
  };
  readonly crossborder: {
    readonly eyebrow: string;
    readonly title: string;
    readonly titleAccent: string;
    readonly titleTail: string;
    readonly lead: string;
    /** Why road beats sea and air on these lanes. */
    readonly benefits: readonly string[];
    /** Describes the route map for screen readers. */
    readonly mapAlt: string;
    /** Caption printed on the map plate. */
    readonly mapCaption: string;
    readonly mapSource: string;
    readonly routesHeading: string;
    readonly routes: readonly string[];
    readonly corridorsHeading: string;
    readonly corridors: readonly NamedBody[];
  };
  readonly tracking: {
    readonly eyebrow: string;
    readonly title: string;
    readonly titleAccent: string;
    readonly lead: string;
    readonly items: readonly string[];
  };
  readonly lifting: {
    readonly eyebrow: string;
    readonly title: string;
    readonly titleAccent: string;
    readonly lead: string;
    readonly equipmentHeading: string;
    readonly equipment: readonly string[];
    readonly special: readonly NamedBody[];
  };
  readonly customs: {
    readonly eyebrow: string;
    readonly title: string;
    readonly titleAccent: string;
    readonly lead: string;
    readonly licenceLabel: string;
    readonly slaHeading: string;
    readonly sla: readonly NamedBody[];
    readonly slaNote: string;
    readonly scopeHeading: string;
    readonly scope: readonly string[];
  };
  readonly legal: {
    readonly privacy: LegalPage;
    readonly terms: LegalPage;
  };
  readonly ctaBand: {
    readonly title: string;
    readonly body: string;
    readonly cta: string;
  };
  /**
   * The partner band on the home page. The carriers themselves are proper
   * nouns and live in `PARTNERS` (lib/site.ts) rather than being repeated in
   * every locale; only the statement above them is translated.
   */
  readonly partners: {
    /** Names the section for assistive technology — the band carries no heading. */
    readonly label: string;
    /** Chú thích dưới con số của hai dải logo (con số tự đếm). */
    readonly customers: string;
    readonly membership: string;
  };
  /**
   * The newsroom. Only the furniture is translated — the articles themselves
   * come from BeeOps and are written once, in whatever language the author
   * used, so nothing about them belongs in a dictionary.
   */
  readonly blog: {
    /** The page's H1, centred over the grid. */
    readonly title: string;
    /** Names the grid of cards, which carries no visible label of its own. */
    readonly listLabel: string;
    /** Drawn when nothing is published yet — and when the backend is down. */
    readonly emptyTitle: string;
    readonly emptyBody: string;
    /** Precedes a publication date, on the card and in the article header. */
    readonly publishedLabel: string;
    /** Eyebrow above an article's title. */
    readonly articleEyebrow: string;
    /** Back to the index, at the foot of an article. */
    readonly backToList: string;
  };
  /** Khối "Tải ứng dụng" ở trang chủ, ngay dưới dải đối tác. */
  readonly appDownload: {
    readonly title: string;
    readonly lead: string;
    /** Dòng nhỏ trên hai nút cửa hàng. */
    readonly available: string;
    /** Link cửa hàng. Để trống thì nút vẫn hiện nhưng không bấm được. */
    readonly googlePlayUrl: string;
    readonly appStoreUrl: string;
    /** Mã QR trỏ tới đâu. Trống thì lấy link Google Play, rồi App Store, rồi trang web. */
    readonly qrUrl: string;
    readonly qrAlt: string;
    readonly phoneAlt: string;
  };
  /** Câu hỏi thường gặp ở trang chủ. Thêm bớt câu trong CMS — xem editable-lists. */
  readonly homeFaq: {
    readonly title: string;
    readonly items: readonly Faq[];
  };
  readonly team: {
    readonly eyebrow: string;
    readonly title: string;
    readonly titleAccent: string;
    readonly lead: string;
    readonly empty: string;
    readonly loadFailed: string;
    /** Nhan cho vung truot ngang va hai nut mui ten — chi may doc man hinh doc. */
    readonly railLabel: string;
    readonly prev: string;
    readonly next: string;
  };
  readonly contact: {
    readonly eyebrow: string;
    readonly title: string;
    readonly titleAccent: string;
    readonly labels: {
      readonly hotline: string;
      readonly email: string;
    };
    readonly form: {
      readonly name: string;
      readonly namePlaceholder: string;
      readonly phone: string;
      readonly phonePlaceholder: string;
      readonly email: string;
      readonly emailPlaceholder: string;
      readonly service: string;
      readonly message: string;
      readonly messagePlaceholder: string;
      readonly submit: string;
      readonly required: string;
      readonly invalidEmail: string;
      readonly invalidPhone: string;
      readonly invalidNameChars: string;
      readonly invalidPhoneChars: string;
      readonly sending: string;
      /**
       * Confirmation shown in the dialog after a request goes through. Split
       * into heading and body because a modal needs a heading to be labelled
       * by — a single sentence would be read as its accessible name and then
       * read again as its content.
       */
      readonly sentTitle: string;
      readonly sentBody: string;
      readonly sentClose: string;
      readonly failed: string;
      readonly limited: string;
      readonly consent: string;
      readonly consentLink: string;
    };
  };
  readonly footer: {
    readonly servicesHeading: string;
    readonly companyHeading: string;
    readonly supportHeading: string;
    readonly contactHeading: string;
    /** "About us" — longer than the nav label, as the footer has room for it. */
    readonly aboutLabel: string;
    readonly privacyLabel: string;
    readonly termsLabel: string;
    /** Copyright line; `{year}` and `{name}` are substituted at render time. */
    readonly copyright: string;
  };
  readonly meta: {
    readonly home: MetaEntry;
    readonly about: MetaEntry;
    readonly services: MetaEntry;
    readonly capabilities: MetaEntry;
    readonly warehousing: MetaEntry;
    readonly crossborder: MetaEntry;
    readonly blog: MetaEntry;
    readonly contact: MetaEntry;
    readonly privacy: MetaEntry;
    readonly terms: MetaEntry;
  };
  /**
   * Copy for the share cards drawn by the opengraph-image routes.
   *
   * Kept apart from `meta`: a meta description is a paragraph a search engine
   * reads, while a card has room for a headline and three figures and nothing
   * else. Writing them separately is what stops the card from being a
   * truncated description.
   */
  readonly og: {
    /** Two lines of the home card — the second is set in brand orange. */
    readonly homeTitle: string;
    readonly homeAccent: string;
    /** The three figures ruled along the foot of every card. */
    readonly facts: readonly [string, string, string];
  };
  /**
   * Ảnh do CMS thay, dạng `images.<slot>` -> URL. Trong hai file từ điển nó
   * luôn RỖNG: ảnh mặc định là file trong repo, khai ở lib/image-slots.ts.
   *
   * Nằm trong Dictionary để đi chung một đường với chữ — mọi component đã nhận
   * `dict` rồi, thêm một prop thứ hai chỉ để truyền ảnh là luồn một sợi dây
   * xuyên qua chục lớp component.
   */
  readonly images: Readonly<Record<string, string>>;
  /**
   * Thông tin công ty: tên, liên lạc, địa chỉ văn phòng.
   *
   * Trước đây nằm trong lib/site.ts dưới dạng hằng số, nên là nhóm chữ DUY
   * NHẤT hiện trên mọi trang mà CMS không sửa được — đo trên trang thật: mỗi
   * trang còn 8–10 chuỗi thuộc nhóm này. Mà đây đúng là thứ một doanh nghiệp
   * hay phải sửa nhất: đổi số điện thoại, chuyển văn phòng.
   *
   * Nằm trong từ điển nên mỗi ngôn ngữ một bản — "Thành phố Hồ Chí Minh" và
   * "Ho Chi Minh City" là hai chuỗi khác nhau, và bản tiếng Anh trước giờ vẫn
   * hiện địa chỉ tiếng Việt.
   */
  readonly site: {
    readonly name: string;
    readonly shortName: string;
    readonly email: string;
    readonly customsLicence: string;
    readonly phoneLabel: string;
    readonly phoneNumber: string;
    /**
     * Các văn phòng, theo thứ tự. Phần tử ĐẦU TIÊN là trụ sở.
     *
     * Là một DANH SÁCH chứ không phải hai cặp ô cố định như trước: công ty mở
     * thêm văn phòng thì đó là chuyện của người biên tập, không phải của một
     * lần deploy. Chân trang và hai trang pháp lý chỉ in văn phòng đầu tiên —
     * chúng cần một địa chỉ pháp lý, không phải cả danh sách.
     *
     * `label` đi kèm từng văn phòng chứ không lấy từ `contact.labels`: với ba
     * văn phòng trở lên thì "Trụ sở / Chi nhánh" không còn đủ để gọi tên.
     */
    readonly offices: readonly {
      readonly label: string;
      readonly street: string;
      readonly city: string;
      /** Số điện thoại của riêng nơi này. Rỗng = dùng hotline chung. */
      readonly phone: string;
      /** Email của riêng nơi này. Rỗng = không in dòng email (email chung nằm ở cột Liên hệ). */
      readonly email: string;
      /** '1' = giấu khỏi web. Chuỗi chứ không phải boolean: lớp phủ CMS chỉ biết chuỗi. */
      readonly hidden: string;
    }[];
  };
}
