/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight, Filter, X, SlidersHorizontal, Image, Sparkles, MapPin, Calendar, HelpCircle, ArrowRight } from 'lucide-react';
import { PORTFOLIO_DATA } from '../data';
import { PortfolioItem } from '../types';

interface PortfolioProps {
  selectedPortfolioId: string | null;
  setSelectedPortfolioId: (id: string | null) => void;
  setActivePage: (page: string) => void;
}

export default function Portfolio({ selectedPortfolioId, setSelectedPortfolioId, setActivePage }: PortfolioProps) {
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);

  // Handle deep linking from other page interactions
  useEffect(() => {
    if (selectedPortfolioId) {
      const match = PORTFOLIO_DATA.find(item => item.id === selectedPortfolioId);
      if (match) {
        setSelectedItem(match);
      }
      setSelectedPortfolioId(null);
    }
  }, [selectedPortfolioId, setSelectedPortfolioId]);

  const filters = ['All', 'Conference', 'Exhibition', 'Corporate', 'Team Building', 'Private'];

  const filteredItems = activeFilter === 'All'
    ? PORTFOLIO_DATA
    : PORTFOLIO_DATA.filter(item => item.category.toLowerCase().includes(activeFilter.toLowerCase()) || 
                                    (activeFilter === 'Corporate' && item.category === 'Corporate Event' || item.category === 'Corporate Hospitality'));

  return (
    <div className="py-24 md:py-32 flex flex-col w-full" id="portfoliopage-root">
      
      {/* SECTION 1: PORTFOLIO HERO HEADER */}
      <section className="relative px-6 max-w-7xl mx-auto w-full mb-16 text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-red-650/10 rounded-full blur-3xl pointer-events-none"></div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neutral-905 border border-white/5 backdrop-blur-md mb-6"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-red-650 animate-pulse"></span>
          <span className="font-mono text-[10px] tracking-widest uppercase text-neutral-400">
            Our Portfolio
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-display text-4xl sm:text-5xl md:text-6xl font-black uppercase text-white tracking-tight"
        >
          Events That Speak <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-600 to-amber-500 text-glow inline-block py-1">For Themselves.</span>
        </motion.h1>
        
        <p className="text-neutral-400 font-sans text-sm md:text-base leading-relaxed mt-4 max-w-xl mx-auto">
          We bridge bold experiential strategy with flawless technical staging across Dubai and the larger GCC.
        </p>

        <div className="w-12 h-[2px] bg-red-650 mx-auto mt-6 rounded-full"></div>
      </section>

      {/* SECTION 2: CATEGORY FILTER BAR */}
      <section className="px-6 max-w-7xl mx-auto w-full mb-12 flex flex-wrap justify-center items-center gap-2.5" id="portfolio-filters">
        <div className="flex items-center gap-2 mr-3 bg-neutral-900 border border-white/5 px-4.5 py-2 rounded-full text-neutral-400 text-xs font-mono font-medium">
          <Filter className="w-3.5 h-3.5 text-red-600" />
          <span>FILTER WORK:</span>
        </div>
        
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-6 py-2.5 rounded-full font-sans text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer border ${
              activeFilter === filter
                ? 'bg-red-655 border-red-500 text-white shadow-lg shadow-red-700/20 shadow-red-950/20'
                : 'bg-neutral-950/40 border-white/5 text-neutral-400 hover:text-white hover:bg-neutral-900/40 hover:border-white/10'
            }`}
          >
            {filter}
          </button>
        ))}
      </section>

      {/* SECTION 3: FILTERED MASONRY-GRID OF CASE STUDIES */}
      <section className="px-6 max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6.5 min-h-[400px]" id="portfolio-case-grid">
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.35 }}
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="group cursor-pointer bg-neutral-900/60 rounded-3xl overflow-hidden border border-white/5 hover:border-red-500/20 transition-all duration-300 flex flex-col justify-between"
            >
              {/* Asset Frame wrapper */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-950">
                {/* Overlay vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/10 to-transparent z-10 opacity-70 group-hover:opacity-40 transition-opacity"></div>
                
                <img
                  src={item.image}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />

                {/* Accent mini tags */}
                <span className="absolute top-4 left-4 z-20 px-3.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase bg-neutral-950/80 border border-white/5 text-neutral-300">
                  {item.category}
                </span>

                <div className="absolute bottom-4 right-4 z-20 bg-red-600 p-2 rounded-xl text-white shadow-xl translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>

              {/* Text metadata bottom block */}
              <div className="p-6">
                <span className="text-[10px] font-mono tracking-widest text-red-500 font-bold uppercase mb-1.5 block">
                  {item.tag}
                </span>
                <h3 className="font-display text-lg font-bold text-white group-hover:text-red-500 transition-colors duration-305 leading-snug">
                  {item.title}
                </h3>
                <p className="text-neutral-400 text-xs font-sans mt-2 line-clamp-2 leading-relaxed">
                  {item.caption}
                </p>
                
                <div className="mt-4 pt-4 border-t border-white/[0.04] flex justify-between items-center text-[10px] font-mono text-neutral-500">
                  <span>✦ VIEW CASE DEBRIEF</span>
                  <span>GCC STANDARDS</span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </section>

      {/* LIGHTBOX STAGE MODAL FOR SINGLE ITEM VIEW */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
            id="portfolio-lightbox"
          >
            {/* Click to close backdrop handler */}
            <div className="absolute inset-0 z-0 cursor-zoom-out" onClick={() => setSelectedItem(null)}></div>

            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 180 }}
              className="bg-neutral-950 border border-white/10 rounded-3xl overflow-hidden max-w-4xl w-full max-h-[90vh] overflow-y-auto relative z-10 flex flex-col md:grid md:grid-cols-12 shadow-2xl shadow-black"
            >
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 z-30 bg-black/80 border border-white/10 p-2 rounded-full text-neutral-400 hover:text-white transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Left Column: Big Image display Frame */}
              <div className="md:col-span-7 bg-black aspect-video md:aspect-auto md:h-full relative overflow-hidden">
                <img
                  src={selectedItem.image}
                  alt={selectedItem.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Right Column: Case study details info */}
              <div className="md:col-span-5 p-6 md:p-8 flex flex-col justify-between bg-neutral-950">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-red-600 text-white text-[9px] font-mono px-3 py-1 rounded-full uppercase tracking-wider font-extrabold">
                      {selectedItem.category}
                    </span>
                    <span className="bg-neutral-900 border border-white/5 text-neutral-450 text-[9px] font-mono px-2.5 py-1 rounded-full uppercase">
                      {selectedItem.tag}
                    </span>
                  </div>

                  <h2 className="font-display text-xl md:text-2xl font-black text-white leading-tight uppercase mt-2">
                    {selectedItem.title}
                  </h2>

                  <div className="w-10 h-[2px] bg-red-650 rounded-full"></div>

                  <p className="text-neutral-300 text-sm leading-relaxed font-sans mt-2">
                    {selectedItem.caption}
                  </p>

                  {/* Fact sheet list */}
                  <div className="bg-neutral-900/60 p-4 rounded-2xl border border-white/5 flex flex-col gap-2.5 mt-2">
                    <div className="flex items-center gap-3 text-xs text-neutral-400">
                      <MapPin className="w-4 h-4 text-red-500 shrink-0" />
                      <span>Staging Hub: <b>Dubai, UAE</b></span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-neutral-400">
                      <Calendar className="w-4 h-4 text-red-500 shrink-0" />
                      <span>Assigned Timelines: <b>2024 Staging</b></span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-neutral-400">
                      <Sparkles className="w-4 h-4 text-red-500 shrink-0" />
                      <span>Production quality: <b>End-to-End VIP</b></span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/5 flex flex-col gap-3">
                  <span className="text-[9px] font-mono text-neutral-500 block uppercase">
                    Interested in similar Staging?
                  </span>
                  <button
                    onClick={() => {
                      setSelectedItem(null);
                      setActivePage('contact');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="relative overflow-hidden group w-full bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 border border-red-500/30 text-white font-sans text-xs font-bold uppercase tracking-wider py-3 px-6 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 group shadow-lg shadow-red-700/10 hover:shadow-red-600/20"
                  >
                    <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
                    Discuss Similar Project
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
