/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MapPin, Calendar, Sparkles, ChevronLeft, ChevronRight, Images, Play } from 'lucide-react';
import { EVENTS_DATA, EXHIBITIONS_DATA } from '../data';
import { EVENT_ALBUMS, EXHIBITION_ALBUMS, pickPhotos, isVideo, posterFor } from '../gallery';
import { PortfolioItem } from '../types';
import { PrimaryButton } from '@/components/ui/primary-button';
import StackSpread from '@/components/ui/stack-spread';
import Particles from './Particles';

// Copy and data for each showcase page; both pages share the same layout
const VARIANTS = {
  events: {
    cardLabel: 'Event',
    eyebrow: 'Our Events',
    title: 'Events That Speak',
    accent: 'for themselves.',
    accentClass: 'text-red-500',
    intro: 'Conferences, galas, launches and celebrations, staged end-to-end across Dubai and the wider GCC.',
    items: EVENTS_DATA,
    albums: EVENT_ALBUMS,
    // Auto-playing scatter showcase of the latest client photos (stack order: back -> front)
    spread: {
      photos: pickPhotos([
        'dsc09020.webp', 'haz02651.webp', 'dsc09268.webp', 'dsc09160.webp',
        'haz04027.webp', 'dsc09219.webp', 'dsc09609.webp', 'haz03529.webp',
      ]),
      title: <>Moments we <span className="accent-word text-red-500">made.</span></>,
      subtitle: 'Awards nights, team days and grand openings, produced end-to-end by MICE Media.',
    },
  },
  exhibition: {
    cardLabel: 'Exhibition',
    eyebrow: 'Exhibitions',
    title: 'Stands That Pull',
    accent: 'a crowd.',
    accentClass: 'text-red-500',
    intro: 'Custom and modular exhibition stands, designed, built and run on the show floor from concept to handover.',
    items: EXHIBITIONS_DATA,
    albums: EXHIBITION_ALBUMS,
    spread: {
      photos: pickPhotos([
        'img_4154.webp', 'pic-5.webp', 'img_4038.webp', 'img_4143.webp',
        'img_4152.webp', 'img_4027.webp', 'img_4179.webp', 'pic-6.webp',
      ]),
      title: <>Built to <span className="accent-word text-red-500">stand out.</span></>,
      subtitle: 'Brand stands, photo moments and activation zones, designed and built on site.',
    },
  },
} as const;

interface ProjectShowcaseProps {
  variant: keyof typeof VARIANTS;
  selectedPortfolioId: string | null;
  setSelectedPortfolioId: (id: string | null) => void;
  setActivePage: (page: string) => void;
}

export default function ProjectShowcase({ variant, selectedPortfolioId, setSelectedPortfolioId, setActivePage }: ProjectShowcaseProps) {
  const config = VARIANTS[variant];
  const items: readonly PortfolioItem[] = config.items;
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);

  // One card per project: conferences first, then photo albums with no matching case study, then the case studies
  // (each linked to its album when the folder name starts with the project name).
  const cards = useMemo(() => {
    const norm = (t: string) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
    const albumFor = (item: PortfolioItem) => {
      const key = norm(item.title.split(':')[0]).trim();
      return config.albums.findIndex((a) => norm(a.title).startsWith(key));
    };
    const counts = (images: readonly string[]) => {
      const videos = images.filter(isVideo).length;
      return [
        images.length - videos && `${images.length - videos} photo${images.length - videos === 1 ? '' : 's'}`,
        videos && `${videos} video${videos === 1 ? '' : 's'}`,
      ].filter(Boolean).join(' · ');
    };
    const linked = new Set(items.map(albumFor).filter((i) => i >= 0));
    // Hand-picked cover photos (album title -> file name) where the first photo isn't the best one
    const coverFile: Record<string, string> = { 'Tractebel – Team Building': 'dsc09268.webp' };
    const albumCards = config.albums.flatMap((album, albumIndex) => {
      if (linked.has(albumIndex)) return [];
      const first = album.images.find((src) => src.endsWith(`/${coverFile[album.title]}`))
        ?? album.images.find((src) => !isVideo(src));
      const cover = first ?? posterFor(album.images[0]);
      return cover ? [{
        key: `album-${albumIndex}`, title: album.title, overview: 'Photo gallery', category: config.cardLabel,
        cover, meta: counts(album.images), albumIndex, item: null as PortfolioItem | null,
      }] : [];
    });
    const itemCards = items.map((item) => {
      const albumIndex = albumFor(item);
      return {
        key: item.id, title: item.title, overview: item.tag, category: item.category,
        cover: item.image, meta: albumIndex >= 0 ? counts(config.albums[albumIndex].images) : '',
        albumIndex: albumIndex >= 0 ? albumIndex : null, item,
      };
    });
    // Conference projects lead the grid; otherwise albums first, then case studies
    const all = [...albumCards, ...itemCards];
    return [...all.filter((c) => c.category === 'Conference'), ...all.filter((c) => c.category !== 'Conference')];
  }, [config, items]);
  // Photo lightbox: which album and which image within it
  const [photo, setPhoto] = useState<{ album: number; index: number } | null>(null);

  // Handle deep linking from other page interactions
  useEffect(() => {
    if (selectedPortfolioId) {
      const match = items.find(item => item.id === selectedPortfolioId);
      if (match) setSelectedItem(match);
      setSelectedPortfolioId(null);
    }
  }, [selectedPortfolioId, setSelectedPortfolioId, items]);

  const showPhoto = (step: number) => {
    if (!photo) return;
    const images = config.albums[photo.album].images;
    setPhoto({ album: photo.album, index: (photo.index + step + images.length) % images.length });
  };

  useEffect(() => {
    if (!photo) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPhoto(null);
      if (e.key === 'ArrowRight') showPhoto(1);
      if (e.key === 'ArrowLeft') showPhoto(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  return (
    <div className="py-24 md:py-32 flex flex-col w-full relative min-h-screen" id={`${variant}page-root`}>
      
      {/* â”€â”€ Particles animated WebGL background â”€â”€ */}
      <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
        <div className="sticky top-0 left-0 w-full h-screen">
          <Particles
            particleColors={['#ff4d6d', '#e63946', '#800c0c']}
            particleCount={300}
            particleSpread={12}
            speed={0.1}
            particleBaseSize={100}
            moveParticlesOnHover={true}
            particleHoverFactor={1.5}
            alphaParticles={true}
            cameraDistance={25}
          />
        </div>
      </div>

      <div className="relative z-10 flex flex-col w-full">
      {/* SECTION 1: PORTFOLIO HERO HEADER */}
      <section className="relative px-6 max-w-7xl mx-auto w-full mb-16 text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-red-650/10 rounded-full blur-3xl pointer-events-none"></div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neutral-905 border border-white/5 backdrop-blur-md mb-6"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-red-650 animate-pulse"></span>
          <span className="font-mono text-[10px] tracking-widest uppercase text-neutral-400">
            {config.eyebrow}
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-display text-4xl sm:text-5xl md:text-6xl font-bold uppercase text-white tracking-tight"
        >
          {config.title} <br />
          <span className={`accent-word text-[1.15em] py-2 ${config.accentClass}`}>{config.accent}</span>
        </motion.h1>
        
        <p className="text-neutral-400 font-sans text-sm md:text-base leading-relaxed mt-4 max-w-xl mx-auto">
          {config.intro}
        </p>

        <div className="w-12 h-[2px] bg-red-650 mx-auto mt-6 rounded-full"></div>
      </section>

      {/* SECTION 1B: STACK SPREAD — latest client photos scatter out on their own when you reach it */}
      {config.spread.photos.length > 0 && (
        <StackSpread
          images={config.spread.photos}
          title={config.spread.title}
          subtitle={config.spread.subtitle}
        />
      )}

      {/* SECTION 2: PROJECT CARDS — one per project; opens its photo gallery (or case study) */}
      <section className="px-6 max-w-7xl mx-auto w-full mb-20" id={`${variant}-projects`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
          {cards.map((card, n) => (
            <button
              key={card.key}
              type="button"
              onClick={() => (card.albumIndex !== null ? setPhoto({ album: card.albumIndex, index: 0 }) : card.item && setSelectedItem(card.item))}
              className="group text-left flex flex-col cursor-pointer"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-white/10 group-hover:border-red-500/50 transition-colors bg-neutral-900">
                <img
                  src={card.cover}
                  alt={card.title}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="mt-4 flex items-center justify-between font-mono text-[10px] tracking-widest uppercase">
                <span className="text-red-500 font-bold">{String(n + 1).padStart(2, '0')}</span>
                <span className="text-neutral-400 border border-white/10 rounded-full px-2.5 py-1">{card.category}</span>
              </div>
              <h3 className="font-display text-lg md:text-xl font-bold text-white mt-2 leading-snug group-hover:text-red-400 transition-colors">{card.title}</h3>
              <p className="font-mono text-[11px] tracking-widest uppercase text-neutral-400 mt-1">{card.overview}</p>
              {card.meta && (
                <span className="mt-2 inline-flex items-center gap-2 text-xs text-neutral-500">
                  <Images className="w-3.5 h-3.5" /> {card.meta}
                </span>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* SECTION 3: PHOTO ALBUMS (auto-loaded from src/assets/gallery/<variant>) */}
      {config.albums.map((album, albumIndex) => (
        <section key={album.title} className="px-6 max-w-7xl mx-auto w-full mb-16" id={`${variant}-album-${albumIndex}`}>
          <div className="flex items-end justify-between gap-4 mb-6">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-white tracking-tight">{album.title}</h2>
            <span className="font-mono text-[10px] tracking-widest uppercase text-neutral-500">
              {[
                [album.images.filter((s) => !isVideo(s)).length, 'photo'],
                [album.images.filter(isVideo).length, 'video'],
              ].filter(([n]) => n).map(([n, w]) => `${n} ${w}${n === 1 ? '' : 's'}`).join(' · ')}
            </span>
          </div>
          <div className="columns-2 md:columns-3 lg:columns-4 gap-3 sm:gap-4">
            {album.images.map((src, index) => (
              <button
                key={src}
                onClick={() => setPhoto({ album: albumIndex, index })}
                aria-label={isVideo(src) ? `Play ${album.title} video` : undefined}
                className="relative mb-3 sm:mb-4 block w-full overflow-hidden rounded-2xl border border-white/10 hover:border-red-500/50 cursor-zoom-in group break-inside-avoid"
              >
                <img
                  src={isVideo(src) ? posterFor(src) : src}
                  alt={`${album.title} ${isVideo(src) ? 'video' : 'photo'} ${index + 1}`}
                  loading="lazy"
                  className="w-full h-auto block transition-transform duration-700 group-hover:scale-105"
                />
                {isVideo(src) && (
                  <span className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <span className="w-12 h-12 rounded-full bg-red-600/90 flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
                      <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                    </span>
                  </span>
                )}
              </button>
            ))}
          </div>
        </section>
      ))}

      {/* PHOTO LIGHTBOX */}
      <AnimatePresence>
        {photo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setPhoto(null)}
          >
            {isVideo(config.albums[photo.album].images[photo.index]) ? (
              <video
                key={config.albums[photo.album].images[photo.index]}
                src={config.albums[photo.album].images[photo.index]}
                poster={posterFor(config.albums[photo.album].images[photo.index])}
                controls
                autoPlay
                muted
                loop
                playsInline
                className="max-w-full max-h-[85vh] object-contain rounded-xl"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <img
                src={config.albums[photo.album].images[photo.index]}
                alt={config.albums[photo.album].title}
                className="max-w-full max-h-[85vh] object-contain rounded-xl"
                onClick={(e) => e.stopPropagation()}
              />
            )}
            <button onClick={(e) => { e.stopPropagation(); showPhoto(-1); }} className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 bg-black/70 border border-white/10 p-3 rounded-full text-white cursor-pointer" aria-label="Previous photo">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={(e) => { e.stopPropagation(); showPhoto(1); }} className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 bg-black/70 border border-white/10 p-3 rounded-full text-white cursor-pointer" aria-label="Next photo">
              <ChevronRight className="w-5 h-5" />
            </button>
            <button onClick={() => setPhoto(null)} className="absolute top-4 right-4 bg-black/70 border border-white/10 p-2 rounded-full text-neutral-300 hover:text-white cursor-pointer" aria-label="Close photo">
              <X className="w-5 h-5" />
            </button>
            <span className="absolute bottom-5 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-widest uppercase text-neutral-400">
              {config.albums[photo.album].title} · {photo.index + 1} / {config.albums[photo.album].images.length}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LIGHTBOX STAGE MODAL FOR SINGLE ITEM VIEW */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
            id={`${variant}-lightbox`}
          >
            {/* Click to close backdrop handler */}
            <div className="absolute inset-0 z-0 cursor-zoom-out" onClick={() => setSelectedItem(null)}></div>

            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 180 }}
              className="bg-neutral-950 border border-white/10 rounded-3xl overflow-hidden max-w-4xl w-full max-h-[90vh] overflow-y-auto relative z-10 flex flex-col md:grid md:grid-cols-12 shadow-2xl shadow-black"
            >
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 z-30 bg-black/80 border border-white/10 p-2 rounded-full text-neutral-400 hover:text-white transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Left Column: Big Image display Frame */}
              <div className="md:col-span-7 bg-black aspect-video md:aspect-auto md:h-full relative overflow-hidden">
                <img
                  src={selectedItem.image}
                  alt={selectedItem.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Right Column: Case study details info */}
              <div className="md:col-span-5 p-6 md:p-8 flex flex-col justify-between bg-neutral-950">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-red-600 text-white text-[9px] font-mono px-3 py-1 rounded-full uppercase tracking-wider font-extrabold">
                      {selectedItem.category}
                    </span>
                    <span className="bg-neutral-900 border border-white/5 text-neutral-450 text-[9px] font-mono px-2.5 py-1 rounded-full uppercase">
                      {selectedItem.tag}
                    </span>
                  </div>

                  <h2 className="font-display text-xl md:text-2xl font-black text-white leading-tight uppercase mt-2">
                    {selectedItem.title}
                  </h2>

                  <div className="w-10 h-[2px] bg-red-650 rounded-full"></div>

                  <p className="text-neutral-300 text-sm leading-relaxed font-sans mt-2">
                    {selectedItem.caption}
                  </p>

                  {/* Fact sheet list */}
                  <div className="bg-neutral-900/60 p-4 rounded-2xl border border-white/5 flex flex-col gap-2.5 mt-2">
                    <div className="flex items-center gap-3 text-xs text-neutral-400">
                      <MapPin className="w-4 h-4 text-red-500 shrink-0" />
                      <span>Staging Hub: <b>Dubai, UAE</b></span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-neutral-400">
                      <Calendar className="w-4 h-4 text-red-500 shrink-0" />
                      <span>Assigned Timelines: <b>2024 Staging</b></span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-neutral-400">
                      <Sparkles className="w-4 h-4 text-red-500 shrink-0" />
                      <span>Production quality: <b>End-to-End VIP</b></span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/5 flex flex-col gap-3">
                  <span className="text-[9px] font-mono text-neutral-500 block uppercase">
                    Interested in similar Staging?
                  </span>
                  <PrimaryButton
                    onClick={() => {
                      setSelectedItem(null);
                      setActivePage('contact');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    text="Discuss Similar Project"
                    className="w-full"
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      </div>
    </div>
  );
}