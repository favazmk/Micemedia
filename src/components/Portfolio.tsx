/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MapPin, Calendar, Sparkles } from 'lucide-react';
import { PORTFOLIO_DATA } from '../data';
import { PortfolioItem } from '../types';
import { PrimaryButton } from '@/components/ui/primary-button';
import ChromaGrid, { ChromaItem } from './ChromaGrid';
import Particles from './Particles';

interface PortfolioProps {
  selectedPortfolioId: string | null;
  setSelectedPortfolioId: (id: string | null) => void;
  setActivePage: (page: string) => void;
}

export default function Portfolio({ selectedPortfolioId, setSelectedPortfolioId, setActivePage }: PortfolioProps) {
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);

  // Handle deep linking from other page interactions
  useEffect(() => {
    if (selectedPortfolioId) {
      const match = PORTFOLIO_DATA.find(item => item.id === selectedPortfolioId);
      if (match) setSelectedItem(match);
      setSelectedPortfolioId(null);
    }
  }, [selectedPortfolioId, setSelectedPortfolioId]);

  const filteredItems = PORTFOLIO_DATA;

  return (
    <div className="py-24 md:py-32 flex flex-col w-full relative min-h-screen" id="portfoliopage-root">
      
      {/* ── Particles animated WebGL background ── */}
      <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
        <div className="sticky top-0 left-0 w-full h-screen">
          <Particles
            particleColors={['#ff4d6d', '#e63946', '#800c0c']}
            particleCount={300}
            particleSpread={12}
            speed={0.1}
            particleBaseSize={100}
            moveParticlesOnHover={true}
            particleHoverFactor={1.5}
            alphaParticles={true}
            cameraDistance={25}
          />
        </div>
      </div>

      <div className="relative z-10 flex flex-col w-full">
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

      {/* SECTION 2: CHROMAGRID */}
      <section className="px-6 max-w-7xl mx-auto w-full mb-16" id="portfolio-chroma-grid">
        <ChromaGrid
          items={filteredItems.map((item): ChromaItem => ({
            image: item.image,
            title: item.title,
            subtitle: item.caption,
            handle: item.tag,
            tag: item.category,
            borderColor: '#dc4d49',
            gradient: 'linear-gradient(145deg, #1a0a0a, #0a0a0a)',
          }))}
          radius={340}
          damping={0.5}
          fadeOut={0.8}
          ease="power3.out"
          onCardClick={(chromaItem) => {
            const match = PORTFOLIO_DATA.find(p => p.title === chromaItem.title);
            if (match) setSelectedItem(match);
          }}
        />
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
                  <PrimaryButton
                    onClick={() => {
                      setSelectedItem(null);
                      setActivePage('contact');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    text="Discuss Similar Project"
                    className="w-full"
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      </div>
    </div>
  );
}
