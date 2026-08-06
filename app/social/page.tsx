'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion, MotionConfig } from 'framer-motion';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import {
  RESULTS,
  BRIEFS,
  COUNTIES,
  ORDERED_MEASURES,
  SUPERMAJORITY,
  BOND_TOTAL_BILLIONS,
  type MeasureSlug,
  type CountyKey,
} from '@/lib/august-results';

// ---------------------------------------------------------------------------
// The link-in-bio version of /victory. Same story, same numbers, one thumb
// column. /social is to /victory exactly what /etax/social is to /etax/victory.
// ---------------------------------------------------------------------------

const EASE_OUT = [0.25, 0.46, 0.45, 0.94] as const;
const EASE_EXPO = [0.22, 1, 0.36, 1] as const;

// The victory page runs on white, so it uses darkened accents. This page runs
// on navy, where those same hexes go muddy, so each measure gets its light
// variant instead. Same five accents, tuned for a dark field.
const ON_NAVY: Record<MeasureSlug, string> = {
  housing: '#ff6b67',
  'civic-buildings': '#ffc861',
  'central-city': '#f0855a',
  'clean-water': '#7db8ea',
  sewers: '#57c9e0',
};

const SOCIAL_LINKS = [
  { name: 'Facebook', href: 'https://www.facebook.com/TogetherKC/', icon: '/images/social/facebook.png' },
  { name: 'Instagram', href: 'https://www.instagram.com/togetherkcmo/', icon: '/images/social/instagram.png' },
  { name: 'TikTok', href: 'https://www.tiktok.com/@togetherkcmo', icon: '/images/social/tiktok.png' },
  { name: 'X', href: 'https://x.com/TogetherKCMO', icon: '/images/social/x.png' },
  { name: 'Threads', href: 'https://www.threads.com/@togetherkcmo', icon: '/images/social/threads.png' },
];

const EXPLORE_LINKS = [
  { label: 'Home', href: '/ballot' },
  { label: 'The Five Questions', href: '/ballot#questions' },
  { label: 'FAQs', href: '/ballot#faqs' },
];

// The highest single-question total, which is the honest "ballots cast" figure.
const BALLOTS_CAST = Math.max(...ORDERED_MEASURES.map((m) => RESULTS[m.slug].total));

// ---------------------------------------------------------------------------
// Page-load confetti. Positions come from a seeded hash rather than
// Math.random so the server and client render identical markup.
// ---------------------------------------------------------------------------
const CONFETTI_COLORS = ['#e53935', '#f5a623', '#4a90d9', '#d2561e', '#ffffff'];

function seeded(n: number) {
  const v = Math.sin(n * 12.9898) * 43758.5453;
  return v - Math.floor(v);
}

const CONFETTI = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
  left: `${seeded(i + 1) * 100}%`,
  size: 3 + seeded(i + 2) * 5,
  delay: seeded(i + 3) * 2,
  duration: 2.5 + seeded(i + 4) * 2.5,
  drift: (seeded(i + 5) - 0.5) * 80,
  spin: (seeded(i + 6) * 360 + 180) * (i % 2 === 0 ? 1 : -1),
  round: i % 3 === 0,
}));

function ConfettiFall() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-10 overflow-hidden motion-reduce:hidden"
      aria-hidden="true"
    >
      {CONFETTI.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: -12, opacity: 1, rotate: 0 }}
          animate={{ y: '110vh', x: p.drift, opacity: [1, 1, 0.6, 0], rotate: p.spin }}
          transition={{ duration: p.duration, delay: p.delay, ease: 'easeIn' }}
          className="absolute"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: p.round ? '50%' : '2px',
          }}
        />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// One question: a bar you can tap open for the brief. Same content model as
// the victory page's rows, sized for a thumb.
// ---------------------------------------------------------------------------
function QuestionBar({
  measure,
  index,
  open,
  onToggle,
}: {
  measure: (typeof ORDERED_MEASURES)[number];
  index: number;
  open: boolean;
  onToggle: () => void;
}) {
  const result = RESULTS[measure.slug];
  const brief = BRIEFS[measure.slug];
  const accent = ON_NAVY[measure.slug];
  const panelId = `social-panel-${measure.slug}`;
  const supermajority = measure.voteThreshold === SUPERMAJORITY;

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: EASE_OUT }}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={`${measure.name}: show what this question was`}
        className="block w-full rounded-xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
      >
        <div className="mb-1.5 flex items-baseline justify-between gap-2">
          <span className="flex items-baseline gap-2 min-w-0">
            <span className="truncate text-base font-bold text-white">{measure.name}</span>
            <span
              className="shrink-0 text-[10px] font-bold uppercase tracking-[0.14em]"
              style={{ color: accent }}
            >
              {measure.officialQuestion.number}
            </span>
          </span>
          <span className="shrink-0 text-[11px] tabular-nums text-white/35">
            {result.total.toLocaleString()} votes
          </span>
        </div>

        <div className="relative h-11 w-full overflow-hidden rounded-xl">
          <div className="absolute inset-0 rounded-xl bg-white/[0.06]" />
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${result.yesPercent}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1.3, delay: index * 0.12 + 0.15, ease: EASE_EXPO }}
            className="absolute inset-y-0 left-0 rounded-xl"
            style={{ background: `linear-gradient(90deg, ${accent}cc 0%, ${accent} 100%)` }}
          >
            <div className="absolute inset-0 flex items-center justify-end px-3">
              <span className="text-lg font-bold tabular-nums text-navy">
                {result.yesPercent.toFixed(1)}%
              </span>
              <span className="ml-1 text-[9px] font-bold uppercase tracking-wider text-navy/60">
                Yes
              </span>
            </div>
          </motion.div>
        </div>
      </button>

      <motion.div
        id={panelId}
        initial={false}
        animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.32, ease: EASE_OUT }}
        className="overflow-hidden"
      >
        <div
          className="mt-2.5 rounded-xl bg-white/[0.05] p-4 text-[13px] leading-relaxed text-white/80"
          style={{ borderLeft: `3px solid ${accent}` }}
        >
          <p>{brief.about}</p>
          <p className="mt-2.5">{brief.stake}</p>
          <p className="mt-2.5 text-white/60">
            <span className="font-semibold text-white tabular-nums">
              {result.yes.toLocaleString()}
            </span>{' '}
            yes of{' '}
            <span className="tabular-nums">{result.total.toLocaleString()}</span> total votes.{' '}
            {result.thresholdLine}
            {supermajority
              ? ', because general obligation bonds cannot pass on a simple majority'
              : ''}
            . Cleared it by {result.marginPoints} points.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// One county: the name, and on tap all five questions inside it.
// ---------------------------------------------------------------------------
function CountyRow({
  county,
  index,
  open,
  onToggle,
}: {
  county: (typeof COUNTIES)[number];
  index: number;
  open: boolean;
  onToggle: () => void;
}) {
  const panelId = `social-county-${county.key}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: EASE_OUT }}
      className="overflow-hidden rounded-xl border border-white/10 bg-white/5"
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={`${county.name}: show all five questions`}
        className="flex w-full items-center justify-between px-4 py-3.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
      >
        <span className="text-base font-bold text-white">{county.name}</span>
        <span
          className={`text-white/40 transition-transform duration-200 ${open ? 'rotate-45' : ''}`}
          aria-hidden="true"
        >
          <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.4">
            <path d="M10 4v12M4 10h12" strokeLinecap="round" />
          </svg>
        </span>
      </button>

      <motion.div
        id={panelId}
        initial={false}
        animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.32, ease: EASE_OUT }}
        className="overflow-hidden"
      >
        <div className="space-y-3 border-t border-white/10 px-4 pb-4 pt-3.5">
          {ORDERED_MEASURES.map((m) => {
            const cell = RESULTS[m.slug].counties[county.key];
            const accent = ON_NAVY[m.slug];
            return (
              <div key={m.slug}>
                <div className="flex items-baseline justify-between gap-2">
                  <span className="truncate text-[13px] font-semibold text-white/85">
                    {m.name}
                  </span>
                  <span
                    className="shrink-0 text-sm font-bold tabular-nums"
                    style={{ color: accent }}
                  >
                    {cell.yesPercent.toFixed(1)}%
                  </span>
                </div>
                <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-white/[0.07]">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${cell.yesPercent}%`, backgroundColor: accent }}
                  />
                </div>
                <div className="mt-1 text-[11px] tabular-nums text-white/40">
                  {cell.yes.toLocaleString()} yes of {cell.total.toLocaleString()} total votes
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ===========================================================================
export default function SocialLandingPage() {
  const [openMeasure, setOpenMeasure] = useState<MeasureSlug | null>(null);
  const [openCounty, setOpenCounty] = useState<CountyKey | null>(null);
  const reduce = useReducedMotion();

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative min-h-screen overflow-hidden bg-navy">
        {/* Background orbs */}
        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute -left-32 -top-32 h-64 w-64 rounded-full bg-coral/20 blur-3xl" />
          <div className="absolute -bottom-32 -right-32 h-64 w-64 rounded-full bg-sky/20 blur-3xl" />
          <div className="absolute right-0 top-1/2 h-48 w-48 rounded-full bg-golden/10 blur-3xl" />
        </div>

        <ConfettiFall />

        <main className="relative z-20 mx-auto flex min-h-screen max-w-md flex-col px-4 py-8">
          {/* ---- Logo ---- */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-6 text-center"
          >
            <Image
              src="/images/together-kc-footer.png"
              alt="Together KC"
              width={220}
              height={84}
              className="mx-auto h-14 w-auto object-contain"
              priority
            />
          </motion.div>

          {/* ---- Social links ---- */}
          <div className="mb-5 flex justify-center gap-3">
            {SOCIAL_LINKS.map((social, i) => (
              <motion.a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, delay: 0.3 + i * 0.05 }}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-sm transition-transform active:scale-95"
                aria-label={`Follow us on ${social.name}`}
              >
                <Image
                  src={social.icon}
                  alt=""
                  width={22}
                  height={22}
                  className="h-[22px] w-[22px] object-contain"
                />
              </motion.a>
            ))}
          </div>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.5, duration: 0.3 }}
            className="mb-8 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
            aria-hidden="true"
          />

          {/* ---- Hero result ---- */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: EASE_OUT }}
            className="mb-9 text-center"
            aria-labelledby="social-hero-heading"
          >
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-white/90">
              <span className="h-2 w-2 rounded-full bg-green-400 motion-safe:animate-pulse" />
              Results &middot; August 4, 2026
            </div>

            <h1
              id="social-hero-heading"
              className="mb-4 text-[32px] font-bold leading-tight text-white"
            >
              Kansas City said{' '}
              <span className="text-coral" style={{ textShadow: '0 0 40px rgba(229,57,53,.5)' }}>
                YES
              </span>{' '}
              to all five
            </h1>

            <div className="my-4 text-7xl font-bold leading-none tracking-tight text-white">
              <AnimatedCounter end={5} duration={1.2} />
              <span> / 5</span>
            </div>
            <p className="text-sm font-medium text-white/70">KC Ballot Questions</p>

            <div className="mt-6 flex justify-center gap-6 text-white/50">
              <div className="text-center">
                <div className="text-lg font-bold text-white">${BOND_TOTAL_BILLIONS}B</div>
                <div className="text-[11px]">In bonds authorized</div>
              </div>
              <div className="w-px bg-white/20" aria-hidden="true" />
              <div className="text-center">
                <div className="text-lg font-bold text-white/70 tabular-nums">
                  {BALLOTS_CAST.toLocaleString()}
                </div>
                <div className="text-[11px]">Ballots cast</div>
              </div>
            </div>
          </motion.section>

          {/* ---- The five questions ---- */}
          <section className="mb-9" aria-labelledby="social-questions-heading">
            <h2
              id="social-questions-heading"
              className="mb-1 text-center text-xl font-bold text-white"
            >
              The Five Questions
            </h2>
            <p className="mb-6 text-center text-xs text-white/40">
              Tap any question for the brief.
            </p>

            <div className="space-y-4">
              {ORDERED_MEASURES.map((m, i) => (
                <QuestionBar
                  key={m.slug}
                  measure={m}
                  index={i}
                  open={openMeasure === m.slug}
                  onToggle={() => setOpenMeasure((cur) => (cur === m.slug ? null : m.slug))}
                />
              ))}
            </div>
          </section>

          {/* ---- Counties ---- */}
          <section className="mb-9" aria-labelledby="social-counties-heading">
            <h2
              id="social-counties-heading"
              className="mb-1 text-center text-xl font-bold text-white"
            >
              Results By County
            </h2>
            <p className="mb-6 text-center text-xs text-white/40">
              Tap a county for all five.
            </p>

            <div className="space-y-3">
              {COUNTIES.map((c, i) => (
                <CountyRow
                  key={c.key}
                  county={c}
                  index={i}
                  open={openCounty === c.key}
                  onToggle={() => setOpenCounty((cur) => (cur === c.key ? null : c.key))}
                />
              ))}
            </div>
          </section>

          {/* ---- Thank you ---- */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE_OUT }}
            className="relative mb-6 py-8 text-center"
            aria-labelledby="social-thanks-heading"
          >
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: EASE_EXPO }}
              className="mx-auto mb-8 h-[2px] w-12 origin-center bg-gradient-to-r from-coral to-golden"
              aria-hidden="true"
            />

            <h2 id="social-thanks-heading" className="mb-6 text-3xl font-bold leading-tight text-white">
              Thank You,
              <br />
              <span
                className="bg-gradient-to-r from-sky via-white to-coral bg-clip-text"
                style={{ WebkitTextFillColor: 'transparent' }}
              >
                Kansas City
              </span>
            </h2>

            <p className="mx-auto mb-6 max-w-xs text-sm leading-relaxed text-white">
              About 97,000 of us filled out a ballot on a Tuesday in August and said yes to
              affordable homes, to the civic buildings we all share, to the East Side, to the water
              coming out of the tap, and to keeping raw sewage out of our rivers.
            </p>

            <p className="mx-auto max-w-xs text-xs text-white/70">
              This one belongs to every voter, volunteer, and neighbor who knocked a door, made a
              call, or just showed up and voted.
            </p>

            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3, ease: EASE_EXPO }}
              className="mx-auto mt-8 h-[2px] w-12 origin-center bg-gradient-to-r from-golden to-sky"
              aria-hidden="true"
            />
          </motion.section>

          {/* ---- Explore ---- */}
          <p className="mb-4 text-center text-xs font-medium uppercase tracking-widest text-white/50">
            Explore the full website
          </p>
          <div className="mb-6 flex flex-wrap justify-center gap-3">
            {EXPLORE_LINKS.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileTap={reduce ? undefined : { scale: 0.97 }}
              >
                {/* /ballot, not '/': the apex redirects to /victory, so an apex
                    link here would bounce readers to the desktop results page. */}
                <Link
                  href={link.href}
                  className="inline-block rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition-colors active:bg-white/20"
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* ---- Footer ---- */}
          <div className="mt-auto pt-6 text-center">
            <p className="text-xs leading-relaxed text-white/40">
              Paid for by Together KC, Dan Kopp, Treasurer.
              <br />
              Not authorized by any candidate or candidate committee.
            </p>
          </div>
        </main>
      </div>
    </MotionConfig>
  );
}
