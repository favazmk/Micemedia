import React, { useRef, useState, useEffect } from 'react';
import { useScroll, useSpring, useMotionValueEvent } from 'motion/react';

const TOTAL_FRAMES = 216;

// Global cache for desktop and mobile to prevent reloading images
const globalCache: Record<'desktop' | 'mobile', { images: HTMLImageElement[]; loaded: number; isComplete: boolean }> = {
  desktop: { images: [], loaded: 0, isComplete: false },
  mobile: { images: [], loaded: 0, isComplete: false }
};

interface EventScrollProps {
  scrollContainerRef?: React.RefObject<HTMLElement | null>;
}

export default function EventScroll({ scrollContainerRef }: EventScrollProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [loadedCount, setLoadedCount] = useState(0);
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' ? window.innerWidth < 768 : false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile((prev) => (prev !== mobile ? mobile : prev));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const cacheKey = isMobile ? 'mobile' : 'desktop';
  const folder = isMobile ? 'fps-sequence-mobile' : 'fps-sequence';

  const { scrollYProgress } = useScroll(
    scrollContainerRef
      ? { target: scrollContainerRef, offset: ["start start", "end end"] }
      : {}
  );

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 60, damping: 20, restDelta: 0.001 });

  useEffect(() => {
    let isCancelled = false;

    // If already fully loaded globally, skip loading and use cache
    if (globalCache[cacheKey].isComplete) {
      setLoadedCount(TOTAL_FRAMES);
      setImages(globalCache[cacheKey].images);
      return;
    }

    const loadedImages: HTMLImageElement[] = new Array(TOTAL_FRAMES).fill(null);
    let loaded = 0;
    setLoadedCount(0);
    setImages(loadedImages);

    const loadImages = async () => {
      const loadImage = (i: number): Promise<void> => {
        return new Promise((resolve) => {
          if (isCancelled) return resolve();
          const img = new Image();
          const indexStr = (i + 1).toString().padStart(3, '0');
          img.src = `./${folder}/frame-${indexStr}.webp`;

          img.onload = () => {
            if (isCancelled) return resolve();
            loadedImages[i] = img;
            loaded++;
            setLoadedCount(loaded);

            if (loaded % 10 === 0 || loaded === TOTAL_FRAMES) {
              setImages([...loadedImages]);
            }

            if (loaded === TOTAL_FRAMES) {
              globalCache[cacheKey].images = [...loadedImages];
              globalCache[cacheKey].loaded = loaded;
              globalCache[cacheKey].isComplete = true;
            }

            resolve();
          };
          img.onerror = () => resolve();
        });
      };

      // First burst: Load first 12 frames immediately
      const initialBurst = [];
      for (let i = 0; i < Math.min(12, TOTAL_FRAMES); i++) {
        initialBurst.push(loadImage(i));
      }
      await Promise.all(initialBurst);

      // Load remaining frames in fast concurrent batches of 20
      const BATCH_SIZE = 20;
      for (let i = 12; i < TOTAL_FRAMES; i += BATCH_SIZE) {
        if (isCancelled) break;
        const batch = [];
        for (let j = i; j < Math.min(i + BATCH_SIZE, TOTAL_FRAMES); j++) {
          batch.push(loadImage(j));
        }
        await Promise.all(batch);
      }
    };

    loadImages();

    return () => {
      isCancelled = true;
    };
  }, [cacheKey, folder]);

  const drawFrame = (frameIndex: number) => {
    if (!canvasRef.current || images.length === 0) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const safeIndex = Math.max(0, Math.min(TOTAL_FRAMES - 1, frameIndex));
    let img = images[safeIndex];

    // Fallback to the closest previously loaded frame if current isn't ready
    if (!img || !img.complete) {
      for (let j = safeIndex; j >= 0; j--) {
        if (images[j] && images[j].complete) {
          img = images[j];
          break;
        }
      }
    }
    if (!img || !img.complete) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }

    ctx.clearRect(0, 0, width, height);

    const imgRatio = img.width / img.height;
    const canvasRatio = width / height;

    let drawWidth = width;
    let drawHeight = height;
    let offsetX = 0;
    let offsetY = 0;

    // object-fit: cover logic
    if (imgRatio > canvasRatio) {
      drawHeight = height;
      drawWidth = height * imgRatio;
      offsetX = (width - drawWidth) / 2;
    } else {
      drawWidth = width;
      drawHeight = width / imgRatio;
      offsetY = (height - drawHeight) / 2;
    }

    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  };

  useMotionValueEvent(smoothProgress, "change", (latest) => {
    const idx = Math.floor(latest * (TOTAL_FRAMES - 1));
    requestAnimationFrame(() => drawFrame(idx));
  });

  useEffect(() => {
    if (loadedCount > 0) {
      drawFrame(0);
    }
    const handleResize = () => drawFrame(Math.floor(smoothProgress.get() * (TOTAL_FRAMES - 1)));
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [loadedCount, images]);

  const INITIAL_THRESHOLD = 10;
  const isReady = loadedCount >= INITIAL_THRESHOLD || globalCache[cacheKey].isComplete;

  // Block scrolling only until the initial burst of frames is loaded (< 0.3s)
  useEffect(() => {
    if (!isReady) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isReady]);

  return (
    <>
      <div className="fixed inset-0 z-0 bg-[#050505] pointer-events-none overflow-hidden" style={{ willChange: "transform" }}>
        <canvas ref={canvasRef} className="w-full h-full block opacity-50" />
        {/* Ultra-soft extended gaussian-feathered corner diffusion (desktop only) */}
        {!isMobile && (
          <div 
            className="absolute -bottom-14 -right-14 w-72 sm:w-96 h-52 sm:h-72 bg-[#050505] rounded-full blur-[52px] pointer-events-none" 
            style={{ transform: "translate3d(0,0,0)" }}
          />
        )}
      </div>

      {/* Instant graceful loading screen that dismisses as soon as initial frames are ready */}
      {!isReady && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050505] transition-opacity duration-500">
          <div className="w-12 h-12 border-2 border-white/10 border-t-red-500 rounded-full animate-spin mb-6"></div>
          <h2 className="text-white font-display text-lg sm:text-xl uppercase tracking-[0.2em] mb-4 font-bold [text-shadow:0_2px_10px_rgba(229,91,91,0.3)]">
            Loading Experience
          </h2>
          <div className="w-48 sm:w-64 h-1 bg-white/10 rounded-full overflow-hidden shadow-[0_0_15px_rgba(229,91,91,0.2)]">
            <div
              className="h-full bg-red-500 transition-all duration-200 relative"
              style={{ width: `${(loadedCount / INITIAL_THRESHOLD) * 100}%` }}
            >
              <div className="absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-r from-transparent to-white/50 blur-[2px]"></div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}



