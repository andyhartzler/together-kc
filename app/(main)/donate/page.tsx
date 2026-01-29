'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';

// Bar positions every 25px, extended to 1175px to cover full container
const BAR_POSITIONS = Array.from({ length: Math.ceil(1175 / 25) }, (_, i) => i * 25);

// Animated checkmark with blue circular arrow - matching the reference image
const AnimatedCheckmark = () => (
  <div className="relative w-28 h-28 sm:w-36 sm:h-36">
    {/* Blue circular arrow with glow */}
    <motion.svg
      viewBox="0 0 120 120"
      className="absolute inset-0 w-full h-full"
      style={{ filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))' }}
    >
      {/* Circular arrow path - draws around the checkmark */}
      <motion.path
        d="M 95 60 A 35 35 0 1 1 60 25"
        fill="none"
        stroke="#2563eb"
        strokeWidth="8"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.6, ease: 'easeOut' }}
      />
      {/* Arrowhead */}
      <motion.polygon
        points="52,18 68,25 58,38"
        fill="#2563eb"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 1.2 }}
      />
    </motion.svg>

    {/* Bold geometric red checkmark - straight edges */}
    <motion.svg
      viewBox="0 0 120 120"
      className="absolute inset-0 w-full h-full"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
    >
      {/* Checkmark as bold geometric shape with straight edges */}
      <motion.polygon
        points="30,65 45,80 50,75 35,60"
        fill="#E53935"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2, delay: 0.1 }}
      />
      <motion.polygon
        points="45,80 95,30 85,20 35,70"
        fill="#E53935"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      />
      {/* Combined checkmark shape for cleaner look */}
      <path
        d="M 25 62 L 48 85 L 98 28 L 85 18 L 45 65 L 32 52 Z"
        fill="#E53935"
      />
    </motion.svg>
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
