'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MotionConfig, motion, useInView, useReducedMotion } from 'framer-motion';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { TopicIcon } from '@/components/ui/TopicIcon';
import { AUGUST_BALLOT } from '@/lib/constants';
import Footer from '@/components/layout/Footer';

// ---------------------------------------------------------------------------
// RESULTS
//
// Source of truth: the official county election board reports for the
// August 4, 2026 City of Kansas City, Missouri special election, as reported
// by the Jackson County, Clay County, and Platte County boards. These are
// unofficial and not yet certified. A small portion of Kansas City sits in
// Cass County and is NOT included in any figure here.
//
// Election-night partials that circulated in news coverage (75.6 / 69.3 /
// 69.2 / 80.9 / 81.6) were incomplete. Do not reconcile these numbers toward
// those. Every value below is transcribed from the county board reports.
// ---------------------------------------------------------------------------

const EASE_OUT = [0.25, 0.46, 0.45, 0.94] as const;
const EASE_EXPO = [0.22, 1, 0.36, 1] as const;

type MeasureSlug = (typeof AUGUST_BALLOT.measures)[number]['slug'];
type CountyKey = 'jackson' | 'clay' | 'platte';

interface CountyResult {
  yes: number;
  no: number;
  yesPercent: number;
}

interface MeasureResult {
  yes: number;
  no: number;
  total: number;
  yesPercent: number;
  /** Share of the vote the question actually had to clear to pass. */
  thresholdPercent: number;
  /** Short tick label that sits under the threshold marker. */
  thresholdTick: string;
  /** Full-width sentence under the bar, so nothing has to fit beside the tick. */
  thresholdLine: string;
  /** Points the question finished above its own bar. */
  marginPoints: number;
  /**
   * What the yes vote actually authorized, as a labelled line. The raw
   * `amount` field in constants is not parallel across the five (four are bare
   * dollar figures, one is a sentence), so the page carries its own wording.
   */
  authorized: string;
  /** Darkened accent that clears AA contrast for text on white. */
  ink: string;
  counties: Record<CountyKey, CountyResult>;
}

const RESULTS: Record<MeasureSlug, MeasureResult> = {
  housing: {
    yes: 72489,
    no: 24674,
    total: 97163,
    yesPercent: 74.61,
    thresholdPercent: 57.14,
    thresholdTick: '57.1%',
    thresholdLine: 'Needed 57.1%, a four-sevenths supermajority',
    marginPoints: 17.5,
    authorized: '$100 million in general obligation bonds authorized',
    ink: '#b3231e',
    counties: {
      jackson: { yes: 46945, no: 9866, yesPercent: 82.63 },
      clay: { yes: 17705, no: 10504, yesPercent: 62.76 },
      platte: { yes: 7839, no: 4304, yesPercent: 64.56 },
    },
  },
  'civic-buildings': {
    yes: 65908,
    no: 30449,
    total: 96357,
    yesPercent: 68.4,
    thresholdPercent: 57.14,
    thresholdTick: '57.1%',
    thresholdLine: 'Needed 57.1%, a four-sevenths supermajority',
    marginPoints: 11.3,
    authorized: '$100 million in general obligation bonds authorized',
    ink: '#8a5a00',
    counties: {
      jackson: { yes: 42752, no: 13606, yesPercent: 75.86 },
      clay: { yes: 16174, no: 11866, yesPercent: 57.68 },
      platte: { yes: 6982, no: 4977, yesPercent: 58.38 },
    },
  },
  'central-city': {
    yes: 65724,
    no: 30717,
    total: 96441,
    yesPercent: 68.15,
    thresholdPercent: 50,
    thresholdTick: '50%',
    thresholdLine: 'Needed 50%, a simple majority',
    marginPoints: 18.1,
    authorized: 'One-eighth-cent sales tax, renewed for 10 years',
    ink: '#a03d0f',
    counties: {
      jackson: { yes: 43760, no: 12642, yesPercent: 77.59 },
      clay: { yes: 15251, no: 12771, yesPercent: 54.43 },
      platte: { yes: 6713, no: 5304, yesPercent: 55.86 },
    },
  },
  'clean-water': {
    yes: 77747,
    no: 18799,
    total: 96546,
    yesPercent: 80.53,
    thresholdPercent: 50,
    thresholdTick: '50%',
    thresholdLine: 'Needed 50%, a simple majority',
    marginPoints: 30.5,
    authorized: '$750 million in waterworks revenue bonds authorized',
    ink: '#17558f',
    counties: {
      jackson: { yes: 47365, no: 8973, yesPercent: 84.07 },
      clay: { yes: 21112, no: 7052, yesPercent: 74.96 },
      platte: { yes: 9270, no: 2774, yesPercent: 76.97 },
    },
  },
  sewers: {
    yes: 78603,
    no: 18188,
    total: 96791,
    yesPercent: 81.21,
    thresholdPercent: 50,
    thresholdTick: '50%',
    thresholdLine: 'Needed 50%, a simple majority',
    marginPoints: 31.2,
    authorized: '$750 million in sanitary sewer revenue bonds authorized',
    ink: '#1e3a5f',
    counties: {
      jackson: { yes: 48119, no: 8467, yesPercent: 85.04 },
      clay: { yes: 21206, no: 6964, yesPercent: 75.28 },
      platte: { yes: 9278, no: 2757, yesPercent: 77.09 },
    },
  },
};

const COUNTIES: { key: CountyKey; name: string; swatch: string; ink: string }[] = [
  { key: 'jackson', name: 'Jackson County', swatch: '#1e3a5f', ink: '#1e3a5f' },
  { key: 'clay', name: 'Clay County', swatch: '#4a90d9', ink: '#17558f' },
  { key: 'platte', name: 'Platte County', swatch: '#d2561e', ink: '#a03d0f' },
];

// Ballot order (Question 1 through Question 5), derived from the official
// question numbers in constants rather than the authoring order of the array.
const ballotNumber = (m: (typeof AUGUST_BALLOT.measures)[number]) =>
  parseInt(m.officialQuestion.number.replace(/\D/g, ''), 10);

const ORDERED_MEASURES = [...AUGUST_BALLOT.measures].sort(
  (a, b) => ballotNumber(a) - ballotNumber(b)
);

const SUPERMAJORITY = 'Four-sevenths supermajority';

// The two GO bonds happen to be Questions 1 and 2, so grouping by the bar they
// had to clear does not disturb ballot order. Split from voteThreshold rather
// than by index so it cannot drift if the constants change.
const QUESTION_GROUPS = [
  {
    heading: 'The two that needed a supermajority',
    measures: ORDERED_MEASURES.filter((m) => m.voteThreshold === SUPERMAJORITY),
  },
  {
    heading: 'The three that needed a simple majority',
    measures: ORDERED_MEASURES.filter((m) => m.voteThreshold !== SUPERMAJORITY),
  },
];

// Bond authorization: the four bond questions only. The Central City question
// is a sales tax renewal and adds no bond authorization.
const BOND_TOTAL_BILLIONS = 1.7;

// The dot plot scale. Every county figure on the page falls inside this band.
const SCALE_MIN = 50;
const SCALE_MAX = 90;
const scalePos = (pct: number) =>
  ((Math.min(Math.max(pct, SCALE_MIN), SCALE_MAX) - SCALE_MIN) / (SCALE_MAX - SCALE_MIN)) * 100;

// ---------------------------------------------------------------------------
// Confetti
//
// Scatter comes from a seeded hash rather than Math.random, so the particles
// are pure values: identical on the server and the client (no hydration
// mismatch) and stable across re-renders.
// ---------------------------------------------------------------------------
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
function QuestionResult({
  measure,
  result,
  delay,
}: {
  measure: (typeof AUGUST_BALLOT.measures)[number];
  result: MeasureResult;
  delay: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const supermajority = measure.voteThreshold === SUPERMAJORITY;

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay, ease: EASE_OUT }}
      className="relative overflow-hidden rounded-2xl border border-navy/10 bg-white p-5 shadow-lg shadow-navy/5 sm:p-8"
    >
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full blur-3xl"
        style={{ backgroundColor: measure.accent.swatch, opacity: 0.12 }}
        aria-hidden="true"
      />

      <div className="relative z-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-2">
              <span
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${measure.accent.swatch}1f`, color: result.ink }}
                aria-hidden="true"
              >
                <TopicIcon id={measure.motif} className="h-5 w-5" />
              </span>
              <span
                className="text-[11px] font-bold uppercase tracking-[0.16em] sm:text-xs"
                style={{ color: result.ink }}
              >
                {measure.officialQuestion.number}
              </span>
              {/* Sits with the question number, not down in the footer row:
                  the higher bar has to be read before the result, not after. */}
              {supermajority ? (
                <span className="rounded-full border border-navy/15 bg-navy/[0.04] px-2.5 py-1 text-[11px] font-semibold text-navy">
                  Supermajority required
                </span>
              ) : null}
            </div>
            <h3 className="mt-3 text-xl font-bold leading-tight text-navy sm:text-2xl md:text-3xl">
              {measure.name}
            </h3>
            <p className="mt-1.5 text-sm text-gray-600 sm:text-base">{measure.cardPunch}</p>
          </div>

          <div className="shrink-0 text-left sm:text-right">
            <div
              className="text-4xl font-bold leading-none tracking-tight tabular-nums sm:text-5xl md:text-6xl"
              style={{ color: result.ink }}
            >
              <AnimatedCounter end={result.yesPercent} decimals={1} suffix="%" duration={1.6} />
            </div>
            <div
              className="mt-1.5 text-xs font-bold uppercase tracking-[0.18em]"
              style={{ color: result.ink }}
            >
              Voted yes
            </div>
          </div>
        </div>

        {/* Result bar with the threshold this question actually had to clear */}
        <div className="mt-6 sm:mt-8">
          <div className="relative">
            <div className="relative h-10 overflow-hidden rounded-xl bg-navy/[0.06] sm:h-14">
              <motion.div
                initial={{ width: 0 }}
                animate={inView ? { width: `${result.yesPercent}%` } : undefined}
                transition={{ duration: 1.5, delay: delay + 0.25, ease: EASE_EXPO }}
                className="absolute inset-y-0 left-0 rounded-xl"
                style={{
                  background: `linear-gradient(90deg, ${measure.accent.swatch} 0%, ${result.ink} 100%)`,
                }}
              />

              {/* The zone the question had to fill to pass, hatched over the
                  fill. This is what makes four sevenths visible as an area
                  rather than as a 23px shift in a dashed line: the two GO bond
                  cards carry a wider hatch than the three majority cards. */}
              <div
                className="pointer-events-none absolute inset-y-0 left-0"
                style={{
                  width: `${result.thresholdPercent}%`,
                  backgroundImage:
                    'repeating-linear-gradient(135deg, rgba(255,255,255,0.30) 0 5px, rgba(255,255,255,0) 5px 11px)',
                }}
                aria-hidden="true"
              />
            </div>

            {/* Threshold marker sits above the fill so you can see it cleared */}
            <div
              className="pointer-events-none absolute inset-y-0"
              style={{ left: `${result.thresholdPercent}%` }}
              aria-hidden="true"
            >
              <div
                className="h-full w-[3px] -translate-x-1/2 rounded-full"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(to bottom, #ffffff 0 5px, transparent 5px 10px)',
                }}
              />
            </div>
          </div>

          {/* Tick label under the marker, in a fixed-width box so it can never
              run out of room at the right edge of a phone, and the wording on
              its own full-width line below. */}
          <div className="relative mt-2 h-4">
            <div
              className="absolute w-16 -translate-x-1/2 text-center text-[10px] font-bold tabular-nums text-navy/70 sm:text-[11px]"
              style={{ left: `${result.thresholdPercent}%` }}
            >
              {result.thresholdTick}
            </div>
          </div>
          <p className="mt-1.5 text-[11px] leading-tight text-gray-600 sm:text-xs">
            {result.thresholdLine}
          </p>
        </div>

        <div className="mt-4 flex flex-col gap-3 border-t border-navy/[0.07] pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-gray-600 sm:text-sm">
            <span className="font-semibold text-navy tabular-nums">
              {result.yes.toLocaleString()}
            </span>{' '}
            yes to{' '}
            <span className="tabular-nums">{result.no.toLocaleString()}</span> no, of{' '}
            <span className="tabular-nums">{result.total.toLocaleString()}</span> votes cast.{' '}
            <span className="font-semibold" style={{ color: result.ink }}>
              Cleared the bar by {result.marginPoints} points.
            </span>
          </p>
          <span
            className="w-fit shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold"
            style={{ backgroundColor: `${measure.accent.swatch}1a`, color: result.ink }}
          >
            {measure.costChip}
          </span>
        </div>

        <p className="mt-3 text-[11px] leading-relaxed text-gray-500 sm:text-xs">
          {result.authorized}
        </p>
      </div>

      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: delay + 0.45, ease: EASE_EXPO }}
        className="absolute bottom-0 left-0 right-0 h-1 origin-left"
        style={{
          background: `linear-gradient(90deg, ${measure.accent.swatch}, ${result.ink})`,
        }}
        aria-hidden="true"
      />
    </motion.article>
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
                    {cell.yes.toLocaleString()} yes to {cell.no.toLocaleString()} no
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
function SpreadRow({
  measure,
  result,
  index,
}: {
  measure: (typeof AUGUST_BALLOT.measures)[number];
  result: MeasureResult;
  index: number;
}) {
  const values = COUNTIES.map((c) => ({ ...c, pct: result.counties[c.key].yesPercent }));
  const lowest = values.reduce((a, b) => (a.pct <= b.pct ? a : b));
  const highest = values.reduce((a, b) => (a.pct >= b.pct ? a : b));
  const gap = highest.pct - lowest.pct;

  return (
    <motion.li
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: EASE_OUT }}
      className="py-4 first:pt-0 last:pb-0"
    >
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-sm font-bold text-navy sm:text-base">
          {measure.name}
          <span className="ml-2 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
            {measure.officialQuestion.number}
          </span>
        </span>
        <span className="shrink-0 text-xs font-semibold tabular-nums text-gray-500 sm:text-sm">
          {gap.toFixed(1)} point gap
        </span>
      </div>

      <div className="relative mx-2 mb-1 mt-4 h-3">
        <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-navy/10" aria-hidden="true" />
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: index * 0.08 + 0.15, ease: EASE_EXPO }}
          className="absolute top-1/2 h-[3px] origin-left -translate-y-1/2 rounded-full"
          style={{
            left: `${scalePos(lowest.pct)}%`,
            width: `${scalePos(highest.pct) - scalePos(lowest.pct)}%`,
            background: `linear-gradient(90deg, ${lowest.swatch}, ${highest.swatch})`,
          }}
          aria-hidden="true"
        />
        {values.map((v) => (
          <motion.span
            key={v.key}
            initial={{ opacity: 0, scale: 0.4 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.08 + 0.4, ease: EASE_OUT }}
            className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-white"
            style={{ left: `${scalePos(v.pct)}%`, backgroundColor: v.swatch }}
            title={`${v.name}: ${v.pct.toFixed(1)}% yes`}
            aria-hidden="true"
          />
        ))}
      </div>
    </motion.li>
  );
}

// ===========================================================================
// Victory page
// ===========================================================================
export default function AugustVictoryPage() {
  const reduce = useReducedMotion();
  const housing = RESULTS.housing;
  const centralCity = RESULTS['central-city'];

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
                Unofficial results, August 4, 2026
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
                  <span className="text-white/40"> / 5</span>
                </p>
                <p className="mt-2 text-base font-medium text-white/70 sm:mt-3 sm:text-xl">
                  ballot questions passed
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
                  The five questions
                </h2>
                <p className="mx-auto mt-3 max-w-2xl text-base text-gray-600 sm:mt-4 sm:text-lg">
                  Two of the five needed a four-sevenths supermajority, not a simple majority.
                  Both cleared it with room to spare.
                </p>
              </motion.div>

              {/* Grouped, not just ordered. The two GO bonds are Questions 1 and
                  2, so this changes nothing about ballot order, but it puts the
                  higher bar in a heading instead of leaving it to a 23px shift in
                  a dashed marker. */}
              {QUESTION_GROUPS.map((group) => (
                <div key={group.heading} className="mt-8 first:mt-0 sm:mt-14">
                  <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-navy/70 sm:text-sm">
                    {group.heading}
                  </h3>
                  <div className="mt-4 space-y-5 sm:mt-6 sm:space-y-7">
                    {group.measures.map((m) => (
                      <QuestionResult
                        key={m.slug}
                        measure={m}
                        result={RESULTS[m.slug]}
                        delay={ORDERED_MEASURES.indexOf(m) * 0.06}
                      />
                    ))}
                  </div>
                </div>
              ))}

              {/* The four-sevenths story, said plainly */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: EASE_OUT }}
                className="mt-10 rounded-2xl border border-navy/10 bg-light-gray p-6 sm:mt-14 sm:p-8"
              >
                <h3 className="text-lg font-bold text-navy sm:text-xl">
                  The two hardest questions on the ballot
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-gray-700 sm:text-base">
                  Because they are general obligation bonds, the affordable housing question and
                  the civic buildings question could not pass on a simple majority. Missouri
                  required four sevenths of the vote, which is 57.1%. Kansas City gave affordable
                  housing {housing.yesPercent.toFixed(1)}% and civic buildings{' '}
                  {RESULTS['civic-buildings'].yesPercent.toFixed(1)}%, clearing the bar by{' '}
                  {housing.marginPoints} and {RESULTS['civic-buildings'].marginPoints} points.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-gray-600 sm:text-base">
                  None of the five raises your tax rate. The water and sewer bonds are revenue
                  bonds repaid from utility fees. The two general obligation bonds are timed to
                  replace older debt that is being paid off, so the property tax rate stays flat.
                  The Central City question renews an existing sales tax at the same one-eighth-cent
                  rate it has been since 2017.
                </p>
              </motion.div>
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
                  Results by county
                </h2>
                {/* Says which boards reported, not how many counties the city is
                    in. A sliver of Kansas City is in Cass County, which the
                    attribution below this section spells out. */}
                <p className="mx-auto mt-3 max-w-2xl text-base text-gray-600 sm:mt-4 sm:text-lg">
                  Three county election boards reported these results. Every question won a
                  majority in all three.
                </p>
              </motion.div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
                {COUNTIES.map((c, i) => (
                  <CountyCard key={c.key} county={c} delay={i * 0.12} />
                ))}
              </div>

              {/* Read the same data the other way: by question, across counties */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: EASE_OUT }}
                className="mx-auto mt-12 max-w-3xl sm:mt-20"
              >
                <h3 className="text-xl font-bold text-navy sm:text-2xl md:text-3xl">
                  Jackson County led on every question
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-gray-600 sm:text-base">
                  The Jackson County side of the city backed all five by wider margins than the
                  Northland. The widest split was the Central City sales tax renewal:{' '}
                  {centralCity.counties.jackson.yesPercent.toFixed(1)}% yes in Jackson County
                  against {centralCity.counties.clay.yesPercent.toFixed(1)}% in Clay County. The
                  narrowest was clean water, where all three counties landed within ten points of
                  each other.
                </p>

                {/* Colour is keyed once, here, rather than restated on all five
                    rows. The exact percentages are on the county cards above. */}
                <div className="mt-8 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b border-navy/[0.07] pb-3">
                  <p className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] sm:text-xs">
                    {COUNTIES.map((c) => (
                      <span key={c.key} className="inline-flex items-center gap-1.5">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: c.swatch }}
                          aria-hidden="true"
                        />
                        <span className="font-semibold" style={{ color: c.ink }}>
                          {c.name.replace(' County', '')}
                        </span>
                      </span>
                    ))}
                  </p>
                  <p className="text-[11px] text-gray-500 sm:text-xs">Yes share, 50% to 90%</p>
                </div>

                <ul className="divide-y divide-navy/[0.07]">
                  {ORDERED_MEASURES.map((m, i) => (
                    <SpreadRow key={m.slug} measure={m} result={RESULTS[m.slug]} index={i} />
                  ))}
                </ul>

                <div className="mx-2 mt-2 flex items-center justify-between border-t border-navy/[0.07] pt-2 text-[10px] font-semibold tabular-nums text-gray-500 sm:text-[11px]">
                  <span>50%</span>
                  <span>90%</span>
                </div>

                <p className="mt-4 text-[11px] leading-relaxed text-gray-500 sm:text-xs">
                  Each dot is one county&apos;s yes share, plotted on a shared 50% to 90% scale.
                </p>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mx-auto mt-10 max-w-3xl text-center text-xs leading-relaxed text-gray-600 sm:mt-14 sm:text-sm"
              >
                Unofficial results as reported by the Jackson County, Clay County, and Platte
                County election boards. Platte County reported 13 of 13 precincts. These totals
                are not yet certified. A small portion of Kansas City lies in Cass County and is
                not included in the figures on this page.
              </motion.p>
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
                  Thank you,
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
                  What comes next
                </p>
                <motion.div
                  whileHover={reduce ? undefined : { y: -3, scale: 1.03 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  className="inline-block"
                >
                  {/* Points at /ballot, not '/': the apex now redirects here, so
                      an apex link on this page would send readers in a circle. */}
                  <Link
                    href="/ballot"
                    className="inline-block rounded-full bg-navy px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-navy/10 transition-colors duration-200 hover:bg-navy/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 sm:px-9 sm:py-4 sm:text-base"
                  >
                    Explore the full site
                  </Link>
                </motion.div>
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
