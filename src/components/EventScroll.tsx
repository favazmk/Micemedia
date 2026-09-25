import React, { useRef, useState, useEffect } from 'react';
import { useMotionValueEvent, type MotionValue } from 'motion/react';

const TOTAL_FRAMES = 216;

// Global cache for desktop and mobile to prevent reloading images
const globalCache: Record<'desktop' | 'mobile', { images: HTMLImageElement[]; loaded: number; isComplete: boolean }> = {
  desktop: { images: [], loaded: 0, isComplete: false },
  mobile: { images: [], loaded: 0, isComplete: false }
};

interface EventScrollProps {
  // 0..1 progress through the pinned hero; the parent owns the scroll tracking
  progress: MotionValue<number>;
}

export default function EventScroll({ progress }: EventScrollProps) {
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

          img.onload = async () => {
            if (isCancelled) return resolve();
            // Decode off the scroll path so the first draw of each frame doesn't hitch
            await img.decode?.().catch(() => {});
            if (isCancelled) return resolve();
            loadedImages[i] = img;
            loaded++;

            // Batch React updates: every image re-rendering the component was costly
            if (loaded <= 12 || loaded % 20 === 0 || loaded === TOTAL_FRAMES) {
              setLoadedCount(loaded);
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

    // Canvas lives inside the sticky hero viewport, so size it to its own box.
    // Back it with device pixels (capped at 2x) so retina screens don't get a blurry upscale.
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    if (canvas.width !== Math.round(width * dpr) || canvas.height !== Math.round(height * dpr)) {
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
    }

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
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

  // Draw at most once per display frame, and only when the frame index actually changes
  const drawFrameRef = useRef(drawFrame);
  drawFrameRef.current = drawFrame;
  const lastDrawnRef = useRef(-1);
  const rafRef = useRef(0);
  const scheduleDraw = (force = false) => {
    if (force) lastDrawnRef.current = -1;
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = 0;
      const idx = Math.floor(progress.get() * (TOTAL_FRAMES - 1));
      if (idx === lastDrawnRef.current) return;
      lastDrawnRef.current = idx;
      drawFrameRef.current(idx);
    });
  };

  useMotionValueEvent(progress, "change", () => scheduleDraw());

  // New frames arrived (or the viewport changed): redraw wherever the user currently is
  useEffect(() => {
    if (loadedCount > 0) scheduleDraw(true);
    const handleResize = () => scheduleDraw(true);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [loadedCount, images]);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

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
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

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



