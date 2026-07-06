'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion, type Variants } from 'framer-motion';
import { cn } from '@/lib/utils';
import { AUGUST_BALLOT } from '@/lib/constants';
import { NAVY, PAPER, accentInk } from '@/components/august/accent';
import {
  AugustFooter,
  KickerRule,
  LedgerRow,
  PaperButton,
  PAPER_EASE,
  VIEWPORT_ONCE,
  riseVariants,
  ruleDrawVariants,
  staggerContainer,
  useRevealFailsafe,
} from '@/components/august/paper';
import BallotSheet from '@/components/august/BallotSheet';
import BriefStrip from '@/components/august/BriefStrip';

const { hero, measures, questionsSection, costsShort, voteSteps, howToVote, faqsSection, faqs, closing, exploreLinks } =
  AUGUST_BALLOT;

// Short FAQ on the hub stays to the three top-level questions; the deep,
// per-measure answers live on each detail page. Selected by exact question text
// so it stays in sync with the source of truth in constants.ts.
const HUB_FAQ_QUESTIONS = [
  'Will voting YES raise my taxes?',
  'What is on the August 4, 2026 ballot?',
  'When and where do I vote?',
];
const shortFaqs = faqs.filter((f) => HUB_FAQ_QUESTIONS.includes(f.question));

// Render everything in official ballot order (Question 1 to 5). The source
// measures array keeps its own order for detail-page prev/next, so we sort a
// copy here for display only.
const ballotOrderNum = (m: (typeof measures)[number]) =>
  parseInt(m.officialQuestion.number.replace(/\D/g, ''), 10);
const cardMeasures = [...measures].sort((a, b) => ballotOrderNum(a) - ballotOrderNum(b));

// ===========================================================================
// Derived figures. Every number below is read or computed from AUGUST_BALLOT.
// ===========================================================================

// Hero ledger figures from hero.hook ($1.7B invested / $0 new tax rates).
const heroInvested = `${hero.hook[0].prefix}${hero.hook[0].target}${hero.hook[0].suffix}`;
const heroZero = hero.hook[1].display;

// The four bond questions (the ones with dollar amounts); Central City is a
// rate renewal and carries no new authorization. Ledger bars run largest
// first, widths relative to the largest authorization.
const bondRows = cardMeasures
  .filter((m) => m.amount.startsWith('$'))
  .map((m) => ({
    label: `${m.name} (${m.officialQuestion.number})`,
    value: Number(m.amount.replace(/[^0-9]/g, '')),
  }))
  .sort((a, b) => b.value - a.value);
const bondTotal = bondRows.reduce((sum, r) => sum + r.value, 0);
const maxBond = bondRows[0]?.value ?? 1;
const formatM = (v: number) => `$${Math.round(v / 1_000_000)}M`;

// The Honest Part: costsShort copy tightened to tax RATE language per the
// design spec ($0 always means the rate, never the bills).
const honestFigure = `${costsShort.big}.00`;
const honestSub = costsShort.sub.replace('taxes', 'tax rates');
const honestHeadline = costsShort.headline.replace('new taxes', 'new tax rates');

// Three mechanism entries pairing measure names with the costsShort chips.
const nameOf = (slug: string) => measures.find((m) => m.slug === slug)?.name ?? '';
const honestRows = [
  { label: `${nameOf('clean-water')} and ${nameOf('sewers')}`, sub: costsShort.chips[0] },
  { label: `${nameOf('housing')} and ${nameOf('civic-buildings')}`, sub: costsShort.chips[1] },
  { label: nameOf('central-city'), sub: costsShort.chips[2] },
];

// ===========================================================================
// Hero oval choreography: the coral ink fill sweeps in, the YES flips to
// paper ink with it, then the check draws. Reduced motion renders final.
// ===========================================================================
const ovalFillVariants: Variants = {
  hidden: { scaleX: 0, opacity: 0 },
  show: { scaleX: 1, opacity: 1, transition: { duration: 0.45, ease: PAPER_EASE, delay: 0.25 } },
};
const yesInkVariants: Variants = {
  hidden: { color: NAVY },
  show: { color: PAPER, transition: { duration: 0.3, ease: PAPER_EASE, delay: 0.35 } },
};
const checkDrawVariants: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  show: { pathLength: 1, opacity: 1, transition: { duration: 0.4, ease: PAPER_EASE, delay: 0.62 } },
};
const barGrowVariants: Variants = {
  hidden: { scaleX: 0 },
  show: { scaleX: 1, transition: { duration: 0.7, ease: PAPER_EASE, delay: 0.15 } },
};

// Dotted leader recolored for the navy band (the shared .leader utility dots
// are navy and would vanish on ink).
const paperLeaderStyle = {
  backgroundImage: 'linear-gradient(90deg, rgba(244, 239, 228, 0.45) 1px, transparent 1px)',
  backgroundSize: '5px 1px',
  backgroundRepeat: 'repeat-x',
} as const;

// Paper-ink double rule for closing the navy band (the shared .rule-total is
// navy on navy).
const paperRuleTotalStyle = {
  backgroundImage: `linear-gradient(${PAPER}, ${PAPER}), linear-gradient(${PAPER}, ${PAPER})`,
  backgroundSize: '100% 1px, 100% 1px',
  backgroundPosition: 'top, bottom',
  backgroundRepeat: 'no-repeat',
  opacity: 0.8,
} as const;

// ---------------------------------------------------------------------------
// Ruled FAQ: hairline dividers, no cards, plus glyph rotating to an x.
// ---------------------------------------------------------------------------
function RuledFaq({ items }: { items: readonly { question: string; answer: string }[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const reduce = useReducedMotion();

  return (
    <div className="rule-heavy">
      {items.map((item, i) => {
        const open = openIndex === i;
        const panelId = `hub-faq-panel-${i}`;
        return (
          <div key={item.question} className={cn(i > 0 && 'rule-hair')}>
            <h3>
              <button
                type="button"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpenIndex(open ? null : i)}
                className="flex w-full items-center justify-between gap-5 py-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
              >
                <span className="text-base font-bold text-ink sm:text-lg">{item.question}</span>
                <motion.span
                  aria-hidden="true"
                  animate={reduce ? undefined : { rotate: open ? 45 : 0 }}
                  transition={{ duration: 0.25, ease: PAPER_EASE }}
                  className="shrink-0 text-2xl font-medium leading-none text-coral-press"
                  style={reduce && open ? { transform: 'rotate(45deg)' } : undefined}
                >
                  +
                </motion.span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  id={panelId}
                  initial={reduce ? false : { height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={reduce ? undefined : { height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: PAPER_EASE }}
                  className="overflow-hidden"
                >
                  <p className="type-body max-w-[42rem] pb-6 text-ink/80">{item.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

// ===========================================================================
export default function AugustBallotPage() {
  const reduce = useReducedMotion();
  // No animation is load-bearing: after the load choreography window every
  // whileInView orchestrator below also receives animate={failsafe}, so the
  // whole document settles to its printed state even if IntersectionObserver
  // never fires (full-page captures, embeds, odd browsers).
  const failsafe = useRevealFailsafe();

  return (
    <div className="min-h-screen overflow-x-hidden bg-paper text-ink">
      {/* ================================================================= */}
      {/* HERO: the front page of the voter's dossier                        */}
      {/* ================================================================= */}
      <section className="px-4 pb-12 pt-24 sm:px-6 sm:pb-14 sm:pt-32 lg:px-8">
        <motion.div
          className="mx-auto max-w-6xl"
          initial={reduce ? false : 'hidden'}
          animate="show"
          variants={staggerContainer(0.09, 0.05)}
        >
          {/* Document header line between hairline rules */}
          <motion.div variants={ruleDrawVariants} aria-hidden="true" className="rule-hair origin-left" />
          <motion.p variants={riseVariants} className="type-doc-label py-2.5 text-ink-soft">
            City of Kansas City, Missouri &middot; Special Election &middot; Tuesday, August 4, 2026
          </motion.p>
          <motion.div variants={ruleDrawVariants} aria-hidden="true" className="rule-hair origin-left" />

          {/* Headline: YES inside the giant ballot oval */}
          <motion.h1 variants={riseVariants} className="type-display-xl mt-10 text-ink sm:mt-14">
            Vote{' '}
            <span className="relative inline-flex items-center whitespace-nowrap rounded-full border-[4px] border-ink px-[0.26em] align-[-0.04em] sm:border-[6px]">
              <motion.span
                aria-hidden="true"
                variants={ovalFillVariants}
                className="absolute inset-0 origin-left rounded-full bg-coral"
              />
              <motion.span variants={yesInkVariants} className="relative">
                YES
              </motion.span>
              <svg
                className="relative ml-[0.12em] h-[0.52em] w-[0.5em]"
                viewBox="0 0 44 34"
                fill="none"
                aria-hidden="true"
              >
                <motion.path
                  variants={checkDrawVariants}
                  d="M6 18l12 11L38 5"
                  stroke={PAPER}
                  strokeWidth={6}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            {/* Block second line: the oval's border needs breathing room that
                the 0.92 display leading alone does not give it. */}
            <span className="mt-[0.08em] block">on all five.</span>
          </motion.h1>

          <div className="lg:grid lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-8">
              <motion.p variants={riseVariants} className="type-lede mt-7 max-w-[42rem] text-ink/80">
                {hero.subhead}
              </motion.p>

              {/* The two hero ledger lines (mobile; desktop carries the rail instead) */}
              <motion.div variants={riseVariants} className="mt-9 max-w-md space-y-3 lg:hidden">
                <LedgerRow size="lg" label="Invested back into Kansas City" figure={heroInvested} />
                <LedgerRow size="lg" label="New tax rates" figure={heroZero} />
              </motion.div>

              <motion.div variants={riseVariants} className="mt-9 flex flex-wrap items-center gap-4">
                <PaperButton href="#questions">See the five questions</PaperButton>
                <PaperButton href="#vote" variant="secondary">
                  How to vote
                </PaperButton>
              </motion.div>

              <motion.p variants={riseVariants} className="type-fine mt-7 max-w-[42rem]">
                The August 4 ballot includes other races beyond these five questions. Read your whole
                ballot.
              </motion.p>
            </div>

            {/* By the numbers rail (desktop): fills the front page's right column */}
            <motion.aside
              variants={riseVariants}
              className="hidden lg:col-span-4 lg:mt-4 lg:block"
              aria-label="The August 4 ballot by the numbers"
            >
              <div className="rule-heavy" />
              <p className="type-doc-label pt-3 text-ink-soft">By the numbers</p>
              <dl>
                {[
                  { figure: heroInvested, label: 'invested back into Kansas City' },
                  { figure: heroZero, label: 'new tax rates' },
                  { figure: '5', label: 'questions on the Kansas City portion of the ballot' },
                ].map((entry) => (
                  <div key={entry.label} className="rule-hair py-5 first-of-type:border-t-0">
                    <dt className="sr-only">{entry.label}</dt>
                    <dd>
                      <span className="block text-5xl font-extrabold tracking-[-0.03em] text-ink tabular-nums">
                        {entry.figure}
                      </span>
                      <span className="type-fine mt-1.5 block">{entry.label}</span>
                    </dd>
                  </div>
                ))}
              </dl>
            </motion.aside>
          </div>

          {/* Hero base: the ruled index of the five questions */}
          <motion.div variants={ruleDrawVariants} aria-hidden="true" className="rule-heavy mt-12 origin-left sm:mt-16" />
          <nav aria-label="The five ballot questions">
            <motion.ul
              variants={staggerContainer(0.07)}
              className="scrollbar-none flex w-full max-w-full list-none items-center gap-x-8 overflow-x-auto py-4 lg:justify-between"
            >
              {cardMeasures.map((m) => (
                <motion.li key={m.slug} variants={riseVariants} className="shrink-0">
                  <Link
                    href={`/questions/${m.slug}`}
                    className="group flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
                  >
                    <span aria-hidden="true" className="h-3 w-3 shrink-0" style={{ backgroundColor: m.accent.swatch }} />
                    <span className="sr-only">{m.officialQuestion.number}:</span>
                    <span className="type-doc-label whitespace-nowrap text-ink decoration-2 underline-offset-[3px] group-hover:underline">
                      {m.name}
                    </span>
                  </Link>
                </motion.li>
              ))}
            </motion.ul>
          </nav>
          <motion.div variants={riseVariants} aria-hidden="true" className="relative">
            <div className="perforation" />
            <span className="type-doc-label absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap bg-paper px-3 text-ink-soft">
              below the fold
            </span>
          </motion.div>
        </motion.div>
      </section>

      {/* ================================================================= */}
      {/* THE SAMPLE BALLOT                                                  */}
      {/* ================================================================= */}
      <section id="questions" className="scroll-mt-24 px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={reduce ? false : 'hidden'}
            animate={failsafe}
            whileInView="show"
            viewport={VIEWPORT_ONCE}
            variants={staggerContainer(0.09)}
            className="mb-10 max-w-[44rem] sm:mb-14"
          >
            <motion.div variants={riseVariants}>
              <KickerRule label={questionsSection.eyebrow} />
            </motion.div>
            <motion.h2 variants={riseVariants} className="type-h2 mt-4 text-ink">
              {questionsSection.heading}
            </motion.h2>
            <motion.p variants={riseVariants} className="type-lede mt-4 text-ink/80">
              {questionsSection.sub}
            </motion.p>
          </motion.div>

          <BallotSheet measures={cardMeasures} />
        </div>
      </section>

      {/* ================================================================= */}
      {/* THE FIVE BRIEFS                                                    */}
      {/* ================================================================= */}
      <section className="bg-paper-deep px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={reduce ? false : 'hidden'}
            animate={failsafe}
            whileInView="show"
            viewport={VIEWPORT_ONCE}
            variants={riseVariants}
            className="mb-14"
          >
            <KickerRule label="The briefs, question by question" />
          </motion.div>

          <BriefStrip measures={cardMeasures} />
        </div>
      </section>

      {/* ================================================================= */}
      {/* THE HONEST PART (navy band)                                        */}
      {/* ================================================================= */}
      <section className="relative overflow-hidden bg-navy px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div aria-hidden="true" className="noise-overlay absolute inset-0" />
        <div className="relative mx-auto max-w-6xl">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-12">
            {/* Left: the $0.00 affidavit and the mechanism ledger */}
            <motion.div
              initial={reduce ? false : 'hidden'}
              animate={failsafe}
              whileInView="show"
              viewport={VIEWPORT_ONCE}
              variants={staggerContainer(0.09)}
              className="lg:col-span-7"
            >
              <motion.div variants={riseVariants}>
                <KickerRule label="The honest part" ink={PAPER} />
              </motion.div>
              <motion.p variants={riseVariants} className="type-figure mt-7 text-paper">
                {honestFigure}
              </motion.p>
              <motion.p variants={riseVariants} className="type-doc-label-lg mt-3 text-paper/70">
                {honestSub}
              </motion.p>
              <motion.div variants={ruleDrawVariants} aria-hidden="true" className="mt-6 h-[3px] w-24 origin-left bg-coral" />
              <motion.h2 variants={riseVariants} className="type-h2 mt-7 max-w-[36rem] text-paper">
                {honestHeadline}
              </motion.h2>

              <motion.div variants={riseVariants} className="mt-10 max-w-[36rem]">
                <p className="type-doc-label text-paper/70">Change to your tax rates</p>
                <div className="mt-3 border-t border-paper/25">
                  {honestRows.map((row) => (
                    <div key={row.label} className="flex items-end gap-2 border-b border-paper/15 py-4">
                      <span className="min-w-0 text-[0.9375rem] font-medium text-paper">
                        {row.label}
                        <span className="block text-[0.8125rem] font-normal leading-relaxed text-paper/70">
                          {row.sub}
                        </span>
                      </span>
                      <span aria-hidden="true" className="mb-[0.4em] h-px min-w-8 flex-1 self-end" style={paperLeaderStyle} />
                      <span className="shrink-0 whitespace-nowrap text-[1.0625rem] font-bold text-paper tabular-nums">
                        $0.00
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>

            {/* Right: where the bond money goes, as flat paper-ink ledger bars */}
            <motion.div
              initial={reduce ? false : 'hidden'}
              animate={failsafe}
              whileInView="show"
              viewport={VIEWPORT_ONCE}
              variants={staggerContainer(0.1)}
              className="lg:col-span-5 lg:pt-12"
            >
              <motion.h3 variants={riseVariants} className="text-lg font-bold text-paper">
                Where the ${(bondTotal / 1_000_000_000).toFixed(1)} billion goes
              </motion.h3>
              <ul className="mt-7 list-none space-y-6">
                {bondRows.map((row) => (
                  <motion.li key={row.label} variants={riseVariants}>
                    <div className="flex items-end gap-2">
                      <span className="min-w-0 text-[0.9375rem] font-medium text-paper">{row.label}</span>
                      <span aria-hidden="true" className="mb-[0.4em] h-px min-w-8 flex-1 self-end" style={paperLeaderStyle} />
                      <span className="shrink-0 whitespace-nowrap font-bold text-paper tabular-nums">
                        {formatM(row.value)}
                      </span>
                    </div>
                    <div className="mt-2 h-2.5 w-full bg-paper/15">
                      <motion.div
                        variants={barGrowVariants}
                        className="h-full origin-left bg-paper"
                        style={{ width: `${(row.value / maxBond) * 100}%` }}
                      />
                    </div>
                  </motion.li>
                ))}
              </ul>
              <motion.p variants={riseVariants} className="mt-7 text-[0.8125rem] leading-relaxed text-paper/70">
                The four bond questions total $1.7 billion. Question 3 (Central City) is a sales-tax
                renewal, not a bond, so it carries no new authorization.
              </motion.p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* MAKE YOUR PLAN                                                     */}
      {/* ================================================================= */}
      <section id="vote" className="scroll-mt-24 px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={reduce ? false : 'hidden'}
            animate={failsafe}
            whileInView="show"
            viewport={VIEWPORT_ONCE}
            variants={staggerContainer(0.09)}
            className="max-w-[44rem]"
          >
            <motion.div variants={riseVariants}>
              <KickerRule label={howToVote.eyebrow} />
            </motion.div>
            <motion.h2 variants={riseVariants} className="type-h2 mt-4 text-ink">
              {howToVote.heading}
            </motion.h2>
          </motion.div>

          {/* The ruled schedule: one heavy rule, three square nodes */}
          <motion.div
            initial={reduce ? false : 'hidden'}
            animate={failsafe}
            whileInView="show"
            viewport={VIEWPORT_ONCE}
            variants={staggerContainer(0.12)}
            className="relative mt-14 sm:mt-16"
          >
            <div
              aria-hidden="true"
              className="absolute bottom-1 left-0 top-1 w-[3px] bg-ink sm:inset-x-0 sm:bottom-auto sm:top-0 sm:h-[3px] sm:w-auto"
            />
            <ol className="grid list-none gap-10 pl-8 sm:grid-cols-3 sm:gap-8 sm:pl-0 sm:pt-9">
              {voteSteps.map((s, i) => {
                const isElectionDay = i === voteSteps.length - 1;
                return (
                  <motion.li key={s.date} variants={riseVariants} className="relative">
                    <span
                      aria-hidden="true"
                      className={cn(
                        'absolute -left-9 top-1 h-3 w-3 sm:-top-10 sm:left-0',
                        isElectionDay ? 'bg-coral' : 'bg-ink'
                      )}
                    />
                    <p className="text-3xl font-extrabold uppercase leading-none tracking-tight text-ink tabular-nums sm:text-4xl">
                      {s.date}
                    </p>
                    <p className="type-doc-label mt-3 text-ink-soft">{s.kicker}</p>
                    <p className="mt-1.5 text-base font-semibold text-ink">{s.title}</p>
                    {'sub' in s && s.sub ? <p className="type-fine mt-1">{s.sub}</p> : null}
                  </motion.li>
                );
              })}
            </ol>
          </motion.div>

          <motion.div
            initial={reduce ? false : 'hidden'}
            animate={failsafe}
            whileInView="show"
            viewport={VIEWPORT_ONCE}
            variants={riseVariants}
            className="mt-12 sm:mt-14"
          >
            <PaperButton href="/vote">Find your polling place</PaperButton>
            <p className="type-fine mt-5 max-w-xl">{howToVote.pollingNote}</p>
          </motion.div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* SHORT FAQ (deep answers live on each measure page)                 */}
      {/* ================================================================= */}
      <section id="faqs" className="scroll-mt-24 px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={reduce ? false : 'hidden'}
            animate={failsafe}
            whileInView="show"
            viewport={VIEWPORT_ONCE}
            variants={staggerContainer(0.09)}
            className="max-w-[44rem]"
          >
            <motion.div variants={riseVariants}>
              <KickerRule label={faqsSection.eyebrow} />
            </motion.div>
            <motion.h2 variants={riseVariants} className="type-h2 mt-4 text-ink">
              {faqsSection.heading}
            </motion.h2>
          </motion.div>

          <div className="mt-10 max-w-[46rem] sm:mt-12">
            <RuledFaq items={shortFaqs} />
          </div>

          <motion.div
            initial={reduce ? false : 'hidden'}
            animate={failsafe}
            whileInView="show"
            viewport={VIEWPORT_ONCE}
            variants={riseVariants}
            className="mt-10"
          >
            <Link
              href="#questions"
              className="inline-flex items-center gap-2 text-sm font-bold text-coral-press decoration-2 underline-offset-[3px] transition-colors hover:text-ink hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
            >
              See every measure in detail
              {/* Rightward arrow: forward-navigation grammar, matching the
                  briefs' "Read the full question" link (never an up caret). */}
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* CLOSING (navy band)                                                */}
      {/* ================================================================= */}
      <section className="relative overflow-hidden bg-navy px-4 pb-10 pt-20 sm:px-6 sm:pb-12 sm:pt-28 lg:px-8">
        <div aria-hidden="true" className="noise-overlay absolute inset-0" />
        <div className="relative mx-auto max-w-6xl">
          <motion.h2
            initial={reduce ? false : 'hidden'}
            animate={failsafe}
            whileInView="show"
            viewport={VIEWPORT_ONCE}
            variants={riseVariants}
            className="type-display max-w-5xl text-paper"
          >
            {closing.heading}
          </motion.h2>

          <motion.div
            initial={reduce ? false : 'hidden'}
            animate={failsafe}
            whileInView="show"
            viewport={VIEWPORT_ONCE}
            variants={riseVariants}
            className="mt-10"
          >
            <PaperButton href="/vote" variant="paper">
              {closing.cta}
            </PaperButton>
          </motion.div>

          <motion.div
            initial={reduce ? false : 'hidden'}
            animate={failsafe}
            whileInView="show"
            viewport={VIEWPORT_ONCE}
            variants={riseVariants}
            className="mt-16 sm:mt-20"
          >
            <p className="type-doc-label text-paper/70">Elsewhere from Together KC</p>
            <ul className="mt-4 flex list-none flex-wrap gap-x-8 gap-y-3">
              {exploreLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-semibold text-paper underline decoration-paper/40 decoration-2 underline-offset-[3px] transition-colors hover:decoration-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <div aria-hidden="true" className="mt-14 h-[5px] sm:mt-16" style={paperRuleTotalStyle} />
        </div>
      </section>

      {/* Text-only footer: the shared layout Footer carries the skyline
          lockup, which the spec bans on the August pages. */}
      <AugustFooter />
    </div>
  );
}
