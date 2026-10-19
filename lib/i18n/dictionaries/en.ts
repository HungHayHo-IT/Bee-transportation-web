/**
 * English copy.
 *
 * ⚠️ NOT MARKETING-APPROVED. Only two strings here come from a source of
 * record — `hero.cta` ("Get a Quote") and the slogan in `meta.home.title`,
 * both specified in bee-hero-DEV-HANDOFF §3. Everything else is a working
 * translation produced during the port so the `/en-us` tree renders and can be
 * reviewed. Have marketing pass over this file before the English site goes
 * public; nothing outside it needs to change when they do.
 */
import type { Dictionary } from '../types';

export const en = {
  nav: {
    about: 'About',
    services: 'Services',
    capabilities: 'Capabilities',
    warehousing: 'Warehousing',
    crossborder: 'International transport',
    blog: 'Blog',
    contact: 'Contact',
    cta: 'Contact',
    privacy: 'Privacy',
    terms: 'Terms',
    skipToContent: 'Skip navigation, go to main content',
    callNow: 'Call now',
    openMenu: 'Open menu',
    languageLabel: 'Language',
  },

  // Để trống: chưa có địa chỉ thật. Kênh nào chưa điền thì không hiện, nên
  // trang vẫn đúng cho tới khi đội nội dung điền vào ở CMS.
  social: {
    label: 'BEE Transportation on social media',
    facebook: '',
    zalo: '',
    youtube: '',
    linkedin: '',
    tiktok: '',
    off: '',
  },
  preloader: {
    note: 'Loading the visual experience…',
  },

  hero: {
    captions: [
      {
        eyebrow: 'Oversized · Project cargo',
        title: 'Oversized &',
        titleAccent: 'Heavy Lift',
        sub: 'Route survey — Movement permits — Pilot vehicles',
      },
      {
        eyebrow: 'Capacity on the ground',
        title: '120+ Vehicles',
        titleAccent: '425 Trips A Day',
        sub: 'Across 34 provinces, 26,000 m² of warehousing',
      },
      {
        eyebrow: 'Customs & cross-border',
        title: 'Licensed',
        titleAccent: 'Customs Agent',
        sub: 'Licence 2569/HQHCM-GSQL — clearance and haulage from one desk',
      },
      {
        eyebrow: 'Multimodal',
        title: 'Road · Sea',
        titleAccent: 'One Point Of Contact',
        sub: 'Plant to site, with one party accountable for the whole run',
      },
      {
        eyebrow: 'Ready to move with you',
        title: 'An Approach',
        titleAccent: 'Within 24 Hours',
        sub: 'Send your cargo specifications and we will plan and quote it',
      },
    ],
    /** See the Vietnamese dictionary for why these are no longer clip names. */
    chapters: [
      '01 · Right equipment',
      '02 · Right cargo',
      '03 · Right route',
      '04 · On time',
    ],
    hint: 'Scroll to explore',
    cta: 'Get a Quote',
    videoAlt:
      'A BEE Transportation container truck pulls into a warehouse, opens its cargo bay and dissolves into a digital wireframe.',
  },

  marquee:
    'Domestic Transportation ✦ Project Cargo ✦ Multimodal Road & Sea ✦ Stevedoring ✦ Crating & Packing ✦ Cross-Border ✦ Customs Clearance ✦ Equipment Leasing ✦ Maritime Brokerage ✦',

  trust: {
    title: 'Why businesses trust',
    titleAccent: 'Bee Transportation',
  },

  about: {
    eyebrow: 'About us',
    title: 'Specialist logistics',
    titleAccent: 'solutions',
    titleTail: 'for project cargo',
    lead: 'BEE TRANSPORTATION Corporation was founded on 8 November 2023, providing specialist logistics solutions for the transport, handling and relocation of oversized, heavy-lift and project cargo in Vietnam and worldwide.',
    body: 'We are committed to service that is timely, safe, efficient and cost-optimised for industrial and commercial clients. With an experienced team and a broad partner network, every shipment is planned individually around the cargo and the route it has to travel.',
    ctaPrimary: 'See our services',
    ctaGhost: 'Talk to us',
    /** Keep in step with vi.ts — same figures, see the note there. */
    stats: [
      { to: 120, suffix: '+', label: 'Trucks & trailers' },
      { to: 425, suffix: '+', label: 'Trips per day' },
      { to: 34, suffix: '', label: 'Provinces covered' },
      { to: 26000, suffix: ' m²', label: 'Warehousing in operation' },
    ],
    intro: {
      founding:
        'Con Ong Transportation Corporation (BEE TRANSPORTATION) was established on 8 November 2023.',
      motto: '”Our best is your best”',
      mottoTail:
        'Our intent is to give every customer and partner the very best of what we do.',
    },
    /* The figures are the confirmed ones from `stats` above, written out in a
       sentence each. Nothing here may be a number the company has not given us. */
    detail: {
      imageAlt: 'A container yard at the port, with terminal tractors drawing containers off the stack',
      cta: 'See details',
      highlights: [
        {
          to: 425,
          suffix: '+',
          body: 'Trips a day across the network, serving industrial and commercial customers.',
        },
        {
          to: 34,
          suffix: '',
          body: 'Provinces covered, moving cargo from the port to the site anywhere in the country.',
        },
        {
          to: 120,
          suffix: '+',
          body: 'Trucks and trailers in the fleet, including equipment built for oversized and heavy cargo.',
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
    eyebrow: 'Services',
    title: 'End-to-end logistics,',
    titleAccent: 'start to finish',
    titleTail: '',
    lead: 'From planning the approach through customs clearance to delivery at the project site.',
    slideTitle: 'Our services',
    railLabel: 'Service list — scroll sideways for more',
    problemsHeading: 'What usually goes wrong',
    approachHeading: 'How we run it',
    uspHeading: 'Why BEE',
    scopeHeading: 'Scope of service',
    faqHeading: 'Frequently asked questions',
    faqLead: 'What shippers usually ask before sending cargo with us.',
    faqCtaTitle: 'Didn’t find your answer?',
    faqCtaBody: 'The BEE team will advise on the route and quote for your exact shipment.',
    faqCtaButton: 'Talk to an advisor',
    cardCta: 'View details',
    relatedHeading: 'Related capability',
    backToAll: '← All services',
    /** Mirrors vi.ts — see the note there on sourcing and on what may not be added. */
    items: {
      consulting: {
        name: 'Transport solution consulting',
        body: 'Planning the optimal approach, advising on specialised cargo and selecting the best-suited mode of transport.',
        intro:
          'Most of the unplanned cost on a shipment does not come from the freight rate. It comes from a decision made at the start: the wrong mode, a weight-restricted bridge nobody checked, or a load that will not fit through the plant gate — discovered once the truck is already there. Consulting exists so those things surface on paper rather than on the road.',
        problems: [
          {
            name: 'Five quotes, five ways of counting',
            body: 'One carrier prices by tonne, another by cubic metre, a third by trip with lifting excluded. There is no basis for comparison, so the lowest number wins and the difference is paid later.',
          },
          {
            name: 'The route is only surveyed on a map',
            body: 'Turning radius, bridge clearance, load-rated crossings and overhead power lines do not appear on a digital map. Without a site survey the convoy turns back, and nobody quoted for that.',
          },
          {
            name: 'Split across contractors, owned by nobody',
            body: 'Transport with one party, lifting with another, customs with a third. When the handover slips, each is answerable only for their own leg while the project schedule moves.',
          },
        ],
        approach: [
          {
            name: 'Record the cargo and both ends',
            body: 'Dimensions, weight, centre of gravity, handling requirements, and the real conditions at origin and destination: ground, access, equipment already on site.',
          },
          {
            name: 'Survey the route on the ground',
            body: 'Clearances, turning radii, bridge ratings and the pinch points along the way. The survey is what the lifting plan and the movement permit are built on.',
          },
          {
            name: 'Compare on landed cost, not on freight',
            body: 'Freight, lifting, permits, escort, storage, clearance time and the risk of standing still — all of it, for each option, rather than the rate alone.',
          },
          {
            name: 'Hand over the plan with its assumptions',
            body: 'What the plan depends on, what happens if any of it turns out to be wrong, and what the fallback is.',
          },
        ],
        usps: [
          {
            name: 'One party covering all nine service lines',
            body: 'The plan is not bent to fit a contractor’s capability. Transport, lifting, packing, warehousing and customs answer to the same place.',
          },
          {
            name: 'Owned assets, not brokerage',
            body: 'Over 120 trucks and trailers, 26,000 m² of warehousing, a 45-tonne Kato crane. The plan is built on equipment we can actually dispatch.',
          },
          {
            name: 'Clearance time built into the plan',
            body: 'As a licensed customs agent we can put a clearance figure in the plan rather than leaving it as the unknown at the end of the chain.',
          },
        ],
        faqs: [
          {
            q: 'Is the route survey charged separately?',
            a: 'For shipments we go on to carry, the survey is part of planning. If you need a standalone survey report for internal tendering, we quote for it based on the length and complexity of the route.',
          },
          {
            q: 'How long until I get a plan and a price?',
            a: 'General cargo with complete specifications is usually quoted within 24 hours. Project cargo that needs a site survey depends on the length of the route and on when we can get access.',
          },
          {
            q: 'Does my cargo need a movement permit?',
            a: 'It depends on dimensions and total weight once loaded, not on the dimensions of the item alone. Send us the specifications and the intended route and we will confirm, then handle the paperwork if it is needed.',
          },
        ],
        points: [
          'Cargo survey: dimensions, weight, centre of gravity, handling requirements',
          'On-site route survey: clearances, turning radii, bridge ratings',
          'Site survey at both ends: access, load capacity, equipment already there',
          'Options compared on landed cost, not on the freight rate',
          'Identifying movement permits and specialised procedures needed',
          'Survey report and plan, with risks and fallbacks stated',
        ],
        meta: {
          title: 'Transport solution consulting',
          description:
            'On-site route surveys, transport planning and comparison on landed cost — not on the freight rate alone.',
        },
      },

      domestic: {
        name: 'Road transport',
        body: 'Door-to-door delivery, FCL/LCL handling and real-time shipment tracking nationwide.',
        intro:
          'Domestic trucking looks like a commodity right up to the moment a shipment stops somewhere in a province and nobody can say where it is. What separates carriers is not the rate on a single trip — it is whether they actually control their own fleet.',
        problems: [
          {
            name: 'Part loads wait for a full truck',
            body: 'Carriers move when the trailer is full, so a small consignment waits indefinitely and the date you promised your own customer stops being a date.',
          },
          {
            name: 'Nobody knows where the truck is',
            body: 'Progress depends on reaching the driver by phone. When something goes wrong the shipper finds out last, with no time left to re-plan.',
          },
          {
            name: 'A different carrier in every province',
            body: 'Uneven service, paperwork in a different format each time, and when cargo is damaged the responsibility falls in the gap between two subcontractors.',
          },
        ],
        approach: [
          {
            name: 'Choose the mode for the cargo',
            body: 'Full truckload when the load fills the vehicle or has to run direct; part load when saving cost matters more than a day or two in transit.',
          },
          {
            name: 'Dispatch from our own fleet',
            body: 'Over 120 trucks and trailers means taking the booking without hunting for outside capacity, and turning vehicles around when the schedule changes.',
          },
          {
            name: 'Track the journey continuously',
            body: 'Position, speed, stops and route changes are recorded in real time for every vehicle, rather than depending on getting hold of the driver.',
          },
          {
            name: 'Deliver to site and close the paperwork',
            body: 'Delivery to the receiving address, condition acceptance and documentation completed to the same standard on every lane.',
          },
        ],
        usps: [
          {
            name: 'More than 425 trips a day',
            body: 'That density means frequent consolidation and the ability to slot in an urgent load, instead of waiting for a full trailer.',
          },
          {
            name: 'GPS tracking across the fleet, 24/7',
            body: 'Real-time journey reporting, speed measurement, stop monitoring and fuel consumption — used both to improve driving behaviour and to keep cargo secure.',
          },
          {
            name: 'A dedicated Da Nang – Ho Chi Minh lane',
            body: 'An average of 4–5 trips per vehicle per month, service around the clock, and a discount for shippers who move in both directions.',
          },
        ],
        points: [
          'Full truckload (FTL)',
          'Less than truckload (LTL)',
          'Bulk cargo',
          'Perishable and dangerous goods',
          'Heavy-lift transport with lifting equipment',
          'Household goods and personal effects',
          'Container transport',
          'Domestic transport and distribution',
          'Consolidation',
        ],
        faqs: [
          {
            q: 'When should I use a full truck rather than a part load?',
            a: 'A full truck suits cargo that takes up most of the weight or volume, that has to run direct without a transit point, or that does not tolerate repeated handling. Part loads are considerably cheaper for small consignments, at the cost of time spent consolidating.',
          },
          {
            q: 'How do I track my shipment?',
            a: 'Every vehicle carries a tracking device running 24/7. We provide real-time position updates and a journey report per trip, rather than leaving you to call the driver.',
          },
          {
            q: 'Do you carry refrigerated and dangerous goods?',
            a: 'Yes. Perishable and dangerous goods are within scope, with −25°C cold storage available when a shipment needs to be held mid-route. Dangerous goods need to be declared by class at the quotation stage so the right vehicle and route can be assigned.',
          },
        ],
        meta: {
          title: 'Road transport',
          description:
            'FTL, LTL, bulk, refrigerated and dangerous goods nationwide. 120+ trucks and trailers, 425+ trips a day, tracked 24/7.',
        },
      },

      multimodal: {
        name: 'Multimodal transport (road / sea)',
        body: 'Flexible mode combinations, consolidation for cost efficiency and end-to-end route supervision.',
        intro:
          'Multimodal is not two legs of transport stapled together. It is taking responsibility for the join between them. Most of the loss and delay on project cargo happens exactly where the cargo changes vehicle — the point that, split between two contractors, nobody really owns.',
        problems: [
          {
            name: 'Road cost over long distances',
            body: 'Running heavy cargo the length of the country by road adds up fast, when most of that distance could go by water at a considerably lower rate.',
          },
          {
            name: 'Oversized cargo cannot go all the way by road',
            body: 'One weak bridge or one low clearance is enough to block the whole plan. At that point water is not the cheaper option — it is the only one.',
          },
          {
            name: 'The transfer point is where control is lost',
            body: 'Waiting for lifting gear, waiting for the tide, waiting for paperwork — each handled by a different party, none of them holding the whole picture.',
          },
        ],
        approach: [
          {
            name: 'Split the legs by the route’s real constraints',
            body: 'Which stretch has to go by road, which should go by water, and which transfer point actually has the infrastructure for the lifting equipment involved.',
          },
          {
            name: 'Put lifting gear at the join',
            body: 'Cranes and forklifts are scheduled alongside the vessels, so cargo is not sitting at a berth waiting for equipment.',
          },
          {
            name: 'One party supervising the whole route',
            body: 'The same people are answerable from origin to destination, including legs performed by partners, and keep the shipper updated throughout.',
          },
        ],
        usps: [
          {
            name: 'Lifting is in-house',
            body: 'A 45-tonne Kato crane, forklifts and a skilled crew belong to us, so the transfer point does not wait on a third contractor.',
          },
          {
            name: '26,000 m² of transit warehousing',
            body: 'When schedules do not line up, cargo has somewhere safe to sit rather than standing at a berth — including cold storage and a bonded warehouse for goods awaiting clearance.',
          },
          {
            name: 'Continuous supervision across legs',
            body: 'Tracking covers the road legs, and every transfer point is recorded with handover documentation.',
          },
        ],
        points: [
          'Multimodal project cargo: road combined with inland waterway',
          'Consolidation that uses space efficiently and re-uses equipment',
          'Lifting equipment positioned at the transfer point',
          'End-to-end supervision with continuous status updates',
        ],
        faqs: [
          {
            q: 'Is multimodal always cheaper than road?',
            a: 'No. On short distances or small consignments, the cost and time of two extra lifts usually cancels the saving. It pays off clearly on heavy cargo, long distances, or where a road-only route hits a constraint it cannot get past.',
          },
          {
            q: 'Who is liable if cargo is damaged at the transfer point?',
            a: 'We are. That is why we take the whole leg rather than the transport alone. Condition is inspected and documented at each handover, so if something happens it is clear where.',
          },
          {
            q: 'How much longer does multimodal take than road?',
            a: 'It depends on the route, the vessel schedule and tidal conditions at the berth. We put both options in front of you with indicative timings, so you can weigh cost against schedule rather than defaulting to one.',
          },
        ],
        meta: {
          title: 'Multimodal transport',
          description:
            'Road and inland waterway combined for project cargo, with in-house lifting at the transfer point and supervision across the route.',
        },
      },

      project: {
        name: 'FCL/LCL, project & heavy-lift cargo',
        body: 'Route surveys, lifting plans, movement permits, pilot vehicles and convoy escort.',
        intro:
          'Heavy-lift cargo is not ordinary cargo that happens to be bigger. It is cargo where the route has to be proven passable before a wheel turns, and where every gap in preparation is paid for in days rather than hours.',
        problems: [
          {
            name: 'Movement permits applied for too late',
            body: 'The application needs the survey result and the lashing plan behind it. Start late and the permit becomes the critical path for the whole project.',
          },
          {
            name: 'An incomplete survey strands the convoy',
            body: 'One load-limited bridge, one tight bend or one low power line that was not recorded is enough to stop the convoy, re-apply and find another route.',
          },
          {
            name: 'Lifting gear that is under-rated or cannot get in',
            body: 'A crane with the capacity but not the reach, or ground that will not take the outriggers. Finding out on site means work stops.',
          },
        ],
        approach: [
          {
            name: 'Survey and measure on the ground',
            body: 'Clearances, turning radii, bridge ratings, the ground at both ends and the pinch points between. The result feeds both the lifting plan and the permit file.',
          },
          {
            name: 'Build the lifting and lashing plan',
            body: 'Equipment chosen on real capacity and reach, lifting points identified, lashing calculated around the actual centre of gravity.',
          },
          {
            name: 'Obtain the movement permit',
            body: 'Prepare and file for the surveyed route, including any reinforcement the route requires.',
          },
          {
            name: 'Arrange pilot vehicles and escort',
            body: 'The convoy moves within its permitted window, with pilot vehicles ahead and escort on the restricted sections.',
          },
        ],
        usps: [
          {
            name: 'Low-bed trailers and a specialised fleet',
            body: 'Low-bed trailers for oversized and overweight loads, tractors and 20ft/40ft/45ft container trailers — equipment that belongs to our own fleet.',
          },
          {
            name: 'Lifting and transport from one contractor',
            body: 'The Kato 45-tonne crane and the lifting crew come with the transport plan, so responsibility is not cut off at the site gate.',
          },
          {
            name: 'Pilot and escort vehicles as standard',
            body: 'Not subcontracted per trip, so the convoy schedule does not depend on a third party’s availability.',
          },
        ],
        points: [
          'Full container load (FCL) and less than container load (LCL)',
          'Project cargo, oversized and heavy-lift cargo',
          'On-site route surveys and lifting plans',
          'Movement permits for oversized and overweight loads',
          'Pilot vehicles and convoy escort along the route',
        ],
        faqs: [
          {
            q: 'How much notice do you need for a heavy-lift shipment?',
            a: 'As much as possible, because the critical path is usually the survey and the permit rather than finding a vehicle. As soon as you have outline specifications and two endpoints, we can start assessing the route.',
          },
          {
            q: 'What if a bridge on the route is not rated for the load?',
            a: 'Three options: an alternative route, temporary reinforcement, or moving one leg to water. All three have to be known before the plan is fixed — which is exactly why the site survey cannot be skipped.',
          },
          {
            q: 'Does BEE also install the equipment on site?',
            a: 'We bring machinery to its final installation position, including by hand in confined spaces a crane or forklift cannot reach. Connection and commissioning belong to the project’s mechanical and electrical contractor.',
          },
        ],
        meta: {
          title: 'Project & heavy-lift cargo',
          description:
            'Route surveys, lifting plans, movement permits, pilot vehicles and escort for oversized and overweight project cargo.',
        },
      },

      lifting: {
        name: 'Stevedoring, relocation & equipment lifting',
        body: 'Professional loading and unloading, safety supervision and full on-site support.',
        intro:
          'The last stretch a machine travels is often only a few dozen metres — from the plant gate to the foundation — and it is the hardest one. The crane cannot get in, the floor will not take the load, and the plant is still running. This is where big equipment stops helping and experience decides the outcome.',
        problems: [
          {
            name: 'The crane cannot reach the installation position',
            body: 'Substations, roofed workshops, a narrow aisle between two running lines — places a mobile crane simply cannot get to.',
          },
          {
            name: 'The floor will not take a point load',
            body: 'Crane outriggers or forklift wheels concentrate more load on one point than a suspended floor or workshop slab can carry, cracking or settling it.',
          },
          {
            name: 'Production cannot be stopped for the move',
            body: 'The plant allows only a short window, or a maintenance shutdown. Any method that needs a long stoppage is ruled out before it is considered.',
          },
        ],
        approach: [
          {
            name: 'Survey the floor and the access route',
            body: 'Entry width, headroom, the load capacity of ground and floors, and where equipment could stand if mechanical handling is possible at all.',
          },
          {
            name: 'Choose between mechanical and manual',
            body: 'Cranes and forklifts where they fit; rollers, hydraulic jacks and winches where the space will not admit them.',
          },
          {
            name: 'Work to the plant’s window',
            body: 'The job is broken into steps that can be stopped safely, so the work fits the time production is willing to give up.',
          },
          {
            name: 'Supervise safety at every step',
            body: 'Lashing, lifting points and load checked before each lift, with a supervisor independent of the operator.',
          },
        ],
        usps: [
          {
            name: 'We get in where a crane cannot',
            body: 'Manual relocation into the exact installation position in substations and plants — a capability most transport contractors do not have.',
          },
          {
            name: 'The lifting equipment is ours',
            body: 'A Kato 45-tonne crane, two 3–5 tonne forklifts, four electric forklifts and ten hand pallet trucks, dispatched on the project’s schedule.',
          },
          {
            name: '40 skilled workers',
            body: 'A permanent crew rather than labour hired per job, so safety procedure and method stay consistent between projects.',
          },
        ],
        points: [
          'Loading, lifting and relocation of machinery and equipment',
          'Manual relocation into installation position in confined spaces',
          'Safety supervision at every stage of lifting and lashing',
          'Full on-site support',
        ],
        faqs: [
          {
            q: 'At what weight does a crane become necessary instead of manual handling?',
            a: 'There is no fixed threshold. It depends on access, on what the floor will carry, and on the placement accuracy required. Machines of several dozen tonnes are still moved by hand when a crane cannot reach them.',
          },
          {
            q: 'Can you work while the plant is still in production?',
            a: 'Yes, and it is the common case. The work is broken into steps that can be stopped safely and scheduled into the windows the plant allows, rather than requiring a long shutdown.',
          },
          {
            q: 'Who is liable if equipment is damaged during the move?',
            a: 'Condition is inspected and recorded before and after the move. The extent of liability is agreed in the contract according to the value and nature of the equipment — raise it at the quotation stage.',
          },
        ],
        meta: {
          title: 'Stevedoring & equipment lifting',
          description:
            'A Kato 45-tonne crane, forklifts from 3 to 25 tonnes, and manual relocation where a crane cannot reach — substations, plants in operation.',
        },
      },

      packing: {
        name: 'Stuffing/unstuffing, crating & packing',
        body: 'Wooden crating, vacuum sealing, strapping and packaging designed to order.',
        intro:
          'Packaging is the one cost in the chain you can cut without seeing the effect immediately. The effect shows up at the destination port, when the shipment is refused, or when the crate is opened and the contents are already damaged. For export and high-value cargo, packing is engineering rather than materials.',
        problems: [
          {
            name: 'Damage from vibration and moisture in transit',
            body: 'Precision equipment, circuit boards and finished metal surfaces are ruined by accumulated vibration and container humidity, not by a single impact.',
          },
          {
            name: 'Wooden packaging refused at the destination',
            body: 'Many countries require treated wood packaging carrying a valid mark. Non-compliant crates are held or must be repacked on the spot at high cost.',
          },
          {
            name: 'Careless lashing inside the container',
            body: 'Heavy items that are not properly secured shift when the vessel rolls or the truck brakes, destroying themselves and the cargo around them.',
          },
        ],
        approach: [
          {
            name: 'Identify the risk by cargo and by route',
            body: 'Moisture, vibration and impact are three different problems; a long sea leg and a short road leg call for different levels of protection.',
          },
          {
            name: 'Design the crate around lifting and centre of gravity',
            body: 'The crate is built so it can be lifted correctly at the far end, with clear lifting points and enough strength to be stacked if the route requires it.',
          },
          {
            name: 'Vacuum sealing for moisture-sensitive cargo',
            body: 'Sealed wrapping with desiccant for equipment and machined metal surfaces, particularly on long sea legs or where cargo waits in storage for clearance.',
          },
          {
            name: 'Lash and brace inside the container',
            body: 'Secured around the real centre of gravity, voids filled and crates strapped so nothing shifts along the way.',
          },
        ],
        usps: [
          {
            name: 'Experience with genuinely unforgiving cargo',
            body: 'Packing and bracing for items such as aircraft engines and microchips — a category with no room for a second attempt.',
          },
          {
            name: 'Packed in our own warehouse',
            body: '26,000 m² with 23 dock levellers means unstuffing, crating and container loading happen in one place instead of shuttling between parties.',
          },
          {
            name: 'Designed by people who know the route',
            body: 'Whoever designs the crate already knows which lane it will travel, how many times it will be handled and what will lift it — information a standalone packing shop does not have.',
          },
        ],
        points: [
          'Container stuffing and unstuffing',
          'Crating and wooden boxes to export specification',
          'Vacuum sealing and cargo lashing',
          'Bracing for sensitive cargo: aircraft engines, microchips',
        ],
        faqs: [
          {
            q: 'Does wooden export packaging need treatment?',
            a: 'Most markets require wood packaging material to be treated for phytosanitary purposes and to carry a valid mark. The exact requirement varies by destination, so tell us where the shipment is going and we will build to the right specification first time.',
          },
          {
            q: 'Is vacuum sealing necessary for every shipment?',
            a: 'No. It earns its place on moisture-sensitive equipment, finished metal surfaces, and anything on a long sea leg or waiting in storage for clearance. General cargo on short lanes usually does not need it.',
          },
          {
            q: 'Will you pack cargo that someone else is carrying?',
            a: 'Yes. Crating and packing can be booked on its own. That said, when we know the route and the handling in advance, the crate is designed closer to what the shipment will actually meet.',
          },
        ],
        meta: {
          title: 'Crating & packing',
          description:
            'Container stuffing, export-specification wooden crates, vacuum sealing and bracing for sensitive cargo such as aircraft engines and microchips.',
        },
      },

      crossborder: {
        name: 'Transit & cross-border cargo',
        body: 'Cross-border transport with permit and procedural support at the border gates.',
        intro:
          'There is a gap between sea and air that a lot of shipments fall into: too urgent for a vessel, too heavy for a plane. Cross-border road fills exactly that gap — provided the carrier genuinely operates the lane rather than reselling someone else’s space on it.',
        problems: [
          {
            name: 'Sea is too slow, air is too expensive',
            body: 'A shipment that has to arrive within a week on a budget that will not stretch to air freight is the classic case neither traditional mode solves.',
          },
          {
            name: 'Control is lost when the tractor changes at the border',
            body: 'The cargo moves onto another contractor’s vehicle at the crossing. From that point, information about it depends entirely on their goodwill.',
          },
          {
            name: 'One mistake at the border gate means standing still',
            body: 'A document that does not match, or a missing specialised permit, leaves the vehicle waiting at the gate accruing yard charges and pushing the whole plan back.',
          },
        ],
        approach: [
          {
            name: 'Pick the corridor that fits origin and destination',
            body: 'Three main corridors — Vietnam–China–Laos–Thailand, Vietnam–Laos and Vietnam–Cambodia — with different crossings and transit hubs.',
          },
          {
            name: 'Prepare documents before the vehicle arrives',
            body: 'Customs files and specialised permits are handled in advance, so time at the border is spent on procedure rather than on chasing paperwork.',
          },
          {
            name: 'Keep tracking across the legs',
            body: 'GPS tracking runs throughout the journey, including after the crossing, so the shipment is not lost from view at the transfer point.',
          },
        ],
        usps: [
          {
            name: 'Ten lanes in operation, not on paper',
            body: 'From Guangzhou–Nanning–Hanoi to Bangkok–Kuala Lumpur–Singapore, each with its own schedule and transit points.',
          },
          {
            name: 'Faster than sea, cheaper than air',
            body: 'Precisely the segment the traditional modes leave open, with flexibility right to the delivery point that a port or an airport cannot offer.',
          },
          {
            name: 'Customs handled in-house',
            body: 'As a licensed customs agent we prepare the documents for the cargo we are carrying ourselves — no gap in responsibility between the declarant and the carrier.',
          },
        ],
        points: [
          'Ten road lanes in operation across eight Southeast Asian countries',
          'Three corridors: Vietnam – China – Laos – Thailand, Vietnam – Laos, Vietnam – Cambodia',
          'Permit and procedural support at the border gates',
          'Faster than sea, cheaper than air, tracked by GPS 24/7',
        ],
        faqs: [
          {
            q: 'Are there special conditions for Laos and Cambodia?',
            a: 'The Vietnam–Laos lane is available only for cargo already declared to customs with duties settled. The Vietnam–Cambodia lane runs from Ho Chi Minh City ports or from inland Vietnam to the border gates, depending on the final delivery point.',
          },
          {
            q: 'Does the vehicle have to change at the border?',
            a: 'It depends on the lane and on the rules at each crossing. What matters is that whether or not there is a transfer, the shipment stays under one contract and one tracking system.',
          },
          {
            q: 'How long does a cross-border movement take?',
            a: 'It depends on the lane, on clearance time at the crossing and on peak season. We give indicative timings per lane when quoting, together with the factors that can move them.',
          },
        ],
        meta: {
          title: 'Transit & cross-border cargo',
          description:
            'Ten road lanes across Vietnam, China, Laos, Thailand, Cambodia, Myanmar, Malaysia and Singapore, tracked by GPS 24/7.',
        },
      },

      leasing: {
        name: 'Equipment leasing',
        body: 'Container tractors, forklifts and cranes — hired by the hour, by the trip or by the month.',
        intro:
          'Buying a crane for a six-month project is rarely the right call. But hiring has its own trap: the machine arrives without a certified operator, or it breaks down mid-job and the hire company has nothing to replace it with.',
        problems: [
          {
            name: 'Capital tied up in short-term need',
            body: 'Money sits in an asset used for a few months, along with maintenance, yard space and depreciation for all the time it is idle.',
          },
          {
            name: 'A machine without an operator',
            body: 'Lifting equipment requires a certified operator. Hiring bare and finding your own is both a safety and a compliance risk.',
          },
          {
            name: 'A breakdown with no replacement',
            body: 'Small hire companies typically hold one machine of each type. A breakdown means work stops until it is repaired.',
          },
        ],
        approach: [
          {
            name: 'Match the machine to the job, not to what is idle',
            body: 'Capacity, reach and real ground conditions established before anything is proposed, so the machine does not arrive unable to do the work.',
          },
          {
            name: 'Supplied with certified operators',
            body: 'Equipment comes with its operator, so responsibility for safety and for the machine sits in the same place.',
          },
          {
            name: 'By the hour, the trip or the month',
            body: 'The hire structure follows the shape of the need, rather than charging a month for two days of work.',
          },
        ],
        usps: [
          {
            name: 'A full range of equipment',
            body: 'Tractors and 20ft/40ft/45ft container trailers, low-bed trailers, forklifts from 2.5 to 25 tonnes, wheeled and crawler cranes, pilot vehicles.',
          },
          {
            name: 'Part of a fleet of 120+ units',
            body: 'A fleet that size can put a replacement in place when a machine goes down, instead of leaving the site waiting.',
          },
          {
            name: 'The rest of the chain is already there',
            body: 'When the job grows to include transport, lifting or storage, there is no new contractor to find and contract with.',
          },
        ],
        points: [
          'Container tractors and trailers in 20ft, 40ft and 45ft',
          'Low-bed trailers for oversized and overweight cargo',
          'Forklifts from 2.5 to 25 tonnes, electric and hand pallet trucks',
          'Wheeled and crawler cranes to project requirement',
          'Hire by the hour, the trip or the month, with certified operators',
        ],
        faqs: [
          {
            q: 'Does the hire rate include an operator?',
            a: 'Lifting equipment is hired with a certified operator as standard rather than as an option, for safety and compliance reasons. Fuel and mobilisation to site are quoted separately according to distance.',
          },
          {
            q: 'What is the minimum hire period?',
            a: 'Hire is available by the hour, by the trip or by the month. On short jobs, moving the equipment in and out is usually the larger part of the cost, so grouping tasks into one visit is more economical.',
          },
          {
            q: 'What happens if the machine breaks down mid-job?',
            a: 'We arrange a replacement from within our own fleet. This is why fleet size matters in hire — a company with one machine of each type cannot commit to it.',
          },
        ],
        meta: {
          title: 'Equipment leasing',
          description:
            'Tractors, low-bed trailers, 2.5–25 tonne forklifts and cranes by the hour, the trip or the month, with certified operators.',
        },
      },

      customs: {
        name: 'Customs clearance & maritime brokerage',
        body: 'Full import/export procedures plus ship brokering and voyage chartering.',
        intro:
          'Clearance is where cost accumulates fastest in the whole chain: every day cargo sits at the port is container demurrage, yard charges and a production line waiting on materials. Most of those days are lost not because customs is slow, but because the file was not right to begin with.',
        problems: [
          {
            name: 'The wrong HS code',
            body: 'A wrong code means the wrong duty rate. Caught early it costs time to amend; caught late in a post-clearance audit it becomes assessed duty plus penalties.',
          },
          {
            name: 'An invalid certificate of origin',
            body: 'The wrong form, incorrect details or late submission costs the shipment the entire tariff preference it should have received.',
          },
          {
            name: 'A missing specialised permit',
            body: 'Many goods require specialised inspection before clearance. Without it prepared, the cargo waits at the port and demurrage runs by the day.',
          },
        ],
        approach: [
          {
            name: 'Review the file before the cargo arrives',
            body: 'Documents, the intended HS code and any specialised requirements checked as soon as shipment details exist, rather than once it has berthed.',
          },
          {
            name: 'Advise on duty and lawful optimisation',
            body: 'Establish the correct HS code, which trade agreements can apply, and the documentation needed to claim the preference.',
          },
          {
            name: 'Declare on an EDI platform',
            body: 'Electronic declarations with status tracking, which is faster than a manual process.',
          },
          {
            name: 'Stay with the cargo through inspection',
            body: 'Somebody handles it directly if the shipment is routed for physical inspection, rather than leaving the shipper to sort it out at the port.',
          },
        ],
        usps: [
          {
            name: 'A licensed customs agent',
            body: 'Licence number 2569/HQHCM-GSQL — operating as a licensed agent, not as an unregistered filing service.',
          },
          {
            name: '196,718 declarations filed in 2024',
            body: 'At that volume most situations have been met before, and there is a procedure for them rather than one person’s recollection.',
          },
          {
            name: 'Clearance joined to transport and storage',
            body: 'A 9,536-pallet bonded warehouse and our own fleet, so cargo leaving the port moves on immediately instead of waiting for someone else’s truck.',
          },
        ],
        points: [
          'Duty rate and customs procedure consulting',
          'Physical inspection, permits and approvals',
          'Certificate of origin registration and duty refunds',
          'Ship brokering and voyage chartering',
        ],
        faqs: [
          {
            q: 'How long does clearance take?',
            a: 'Typically 6–8 working hours from aircraft landing for air freight, and 2 working days from discharge off the vessel for sea freight — provided the information supplied is complete, accurate and timely.',
          },
          {
            q: 'What documents do I need to prepare?',
            a: 'At minimum the contract, commercial invoice, packing list and bill of lading. Depending on the goods you may also need a certificate of origin, a specialised permit or quality inspection results. Send details early so we can review them in advance.',
          },
          {
            q: 'What happens if the HS code turns out to be wrong?',
            a: 'It can be corrected by supplementary declaration or amendment, depending on when it is found. Cost and risk both rise with time, which makes reviewing the code before filing the single best-value step in the process.',
          },
        ],
        meta: {
          title: 'Customs clearance',
          description:
            'Licensed customs agent 2569/HQHCM-GSQL. Air clearance in 6–8 hours, sea in 2 working days. HS code, C/O and duty refund advice.',
        },
      },
    },
  },
  why: {
    eyebrow: 'Strengths',
    title: 'Why clients choose',
    titleAccent: 'BEE',
    items: [
      {
        name: 'Uncompromising safety',
        body: 'Safety supervision at every stage of lifting, lashing and moving heavy cargo.',
      },
      {
        name: 'On schedule',
        body: 'Detailed route planning, contingency cover and continuous status updates for the shipper.',
      },
      {
        name: 'Cost optimised',
        body: 'Multimodal combinations and smart consolidation to bring down the cost per tonne-kilometre.',
      },
      {
        name: 'Fully compliant',
        body: 'End-to-end support for movement permits, customs procedures and cross-border transit.',
      },
      {
        name: 'A dedicated team',
        body: 'One point of contact across the whole project, responding 24/7.',
      },
      {
        name: 'Nationwide coverage',
        body: 'Offices in Ho Chi Minh City and Da Nang, with a domestic and international partner network.',
      },
    ],
  },

  process: {
    eyebrow: 'Process',
    title: 'Four clear',
    titleAccent: 'delivery steps',
    steps: [
      {
        name: 'Intake & survey',
        body: 'Recording cargo specifications, origin and destination, and surveying the route on site.',
      },
      {
        name: 'Plan & quotation',
        body: 'Proposing modes, equipment and manpower with transparent pricing.',
      },
      {
        name: 'Execution & supervision',
        body: 'Carrying out the plan with safety supervision and continuous journey updates.',
      },
      {
        name: 'Handover & acceptance',
        body: 'Delivery to site, condition acceptance and completion of all documentation.',
      },
    ],
  },

  fleet: {
    eyebrow: 'Equipment capability',
    title: 'Equipment',
    titleAccent: 'ready',
    titleTail: 'for any cargo',
    body: 'Flexible hire by the hour, by the trip or by the month — with certified operators included.',
    cta: 'Ask about equipment hire',
    items: [
      { name: 'Container tractors & trailers', spec: '20ft · 40ft · 45ft' },
      { name: 'Low-bed / low-deck trailers', spec: 'Oversized and overweight cargo' },
      { name: 'Forklifts', spec: '2.5 – 25 tonnes' },
      { name: 'Wheeled / crawler cranes', spec: 'To project requirement' },
      { name: 'Pilot & escort vehicles', spec: 'Heavy-lift routes' },
    ],
  },

  /** Figures match vi.ts — see the note there for their source. */
  warehousing: {
    eyebrow: 'Warehousing & distribution',
    title: '26,000 m² of warehousing',
    titleAccent: 'in operation',
    titleTail: 'to international standards',
    lead: 'Three functional warehouse types under a single management system — from deep-frozen cold storage for seafood and frozen food, to a bonded warehouse for import and export cargo awaiting clearance.',
    overview: [
      { to: 26000, suffix: ' m²', label: 'Total warehouse area' },
      { to: 30000, suffix: '', label: 'Pallet positions' },
      { to: 23, suffix: '', label: 'Loading dock levellers' },
      { to: 3, suffix: '', label: 'Functional warehouse types' },
    ],
    typesHeading: 'Three functional warehouses under one management system',
    warehouses: [
      {
        name: 'Cold storage',
        specs: [
          { label: 'Area', value: '3,895 m²' },
          { label: 'Capacity', value: '7,850 pallets' },
          { label: 'Temperature', value: '-25°C' },
          { label: 'Goods stored', value: 'Frozen food, seafood, food & beverage' },
        ],
      },
      {
        name: 'Distribution warehouse',
        specs: [
          { label: 'Area', value: '6,034 m²' },
          { label: 'Capacity', value: '12,242 pallets' },
          { label: 'Racking', value: 'Double-deep 7-tier racking for storage density' },
          { label: 'Throughput', value: 'Modern layout for fast retrieval and dispatch' },
        ],
      },
      {
        name: 'Bonded warehouse',
        specs: [
          { label: 'Capacity', value: '9,536 pallets' },
          { label: 'Customs support', value: 'Fast handling of import and export cargo' },
          { label: 'Security', value: '24/7 surveillance protecting high-value goods' },
          { label: 'Records', value: 'Detailed record keeping, compliant with regulation' },
        ],
      },
    ],
    techHeading: 'Operating technology',
    tech: [
      {
        name: 'WMS & TMS',
        body: 'Warehouse and transport management systems with barcode scanning, automating inventory control and distribution.',
      },
      {
        name: 'Rooftop solar',
        body: 'Solar power to cut emissions and move the operation towards sustainability.',
      },
      {
        name: 'Automatic fire suppression',
        body: 'Automatic sprinkler system using new-generation heads for maximum cargo safety.',
      },
      {
        name: 'HACCP standard',
        body: 'Applied to fresh and frozen food, identifying and controlling hazards inside cold storage.',
      },
    ],
    infraHeading: 'Warehouse infrastructure',
    infra: [
      'Waterproofing, storm protection, insect and bird control',
      'Fire prevention and ventilation systems',
      'Alarm systems and industrial fans',
      '50 CCTV cameras running 24/7',
      '2,000 pallets on 5-tier racking rated 1.6 tonnes per tier per pallet',
      '24/7 on-site security and 40 skilled warehouse workers',
    ],
  },

  crossborder: {
    eyebrow: 'International transport',
    title: '10 lanes in operation',
    titleAccent: 'across 8 countries',
    titleTail: 'in Southeast Asia',
    lead: 'Cross-border road transport fills the gap between sea and air: faster than a vessel, cheaper than a plane, and flexible right through to the delivery point.',
    benefits: [
      'Flexible routing',
      'Faster than sea freight',
      'Cheaper than air freight',
      '24/7 GPS tracking',
    ],
    mapAlt: 'Map of BEE Transportation cross-border network: ten numbered lanes linking Vietnam with China, Laos, Thailand, Cambodia, Myanmar, Malaysia and Singapore, with the Vietnamese branch network from Lang Son down to Can Tho.',
    mapCaption: 'Cross-border lane network',
    mapSource: 'The numbers on the map match the numbering in the lane list below.',
    routesHeading: 'Lanes in operation',
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
    corridorsHeading: 'Three main corridors',
    corridors: [
      {
        name: 'Vietnam — China — Laos — Thailand',
        body: 'We collect from any location in China and move the cargo through our hubs in Guangzhou, Shenzhen and Nanning, crossing at Huu Nghi border gate. Delivery in Vietnam or Laos.',
      },
      {
        name: 'Vietnam — Laos',
        body: 'Cargo moves from overseas into Da Nang and Hai Phong ports, and from Vietnam on to selected ports in Laos. Available only for cargo already declared to customs with duties settled.',
      },
      {
        name: 'Vietnam — Cambodia',
        body: 'Cargo moves from overseas into Ho Chi Minh City ports, or from Vietnam to selected border gates with Cambodia.',
      },
    ],
  },

  tracking: {
    eyebrow: 'Journey monitoring',
    title: 'GPS position',
    titleAccent: 'in real time',
    lead: 'Live tracking is used to improve driving behaviour and to strengthen security around every shipment.',
    items: [
      'Real-time journey reporting showing the position of each vehicle',
      'Live vehicle tracking on the map',
      'Travel speed measurement',
      'Monitoring of routes, stops and route changes',
      'Fuel consumption measurement',
    ],
  },

  lifting: {
    eyebrow: 'Lifting & relocation',
    title: 'Where a crane',
    titleAccent: 'cannot reach',
    lead: 'Alongside crane and forklift work, we move machinery into its installation position by hand — able to work in confined spaces a crane or forklift cannot get to, such as substations or a plant that is still running.',
    equipmentHeading: 'Lifting equipment',
    equipment: [
      '1 × Kato 45-tonne crane',
      '2 × forklifts, 3–5 tonnes',
      '4 × electric forklifts',
      '10 × hand pallet trucks',
    ],
    special: [
      {
        name: 'Manual relocation in confined spaces',
        body: 'Placing machinery in its final position inside substations and plants where mechanical equipment cannot reach.',
      },
      {
        name: 'Technical packing for sensitive cargo',
        body: 'Container stuffing and unstuffing, vacuum sealing, lashing and bracing for cargo such as aircraft engines and microchips — meeting the technical requirements of export freight.',
      },
    ],
  },

  customs: {
    eyebrow: 'Customs brokerage',
    title: 'A licensed',
    titleAccent: 'customs agent',
    lead: 'Customs declaration is the first concern of clients in Vietnam. With a team carrying decades of hands-on domestic experience and a commitment to transparency, we advise on and support clearance as fast as it can be done.',
    licenceLabel: 'Customs agent licence no.',
    slaHeading: 'Typical clearance time',
    sla: [
      { name: '6–8 working hours', body: 'Air freight — from aircraft landing' },
      { name: '2 working days', body: 'Sea freight — from discharge off the vessel' },
    ],
    slaNote: 'Provided the information supplied is complete, accurate and timely. Delivered on an EDI platform with digital connectivity.',
    scopeHeading: 'Scope of service',
    scope: [
      'Duty rate consulting',
      'Customs procedure consulting',
      'Physical inspection',
      'Permits and approvals',
      'Certificate of origin (C/O) registration',
      'Duty refunds',
    ],
  },

  /** Mirrors vi.ts — same clause order, same legal citations, no draft banner. */
  legal: {
    privacy: {
      eyebrow: 'Legal',
      title: 'Privacy',
      titleAccent: 'policy',
      updated: "Last updated: 7 October 2026",
      sections: [
        {
          name: "What we collect",
          body:
            "**When you send a quotation request** (on the website or in the app, including without signing in): your name, phone number, email address, the service you are asking about, and the cargo details you describe in the note.\n\n**When you create a customer account in the app:** the email address you sign in with, the one-time verification code (OTP) sent to it, the 6-digit PIN you choose, the name and phone number you add to your profile, and an account ID generated by the system. Quotation requests sent while signed in are linked to your account so you can follow their status.\n\n**When you use the app:** a device identifier used to deliver push notifications (a Firebase Cloud Messaging token). It is used only to notify you about your requests.\n\n**Staff accounts:** Bee employees sign in to the app with an account issued by the company. Their name, work email, department, role and activity on orders are processed for internal operations.\n\nWe do **not** collect sensitive personal data, location, contacts, photos or files on your device, we do **not** use the Advertising ID, and we do not use cookies to identify you on the website.",
        },
        {
          name: "Fingerprint and face unlock",
          body:
            "If you turn this on, your PIN is encrypted and stored on the device itself, in the operating system's secure key store (Android Keystore / iOS Keychain), and can only be unlocked with your own biometrics. Fingerprint and face data are managed by the operating system; we never read, receive or store them.",
        },
        {
          name: "Why we process it",
          body:
            "The data is used only to:\n- contact you, plan the shipment and send the quotation you asked for;\n- create, verify and manage your account;\n- let you follow the status of your requests and notify you about them;\n- run the internal quoting process between departments.\n\nWe do not use it for advertising, and we do not sell or trade it to third parties for commercial purposes.",
        },
        {
          name: "Legal basis",
          body:
            "Processing is carried out under the Law on Personal Data Protection No. 91/2025/QH15, on the basis of your consent, given when you choose to send a quotation request or create an account, and of the steps necessary before entering into a contract at your request. You may withdraw consent at any time; withdrawal does not affect the lawfulness of processing carried out before it.",
        },
        {
          name: "How long we keep it",
          body:
            "A quotation request that does not lead to a contract is kept for up to 24 months from the last contact, enough to serve the same customer on a later enquiry. Records for contracted work are kept for 10 years, under the statutory retention period for accounting records. Account data is kept until you delete your account. At the end of the period the data is deleted or stripped of anything that identifies a person.\n\nA quotation request sent from the app without signing in is also kept on your own device so you can look it up again; that copy is gone when you uninstall the app or clear its data.",
        },
        {
          name: "Who can access it",
          body:
            "Internally: the sales and operations staff assigned to your request, through the company's own operations system. Each employee sees only what their role allows.\n\nExternally, only providers that process data on our behalf:\n- the provider of the infrastructure that runs the website and measures its traffic;\n- Google (Firebase Cloud Messaging), to deliver push notifications to your device.\n\nWe use no third-party CRM or marketing service.",
        },
        {
          name: "Transfers outside Vietnam",
          body:
            "The website runs on cloud infrastructure whose servers sit outside Vietnam, and the app's push notifications pass through Google's servers. Part of your data therefore travels through and is briefly stored outside Vietnam before reaching the company's internal system. Sending a request or using the app means you consent to that transfer. If you would rather not, please call the hotline instead, or turn off the app's notifications in your device settings.",
        },
        {
          name: "Your rights",
          body:
            "You have the right to be informed, to access, to request correction, to request erasure, to obtain a copy of your data, to withdraw consent, to restrict or object to processing, and to complain, denounce or bring proceedings as provided by law.",
        },
        {
          name: "How to exercise them",
          body:
            "Send your request to info@beetransportation.vn or call the hotline below, giving the name and phone number (or account email) you used so we can find the right record. We respond within 72 hours. Exercising these rights is free, except for requests repeated an unreasonable number of times.\n\nYou can also correct your name and phone number yourself in the app under **Profile → Basic information**.",
        },
        {
          id: "delete-account",
          name: "Deleting your account and data",
          body:
            "**In the app:** go to **Profile → Password and security → Delete account** and confirm. Your account, profile details and the quotation requests linked to it are permanently deleted.\n\n**Without opening the app:** email info@beetransportation.vn with the subject \"Account deletion request\" from the email address you sign in with, or call the hotline. We confirm and complete the deletion within 72 hours.\n\nRecords for contracted work are still kept for the 10-year statutory accounting period, and used for that purpose only.",
        },
        {
          name: "Children",
          body:
            "The services are intended for businesses and people aged 18 and over. We do not knowingly collect children's data; if we find any, it is deleted.",
        },
        {
          name: "Traffic measurement",
          body:
            "On the website we use analytics that set no cookies and do not identify individuals, only to see which pages are viewed and how fast they load. It does not track you across other websites and builds no behavioural profile of you. The mobile app contains no analytics or advertising tools.",
        },
        {
          name: "Security and changes to this policy",
          body:
            "Data travels over an encrypted connection and is open only to staff who need it. Your PIN is never shown to staff. No system is perfectly secure, which is why we collect only what a quotation actually requires. When this policy changes the date at the top of the page changes with it; changes that affect your rights are notified directly to the customers concerned.",
        },
      ],
      contactHeading: 'Data protection contact',
      contactBody: "For any question or request concerning personal data, please contact:",
      meta: {
        title: 'Privacy policy',
        description:
          'How BEE Transportation collects, uses and protects the personal data you provide when sending a quotation request.',
      },
    },
    terms: {
      eyebrow: 'Legal',
      title: 'Terms',
      titleAccent: '& service conditions',
      updated: 'Last updated: 15 September 2026',
      sections: [
        {
          group: 'Website terms',
          name: 'Scope',
          body: 'The website group applies to access to and use of beetransportation.vn. The remaining groups are general service conditions, applying to cargo we accept for carriage, to customs clearance and to related work where the two parties have not signed a separate contract. Where they differ, the order of precedence is: the signed contract, then the accepted quotation, then this page.',
        },
        {
          name: 'Information on this website',
          body: 'Content on this website is an introduction to our capability. Equipment specifications, routes and timings are indicative, not contractual commitments. Commitments for a given shipment are set by the quotation and the contract.',
        },
        {
          name: 'Quotation requests',
          body: 'Sending a request through this website does not form a contract. A quotation takes effect only when issued in writing, and only for the validity period stated on it.',
        },
        {
          name: 'Intellectual property',
          body: 'All content, images, video and route maps on this website belong to BEE TRANSPORTATION Corporation unless noted otherwise. No copying for commercial purposes without written consent.',
        },
        {
          name: 'Links to other websites',
          body: 'This website may link to third-party sites. We are not responsible for their content or their policies.',
        },
        {
          group: 'Services and authority',
          name: 'Scope of service and authority to act',
          body: 'We act under the customer’s authority, on the specific request the customer sends for each shipment, within the scope of business permitted by law. That scope includes but is not limited to: carriage and forwarding of cargo, handling of documents, exchange of the delivery order (D/O) with the forwarding agent or the shipping and transport line, acting as customs agent, applying for import or export permits on request, loading and unloading, packing and crating, and installation of machinery and equipment at the plant. Authority arises for each service request sent; it is not a standing, open-ended mandate.',
        },
        {
          name: 'What we commit to',
          body: 'We arrange transport equipment that meets safety standards and legal requirements to collect the cargo and carry it from the collection point to the delivery point, and we are responsible for the safety of the cargo throughout carriage and during any loading and unloading we perform. Where anything irregular arises while the service is being performed, we notify the customer by telephone, email or in writing as soon as reasonably possible. Where we make the customs declaration on the customer’s behalf, we declare the information the customer supplied and do not alter it. Once delivery is complete and the customer has paid in full, we hand over all documents relating to the shipment, including invoices and receipts for amounts we disbursed on the customer’s behalf. We send a statement of services arising in the period for both parties to reconcile, and issue a VAT invoice as required by law.',
        },
        {
          group: 'Cargo and documents',
          name: 'Cargo information supplied by the customer',
          body: 'The customer is responsible for the accuracy of the cargo information declared: overall dimensions, weight, centre of gravity, lifting points, the nature of the cargo and its value. For oversized and overweight cargo, the customer supplies the manufacturer’s drawings or specifications before the method statement is prepared. A discrepancy against the declared information may force a change of method, equipment or route; the resulting cost and delay are the customer’s responsibility, and we may decline the cargo at the collection point. The customer also bears all risk, loss and cost where the cargo breaches the law, is seized, detained, impounded or confiscated, cannot be cleared, or is refused by the consignee.',
        },
        {
          name: 'Documents and customs declaration',
          body: 'The customer supplies complete and timely valid documents for us to carry out the work, and is responsible for their legality, accuracy and completeness: the power of attorney, commercial invoice, packing list, sale contract and any other documents the authorities require. For cargo of a special nature, the customer also supplies the paperwork describing that nature so the work can be done safely. Before we lodge the declaration with customs, the customer is responsible for checking its contents and confirming them. Any consequence arising from documents that are missing, wrong or supplied late is the customer’s responsibility.',
        },
        {
          name: 'Packing, crating and securing',
          body: 'Where the customer packs the cargo, the customer is responsible for packaging that withstands vibration, stacking and lifting under normal carriage conditions, to the correct specification and type under applicable law. We offer crating as a separate service; timber crates for export are treated to the ISPM-15 phytosanitary standard. Securing, dunnage and restraint of cargo on the vehicle are carried out by us; the customer must not remove or alter them once the cargo has been secured and sealed. If the customer breaches the packing obligation and the cargo causes injury to people or damage to property, the customer is legally liable for that loss.',
        },
        {
          name: 'Cargo we do not carry',
          body: 'We do not carry goods prohibited in circulation under Vietnamese law: weapons, military equipment and specialist technical equipment of the armed forces; narcotics; highly toxic chemicals; artefacts belonging to historical, cultural or museum collections; seditious, obscene or superstitious material; fireworks of any kind; medicines not licensed for circulation in Vietnam; protected wildlife and plants; together with goods prohibited from export, import or carriage under Vietnamese law and international treaties. Dangerous goods are accepted only where the customer declares them in advance and the shipment holds the carriage permit and the safety training certificates required by Decree 34/2024/ND-CP. If prohibited goods come to light during carriage, we stop the movement and hand the goods to the authorities; the customer bears all resulting cost and all liability before the law.',
        },
        {
          name: 'Movement permits and method statements',
          body: 'Oversized and overweight cargo requires a movement permit from the road authority. We prepare the application and obtain the permit on the customer’s behalf where the parties agree. Permit lead time, the mandatory route, the hours in which movement is allowed, and attached requirements such as escort vehicles, power line isolation or bridge and road reinforcement are decided by the competent authority and lie outside our control.',
        },
        {
          group: 'Collection and delivery',
          name: 'Booking and cancellation',
          body: 'The customer gives notice of a service request within the lead time stated in the quotation so that we can make equipment, plant and people ready. The collection point must be somewhere transport equipment can enter and leave conveniently and safely; if it is not, the parties agree a transfer arrangement and its cost before vehicles are dispatched. Where the customer cancels after we have committed equipment, or where collection or delivery is not completed within the time allowed in the quotation, the customer pays the costs already incurred.',
        },
        {
          name: 'Transit time',
          body: 'Times given in a quotation are estimates under normal operating conditions, counted in working days. They exclude time waiting for a movement permit, waiting for customs clearance, urban lorry curfew hours, public holidays, and time waiting for space or equipment at the delivery point arranged by the customer. Time commitments do not apply in the event of natural disaster, transport infrastructure failure, other force majeure, or at the direction of a state authority. Time becomes a commitment carrying remedies only where the quotation or contract says so explicitly.',
        },
        {
          name: 'Working hours and out-of-hours service',
          body: 'We carry out work during office hours on working days, excluding Saturday afternoons, Sundays and public holidays under Vietnamese labour law. Administrative procedures with state authorities depend on the working hours of each office. Where the customer asks us to work outside those hours, an out-of-hours service fee is charged separately as quoted.',
        },
        {
          name: 'Handover and joint inspection',
          body: 'Cargo is handed over intact by package or by full container; we open a package or container only at the request of the customer or a competent authority, and our carriage obligation is discharged when the cargo is delivered in that condition. Representatives of both parties sign a handover note at the collection point and at the delivery point. Where anything irregular appears — a broken seal, torn packaging, a missing package, signs of damage — the receiving party records it on the note immediately, photographs the condition before unloading, and the parties draw up a joint inspection record. A signed handover note recording no irregularity is taken as delivery in full and outwardly intact.',
        },
        {
          name: 'Where the consignee does not take delivery',
          body: 'If the consignee fails to collect the cargo, refuses it, or delays unloading beyond the notified period, we may unload and place the cargo into storage somewhere we consider safe and convenient, and notify the customer; all resulting cost and loss is the customer’s responsibility. If the customer or the customer’s counterparty fails to supply sufficient documents, or does not meet the conditions for export or import, such that we cannot proceed for a continuous period agreed between the parties, the service is treated as complete; the customer pays the service fees already incurred and bears the other related costs.',
        },
        {
          group: 'Charges and payment',
          name: 'Quotation and acceptance',
          body: 'Freight and other charges are notified by us in writing or by email, based on the specific request for each shipment. The customer is taken to have accepted a quotation by confirming it in writing or by email, by instructing or requesting us to perform the service, or by allowing us to perform it. For urgent collection or delivery, or where the customer asks to shorten the normal transit time, we may decline the cargo; if we accept it, the freight is agreed afresh between the parties. If, after we have taken the cargo, the customer changes the request, or we find that the cargo information and service request differ from the facts, we may stop providing the service and the customer pays the freight and costs arising from that unsuccessful movement; if we agree to continue, the customer pays the additional charges arising. Freight does not include the cost of packaging, dunnage material, securing or stowage unless otherwise agreed. Services the customer asks for beyond the quoted scope are charged separately.',
        },
        {
          name: 'Disbursements',
          body: 'The customer may authorise us to pay, on the customer’s behalf, amounts that other suppliers invoice directly to the customer, including but not limited to the carrier’s local charges, container demurrage, storage and yard charges, and other transport surcharges actually incurred. These are disbursements, and we settle them by non-cash means in accordance with the law, with valid supporting documents and invoices. The customer reimburses us for all disbursements. The disbursement limit per shipment is set out in the quotation or contract; above that limit, the customer advances the funds.',
        },
        {
          name: 'Payment',
          body: 'Payment is made in Vietnamese dong. Costs incurred abroad in foreign currency are converted to dong at the bank’s selling rate on the date the VAT invoice is issued. Payment is made by bank transfer to the account stated in the quotation or contract; any change to those account details is valid only when made in writing and signed and sealed by the authorised representatives of both parties — we never notify a change of account number by email or message alone. Transfer charges and bank charges are borne by the customer. Where payment is made in cash, the customer pays at our office, or to a member of our staff carrying a letter of introduction signed and sealed by our legal representative, and must obtain a stamped receipt as proof of payment. Payment terms, the credit limit and the interest rate applying to late payment are set out in the quotation or contract.',
        },
        {
          name: 'Lien over cargo and security',
          body: 'Where a debt has fallen due and remains unpaid, under Article 239 of the Commercial Law 2005 we may hold a quantity of cargo and the related documents to recover it, and must notify the customer in writing immediately; all costs arising from the lien are borne by the customer. If the customer has still not paid 45 days after that notice, we may dispose of the cargo as the law allows; any proceeds remaining after the debt and related costs are deducted are returned to the customer. For dangerous goods and other cargo of a special nature, we may require the customer to place a deposit, lodge an escrow sum or provide a bank guarantee to secure the obligation to compensate for loss caused by carrying that cargo.',
        },
        {
          group: 'Liability and risk',
          name: 'Insurance and declared value',
          body: 'We recommend that customers insure their cargo, particularly high-value plant and machinery. Insurance — usually on Institute Cargo Clauses (A) terms — is taken out by the customer or the customer’s trading counterparty at their own cost; we can arrange cover on request for a separate premium. Where the customer declares the value of the cargo in advance and in writing, the limit of liability is set by that declared value; where no declaration is made, the limit below applies.',
        },
        {
          name: 'Limitation of liability',
          body: 'Under Article 5 of Decree 163/2017/ND-CP on logistics services: where the customer has not declared the value of the cargo in advance, liability is limited to 500 million dong per claim; where value was declared in advance and confirmed by us, compensation does not exceed that declared value. Where a shipment passes through several stages carrying different limits, the limit that applies is the highest of them. Compensation is also determined in accordance with the Standard Trading Conditions of the Vietnam Logistics Business Association (VLA). We are not liable for indirect loss, including loss of profit, loss of business opportunity and loss caused by interruption to production.',
        },
        {
          name: 'Exemptions and force majeure',
          body: 'Under Article 237 of the Commercial Law 2005, we are exempt from liability for loss arising from the fault of the customer or the customer’s agent, from our following the customer’s instructions, from an inherent defect in the cargo, and in the other cases of exemption provided for in transport and customs law. Both parties are also exempt in the event of force majeure: natural disaster, epidemic, strike, armed conflict, transport infrastructure failure, or a decision of a competent state authority. The party affected must take reasonable preventive measures and the necessary alternative measures to limit the impact so far as possible, and must notify the other party with supporting evidence within the period set out in the contract, counted from the date the event occurred or the date it became known. The time for performing obligations is extended by the duration of the event. When the event ends, the affected party must notify the other immediately; failure to notify, or late notification, leaves that party liable for the breach and for the resulting loss.',
        },
        {
          name: 'Claims',
          body: 'A claim for loss of or damage to cargo must be made in writing within 14 days of delivery, with the handover note, the joint inspection record and photographs of the condition. After that period we are exempt from liability under Article 237 of the Commercial Law 2005. We acknowledge a claim within 3 working days and respond within 30 days of receiving the complete file.',
        },
        {
          group: 'General',
          name: 'Confidentiality',
          body: 'Information and trade secrets that either party discloses to the other in the course of working together and providing the service must not be disclosed to anyone outside the transaction, unless disclosure is necessary to perform the service itself. The confidentiality obligation does not apply to information already in the public domain, information lawfully supplied by a third party, or information that must be disclosed at the requirement of the law or a competent state authority. The handling of personal data is set out separately in the Privacy Policy.',
        },
        {
          name: 'Amendment and severability',
          body: 'We may update this page; the date at the head of the page changes with it, and the version displayed is the one that applies to service requests arising after that date. For a signed contract, any amendment or addition is valid only when made in writing and signed and sealed by the authorised representatives of both parties. If any clause is held void, unlawful or unenforceable for any reason, the validity and enforceability of the remaining clauses is unaffected.',
        },
        {
          name: 'Governing law and dispute resolution',
          body: 'These terms are governed by the laws of Vietnam, including the rules on carriage of goods, taxation, import and export control and customs administration, as those instruments are amended, supplemented or replaced. Where a dispute arises, the parties notify each other in writing promptly and seek to settle it by negotiation on a basis of equality and mutual benefit. If negotiation does not succeed within the period the parties have agreed, the dispute is referred, at the claimant’s election, to the competent court of Vietnam, or to the Vietnam International Arbitration Centre at the Vietnam Chamber of Commerce and Industry (VIAC) under that centre’s rules of arbitration — the language of the arbitration is Vietnamese, the seat is Ho Chi Minh City, and the award is final and binding on both parties. The party at fault bears the costs arising from the resolution of the dispute, including legal fees.',
        },
      ],
      contactHeading: 'Contact',
      contactBody:
        'For any question about these terms and service conditions, please use the details below.',
      meta: {
        title: 'Terms & service conditions',
        description:
          'Terms applying to beetransportation.vn and BEE Transportation’s general service conditions: authority to act, documents and customs declaration, packing, cargo we do not carry, disbursements, payment, limitation of liability and claims.',
      },
    },
  },
  ctaBand: {
    title: 'Have a shipment to move?',
    body: 'Send us the cargo specifications — we respond with an approach and a quotation within 24 hours.',
    cta: 'Get a quote',
  },

  /* The carrier names live in PARTNERS (lib/site.ts) — proper nouns, untranslated. */
  partners: {
    label: 'Transport partners',
    /* Caption under the figure. The figure is the logo count, counted automatically. */
    customers: 'Customers who trust us with their cargo.',
    membership: 'Logistics associations and global networks.',
  },

  blog: {
    title: 'Our blog',
    listLabel: 'Article list',
    emptyTitle: 'Nothing published yet',
    emptyBody:
      'We are writing up the first pieces — lanes, customs procedure and notes from the yard. Check back shortly.',
    publishedLabel: 'Published',
    articleEyebrow: 'News',
    backToList: 'Back to the blog',
  },

  appDownload: {
    title: 'Get the app',
    lead: 'and use our services on the go',
    available: 'Available on',
    googlePlayUrl: '',
    appStoreUrl: '',
    qrUrl: '',
    qrAlt: 'QR code to download the Bee Transportation app',
    phoneAlt: 'Bee Transportation app: look up and request quotes',
  },

  homeFaq: {
    title: 'Frequently asked questions',
    items: [
      {
        q: 'What transport services does Bee Transportation offer?',
        a: 'Domestic, cross-border and multimodal transport; import and export customs clearance; warehousing and distribution; machinery lifting and relocation; and project, oversized and heavy-lift cargo.',
      },
      {
        q: 'Is there a separate fee for a route survey?',
        a: 'It depends on the shipment. For project cargo or lanes that need an on-site survey, the survey cost is quoted clearly before any work starts. Contact us for advice on your shipment.',
      },
      {
        q: 'How long does it take to get a plan and a quote?',
        a: 'Standard requests are quoted within the working day. Project cargo that needs a route survey takes longer, and we tell you the expected time as soon as we receive the request.',
      },
      {
        q: 'Does my cargo need a road permit?',
        a: 'Oversized and overweight cargo usually needs a road permit for the vehicle on that route. We check and apply for the permit on your behalf when your shipment requires one.',
      },
    ],
  },

  team: {
    eyebrow: 'Team',
    title: 'Representatives',
    titleAccent: 'ready to help',
    lead: 'The team who will price and run your shipment.',
    empty: 'Team profiles coming soon.',
    loadFailed: 'Could not load the team.',
    railLabel: 'Representatives',
    prev: 'Previous representative',
    next: 'Next representative',
  },

  contact: {
    eyebrow: 'Contact',
    title: 'Tell us about',
    titleAccent: 'your shipment',
    labels: {
      hotline: 'Hotline',
      email: 'Email',
    },
    form: {
      name: 'Full name',
      namePlaceholder: 'Jane Doe',
      phone: 'Phone number',
      phonePlaceholder: '+84 9xx xxx xxx',
      email: 'Email',
      emailPlaceholder: 'you@company.com',
      service: 'Service type',
      message: 'Cargo details',
      messagePlaceholder:
        'Dimensions, weight, origin — destination, expected timing…',
      submit: 'Send quotation request',
      required: 'Please fill in this field.',
      invalidEmail: 'That email address does not look right.',
      invalidPhone: 'That phone number does not look right.',
      invalidNameChars: 'Name can only contain letters and spaces.',
      invalidPhoneChars: 'Phone number can only contain digits.',
      sending: 'Sending…',
      sentTitle: 'We have received your request',
      sentBody: 'We will come back to you within 24 working hours.',
      sentClose: 'Close',
      failed: 'Could not send. Please try again, or call the hotline above if it is urgent.',
      limited: 'Each phone number can send up to 3 quote requests per 24 hours. Please call our hotline for more help:',
      consent: 'By sending this you agree that we may contact you about it, under our',
      consentLink: 'Privacy policy',
    },
  },

  footer: {
    servicesHeading: 'Services',
    companyHeading: 'Company',
    supportHeading: 'Support',
    contactHeading: 'Contact',
    aboutLabel: 'About us',
    privacyLabel: 'Privacy Policy',
    termsLabel: 'Terms of Service',
    copyright: 'Copyright © {year} By {name}, All rights reserved.',
  },

  meta: {
    home: {
      title: 'BEE Transportation — Professional Transportation',
      description:
        'Specialist logistics for oversized, heavy-lift and project cargo: 120+ vehicles, 26,000 m² warehousing, 10 cross-border lanes.',
    },
    about: {
      title: 'About',
      description:
        'Founded 8 November 2023, specialising in the transport, handling and relocation of oversized, heavy-lift and project cargo.',
    },
    services: {
      title: 'Services',
      description:
        'Nine service lines: domestic transport, multimodal, heavy-lift project cargo, lifting, crating, cross-border and customs clearance.',
    },
    capabilities: {
      title: 'Capabilities',
      description:
        'Container tractors, low-bed trailers, 2.5–25 tonne forklifts, cranes and pilot vehicles — by the hour, the trip or the month.',
    },
    warehousing: {
      title: 'Warehousing',
      description:
        '26,000 m² of warehousing, 30,000 pallet positions: -25°C cold storage, distribution racking and a 9,536-pallet bonded warehouse.',
    },
    crossborder: {
      title: 'International transport',
      description:
        'Ten road lanes across Vietnam, China, Laos, Thailand, Cambodia, Myanmar, Malaysia and Singapore. Faster than sea, cheaper than air.',
    },
    privacy: {
      title: 'Privacy policy',
      description:
        'How BEE Transportation collects, uses and protects the personal data you provide with a quotation request.',
    },
    terms: {
      title: 'Terms & service conditions',
      description:
        'Terms applying to beetransportation.vn and BEE Transportation’s general service conditions: cargo information, packing, cargo we do not carry, limitation of liability and claims.',
    },
    blog: {
      title: 'Blog',
      description:
        'News and field notes from BEE Transportation: lanes, customs procedure, warehousing and oversized cargo.',
    },
    contact: {
      title: 'Contact',
      description:
        'Offices in Ho Chi Minh City and Da Nang. Hotline (+84) 886 440 449. Send your cargo specifications and get an approach and quotation within 24 hours.',
    },
  },
  og: {
    homeTitle: 'Professional Transportation',
    homeAccent: 'Connecting Everywhere',
    facts: ['120+ trucks & trailers', '425+ trips a day', '26,000 m² warehousing'],
  },
  site: {
    name: 'BEE TRANSPORTATION Corporation',
    shortName: 'BEE TRANSPORTATION',
    email: 'info@beetransportation.vn',
    customsLicence: '2569/HQHCM-GSQL',
    phoneLabel: 'Mr. Tiger',
    phoneNumber: '0886440449',
    // Dùng chung với bản tiếng Việt (địa chỉ không có bản tiếng Anh) — nhãn
    // nhóm được dịch lúc hiện, xem nhanNhom ở lib/offices.ts.
    offices: [
      { label: 'Trụ sở chính', street: 'TTC Tower, 253 Hoàng Văn Thụ, Phường Tân Sơn Hoà', city: 'Thành phố Hồ Chí Minh', phone: '', email: '', hidden: '' },
      { label: 'Chi nhánh', street: '386 Xô Viết Nghệ Tĩnh, Phường Khuê Trung, Quận Cẩm Lệ', city: 'Đà Nẵng', phone: '', email: '', hidden: '' },
    ],
  },
  // CMS ghi de vao day luc chay; rong = dung anh trong repo (lib/image-slots.ts).
  images: {},
} satisfies Dictionary;
