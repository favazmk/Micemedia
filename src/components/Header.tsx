/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ArrowRight, Phone, MessageSquare } from 'lucide-react';
import { BRAND_INFO } from '../data';

interface HeaderProps {
  activePage: string;
  setActivePage: (page: string) => void;
}

export default function Header({ activePage, setActivePage }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Home', value: 'home' },
    { label: 'About', value: 'about' },
    { label: 'Services', value: 'services' },
    { label: 'Portfolio', value: 'portfolio' },
    { label: 'Contact', value: 'contact' },
  ];

  const handleNavClick = (value: string) => {
    setActivePage(value);
    setIsOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header
        id="main-header"
        className={`fixed left-0 right-0 z-50 flex justify-center transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          scrolled ? 'top-4 md:top-6 px-4' : 'top-0 px-0'
        }`}
      >
        <div
          style={{ maxWidth: scrolled ? '1280px' : '100%' }}
          className={`w-full relative transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] flex items-center justify-between ${
            scrolled
              ? 'glass-panel-heavy rounded-full py-3 px-6 md:px-8 shadow-2xl shadow-black/80 border border-white/5'
              : 'glass-panel border-b border-white/10 py-5 px-6 md:px-12 rounded-none'
          }`}
        >

          {/* Brand Logo */}
          <button
            id="brand-logo-btn"
            onClick={() => handleNavClick('home')}
            className="flex flex-col items-start cursor-pointer text-left group"
          >
            <div className="flex flex-col -space-y-1.5">
              <div className="flex items-baseline leading-none">
                <span className="font-display text-2xl md:text-3xl font-black text-red-500 tracking-tighter">M</span>
                <span className="font-display text-xl md:text-2xl font-black tracking-tight text-white">ice</span>
              </div>
              <div className="flex items-center pl-0.5 leading-none">
                <span className="font-display text-[10px] md:text-xs font-bold tracking-[0.22em] text-neutral-400 group-hover:text-red-500 transition-colors uppercase">
                  media
                </span>
              </div>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav id="desktop-nav" className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                id={`nav-${item.value}`}
                key={item.value}
                onClick={() => handleNavClick(item.value)}
                className={`font-sans text-sm font-medium tracking-wide transition-all cursor-pointer nav-link-effect py-1 ${
                  activePage === item.value
                    ? 'text-red-500 active'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Desktop Call to Action */}
          <div className="hidden md:flex items-center gap-4">
            <button
              id="cta-proposal-btn"
              onClick={() => handleNavClick('contact')}
              className="relative overflow-hidden group cursor-pointer bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white font-sans text-xs font-bold uppercase tracking-wider py-3 px-6 rounded-full shadow-lg shadow-red-700/20 hover:shadow-red-600/30 transition-all duration-300 flex items-center gap-2 group border border-red-500/30"
            >
              <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
              Request a Proposal
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Mobile Menu Actions */}
          <div id="mobile-nav-actions" className="flex items-center gap-3 md:hidden">
            <button
              id="mobile-proposal-btn"
              onClick={() => handleNavClick('contact')}
              className="relative overflow-hidden group bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 border border-red-500/30 text-white text-xs font-bold uppercase tracking-wide px-4 py-2.5 rounded-full shadow-md shadow-red-600/20 cursor-pointer"
            >
              <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
              Proposal
            </button>
            <button
              id="mobile-hamburger"
              onClick={() => setIsOpen(!isOpen)}
              className="bg-neutral-900 border border-white/10 p-2.5 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-menu-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-md md:hidden flex flex-col justify-between pt-28 pb-10 px-6"
          >
            {/* Background Spotlights */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
              <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-64 h-64 bg-red-600/10 rounded-full blur-3xl"></div>
            </div>

            <div className="z-10 flex flex-col gap-8">
              <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase border-b border-white/5 pb-2">
                Navigation
              </span>
              <nav className="flex flex-col gap-5">
                {navItems.map((item, index) => (
                  <motion.button
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleNavClick(item.value)}
                    key={item.value}
                    className={`font-display text-2xl font-bold tracking-tight text-left cursor-pointer transition-colors ${
                      activePage === item.value ? 'text-red-500' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    <span className="text-red-600 mr-3 text-sm font-mono font-medium">0{index + 1}.</span>
                    {item.label}
                  </motion.button>
                ))}
              </nav>
            </div>

            <div className="z-10 flex flex-col gap-6 border-t border-white/5 pt-6">
              <div className="flex flex-col gap-1.5 text-neutral-400 text-xs font-mono">
                <span>The Meydan Hotel, 6th Floor, Dubai</span>
                <a href={`mailto:${BRAND_INFO.email}`} className="text-red-400 hover:underline">
                  {BRAND_INFO.email}
                </a>
                <a href={`tel:${BRAND_INFO.phone1}`} className="hover:text-white transition-colors">
                  {BRAND_INFO.phone1}
                </a>
              </div>
              <div className="flex items-center gap-1.5 text-neutral-500 text-[10px] font-mono">
                <span>© 2026 MICE Media LLC FZ</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
