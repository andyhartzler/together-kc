'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';

// Bar positions every 25px, extended to 1175px to cover full container
const BAR_POSITIONS = Array.from({ length: Math.ceil(1175 / 25) }, (_, i) => i * 25);

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
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-navy">
              Support
              <br />
              <span className="gradient-text">Together KC</span>
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
