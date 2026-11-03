/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Service, PortfolioItem, ClientLogo, Testimonial, ProcessStep, WhyUsReason } from './types';
import oberoiStand from './assets/gallery/exhibitions/Oberoi Hotels & Resorts – Exhibition Stand/oberoi-01.webp';
import alhindStand from './assets/gallery/exhibitions/Alhind Group – Exhibition Stand/alhind-01.webp';
import guntnerStand from './assets/gallery/posters/guntner-02.webp';
import tractebelAwards from './assets/gallery/events/Tractebel – End of Year Awards/dsc09020.webp';
import tractebelTeam from './assets/gallery/events/Tractebel – Team Building/dsc09268.webp';
import urbInauguration from './assets/gallery/events/Universal Rubber Belt – Factory Inauguration/haz02651.webp';
// Client logos: the original files from the old WordPress site, self-hosted
import airlineprosLogo from './assets/logos/airlinepros.webp';
import flyingCarpetLogo from './assets/logos/flying-carpet.webp';
import caloLogo from './assets/logos/calo.webp';
import amhTourismLogo from './assets/logos/amh-tourism.webp';
import transSkillsLogo from './assets/logos/trans-skills.webp';
import loboListoneLogo from './assets/logos/lobo-listone.webp';
import fairmontPalmLogo from './assets/logos/fairmont-the-palm.webp';
import swissArabianLogo from './assets/logos/swiss-arabian.webp';
import nexaTravelLogo from './assets/logos/nexa-travel.webp';
import speedGroupLogo from './assets/logos/speed-group.webp';
import ahlanDxbLogo from './assets/logos/ahlan-dxb.webp';
import dubaiIntlHotelLogo from './assets/logos/dubai-international-hotel.webp';
import futuraLeathersLogo from './assets/logos/futura-leathers.webp';
import travelDoorLogo from './assets/logos/travel-door.webp';
import woodfloorsLogo from './assets/logos/woodfloors.webp';
import kosmosKonnectLogo from './assets/logos/kosmos-konnect.webp';
import aiaPhoto from './assets/portfolio/aia-airlinepros-assembly.webp';
import transSkillsPhoto from './assets/portfolio/trans-skills-iftar.webp';
import swissTeamPhoto from './assets/portfolio/swiss-arabian-team-building.webp';

export const BRAND_INFO = {
  name: "MICE MEDIA",
  legalName: "MICE Media",
  tagline: "Crafting Events That the World Remembers",
  location: "Dubai, UAE",
  address: "Mice Media LLC, Grandstand – 6th Floor, Nad Al Shiba 1, Dubai – UAE",
  // Google Business Profile listing
  mapUrl: "https://www.google.com/maps/search/?api=1&query=MICE+MEDIA+Events&query_place_id=ChIJJSvKFjdpXz4R2vYAq9hIGHQ",
  mapEmbedUrl: "https://maps.google.com/maps?q=MICE%20MEDIA%20Events,%20Nad%20Al%20Sheba%201,%20Dubai&ll=25.1581867,55.3007519&z=15&output=embed",
  phone1: "+971 50 840 8655",
  whatsapp: "https://wa.me/971508408655",
  email: "info@micemediaevents.com",
  socials: {
    facebook: "https://www.facebook.com/profile.php?id=61554902427941",
    instagram: "https://www.instagram.com/micemediaevents",
    linkedin: "https://www.linkedin.com/company/mice-media/",
    youtube: "https://youtube.com/@MICEMediaEvents"
  }
};

export const SERVICES_DATA: Service[] = [
  {
    id: "conferences-conventions",
    number: "01",
    title: "Conferences & Seminars",
    description: "Let us bring your vision to life. From concept to completion, MICE Media Events manages conferences, meetings, seminars, and summit organisations across Dubai and the UAE.",
    tagline: "Let us bring your vision to life.",
    intro: [
      "From concept to completion, MICE Media Events manages conferences, meetings, seminars, and summit organisations across Dubai and the UAE. We manage every stage of the event, ensuring each phase is executed professionally and seamlessly.",
      "We handle the event production for AV, Light Technical, Stage Design and Branding Production, Logistics management, Delegate coordination, Registration online & Onsite Management with on-ground event coordination and execution. This allows our clients to focus on their conference content and audience engagement while we manage the operational excellence.",
      "With extensive expertise in organizing business conferences and corporate events, we ensure your event reflects the Client's objective and brand identity while providing a seamless and memorable experience for all attendees."
    ],
    listHeading: "What We Bring to Life",
    iconName: "Presentation",
    details: [
      "Venue Management",
      "Event Concept Creation & Design",
      "Agenda Creation",
      "Event Compliances & Permits",
      "Guest Management (Visa, Tickets, Accommodation & Logistics)",
      "Registration Management",
      "Branding",
      "Audio Visual Light Production",
      "Stage Fabrication",
      "Customised Multimedia Content",
      "Conference Host Arrangement",
      "Videography & Photography",
      "Session & Speaker Management",
      "Onsite Management",
      "Post Event evaluation"
    ],
    image: "./images/services/service_conferences_1783333265054.webp"
  },
  {
    id: "product-launch-activation",
    number: "02",
    title: "Product Launch & Brand Activation",
    description: "We work closely with you to understand your product, audience and goals, then turn that insight into an engaging event experience. You bring the product. We'll create the moment everyone remembers.",
    tagline: "Ready to Turn Heads? Let's Launch Something Amazing.",
    intro: [
      "We work closely with you to understand your product, audience and goals, then turn that insight into an engaging event experience. From creative concepts and venue selection to immersive production, guest engagement with experiential activities or entertainment we handle everything so you can focus on the big reveal.",
      "Whether it's a product launch, dealer gathering or large-scale brand activation, we'll help you create buzz, spark conversations and make your product impossible to ignore."
    ],
    closing: "You bring the product. We'll create the moment everyone remembers.",
    listHeading: "What We Bring to Life",
    iconName: "Sparkles",
    details: [
      "Concept Creation and Design",
      "Event Production & Fabrication",
      "Event Compliances & Permits",
      "PR Media Communications",
      "Guest Management (Visa, Tickets, Accommodation & Logistics)",
      "RSVP",
      "Event Branding & Décor arrangement",
      "Immersive Tech Integrations (AR/VR/Holograms)",
      "Audio Visual Light Technical Production",
      "Customised Multimedia Content",
      "Influencer Event Activations & PR Stunts",
      "Talent Management",
      "Videography & Photography",
      "Onsite Coordination & Management",
      "Post Event evaluation"
    ],
    image: "./images/services/service_product_launch_1783333289525.webp"
  },
  {
    id: "gala-dinner-awards",
    number: "03",
    title: "Gala Dinner & Awards Ceremony",
    description: "Every great Gala begins with a Story. We transform that story into a beautifully planned and memorable experience, from the perfect venue to elegant themes and stage setups.",
    tagline: "Every great Gala begins with a Story.",
    intro: [
      "We transform that story into a beautifully planned and memorable experience. From selecting the perfect venue to designing elegant themes, stage setups with right AV and Light concepts, our team guarantees a smooth and sophisticated event from start to finish. As a leading event production company in Dubai, we specialize in creating experiences that leave a lasting impression on every guest."
    ],
    listHeading: "What We Bring to Life",
    iconName: "Award",
    details: [
      "Venue Management",
      "Concept Creation & Design",
      "Agenda Creation",
      "Event Compliances & Permits",
      "Guest Management (Visa, Tickets, Accommodation & Logistics)",
      "Registration Management",
      "Event Branding and Décor arrangement",
      "Audio Visual Light Production",
      "Customised Multimedia Content",
      "Videography & Photography",
      "Talent Management",
      "Onsite Coordination & Management",
      "Post Event Evaluation"
    ],
    image: "./images/services/service_gala_1783333277608.webp"
  },
  {
    id: "content-creation-av",
    number: "04",
    title: "Content Creation & AV production",
    description: "Sound moves emotion. Light shapes atmosphere. From high-impact motion graphics and cinematic stage visuals to concert-grade audio and broadcast streaming, our technical team builds audio-visual worlds that captivate completely.",
    iconName: "Volume2",
    details: [
      "Broad-Spectrum High-Res LED Media Walls",
      "Concert-Grade Professional Live Sound PA Systems",
      "Cinematic Stage Visuals & 3D Motion Graphics",
      "State-of-the-Art Robotic Stage Intelligent Lighting",
      "Dynamic Multi-Camera Broadcast & HD Live Streaming"
    ],
    image: "./images/services/service_av_1783333304135.webp"
  },
  {
    id: "team-building-incentives",
    number: "05",
    title: "Team Building & Incentive Events",
    description: "Culture and motivation aren't built in boardrooms. We engineer exhilarating team building challenges and bespoke corporate incentive escapes inside UAE or internationally that build deep trust, alignment and shared purpose.",
    intro: [
      "Culture and motivation aren't built in boardrooms. We engineer exhilarating team building challenges and bespoke corporate incentive escapes inside UAE or internationally that build deep trust, alignment and shared purpose."
    ],
    listHeading: "How Strategy meets Creativity",
    iconName: "Users2",
    details: [
      "Understand the Client Brief",
      "Design the Journey",
      "Venue / Travel Arrangements",
      "Customized Itineraries",
      "Employee Engagement Activities",
      "Professional Hosts & Facilitators",
      "Venue Branding & Rewards"
    ],
    image: "./images/services/service_team_building_1783333338151.webp"
  },
  {
    id: "community-festive-events",
    number: "06",
    title: "Community & Festive Events",
    description: "Bringing large-scale communities together for unforgettable celebrations. From national day festivities and cultural galas to seasonal pop-ups and festive evenings, we design joyful, safely orchestrated public gatherings.",
    intro: [
      "Bringing large-scale communities together for unforgettable celebrations. From national day festivities and cultural galas to seasonal pop-ups and festive evenings, we design joyful, safely orchestrated public gatherings."
    ],
    listHeading: "What We Bring to Life",
    iconName: "Sparkles",
    details: [
      "Large-Scale Public Event & Festival Events",
      "National Day & Cultural Holiday Celebrations",
      "Seasonal Pop-Up Markets & Festive Villages",
      "Family Entertainment, Kids Zones & Workshops"
    ],
    image: "./images/services/service_community_festive.webp"
  },
  {
    id: "talent-management",
    number: "07",
    title: "Talent Management",
    description: "The right presence transforms an event entirely. We curate and manage bespoke talent — international headliners, bilingual emcees, symphony ensembles, kinetic aerialists, and keynote speakers — calibrated precisely to your audience.",
    iconName: "Music",
    details: [
      "International Headliner & Symphony Bookings",
      "A-List Presenters, Bilingual MCs, and Keynotes",
      "Sleek Vertical Aerialists & Kinetic Light Acts",
      "Immersive Interactive Performance Artists",
      "Full Rider Management & VIP Backstage Protocol"
    ],
    image: "./images/services/service_entertainment_1783333349846.webp"
  },
  {
    id: "permits",
    number: "08",
    title: "Permits",
    description: "Flawless compliance and zero-delay government authorizations across Dubai and the UAE. We manage all DET (DTCM), civil defense, municipality, economic department, drone, and venue permits with complete regulatory precision.",
    iconName: "FileCheck",
    details: [
      "Dubai Tourism (DET / DTCM) Event & Entertainment Permits",
      "Civil Defense, Safety & Structural Approvals",
      "Dubai Municipality & Venue Authority Clearances",
      "Drone Filming, Pyrotechnics & Laser Approvals",
      "VIP Security, Road Closure & Traffic Clearances"
    ],
    image: "./images/services/service_permits.webp"
  },
  {
    id: "exhibition",
    number: "09",
    title: "Exhibitions",
    description: "Your stand is your first impression on the floor. We design and build custom and modular exhibition environments from concept to completion, fabrication to teardown that stop traffic and start conversations.",
    tagline: "Your stand is your first impression on the floor.",
    intro: [
      "We design and build custom and modular exhibition environments from concept to completion, fabrication to teardown that stop traffic and start conversations.",
      "Our innovative design approach and immersive engagement strategies are crafted to attract high footfall, enhance brand recall and create meaningful visitor interactions. Whether you require a custom-built stand, a modular setup or a complete trade show display solution in Dubai, MICE Media delivers creativity, precision and impactful results at every stage."
    ],
    listHeading: "What We Build to Show",
    iconName: "Layers",
    details: [
      "Stand Concept & Design",
      "Design & Structural approvals from Compliance Team",
      "Marketing and Branding collaterals",
      "Stand Production & Fabrication",
      "Signages & Graphics",
      "Integrated Audio-Visual, Touch-Screen & Holographic LED Displays",
      "Furniture rentals"
    ],
    image: "./images/services/service_exhibitions_1783333361785.webp"
  }
];

// Event case studies (everything except exhibition stands). Titles match the gallery
// folder names so each card opens its photo album.
export const EVENTS_DATA: PortfolioItem[] = [
  {
    id: "portfolio-01",
    title: "AIA: AirlinePros International Assembly",
    category: "Conference",
    caption: "Global aviation assembly. Full end-to-end conference production for a leading international aviation brand.",
    image: aiaPhoto,
    tag: "Aviation Summit"
  },
  {
    id: "portfolio-03",
    title: "Trans Skills: Iftar Evening",
    category: "Corporate",
    caption: "Tradition and appreciation, crafted for one of the region's leading staffing companies.",
    image: transSkillsPhoto,
    tag: "Hospitality"
  },
  {
    id: "portfolio-05",
    title: "Swiss Arabian Perfumes: Team Building",
    category: "Team Building",
    caption: "Purpose-built team experience that reignited culture and reconnected a high-performing organisation.",
    image: swissTeamPhoto,
    tag: "Corporate Culture"
  },
  {
    id: "portfolio-tractebel-awards",
    title: "Tractebel – End of Year Awards",
    category: "Awards",
    caption: "End-of-year awards night for Tractebel, with staging, lighting, AV and the full show run end-to-end by MICE Media.",
    image: tractebelAwards,
    tag: "Awards Night"
  },
  {
    id: "portfolio-tractebel-team",
    title: "Tractebel – Team Building",
    category: "Team Building",
    caption: "A full team-building day for Tractebel, planned, set up and hosted by the MICE Media crew.",
    image: tractebelTeam,
    tag: "Corporate Culture"
  },
  {
    id: "portfolio-urb-inauguration",
    title: "Universal Rubber Belt – Factory Inauguration",
    category: "Corporate",
    caption: "Grand opening of Universal Rubber Belt's new factory, from ribbon-cutting moment to guest hospitality.",
    image: urbInauguration,
    tag: "Grand Opening"
  }
];

// Exhibition stand case studies
export const EXHIBITIONS_DATA: PortfolioItem[] = [
  {
    id: "portfolio-oberoi",
    title: "Oberoi Hotels & Resorts: Exhibition Stand",
    category: "Exhibition",
    caption: "Open-plan navy and gold stand with backlit Arabic lattice screens, framed lightbox imagery and a relaxed meeting lounge.",
    image: oberoiStand,
    tag: "Custom Stand"
  },
  {
    id: "portfolio-alhind",
    title: "Alhind Group: Exhibition Stand",
    category: "Exhibition",
    caption: "Bold red-and-white corner stand showcasing the full Alhind brand family on an illuminated logo wall, with a lounge for client meetings.",
    image: alhindStand,
    tag: "Corner Stand"
  },
  {
    id: "portfolio-guntner",
    title: "Güntner: Exhibition Stand",
    category: "Exhibition",
    caption: "Clean, product-led stand for Güntner's Greener Food Cooling range, with LED fascia, live product display, green wall and meeting bar.",
    image: guntnerStand,
    tag: "Custom Stand"
  }
];

export const PORTFOLIO_DATA: PortfolioItem[] = [...EVENTS_DATA, ...EXHIBITIONS_DATA];

export const CLIENT_LOGOS: ClientLogo[] = [
  { id: "1", name: "AirlinePros", logoUrl: airlineprosLogo },
  { id: "2", name: "Flying Carpet", logoUrl: flyingCarpetLogo },
  { id: "3", name: "Calo", logoUrl: caloLogo },
  { id: "4", name: "AMH Tourism", logoUrl: amhTourismLogo },
  { id: "5", name: "Trans Skills", logoUrl: transSkillsLogo },
  { id: "6", name: "Lobo Listone", logoUrl: loboListoneLogo },
  { id: "7", name: "Fairmont The Palm", logoUrl: fairmontPalmLogo },
  { id: "8", name: "Swiss Arabian", logoUrl: swissArabianLogo },
  { id: "9", name: "Nexa Travel", logoUrl: nexaTravelLogo },
  { id: "10", name: "Speed Group", logoUrl: speedGroupLogo },
  { id: "11", name: "ahlan DXB", logoUrl: ahlanDxbLogo },
  { id: "12", name: "Dubai International Hotel", logoUrl: dubaiIntlHotelLogo },
  { id: "13", name: "Futura Leathers", logoUrl: futuraLeathersLogo },
  { id: "14", name: "Travel Door", logoUrl: travelDoorLogo },
  { id: "15", name: "Woodfloors", logoUrl: woodfloorsLogo },
  { id: "16", name: "Kosmos Konnect", logoUrl: kosmosKonnectLogo }
];

export const TESTIMONIALS_DATA: Testimonial[] = [
  {
    id: "test-01",
    quote: "I am personally satisfied with their work for our Gulfood Exhibition Booth. Sini especially is very helpful, calm and able to managed and fulfill our requests and executed the job seamlessly! Well done, MICE Media Team! as this is also not the first time to work with them, so I hope we can work again together in future. All the best!",
    clientName: "Aprisanti Yenti",
    jobTitle: "Gulfood Booth Client",
    companyName: "Gulfood Exhibition",
    city: "Dubai, UAE",
    rating: 5
  },
  {
    id: "test-02",
    quote: "We have been working with Ms. Sini and MiceMedia from last year and we have been together in multiple events for their registration desk services for HMS Group hospitals conferences. They are very professional and up to the high standards.",
    clientName: "Zain Ashraf",
    jobTitle: "Hospital Conferences Organizer",
    companyName: "HMS Group",
    city: "Dubai, UAE",
    rating: 5
  },
  {
    id: "test-03",
    quote: "A big thank you to the MICE Media team for the amazing support and execution. From venue sourcing and event branding to permits, registration, and AV production, everything was perfectly organized and smoothly handled. Truly appreciate your professionalism and dedication!",
    clientName: "Muhammed Dilshad",
    jobTitle: "Corporate Event Partner",
    companyName: "MICE Media Corporate client",
    city: "Dubai, UAE",
    rating: 5
  },
  {
    id: "test-04",
    quote: "Our company’s annual meet was an unforgettable experience, thanks to the amazing team-building activities, Team MICE, your team are very NICE. Special thanks to Swetha, Thara and Sini. Every activity was thoughtfully planned and incredibly engaging, bringing our team closer together while ensuring we had a fantastic time. The energy, coordination, and fun-filled challenges made it a truly memorable event.",
    clientName: "Manoj Koshy",
    jobTitle: "Annual Meet & Culture Lead",
    companyName: "Company Annual Meet",
    city: "Dubai, UAE",
    rating: 5
  }
];

export const PROCESS_DATA: ProcessStep[] = [
  {
    id: "proc-01",
    number: "01",
    title: "Brief & Discovery",
    description: "Every exceptional event starts with exceptional listening. We immerse ourselves in your objectives, audience, brand voice, and constraints before a single concept is formed."
  },
  {
    id: "proc-02",
    number: "02",
    title: "Creative Strategy",
    description: "Strategy before aesthetics. We develop a creative framework — theme, experience flow, key moments — ensuring every element of the event serves a deliberate purpose."
  },
  {
    id: "proc-03",
    number: "03",
    title: "Meticulous Planning",
    description: "Logistics is where vision either holds or collapses. Our project management team maps every dependency, timeline, vendor, and contingency so that execution day has no surprises."
  },
  {
    id: "proc-04",
    number: "04",
    title: "Flawless Execution",
    description: "This is where years of experience speak. Our on-ground teams are briefed to the detail, focused on quality, and trained to handle the unexpected without it ever reaching you."
  },
  {
    id: "proc-05",
    number: "05",
    title: "Review & Growth",
    description: "After every event, we conduct a thorough debrief — analysing what worked, what could sharpen, and how we make the next one even better. Because we're not just building events, we're building a long-term partnership."
  }
];

export const WHY_US_DATA: WhyUsReason[] = [
  {
    id: "why-01",
    number: "①",
    title: "Expertise You Can Trust",
    description: "With years of proven success in delivering high-profile corporate events and exhibitions, we bring unmatched industry expertise, meticulous planning, and flawless execution to ensure your event's seamless delivery."
  },
  {
    id: "why-02",
    number: "②",
    title: "Innovative Solutions",
    description: "We infuse creativity and fresh concepts into every event, from bespoke stage designs to immersive attendee experiences, ensuring your brand stands out and leaves a lasting impact across every touchpoint."
  },
  {
    id: "why-03",
    number: "③",
    title: "Client-Centric Approach",
    description: "Your goals are our utmost priority. We work closely with you from concept to completion, offering tailored solutions, transparent communication, and dedicated support every step of the way."
  },
  {
    id: "why-04",
    number: "④",
    title: "Proven Success",
    description: "Our track record speaks for itself. Trusted by top government entities and international brands across Dubai and the GCC, we consistently deliver events that exceed expectations and elevate brand prestige."
  }
];

export const VISION_MISSION = {
  vision: "To be the event management company that GCC's most ambitious organisations turn to first — not because we're available, but because we're unmistakably the best. We envision a future where every event we touch becomes a marker moment in someone's professional story.",
  mission: "To produce exceptional corporate events and brand experiences across Dubai and the region — combining creative strategy, technical precision, and a relentless commitment to quality. From the first conversation to the final moment of the night, we craft experiences that are purposeful, premium, and impossible to forget."
};
