'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';

// Step configuration for iframe container sizing
const STEP_CONFIG = {
  1: { height: 500, offset: -115 },   // Amount selection
  2: { height: 850, offset: -115 },   // Details + Payment (same size)
};

// Animated checkmark SVG component matching the logo style
const AnimatedCheckmark = () => (
  <motion.svg
    viewBox="0 0 100 100"
    className="w-12 h-12 sm:w-16 sm:h-16"
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
  >
    {/* Red checkmark */}
    <motion.path
      d="M25 55 L42 72 L75 28"
      fill="none"
      stroke="#E53935"
      strokeWidth="12"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
    />
  </motion.svg>
);

export default function DonatePage() {
  const [currentStep, setCurrentStep] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const config = STEP_CONFIG[currentStep as keyof typeof STEP_CONFIG] || STEP_CONFIG[2];

  const handleOverlayClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const x = e.clientX;
    const y = e.clientY;

    // 1. Check if click is in Continue button zone (bottom 40% of container)
    if (containerRef.current && currentStep === 1) {
      const rect = containerRef.current.getBoundingClientRect();
      const relY = (y - rect.top) / rect.height;

      if (relY > 0.60) {
        // Click is in Continue button area - resize after delay
        setTimeout(() => setCurrentStep(2), 500);
      }
    }

    // 2. Pass click through to iframe
    if (overlayRef.current && iframeRef.current) {
      // Hide overlay temporarily
      overlayRef.current.style.pointerEvents = 'none';

      // Dispatch full click sequence to iframe at same coordinates
      ['mousedown', 'mouseup', 'click'].forEach(eventType => {
        const event = new MouseEvent(eventType, {
          bubbles: true,
          cancelable: true,
          clientX: x,
          clientY: y,
          view: window,
        });
        iframeRef.current!.dispatchEvent(event);
      });

      // Re-enable overlay after brief delay
      setTimeout(() => {
        if (overlayRef.current) {
          overlayRef.current.style.pointerEvents = 'auto';
        }
      }, 100);
    }
  };

  return (
    <>
      {/* Hero Section - styled like FAQ page */}
      <section className="relative pt-32 pb-8 bg-light-gray overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-coral/5 rounded-full blur-3xl" />
        <div className="absolute top-40 right-20 w-80 h-80 bg-sky/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-golden/5 rounded-full blur-3xl" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* Animated Checkmark */}
            <div className="flex justify-center mb-6">
              <AnimatedCheckmark />
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-navy mb-6">
              Support
              <br />
              <span className="gradient-text">Together KC</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Your contribution helps ensure Kansas City voters have the facts about the earnings tax renewal.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Donation Form Section - white background to blend with iframe */}
      <section className="py-12 bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Iframe container with animated height */}
          <motion.div
            ref={containerRef}
            className="relative overflow-hidden"
            animate={{ height: config.height }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
          >
            <iframe
              ref={iframeRef}
              src="https://secure.numero.ai/contribute/Together-KC"
              title="Donate to Together KC"
              className="w-full absolute left-0"
              style={{
                height: '2100px',
                top: config.offset,
                border: 'none',
              }}
              allow="payment"
            />

            {/* Click-through overlay - only needed on step 1 */}
            {currentStep === 1 && (
              <div
                ref={overlayRef}
                onClick={handleOverlayClick}
                className="absolute inset-0 z-10 cursor-pointer"
                style={{ background: 'transparent' }}
              />
            )}
          </motion.div>
        </div>
      </section>

      {/* CTA Section - styled like FAQ page */}
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
