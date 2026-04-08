'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useInView, useMotionValue, useTransform, animate, AnimatePresence } from 'framer-motion';
import { ELECTION_RESULTS } from '@/lib/constants';

// ---------------------------------------------------------------------------
// Animated counter
// ---------------------------------------------------------------------------
function AnimatedCounter({
  end,
  decimals = 0,
  suffix = '',
  duration = 2,
}: {
  end: number;
  decimals?: number;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const motionVal = useMotionValue(0);
  const rounded = useTransform(motionVal, (v) =>
    v.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + suffix
  );
  const [display, setDisplay] = useState((0).toFixed(decimals) + suffix);

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(motionVal, end, { duration, ease: [0.25, 0.46, 0.45, 0.94] });
    const unsub = rounded.on('change', (v) => setDisplay(v));
    return () => { controls.stop(); unsub(); };
  }, [isInView, end, duration, motionVal, rounded]);

  return <span ref={ref}>{display}</span>;
}

// ---------------------------------------------------------------------------
// Page-load confetti
// ---------------------------------------------------------------------------
function ConfettiEffect() {
  const COLORS = ['#e53935', '#f5a623', '#4a90d9', '#87CEEB', '#ffffff'];
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    color: COLORS[i % COLORS.length],
    left: `${Math.random() * 100}%`,
    size: 3 + Math.random() * 5,
    delay: Math.random() * 2,
    duration: 2.5 + Math.random() * 2.5,
    rotation: Math.random() * 360,
    shape: i % 3 === 0 ? 'circle' : 'square',
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: -10, opacity: 1, rotate: 0 }}
          animate={{
            y: '110vh',
            x: [0, (Math.random() - 0.5) * 80],
            opacity: [1, 1, 0.6, 0],
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
// Social links
// ---------------------------------------------------------------------------
const SOCIAL_LINKS = [
  { name: 'Facebook', href: 'https://www.facebook.com/TogetherKC/', icon: '/images/social/facebook.png' },
  { name: 'Instagram', href: 'https://www.instagram.com/togetherkcmo/', icon: '/images/social/instagram.png' },
  { name: 'TikTok', href: 'https://www.tiktok.com/@togetherkcmo', icon: '/images/social/tiktok.png' },
  { name: 'X', href: 'https://x.com/TogetherKCMO', icon: '/images/social/x.png' },
  { name: 'Threads', href: 'https://www.threads.com/@togetherkcmo', icon: '/images/social/threads.png' },
];

// ---------------------------------------------------------------------------
// Historical results
// ---------------------------------------------------------------------------
const HISTORICAL_RESULTS = [
  { year: 2011, yesVotes: 56965, totalVotes: 73459, yesPercent: 77.55 },
  { year: 2016, yesVotes: 40941, totalVotes: 52859, yesPercent: 77.46 },
  { year: 2021, yesVotes: 29448, totalVotes: 38116, yesPercent: 77.26 },
  { year: 2026, yesVotes: 30574, totalVotes: 40523, yesPercent: 75.45 },
];

// ===========================================================================
// Social Landing Page - Victory Edition
// ===========================================================================
export default function SocialLandingPage() {
  return (
    <div className="min-h-screen bg-navy relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-64 h-64 rounded-full bg-coral/20 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-64 h-64 rounded-full bg-sky/20 blur-3xl" />
        <div className="absolute top-1/2 right-0 w-48 h-48 rounded-full bg-golden/10 blur-3xl" />
      </div>

      {/* Page-load confetti */}
      <ConfettiEffect />

      <div className="relative z-10 min-h-screen flex flex-col px-4 py-8 max-w-md mx-auto">
        {/* ---- Logo ---- */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-6"
        >
          <Image
            src="/images/renew-kc-logo-white.png"
            alt="Together KC"
            width={200}
            height={70}
            className="h-14 w-auto object-contain mx-auto"
            priority
          />
        </motion.div>

        {/* ---- Social Links ---- */}
        <div className="flex justify-center gap-3 mb-5">
          {SOCIAL_LINKS.map((social, i) => (
            <motion.a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: 0.3 + i * 0.05 }}
              className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center active:scale-95 transition-transform"
              aria-label={`Follow us on ${social.name}`}
            >
              <Image src={social.icon} alt={social.name} width={22} height={22} className="w-5.5 h-5.5 object-contain" />
            </motion.a>
          ))}
        </div>

        {/* ---- Divider ---- */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.5, duration: 0.3 }}
          className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-8"
        />

        {/* ---- HERO RESULT (prominent) ---- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 bg-white/10 text-white/90 px-4 py-2 rounded-full text-xs font-semibold mb-5 border border-white/20">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Election Results -- April 7, 2026
          </div>

          <h1 className="text-4xl font-bold text-white mb-3 leading-tight">
            Kansas City Said{' '}
            <span className="text-coral" style={{ textShadow: '0 0 40px rgba(229, 57, 53, 0.5)' }}>YES</span>
          </h1>

          <div className="text-7xl font-bold text-white leading-none my-4 tracking-tight">
            <AnimatedCounter end={ELECTION_RESULTS.overallYesPercent} decimals={2} suffix="%" duration={1.8} />
          </div>

          <div className="flex justify-center gap-6 text-white/50 mt-4">
            <div className="text-center">
              <div className="text-lg font-bold text-white">{ELECTION_RESULTS.totalYes.toLocaleString()}</div>
              <div className="text-[11px]">Votes YES</div>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="text-center">
              <div className="text-lg font-bold text-white/70">{ELECTION_RESULTS.totalVotes.toLocaleString()}</div>
              <div className="text-[11px]">Total Votes</div>
            </div>
          </div>
        </motion.div>

        {/* ---- Counties (compact) ---- */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mb-8"
        >
          <div className="grid grid-cols-3 gap-2">
            {ELECTION_RESULTS.counties.map((county, i) => (
              <motion.div
                key={county.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + i * 0.1 }}
                className="bg-white/5 rounded-xl p-3 text-center border border-white/10"
              >
                <div className="text-[11px] text-white/50 mb-1">{county.name.replace(' County', '')}</div>
                <div className="text-xl font-bold text-white">{county.yesPercent}%</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ---- HISTORY (prominent) ---- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h2 className="text-xl font-bold text-white mb-2 text-center">
            Kansas City Always Shows Up
          </h2>
          <p className="text-xs text-white/40 text-center mb-6">
            Four elections. Four decisive victories.
          </p>

          <div className="space-y-4">
            {HISTORICAL_RESULTS.map((election, i) => {
              const isLatest = election.year === 2026;
              return (
                <motion.div
                  key={election.year}
                  initial={{ opacity: 0, x: -15 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.12 }}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-white tabular-nums">{election.year}</span>
                      {isLatest && (
                        <span className="px-2 py-0.5 bg-coral/20 text-coral text-[9px] font-bold uppercase tracking-wider rounded-full border border-coral/30">
                          This Year
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-white/30">{election.totalVotes.toLocaleString()} votes</span>
                  </div>

                  <div className={`relative w-full rounded-xl overflow-hidden ${isLatest ? 'h-12' : 'h-10'}`}>
                    <div className="absolute inset-0 bg-white/5 rounded-xl" />
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${election.yesPercent}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.4, delay: i * 0.2 + 0.2, ease: [0.22, 1, 0.36, 1] }}
                      className={`absolute inset-y-0 left-0 rounded-xl overflow-hidden ${isLatest
                        ? 'bg-gradient-to-r from-navy/90 via-sky/60 to-sky/40 shadow-lg shadow-sky/20'
                        : 'bg-gradient-to-r from-white/15 to-white/8'
                      }`}
                    >
                      {isLatest && (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent"
                          initial={{ x: '-100%' }}
                          whileInView={{ x: '200%' }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, delay: i * 0.2 + 1.4, ease: 'easeInOut' }}
                        />
                      )}
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.2 + 1.0 }}
                        className="absolute inset-0 flex items-center px-4"
                      >
                        <span className={`text-base font-bold ${isLatest ? 'text-white' : 'text-white/70'}`}>
                          {election.yesPercent}%
                        </span>
                        <span className="ml-1.5 text-[10px] font-semibold text-white/40 uppercase">Yes</span>
                      </motion.div>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* ---- THANK YOU (beautiful) ---- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative text-center py-8 mb-6"
        >
          {/* Decorative gradient line */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="w-12 h-[2px] bg-gradient-to-r from-coral to-golden mx-auto mb-8 origin-center"
          />

          <h2 className="text-3xl font-bold text-white mb-2 leading-tight">
            Thank You,
          </h2>
          <h2 className="text-3xl font-bold mb-6 leading-tight">
            <span
              className="bg-gradient-to-r from-sky via-white to-coral bg-clip-text"
              style={{ WebkitTextFillColor: 'transparent' }}
            >
              Kansas City
            </span>
          </h2>

          <p className="text-sm text-white leading-relaxed max-w-xs mx-auto mb-6">
            Because of your vote, Kansas City will continue funding the services
            that keep our community safe and thriving.
          </p>

          <p className="text-xs text-white/70 max-w-xs mx-auto">
            This victory belongs to every voter, volunteer, and supporter who made their voice heard.
          </p>

          {/* Decorative bottom line */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="w-12 h-[2px] bg-gradient-to-r from-golden to-sky mx-auto mt-8 origin-center"
          />
        </motion.div>

        {/* ---- Explore links ---- */}
        <p className="text-white/50 text-xs font-medium uppercase tracking-widest mb-4 text-center">
          Explore the Full Website
        </p>
        <div className="flex justify-center gap-3 mb-6">
          {[
            { label: 'Home', href: '/home' },
            { label: 'Endorsements', href: '/endorsements' },
            { label: 'FAQs', href: '/faqs' },
          ].map((link, i) => (
            <motion.div
              key={link.href}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                href={link.href}
                className="inline-block px-5 py-2.5 bg-white/10 text-white font-semibold text-sm rounded-full border border-white/20 active:bg-white/20 transition-colors"
              >
                {link.label}
              </Link>
            </motion.div>
          ))}
        </div>

        {/* ---- Footer ---- */}
        <div className="mt-auto pt-6 text-center">
          <div className="flex justify-center mb-3">
            <Image
              src="/images/together-kc-footer.png"
              alt="Together KC"
              width={200}
              height={60}
              className="max-w-[160px] h-auto w-auto object-contain"
            />
          </div>
          <p className="text-white/40 text-xs leading-relaxed">
            Paid for by Together KC, Dan Kopp, Treasurer.
            <br />
            Not authorized by any candidate or candidate committee.
          </p>
        </div>
      </div>
    </div>
  );
}
