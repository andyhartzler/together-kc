'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';

// Bar positions every 25px, extended to 1175px to cover full container
const BAR_POSITIONS = Array.from({ length: Math.ceil(1175 / 25) }, (_, i) => i * 25);

// Animated checkmark with blue circular arrow
const AnimatedCheckmark = () => (
  <div className="relative w-36 h-36 sm:w-44 sm:h-44">
    <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
      <defs>
        <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>
      </defs>

      {/* Blue circular arrow - behind checkmark */}
      <motion.circle
        cx="50"
        cy="50"
        r="38"
        fill="none"
        stroke="url(#blueGrad)"
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray="200"
        strokeDashoffset="40"
        initial={{ strokeDashoffset: 240, opacity: 0 }}
        animate={{ strokeDashoffset: 40, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
        style={{ filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))' }}
      />

      {/* Arrowhead */}
      <motion.polygon
        points="18,68 28,80 32,66"
        fill="#2563eb"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 1.1 }}
        style={{ filter: 'drop-shadow(0 0 4px rgba(59, 130, 246, 0.5))' }}
      />

      {/* Red checkmark - bold geometric shape */}
      <motion.path
        d="M 22 52 L 40 70 L 82 22 L 72 14 L 40 52 L 30 42 Z"
        fill="#dc2626"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
        style={{ transformOrigin: '50% 50%' }}
      />
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
