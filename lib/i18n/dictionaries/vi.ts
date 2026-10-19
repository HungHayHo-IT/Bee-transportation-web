/**
 * Vietnamese copy. Both locales implement `Dictionary`, so a key added to the
 * interface fails the build in every language until it is filled in.
 *
 * Copy is marketing's, not engineering's — the strings below were lifted
 * verbatim from the previous site. Do not reword them here.
 */
import type { Dictionary } from '../types';

export const vi = {
  nav: {
    about: 'Giới thiệu',
    services: 'Dịch vụ',
    capabilities: 'Năng lực',
    warehousing: 'Kho bãi',
    crossborder: 'Vận chuyển quốc tế',
    blog: 'Tin tức',
    contact: 'Liên hệ',
    cta: 'Liên hệ',
    privacy: 'Quyền riêng tư',
    terms: 'Điều khoản',
    skipToContent: 'Bỏ qua điều hướng, tới nội dung chính',
    callNow: 'Gọi ngay',
    openMenu: 'Mở menu',
    languageLabel: 'Ngôn ngữ',
  },

  // Để trống: chưa có địa chỉ thật. Kênh nào chưa điền thì không hiện, nên
  // trang vẫn đúng cho tới khi đội nội dung điền vào ở CMS.
  social: {
    label: 'Kênh mạng xã hội của BEE Transportation',
    facebook: '',
    zalo: '',
    youtube: '',
    linkedin: '',
    tiktok: '',
    off: '',
  },
  preloader: {
    note: 'Đang tải trải nghiệm hình ảnh…',
  },

  hero: {
    /**
     * Captions in scroll order, copied verbatim from the previous site.
     *
     * Caption 1 carries the <h1>, and it holds the slogan that
     * bee-hero-DEV-HANDOFF §3 specifies for `hero.h1` — so the page's most
     * important heading names what the company does rather than only who it
     * is. The brand name moved into that caption's eyebrow, so nothing was
     * dropped. Caption 2 was re-pointed at the door-to-door promise its own
     * subtitle already made.
     */
    captions: [
      {
        eyebrow: 'Hàng siêu trường · Hàng dự án',
        title: 'Hàng Siêu Trường',
        titleAccent: 'Siêu Trọng',
        sub: 'Khảo sát tuyến — Giấy phép lưu hành — Xe dẫn đoàn',
      },
      {
        eyebrow: 'Năng lực thực tế',
        title: '120+ Đầu Xe',
        titleAccent: '425 Chuyến Mỗi Ngày',
        sub: 'Phủ 34 tỉnh thành, 26.000 m² kho bãi',
      },
      {
        eyebrow: 'Thông quan & xuyên biên giới',
        title: 'Đại Lý Hải Quan',
        titleAccent: '10 Tuyến Xuyên Biên Giới',
        sub: 'Giấy phép 2569/HQHCM-GSQL — thông quan và vận chuyển trên cùng một đầu mối',
      },
      {
        eyebrow: 'Đa phương thức',
        title: 'Đường Bộ · Đường Biển',
        titleAccent: 'Một Đầu Mối',
        sub: 'Từ nhà máy đến chân công trình, một bên chịu trách nhiệm suốt tuyến',
      },
      {
        eyebrow: 'Sẵn sàng đồng hành',
        title: 'Nhận Phương Án',
        titleAccent: 'Trong 24 Giờ',
        sub: 'Gửi thông số hàng hoá, chúng tôi lên phương án và báo giá',
      },
    ],
    /**
     * HUD chapter labels, one per clip.
     *
     * They used to name the footage — "V1 · Hành trình", "V2 · Khoang hàng" —
     * which put the video filenames on the front page and told a reader
     * nothing about the company. These are the four things that decide whether
     * an oversized move goes right, in the order they have to go right, and
     * the last one lands where the call to action does.
     *
     * Numbered 01–04 rather than V1–V4: a reader sees chapters, not clips.
     * Uppercased by .hud__chapters, so write them in sentence case.
     */
    chapters: ['01 · Đúng xe', '02 · Đúng hàng', '03 · Đúng lộ trình', '04 · Đúng hẹn'],
    hint: 'Cuộn để xem',
    cta: 'Nhận báo giá',
    /** Read by screen readers in place of the video chain. */
    videoAlt:
      'Xe container BEE Transportation tiến vào kho, mở khoang hàng và chuyển thành mô hình số hoá.',
  },

  /**
   * Decorative (aria-hidden) and deliberately left in English in both locales —
   * these are the industry terms the previous site used. Translating them is a
   * marketing decision, not a porting one.
   */
  marquee:
    'Vận chuyển nội địa ✦ Hàng dự án ✦ Đa phương thức bộ & biển ✦ Xếp dỡ nâng hạ ✦ Đóng kiện đóng gói ✦ Xuyên biên giới ✦ Khai báo hải quan ✦ Cho thuê thiết bị ✦ Môi giới hàng hải ✦',

  trust: {
    title: 'Tại sao các doanh nghiệp tin tưởng',
    titleAccent: 'Bee Transportation',
  },

  about: {
    eyebrow: 'Về chúng tôi',
    title: 'Giải pháp logistics',
    titleAccent: 'chuyên biệt',
    titleTail: 'cho hàng dự án',
    lead: 'BEE TRANSPORTATION Corporation được thành lập ngày 08/11/2023, chuyên cung cấp các giải pháp và dịch vụ logistics chuyên biệt cho việc vận chuyển, xếp dỡ và di dời hàng siêu trường, siêu trọng, hàng dự án tại Việt Nam và trên toàn thế giới.',
    body: 'Chúng tôi cam kết mang đến dịch vụ kịp thời, an toàn, hiệu quả và tối ưu chi phí cho các khách hàng công nghiệp và thương mại. Với đội ngũ giàu kinh nghiệm cùng mạng lưới đối tác rộng khắp, mỗi lô hàng đều được hoạch định riêng theo đặc thù hàng hoá và tuyến đường.',
    ctaPrimary: 'Xem dịch vụ',
    ctaGhost: 'Liên hệ tư vấn',
    /**
     * From the company profile deck (profile-betransport.pptx, 07/2025),
     * confirmed 08/09/2026 as BEE TRANSPORTATION's own figures — Bee Logistics
     * appears in that file's metadata only because it is the parent company and
     * the template was reused.
     *
     * The deck also carries 196,718 customs declarations filed in 2024 if a
     * stronger fourth number is ever wanted here.
     *
     * Province count is 34, Vietnam's post-2025 total.
     */
    stats: [
      { to: 120, suffix: '+', label: 'Xe tải & rơ-moóc' },
      { to: 425, suffix: '+', label: 'Chuyến mỗi ngày' },
      { to: 34, suffix: '', label: 'Tỉnh thành phủ sóng' },
      { to: 26000, suffix: ' m²', label: 'Kho vận hành' },
    ],
    intro: {
      founding:
        'Công ty Cổ phần Vận chuyển Con Ong (BEE TRANSPORTATION) được thành lập vào ngày 08/11/2023.',
      motto: '”Our best is your best”',
      mottoTail:
        'Với mong muốn mang đến cho quý Khách hàng/Đối tác những dịch vụ tốt nhất của Chúng tôi.',
    },
    /* The figures are the confirmed ones from `stats` above, written out in a
       sentence each. Nothing here may be a number the company has not given us. */
    detail: {
      imageAlt: 'Bãi container tại cảng, xe đầu kéo đang kéo container ra khỏi bãi',
      cta: 'Xem chi tiết',
      highlights: [
        {
          to: 425,
          suffix: '+',
          body: 'Chuyến xe mỗi ngày trên toàn mạng lưới, phục vụ khách hàng công nghiệp và thương mại.',
        },
        {
          to: 34,
          suffix: '',
          body: 'Tỉnh thành phủ sóng, đưa hàng từ cảng đến chân công trình trên khắp cả nước.',
        },
        {
          to: 120,
          suffix: '+',
          body: 'Xe tải và rơ-moóc trong đội xe, gồm thiết bị chuyên dụng cho hàng siêu trường siêu trọng.',
        },
      ],
    },
  },

  services: {
    // Thứ tự mặc định. CMS ghi đè được — xem lib/service-order.ts.
    order: [
      'consulting',
      'domestic',
      'multimodal',
      'project',
      'lifting',
      'packing',
      'crossborder',
      'leasing',
      'customs',
    ],
    eyebrow: 'Dịch vụ',
    title: 'Chuỗi dịch vụ',
    titleAccent: 'trọn gói',
    titleTail: 'từ A đến Z',
    lead: 'Từ tư vấn phương án đến thông quan và giao hàng tận chân công trình.',
    slideTitle: 'Dịch vụ của chúng tôi',
    railLabel: 'Danh sách dịch vụ — cuộn ngang để xem thêm',
    problemsHeading: 'Vấn đề chủ hàng thường gặp',
    approachHeading: 'Cách chúng tôi triển khai',
    uspHeading: 'Vì sao chọn BEE',
    scopeHeading: 'Phạm vi dịch vụ',
    faqHeading: 'Câu hỏi thường gặp',
    faqLead: 'Những điều khách hàng thường hỏi trước khi gửi hàng.',
    faqCtaTitle: 'Chưa thấy câu trả lời?',
    faqCtaBody: 'Đội ngũ BEE sẽ tư vấn tuyến và báo giá theo đúng lô hàng của bạn.',
    faqCtaButton: 'Liên hệ tư vấn',
    cardCta: 'Xem chi tiết',
    relatedHeading: 'Năng lực liên quan',
    backToAll: '← Tất cả dịch vụ',
    /**
     * ⚠️ BẢN THẢO — CHƯA QUA MARKETING/PHÁP CHẾ.
     *
     * `name` và `body` là copy gốc của site cũ, giữ nguyên văn.
     *
     * `intro`, `problems`, `approach`, `usps`, `faqs` được viết mới cho mục
     * đích SEO. Phần đặt vấn đề là kiến thức ngành; **mọi con số và năng lực
     * nêu trong `usps` đều truy được về hồ sơ năng lực** (profile-betransport.pptx):
     * 120+ đầu xe, 425+ chuyến/ngày, 26.000 m² kho, 30.000 vị trí pallet,
     * cẩu Kato 45 tấn, 10 tuyến xuyên biên giới, GPS 24/7, HACCP,
     * giấy phép đại lý hải quan 2569/HQHCM-GSQL, 196.718 tờ khai năm 2024.
     *
     * KHÔNG thêm chứng chỉ, tên khách hàng hay cam kết thời gian nào không có
     * trong hồ sơ đó. Các mốc thời gian trong `faqs` được viết theo hướng "tuỳ
     * hồ sơ" thay vì cam kết cứng, trừ hai mốc thông quan mà hồ sơ nêu rõ.
     */
    items: {
      consulting: {
        name: 'Tư vấn giải pháp vận chuyển',
        body: 'Hoạch định phương án tối ưu, tư vấn hàng hoá đặc thù và lựa chọn phương thức vận chuyển phù hợp nhất.',
        intro:
          'Phần lớn chi phí phát sinh của một lô hàng không nằm ở giá cước, mà nằm ở quyết định sai từ đầu: chọn nhầm phương thức, bỏ sót một cây cầu tải trọng thấp trên tuyến, hoặc phát hiện hàng không qua được cổng nhà máy khi xe đã tới nơi. Khâu tư vấn tồn tại để những chuyện đó lộ ra trên giấy, chứ không phải lộ ra trên đường.',
        problems: [
          {
            name: 'Năm báo giá, năm cách tính khác nhau',
            body: 'Nhà thầu A tính theo tấn, B tính theo m³, C tính theo chuyến và loại trừ phí nâng hạ. Chủ hàng không có cơ sở so sánh, thường chọn con số thấp nhất rồi trả phần chênh ở khâu sau.',
          },
          {
            name: 'Tuyến chỉ được khảo sát trên bản đồ',
            body: 'Bán kính cua, chiều cao gầm cầu, tải trọng cầu yếu và đường dây điện băng ngang không hiện trên bản đồ số. Thiếu khảo sát thực địa, đoàn xe phải quay đầu — chi phí đó không ai báo trước.',
          },
          {
            name: 'Chia nhỏ cho nhiều nhà thầu, không ai chịu tổng thể',
            body: 'Vận chuyển một bên, nâng hạ một bên, hải quan một bên. Khi chậm ở điểm giao nhau, mỗi bên chỉ chịu trách nhiệm phần của mình còn tiến độ dự án thì trượt.',
          },
        ],
        approach: [
          {
            name: 'Ghi nhận thông số và hiện trạng hai đầu',
            body: 'Kích thước, trọng lượng, trọng tâm, yêu cầu bảo quản, và điều kiện thực tế tại điểm đi — điểm đến: mặt bằng, khả năng tiếp cận, thiết bị sẵn có.',
          },
          {
            name: 'Khảo sát tuyến thực địa',
            body: 'Đo đạc tĩnh không, bán kính cua, tải trọng cầu và các điểm nút trên tuyến. Kết quả khảo sát là căn cứ cho phương án nâng hạ và hồ sơ xin giấy phép lưu hành.',
          },
          {
            name: 'So sánh theo tổng chi phí đến chân công trình',
            body: 'Không so giá cước đơn thuần mà so tổng: cước, nâng hạ, giấy phép, hộ tống, lưu kho, thời gian thông quan và rủi ro tồn đọng ở từng phương án.',
          },
          {
            name: 'Chốt phương án kèm rủi ro và phương án dự phòng',
            body: 'Bàn giao phương án nêu rõ giả định nào đang được dựa vào, điều gì xảy ra nếu giả định đó sai, và hướng xử lý thay thế.',
          },
        ],
        usps: [
          {
            name: 'Một đầu mối làm được cả chín nhóm dịch vụ',
            body: 'Phương án không bị bẻ cong theo năng lực của nhà thầu. Vận chuyển, nâng hạ, đóng kiện, kho bãi và hải quan cùng một nơi chịu trách nhiệm.',
          },
          {
            name: 'Tài sản thật, không phải môi giới',
            body: 'Hơn 120 đầu xe và rơ-moóc, 26.000 m² kho, cẩu Kato 45 tấn. Phương án đưa ra dựa trên thiết bị chúng tôi thật sự điều được, không phải thiết bị đi thuê lại.',
          },
          {
            name: 'Tính được cả thời gian thông quan',
            body: 'Là đại lý hải quan có giấy phép, chúng tôi đưa thời gian thông quan vào ngay trong phương án thay vì để nó thành ẩn số ở cuối chuỗi.',
          },
        ],
        faqs: [
          {
            q: 'Khảo sát tuyến có tính phí riêng không?',
            a: 'Với lô hàng chúng tôi nhận vận chuyển, khảo sát tuyến nằm trong phạm vi lập phương án. Trường hợp khách chỉ cần báo cáo khảo sát để đấu thầu nội bộ, chúng tôi báo giá riêng theo độ dài và độ phức tạp của tuyến.',
          },
          {
            q: 'Mất bao lâu để có phương án và báo giá?',
            a: 'Hàng thông thường có thông số đầy đủ thường có báo giá trong vòng 24 giờ. Hàng dự án cần khảo sát thực địa thì phụ thuộc vào độ dài tuyến và thời điểm tiếp cận được hiện trường.',
          },
          {
            q: 'Hàng của tôi có cần giấy phép lưu hành không?',
            a: 'Phụ thuộc kích thước và tổng tải trọng khi đã lên phương tiện, không chỉ kích thước bản thân kiện hàng. Gửi cho chúng tôi thông số và tuyến dự kiến, chúng tôi xác định giúp và xử lý hồ sơ nếu cần.',
          },
        ],
        points: [
          'Khảo sát hàng hoá: kích thước, trọng lượng, trọng tâm, yêu cầu bảo quản',
          'Khảo sát tuyến thực địa: tĩnh không, bán kính cua, tải trọng cầu',
          'Khảo sát mặt bằng hai đầu: lối tiếp cận, khả năng chịu tải, thiết bị sẵn có',
          'So sánh phương án theo tổng chi phí đến chân công trình',
          'Xác định nhu cầu giấy phép lưu hành và thủ tục chuyên ngành',
          'Lập báo cáo khảo sát và phương án kèm rủi ro, phương án dự phòng',
        ],
        meta: {
          title: 'Tư vấn giải pháp vận chuyển',
          description:
            'Khảo sát tuyến thực địa, lập phương án và so sánh theo tổng chi phí đến chân công trình — không chỉ giá cước.',
        },
      },

      domestic: {
        name: 'Vận chuyển đường bộ',
        body: 'Giao nhận door-to-door, xử lý hàng FCL/LCL, theo dõi hành trình theo thời gian thực trên toàn quốc.',
        intro:
          'Vận chuyển đường bộ là mảng dễ tưởng là hàng hoá phổ thông, cho tới lúc lô hàng nằm lại ở một tỉnh và không ai trả lời được nó đang ở đâu. Khác biệt giữa các nhà vận tải không nằm ở giá cước một chuyến, mà ở chỗ có kiểm soát được đoàn xe của chính mình hay không.',
        problems: [
          {
            name: 'Hàng lẻ chờ gom đủ chuyến',
            body: 'Nhà xe chỉ chạy khi đầy tải, nên lô hàng nhỏ nằm chờ vô thời hạn. Ngày giao hàng cam kết với khách cuối trở thành con số không ai dám chắc.',
          },
          {
            name: 'Không biết xe đang ở đâu',
            body: 'Cập nhật tiến độ phụ thuộc vào việc gọi được cho tài xế. Khi có sự cố, chủ hàng biết sau cùng và không còn thời gian xoay phương án.',
          },
          {
            name: 'Mỗi tỉnh một nhà xe',
            body: 'Chất lượng không đồng đều, chứng từ mỗi nơi một kiểu, và khi hàng hư hỏng thì trách nhiệm rơi vào khoảng giữa hai nhà thầu.',
          },
        ],
        approach: [
          {
            name: 'Chọn hình thức theo lô hàng, không theo tiện xe',
            body: 'Nguyên xe (FTL) khi hàng đủ tải hoặc cần đi thẳng; hàng ghép (LTL) khi tối ưu chi phí quan trọng hơn một hai ngày vận chuyển.',
          },
          {
            name: 'Điều xe từ đội của chính mình',
            body: 'Hơn 120 đầu xe và rơ-moóc cho phép nhận chuyến mà không phải chờ tìm xe ngoài, và cho phép quay đầu linh hoạt khi lịch thay đổi.',
          },
          {
            name: 'Giám sát hành trình liên tục',
            body: 'Vị trí từng phương tiện, tốc độ, điểm dừng và thay đổi tuyến đều được ghi nhận theo thời gian thực, không phụ thuộc vào việc liên lạc được với tài xế.',
          },
          {
            name: 'Giao nhận tận nơi và bàn giao chứng từ',
            body: 'Giao đến địa chỉ nhận, nghiệm thu hiện trạng và hoàn tất chứng từ theo cùng một quy cách trên mọi tuyến.',
          },
        ],
        usps: [
          {
            name: 'Hơn 425 chuyến mỗi ngày',
            body: 'Mật độ chuyến cao đồng nghĩa tần suất gom hàng dày và khả năng chèn chuyến khi khách cần gấp, thay vì phải chờ đủ tải.',
          },
          {
            name: 'Giám sát GPS 24/7 trên toàn đội',
            body: 'Báo cáo hành trình theo thời gian thực, đo tốc độ, giám sát điểm dừng và mức tiêu thụ nhiên liệu — dùng để cải thiện hành vi lái xe và tăng an ninh cho lô hàng.',
          },
          {
            name: 'Tuyến Đà Nẵng – TP.HCM khai thác riêng',
            body: 'Trung bình 4–5 chuyến mỗi tháng trên mỗi đầu xe, dịch vụ 24/7 và ưu đãi cho khách vận chuyển hai chiều.',
          },
        ],
        points: [
          'Vận chuyển nguyên xe (FTL)',
          'Vận chuyển hàng ghép (LTL)',
          'Hàng rời',
          'Vận chuyển hàng dễ hỏng và hàng nguy hiểm',
          'Vận chuyển siêu trọng và dịch vụ thiết bị nâng hạ',
          'Vận chuyển đặc biệt đồ gia dụng và tư trang cá nhân',
          'Vận chuyển container',
          'Vận tải và phân phối nội địa',
          'Gom hàng (consolidation)',
        ],
        faqs: [
          {
            q: 'Khi nào nên đi nguyên xe, khi nào nên ghép hàng?',
            a: 'Nguyên xe phù hợp khi hàng chiếm phần lớn tải trọng hoặc thể tích xe, khi cần đi thẳng không qua điểm trung chuyển, hoặc khi hàng nhạy cảm với xếp dỡ nhiều lần. Hàng ghép tiết kiệm hơn đáng kể với lô nhỏ, đổi lại thời gian dài hơn do phải gom và trung chuyển.',
          },
          {
            q: 'Tôi theo dõi lô hàng của mình bằng cách nào?',
            a: 'Toàn bộ phương tiện gắn thiết bị giám sát hành trình hoạt động 24/7. Chúng tôi cung cấp cập nhật vị trí theo thời gian thực và báo cáo hành trình cho từng chuyến thay vì để khách phải gọi tài xế.',
          },
          {
            q: 'Có nhận hàng lạnh và hàng nguy hiểm không?',
            a: 'Có. Hàng dễ hỏng và hàng nguy hiểm nằm trong phạm vi dịch vụ, kèm hệ thống kho lạnh âm 25°C khi lô hàng cần lưu trữ giữa chặng. Hàng nguy hiểm cần khai báo đúng nhóm ngay từ khi hỏi giá để bố trí phương tiện và tuyến phù hợp.',
          },
        ],
        meta: {
          title: 'Vận chuyển đường bộ',
          description:
            'FTL, LTL, hàng rời, hàng lạnh và hàng nguy hiểm trên toàn quốc. 120+ đầu xe, hơn 425 chuyến mỗi ngày, giám sát GPS 24/7.',
        },
      },

      multimodal: {
        name: 'Vận tải đa phương thức (Bộ / Biển)',
        body: 'Kết hợp linh hoạt các phương thức, gom hàng tối ưu chi phí và giám sát toàn tuyến hành trình.',
        intro:
          'Đa phương thức không phải là ghép hai chặng vận chuyển lại với nhau, mà là chịu trách nhiệm cho điểm nối giữa chúng. Phần lớn tổn thất và chậm trễ của hàng dự án xảy ra đúng ở nơi hàng đổi phương tiện — nơi mà nếu chia cho hai nhà thầu thì không bên nào thật sự chịu trách nhiệm.',
        problems: [
          {
            name: 'Chi phí đường bộ trên quãng dài',
            body: 'Chạy bộ toàn tuyến Bắc – Nam cho hàng nặng đội chi phí nhanh, trong khi phần lớn quãng đường hoàn toàn có thể đi đường thuỷ với giá thấp hơn đáng kể.',
          },
          {
            name: 'Hàng quá khổ không đi bộ được toàn tuyến',
            body: 'Một cây cầu yếu hoặc một đoạn tĩnh không thấp là đủ để chặn cả phương án. Khi đó đường thuỷ không còn là lựa chọn tối ưu mà là lựa chọn duy nhất.',
          },
          {
            name: 'Điểm chuyển tải là nơi mất kiểm soát',
            body: 'Chờ thiết bị nâng hạ, chờ thuỷ triều, chờ chứng từ — mỗi khâu do một bên khác nhau phụ trách, và không ai nắm được bức tranh tổng thể.',
          },
        ],
        approach: [
          {
            name: 'Chia chặng theo ràng buộc thật của tuyến',
            body: 'Xác định đoạn nào bắt buộc đi bộ, đoạn nào nên đi thuỷ, và điểm chuyển tải nào có đủ hạ tầng cho thiết bị nâng hạ cần dùng.',
          },
          {
            name: 'Bố trí thiết bị nâng hạ tại điểm nối',
            body: 'Cẩu và xe nâng được lên kế hoạch cùng lúc với lịch phương tiện, để hàng không phải nằm chờ thiết bị ở bến.',
          },
          {
            name: 'Một đầu mối giám sát toàn tuyến',
            body: 'Cùng một người chịu trách nhiệm từ điểm đi tới điểm đến, kể cả những khâu thực hiện bởi đối tác, và cập nhật liên tục cho chủ hàng.',
          },
        ],
        usps: [
          {
            name: 'Nâng hạ là năng lực nội bộ',
            body: 'Cẩu Kato 45 tấn, xe nâng và đội công nhân lành nghề thuộc về chúng tôi, nên điểm chuyển tải không phải chờ một nhà thầu thứ ba.',
          },
          {
            name: 'Kho trung chuyển 26.000 m²',
            body: 'Khi lịch phương tiện lệch nhau, hàng có chỗ nằm an toàn thay vì nằm bến — gồm cả kho lạnh và kho ngoại quan cho hàng chờ thông quan.',
          },
          {
            name: 'Giám sát liên tục cả tuyến',
            body: 'Hệ thống theo dõi hành trình bao phủ chặng đường bộ, và mốc bàn giao ở mỗi điểm chuyển tải đều được ghi nhận bằng chứng từ.',
          },
        ],
        points: [
          'Vận chuyển hàng dự án đa phương thức: đường bộ kết hợp đường thuỷ',
          'Gom hàng tối ưu không gian và tái sử dụng phương tiện',
          'Bố trí thiết bị nâng hạ tại điểm chuyển tải',
          'Giám sát toàn tuyến, cập nhật trạng thái liên tục cho chủ hàng',
        ],
        faqs: [
          {
            q: 'Đa phương thức có luôn rẻ hơn đi bộ toàn tuyến không?',
            a: 'Không. Với quãng ngắn hoặc lô nhỏ, chi phí và thời gian ở hai lần nâng hạ thường xoá hết phần tiết kiệm được. Đa phương thức có lợi rõ khi hàng nặng, quãng dài, hoặc khi đường bộ có ràng buộc kỹ thuật không vượt qua được.',
          },
          {
            q: 'Ai chịu trách nhiệm nếu hàng hư ở điểm chuyển tải?',
            a: 'Chúng tôi. Đó là lý do chúng tôi nhận cả chặng thay vì chỉ nhận phần vận chuyển. Hiện trạng hàng được nghiệm thu và lập chứng từ ở từng mốc bàn giao, nên khi có sự cố thì xác định được nó xảy ra ở đâu.',
          },
          {
            q: 'Thời gian đa phương thức chênh bao nhiêu so với đường bộ?',
            a: 'Phụ thuộc tuyến, lịch tàu và điều kiện thuỷ triều tại bến. Chúng tôi đưa cả hai phương án kèm mốc thời gian dự kiến để chủ hàng cân giữa chi phí và tiến độ, thay vì mặc định chọn một bên.',
          },
        ],
        meta: {
          title: 'Vận tải đa phương thức',
          description:
            'Kết hợp đường bộ và đường thuỷ cho hàng dự án, nâng hạ tại điểm chuyển tải bằng thiết bị nội bộ.',
        },
      },

      project: {
        name: 'FCL/LCL, hàng dự án & siêu trường siêu trọng',
        body: 'Khảo sát tuyến, lập phương án nâng hạ, xin giấy phép lưu hành, bố trí xe dẫn đoàn và hộ tống.',
        intro:
          'Hàng siêu trường siêu trọng không phải là hàng thường có kích thước lớn hơn. Nó là loại hàng mà tuyến đường phải được chứng minh là đi được trước khi xe lăn bánh, và mọi sai sót trong khâu chuẩn bị đều được trả bằng ngày, không phải bằng giờ.',
        problems: [
          {
            name: 'Giấy phép lưu hành xin sát ngày',
            body: 'Hồ sơ xin phép cần kết quả khảo sát tuyến và phương án chằng buộc. Bắt đầu muộn thì giấy phép trở thành đường găng của cả dự án.',
          },
          {
            name: 'Khảo sát thiếu, đoàn xe kẹt giữa đường',
            body: 'Một cầu yếu, một khúc cua hẹp hoặc một đường dây điện thấp không được ghi nhận là đủ để đoàn xe phải dừng, xin phép lại và tìm tuyến khác.',
          },
          {
            name: 'Thiết bị nâng hạ không đủ tải hoặc không vào được',
            body: 'Cẩu đủ tải nhưng không đủ tầm với, hoặc mặt bằng không chịu được chân chống. Phát hiện tại hiện trường đồng nghĩa với dừng thi công.',
          },
        ],
        approach: [
          {
            name: 'Khảo sát tuyến và đo đạc thực địa',
            body: 'Tĩnh không, bán kính cua, tải trọng cầu, mặt bằng hai đầu và các điểm nút. Kết quả là căn cứ cho cả phương án nâng hạ lẫn hồ sơ giấy phép.',
          },
          {
            name: 'Lập phương án nâng hạ và chằng buộc',
            body: 'Chọn thiết bị theo tải trọng và tầm với thực tế, xác định điểm móc cáp, tính toán chằng buộc theo trọng tâm hàng.',
          },
          {
            name: 'Xin giấy phép lưu hành',
            body: 'Chuẩn bị và nộp hồ sơ cho tuyến đã khảo sát, bao gồm cả phương án gia cố nếu tuyến yêu cầu.',
          },
          {
            name: 'Bố trí xe dẫn đoàn và hộ tống',
            body: 'Đoàn di chuyển theo khung giờ được phép, có xe dẫn đường và lực lượng hộ tống trên các đoạn hạn chế.',
          },
        ],
        usps: [
          {
            name: 'Rơ-moóc sàn thấp và đội xe chuyên dụng',
            body: 'Rơ-moóc sàn thấp cho hàng quá khổ quá tải, xe đầu kéo và rơ-moóc container 20ft, 40ft, 45ft — thiết bị thuộc đội xe của chúng tôi.',
          },
          {
            name: 'Nâng hạ và vận chuyển cùng một nhà thầu',
            body: 'Cẩu Kato 45 tấn và đội nâng hạ đi cùng phương án vận chuyển, nên trách nhiệm không bị cắt tại chân công trình.',
          },
          {
            name: 'Xe dẫn đoàn và hộ tống là dịch vụ sẵn có',
            body: 'Không phải thuê ngoài theo từng chuyến, nên lịch đoàn xe không phụ thuộc vào lịch của một bên thứ ba.',
          },
        ],
        points: [
          'Vận chuyển hàng nguyên container (FCL) và hàng ghép (LCL)',
          'Hàng dự án, hàng siêu trường siêu trọng',
          'Khảo sát tuyến thực địa và lập phương án nâng hạ',
          'Xin giấy phép lưu hành cho hàng quá khổ, quá tải',
          'Bố trí xe dẫn đoàn và hộ tống trên tuyến',
        ],
        faqs: [
          {
            q: 'Cần báo trước bao lâu cho một lô hàng siêu trường?',
            a: 'Càng sớm càng tốt, vì đường găng thường là khảo sát tuyến và giấy phép lưu hành chứ không phải việc điều xe. Ngay khi có thông số sơ bộ và hai điểm đầu cuối, chúng tôi đã bắt đầu đánh giá được tuyến.',
          },
          {
            q: 'Nếu tuyến có cầu không đủ tải thì sao?',
            a: 'Có ba hướng: tìm tuyến thay thế, gia cố tạm hoặc chuyển một đoạn sang đường thuỷ. Cả ba đều cần biết trước khi lập phương án — đó chính là lý do khảo sát thực địa không thể bỏ qua.',
          },
          {
            q: 'BEE có làm cả phần lắp đặt tại vị trí không?',
            a: 'Chúng tôi đưa máy móc tới đúng vị trí lắp đặt, kể cả bằng phương pháp thủ công trong không gian chật hẹp mà cẩu và xe nâng không tiếp cận được. Phần đấu nối và chạy thử thuộc nhà thầu cơ điện của dự án.',
          },
        ],
        meta: {
          title: 'Hàng siêu trường siêu trọng',
          description:
            'Khảo sát tuyến, phương án nâng hạ, giấy phép lưu hành, xe dẫn đoàn và hộ tống cho hàng dự án quá khổ quá tải.',
        },
      },

      lifting: {
        name: 'Xếp dỡ, di dời & nâng hạ thiết bị',
        body: 'Bốc xếp chuyên nghiệp, giám sát an toàn và hỗ trợ toàn diện tại hiện trường.',
        intro:
          'Quãng đường cuối cùng của một cỗ máy thường chỉ vài chục mét — từ cổng nhà xưởng tới bệ móng — và đó lại là quãng khó nhất. Cẩu không vào được, sàn không chịu tải, nhà máy vẫn đang chạy. Đây là phần việc mà thiết bị lớn hết tác dụng và kinh nghiệm con người quyết định.',
        problems: [
          {
            name: 'Cẩu không tiếp cận được vị trí lắp đặt',
            body: 'Trạm điện, nhà xưởng có mái, hành lang hẹp giữa hai dây chuyền đang vận hành — những nơi mà xe cẩu đơn giản là không vào tới.',
          },
          {
            name: 'Sàn không chịu được tải tập trung',
            body: 'Chân chống cẩu hoặc bánh xe nâng dồn tải lên một điểm vượt sức chịu của sàn tầng hoặc nền nhà xưởng, gây nứt nền hoặc lún cục bộ.',
          },
          {
            name: 'Không thể dừng dây chuyền để di dời',
            body: 'Nhà máy chỉ cho phép thi công trong khung giờ ngắn hoặc trong kỳ bảo dưỡng. Phương án nào cần dừng sản xuất lâu đều bị loại.',
          },
        ],
        approach: [
          {
            name: 'Khảo sát mặt bằng và đường tiếp cận',
            body: 'Đo lối vào, chiều cao thông thuỷ, khả năng chịu tải của nền và sàn, xác định vị trí đặt thiết bị nếu dùng được cơ giới.',
          },
          {
            name: 'Chọn giữa cơ giới và thủ công',
            body: 'Dùng cẩu và xe nâng ở đoạn có thể; chuyển sang con lăn, kích thuỷ lực và tời khi không gian không cho phép thiết bị lớn vào.',
          },
          {
            name: 'Thi công theo khung giờ của nhà máy',
            body: 'Chia công việc thành các bước có thể dừng an toàn, để thi công khớp với cửa sổ thời gian mà sản xuất cho phép.',
          },
          {
            name: 'Giám sát an toàn ở từng bước',
            body: 'Kiểm tra chằng buộc, điểm móc và tải trọng trước mỗi lần nâng, có người giám sát độc lập với người vận hành.',
          },
        ],
        usps: [
          {
            name: 'Vào được chỗ cẩu không vào được',
            body: 'Di dời thủ công vào đúng vị trí lắp đặt tại trạm điện và nhà máy — năng lực mà phần lớn nhà thầu vận tải không có.',
          },
          {
            name: 'Thiết bị nâng hạ thuộc đội của chúng tôi',
            body: 'Cẩu Kato 45 tấn, 02 xe nâng 3–5 tấn, 04 xe nâng điện và 10 xe nâng tay — điều động được theo lịch của dự án.',
          },
          {
            name: '40 công nhân lành nghề',
            body: 'Đội thi công cố định, không gom theo vụ việc, nên quy trình an toàn và cách làm giữ được sự nhất quán giữa các dự án.',
          },
        ],
        points: [
          'Xếp dỡ, nâng hạ và di dời máy móc, thiết bị',
          'Di dời thủ công vào vị trí lắp đặt trong không gian chật hẹp',
          'Giám sát an toàn ở mọi khâu nâng hạ và chằng buộc',
          'Hỗ trợ toàn diện tại hiện trường',
        ],
        faqs: [
          {
            q: 'Máy nặng bao nhiêu thì phải dùng cẩu thay vì thủ công?',
            a: 'Không có ngưỡng cố định. Quyết định phụ thuộc vào không gian tiếp cận, khả năng chịu tải của nền và độ chính xác cần đạt khi đặt máy. Có những cỗ máy vài chục tấn vẫn phải di dời thủ công vì cẩu không vào được.',
          },
          {
            q: 'Có làm được khi nhà máy vẫn đang sản xuất không?',
            a: 'Có, đây là tình huống thường gặp. Công việc được chia thành các bước dừng được an toàn và bố trí theo khung giờ nhà máy cho phép, thay vì yêu cầu dừng dây chuyền dài ngày.',
          },
          {
            q: 'BEE có chịu trách nhiệm nếu thiết bị hư trong quá trình di dời không?',
            a: 'Hiện trạng thiết bị được nghiệm thu trước và sau khi di dời, có biên bản. Phạm vi trách nhiệm được thoả thuận trong hợp đồng theo giá trị và đặc thù thiết bị — hãy trao đổi điểm này ngay từ khi hỏi giá.',
          },
        ],
        meta: {
          title: 'Xếp dỡ, nâng hạ & di dời thiết bị',
          description:
            'Cẩu Kato 45 tấn, xe nâng 3–25 tấn và di dời thủ công vào nơi cẩu không vào được — trạm điện, nhà máy đang chạy.',
        },
      },

      packing: {
        name: 'Đóng/rút hàng, đóng kiện & đóng gói',
        body: 'Đóng thùng gỗ, hút chân không, đai kiện và thiết kế bao bì theo yêu cầu riêng.',
        intro:
          'Bao bì là khoản chi phí duy nhất trong chuỗi vận chuyển mà cắt đi thì không thấy tác động ngay — tác động xuất hiện ở cảng đến, khi hàng bị từ chối, hoặc khi mở kiện ra thấy hàng đã hỏng. Với hàng xuất khẩu và hàng giá trị cao, đóng gói là kỹ thuật chứ không phải vật tư.',
        problems: [
          {
            name: 'Hàng hư vì rung động và ẩm trên đường',
            body: 'Thiết bị chính xác, bo mạch và bề mặt gia công tinh hỏng vì rung động dồn tích và hơi ẩm trong container, chứ không phải vì va đập một lần.',
          },
          {
            name: 'Bao bì gỗ bị từ chối ở cảng đến',
            body: 'Nhiều nước yêu cầu gỗ đóng kiện phải qua xử lý và có dấu hợp lệ. Kiện không đạt bị giữ lại hoặc buộc đóng gói lại tại chỗ với chi phí rất cao.',
          },
          {
            name: 'Chằng buộc trong container làm qua loa',
            body: 'Hàng nặng không được cố định đúng cách sẽ dịch chuyển khi tàu lắc hoặc xe phanh gấp, phá hỏng chính nó và cả các kiện xung quanh.',
          },
        ],
        approach: [
          {
            name: 'Xác định rủi ro theo hàng và theo tuyến',
            body: 'Hàng sợ ẩm, sợ rung hay sợ va đập là ba bài toán khác nhau; tuyến biển dài và tuyến bộ ngắn cũng đòi hỏi mức bảo vệ khác nhau.',
          },
          {
            name: 'Thiết kế kiện theo trọng tâm và điểm nâng',
            body: 'Kiện được làm để nâng được đúng cách ở đầu bên kia, có điểm móc rõ ràng và chịu được xếp chồng nếu tuyến yêu cầu.',
          },
          {
            name: 'Hút chân không cho hàng nhạy ẩm',
            body: 'Bọc kín kèm vật liệu hút ẩm cho thiết bị và bề mặt kim loại, đặc biệt với tuyến biển dài hoặc lưu kho chờ thông quan.',
          },
          {
            name: 'Chằng buộc và gia cố trong container',
            body: 'Cố định theo trọng tâm hàng, chèn khoảng trống và đai kiện để hàng không dịch chuyển trong suốt hành trình.',
          },
        ],
        usps: [
          {
            name: 'Kinh nghiệm với hàng cực nhạy',
            body: 'Đóng gói và gia cố cho những mặt hàng như động cơ máy bay và vi mạch — nhóm hàng không có chỗ cho sai sót.',
          },
          {
            name: 'Đóng gói ngay tại kho của chúng tôi',
            body: '26.000 m² kho với 23 sàn nâng cho phép rút hàng, đóng kiện và đóng container trong cùng một nơi, không phải chở qua lại giữa các bên.',
          },
          {
            name: 'Gắn liền với khâu vận chuyển',
            body: 'Người thiết kế kiện biết trước hàng sẽ đi tuyến nào, xếp dỡ mấy lần và nâng bằng thiết bị gì — thông tin mà một xưởng đóng gói độc lập không có.',
          },
        ],
        points: [
          'Đóng và rút hàng container',
          'Đóng kiện, đóng thùng gỗ theo quy cách xuất khẩu',
          'Hút chân không và chằng buộc hàng hoá',
          'Gia cố hàng nhạy cảm: động cơ máy bay, vi mạch',
        ],
        faqs: [
          {
            q: 'Gỗ đóng kiện xuất khẩu có cần xử lý không?',
            a: 'Phần lớn thị trường yêu cầu vật liệu gỗ đóng kiện phải qua xử lý kiểm dịch và mang dấu hợp lệ. Yêu cầu cụ thể khác nhau theo nước đến, nên hãy cho chúng tôi biết điểm đến ngay từ đầu để làm đúng quy cách ngay lần đầu.',
          },
          {
            q: 'Hút chân không có cần thiết cho mọi lô hàng không?',
            a: 'Không. Nó xứng đáng với thiết bị nhạy ẩm, bề mặt kim loại gia công tinh, và những lô đi tuyến biển dài hoặc phải nằm kho chờ thông quan. Hàng phổ thông tuyến ngắn thì thường không cần.',
          },
          {
            q: 'Có nhận đóng gói cho hàng do bên khác vận chuyển không?',
            a: 'Có. Dịch vụ đóng kiện và đóng gói nhận riêng, không bắt buộc đi kèm hợp đồng vận chuyển. Tuy nhiên khi biết trước tuyến và cách xếp dỡ, chúng tôi thiết kế kiện sát với thực tế hơn.',
          },
        ],
        meta: {
          title: 'Đóng kiện & đóng gói',
          description:
            'Đóng/rút container, thùng gỗ quy cách xuất khẩu, hút chân không và chằng buộc cho hàng nhạy cảm như động cơ máy bay, vi mạch.',
        },
      },

      crossborder: {
        name: 'Hàng quá cảnh & xuyên biên giới',
        body: 'Vận chuyển qua biên giới, hỗ trợ giấy phép và thủ tục tại các cửa khẩu.',
        intro:
          'Giữa đường biển và đường hàng không có một khoảng trống mà nhiều lô hàng rơi vào: quá gấp để đi tàu, quá nặng để đi máy bay. Đường bộ xuyên biên giới lấp đúng khoảng đó — với điều kiện nhà vận chuyển thật sự có tuyến, chứ không phải bán lại chỗ của người khác.',
        problems: [
          {
            name: 'Đường biển quá chậm, hàng không quá đắt',
            body: 'Lô hàng cần tới trong một tuần nhưng chi phí không cho phép đi máy bay là tình huống điển hình mà cả hai phương thức truyền thống đều không giải được.',
          },
          {
            name: 'Mất kiểm soát khi đổi đầu kéo ở biên giới',
            body: 'Hàng sang xe của một nhà thầu khác tại cửa khẩu. Từ thời điểm đó, thông tin về lô hàng phụ thuộc hoàn toàn vào thiện chí của bên kia.',
          },
          {
            name: 'Thủ tục cửa khẩu làm sai một lần là nằm bãi',
            body: 'Bộ chứng từ không khớp hoặc thiếu giấy phép chuyên ngành khiến xe nằm chờ tại cửa khẩu, phát sinh phí lưu bãi và trễ toàn bộ kế hoạch.',
          },
        ],
        approach: [
          {
            name: 'Chọn hành lang phù hợp với điểm đi và điểm đến',
            body: 'Ba hành lang chính — Việt Nam – Trung Quốc – Lào – Thái Lan, Việt Nam – Lào, Việt Nam – Campuchia — với cửa khẩu và điểm trung chuyển khác nhau.',
          },
          {
            name: 'Chuẩn bị chứng từ trước khi xe tới cửa khẩu',
            body: 'Hồ sơ hải quan và giấy phép chuyên ngành được xử lý trước, để thời gian tại cửa khẩu là thời gian làm thủ tục chứ không phải thời gian bổ sung giấy tờ.',
          },
          {
            name: 'Giám sát liên tục qua các chặng',
            body: 'Theo dõi GPS 24/7 duy trì trong suốt hành trình, kể cả sau khi qua biên giới, nên chủ hàng không mất dấu lô hàng tại điểm chuyển tiếp.',
          },
        ],
        usps: [
          {
            name: '10 tuyến đang khai thác, không phải tuyến trên giấy',
            body: 'Từ Quảng Châu – Nam Ninh – Hà Nội tới Bangkok – Kuala Lumpur – Singapore, mỗi tuyến có lịch và điểm trung chuyển cụ thể.',
          },
          {
            name: 'Nhanh hơn đường biển, rẻ hơn đường hàng không',
            body: 'Đúng phân khúc mà hai phương thức truyền thống bỏ trống, với mức linh hoạt tới tận điểm giao mà cảng và sân bay không có.',
          },
          {
            name: 'Hải quan làm trong nhà',
            body: 'Là đại lý hải quan có giấy phép, chúng tôi chuẩn bị chứng từ cho chính lô hàng mình chở — không có khoảng trống trách nhiệm giữa bên khai và bên vận chuyển.',
          },
        ],
        points: [
          '10 tuyến đường bộ đang khai thác qua 8 quốc gia Đông Nam Á',
          'Ba hành lang: Việt Nam – Trung Quốc – Lào – Thái Lan, Việt Nam – Lào, Việt Nam – Campuchia',
          'Hỗ trợ giấy phép và thủ tục tại các cửa khẩu',
          'Nhanh hơn đường biển, rẻ hơn đường hàng không, theo dõi GPS 24/7',
        ],
        faqs: [
          {
            q: 'Hàng đi Lào và Campuchia có điều kiện gì đặc biệt không?',
            a: 'Tuyến Việt Nam – Lào chỉ áp dụng cho hàng đã khai báo hải quan đầy đủ và hoàn tất nghĩa vụ thuế. Tuyến Việt Nam – Campuchia đi từ cảng TP.HCM hoặc từ nội địa tới các cửa khẩu giáp biên, tuỳ điểm giao cuối.',
          },
          {
            q: 'Xe có phải đổi ở biên giới không?',
            a: 'Tuỳ tuyến và quy định từng cửa khẩu. Điều quan trọng là ở chỗ dù có chuyển tải hay không, lô hàng vẫn nằm trong cùng một hợp đồng và cùng một hệ thống giám sát của chúng tôi.',
          },
          {
            q: 'Thời gian vận chuyển xuyên biên giới mất bao lâu?',
            a: 'Phụ thuộc tuyến, thời gian thông quan tại cửa khẩu và mùa cao điểm. Chúng tôi đưa mốc dự kiến theo từng tuyến cụ thể khi báo giá, kèm các yếu tố có thể làm lệch mốc đó.',
          },
        ],
        meta: {
          title: 'Hàng quá cảnh & xuyên biên giới',
          description:
            '10 tuyến đường bộ qua Việt Nam, Trung Quốc, Lào, Thái Lan, Campuchia, Myanmar, Malaysia và Singapore. GPS 24/7.',
        },
      },

      leasing: {
        name: 'Cho thuê thiết bị',
        body: 'Xe đầu kéo container, xe nâng, cẩu — thuê theo giờ, theo chuyến hoặc theo tháng.',
        intro:
          'Mua một chiếc cẩu cho một dự án sáu tháng hiếm khi là quyết định đúng. Nhưng thuê thiết bị cũng có cái bẫy riêng: máy tới nơi mà không có người vận hành đủ chứng chỉ, hoặc hỏng giữa chừng và bên cho thuê không có máy thay thế.',
        problems: [
          {
            name: 'Đầu tư thiết bị cho nhu cầu ngắn hạn',
            body: 'Vốn nằm chết trong tài sản chỉ dùng vài tháng, kèm chi phí bảo dưỡng, bến bãi và khấu hao cho phần thời gian còn lại.',
          },
          {
            name: 'Thuê máy nhưng không có người vận hành',
            body: 'Thiết bị nâng hạ đòi hỏi người vận hành có chứng chỉ. Thuê máy trần rồi tự tìm người là rủi ro an toàn và rủi ro pháp lý.',
          },
          {
            name: 'Hỏng giữa chừng, không có máy thay',
            body: 'Bên cho thuê nhỏ thường chỉ có một máy mỗi loại. Máy hỏng đồng nghĩa với dừng thi công cho tới khi sửa xong.',
          },
        ],
        approach: [
          {
            name: 'Chọn thiết bị theo công việc, không theo cái đang rảnh',
            body: 'Xác định tải trọng, tầm với và điều kiện mặt bằng thực tế trước khi đề xuất máy, tránh tình trạng máy tới nơi mới biết không dùng được.',
          },
          {
            name: 'Kèm đội vận hành có chứng chỉ',
            body: 'Thiết bị đi cùng người vận hành, nên trách nhiệm an toàn và trách nhiệm thiết bị nằm cùng một chỗ.',
          },
          {
            name: 'Thuê theo giờ, theo chuyến hoặc theo tháng',
            body: 'Cấu trúc thuê khớp với hình dạng nhu cầu, thay vì buộc khách trả theo tháng cho một công việc hai ngày.',
          },
        ],
        usps: [
          {
            name: 'Đội thiết bị đủ chủng loại',
            body: 'Xe đầu kéo và rơ-moóc 20ft/40ft/45ft, rơ-moóc sàn thấp, xe nâng 2,5–25 tấn, cẩu bánh lốp và bánh xích, xe dẫn đoàn.',
          },
          {
            name: 'Thiết bị nằm trong đội xe 120+ đầu',
            body: 'Quy mô đội đủ lớn để có phương án thay thế khi một máy gặp sự cố, thay vì để công trường dừng chờ.',
          },
          {
            name: 'Thuê xong vẫn dùng được phần còn lại của chuỗi',
            body: 'Khi công việc phát sinh thêm khâu vận chuyển, nâng hạ hay lưu kho, không phải đi tìm và ký thêm một nhà thầu mới.',
          },
        ],
        points: [
          'Xe đầu kéo và rơ-moóc container 20ft, 40ft, 45ft',
          'Rơ-moóc sàn thấp cho hàng quá khổ, quá tải',
          'Xe nâng 2,5 – 25 tấn, xe nâng điện và xe nâng tay',
          'Cẩu bánh lốp và bánh xích theo yêu cầu dự án',
          'Thuê theo giờ, theo chuyến hoặc theo tháng, kèm đội vận hành có chứng chỉ',
        ],
        faqs: [
          {
            q: 'Giá thuê đã bao gồm người vận hành chưa?',
            a: 'Thiết bị nâng hạ được cho thuê kèm đội vận hành có chứng chỉ — đây là mặc định chứ không phải tuỳ chọn, vì lý do an toàn và pháp lý. Chi phí nhiên liệu và di chuyển thiết bị tới công trường được báo riêng theo cự ly.',
          },
          {
            q: 'Thuê tối thiểu bao lâu?',
            a: 'Có thể thuê theo giờ, theo chuyến hoặc theo tháng. Với công việc ngắn, chi phí đưa thiết bị tới và rút về thường chiếm tỷ trọng lớn, nên gom các hạng mục vào cùng một đợt sẽ kinh tế hơn.',
          },
          {
            q: 'Máy hỏng giữa chừng thì xử lý thế nào?',
            a: 'Chúng tôi bố trí thiết bị thay thế trong phạm vi đội xe của mình. Đây là lý do quy mô đội quan trọng với dịch vụ cho thuê — một bên chỉ có một máy mỗi loại không thể cam kết điều đó.',
          },
        ],
        meta: {
          title: 'Cho thuê thiết bị',
          description:
            'Xe đầu kéo, rơ-moóc sàn thấp, xe nâng 2,5–25 tấn và cẩu — thuê theo giờ, chuyến hoặc tháng, kèm người vận hành.',
        },
      },

      customs: {
        name: 'Khai báo hải quan & môi giới hàng hải',
        body: 'Thủ tục xuất nhập khẩu trọn gói và dịch vụ môi giới tàu, thuê tàu chuyến.',
        intro:
          'Thông quan là khâu mà chi phí phát sinh nhanh nhất trong cả chuỗi: mỗi ngày hàng nằm cảng là phí lưu container, phí lưu bãi và một dây chuyền sản xuất chờ nguyên liệu. Phần lớn những ngày đó không mất vì hải quan chậm, mà vì bộ chứng từ chưa đúng ngay từ đầu.',
        problems: [
          {
            name: 'Áp sai mã HS',
            body: 'Sai mã dẫn tới sai thuế suất. Phát hiện sớm thì mất thời gian sửa tờ khai; phát hiện muộn qua hậu kiểm thì bị truy thu kèm phạt.',
          },
          {
            name: 'C/O không hợp lệ, mất ưu đãi thuế',
            body: 'Chứng nhận xuất xứ sai mẫu, sai thông tin hoặc nộp trễ khiến lô hàng mất toàn bộ ưu đãi thuế quan mà lẽ ra được hưởng.',
          },
          {
            name: 'Thiếu giấy phép chuyên ngành',
            body: 'Nhiều mặt hàng cần kiểm tra chuyên ngành trước thông quan. Không chuẩn bị trước thì hàng nằm cảng chờ, và phí lưu container chạy theo ngày.',
          },
        ],
        approach: [
          {
            name: 'Rà chứng từ trước khi hàng về',
            body: 'Kiểm tra bộ chứng từ, mã HS dự kiến và yêu cầu chuyên ngành ngay từ khi có thông tin lô hàng, thay vì đợi hàng cập cảng.',
          },
          {
            name: 'Tư vấn thuế suất và phương án tối ưu hợp pháp',
            body: 'Xác định mã HS đúng, các hiệp định thương mại có thể áp dụng và bộ hồ sơ cần có để hưởng ưu đãi.',
          },
          {
            name: 'Khai báo trên nền tảng EDI',
            body: 'Truyền tờ khai điện tử và theo dõi trạng thái xử lý, rút ngắn thời gian so với quy trình thủ công.',
          },
          {
            name: 'Theo hàng qua kiểm hoá tới khi thông quan',
            body: 'Có người trực tiếp xử lý khi lô hàng bị phân luồng kiểm hoá, thay vì để chủ hàng tự xoay ở cảng.',
          },
        ],
        usps: [
          {
            name: 'Đại lý hải quan có giấy phép',
            body: 'Số giấy phép 2569/HQHCM-GSQL — hoạt động với tư cách đại lý được cấp phép, không phải dịch vụ khai thuê không đăng ký.',
          },
          {
            name: '196.718 tờ khai trong năm 2024',
            body: 'Khối lượng đó nghĩa là hầu hết tình huống phát sinh đã từng gặp, và có quy trình sẵn thay vì xử lý theo kinh nghiệm cá nhân.',
          },
          {
            name: 'Thông quan gắn liền với vận chuyển và kho',
            body: 'Kho ngoại quan 9.536 vị trí pallet và đội xe riêng, nên hàng ra khỏi cảng là đi tiếp ngay, không phải chờ điều xe từ bên khác.',
          },
        ],
        points: [
          'Tư vấn thuế suất và thủ tục hải quan',
          'Kiểm hoá, giấy phép và phê duyệt',
          'Đăng ký C/O và hoàn thuế',
          'Môi giới tàu và thuê tàu chuyến',
        ],
        faqs: [
          {
            q: 'Thông quan mất bao lâu?',
            a: 'Thông thường khoảng 6–8 giờ làm việc kể từ khi máy bay hạ cánh với hàng không, và 2 ngày làm việc kể từ khi dỡ hàng khỏi tàu với đường biển — với điều kiện thông tin được cung cấp đầy đủ, chính xác và kịp thời.',
          },
          {
            q: 'Cần chuẩn bị những chứng từ gì?',
            a: 'Tối thiểu là hợp đồng, hoá đơn thương mại, phiếu đóng gói và vận đơn. Tuỳ mặt hàng có thể cần thêm C/O, giấy phép chuyên ngành hoặc kết quả kiểm tra chất lượng. Gửi thông tin sớm để chúng tôi rà trước.',
          },
          {
            q: 'Nếu bị áp sai mã HS thì xử lý thế nào?',
            a: 'Có thể khai bổ sung hoặc sửa tờ khai tuỳ thời điểm phát hiện. Chi phí và rủi ro tăng theo thời gian, nên khâu rà mã HS trước khi khai là chỗ đáng đầu tư nhất trong toàn bộ quy trình.',
          },
        ],
        meta: {
          title: 'Khai báo hải quan',
          description:
            'Đại lý hải quan 2569/HQHCM-GSQL. Thông quan hàng không 6–8 giờ, đường biển 2 ngày. Tư vấn mã HS, C/O, hoàn thuế.',
        },
      },
    },
  },
  why: {
    eyebrow: 'Thế mạnh',
    title: 'Vì sao khách hàng chọn',
    titleAccent: 'BEE',
    items: [
      {
        name: 'An toàn tuyệt đối',
        body: 'Quy trình giám sát an toàn ở mọi khâu nâng hạ, chằng buộc và di chuyển hàng nặng.',
      },
      {
        name: 'Đúng tiến độ',
        body: 'Kế hoạch tuyến chi tiết, dự phòng rủi ro và cập nhật trạng thái liên tục cho chủ hàng.',
      },
      {
        name: 'Tối ưu chi phí',
        body: 'Kết hợp đa phương thức và gom hàng thông minh để giảm giá thành trên mỗi tấn-km.',
      },
      {
        name: 'Pháp lý đầy đủ',
        body: 'Hỗ trợ trọn gói giấy phép lưu hành, thủ tục hải quan và quá cảnh xuyên biên giới.',
      },
      {
        name: 'Đội ngũ chuyên trách',
        body: 'Một đầu mối phụ trách xuyên suốt dự án, phản hồi nhanh 24/7.',
      },
      {
        name: 'Phủ sóng toàn quốc',
        body: 'Văn phòng tại TP. Hồ Chí Minh và Đà Nẵng, mạng lưới đối tác trong nước và quốc tế.',
      },
    ],
  },

  process: {
    eyebrow: 'Quy trình',
    title: '4 bước triển khai',
    titleAccent: 'rõ ràng',
    steps: [
      {
        name: 'Tiếp nhận & khảo sát',
        body: 'Ghi nhận thông số hàng hoá, điểm đi — điểm đến và khảo sát tuyến thực địa.',
      },
      {
        name: 'Lập phương án & báo giá',
        body: 'Đề xuất phương thức, thiết bị, nhân lực kèm bảng giá minh bạch.',
      },
      {
        name: 'Thực hiện & giám sát',
        body: 'Triển khai theo kế hoạch, giám sát an toàn và cập nhật hành trình liên tục.',
      },
      {
        name: 'Bàn giao & nghiệm thu',
        body: 'Giao hàng tận nơi, nghiệm thu hiện trạng và hoàn tất chứng từ.',
      },
    ],
  },

  fleet: {
    eyebrow: 'Năng lực thiết bị',
    title: 'Thiết bị',
    titleAccent: 'sẵn sàng',
    titleTail: 'cho mọi loại hàng',
    body: 'Cho thuê linh hoạt theo giờ, theo chuyến hoặc theo tháng — kèm đội ngũ vận hành có chứng chỉ.',
    cta: 'Hỏi thuê thiết bị',
    items: [
      { name: 'Xe đầu kéo & rơ-moóc container', spec: '20ft · 40ft · 45ft' },
      { name: 'Rơ-moóc sàn thấp / lùn', spec: 'Hàng quá khổ, quá tải' },
      { name: 'Xe nâng', spec: '2.5 – 25 tấn' },
      { name: 'Cẩu bánh lốp / bánh xích', spec: 'Theo yêu cầu dự án' },
      { name: 'Xe dẫn đoàn & hộ tống', spec: 'Tuyến siêu trường siêu trọng' },
    ],
  },

  /**
   * Every figure in this block comes from the company profile deck
   * (profile-betransport.pptx, 07/2025), slides 14–19.
   */
  warehousing: {
    eyebrow: 'Kho bãi & phân phối',
    title: '26.000 m² kho',
    titleAccent: 'vận hành',
    titleTail: 'theo chuẩn quốc tế',
    lead: 'Ba loại kho chức năng dưới một hệ thống quản lý duy nhất — từ kho lạnh âm sâu cho hải sản và thực phẩm đông lạnh, tới kho ngoại quan phục vụ hàng xuất nhập khẩu chờ thông quan.',
    overview: [
      { to: 26000, suffix: ' m²', label: 'Tổng diện tích kho' },
      { to: 30000, suffix: '', label: 'Vị trí pallet' },
      { to: 23, suffix: '', label: 'Sàn nâng bốc/dỡ hàng' },
      { to: 3, suffix: '', label: 'Loại kho chức năng' },
    ],
    typesHeading: 'Ba loại kho chức năng dưới một hệ thống quản lý duy nhất',
    warehouses: [
      {
        name: 'Kho lạnh',
        specs: [
          { label: 'Diện tích', value: '3.895 m²' },
          { label: 'Sức chứa', value: '7.850 pallet' },
          { label: 'Nhiệt độ', value: '-25°C' },
          { label: 'Hàng lưu trữ', value: 'Thực phẩm đông lạnh, hải sản, thực phẩm & đồ uống' },
        ],
      },
      {
        name: 'Kho phân phối',
        specs: [
          { label: 'Diện tích', value: '6.034 m²' },
          { label: 'Sức chứa', value: '12.242 pallet' },
          { label: 'Hệ thống kệ', value: 'Kệ đôi sâu 7 tầng, tối ưu không gian lưu trữ' },
          { label: 'Hiệu suất', value: 'Bố trí hiện đại giúp truy xuất và điều phối nhanh chóng' },
        ],
      },
      {
        name: 'Kho ngoại quan',
        specs: [
          { label: 'Sức chứa', value: '9.536 pallet' },
          { label: 'Hỗ trợ thông quan', value: 'Xử lý nhanh chóng hàng hoá xuất nhập khẩu' },
          { label: 'An ninh', value: 'Hệ thống giám sát 24/7 bảo vệ hàng hoá giá trị cao' },
          { label: 'Hồ sơ', value: 'Lưu trữ chi tiết, tuân thủ quy định pháp lý' },
        ],
      },
    ],
    techHeading: 'Công nghệ vận hành',
    tech: [
      {
        name: 'WMS & TMS',
        body: 'Ứng dụng hệ thống quản lý kho và quản lý vận tải cùng máy quét mã vạch, tự động hoá quy trình quản lý tồn kho và phân phối.',
      },
      {
        name: 'Điện mặt trời áp mái',
        body: 'Sử dụng năng lượng mặt trời nhằm giảm thiểu khí thải và hướng tới vận hành bền vững.',
      },
      {
        name: 'Chữa cháy tự động',
        body: 'Hệ thống chữa cháy tự động với đầu phun công nghệ mới, đảm bảo an toàn tối đa cho hàng hoá.',
      },
      {
        name: 'Tiêu chuẩn HACCP',
        body: 'Áp dụng cho thực phẩm tươi sống và đông lạnh, phát hiện và kiểm soát các nguy cơ tiềm ẩn trong kho lạnh.',
      },
    ],
    infraHeading: 'Hạ tầng kho bãi',
    infra: [
      'Hệ thống chống thấm, chống bão, chống côn trùng, chống chim',
      'Hệ thống phòng cháy chữa cháy và thông gió',
      'Hệ thống báo động và quạt công nghiệp',
      '50 đầu camera giám sát (CCTV) hoạt động 24/24',
      '2.000 pallet, hệ thống kệ 5 tầng chịu tải 1,6 tấn/tầng/pallet',
      'Đội ngũ an ninh trực 24/24 và 40 công nhân lành nghề',
    ],
  },

  crossborder: {
    eyebrow: 'Vận chuyển quốc tế',
    title: '10 tuyến đang khai thác',
    titleAccent: 'qua 8 quốc gia',
    titleTail: 'Đông Nam Á',
    lead: 'Đường bộ xuyên biên giới lấp đúng khoảng trống giữa đường biển và đường hàng không: nhanh hơn tàu, rẻ hơn máy bay, và linh hoạt tới tận điểm giao.',
    benefits: [
      'Vận chuyển linh hoạt',
      'Nhanh hơn đường biển',
      'Rẻ hơn đường hàng không',
      'Theo dõi GPS 24/7',
    ],
    mapAlt: 'Bản đồ mạng lưới vận tải xuyên biên giới của BEE Transportation: 10 tuyến đánh số nối Việt Nam với Trung Quốc, Lào, Thái Lan, Campuchia, Myanmar, Malaysia và Singapore, kèm mạng lưới chi nhánh dọc Việt Nam từ Lạng Sơn tới Cần Thơ.',
    mapCaption: 'Mạng lưới tuyến xuyên biên giới',
    mapSource: 'Số trên bản đồ tương ứng với số thứ tự trong danh sách tuyến bên dưới.',
    routesHeading: 'Các tuyến đang khai thác',
    routes: [
      'Guangzhou — Nanning — Hanoi',
      'Guangzhou — Nanning — Hanoi — Vientiane',
      'Da Nang — Vientiane',
      'Vientiane — Bangkok',
      'Ho Chi Minh — Phnom Penh',
      'Phnom Penh — Bangkok',
      'Bangkok — Yangon',
      'Bangkok — Penang',
      'Bangkok — Kuala Lumpur',
      'Bangkok — Kuala Lumpur — Singapore',
    ],
    corridorsHeading: 'Ba hành lang chính',
    corridors: [
      {
        name: 'Việt Nam — Trung Quốc — Lào — Thái Lan',
        body: 'Nhận hàng từ bất kỳ địa điểm nào tại Trung Quốc, vận chuyển qua các trung tâm tại Quảng Châu, Thâm Quyến và Nam Ninh, thông qua cửa khẩu Hữu Nghị. Địa điểm giao hàng tại Việt Nam hoặc Lào.',
      },
      {
        name: 'Việt Nam — Lào',
        body: 'Hàng hoá được vận chuyển từ nước ngoài đến các cảng Đà Nẵng, Hải Phòng và từ Việt Nam đến một số cảng tại Lào. Chỉ áp dụng cho hàng hoá đã khai báo hải quan đầy đủ và hoàn tất nghĩa vụ thuế.',
      },
      {
        name: 'Việt Nam — Campuchia',
        body: 'Hàng hoá được vận chuyển từ nước ngoài đến các cảng tại TP. Hồ Chí Minh, hoặc từ Việt Nam đến một số cửa khẩu giáp Campuchia.',
      },
    ],
  },

  tracking: {
    eyebrow: 'Giám sát hành trình',
    title: 'Vị trí GPS',
    titleAccent: 'theo thời gian thực',
    lead: 'Hệ thống theo dõi trực tiếp được sử dụng để cải thiện hành vi lái xe và tăng cường an ninh cho lô hàng.',
    items: [
      'Báo cáo hành trình theo thời gian thực, hiển thị vị trí của từng phương tiện',
      'Theo dõi trực tiếp phương tiện trên bản đồ',
      'Đo tốc độ di chuyển',
      'Giám sát lộ trình, điểm dừng và thay đổi tuyến đường',
      'Đo lường mức tiêu thụ nhiên liệu',
    ],
  },

  lifting: {
    eyebrow: 'Nâng hạ & di dời',
    title: 'Vào được chỗ',
    titleAccent: 'cẩu không vào được',
    lead: 'Bên cạnh nâng hạ bằng cẩu và xe nâng, chúng tôi di dời máy móc đến vị trí lắp đặt bằng phương pháp thủ công — thi công được trong không gian chật hẹp mà cẩu hoặc xe nâng không thể tiếp cận, như trạm điện hay nhà xưởng đang vận hành.',
    equipmentHeading: 'Thiết bị nâng hạ',
    equipment: [
      '01 cần cẩu Kato 45 tấn',
      '02 xe nâng 3–5 tấn',
      '04 xe nâng điện',
      '10 xe nâng tay',
    ],
    special: [
      {
        name: 'Di dời thủ công trong không gian hẹp',
        body: 'Đưa máy móc vào đúng vị trí lắp đặt tại trạm điện, nhà máy — nơi thiết bị cơ giới không tiếp cận được.',
      },
      {
        name: 'Đóng gói kỹ thuật cho hàng nhạy cảm',
        body: 'Đóng/rút container, hút chân không, chằng buộc và gia cố cho hàng như động cơ máy bay, vi mạch — đáp ứng yêu cầu kỹ thuật của hàng xuất khẩu.',
      },
    ],
  },

  customs: {
    eyebrow: 'Khai thuê hải quan',
    title: 'Đại lý hải quan',
    titleAccent: 'có giấy phép',
    lead: 'Khai báo hải quan là mối quan tâm hàng đầu của khách hàng tại Việt Nam. Với đội ngũ giàu kinh nghiệm thực tiễn trong nước suốt nhiều thập kỷ và cam kết về tính minh bạch, chúng tôi tư vấn và hỗ trợ thông quan hàng hoá nhanh nhất có thể.',
    licenceLabel: 'Số giấy phép Đại lý Hải quan',
    slaHeading: 'Thời gian thông quan thông thường',
    sla: [
      { name: '6–8 giờ làm việc', body: 'Hàng không — kể từ khi máy bay hạ cánh' },
      { name: '2 ngày làm việc', body: 'Đường biển — kể từ khi dỡ hàng khỏi tàu' },
    ],
    slaNote: 'Với điều kiện thông tin được cung cấp đầy đủ, chính xác và kịp thời. Trên nền tảng EDI và kết nối số hoá.',
    scopeHeading: 'Phạm vi dịch vụ',
    scope: [
      'Tư vấn thuế suất',
      'Tư vấn thủ tục hải quan',
      'Kiểm hoá',
      'Giấy phép và phê duyệt',
      'Đăng ký C/O (giấy chứng nhận xuất xứ)',
      'Hoàn thuế',
    ],
  },

  /**
   * ⚠️ NỘI DUNG PHÁP LÝ ĐANG PHÁT HÀNH CÔNG KHAI.
   *
   * Banner bản thảo đã gỡ theo yêu cầu ngày 15/09/2026, nên hai trang này đọc
   * như chính sách chính thức chứ không còn là bản nháp. Sửa nội dung ở đây là
   * sửa cam kết công khai của công ty — soát kỹ trước khi đổi, và nếu cần đánh
   * dấu tạm thời thì đặt lại `draftNotice` chứ đừng để trang nửa vời.
   *
   * Hai nguồn, chuyển thể chứ không bê nguyên:
   *
   * 1. Cụm quy định Bee Logistics đang công bố (bồi thường thiệt hại, thời gian
   *    toàn trình, đảm bảo an toàn an ninh, danh mục hàng cấm). Công ty mẹ viết
   *    cho bưu chính — cước theo kg, có COD, seal bưu kiện. Chín dịch vụ của
   *    BEE Transportation không có dịch vụ nào như vậy, nên bộ khung chủ đề
   *    được giữ còn số liệu bưu chính thay bằng căn cứ ngành logistics.
   *
   * 2. Hợp đồng mẫu SL01-F01E của Bee Logistics (thông quan và vận tải nội
   *    địa, 13 điều) — nguồn của nhóm "Dịch vụ và uỷ quyền", "Phí và thanh
   *    toán", "Quy định chung", và phần lớn nhóm "Nhận hàng và giao hàng".
   *
   * QUY TẮC VỀ CON SỐ, đừng phá khi sửa nội dung sau: chỉ đăng con số truy được
   * về một điều luật — 500 triệu (NĐ 163/2017 Điều 5), 14 ngày (LTM 2005 Điều
   * 237), 45 ngày (LTM 2005 Điều 239). Con số do hợp đồng đàm phán thì viết
   * thành cơ chế, không đăng: hạn mức chi hộ, hạn mức công nợ, lãi suất chậm
   * trả, kỳ thanh toán, giờ làm việc, và mọi mốc còn để trống trong hợp đồng
   * mẫu. Số tài khoản ngân hàng tuyệt đối không lên trang công khai — điều
   * "Thanh toán" thay bằng cảnh báo không đổi số tài khoản qua email.
   *
   * Quyền riêng tư soạn theo Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15, hiệu
   * lực 01/01/2026 — luật này đã thay thế Nghị định 13/2023/NĐ-CP, đừng dẫn lại
   * nghị định cũ. Điều kiện dịch vụ dẫn Nghị định 163/2017/NĐ-CP Điều 5 (giới
   * hạn trách nhiệm), Luật Thương mại 2005 Điều 237 (miễn trách, khiếu nại 14
   * ngày) và Điều 239 (cầm giữ hàng, 45 ngày), Nghị định 34/2024/NĐ-CP (hàng
   * nguy hiểm), Điều kiện kinh doanh tiêu chuẩn VLA, và VIAC cho trọng tài.
   *
   * Không còn chỗ [CẦN XÁC NHẬN] nào: mỗi điều hoặc dẫn được điều luật, hoặc
   * đọc được từ luồng dữ liệu thật trong app/api/quote/route.ts.
   */
  legal: {
    privacy: {
      eyebrow: 'Pháp lý',
      title: 'Chính sách',
      titleAccent: 'quyền riêng tư',
      updated: "Cập nhật lần cuối: 07/10/2026",
      sections: [
        {
          name: "Chúng tôi thu thập dữ liệu gì",
          body:
            "**Khi bạn gửi yêu cầu báo giá** (trên website hoặc trong ứng dụng, kể cả khi chưa đăng nhập): họ tên, số điện thoại, địa chỉ email, loại dịch vụ quan tâm và thông tin hàng hoá bạn mô tả trong phần ghi chú.\n\n**Khi bạn tạo tài khoản khách hàng trong ứng dụng:** địa chỉ email dùng để đăng nhập, mã xác thực một lần (OTP) gửi tới email đó, mã PIN 6 số bạn tự đặt, họ tên và số điện thoại bạn cập nhật trong hồ sơ, cùng mã định danh tài khoản do hệ thống tạo. Các yêu cầu báo giá bạn gửi khi đã đăng nhập được gắn với tài khoản để bạn theo dõi trạng thái xử lý.\n\n**Khi bạn dùng ứng dụng:** một mã định danh thiết bị dùng để gửi thông báo đẩy (token Firebase Cloud Messaging). Mã này chỉ dùng để gửi thông báo về yêu cầu của bạn.\n\n**Tài khoản nhân viên:** nhân viên Bee đăng nhập ứng dụng bằng tài khoản do công ty cấp. Họ tên, email công ty, phòng ban, vai trò và lịch sử thao tác trên đơn hàng được xử lý để phục vụ công việc nội bộ.\n\nChúng tôi **không** thu thập dữ liệu cá nhân nhạy cảm, vị trí, danh bạ, ảnh hay tệp trên thiết bị của bạn, **không** dùng mã quảng cáo (Advertising ID) và không dùng cookie để nhận diện bạn trên website.",
        },
        {
          name: "Đăng nhập bằng vân tay hoặc khuôn mặt",
          body:
            "Nếu bạn bật tính năng này, mã PIN được mã hoá và lưu ngay trên thiết bị, trong kho khoá bảo mật của hệ điều hành (Android Keystore / iOS Keychain), và chỉ mở được bằng sinh trắc học của chính bạn. Dữ liệu vân tay hay khuôn mặt do hệ điều hành quản lý; chúng tôi không đọc, không nhận và không lưu trữ dữ liệu này.",
        },
        {
          name: "Mục đích xử lý",
          body:
            "Dữ liệu chỉ được dùng để:\n- liên hệ lại, lập phương án vận chuyển và gửi báo giá theo đúng yêu cầu bạn đã gửi;\n- tạo, xác thực và quản lý tài khoản của bạn;\n- cho bạn theo dõi trạng thái yêu cầu và gửi thông báo liên quan;\n- vận hành quy trình báo giá nội bộ giữa các phòng ban.\n\nChúng tôi không dùng thông tin này cho quảng cáo, không bán và không trao đổi với bên thứ ba vì mục đích thương mại.",
        },
        {
          name: "Cơ sở pháp lý",
          body:
            "Việc xử lý thực hiện theo Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15, dựa trên sự đồng ý của bạn khi chủ động gửi yêu cầu báo giá hoặc tạo tài khoản, và trên nhu cầu thực hiện các bước tiền hợp đồng theo đề nghị của bạn. Bạn có thể rút lại sự đồng ý bất cứ lúc nào; việc rút lại không ảnh hưởng tới tính hợp pháp của phần đã xử lý trước đó.",
        },
        {
          name: "Thời gian lưu trữ",
          body:
            "Yêu cầu báo giá không phát sinh hợp đồng được lưu tối đa 24 tháng kể từ lần liên hệ cuối, đủ để phục vụ các lần hỏi giá tiếp theo của cùng một khách hàng. Hồ sơ đã phát sinh hợp đồng được lưu 10 năm theo nghĩa vụ lưu trữ chứng từ kế toán. Dữ liệu tài khoản được lưu cho tới khi bạn xoá tài khoản. Hết thời hạn, dữ liệu được xoá hoặc chuyển sang dạng không còn định danh cá nhân.\n\nYêu cầu báo giá gửi từ ứng dụng khi chưa đăng nhập được lưu thêm một bản trên chính thiết bị của bạn để tra cứu lại; bản này mất đi khi bạn gỡ ứng dụng hoặc xoá dữ liệu ứng dụng.",
        },
        {
          name: "Ai được tiếp cận dữ liệu",
          body:
            "Trong nội bộ: nhân sự kinh doanh và vận hành được phân công xử lý yêu cầu của bạn, qua hệ thống điều hành nội bộ của công ty. Mỗi nhân viên chỉ thấy những gì vai trò của mình cho phép.\n\nBên ngoài, chỉ các nhà cung cấp xử lý dữ liệu thay mặt chúng tôi:\n- nhà cung cấp hạ tầng vận hành website và đo lường truy cập;\n- Google (Firebase Cloud Messaging), để chuyển thông báo đẩy tới thiết bị của bạn.\n\nChúng tôi không sử dụng CRM hay dịch vụ tiếp thị của bên thứ ba.",
        },
        {
          name: "Chuyển dữ liệu ra nước ngoài",
          body:
            "Website được vận hành trên hạ tầng điện toán đám mây có máy chủ đặt ngoài lãnh thổ Việt Nam, và thông báo đẩy của ứng dụng đi qua máy chủ của Google. Vì vậy một phần dữ liệu của bạn được truyền và lưu tạm ngoài Việt Nam trước khi về hệ thống nội bộ của công ty. Gửi yêu cầu hoặc dùng ứng dụng đồng nghĩa với việc bạn đồng ý cho việc chuyển dữ liệu này. Nếu bạn không muốn, vui lòng liên hệ trực tiếp qua hotline, hoặc tắt thông báo của ứng dụng trong cài đặt thiết bị.",
        },
        {
          name: "Quyền của bạn",
          body:
            "Bạn có quyền được biết, được truy cập, yêu cầu chỉnh sửa, yêu cầu xoá, yêu cầu cung cấp dữ liệu của mình, rút lại sự đồng ý, hạn chế hoặc phản đối việc xử lý, và quyền khiếu nại, tố cáo, khởi kiện theo quy định pháp luật.",
        },
        {
          name: "Cách thực hiện quyền của bạn",
          body:
            "Gửi yêu cầu tới info@beetransportation.vn hoặc gọi hotline dưới đây, nêu rõ họ tên và số điện thoại (hoặc email tài khoản) bạn đã dùng để chúng tôi tra đúng hồ sơ. Chúng tôi phản hồi trong vòng 72 giờ. Việc thực hiện quyền không thu phí, trừ các yêu cầu lặp lại nhiều lần một cách bất hợp lý.\n\nBạn cũng có thể tự sửa họ tên, số điện thoại trong ứng dụng tại **Hồ sơ → Thông tin cơ bản**.",
        },
        {
          id: "xoa-tai-khoan",
          name: "Xoá tài khoản và dữ liệu",
          body:
            "**Trong ứng dụng:** vào **Hồ sơ → Mật khẩu và bảo mật → Xoá tài khoản** và xác nhận. Tài khoản, thông tin hồ sơ và các yêu cầu báo giá gắn với tài khoản sẽ bị xoá vĩnh viễn.\n\n**Không cần mở ứng dụng:** gửi email tới info@beetransportation.vn với tiêu đề \"Yêu cầu xoá tài khoản\", từ chính địa chỉ email đăng nhập, hoặc gọi hotline. Chúng tôi xác nhận và hoàn tất trong vòng 72 giờ.\n\nRiêng hồ sơ đã phát sinh hợp đồng vẫn được giữ đủ thời hạn 10 năm theo nghĩa vụ lưu trữ chứng từ kế toán, và chỉ dùng cho mục đích đó.",
        },
        {
          name: "Trẻ em",
          body:
            "Dịch vụ dành cho doanh nghiệp và người từ 18 tuổi trở lên. Chúng tôi không cố ý thu thập dữ liệu của trẻ em; nếu phát hiện, dữ liệu đó sẽ bị xoá.",
        },
        {
          name: "Đo lường truy cập",
          body:
            "Trên website, chúng tôi sử dụng công cụ phân tích không đặt cookie và không định danh cá nhân, chỉ để biết trang nào được xem và tốc độ tải trang. Công cụ này không theo dõi bạn qua các website khác và không tạo hồ sơ hành vi của bạn. Ứng dụng di động không chứa công cụ phân tích hay quảng cáo.",
        },
        {
          name: "Bảo mật và thay đổi chính sách",
          body:
            "Dữ liệu được truyền qua kết nối mã hoá và chỉ mở cho nhân sự có phận sự. Mã PIN không bao giờ hiển thị cho nhân viên. Không hệ thống nào an toàn tuyệt đối, nên chúng tôi chỉ thu thập những gì thực sự cần cho một báo giá. Khi chính sách này thay đổi, ngày cập nhật ở đầu trang sẽ đổi theo; thay đổi làm ảnh hưởng tới quyền của bạn sẽ được thông báo trực tiếp tới những khách hàng liên quan.",
        },
      ],
      contactHeading: 'Liên hệ về dữ liệu cá nhân',
      contactBody: "Mọi câu hỏi hoặc yêu cầu liên quan tới dữ liệu cá nhân, vui lòng liên hệ:",
      meta: {
        title: 'Chính sách quyền riêng tư',
        description:
          'Cách BEE Transportation thu thập, sử dụng và bảo vệ dữ liệu cá nhân bạn cung cấp khi gửi yêu cầu báo giá.',
      },
    },
    terms: {
      eyebrow: 'Pháp lý',
      title: 'Điều khoản',
      titleAccent: '& điều kiện dịch vụ',
      updated: 'Cập nhật lần cuối: 15/09/2026',
      sections: [
        {
          group: 'Điều khoản website',
          name: 'Phạm vi áp dụng',
          body: 'Nhóm điều khoản website áp dụng cho việc truy cập và sử dụng beetransportation.vn. Các nhóm còn lại là điều kiện dịch vụ chung, áp dụng cho hàng hoá chúng tôi nhận vận chuyển, làm thủ tục hải quan và các công việc liên quan khi hai bên chưa ký hợp đồng riêng. Khi có khác biệt, thứ tự ưu tiên là: hợp đồng đã ký, rồi báo giá đã được chấp thuận, rồi trang này.',
        },
        {
          name: 'Thông tin trên website',
          body: 'Nội dung trên website mang tính giới thiệu năng lực. Thông số thiết bị, tuyến vận chuyển và mốc thời gian là thông tin tham khảo, không phải cam kết hợp đồng. Cam kết cụ thể cho từng lô hàng được xác lập bằng báo giá và hợp đồng riêng.',
        },
        {
          name: 'Yêu cầu báo giá',
          body: 'Việc gửi yêu cầu qua website không tạo thành hợp đồng. Báo giá chỉ có hiệu lực khi được phát hành bằng văn bản và trong thời hạn ghi trên báo giá đó.',
        },
        {
          name: 'Sở hữu trí tuệ',
          body: 'Toàn bộ nội dung, hình ảnh, video và bản đồ tuyến trên website thuộc quyền sở hữu của BEE TRANSPORTATION Corporation, trừ trường hợp có ghi chú khác. Không sao chép cho mục đích thương mại khi chưa có văn bản đồng ý.',
        },
        {
          name: 'Liên kết tới website khác',
          body: 'Website có thể chứa liên kết tới trang của bên thứ ba. Chúng tôi không chịu trách nhiệm về nội dung hoặc chính sách của các trang đó.',
        },
        {
          group: 'Dịch vụ và uỷ quyền',
          name: 'Phạm vi dịch vụ và uỷ quyền',
          body: 'Chúng tôi thực hiện công việc theo uỷ quyền của khách hàng, căn cứ trên yêu cầu cụ thể mà khách hàng gửi cho từng lô hàng, trong phạm vi hoạt động kinh doanh được pháp luật cho phép. Phạm vi này bao gồm nhưng không giới hạn ở: vận chuyển và giao nhận hàng hoá, giao nhận chứng từ, đổi lệnh giao hàng (D/O) từ đại lý giao nhận hoặc hãng tàu và hãng vận tải, làm đại lý thủ tục hải quan, xin giấy phép xuất khẩu hoặc nhập khẩu theo yêu cầu, xếp dỡ hàng hoá, đóng gói và đóng kiện, lắp đặt máy móc thiết bị tại nhà máy. Uỷ quyền phát sinh theo từng yêu cầu dịch vụ đã gửi, không phải uỷ quyền chung vô thời hạn.',
        },
        {
          name: 'Cam kết của chúng tôi',
          body: 'Chúng tôi thu xếp phương tiện vận tải phù hợp tiêu chuẩn an toàn và quy định pháp luật để lấy hàng và vận chuyển từ điểm nhận tới điểm giao, chịu trách nhiệm bảo đảm an toàn hàng hoá trong suốt quá trình vận chuyển và trong quá trình xếp dỡ theo yêu cầu. Khi có bất thường xảy ra trong lúc thực hiện dịch vụ, chúng tôi thông báo cho khách hàng qua điện thoại, thư điện tử hoặc văn bản trong thời gian sớm nhất. Khi làm thủ tục hải quan thay mặt khách hàng, chúng tôi khai đúng thông tin khách hàng cung cấp và không tự ý thay đổi. Sau khi hoàn tất giao hàng và khách hàng đã thanh toán đầy đủ, chúng tôi bàn giao toàn bộ chứng từ liên quan tới lô hàng, gồm cả hoá đơn chứng từ của những khoản chúng tôi đã chi hộ. Chúng tôi gửi bảng kê dịch vụ phát sinh trong kỳ để hai bên đối chiếu, và xuất hoá đơn giá trị gia tăng theo quy định của pháp luật.',
        },
        {
          group: 'Hàng hoá và chứng từ',
          name: 'Thông tin hàng hoá do khách hàng cung cấp',
          body: 'Khách hàng chịu trách nhiệm về tính chính xác của thông tin hàng hoá đã khai: kích thước phủ bì, khối lượng, vị trí trọng tâm, điểm móc cáp, tính chất hàng hoá và trị giá. Với hàng siêu trường siêu trọng, khách hàng cung cấp bản vẽ hoặc thông số của nhà sản xuất trước khi lập phương án. Sai lệch so với thông tin đã khai có thể buộc thay đổi phương án, thiết bị hoặc tuyến đường; chi phí phát sinh và thời gian chậm trễ do khai sai thuộc trách nhiệm khách hàng, và chúng tôi có quyền từ chối nhận hàng tại điểm lấy hàng. Khách hàng cũng gánh chịu mọi rủi ro, thiệt hại và chi phí phát sinh trong trường hợp hàng hoá vi phạm pháp luật, bị bắt giữ, cầm giữ, tạm giữ hoặc tịch thu, không thể thông quan, hoặc bị người nhận hàng từ chối nhận.',
        },
        {
          name: 'Chứng từ và khai báo hải quan',
          body: 'Khách hàng cung cấp đầy đủ và kịp thời các chứng từ hợp lệ để chúng tôi thực hiện công việc, và chịu trách nhiệm về tính hợp pháp, chính xác và đầy đủ của những chứng từ đó: giấy uỷ quyền, hoá đơn thương mại, phiếu đóng gói, hợp đồng mua bán, cùng các chứng từ khác theo yêu cầu của cơ quan quản lý nhà nước. Với hàng hoá đặc biệt, khách hàng cung cấp thêm giấy tờ liên quan tới tính chất hàng hoá để bảo đảm tác nghiệp an toàn. Trước khi chúng tôi đăng ký tờ khai với cơ quan hải quan, khách hàng có trách nhiệm kiểm tra nội dung tờ khai và xác nhận. Mọi hậu quả phát sinh do chứng từ thiếu, sai hoặc được cung cấp muộn thuộc trách nhiệm khách hàng.',
        },
        {
          name: 'Bao bì, đóng kiện và chằng buộc',
          body: 'Hàng do khách hàng tự đóng gói thì khách hàng chịu trách nhiệm về việc bao bì chịu được rung lắc, xếp chồng và nâng hạ trong điều kiện vận chuyển thông thường, đúng quy cách và chủng loại theo quy định pháp luật hiện hành. Chúng tôi nhận đóng kiện như một dịch vụ riêng; kiện gỗ dùng cho hàng xuất khẩu được xử lý theo tiêu chuẩn kiểm dịch ISPM-15. Việc chằng buộc, kê lót và cố định hàng trên phương tiện do chúng tôi thực hiện; khách hàng không tự ý tháo dỡ hoặc thay đổi sau khi hàng đã được cố định và niêm phong. Nếu khách hàng vi phạm nghĩa vụ đóng gói dẫn tới hàng hoá gây thiệt hại cho con người hoặc tài sản, khách hàng chịu trách nhiệm pháp lý về mọi tổn thất do hàng hoá gây ra.',
        },
        {
          name: 'Hàng hoá không nhận vận chuyển',
          body: 'Chúng tôi không nhận vận chuyển hàng cấm lưu thông theo pháp luật Việt Nam, gồm vũ khí, quân trang quân dụng và phương tiện kỹ thuật chuyên dùng của lực lượng vũ trang; các chất ma tuý; hoá chất có độc tính mạnh; hiện vật thuộc di tích lịch sử, văn hoá, bảo tàng; văn hoá phẩm phản động, đồi truỵ, mê tín dị đoan; các loại pháo; thuốc chưa được cấp phép lưu hành tại Việt Nam; động vật, thực vật hoang dã thuộc danh mục bảo vệ; cùng hàng hoá bị cấm xuất khẩu, cấm nhập khẩu hoặc cấm vận chuyển theo pháp luật Việt Nam và điều ước quốc tế. Hàng nguy hiểm chỉ được nhận khi khách hàng khai báo trước và lô hàng có đủ giấy phép vận chuyển cùng chứng chỉ huấn luyện an toàn theo Nghị định 34/2024/NĐ-CP. Nếu phát hiện hàng thuộc diện cấm trong quá trình vận chuyển, chúng tôi dừng vận chuyển và bàn giao cơ quan chức năng; khách hàng chịu toàn bộ chi phí phát sinh và trách nhiệm trước pháp luật.',
        },
        {
          name: 'Giấy phép lưu hành và phương án vận chuyển',
          body: 'Hàng quá khổ, quá tải phải có giấy phép lưu hành do cơ quan quản lý đường bộ cấp. Chúng tôi thay mặt khách hàng lập hồ sơ và xin phép khi hai bên thoả thuận. Thời gian cấp phép, tuyến đường bắt buộc, khung giờ được phép lưu thông và các yêu cầu kèm theo như xe dẫn đường, cắt điện hay gia cố cầu đường do cơ quan có thẩm quyền quyết định, nằm ngoài phạm vi kiểm soát của chúng tôi.',
        },
        {
          group: 'Nhận hàng và giao hàng',
          name: 'Đặt lịch và huỷ yêu cầu',
          body: 'Khách hàng thông báo yêu cầu dịch vụ trước thời hạn ghi trong báo giá để chúng tôi chuẩn bị phương tiện, thiết bị và nhân lực. Điểm nhận hàng phải là nơi phương tiện vận tải ra vào thuận tiện và an toàn; nếu không, hai bên thống nhất phương án trung chuyển cùng chi phí trước khi điều xe. Trường hợp khách hàng huỷ yêu cầu sau khi chúng tôi đã bố trí phương tiện, hoặc việc giao nhận không hoàn tất trong khoảng thời gian cho phép ghi tại báo giá, khách hàng thanh toán các chi phí đã phát sinh.',
        },
        {
          name: 'Thời gian vận chuyển',
          body: 'Thời gian nêu trong báo giá là ước tính trong điều kiện vận hành bình thường và tính theo ngày làm việc. Thời gian này không bao gồm thời gian chờ cấp giấy phép lưu hành, chờ thông quan, khung giờ cấm tải trong đô thị, ngày nghỉ lễ theo quy định, và thời gian chờ mặt bằng hoặc thiết bị tại điểm giao do khách hàng bố trí. Cam kết thời gian không áp dụng khi xảy ra thiên tai, sự cố hạ tầng giao thông, trường hợp bất khả kháng khác hoặc theo yêu cầu của cơ quan nhà nước. Thời gian chỉ trở thành cam kết có chế tài khi báo giá hoặc hợp đồng ghi rõ như vậy.',
        },
        {
          name: 'Giờ làm việc và dịch vụ ngoài giờ',
          body: 'Chúng tôi tiến hành công việc trong giờ hành chính các ngày làm việc trong tuần, trừ chiều thứ Bảy, Chủ nhật và các ngày lễ theo pháp luật lao động Việt Nam. Riêng thủ tục hành chính với cơ quan quản lý nhà nước phụ thuộc vào giờ làm việc của từng đơn vị. Khi khách hàng yêu cầu làm việc ngoài giờ, phí dịch vụ ngoài giờ được tính riêng theo báo giá.',
        },
        {
          name: 'Giao nhận và đồng kiểm',
          body: 'Hàng hoá được giao nhận theo phương thức nguyên đai nguyên kiện hoặc nguyên container; chúng tôi chỉ mở kiện hoặc container theo yêu cầu của khách hàng hoặc của cơ quan có thẩm quyền, và trách nhiệm vận chuyển hoàn thành khi hàng được giao đúng trong tình trạng đó. Đại diện hai bên ký biên bản giao nhận tại điểm lấy hàng và điểm giao hàng. Khi phát hiện bất thường — niêm phong không còn nguyên vẹn, bao bì rách, thiếu kiện, hàng có dấu hiệu hư hỏng — bên nhận ghi nhận ngay vào biên bản, chụp ảnh hiện trạng trước khi dỡ hàng và hai bên lập biên bản đồng kiểm. Biên bản giao nhận đã ký mà không ghi nhận bất thường được coi là hàng đã giao đủ và nguyên trạng về mặt bên ngoài.',
        },
        {
          name: 'Người nhận không nhận hàng',
          body: 'Nếu người nhận không đến nhận hàng, từ chối nhận hàng hoặc trì hoãn việc dỡ hàng quá thời hạn đã thông báo, chúng tôi có quyền dỡ hàng và ký gửi vào nơi mà chúng tôi cho là an toàn, thuận tiện, đồng thời thông báo cho khách hàng; mọi chi phí và tổn thất phát sinh do khách hàng chịu trách nhiệm. Nếu khách hàng hoặc đối tác của khách hàng không cung cấp đủ chứng từ, hoặc không đủ điều kiện xuất khẩu và nhập khẩu, khiến chúng tôi không thể tiến hành dịch vụ trong một thời gian liên tục theo thoả thuận, dịch vụ được coi là đã hoàn thành; khách hàng thanh toán phần phí dịch vụ đã phát sinh và chịu các chi phí liên quan khác.',
        },
        {
          group: 'Phí và thanh toán',
          name: 'Báo giá và chấp thuận báo giá',
          body: 'Cước phí và các khoản phí được chúng tôi thông báo bằng văn bản hoặc thư điện tử, dựa trên yêu cầu cụ thể của từng lô hàng. Khách hàng được coi là đã chấp thuận báo giá khi xác nhận bằng văn bản hoặc thư điện tử, khi chỉ thị hoặc yêu cầu chúng tôi thực hiện dịch vụ, hoặc khi để chúng tôi thực hiện dịch vụ. Với hàng gửi gấp, giao trả gấp hoặc yêu cầu rút ngắn thời hạn so với thời gian vận chuyển thông thường, chúng tôi có quyền từ chối nhận hàng; nếu nhận, cước phí được hai bên thoả thuận lại. Nếu sau khi chúng tôi đã tiếp nhận hàng mà khách hàng thay đổi yêu cầu, hoặc chúng tôi phát hiện thông tin hàng hoá và yêu cầu dịch vụ khác với thực tế, chúng tôi có quyền ngừng cung cấp dịch vụ và khách hàng trả cước phí cùng chi phí phát sinh của lần vận chuyển không thành công đó; nếu chúng tôi chấp nhận tiếp tục thực hiện, khách hàng trả các khoản phí phát sinh thêm có liên quan. Cước phí vận chuyển không bao gồm chi phí bao bì, vật liệu chèn lót, chằng buộc và chất xếp hàng hoá, trừ khi có thoả thuận khác. Dịch vụ khách hàng yêu cầu thêm ngoài phạm vi đã báo giá được tính phí riêng.',
        },
        {
          name: 'Phí chi hộ',
          body: 'Khách hàng có thể uỷ quyền cho chúng tôi thanh toán thay các khoản mà nhà cung cấp khác phát hành hoá đơn trực tiếp cho khách hàng, bao gồm nhưng không giới hạn ở phí nội địa của người vận chuyển, phí lưu công-ten-nơ, lưu kho, lưu bãi và các khoản phụ phí vận tải khác thực tế phát sinh. Các khoản này được gọi là phí chi hộ, và được chúng tôi thanh toán bằng phương thức không dùng tiền mặt phù hợp với quy định pháp luật, có chứng từ và hoá đơn hợp lệ kèm theo. Khách hàng hoàn lại cho chúng tôi toàn bộ phí chi hộ. Hạn mức chi hộ cho mỗi lô hàng được ghi trong báo giá hoặc hợp đồng; phần vượt hạn mức, khách hàng ứng trước.',
        },
        {
          name: 'Thanh toán',
          body: 'Đồng tiền thanh toán là đồng Việt Nam. Các khoản chi phí phát sinh ở nước ngoài tính bằng ngoại tệ được quy đổi sang đồng Việt Nam theo tỷ giá bán của ngân hàng tại thời điểm phát hành hoá đơn giá trị gia tăng. Thanh toán thực hiện bằng chuyển khoản vào tài khoản ghi trong báo giá hoặc hợp đồng; mọi thay đổi thông tin tài khoản chỉ có giá trị khi được lập bằng văn bản, có chữ ký và con dấu của đại diện có thẩm quyền của hai bên — chúng tôi không bao giờ thông báo đổi số tài khoản chỉ bằng thư điện tử hoặc tin nhắn. Phí chuyển tiền và phí ngân hàng do khách hàng chịu. Trường hợp thanh toán bằng tiền mặt, khách hàng thanh toán tại văn phòng của chúng tôi, hoặc cho nhân viên có giấy giới thiệu do người đại diện hợp pháp ký và đóng dấu, và phải lấy phiếu thu có đóng dấu làm bằng chứng hoàn tất thanh toán. Thời hạn thanh toán, hạn mức công nợ và lãi suất áp dụng cho khoản chậm trả được ghi trong báo giá hoặc hợp đồng.',
        },
        {
          name: 'Cầm giữ hàng hoá và biện pháp bảo đảm',
          body: 'Khi khoản nợ đã đến hạn mà chưa được thanh toán, theo Điều 239 Luật Thương mại 2005, chúng tôi có quyền cầm giữ một số lượng hàng hoá và chứng từ liên quan để đòi nợ, và phải thông báo ngay bằng văn bản cho khách hàng; mọi chi phí phát sinh do việc cầm giữ do khách hàng gánh chịu. Sau 45 ngày kể từ ngày thông báo mà khách hàng vẫn không thanh toán, chúng tôi có quyền định đoạt số hàng hoá đó theo quy định pháp luật; số tiền thu được sau khi trừ nợ và chi phí liên quan sẽ được trả lại cho khách hàng. Với hàng nguy hiểm hoặc hàng hoá đặc biệt khác, chúng tôi có quyền yêu cầu khách hàng đặt cọc, ký quỹ hoặc cung cấp thư bảo lãnh của ngân hàng để bảo đảm nghĩa vụ bồi thường đối với tổn thất do việc vận chuyển hàng hoá đó gây ra.',
        },
        {
          group: 'Trách nhiệm và rủi ro',
          name: 'Bảo hiểm và khai giá trị hàng hoá',
          body: 'Chúng tôi khuyến nghị khách hàng mua bảo hiểm hàng hoá, đặc biệt với thiết bị và máy móc giá trị cao. Việc mua bảo hiểm — thông thường là điều kiện bảo hiểm loại A — do khách hàng hoặc đối tác mua bán của khách hàng thực hiện bằng chi phí của mình; chúng tôi có thể thu xếp bảo hiểm theo yêu cầu với phí tính riêng. Khách hàng thông báo trước trị giá hàng hoá bằng văn bản thì giới hạn trách nhiệm được xác định theo trị giá đã thông báo; không thông báo thì áp dụng giới hạn trách nhiệm nêu ngay dưới đây.',
        },
        {
          name: 'Giới hạn trách nhiệm',
          body: 'Theo Điều 5 Nghị định 163/2017/NĐ-CP về kinh doanh dịch vụ logistics: trường hợp khách hàng không thông báo trước trị giá hàng hoá, giới hạn trách nhiệm tối đa là 500 triệu đồng cho mỗi yêu cầu bồi thường; trường hợp đã thông báo trước và được chúng tôi xác nhận, mức bồi thường không vượt quá trị giá đã thông báo. Khi một lô hàng đi qua nhiều công đoạn có giới hạn trách nhiệm khác nhau, giới hạn áp dụng là giới hạn của công đoạn cao nhất. Việc bồi thường còn được xác định theo Điều kiện kinh doanh tiêu chuẩn của Hiệp hội Doanh nghiệp dịch vụ Logistics Việt Nam (VLA). Chúng tôi không chịu trách nhiệm về thiệt hại gián tiếp, bao gồm mất lợi nhuận, mất cơ hội kinh doanh và thiệt hại do gián đoạn sản xuất.',
        },
        {
          name: 'Miễn trách nhiệm và bất khả kháng',
          body: 'Theo Điều 237 Luật Thương mại 2005, chúng tôi được miễn trách nhiệm với tổn thất phát sinh do lỗi của khách hàng hoặc người được khách hàng uỷ quyền, do chúng tôi làm theo chỉ dẫn của khách hàng, do khuyết tật vốn có của hàng hoá, và trong các trường hợp miễn trách theo pháp luật vận tải và hải quan. Ngoài ra, hai bên được miễn trách nhiệm trong trường hợp bất khả kháng: thiên tai, dịch bệnh, đình công, chiến sự, sự cố hạ tầng giao thông hoặc quyết định của cơ quan nhà nước có thẩm quyền. Bên gặp sự kiện bất khả kháng phải tiến hành các biện pháp ngăn ngừa hợp lý và biện pháp thay thế cần thiết để hạn chế tối đa ảnh hưởng, đồng thời thông báo cho bên kia kèm bằng chứng xác nhận trong thời hạn ghi tại hợp đồng, kể từ ngày sự kiện xảy ra hoặc từ ngày biết được sự kiện. Thời gian thực hiện nghĩa vụ được kéo dài tương ứng với thời gian diễn ra sự kiện. Khi sự kiện chấm dứt, bên gặp sự kiện phải thông báo ngay cho bên kia; không thông báo hoặc thông báo không kịp thời thì vẫn phải chịu trách nhiệm về vi phạm và bồi thường thiệt hại.',
        },
        {
          name: 'Khiếu nại',
          body: 'Khiếu nại về mất mát hoặc hư hỏng hàng hoá phải được gửi bằng văn bản trong vòng 14 ngày kể từ ngày giao hàng, kèm biên bản giao nhận, biên bản đồng kiểm và ảnh hiện trạng. Quá thời hạn này, chúng tôi được miễn trách nhiệm theo Điều 237 Luật Thương mại 2005. Chúng tôi xác nhận đã nhận khiếu nại trong 3 ngày làm việc và trả lời trong 30 ngày kể từ khi nhận đủ hồ sơ.',
        },
        {
          group: 'Quy định chung',
          name: 'Bảo mật thông tin',
          body: 'Mọi thông tin và bí mật kinh doanh mà hai bên tiết lộ cho nhau trong quá trình hợp tác và cung cấp dịch vụ không được tiết lộ cho bên không tham gia giao dịch, trừ khi việc tiết lộ là cần thiết để thực hiện chính dịch vụ đó. Nghĩa vụ bảo mật không áp dụng với thông tin đã được công khai, thông tin do một bên thứ ba cung cấp một cách hợp pháp, và thông tin phải tiết lộ theo yêu cầu của pháp luật hoặc của cơ quan nhà nước có thẩm quyền. Việc xử lý dữ liệu cá nhân được nêu riêng tại Chính sách quyền riêng tư.',
        },
        {
          name: 'Sửa đổi và hiệu lực từng phần',
          body: 'Chúng tôi có thể cập nhật trang này; ngày cập nhật ở đầu trang đổi theo, và bản đang hiển thị là bản áp dụng cho các yêu cầu dịch vụ phát sinh sau đó. Với hợp đồng đã ký, mọi sửa đổi hoặc bổ sung chỉ có giá trị khi được lập thành văn bản và có chữ ký cùng con dấu của đại diện có thẩm quyền của hai bên. Nếu một điều khoản bị xác định là vô hiệu, bất hợp pháp hoặc không thể thực thi vì bất cứ lý do gì, tính hợp lệ và hiệu lực thi hành của các điều khoản còn lại không bị ảnh hưởng.',
        },
        {
          name: 'Luật áp dụng và giải quyết tranh chấp',
          body: 'Các điều khoản này được điều chỉnh bởi pháp luật Việt Nam, bao gồm các quy định về vận chuyển hàng hoá, thuế, quản lý xuất nhập khẩu và quản lý hải quan, kể cả khi các văn bản đó được sửa đổi, bổ sung hoặc thay thế. Khi có tranh chấp, hai bên kịp thời thông báo cho nhau bằng văn bản và ưu tiên giải quyết bằng thương lượng trên cơ sở bình đẳng, cùng có lợi. Nếu thương lượng không đạt kết quả trong thời hạn hai bên thoả thuận, tranh chấp được đưa ra giải quyết theo lựa chọn của nguyên đơn tại Toà án có thẩm quyền của Việt Nam, hoặc tại Trung tâm Trọng tài Quốc tế Việt Nam bên cạnh Phòng Thương mại và Công nghiệp Việt Nam (VIAC) theo quy tắc tố tụng của trung tâm này — ngôn ngữ trọng tài là tiếng Việt, địa điểm tại Thành phố Hồ Chí Minh, phán quyết là chung thẩm và ràng buộc hai bên. Bên có lỗi gánh chịu các chi phí phát sinh liên quan tới việc giải quyết tranh chấp, bao gồm cả phí luật sư.',
        },
      ],
      contactHeading: 'Liên hệ',
      contactBody:
        'Mọi câu hỏi về điều khoản và điều kiện dịch vụ, vui lòng liên hệ theo thông tin dưới đây.',
      meta: {
        title: 'Điều khoản & điều kiện dịch vụ',
        description:
          'Điều khoản sử dụng website beetransportation.vn và điều kiện dịch vụ của BEE Transportation: phạm vi uỷ quyền, chứng từ và khai báo hải quan, bao bì, hàng không nhận chở, phí chi hộ, thanh toán, giới hạn trách nhiệm và khiếu nại.',
      },
    },
  },
  ctaBand: {
    title: 'Bạn có lô hàng cần vận chuyển?',
    body: 'Gửi thông số hàng hoá — chúng tôi phản hồi phương án và báo giá trong vòng 24 giờ.',
    cta: 'Nhận báo giá',
  },

  /* Tên các hãng nằm trong PARTNERS (lib/site.ts) — danh từ riêng, không dịch. */
  partners: {
    label: 'Đối tác vận chuyển',
    /* Chú thích dưới con số. Con số là số logo trong dải, tự đếm. */
    customers: 'Khách hàng tin tưởng đồng hành.',
    membership: 'Hiệp hội và mạng lưới logistics quốc tế.',
  },

  blog: {
    title: 'Blog của chúng tôi',
    listLabel: 'Danh sách bài viết',
    emptyTitle: 'Chưa có bài viết nào',
    emptyBody:
      'Chúng tôi đang chuẩn bị những bài đầu tiên về tuyến vận chuyển, thủ tục hải quan và chuyện nghề. Quay lại sau nhé.',
    publishedLabel: 'Đăng ngày',
    articleEyebrow: 'Tin tức',
    backToList: 'Về trang tin tức',
  },

  appDownload: {
    title: 'Tải ứng dụng',
    lead: 'để trải nghiệm các dịch vụ của chúng tôi',
    available: 'Có sẵn ứng dụng trên',
    googlePlayUrl: '',
    appStoreUrl: '',
    qrUrl: '',
    qrAlt: 'Mã QR tải ứng dụng Bee Transportation',
    phoneAlt: 'Màn hình ứng dụng Bee Transportation: tra cứu và gửi yêu cầu báo giá',
  },

  homeFaq: {
    title: 'Các câu hỏi thường gặp',
    items: [
      {
        q: 'Bee Transportation cung cấp những loại hình dịch vụ vận tải nào?',
        a: 'Chúng tôi vận chuyển nội địa, xuyên biên giới và đa phương thức; làm thủ tục hải quan xuất nhập khẩu; cho thuê kho bãi và phân phối; nâng hạ, di dời máy móc và vận chuyển hàng dự án, siêu trường siêu trọng.',
      },
      {
        q: 'Khảo sát tuyến có tính phí riêng không?',
        a: 'Tuỳ quy mô lô hàng. Với hàng dự án hoặc tuyến cần khảo sát thực địa, chi phí khảo sát được báo rõ trước khi thực hiện. Liên hệ để được tư vấn cụ thể cho lô hàng của bạn.',
      },
      {
        q: 'Mất bao lâu để có phương án và báo giá?',
        a: 'Yêu cầu thông thường được báo giá trong ngày làm việc. Hàng dự án cần khảo sát tuyến sẽ lâu hơn, và chúng tôi báo trước thời gian dự kiến ngay khi nhận yêu cầu.',
      },
      {
        q: 'Hàng của tôi có cần giấy phép lưu hành không?',
        a: 'Hàng quá khổ, quá tải thường cần giấy phép lưu hành xe trên tuyến. Chúng tôi kiểm tra và xin giấy phép thay bạn khi lô hàng thuộc diện bắt buộc.',
      },
    ],
  },

  team: {
    eyebrow: 'Đội ngũ',
    title: 'Người đại diện',
    titleAccent: 'sẵn sàng đồng hành',
    lead: 'Đội ngũ trực tiếp phụ trách báo giá và vận hành đơn hàng của bạn.',
    empty: 'Đội ngũ sẽ được cập nhật sớm.',
    loadFailed: 'Không tải được danh sách đội ngũ.',
    railLabel: 'Danh sách người đại diện',
    prev: 'Xem người trước',
    next: 'Xem người tiếp theo',
  },

  contact: {
    eyebrow: 'Liên hệ',
    title: 'Nói cho chúng tôi biết',
    titleAccent: 'lô hàng của bạn',
    labels: {
      hotline: 'Hotline',
      email: 'Email',
    },
    form: {
      name: 'Họ và tên',
      namePlaceholder: 'Nguyễn Văn A',
      phone: 'Số điện thoại',
      phonePlaceholder: '09xx xxx xxx',
      email: 'Email',
      emailPlaceholder: 'ban@congty.vn',
      service: 'Loại dịch vụ',
      message: 'Thông tin hàng hoá',
      messagePlaceholder:
        'Kích thước, trọng lượng, điểm đi — điểm đến, thời gian dự kiến…',
      submit: 'Gửi yêu cầu báo giá',
      required: 'Vui lòng điền trường này.',
      invalidEmail: 'Email chưa đúng định dạng.',
      invalidPhone: 'Số điện thoại chưa đúng định dạng.',
      invalidNameChars: 'Họ và tên chỉ gồm chữ cái, không có số hay ký tự đặc biệt.',
      invalidPhoneChars: 'Số điện thoại chỉ gồm chữ số.',
      sending: 'Đang gửi…',
      sentTitle: 'Đơn của bạn đã được tiếp nhận',
      sentBody: 'Chúng tôi phản hồi trong vòng 24 giờ làm việc.',
      sentClose: 'Đóng',
      failed: 'Không gửi được. Vui lòng thử lại, hoặc gọi hotline bên trên nếu gấp.',
      limited: 'Mỗi số điện thoại gửi tối đa 3 yêu cầu báo giá trong 24 giờ. Vui lòng gọi hotline để được hỗ trợ thêm:',
      consent: 'Khi gửi, bạn đồng ý để chúng tôi liên hệ lại về yêu cầu này theo',
      consentLink: 'Chính sách quyền riêng tư',
    },
  },

  footer: {
    servicesHeading: 'Dịch vụ',
    companyHeading: 'Công ty',
    supportHeading: 'Hỗ trợ',
    contactHeading: 'Liên hệ',
    aboutLabel: 'Về chúng tôi',
    privacyLabel: 'Chính Sách Bảo Mật',
    termsLabel: 'Điều Khoản Dịch Vụ',
    copyright: 'Copyright © {year} By {name}, All rights reserved.',
  },

  meta: {
    home: {
      title: 'BEE Transportation — Vận chuyển & logistics',
      description:
        'Logistics chuyên biệt cho hàng siêu trường siêu trọng và hàng dự án: 120+ đầu xe, 26.000 m² kho, 10 tuyến xuyên biên giới.',
    },
    about: {
      title: 'Giới thiệu',
      description:
        'Thành lập 08/11/2023, chuyên vận chuyển, xếp dỡ và di dời hàng siêu trường siêu trọng, hàng dự án tại Việt Nam và quốc tế.',
    },
    services: {
      title: 'Dịch vụ',
      description:
        '9 nhóm dịch vụ trọn gói: vận chuyển nội địa, đa phương thức, hàng siêu trường siêu trọng, nâng hạ, đóng kiện, xuyên biên giới, hải quan.',
    },
    capabilities: {
      title: 'Năng lực',
      description:
        'Xe đầu kéo, rơ-moóc sàn thấp, xe nâng 2,5–25 tấn, cẩu và xe dẫn đoàn — thuê theo giờ, chuyến hoặc tháng.',
    },
    warehousing: {
      title: 'Kho bãi & phân phối',
      description:
        '26.000 m² kho, 30.000 vị trí pallet: kho lạnh -25°C, kho phân phối và kho ngoại quan 9.536 pallet. WMS, TMS, HACCP.',
    },
    crossborder: {
      title: 'Vận chuyển quốc tế',
      description:
        '10 tuyến đường bộ qua Việt Nam, Trung Quốc, Lào, Thái Lan, Campuchia, Myanmar, Malaysia, Singapore. Nhanh hơn tàu, rẻ hơn máy bay.',
    },
    privacy: {
      title: 'Chính sách quyền riêng tư',
      description:
        'Cách BEE Transportation thu thập, sử dụng và bảo vệ dữ liệu cá nhân khi bạn gửi yêu cầu báo giá.',
    },
    terms: {
      title: 'Điều khoản & điều kiện dịch vụ',
      description:
        'Điều khoản sử dụng website beetransportation.vn và điều kiện dịch vụ vận tải: thông tin hàng hoá, bao bì, hàng không nhận chở, giới hạn trách nhiệm và khiếu nại.',
    },
    blog: {
      title: 'Tin tức',
      description:
        'Tin tức và ghi chép nghề từ BEE Transportation: tuyến vận chuyển, thủ tục hải quan, kho bãi và hàng siêu trường siêu trọng.',
    },
    contact: {
      title: 'Liên hệ',
      description:
        'Văn phòng TP. Hồ Chí Minh và Đà Nẵng. Hotline (+84) 886 440 449. Gửi thông số hàng hoá, nhận phương án và báo giá trong 24 giờ.',
    },
  },
  og: {
    homeTitle: 'Vận chuyển chuyên nghiệp',
    homeAccent: 'Kết nối mọi nơi',
    facts: ['120+ đầu xe & rơ-moóc', '425+ chuyến mỗi ngày', '26.000 m² kho bãi'],
  },
  site: {
    name: 'BEE TRANSPORTATION Corporation',
    shortName: 'BEE TRANSPORTATION',
    email: 'info@beetransportation.vn',
    customsLicence: '2569/HQHCM-GSQL',
    phoneLabel: 'Mr. Tiger',
    phoneNumber: '0886440449',
    offices: [
      { label: 'Trụ sở chính', street: 'TTC Tower, 253 Hoàng Văn Thụ, Phường Tân Sơn Hoà', city: 'Thành phố Hồ Chí Minh', phone: '', email: '', hidden: '' },
      { label: 'Chi nhánh', street: '386 Xô Viết Nghệ Tĩnh, Phường Khuê Trung, Quận Cẩm Lệ', city: 'Đà Nẵng', phone: '', email: '', hidden: '' },
    ],
  },
  // CMS ghi de vao day luc chay; rong = dung anh trong repo (lib/image-slots.ts).
  images: {},
} satisfies Dictionary;
