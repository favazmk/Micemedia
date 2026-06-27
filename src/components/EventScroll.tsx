import React, { useRef, useState, useEffect } from 'react';
import { useScroll, useSpring, useMotionValueEvent } from 'motion/react';

const DESKTOP_FRAMES = 120;
const MOBILE_FRAMES = 115;

interface EventScrollProps {
  scrollContainerRef: React.RefObject<HTMLElement | null>;
}

export default function EventScroll({ scrollContainerRef }: EventScrollProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [loadedCount, setLoadedCount] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Initial check and resize listener
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile(); // Run once on mount
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const frameCount = isMobile ? MOBILE_FRAMES : DESKTOP_FRAMES;
  const folder = isMobile ? 'fps-sequence mobile' : 'fps-sequence';

  const { scrollYProgress } = useScroll({
    target: scrollContainerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 60, damping: 20, restDelta: 0.001 });

  useEffect(() => {
    let isCancelled = false;
    const loadedImages: HTMLImageElement[] = new Array(frameCount).fill(null);
    let loaded = 0;
    setLoadedCount(0);
    setImages(loadedImages);

    const loadImagesSequentially = async () => {
      const loadImage = (i: number): Promise<void> => {
        return new Promise((resolve) => {
          if (isCancelled) return resolve();
          const img = new Image();
          const indexStr = (i + 1).toString().padStart(3, '0');
          img.src = `/${folder}/ezgif-frame-${indexStr}.jpg`;
          
          img.onload = () => {
            if (isCancelled) return resolve();
            loadedImages[i] = img;
            loaded++;
            setLoadedCount(loaded);
            
            // Only update the state array every 10 frames to reduce re-renders,
            // or when we finish, so React knows about the new references.
            if (loaded % 10 === 0 || loaded === frameCount) {
              setImages([...loadedImages]);
            }
            resolve();
          };
          img.onerror = () => resolve();
        });
      };

      // Load sequentially to prevent CPU/Network spikes that cause heating
      for (let i = 0; i < frameCount; i++) {
        if (isCancelled) break;
        await loadImage(i);
        // Small 5ms pause between frames to let the main thread breathe
        await new Promise(r => setTimeout(r, 5));
      }
    };

    loadImagesSequentially();

    return () => {
      isCancelled = true;
    };
  }, [isMobile, frameCount, folder]);

  const drawFrame = (frameIndex: number) => {
    if (!canvasRef.current || images.length === 0) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const safeIndex = Math.max(0, Math.min(frameCount - 1, frameIndex));
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

    // object-fit: cover logic to ensure it fully fills the screen on mobile
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
    const idx = Math.floor(latest * (frameCount - 1));
    requestAnimationFrame(() => drawFrame(idx));
  });

  useEffect(() => {
    if (loadedCount > 0) {
      drawFrame(0);
    }
    const handleResize = () => drawFrame(Math.floor(smoothProgress.get() * (frameCount - 1)));
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [loadedCount, images, frameCount]);

  return (
    <>
      <div className="fixed inset-0 z-0 bg-[#050505] pointer-events-none" style={{ willChange: "transform" }}>
        <canvas ref={canvasRef} className="w-full h-full block opacity-50" />
      </div>
      
      {/* Non-blocking tiny loading indicator at the bottom instead of full screen */}
      {loadedCount < frameCount && (
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-3 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full pointer-events-none transition-opacity duration-500 border border-white/10">
          <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
          <p className="text-white/60 font-mono text-[10px] uppercase tracking-widest">
            {Math.round((loadedCount / frameCount) * 100)}%
          </p>
        </div>
      )}
    </>
  );
}
