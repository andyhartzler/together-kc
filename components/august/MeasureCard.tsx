'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { AUGUST_BALLOT } from '@/lib/constants';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { TopicIcon } from '@/components/ui/TopicIcon';
import { fadeUp, EASE } from '@/components/ui/Reveal';

export type Measure = (typeof AUGUST_BALLOT.measures)[number];

// Hub: a full-card Next Link to /questions/[slug]. The accent block (motif +
// animated big stat + measure name) is shared identity with the detail hero, so
// the card looks like a small version of the page it opens. The whole card is a
// single focusable link, so nothing inside is its own interactive element; the
// "See the full question" row is a visual affordance, not a nested link.
export default function MeasureCard({ measure, index = 0 }: { measure: Measure; index?: number }) {
  const { accent, bigStat } = measure;
  const showCounter = bigStat.display === '';
  const supermajority = measure.voteThreshold.toLowerCase().includes('supermajority');

  return (
    <motion.div
      {...fadeUp}
      transition={{ duration: 0.55, delay: index * 0.06, ease: EASE }}
      whileHover={{ y: -4, boxShadow: `0 28px 55px -20px ${accent.glow}` }}
      style={{ boxShadow: '0 12px 30px -16px rgba(30,58,95,0.18)' }}
      className="rounded-3xl"
    >
      <Link
        href={`/questions/${measure.slug}`}
        aria-label={`${measure.name}: ${measure.cardPunch} Vote YES. See the full question.`}
        className="group block rounded-3xl overflow-hidden bg-white border border-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 focus-visible:ring-offset-white"
      >
        <div className="grid sm:grid-cols-[42%_1fr]">
          {/* ACCENT BLOCK (shared identity with the detail hero) */}
          <div
            className={cn(
              'relative overflow-hidden bg-gradient-to-br p-7 sm:p-9 flex flex-col justify-between min-h-[190px] sm:min-h-[290px]',
              accent.gradient
            )}
          >
            {/* faint white grid */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.12]"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)',
                backgroundSize: '36px 36px',
              }}
            />
            {/* enlarged low-opacity motif */}
            <TopicIcon
              id={measure.motif}
              className="pointer-events-none absolute -right-7 -bottom-7 w-44 h-44 text-white/[0.08]"
            />
            {/* sheen sweep on hover */}
            <div className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-white/15 blur-xl -translate-x-full group-hover:translate-x-[450%] transition-transform duration-1000 ease-in-out motion-reduce:transition-none motion-reduce:translate-x-full" />

            <div className="relative z-10 flex items-center justify-between gap-3">
              <TopicIcon id={measure.motif} className="w-8 h-8 sm:w-9 sm:h-9 text-white/90" />
              <span className="rounded-full bg-white/15 backdrop-blur-sm text-white/90 text-[0.65rem] font-bold uppercase tracking-widest px-2.5 py-1 border border-white/15">
                {measure.officialQuestion.number}
              </span>
            </div>

            <div className="relative z-10 mt-6">
              <div
                className="text-white font-bold leading-[0.95] text-5xl sm:text-6xl md:text-7xl"
                style={{ textShadow: '0 2px 30px rgba(0,0,0,0.28)' }}
              >
                {showCounter ? (
                  <AnimatedCounter
                    end={bigStat.target}
                    prefix={bigStat.prefix}
                    suffix={bigStat.suffix}
                    decimals={bigStat.decimals}
                  />
                ) : (
                  bigStat.display
                )}
              </div>
              <div className="text-white/75 text-sm font-medium mt-2">{bigStat.label}</div>
              <div className="text-white/90 text-base sm:text-lg font-bold uppercase tracking-wide mt-3">
                {measure.name}
              </div>
            </div>
          </div>

          {/* CONTENT */}
          <div className="p-7 sm:p-9 flex flex-col justify-center">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-navy/[0.06] text-navy border border-navy/10 text-xs font-semibold px-3 py-1">
                <svg className="w-3.5 h-3.5 text-coral" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
                {measure.costChip}
              </span>
              {supermajority ? (
                <span className="inline-flex w-fit items-center rounded-full bg-golden/15 text-[#9a6b0f] border border-golden/30 text-xs font-semibold px-3 py-1">
                  Needs a four-sevenths supermajority
                </span>
              ) : null}
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold text-navy leading-snug mt-4">{measure.cardPunch}</h3>

            <p className="text-sm sm:text-base text-gray-600 leading-relaxed mt-3">{measure.cardSub}</p>

            <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-coral">
              See the full question
              <svg
                className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
