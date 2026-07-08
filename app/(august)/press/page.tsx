'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { AUGUST_BALLOT } from '@/lib/constants';
import { fadeUp, EASE } from '@/components/ui/Reveal';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { InteractiveHoverButton } from '@/components/ui/InteractiveHoverButton';
import Accordion from '@/components/ui/Accordion';
import { TopicIcon } from '@/components/ui/TopicIcon';
import { withAlpha, inkOnWhite } from '@/components/august/accent';
import Footer from '@/components/layout/Footer';

const { measures, faqs, faqsSection, costs } = AUGUST_BALLOT;

// Render the five measures in official ballot order (Question 1 to 5), the way a
// reporter reads them off the sample ballot, rather than the source array order
// (which is tuned for the detail-page prev/next cycle).
const ballotOrder = (m: (typeof measures)[number]) =>
  parseInt(m.officialQuestion.number.replace(/\D/g, ''), 10);
const orderedMeasures = [...measures].sort((a, b) => ballotOrder(a) - ballotOrder(b));

// Headline numbers a reporter can quote in the first paragraph.
type StatTile = {
  label: string;
  display?: string;
  counter?: { end: number; decimals: number; prefix: string; suffix: string };
};
const STAT_TILES: StatTile[] = [
  { display: 'Five', label: 'questions on the ballot' },
  { counter: { end: 1.7, decimals: 1, prefix: '$', suffix: 'B' }, label: 'in bonds, back into Kansas City' },
  { display: '$0', label: 'new taxes or tax-rate hikes' },
  { display: 'Aug 4', label: 'Election Day, 2026' },
  { display: '4/7', label: 'supermajority for the housing & civic bonds' },
];

// Talking points, each grounded in the per-measure copy in constants.ts.
const KEY_POINTS = [
  'Clean Water and Sewers (Questions 4 and 5) are revenue bonds, repaid only from the water and sewer fees KC Water already collects, not from property taxes.',
  'Housing and Civic Buildings (Questions 1 and 2) are general obligation bonds timed to replace retiring debt, so the debt-service property tax rate is projected to stay flat.',
  'Central City (Question 3) renews an existing one-eighth-cent sales tax at the same rate. It is a renewal, not a new tax.',
  'The two general obligation bonds (Questions 1 and 2) each need a four-sevenths supermajority, about 57.1 percent, to pass, so turnout and margin both matter.',
  'Together KC is the same coalition that renewed the Kansas City earnings tax with a decisive YES on April 7, 2026.',
];

const ONE_PAGER = '/press-kit/August-One-Pager.pdf';

// Downloadable brand + document assets. No per-question FAQ documents: the
// question-by-question answers live inline on this page and in full on each
// /questions/[slug] detail page.
const DOWNLOADS = [
  {
    title: 'August One-Pager',
    description: 'All five questions on a single page: what each one does and why it matters. Print-ready PDF.',
    href: ONE_PAGER,
    filename: 'Together-KC-August-One-Pager.pdf',
    kind: 'pdf' as const,
    preview: null as string | null,
  },
  {
    title: 'Vote Yes On All 5 logo',
    description: 'The August campaign wordmark. PNG with a transparent background.',
    href: '/images/august-logo.png',
    filename: 'Together-KC-Vote-Yes-On-All-5.png',
    kind: 'image' as const,
    preview: '/images/august-logo.png',
  },
  {
    title: 'Together KC logo',
    description: 'High-resolution Together KC organization logo for print.',
    href: '/press-kit/together-kc-logo-print.jpg',
    filename: 'Together-KC-Logo.jpg',
    kind: 'image' as const,
    preview: '/press-kit/together-kc-logo-print.jpg',
  },
];

// ===========================================================================
// PDF / image lightbox
// ===========================================================================
function PreviewModal({
  item,
  onClose,
}: {
  item: { title: string; href: string; filename: string; kind: 'pdf' | 'image' };
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);

  // Dialog a11y: close on Escape, lock body scroll, move focus into the dialog
  // on open and restore it to the trigger on close.
  useEffect(() => {
    const prevActive = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      prevActive?.focus?.();
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={`${item.title} preview`}
        initial={{ scale: 0.94, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.94, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 26 }}
        className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-3xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="font-bold text-navy pl-2">{item.title}</h3>
          <div className="flex items-center gap-2">
            <a
              href={item.href}
              download={item.filename}
              className="inline-flex items-center gap-2 px-4 py-2 bg-coral text-white rounded-full hover:bg-coral/90 transition-colors text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download
            </a>
            <button
              ref={closeRef}
              onClick={onClose}
              aria-label="Close preview"
              className="p-2 rounded-full hover:bg-light-gray transition-colors text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div className="h-[72vh] overflow-auto bg-light-gray">
          {item.kind === 'pdf' ? (
            <object data={item.href} type="application/pdf" className="w-full h-full">
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <p className="text-gray-600 mb-4">Preview is not available in this browser.</p>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-navy text-white rounded-full hover:bg-navy/90 transition-colors text-sm font-semibold"
                >
                  Open in a new tab
                </a>
              </div>
            </object>
          ) : (
            <div className="relative w-full h-full flex items-center justify-center p-8">
              <Image src={item.href} alt={item.title} width={900} height={700} className="max-w-full max-h-full object-contain" />
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ===========================================================================
// Per-question press card: official number + ballot language + honest cost.
// ===========================================================================
function PressMeasure({ measure, index }: { measure: (typeof measures)[number]; index: number }) {
  const { accent, bigStat } = measure;
  const supermajority = measure.voteThreshold.toLowerCase().includes('supermajority');
  const showCounter = bigStat.display === '';
  const ballotParas = measure.officialQuestion.text.split('\n\n');
  const facts = measure.keyFacts.slice(0, 3);

  return (
    <motion.article
      {...fadeUp}
      transition={{ duration: 0.55, delay: index * 0.05, ease: EASE }}
      style={{ boxShadow: '0 12px 30px -16px rgba(30,58,95,0.18)' }}
      className="relative rounded-3xl bg-white border border-gray-100 overflow-hidden"
    >
      {/* ACCENT BAND (shared identity with the hub MeasureCard + detail hero) */}
      <div className={`relative overflow-hidden bg-gradient-to-br ${accent.gradient} p-6 sm:p-8`}>
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)',
            backgroundSize: '36px 36px',
          }}
        />
        <TopicIcon id={measure.motif} className="pointer-events-none absolute -right-6 -bottom-9 w-40 h-40 text-white/[0.08]" />

        <div className="relative z-10 flex items-center gap-3">
          <TopicIcon id={measure.motif} className="w-7 h-7 sm:w-8 sm:h-8 text-white/90" />
          <span className="rounded-full bg-white/15 backdrop-blur-sm text-white/90 text-[0.65rem] font-bold uppercase tracking-widest px-2.5 py-1 border border-white/15">
            {measure.officialQuestion.number}
          </span>
        </div>

        <div className="relative z-10 mt-5 flex items-end justify-between gap-4">
          <div>
            <div className="text-white font-extrabold leading-[0.95] text-4xl sm:text-5xl" style={{ textShadow: '0 2px 30px rgba(0,0,0,0.28)' }}>
              {showCounter ? (
                <AnimatedCounter end={bigStat.target} prefix={bigStat.prefix} suffix={bigStat.suffix} decimals={bigStat.decimals} />
              ) : (
                bigStat.display
              )}
            </div>
            <div className="text-white/75 text-sm font-medium mt-1.5">{bigStat.label}</div>
          </div>
          <div className="text-white/90 text-sm sm:text-base font-bold uppercase tracking-wide text-right leading-tight">
            {measure.name}
          </div>
        </div>
      </div>

      {/* BODY */}
      <div className="p-6 sm:p-9">
        {/* chips */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-navy/[0.06] text-navy border border-navy/10 text-[0.7rem] font-semibold px-2.5 py-1">
            <svg className="w-3 h-3 text-coral" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3.5} d="M5 13l4 4L19 7" />
            </svg>
            {measure.costChip}
          </span>
          <span
            className={`inline-flex items-center rounded-full text-[0.7rem] font-semibold px-2.5 py-1 border ${
              supermajority ? 'bg-golden/15 border-golden/30' : 'bg-sky/10 border-sky/25'
            }`}
            style={{ color: inkOnWhite(supermajority ? '#f5a623' : '#4a90d9') }}
          >
            {supermajority ? 'Four-sevenths supermajority' : 'Simple majority'}
          </span>
        </div>

        <h3 className="mt-4 text-xl sm:text-2xl font-extrabold text-navy leading-snug [text-wrap:balance]">{measure.cardPunch}</h3>
        <p className="mt-2 text-sm sm:text-base text-gray-600 leading-relaxed">{measure.cardSub}</p>

        {/* honest cost framing */}
        <div className="mt-6 rounded-2xl bg-light-gray/70 border border-gray-100 p-5">
          <p className="text-[0.7rem] font-bold uppercase tracking-widest text-coral mb-2">What it costs you</p>
          <p className="text-sm text-gray-700 leading-relaxed">{measure.honestCost}</p>
        </div>

        {/* official ballot language, verbatim */}
        <div className="mt-5 rounded-2xl border-l-4 p-5" style={{ borderColor: accent.swatch, background: withAlpha(accent.swatch, 0.04) }}>
          <p className="text-[0.7rem] font-bold uppercase tracking-widest text-navy/60 mb-2">
            Official ballot language ({measure.officialQuestion.number})
          </p>
          <div className="space-y-2">
            {ballotParas.map((para, i) => (
              <p key={i} className="text-sm text-navy/80 leading-relaxed italic">
                {para}
              </p>
            ))}
          </div>
        </div>

        {/* top facts + link to full breakdown */}
        <ul className="mt-5 space-y-2.5">
          {facts.map((fact, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: accent.swatch }} />
              <span className="text-sm text-gray-600 leading-relaxed">{fact}</span>
            </li>
          ))}
        </ul>

        <Link
          href={`/questions/${measure.slug}`}
          className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-coral hover:text-navy transition-colors"
        >
          Full breakdown, key facts, and sources
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </motion.article>
  );
}

// ===========================================================================
function DownloadTile({
  item,
  onPreview,
}: {
  item: (typeof DOWNLOADS)[number];
  onPreview: () => void;
}) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      style={{ boxShadow: '0 12px 30px -16px rgba(30,58,95,0.18)' }}
      className="group flex flex-col rounded-3xl bg-white border border-gray-100 overflow-hidden"
    >
      {item.preview ? (
        <button
          onClick={onPreview}
          className="relative h-40 w-full bg-light-gray flex items-center justify-center p-6 overflow-hidden"
          aria-label={`Preview ${item.title}`}
        >
          <Image
            src={item.preview}
            alt={item.title}
            width={280}
            height={140}
            className="max-h-full w-auto object-contain transition-transform duration-500 group-hover:scale-105"
          />
        </button>
      ) : (
        <button
          onClick={onPreview}
          className="relative h-40 w-full flex items-center justify-center bg-gradient-to-br from-navy to-[#16314f]"
          aria-label={`Preview ${item.title}`}
        >
          <div className="noise-overlay absolute inset-0" />
          <svg className="relative w-14 h-14 text-white/85" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.4} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </button>
      )}

      <div className="flex flex-col flex-grow p-5">
        <h3 className="font-bold text-navy group-hover:text-coral transition-colors">{item.title}</h3>
        <p className="mt-1 text-sm text-gray-500 flex-grow leading-relaxed">{item.description}</p>
        <div className="mt-4 flex items-center gap-4">
          <button onClick={onPreview} className="inline-flex items-center gap-1.5 text-sm font-semibold text-sky hover:text-sky/80 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Preview
          </button>
          <a href={item.href} download={item.filename} className="inline-flex items-center gap-1.5 text-sm font-semibold text-coral hover:text-coral/80 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download
          </a>
        </div>
      </div>
    </motion.div>
  );
}

// ===========================================================================
export default function PressKitPage() {
  const [preview, setPreview] = useState<null | { title: string; href: string; filename: string; kind: 'pdf' | 'image' }>(null);
  const closePreview = useCallback(() => setPreview(null), []);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <AnimatePresence>
        {preview && <PreviewModal key="preview" item={preview} onClose={closePreview} />}
      </AnimatePresence>

      {/* ================================================================= */}
      {/* HERO                                                               */}
      {/* ================================================================= */}
      <section className="relative min-h-[78svh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy to-[#16314f]" />
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/4 -left-1/4 w-[55%] h-[55%] bg-coral/25 rounded-full blur-3xl animate-drift motion-reduce:animate-none" />
          <div className="absolute top-1/4 -right-1/4 w-2/3 h-2/3 bg-sky/25 rounded-full blur-3xl animate-drift motion-reduce:animate-none" style={{ animationDelay: '-7s' }} />
          <div className="absolute -bottom-1/4 left-1/4 w-1/2 h-1/2 bg-golden/15 rounded-full blur-3xl animate-drift motion-reduce:animate-none" style={{ animationDelay: '-14s' }} />
        </div>
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)',
            backgroundSize: '54px 54px',
          }}
        />
        <div className="noise-overlay absolute inset-0 z-[1]" />

        <motion.div
          className="relative z-20 text-center px-4 pt-28 pb-20 sm:pt-32 sm:pb-24 max-w-4xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } } }}
        >
          <motion.div
            variants={{ hidden: { opacity: 0, scale: 0.85 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.5, type: 'spring', stiffness: 200 } } }}
            className="flex justify-center mb-6 sm:mb-8"
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm text-white px-4 py-2 text-xs sm:text-sm font-semibold border border-white/20">
              <span className="w-2 h-2 rounded-full bg-coral animate-pulse motion-reduce:animate-none" />
              Media &amp; Press Kit
            </span>
          </motion.div>

          <motion.h1
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.6 } } }}
            className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white leading-[1.02] tracking-tight [text-wrap:balance]"
          >
            Everything you need to cover{' '}
            <span className="text-coral" style={{ textShadow: '0 0 40px rgba(229,57,53,0.5)' }}>
              August 4
            </span>
            .
          </motion.h1>

          <motion.p
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.6 } } }}
            className="mt-6 text-base sm:text-xl text-white/75 max-w-2xl mx-auto leading-relaxed"
          >
            Five Kansas City questions are on the August 4, 2026 ballot. Here is the official ballot language, the
            honest cost of each, the facts behind them, and everything a newsroom needs, in one place.
          </motion.p>

          <motion.div
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.6 } } }}
            className="mt-9 sm:mt-11 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
          >
            <InteractiveHoverButton text="Download the one-pager" href={ONE_PAGER} variant="primary" size="lg" external />
            <InteractiveHoverButton text="The five questions" href="#questions" variant="outline" size="lg" arrowDirection="down" />
          </motion.div>
        </motion.div>
      </section>

      {/* ================================================================= */}
      {/* ELECTION STRIP                                                     */}
      {/* ================================================================= */}
      <div className="bg-coral text-white border-y border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-3.5 flex flex-col items-center gap-1 text-center sm:flex-row sm:justify-between sm:text-left">
          <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.16em]">Media &amp; press resources</p>
          <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.16em] text-white/85">
            Election Day &middot; Tuesday, August 4, 2026
          </p>
        </div>
      </div>

      {/* ================================================================= */}
      {/* AT A GLANCE                                                        */}
      {/* ================================================================= */}
      <section className="relative py-14 sm:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} transition={{ duration: 0.6, ease: EASE }} className="text-center mb-9 sm:mb-11">
            <span className="inline-flex items-center gap-2 rounded-full bg-coral/10 text-coral text-sm font-semibold border border-coral/20 px-4 py-1.5 mb-5">
              <span className="w-2 h-2 rounded-full bg-coral animate-pulse motion-reduce:animate-none" />
              At a glance
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-navy leading-tight [text-wrap:balance]">The numbers, up top</h2>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {STAT_TILES.map((tile, i) => (
              <motion.div
                key={tile.label}
                {...fadeUp}
                transition={{ duration: 0.5, delay: i * 0.06, ease: EASE }}
                className="relative rounded-2xl bg-white border border-gray-100 p-5 text-center overflow-hidden"
                style={{ boxShadow: '0 12px 30px -18px rgba(30,58,95,0.2)' }}
              >
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-coral via-golden to-sky" />
                <div className="text-2xl sm:text-3xl font-extrabold text-navy tabular-nums">
                  {tile.counter ? (
                    <AnimatedCounter end={tile.counter.end} decimals={tile.counter.decimals} prefix={tile.counter.prefix} suffix={tile.counter.suffix} />
                  ) : (
                    tile.display
                  )}
                </div>
                <div className="mt-1.5 text-xs sm:text-sm text-gray-500 leading-snug">{tile.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* THE FIVE QUESTIONS (press rundown)                                 */}
      {/* ================================================================= */}
      <section id="questions" className="relative py-16 sm:py-24 bg-gradient-to-b from-white via-light-gray/40 to-white scroll-mt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} transition={{ duration: 0.6, ease: EASE }} className="text-center mb-11 sm:mb-14">
            <span className="inline-flex items-center gap-2 rounded-full bg-coral/10 text-coral text-sm font-semibold border border-coral/20 px-4 py-1.5 mb-5">
              <span className="w-2 h-2 rounded-full bg-coral animate-pulse motion-reduce:animate-none" />
              On the ballot
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-navy leading-tight [text-wrap:balance]">The five questions, for reporters</h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto mt-5 leading-relaxed">
              In official ballot order, with the verbatim ballot language, the honest cost of each, and the top facts.
              Every question links to a full, source-cited breakdown.
            </p>
          </motion.div>

          <div className="space-y-6 sm:space-y-8">
            {orderedMeasures.map((m, i) => (
              <PressMeasure key={m.slug} measure={m} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* KEY MESSAGES                                                       */}
      {/* ================================================================= */}
      <section className="relative py-20 sm:py-28 bg-navy overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/4 right-0 w-1/2 h-2/3 bg-sky/15 rounded-full blur-3xl animate-drift motion-reduce:animate-none" />
          <div className="absolute -bottom-1/3 -left-1/4 w-1/2 h-2/3 bg-coral/15 rounded-full blur-3xl animate-drift motion-reduce:animate-none" style={{ animationDelay: '-9s' }} />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} transition={{ duration: 0.6, ease: EASE }} className="mb-10 sm:mb-12 text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 text-white text-sm font-semibold border border-white/15 px-4 py-1.5 mb-5">
              <span className="w-2 h-2 rounded-full bg-coral animate-pulse motion-reduce:animate-none" />
              For reporters
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight [text-wrap:balance]">Key messages</h2>
          </motion.div>

          <motion.div {...fadeUp} transition={{ duration: 0.6, ease: EASE }} className="rounded-3xl bg-white/[0.06] border border-white/10 backdrop-blur-sm p-6 sm:p-10">
            <div className="grid md:grid-cols-2 gap-8 sm:gap-10">
              <div>
                <h3 className="text-coral font-bold text-lg mb-4">Core message</h3>
                <p className="text-white/85 leading-relaxed">
                  Five questions are on the August 4 ballot, and every one is a YES. Four are bonds totaling about
                  $1.7 billion for clean drinking water, cleaner rivers, affordable homes, and working civic
                  buildings. The fifth renews the existing sales tax that reinvests in the East Side.{' '}
                  <strong className="text-white">Not one of them raises your tax rate.</strong>
                </p>
                <p className="mt-5 text-white/70 leading-relaxed text-sm">{costs.bottomLine}</p>
              </div>

              <div>
                <h3 className="text-coral font-bold text-lg mb-4">Talking points</h3>
                <ul className="space-y-3.5">
                  {KEY_POINTS.map((point, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-coral flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-white/85 text-sm leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* FAQ (the on-site answers, inline for press)                        */}
      {/* ================================================================= */}
      <section className="relative py-16 sm:py-24 bg-gradient-to-b from-light-gray/40 to-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} transition={{ duration: 0.6, ease: EASE }} className="text-center mb-10 sm:mb-12">
            <span className="inline-flex items-center gap-2 rounded-full bg-coral/10 text-coral text-sm font-semibold border border-coral/20 px-4 py-1.5 mb-5">
              <span className="w-2 h-2 rounded-full bg-coral animate-pulse motion-reduce:animate-none" />
              {faqsSection.eyebrow}
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-navy leading-tight [text-wrap:balance]">{faqsSection.heading}</h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto mt-5 leading-relaxed">
              The same answers we publish for voters. For question-by-question detail, each measure above links to its
              full breakdown and sources.
            </p>
          </motion.div>
          <Accordion items={faqs} />
        </div>
      </section>

      {/* ================================================================= */}
      {/* DOWNLOADS                                                          */}
      {/* ================================================================= */}
      <section className="relative py-16 sm:py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} transition={{ duration: 0.6, ease: EASE }} className="text-center mb-11 sm:mb-14">
            <span className="inline-flex items-center gap-2 rounded-full bg-coral/10 text-coral text-sm font-semibold border border-coral/20 px-4 py-1.5 mb-5">
              <span className="w-2 h-2 rounded-full bg-coral animate-pulse motion-reduce:animate-none" />
              Downloads
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-navy leading-tight [text-wrap:balance]">Assets and documents</h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {DOWNLOADS.map((item, i) => (
              <motion.div key={item.title} {...fadeUp} transition={{ duration: 0.5, delay: i * 0.06, ease: EASE }}>
                <DownloadTile
                  item={item}
                  onPreview={() => setPreview({ title: item.title, href: item.href, filename: item.filename, kind: item.kind })}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* MEDIA CONTACT + ABOUT                                              */}
      {/* ================================================================= */}
      <section className="relative py-16 sm:py-24 bg-gradient-to-b from-white to-light-gray/40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-6 sm:gap-8 items-stretch">
          {/* contact */}
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.6, ease: EASE }}
            className="rounded-3xl bg-white border border-gray-100 p-7 sm:p-9"
            style={{ boxShadow: '0 12px 30px -16px rgba(30,58,95,0.18)' }}
          >
            <p className="text-[0.7rem] font-bold uppercase tracking-widest text-coral mb-4">Media contact</p>
            <h3 className="text-2xl font-extrabold text-navy">Tammy Edwards</h3>
            <p className="text-coral text-sm font-semibold mb-5">Campaign Manager, Together KC</p>
            <div className="space-y-3">
              <a href="mailto:action@together-kc.com" className="flex items-center gap-3 text-sm text-gray-600 hover:text-coral transition-colors">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                action@together-kc.com
              </a>
              <a href="tel:913-269-5075" className="flex items-center gap-3 text-sm text-gray-600 hover:text-coral transition-colors">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                (913) 269-5075
              </a>
            </div>
          </motion.div>

          {/* about / boilerplate */}
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.08, ease: EASE }}
            className="rounded-3xl bg-navy text-white p-7 sm:p-9 relative overflow-hidden"
            style={{ boxShadow: '0 12px 30px -16px rgba(30,58,95,0.35)' }}
          >
            <div className="noise-overlay absolute inset-0" />
            <div className="relative">
              <p className="text-[0.7rem] font-bold uppercase tracking-widest text-coral mb-4">About Together KC</p>
              <p className="text-white/85 leading-relaxed text-sm sm:text-base">
                Together KC is a coalition of Kansas City residents, businesses, labor, and community organizations. We
                backed the successful renewal of the Kansas City earnings tax in April 2026, and we support the five
                measures on the August 4, 2026 ballot: clean water, cleaner rivers, affordable homes, working civic
                buildings, and reinvestment on the East Side.
              </p>
              <p className="mt-5 text-white/55 text-xs leading-relaxed">
                Paid for by Together KC, Dan Kopp, Treasurer. Not authorized by any candidate or candidate committee.
                Always confirm the official wording and question order on your authenticated sample ballot from the
                Kansas City Election Board.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
