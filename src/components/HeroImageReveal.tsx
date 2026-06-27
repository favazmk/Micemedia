import React, { useRef, useState, useEffect } from 'react';

export default function HeroImageReveal() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [maskStyle, setMaskStyle] = useState("radial-gradient(circle 0px at 50% 50%, white 0%, transparent 100%)");

  useEffect(() => {
    const heroSection = document.getElementById('hero-section');
    if (!heroSection) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      setMaskStyle(`radial-gradient(circle 350px at ${x}px ${y}px, rgba(255,255,255,1) 30%, rgba(255,255,255,0.85) 60%, rgba(255,255,255,0) 100%)`);
      
      // Play video on hover
      if (videoRef.current && videoRef.current.paused) {
        videoRef.current.play().catch(() => {});
      }
    };

    const handleMouseLeave = () => {
      setMaskStyle("radial-gradient(circle 0px at 50% 50%, white 0%, transparent 100%)");
      
      // Pause video when mouse leaves
      if (videoRef.current && !videoRef.current.paused) {
        videoRef.current.pause();
      }
    };

    heroSection.addEventListener('mousemove', handleMouseMove);
    heroSection.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      heroSection.removeEventListener('mousemove', handleMouseMove);
      heroSection.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="hero-image"
    >
      <img src="/images/hero-bw.png" className="hero-bw" alt="Event Sketch" />
      <video 
        ref={videoRef}
        src="/images/hero-color.mp4" 
        className="hero-color" 
        muted 
        loop 
        playsInline
        style={{
          WebkitMaskImage: maskStyle,
          maskImage: maskStyle
        }}
      />
      
      {/* Bottom Fade Overlay */}
      <div className="absolute inset-x-0 bottom-0 h-[30vh] bg-gradient-to-t from-[#050505] to-transparent pointer-events-none"></div>
    </div>
  );
}
