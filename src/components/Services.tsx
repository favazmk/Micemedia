/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  ArrowRight, 
  Check, 
  Volume,
  Lightbulb,
  TreePine,
  Sliders,
  DollarSign,
  ChevronDown
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
  const [activeTab, setActiveTab] = useState<string>('conferences-seminars');

  // Handle cross-page deep linking
  useEffect(() => {
    if (selectedServiceId) {
      setActiveTab(selectedServiceId);
      // Clean up the deep-linked ID state after applying
      setSelectedServiceId(null);
    }
  }, [selectedServiceId, setSelectedServiceId]);

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

  const selectedService = SERVICES_DATA.find(s => s.id === activeTab) || SERVICES_DATA[0];

  const renderServiceContent = (srv: any) => (
    <div className="glass-panel-heavy rounded-3xl p-6 md:p-10 border border-white/5 relative overflow-hidden h-full">
      {/* Absolute background spotlight glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-red-650/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="flex items-center justify-between mb-8.5 border-b border-white/5 pb-6">
        <div>
          <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-red-500">
            DISCIPLINE EXECUTIVE {srv.number}
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-black text-white mt-1.5 uppercase">
            {srv.title}
          </h2>
        </div>
        <div className="w-14 h-14 rounded-2xl bg-neutral-900 border border-white/10 flex items-center justify-center text-red-500 shadow-xl shrink-0 ml-4">
          {getIcon(srv.iconName)}
        </div>
      </div>

      <p className="text-neutral-300 text-sm md:text-base leading-relaxed mb-8">
        {srv.description}
      </p>

      {/* Speciality deliverables */}
      <div className="mb-10">
        <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block mb-4.5">
          Core Execution Services Include:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {srv.details?.map((del: string, i: number) => (
            <div key={i} className="flex items-start gap-3 bg-neutral-900/40 border border-white/5 p-3 rounded-xl hover:border-red-500/10 transition-colors">
              <div className="w-5 h-5 rounded bg-red-600/10 border border-red-600/20 flex items-center justify-center text-red-500 shrink-0 mt-0.5">
                <Check className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs md:text-sm text-neutral-300 font-sans font-medium">
                {del}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* General Service Pitch Panel */}
      <div className="border-t border-white/5 pt-8 mt-4.5">
        <div className="bg-neutral-950 p-6 rounded-2xl border border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div>
            <h4 className="font-display text-sm font-bold text-white mb-1 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-red-500" />
              Premium Dubai Delivery Included
            </h4>
            <p className="text-neutral-400 text-xs leading-relaxed max-w-md">
              Every single detail of our {srv.title} operations is handled in-house with standard dwg schematics, direct regional permits, and redundant executive back-ups.
            </p>
          </div>
          <PrimaryButton
            onClick={() => setActivePage('contact')}
            text="Enquire for this"
          />
        </div>
      </div>

      {/* Back out button */}
      <div className="mt-8 pt-6 border-t border-white/5 flex gap-4">
        <PrimaryButton
          onClick={() => {
            setActivePage('contact');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          text="Custom Proposal Brief"
        />
      </div>
    </div>
  );



  return (
    <div className="py-24 md:py-32 flex flex-col w-full relative min-h-screen" id="servicespage-root">
      
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
      {/* SECTION 1: SERVICES HEADER */}
      <section className="relative px-6 max-w-7xl mx-auto w-full mb-16 text-center">
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
          Every Event. <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-600 to-amber-500 text-glow inline-block py-1">Every Scale. Every Detail.</span>
        </motion.h1>
        
        <p className="text-neutral-400 font-sans text-sm md:text-base leading-relaxed mt-4 max-w-xl mx-auto">
          Nine disciplines. Operating under one relentless, uncompromising standard of design and mechanical excellence.
        </p>
        
        <div className="w-12 h-[2px] bg-red-650 mx-auto mt-6 rounded-full"></div>
      </section>



      {/* SECTION 2: DYNAMIC MASTER-DETAIL SPLIT PANEL */}
      <section className="px-6 max-w-7xl mx-auto w-full mb-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: 9 Disciplines Master List Selector */}
        <div className="lg:col-span-4 flex flex-col gap-2.5" id="services-master-list">
          <span className="text-[10px] font-mono tracking-widest text-neutral-600 uppercase mb-2 border-b border-white/5 pb-2">
            Select Speciality
          </span>
          {SERVICES_DATA.map((srv) => (
            <div key={srv.id} className="flex flex-col">
              <button
                id={`service-tab-${srv.id}`}
                onClick={() => {
                  // Toggle on mobile, just set active on desktop
                  if (window.innerWidth < 1024) {
                    setActiveTab(activeTab === srv.id ? '' : srv.id);
                    if (activeTab !== srv.id) {
                      setTimeout(() => {
                        const el = document.getElementById(`service-tab-${srv.id}`);
                        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }, 100);
                    }
                  } else {
                    setActiveTab(srv.id);
                  }
                }}
                className={`w-full py-4.5 px-6 rounded-2xl flex items-center justify-between transition-all duration-300 text-left border cursor-pointer ${
                  activeTab === srv.id
                    ? 'bg-neutral-900 border-red-500/30 shadow-lg shadow-red-950/20 text-white'
                    : 'bg-neutral-950/40 border-white/5 hover:border-white/10 text-neutral-400 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className={`font-mono text-xs ${activeTab === srv.id ? 'text-red-500' : 'text-neutral-600'}`}>
                    {srv.number}
                  </span>
                  <div className={`p-1.5 rounded-lg border transition-colors ${
                    activeTab === srv.id 
                      ? 'bg-red-600 border-red-500 text-white' 
                      : 'bg-neutral-900 border-white/5 text-neutral-500'
                  }`}>
                    {getIcon(srv.iconName === 'Users2' ? 'Users2' : srv.iconName)}
                  </div>
                  <span className="font-display font-bold text-sm tracking-tight">
                    {srv.title}
                  </span>
                </div>
                <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${activeTab === srv.id ? 'rotate-180 text-red-500 lg:-rotate-90' : 'text-neutral-500 lg:-rotate-90'}`} />
              </button>

              {/* MOBILE ACCORDION CONTENT */}
              <AnimatePresence initial={false}>
                {activeTab === srv.id && (
                  <motion.div
                    key={`content-${srv.id}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="lg:hidden overflow-hidden"
                  >
                    <div className="pt-3 pb-2">
                      {renderServiceContent(srv)}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Right Side: Detailed View Container (DESKTOP ONLY) */}
        <div className="hidden lg:block lg:col-span-8 lg:sticky lg:top-32" id="selected-service-content">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedService.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              {renderServiceContent(selectedService)}
            </motion.div>
          </AnimatePresence>
        </div>

      </section>

      </div>
    </div>
  );
}
