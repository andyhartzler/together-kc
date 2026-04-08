'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useInView, useMotionValue, useTransform, animate, AnimatePresence } from 'framer-motion';
import { ELECTION_RESULTS } from '@/lib/constants';
import Footer from '@/components/layout/Footer';

// ---------------------------------------------------------------------------
// Animated counter
// ---------------------------------------------------------------------------
function AnimatedCounter({
  end,
  decimals = 0,
  suffix = '',
  prefix = '',
  duration = 2,
}: {
  end: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const motionVal = useMotionValue(0);
  const rounded = useTransform(motionVal, (v) =>
    prefix + v.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + suffix
  );
  const [display, setDisplay] = useState(prefix + (0).toFixed(decimals) + suffix);

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(motionVal, end, {
      duration,
      ease: [0.25, 0.46, 0.45, 0.94],
    });
    const unsub = rounded.on('change', (v) => setDisplay(v));
    return () => { controls.stop(); unsub(); };
  }, [isInView, end, duration, motionVal, rounded]);

  return <span ref={ref}>{display}</span>;
}

// ---------------------------------------------------------------------------
// Hero confetti - falls from top
// ---------------------------------------------------------------------------
function ConfettiEffect() {
  const COLORS = ['#e53935', '#f5a623', '#4a90d9', '#87CEEB', '#ffffff'];
  const particles = Array.from({ length: 28 }, (_, i) => ({
    id: i,
    color: COLORS[i % COLORS.length],
    left: `${Math.random() * 100}%`,
    size: 4 + Math.random() * 6,
    delay: Math.random() * 2.5,
    duration: 3 + Math.random() * 3,
    rotation: Math.random() * 360,
    shape: i % 3 === 0 ? 'circle' : 'square',
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: -20, x: 0, opacity: 1, rotate: 0 }}
          animate={{
            y: '110vh',
            x: [0, (Math.random() - 0.5) * 120, (Math.random() - 0.5) * 80],
            opacity: [1, 1, 0.8, 0],
            rotate: p.rotation + 360 * (Math.random() > 0.5 ? 1 : -1),
          }}
          transition={{ duration: p.duration, delay: p.delay, ease: 'easeIn' }}
          className="absolute"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: p.shape === 'circle' ? '50%' : '2px',
          }}
        />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Confetti burst - pops out from a point (used on county card click)
// ---------------------------------------------------------------------------
function ConfettiBurst({ originX, originY, onDone }: { originX: number; originY: number; onDone: () => void }) {
  const COLORS = ['#e53935', '#f5a623', '#4a90d9', '#87CEEB', '#1e3a5f'];
  const particles = Array.from({ length: 24 }, (_, i) => {
    const angle = (i / 24) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
    const velocity = 80 + Math.random() * 160;
    return {
      id: i,
      color: COLORS[i % COLORS.length],
      x: Math.cos(angle) * velocity,
      y: Math.sin(angle) * velocity - 60,
      size: 4 + Math.random() * 5,
      rotation: Math.random() * 720 - 360,
      shape: i % 3 === 0 ? 'circle' : 'square',
    };
  });

  useEffect(() => {
    const timer = setTimeout(onDone, 1200);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ x: originX, y: originY, opacity: 1, scale: 1, rotate: 0 }}
          animate={{
            x: originX + p.x,
            y: originY + p.y + 100,
            opacity: [1, 1, 0],
            scale: [0, 1.2, 0.8],
            rotate: p.rotation,
          }}
          transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{
            position: 'absolute',
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: p.shape === 'circle' ? '50%' : '2px',
          }}
        />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// County result card with confetti on click
// ---------------------------------------------------------------------------
function CountyCard({
  county,
  yesPercent,
  yesVotes,
  totalVotes,
  delay,
}: {
  county: string;
  yesPercent: number;
  yesVotes: number;
  totalVotes: number;
  delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const [bursts, setBursts] = useState<{ id: number; x: number; y: number }[]>([]);
  const burstId = useRef(0);

  const triggerBurst = useCallback(() => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const id = ++burstId.current;
    setBursts((prev) => [...prev, { id, x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }]);
  }, []);

  return (
    <>
      {bursts.map((b) => (
        <ConfettiBurst key={b.id} originX={b.x} originY={b.y} onDone={() => setBursts((prev) => prev.filter((p) => p.id !== b.id))} />
      ))}
      <motion.div
        ref={ref}
        onMouseEnter={triggerBurst}
        onTouchStart={triggerBurst}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
        whileHover={{ y: -6, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="relative bg-white rounded-2xl p-5 sm:p-8 shadow-lg shadow-navy/5 border border-gray-100 overflow-hidden group cursor-pointer select-none"
      >
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-gradient-to-br from-coral/10 to-golden/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="relative z-10">
          <h3 className="text-base sm:text-xl font-bold text-navy mb-1">{county}</h3>
          <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
            {yesVotes.toLocaleString()} of {totalVotes.toLocaleString()} votes
          </p>
          <div className="flex items-baseline gap-2 mb-3 sm:mb-4">
            <span className="text-3xl sm:text-5xl font-bold text-coral">
              <AnimatedCounter end={yesPercent} decimals={1} suffix="%" duration={1.8} />
            </span>
            <span className="text-xs sm:text-sm font-semibold text-coral/70 uppercase tracking-wide">Yes</span>
          </div>
          <div className="w-full h-2.5 sm:h-3 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={isInView ? { width: `${yesPercent}%` } : { width: 0 }}
              transition={{ duration: 1.5, delay: delay + 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="h-full bg-gradient-to-r from-coral to-coral/80 rounded-full"
            />
          </div>
        </div>

        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: delay + 0.5 }}
          className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-coral via-golden to-sky origin-left"
        />
      </motion.div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Historical election data
// ---------------------------------------------------------------------------
const HISTORICAL_RESULTS = [
  { year: 2011, yesVotes: 56965, totalVotes: 73459, yesPercent: 77.55 },
  { year: 2016, yesVotes: 40941, totalVotes: 52859, yesPercent: 77.46 },
  { year: 2021, yesVotes: 29448, totalVotes: 38116, yesPercent: 77.26 },
  { year: 2026, yesVotes: 30574, totalVotes: 40523, yesPercent: 75.45 },
];

// ===========================================================================
// Victory Page
// ===========================================================================
export default function VictoryPage() {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* ================================================================= */}
      {/* HERO                                                               */}
      {/* ================================================================= */}
      <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy/95 to-sky/80" />

        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-coral/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-1/4 -right-1/4 w-2/3 h-2/3 bg-sky/20 rounded-full blur-3xl" />
          <div className="absolute top-1/3 right-1/4 w-1/3 h-1/3 bg-golden/15 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 left-1/6 w-1/4 h-1/4 bg-golden/10 rounded-full blur-3xl" />
        </div>

        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />

        <ConfettiEffect />

        <div
          className="absolute -bottom-1 left-0 right-0 h-40 sm:h-72 z-20"
          style={{
            background: 'linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.08) 30%, rgba(255,255,255,0.4) 60%, rgba(255,255,255,0.9) 90%, rgba(255,255,255,1) 100%)',
          }}
        />

        <motion.div
          className="relative z-20 text-center px-4 pt-8 pb-24 sm:pt-20 sm:pb-40 max-w-5xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
          }}
        >
          <motion.div
            variants={{
              hidden: { opacity: 0, y: -20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
            }}
            className="flex justify-center mb-6 sm:mb-8"
          >
            <Image
              src="/images/renew-kc-logo-white.png"
              alt="Together KC"
              width={220}
              height={73}
              className="h-16 sm:h-18 md:h-20 w-auto"
              priority
            />
          </motion.div>

          <motion.div
            variants={{
              hidden: { opacity: 0, scale: 0.8 },
              visible: { opacity: 1, scale: 1, transition: { duration: 0.5, type: 'spring', stiffness: 200 } },
            }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white/90 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold mb-6 sm:mb-8 border border-white/20"
          >
            <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-green-400 rounded-full animate-pulse" />
            Election Results - April 7, 2026
          </motion.div>

          <motion.h1
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { duration: 0.6 } },
            }}
            className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight"
          >
            Kansas City Said{' '}
            <span
              className="text-coral relative"
              style={{ textShadow: '0 0 40px rgba(229, 57, 53, 0.5), 0 0 80px rgba(229, 57, 53, 0.3)' }}
            >
              YES
            </span>
          </motion.h1>

          <motion.div
            variants={{
              hidden: { opacity: 0, scale: 0.5 },
              visible: { opacity: 1, scale: 1, transition: { duration: 0.6, type: 'spring', stiffness: 120, damping: 15 } },
            }}
            className="mb-4 sm:mb-6"
          >
            <div className="text-6xl sm:text-8xl md:text-9xl font-bold text-white leading-none tracking-tight">
              <AnimatedCounter end={ELECTION_RESULTS.overallYesPercent} decimals={2} suffix="%" duration={1.8} />
            </div>
            <p className="text-base sm:text-xl text-white/70 mt-2 sm:mt-3 font-medium">
              of voters renewed the E-Tax
            </p>
          </motion.div>

          <motion.div
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { duration: 0.6 } },
            }}
            className="flex justify-center gap-8 sm:gap-10 text-white/60"
          >
            <div className="text-center">
              <div className="text-xl sm:text-3xl font-bold text-white">
                <AnimatedCounter end={ELECTION_RESULTS.totalYes} duration={1.6} />
              </div>
              <div className="text-xs sm:text-sm mt-1">Votes YES</div>
            </div>
            <div className="w-px h-10 sm:h-12 bg-white/20" />
            <div className="text-center">
              <div className="text-xl sm:text-3xl font-bold text-white/80">
                <AnimatedCounter end={ELECTION_RESULTS.totalVotes} duration={1.6} />
              </div>
              <div className="text-xs sm:text-sm mt-1">Total Votes</div>
            </div>
          </motion.div>
        </motion.div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
          className="absolute bottom-24 sm:bottom-32 left-1/2 -translate-x-1/2 z-20 cursor-pointer"
          aria-label="Scroll down"
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center animate-bounce">
            <div className="w-1.5 h-3 bg-white/50 rounded-full mt-2" />
          </div>
        </motion.button>
      </section>

      {/* ================================================================= */}
      {/* COUNTY BREAKDOWN                                                   */}
      {/* ================================================================= */}
      <section className="relative py-12 sm:pt-12 sm:pb-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-10 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-navy mb-3 sm:mb-4">
              Results by County
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Voters across the Kansas City metro area showed strong support for renewing the earnings tax.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8">
            {ELECTION_RESULTS.counties.map((county, i) => (
              <CountyCard
                key={county.name}
                county={county.name}
                yesPercent={county.yesPercent}
                yesVotes={county.yesVotes}
                totalVotes={county.totalVotes}
                delay={i * 0.15}
              />
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-center text-xs sm:text-sm text-gray-400 mt-6 sm:mt-8"
          >
            Cass County: 2 precincts reported, 0 votes cast.
          </motion.p>
        </div>
      </section>

      {/* ================================================================= */}
      {/* HISTORICAL TRACK RECORD                                            */}
      {/* ================================================================= */}
      <section className="relative py-14 sm:py-28 bg-white overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 sm:mb-20"
          >
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-navy mb-3 sm:mb-4">
              Kansas City Always Shows Up
            </h2>
            <p className="text-base sm:text-lg text-gray-500 max-w-xl mx-auto">
              Four elections. Four decisive victories.
            </p>
          </motion.div>

          {/* Bar chart */}
          <div className="space-y-6 sm:space-y-10">
            {HISTORICAL_RESULTS.map((election, i) => {
              const isLatest = election.year === 2026;
              const barDelay = i * 0.35 + 0.15;

              return (
                <motion.div
                  key={election.year}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  {/* Year + total votes */}
                  <div className="flex items-end justify-between mb-2 sm:mb-3 px-1">
                    <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-navy tabular-nums">
                      {election.year}
                    </span>
                    <motion.span
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: HISTORICAL_RESULTS.length * 0.35 + 1.6, duration: 0.5 }}
                      className="text-xs sm:text-sm text-gray-400"
                    >
                      {election.totalVotes.toLocaleString()} total votes
                    </motion.span>
                  </div>

                  {/* The bar - percentage + yes animate with the fill */}
                  <div className={`relative w-full rounded-xl sm:rounded-2xl overflow-hidden group cursor-pointer ${isLatest ? 'h-16 sm:h-20 md:h-24' : 'h-14 sm:h-16 md:h-20'}`}>
                    <div className="absolute inset-0 bg-gray-100 rounded-xl sm:rounded-2xl" />

                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${election.yesPercent}%` }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 1.6,
                        delay: barDelay,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className={`absolute inset-y-0 left-0 rounded-xl sm:rounded-2xl overflow-hidden ${isLatest
                        ? 'bg-gradient-to-r from-navy via-navy to-sky shadow-xl shadow-navy/20'
                        : 'bg-gradient-to-r from-navy/90 via-navy/80 to-sky/70'
                      }`}
                    >
                      {/* Shimmer - hover/touch only */}
                      <div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent translate-x-[-100%] group-hover:translate-x-[200%] group-active:translate-x-[200%] transition-transform duration-700 ease-in-out"
                      />

                      {/* Percentage + Yes ride with the bar, right-aligned */}
                      <div className="absolute inset-0 flex items-center justify-end px-4 sm:px-6">
                        <span className={`font-bold tabular-nums text-white ${isLatest
                          ? 'text-2xl sm:text-4xl md:text-5xl'
                          : 'text-xl sm:text-3xl md:text-4xl'
                        }`}>
                          {election.yesPercent}%
                        </span>
                        <span className="ml-2 text-xs sm:text-sm font-semibold text-white/60 uppercase tracking-wider">
                          Yes
                        </span>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}

          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* THANK YOU                                                          */}
      {/* ================================================================= */}
      <section className="relative pt-8 sm:pt-16 pb-16 sm:pb-24 bg-white overflow-hidden">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Decorative divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="w-16 sm:w-24 h-[2px] bg-gradient-to-r from-coral to-golden mx-auto mb-10 sm:mb-16 origin-center"
          />

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-center"
          >
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold text-navy mb-8 sm:mb-10 leading-tight">
              Thank You,
              <br />
              <span className="gradient-text">Kansas City</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center"
          >
            <p className="text-lg sm:text-xl md:text-2xl text-gray-600 leading-relaxed max-w-2xl mx-auto mb-5 sm:mb-6">
              Because of your vote, Kansas City will continue funding the services
              that keep our community safe and thriving - firefighters, police, EMS,
              road repair, trash collection, and so much more.
            </p>
            <p className="text-base sm:text-lg text-gray-500 max-w-xl mx-auto">
              This victory belongs to every voter, volunteer, and supporter who made their voice heard.
            </p>
          </motion.div>

          {/* Explore links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 sm:mt-16 text-center"
          >
            <p className="text-gray-400 text-xs sm:text-sm font-medium uppercase tracking-widest mb-5 sm:mb-6">
              Explore the Full Website
            </p>
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
              {[
                { label: 'Home', href: '/home' },
                { label: 'Endorsements', href: '/endorsements' },
                { label: 'FAQs', href: '/faqs' },
              ].map((link) => (
                <motion.div key={link.href} whileHover={{ y: -3, scale: 1.03 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }}>
                  <Link
                    href={link.href}
                    className="inline-block px-6 py-3 sm:px-8 sm:py-3.5 bg-navy text-white font-semibold text-sm sm:text-base rounded-full hover:bg-navy/90 transition-all duration-200 shadow-lg shadow-navy/10"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* WHITE-TO-NAVY FADE (short, just above footer logo)                 */}
      {/* ================================================================= */}
      <div
        className="h-52 sm:h-60 -mb-px"
        style={{
          background: 'linear-gradient(to bottom, #ffffff 0%, #f8f9fb 5%, #eef2f6 12%, #e1e8ef 18%, #d1dbe5 24%, #bfccd9 30%, #aabcce 36%, #94abc2 42%, #7d99b5 48%, #6787a8 54%, #53759b 60%, #41648d 66%, #325580 70%, #264869 74%, #1f3d62 78%, #1e3a5f 82%, #1e3a5f 100%)',
        }}
      />

      {/* ================================================================= */}
      {/* FOOTER                                                             */}
      {/* ================================================================= */}
      <Footer />
    </div>
  );
}
