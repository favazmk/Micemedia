/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Presentation, 
  Award, 
  Sparkles, 
  Volume2, 
  Palette, 
  Compass, 
  Users, 
  Music, 
  Layers, 
  Check, 
  Lightbulb
} from 'lucide-react';
import Particles from './Particles';
import { SERVICES_DATA } from '../data';
import { PrimaryButton } from '@/components/ui/primary-button';

interface ServicesProps {
  selectedServiceId: string | null;
  setSelectedServiceId: (id: string | null) => void;
  setActivePage: (page: string) => void;
}

export default function Services({ selectedServiceId, setSelectedServiceId, setActivePage }: ServicesProps) {

  // Map icon name to Lucide Component
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Presentation': return <Presentation className="w-5 h-5 md:w-6 md:h-6" />;
      case 'Award': return <Award className="w-5 h-5 md:w-6 md:h-6" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5 md:w-6 md:h-6" />;
      case 'Volume2': return <Volume2 className="w-5 h-5 md:w-6 md:h-6" />;
      case 'Palette': return <Palette className="w-5 h-5 md:w-6 md:h-6" />;
      case 'Compass': return <Compass className="w-5 h-5 md:w-6 md:h-6" />;
      case 'Users2': return <Users className="w-5 h-5 md:w-6 md:h-6" />;
      case 'Music': return <Music className="w-5 h-5 md:w-6 md:h-6" />;
      case 'Layers': return <Layers className="w-5 h-5 md:w-6 md:h-6" />;
      default: return <Sparkles className="w-5 h-5 md:w-6 md:h-6" />;
    }
  };

  // Scroll to deep-linked service on mount
  useEffect(() => {
    if (selectedServiceId) {
      setTimeout(() => {
        const isMobile = window.innerWidth < 1024;
        const elId = isMobile ? `service-mobile-${selectedServiceId}` : `service-text-${selectedServiceId}`;
        const el = document.getElementById(elId);
        if (el) {
          // Adjust scroll position to account for the sticky header
          const yOffset = -100; 
          const y = el.getBoundingClientRect().top + window.scrollY + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 100);
    }
    // Only run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update selectedServiceId (and URL) as user scrolls through text blocks
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.3) {
            const id = entry.target.id.replace('service-text-', '').replace('service-mobile-', '');
            // Only update if it's actually changing to avoid endless state loops
            if (id !== selectedServiceId) {
              setSelectedServiceId(id);
            }
          }
        });
      },
      { threshold: 0.3 }
    );

    SERVICES_DATA.forEach(srv => {
      const elDesktop = document.getElementById(`service-text-${srv.id}`);
      if (elDesktop) observer.observe(elDesktop);
      const elMobile = document.getElementById(`service-mobile-${srv.id}`);
      if (elMobile) observer.observe(elMobile);
    });

    return () => observer.disconnect();
  }, [selectedServiceId, setSelectedServiceId]);

  return (
    <div className="flex flex-col w-full relative min-h-screen" id="servicespage-root">
      
      {/* ── Particles animated WebGL background ── */}
      <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
        <div className="sticky top-0 left-0 w-full h-screen">
          <Particles
            particleColors={['#ff4d6d', '#e63946', '#800c0c']}
            particleCount={150}
            particleSpread={12}
            speed={0.1}
            particleBaseSize={100}
            moveParticlesOnHover={true}
            particleHoverFactor={1.5}
            alphaParticles={true}
            cameraDistance={35}
          />
        </div>
      </div>

      <div className="relative z-10 flex flex-col w-full">
        {/* SECTION 1: SERVICES HEADER */}
        <section className="relative px-6 max-w-7xl mx-auto w-full text-center pt-32 pb-8 md:pb-16">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-red-650/10 rounded-full blur-3xl pointer-events-none"></div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neutral-905 border border-white/5 backdrop-blur-md mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-650"></span>
            <span className="font-mono text-[10px] tracking-widest uppercase text-neutral-400">
              What We Do
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl md:text-6xl font-black uppercase text-white tracking-tight"
          >
            Every Event. <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-400 text-glow inline-block py-1">Every Scale. Every Detail.</span>
          </motion.h1>
          
          <p className="text-neutral-400 font-sans text-sm md:text-base leading-relaxed mt-4 max-w-xl mx-auto">
            Nine disciplines. Operating under one relentless, uncompromising standard of design and mechanical excellence.
          </p>
          
          <div className="w-12 h-[2px] bg-red-650 mx-auto mt-6 rounded-full"></div>
        </section>

        {/* SECTION 2: SPLIT STACKING LAYOUT */}
        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 pb-32">
          
          {/* Desktop Layout: Split Columns */}
          <div className="hidden lg:flex w-full relative items-start gap-16">
            
            {/* Left Column: Normal Scrolling Text */}
            <div className="w-5/12 flex flex-col relative z-10">
              {SERVICES_DATA.map((srv) => (
                <div 
                  key={`text-${srv.id}`} 
                  id={`service-text-${srv.id}`}
                  className="flex flex-col justify-center py-12 border-b border-white/5 last:border-0"
                  style={{ height: '120vh' }}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-red-500 shadow-xl shrink-0">
                      {getIcon(srv.iconName)}
                    </div>
                    <div>
                      <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-red-500">
                        DISCIPLINE EXECUTIVE {srv.number}
                      </span>
                      <h2 className="font-display text-2xl sm:text-3xl font-black text-white mt-1 uppercase">
                        {srv.title}
                      </h2>
                    </div>
                  </div>

                  <p className="text-neutral-300 text-sm sm:text-base leading-relaxed mb-6 max-w-xl">
                    {srv.description}
                  </p>

                  {/* Speciality deliverables */}
                  <div className="mb-6">
                    <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block mb-3">
                      Core Execution Services Include:
                    </span>
                    <div className="flex flex-col gap-2">
                      {srv.details?.slice(0, 4).map((del: string, i: number) => (
                        <div key={i} className="flex items-start gap-3 bg-black/40 backdrop-blur-sm border border-white/5 p-3 rounded-xl hover:border-red-500/20 transition-colors">
                          <div className="w-4 h-4 rounded bg-red-600/10 border border-red-600/20 flex items-center justify-center text-red-500 shrink-0 mt-0.5">
                            <Check className="w-3 h-3" />
                          </div>
                          <span className="text-xs sm:text-sm text-neutral-200 font-sans font-medium">
                            {del}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* General Service Pitch Panel */}
                  <div className="border-t border-white/10 pt-4 mt-2">
                    <div className="bg-black/40 backdrop-blur-md p-5 rounded-2xl border border-white/5 flex flex-col gap-4">
                      <div>
                        <h4 className="font-display text-sm font-bold text-white mb-1 flex items-center gap-2">
                          <Lightbulb className="w-4 h-4 text-red-500" />
                          Premium Dubai Delivery Included
                        </h4>
                        <p className="text-neutral-400 text-xs leading-relaxed">
                          Every single detail of our {srv.title} operations is handled in-house with standard dwg schematics, direct regional permits, and redundant executive back-ups.
                        </p>
                      </div>
                      <PrimaryButton
                        onClick={() => {
                          setActivePage('contact');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        text="Enquire for this"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column: Stacking Images */}
            <div className="w-7/12 relative h-full flex flex-col">
              {SERVICES_DATA.map((srv) => (
                <div 
                  key={`img-${srv.id}`} 
                  className="sticky top-0 w-full flex items-center justify-center"
                  style={{ height: '120vh' }}
                >
                  {/* Massive Image Card (Centered, full height at 85vh) */}
                  <div className="group relative w-full h-[85vh] rounded-[3rem] overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] bg-[#0a0a0a] transition-all duration-700 ease-out hover:[transform:perspective(1500px)_rotateX(2.5deg)_rotateY(-2.5deg)_scale(1.015)] hover:shadow-[0_30px_60px_rgba(239,68,68,0.15)] hover:border-red-500/20">
                    <img 
                      src={srv.image} 
                      alt={srv.title} 
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Mobile Layout: Regular Stacking Cards (Since split column is impossible on small screens) */}
          <div className="flex lg:hidden flex-col gap-12 w-full mt-8">
            {SERVICES_DATA.map((srv) => (
              <div key={`mobile-${srv.id}`} id={`service-mobile-${srv.id}`} className="w-full flex flex-col">
                {/* Image top (3:2 aspect ratio) */}
                <div 
                  className="relative w-full rounded-[2rem] overflow-hidden border border-white/10 shadow-xl mb-6 bg-black aspect-[3/2]"
                  style={{ aspectRatio: '3/2' }}
                >
                  <img src={srv.image} alt={srv.title} className="absolute inset-0 w-full h-full object-cover" />
                </div>
                
                {/* Text Bottom */}
                <div className="flex flex-col">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-neutral-900 border border-white/10 flex items-center justify-center text-red-500 shadow-xl shrink-0">
                      {getIcon(srv.iconName)}
                    </div>
                    <div>
                      <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-red-500">
                        DISCIPLINE {srv.number}
                      </span>
                      <h2 className="font-display text-2xl font-black text-white mt-1 uppercase">
                        {srv.title}
                      </h2>
                    </div>
                  </div>

                  <p className="text-neutral-300 text-sm leading-relaxed mb-6">
                    {srv.description}
                  </p>

                  <div className="mb-8">
                    <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block mb-3">
                      Core Services:
                    </span>
                    <div className="flex flex-col gap-2">
                      {srv.details?.map((del: string, i: number) => (
                        <div key={i} className="flex items-start gap-3 bg-neutral-900/50 border border-white/5 p-3 rounded-xl">
                          <div className="w-4 h-4 rounded bg-red-600/10 border border-red-600/20 flex items-center justify-center text-red-500 shrink-0 mt-0.5">
                            <Check className="w-3 h-3" />
                          </div>
                          <span className="text-xs text-neutral-300 font-sans">
                            {del}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <PrimaryButton
                    onClick={() => {
                      setActivePage('contact');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    text="Enquire for this"
                    className="w-full justify-center"
                  />
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}