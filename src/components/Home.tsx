/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent } from 'motion/react';
import { 
  ArrowRight, 
  Trophy, 
  Users, 
  Globe, 
  Play, 
  Sparkles, 
  ArrowUpRight,
  Presentation,
  Award,
  Volume2,
  Palette,
  Compass,
  Users2,
  Music,
  Layers
} from 'lucide-react';
import { GetStartedButton } from '@/components/ui/get-started-button';
import { PrimaryButton } from '@/components/ui/primary-button';
import { BRAND_INFO, CLIENT_LOGOS, EVENTS_DATA, EXHIBITIONS_DATA, SERVICES_DATA } from '../data';
import { PortfolioItem } from '../types';
import TestimonialsSlider from './TestimonialsSlider';
import EventScroll from './EventScroll';
import ZoomShowcase from './ZoomShowcase';

// Mix of events and exhibition stands for the "What We Done" zoom reel
const FEATURED_WORK: PortfolioItem[] = [
  EVENTS_DATA[0],
  EXHIBITIONS_DATA[0],
  EVENTS_DATA[3],
  EVENTS_DATA[1],
  EXHIBITIONS_DATA[1],
].filter(Boolean);

const serviceIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Presentation,
  Award,
  Sparkles,
  Volume2,
  Palette,
  Compass,
  Users2: Users2 || Users,
  Music,
  Layers
};

// High-performance continuous animation decelerator hook using the Web Animations API (WAAPI)
export function useSlowMoMarquee(ref: React.RefObject<HTMLDivElement | null>, isHovered: boolean, baseSpeed = 1) {
  const currentSpeedRef = useRef(baseSpeed);
  
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof el.getAnimations !== 'function') return;

    let animationFrameId: number;
    const targetSpeed = isHovered ? 0 : baseSpeed;

    const step = () => {
      const diff = targetSpeed - currentSpeedRef.current;
      if (Math.abs(diff) < 0.005) {
        currentSpeedRef.current = targetSpeed;
      } else {
        currentSpeedRef.current += diff * 0.045; // Silky kinetic braking slowing-down stop
      }

      const animations = el.getAnimations();
      for (const anim of animations) {
        anim.playbackRate = currentSpeedRef.current;
      }

      if (currentSpeedRef.current !== targetSpeed) {
        animationFrameId = requestAnimationFrame(step);
      }
    };

    animationFrameId = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isHovered, baseSpeed]);
}

interface HomeProps {
  setActivePage: (page: string) => void;
  setSelectedServiceId?: (id: string | null) => void;
  setSelectedPortfolioId?: (id: string | null) => void;
}


export default function Home({
 setActivePage, setSelectedServiceId, setSelectedPortfolioId }: HomeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const heroRef = useRef<HTMLElement>(null);
  const aboutRef = useRef<HTMLElement>(null);
  const servicesRef = useRef<HTMLElement>(null);
  const testimonialsRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [maxScroll, setMaxScroll] = useState(0);

  // Mobile specific states
  const [isMobile, setIsMobile] = useState(false);
  const [activeTouchHeroCardId, setActiveTouchHeroCardId] = useState<string | null>(null);
  const [activeTouchServiceId, setActiveTouchServiceId] = useState<string | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (trackRef.current && trackRef.current.parentElement) {
        const trackWidth = trackRef.current.scrollWidth;
        const parent = trackRef.current.parentElement;
        const viewWidth = parent.clientWidth;
        const style = window.getComputedStyle(parent);
        const paddingLeft = parseFloat(style.paddingLeft) || 0;
        const paddingRight = parseFloat(style.paddingRight) || 0;
        const contentWidth = viewWidth - paddingLeft - paddingRight;
        const newMax = Math.max(0, trackWidth - contentWidth);
        setMaxScroll(newMax);
      }
    };

    handleResize();

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        handleResize();
      });
      if (trackRef.current) resizeObserver.observe(trackRef.current);
      if (trackRef.current?.parentElement) resizeObserver.observe(trackRef.current.parentElement);
    }

    window.addEventListener('resize', handleResize);
    
    const timer1 = setTimeout(handleResize, 100);
    const timer2 = setTimeout(handleResize, 400);
    const timer3 = setTimeout(handleResize, 1000);

    return () => {
      if (resizeObserver) resizeObserver.disconnect();
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  // States & Refs for slow-mo kinetic marquee braking on hover and touch/mouse grab & drag
  const tickerRef = useRef<HTMLDivElement>(null);
  const [isTickerHovered, setIsTickerHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const isDraggingRef = useRef(false);
  const isTickerHoveredRef = useRef(false);
  const xRef = useRef(0);
  const currentSpeedRef = useRef(1.2);
  const startXRef = useRef(0);
  const startTranslateXRef = useRef(0);

  useEffect(() => {
    isTickerHoveredRef.current = isTickerHovered;
  }, [isTickerHovered]);

  useEffect(() => {
    const ticker = tickerRef.current;
    if (!ticker) return;

    let animationFrameId: number;

    const updateMarquee = () => {
      if (!isDraggingRef.current) {
        const limit = ticker.scrollWidth / 3;
        if (limit > 0) {
          // Smoothly interpolate speed
          const targetSpeed = isTickerHoveredRef.current ? 0 : 1.2;
          currentSpeedRef.current += (targetSpeed - currentSpeedRef.current) * 0.045;

          xRef.current -= currentSpeedRef.current;

          // Wrap around seamlessly
          if (xRef.current <= -limit) {
            xRef.current += limit;
          } else if (xRef.current > 0) {
            xRef.current -= limit;
          }

          ticker.style.transform = `translate3d(${xRef.current}px, 0px, 0px)`;
        }
      }
      animationFrameId = requestAnimationFrame(updateMarquee);
    };

    animationFrameId = requestAnimationFrame(updateMarquee);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!tickerRef.current) return;
    isDraggingRef.current = true;
    setIsDragging(true);
    startXRef.current = e.clientX;
    startTranslateXRef.current = xRef.current;
    tickerRef.current.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || !tickerRef.current) return;
    const deltaX = e.clientX - startXRef.current;
    let newX = startTranslateXRef.current + deltaX;
    
    const limit = tickerRef.current.scrollWidth / 3;
    if (limit > 0) {
      // Wrap newX stay within [-limit, 0]
      while (newX > 0) {
        newX -= limit;
      }
      while (newX <= -limit) {
        newX += limit;
      }
    }
    
    xRef.current = newX;
    tickerRef.current.style.transform = `translate3d(${newX}px, 0px, 0px)`;
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      setIsDragging(false);
      if (tickerRef.current) {
        tickerRef.current.releasePointerCapture(e.pointerId);
      }
    }
  };

  const logosRef = useRef<HTMLDivElement>(null);
  const [isLogosHovered, setIsLogosHovered] = useState(false);
  useSlowMoMarquee(logosRef, isLogosHovered);

  // Pinned hero: progress 0..1 across the tall hero wrapper drives both the frame
  // sequence and the chapter captions layered on top of it
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end end"]
  });
  const heroProgress = useSpring(heroScroll, { stiffness: 60, damping: 20, restDelta: 0.001 });

  const introOpacity = useTransform(heroProgress, [0, 0.12, 0.2], [1, 1, 0]);
  const introY = useTransform(heroProgress, [0, 0.2], [0, -80]);
  const chapter1Opacity = useTransform(heroProgress, [0.2, 0.28, 0.42, 0.5], [0, 1, 1, 0]);
  const chapter1Y = useTransform(heroProgress, [0.2, 0.28, 0.42, 0.5], [60, 0, 0, -60]);
  const chapter2Opacity = useTransform(heroProgress, [0.5, 0.58, 0.72, 0.8], [0, 1, 1, 0]);
  const chapter2Y = useTransform(heroProgress, [0.5, 0.58, 0.72, 0.8], [60, 0, 0, -60]);
  const chapter3Opacity = useTransform(heroProgress, [0.82, 0.92, 1], [0, 1, 1]);
  const chapter3Y = useTransform(heroProgress, [0.82, 0.92], [60, 0]);
  // Keep the invisible final chapter from swallowing clicks meant for the intro CTAs
  const chapter3Pointer = useTransform(chapter3Opacity, (v) => (v > 0.5 ? 'auto' : 'none'));

  // Section 2 (About) calculations
  const { scrollYProgress: aboutScroll } = useScroll({
    target: aboutRef,
    offset: ["start end", "end start"]
  });
  const smoothAboutScroll = useSpring(aboutScroll, { stiffness: 75, damping: 25, restDelta: 0.001 });
  const aboutScale = useTransform(smoothAboutScroll, [0, 0.45, 0.9], [0.82, 1, 0.85]);
  const aboutRotateX = useTransform(smoothAboutScroll, [0, 0.45, 0.9], [15, 0, -15]);
  const aboutY = useTransform(smoothAboutScroll, [0, 0.45, 0.9], [120, 0, -120]);

  // Section 3 (Services) calculations
  const { scrollYProgress: servicesViewportScroll } = useScroll({
    target: servicesRef,
    offset: ["start end", "end start"]
  });
  const smoothServicesViewportScroll = useSpring(servicesViewportScroll, { stiffness: 75, damping: 25, restDelta: 0.001 });
  const servicesScale = useTransform(smoothServicesViewportScroll, [0, 0.2, 0.8, 1], [0.4, 1, 1, 0.4]);
  const servicesRotateY = useTransform(smoothServicesViewportScroll, [0, 0.2, 0.8, 1], [60, 0, 0, -60]);
  const servicesOpacity = useTransform(smoothServicesViewportScroll, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const servicesBlurValue = useTransform(smoothServicesViewportScroll, [0, 0.2, 0.8, 1], [40, 0, 0, 40]);
  const servicesBlur = useTransform(servicesBlurValue, (v) => `blur(${v}px)`);

  const mobileServicesScale = useTransform(smoothServicesViewportScroll, [0, 0.45, 0.9], [0.82, 1, 0.85]);
  const mobileServicesRotateX = useTransform(smoothServicesViewportScroll, [0, 0.45, 0.9], [15, 0, -15]);
  const mobileServicesY = useTransform(smoothServicesViewportScroll, [0, 0.45, 0.9], [120, 0, -120]);
  
  const { scrollYProgress: servicesScroll } = useScroll({
    target: servicesRef,
    offset: ["start start", "end end"]
  });
  const smoothServicesScroll = useSpring(servicesScroll, { stiffness: 75, damping: 25, restDelta: 0.001 });
  const servicesX = useTransform(smoothServicesScroll, (v) => -v * maxScroll);

  // Section 6 (Testimonials) — Horizontal stage-slide + perspective flatten
  const { scrollYProgress: testimonialsScroll } = useScroll({
    target: testimonialsRef,
    offset: ["start end", "end start"]
  });
  const smoothTestimonialsScroll = useSpring(testimonialsScroll, { stiffness: 55, damping: 18, restDelta: 0.001 });
  // Slams in from the LEFT, exits to the RIGHT — only horizontal section on the page
  const testimonialsX = useTransform(smoothTestimonialsScroll, [0, 0.35, 0.65, 1], ["-120%", "0%", "0%", "120%"]);
  // Perspective: starts face-on from left angle, snaps flat, folds away to the right
  const testimonialsRotateY = useTransform(smoothTestimonialsScroll, [0, 0.35, 0.65, 1], [-30, 0, 0, 30]);
  const testimonialsOpacity = useTransform(smoothTestimonialsScroll, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  
  const mobileTestimonialsScale = useTransform(smoothTestimonialsScroll, [0, 0.45, 0.9], [0.82, 1, 0.85]);
  const mobileTestimonialsRotateX = useTransform(smoothTestimonialsScroll, [0, 0.45, 0.9], [15, 0, -15]);
  const mobileTestimonialsY = useTransform(smoothTestimonialsScroll, [0, 0.45, 0.9], [120, 0, -120]);
  




  const goToPage = (page: string) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Open a featured project on its own page (events or exhibition) with its detail view up
  const openProject = (item: PortfolioItem) => {
    setSelectedPortfolioId?.(item.id);
    goToPage(item.category === 'Exhibition' ? 'exhibition' : 'events');
  };

  const handleHeroCardClick = (page: string) => {
    if (isMobile && activeTouchHeroCardId !== page) {
      setActiveTouchHeroCardId(page);
      return;
    }
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleServiceClick = (itemId: string) => {
    if (isMobile && activeTouchServiceId !== itemId) {
      setActiveTouchServiceId(itemId);
      setActiveTouchHeroCardId(null);
      return;
    }
    if (setSelectedServiceId) {
      setSelectedServiceId(itemId);
    }
    setActivePage('services');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div ref={containerRef} className="flex flex-col w-full relative" id="homepage-root">
      
      {/* SECTION 1: PINNED SCROLL-SEQUENCE HERO
          The frame sequence (blueprint → live event) only plays while this tall
          wrapper scrolls past; the sticky child keeps it filling the viewport. */}
      <section ref={heroRef} id="hero-section" className="relative w-full h-[320vh]">
        <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#050505]">
          <EventScroll progress={heroProgress} />

          {/* Readability overlays: dim, vignette, header fade, and a bottom fade into the page background */}
          <div className="absolute inset-0 bg-black/35 pointer-events-none"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(0,0,0,0.7)_100%)] pointer-events-none"></div>
          <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-black/80 to-transparent pointer-events-none"></div>
          <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-[#121213] via-[#121213]/70 to-transparent pointer-events-none"></div>

          {/* Chapter 0: intro headline + CTAs */}
          <motion.div
            style={{ opacity: introOpacity, y: introY }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 pt-20"
          >
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4.5 py-2 rounded-full bg-neutral-900/80 border border-pop-mint/30 backdrop-blur-md mb-8 shadow-xl"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-pop-mint animate-ping"></span>
              <span className="font-mono text-[10px] md:text-xs tracking-[0.2em] uppercase font-bold text-neutral-200">
                Dubai's Leading Corporate Event Agency
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white leading-[1.05] max-w-5xl [text-shadow:0_4px_24px_rgba(0,0,0,0.8)]"
            >
              Where every event <br className="hidden sm:block" />
              becomes a <span className="script-accent text-pop-mint text-[1.15em]">legacy.</span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.45 }}
              className="mt-12 flex flex-col sm:flex-row gap-3 sm:gap-5 items-center justify-center w-full max-w-md relative z-40"
              id="hero-cta-group"
            >
              <GetStartedButton
                onClick={() => setActivePage('events')}
                text="Explore Our Work"
                className="shadow-white/5 whitespace-nowrap text-[10px] sm:text-xs px-2 sm:px-8 sm:flex-1 w-full justify-center"
              />
              <PrimaryButton
                onClick={() => setActivePage('contact')}
                text="Start Your Event"
                className="whitespace-nowrap text-[10px] sm:text-xs px-2 sm:px-8 sm:flex-1 w-full justify-center"
              />
            </motion.div>

            {/* Scroll cue */}
            <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-neutral-300">
              <span className="font-mono text-[10px] tracking-[0.3em] uppercase">Scroll to build it</span>
              <motion.span
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                className="w-[1px] h-8 bg-gradient-to-b from-pop-mint to-transparent"
              />
            </div>
          </motion.div>

          {/* Chapter 1: blueprint */}
          <motion.div
            style={{ opacity: chapter1Opacity, y: chapter1Y }}
            className="absolute inset-0 flex items-center px-6 sm:px-12 md:px-20 pointer-events-none"
          >
            <div className="max-w-xl">
              <span className="font-mono text-[10px] sm:text-xs tracking-[0.3em] uppercase text-pop-mint font-bold">Phase 01 — Concept & Design</span>
              <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-[1.05] mt-4 [text-shadow:0_4px_24px_rgba(0,0,0,0.9)]">
                It starts as a <span className="script-accent text-pop-mint text-[1.15em]">blueprint.</span>
              </h2>
              <p className="font-sans text-sm sm:text-base text-neutral-200 mt-5 max-w-md leading-relaxed [text-shadow:0_2px_10px_rgba(0,0,0,0.9)]">
                Every stage, truss and table is mapped before a single cable is laid.
              </p>
            </div>
          </motion.div>

          {/* Chapter 2: build */}
          <motion.div
            style={{ opacity: chapter2Opacity, y: chapter2Y }}
            className="absolute inset-0 flex items-center justify-end px-6 sm:px-12 md:px-20 pointer-events-none"
          >
            <div className="max-w-xl text-right">
              <span className="font-mono text-[10px] sm:text-xs tracking-[0.3em] uppercase text-pop-sun font-bold">Phase 02 — Production & Build</span>
              <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-[1.05] mt-4 [text-shadow:0_4px_24px_rgba(0,0,0,0.9)]">
                Then we build every <span className="script-accent text-pop-sun text-[1.15em]">detail.</span>
              </h2>
              <p className="font-sans text-sm sm:text-base text-neutral-200 mt-5 max-w-md ml-auto leading-relaxed [text-shadow:0_2px_10px_rgba(0,0,0,0.9)]">
                Lighting, AV, staging and styling, run end-to-end under our direct supervision.
              </p>
            </div>
          </motion.div>

          {/* Chapter 3: showtime */}
          <motion.div
            style={{ opacity: chapter3Opacity, y: chapter3Y, pointerEvents: chapter3Pointer }}
            className="absolute inset-0 flex flex-col items-center justify-end text-center px-6 pb-28 sm:pb-32"
          >
            <span className="font-mono text-[10px] sm:text-xs tracking-[0.3em] uppercase text-pop-pink font-bold">Phase 03 — Showtime</span>
            <h2 className="font-display text-4xl sm:text-5xl md:text-7xl font-bold text-white leading-[1.05] mt-4 [text-shadow:0_4px_24px_rgba(0,0,0,0.9)]">
              And the world <span className="script-accent text-pop-pink text-[1.15em]">remembers.</span>
            </h2>
            <div className="mt-8 w-full max-w-xs sm:max-w-none flex justify-center">
              <PrimaryButton
                onClick={() => setActivePage('contact')}
                text="Plan Your Event"
                className="whitespace-nowrap text-[10px] sm:text-xs"
              />
            </div>
          </motion.div>

          {/* Progress rail: Blueprint → Build → Showtime */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[60%] sm:w-[80%] max-w-md pointer-events-none">
            <div className="flex justify-between font-mono text-[9px] sm:text-[10px] tracking-[0.2em] uppercase text-neutral-400 mb-2">
              <span>Blueprint</span>
              <span>Build</span>
              <span>Showtime</span>
            </div>
            <div className="h-[3px] w-full bg-white/10 rounded-full overflow-hidden">
              <motion.div
                style={{ scaleX: heroProgress }}
                className="h-full origin-left bg-gradient-to-r from-pop-mint via-pop-sun to-pop-pink"
              />
            </div>
          </div>
        </div>
      </section>

      {/* TICKER STRIP */}

      <div className="bg-[#dc4d49] border-y border-white/5 py-4.5 overflow-hidden w-full relative z-40">
        <div 
          ref={tickerRef}
          onMouseEnter={() => setIsTickerHovered(true)}
          onMouseLeave={() => setIsTickerHovered(false)}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          style={{ animation: 'none' }}
          className="uppercase font-display font-black text-xs sm:text-sm tracking-[0.2em] text-white flex items-center whitespace-nowrap gap-5 sm:gap-10 cursor-grab select-none active:cursor-grabbing touch-none"
        >
          {/* Block 1 */}
          <div className="flex items-center gap-5 sm:gap-8.5 shrink-0 px-2">
            <span>Corporate Conferences</span> <span className="text-white/40">✦</span>
            <span>Gala Dinners</span> <span className="text-white/40">✦</span>
            <span>Exhibition Builds</span> <span className="text-white/40">✦</span>
            <span>Brand Activations</span> <span className="text-white/40">✦</span>
            <span>AV Production</span> <span className="text-white/40">✦</span>
            <span>Team Building</span> <span className="text-white/40">✦</span>
            <span>Incentive Travel</span> <span className="text-white/40">✦</span>
            <span>Entertainment</span> <span className="text-white/40">✦</span>
          </div>
          {/* Block 2 */}
          <div className="flex items-center gap-5 sm:gap-8.5 shrink-0 px-2">
            <span>Corporate Conferences</span> <span className="text-white/40">✦</span>
            <span>Gala Dinners</span> <span className="text-white/40">✦</span>
            <span>Exhibition Builds</span> <span className="text-white/40">✦</span>
            <span>Brand Activations</span> <span className="text-white/40">✦</span>
            <span>AV Production</span> <span className="text-white/40">✦</span>
            <span>Team Building</span> <span className="text-white/40">✦</span>
            <span>Incentive Travel</span> <span className="text-white/40">✦</span>
            <span>Entertainment</span> <span className="text-white/40">✦</span>
          </div>
          {/* Block 3 */}
          <div className="flex items-center gap-5 sm:gap-8.5 shrink-0 px-2">
            <span>Corporate Conferences</span> <span className="text-white/40">✦</span>
            <span>Gala Dinners</span> <span className="text-white/40">✦</span>
            <span>Exhibition Builds</span> <span className="text-white/40">✦</span>
            <span>Brand Activations</span> <span className="text-white/40">✦</span>
            <span>AV Production</span> <span className="text-white/40">✦</span>
            <span>Team Building</span> <span className="text-white/40">✦</span>
            <span>Incentive Travel</span> <span className="text-white/40">✦</span>
            <span>Entertainment</span> <span className="text-white/40">✦</span>
          </div>
        </div>
      </div>

      {/* SECTION 1B: WHAT MAKES US DIFFERENT — 3D card deck (previously inside the hero) */}
      <section id="home-pillars" className="relative w-full max-w-7xl mx-auto px-6 pt-20 md:pt-28 pb-6 z-10 flex flex-col items-center">
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white text-center tracking-tight leading-tight">
          Why brands <span className="script-accent text-pop-mint text-[1.15em]">choose</span> us.
        </h2>

      {/* Advanced 3D Stage Deck projection */}
      <motion.div
        className="relative w-full max-w-4xl h-[280px] sm:h-[350px] mt-6 sm:mt-10 flex items-center justify-center [perspective:1200px]"
        id="hologram-stage-canvas"
      >
        {/* Background elements removed as per user request */}

        {/* Floating, Tilted 3D holographic Cards (similar to Cinedaily's layout) */}
        <div className="absolute inset-0 flex items-center justify-center gap-3 sm:gap-8 pointer-events-auto [transform-style:preserve-3d] z-10">
          
          {/* Card 1: Left */}
          <motion.div
            animate={{
              rotateY: isMobile ? (activeTouchHeroCardId === 'events' ? 0 : -10) : -20,
              rotateX: isMobile ? (activeTouchHeroCardId === 'events' ? 12 : 6) : 6,
              z: isMobile ? (activeTouchHeroCardId === 'events' ? 60 : 10) : 10,
              scale: 1
            }}
            whileHover={{ 
              scale: 1.08, 
              rotateY: 0, 
              rotateX: 12, 
              z: 100
            }}
            onClick={() => handleHeroCardClick('events')}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className={`w-[105px] sm:w-[220px] h-[180px] sm:h-[280px] bg-neutral-900/90 rounded-2xl border p-3 sm:p-5 flex flex-col justify-between shadow-2xl shadow-black text-left cursor-pointer transition-colors duration-150 ${
              activeTouchHeroCardId === 'events' ? 'bg-[#171717]/95 border-red-500/60 z-50' : 'hover:bg-[#171717]/95 border-white/20 hover:border-red-500/60'
            }`}
          >
            <div>
              <span className="font-mono text-[8px] sm:text-[10px] text-red-500 uppercase tracking-widest font-bold">01 / EXPERIENCE</span>
              <h4 className="font-display text-[10px] sm:text-base font-black text-white uppercase mt-1 sm:mt-2 leading-tight">EVENTS THAT LEAVE A MARK</h4>
            </div>
            <p className="font-sans text-[8px] sm:text-[11px] text-neutral-400 leading-relaxed mt-2 line-clamp-4 sm:line-clamp-none">
              We don't produce occasions — we engineer experiences people talk about long after the night ends.
            </p>
          </motion.div>

          {/* Card 2: Center (Featured Card popping forward) */}
          <motion.div
            animate={{
              rotateX: isMobile ? (activeTouchHeroCardId === 'services' ? 12 : 12) : 12,
              z: isMobile ? (activeTouchHeroCardId === 'services' ? 140 : 60) : 60,
              scale: 1
            }}
            whileHover={{ 
              scale: 1.08, 
              rotateX: 12, 
              z: 140
            }}
            onClick={() => handleHeroCardClick('services')}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className={`w-[125px] sm:w-[240px] h-[210px] sm:h-[310px] bg-neutral-900/95 rounded-2xl border p-3 sm:p-5 flex flex-col justify-between shadow-2xl shadow-red-950/30 relative overflow-hidden text-left cursor-pointer transition-colors duration-150 ${
              activeTouchHeroCardId === 'services' ? 'bg-[#171717]/95 border-red-500/60 z-50' : 'hover:bg-[#171717]/95 border-red-500/25 hover:border-red-500/60'
            }`}
          >
            <div className="absolute -top-12 -right-12 w-24 h-24 bg-red-650/10 rounded-full blur-xl pointer-events-none"></div>
            <div>
              <div className="flex justify-between items-center">
                <span className="font-mono text-[8px] sm:text-[10px] text-red-500 uppercase tracking-widest font-bold">02 / STANDARD</span>
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
              </div>
              <h4 className="font-display text-[11px] sm:text-lg font-black text-white uppercase mt-1 sm:mt-2 leading-tight">PRECISION MEETS CREATIVITY</h4>
            </div>
            <div>
              <p className="font-sans text-[8px] sm:text-[11px] text-neutral-300 leading-relaxed mb-2 sm:mb-4 line-clamp-5 sm:line-clamp-none">
                Two things most agencies can't balance. We refuse to choose between them — on every project, at every scale, without exception.
              </p>
              <span className="text-[8px] sm:text-[11px] font-mono uppercase tracking-widest text-red-400 font-bold hover:text-red-300 transition-colors inline-flex items-center gap-1 group/link">
                OUR SERVICES <span className="transform group-hover/link:translate-x-1 transition-transform">â†’</span>
              </span>
            </div>
          </motion.div>

          {/* Card 3: Right */}
          <motion.div
            animate={{
              rotateY: isMobile ? (activeTouchHeroCardId === 'about-us' ? 0 : 10) : 20,
              rotateX: isMobile ? (activeTouchHeroCardId === 'about-us' ? 12 : 6) : 6,
              z: isMobile ? (activeTouchHeroCardId === 'about-us' ? 60 : 10) : 10,
              scale: 1
            }}
            whileHover={{ 
              scale: 1.08, 
              rotateY: 0, 
              rotateX: 12, 
              z: 100
            }}
            onClick={() => handleHeroCardClick('about-us')}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className={`w-[105px] sm:w-[220px] h-[180px] sm:h-[280px] bg-neutral-900/90 rounded-2xl border p-3 sm:p-5 flex flex-col justify-between shadow-2xl shadow-black text-left cursor-pointer transition-colors duration-150 ${
              activeTouchHeroCardId === 'about-us' ? 'bg-[#171717]/95 border-red-500/60 z-50' : 'hover:bg-[#171717]/95 border-white/20 hover:border-red-500/60'
            }`}
          >
            <div>
              <span className="font-mono text-[8px] sm:text-[10px] text-red-500 uppercase tracking-widest font-bold">03 / PROMISE</span>
              <h4 className="font-display text-[10px] sm:text-base font-black text-white uppercase mt-1 sm:mt-2 leading-tight">YOUR VISION, AMPLIFIED</h4>
            </div>
            <p className="font-sans text-[8px] sm:text-[11px] text-neutral-400 leading-relaxed mt-2 line-clamp-4 sm:line-clamp-none">
              We take what you imagine and build something that exceeds it — every single time.
            </p>
          </motion.div>

        </div>

        {/* Spotlights removed */}
      </motion.div>
      </section>

      {/* SECTION 2: ABOUT SUMMARY (MINIMAL & BOLD) */}
      <motion.section
        ref={aboutRef}
        style={{
          scale: aboutScale,
          rotateX: aboutRotateX,
          y: aboutY,
          transformPerspective: 1200
        }}
        id="home-about"
        className="py-10 md:py-24 max-w-5xl mx-auto px-6 sm:px-12 relative z-10 w-full my-10 md:my-20 border border-white/40 rounded-[2rem] lg:rounded-[3rem] shadow-[0_0_30px_rgba(255,255,255,0.08)]"
      >
        <div className="flex flex-col items-center text-center gap-6 drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
          
          <span className="text-xs font-mono tracking-[0.3em] text-red-500 uppercase font-bold [text-shadow:0_2px_4px_rgba(0,0,0,0.8)] flex items-center gap-3">
             <span className="w-8 h-[1px] bg-red-500/50"></span>
             MICE MEDIA
             <span className="w-8 h-[1px] bg-red-500/50"></span>
          </span>
          
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter text-white leading-[1.1] [text-shadow:0_4px_20px_rgba(0,0,0,1)] uppercase">
            Engineering <br className="hidden sm:block" />
            <span className="script-accent text-pop-mint text-[1.1em] py-2">Extraordinary</span> Moments.
          </h2>
          
          <p className="text-neutral-300 font-sans text-sm sm:text-base md:text-lg leading-relaxed mt-2 max-w-2xl font-medium [text-shadow:0_2px_8px_rgba(0,0,0,1)]">
            We operate out of Dubai with a single uncompromising standard: to raise the bar for the events industry across the UAE and GCC. No exceptions.
          </p>
          
          {/* 3 Sleek Mini-Stats instead of bulky cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 w-full max-w-3xl mt-10 border-t border-white/10 pt-10">
            <div className="flex flex-col items-center gap-1.5">
              <span className="text-2xl sm:text-3xl font-display font-black text-white [text-shadow:0_2px_10px_rgba(0,0,0,1)]">100%</span>
              <span className="text-[9px] sm:text-[10px] font-mono tracking-widest text-red-400 uppercase font-bold [text-shadow:0_1px_2px_rgba(0,0,0,1)]">Uncompromising</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <span className="text-2xl sm:text-3xl font-display font-black text-white [text-shadow:0_2px_10px_rgba(0,0,0,1)] uppercase tracking-tight">End-to-End</span>
              <span className="text-[9px] sm:text-[10px] font-mono tracking-widest text-red-400 uppercase font-bold [text-shadow:0_1px_2px_rgba(0,0,0,1)]">Seamless Setup</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <span className="text-2xl sm:text-3xl font-display font-black text-white [text-shadow:0_2px_10px_rgba(0,0,0,1)] uppercase tracking-tight">Direct</span>
              <span className="text-[9px] sm:text-[10px] font-mono tracking-widest text-red-400 uppercase font-bold [text-shadow:0_1px_2px_rgba(0,0,0,1)]">Supervision</span>
            </div>
          </div>

          <div className="mt-8">
            <PrimaryButton
              onClick={() => setActivePage('about-us')}
              text="Discover Our Story"
            />
          </div>

        </div>
      </motion.section>

      {/* SECTION 3: FEATURED SERVICES */}
      <div
        ref={servicesRef}
        className="relative w-full h-[350vh]"
      >
        <div className="w-full flex items-center justify-center overflow-hidden sticky top-0 h-screen">
          <motion.section
            style={isMobile ? {
              opacity: 1,
              filter: "none",
              transformPerspective: 1200
            } : {
              scale: servicesScale,
              rotateY: servicesRotateY,
              opacity: servicesOpacity,
              filter: servicesBlur,
              transformPerspective: 1200
            }}
            id="home-services"
            className="w-full max-w-7xl mx-auto px-4 sm:px-12 md:px-16 py-6 sm:py-12 md:py-20 relative z-10 flex flex-col justify-between border border-white/40 rounded-[2rem] lg:rounded-[3rem] shadow-[0_0_30px_rgba(255,255,255,0.08)] overflow-hidden"
          >
            {/* Ambient backlighting blob matching other sections */}
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-red-650/5 rounded-full blur-[100px] pointer-events-none"></div>
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 sm:gap-6 mb-6 sm:mb-12 relative z-10 drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">
              <div className="flex flex-col gap-1.5 sm:gap-2">
                <span className="text-[10px] sm:text-xs font-mono tracking-widest text-[#E55B5B] uppercase font-bold [text-shadow:0_2px_4px_rgba(0,0,0,0.8)]">
                  WHAT WE DO
                </span>
                <h2 className="font-display text-2xl sm:text-3xl md:text-[40px] font-semibold text-white tracking-tight leading-none [text-shadow:0_4px_16px_rgba(0,0,0,1)]">
                  Every Event. Every <span className="script-accent text-pop-pink text-[1.15em]">Scale.</span>
                </h2>
              </div>
              <button
                onClick={() => setActivePage('services')}
                className="font-mono text-[10px] sm:text-xs px-4 sm:px-6 py-2.5 sm:py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full hover:bg-white/20 transition-all flex items-center gap-2 cursor-pointer text-white tracking-widest font-bold uppercase hover:border-white/40 hover:-translate-y-1 duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.5)] group"
              >
                ALL DISCIPLINES
                <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>

            {/* Horizontal Scroll Layout with all 9 beautiful glass cards */}
            <div className="w-full relative z-10 overflow-hidden">
              <motion.div
                ref={trackRef}
                style={{ x: servicesX }}
                className="flex gap-4 sm:gap-6 w-max"
              >
                {SERVICES_DATA.map((srv) => {
                  const IconComponent = serviceIconMap[srv.iconName] || Sparkles;
                  return (
                    <div
                      key={srv.id}
                      onClick={() => handleServiceClick(srv.id)}
                      className={`group relative bg-black/20 sm:bg-neutral-950/30 sm:backdrop-blur-md sm:[-webkit-backdrop-filter:blur(12px)] border border-white/20 sm:border-white/10 p-8 sm:p-10 overflow-hidden rounded-3xl cursor-pointer transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col justify-between min-h-[350px] w-[310px] sm:w-[350px] shrink-0 shadow-2xl ${
                        activeTouchServiceId === srv.id
                          ? 'border-[#E55B5B]/60 bg-black/40 sm:bg-neutral-950/50 -translate-y-2 z-20 shadow-[0_10px_30px_rgba(229,91,91,0.15)]'
                          : 'hover:-translate-y-2 hover:border-[#E55B5B]/40 hover:bg-black/35 sm:hover:bg-neutral-950/50'
                      }`}
                    >
                      {/* Faint ambient light glow */}
                      <div className={`absolute -top-10 -right-10 w-24 h-24 bg-red-600/5 rounded-full blur-2xl duration-300 pointer-events-none ${
                        activeTouchServiceId === srv.id ? 'bg-red-600/15' : 'group-hover:bg-red-600/15'
                      }`}></div>
                      
                      <div className="relative z-10 flex flex-col justify-between h-full">
                        <div>
                          <span className="font-mono text-xs tracking-widest text-neutral-400 block mb-10 uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                            SERVICE #{srv.number}
                          </span>
                          <h3 className={`font-display text-xl sm:text-2xl font-extrabold text-white mb-5 leading-snug drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] transition-colors ${
                            activeTouchServiceId === srv.id ? 'text-red-500' : 'group-hover:text-red-500'
                          }`}>
                            {srv.title}
                          </h3>
                          <p className="text-neutral-300 font-sans text-sm leading-relaxed mb-8 min-h-[72px] drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
                            {srv.description}
                          </p>
                        </div>

                        <div className={`flex items-center gap-2 font-mono text-xs text-[#E55B5B] transition-all duration-300 font-semibold uppercase tracking-wider text-left drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] ${
                          activeTouchServiceId === srv.id ? 'gap-4' : 'group-hover:gap-4'
                        }`}>
                          <span>Explore Specialties</span>
                          <ArrowRight className="w-3.5 h-3.5 text-[#E55B5B] transition-transform" />
                        </div>
                      </div>

                      {/* Massive faint icon in background */}
                      <div className={`absolute -right-8 -bottom-8 opacity-[0.04] text-white scale-150 transition-transform duration-700 pointer-events-none flex items-center justify-center ${
                        activeTouchServiceId === srv.id ? 'scale-125' : 'group-hover:scale-125'
                      }`}>
                        <IconComponent className="w-full h-full stroke-[1.2]" />
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            </div>
          </motion.section>
        </div>
      </div>

      {/* SECTION 4: WHAT WE DONE — each project pins and zooms in as you scroll */}
      <section id="home-portfolio" className="relative z-10 w-full mt-10 md:mt-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 md:px-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-4 md:mb-0">
          <div className="flex flex-col gap-4">
            <span className="text-xs font-mono tracking-widest text-red-500 uppercase font-bold">
              Our Work
            </span>
            <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-white uppercase leading-none">
              What We <span className="script-accent text-pop-sun text-[1.15em]">Done</span>
            </h2>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <PrimaryButton onClick={() => goToPage('events')} text="All Events" />
            <PrimaryButton onClick={() => goToPage('exhibition')} text="All Exhibitions" />
          </div>
        </div>

        <ZoomShowcase items={FEATURED_WORK} onOpen={openProject} />
      </section>

      {/* SECTION 4B: PARTY VIDEO → EXHIBITION PAGE
          Sources are tried in order: a self-hosted public/videos/party.mp4 if one is added, then the
          hotlinked Mixkit clip ("Front of a concert with the crowd dancing in slow motion", free under
          the Mixkit License), then the existing event reel if the remote file can't be reached. */}
      <section id="home-video" className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 my-16 md:my-24">
        <button
          type="button"
          onClick={() => goToPage('exhibition')}
          className="group relative block w-full h-[70vh] min-h-[420px] rounded-[2rem] lg:rounded-[3rem] overflow-hidden border border-white/15 cursor-pointer text-left"
          aria-label="See our exhibitions"
        >
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="./images/services/service_gala_1783333277608.webp"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105"
          >
            <source src="./videos/party.mp4" type="video/mp4" />
            <source src="https://assets.mixkit.co/videos/48513/48513-720.mp4" type="video/mp4" />
            <source src="https://assets.mixkit.co/videos/preview/mixkit-front-of-a-concert-with-the-crowd-dancing-in-slow-48513-large.mp4" type="video/mp4" />
            <source src="./images/hero-color.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/20" />

          <div className="absolute inset-x-0 bottom-0 p-6 sm:p-12 md:p-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <span className="font-mono text-[10px] sm:text-xs tracking-[0.3em] uppercase font-bold text-pop-mint">
                Exhibitions & Experiences
              </span>
              <h2 className="font-display text-3xl sm:text-5xl md:text-6xl font-bold text-white leading-[1.05] mt-4">
                We build the stand. <br className="hidden sm:block" />
                Then we throw the <span className="script-accent text-pop-pink text-[1.15em]">party.</span>
              </h2>
            </div>
            <span className="inline-flex items-center gap-2 font-mono text-[10px] sm:text-xs tracking-widest uppercase font-bold text-black bg-white rounded-full px-6 py-4 shrink-0 self-start md:self-auto group-hover:bg-pop-mint transition-colors">
              See Our Exhibitions <ArrowUpRight className="w-4 h-4" />
            </span>
          </div>
        </button>
      </section>

      {/* SECTION 5: CLIENT LOGOS INFINITE SCROLLER */}
      <section id="home-partners" className="py-10 md:py-20 relative z-20 w-full overflow-hidden max-w-7xl mx-auto my-10 md:my-20 border border-white/40 rounded-[2rem] lg:rounded-[3rem] shadow-[0_0_30px_rgba(255,255,255,0.08)]">
        <div className="max-w-7xl mx-auto px-6 mb-10 text-center flex flex-col items-center drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">
          <span className="text-xs font-mono tracking-[0.2em] text-red-500 uppercase font-bold mb-2 [text-shadow:0_2px_4px_rgba(0,0,0,0.8)]">
            Trusted By
          </span>
          <h2 className="font-display text-2xl md:text-3xl font-extrabold text-white [text-shadow:0_4px_16px_rgba(0,0,0,1)]">
            The Brands That <span className="script-accent text-pop-sky text-[1.15em]">Chose Us</span>
          </h2>
          <p className="text-neutral-300 text-xs font-mono mt-1 font-medium [text-shadow:0_2px_8px_rgba(0,0,0,1)]">
            Leading organisations across UAE and the GCC region.
          </p>
        </div>

        {/* Continuous marquee layout */}
        <div className="w-full relative py-7 flex items-center" id="logo-slider-viewport">

          <div 
            ref={logosRef}
            onMouseEnter={() => setIsLogosHovered(true)}
            onMouseLeave={() => setIsLogosHovered(false)}
            className="animate-client-logos flex items-center"
          >
            {/* Round 1 */}
            {CLIENT_LOGOS.map((client) => (
              <div
                key={`slide1-${client.id}`}
                data-text={client.name}
                className="logo-item w-28 sm:w-48 mx-3 sm:mx-4.5 shrink-0 h-14 sm:h-18 bg-[#dc4d49] hover:bg-[#c5413d] border border-red-400/20 hover:border-red-300/40 rounded-xl px-2 sm:px-4 flex items-center justify-center transition-all duration-300"
              >
                <img
                  src={client.logoUrl}
                  alt={client.name}
                  referrerPolicy="no-referrer"
                  className="max-w-full max-h-8 sm:max-h-12 object-contain filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.15)] select-none pointer-events-none mix-blend-multiply grayscale contrast-[20]"
                />
              </div>
            ))}
            {/* Round 2 duplicate for continuous flow */}
            {CLIENT_LOGOS.map((client) => (
              <div
                key={`slide2-${client.id}`}
                data-text={client.name}
                className="logo-item w-28 sm:w-48 mx-3 sm:mx-4.5 shrink-0 h-14 sm:h-18 bg-[#dc4d49] hover:bg-[#c5413d] border border-red-400/20 hover:border-red-300/40 rounded-xl px-2 sm:px-4 flex items-center justify-center transition-all duration-300"
              >
                <img
                  src={client.logoUrl}
                  alt={client.name}
                  referrerPolicy="no-referrer"
                  className="max-w-full max-h-8 sm:max-h-12 object-contain filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.15)] select-none pointer-events-none mix-blend-multiply grayscale contrast-[20]"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6: CLIENT TESTIMONIALS */}
      <motion.section
        ref={testimonialsRef}
        style={isMobile ? {
          opacity: 1,
          scale: mobileTestimonialsScale,
          rotateX: mobileTestimonialsRotateX,
          y: mobileTestimonialsY,
          transformPerspective: 1200
        } : {
          x: testimonialsX,
          rotateY: testimonialsRotateY,
          opacity: testimonialsOpacity,
          transformPerspective: 1400,
        }}
        id="home-testimonials"
        className="py-20 md:py-24 max-w-7xl mx-auto px-6 sm:px-12 md:px-16 relative z-10 w-full my-20 border border-white/40 rounded-[2rem] lg:rounded-[3rem] shadow-[0_0_30px_rgba(255,255,255,0.08)]"
      >
        {/* Soft backlight spot */}
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-red-650/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="text-center mb-10 flex flex-col items-center relative z-10 drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">
          <span className="text-xs font-mono tracking-widest text-red-500 uppercase font-bold [text-shadow:0_2px_4px_rgba(0,0,0,0.8)]">
            Client Voices
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-extrabold uppercase text-white mt-3 [text-shadow:0_4px_16px_rgba(0,0,0,1)]">
            Straight From The <span className="script-accent text-pop-mint text-[1.15em]">Source</span>
          </h2>
          <div className="w-12 h-[2px] bg-red-650 mt-4 rounded-full"></div>
        </div>

        <div className="relative z-10">
          <TestimonialsSlider />
        </div>
      </motion.section>

      {/* SECTION 7: CALL TO ACTION BOTTOM BANNER */}
      <section id="cta-bottom" className="py-24 border-t border-white/5 relative overflow-hidden z-20">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute bottom-[-100px] left-1/2 -translate-x-1/2 w-4/5 h-[300px] bg-red-650/10 rounded-full blur-[100px]"></div>
        </div>

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10 flex flex-col items-center drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">
          <Sparkles className="w-8 h-8 text-red-600 mb-6 animate-pulse" />
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black uppercase text-white tracking-tight leading-tight [text-shadow:0_4px_16px_rgba(0,0,0,1)]">
            Ready to Design <br className="sm:hidden" />
            Your Event <span className="script-accent text-pop-pink text-[1.15em]">Legacy?</span>
          </h2>
          <p className="mt-6 text-neutral-300 font-sans text-sm md:text-base leading-relaxed max-w-xl font-medium [text-shadow:0_2px_8px_rgba(0,0,0,1)]">
            Join Dubai's leading organizations. Complete our direct briefing questionnaire, estimate attendance, and receive a customized concept draft from our executive management board.
          </p>
          <div className="mt-10">
            <PrimaryButton
              onClick={() => setActivePage('contact')}
              text="Contact Us Today"
            />
          </div>
        </div>
      </section>

    </div>
  );
}