/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'motion/react';
import { PortfolioItem } from '../types';

// Deliberately uneven collage: each card gets its own width, horizontal offset,
// aspect ratio and zoom range so the zig-zag never feels like a uniform grid.
const LAYOUT = [
  { width: 'md:w-[40%]', offset: 'md:ml-[4%]',  aspect: 'aspect-[4/3]', from: 0.72, to: 1.08 },
  { width: 'md:w-[30%]', offset: 'md:ml-[62%]', aspect: 'aspect-[3/4]', from: 0.6,  to: 1.15 },
  { width: 'md:w-[34%]', offset: 'md:ml-[18%]', aspect: 'aspect-square', from: 0.8, to: 1.05 },
  { width: 'md:w-[38%]', offset: 'md:ml-[54%]', aspect: 'aspect-[16/10]', from: 0.65, to: 1.12 },
  { width: 'md:w-[28%]', offset: 'md:ml-[8%]',  aspect: 'aspect-[4/5]', from: 0.75, to: 1.1 },
];

interface ZoomCardProps {
  item: PortfolioItem;
  index: number;
  onOpen: (item: PortfolioItem) => void;
}

// The whole card (border included) scales up as it travels through the viewport.
function ZoomCard({ item, index, onOpen }: ZoomCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const layout = LAYOUT[index % LAYOUT.length];
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'center center'] });
  const progress = useSpring(scrollYProgress, { stiffness: 80, damping: 22, restDelta: 0.001 });
  // Phones show one full-width card at a time, so zoom gently and never past 100%
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const scale = useTransform(progress, [0, 1], isMobile ? [0.82, 1] : [layout.from, layout.to]);
  const opacity = useTransform(progress, [0, 0.35], [0, 1]);

  return (
    <div ref={ref} className={`w-full ${layout.width} ${layout.offset} ${index > 0 ? 'md:-mt-24' : ''}`}>
      <motion.button
        type="button"
        onClick={() => onOpen(item)}
        style={{ scale, opacity }}
        className={`group relative block w-full ${layout.aspect} rounded-3xl overflow-hidden border border-white/15 hover:border-red-500/60 cursor-pointer bg-neutral-950 shadow-2xl shadow-black/60 transition-colors`}
        aria-label={`Open ${item.title}`}
      >
        <img
          src={item.image}
          alt={item.title}
          referrerPolicy="no-referrer"
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent" />
        <span className="absolute left-4 bottom-4 right-4 font-display text-sm sm:text-base font-bold text-white text-left leading-tight group-hover:text-red-500 transition-colors">
          {item.title}
        </span>
      </motion.button>
    </div>
  );
}

interface ZoomShowcaseProps {
  items: PortfolioItem[];
  onOpen: (item: PortfolioItem) => void;
}

export default function ZoomShowcase({ items, onOpen }: ZoomShowcaseProps) {
  return (
    <div className="w-full max-w-6xl mx-auto px-6 sm:px-12 flex flex-col gap-10 md:gap-0 py-12 md:py-20">
      {items.map((item, index) => (
        <div key={item.id}>
          <ZoomCard item={item} index={index} onOpen={onOpen} />
        </div>
      ))}
    </div>
  );
}
