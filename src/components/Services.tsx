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
  DollarSign
} from 'lucide-react';
import { SERVICES_DATA } from '../data';

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

  // Interactive AV Companion State
  const [avVolume, setAvVolume] = useState<number>(75);
  const [avLighting, setAvLighting] = useState<string>('Crimson Fire');
  const [avScreen, setAvScreen] = useState<string>('Dynamic Video');

  // Interactive Exhibition Companion State
  const [exBuildType, setExBuildType] = useState<string>('Custom Double-Decker');
  const [exSustainOption, setExSustainOption] = useState<boolean>(true);
  const [exAreaSize, setExAreaSize] = useState<number>(36); // sqm

  return (
    <div className="py-24 md:py-32 flex flex-col w-full" id="servicespage-root">
      
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

      {/* SECTION 3: CORE GRID TO INTRODUCE REMAINING 6 SERVICES SNEAK PEEK */}
      <section className="px-6 max-w-7xl mx-auto w-full mb-24">
        <span className="text-[10px] font-mono tracking-widest text-neutral-600 uppercase mb-6 block border-b border-white/5 pb-2">
          Speciality Matrix (Grid Overview)
        </span>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="services-grid-all">
          {SERVICES_DATA.map((srv) => (
            <div
              key={`grid-${srv.id}`}
              onClick={() => {
                setActiveTab(srv.id);
                const el = document.getElementById('selected-service-content');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
              }}
              className={`p-6 rounded-2xl border transition-all duration-350 cursor-pointer flex flex-col justify-between min-h-[220px] group ${
                activeTab === srv.id
                  ? 'bg-neutral-900 border-red-500/40 shadow-md ring-1 ring-red-500/10'
                  : 'bg-neutral-950/40 border-white/5 hover:border-white/10 hover:bg-neutral-900/10'
              }`}
            >
              <div>
                <div className="flex justify-between items-center mb-6">
                  <span className={`font-mono text-xs ${activeTab === srv.id ? 'text-red-500' : 'text-neutral-600'}`}>
                    DISCIPLINE {srv.number}
                  </span>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-colors ${
                    activeTab === srv.id 
                      ? 'bg-red-655 border-red-500 text-white' 
                      : 'bg-neutral-900 border-white/10 text-neutral-400 group-hover:text-red-500'
                  }`}>
                    {getIcon(srv.iconName)}
                  </div>
                </div>
                <h3 className="font-display font-bold text-base text-white group-hover:text-red-500 transition-colors uppercase">
                  {srv.title}
                </h3>
                <p className="text-neutral-400 text-xs mt-2 line-clamp-3 leading-relaxed">
                  {srv.description}
                </p>
              </div>

              <div className="pt-4 border-t border-white/5 mt-4 flex items-center justify-between text-[10px] font-mono text-neutral-500">
                <span>✦ SEAMLESS INTEGRATION</span>
                <span className="text-red-500 group-hover:underline">Focus Speciality</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 2: DYNAMIC MASTER-DETAIL SPLIT PANEL */}
      <section className="px-6 max-w-7xl mx-auto w-full mb-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: 9 Disciplines Master List Selector */}
        <div className="lg:col-span-4 flex flex-col gap-2.5" id="services-master-list">
          <span className="text-[10px] font-mono tracking-widest text-neutral-600 uppercase mb-2 border-b border-white/5 pb-2">
            Select Speciality
          </span>
          {SERVICES_DATA.map((srv) => (
            <button
              id={`service-tab-${srv.id}`}
              key={srv.id}
              onClick={() => {
                setActiveTab(srv.id);
                const el = document.getElementById('selected-service-content');
                if (el && window.innerWidth < 1024) {
                  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
                <span className="font-display font-bold text-sm tracking-tight">
                  {srv.title}
                </span>
              </div>
              <div className={`p-1.5 rounded-lg border transition-colors ${
                activeTab === srv.id 
                  ? 'bg-red-600 border-red-500 text-white' 
                  : 'bg-neutral-900 border-white/5 text-neutral-500'
              }`}>
                {getIcon(srv.iconName === 'Users2' ? 'Users2' : srv.iconName)}
              </div>
            </button>
          ))}
        </div>

        {/* Right Side: Detailed View Container */}
        <div className="lg:col-span-8 lg:sticky lg:top-32" id="selected-service-content">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedService.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="glass-panel-heavy rounded-3xl p-8 md:p-10 border border-white/5 relative overflow-hidden"
            >
              {/* Absolute background spotlight glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-red-650/10 rounded-full blur-[100px] pointer-events-none"></div>

              <div className="flex items-center justify-between mb-8.5 border-b border-white/5 pb-6">
                <div>
                  <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-red-500">
                    DISCIPLINE EXECUTIVE {selectedService.number}
                  </span>
                  <h2 className="font-display text-2xl sm:text-3xl font-black text-white mt-1.5 uppercase">
                    {selectedService.title}
                  </h2>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-neutral-900 border border-white/10 flex items-center justify-center text-red-500 shadow-xl">
                  {getIcon(selectedService.iconName)}
                </div>
              </div>

              <p className="text-neutral-300 text-sm md:text-base leading-relaxed mb-8">
                {selectedService.description}
              </p>

              {/* Speciality deliverables */}
              <div className="mb-10">
                <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block mb-4.5">
                  Core Execution Services Include:
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {selectedService.details?.map((del, i) => (
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

              {/* CUSTOM CORE INTERACTIVE COMPANION WIDGET ASSCOIATED */}
              <div className="border-t border-white/5 pt-8 mt-4.5">
                
                {/* CASE 1: Audio Visual Production Simulator */}
                {selectedService.id === 'audio-visual-production' && (
                  <div className="bg-neutral-950 p-6 rounded-2xl border border-red-500/10 relative" id="av-simulator-widget">
                    <span className="absolute top-4 right-4 bg-red-600/10 text-red-400 border border-red-500/20 text-[9px] font-mono px-2 py-0.5 rounded-full uppercase tracking-widest">
                      Live Tech Monitor
                    </span>
                    <h4 className="font-display text-sm font-bold text-white mb-4 flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-red-500" />
                      AV Set Configuration Preview
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      
                      {/* Control 1 */}
                      <div className="flex flex-col gap-2">
                        <span className="text-[10px] font-mono text-neutral-500">PA Sound (dB): <b className="text-white">{avVolume} dB</b></span>
                        <input 
                          type="range" 
                          min="40" 
                          max="120" 
                          value={avVolume} 
                          onChange={(e) => setAvVolume(Number(e.target.value))}
                          className="w-full cursor-pointer accent-red-600" 
                        />
                        <span className="text-[9px] font-mono text-neutral-600">
                          {avVolume > 100 ? '⚠️ High Intensity Zone' : avVolume > 70 ? 'Optimal Ball Room' : 'Delicate Boardroom'}
                        </span>
                      </div>

                      {/* Control 2 */}
                      <div className="flex flex-col gap-2">
                        <span className="text-[10px] font-mono text-neutral-500">Stage Lighting Aura</span>
                        <div className="flex gap-1">
                          {['Crimson Fire', 'Golden Luxe', 'Muted Cosmic'].map((aura) => (
                            <button
                              key={aura}
                              onClick={() => setAvLighting(aura)}
                              className={`text-[9px] font-mono px-2 py-1 rounded cursor-pointer border ${
                                avLighting === aura 
                                  ? 'bg-red-600 border-red-500 text-white' 
                                  : 'bg-neutral-900 border-white/5 text-neutral-400'
                              }`}
                            >
                              {aura.split(' ')[0]}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Control 3 */}
                      <div className="flex flex-col gap-2">
                        <span className="text-[10px] font-mono text-neutral-500">LED Media Wall feed</span>
                        <select 
                          value={avScreen} 
                          onChange={(e) => setAvScreen(e.target.value)}
                          className="bg-neutral-900 border border-white/5 text-xs text-white p-1 rounded font-mono outline-hidden cursor-pointer"
                        >
                          <option value="Dynamic Video">3D Kinetic Loop</option>
                          <option value="Live Broadcast">Camera Multi-feed</option>
                          <option value="Sleek Branding">Corporate Identity</option>
                        </select>
                      </div>

                    </div>

                    {/* Integrated Stage Mockup Box */}
                    <div className="mt-6 aspect-[16/6] bg-[#0c0c0c] border border-white/5 rounded-xl relative overflow-hidden flex flex-col justify-between p-4 shadow-inner">
                      {/* Simulate color aura based on states */}
                      <div className={`absolute inset-x-0 top-0 h-10 w-full transition-all duration-300 pointer-events-none opacity-40 blur-md ${
                        avLighting === 'Crimson Fire' ? 'bg-red-600/30' : avLighting === 'Golden Luxe' ? 'bg-amber-500/30' : 'bg-red-800/30'
                      }`}></div>

                      <div className="flex justify-between items-center z-10">
                        <span className="text-[8px] font-mono text-neutral-500">LED MAIN: <b className="text-neutral-300">{avScreen}</b></span>
                        <div className="flex gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                          <span className="text-[8px] font-mono text-green-500">SYSTEM ON AIR</span>
                        </div>
                      </div>

                      {/* Rigged PA boxes */}
                      <div className="flex justify-between items-end z-10 h-full mt-4">
                        <div className="w-5 h-10 bg-neutral-900 border border-white/10 rounded flex flex-col justify-around p-1">
                          <div className={`w-full h-1 bg-red-600 ${avVolume > 85 ? 'animate-pulse' : ''}`}></div>
                          <div className={`w-full h-1 bg-neutral-750`}></div>
                        </div>
                        
                        {/* Simulation Screen Banner */}
                        <div className="w-4/5 h-12 border border-white/15 bg-neutral-905 rounded-md flex items-center justify-center relative overflow-hidden">
                          <span className="text-[9px] font-mono text-neutral-300">
                            {avScreen === 'Dynamic Video' ? '✦ KINETIC MOTION ACTIVE ✦' : avScreen === 'Live Broadcast' ? '🎥 REC LIVE FEED 01' : 'MICE MEDIA LOGO LOOP'}
                          </span>
                        </div>

                        <div className="w-5 h-10 bg-neutral-900 border border-white/10 rounded flex flex-col justify-around p-1">
                          <div className={`w-full h-1 bg-red-655 ${avVolume > 85 ? 'animate-pulse' : ''}`}></div>
                          <div className={`w-full h-1 bg-neutral-750`}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* CASE 2: Exhibitions Pavilions Setup */}
                {selectedService.id === 'exhibitions' && (
                  <div className="bg-neutral-950 p-6 rounded-2xl border border-white/5 relative" id="ex-build-widget">
                    <span className="absolute top-4 right-4 bg-red-600/10 text-red-400 border border-red-500/20 text-[9px] font-mono px-2 py-0.5 rounded-full uppercase">
                      Joinery Estimator
                    </span>
                    <h4 className="font-display text-sm font-bold text-white mb-4 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-red-500" />
                      Custom Exhibition Booth Configurator
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-4">
                      
                      {/* Option 1 */}
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[10px] font-mono text-neutral-500">Fabrication Tier</span>
                        <select 
                          value={exBuildType}
                          onChange={(e) => setExBuildType(e.target.value)}
                          className="bg-neutral-900 border border-white/5 text-xs text-white p-1.5 rounded font-mono cursor-pointer outline-hidden"
                        >
                          <option value="Custom Double-Decker">Elite Double-Decker</option>
                          <option value="Modular Sustainable">Zero-Waste Modular</option>
                          <option value="Bespoke Joinery">Single-Tier Joinery</option>
                        </select>
                      </div>

                      {/* Option 2 */}
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[10px] font-mono text-neutral-500">Exhibition Size (sqm)</span>
                        <input 
                          type="number" 
                          min="9" 
                          max="200"
                          value={exAreaSize}
                          onChange={(e) => setExAreaSize(Math.max(9, Number(e.target.value)))}
                          className="bg-neutral-900 border border-white/5 text-xs text-white p-1.5 rounded font-mono outline-hidden"
                        />
                      </div>

                      {/* Option 3 */}
                      <div className="flex flex-col gap-1.5 justify-center">
                        <label className="flex items-center gap-2.5 cursor-pointer text-xs font-mono text-neutral-400">
                          <input 
                            type="checkbox" 
                            checked={exSustainOption}
                            onChange={(e) => setExSustainOption(e.target.checked)}
                            className="bg-neutral-900 border-white/10 rounded accent-red-600"
                          />
                          Eco-Conscious Build
                        </label>
                      </div>

                    </div>

                    {/* Pricing configuration simulator table */}
                    <div className="bg-neutral-900/60 p-4 rounded-xl border border-white/5">
                      <div className="flex justify-between items-center text-xs font-mono mb-2">
                        <span className="text-neutral-500">Core Fabrication Time:</span>
                        <span className="text-white font-bold">{Math.ceil(exAreaSize * 0.15)} Days Setup</span>
                      </div>
                      <div className="flex justify-between items-center text-xs font-mono mb-2">
                        <span className="text-neutral-500">DWTC Permit Handlings:</span>
                        <span className="text-green-500 font-bold">Comprehensive Included</span>
                      </div>
                      <div className="flex justify-between items-center text-xs font-mono pt-2 border-t border-white/5">
                        <span className="text-neutral-400 uppercase font-bold text-[10px] tracking-wider">Estimated Setup Plan:</span>
                        <span className="text-red-500 font-bold text-sm tracking-tight">{exBuildType} ({exAreaSize} sqm)</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* CASE 3: General Service Pitch Panel */}
                {selectedService.id !== 'audio-visual-production' && selectedService.id !== 'exhibitions' && (
                  <div className="bg-neutral-950 p-6 rounded-2xl border border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                      <h4 className="font-display text-sm font-bold text-white mb-1 flex items-center gap-2">
                        <Lightbulb className="w-4 h-4 text-red-500" />
                        Premium Dubai Delivery Included
                      </h4>
                      <p className="text-neutral-400 text-xs leading-relaxed max-w-md">
                        Every single detail of our {selectedService.title} operations is handled in-house with standard dwg schematics, direct regional permits, and redundant executive back-ups.
                      </p>
                    </div>
                    <button
                      onClick={() => setActivePage('contact')}
                      className="relative overflow-hidden group bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 border border-red-500/30 text-white font-mono text-xs uppercase font-bold px-5 py-3 rounded-xl transition-all duration-300 cursor-pointer text-center shrink-0 w-full md:w-auto shadow-lg shadow-red-700/10 hover:shadow-red-600/20"
                    >
                      <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
                      Enquire for this
                    </button>
                  </div>
                )}

              </div>

              {/* Back out button */}
              <div className="mt-8 pt-6 border-t border-white/5 flex gap-4">
                <button
                  onClick={() => {
                    setActivePage('contact');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="bg-white hover:bg-neutral-100 text-black font-sans text-xs font-bold uppercase tracking-wider py-3.5 px-8 rounded-full transition-all duration-300 flex items-center gap-2 group cursor-pointer"
                >
                  Custom Proposal Brief
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 duration-200" />
                </button>
              </div>

            </motion.div>
          </AnimatePresence>
        </div>

      </section>

    </div>
  );
}
