'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';

// Bar positions every 25px, extended to 1175px to cover full container
const BAR_POSITIONS = Array.from({ length: Math.ceil(1175 / 25) }, (_, i) => i * 25);

// Animated checkmark with blue circular arrow - matching the reference image exactly
const AnimatedCheckmark = () => (
  <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48">
    <svg
      viewBox="0 0 200 200"
      className="w-full h-full overflow-visible"
      style={{ filter: 'drop-shadow(0 0 12px rgba(37, 99, 235, 0.4))' }}
    >
      {/* Blue circular arrow - BEHIND the checkmark */}
      {/* Main arc - goes clockwise from top, around to bottom-left */}
      <motion.path
        d="M 100 30 A 70 70 0 1 1 45 145"
        fill="none"
        stroke="url(#blueGradient)"
        strokeWidth="14"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, delay: 0.5, ease: 'easeInOut' }}
      />
      {/* Arrowhead at bottom-left pointing in direction of travel */}
      <motion.polygon
        points="25,135 50,155 55,130"
        fill="url(#blueGradient)"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 1.2, ease: 'backOut' }}
      />

      {/* Gradient definitions */}
      <defs>
        <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
        <linearGradient id="redGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="100%" stopColor="#dc2626" />
        </linearGradient>
      </defs>

      {/* Bold geometric red checkmark - ON TOP, extends beyond circle */}
      <motion.g
        initial={{ opacity: 0, scale: 0.3 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
      >
        {/* Short leg of checkmark (bottom-left part) */}
        <motion.polygon
          points="20,95 55,130 75,110 40,75"
          fill="url(#redGradient)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        />
        {/* Long leg of checkmark (going up to top-right) */}
        <motion.polygon
          points="55,130 180,5 160,-15 35,110"
          fill="url(#redGradient)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        />
      </motion.g>
    </svg>
  </div>
);

export default function DonatePage() {
  // Prevent iframe from stealing scroll position when it auto-focuses
  useEffect(() => {
    window.scrollTo(0, 0);
    const timeouts = [100, 300, 500, 1000].map(delay =>
      setTimeout(() => window.scrollTo(0, 0), delay)
    );
    return () => timeouts.forEach(clearTimeout);
  }, []);

  return (
    <>
      {/* Hero Section - pure white to match iframe */}
      <section className="pt-32 pb-8 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* Animated Checkmark with Glowy Circle */}
            <div className="flex justify-center mb-6">
              <AnimatedCheckmark />
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
              <span className="text-navy">Support </span>
              <span className="gradient-text">the Renewal</span>
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Donation Form Section - white background to match iframe */}
      <section className="py-12 bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Iframe container */}
          <div
            className="relative overflow-hidden"
            style={{ height: 1100 }}
          >
            <iframe
              src="https://secure.numero.ai/contribute/Together-KC"
              title="Donate to Together KC"
              className="w-full absolute left-0"
              tabIndex={-1}
              style={{
                height: '2100px',
                top: -115,
                border: 'none',
              }}
              allow="payment"
            />
            {/* White bars to cover iframe card edges - individual bars every 25px */}
            {BAR_POSITIONS.map(pos => (
              <div
                key={`left-${pos}`}
                className="absolute left-0 bg-white z-10"
                style={{ top: pos, height: 25, width: 24 }}
              />
            ))}
            {BAR_POSITIONS.map(pos => (
              <div
                key={`right-${pos}`}
                className="absolute right-0 bg-white z-10"
                style={{ top: pos, height: 25, width: 24 }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-navy">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Other Ways to Help
            </h2>
            <p className="text-lg text-white/80 mb-8">
              Can&apos;t donate right now? There are many other ways to support the campaign.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="primary" href="/endorsements#endorse">
                Add Your Endorsement
              </Button>
              <Button
                variant="outline"
                href="mailto:action@together-kc.com?subject=Volunteer for Together KC"
                className="border-white text-white hover:bg-white hover:text-navy"
              >
                Volunteer With Us
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
