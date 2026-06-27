import React, { useRef, useState, useEffect } from 'react';
import { useScroll, useSpring, useMotionValueEvent } from 'motion/react';

const FRAME_COUNT = 120;

interface EventScrollProps {
  scrollContainerRef: React.RefObject<HTMLElement | null>;
}

export default function EventScroll({ scrollContainerRef }: EventScrollProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [loadedCount, setLoadedCount] = useState(0);

  const { scrollYProgress } = useScroll({
    target: scrollContainerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 60, damping: 20, restDelta: 0.001 });

  useEffect(() => {
    // Preload images
    const loadedImages: HTMLImageElement[] = [];
    let loaded = 0;

    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      const indexStr = i.toString().padStart(3, '0');
      img.src = `/fps-sequence/ezgif-frame-${indexStr}.jpg`;
      img.onload = () => {
        loaded++;
        setLoadedCount(loaded);
      };
      loadedImages.push(img);
    }
    setImages(loadedImages);
  }, []);

  const drawFrame = (frameIndex: number) => {
    if (!canvasRef.current || images.length === 0) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const safeIndex = Math.max(0, Math.min(FRAME_COUNT - 1, frameIndex));
    const img = images[safeIndex];
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
    const frameIndex = Math.floor(latest * (FRAME_COUNT - 1));
    requestAnimationFrame(() => drawFrame(frameIndex));
  });

  useEffect(() => {
    if (loadedCount > 0) {
      drawFrame(0);
    }
    const handleResize = () => drawFrame(Math.floor(smoothProgress.get() * (FRAME_COUNT - 1)));
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [loadedCount, images]);

  return (
    <>
      <div className="fixed inset-0 z-0 bg-[#050505] pointer-events-none" style={{ willChange: "transform" }}>
        <canvas ref={canvasRef} className="w-full h-full block opacity-50" />
      </div>
      
      {/* Loading overlay */}
      {loadedCount < FRAME_COUNT && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-[#050505]/90 backdrop-blur-md transition-opacity duration-500 pointer-events-none">
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            <p className="text-white/60 font-mono text-xs uppercase tracking-widest">
              Initializing Sequence {Math.round((loadedCount / FRAME_COUNT) * 100)}%
            </p>
          </div>
        </div>
      )}
    </>
  );
}
