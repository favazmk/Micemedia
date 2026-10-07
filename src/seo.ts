/**
 * Single source of truth for page-level SEO. Used at build/dev time by the Vite plugin in
 * vite.config.ts (so crawlers that don't run JS still get the right head) and at runtime by
 * App.tsx (so in-app navigation keeps title, description and canonical in sync).
 */

export const SITE_URL = 'https://www.micemediaevents.com';
export const SITE_NAME = 'MICE Media';
export const OG_IMAGE = `${SITE_URL}/images/mice-media-logo.png`;

export interface PageSeo {
  /** URL path, as served */
  path: string;
  title: string;
  description: string;
  /** Short text shown to crawlers/no-JS visitors inside <noscript> */
  summary: string;
}

export const PAGE_SEO: Record<string, PageSeo> = {
  home: {
    path: '/',
    title: 'Events Management Companies in Dubai | MICE MEDIA',
    description: 'MICE Media is a Dubai events management company producing corporate events, conferences, product launches, gala dinners, exhibition stands and AV production across the UAE and GCC.',
    summary: 'MICE Media is a Dubai events management company: conferences, product launches, gala dinners, exhibition stands, AV production, team building and permits across the UAE and GCC.',
  },
  'about-us': {
    path: '/about-us.html',
    title: 'About MICE Media | Corporate Event Management Company in Dubai',
    description: 'Meet MICE Media, the Dubai team that plans, designs and runs corporate events, exhibitions and brand experiences end-to-end across the UAE and GCC.',
    summary: 'About MICE Media: a Dubai-based corporate event management and exhibition production team.',
  },
  services: {
    path: '/services.html',
    title: 'Event Management Services in Dubai | MICE MEDIA',
    description: 'Conferences, product launches, gala dinners, staging and AV production, team building, community events, talent management, permits and exhibition stands, all from one Dubai agency.',
    summary: 'MICE Media services: conferences and conventions, product launches, gala dinners and awards, staging and AV production, team building, community events, talent management, permits and exhibitions.',
  },
  exhibition: {
    path: '/exhibition.html',
    title: 'Exhibition Stand Builders in Dubai | MICE MEDIA',
    description: 'Custom and modular exhibition stands designed and built by MICE Media for trade shows and exhibitions across Dubai and the UAE, from concept to teardown.',
    summary: 'Exhibition stand design and build in Dubai: custom and modular stands for trade shows and exhibitions.',
  },
  events: {
    path: '/events.html',
    title: 'Our Events | Corporate Event Portfolio Dubai | MICE MEDIA',
    description: 'Conferences, gala dinners, launches, team building and celebrations produced end-to-end by MICE Media across Dubai and the GCC.',
    summary: 'Our event portfolio: conferences, gala dinners, launches, team building and celebrations produced across Dubai and the GCC.',
  },
  contact: {
    path: '/contact.html',
    title: 'Contact MICE Media | Request an Event Proposal in Dubai',
    description: 'Request a proposal from MICE Media. Tell us about your event or exhibition and our Dubai team will get back to you. Call +971 50 840 8655 or email info@micemediaevents.com.',
    summary: 'Contact MICE Media, The Meydan Hotel, Grandstand 6th Floor, Nad Al Shiba 1, Dubai. Phone +971 50 840 8655, email info@micemediaevents.com.',
  },
};

// portfolio.html is a legacy URL that opens the Events page
const FILE_TO_PAGE: Record<string, string> = {
  'index.html': 'home',
  'about-us.html': 'about-us',
  'services.html': 'services',
  'exhibition.html': 'exhibition',
  'events.html': 'events',
  'contact.html': 'contact',
  'portfolio.html': 'events',
};

export const pageForFile = (file: string) => FILE_TO_PAGE[file.split(/[\\/]/).pop() ?? ''] ?? 'home';

export const LOCAL_BUSINESS_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': ['EventPlanner', 'LocalBusiness'],
  '@id': `${SITE_URL}/#organization`,
  name: 'Mice Media LLC',
  alternateName: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/images/mice-media-logo.png`,
  image: OG_IMAGE,
  description: 'Dubai events management company producing corporate events, conferences, product launches, gala dinners, exhibition stands and AV production across the UAE and GCC.',
  telephone: '+971508408655',
  email: 'info@micemediaevents.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'The Meydan Hotel, Grandstand, 6th Floor, Nad Al Shiba 1',
    addressLocality: 'Dubai',
    addressCountry: 'AE',
  },
  areaServed: ['Dubai', 'United Arab Emirates', 'GCC'],
  sameAs: [
    'https://www.facebook.com/profile.php?id=61554902427941',
    'https://www.instagram.com/micemediaevents',
    'https://www.linkedin.com/company/mice-media/',
    'https://youtube.com/@MICEMediaEvents',
  ],
};

/** Runtime: keep the head in step with the in-app page. Static tags come from the Vite plugin. */
export function applySeo(page: string) {
  const seo = PAGE_SEO[page] ?? PAGE_SEO.home;
  const url = SITE_URL + seo.path;
  document.title = seo.title;
  const set = (attr: 'name' | 'property', key: string, value: string) => {
    let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attr, key);
      document.head.appendChild(el);
    }
    el.setAttribute('content', value);
  };
  set('name', 'description', seo.description);
  set('property', 'og:title', seo.title);
  set('property', 'og:description', seo.description);
  set('property', 'og:url', url);
  set('name', 'twitter:title', seo.title);
  set('name', 'twitter:description', seo.description);
  let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.rel = 'canonical';
    document.head.appendChild(canonical);
  }
  canonical.href = url;
}
