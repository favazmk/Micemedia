import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import legacy from '@vitejs/plugin-legacy';
import path from 'path';
import {defineConfig, type Plugin} from 'vite';
import {PAGE_SEO, pageForFile, SITE_URL, SITE_NAME, OG_IMAGE, LOCAL_BUSINESS_JSON_LD} from './src/seo';

const esc = (t: string) => t.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

// Writes each page's title, description, canonical, social tags, JSON-LD and a no-JS fallback into
// the HTML itself, so search engines and link previews don't depend on the React app running.
const seoPlugin = (): Plugin => ({
  name: 'mice-media-seo',
  transformIndexHtml: {
    order: 'pre',
    handler(html, ctx) {
      const seo = PAGE_SEO[pageForFile(ctx.filename)];
      const url = SITE_URL + seo.path;
      const robots = ctx.filename.endsWith('portfolio.html') ? 'noindex,follow' : 'index,follow,max-image-preview:large';
      const head = [
        `<title>${esc(seo.title)}</title>`,
        `<meta name="description" content="${esc(seo.description)}" />`,
        `<meta name="robots" content="${robots}" />`,
        `<meta name="theme-color" content="#0a0a0a" />`,
        `<link rel="canonical" href="${url}" />`,
        `<meta property="og:type" content="website" />`,
        `<meta property="og:site_name" content="${SITE_NAME}" />`,
        `<meta property="og:locale" content="en_AE" />`,
        `<meta property="og:title" content="${esc(seo.title)}" />`,
        `<meta property="og:description" content="${esc(seo.description)}" />`,
        `<meta property="og:url" content="${url}" />`,
        `<meta property="og:image" content="${OG_IMAGE}" />`,
        `<meta name="twitter:card" content="summary_large_image" />`,
        `<meta name="twitter:title" content="${esc(seo.title)}" />`,
        `<meta name="twitter:description" content="${esc(seo.description)}" />`,
        `<meta name="twitter:image" content="${OG_IMAGE}" />`,
        `<script type="application/ld+json">${JSON.stringify(LOCAL_BUSINESS_JSON_LD)}</script>`,
      ].join('\n    ');
      return html
        .replace(/\s*<title>[\s\S]*?<\/title>/, '')
        .replace(/\s*<meta name="description"[^>]*>/, '')
        .replace('<meta charset="UTF-8" />', `<meta charset="UTF-8" />\n    ${head}`)
        .replace('<div id="root"></div>', `<div id="root"></div>\n    <noscript><h1>${esc(seo.title)}</h1><p>${esc(seo.summary)}</p></noscript>`);
    },
  },
});

export default defineConfig(() => {
  return {
    base: './', // Allow relative paths for file:// execution
    plugins: [
      seoPlugin(),
      react(),
      tailwindcss(),
      legacy({
        targets: ['defaults', 'not IE 11']
      })
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          about: path.resolve(__dirname, 'about-us.html'),
          services: path.resolve(__dirname, 'services.html'),
          exhibition: path.resolve(__dirname, 'exhibition.html'),
          events: path.resolve(__dirname, 'events.html'),
          portfolio: path.resolve(__dirname, 'portfolio.html'), // legacy URL, redirects to Events in-app
          contact: path.resolve(__dirname, 'contact.html'),
        },
      },
    },
  };
});
