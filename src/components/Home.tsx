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
import { BRAND_INFO, CLIENT_LOGOS, PORTFOLIO_DATA, SERVICES_DATA } from '../data';
import TestimonialsSlider from './TestimonialsSlider';
import EventScroll from './EventScroll';

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

// --- ServiceBackground for dynamic crossfading image sequence ---
const ServiceBackground = ({ image, index, total, scrollYProgress }: { image?: string; index: number; total: number; scrollYProgress: any; key?: string }) => {
  // calculate when this index should be visible
  const rangeStart = (index - 0.5) / (total - 1);
  const rangeMid = index / (total - 1);
  const rangeEnd = (index + 0.5) / (total - 1);
  
  // Use clamping to ensure 0/1 range logic is handled properly
  const opacity = useTransform(scrollYProgress, 
    [Math.max(0, rangeStart), rangeMid, Math.min(1, rangeEnd)], 
    [index === 0 ? 1 : 0, 1, index === total - 1 ? 1 : 0]
  );
  
  const scale = useTransform(scrollYProgress, 
    [Math.max(0, rangeStart), Math.min(1, rangeEnd)], 
    [1.05, 1.15]
  );
  
  if (!image) return null;
  
  return (
    <motion.div 
      className="absolute inset-0 z-0 bg-cover bg-center transition-all duration-300"
      style={{ backgroundImage: `url(${image})`, opacity, scale }}
    />
  );
};

export default function Home({
 setActivePage, setSelectedServiceId, setSelectedPortfolioId }: HomeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const heroRef = useRef<HTMLElement>(null);
  const aboutRef = useRef<HTMLElement>(null);
  const servicesRef = useRef<HTMLElement>(null);
  const portfolioRef = useRef<HTMLElement>(null);
  const testimonialsRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [maxScroll, setMaxScroll] = useState(0);

  // Mobile specific states
  const [isMobile, setIsMobile] = useState(false);
  const [activeTouchHeroCardId, setActiveTouchHeroCardId] = useState<string | null>(null);
  const [activeTouchPortfolioId, setActiveTouchPortfolioId] = useState<string | null>(null);
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
  const heroY = useTransform(smoothHeroScroll, [0, 1], [0, 220]);
  const headingOpacity = useTransform(smoothHeroScroll, [0, 0.4, 0.7], [1, 1, 0]);
  const headingScale = useTransform(smoothHeroScroll, [0, 0.4, 0.8], [1, 0.9, 0.6]);
  const headingBlurValue = useTransform(smoothHeroScroll, [0, 0.4, 0.8], [0, 0, 20]);
  const headingBlur = useTransform(headingBlurValue, (val) => `blur(${val}px)`);
  const headingRotateX = useTransform(smoothHeroScroll, [0, 0.4, 0.8], [0, 0, 45]);
  const headingY = useTransform(smoothHeroScroll, [0, 0.4, 0.8], [0, -50, -150]);
  const bgTextY = useTransform(smoothHeroScroll, [0, 1], ["0%", "85%"]);
  const bgTextOpacity = useTransform(smoothHeroScroll, [0, 0.8], [0.07, 0.01]);
  const cardsOpacity = useTransform(smoothHeroScroll, [0, 0.5, 0.9], [1, 1, 0]);
  const heroCard1Y = useTransform(smoothHeroScroll, [0, 1], [0, -130]);
  const heroCard2Y = useTransform(smoothHeroScroll, [0, 1], [0, -240]);
  const heroCard3Y = useTransform(smoothHeroScroll, [0, 1], [0, -130]);

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
  const servicesX = useTransform(smoothServicesScroll, [0, 1], [0, -maxScroll]);

  // Section 4 (Portfolio) calculations
  const { scrollYProgress: portfolioScroll } = useScroll({
    target: portfolioRef,
    offset: ["start end", "end start"]
  });
  const smoothPortfolioScroll = useSpring(portfolioScroll, { stiffness: 75, damping: 25, restDelta: 0.001 });
  const portfolioScale = useTransform(smoothPortfolioScroll, [0, 0.25, 0.75, 1], [1.4, 1, 1, 0.6]);
  const portfolioOpacity = useTransform(smoothPortfolioScroll, [0, 0.25, 0.75, 1], [0, 1, 1, 0]);
  const portfolioBlurValue = useTransform(smoothPortfolioScroll, [0, 0.25, 0.75, 1], [40, 0, 0, 30]);
  const portfolioBlur = useTransform(portfolioBlurValue, (v) => `blur(${v}px)`);
  const portfolioY = useTransform(smoothPortfolioScroll, [0, 0.25, 0.75, 1], [200, 0, 0, -200]);

  const mobilePortfolioScale = useTransform(smoothPortfolioScroll, [0, 0.45, 0.9], [0.82, 1, 0.85]);
  const mobilePortfolioRotateX = useTransform(smoothPortfolioScroll, [0, 0.45, 0.9], [15, 0, -15]);
  const mobilePortfolioY = useTransform(smoothPortfolioScroll, [0, 0.45, 0.9], [120, 0, -120]);

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
  




  const handlePortfolioClick = (itemId: string) => {
    if (isMobile && activeTouchPortfolioId !== itemId) {
      setActiveTouchPortfolioId(itemId);
      setActiveTouchServiceId(null);
      return;
    }
    if (setSelectedPortfolioId) {
      setSelectedPortfolioId(itemId);
    }
    setActivePage('portfolio');
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
      setActiveTouchPortfolioId(null);
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
      
      {/* Global Canvas Sequence */}
      <EventScroll scrollContainerRef={containerRef} />

      {/* SECTION 1: HERO CONTAINER */}
      <section ref={heroRef} id="hero-section" className="relative min-h-screen flex items-center justify-center pt-32 pb-10 md:pb-24 overflow-hidden [perspective:1200px]">
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
            style={{ y: heroY, transformPerspective: 1200 }}
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
          <motion.div
            style={isMobile ? { opacity: 1, scale: 1, filter: "none", rotateX: 0, y: 0 } : { 
              opacity: headingOpacity, 
              scale: headingScale, 
              filter: headingBlur, 
              rotateX: headingRotateX, 
              y: headingY,
            }}
            className="w-full flex justify-center [transform-style:preserve-3d]"
          >
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
          </motion.div>


          {/* Action CTAs */}
          <motion.div 
            style={isMobile ? { opacity: 1, scale: 1, filter: "none", rotateX: 0, y: 0 } : { 
              opacity: headingOpacity, 
              scale: headingScale, 
              filter: headingBlur, 
              rotateX: headingRotateX, 
              y: headingY,
            }}
            className="w-full flex justify-center [transform-style:preserve-3d]"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.45 }}
              className="mt-12 flex flex-col sm:flex-row gap-3 sm:gap-5 items-center justify-center w-full max-w-md relative z-40"
              id="hero-cta-group"
            >
              <GetStartedButton
                onClick={() => setActivePage('portfolio')}
                text="Explore Our Work"
                className="shadow-white/5 whitespace-nowrap text-[10px] sm:text-xs px-2 sm:px-8 flex-1 w-full justify-center"
              />
              <PrimaryButton
                onClick={() => setActivePage('contact')}
                text="Start Your Event"
                className="whitespace-nowrap text-[10px] sm:text-xs px-2 sm:px-8 flex-1 w-full justify-center"
              />
            </motion.div>
          </motion.div>

          {/* Advanced 3D Stage Deck projection */}
          <motion.div
            style={isMobile ? { opacity: 1 } : { opacity: cardsOpacity }}
            className="relative w-full max-w-4xl h-[280px] sm:h-[350px] mt-16 sm:mt-24 flex items-center justify-center [perspective:1200px]"
            id="hologram-stage-canvas"
          >
            {/* Background elements removed as per user request */}

            {/* Floating, Tilted 3D holographic Cards (similar to Cinedaily's layout) */}
            <div className="absolute inset-0 flex items-center justify-center gap-3 sm:gap-8 pointer-events-auto [transform-style:preserve-3d] z-10">
              
              {/* Card 1: Left */}
              <motion.div
                style={isMobile ? { y: 0 } : {
                  y: heroCard1Y
                }}
                animate={{
                  rotateY: isMobile ? (activeTouchHeroCardId === 'portfolio' ? 0 : -10) : -20,
                  rotateX: isMobile ? (activeTouchHeroCardId === 'portfolio' ? 12 : 6) : 6,
                  z: isMobile ? (activeTouchHeroCardId === 'portfolio' ? 60 : 10) : 10,
                  scale: 1
                }}
                whileHover={{ 
                  scale: 1.08, 
                  rotateY: 0, 
                  rotateX: 12, 
                  z: 100
                }}
                onClick={() => handleHeroCardClick('portfolio')}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                className={`w-[105px] sm:w-[220px] h-[180px] sm:h-[280px] bg-neutral-900/90 rounded-2xl border p-3 sm:p-5 flex flex-col justify-between shadow-2xl shadow-black text-left cursor-pointer transition-colors duration-150 ${
                  activeTouchHeroCardId === 'portfolio' ? 'bg-[#171717]/95 border-red-500/60 z-50' : 'hover:bg-[#171717]/95 border-white/20 hover:border-red-500/60'
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
                style={isMobile ? { y: 0 } : {
                  y: heroCard2Y
                }}
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
                    OUR SERVICES <span className="transform group-hover/link:translate-x-1 transition-transform">→</span>
                  </span>
                </div>
              </motion.div>

              {/* Card 3: Right */}
              <motion.div
                style={isMobile ? { y: 0 } : {
                  y: heroCard3Y
                }}
                animate={{
                  rotateY: isMobile ? (activeTouchHeroCardId === 'about' ? 0 : 10) : 20,
                  rotateX: isMobile ? (activeTouchHeroCardId === 'about' ? 12 : 6) : 6,
                  z: isMobile ? (activeTouchHeroCardId === 'about' ? 60 : 10) : 10,
                  scale: 1
                }}
                whileHover={{ 
                  scale: 1.08, 
                  rotateY: 0, 
                  rotateX: 12, 
                  z: 100
                }}
                onClick={() => handleHeroCardClick('about')}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                className={`w-[105px] sm:w-[220px] h-[180px] sm:h-[280px] bg-neutral-900/90 rounded-2xl border p-3 sm:p-5 flex flex-col justify-between shadow-2xl shadow-black text-left cursor-pointer transition-colors duration-150 ${
                  activeTouchHeroCardId === 'about' ? 'bg-[#171717]/95 border-red-500/60 z-50' : 'hover:bg-[#171717]/95 border-white/20 hover:border-red-500/60'
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
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-600 to-amber-500 text-glow inline-block py-1 drop-shadow-xl">Extraordinary Moments.</span>
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
              onClick={() => setActivePage('about')}
              text="Discover Our Story"
            />
          </div>

        </div>
      </motion.section>

      {/* SECTION 3: FEATURED SERVICES */}
      <div
        ref={servicesRef}
        className={`relative w-full ${isMobile ? 'h-auto' : 'h-[350vh]'}`}
      >
        <div className={`w-full flex items-center justify-center ${isMobile ? 'relative py-10 flex-col' : 'overflow-hidden sticky top-0 h-screen'}`}>
          <motion.section
            style={isMobile ? {
              opacity: 1,
              filter: "none",
              scale: mobileServicesScale,
              rotateX: mobileServicesRotateX,
              y: mobileServicesY,
              transformPerspective: 1200
            } : {
              scale: servicesScale,
              rotateY: servicesRotateY,
              opacity: servicesOpacity,
              filter: servicesBlur,
              transformPerspective: 1200
            }}
            id="home-services"
            className="w-full max-w-7xl mx-auto px-6 sm:px-12 md:px-16 py-8 sm:py-12 md:py-20 relative z-10 flex flex-col justify-between border border-white/40 rounded-[2rem] lg:rounded-[3rem] mt-10 shadow-[0_0_50px_rgba(255,255,255,0.05)] overflow-hidden"
          >
            {/* Jaw-Dropping Image Sequence Backgrounds */}
            {!isMobile && SERVICES_DATA.map((srv, index) => (
              <ServiceBackground 
                key={`bg-${srv.id}`}
                image={srv.image}
                index={index}
                total={SERVICES_DATA.length}
                scrollYProgress={smoothServicesScroll}
              />
            ))}
            
            {/* Deep overlay to ensure text remains highly readable over images */}
            {!isMobile && (
              <>
                <div className="absolute inset-0 z-0 bg-gradient-to-t from-black/90 via-black/60 to-black/90 mix-blend-multiply pointer-events-none"></div>
                <div className="absolute inset-0 z-0 bg-black/40 backdrop-blur-[2px] pointer-events-none"></div>
              </>
            )}

            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-red-650/15 rounded-full blur-[120px] pointer-events-none z-0"></div>
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 relative z-10 drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">
              <div className="flex flex-col gap-2">
                <span className="text-xs font-mono tracking-widest text-[#E55B5B] uppercase font-bold [text-shadow:0_2px_4px_rgba(0,0,0,0.8)]">
                  WHAT WE DO
                </span>
                <h2 className="font-display text-3xl md:text-[40px] font-semibold text-white tracking-tight leading-none [text-shadow:0_4px_16px_rgba(0,0,0,1)]">
                  Every Event. Every Scale.
                </h2>
              </div>
              <button
                onClick={() => setActivePage('services')}
                className="font-mono text-xs px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full hover:bg-white/20 transition-all flex items-center gap-2 cursor-pointer text-white tracking-widest font-bold uppercase hover:border-white/40 hover:-translate-y-1 duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.5)] group"
              >
                ALL DISCIPLINES
                <ArrowUpRight className="w-4 h-4 text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>

            {/* Horizontal Scroll Layout with beautiful cards */}
            <div className={`w-full relative z-10 ${isMobile ? 'flex flex-col gap-6 mt-4' : 'overflow-hidden'}`}>
              <motion.div
                ref={trackRef}
                style={isMobile ? { x: 0 } : { x: servicesX }}
                className={isMobile ? 'flex flex-col gap-6 w-full' : 'flex gap-6 w-max'}
              >
                {(isMobile ? SERVICES_DATA.slice(0, 3) : SERVICES_DATA).map((srv) => {
                  const IconComponent = serviceIconMap[srv.iconName] || Sparkles;
                  return (
                    <div
                      key={srv.id}
                      onClick={() => handleServiceClick(srv.id)}
                      className={`group relative bg-[#121212]/90 border p-8 sm:p-10 overflow-hidden rounded-3xl cursor-pointer transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col justify-between min-h-[320px] sm:min-h-[350px] w-[280px] sm:w-[350px] mx-auto shrink-0 shadow-2xl ${
                        activeTouchServiceId === srv.id
                          ? 'border-[#E55B5B]/40 -translate-y-2 z-20'
                          : 'border-white/5 hover:-translate-y-2 hover:border-[#E55B5B]/40'
                      }`}
                    >
                      {/* Faint ambient light glow */}
                      <div className={`absolute -top-10 -right-10 w-24 h-24 bg-red-600/5 rounded-full blur-2xl duration-300 pointer-events-none ${
                        activeTouchServiceId === srv.id ? 'bg-red-600/15' : 'group-hover:bg-red-600/15'
                      }`}></div>
                      
                      <div className="relative z-10 flex flex-col justify-between h-full">
                        <div>
                          <span className="font-mono text-xs tracking-widest text-neutral-500 block mb-10 uppercase">
                            SERVICE #{srv.number}
                          </span>
                          <h3 className={`font-display text-xl sm:text-2xl font-extrabold text-white mb-5 leading-snug transition-colors ${
                            activeTouchServiceId === srv.id ? 'text-red-500' : 'group-hover:text-red-500'
                          }`}>
                            {srv.title}
                          </h3>
                          <p className="text-neutral-400 font-sans text-sm leading-relaxed mb-8 min-h-[72px]">
                            {srv.description}
                          </p>
                        </div>

                        <div className={`flex items-center gap-2 font-mono text-xs text-[#E55B5B] transition-all duration-300 font-semibold uppercase tracking-wider text-left ${
                          activeTouchServiceId === srv.id ? 'gap-4' : 'group-hover:gap-4'
                        }`}>
                          <span>Explore Specialties</span>
                          <ArrowRight className="w-3.5 h-3.5 text-[#E55B5B] transition-transform" />
                        </div>
                      </div>

                      {/* Massive faint icon in background */}
                      <div className={`absolute -right-8 -bottom-8 ${isMobile ? 'opacity-[0.08]' : 'opacity-[0.03]'} text-white scale-150 transition-transform duration-700 pointer-events-none flex items-center justify-center ${
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

      {/* SECTION 4: RECENT PORTFOLIO EXHIBITS (3 items highlight) */}
      <motion.section
        ref={portfolioRef}
        style={isMobile ? {
          opacity: 1,
          filter: "none",
          scale: mobilePortfolioScale,
          rotateX: mobilePortfolioRotateX,
          y: mobilePortfolioY,
          transformPerspective: 1200
        } : {
          scale: portfolioScale,
          opacity: portfolioOpacity,
          filter: portfolioBlur,
          y: portfolioY,
          transformPerspective: 1200
        }}
        id="home-portfolio"
        className="py-10 md:py-24 max-w-7xl mx-auto px-6 sm:px-12 md:px-16 relative z-10 w-full my-10 md:my-20 border border-white/40 rounded-[2rem] lg:rounded-[3rem] shadow-[0_0_30px_rgba(255,255,255,0.08)]"
      >
        {/* Ambient backlighting blobs */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-red-650/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16 relative z-10 drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">
          <div className="flex flex-col gap-4">
            <span className="text-xs font-mono tracking-widest text-red-500 uppercase font-bold [text-shadow:0_2px_4px_rgba(0,0,0,0.8)]">
              Our Work
            </span>
            <h2 className="font-display text-3xl md:text-5xl font-extrabold tracking-tight text-white uppercase leading-none [text-shadow:0_4px_16px_rgba(0,0,0,1)]">
              Events That <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-600 to-amber-500 text-glow inline-block py-1 drop-shadow-lg">Speak.</span>
            </h2>
          </div>
          <PrimaryButton
            onClick={() => setActivePage('portfolio')}
            text="View All Case Studies"
          />
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
                  className={`portfolio-deck-card w-[180px] sm:w-[260px] md:w-[285px] h-[260px] sm:h-[350px] md:h-[385px] flex flex-col overflow-hidden cursor-pointer group/card select-none transition-all duration-300 ${
                    activeTouchPortfolioId === item.id 
                      ? 'scale-105 border-red-500/30' 
                      : ''
                  } ${isMobile ? 'backdrop-blur-2xl bg-black/60' : ''}`}
                >
                  {/* Image Frame inside the glass card */}
                  <div className="relative w-[92%] h-[50%] mx-auto mt-3 rounded-xl overflow-hidden bg-neutral-950/40 border border-white/5 flex items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-neutral-950/20 to-transparent z-10 opacity-90"></div>
                    <img
                      src={item.image}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ease-out ${
                        activeTouchPortfolioId === item.id 
                          ? 'scale-110 grayscale-0' 
                          : `group-hover/card:scale-110 group-hover/card:grayscale-0 ${!isMobile ? 'grayscale' : ''}`
                      }`}
                    />
                    
                    {/* Centered Floating Icon mimicking user's code */}
                    <div className={`relative z-20 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-lg transition-all duration-300 ${
                      activeTouchPortfolioId === item.id 
                        ? 'scale-110 bg-red-650/20 border-red-500/30' 
                        : 'group-hover/card:scale-110 group-hover/card:bg-red-650/20 group-hover/card:border-red-500/30'
                    }`}>
                      <IconComponent className="w-5 h-5 sm:w-6.5 sm:h-6.5 text-white transition-colors" />
                    </div>

                    {/* Tag label */}
                    <span className="absolute top-2.5 left-2.5 z-20 px-2.5 py-0.5 rounded-full text-[8px] sm:text-[9px] font-mono font-bold tracking-wider uppercase bg-red-650 text-white shadow-sm">
                      {item.category}
                    </span>
                  </div>

                  {/* Bottom Text Info & View Case Study strip mimicking .glass::before */}
                  <div className="flex-1 flex flex-col justify-between p-4.5 relative z-20">
                    <div className="text-left">
                      <h3 className={`font-display text-sm sm:text-base font-bold text-white transition-colors duration-300 truncate ${
                        activeTouchPortfolioId === item.id ? 'text-red-500' : 'group-hover/card:text-red-500'
                      }`}>
                        {item.title}
                      </h3>
                      <p className="text-neutral-400 text-[10px] sm:text-xs mt-1 sm:mt-1.5 line-clamp-2 leading-relaxed">
                        {item.caption}
                      </p>
                    </div>

                    {/* Styled bottom strip bar */}
                    <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-left">
                      <span className={`text-[9px] sm:text-[10px] font-mono tracking-wider uppercase transition-colors ${
                        activeTouchPortfolioId === item.id ? 'text-neutral-400' : 'text-neutral-500 group-hover/card:text-neutral-400'
                      }`}>
                        {item.tag}
                      </span>
                      <div className={`flex items-center gap-1 text-[9px] sm:text-[10px] font-mono uppercase font-bold text-red-500 transition-opacity duration-300 ${
                        activeTouchPortfolioId === item.id ? 'opacity-100' : 'opacity-0 group-hover/card:opacity-100'
                      }`}>
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
      <section id="home-partners" className="py-10 md:py-20 relative z-20 w-full overflow-hidden max-w-7xl mx-auto my-10 md:my-20 border border-white/40 rounded-[2rem] lg:rounded-[3rem] shadow-[0_0_30px_rgba(255,255,255,0.08)]">
        <div className="max-w-7xl mx-auto px-6 mb-10 text-center flex flex-col items-center drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">
          <span className="text-xs font-mono tracking-[0.2em] text-red-500 uppercase font-bold mb-2 [text-shadow:0_2px_4px_rgba(0,0,0,0.8)]">
            Trusted By
          </span>
          <h2 className="font-display text-2xl md:text-3xl font-extrabold text-white [text-shadow:0_4px_16px_rgba(0,0,0,1)]">
            The Brands That Chose Us
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
            Straight From The Source
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
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-600 to-amber-500 text-glow inline-block py-1 drop-shadow-lg">Your Event Legacy?</span>
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
