/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { PortfolioItem } from '../types';

interface ZoomPanelProps {
  item: PortfolioItem;
  index: number;
  total: number;
  onOpen: (item: PortfolioItem) => void;
}

// One project: pinned for a scroll's length while the frame grows from an inset,
// rounded card to full-bleed and the photo slowly zooms in behind it.
function ZoomPanel({ item, index, total, onOpen }: ZoomPanelProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] });
  const progress = useSpring(scrollYProgress, { stiffness: 80, damping: 24, restDelta: 0.001 });

  const insetY = useTransform(progress, [0.35, 0.85], [14, 0]);
  const insetX = useTransform(progress, [0.35, 0.85], [18, 0]);
  const radius = useTransform(progress, [0.35, 0.85], [32, 0]);
  const clipPath = useTransform(
    [insetY, insetX, radius],
    ([y, x, r]: number[]) => `inset(${y}% ${x}% round ${r}px)`
  );
  const imageScale = useTransform(progress, [0.35, 1], [1, 1.3]);
  const textOpacity = useTransform(progress, [0.7, 0.9], [0, 1]);
  const textY = useTransform(progress, [0.7, 0.9], [40, 0]);

  return (
    <div ref={ref} className="relative h-[180vh] w-full">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <motion.button
          type="button"
          onClick={() => onOpen(item)}
          style={{ clipPath }}
          className="absolute inset-0 w-full h-full cursor-pointer block text-left bg-neutral-950"
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
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/10" />

          <motion.div
            style={{ opacity: textOpacity, y: textY }}
            className="absolute inset-x-0 bottom-0 px-6 sm:px-12 md:px-20 pb-16 sm:pb-20 flex flex-col sm:flex-row sm:items-end justify-between gap-6"
          >
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 font-mono text-[10px] sm:text-xs tracking-[0.25em] uppercase font-bold">
                <span className="text-pop-sun">{String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
                <span className="px-2.5 py-1 rounded-full bg-red-600 text-white tracking-wider">{item.category}</span>
              </div>
              <h3 className="font-display text-3xl sm:text-5xl md:text-6xl font-bold text-white leading-[1.05] mt-4">
                {item.title}
              </h3>
              <p className="font-sans text-sm sm:text-base text-neutral-200 mt-4 max-w-xl leading-relaxed">
                {item.caption}
              </p>
            </div>
            <span className="inline-flex items-center gap-2 font-mono text-[10px] sm:text-xs tracking-widest uppercase font-bold text-white border border-white/30 rounded-full px-5 py-3 backdrop-blur-md bg-white/10 shrink-0 self-start sm:self-auto">
              View Project <ArrowUpRight className="w-4 h-4" />
            </span>
          </motion.div>
        </motion.button>
      </div>
    </div>
  );
}

interface ZoomShowcaseProps {
  items: PortfolioItem[];
  onOpen: (item: PortfolioItem) => void;
}

export default function ZoomShowcase({ items, onOpen }: ZoomShowcaseProps) {
  return (
    <div className="w-full">
      {items.map((item, index) => (
        <div key={item.id}>
          <ZoomPanel item={item} index={index} total={items.length} onOpen={onOpen} />
        </div>
      ))}
    </div>
  );
}
