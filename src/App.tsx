/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Phone } from 'lucide-react';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import About from './components/About';
import Services from './components/Services';
import Portfolio from './components/Portfolio';
import Contact from './components/Contact';

export default function App() {
  const [activePage, setActivePage] = useState<string>('home');
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [selectedPortfolioId, setSelectedPortfolioId] = useState<string | null>(null);
  const [isContactMenuOpen, setIsContactMenuOpen] = useState(false);

  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return (
          <Home
            setActivePage={setActivePage}
            setSelectedServiceId={setSelectedServiceId}
            setSelectedPortfolioId={setSelectedPortfolioId}
          />
        );
      case 'about':
        return <About setActivePage={setActivePage} />;
      case 'services':
        return (
          <Services
            selectedServiceId={selectedServiceId}
            setSelectedServiceId={setSelectedServiceId}
            setActivePage={setActivePage}
          />
        );
      case 'portfolio':
        return (
          <Portfolio
            selectedPortfolioId={selectedPortfolioId}
            setSelectedPortfolioId={setSelectedPortfolioId}
            setActivePage={setActivePage}
          />
        );
      case 'contact':
        return <Contact />;
      default:
        return (
          <Home
            setActivePage={setActivePage}
            setSelectedServiceId={setSelectedServiceId}
            setSelectedPortfolioId={setSelectedPortfolioId}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#121213] via-[#0e0e0f] to-[#080809] text-[#f3f4f6] relative flex flex-col justify-between selection:bg-red-500 selection:text-white antialiased overflow-x-clip">
      {/* Absolute Ambient Backlight & Cyber Grid Overlay */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
         {/* Subtle grid mesh */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(220,77,73,0.02)_1px,transparent_1px)] [background-size:24px_24px] opacity-90"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.005)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.005)_1px,transparent_1px)] [background-size:120px_120px]"></div>
        
        {/* Dynamic moving orbs/blobs to eliminate flat black */}
        <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-red-900/10 blur-[150px] transform-gpu will-change-transform"></div>
        <div className="absolute bottom-[10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-red-950/12 blur-[130px] transform-gpu will-change-transform"></div>
        <div className="absolute top-[35%] right-[10%] w-[45vw] h-[45vw] rounded-full bg-red-900/8 blur-[160px] transform-gpu will-change-transform"></div>
        <div className="absolute bottom-[-10%] left-[10%] w-[55vw] h-[55vw] rounded-full bg-red-950/10 blur-[140px] transform-gpu will-change-transform"></div>
        
        {/* Top dramatic red laser backlight */}
        <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-red-650/14 via-red-950/3 to-transparent opacity-90"></div>
        {/* Horizontal dividing visual scanlines */}
        <div className="absolute inset-y-0 left-8 w-[1px] bg-gradient-to-b from-transparent via-white/2 to-transparent hidden xl:block"></div>
        <div className="absolute inset-y-0 right-8 w-[1px] bg-gradient-to-b from-transparent via-white/2 to-transparent hidden xl:block"></div>
      </div>

      {/* Primary Navigation Header */}
      <Header activePage={activePage} setActivePage={setActivePage} />

      {/* Multi-Page Transiting Switch Canvas */}
      <main className="flex-grow w-full relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePage}
            initial={{ opacity: 0, y: 20, scale: 0.995 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.995 }}
            transition={{ 
              duration: 0.45, 
              ease: [0.16, 1, 0.3, 1] // Custom refined EaseOutExpo curve
            }}
            className="w-full flex flex-col items-center"
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Sticky Contact FAB */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-center gap-3">
        <AnimatePresence>
          {isContactMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.8 }}
              className="flex flex-col gap-3"
            >
              {/* WhatsApp Button */}
              <a 
                href="https://wa.me/971501234567" // Placeholder WhatsApp link
                target="_blank" 
                rel="noreferrer"
                className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:scale-110 hover:bg-green-400 transition-all duration-300"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-5 h-5 text-white" />
              </a>
              {/* Call Button */}
              <a 
                href="tel:+971501234567" // Placeholder Phone link
                className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-lg hover:scale-110 hover:bg-blue-400 transition-all duration-300"
                aria-label="Call Us"
              >
                <Phone className="w-5 h-5 text-white" />
              </a>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Main FAB Toggle */}
        <button 
          onClick={() => setIsContactMenuOpen(!isContactMenuOpen)}
          className="w-12 h-12 md:w-14 md:h-14 bg-red-600 rounded-full flex items-center justify-center shadow-[0_4px_16px_rgba(220,38,38,0.5)] hover:scale-110 hover:bg-red-500 transition-all duration-300"
          aria-label="Contact Menu"
        >
          {isContactMenuOpen ? (
            <X className="w-5 h-5 md:w-6 md:h-6 text-white" />
          ) : (
            <MessageCircle className="w-5 h-5 md:w-6 md:h-6 text-white" />
          )}
        </button>
      </div>

      {/* System Footer Bar */}
      <Footer setActivePage={setActivePage} setSelectedServiceId={setSelectedServiceId} />
    </div>
  );
}
