'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useInView, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { AUGUST_BALLOT } from '@/lib/constants';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { TopicIcon } from '@/components/ui/TopicIcon';
import { Marquee } from '@/components/ui/Marquee';
import { fadeUp, EASE } from '@/components/ui/Reveal';
import Accordion from '@/components/ui/Accordion';
import Footer from '@/components/layout/Footer';
import FinancingLadder from '@/components/august/FinancingLadder';
import BarChartReveal from '@/components/august/BarChartReveal';
import ProjectShowcase from '@/components/august/ProjectShowcase';
import TrendChart from '@/components/august/TrendChart';
import DistrictMap from '@/components/august/DistrictMap';

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
// dated public record show the timeline rail. Clean Water and Civic Buildings
// keep their sourced dates in constants but omit the rail here.
const TIMELINE_SLUGS = new Set(['sewers', 'housing', 'central-city']);

// Small editorial kicker label with an accent dot. Keeps strong contrast (navy
// text) while still carrying the per-measure accent through the swatch.
function Kicker({ children, swatch }: { children: React.ReactNode; swatch: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-[0.7rem] sm:text-xs font-semibold uppercase tracking-widest text-navy/60">
      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: swatch }} />
      {children}
    </span>
  );
}

// Checkmark used across cost / key-fact lists.
function Check({ className }: { className?: string }) {
  return (
    <svg className={cn('w-4 h-4 shrink-0', className)} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
    </svg>
  );
}

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
  const heroRef = useRef<HTMLElement>(null);
  // Show the sticky bar once the hero has scrolled past the top.
  const heroInView = useInView(heroRef, { margin: '-72px 0px 0px 0px' });
  const showBar = !heroInView;
  const { scrollYProgress } = useScroll();

  const { accent } = measure;
  const swatch = accent.swatch;
  // Golden reads poorly under white text; flip to navy text on the golden swatch.
  const onSwatchText = accent.name === 'Golden' ? '#1e3a5f' : '#ffffff';
  const showCounter = measure.bigStat.display === '';
  const showTimeline = TIMELINE_SLUGS.has(measure.slug) && measure.timeline.length > 0;
  const hasExamples = measure.realExamples.length > 0;
  const isSupermajority = measure.voteThreshold !== 'Simple majority';
  // Collect the optional viz payloads in an array so the presence check does not
  // progressively narrow `measure` down to `never` across a long || chain.
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

  const narrative = [
    { kicker: 'The problem', body: measure.narrative.problem },
    { kicker: 'What it does', body: measure.narrative.whatItDoes },
    { kicker: 'Why it matters', body: measure.narrative.whyItMatters },
    { kicker: 'What your YES does', body: measure.narrative.whatYourYesDoes },
  ];

  const officialParagraphs = measure.officialQuestion.text.split('\n\n');
  const faqItems = measure.faqs.map((f) => ({ question: f.q, answer: f.a }));

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* ================================================================= */}
      {/* STICKY MEASURE BAR                                                 */}
      {/* ================================================================= */}
      <motion.div
        initial={false}
        animate={{ y: showBar ? 0 : -72, opacity: showBar ? 1 : 0 }}
        transition={{ duration: reduce ? 0 : 0.35, ease: EASE }}
        className={cn(
          // Sits directly below the fixed AugustNav (h-16 / md:h-20) and stays
          // beneath it in the stack (nav is z-[60]).
          'fixed top-16 md:top-20 inset-x-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm',
          showBar ? 'pointer-events-auto' : 'pointer-events-none'
        )}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-3">
          <Link
            href="/august-2026"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy/70 hover:text-coral transition-colors shrink-0"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="hidden sm:inline">All five</span>
          </Link>

          <span className="flex items-center gap-2 text-sm sm:text-base font-bold text-navy truncate">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: swatch }} />
            <span className="truncate">{measure.name}</span>
          </span>

          <Link
            href="/vote"
            style={{ backgroundColor: swatch, color: onSwatchText }}
            className="inline-flex items-center gap-1.5 rounded-full font-semibold text-sm px-4 py-2 shrink-0 transition-transform hover:-translate-y-0.5"
          >
            <span className="hidden sm:inline">Vote YES</span>
            <span className="sm:hidden">YES</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        {/* Scroll progress underline, accent colored */}
        <motion.div
          className="h-0.5 origin-left"
          style={{ scaleX: scrollYProgress, backgroundColor: swatch }}
        />
      </motion.div>

      {/* ================================================================= */}
      {/* MEASURE HERO                                                       */}
      {/* ================================================================= */}
      <section
        ref={heroRef}
        className={cn('relative overflow-hidden bg-gradient-to-br', accent.gradientHero)}
      >
        {/* legibility scrim: keeps white headline + stat text AA on lighter accents (golden civic, sky water and central-city) */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-black/15" />
        {/* faint white grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        {/* drifting blobs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/4 -left-1/5 w-1/2 h-1/2 bg-white/10 rounded-full blur-3xl animate-drift motion-reduce:animate-none" />
          <div className="absolute -bottom-1/3 right-0 w-1/2 h-2/3 bg-white/10 rounded-full blur-3xl animate-drift motion-reduce:animate-none" style={{ animationDelay: '-8s' }} />
        </div>
        {/* enlarged low-opacity motif */}
        <TopicIcon
          id={measure.motif}
          className="pointer-events-none absolute -right-16 sm:-right-10 top-1/2 -translate-y-1/2 w-[360px] h-[360px] sm:w-[460px] sm:h-[460px] text-white/[0.08]"
        />
        <div className="noise-overlay absolute inset-0 z-[1]" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 sm:pt-28 sm:pb-24">
          <Link
            href="/august-2026"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-white/75 hover:text-white transition-colors mb-9 sm:mb-12"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to all five questions
          </Link>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="flex flex-wrap items-center gap-3 mb-6"
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-sm border border-white/25 text-white text-xs sm:text-sm font-semibold px-3.5 py-1.5">
              <TopicIcon id={measure.motif} className="w-4 h-4 text-white" />
              {measure.name}
            </span>
            <span className="inline-flex items-center rounded-full bg-white text-navy text-xs sm:text-sm font-bold px-3.5 py-1.5">
              {measure.officialQuestion.number}
            </span>
          </motion.div>

          <div className="grid lg:grid-cols-[1fr_auto] gap-8 lg:gap-12 items-end">
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.05 }}
            >
              <h1
                className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white leading-[0.98] tracking-tight"
                style={{ textShadow: '0 2px 40px rgba(0,0,0,0.25)' }}
              >
                {measure.cardPunch}
              </h1>
              <p className="text-white/85 text-lg sm:text-xl mt-5 max-w-2xl leading-relaxed">
                {measure.cardSub}
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Link
                  href="/vote"
                  className="group inline-flex items-center gap-2 rounded-full bg-white text-navy font-semibold px-6 py-3 text-base shadow-lg shadow-black/10 transition-transform hover:-translate-y-0.5"
                >
                  {measure.yesCta}
                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                <a
                  href="#official"
                  className="inline-flex items-center gap-2 rounded-full bg-white/10 border-2 border-white/70 text-white font-semibold px-6 py-3 text-base hover:bg-white hover:text-navy transition-colors"
                >
                  Read the official question
                </a>
              </div>
            </motion.div>

            {/* big stat */}
            <motion.div
              initial={reduce ? false : { opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.15 }}
              className="shrink-0"
            >
              <div
                className="text-white font-bold leading-[0.9] text-6xl sm:text-7xl lg:text-8xl tabular-nums"
                style={{ textShadow: '0 2px 36px rgba(0,0,0,0.3)' }}
              >
                {showCounter ? (
                  <AnimatedCounter
                    end={measure.bigStat.target}
                    prefix={measure.bigStat.prefix}
                    suffix={measure.bigStat.suffix}
                    decimals={measure.bigStat.decimals}
                  />
                ) : (
                  measure.bigStat.display
                )}
              </div>
              <div className="text-white/75 text-sm sm:text-base font-medium mt-2 lg:text-right">
                {measure.bigStat.label}
              </div>
              <div className="mt-4 lg:text-right">
                <span
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur-sm border border-white/25 text-white text-sm font-semibold px-3.5 py-1.5"
                >
                  <Check className="text-white" />
                  {measure.costChip}
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* ACCENT MARQUEE BAND                                                */}
      {/* ================================================================= */}
      <div className="py-3 sm:py-3.5 border-y border-white/10" style={{ backgroundColor: swatch, color: onSwatchText }}>
        <Marquee items={[measure.name, 'Vote Yes', 'August 4, 2026', measure.costChip, measure.officialQuestion.number]} />
      </div>

      {/* ================================================================= */}
      {/* KEY FACTS STRIP (hero stats)                                       */}
      {/* ================================================================= */}
      <section className="relative bg-white py-10 sm:py-12 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {measure.heroStats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={reduce ? false : { opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, ease: EASE, delay: i * 0.07 }}
                className="rounded-2xl bg-light-gray/70 border border-gray-100 p-5 sm:p-6"
              >
                <div className="text-3xl sm:text-4xl font-bold text-navy leading-none tabular-nums">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-gray-500 mt-2 leading-snug">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* OFFICIAL QUESTION BLOCK                                            */}
      {/* ================================================================= */}
      <section id="official" className="relative bg-gradient-to-b from-white via-light-gray/40 to-white py-16 sm:py-20 scroll-mt-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} transition={{ duration: 0.6, ease: EASE }} className="mb-7">
            <Kicker swatch={swatch}>On your ballot</Kicker>
            <h2 className="text-2xl sm:text-3xl font-bold text-navy mt-3">
              The official ballot language
            </h2>
          </motion.div>

          <motion.figure
            {...fadeUp}
            transition={{ duration: 0.6, ease: EASE, delay: 0.05 }}
            className="relative rounded-3xl bg-white border border-gray-100 shadow-xl shadow-navy/5 p-7 sm:p-10 overflow-hidden"
          >
            <span className="absolute top-0 left-0 h-full w-1.5" style={{ backgroundColor: swatch }} />
            <div className="flex flex-wrap items-center gap-2.5 mb-5">
              <span
                className="inline-flex items-center rounded-full text-xs font-bold px-3 py-1"
                style={{ backgroundColor: swatch, color: onSwatchText }}
              >
                {measure.officialQuestion.number}
              </span>
              <span className="text-xs font-medium text-gray-400">{measure.ordinance}</span>
            </div>
            <blockquote className="space-y-4">
              {officialParagraphs.map((para, i) => (
                <p key={i} className="text-base sm:text-lg text-navy/90 leading-relaxed font-medium">
                  {para}
                </p>
              ))}
            </blockquote>
            <figcaption className="text-xs text-gray-400 mt-6 leading-relaxed">
              Verbatim from the Kansas City Election Board sample ballot (Issues Only). Always confirm
              the final wording and official question order on your authenticated sample ballot.
            </figcaption>
          </motion.figure>
        </div>
      </section>

      {/* ================================================================= */}
      {/* NARRATIVE (problem / what it does / why it matters / your YES)     */}
      {/* ================================================================= */}
      <section className="relative bg-white py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 {...fadeUp} transition={{ duration: 0.6, ease: EASE }} className="text-3xl sm:text-5xl font-bold text-navy leading-tight mb-12 sm:mb-14">
            {measure.title}
          </motion.h2>

          <div className="divide-y divide-gray-100">
            {narrative.map((block, i) => (
              <motion.div
                key={block.kicker}
                initial={reduce ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, ease: EASE }}
                className="grid md:grid-cols-[200px_1fr] gap-4 md:gap-10 py-8 sm:py-10 first:pt-0"
              >
                <div className="md:pt-1">
                  <Kicker swatch={swatch}>{block.kicker}</Kicker>
                </div>
                <p
                  className={cn(
                    'text-gray-700 leading-relaxed',
                    i === 0 ? 'text-lg sm:text-xl text-navy/90 font-medium' : 'text-base sm:text-lg'
                  )}
                >
                  {block.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* KEY FACTS PANEL                                                    */}
      {/* ================================================================= */}
      <section className="relative bg-gradient-to-b from-light-gray/40 to-white py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} transition={{ duration: 0.6, ease: EASE }} className="mb-9">
            <Kicker swatch={swatch}>The details</Kicker>
            <h2 className="text-2xl sm:text-4xl font-bold text-navy mt-3">Key facts</h2>
          </motion.div>
          <div className="rounded-3xl bg-white border border-gray-100 shadow-xl shadow-navy/5 p-6 sm:p-9">
            <ul className="space-y-4">
              {measure.keyFacts.map((fact, i) => (
                <motion.li
                  key={i}
                  initial={reduce ? false : { opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.4, ease: EASE, delay: Math.min(i * 0.04, 0.3) }}
                  className="flex items-start gap-3"
                >
                  <span style={{ color: swatch }} className="mt-0.5">
                    <Check />
                  </span>
                  <span className="text-sm sm:text-base text-gray-700 leading-relaxed">{fact}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* MEASURE VISUALS (per-measure data, each block gated on presence)   */}
      {/* ================================================================= */}
      {hasViz && (
        <section className="relative bg-white py-16 sm:py-24 border-b border-gray-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-20">
            {/* Financing ladder (water + sewer): cheapest money sits lowest */}
            {measure.financingLadder && (
              <FinancingLadder
                rungs={[...measure.financingLadder.rungs]}
                accent={swatch}
                heading="How the financing stays cheap"
              />
            )}

            {/* Capital plan breakdown with the share this question authorizes */}
            {measure.cipBreakdown && (
              <BarChartReveal
                heading={measure.cipBreakdown.heading}
                rows={[...measure.cipBreakdown.rows]}
                total={measure.cipBreakdown.total}
                asking={measure.cipBreakdown.asking}
                accent={swatch}
                caption={measure.cipBreakdown.note}
              />
            )}

            {/* State Revolving Fund draws (sewers) and the SRF note (water + sewer) */}
            {(measure.srfApplications.length > 0 || measure.srfNote) && (
              <div className="space-y-6">
                {measure.srfApplications.length > 0 && (
                  <ProjectShowcase
                    heading="State Revolving Fund applications drawing on this authorization"
                    items={measure.srfApplications.map((a) => ({
                      name: a.name,
                      meta: a.amount,
                      detail: a.detail,
                    }))}
                    accent={swatch}
                  />
                )}
                {measure.srfNote && (
                  <div className="rounded-2xl bg-light-gray/70 border border-gray-100 p-6 flex items-start gap-3">
                    <span style={{ color: swatch }} className="mt-0.5">
                      <Check />
                    </span>
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{measure.srfNote}</p>
                  </div>
                )}
              </div>
            )}

            {/* Prior-authorization track record, with issuance trend where we have it */}
            {measure.bondHistory && (
              <div>
                <motion.div {...fadeUp} transition={{ duration: 0.6, ease: EASE }} className="mb-6">
                  <Kicker swatch={swatch}>The track record</Kicker>
                  <h2 className="text-2xl sm:text-4xl font-bold text-navy mt-3">{measure.bondHistory.heading}</h2>
                </motion.div>
                <motion.div
                  {...fadeUp}
                  transition={{ duration: 0.6, ease: EASE, delay: 0.05 }}
                  className="rounded-3xl bg-navy text-white p-7 sm:p-9 shadow-xl shadow-navy/10"
                >
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full text-sm font-bold px-3.5 py-1.5"
                    style={{ backgroundColor: swatch, color: onSwatchText }}
                  >
                    <Check />
                    {measure.bondHistory.approval}
                  </span>
                  <p className="mt-5 text-base sm:text-lg text-white/90 leading-relaxed">{measure.bondHistory.note}</p>
                </motion.div>
                {measure.bondHistory.points.length > 0 && (
                  <div className="mt-8">
                    <TrendChart
                      heading="Water revenue bonds issued, by series"
                      caption="Dollars issued from the prior authorization, by bond series."
                      points={[...measure.bondHistory.points]}
                      accent={swatch}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Housing Trust Fund completed developments, with the 365-unit tally */}
            {measure.completedProjects && (
              <ProjectShowcase
                heading={measure.completedProjects.heading}
                items={measure.completedProjects.items.map((p) => ({
                  name: p.name,
                  meta: `${p.units} ${p.units === 1 ? 'unit' : 'units'}`,
                  detail: p.address,
                }))}
                accent={swatch}
                footer={{ label: measure.completedProjects.totalLabel, value: measure.completedProjects.total }}
              />
            )}

            {/* Civic buildings: costed line items (in $M) plus the City Hall list */}
            {measure.civicProjects && (
              <div>
                <BarChartReveal
                  heading={measure.civicProjects.heading}
                  rows={measure.civicProjects.costed.map((c) => ({ label: c.name, value: c.amountM * 1_000_000 }))}
                  accent={swatch}
                  caption={measure.civicProjects.note}
                />
                <div className="mt-9">
                  <motion.div {...fadeUp} transition={{ duration: 0.6, ease: EASE }} className="mb-5">
                    <Kicker swatch={swatch}>City Hall</Kicker>
                    <h3 className="text-xl sm:text-2xl font-bold text-navy mt-3">City Hall improvements</h3>
                  </motion.div>
                  <div className="flex flex-wrap gap-2.5">
                    {measure.civicProjects.cityHall.map((item, i) => (
                      <motion.span
                        key={item}
                        initial={reduce ? false : { opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-40px' }}
                        transition={{ duration: 0.4, ease: EASE, delay: Math.min(i * 0.06, 0.3) }}
                        className="inline-flex items-center gap-2 rounded-full bg-light-gray border border-gray-200 text-navy text-sm font-medium px-4 py-2"
                      >
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: swatch }} />
                        {item}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Central City: sales-tax revenue trend, funded projects, district map */}
            {measure.ccedRevenue && (
              <TrendChart
                heading={measure.ccedRevenue.heading}
                caption={measure.ccedRevenue.note}
                points={[...measure.ccedRevenue.points]}
                total={measure.ccedRevenue.total}
                accent={swatch}
              />
            )}
            {measure.ccedProjects && (
              <ProjectShowcase
                heading={measure.ccedProjects.heading}
                items={measure.ccedProjects.items.map((p) => ({ name: p.name, detail: p.summary }))}
                accent={swatch}
              />
            )}
            {measure.ccedDistrict && (
              <DistrictMap
                {...measure.ccedDistrict}
                accent={swatch}
                heading="The CCED corridor"
                caption="A tall, narrow district on the East Side."
              />
            )}
          </div>
        </section>
      )}

      {/* ================================================================= */}
      {/* TIMELINE (only where a real dated record exists)                  */}
      {/* ================================================================= */}
      {showTimeline && (
        <section className="relative bg-navy py-16 sm:py-24 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-1/4 right-0 w-1/2 h-2/3 rounded-full blur-3xl animate-drift motion-reduce:animate-none" style={{ backgroundColor: swatch, opacity: 0.18 }} />
          </div>
          <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div {...fadeUp} transition={{ duration: 0.6, ease: EASE }} className="mb-11">
              <span className="inline-flex items-center gap-2 text-[0.7rem] sm:text-xs font-semibold uppercase tracking-widest text-white/60">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: swatch }} />
                How we got here
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold text-white mt-3">The record</h2>
            </motion.div>

            <div className="relative pl-8 sm:pl-10">
              {/* connecting rail with scaleY reveal */}
              <motion.span
                aria-hidden
                initial={reduce ? false : { scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.8, ease: EASE }}
                className="absolute left-[7px] sm:left-[9px] top-2 bottom-2 w-0.5 origin-top"
                style={{ backgroundColor: swatch, opacity: 0.5 }}
              />
              <ol className="space-y-8">
                {measure.timeline.map((item, i) => (
                  <motion.li
                    key={`${item.date}-${i}`}
                    initial={reduce ? false : { opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 0.5, ease: EASE, delay: Math.min(i * 0.06, 0.4) }}
                    className="relative"
                  >
                    <span
                      className="absolute -left-8 sm:-left-10 top-1 w-4 h-4 rounded-full ring-4 ring-navy"
                      style={{ backgroundColor: swatch }}
                    />
                    <p className="text-sm font-bold uppercase tracking-wide" style={{ color: swatch }}>
                      {item.date}
                    </p>
                    <p className="text-white/80 text-sm sm:text-base leading-relaxed mt-1">{item.label}</p>
                  </motion.li>
                ))}
              </ol>
            </div>
          </div>
        </section>
      )}

      {/* ================================================================= */}
      {/* ON THE GROUND (real examples, only when present)                  */}
      {/* ================================================================= */}
      {hasExamples && (
        <section className="relative bg-white py-16 sm:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div {...fadeUp} transition={{ duration: 0.6, ease: EASE }} className="mb-9">
              <Kicker swatch={swatch}>On the ground</Kicker>
              <h2 className="text-2xl sm:text-4xl font-bold text-navy mt-3">What it is already doing</h2>
            </motion.div>
            <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
              {measure.realExamples.map((ex, i) => (
                <motion.div
                  key={i}
                  initial={reduce ? false : { opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.5, ease: EASE, delay: Math.min(i * 0.07, 0.3) }}
                  className="relative rounded-2xl bg-light-gray/60 border border-gray-100 p-6 overflow-hidden"
                >
                  <span className="absolute top-0 left-0 h-1 w-full" style={{ backgroundColor: swatch }} />
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{ex}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ================================================================= */}
      {/* HONEST COST PANEL                                                  */}
      {/* ================================================================= */}
      <section className="relative bg-gradient-to-b from-light-gray/40 to-white py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} transition={{ duration: 0.6, ease: EASE }} className="mb-9">
            <Kicker swatch={swatch}>The honest part</Kicker>
            <h2 className="text-2xl sm:text-4xl font-bold text-navy mt-3">What it costs you</h2>
          </motion.div>

          <motion.div
            {...fadeUp}
            transition={{ duration: 0.6, ease: EASE, delay: 0.05 }}
            className="rounded-3xl bg-navy text-white p-7 sm:p-10 shadow-xl shadow-navy/10 overflow-hidden relative"
          >
            <div className="flex flex-wrap items-center gap-2.5 mb-6">
              <span
                className="inline-flex items-center gap-1.5 rounded-full text-sm font-bold px-3.5 py-1.5"
                style={{ backgroundColor: swatch, color: onSwatchText }}
              >
                <Check />
                {measure.costChip}
              </span>
              <span className="inline-flex items-center rounded-full bg-white/10 border border-white/20 text-white/85 text-sm font-medium px-3.5 py-1.5">
                {measure.voteThreshold} to pass
              </span>
            </div>

            <p className="text-base sm:text-lg text-white/90 leading-relaxed">{measure.honestCost}</p>

            <div className="mt-7 pt-7 border-t border-white/15">
              <p className="text-xs font-semibold uppercase tracking-widest text-white/50 mb-2.5">
                How the financing works
              </p>
              <p className="text-sm sm:text-base text-white/80 leading-relaxed">{measure.mechanism}</p>
            </div>

            {isSupermajority && (
              <div className="mt-6 rounded-2xl bg-white/[0.06] border border-white/15 p-5 flex items-start gap-3">
                <svg className="w-5 h-5 shrink-0 mt-0.5" style={{ color: swatch }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M5.07 19h13.86a2 2 0 001.74-3L13.74 4a2 2 0 00-3.48 0L3.33 16a2 2 0 001.74 3z" />
                </svg>
                <p className="text-sm sm:text-base text-white/85 leading-relaxed">
                  As a general obligation bond, this question needs a four-sevenths supermajority
                  (about 57.1 percent), not a simple majority. Turnout and margin both matter.
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* MEASURE FAQ                                                        */}
      {/* ================================================================= */}
      <section className="relative bg-white py-16 sm:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} transition={{ duration: 0.6, ease: EASE }} className="mb-10 sm:mb-12">
            <Kicker swatch={swatch}>Questions and answers</Kicker>
            <h2 className="text-3xl sm:text-5xl font-bold text-navy leading-tight mt-3">
              {measure.name}, answered
            </h2>
          </motion.div>
          <Accordion items={faqItems} />
        </div>
      </section>

      {/* ================================================================= */}
      {/* SOURCES                                                            */}
      {/* ================================================================= */}
      <section className="relative bg-light-gray/50 py-16 sm:py-20 border-y border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} transition={{ duration: 0.6, ease: EASE }} className="mb-8">
            <Kicker swatch={swatch}>Where this comes from</Kicker>
            <h2 className="text-2xl sm:text-4xl font-bold text-navy mt-3">Sources</h2>
          </motion.div>

          <ul className="space-y-3 mb-8">
            {measure.sources.map((src, i) => (
              <li key={i} className="flex items-start gap-3">
                <span style={{ color: swatch }} className="mt-1.5 shrink-0">
                  <span className="block w-1.5 h-1.5 rounded-full bg-current" />
                </span>
                <a
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm sm:text-base text-navy/80 hover:text-coral underline decoration-gray-300 hover:decoration-coral underline-offset-2 transition-colors leading-relaxed"
                >
                  {src.title}
                </a>
              </li>
            ))}
          </ul>

          {measure.relatedLinks.length > 0 && (
            <div className="flex flex-wrap gap-2.5 mb-7">
              {measure.relatedLinks.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full bg-white border border-gray-200 text-navy/80 text-sm font-medium px-4 py-2 hover:border-coral hover:text-coral transition-colors"
                >
                  {link.label}
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              ))}
            </div>
          )}

          <p className="text-xs text-gray-400 leading-relaxed">
            Always confirm the final wording and official question order on your authenticated sample
            ballot from the Kansas City Election Board.
          </p>
        </div>
      </section>

      {/* ================================================================= */}
      {/* PREV / NEXT MEASURE NAV                                            */}
      {/* ================================================================= */}
      <section className="relative bg-white py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
            <Link
              href={`/august-2026/${prev.slug}`}
              className="group relative rounded-2xl bg-light-gray/60 border border-gray-100 p-6 overflow-hidden transition-all hover:border-gray-200 hover:shadow-lg hover:shadow-navy/5"
            >
              <span className="absolute top-0 left-0 h-full w-1.5" style={{ backgroundColor: prev.swatch }} />
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gray-400">
                <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous question
              </div>
              <div className="flex items-center gap-2.5 mt-3">
                <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: prev.swatch }} />
                <span className="text-lg sm:text-xl font-bold text-navy group-hover:text-coral transition-colors">
                  {prev.name}
                </span>
              </div>
            </Link>

            <Link
              href={`/august-2026/${next.slug}`}
              className="group relative rounded-2xl bg-light-gray/60 border border-gray-100 p-6 overflow-hidden transition-all hover:border-gray-200 hover:shadow-lg hover:shadow-navy/5 sm:text-right"
            >
              <span className="absolute top-0 right-0 h-full w-1.5" style={{ backgroundColor: next.swatch }} />
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gray-400 sm:justify-end">
                Next question
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <div className="flex items-center gap-2.5 mt-3 sm:justify-end">
                <span className="w-3 h-3 rounded-full shrink-0 sm:order-2" style={{ backgroundColor: next.swatch }} />
                <span className="text-lg sm:text-xl font-bold text-navy group-hover:text-coral transition-colors sm:order-1">
                  {next.name}
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* CTA BAND                                                           */}
      {/* ================================================================= */}
      <section className={cn('relative overflow-hidden bg-gradient-to-br', accent.gradientHero)}>
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/4 left-1/4 w-1/2 h-2/3 bg-white/10 rounded-full blur-3xl animate-drift motion-reduce:animate-none" />
        </div>
        <div className="noise-overlay absolute inset-0 z-[1]" />

        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center">
          <motion.h2 {...fadeUp} transition={{ duration: 0.7, ease: EASE }} className="text-3xl sm:text-5xl md:text-6xl font-bold text-white leading-tight">
            {measure.yesCta}
          </motion.h2>
          <motion.p {...fadeUp} transition={{ duration: 0.6, ease: EASE, delay: 0.1 }} className="text-white/85 text-base sm:text-lg mt-5 leading-relaxed">
            Vote on or before {vote.electionDate}. Polls are open {vote.pollsOpen}.
          </motion.p>

          <motion.div {...fadeUp} transition={{ duration: 0.6, ease: EASE, delay: 0.18 }} className="mt-8 flex justify-center">
            <Link
              href="/vote"
              className="group inline-flex items-center gap-2 rounded-full bg-white text-navy font-semibold px-7 py-3.5 text-base sm:text-lg shadow-lg shadow-black/10 transition-transform hover:-translate-y-0.5"
            >
              Find your polling place
              <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </motion.div>

          <motion.div {...fadeUp} transition={{ duration: 0.6, ease: EASE, delay: 0.24 }} className="mt-9 flex flex-wrap justify-center gap-2.5">
            <Link href="/vote" className="inline-flex flex-col items-center rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 px-5 py-3 text-white hover:bg-white/20 transition-colors">
              <span className="text-xs uppercase tracking-widest text-white/60 font-semibold">Register</span>
              <span className="text-sm font-bold">Before voting</span>
            </Link>
            <Link href="/vote" className="inline-flex flex-col items-center rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 px-5 py-3 text-white hover:bg-white/20 transition-colors">
              <span className="text-xs uppercase tracking-widest text-white/60 font-semibold">Early voting</span>
              <span className="text-sm font-bold">{vote.earlyVotingDate}</span>
            </Link>
            <Link href="/vote" className="inline-flex flex-col items-center rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 px-5 py-3 text-white hover:bg-white/20 transition-colors">
              <span className="text-xs uppercase tracking-widest text-white/60 font-semibold">Election Day</span>
              <span className="text-sm font-bold">{vote.electionDate}</span>
            </Link>
          </motion.div>

          <motion.div {...fadeUp} transition={{ duration: 0.6, ease: EASE, delay: 0.3 }} className="mt-10">
            <Link href="/august-2026" className="inline-flex items-center gap-1.5 text-white/75 hover:text-white text-sm font-semibold transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to all five questions
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
