'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MotionConfig, motion, useInView, useReducedMotion } from 'framer-motion';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { AUGUST_BALLOT } from '@/lib/constants';
import {
  RESULTS,
  BRIEFS,
  COUNTIES,
  ORDERED_MEASURES,
  SUPERMAJORITY,
  BOND_TOTAL_BILLIONS,
  type MeasureSlug,
  type MeasureResult,
} from '@/lib/august-results';
import Footer from '@/components/layout/Footer';

// ---------------------------------------------------------------------------
// RESULTS
//
// Source of truth: the official county election board reports for the
// August 4, 2026 City of Kansas City, Missouri special election, as reported
// by the Jackson County, Clay County, and Platte County boards. These totals
// are not yet certified. A small portion of Kansas City sits in Cass County
// and is NOT included in any figure here.

// VOTE WORDING RULE: this page never prints a no-vote count. Every figure is
// stated as "<yes> yes of <total> votes", matching the etax victory page.
//
// Election-night partials that circulated in news coverage (75.6 / 69.3 /
// 69.2 / 80.9 / 81.6) were incomplete. Do not reconcile these numbers toward
// those. Every value below is transcribed from the county board reports.
// ---------------------------------------------------------------------------

const EASE_OUT = [0.25, 0.46, 0.45, 0.94] as const;
const EASE_EXPO = [0.22, 1, 0.36, 1] as const;

function seeded(n: number): number {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453123;
  return x - Math.floor(x);
}

interface Particle {
  id: number;
  color: string;
  left: string;
  size: number;
  delay: number;
  duration: number;
  rotation: number;
  driftA: number;
  driftB: number;
  circle: boolean;
}

const FALL_COLORS = ['#e53935', '#f5a623', '#4a90d9', '#d2561e', '#ffffff'];

const FALL_PARTICLES: Particle[] = Array.from({ length: 34 }, (_, i) => {
  const r = (k: number) => seeded(i * 17 + k);
  return {
    id: i,
    color: FALL_COLORS[i % FALL_COLORS.length],
    left: `${(r(1) * 100).toFixed(2)}%`,
    size: 4 + r(2) * 6,
    delay: r(3) * 2.5,
    duration: 3 + r(4) * 3,
    rotation: r(5) * 360 + 360 * (r(6) > 0.5 ? 1 : -1),
    driftA: (r(7) - 0.5) * 120,
    driftB: (r(8) - 0.5) * 80,
    circle: i % 3 === 0,
  };
});

// Always rendered, on the server and on the client, so the markup is identical
// through hydration. framer-motion's useReducedMotion is null on the server and
// resolves on the client's first render, so branching on it here used to make
// the server emit 34 particles that the client then removed: a whole-root
// hydration re-render for anyone with reduced motion on. The preference is now
// honored in CSS instead, with motion-reduce:hidden.
function ConfettiFall() {
  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none z-10 motion-reduce:hidden"
      aria-hidden="true"
    >
      {FALL_PARTICLES.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: -24, x: 0, opacity: 1, rotate: 0 }}
          animate={{
            y: '110vh',
            x: [0, p.driftA, p.driftB],
            opacity: [1, 1, 0.8, 0],
            rotate: p.rotation,
          }}
          transition={{ duration: p.duration, delay: p.delay, ease: 'easeIn' }}
          className="absolute"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: p.circle ? '50%' : '2px',
          }}
        />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Confetti burst: pops from a point when a county card is touched or hovered.
// ---------------------------------------------------------------------------
interface BurstParticle {
  id: number;
  color: string;
  x: number;
  y: number;
  size: number;
  rotation: number;
  circle: boolean;
}

const BURST_COLORS = ['#e53935', '#f5a623', '#4a90d9', '#d2561e', '#1e3a5f'];

function buildBurst(seed: number): BurstParticle[] {
  return Array.from({ length: 22 }, (_, i) => {
    const r = (k: number) => seeded(seed * 331 + i * 17 + k);
    const angle = (i / 22) * Math.PI * 2 + (r(1) - 0.5) * 0.5;
    const velocity = 70 + r(2) * 150;
    return {
      id: i,
      color: BURST_COLORS[i % BURST_COLORS.length],
      x: Math.cos(angle) * velocity,
      y: Math.sin(angle) * velocity - 60,
      size: 4 + r(3) * 5,
      rotation: r(4) * 720 - 360,
      circle: i % 3 === 0,
    };
  });
}

function ConfettiBurst({
  burstId,
  originX,
  originY,
  onDone,
}: {
  burstId: number;
  originX: number;
  originY: number;
  onDone: (id: number) => void;
}) {
  const particles = useMemo(() => buildBurst(burstId), [burstId]);

  useEffect(() => {
    const timer = setTimeout(() => onDone(burstId), 1200);
    return () => clearTimeout(timer);
  }, [burstId, onDone]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50" aria-hidden="true">
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
          transition={{ duration: 0.9, ease: EASE_OUT }}
          style={{
            position: 'absolute',
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: p.circle ? '50%' : '2px',
          }}
        />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// One ballot question: the headline result, the bar it had to clear, and the
// margin it cleared it by.
// ---------------------------------------------------------------------------
function MeasureRow({
  measure,
  result,
  index,
  open,
  onToggle,
}: {
  measure: (typeof AUGUST_BALLOT.measures)[number];
  result: MeasureResult;
  index: number;
  open: boolean;
  onToggle: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const panelId = `measure-panel-${measure.slug}`;
  const brief = BRIEFS[measure.slug];
  const supermajority = measure.voteThreshold === SUPERMAJORITY;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: EASE_OUT }}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={`${measure.name}: show what this question was`}
        className="group block w-full cursor-pointer rounded-xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-4 sm:rounded-2xl"
      >
        <div className="mb-2 flex flex-wrap items-end justify-between gap-x-3 gap-y-1 px-1 sm:mb-3">
          <span className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
            <span className="text-xl font-bold leading-tight text-navy sm:text-2xl md:text-3xl">
              {measure.name}
            </span>
            <span
              className="text-[11px] font-bold uppercase tracking-[0.16em] sm:text-xs"
              style={{ color: result.ink }}
            >
              {measure.officialQuestion.number}
            </span>
          </span>
          <span className="text-xs tabular-nums text-gray-400 sm:text-sm">
            {result.total.toLocaleString()} total votes
          </span>
        </div>

        <div className="relative h-14 w-full overflow-hidden rounded-xl sm:h-20 sm:rounded-2xl">
          <div className="absolute inset-0 rounded-xl bg-gray-100 sm:rounded-2xl" />
          <motion.div
            initial={{ width: 0 }}
            animate={inView ? { width: `${result.yesPercent}%` } : undefined}
            transition={{ duration: 1.5, delay: index * 0.14 + 0.2, ease: EASE_EXPO }}
            className="absolute inset-y-0 left-0 overflow-hidden rounded-xl sm:rounded-2xl"
            style={{
              background: `linear-gradient(90deg, ${measure.accent.swatch} 0%, ${result.ink} 100%)`,
            }}
          >
            <div className="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 ease-in-out group-hover:translate-x-[200%] group-active:translate-x-[200%] motion-reduce:hidden" />
            <div className="absolute inset-0 flex items-center justify-end px-3 sm:px-6">
              <span className="text-xl font-bold tabular-nums text-white sm:text-3xl md:text-4xl">
                {result.yesPercent.toFixed(1)}%
              </span>
              <span className="ml-1.5 text-[10px] font-semibold uppercase tracking-wider text-white/70 sm:ml-2 sm:text-sm">
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
        transition={{ duration: 0.35, ease: EASE_OUT }}
        className="overflow-hidden"
      >
        <div
          className="mt-3 rounded-xl border border-navy/10 bg-light-gray p-5 sm:rounded-2xl sm:p-6"
          style={{ borderLeftWidth: 4, borderLeftColor: measure.accent.swatch }}
        >
          <dl className="space-y-4">
            <div>
              <dt className="text-[11px] font-bold uppercase tracking-[0.16em] text-navy/60">
                What it was
              </dt>
              <dd className="mt-1.5 text-sm leading-relaxed text-gray-700 sm:text-base">
                {brief.about}
              </dd>
            </div>
            <div>
              <dt className="text-[11px] font-bold uppercase tracking-[0.16em] text-navy/60">
                What was at stake
              </dt>
              <dd className="mt-1.5 text-sm leading-relaxed text-gray-700 sm:text-base">
                {brief.stake}
              </dd>
            </div>
            <div>
              <dt className="text-[11px] font-bold uppercase tracking-[0.16em] text-navy/60">
                The result
              </dt>
              <dd className="mt-1.5 text-sm leading-relaxed text-gray-700 sm:text-base">
                <span className="font-semibold tabular-nums text-navy">
                  {result.yes.toLocaleString()}
                </span>{' '}
                yes of{' '}
                <span className="tabular-nums">{result.total.toLocaleString()}</span> total votes,
                or{' '}
                <span className="font-semibold" style={{ color: result.ink }}>
                  {result.yesPercent.toFixed(1)}% yes
                </span>
                . {result.thresholdLine}
                {supermajority ? ', because general obligation bonds cannot pass on a simple majority' : ''}
                . It cleared that bar by {result.marginPoints} points.
              </dd>
            </div>
          </dl>
          <p className="mt-4 border-t border-navy/[0.07] pt-3 text-[11px] leading-relaxed text-gray-500 sm:text-xs">
            {result.authorized}. {measure.costChip}.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// One county: every question, in ballot order, so the three cards read across.
// ---------------------------------------------------------------------------
function CountyCard({
  county,
  delay,
}: {
  county: (typeof COUNTIES)[number];
  delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const reduce = useReducedMotion();
  const [bursts, setBursts] = useState<{ id: number; x: number; y: number }[]>([]);
  const nextBurstId = useRef(0);
  const lastBurstAt = useRef(0);

  // Hover only. There is no touch handler: on a phone the card is full width
  // and five rows tall, so onTouchStart fired a full-screen burst every time a
  // thumb landed to scroll. The one-per-second guard also stops a pointer swept
  // across the three cards from stacking unbounded concurrent bursts.
  const triggerBurst = useCallback(() => {
    if (reduce || !ref.current) return;
    const now = Date.now();
    if (now - lastBurstAt.current < 1000) return;
    lastBurstAt.current = now;
    const rect = ref.current.getBoundingClientRect();
    const id = ++nextBurstId.current;
    setBursts((prev) => [
      ...prev,
      { id, x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 },
    ]);
  }, [reduce]);

  const removeBurst = useCallback(
    (id: number) => setBursts((prev) => prev.filter((b) => b.id !== id)),
    []
  );

  const shares = ORDERED_MEASURES.map((m) => RESULTS[m.slug].counties[county.key].yesPercent);
  const low = Math.min(...shares);
  const high = Math.max(...shares);

  return (
    <>
      {bursts.map((b) => (
        <ConfettiBurst
          key={b.id}
          burstId={b.id}
          originX={b.x}
          originY={b.y}
          onDone={removeBurst}
        />
      ))}
      <motion.div
        ref={ref}
        onMouseEnter={triggerBurst}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay, ease: EASE_OUT }}
        whileHover={reduce ? undefined : { y: -6 }}
        className="group relative select-none overflow-hidden rounded-2xl border border-navy/10 bg-white p-5 shadow-lg shadow-navy/5 sm:p-6"
      >
        <div
          className="pointer-events-none absolute -right-14 -top-14 h-36 w-36 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
          style={{ backgroundColor: county.swatch }}
          aria-hidden="true"
        />

        <div className="relative z-10">
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="text-lg font-bold text-navy sm:text-xl">{county.name}</h3>
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: county.swatch }}
              aria-hidden="true"
            />
          </div>
          <p className="mt-1 text-xs text-gray-500 sm:text-sm">
            Yes on all five, from{' '}
            <span className="tabular-nums font-semibold" style={{ color: county.ink }}>
              {low.toFixed(1)}%
            </span>{' '}
            to{' '}
            <span className="tabular-nums font-semibold" style={{ color: county.ink }}>
              {high.toFixed(1)}%
            </span>
          </p>

          <ul className="mt-5 space-y-3.5">
            {ORDERED_MEASURES.map((m, i) => {
              const cell = RESULTS[m.slug].counties[county.key];
              return (
                <li key={m.slug}>
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="truncate text-xs font-semibold text-navy sm:text-sm">
                      {m.name}
                    </span>
                    <span
                      className="shrink-0 text-sm font-bold tabular-nums sm:text-base"
                      style={{ color: county.ink }}
                    >
                      {cell.yesPercent.toFixed(1)}%
                    </span>
                  </div>
                  <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-navy/[0.07]">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={inView ? { width: `${cell.yesPercent}%` } : undefined}
                      transition={{
                        duration: 1.2,
                        delay: delay + 0.2 + i * 0.08,
                        ease: EASE_EXPO,
                      }}
                      className="h-full rounded-full"
                      style={{
                        background: `linear-gradient(90deg, ${m.accent.swatch}, ${county.swatch})`,
                      }}
                    />
                  </div>
                  <p className="mt-1 text-[11px] text-gray-500 tabular-nums">
                    {cell.yes.toLocaleString()} yes of {cell.total.toLocaleString()} votes
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      </motion.div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Spread plot: one row per question, one dot per county, on a shared scale.
// This is the read-by-question view that the three county cards cannot give.
//
// Deliberately carries no per-county percentages. The county cards above
// already print all fifteen of them; repeating them here at the same precision
// one screen later left the dots carrying nothing the reader had not just been
// handed as text. Colour is keyed once above the list, the scale is labelled at
// both ends, and each row keeps only the figure the cards cannot show: the gap.
// ---------------------------------------------------------------------------
// ===========================================================================
// Victory page
// ===========================================================================
export default function AugustVictoryPage() {
  const [openMeasure, setOpenMeasure] = useState<MeasureSlug | null>(null);
  const reduce = useReducedMotion();
  const housing = RESULTS.housing;

  return (
    // reducedMotion="user" moves the preference out of the render branch and
    // into framer itself. Every `initial` on this page is now unconditional, so
    // the server and the client emit identical markup (useReducedMotion is null
    // on the server and resolves on the client's first render, which used to
    // make React 19 throw out the hydrated root and re-render it). framer
    // disables transform and layout animation for these users on its own.
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen overflow-x-hidden bg-white">
        <main id="main">
          {/* ============================================================== */}
          {/* HERO                                                           */}
          {/* ============================================================== */}
          <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy/95 to-sky/80" aria-hidden="true" />

            <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
              <div className="absolute -left-1/4 -top-1/4 h-1/2 w-1/2 rounded-full bg-coral/20 blur-3xl" />
              <div className="absolute -bottom-1/4 -right-1/4 h-2/3 w-2/3 rounded-full bg-sky/20 blur-3xl" />
              <div className="absolute right-1/4 top-1/3 h-1/3 w-1/3 rounded-full bg-golden/15 blur-3xl" />
              <div className="absolute bottom-1/3 left-1/6 h-1/4 w-1/4 rounded-full bg-golden/10 blur-3xl" />
            </div>

            <div
              className="absolute inset-0 opacity-5"
              aria-hidden="true"
              style={{
                backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px),
                                  linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
                backgroundSize: '50px 50px',
              }}
            />

            <ConfettiFall />

            <div
              className="absolute -bottom-1 left-0 right-0 z-20 h-40 sm:h-72"
              aria-hidden="true"
              style={{
                background:
                  'linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.08) 30%, rgba(255,255,255,0.4) 60%, rgba(255,255,255,0.9) 90%, rgba(255,255,255,1) 100%)',
              }}
            />

            <motion.div
              className="relative z-20 mx-auto max-w-5xl px-4 pb-24 pt-8 text-center sm:pb-40 sm:pt-20"
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
                className="mb-6 flex justify-center sm:mb-8"
              >
                <Image
                  src="/images/august-logo-white.png"
                  alt="Vote Yes On All 5, Together KC"
                  width={269}
                  height={80}
                  className="h-14 w-auto sm:h-16 md:h-20"
                  priority
                />
              </motion.div>

              <motion.p
                variants={{
                  hidden: { opacity: 0, scale: 0.85 },
                  visible: {
                    opacity: 1,
                    scale: 1,
                    transition: { duration: 0.5, type: 'spring', stiffness: 200 },
                  },
                }}
                className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-white backdrop-blur-sm sm:mb-8 sm:px-5 sm:py-2.5 sm:text-sm"
              >
                <span
                  className="h-2 w-2 animate-pulse rounded-full bg-green-400 motion-reduce:animate-none sm:h-2.5 sm:w-2.5"
                  aria-hidden="true"
                />
                Results, August 4, 2026
              </motion.p>

              <motion.h1
                variants={{
                  hidden: { opacity: 0 },
                  visible: { opacity: 1, transition: { duration: 0.6 } },
                }}
                className="mb-4 text-3xl font-bold leading-tight text-white sm:mb-6 sm:text-5xl md:text-6xl lg:text-7xl"
              >
                Kansas City voted{' '}
                <span
                  className="text-coral"
                  style={{
                    textShadow:
                      '0 0 40px rgba(229, 57, 53, 0.5), 0 0 80px rgba(229, 57, 53, 0.3)',
                  }}
                >
                  YES
                </span>
                {/* sm:inline, not sm:block: Blink only takes the real forced
                    line-break path for a br whose computed display is inline. */}
                <br className="hidden sm:inline" />
                <span className="sm:hidden"> </span>
                on all five.
              </motion.h1>

              <motion.div
                variants={{
                  hidden: { opacity: 0, scale: 0.6 },
                  visible: {
                    opacity: 1,
                    scale: 1,
                    transition: { duration: 0.6, type: 'spring', stiffness: 120, damping: 15 },
                  },
                }}
                className="mb-6 sm:mb-8"
              >
                <p className="text-6xl font-bold leading-none tracking-tight text-white sm:text-8xl md:text-9xl">
                  <AnimatedCounter end={5} duration={1.2} />
                  <span> / 5</span>
                </p>
                <p className="mt-2 text-base font-medium text-white/70 sm:mt-3 sm:text-xl">
                  KC Ballot Questions
                </p>
              </motion.div>

              <motion.div
                variants={{
                  hidden: { opacity: 0 },
                  visible: { opacity: 1, transition: { duration: 0.6 } },
                }}
                className="flex flex-wrap items-start justify-center gap-6 sm:items-center sm:gap-10"
              >
                <div className="text-center">
                  <p className="text-xl font-bold text-white sm:text-3xl">
                    <AnimatedCounter
                      end={BOND_TOTAL_BILLIONS}
                      decimals={1}
                      prefix="$"
                      suffix="B"
                      duration={1.6}
                    />
                  </p>
                  <p className="mt-1 text-xs text-white/60 sm:text-sm">in bonds authorized</p>
                </div>
                <div className="hidden h-10 w-px bg-white/20 sm:block sm:h-12" aria-hidden="true" />
                <div className="text-center">
                  <p className="text-xl font-bold text-white sm:text-3xl">
                    <AnimatedCounter end={housing.total} duration={1.8} />
                  </p>
                  <p className="mt-1 text-xs text-white/60 sm:text-sm">
                    ballots cast on Question 1
                  </p>
                </div>
              </motion.div>
            </motion.div>

            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.5 }}
              onClick={() =>
                document
                  .getElementById('results')
                  ?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' })
              }
              className="absolute bottom-24 left-1/2 z-20 -translate-x-1/2 cursor-pointer rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 sm:bottom-32"
              aria-label="Skip to the results"
            >
              <span className="flex h-10 w-6 animate-bounce justify-center rounded-full border-2 border-white/30 motion-reduce:animate-none">
                <span className="mt-2 h-3 w-1.5 rounded-full bg-white/50" />
              </span>
            </motion.button>
          </section>

          {/* ============================================================== */}
          {/* THE FIVE QUESTIONS                                             */}
          {/* ============================================================== */}
          <section
            id="results"
            aria-labelledby="results-heading"
            className="relative scroll-mt-20 overflow-hidden bg-white py-12 sm:pb-24 sm:pt-20"
          >
            <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: EASE_OUT }}
                className="mb-10 text-center sm:mb-16"
              >
                <h2
                  id="results-heading"
                  className="text-2xl font-bold text-navy sm:text-4xl md:text-5xl"
                >
                  The Five Questions
                </h2>
              </motion.div>

              <div className="space-y-4 sm:space-y-5">
                {ORDERED_MEASURES.map((m, i) => (
                  <MeasureRow
                    key={m.slug}
                    measure={m}
                    result={RESULTS[m.slug]}
                    index={i}
                    open={openMeasure === m.slug}
                    onToggle={() =>
                      setOpenMeasure((cur) => (cur === m.slug ? null : m.slug))
                    }
                  />
                ))}
              </div>
            </div>
          </section>

          {/* ============================================================== */}
          {/* COUNTIES                                                       */}
          {/* ============================================================== */}
          <section
            aria-labelledby="counties-heading"
            className="relative overflow-hidden bg-white py-12 sm:py-20"
          >
            <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: EASE_OUT }}
                className="mb-10 text-center sm:mb-14"
              >
                <h2
                  id="counties-heading"
                  className="text-2xl font-bold text-navy sm:text-4xl md:text-5xl"
                >
                  Results By County
                </h2>
              </motion.div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
                {COUNTIES.map((c, i) => (
                  <CountyCard key={c.key} county={c} delay={i * 0.12} />
                ))}
              </div>

            </div>
          </section>

          {/* ============================================================== */}
          {/* THANK YOU                                                      */}
          {/* ============================================================== */}
          <section
            aria-labelledby="thanks-heading"
            className="relative overflow-hidden bg-white pb-16 pt-8 sm:pb-24 sm:pt-16"
          >
            <div className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: EASE_EXPO }}
                className="mx-auto mb-10 h-[2px] w-16 origin-center bg-gradient-to-r from-coral to-golden sm:mb-16 sm:w-24"
                aria-hidden="true"
              />

              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: EASE_OUT }}
                className="text-center"
              >
                <h2
                  id="thanks-heading"
                  className="mb-8 text-3xl font-bold leading-tight text-navy sm:mb-10 sm:text-5xl md:text-6xl"
                >
                  Thank You,
                  <br />
                  <span className="gradient-text">Kansas City</span>
                </h2>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2, ease: EASE_OUT }}
                className="text-center"
              >
                <p className="mx-auto mb-5 max-w-2xl text-lg leading-relaxed text-gray-600 sm:mb-6 sm:text-xl md:text-2xl">
                  About 97,000 of us filled out a ballot on a Tuesday in August and said yes to
                  affordable homes, to the civic buildings we all share, to the East Side, to the
                  water coming out of the tap, and to keeping raw sewage out of our rivers.
                </p>
                <p className="mx-auto max-w-xl text-base text-gray-500 sm:text-lg">
                  This one belongs to every voter, volunteer, and neighbor who knocked a door,
                  made a call, or just showed up and voted.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4, ease: EASE_OUT }}
                className="mt-12 text-center sm:mt-16"
              >
                <p className="mb-5 text-xs font-medium uppercase tracking-widest text-gray-500 sm:mb-6 sm:text-sm">
                  Explore the full website
                </p>
                <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
                  {/* Point at /ballot, not '/': the apex redirects here, so an
                      apex link on this page would send readers in a circle. */}
                  {[
                    { label: 'Home', href: '/ballot' },
                    { label: 'The Five Questions', href: '/ballot#questions' },
                    { label: 'FAQs', href: '/ballot#faqs' },
                  ].map((link) => (
                    <motion.div
                      key={link.href}
                      whileHover={reduce ? undefined : { y: -3, scale: 1.03 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    >
                      <Link
                        href={link.href}
                        className="inline-block rounded-full bg-navy px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-navy/10 transition-colors duration-200 hover:bg-navy/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 sm:px-8 sm:py-3.5 sm:text-base"
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </section>
        </main>

        {/* Hand off to the navy footer without a seam */}
        <div
          className="-mb-px h-52 sm:h-60"
          aria-hidden="true"
          style={{
            background:
              'linear-gradient(to bottom, #ffffff 0%, #f8f9fb 5%, #eef2f6 12%, #e1e8ef 18%, #d1dbe5 24%, #bfccd9 30%, #aabcce 36%, #94abc2 42%, #7d99b5 48%, #6787a8 54%, #53759b 60%, #41648d 66%, #325580 70%, #264869 74%, #1f3d62 78%, #1e3a5f 82%, #1e3a5f 100%)',
          }}
        />

        <Footer />
      </div>
    </MotionConfig>
  );
}
