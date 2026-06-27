/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BRAND_INFO, SERVICES_DATA } from '../data';
import { Facebook, Instagram, Linkedin, Youtube, Mail, Phone, MapPin, ArrowUp } from 'lucide-react';

interface FooterProps {
  setActivePage: (page: string) => void;
  setSelectedServiceId?: (id: string | null) => void;
}

export default function Footer({ setActivePage, setSelectedServiceId }: FooterProps) {
  const handleServiceClick = (serviceId: string) => {
    if (setSelectedServiceId) {
      setSelectedServiceId(serviceId);
    }
    setActivePage('services');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageClick = (page: string) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="main-footer" className="bg-black border-t border-white/5 relative overflow-hidden mt-20 z-20">
      {/* Visual Ambient Blur */}
      <div className="absolute bottom-0 right-1/4 w-[350px] h-[350px] bg-red-600/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 pt-20 pb-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-16 border-b border-white/5">
          {/* Column 1: Brand details */}
          <div className="flex flex-col gap-6 md:col-span-2 lg:col-span-1">
            <div className="flex flex-col">
              <div className="flex flex-col -space-y-1.5" id="footer-logo">
                <div className="flex items-baseline leading-none">
                  <span className="font-display text-3xl font-black text-red-500 tracking-tighter">M</span>
                  <span className="font-display text-2xl font-black tracking-tight text-white">ice</span>
                </div>
                <div className="flex items-center pl-0.5 leading-none">
                  <span className="font-display text-xs font-bold tracking-[0.22em] text-neutral-400 uppercase">
                    media
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-mono tracking-widest text-neutral-500 mt-2">MICE Media LLC FZ</span>
            </div>
            
            <p className="text-neutral-400 text-sm leading-relaxed">
              Dubai's trusted partner for corporate event management and experiential production — delivering precision, creativity, and excellence across UAE and the GCC region.
            </p>

            <span className="text-xs text-red-500 font-mono tracking-wider uppercase font-semibold">
              ✦ {BRAND_INFO.tagline}
            </span>

            {/* Social Links */}
            <div className="flex items-center gap-3 mt-2" id="footer-socials">
              <a 
                href={BRAND_INFO.socials.linkedin} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-neutral-900 border border-white/10 flex items-center justify-center text-neutral-400 hover:text-red-500 hover:border-red-500/40 hover:bg-neutral-950 transition-all duration-300"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a 
                href={BRAND_INFO.socials.instagram} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-neutral-900 border border-white/10 flex items-center justify-center text-neutral-400 hover:text-red-500 hover:border-red-500/40 hover:bg-neutral-950 transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a 
                href={BRAND_INFO.socials.facebook} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-neutral-900 border border-white/10 flex items-center justify-center text-neutral-400 hover:text-red-500 hover:border-red-500/40 hover:bg-neutral-950 transition-all duration-300"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a 
                href={BRAND_INFO.socials.youtube} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-neutral-900 border border-white/10 flex items-center justify-center text-neutral-400 hover:text-red-500 hover:border-red-500/40 hover:bg-neutral-950 transition-all duration-300"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="flex flex-col gap-6">
            <span className="font-display text-sm font-semibold tracking-wider text-white uppercase border-l-2 border-red-650 pl-3">
              Useful Links
            </span>
            <ul className="flex flex-col gap-3.5 text-sm text-neutral-400">
              <li>
                <button onClick={() => handlePageClick('home')} className="hover:text-red-500 transition-colors cursor-pointer text-left">
                  Home Screen
                </button>
              </li>
              <li>
                <button onClick={() => handlePageClick('about')} className="hover:text-red-500 transition-colors cursor-pointer text-left">
                  Corporate Journey
                </button>
              </li>
              <li>
                <button onClick={() => handlePageClick('services')} className="hover:text-red-500 transition-colors cursor-pointer text-left">
                  Our Specialities
                </button>
              </li>
              <li>
                <button onClick={() => handlePageClick('portfolio')} className="hover:text-red-500 transition-colors cursor-pointer text-left">
                  Portfolio Exhibits
                </button>
              </li>
              <li>
                <button onClick={() => handlePageClick('contact')} className="hover:text-red-500 transition-colors cursor-pointer text-left">
                  Connect & Estimate
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: The 9 Disciplines */}
          <div className="flex flex-col gap-6">
            <span className="font-display text-sm font-semibold tracking-wider text-white uppercase border-l-2 border-red-650 pl-3">
              Our Disciplines
            </span>
            <ul className="grid grid-cols-1 gap-2.5 text-xs text-neutral-400 font-sans" id="footer-disciplines">
              {SERVICES_DATA.map((srv) => (
                <li key={srv.id}>
                  <button 
                    onClick={() => handleServiceClick(srv.id)} 
                    className="hover:text-red-500 transition-all duration-200 cursor-pointer flex items-center gap-1.5 text-left group"
                  >
                    <span className="text-neutral-600 group-hover:text-red-500 font-mono text-[9px]">{srv.number}</span>
                    {srv.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact details */}
          <div className="flex flex-col gap-6" id="footer-contact">
            <span className="font-display text-sm font-semibold tracking-wider text-white uppercase border-l-2 border-red-650 pl-3">
              Headquarters
            </span>
            <div className="flex flex-col gap-4 text-sm text-neutral-400">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <span>The Meydan Hotel, Grandstand – 6th Floor, Nad Al Shiba 1, Dubai – UAE</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-red-600 shrink-0" />
                <div className="flex flex-col">
                  <a href={`tel:${BRAND_INFO.phone1}`} className="hover:text-red-500 transition-colors">
                    {BRAND_INFO.phone1}
                  </a>
                  <a href={`tel:${BRAND_INFO.phone2}`} className="hover:text-red-500 transition-colors">
                    {BRAND_INFO.phone2}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-red-600 shrink-0" />
                <a href={`mailto:${BRAND_INFO.email}`} className="hover:text-red-500 transition-colors break-all">
                  {BRAND_INFO.email}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-10 text-xs text-neutral-500 font-mono">
          <div className="text-center md:text-left">
            <span>© 2026 MICE Media LLC FZ. All Rights Reserved.</span>
            <span className="mx-2 hidden md:inline">|</span>
            <span className="text-neutral-600 block md:inline mt-1 md:mt-0">
              Built by <a href="https://thewebbranding.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-red-500 transition-colors">Web Branding</a>
            </span>
          </div>

          <div className="flex items-center gap-6">
            <button 
              onClick={scrollToTop}
              className="bg-neutral-900 border border-white/5 hover:border-red-500/40 hover:bg-neutral-950 p-2.5 rounded-full text-neutral-400 hover:text-white transition-all cursor-pointer flex items-center gap-1.5 group"
            >
              <span className="text-[10px] tracking-wider uppercase font-semibold">Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
