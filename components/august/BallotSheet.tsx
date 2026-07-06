'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { AUGUST_BALLOT } from '@/lib/constants';
import { accentInk, withAlpha } from '@/components/august/accent';
import {
  Sheet,
  BallotOval,
  Stamp,
  LedgerRow,
  VIEWPORT_ONCE,
  riseVariants,
  ruleDrawVariants,
  stampLandVariants,
  staggerContainer,
  useRevealFailsafe,
} from '@/components/august/paper';

type Measure = (typeof AUGUST_BALLOT.measures)[number];

// The Sample Ballot artifact: the hub's signature document. A perforated
// near-white sheet carrying the five questions in official ballot order,
// each row a full-row link whose oval ink-fills and checks as it scrolls
// into view. The footer reconciles the tally against constants (the four
// bond amounts sum to the $1.7B figure), prints the honest mechanism
// paragraph, and carries the required midterm-primary footnote. The
// RECOMMENDED stamp lands last, overlapping the total rule.
export default function BallotSheet({ measures }: { measures: readonly Measure[] }) {
  const reduce = useReducedMotion();
  // Settles every orchestrated group (ovals, tally, stamp) to final state
  // after the load window even if IntersectionObserver never fires.
  const failsafe = useRevealFailsafe();

  // Every figure on the sheet is derived from AUGUST_BALLOT. The four bond
  // questions carry dollar amounts; Central City is a rate renewal, so it
  // contributes no new authorization to the tally.
  const bondMeasures = measures.filter((m) => m.amount.startsWith('$'));
  const bondTotal = bondMeasures.reduce(
    (sum, m) => sum + Number(m.amount.replace(/[^0-9]/g, '')),
    0
  );

  return (
    <Sheet as="article" shadow="offset" perforated className="mx-auto w-full max-w-[52rem]">
      {/* LETTERHEAD */}
      <motion.header
        initial={reduce ? false : 'hidden'}
        animate={failsafe}
        whileInView="show"
        viewport={VIEWPORT_ONCE}
        variants={staggerContainer(0.08)}
        className="px-5 pt-4 text-center sm:px-8"
      >
        <motion.div variants={ruleDrawVariants} aria-hidden="true" className="rule-total origin-left" />
        <motion.p variants={riseVariants} className="type-doc-label-lg mt-4 text-ink">
          Official Ballot (Sample)
        </motion.p>
        <motion.p variants={riseVariants} className="type-fine mt-1">
          Issues Only &middot; Kansas City, Missouri &middot; August 4, 2026
        </motion.p>
        <motion.p variants={riseVariants} className="mt-2.5">
          <span className="type-doc-label inline-block border border-hairline px-2.5 py-1 text-ink-soft">
            Sample, for voter education
          </span>
        </motion.p>
        <motion.div
          variants={ruleDrawVariants}
          aria-hidden="true"
          className="rule-total mt-4 origin-left"
        />
      </motion.header>

      {/* THE FIVE QUESTIONS, official ballot order */}
      <motion.ul
        initial={reduce ? false : 'hidden'}
        animate={failsafe}
        whileInView="show"
        viewport={VIEWPORT_ONCE}
        variants={staggerContainer(0.12)}
        className="list-none"
      >
        {measures.map((m, i) => {
          const inks = accentInk(m.accent.name);
          return (
            <motion.li key={m.slug} variants={riseVariants} className={cn(i > 0 && 'rule-hair')}>
              <Link
                href={`/questions/${m.slug}`}
                aria-label={`${m.officialQuestion.number}: ${m.name}. ${m.cardPunch} Read the full question.`}
                className="group relative flex items-start gap-4 px-5 py-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-coral sm:gap-5 sm:px-8 sm:py-6"
              >
                {/* 3% swatch wash on hover / focus */}
                <span
                  aria-hidden="true"
                  className="absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none"
                  style={{ backgroundColor: withAlpha(m.accent.swatch, 0.05) }}
                />
                {/* Ovals fill then check in ballot order, 120ms apart. */}
                <BallotOval animate="parent" delay={i * 0.12} className="relative mt-0.5" />
                <span className="relative min-w-0 flex-1">
                  <span className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
                    <span className="type-doc-label" style={{ color: inks.inkOnPaper }}>
                      {m.officialQuestion.number}
                    </span>
                    <span className="type-doc-label text-coral-press">{m.costChip}</span>
                  </span>
                  <span className="mt-1 block text-lg font-extrabold leading-tight text-ink decoration-2 underline-offset-[3px] group-hover:underline sm:text-xl">
                    {m.name}
                  </span>
                  <span className="mt-0.5 block text-sm leading-relaxed text-ink/75 sm:text-[0.9375rem]">
                    {m.cardPunch}
                  </span>
                </span>
                <svg
                  className="relative mt-1.5 h-4 w-4 shrink-0 text-ink/30 transition-all duration-200 group-hover:translate-x-1 group-hover:text-coral-press motion-reduce:transition-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </motion.li>
          );
        })}
      </motion.ul>

      {/* TALLY + FINE PRINT + STAMP (stamp lands last, over the total rule) */}
      <motion.footer
        initial={reduce ? false : 'hidden'}
        animate={failsafe}
        whileInView="show"
        viewport={VIEWPORT_ONCE}
        variants={staggerContainer(0.1)}
        className="relative px-5 pb-6 sm:px-8 sm:pb-8"
      >
        <motion.div variants={ruleDrawVariants} aria-hidden="true" className="rule-total origin-left" />

        <div className="mt-14 space-y-3 sm:mt-4 sm:pr-52">
          <motion.div variants={riseVariants}>
            <LedgerRow label="Four bond questions" figure={`$${bondTotal.toLocaleString('en-US')}`} />
          </motion.div>
          <motion.div variants={riseVariants}>
            <LedgerRow label="New tax rate on any question" figure="$0.00" />
          </motion.div>
        </div>

        <motion.p variants={riseVariants} className="type-fine mt-5 max-w-[46rem]">
          The four bond questions total $1.7 billion. Water and sewer are revenue bonds repaid from
          utility fees; housing and civic buildings are general-obligation bonds that hold the
          property-tax rate flat by replacing retiring debt. Central City renews an existing
          one-eighth-cent sales tax at the same rate, so no question raises the tax rate.
        </motion.p>
        <motion.p variants={riseVariants} className="type-fine mt-3 max-w-[46rem]">
          This sample shows only the five City of Kansas City questions. August 4, 2026 is a primary
          election, and your ballot will include other races. Confirm your authenticated sample
          ballot with the{' '}
          <a
            href="https://kceb.org/elections/ballot/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-ink underline decoration-2 underline-offset-[3px] transition-colors hover:text-coral-press focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral"
          >
            Kansas City Election Board
          </a>
          .
        </motion.p>

        {/* The wrapper animates the landing (rotates to rest at -3deg), so the
            Stamp itself renders unrotated. Reduced motion: the wrapper carries
            no variants and the Stamp prints its own final rotation. */}
        <motion.span
          variants={reduce ? undefined : stampLandVariants}
          className="absolute top-3 right-4 inline-block sm:-top-6 sm:right-8"
        >
          <Stamp size="md" rotate={reduce ? -3 : 0} className="text-center">
            <span className="block">Recommended:</span>
            <span className="block">Yes on all five</span>
          </Stamp>
        </motion.span>
      </motion.footer>
    </Sheet>
  );
}
