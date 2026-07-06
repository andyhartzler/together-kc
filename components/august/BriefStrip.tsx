'use client';

import Link from 'next/link';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { AUGUST_BALLOT } from '@/lib/constants';
import { ACCENT_INKS, accentInk, darken, withAlpha } from '@/components/august/accent';
import {
  Sheet,
  FileTab,
  LedgerRow,
  PAPER_EASE,
  VIEWPORT_ONCE,
  riseVariants,
  useRevealFailsafe,
} from '@/components/august/paper';

type Measure = (typeof AUGUST_BALLOT.measures)[number];

// Golden ink deepened for small annotation text. The standard golden ink
// (#9a6b0f) sits near 4.1:1 on paper, fine for large bold type but short of
// AA at doc-label size, so the supermajority note uses a darkened shade
// that clears 4.5:1 while still reading as the golden accent.
const GOLDEN_NOTE_INK = darken(ACCENT_INKS.golden.inkOnPaper, 0.22);

const growXVariants: Variants = {
  hidden: { scaleX: 0 },
  show: { scaleX: 1, transition: { duration: 0.7, ease: PAPER_EASE, delay: 0.2 } },
};

const PLAT_LABEL = 'text-[0.5625rem] font-bold uppercase tracking-[0.14em] text-ink-soft';

// ---------------------------------------------------------------------------
// Per-measure miniatures. Each brief previews its detail page's signature
// document in miniature; five briefs, five different silhouettes. Every
// figure is read or derived from the measure's own constants.
// ---------------------------------------------------------------------------
function Miniature({ measure }: { measure: Measure }) {
  switch (measure.slug) {
    // THE UTILITY STATEMENT in miniature: one itemized bill line.
    case 'clean-water':
      return (
        <div className="border border-hairline bg-paper p-4 sm:p-5">
          <p className="type-doc-label text-ink">KC Water &middot; Statement</p>
          <div aria-hidden="true" className="rule-hair mt-2.5" />
          <LedgerRow className="mt-3.5" size="sm" label="Property tax for these bonds" figure="$0.00" />
          <p className="type-fine mt-3.5">Funded through water rates, not property taxes.</p>
        </div>
      );

    // THE COURT FILE in miniature: docket dates and the capture meter.
    case 'sewers':
      return (
        <div className="border border-hairline bg-paper p-4 sm:p-5">
          <p className="type-doc-label text-ink">The court file &middot; Consent decree</p>
          <div className="mt-3.5 space-y-2">
            <LedgerRow size="sm" label="Decree entered" figure="2010" />
            <LedgerRow size="sm" label="Federal deadline" figure="2040" />
          </div>
          <div className="mt-4">
            <div className="relative h-2 w-full bg-ink/10">
              <motion.span
                aria-hidden="true"
                variants={growXVariants}
                className="absolute inset-y-0 left-0 block w-[45%] origin-left bg-ink"
              />
              <span
                aria-hidden="true"
                className="absolute -inset-y-1 left-[85%] w-0 border-l-2 border-dashed border-coral-press"
              />
            </div>
            <div className="mt-1.5 flex items-baseline justify-between gap-2">
              <span className="type-fine">45% captured, 2012</span>
              <span className="type-fine text-right">85% required by 2040</span>
            </div>
          </div>
        </div>
      );

    // THE REGISTER in miniature: three ledger rows and the 365-unit total.
    case 'housing':
      return (
        <div className="border border-hairline bg-paper p-4 sm:p-5">
          <p className="type-doc-label text-ink">The register &middot; Housing Trust Fund</p>
          <ul className="mt-3.5 list-none space-y-2.5">
            {measure.completedProjects.items.slice(0, 3).map((item) => (
              <LedgerRow
                key={item.name}
                as="li"
                size="sm"
                label={item.name}
                sublabel={item.address}
                figure={String(item.units)}
              />
            ))}
          </ul>
          <LedgerRow
            className="mt-3.5"
            size="sm"
            total
            label={measure.completedProjects.totalLabel}
            figure={String(measure.completedProjects.total)}
          />
        </div>
      );

    // THE WORK ORDER in miniature: 1937 and two costed line items.
    case 'civic-buildings':
      return (
        <div className="border border-hairline bg-paper p-4 sm:p-5">
          <p className="type-doc-label text-ink">Work order &middot; Estimate</p>
          <div className="mt-2.5 flex items-baseline gap-2.5">
            <span className="text-4xl font-extrabold tracking-tight text-ink tabular-nums">1937</span>
            <span className="type-fine">City Hall opens</span>
          </div>
          <div className="mt-3.5 space-y-2.5">
            {measure.civicProjects.costed.slice(0, 2).map((item) => (
              <LedgerRow key={item.name} size="sm" label={item.name} figure={`$${item.amountM}M`} />
            ))}
          </div>
        </div>
      );

    // THE PLAT in miniature: the hatched district with its boundary streets.
    case 'central-city': {
      const d = measure.ccedDistrict;
      return (
        <div className="flex justify-center border border-hairline bg-paper px-10 py-8 sm:py-9">
          <div className="relative aspect-[7/10] w-28 sm:w-32">
            <div aria-hidden="true" className="hatch absolute inset-0 border-2 border-ink" />
            <span className={cn(PLAT_LABEL, 'absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap')}>
              {d.north}
            </span>
            <span className={cn(PLAT_LABEL, 'absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap')}>
              {d.south}
            </span>
            <span
              className={cn(PLAT_LABEL, 'absolute right-full top-1/2 mr-1.5 -translate-y-1/2 rotate-180')}
              style={{ writingMode: 'vertical-rl' }}
            >
              {d.west}
            </span>
            <span
              className={cn(PLAT_LABEL, 'absolute left-full top-1/2 ml-1.5 -translate-y-1/2')}
              style={{ writingMode: 'vertical-rl' }}
            >
              {d.east}
            </span>
          </div>
        </div>
      );
    }
  }
}

// ---------------------------------------------------------------------------
// The five briefs: full-width sheets in official ballot order, each a single
// link to its question page, alternating asymmetry, natural heights.
// ---------------------------------------------------------------------------
export default function BriefStrip({ measures }: { measures: readonly Measure[] }) {
  const reduce = useReducedMotion();
  // Settles every brief (and its miniature's bars) to final state after the
  // load window even if IntersectionObserver never fires.
  const failsafe = useRevealFailsafe();

  return (
    <ol className="list-none space-y-16">
      {measures.map((m, index) => {
        const inks = accentInk(m.accent.name);
        const flip = index % 2 === 1;
        const supermajority = m.voteThreshold.toLowerCase().includes('supermajority');
        const figure =
          m.bigStat.display !== ''
            ? m.bigStat.display
            : `${m.bigStat.prefix}${m.bigStat.target}${m.bigStat.suffix}`;

        return (
          <motion.li
            key={m.slug}
            initial={reduce ? false : 'hidden'}
            animate={failsafe}
            whileInView="show"
            viewport={VIEWPORT_ONCE}
            variants={riseVariants}
            className="relative"
          >
            <Link
              href={`/questions/${m.slug}`}
              aria-label={`${m.officialQuestion.number}: ${m.name}. ${m.cardPunch} Read the full question.`}
              className="group relative block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
            >
              <FileTab color={m.accent.name} className="absolute bottom-full left-5 sm:left-7">
                {m.officialQuestion.number}
              </FileTab>

              <Sheet className="overflow-hidden">
                {/* 4% swatch wash on hover / focus */}
                <span
                  aria-hidden="true"
                  className="absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none"
                  style={{ backgroundColor: withAlpha(m.accent.swatch, 0.04) }}
                />
                <div
                  className={cn(
                    'relative grid gap-8 p-6 sm:items-center sm:gap-10 sm:p-9',
                    // Keep the text in the wide track on both alternations; the
                    // order classes alone would otherwise squeeze the text into
                    // the narrow track on flipped rows.
                    flip
                      ? 'sm:grid-cols-[minmax(240px,300px)_1fr]'
                      : 'sm:grid-cols-[1fr_minmax(240px,300px)]'
                  )}
                >
                  <div className={cn('min-w-0', flip && 'sm:order-2')}>
                    <h3 className="type-h2 text-ink decoration-2 underline-offset-4 group-hover:underline">
                      {m.name}
                    </h3>
                    <p className="type-lede mt-3 text-ink">{m.cardPunch}</p>
                    <p className="type-body mt-2 max-w-[42rem] text-ink/75">{m.cardSub}</p>

                    <div className="mt-5 max-w-md">
                      <LedgerRow
                        size="lg"
                        label={m.bigStat.label}
                        figure={figure}
                        figureColor={inks.inkOnPaper}
                      />
                    </div>

                    <div className="mt-4 flex flex-wrap items-baseline gap-x-4 gap-y-1.5">
                      <span className="type-doc-label text-coral-press">{m.costChip}</span>
                      {supermajority && (
                        <span className="type-doc-label" style={{ color: GOLDEN_NOTE_INK }}>
                          Needs 4/7 &middot; 57.1% to pass
                        </span>
                      )}
                    </div>

                    <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-coral-press">
                      Read the full question
                      <svg
                        className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>

                  <div className={cn('min-w-0', flip && 'sm:order-1')}>
                    <Miniature measure={m} />
                  </div>
                </div>
              </Sheet>
            </Link>
          </motion.li>
        );
      })}
    </ol>
  );
}
