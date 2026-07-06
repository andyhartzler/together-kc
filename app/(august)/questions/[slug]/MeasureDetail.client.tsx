'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import {
  motion,
  AnimatePresence,
  useScroll,
  useInView,
  useReducedMotion,
} from 'framer-motion';
import { cn } from '@/lib/utils';
import type { AUGUST_BALLOT } from '@/lib/constants';
import AugustFooter from '@/components/august/paper/AugustFooter';
import { accentInk, darken, withAlpha } from '@/components/august/accent';
import {
  Sheet,
  KickerRule,
  BallotOval,
  PaperButton,
  Stamp,
  PAPER_EASE,
  ledgerDelay,
  riseVariants,
  staggerContainer,
} from '@/components/august/paper';
import { SIGNATURES } from '@/components/august/signatures';
import {
  PrintedCounter,
  VIEWPORT_REVEAL,
  usePaperEntrance,
} from '@/components/august/signatures/entrance';

type Measure = (typeof AUGUST_BALLOT)['measures'][number];

interface Neighbor {
  slug: string;
  name: string;
  swatch: string;
  motif: string;
}

interface VoteFacts {
  electionDate: string;
  earlyVotingDate: string;
  pollsOpen: string;
}

// Design choice lives in the view, not the data: only measures with a real
// dated public record show the docket. Clean Water and Civic Buildings keep
// their sourced dates in constants but omit the docket here.
const TIMELINE_SLUGS = new Set(['sewers', 'housing', 'central-city']);

// ---------------------------------------------------------------------------
// The record renders as a dated docket, so it must read forward in time even
// if the constants array interleaves entries thematically. Keys derive from
// the printed date string: year, then month when present (entries with no
// month sort before dated entries in the same year), then day. Stable sort
// preserves the authored order for ties.
// ---------------------------------------------------------------------------

const MONTH_STEMS = [
  'jan', 'feb', 'mar', 'apr', 'may', 'jun',
  'jul', 'aug', 'sep', 'oct', 'nov', 'dec',
] as const;

function timelineKey(date: string): number {
  const year = Number(date.match(/\d{4}/)?.[0] ?? 9999);
  const lower = date.toLowerCase();
  const monthIdx = MONTH_STEMS.findIndex((m) => lower.includes(m));
  const day = Number(date.match(/(?:^|\s)(\d{1,2})(?:,|\s|$)/)?.[1] ?? 0);
  return year * 10000 + (monthIdx + 1) * 100 + day;
}

interface TimelineEntry {
  readonly date: string;
  readonly label: string;
}

function sortTimeline(entries: readonly TimelineEntry[]): TimelineEntry[] {
  return [...entries].sort((a, b) => timelineKey(a.date) - timelineKey(b.date));
}

// Prevent a short orphan word ("KC") wrapping alone onto its own ledger line.
function noOrphan(label: string): string {
  return label.replace(/ (\S{1,3})$/, '\u00A0$1');
}

// ---------------------------------------------------------------------------
// Per-measure abstract rule motifs for the poster hero's bottom edge. Quiet,
// typographic marks drawn in the field's darkened shade: rules, not
// illustrations. All decorative (aria-hidden).
// ---------------------------------------------------------------------------

function wavePath(y: number, amp: number, seg: number, width: number): string {
  let d = `M0 ${y}`;
  for (let x = 0; x < width; x += seg * 2) {
    d += ` q ${seg / 2} ${-amp} ${seg} 0 q ${seg / 2} ${amp} ${seg} 0`;
  }
  return d;
}

function zigzagPoints(width: number, step: number, yLow: number, yHigh: number): string {
  const pts: string[] = [];
  for (let x = 0, i = 0; x <= width; x += step, i++) {
    pts.push(`${x},${i % 2 === 0 ? yLow : yHigh}`);
  }
  return pts.join(' ');
}

function stepsPath(width: number, stepW: number, stepH: number, baseY: number): string {
  let d = `M0 ${baseY}`;
  for (let x = 0; x < width; x += stepW * 2) {
    d += ` h ${stepW} v ${-stepH} h ${stepW} v ${stepH}`;
  }
  return d;
}

function HeroMotif({ slug, shade }: { slug: string; shade: string }) {
  switch (slug) {
    case 'clean-water':
      // Three thin wave rules.
      return (
        <svg
          viewBox="0 0 1200 48"
          preserveAspectRatio="none"
          className="h-10 w-full sm:h-12"
          aria-hidden="true"
        >
          {[12, 25, 38].map((y, i) => (
            <path
              key={y}
              d={wavePath(y, 5, 28, 1200)}
              fill="none"
              stroke={shade}
              strokeWidth={2 - i * 0.4}
            />
          ))}
        </svg>
      );
    case 'sewers':
      // A dashed rule stopping at 85% of the width (the capture mandate).
      return (
        <div className="flex h-10 items-center sm:h-12" aria-hidden="true">
          <div
            className="h-[3px] w-[85%]"
            style={{
              backgroundImage: `repeating-linear-gradient(90deg, ${shade} 0 12px, transparent 12px 20px)`,
            }}
          />
        </div>
      );
    case 'housing':
      // A repeating roofline zigzag hairline.
      return (
        <svg
          viewBox="0 0 1200 48"
          preserveAspectRatio="none"
          className="h-10 w-full sm:h-12"
          aria-hidden="true"
        >
          <polyline
            points={zigzagPoints(1200, 24, 40, 14)}
            fill="none"
            stroke={shade}
            strokeWidth={1.5}
          />
        </svg>
      );
    case 'civic-buildings':
      // A stepped cornice rule.
      return (
        <svg
          viewBox="0 0 1200 48"
          preserveAspectRatio="none"
          className="h-10 w-full sm:h-12"
          aria-hidden="true"
        >
          <path d={stepsPath(1200, 26, 16, 38)} fill="none" stroke={shade} strokeWidth={2} />
        </svg>
      );
    case 'central-city':
      // A hatched band (the plat grammar).
      return (
        <div
          className="h-8 sm:h-10"
          aria-hidden="true"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, ${shade} 0 1px, transparent 1px 7px)`,
          }}
        />
      );
    default:
      return null;
  }
}

// ---------------------------------------------------------------------------
// The story's floating pull-stat. Every heroStat already prints in the key
// numbers ledger one scroll above, so measures with a strong second figure
// elsewhere in their constants record pull that instead of repeating the
// ledger verbatim. Values are quoted or derived from the measure record only.
// ---------------------------------------------------------------------------
function pullStatFor(measure: Measure): { value: string; label: string } | undefined {
  if (measure.slug === 'clean-water') {
    // Quoted from keyFacts: "a 240-million-gallon-per-day treatment plant".
    const fact = measure.keyFacts.find((f) => f.includes('240-million-gallon-per-day'));
    if (fact) {
      return { value: '240M', label: 'gallons per day the KC Water treatment plant handles' };
    }
  }
  if (measure.slug === 'housing') {
    // Quoted from the timeline: the year the 2022 money is projected spent.
    const entry = measure.timeline.find(
      (t) => t.date === '2027' && /fully spent/i.test(t.label)
    );
    if (entry) return { value: entry.date, label: entry.label };
  }
  return measure.heroStats[1];
}

// Ruled accordion for the measure FAQ: hairline dividers, no cards, plus
// glyph rotating 45 degrees. Keyboard accessible, reduced motion renders
// state changes instantly.
function RuledFaq({
  items,
  accentColor,
}: {
  items: Array<{ question: string; answer: string }>;
  accentColor: string;
}) {
  const [open, setOpen] = useState<number | null>(0);
  const reduce = useReducedMotion();

  return (
    <div className="w-full min-w-0 rule-heavy">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={i} className="rule-hair first:border-t-0">
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              aria-controls={`faq-panel-${i}`}
              className="group flex w-full items-start justify-between gap-4 py-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
            >
              <span className="min-w-0 font-bold leading-snug text-ink transition-colors group-hover:text-coral-press">
                {item.question}
              </span>
              <motion.span
                aria-hidden="true"
                animate={{ rotate: isOpen ? 45 : 0 }}
                transition={{ duration: reduce ? 0 : 0.25, ease: PAPER_EASE }}
                className="mt-0.5 shrink-0 text-xl font-bold leading-none"
                style={{ color: accentColor }}
              >
                +
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={`faq-panel-${i}`}
                  initial={reduce ? false : { height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: reduce ? 0 : 0.3, ease: PAPER_EASE }}
                  className="overflow-hidden"
                >
                  <p className="type-body max-w-prose break-words pb-6 text-ink/80">{item.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------

export default function MeasureDetail({
  measure,
  prev,
  next,
  vote,
}: {
  measure: Measure;
  prev: Neighbor;
  next: Neighbor;
  vote: VoteFacts;
}) {
  const reduce = useReducedMotion();
  // Entrance choreography is opt-in AFTER hydration has proven itself (spec
  // hard rule: no animation is load-bearing). When false, every motion
  // element below renders directly in its final state.
  const animate = usePaperEntrance();
  const heroRef = useRef<HTMLElement>(null);
  // Show the sticky bar once the hero has scrolled past the top.
  const heroInView = useInView(heroRef, { margin: '-72px 0px 0px 0px' });
  const showBar = !heroInView;
  const { scrollYProgress } = useScroll();

  const { accent } = measure;
  const swatch = accent.swatch;
  const inks = accentInk(accent.name);
  const fieldInk = inks.textOnField;
  const fieldShade = darken(swatch, 0.35);
  const fieldHairline = withAlpha(fieldInk, 0.3);

  const showCounter = measure.bigStat.display === '';
  const showTimeline = TIMELINE_SLUGS.has(measure.slug) && measure.timeline.length > 0;
  const hasExamples = measure.realExamples.length > 0;
  const isSupermajority = measure.voteThreshold !== 'Simple majority';

  // Collect the optional viz payloads in an array so the presence check does
  // not progressively narrow `measure` down to `never` across a long || chain.
  const vizFlags = [
    measure.financingLadder,
    measure.cipBreakdown,
    measure.srfNote,
    measure.bondHistory,
    measure.completedProjects,
    measure.civicProjects,
    measure.ccedRevenue,
    measure.ccedProjects,
    measure.ccedDistrict,
  ];
  const hasViz = measure.srfApplications.length > 0 || vizFlags.some(Boolean);
  const Signature = SIGNATURES[measure.slug];

  const narrative = [
    { kicker: 'The problem', body: measure.narrative.problem },
    { kicker: 'What it does', body: measure.narrative.whatItDoes },
    { kicker: 'Why it matters', body: measure.narrative.whyItMatters },
    { kicker: 'What your YES does', body: measure.narrative.whatYourYesDoes },
  ];
  // One pull-stat floats in the story's left column (from constants).
  const pullStat = pullStatFor(measure);
  // The docket always reads forward in time regardless of constants order.
  const timelineEntries = sortTimeline(measure.timeline);

  const officialParagraphs = measure.officialQuestion.text.split('\n\n');
  const faqItems = measure.faqs.map((f) => ({ question: f.q, answer: f.a }));

  const dateFacts = [
    { label: 'Register', value: 'Before voting' },
    { label: 'Early voting', value: vote.earlyVotingDate },
    { label: 'Election Day', value: vote.electionDate },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden bg-paper">
      {/* ================================================================= */}
      {/* STICKY MEASURE BAR                                                 */}
      {/* ================================================================= */}
      <motion.div
        initial={false}
        animate={{ y: showBar ? 0 : -72, opacity: showBar ? 1 : 0 }}
        transition={{ duration: reduce ? 0 : 0.35, ease: PAPER_EASE }}
        className={cn(
          // Sits directly below the fixed AugustNav (h-16 / md:h-20) and stays
          // beneath it in the stack (nav is z-[60]).
          'fixed inset-x-0 top-16 z-40 border-b border-hairline bg-paper md:top-20',
          showBar ? 'pointer-events-auto' : 'pointer-events-none'
        )}
      >
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-ink-soft transition-colors hover:text-coral-press"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="hidden sm:inline">All five</span>
          </Link>

          <span className="flex min-w-0 items-center gap-2.5 text-sm font-bold text-ink sm:text-base">
            <span className="h-2.5 w-2.5 shrink-0" style={{ backgroundColor: swatch }} aria-hidden="true" />
            <span className="truncate">{measure.name}</span>
          </span>

          <Link
            href="/vote"
            style={{ backgroundColor: swatch, color: fieldInk }}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-[3px] px-4 py-2 text-sm font-bold transition-transform hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
          >
            <span className="hidden sm:inline">Vote YES</span>
            <span className="sm:hidden">YES</span>
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        {/* Scroll progress rule, accent colored */}
        <motion.div
          aria-hidden="true"
          className="h-[3px] origin-left"
          style={{ scaleX: scrollYProgress, backgroundColor: swatch }}
        />
      </motion.div>

      {/* ================================================================= */}
      {/* POSTER HERO (flat accent field, one orchestrated load)            */}
      {/* ================================================================= */}
      <section ref={heroRef} className="relative overflow-hidden" style={{ backgroundColor: swatch }}>
        <div className="noise-overlay pointer-events-none absolute inset-0" aria-hidden="true" />

        <motion.div
          variants={staggerContainer(0.09)}
          initial={animate ? 'hidden' : false}
          animate="show"
          className="relative z-10 mx-auto max-w-6xl px-4 pb-10 pt-24 sm:px-6 sm:pb-12 sm:pt-28 lg:px-8"
        >
          <div className="grid items-end gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-7">
              <motion.div variants={riseVariants}>
                <KickerRule
                  label={`${measure.officialQuestion.number} · August 4, 2026 · ${measure.name}`}
                  bar={fieldInk}
                  ink={fieldInk}
                />
              </motion.div>

              <motion.h1
                variants={riseVariants}
                className="type-display mt-6"
                style={{ color: fieldInk }}
              >
                {measure.cardPunch}
              </motion.h1>

              <motion.p
                variants={riseVariants}
                className="type-lede mt-5 max-w-2xl"
                style={{ color: fieldInk }}
              >
                {measure.cardSub}
              </motion.p>

              {/* Meta line: plain small-caps in the field ink, middle dots,
                  no boxes. The costChip's single boxed moment is the stamp. */}
              <motion.p
                variants={riseVariants}
                className="mt-6 max-w-2xl text-[0.8125rem] font-bold uppercase leading-relaxed tracking-[0.16em]"
                style={{ color: fieldInk }}
              >
                {measure.costChip} · {measure.voteThreshold} · {measure.ordinance}
              </motion.p>

              <motion.div variants={riseVariants} className="mt-8 flex flex-wrap items-center gap-3">
                <PaperButton variant="paper" href="/vote">
                  {measure.yesCta}
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </PaperButton>
                <a
                  href="#official"
                  className="inline-flex items-center justify-center gap-2 rounded-[3px] border-2 px-7 py-3.5 text-base font-bold transition-opacity hover:opacity-80 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
                  style={{ borderColor: fieldInk, color: fieldInk }}
                >
                  Read the official question
                </a>
              </motion.div>
            </div>

            {/* Big figure column, bottom-aligned */}
            <div className="lg:col-span-5 lg:text-right">
              <motion.div variants={riseVariants}>
                <div className="type-figure" style={{ color: fieldInk }}>
                  {showCounter ? (
                    <PrintedCounter
                      end={measure.bigStat.target}
                      prefix={measure.bigStat.prefix}
                      suffix={measure.bigStat.suffix}
                      decimals={measure.bigStat.decimals}
                    />
                  ) : (
                    measure.bigStat.display
                  )}
                </div>
                <div className="type-doc-label-lg mt-3" style={{ color: fieldInk }}>
                  {measure.bigStat.label}
                </div>
              </motion.div>

              {/* costChip stamp pressed on a filing label; lands last, inside
                  the ~1.4s load budget */}
              <motion.div
                initial={animate ? { opacity: 0, scale: 1.06, rotate: 0 } : false}
                animate={{ opacity: 1, scale: 1, rotate: -2 }}
                transition={{ duration: 0.35, ease: PAPER_EASE, delay: animate ? 0.65 : 0 }}
                className="mt-6 inline-block bg-sheet px-2.5 py-2 shadow-print"
              >
                <Stamp size="md" rotate={0}>
                  {measure.costChip}
                </Stamp>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Per-measure abstract rule motif along the bottom edge */}
        <div className="relative z-10 mx-auto max-w-6xl px-4 pb-6 sm:px-6 lg:px-8">
          <HeroMotif slug={measure.slug} shade={fieldShade} />
        </div>
      </section>

      {/* ================================================================= */}
      {/* KEY NUMBERS LEDGER (hero stats, open ruled grid)                   */}
      {/* ================================================================= */}
      <section className="bg-paper py-10 sm:py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="rule-heavy" aria-hidden="true" />
          <div className="grid grid-cols-2 lg:grid-cols-4">
            {measure.heroStats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={animate ? { opacity: 0, y: 14 } : false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={VIEWPORT_REVEAL}
                transition={{ duration: 0.5, ease: PAPER_EASE, delay: animate ? ledgerDelay(i, 0.07) : 0 }}
                className={cn(
                  'border-hairline px-4 py-5 sm:px-6 sm:py-6',
                  i % 2 === 1 && 'border-l',
                  i === 2 && 'lg:border-l',
                  i >= 2 && 'border-t lg:border-t-0'
                )}
              >
                <div className="text-3xl font-extrabold leading-none text-ink tabular-nums sm:text-4xl">
                  {stat.value}
                </div>
                <div className="type-fine mt-2.5">{noOrphan(stat.label)}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* OFFICIAL QUESTION (the ballot clipping)                            */}
      {/* ================================================================= */}
      <section id="official" className="scroll-mt-32 bg-paper py-10 sm:py-14 md:scroll-mt-36">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={animate ? { opacity: 0, y: 16 } : false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT_REVEAL}
            transition={{ duration: 0.5, ease: PAPER_EASE }}
          >
            <KickerRule label="On your ballot" bar={swatch} />
            <h2 className="type-h2 mt-4 text-ink">The official ballot language</h2>
          </motion.div>

          <motion.div
            initial={animate ? { opacity: 0, y: 18 } : false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT_REVEAL}
            transition={{ duration: 0.55, ease: PAPER_EASE, delay: animate ? 0.08 : 0 }}
            className="mt-9"
          >
            <Sheet as="figure" shadow="offset" perforated className="m-0 px-6 pb-7 pt-2 sm:px-10 sm:pb-9">
              <header className="pt-5 text-center">
                <p className="type-doc-label-lg text-ink">Official Ballot (Sample)</p>
                <p className="type-fine mt-1.5">
                  Issues Only · Kansas City Election Board · August 4, 2026
                </p>
                <div className="rule-total mt-4" aria-hidden="true" />
              </header>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <span
                  className="type-doc-label inline-block px-3 pb-1 pt-[0.35rem] leading-none"
                  style={{ backgroundColor: swatch, color: fieldInk }}
                >
                  {measure.officialQuestion.number}
                </span>
                <span className="type-fine">{measure.ordinance}</span>
              </div>

              <blockquote className="mt-5 space-y-4">
                {officialParagraphs.map((para, i) => (
                  <p key={i} className="text-[0.9375rem] font-medium leading-relaxed text-ink sm:text-base">
                    {para}
                  </p>
                ))}
              </blockquote>

              <div className="rule-hair mt-7 pt-6">
                <div className="flex flex-wrap items-center gap-x-10 gap-y-4">
                  <div className="flex items-center gap-3">
                    <BallotOval
                      filled
                      fill="#e53935"
                      size="md"
                      animate={animate ? 'inview' : 'none'}
                      title="YES oval, filled in"
                    />
                    <span className="font-extrabold tracking-[0.08em] text-ink">YES</span>
                    <span className="type-fine" style={{ color: 'var(--coral-press)' }}>
                      our recommendation
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <BallotOval filled={false} title="NO oval, left empty" />
                    <span className="font-bold tracking-[0.08em] text-ink-soft">NO</span>
                  </div>
                </div>
              </div>

              <figcaption className="type-fine mt-7">
                Verbatim from the Kansas City Election Board sample ballot (Issues Only). Always confirm
                the final wording and official question order on your authenticated sample ballot.
              </figcaption>
            </Sheet>
          </motion.div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* THE STORY (problem / what it does / why it matters / your YES)     */}
      {/* ================================================================= */}
      <section className="bg-paper py-10 sm:py-14">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={animate ? { opacity: 0, y: 16 } : false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT_REVEAL}
            transition={{ duration: 0.55, ease: PAPER_EASE }}
            className="type-h2 mb-10 text-ink sm:mb-14"
          >
            {measure.title}
          </motion.h2>

          <div>
            {narrative.map((block, i) => (
              <motion.div
                key={block.kicker}
                initial={animate ? { opacity: 0, y: 20 } : false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={VIEWPORT_REVEAL}
                transition={{ duration: 0.55, ease: PAPER_EASE }}
                className={cn(
                  'grid gap-4 py-8 sm:py-10 md:grid-cols-[200px_1fr] md:gap-10',
                  i === 0 ? 'pt-0' : 'rule-hair'
                )}
              >
                <div className="space-y-6 md:pt-1.5">
                  <KickerRule label={block.kicker} bar={swatch} />
                  {i === 2 && pullStat && (
                    <div className="hidden md:block">
                      <div
                        className="text-4xl font-extrabold leading-none tabular-nums"
                        style={{ color: inks.inkOnPaper }}
                      >
                        {pullStat.value}
                      </div>
                      <p className="type-fine mt-2">{pullStat.label}</p>
                    </div>
                  )}
                </div>
                <p className={cn(i === 0 ? 'type-lede text-ink' : 'type-body text-ink/80', 'max-w-prose')}>
                  {block.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* KEY FACTS (two-column ruled list)                                  */}
      {/* ================================================================= */}
      <section className="bg-paper py-10 sm:py-14">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={animate ? { opacity: 0, y: 16 } : false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT_REVEAL}
            transition={{ duration: 0.5, ease: PAPER_EASE }}
          >
            <KickerRule label="The details" bar={swatch} />
            <h2 className="type-h2 mt-4 text-ink">Key facts</h2>
          </motion.div>

          <ul className="mt-8 grid gap-x-12 sm:grid-cols-2">
            {measure.keyFacts.map((fact, i) => (
              <motion.li
                key={i}
                initial={animate ? { opacity: 0, y: 10 } : false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={VIEWPORT_REVEAL}
                transition={{ duration: 0.4, ease: PAPER_EASE, delay: animate ? ledgerDelay(i, 0.04) : 0 }}
                className={cn(
                  'flex items-start gap-3 border-t border-hairline py-3.5',
                  i === 0 && 'border-t-0',
                  i === 1 && 'sm:border-t-0'
                )}
              >
                <span
                  aria-hidden="true"
                  className="mt-[0.45rem] h-2 w-2 shrink-0"
                  style={{ backgroundColor: swatch }}
                />
                <span className="text-sm leading-relaxed text-ink/85 sm:text-[0.9375rem]">{fact}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </section>

      {/* ================================================================= */}
      {/* SIGNATURE SECTION (per-measure artifact, data-gated)               */}
      {/* ================================================================= */}
      {Signature && hasViz && (
        <section className="bg-paper py-10 sm:py-14">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <Signature measure={measure} accent={inks} />
          </div>
        </section>
      )}

      {/* ================================================================= */}
      {/* ON THE GROUND (real examples, only when present)                   */}
      {/* ================================================================= */}
      {hasExamples && (
        <section className="bg-paper py-10 sm:py-14">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={animate ? { opacity: 0, y: 16 } : false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT_REVEAL}
              transition={{ duration: 0.5, ease: PAPER_EASE }}
            >
              <KickerRule label="On the ground" bar={swatch} />
              <h2 className="type-h2 mt-4 text-ink">What it is already doing</h2>
            </motion.div>

            <ul className="mt-8">
              {measure.realExamples.map((ex, i) => (
                <motion.li
                  key={i}
                  initial={animate ? { opacity: 0, y: 10 } : false}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={VIEWPORT_REVEAL}
                  transition={{ duration: 0.4, ease: PAPER_EASE, delay: animate ? ledgerDelay(i, 0.06) : 0 }}
                  className="rule-hair flex items-start gap-3 py-4 first:border-t-0 first:pt-0"
                >
                  <span
                    aria-hidden="true"
                    className="mt-[0.45rem] h-2 w-2 shrink-0"
                    style={{ backgroundColor: swatch }}
                  />
                  <span className="text-sm leading-relaxed text-ink/85 sm:text-base">{ex}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ================================================================= */}
      {/* THE RECORD (ruled docket, only where a dated record exists)        */}
      {/* ================================================================= */}
      {showTimeline && (
        <section className="bg-paper-deep py-12 sm:py-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={animate ? { opacity: 0, y: 16 } : false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT_REVEAL}
              transition={{ duration: 0.5, ease: PAPER_EASE }}
            >
              <KickerRule label="How we got here" bar={swatch} />
              <h2 className="type-h2 mt-4 text-ink">The record</h2>
            </motion.div>

            <ol className="mt-9">
              {timelineEntries.map((item, i) => (
                <motion.li
                  key={`${item.date}-${i}`}
                  initial={animate ? { opacity: 0, y: 12 } : false}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={VIEWPORT_REVEAL}
                  transition={{ duration: 0.45, ease: PAPER_EASE, delay: animate ? ledgerDelay(i, 0.06) : 0 }}
                  className="rule-hair grid grid-cols-[6.5rem_1fr] gap-4 py-4 first:border-t-0 first:pt-0 sm:grid-cols-[9rem_1fr] sm:gap-6"
                >
                  <span
                    className="pt-0.5 text-sm font-extrabold uppercase tracking-wide tabular-nums"
                    style={{ color: inks.inkOnPaper }}
                  >
                    {item.date}
                  </span>
                  <p className="text-sm leading-relaxed text-ink/85 sm:text-base">{item.label}</p>
                </motion.li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* ================================================================= */}
      {/* THE HONEST PART (navy band)                                        */}
      {/* ================================================================= */}
      <section className="relative overflow-hidden bg-navy py-14 sm:py-20">
        <div className="noise-overlay pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={animate ? { opacity: 0, y: 16 } : false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT_REVEAL}
            transition={{ duration: 0.55, ease: PAPER_EASE }}
          >
            <KickerRule label="The honest part" bar="#e53935" ink="#f4efe4" />
            <h2 className="type-h2 mt-4 text-paper">Read the fine print. We printed it big.</h2>

            <div className="mt-6 flex flex-wrap gap-2.5">
              <span className="type-doc-label inline-flex items-center border border-paper/40 px-3 py-1.5 text-paper">
                {measure.costChip}
              </span>
              <span className="type-doc-label inline-flex items-center border border-paper/40 px-3 py-1.5 text-paper">
                {measure.voteThreshold} to pass
              </span>
            </div>
          </motion.div>

          <motion.p
            initial={animate ? { opacity: 0, y: 16 } : false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT_REVEAL}
            transition={{ duration: 0.55, ease: PAPER_EASE, delay: animate ? 0.08 : 0 }}
            className="type-lede mt-9 text-paper"
          >
            {measure.honestCost}
          </motion.p>

          <motion.div
            initial={animate ? { opacity: 0, y: 16 } : false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT_REVEAL}
            transition={{ duration: 0.55, ease: PAPER_EASE, delay: animate ? 0.14 : 0 }}
            className="mt-9 border-t pt-7"
            style={{ borderColor: 'rgba(244, 239, 228, 0.25)' }}
          >
            <p className="type-doc-label-lg text-paper/60">How the financing works</p>
            <p className="mt-3 max-w-prose text-[0.9375rem] leading-relaxed text-paper/85 sm:text-base">
              {measure.mechanism}
            </p>
          </motion.div>

          {isSupermajority && (
            <motion.div
              initial={animate ? { opacity: 0, y: 16 } : false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT_REVEAL}
              transition={{ duration: 0.55, ease: PAPER_EASE, delay: animate ? 0.2 : 0 }}
              className="mt-9 grid items-center gap-4 border-l-[3px] py-1 pl-5 sm:grid-cols-[auto_1fr] sm:gap-7 sm:pl-7"
              style={{ borderColor: swatch }}
            >
              <div className="text-5xl font-extrabold leading-none text-paper tabular-nums sm:text-6xl">
                4/7
              </div>
              <p className="max-w-prose text-sm leading-relaxed text-paper/85 sm:text-base">
                As a general obligation bond, this question needs a four-sevenths supermajority
                (about 57.1 percent), not a simple majority. Turnout and margin both matter.
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* ================================================================= */}
      {/* MEASURE FAQ (ruled accordion)                                      */}
      {/* ================================================================= */}
      <section className="bg-paper py-10 sm:py-14">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={animate ? { opacity: 0, y: 16 } : false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT_REVEAL}
            transition={{ duration: 0.5, ease: PAPER_EASE }}
            className="mb-9 sm:mb-11"
          >
            <KickerRule label="Questions and answers" bar={swatch} />
            <h2 className="type-h2 mt-4 text-ink">{measure.name}, answered</h2>
          </motion.div>
          <RuledFaq items={faqItems} accentColor={inks.inkOnPaper} />
        </div>
      </section>

      {/* ================================================================= */}
      {/* SOURCES (numbered ruled citations)                                 */}
      {/* ================================================================= */}
      <section className="bg-paper-deep py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={animate ? { opacity: 0, y: 16 } : false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT_REVEAL}
            transition={{ duration: 0.5, ease: PAPER_EASE }}
          >
            <KickerRule label="Where this comes from" bar={swatch} />
            <h2 className="type-h2 mt-4 text-ink">Sources</h2>
          </motion.div>

          <ol className="mt-8">
            {measure.sources.map((src, i) => (
              <li
                key={i}
                className="rule-hair grid grid-cols-[2rem_1fr] gap-3 py-3 first:border-t-0 first:pt-0"
              >
                <span
                  className="pt-0.5 text-sm font-extrabold tabular-nums"
                  style={{ color: inks.inkOnPaper }}
                >
                  {i + 1}
                </span>
                <a
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm leading-relaxed text-ink underline decoration-2 underline-offset-[3px] transition-colors hover:text-coral-press sm:text-base"
                >
                  {src.title}
                </a>
              </li>
            ))}
          </ol>

          {measure.relatedLinks.length > 0 && (
            <div className="mt-9 flex flex-wrap gap-2.5">
              {measure.relatedLinks.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-[3px] border-2 border-ink px-4 py-2 text-sm font-bold text-ink transition-colors hover:bg-ink hover:text-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
                >
                  {link.label}
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              ))}
            </div>
          )}

          <p className="type-fine mt-8">
            Always confirm the final wording and official question order on your authenticated sample
            ballot from the Kansas City Election Board.
          </p>
        </div>
      </section>

      {/* ================================================================= */}
      {/* PREV / NEXT MEASURE NAV (ruled strips)                             */}
      {/* ================================================================= */}
      <section className="bg-paper py-10 sm:py-14">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-5 sm:grid-cols-2 sm:gap-6">
            <Link
              href={`/questions/${prev.slug}`}
              className="group border-l-[3px] py-2 pl-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
              style={{ borderColor: prev.swatch }}
            >
              <span className="type-doc-label flex items-center gap-2 text-ink-soft">
                <svg
                  className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1 motion-reduce:transition-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous question
              </span>
              <span className="mt-2 block text-lg font-extrabold text-ink transition-colors group-hover:text-coral-press sm:text-xl">
                {prev.name}
              </span>
            </Link>

            <Link
              href={`/questions/${next.slug}`}
              className="group border-l-[3px] py-2 pl-5 sm:border-l-0 sm:border-r-[3px] sm:pl-0 sm:pr-5 sm:text-right focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
              style={{ borderColor: next.swatch }}
            >
              <span className="type-doc-label flex items-center gap-2 text-ink-soft sm:justify-end">
                Next question
                <svg
                  className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
              <span className="mt-2 block text-lg font-extrabold text-ink transition-colors group-hover:text-coral-press sm:text-xl">
                {next.name}
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* CTA BAND (flat accent field)                                       */}
      {/* ================================================================= */}
      <section className="relative overflow-hidden" style={{ backgroundColor: swatch }}>
        <div className="noise-overlay pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="relative z-10 mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <motion.h2
            initial={animate ? { opacity: 0, y: 18 } : false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT_REVEAL}
            transition={{ duration: 0.6, ease: PAPER_EASE }}
            className="type-display max-w-3xl"
            style={{ color: fieldInk }}
          >
            {measure.yesCta}
          </motion.h2>

          <motion.p
            initial={animate ? { opacity: 0, y: 16 } : false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT_REVEAL}
            transition={{ duration: 0.55, ease: PAPER_EASE, delay: animate ? 0.08 : 0 }}
            className="type-lede mt-5 max-w-2xl"
            style={{ color: fieldInk }}
          >
            Vote on or before {vote.electionDate}. Polls are open {vote.pollsOpen}.
          </motion.p>

          <motion.div
            initial={animate ? { opacity: 0, y: 16 } : false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT_REVEAL}
            transition={{ duration: 0.55, ease: PAPER_EASE, delay: animate ? 0.14 : 0 }}
            className="mt-8"
          >
            <PaperButton variant="paper" href="/vote">
              Find your polling place
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </PaperButton>
          </motion.div>

          {/* The three date facts as one ruled ledger row */}
          <motion.div
            initial={animate ? { opacity: 0, y: 16 } : false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT_REVEAL}
            transition={{ duration: 0.55, ease: PAPER_EASE, delay: animate ? 0.2 : 0 }}
            className="mt-12 border-t-[3px]"
            style={{ borderColor: fieldInk }}
          >
            <div className="grid sm:grid-cols-3">
              {dateFacts.map((fact, i) => (
                <div
                  key={fact.label}
                  className={cn('py-4 sm:py-5', i > 0 && 'border-t sm:border-l sm:border-t-0 sm:pl-6')}
                  style={i > 0 ? { borderColor: fieldHairline } : undefined}
                >
                  <p className="type-doc-label" style={{ color: fieldInk, opacity: 0.78 }}>
                    {fact.label}
                  </p>
                  <p className="mt-1.5 text-lg font-extrabold tabular-nums" style={{ color: fieldInk }}>
                    {fact.value}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="mt-10">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm font-bold underline decoration-2 underline-offset-[3px] transition-opacity hover:opacity-80 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2"
              style={{ color: fieldInk }}
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to all five questions
            </Link>
          </div>
        </div>
      </section>

      <AugustFooter />
    </div>
  );
}
