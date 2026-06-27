/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Service, PortfolioItem, ClientLogo, Testimonial, ProcessStep, WhyUsReason } from './types';

export const BRAND_INFO = {
  name: "MICE MEDIA",
  legalName: "MICE Media LLC FZ",
  tagline: "Crafting Events That the World Remembers",
  location: "Dubai, UAE",
  address: "MICE Media LLC FZ, The Meydan Hotel, Grandstand – 6th Floor, Nad Al Shiba 1, Dubai – UAE",
  phone1: "+971 50 1606797",
  phone2: "+971 50 840 8655",
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
    id: "conferences-seminars",
    number: "01",
    title: "Conferences & Seminars",
    description: "International stages demand international standards. We design and deliver end-to-end conference experiences — from technical production and speaker management to full delegate journeys — that make your message impossible to ignore.",
    iconName: "Presentation",
    details: [
      "Rigorous Delegate Journey Planning",
      "Dynamic Keynote Stage Scenic Design",
      "Multi-Stream Presentation Management",
      "Automated Live Registration & RFID Badging",
      "Bespoke Simultaneous Translation Systems"
    ],
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2000&auto=format&fit=crop"
  },
  {
    id: "gala-dinner-awards",
    number: "02",
    title: "Gala Dinner & Awards",
    description: "Milestones deserve more than applause. We craft award evenings and gala dinners with the precision and aesthetic authority that turn a single night into a permanent chapter of your organisation's story.",
    iconName: "Award",
    details: [
      "Bespoke Scenic Set & Stage Architecture",
      "Immersive Soundscapes & Custom Lighting Design",
      "Rigorous VIP Seating & Registration Protocol",
      "Cinematic Video Openers & Presentation Assets",
      "Seamless Live Entertainment Scheduling"
    ],
    image: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?q=80&w=2000&auto=format&fit=crop"
  },
  {
    id: "product-launch-activation",
    number: "03",
    title: "Product Launch & Brand Activation",
    description: "A launch is only as powerful as the moment it creates. We build multi-sensory activation experiences that cut through noise, generate genuine excitement, and make your brand the story everyone tells the next morning.",
    iconName: "Sparkles",
    details: [
      "High-Impact Reveal Mechanics / Kabuki Drops",
      "Immersive Tech Integrations (AR/VR/Holograms)",
      "Environmental Narrative & Scenic Styling",
      "Influencer Event Activations & PR Stunts",
      "Bespoke Spatial Fragrance & Audio Ambience"
    ],
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2000&auto=format&fit=crop"
  },
  {
    id: "audio-visual-production",
    number: "04",
    title: "Audio Visual Production",
    description: "Sound moves emotion. Light shapes atmosphere. Our AV production team handles the full technical architecture of your event — LED walls, stage design, rigging, live sound, and broadcast-quality streaming — so the experience lands exactly as intended.",
    iconName: "Volume2",
    details: [
      "Broad-Spectrum High-Res LED Media Walls",
      "EAW & L-Acoustics Professional Live Sound PA",
      "State-of-the-Art Robotic Stage Intelligent Lighting",
      "Dynamic Multi-Camera Broadcast & HD Streaming",
      "Full Rigging, Truss, and Ground Support Engineering"
    ],
    image: "https://images.unsplash.com/photo-1520627581900-50280eb4c2bc?q=80&w=2000&auto=format&fit=crop"
  },
  {
    id: "branding",
    number: "05",
    title: "Branding",
    description: "Consistency is credibility. From event identity and environmental graphics to branded assets and post-event collateral, we ensure your brand speaks at the same premium frequency across every single touchpoint.",
    iconName: "Palette",
    details: [
      "Bespoke Event Brand Identity & Logo Systems",
      "Sleek Spatial & Environmental Signage Design",
      "High-End Eco-Conscious Branded Gift Suites",
      "Premium Motion Typography & Logo Loops",
      "Integrated Event Companion App Custom UI"
    ],
    image: "https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2000&auto=format&fit=crop"
  },
  {
    id: "incentives-travel",
    number: "06",
    title: "Incentives & Travel Rewards",
    description: "Motivation is an experience, not a line item. We design corporate incentive programs and executive travel rewards that make your highest performers feel exactly as exceptional as they've earned to feel.",
    iconName: "Compass",
    details: [
      "Elite Dubai & Desert Luxury Glamping Curations",
      "Five-Star Yacht Assemblies & Gourmet Dinings",
      "Frictionless Executive Airport Fast-Track Handling",
      "Curative Masterclasses with Regional Headliners",
      "VIP Access to Regional Landmarks & Events"
    ],
    image: "https://images.unsplash.com/photo-1512453979436-5a50c640e5eb?q=80&w=2000&auto=format&fit=crop"
  },
  {
    id: "team-building",
    number: "07",
    title: "Team Building",
    description: "Culture isn't built in boardrooms. Our team building programs are crafted to break silos, spark genuine connections, and send your people back with more energy, trust, and shared purpose than they arrived with.",
    iconName: "Users2",
    details: [
      "High-Stakes Beachfront Engineering Challenges",
      "Interactive Culinary Masterclass Tournaments",
      "Regional Desert Survival Navigation Rallies",
      "Corporate CSR-Aligned Philanthropic Builds",
      "Psychology-Backed Deep-Trust Workspaces"
    ],
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2000&auto=format&fit=crop"
  },
  {
    id: "entertainment",
    number: "08",
    title: "Entertainment",
    description: "The right act at the right moment transforms an event entirely. We curate bespoke entertainment — performers, live acts, experiential installations — calibrated precisely to your audience and the atmosphere you want to create.",
    iconName: "Music",
    details: [
      "International Headliner & Symphony Bookings",
      "Sleek Vertical Aerialists & Kinetic Light Acts",
      "Immersive Interactive Performance Sculptures",
      "A-List Presenters, MCs, and Regional Masters",
      "Interactive Laser Harp & Tech-Arts Fusion"
    ],
    image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=2000&auto=format&fit=crop"
  },
  {
    id: "exhibitions",
    number: "09",
    title: "Exhibitions",
    description: "Your stand is your first impression on the floor. We design and build custom and modular exhibition environments — concept to completion, fabrication to teardown — that stop traffic and start conversations.",
    iconName: "Layers",
    details: [
      "Custom Double-Decker Exhibition Pavilions",
      "Advanced Joinery, Paint Finish, and Fabrication",
      "Integrated Audio-Visual & Touch-Screen Displays",
      "Zero-Waste Fully Modular Sustainable Booths",
      "Full Regulatory DWTC Submission & Permit Handlings"
    ],
    image: "https://images.unsplash.com/photo-1531058020387-3be344556be6?q=80&w=2000&auto=format&fit=crop"
  }
];

export const PORTFOLIO_DATA: PortfolioItem[] = [
  {
    id: "portfolio-01",
    title: "AIA: AirlinePros International Assembly",
    category: "Conference",
    caption: "Global aviation assembly. Full end-to-end conference production for a leading international aviation brand.",
    image: "https://www.micemediaevents.com/wp-content/uploads/2024/01/AIA1.jpg",
    tag: "Aviation Summit"
  },
  {
    id: "portfolio-02",
    title: "Calo: Corporate Iftar",
    category: "Private",
    caption: "Cultural precision meets elevated hospitality — planned and executed to the last detail.",
    image: "https://www.micemediaevents.com/wp-content/uploads/2024/04/calo11.jpg",
    tag: "Cultural Gala"
  },
  {
    id: "portfolio-03",
    title: "Trans Skills: Iftar Evening",
    category: "Corporate",
    caption: "Tradition and appreciation, crafted for one of the region's leading staffing companies.",
    image: "https://www.micemediaevents.com/wp-content/uploads/2024/04/ts11.jpg",
    tag: "Hospitality"
  },
  {
    id: "portfolio-04",
    title: "Swiss Arabian Perfumes: Chairman's Birthday",
    category: "Private",
    caption: "Milestone celebration for Mr. Hussein Adam Ali, Chairman of Swiss Arabian Perfumes Group. Intimate. Luxurious. Unforgettable.",
    image: "https://www.micemediaevents.com/wp-content/uploads/2024/05/MAN05888.jpg",
    tag: "VIP Celebration"
  },
  {
    id: "portfolio-05",
    title: "Swiss Arabian Perfumes: Team Building",
    category: "Team Building",
    caption: "Purpose-built team experience that reignited culture and reconnected a high-performing organisation.",
    image: "https://www.micemediaevents.com/wp-content/uploads/2024/05/Swizz-teambuilding-3.jpg",
    tag: "Corporate Culture"
  },
  {
    id: "portfolio-06",
    title: "AMH Tourism: Exhibition Stand, ATM 2024",
    category: "Exhibition",
    caption: "Custom exhibition stand at Arabian Travel Market 2024, DWTC. Maximum presence. Zero compromise.",
    image: "https://www.micemediaevents.com/wp-content/uploads/2024/06/AMH-ATM-3.jpeg",
    tag: "DWTC Exhibition"
  },
  {
    id: "portfolio-07",
    title: "Speed Group: Exhibition Stand, DWTC 2023",
    category: "Exhibition",
    caption: "Modular exhibition environment at the Material Handling Exhibition, DWTC 2023. Bold, functional, on-brand.",
    image: "https://www.micemediaevents.com/wp-content/uploads/2024/07/SPeed-group-potfolio-2023-1.jpeg",
    tag: "Bespoke Booth"
  }
];

export const CLIENT_LOGOS: ClientLogo[] = [
  { id: "1", name: "AirlinePros", logoUrl: "https://www.micemediaevents.com/wp-content/uploads/2024/04/AirlinePros-logo_Final-1024x247.png" },
  { id: "2", name: "Lobo listone", logoUrl: "https://www.micemediaevents.com/wp-content/uploads/2024/07/logo718.png" },
  { id: "3", name: "Calo", logoUrl: "https://www.micemediaevents.com/wp-content/uploads/2024/05/calo-logo-012.jpg" },
  { id: "4", name: "AMH", logoUrl: "https://www.micemediaevents.com/wp-content/uploads/2024/07/AMH-dark-blue-logo.png" },
  { id: "5", name: "Trans Skills", logoUrl: "https://www.micemediaevents.com/wp-content/uploads/2024/05/TRansskill-logo.jpg" },
  { id: "6", name: "Listone-n", logoUrl: "https://www.micemediaevents.com/wp-content/uploads/2024/07/Lobo-listone-logo-n@2x.png" },
  { id: "7", name: "Fairmont Palm", logoUrl: "https://www.micemediaevents.com/wp-content/uploads/2024/07/Fairmont-palm.png" },
  { id: "8", name: "Swiss Arabian", logoUrl: "https://www.micemediaevents.com/wp-content/uploads/2024/07/swissarabian-2.png" },
  { id: "9", name: "NEXA", logoUrl: "https://www.micemediaevents.com/wp-content/uploads/2024/07/NEXA-LOGO-1.jpg" },
  { id: "10", name: "Speed Group", logoUrl: "https://www.micemediaevents.com/wp-content/uploads/2024/05/speed-group-logo-012.jpg" },
  { id: "11", name: "Alhan", logoUrl: "https://www.micemediaevents.com/wp-content/uploads/2024/07/alhan-logo.jpg" },
  { id: "12", name: "DIH Main", logoUrl: "https://www.micemediaevents.com/wp-content/uploads/2024/07/DIH-MAIN-1.jpg" },
  { id: "13", name: "Futura Leathers", logoUrl: "https://www.micemediaevents.com/wp-content/uploads/2024/07/futura-leathers-logo.jpg" },
  { id: "14", name: "Traveldoor", logoUrl: "https://www.micemediaevents.com/wp-content/uploads/2024/07/traveldoor-Logo2.png" },
  { id: "15", name: "Woodfloors", logoUrl: "https://www.micemediaevents.com/wp-content/uploads/2024/07/woodfloors-logo.jpg" },
  { id: "16", name: "Kosmo Konnect", logoUrl: "https://www.micemediaevents.com/wp-content/uploads/2024/07/KOSMO-KONNECT-LOGO-H.jpg" }
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
    title: "Precision at Every Scale",
    description: "Whether it's 20 executives or 2,000 delegates, we apply the same rigorous planning, the same quality of execution, and the same zero-compromise standard to every event we touch."
  },
  {
    id: "why-02",
    number: "②",
    title: "Ideas That Actually Work",
    description: "Creativity without execution is just decoration. We bridge bold concepts and flawless delivery — producing ideas that are as practical as they are impressive, every single time."
  },
  {
    id: "why-03",
    number: "③",
    title: "Your Vision, Our Obsession",
    description: "We begin every project by deeply understanding your goals, your audience, and your brand — then we build everything backwards from there. The result is always an event that feels unmistakably yours."
  },
  {
    id: "why-04",
    number: "④",
    title: "A Team You Can Actually Trust",
    description: "Reliability is a luxury in this industry. We're known for calm under pressure, transparent communication, and showing up — fully — every time."
  }
];

export const VISION_MISSION = {
  vision: "To be the event management company that GCC's most ambitious organisations turn to first — not because we're available, but because we're unmistakably the best. We envision a future where every event we touch becomes a marker moment in someone's professional story.",
  mission: "To produce exceptional corporate events and brand experiences across Dubai and the region — combining creative strategy, technical precision, and a relentless commitment to quality. From the first conversation to the final moment of the night, we craft experiences that are purposeful, premium, and impossible to forget."
};
