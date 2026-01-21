'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { InteractiveHoverButton } from '@/components/ui/InteractiveHoverButton';
import { VOTE_DATE } from '@/lib/constants';

// Simplified "Grows Stronger" animation - graceful fade in with subtle glow
function GrowsStrongerAnimation({ delay = 0 }: { delay?: number }) {
  return (
    <motion.span
      className="relative inline-block text-coral"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay, ease: 'easeOut' }}
    >
      {/* Subtle glow - CSS only, no JS animation */}
      <span
        className="absolute -inset-4 -inset-x-8 pointer-events-none opacity-50"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(229, 57, 53, 0.4) 0%, transparent 70%)',
          filter: 'blur(20px)',
        }}
      />
      <span
        className="relative"
        style={{
          textShadow: '0 0 30px rgba(229, 57, 53, 0.5), 0 0 60px rgba(229, 57, 53, 0.3)',
        }}
      >
        Grows Stronger
      </span>
    </motion.span>
  );
}

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[calc(100vh+100px)] flex items-center justify-center overflow-hidden"
    >
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy/95 to-sky/80" />

      {/* Static gradient orbs - CSS only for better mobile performance */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-coral/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-1/4 -right-1/4 w-2/3 h-2/3 bg-sky/20 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-1/3 h-1/3 bg-golden/10 rounded-full blur-3xl" />
      </div>

      {/* Subtle grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Bottom blend into next section - very gradual fade */}
      <div
        className="absolute -bottom-1 left-0 right-0 h-52 sm:h-72"
        style={{
          background: 'linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.02) 15%, rgba(255,255,255,0.08) 30%, rgba(255,255,255,0.2) 45%, rgba(255,255,255,0.4) 60%, rgba(255,255,255,0.7) 75%, rgba(255,255,255,0.9) 90%, rgba(255,255,255,1) 100%)'
        }}
      />

      {/* Content - unified stagger animation */}
      <motion.div
        style={{ opacity }}
        className="relative z-20 text-center px-4 pt-16 pb-32 sm:pt-20 sm:pb-40 max-w-5xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.15,
              delayChildren: 0.2,
            },
          },
        }}
      >
        <motion.div
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { duration: 0.6, ease: 'easeOut' } },
          }}
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Together KC
            <br />
            <GrowsStrongerAnimation delay={0.5} />
          </h1>
        </motion.div>

        <motion.p
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { duration: 0.6, ease: 'easeOut' } },
          }}
          className="text-lg sm:text-xl md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto"
        >
          Vote <span className="font-bold text-coral">YES</span> to renew the earnings tax
          <br className="sm:hidden" />
          {' '}on <span className="font-semibold">{VOTE_DATE}</span>
        </motion.p>

        <motion.div
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { duration: 0.6, ease: 'easeOut' } },
          }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <InteractiveHoverButton
            text="Vote YES"
            href="/endorsements#endorse"
            variant="primary"
            size="lg"
          />
          <InteractiveHoverButton
            text="Learn More"
            href="#services"
            variant="outline"
            size="lg"
          />
        </motion.div>
      </motion.div>

      {/* Scroll Indicator - positioned relative to section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="absolute bottom-32 sm:bottom-32 left-1/2 -translate-x-1/2 z-20"
      >
        <div className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center animate-bounce">
          <div className="w-1.5 h-3 bg-white/50 rounded-full mt-2" />
        </div>
      </motion.div>
    </section>
  );
}
