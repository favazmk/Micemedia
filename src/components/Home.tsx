/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
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
import { BRAND_INFO, CLIENT_LOGOS, PORTFOLIO_DATA, SERVICES_DATA } from '../data';
import TestimonialsSlider from './TestimonialsSlider';

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

export default function Home({ setActivePage, setSelectedServiceId, setSelectedPortfolioId }: HomeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const aboutRef = useRef<HTMLElement>(null);
  const servicesRef = useRef<HTMLElement>(null);
  const portfolioRef = useRef<HTMLElement>(null);
  const testimonialsRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [maxScroll, setMaxScroll] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      if (trackRef.current && trackRef.current.parentElement) {
        const trackWidth = trackRef.current.scrollWidth;
        const viewWidth = trackRef.current.parentElement.clientWidth;
        const style = window.getComputedStyle(trackRef.current.parentElement);
        const paddingLeft = parseFloat(style.paddingLeft) || 0;
        const paddingRight = parseFloat(style.paddingRight) || 0;
        const contentWidth = viewWidth - paddingLeft - paddingRight;
        setMaxScroll(Math.max(0, trackWidth - contentWidth));
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    
    const timer1 = setTimeout(handleResize, 100);
    const timer2 = setTimeout(handleResize, 500);
    const timer3 = setTimeout(handleResize, 1500);

    return () => {
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

  // Setup scroll listeners with a spring damping system for ultimate premium smoothness
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  const smoothHeroScroll = useSpring(heroScroll, { stiffness: 85, damping: 28, restDelta: 0.001 });

  // Hero calculations
  const heroScale = useTransform(smoothHeroScroll, [0, 1], [1, 0.82]);
  const heroRotateX = useTransform(smoothHeroScroll, [0, 1], [0, 16]);
  const heroY = useTransform(smoothHeroScroll, [0, 1], [0, 220]);
  const bgTextY = useTransform(smoothHeroScroll, [0, 1], ["0%", "85%"]);
  const bgTextOpacity = useTransform(smoothHeroScroll, [0, 0.8], [0.07, 0.01]);
  const cardsOpacity = useTransform(smoothHeroScroll, [0, 0.5, 0.9], [1, 1, 0]);

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
  const servicesScale = useTransform(smoothServicesViewportScroll, [0, 0.25, 0.75, 1], [0.82, 1, 1, 0.85]);
  const servicesRotateX = useTransform(smoothServicesViewportScroll, [0, 0.25, 0.75, 1], [15, 0, 0, -15]);
  const servicesY = useTransform(smoothServicesViewportScroll, [0, 0.25, 0.75, 1], [120, 0, 0, -120]);

  const { scrollYProgress: servicesScroll } = useScroll({
    target: servicesRef,
    offset: ["start start", "end end"]
  });
  const smoothServicesScroll = useSpring(servicesScroll, { stiffness: 75, damping: 25, restDelta: 0.001 });
  const servicesX = useTransform(smoothServicesScroll, [0, 1], [0, -maxScroll]);

  // Section 4 (Portfolio) calculations
  const { scrollYProgress: portfolioScroll } = useScroll({
    target: portfolioRef,
    offset: ["start end", "end start"]
  });
  const smoothPortfolioScroll = useSpring(portfolioScroll, { stiffness: 75, damping: 25, restDelta: 0.001 });
  const portfolioScale = useTransform(smoothPortfolioScroll, [0, 0.45, 0.9], [0.82, 1, 0.85]);
  const portfolioRotateX = useTransform(smoothPortfolioScroll, [0, 0.45, 0.9], [15, 0, -15]);
  const portfolioY = useTransform(smoothPortfolioScroll, [0, 0.45, 0.9], [120, 0, -120]);

  // Section 6 (Testimonials) calculations
  const { scrollYProgress: testimonialsScroll } = useScroll({
    target: testimonialsRef,
    offset: ["start end", "end start"]
  });
  const smoothTestimonialsScroll = useSpring(testimonialsScroll, { stiffness: 75, damping: 25, restDelta: 0.001 });
  const testimonialsScale = useTransform(smoothTestimonialsScroll, [0, 0.45, 0.9], [0.82, 1, 0.85]);
  const testimonialsRotateX = useTransform(smoothTestimonialsScroll, [0, 0.45, 0.9], [15, 0, -15]);
  const testimonialsY = useTransform(smoothTestimonialsScroll, [0, 0.45, 0.9], [120, 0, -120]);
  
  const handleServiceClick = (serviceId: string) => {
    if (setSelectedServiceId) {
      setSelectedServiceId(serviceId);
    }
    setActivePage('services');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePortfolioClick = (itemId: string) => {
    if (setSelectedPortfolioId) {
      setSelectedPortfolioId(itemId);
    }
    setActivePage('portfolio');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div ref={containerRef} className="flex flex-col w-full relative" id="homepage-root">
      
      {/* SECTION 1: HERO CONTAINER */}
      <section ref={heroRef} id="hero-section" className="relative min-h-screen flex items-center justify-center pt-32 pb-24 overflow-hidden [perspective:1200px]">
        {/* Cinematic Backdrop Spotlights */}
        <div className="absolute inset-0 z-0 bg-transparent pointer-events-none">
          {/* Spotlight 1: Center-Top Red dramatic glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[80vh] bg-gradient-to-b from-red-650/15 via-red-950/2 to-transparent rounded-full blur-[120px]"></div>
          {/* Spotlight 2: Stage light pillar effect - softened to avoid sharp lines */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[40px] md:w-[60px] h-[75vh] bg-gradient-to-b from-red-500/10 via-red-500/2 to-transparent blur-[8px]"></div>
          {/* Ambient dust overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff03_1px,transparent_1px)] [background-size:16px_16px] opacity-60"></div>
        </div>

        {/* Massive 3D Parallax Background Title Outline */}
        <motion.div
          style={{ y: bgTextY, opacity: bgTextOpacity, WebkitTextStroke: "1.5px rgba(200, 138, 115, 0.15)" }}
          className="absolute inset-0 flex items-center justify-center z-0 select-none pointer-events-none overflow-hidden"
        >
          <span className="font-display text-[15vw] font-black text-transparent uppercase tracking-[0.1em] leading-none whitespace-nowrap block select-none">
            MICE MEDIA
          </span>
        </motion.div>

        <motion.div
          style={{ scale: heroScale, rotateX: heroRotateX, y: heroY, transformPerspective: 1200 }}
          className="max-w-7xl mx-auto px-6 relative z-10 w-full text-center flex flex-col items-center [transform-style:preserve-3d]"
        >
          
          {/* Dynamic Entrance Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4.5 py-2 rounded-full bg-neutral-900/80 border border-red-500/20 backdrop-blur-md mb-8 shadow-xl shadow-red-950/10"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-650 animate-ping"></span>
            <span className="font-mono text-[10px] md:text-xs tracking-[0.2em] uppercase font-bold text-neutral-300">
              Dubai's Leading Corporate Event Agency
            </span>
          </motion.div>

          {/* Majestic Layered Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="font-display text-4xl sm:text-6xl md:text-8xl font-black tracking-tight text-white uppercase leading-[1.05] max-w-5xl"
          >
            Where Every <br />
            Event Becomes <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-600 to-amber-500 text-glow inline-block italic font-light tracking-wide normal-case py-1">
              A Legacy.
            </span>
          </motion.h1>

          {/* Sub-copy block */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-8 font-sans text-neutral-400 text-base md:text-xl leading-relaxed max-w-2xl"
          >
            From intimate boardroom summits to stadium-scale spectacles — we architect corporate experiences that move people, drive decisions, and outlast the moment.
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="mt-12 flex flex-col sm:flex-row gap-5 items-center justify-center w-full max-w-md relative z-40"
            id="hero-cta-group"
          >
            <GetStartedButton
              onClick={() => setActivePage('portfolio')}
              text="Explore Our Work"
              className="shadow-white/5"
            />
            <button
              onClick={() => setActivePage('contact')}
              className="w-full sm:w-auto bg-neutral-900 hover:bg-neutral-800 border border-white/10 text-white font-sans text-xs font-bold uppercase tracking-wider py-4 px-10 rounded-full transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer hover:border-red-500/40 hover:scale-105"
            >
              Start Your Event
            </button>
          </motion.div>

          {/* Advanced 3D Stage Deck projection */}
          <motion.div
            style={{ opacity: cardsOpacity }}
            className="relative w-full max-w-4xl h-[280px] sm:h-[350px] mt-24 flex items-center justify-center [perspective:1200px]"
            id="hologram-stage-canvas"
          >
            {/* Rotating Ring Base */}
            <motion.div
              style={{ rotateX: 75 }}
              animate={{ rotateZ: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              className="absolute top-1/2 left-1/2 w-[280px] h-[280px] sm:w-[480px] sm:h-[480px] -ml-[140px] -mt-[140px] sm:-ml-[240px] sm:-mt-[240px] border-2 border-dashed border-red-500/40 rounded-full z-0 pointer-events-none origin-center"
            ></motion.div>
            <motion.div
              style={{ rotateX: 75 }}
              animate={{ rotateZ: -360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute top-1/2 left-1/2 w-[200px] h-[200px] sm:w-[340px] sm:h-[340px] -ml-[100px] -mt-[100px] sm:-ml-[170px] sm:-mt-[170px] border border-red-500/25 rounded-full z-0 pointer-events-none origin-center"
            ></motion.div>
            <motion.div
              style={{ rotateX: 75 }}
              className="absolute top-1/2 left-1/2 w-[120px] h-[120px] sm:w-[240px] sm:h-[240px] -ml-[60px] -mt-[60px] sm:-ml-[120px] sm:-mt-[120px] bg-red-500/10 rounded-full blur-[40px] z-0 pointer-events-none"
            ></motion.div>

            {/* Floating, Tilted 3D holographic Cards (similar to Cinedaily's layout) */}
            <div className="absolute inset-0 flex items-center justify-center gap-3 sm:gap-8 pointer-events-auto [transform-style:preserve-3d] z-10">
              
              {/* Card 1: Left */}
              <motion.div
                style={{
                  y: useTransform(smoothHeroScroll, [0, 1], [0, -130])
                }}
                animate={{
                  rotateY: -20,
                  rotateX: 6,
                  z: 10,
                  scale: 1
                }}
                whileHover={{ 
                  scale: 1.08, 
                  rotateY: 0, 
                  rotateX: 12, 
                  z: 100
                }}
                onClick={() => setActivePage('portfolio')}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                className="w-[105px] sm:w-[220px] h-[180px] sm:h-[280px] bg-neutral-900/90 hover:bg-[#171717]/95 rounded-2xl border border-white/20 hover:border-red-500/60 p-3 sm:p-5 flex flex-col justify-between shadow-2xl shadow-black text-left cursor-pointer transition-colors duration-150"
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
                style={{
                  y: useTransform(smoothHeroScroll, [0, 1], [0, -240])
                }}
                animate={{
                  rotateX: 12,
                  z: 60,
                  scale: 1
                }}
                whileHover={{ 
                  scale: 1.08, 
                  rotateX: 12, 
                  z: 140
                }}
                onClick={() => setActivePage('services')}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                className="w-[125px] sm:w-[240px] h-[210px] sm:h-[310px] bg-neutral-900/95 hover:bg-[#171717]/95 rounded-2xl border border-red-500/25 hover:border-red-500/60 p-3 sm:p-5 flex flex-col justify-between shadow-2xl shadow-red-950/30 relative overflow-hidden text-left cursor-pointer transition-colors duration-150"
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
                    OUR SERVICES <span className="transform group-hover/link:translate-x-1 transition-transform">→</span>
                  </span>
                </div>
              </motion.div>

              {/* Card 3: Right */}
              <motion.div
                style={{
                  y: useTransform(smoothHeroScroll, [0, 1], [0, -130])
                }}
                animate={{
                  rotateY: 20,
                  rotateX: 6,
                  z: 10,
                  scale: 1
                }}
                whileHover={{ 
                  scale: 1.08, 
                  rotateY: 0, 
                  rotateX: 12, 
                  z: 100
                }}
                onClick={() => setActivePage('about')}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                className="w-[105px] sm:w-[220px] h-[180px] sm:h-[280px] bg-neutral-900/90 hover:bg-[#171717]/95 rounded-2xl border border-white/20 hover:border-red-500/60 p-3 sm:p-5 flex flex-col justify-between shadow-2xl shadow-black text-left cursor-pointer transition-colors duration-150"
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

            {/* Stage spotlights beams shooting up */}
            <div className="absolute bottom-12 left-1/4 w-[1px] h-[250px] bg-gradient-to-t from-red-500/20 to-transparent blur-[1px]"></div>
            <div className="absolute bottom-12 right-1/4 w-[1px] h-[250px] bg-gradient-to-t from-red-500/20 to-transparent blur-[1px]"></div>
          </motion.div>

        </motion.div>

        {/* Decorative Spotlight Visual Ring */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 h-[1px] bg-gradient-to-r from-transparent via-red-500/30 to-transparent"></div>
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
          className="uppercase font-display font-black text-xs sm:text-sm tracking-[0.2em] text-white flex items-center whitespace-nowrap gap-10 cursor-grab select-none active:cursor-grabbing touch-none"
        >
          {/* Block 1 */}
          <div className="flex items-center gap-8.5 shrink-0 px-2">
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
          <div className="flex items-center gap-8.5 shrink-0 px-2">
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
          <div className="flex items-center gap-8.5 shrink-0 px-2">
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

      {/* SECTION 2: ABOUT SUMMARY */}
      <motion.section
        ref={aboutRef}
        style={{
          scale: aboutScale,
          rotateX: aboutRotateX,
          y: aboutY,
          transformPerspective: 1200
        }}
        id="home-about"
        className="py-20 md:py-24 max-w-7xl mx-auto px-6 sm:px-12 md:px-16 relative z-10 w-full glass-panel-heavy rounded-[2rem] md:rounded-[4rem] border border-white/5 bg-gradient-to-b from-neutral-900/40 via-neutral-950/80 to-black/95 my-20 shadow-2xl overflow-hidden"
      >
        {/* Soft glowing ambient spots to enrich background */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-red-650/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-655/3 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Title column */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <span className="text-xs font-mono tracking-widest text-red-500 uppercase font-bold">
              About MICE MEDIA
            </span>
            <h2 className="font-display text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
              We Don't Just <br />Plan Events — We <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-600 to-amber-500 text-glow inline-block py-1">Engineer Moments.</span>
            </h2>
            <p className="text-neutral-400 font-sans text-sm md:text-base leading-relaxed mt-4">
              Born from a conviction that the events industry deserved better — more precision, more creativity, more soul — MICE MEDIA was built to raise the bar. We operate out of Dubai, with a reach that extends across UAE and the wider GCC region.
            </p>
            <div className="mt-6">
              <button
                onClick={() => setActivePage('about')}
                className="inline-flex items-center gap-2 group text-white hover:text-red-500 font-mono text-sm tracking-wider uppercase font-semibold transition-colors cursor-pointer"
              >
                Discover Our Story 
                <ArrowRight className="w-4 h-4 text-red-600 group-hover:translate-x-1.5 transition-transform" />
              </button>
            </div>
          </div>

          {/* Stats & Promise Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full h-full">
            
            {/* Promise Card - spans 2 columns */}
            <div className="sm:col-span-2 glass-card rounded-2xl p-6.5 border border-white/5 relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 rounded-full blur-2xl"></div>
              <Sparkles className="w-6 h-6 text-red-600 mb-4" />
              <div>
                <h3 className="font-display text-lg font-bold text-white mb-2">The Uncompromising Standard</h3>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  Every project that leaves our team carries one non-negotiable: it has to be extraordinary. No exceptions. No compromises. Not for any budget, deadline, or brief.
                </p>
              </div>
            </div>

            {/* Info Box 1 */}
            <div className="glass-card rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between hover:border-red-500/20 group">
              <div className="flex justify-between items-start mb-6">
                <Trophy className="w-5 h-5 text-red-500 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-mono text-neutral-600 group-hover:text-neutral-400">END-TO-END DELIVERY</span>
              </div>
              <div>
                <span className="block font-display text-lg font-black text-white mb-1 group-hover:text-red-500 transition-colors uppercase">
                  Seamless Setup
                </span>
                <span className="text-xs font-mono tracking-wide text-neutral-400 normal-case">
                  Venue sourcing, custom booths, registration, and premium AV.
                </span>
              </div>
            </div>

            {/* Info Box 2 */}
            <div className="glass-card rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between hover:border-red-500/20 group">
              <div className="flex justify-between items-start mb-6">
                <Users className="w-5 h-5 text-red-500 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-mono text-neutral-600 group-hover:text-neutral-400">DIRECT SUPERVISION</span>
              </div>
              <div>
                <span className="block font-display text-lg font-black text-white mb-1 group-hover:text-red-500 transition-colors uppercase">
                  Dedicated Board
                </span>
                <span className="text-xs font-mono tracking-wide text-neutral-400 normal-case">
                  Our core team manages your requests seamlessly on-site.
                </span>
              </div>
            </div>

          </div>
        </div>
      </motion.section>

      {/* SECTION 3: FEATURED SERVICES */}
      <div
        ref={servicesRef}
        className="relative h-[350vh] w-full"
      >
        <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
          <motion.section
            style={{
              scale: servicesScale,
              rotateX: servicesRotateX,
              y: servicesY,
              transformPerspective: 1200
            }}
            id="home-services"
            className="w-full max-w-7xl mx-auto px-6 sm:px-12 md:px-16 py-8 sm:py-12 md:py-20 relative z-10 glass-panel-heavy rounded-[2rem] md:rounded-[4rem] border border-white/5 bg-gradient-to-b from-neutral-900/40 via-neutral-950/80 to-black/95 shadow-2xl flex flex-col justify-between overflow-hidden"
          >
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-red-650/5 rounded-full blur-[100px] pointer-events-none"></div>
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 relative z-10">
              <div className="flex flex-col gap-2">
                <span className="text-xs font-mono tracking-widest text-[#E55B5B] uppercase font-bold">
                  WHAT WE DO
                </span>
                <h2 className="font-display text-3xl md:text-[40px] font-semibold text-white tracking-tight leading-none">
                  Every Event. Every Scale.
                </h2>
              </div>
              <button
                onClick={() => setActivePage('services')}
                className="font-mono text-xs px-6 py-3 border border-white/10 rounded-full hover:bg-white/5 transition-all flex items-center gap-2 cursor-pointer text-white tracking-widest font-semibold uppercase hover:border-red-500/30 duration-300"
              >
                ALL DISCIPLINES
                <ArrowUpRight className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Horizontal Scroll Layout with beautiful cards */}
            <div className="overflow-hidden w-full relative z-10 -mx-6 px-6 sm:-mx-12 sm:px-12 md:-mx-16 md:px-16">
              <motion.div
                ref={trackRef}
                style={{ x: servicesX }}
                className="flex gap-6 w-max"
              >
                {SERVICES_DATA.map((srv) => {
                  const IconComponent = serviceIconMap[srv.iconName] || Sparkles;
                  return (
                    <div
                      key={srv.id}
                      onClick={() => handleServiceClick(srv.id)}
                      className="group relative bg-[#121212]/90 border border-white/5 p-8 sm:p-10 overflow-hidden rounded-3xl cursor-pointer hover:-translate-y-2 hover:border-[#E55B5B]/40 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col justify-between min-h-[320px] sm:min-h-[350px] w-[280px] sm:w-[350px] shrink-0 shadow-2xl"
                    >
                      {/* Faint ambient light glow */}
                      <div className="absolute -top-10 -right-10 w-24 h-24 bg-red-600/5 rounded-full blur-2xl group-hover:bg-red-600/15 duration-300 pointer-events-none"></div>
                      
                      <div className="relative z-10 flex flex-col justify-between h-full">
                        <div>
                          <span className="font-mono text-xs tracking-widest text-neutral-500 block mb-10 uppercase">
                            SERVICE #{srv.number}
                          </span>
                          <h3 className="font-display text-xl sm:text-2xl font-extrabold text-white mb-5 leading-snug group-hover:text-red-500 transition-colors">
                            {srv.title}
                          </h3>
                          <p className="text-neutral-400 font-sans text-sm leading-relaxed mb-8 min-h-[72px]">
                            {srv.description}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 font-mono text-xs text-[#E55B5B] group-hover:gap-4 transition-all duration-300 font-semibold uppercase tracking-wider text-left">
                          <span>Explore Specialties</span>
                          <ArrowRight className="w-3.5 h-3.5 text-[#E55B5B] transition-transform" />
                        </div>
                      </div>

                      {/* Massive faint icon in background */}
                      <div className="absolute -right-8 -bottom-8 opacity-[0.03] text-white scale-150 transition-transform duration-700 group-hover:scale-125 w-40 h-40 pointer-events-none flex items-center justify-center">
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

      {/* SECTION 4: RECENT PORTFOLIO EXHIBITS (3 items highlight) */}
      <motion.section
        ref={portfolioRef}
        style={{
          scale: portfolioScale,
          rotateX: portfolioRotateX,
          y: portfolioY,
          transformPerspective: 1200
        }}
        id="home-portfolio"
        className="py-20 md:py-24 max-w-7xl mx-auto px-6 sm:px-12 md:px-16 relative z-10 w-full glass-panel-heavy rounded-[2rem] md:rounded-[4rem] border border-white/5 bg-gradient-to-b from-neutral-900/40 via-neutral-950/80 to-black/95 my-20 shadow-2xl overflow-hidden"
      >
        {/* Ambient backlighting blobs */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-red-650/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16 relative z-10">
          <div className="flex flex-col gap-4">
            <span className="text-xs font-mono tracking-widest text-red-500 uppercase font-bold">
              Our Work
            </span>
            <h2 className="font-display text-3xl md:text-5xl font-extrabold tracking-tight text-white uppercase leading-none">
              Events That <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-600 to-amber-500 text-glow inline-block py-1">Speak.</span>
            </h2>
          </div>
          <button
            onClick={() => setActivePage('portfolio')}
            className="inline-flex items-center gap-1 text-red-500 hover:text-white font-mono text-xs uppercase tracking-wider font-bold transition-colors cursor-pointer group"
          >
            All Case Studies
            <ArrowRight className="w-4 h-4 text-red-600 group-hover:translate-x-1.5 transition-transform" />
          </button>
        </div>

        {/* 3 Premium highlights with cards - Interactive CSS Fan-out deck */}
        <div className="flex flex-col items-center justify-center py-12 relative z-10 w-full overflow-visible" id="home-portfolio-deck">
          <div className="portfolio-deck-container w-full max-w-lg sm:max-w-4xl min-h-[380px] sm:min-h-[460px]">
            {PORTFOLIO_DATA.slice(0, 3).map((item, index) => {
              const IconComponent = index === 0 ? Users : index === 1 ? Sparkles : Trophy;
              return (
                <div
                  key={item.id}
                  onClick={() => handlePortfolioClick(item.id)}
                  className="portfolio-deck-card w-[180px] sm:w-[260px] md:w-[285px] h-[260px] sm:h-[350px] md:h-[385px] flex flex-col overflow-hidden cursor-pointer group/card select-none"
                >
                  {/* Image Frame inside the glass card */}
                  <div className="relative w-[92%] h-[50%] mx-auto mt-3 rounded-xl overflow-hidden bg-neutral-950/40 border border-white/5 flex items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-neutral-950/20 to-transparent z-10 opacity-90"></div>
                    <img
                      src={item.image}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="absolute inset-0 w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-500 ease-out"
                    />
                    
                    {/* Centered Floating Icon mimicking user's code */}
                    <div className="relative z-20 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-lg group-hover/card:scale-110 group-hover/card:bg-red-650/20 group-hover/card:border-red-500/30 transition-all duration-300">
                      <IconComponent className="w-5 h-5 sm:w-6.5 sm:h-6.5 text-white group-hover/card:text-red-500 transition-colors" />
                    </div>

                    {/* Tag label */}
                    <span className="absolute top-2.5 left-2.5 z-20 px-2.5 py-0.5 rounded-full text-[8px] sm:text-[9px] font-mono font-bold tracking-wider uppercase bg-red-650 text-white shadow-sm">
                      {item.category}
                    </span>
                  </div>

                  {/* Bottom Text Info & View Case Study strip mimicking .glass::before */}
                  <div className="flex-1 flex flex-col justify-between p-4.5 relative z-20">
                    <div className="text-left">
                      <h3 className="font-display text-sm sm:text-base font-bold text-white group-hover/card:text-red-500 transition-colors duration-300 truncate">
                        {item.title}
                      </h3>
                      <p className="text-neutral-400 text-[10px] sm:text-xs mt-1 sm:mt-1.5 line-clamp-2 leading-relaxed">
                        {item.caption}
                      </p>
                    </div>

                    {/* Styled bottom strip bar */}
                    <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-left">
                      <span className="text-[9px] sm:text-[10px] font-mono tracking-wider uppercase text-neutral-500 group-hover/card:text-neutral-400 transition-colors">
                        {item.tag}
                      </span>
                      <div className="flex items-center gap-1 text-[9px] sm:text-[10px] font-mono uppercase font-bold text-red-500 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300">
                        <span>Case Study</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* SECTION 5: CLIENT LOGOS INFINITE SCROLLER */}
      <section id="home-partners" className="py-20 bg-neutral-950 border-y border-white/5 relative z-20 w-full overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-10 text-center flex flex-col items-center">
          <span className="text-xs font-mono tracking-[0.2em] text-red-500 uppercase font-bold mb-2">
            Trusted By
          </span>
          <h2 className="font-display text-2xl md:text-3xl font-extrabold text-white">
            The Brands That Chose Us
          </h2>
          <p className="text-neutral-500 text-xs font-mono mt-1">
            Leading organisations across UAE and the GCC region.
          </p>
        </div>

        {/* Continuous marquee layout */}
        <div className="w-full relative py-7 flex items-center bg-neutral-950" id="logo-slider-viewport">
          {/* Edge masking gradients for smooth premium transition */}
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-neutral-950 to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-neutral-950 to-transparent z-10 pointer-events-none"></div>

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
                className="logo-item w-40 sm:w-48 mx-4.5 shrink-0 h-18 bg-[#dc4d49] hover:bg-[#c5413d] border border-red-400/20 hover:border-red-300/40 rounded-xl px-4 transition-all duration-300"
              >
                <img
                  src={client.logoUrl}
                  alt={client.name}
                  referrerPolicy="no-referrer"
                  className="max-w-full max-h-12 object-contain filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.15)] select-none pointer-events-none mix-blend-multiply grayscale contrast-[20]"
                />
              </div>
            ))}
            {/* Round 2 duplicate for continuous flow */}
            {CLIENT_LOGOS.map((client) => (
              <div
                key={`slide2-${client.id}`}
                data-text={client.name}
                className="logo-item w-40 sm:w-48 mx-4.5 shrink-0 h-18 bg-[#dc4d49] hover:bg-[#c5413d] border border-red-400/20 hover:border-red-300/40 rounded-xl px-4 transition-all duration-300"
              >
                <img
                  src={client.logoUrl}
                  alt={client.name}
                  referrerPolicy="no-referrer"
                  className="max-w-full max-h-12 object-contain filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.15)] select-none pointer-events-none mix-blend-multiply grayscale contrast-[20]"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6: TESTIMONIALS (Client Quotes Slider) */}
      <motion.section
        ref={testimonialsRef}
        style={{
          scale: testimonialsScale,
          rotateX: testimonialsRotateX,
          y: testimonialsY,
          transformPerspective: 1200
        }}
        id="home-testimonials"
        className="py-20 md:py-24 max-w-7xl mx-auto px-6 sm:px-12 md:px-16 relative z-10 w-full glass-panel-heavy rounded-[2rem] md:rounded-[4rem] border border-white/5 bg-gradient-to-b from-neutral-900/40 via-neutral-950/80 to-black/95 my-20 shadow-2xl overflow-hidden"
      >
        {/* Soft backlight spot */}
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-red-650/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="text-center mb-10 flex flex-col items-center relative z-10">
          <span className="text-xs font-mono tracking-widest text-red-500 uppercase font-bold">
            Client Voices
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-extrabold uppercase text-white mt-3">
            Straight From The Source
          </h2>
          <div className="w-12 h-[2px] bg-red-650 mt-4 rounded-full"></div>
        </div>

        <div className="relative z-10">
          <TestimonialsSlider />
        </div>
      </motion.section>

      {/* SECTION 7: CALL TO ACTION BOTTOM BANNER */}
      <section id="cta-bottom" className="py-24 border-t border-white/5 relative overflow-hidden bg-neutral-950">
        <div className="absolute inset-0 z-0 bg-black pointer-events-none">
          <div className="absolute bottom-[-100px] left-1/2 -translate-x-1/2 w-4/5 h-[300px] bg-red-650/10 rounded-full blur-[100px]"></div>
        </div>

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10 flex flex-col items-center">
          <Sparkles className="w-8 h-8 text-red-600 mb-6 animate-pulse" />
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black uppercase text-white tracking-tight leading-tight">
            Ready to Design <br className="sm:hidden" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-600 to-amber-500 text-glow inline-block py-1">Your Event Legacy?</span>
          </h2>
          <p className="mt-6 text-neutral-400 font-sans text-sm md:text-base leading-relaxed max-w-xl">
            Join Dubai's leading organizations. Complete our direct briefing questionnaire, estimate attendance, and receive a customized concept draft from our executive management board.
          </p>
          <div className="mt-10">
            <button
              onClick={() => setActivePage('contact')}
              className="relative overflow-hidden group cursor-pointer bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white font-sans text-xs font-bold uppercase tracking-wider py-4 px-10 rounded-full shadow-lg shadow-red-700/20 hover:shadow-red-600/30 transition-all duration-300 flex items-center gap-2 group hover:scale-105 border border-red-500/30"
            >
              <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
              Get Custom Quotation Now
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
