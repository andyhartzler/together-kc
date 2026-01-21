'use client';

import { useRef, useState, useEffect, useMemo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { InteractiveHoverButton } from '@/components/ui/InteractiveHoverButton';
import { VOTE_DATE } from '@/lib/constants';

// Seeded pseudo-random number generator for deterministic values
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9999) * 10000;
  return x - Math.floor(x);
}

// Staggered letter animation for "Together KC"
function AnimatedTitle({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
  const letters = text.split('');

  return (
    <span className={className}>
      {letters.map((letter, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{
            duration: 0.5,
            delay: delay + i * 0.04,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          className="inline-block"
          style={{ display: letter === ' ' ? 'inline' : 'inline-block' }}
        >
          {letter === ' ' ? '\u00A0' : letter}
        </motion.span>
      ))}
    </span>
  );
}

// Explosive growing animation for "Grows Stronger"
function GrowsStrongerAnimation({ delay = 0 }: { delay?: number }) {
  const [hasAnimated, setHasAnimated] = useState(false);
  const text = 'Grows Stronger';
  const letters = text.split('');

  // Generate deterministic random values for each letter
  const letterAnimations = useMemo(() => {
    return letters.map((_, i) => ({
      randomX: (seededRandom(i * 3) - 0.5) * 100,
      randomY: (seededRandom(i * 3 + 1) - 0.5) * 60,
      randomRotate: (seededRandom(i * 3 + 2) - 0.5) * 45,
    }));
  }, [letters]);

  useEffect(() => {
    const timer = setTimeout(() => setHasAnimated(true), (delay + 0.8) * 1000);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <span className="relative inline-block">
      {/* Glow burst effect behind text */}
      <motion.span
        className="absolute inset-0 -inset-x-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.8, 0] }}
        transition={{ duration: 1.2, delay: delay + 0.3, ease: 'easeOut' }}
      >
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-coral/50 to-transparent blur-2xl" />
      </motion.span>

      {/* Main text with letter animations */}
      <span className="relative">
        {letters.map((letter, i) => {
          const { randomX, randomY, randomRotate } = letterAnimations[i];

          return (
            <motion.span
              key={i}
              initial={{
                opacity: 0,
                scale: 0,
                x: randomX,
                y: randomY,
                rotate: randomRotate,
                filter: 'blur(8px)',
              }}
              animate={{
                opacity: 1,
                scale: [0, 1.3, 1],
                x: 0,
                y: 0,
                rotate: 0,
                filter: 'blur(0px)',
              }}
              transition={{
                duration: 0.7,
                delay: delay + 0.4 + i * 0.05,
                ease: [0.175, 0.885, 0.32, 1.275], // Back easing for bounce
                scale: {
                  duration: 0.6,
                  delay: delay + 0.4 + i * 0.05,
                  ease: [0.175, 0.885, 0.32, 1.275],
                },
              }}
              className="inline-block text-coral"
              style={{
                display: letter === ' ' ? 'inline' : 'inline-block',
                textShadow: hasAnimated ? '0 0 40px rgba(229, 57, 53, 0.5), 0 0 80px rgba(229, 57, 53, 0.3)' : 'none',
              }}
            >
              {letter === ' ' ? '\u00A0' : letter}
            </motion.span>
          );
        })}
      </span>

      {/* Shimmer effect that sweeps across after animation */}
      <motion.span
        className="absolute inset-0 overflow-hidden pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 1.2 }}
      >
        <motion.span
          className="absolute inset-y-0 w-32 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
          initial={{ left: '-20%' }}
          animate={{ left: '120%' }}
          transition={{
            duration: 1,
            delay: delay + 1.3,
            ease: 'easeInOut',
          }}
        />
      </motion.span>
    </span>
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

      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-coral/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, 80, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -bottom-1/4 -right-1/4 w-2/3 h-2/3 bg-sky/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, 50, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-1/3 right-1/4 w-1/3 h-1/3 bg-golden/10 rounded-full blur-3xl"
        />
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

      {/* Content */}
      <motion.div
        style={{ opacity }}
        className="relative z-20 text-center px-4 pt-16 pb-20 sm:pt-20 sm:pb-32 max-w-5xl mx-auto"
      >
        <div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            <AnimatedTitle text="Together KC" delay={0.3} />
            <br />
            <GrowsStrongerAnimation delay={0.5} />
          </h1>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-lg sm:text-xl md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto"
        >
          Vote <span className="font-bold text-coral">YES</span> to renew the earnings tax on{' '}
          <span className="font-semibold">{VOTE_DATE}</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
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

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-1.5 h-3 bg-white/50 rounded-full mt-2"
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
