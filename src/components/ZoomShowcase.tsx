/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { PortfolioItem } from '../types';

interface ZoomRowProps {
  item: PortfolioItem;
  index: number;
  total: number;
  onOpen: (item: PortfolioItem) => void;
}

// One project in the zig-zag: the photo slowly zooms in while the row scrolls
// through the viewport; even rows put the photo left, odd rows put it right.
function ZoomRow({ item, index, total, onOpen }: ZoomRowProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const progress = useSpring(scrollYProgress, { stiffness: 80, damping: 24, restDelta: 0.001 });
  const imageScale = useTransform(progress, [0, 1], [1, 1.35]);
  const flipped = index % 2 === 1;

  return (
    <div
      ref={ref}
      className={`flex flex-col md:flex-row items-center gap-6 md:gap-14 ${flipped ? 'md:flex-row-reverse' : ''}`}
    >
      <motion.button
        type="button"
        onClick={() => onOpen(item)}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="group relative w-full md:w-[46%] lg:w-[42%] aspect-[4/3] rounded-3xl overflow-hidden border border-white/10 hover:border-red-500/50 cursor-pointer shrink-0 bg-neutral-950"
        aria-label={`Open ${item.title}`}
      >
        <motion.img
          src={item.image}
          alt={item.title}
          referrerPolicy="no-referrer"
          loading="lazy"
          style={{ scale: imageScale }}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <span className="absolute top-4 left-4 px-2.5 py-1 rounded-full bg-red-600 text-white font-mono text-[9px] sm:text-[10px] tracking-wider uppercase font-bold">
          {item.category}
        </span>
      </motion.button>

      <motion.div
        initial={{ opacity: 0, x: flipped ? -30 : 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className={`w-full md:flex-1 ${flipped ? 'md:text-right md:items-end' : ''} flex flex-col`}
      >
        <span className="font-mono text-[10px] sm:text-xs tracking-[0.25em] uppercase font-bold text-red-500">
          {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')} · {item.tag}
        </span>
        <h3 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight mt-3">
          {item.title}
        </h3>
        <p className="font-sans text-sm sm:text-base text-neutral-400 mt-3 max-w-md leading-relaxed">
          {item.caption}
        </p>
        <button
          type="button"
          onClick={() => onOpen(item)}
          className="mt-5 inline-flex items-center gap-2 font-mono text-[10px] sm:text-xs tracking-widest uppercase font-bold text-white hover:text-red-500 transition-colors cursor-pointer w-fit"
        >
          View Project <ArrowUpRight className="w-4 h-4" />
        </button>
      </motion.div>
    </div>
  );
}

interface ZoomShowcaseProps {
  items: PortfolioItem[];
  onOpen: (item: PortfolioItem) => void;
}

export default function ZoomShowcase({ items, onOpen }: ZoomShowcaseProps) {
  return (
    <div className="w-full max-w-6xl mx-auto px-6 sm:px-12 flex flex-col gap-16 md:gap-24 py-12 md:py-20">
      {items.map((item, index) => (
        <div key={item.id}>
          <ZoomRow item={item} index={index} total={items.length} onOpen={onOpen} />
        </div>
      ))}
    </div>
  );
}
