'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Heart, Shield, Users, Sparkles } from 'lucide-react';

// Step heights determined from screenshots
const STEP_HEIGHTS = {
  1: 420,  // Amount selection step
  2: 720,  // Details/info step
  3: 460,  // Payment step
};

// Offsets to hide Numero branding
const STEP_OFFSETS = {
  1: -250,  // Hide header, no progress bar visible
  2: -148,  // Hide logo, show progress bar
  3: -148,  // Hide logo, show progress bar
};

export default function DonatePage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [loadCount, setLoadCount] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Attack 1: Load event counting
  // Many donation forms do full page navigations between steps for security
  // Each navigation fires onLoad - count them to detect step changes
  const handleIframeLoad = useCallback(() => {
    setLoadCount(prev => {
      const newCount = prev + 1;
      console.log(`[Donate] Iframe load #${newCount}`);
      // Only update step if we haven't exceeded step 3
      if (newCount <= 3) {
        console.log(`[Donate] Setting step to ${newCount} based on load count`);
        setCurrentStep(newCount);
      }
      return newCount;
    });
  }, []);

  // Attack 2: Window blur detection for step changes
  // When user interacts with iframe, parent window loses focus
  useEffect(() => {
    let lastBlurTime = 0;
    let interactionCount = 0;

    const handleBlur = () => {
      const now = Date.now();
      // If blur happens >3 seconds after last, might indicate form submission/step change
      if (now - lastBlurTime > 3000 && loadCount > 0) {
        interactionCount++;
        console.log(`[Donate] Window blur detected, interaction #${interactionCount}`);
      }
      lastBlurTime = now;
    };

    window.addEventListener('blur', handleBlur);
    return () => window.removeEventListener('blur', handleBlur);
  }, [loadCount]);

  // Attack 3: ResizeObserver on iframe element
  // The iframe element might resize when content changes
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        console.log(`[Donate] Iframe resize detected: ${entry.contentRect.width}x${entry.contentRect.height}`);
      }
    });

    resizeObserver.observe(iframe);
    return () => resizeObserver.disconnect();
  }, []);

  // Attack 4: postMessage listener
  // Some platforms send height/step messages without documentation
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Only accept messages from Numero
      if (!event.origin.includes('numero.ai')) return;

      console.log('[Donate] postMessage received:', event.data);

      // Check for height data
      if (event.data?.height && typeof event.data.height === 'number') {
        console.log(`[Donate] Numero sent height: ${event.data.height}`);
      }

      // Check for step data
      if (event.data?.step && typeof event.data.step === 'number') {
        console.log(`[Donate] Numero sent step: ${event.data.step}`);
        setCurrentStep(event.data.step);
      }

      // Check for any resize-related data
      if (event.data?.type === 'resize' || event.data?.action === 'resize') {
        console.log('[Donate] Numero resize event:', event.data);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const currentHeight = STEP_HEIGHTS[currentStep as keyof typeof STEP_HEIGHTS];
  const currentOffset = STEP_OFFSETS[currentStep as keyof typeof STEP_OFFSETS];

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-32 sm:pt-40 pb-8 sm:pb-12 bg-gradient-to-br from-navy via-navy/95 to-sky/80 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-coral/30 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-sky/30 rounded-full blur-3xl"
          />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                               linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: '50px 50px',
            }}
          />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
              className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-coral/20 backdrop-blur-sm border border-coral/30 mb-6 sm:mb-8"
            >
              <Heart className="w-8 h-8 sm:w-10 sm:h-10 text-coral" />
            </motion.div>

            <h1 className="font-bold text-white mb-6 sm:mb-8">
              <span className="block text-3xl sm:text-5xl md:text-6xl mb-2 sm:mb-3">
                {['Support', 'Kansas', 'City'].map((word, i) => (
                  <motion.span
                    key={word}
                    initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{
                      duration: 0.5,
                      delay: 0.2 + i * 0.15,
                      ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                    className="inline-block mr-[0.3em] last:mr-0"
                  >
                    {word}
                  </motion.span>
                ))}
              </span>

              <motion.span
                initial={{
                  opacity: 0,
                  scale: 0.5,
                  filter: 'blur(20px)',
                  textShadow: '0 0 0px rgba(229, 57, 53, 0)',
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  filter: 'blur(0px)',
                  textShadow: [
                    '0 0 0px rgba(229, 57, 53, 0)',
                    '0 0 60px rgba(229, 57, 53, 0.8)',
                    '0 0 30px rgba(229, 57, 53, 0.4)',
                  ],
                }}
                transition={{
                  duration: 0.8,
                  delay: 0.8,
                  ease: [0.34, 1.56, 0.64, 1],
                  textShadow: {
                    duration: 1.2,
                    delay: 0.8,
                    times: [0, 0.5, 1],
                  },
                }}
                className="block text-3xl sm:text-5xl md:text-6xl text-coral relative"
              >
                Together
                <motion.span
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 1.4, ease: 'easeOut' }}
                  className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-32 sm:w-48 h-1 bg-gradient-to-r from-transparent via-coral to-transparent origin-center"
                />
              </motion.span>
            </h1>
          </div>
        </div>

        <div
          className="absolute bottom-0 left-0 right-0 h-24 sm:h-32"
          style={{
            background:
              'linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,1) 100%)',
          }}
        />
      </section>

      {/* Donation Form Section */}
      <section className="section-padding pt-4 sm:pt-8 pb-16 sm:pb-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 items-start">
            {/* Left Column - Why the E-Tax Matters */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-2 space-y-6"
            >
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-navy mb-4">
                  Why Renewal Matters
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  The earnings tax funds <strong>47% of Kansas City&apos;s general fund</strong> —
                  approximately $373 million that pays for the services our city depends on every day.
                  Voting YES doesn&apos;t raise taxes; it simply renews what&apos;s been in place since 1963.
                </p>
              </div>

              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-br from-light-gray to-white border border-gray-100"
                >
                  <div className="w-10 h-10 rounded-lg bg-coral/10 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-coral" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-navy mb-1">Protects First Responders</h3>
                    <p className="text-sm text-gray-600">
                      The e-tax funds firefighters, police, and EMTs. Without it, the city would face first responder layoffs and increased emergency response times.
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-br from-light-gray to-white border border-gray-100"
                >
                  <div className="w-10 h-10 rounded-lg bg-sky/10 flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 text-sky" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-navy mb-1">Keeps Services Running</h3>
                    <p className="text-sm text-gray-600">
                      Trash pickup, pothole repair, snow removal, and street lighting all depend on e-tax funding. Failed renewal means cuts or elimination of these services.
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-br from-light-gray to-white border border-gray-100"
                >
                  <div className="w-10 h-10 rounded-lg bg-golden/10 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-5 h-5 text-golden" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-navy mb-1">No Replacement Exists</h3>
                    <p className="text-sm text-gray-600">
                      There is no realistic path to replacing this revenue. Kansas City doesn&apos;t have the legal authority to pass tax increases large enough to make up for a failed renewal.
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Right Column - Donation Form Embed */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-3 space-y-4"
            >
              <div className="relative">
                {/* Decorative glow behind the form */}
                <div className="absolute -inset-4 bg-gradient-to-br from-coral/20 via-sky/10 to-golden/20 rounded-3xl blur-2xl opacity-50" />

                {/* Form container */}
                <div className="relative bg-white rounded-2xl shadow-2xl shadow-navy/10 border border-gray-100 overflow-hidden">
                  {/* Header accent */}
                  <div className="h-2 bg-gradient-to-r from-coral via-golden to-sky" />

                  {/* Iframe container - dynamically sized based on detected step */}
                  <motion.div
                    ref={containerRef}
                    className="relative overflow-hidden"
                    animate={{ height: currentHeight }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
                    <iframe
                      ref={iframeRef}
                      src="https://secure.numero.ai/contribute/Together-KC"
                      title="Donate to Together KC"
                      onLoad={handleIframeLoad}
                      className="w-full absolute left-0"
                      style={{
                        height: '1600px',
                        border: 'none',
                        top: currentOffset,
                      }}
                      allow="payment"
                    />
                  </motion.div>
                </div>
              </div>

              {/* Legal Disclaimer Tile */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-gradient-to-br from-light-gray to-white rounded-xl p-5 border border-gray-100"
              >
                <p className="text-xs text-gray-500 leading-relaxed">
                  Under Missouri Law, political action committees, corporations, and other business
                  entities may contribute to Together KC in any amount. Together KC is a political
                  action committee registered with the Missouri Ethics Commission. Foreign nationals
                  may not contribute to Together KC.
                </p>
                <p className="text-xs text-gray-400 mt-3">
                  EIN: 85-1464950 &bull; Paid for by Together KC, Dan Kopp, Treasurer.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Section */}
      <section className="section-padding bg-gradient-to-b from-light-gray to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-navy mb-4">
              Other Ways to Help
            </h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Can&apos;t donate right now? There are many other ways to support the campaign.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <motion.a
                href="/endorsements#endorse"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-navy text-white font-semibold rounded-full hover:bg-navy/90 transition-colors"
              >
                Add Your Endorsement
              </motion.a>
              <motion.a
                href="mailto:action@together-kc.com?subject=Volunteer for Together KC"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-navy font-semibold rounded-full border-2 border-navy hover:bg-navy/5 transition-colors"
              >
                Volunteer With Us
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
