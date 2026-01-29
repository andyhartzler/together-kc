'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';

// Bar positions every 25px, extended to 1175px to cover full container
const BAR_POSITIONS = Array.from({ length: Math.ceil(1175 / 25) }, (_, i) => i * 25);

// Animated checkmark with glowy red circle
const AnimatedCheckmark = () => (
  <motion.div
    className="relative"
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
  >
    {/* Glowy red circle outline */}
    <motion.div
      className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-coral flex items-center justify-center"
      initial={{ boxShadow: '0 0 0 0 rgba(229, 57, 53, 0)' }}
      animate={{ boxShadow: '0 0 20px 5px rgba(229, 57, 53, 0.4)' }}
      transition={{ duration: 0.8, delay: 0.3 }}
    >
      {/* Checkmark SVG */}
      <motion.svg
        viewBox="0 0 100 100"
        className="w-10 h-10 sm:w-12 sm:h-12"
      >
        <motion.path
          d="M25 55 L42 72 L75 28"
          fill="none"
          stroke="#E53935"
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.6, delay: 0.5, ease: 'easeOut' }}
        />
      </motion.svg>
    </motion.div>
  </motion.div>
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

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-navy">
              Support
              <br />
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
