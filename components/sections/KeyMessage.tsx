'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';

// Interactive stat card
function StatCard({ icon, value, label, delay }: { icon: React.ReactNode; value: string; label: string; delay: number }) {
  const [isHovered, setIsHovered] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, amount: 0.8 });

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Trigger animation when card comes into view (for mobile scroll effect only)
  useEffect(() => {
    if (isMobile && isInView && !hasAnimated) {
      const timer = setTimeout(() => {
        setHasAnimated(true);
      }, delay * 1000 + 300);
      return () => clearTimeout(timer);
    }
  }, [isMobile, isInView, hasAnimated, delay]);

  // On desktop: hover triggers animation. On mobile: scroll triggers animation
  const isActive = isMobile ? hasAnimated : isHovered;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative"
    >
      <motion.div
        animate={{
          scale: isActive ? 1.02 : 1,
          y: isActive ? -5 : 0,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="relative bg-white rounded-2xl p-6 shadow-lg shadow-navy/5 border border-gray-100 overflow-hidden cursor-pointer"
      >
        {/* Hover gradient overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isActive ? 1 : 0 }}
          className="absolute inset-0 bg-gradient-to-br from-coral/5 via-transparent to-sky/5"
        />

        {/* Animated corner accent */}
        <motion.div
          animate={{
            scale: isActive ? 1 : 0.8,
            opacity: isActive ? 1 : 0,
          }}
          className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-coral/20 to-golden/20 rounded-full blur-2xl"
        />

        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <motion.div
              animate={{ rotate: isActive ? 360 : 0 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="w-12 h-12 rounded-xl bg-gradient-to-br from-coral to-coral/80 flex items-center justify-center text-white shadow-lg shadow-coral/30"
            >
              {icon}
            </motion.div>
            <div className="text-3xl sm:text-4xl font-bold text-navy">
              {value}
            </div>
          </div>
          <div className="text-gray-600 font-medium">{label}</div>
        </div>

        {/* Bottom accent line */}
        <motion.div
          animate={{ scaleX: isActive ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-coral via-golden to-sky origin-left"
        />
      </motion.div>
    </motion.div>
  );
}

export default function KeyMessage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);

  return (
    <section ref={containerRef} className="relative pt-6 pb-16 sm:pt-10 sm:pb-20 md:pt-16 md:pb-32 bg-gradient-to-b from-white via-light-gray/50 to-white overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          style={{ y }}
          className="absolute top-20 left-10 w-72 h-72 bg-coral/5 rounded-full blur-3xl"
        />
        <motion.div
          style={{ y: useTransform(scrollYProgress, [0, 1], [-30, 30]) }}
          className="absolute bottom-20 right-10 w-96 h-96 bg-sky/5 rounded-full blur-3xl"
        />
        <motion.div
          style={{ y: useTransform(scrollYProgress, [0, 1], [20, -60]) }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-golden/5 rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left Column - Animated Infographic */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative"
          >
            {/* Central coin visualization */}
            <div className="relative mx-auto w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96">
              {/* Outer rotating ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border-2 border-dashed border-golden/30"
              />

              {/* Middle pulsing ring */}
              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-4 rounded-full border-4 border-coral/20"
              />

              {/* Inner gradient circle */}
              <motion.div
                animate={{
                  boxShadow: [
                    "0 0 60px rgba(245, 166, 35, 0.3)",
                    "0 0 100px rgba(245, 166, 35, 0.5)",
                    "0 0 60px rgba(245, 166, 35, 0.3)",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-12 rounded-full bg-gradient-to-br from-golden via-golden/90 to-coral/80 flex items-center justify-center shadow-2xl"
              >
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.3 }}
                    className="text-6xl md:text-7xl font-bold text-white drop-shadow-lg"
                  >
                    1%
                  </motion.div>
                  <div className="text-white/90 text-lg font-medium mt-1">earnings tax</div>
                </div>
              </motion.div>

              {/* Floating badges around the coin */}
              {[
                { label: 'Since 1963', angle: -45, delay: 0.1 },
                { label: 'Same Rate', angle: 45, delay: 0.2 },
                { label: 'No Increase', angle: 135, delay: 0.3 },
                { label: 'Proven', angle: 210, delay: 0.4 },
              ].map((badge) => (
                <motion.div
                  key={badge.label}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: badge.delay + 0.5 }}
                  className="absolute w-20 h-20 flex items-center justify-center"
                  style={{
                    top: `${50 + 48 * Math.sin((badge.angle * Math.PI) / 180)}%`,
                    left: `${50 + 48 * Math.cos((badge.angle * Math.PI) / 180)}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="bg-white rounded-full px-3 py-2 shadow-lg border border-gray-100 text-xs font-semibold text-navy whitespace-nowrap"
                  >
                    {badge.label}
                  </motion.div>
                </motion.div>
              ))}
            </div>

            {/* Connection lines (decorative) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 400">
              <motion.circle
                cx="200"
                cy="200"
                r="180"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="1"
                strokeDasharray="10 10"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 0.3 }}
                viewport={{ once: true }}
                transition={{ duration: 2, delay: 0.5 }}
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#e53935" />
                  <stop offset="50%" stopColor="#f5a623" />
                  <stop offset="100%" stopColor="#4a90d9" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>

          {/* Right Column - Content */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {/* Eyebrow */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-coral/10 to-coral/5 text-coral px-4 py-2 rounded-full text-sm font-semibold mb-6 border border-coral/20"
              >
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-2 h-2 bg-coral rounded-full"
                />
                Not a Tax Increase
              </motion.div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-navy mb-6 leading-tight">
                Renewing will{' '}
                <span className="relative">
                  <span className="text-coral">NOT</span>
                  <motion.span
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="absolute -bottom-1 left-0 right-0 h-1 bg-coral/30 origin-left"
                  />
                </span>{' '}
                raise taxes by a single penny
              </h2>

              <p className="text-lg text-gray-600 mb-10 leading-relaxed">
                The 1% earnings tax has been funding essential Kansas City services since 1963.
                This is simply a renewal — the same rate we&apos;ve had for over 60 years. No increase.
                Just continued support for the city we love.
              </p>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <StatCard
                icon={<span className="text-2xl font-bold">%</span>}
                value="1%"
                label="Tax on income earned in KC"
                delay={0}
              />
              <StatCard
                icon={
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 12H9v-2h2v2zm0-4H9V6h2v4z" />
                  </svg>
                }
                value="63"
                label="Years in place since 1963"
                delay={0.1}
              />
              <StatCard
                icon={
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                  </svg>
                }
                value="5"
                label="Year renewal cycle by law"
                delay={0.2}
              />
              <StatCard
                icon={
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                  </svg>
                }
                value="~50%"
                label="Revenue from non-residents"
                delay={0.3}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
