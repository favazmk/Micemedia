/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef } from 'react';
import { Star, Quote } from 'lucide-react';
import { TESTIMONIALS_DATA } from '../data';
import { useSlowMoMarquee } from './Home';

export default function TestimonialsSlider() {
  const testimonials = TESTIMONIALS_DATA;
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  useSlowMoMarquee(testimonialsRef, isHovered);

  // Render a single high-end testimonial card
  const renderCard = (item: typeof TESTIMONIALS_DATA[0], index: number, prefix: string) => {
    return (
      <div
        key={`${prefix}-${item.id}-${index}`}
        className="w-[320px] sm:w-[380px] md:w-[440px] shrink-0 glass-card bg-neutral-900/30 border border-white/5 rounded-3xl p-6 sm:p-8 flex flex-col justify-between selection:bg-red-650 selection:text-white select-none relative overflow-hidden hover:border-red-500/30 transition-all duration-300 group"
      >
        {/* Decorative quote mark overlay */}
        <Quote className="absolute top-6 right-6 w-14 h-14 text-white/[0.02] group-hover:text-red-500/5 duration-300 pointer-events-none" />

        <div>
          {/* Header row - stars rating & verified tag */}
          <div className="flex justify-between items-center mb-5">
            <div className="flex items-center gap-0.5">
              {[...Array(item.rating)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              ))}
            </div>
            <span className="text-[9px] font-mono tracking-wider text-neutral-500 uppercase flex items-center gap-1.5 bg-neutral-950/40 px-2.5 py-1 rounded-full border border-white/5">
              <span className="w-1 h-1 rounded-full bg-red-600"></span>
              Verified
            </span>
          </div>

          {/* Actual testimonial text */}
          <p className="font-sans text-sm sm:text-[15px] text-neutral-200 leading-relaxed font-normal italic pr-2">
            "{item.quote}"
          </p>
        </div>

        {/* Footer/Author metrics */}
        <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-neutral-950 border border-red-500/10 flex items-center justify-center text-red-500 font-mono text-sm font-black">
              {item.clientName[0]}
            </div>
            <div className="flex flex-col">
              <span className="text-xs sm:text-xs font-display font-extrabold text-white tracking-wide">
                {item.clientName}
              </span>
              <span className="text-[10px] font-mono text-neutral-500 mt-0.5 line-clamp-1">
                {item.jobTitle}, <span className="text-neutral-400">{item.companyName}</span>
              </span>
            </div>
          </div>
          <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-neutral-950/60 text-red-500 border border-white/5 uppercase shrink-0">
            {item.city.split(',')[0]}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full relative mt-4 select-none" id="testimonials-marquee-viewport">
      {/* Absolute Ambient Backlight center glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[600px] h-[150px] bg-red-650/4 rounded-full blur-[100px] pointer-events-none z-0"></div>

      {/* Side masking gradient overrides for premium infinite depth look */}
      <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-24 bg-gradient-to-r from-[#05030a] to-transparent z-10 pointer-events-none"></div>
      <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-24 bg-gradient-to-l from-[#05030a] to-transparent z-10 pointer-events-none"></div>

      {/* Outer wrapper limiting height & managing overflow */}
      <div className="w-full overflow-hidden py-6 relative z-10">
        {/* Continuous keyframe motion belt */}
        <div 
          ref={testimonialsRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="animate-testimonial-marquee flex items-stretch gap-6"
        >
          {/* Loop iteration 1 */}
          {testimonials.map((item, idx) => renderCard(item, idx, 'set1'))}
          {/* Loop iteration 2 for perfect seamless repetition spacing */}
          {testimonials.map((item, idx) => renderCard(item, idx, 'set2'))}
          {/* Loop iteration 3 for grand viewport screens */}
          {testimonials.map((item, idx) => renderCard(item, idx, 'set3'))}
        </div>
      </div>

      {/* Subtle indicator under marquee */}
      <div className="flex justify-center mt-3 text-[10px] font-mono text-neutral-600 gap-1.5 items-center select-none">
        <span className="w-1.5 h-1.5 rounded-full bg-red-600/60 animate-pulse"></span>
        <span>Hover cards to pause slider</span>
      </div>
    </div>
  );
}
