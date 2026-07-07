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
- **Core**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS v4, Vanilla CSS variables
- **Animation**: Motion (formerly Framer Motion), Custom HTML5 Canvas rendering for scroll-bound frames
- **Icons**: Lucide React
- **Integration**: Google Gemini AI (`@google/genai`)

## Features
- **Scroll-Bound Frame Animation**: Smooth, CPU-optimized canvas sequence that responds pixel-for-pixel with the user's scroll progression.
- **Smart Asset Preloading & Caching**: Custom sequential frame loader that prevents CPU/Network spikes, featuring a beautiful full-screen percentage indicator.
- **Responsive COVER Layout**: Object-fit canvas logic that ensures cinematic imagery fully covers all screen sizes (including mobile devices).
- **Interactive Proposal Planner**: Streamlined booking/proposal form that guides users to specify their event requirements.
- **Clean Architecture & Strict Type Safety**: Fully typed data models, modular components, and automated linting.

## Local Setup & Run Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm

### Installation
1. Clone the repository and navigate to the project directory:
   ```bash
   git clone <repo-url>
   cd "Mice Media"
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file in the root directory and add your API key (if needed):
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

5. Check for code quality and TypeScript compilation:
   ```bash
   npm run lint
   ```
