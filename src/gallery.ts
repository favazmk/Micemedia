/// <reference types="vite/client" />

/**
 * Photo galleries for the Events and Exhibition pages.
 *
 * Drop images into src/assets/gallery/events/ or src/assets/gallery/exhibitions/
 * and they show up automatically — no code changes needed. Put each event's photos
 * in its own subfolder (e.g. events/Tractebel EOY/) and the folder name becomes the
 * album title. Loose files directly in the root folder go into a "Highlights" album.
 */

export interface GalleryAlbum {
  title: string;
  images: string[];
}

const eventFiles = import.meta.glob(
  '/src/assets/gallery/events/**/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP}',
  { eager: true, query: '?url', import: 'default' }
) as Record<string, string>;

const exhibitionFiles = import.meta.glob(
  '/src/assets/gallery/exhibitions/**/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP}',
  { eager: true, query: '?url', import: 'default' }
) as Record<string, string>;

function toAlbums(files: Record<string, string>, root: string): GalleryAlbum[] {
  const albums = new Map<string, string[]>();
  for (const path of Object.keys(files).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))) {
    const rest = path.slice(root.length + 1);
    const slash = rest.indexOf('/');
    const title = slash === -1 ? 'Highlights' : rest.slice(0, slash);
    if (!albums.has(title)) albums.set(title, []);
    albums.get(title)!.push(files[path]);
  }
  return [...albums].map(([title, images]) => ({ title, images }));
}

export const EVENT_ALBUMS = toAlbums(eventFiles, '/src/assets/gallery/events');
export const EXHIBITION_ALBUMS = toAlbums(exhibitionFiles, '/src/assets/gallery/exhibitions');

/** Look up specific gallery photos by file name (e.g. 'dsc09020.webp'), in the order given. */
export function pickPhotos(fileNames: string[]): { src: string; alt: string }[] {
  const all = { ...eventFiles, ...exhibitionFiles };
  return fileNames.flatMap((name) => {
    const path = Object.keys(all).find((p) => p.endsWith(`/${name}`));
    if (!path) return [];
    const album = path.split('/').slice(-2, -1)[0];
    return [{ src: all[path], alt: album }];
  });
}
