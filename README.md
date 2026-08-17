# MICE Media Events

Experience the next generation of event management showcase. A premium, high-performance web experience built for **MICE Media**, Dubai’s premier corporate event production agency. 

## Live Link
- **[Live Demo](https://micemediaevents.com/)** *(or [Local Host Preview](http://localhost:3000))*

## Screenshots
*(Screenshots will be added here once uploaded to the repository.)*

## Project Description
MICE Media is a state-of-the-art corporate event landing page designed to capture attention and convert high-ticket event clients in Dubai and the GCC. Drawing inspiration from Apple's iconic product landing pages, the application features an interactive, scroll-bound image sequence animation that guides users through a highly polished, immersive brand narrative. 

Built with React 19, TypeScript, and Canvas API, the site delivers buttery-smooth 60fps animations, optimized asset preloading, and a cinematic aesthetic that redefines corporate web presence.

## Tech Stack
- **Architecture**: Multi-Page Application (MPA) / Static HTML Export
- **Core**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS v4, Vanilla CSS variables
- **Animation**: Motion (formerly Framer Motion), Custom HTML5 Canvas rendering
- **Icons**: Lucide React

## Features
- **Zero-Server Architecture**: Permanently ejected into pure static HTML/CSS/JS. Deployable on any basic shared hosting with zero Node.js backend required.
- **Scroll-Bound Frame Animation**: Smooth, CPU-optimized canvas sequence that responds pixel-for-pixel with the user's scroll progression.
- **Smart Asset Preloading & Caching**: Custom sequential frame loader that prevents CPU/Network spikes, featuring a beautiful full-screen percentage indicator.
- **Responsive COVER Layout**: Object-fit canvas logic that ensures cinematic imagery fully covers all screen sizes.
- **Interactive Proposal Planner**: Streamlined booking/proposal form that guides users to specify their event requirements.

## Local Setup & Execution (No Server Needed)

### Option 1: Double-Click Local Execution
The project has been configured with legacy script polyfills and relative paths. You can execute the site entirely offline without a server:
1. Open the `/dist` directory in your file manager.
2. Double-click `index.html` to open it in any modern browser.

### Option 2: Local HTTP Server
If you prefer to serve the static files over a local network:
```bash
npx serve dist
```
Navigate to `http://localhost:3000` in your browser.
