'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { InteractiveHoverButton } from '@/components/ui/InteractiveHoverButton';
import { VOTE_DATE } from '@/lib/constants';

// "Together" - Letters magnetically pull together (symbolizing unity)
function TogetherAnimation({ delay = 0 }: { delay?: number }) {
  const letters = 'Together'.split('');
  // Starting X positions - spread out, will converge to center
  const startPositions = [-120, -80, -45, -15, 15, 45, 80, 120];

  return (
    <span className="relative inline-block">
      {letters.map((letter, i) => (
        <motion.span
          key={i}
          initial={{
            opacity: 0,
            x: startPositions[i],
            scale: 0.5,
          }}
          animate={{
            opacity: 1,
            x: 0,
            scale: 1,
          }}
          transition={{
            duration: 0.8,
            delay: delay + 0.1,
            ease: [0.25, 0.1, 0.25, 1],
            x: {
              duration: 1,
              delay: delay + 0.1,
              ease: [0.34, 1.56, 0.64, 1], // Spring-like overshoot
            },
          }}
          className="inline-block"
        >
          {letter}
        </motion.span>
      ))}
    </span>
  );
}

// "KC" - Stamps down with weight and impact
function KCAnimation({ delay = 0 }: { delay?: number }) {
  const [hasLanded, setHasLanded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setHasLanded(true), (delay + 0.5) * 1000);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <span className="relative inline-block">
      {/* Impact ring */}
      <motion.span
        className="absolute inset-0 -inset-x-4"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={hasLanded ? { opacity: [0, 0.6, 0], scale: [0.8, 1.5, 2] } : {}}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <span className="absolute inset-0 border-2 border-white/30 rounded-full" />
      </motion.span>

      <motion.span
        initial={{
          opacity: 0,
          y: -80,
          scale: 1.5,
        }}
        animate={{
          opacity: 1,
          y: [null, 5, 0],
          scale: [1.5, 0.95, 1],
        }}
        transition={{
          duration: 0.5,
          delay: delay,
          ease: [0.22, 1, 0.36, 1],
          y: {
            duration: 0.5,
            delay: delay,
            times: [0, 0.7, 1],
            ease: [0.55, 0, 1, 0.45],
          },
        }}
        className="inline-block"
      >
        KC
      </motion.span>
    </span>
  );
}

// "Grows Stronger" - Rises from below with escalating power
function GrowsStrongerAnimation({ delay = 0 }: { delay?: number }) {
  const [phase, setPhase] = useState(0);
  const text = 'Grows Stronger';
  const letters = text.split('');

  useEffect(() => {
    const timer1 = setTimeout(() => setPhase(1), (delay + 0.7) * 1000);
    const timer2 = setTimeout(() => setPhase(2), (delay + 1.4) * 1000);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [delay]);

  return (
    <span className="relative inline-block">
      {/* Energy glow that builds up */}
      <motion.span
        className="absolute -inset-4 -inset-x-8"
        initial={{ opacity: 0 }}
        animate={{
          opacity: phase >= 1 ? [0, 0.4, 0.6] : 0,
        }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      >
        <span
          className="absolute inset-0 rounded-lg blur-2xl"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(229, 57, 53, 0.4) 0%, transparent 70%)',
          }}
        />
      </motion.span>

      {/* Ground line that cracks open */}
      <motion.span
        className="absolute -bottom-2 left-1/2 h-0.5 bg-gradient-to-r from-transparent via-coral to-transparent"
        initial={{ width: 0, x: '-50%', opacity: 0 }}
        animate={{
          width: phase >= 1 ? '120%' : 0,
          opacity: phase >= 1 ? [0, 1, 0] : 0
        }}
        transition={{ duration: 0.4, delay: delay }}
      />

      {/* Main text */}
      <span className="relative">
        {letters.map((letter, i) => {
          const isSecondWord = i >= 6; // "Stronger" starts at index 6
          const letterDelay = delay + (i * 0.04) + (isSecondWord ? 0.15 : 0);

          return (
            <motion.span
              key={i}
              initial={{
                opacity: 0,
                y: 60,
                rotateX: -90,
                scale: 0.5,
              }}
              animate={{
                opacity: 1,
                y: 0,
                rotateX: 0,
                scale: [0.5, 1.1, 1],
              }}
              transition={{
                duration: 0.6,
                delay: letterDelay,
                ease: [0.22, 1, 0.36, 1],
                scale: {
                  duration: 0.5,
                  delay: letterDelay,
                  times: [0, 0.6, 1],
                  ease: [0.34, 1.56, 0.64, 1],
                },
              }}
              className="inline-block text-coral"
              style={{
                display: letter === ' ' ? 'inline' : 'inline-block',
                textShadow: phase >= 2
                  ? '0 0 30px rgba(229, 57, 53, 0.6), 0 0 60px rgba(229, 57, 53, 0.4), 0 4px 20px rgba(0,0,0,0.3)'
                  : '0 4px 20px rgba(0,0,0,0.3)',
                transformStyle: 'preserve-3d',
              }}
            >
              {letter === ' ' ? '\u00A0' : letter}
            </motion.span>
          );
        })}
      </span>

      {/* Final unified pulse */}
      <motion.span
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={phase >= 2 ? {
          opacity: [0, 0.3, 0],
          scale: [1, 1.05, 1],
        } : {}}
        transition={{ duration: 0.4 }}
      >
        <span className="absolute inset-0 bg-coral/20 rounded-lg blur-xl" />
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
            <span className="block">
              <TogetherAnimation delay={0.3} />
              {' '}
              <KCAnimation delay={1.2} />
            </span>
            <GrowsStrongerAnimation delay={1.6} />
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
