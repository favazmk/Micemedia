/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { ShieldCheck, Compass, Target, ArrowRight, Zap, Award, CheckCircle } from 'lucide-react';
import { BRAND_INFO, PROCESS_DATA, VISION_MISSION, WHY_US_DATA } from '../data';
import { PrimaryButton } from '@/components/ui/primary-button';
import Particles from './Particles';

interface AboutProps {
  setActivePage: (page: string) => void;
}

export default function About({ setActivePage }: AboutProps) {
  return (
    <div className="py-24 md:py-32 flex flex-col w-full relative min-h-screen" id="aboutpage-root">

      {/* â”€â”€ Particles animated WebGL background â”€â”€ */}
      {/* We use an absolute wrapper that spans the full page height, with a sticky child that tracks the viewport.
          This prevents the canvas from stretching to thousands of pixels and crashing WebGL, 
          since the 'fixed' property is broken by the parent's framer-motion transform. */}
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


      {/* All page content sits above the background */}
      <div className="relative z-10 flex flex-col w-full">
      {/* SECTION 1: ABOUT HERO HEADER */}
      <section className="relative px-6 max-w-7xl mx-auto w-full mb-20 text-center">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-red-650/10 rounded-full blur-3xl pointer-events-none"></div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neutral-905 border border-white/5 backdrop-blur-md mb-6"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-red-650"></span>
          <span className="font-mono text-[10px] tracking-widest uppercase text-neutral-400">
            About MICE MEDIA
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-display text-4xl sm:text-5xl md:text-6xl font-black uppercase text-white tracking-tight"
        >
          We Don't Just Plan Events — <br />
          <span>We </span>
          <span className="accent-word text-red-500 text-[1.15em]">engineer</span>
          <span> Moments.</span>
        </motion.h1>
        
        <div className="w-16 h-[2px] bg-red-650 mx-auto mt-6 rounded-full"></div>
      </section>

      {/* SECTION 2: THE TRIPLE STORY BLOCK (Origin, Vision, Promise) */}
      <section className="px-6 max-w-7xl mx-auto w-full mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Card 1: Origin */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="glass-card rounded-2xl p-8 border border-white/5 relative overflow-hidden flex flex-col justify-between"
          >
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-red-600/5 rounded-full blur-2xl"></div>
            <div>
              <div className="w-12 h-12 rounded-xl bg-neutral-900 border border-white/5 flex items-center justify-center text-red-500 mb-6 font-mono font-bold">
                01
              </div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-red-500 font-bold block mb-1">
                Driven By Excellence
              </span>
              <h3 className="font-display text-xl font-bold text-white mb-4">Our Origin</h3>
              <p className="text-neutral-400 text-sm leading-relaxed font-sans">
                Born from a conviction that the events industry deserved better — more precision, more creativity, more soul — MICE MEDIA was built to raise the bar. We are a full-service event management and experiential production company operating out of Dubai, with a reach that extends across UAE and the wider GCC region.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-white/5 text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
              Est. Dubai National Hub
            </div>
          </motion.div>

          {/* Card 2: Vision */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="glass-card rounded-2xl p-8 border border-white/5 relative overflow-hidden flex flex-col justify-between"
          >
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-red-600/5 rounded-full blur-2xl"></div>
            <div>
              <div className="w-12 h-12 rounded-xl bg-neutral-900 border border-white/5 flex items-center justify-center text-red-500 mb-6 font-mono font-bold">
                02
              </div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-red-500 font-bold block mb-1">
                Built On Purpose
              </span>
              <h3 className="font-display text-xl font-bold text-white mb-4">Our Vision</h3>
              <p className="text-neutral-400 text-sm leading-relaxed font-sans">
                To be the event management company that GCC's most ambitious organisations turn to first — not because we're the biggest, but because we're the most exacting. We envision a future where every corporate gathering becomes a marker moment in someone's professional journey.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-white/5 text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
              GCC Region Delivery
            </div>
          </motion.div>

          {/* Card 3: The Promise */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25 }}
            className="glass-card rounded-2xl p-8 border border-white/5 relative overflow-hidden flex flex-col justify-between hover:border-red-500/20"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-655/5 rounded-full blur-3xl"></div>
            <div>
              <div className="w-12 h-12 rounded-xl bg-neutral-900 border border-white/5 flex items-center justify-center text-red-500 mb-6 font-mono font-bold">
                03
              </div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-red-500 font-bold block mb-1">
                The Non-Negotiable
              </span>
              <h3 className="font-display text-xl font-bold text-white mb-4">The Promise</h3>
              <p className="text-neutral-300 text-sm leading-relaxed font-sans font-medium">
                Every project that leaves our team carries one non-negotiable: it has to be extraordinary. No exceptions. No compromises. Not for any budget, deadline, or brief.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-red-500/10 text-[10px] font-mono text-red-500 uppercase tracking-widest font-semibold">
              Extraordinary or Nothing
            </div>
          </motion.div>

        </div>
      </section>

      {/* SECTION 5: WHY CHOOSE US (PRECISION & DETAILS) */}
      <section className="bg-neutral-950/60 border-t border-white/5 py-24 relative">
        <div className="max-w-7xl mx-auto px-6 w-full flex flex-col">
          <div className="text-center mb-16 flex flex-col items-center">
            <span className="text-xs font-mono tracking-widest text-red-500 uppercase font-bold">
              Why Choose Us
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-black uppercase text-white mt-3">
              The Difference Is In The Details.
            </h2>
            <div className="w-12 h-[2px] bg-red-650 mt-4 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8" id="about-why-grid">
            {WHY_US_DATA.map((why) => (
              <div
                key={why.id}
                className="glass-card rounded-2xl p-8 border border-white/5 relative hover:border-red-500/20 transition-all duration-300 flex gap-6"
              >
                <div className="text-3xl text-red-500 font-display font-light shrink-0 leading-none">
                  {why.number}
                </div>
                <div className="flex flex-col">
                  <h3 className="font-display text-lg font-bold text-white mb-2">
                    {why.title}
                  </h3>
                  <p className="text-neutral-400 text-sm leading-relaxed">
                    {why.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6: STEPS PROCESS (From Brief to Impact) */}
      <section className="py-24 max-w-7xl mx-auto px-6 w-full">
        <div className="text-center mb-16 flex flex-col items-center">
          <span className="text-xs font-mono tracking-widest text-red-500 uppercase font-bold">
            How We Work
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-black uppercase text-white mt-3">
            From Brief to Impact.
          </h2>
          <p className="text-neutral-400 text-xs mt-2 font-mono">
            A structured creative process that leaves nothing to chance.
          </p>
          <div className="w-12 h-[2px] bg-red-650 mt-4 rounded-full"></div>
        </div>

        {/* Steps display cards */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6" id="about-process-grid">
          {PROCESS_DATA.map((proc, index) => (
            <div
              key={proc.id}
              className="glass-card rounded-2xl p-6.5 border border-white/5 relative overflow-hidden flex flex-col justify-between group hover:border-red-500/30 transition-all duration-350 min-h-[260px]"
            >
              {/* Highlight bar inside card */}
              <div className="absolute top-0 left-0 w-full h-[3px] bg-neutral-900 group-hover:bg-red-600 transition-colors duration-300"></div>
              
              <div>
                <span className="text-4xl font-display font-black text-neutral-800 group-hover:text-red-600/30 transition-colors duration-300">
                  {proc.number}
                </span>
                <h3 className="font-display text-base font-bold text-white uppercase tracking-tight mt-4 mb-2.5">
                  {proc.title}
                </h3>
                <p className="text-neutral-400 text-xs leading-relaxed font-sans">
                  {proc.description}
                </p>
              </div>

              {/* Edge numbering indicator */}
              <div className="pt-4 border-t border-white/5 mt-4 flex items-center justify-between text-[10px] font-mono text-neutral-500">
                <span>STAGE 0{index + 1}</span>
                <CheckCircle className="w-3.5 h-3.5 text-neutral-800 group-hover:text-red-600 transition-colors duration-300" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PRE-FOOTER CONNECT CALLOUT */}
      <section className="px-6 max-w-7xl mx-auto w-full mb-12">
        <div className="glass-panel-heavy rounded-3xl p-8 sm:p-12 border border-red-500/10 relative overflow-hidden text-center flex flex-col items-center">
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-red-950/5 to-transparent"></div>
          <h2 className="font-display text-2xl sm:text-4xl font-black uppercase text-white tracking-tight relative z-10 max-w-2xl leading-tight">
            Designing GCC's Most Innovative & Immersive Events
          </h2>
          <p className="mt-4 text-neutral-400 font-sans text-xs sm:text-sm max-w-xl relative z-10">
            From Blueprint to Brand Impacts - Let MICE Media experts turn your vision into milestone experience.
          </p>
          <div className="mt-8 relative z-10">
            <PrimaryButton
              onClick={() => {
                setActivePage('contact');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              text="Reach Our MICE Media Team"
            />
          </div>
        </div>
      </section>

      </div>{/* end z-10 content wrapper */}
    </div>
  );
}