/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Compass, 
  Send, 
  CheckCircle, 
  MessageSquare, 
  FileText, 
  Calendar, 
  Users, 
  Globe, 
  AlertCircle 
} from 'lucide-react';
import { BRAND_INFO } from '../data';
import { ProposalFormInputs } from '../types';
import { PrimaryButton } from '@/components/ui/primary-button';
import { GetStartedButton } from '@/components/ui/get-started-button';
import Particles from './Particles';

export default function Contact() {
  const [formInputs, setFormInputs] = useState<ProposalFormInputs>({
    fullName: '',
    companyName: '',
    email: '',
    phone: '',
    eventType: 'Conference',
    estimatedGuests: '50–200',
    preferredDate: '',
    comments: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [refCode, setRefCode] = useState('');
  const [formError, setFormError] = useState('');

  // Event Type list
  const eventTypes = [
    'Conference', 
    'Gala Dinner', 
    'Exhibition', 
    'Product Launch', 
    'Team Building', 
    'Entertainment', 
    'Brand Activation', 
    'Incentive Travel', 
    'Other'
  ];


  const handleInputChange = (field: keyof ProposalFormInputs, value: string) => {
    setFormInputs(prev => ({
      ...prev,
      [field]: value
    }));
    setFormError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formInputs.fullName || !formInputs.email || !formInputs.phone) {
      setFormError('Please complete all primary fields (Full Name, Email, and Phone Number) to submit your brief.');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate high-end backend review time
    setTimeout(() => {
      const code = 'MICE-' + Math.floor(100000 + Math.random() * 900000);
      setRefCode(code);
      setIsSubmitting(false);
      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1800);
  };

  return (
    <div className="py-24 md:py-32 flex flex-col w-full relative min-h-screen" id="contactpage-root">
      
      {/* ── Particles animated WebGL background ── */}
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
      {/* SECTION 1: HEADER */}
      <section className="relative px-6 max-w-7xl mx-auto w-full mb-16 text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-red-650/10 rounded-full blur-3xl pointer-events-none"></div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neutral-905 border border-white/5 backdrop-blur-md mb-6"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-red-650 animate-pulse"></span>
          <span className="font-mono text-[10px] tracking-widest uppercase text-neutral-400">
            Let's Talk
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-display text-4xl sm:text-5xl md:text-6xl font-black uppercase text-white tracking-tight"
        >
          Your Next Event <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-600 to-amber-500 text-glow inline-block py-1">Starts Here.</span>
        </motion.h1>
        
        <p className="text-neutral-400 font-sans text-sm md:text-base leading-relaxed mt-4 max-w-xl mx-auto">
          Tell us about your event vision — then watch our senior executive board turn it into an unforgettable regional legacy.
        </p>

        <div className="w-12 h-[2px] bg-red-650 mx-auto mt-6 rounded-full"></div>
      </section>

      {/* DETAILED CONTENT CONTAINER */}
      <section className="px-6 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-start relative z-10">
        
        {/* Left Columns (5 spans) for Contact cards and Dynamic Estimator widget */}
        <div className="lg:col-span-5 flex flex-col gap-8">
          
          {/* Card 1: Head Office details */}
          <div className="glass-panel-heavy rounded-3xl p-8 border border-white/5 relative overflow-hidden" id="contact-details-box">
            <h3 className="font-display text-lg font-bold text-white mb-6 uppercase tracking-wider border-b border-white/5 pb-3">
              MICE MEDIA Hub
            </h3>
            
            <div className="flex flex-col gap-6">
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-white/5 flex items-center justify-center text-red-500 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-mono text-neutral-510 uppercase tracking-wider">Office Address</span>
                  <span className="text-sm font-sans text-neutral-300 font-medium mt-1">
                    {BRAND_INFO.address}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-white/5 flex items-center justify-center text-red-500 shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-mono text-neutral-510 uppercase tracking-wider">Direct Hotlines</span>
                  <div className="flex flex-col mt-1">
                    <a href={`tel:${BRAND_INFO.phone1}`} className="text-sm font-sans text-neutral-300 font-bold hover:text-red-500 transition-colors">
                      {BRAND_INFO.phone1}
                    </a>
                    <a href={`tel:${BRAND_INFO.phone2}`} className="text-sm font-sans text-neutral-300 font-bold hover:text-red-500 transition-colors">
                      {BRAND_INFO.phone2}
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-white/5 flex items-center justify-center text-red-500 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-mono text-neutral-510 uppercase tracking-wider">Electronic Mail</span>
                  <a href={`mailto:${BRAND_INFO.email}`} className="text-sm font-sans text-neutral-300 font-bold hover:text-red-500 transition-colors mt-1 break-all">
                    {BRAND_INFO.email}
                  </a>
                </div>
              </div>

            </div>

            {/* Quick action WhatsApp link */}
            <div className="mt-8 pt-6 border-t border-white/5 flex flex-wrap gap-4 items-center">
              <a
                href={BRAND_INFO.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 bg-green-600 hover:bg-green-500 text-white font-mono text-xs uppercase font-extrabold px-5 py-3 rounded-full shadow-lg shadow-green-600/10 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 fill-white" />
                Direct WhatsApp Chat
              </a>
              <span className="text-[10px] font-mono text-neutral-500">
                Avg Response: under 12 mins
              </span>
            </div>
          </div>


        </div>


        {/* Right Columns (7 spans) for actual Proposal briefing input Form */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-panel-heavy rounded-3xl p-8 md:p-10 border border-white/5"
                id="contact-form-container"
              >
                <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-5">
                  <FileText className="w-6 h-6 text-red-500" />
                  <div>
                    <h3 className="font-display text-lg font-bold text-white uppercase tracking-wider">
                      Request a Proposal
                    </h3>
                    <span className="text-[10px] font-mono text-neutral-500 uppercase">
                      Takes roughly 2 minutes to submit
                    </span>
                  </div>
                </div>

                {formError && (
                  <div className="mb-6 p-4.5 bg-red-650/10 border border-red-500/30 rounded-xl text-red-400 text-xs flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-6" id="brief-form">
                  
                  {/* Row 1 */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-mono text-neutral-400 uppercase tracking-wider">Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Sharafuddin Ahmed"
                        value={formInputs.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        className="bg-neutral-900 border border-white/5 focus:border-red-500/60 text-white rounded-xl py-3 px-4 font-sans text-sm focus:outline-hidden transition-colors"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-mono text-neutral-400 uppercase tracking-wider">Company / Organisation</label>
                      <input
                        type="text"
                        placeholder="e.g. AirlinePros Dubai"
                        value={formInputs.companyName}
                        onChange={(e) => handleInputChange('companyName', e.target.value)}
                        className="bg-neutral-900 border border-white/5 focus:border-red-500/60 text-white rounded-xl py-3 px-4 font-sans text-sm focus:outline-hidden transition-colors"
                      />
                    </div>
                  </div>

                  {/* Row 2 */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-mono text-neutral-400 uppercase tracking-wider">Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. sharafuddin@airlinepros.com"
                        value={formInputs.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="bg-neutral-900 border border-white/5 focus:border-red-500/60 text-white rounded-xl py-3 px-4 font-sans text-sm focus:outline-hidden transition-colors"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-mono text-neutral-400 uppercase tracking-wider">Phone Phone Number *</label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. +971 50 000 0000"
                        value={formInputs.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="bg-neutral-900 border border-white/5 focus:border-red-500/60 text-white rounded-xl py-3 px-4 font-sans text-sm focus:outline-hidden transition-colors"
                      />
                    </div>
                  </div>

                  {/* Row 3 - Dropdowns */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-mono text-neutral-400 uppercase tracking-wider">Event Type</label>
                      <select
                        value={formInputs.eventType}
                        onChange={(e) => handleInputChange('eventType', e.target.value)}
                        className="bg-neutral-905 border border-white/5 focus:border-red-500/60 text-white rounded-xl py-3 px-4 font-sans text-sm focus:outline-hidden transition-colors cursor-pointer"
                      >
                        {eventTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-mono text-neutral-400 uppercase tracking-wider">Estimated Guests</label>
                      <select
                        value={formInputs.estimatedGuests}
                        onChange={(e) => handleInputChange('estimatedGuests', e.target.value)}
                        className="bg-neutral-905 border border-white/5 focus:border-red-500/60 text-white rounded-xl py-3 px-4 font-sans text-sm focus:outline-hidden transition-colors cursor-pointer"
                      >
                        <option value="Under 50">Under 50 guests</option>
                        <option value="50–200">50–200 guests</option>
                        <option value="200–500">200–500 guests</option>
                        <option value="500–1,000">500–1,000 guests</option>
                        <option value="1,000+">1,000+ guests</option>
                      </select>
                    </div>
                  </div>

                  {/* Row 4 */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-mono text-neutral-400 uppercase tracking-wider">Preferred Event Date</label>
                    <input
                      type="date"
                      value={formInputs.preferredDate}
                      onChange={(e) => handleInputChange('preferredDate', e.target.value)}
                      className="bg-neutral-900 border border-white/5 focus:border-red-500/60 text-white rounded-xl py-3 px-4 font-sans text-sm focus:outline-hidden transition-colors cursor-pointer"
                    />
                  </div>

                  {/* Row 5 */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-mono text-neutral-400 uppercase tracking-wider">Tell Us About Your Event</label>
                    <textarea
                      rows={4}
                      placeholder="Share concepts, branding priorities, seating structure, AV expectations, specific vendor requirements, etc..."
                      value={formInputs.comments}
                      onChange={(e) => handleInputChange('comments', e.target.value)}
                      className="bg-neutral-900 border border-white/5 focus:border-red-500/60 text-white rounded-xl py-3.5 px-4 font-sans text-sm focus:outline-hidden transition-colors resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <PrimaryButton
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-4 !rounded-xl"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        Engineering Proposal Brief...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send Enquiry
                      </>
                    )}
                  </PrimaryButton>

                </form>
              </motion.div>
            ) : (
              // BREATHTAKING SUCCESS RECEIPT ELEMENT
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-panel-heavy rounded-3xl p-8 md:p-12 border border-red-500/20 text-center flex flex-col items-center"
                id="success-receipt-box"
              >
                <div className="w-16 h-16 rounded-full bg-red-600/10 border border-red-500/30 flex items-center justify-center text-red-500 mb-8 animate-bounce">
                  <CheckCircle className="w-8 h-8" />
                </div>
                
                <h3 className="font-display text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
                  Brief Staged Successfully!
                </h3>
                
                <span className="mt-2 text-xs font-mono text-neutral-400">
                  REF NO: <b className="text-red-500 font-bold">{refCode}</b>
                </span>

                <div className="w-10 h-[2px] bg-red-650 my-6"></div>

                <div className="bg-neutral-900/60 border border-white/5 rounded-2xl p-6 text-left w-full max-w-md flex flex-col gap-3 font-mono text-[11px] text-neutral-400">
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span>Enquirer:</span>
                    <span className="text-white font-bold">{formInputs.fullName}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span>Organisation:</span>
                    <span className="text-white font-bold">{formInputs.companyName || 'Not Specified'}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span>Staging Format:</span>
                    <span className="text-red-500 font-bold">{formInputs.eventType}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span>Attendance Bracket:</span>
                    <span className="text-white font-bold">{formInputs.estimatedGuests} Guests</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span>Expected Date:</span>
                    <span className="text-white font-bold">{formInputs.preferredDate || 'To Be Arranged'}</span>
                  </div>
                </div>

                <p className="mt-8 text-neutral-400 font-sans text-xs sm:text-sm max-w-md leading-relaxed">
                  Our director board is drafting your concept blueprint. For immediate priority booking or modifications, click the button below to join our direct WhatsApp live link using your reference code.
                </p>

                <div className="mt-8 flex flex-col sm:flex-row gap-4 items-center justify-center w-full max-w-md">
                  <a
                    href={`https://wa.me/971508408655?text=Hello%20MICE%20Media,%20just%20submitted%20brief%2520reference%20${refCode}.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto bg-green-600 hover:bg-green-500 text-white font-mono text-xs uppercase font-bold py-4.5 px-8 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg"
                  >
                    <MessageSquare className="w-4.5 h-4.5 fill-white" />
                    Priority WhatsApp Link
                  </a>
                  <GetStartedButton
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormInputs({
                        fullName: '',
                        companyName: '',
                        email: '',
                        phone: '',
                        eventType: 'Conference',
                        estimatedGuests: '50–200',
                        preferredDate: '',
                        comments: ''
                      });
                    }}
                    text="Submit Another Brief"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </section>

      </div>
    </div>
  );
}
