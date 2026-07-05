'use client';

import Link from 'next/link';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { cn } from '@/lib/utils';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { TopicIcon } from '@/components/ui/TopicIcon';
import { fadeUp, EASE } from '@/components/ui/Reveal';
import { inkOnWhite } from '@/components/august/accent';

// BallotSnapshot is the hub centerpiece: a stylized paper-ballot scorecard that
// lists all five August 4 questions in real ballot order (Question 1 to 5). Each
// row carries its official Question number, the measure name, a one-line punch,
// an accent dot, and a YES checkbox whose accent fill pops in and whose white
// check draws on, staggered, so the five marks "fill in" one by one on scroll.
// The bottom tally counts up the $1.7B bond total and holds the honest "$0 new
// tax rate" framing. Reduced motion renders every check already filled with no
// count-up. The component reads only the fields it needs, so it accepts the full
// AUGUST_BALLOT.measures array (or any structurally compatible subset).

export interface BallotSnapshotMeasure {
  slug: string;
  name: string;
  motif: string;
  cardPunch: string;
  costChip: string;
  officialQuestion: { number: string };
  accent: { swatch: string; name: string };
}

export interface BallotSnapshotProps {
  measures: readonly BallotSnapshotMeasure[];
  className?: string;
}

// Pull the integer out of "Question 4" so the scorecard reads top to bottom in
// the order voters actually see on the ballot, regardless of the data ordering.
function questionNumber(label: string): number {
  const match = label.match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
}

const listVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.16, delayChildren: 0.2 } },
};

const rowVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

const fillVariants: Variants = {
  hidden: { scale: 0, opacity: 0 },
  show: {
    scale: 1,
    opacity: 1,
    transition: { type: 'spring', stiffness: 380, damping: 20, delay: 0.05 },
  },
};

const drawVariants: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  show: { pathLength: 1, opacity: 1, transition: { duration: 0.45, ease: EASE, delay: 0.18 } },
};

export default function BallotSnapshot({ measures, className }: BallotSnapshotProps) {
  const reduce = useReducedMotion();
  const ordered = [...measures].sort(
    (a, b) => questionNumber(a.officialQuestion.number) - questionNumber(b.officialQuestion.number)
  );

  return (
    <div className={cn('mx-auto w-full max-w-4xl', className)}>
      <motion.div
        {...(reduce ? {} : fadeUp)}
        transition={reduce ? undefined : { duration: 0.6, ease: EASE }}
        style={{ boxShadow: '0 36px 80px -42px rgba(30,58,95,0.45)' }}
        className="relative overflow-hidden rounded-[28px] border border-navy/10 bg-white"
      >
        {/* faint navy ruling, the texture of a paper ballot */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(30,58,95,0.9) 1px, transparent 1px), linear-gradient(90deg, rgba(30,58,95,0.9) 1px, transparent 1px)',
            backgroundSize: '34px 34px',
          }}
        />
        {/* accent ribbon across the top edge */}
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-1.5"
          style={{
            background:
              'linear-gradient(90deg, #1e3a5f 0%, #4a90d9 30%, #f5a623 60%, #e53935 100%)',
          }}
        />

        {/* HEADER */}
        <div className="relative px-6 pt-9 pb-6 sm:px-10 sm:pt-11">
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.22em] text-coral">
            Your ballot, at a glance
          </p>
          <h2 className="mt-2 text-3xl font-bold leading-[1.05] text-navy sm:text-4xl">
            Your August 4 ballot
          </h2>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-gray-600">
            Five questions for Kansas City. We recommend voting YES on every one.
          </p>
          <p className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-navy/70">
            <svg className="h-4 w-4 text-navy/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3M4 11h16M5 5h14a1 1 0 011 1v13a1 1 0 01-1 1H5a1 1 0 01-1-1V6a1 1 0 011-1z"
              />
            </svg>
            Tuesday, August 4, 2026
          </p>
        </div>

        {/* perforation, the tear line of a ballot stub */}
        <div aria-hidden className="relative px-6 sm:px-10">
          <div className="border-t border-dashed border-navy/15" />
        </div>

        {/* ROWS */}
        <motion.ul
          variants={listVariants}
          initial={reduce ? 'show' : 'hidden'}
          whileInView={reduce ? undefined : 'show'}
          viewport={{ once: true, margin: '-60px' }}
          className="relative divide-y divide-navy/[0.07] px-2 sm:px-4"
        >
          {ordered.map((measure) => {
            const swatch = measure.accent.swatch;
            const checkColor = measure.accent.name === 'Golden' ? '#1e3a5f' : '#ffffff';
            return (
              <motion.li key={measure.slug} variants={rowVariants}>
                <Link
                  href={`/questions/${measure.slug}`}
                  aria-label={`${measure.officialQuestion.number}, ${measure.name}: ${measure.cardPunch} Vote YES. See the full question.`}
                  className="group relative grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-2xl px-4 py-4 outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 focus-visible:ring-offset-white sm:grid-cols-[auto_auto_1fr_auto] sm:gap-5 sm:px-5"
                >
                  {/* accent hover wash */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-[0.06] motion-reduce:transition-none"
                    style={{ backgroundColor: swatch }}
                  />

                  {/* YES checkbox: the kinetic mark */}
                  <div className="relative z-10 flex flex-col items-center gap-1">
                    <div
                      className="relative grid h-10 w-10 place-items-center rounded-xl border-2 bg-white"
                      style={{ borderColor: swatch }}
                    >
                      <motion.span
                        aria-hidden
                        variants={fillVariants}
                        className="absolute inset-[3px] rounded-lg"
                        style={{ backgroundColor: swatch }}
                      />
                      <svg
                        className="relative h-6 w-6"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden
                      >
                        <motion.path
                          d="M5 13l4 4L19 7"
                          variants={drawVariants}
                          stroke={checkColor}
                          strokeWidth={3}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <span
                      className="text-[0.6rem] font-extrabold uppercase tracking-[0.14em]"
                      style={{ color: inkOnWhite(swatch) }}
                    >
                      Yes
                    </span>
                  </div>

                  {/* measure mark, shares the per-measure motif identity */}
                  <div
                    className="relative z-10 hidden h-11 w-11 place-items-center rounded-xl sm:grid"
                    style={{ backgroundColor: `${swatch}1a` }}
                  >
                    <TopicIcon id={measure.motif} className="h-6 w-6" style={{ color: swatch }} />
                  </div>

                  {/* content */}
                  <div className="relative z-10 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        aria-hidden
                        className="h-2 w-2 shrink-0 rounded-full"
                        style={{ backgroundColor: swatch }}
                      />
                      <span className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-gray-500">
                        {measure.officialQuestion.number}
                      </span>
                      <span className="text-[0.7rem] font-semibold text-gray-400">
                        {measure.costChip}
                      </span>
                    </div>
                    <h3 className="mt-1 truncate text-lg font-bold leading-tight text-navy sm:text-xl">
                      {measure.name}
                    </h3>
                    <p className="mt-0.5 truncate text-sm text-gray-600">{measure.cardPunch}</p>
                  </div>

                  {/* affordance */}
                  <svg
                    className="relative z-10 h-5 w-5 text-gray-300 transition-all duration-200 group-hover:translate-x-1 group-hover:text-coral motion-reduce:transition-none"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </motion.li>
            );
          })}
        </motion.ul>

        {/* TALLY */}
        <motion.div
          {...(reduce ? {} : fadeUp)}
          transition={reduce ? undefined : { duration: 0.6, delay: 0.1, ease: EASE }}
          className="relative mt-2 overflow-hidden rounded-b-[28px] bg-navy px-6 py-7 sm:px-10"
          aria-label="Across the August 4 ballot: 1.7 billion dollars in bonds, and zero new tax rate."
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage:
                'radial-gradient(circle at 18% 20%, rgba(255,255,255,0.9) 0, transparent 45%), radial-gradient(circle at 85% 80%, rgba(74,144,217,0.9) 0, transparent 50%)',
            }}
          />
          <div className="relative grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <div className="text-4xl font-bold leading-none text-white sm:text-5xl">
                <AnimatedCounter end={1.7} decimals={1} prefix="$" suffix="B" />
              </div>
              <p className="mt-2 text-sm font-medium text-white/70">
                in bonds across the four bond questions
              </p>
            </div>
            <div className="sm:border-l sm:border-white/15 sm:pl-6">
              <div className="text-4xl font-bold leading-none text-white sm:text-5xl">$0</div>
              <p className="mt-2 text-sm font-medium text-white/70">new tax rate on any question</p>
            </div>
          </div>
          <p className="relative mt-5 max-w-2xl text-xs leading-relaxed text-white/55">
            The four bond questions total $1.7 billion. Water and sewer are revenue bonds repaid from
            utility fees; housing and civic buildings are general-obligation bonds that hold the
            property-tax rate flat by replacing retiring debt. Central City renews an existing
            one-eighth-cent sales tax at the same rate, so no question raises the tax rate.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
