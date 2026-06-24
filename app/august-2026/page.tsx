'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence, useInView, useMotionValue, useTransform, animate } from 'framer-motion';
import { cn } from '@/lib/utils';
import { AUGUST_BALLOT } from '@/lib/constants';
import Accordion from '@/components/ui/Accordion';
import { InteractiveHoverButton } from '@/components/ui/InteractiveHoverButton';
import { FlipText } from '@/components/ui/FlipText';
import Footer from '@/components/layout/Footer';

const { hero, questions, costsShort, voteSteps, howToVote, faqsSection, faqs, closing, exploreLinks } = AUGUST_BALLOT;

// Bold two-tone color block per measure (white number sits on these).
const BLOCK: Record<string, string> = {
  'clean-water': 'from-sky to-navy',
  sewers: 'from-navy via-navy to-sky',
  housing: 'from-coral to-[#8f1815]',
  'civic-buildings': 'from-coral via-coral to-golden',
  'central-city': 'from-sky to-coral',
};
const NUMLABEL: Record<string, string> = {
  'clean-water': 'in water bonds',
  sewers: 'in sewer bonds',
  housing: 'in housing bonds',
  'civic-buildings': 'in repair bonds',
  'central-city': 'renewed 10 years',
};

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
};

// ---------------------------------------------------------------------------
function AnimatedCounter({
  end,
  decimals = 0,
  prefix = '',
  suffix = '',
  duration = 1.8,
}: {
  end: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const mv = useMotionValue(0);
  const rounded = useTransform(
    mv,
    (v) => prefix + v.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + suffix
  );
  const [disp, setDisp] = useState(prefix + (0).toFixed(decimals) + suffix);
  useEffect(() => {
    if (!inView) return;
    const controls = animate(mv, end, { duration, ease: [0.25, 0.46, 0.45, 0.94] });
    const unsub = rounded.on('change', (v) => setDisp(v));
    return () => {
      controls.stop();
      unsub();
    };
  }, [inView, end, duration, mv, rounded]);
  return <span ref={ref}>{disp}</span>;
}

// ---------------------------------------------------------------------------
function TopicIcon({ id, className }: { id: string; className?: string }) {
  const common = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  switch (id) {
    case 'clean-water':
      return (
        <svg viewBox="0 0 24 24" className={className} {...common}>
          <path d="M12 3c3.6 4.6 6 7.2 6 10.2a6 6 0 0 1-12 0C6 10.2 8.4 7.6 12 3z" />
          <path d="M9.5 13.5a2.5 2.5 0 0 0 2.5 2.5" />
        </svg>
      );
    case 'sewers':
      return (
        <svg viewBox="0 0 24 24" className={className} {...common}>
          <path d="M2 8c1.8-2 3.7-2 5.5 0s3.7 2 5.5 0 3.7-2 5.5 0" />
          <path d="M2 13c1.8-2 3.7-2 5.5 0s3.7 2 5.5 0 3.7-2 5.5 0" />
          <path d="M2 18c1.8-2 3.7-2 5.5 0s3.7 2 5.5 0 3.7-2 5.5 0" />
        </svg>
      );
    case 'housing':
      return (
        <svg viewBox="0 0 24 24" className={className} {...common}>
          <path d="M3 11.5 12 4l9 7.5" />
          <path d="M5.5 10v9.5h13V10" />
          <path d="M10 19.5v-5h4v5" />
        </svg>
      );
    case 'civic-buildings':
      return (
        <svg viewBox="0 0 24 24" className={className} {...common}>
          <path d="M3 9.5 12 4l9 5.5" />
          <path d="M5 9.5V18M9 9.5V18M15 9.5V18M19 9.5V18" />
          <path d="M3.5 18h17M3 21h18" />
        </svg>
      );
    case 'central-city':
    default:
      return (
        <svg viewBox="0 0 24 24" className={className} {...common}>
          <path d="M3 21V9l4-2.2V21" />
          <path d="M9 21V4.5l5-2.5V21" />
          <path d="M16 21v-9l5-2.2V21" />
          <path d="M2 21h20" />
        </svg>
      );
  }
}

// ---------------------------------------------------------------------------
function Marquee({ items }: { items: string[] }) {
  return (
    <div className="relative flex overflow-hidden">
      <div className="flex w-max animate-marquee motion-reduce:animate-none">
        {[0, 1].map((dup) => (
          <div key={dup} className="flex shrink-0 items-center" aria-hidden={dup === 1 ? true : undefined}>
            {items.map((t, i) => (
              <div key={i} className="flex items-center">
                <span className="text-base sm:text-xl font-extrabold uppercase tracking-tight whitespace-nowrap">{t}</span>
                <svg className="mx-5 sm:mx-7 w-3.5 h-3.5 shrink-0 opacity-70" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.8 5 21.4l1.4-6.8L1.3 9.9l6.9-.8z" />
                </svg>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
function QuestionPanel({ q }: { q: (typeof AUGUST_BALLOT.questions)[number] }) {
  const [open, setOpen] = useState(false);
  const showCounter = q.bigStat.display === '';

  return (
    <motion.article
      id={q.anchorId}
      {...fadeUp}
      transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -4 }}
      className="scroll-mt-24 group rounded-3xl overflow-hidden bg-white border border-gray-100 shadow-xl shadow-navy/5"
    >
      <div className="grid sm:grid-cols-[42%_1fr]">
        {/* NUMBER BLOCK */}
        <div className={cn('relative overflow-hidden bg-gradient-to-br p-7 sm:p-9 flex flex-col justify-between min-h-[180px] sm:min-h-[280px]', BLOCK[q.anchorId])}>
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.12]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)',
              backgroundSize: '36px 36px',
            }}
          />
          <div className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-white/15 blur-xl -translate-x-full group-hover:translate-x-[450%] transition-transform duration-1000 ease-in-out" />

          <div className="relative z-10 flex items-center justify-between">
            <TopicIcon id={q.anchorId} className="w-8 h-8 sm:w-9 sm:h-9 text-white/90" />
            <span className="text-white/70 text-[0.7rem] font-semibold uppercase tracking-widest">{q.eyebrow}</span>
          </div>

          <div className="relative z-10 mt-6">
            <div
              className="text-white font-bold leading-[0.95] text-5xl sm:text-6xl md:text-7xl"
              style={{ textShadow: '0 2px 30px rgba(0,0,0,0.28)' }}
            >
              {showCounter ? (
                <AnimatedCounter end={q.bigStat.target} prefix={q.bigStat.prefix} suffix={q.bigStat.suffix} decimals={q.bigStat.decimals} />
              ) : (
                q.bigStat.display
              )}
            </div>
            <div className="text-white/75 text-sm font-medium mt-2">{NUMLABEL[q.anchorId]}</div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-7 sm:p-9 flex flex-col justify-center">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-navy/[0.06] text-navy border border-navy/10 text-xs font-semibold px-3 py-1">
            <svg className="w-3.5 h-3.5 text-coral" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
            {q.costChip}
          </span>

          <h3 className="text-2xl sm:text-3xl font-bold text-navy leading-snug mt-4">{q.punch}</h3>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-3 mt-6">
            <InteractiveHoverButton text={q.yesCta} href="#vote" variant="primary" />
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy/55 hover:text-coral transition-colors"
            >
              {open ? 'Show less' : 'Why it matters'}
              <motion.svg
                animate={{ rotate: open ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </motion.svg>
            </button>
          </div>

          <AnimatePresence initial={false}>
            {open && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="overflow-hidden"
              >
                <div className="pt-5 mt-5 border-t border-gray-100 space-y-3">
                  <p className="text-sm text-gray-600 leading-relaxed">{q.body}</p>
                  <p className="text-sm text-navy/80 leading-relaxed bg-light-gray/70 rounded-xl p-3.5 border border-gray-100">
                    {q.costLine}
                  </p>
                  <p className="text-xs text-gray-400 leading-relaxed">{q.sourceNote}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.article>
  );
}

// ===========================================================================
export default function AugustBallotPage() {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* ================================================================= */}
      {/* HERO                                                               */}
      {/* ================================================================= */}
      <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden">
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
          className="relative z-20 text-center px-4 pt-12 pb-28 sm:pt-16 sm:pb-32 max-w-4xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } } }}
        >
          <motion.div
            variants={{ hidden: { opacity: 0, y: -16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
            className="flex justify-center mb-8 sm:mb-10"
          >
            <Image src="/images/together-kc-footer.png" alt="Together KC" width={240} height={92} className="h-12 sm:h-14 md:h-16 w-auto" priority />
          </motion.div>

          <motion.div
            variants={{ hidden: { opacity: 0, scale: 0.85 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.5, type: 'spring', stiffness: 200 } } }}
            className="flex justify-center mb-7 sm:mb-9"
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm text-white px-4 py-2 text-xs sm:text-sm font-semibold border border-white/20">
              <span className="w-2 h-2 rounded-full bg-coral animate-pulse" />
              {hero.eyebrow}
            </span>
          </motion.div>

          <motion.h1
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.6 } } }}
            className="text-5xl sm:text-7xl md:text-8xl font-bold text-white leading-[0.98] tracking-tight"
          >
            Vote{' '}
            <span className="text-coral" style={{ textShadow: '0 0 40px rgba(229,57,53,0.55), 0 0 80px rgba(229,57,53,0.3)' }}>
              YES
            </span>
            <br />
            on all five.
          </motion.h1>

          <motion.div
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.6 } } }}
            className="mt-5 sm:mt-7 flex justify-center"
          >
            <FlipText
              words={[...hero.flipWords]}
              duration={1800}
              className="text-2xl sm:text-3xl md:text-4xl text-coral"
            />
          </motion.div>

          <motion.div
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.6 } } }}
            className="mt-7 sm:mt-9 flex flex-wrap items-center justify-center gap-3 sm:gap-4"
          >
            {hero.hook.map((h) => (
              <div key={h.label} className="glass rounded-2xl px-5 py-3 border border-white/15 flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-bold text-white tabular-nums">
                  {h.display ? h.display : <AnimatedCounter end={h.target} prefix={h.prefix} suffix={h.suffix} decimals={h.decimals} />}
                </span>
                <span className="text-white/70 text-xs sm:text-sm">{h.label}</span>
              </div>
            ))}
          </motion.div>

          <motion.div
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.6 } } }}
            className="mt-9 sm:mt-11 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
          >
            <InteractiveHoverButton text="See the five" href="#questions" variant="primary" size="lg" arrowDirection="down" />
            <InteractiveHoverButton text="How to vote" href="#vote" variant="outline" size="lg" />
          </motion.div>
        </motion.div>

        <motion.a
          href="#questions"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.5 }}
          className="absolute bottom-16 sm:bottom-20 left-1/2 -translate-x-1/2 z-20"
          aria-label="Scroll to the five questions"
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center animate-bounce motion-reduce:animate-none">
            <div className="w-1.5 h-3 bg-white/50 rounded-full mt-2" />
          </div>
        </motion.a>
      </section>

      {/* ================================================================= */}
      {/* MARQUEE BAND                                                       */}
      {/* ================================================================= */}
      <div className="bg-coral text-white py-3 sm:py-3.5 border-y border-white/10">
        <Marquee items={['Vote Yes', 'August 4, 2026', 'No New Taxes', 'Five Questions', 'Five Yeses']} />
      </div>

      {/* ================================================================= */}
      {/* THE FIVE QUESTIONS                                                 */}
      {/* ================================================================= */}
      <section id="questions" className="relative py-16 sm:py-24 bg-gradient-to-b from-white via-light-gray/40 to-white scroll-mt-4">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} transition={{ duration: 0.6 }} className="text-center mb-11 sm:mb-14">
            <span className="inline-flex items-center gap-2 rounded-full bg-coral/10 text-coral text-sm font-semibold border border-coral/20 px-4 py-1.5 mb-5">
              <span className="w-2 h-2 rounded-full bg-coral animate-pulse" />
              On your ballot
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold text-navy leading-tight">Five questions. Five yeses.</h2>
          </motion.div>

          <div className="space-y-6 sm:space-y-8">
            {questions.map((q) => (
              <QuestionPanel key={q.anchorId} q={q} />
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* THE $0 MOMENT                                                      */}
      {/* ================================================================= */}
      <section className="relative py-20 sm:py-28 bg-navy overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/4 right-0 w-1/2 h-2/3 bg-sky/15 rounded-full blur-3xl animate-drift motion-reduce:animate-none" />
          <div className="absolute -bottom-1/3 -left-1/4 w-1/2 h-2/3 bg-coral/15 rounded-full blur-3xl animate-drift motion-reduce:animate-none" style={{ animationDelay: '-9s' }} />
        </div>

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, type: 'spring', stiffness: 130, damping: 16 }}
          >
            <div className="text-7xl sm:text-8xl md:text-9xl font-bold text-white leading-none" style={{ textShadow: '0 0 50px rgba(229,57,53,0.45)' }}>
              {costsShort.big}
            </div>
            <p className="text-lg sm:text-xl text-white/60 font-medium mt-2 uppercase tracking-widest">{costsShort.sub}</p>
          </motion.div>

          <motion.h2 {...fadeUp} transition={{ duration: 0.7, delay: 0.1 }} className="text-2xl sm:text-4xl font-bold text-white mt-8 sm:mt-10 leading-tight">
            {costsShort.headline}
          </motion.h2>

          <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.2 }} className="mt-9 sm:mt-11 flex flex-wrap justify-center gap-3">
            {costsShort.chips.map((chip) => (
              <span key={chip} className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 text-white/90 text-sm font-medium px-4 py-2">
                <svg className="w-4 h-4 text-coral shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
                {chip}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* HOW TO VOTE                                                        */}
      {/* ================================================================= */}
      <section id="vote" className="relative py-16 sm:py-24 bg-white scroll-mt-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} transition={{ duration: 0.6 }} className="text-center mb-11 sm:mb-14">
            <span className="inline-flex items-center gap-2 rounded-full bg-coral/10 text-coral text-sm font-semibold border border-coral/20 px-4 py-1.5 mb-5">
              <span className="w-2 h-2 rounded-full bg-coral animate-pulse" />
              {howToVote.eyebrow}
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold text-navy leading-tight">Make your plan to vote</h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-11 sm:mb-12">
            {voteSteps.map((s, i) => (
              <motion.div
                key={s.date}
                {...fadeUp}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative bg-white rounded-2xl p-6 sm:p-7 shadow-xl shadow-navy/5 border border-gray-100 overflow-hidden text-center sm:text-left"
              >
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-coral via-golden to-sky" />
                <p className="text-[0.7rem] uppercase tracking-widest font-semibold text-coral mb-2">{s.kicker}</p>
                <p className="text-2xl sm:text-3xl font-bold text-navy leading-tight">{s.date}</p>
                <p className="text-sm sm:text-base text-gray-600 mt-1">{s.title}</p>
                {'sub' in s && s.sub ? <p className="text-xs text-gray-400 mt-1.5">{s.sub}</p> : null}
              </motion.div>
            ))}
          </div>

          <motion.div {...fadeUp} transition={{ duration: 0.6 }} className="text-center">
            <InteractiveHoverButton text="Find your polling place" href="/vote" variant="secondary" size="lg" />
            <p className="text-xs sm:text-sm text-gray-400 max-w-xl mx-auto mt-5 leading-relaxed">{howToVote.pollingNote}</p>
          </motion.div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* FAQ                                                                */}
      {/* ================================================================= */}
      <section className="relative py-16 sm:py-24 bg-gradient-to-b from-light-gray/40 to-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} transition={{ duration: 0.6 }} className="text-center mb-10 sm:mb-12">
            <span className="inline-flex items-center gap-2 rounded-full bg-coral/10 text-coral text-sm font-semibold border border-coral/20 px-4 py-1.5 mb-5">
              <span className="w-2 h-2 rounded-full bg-coral animate-pulse" />
              {faqsSection.eyebrow}
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold text-navy leading-tight">{faqsSection.heading}</h2>
          </motion.div>
          <Accordion items={faqs} />
        </div>
      </section>

      {/* ================================================================= */}
      {/* CLOSING + EXPLORE                                                  */}
      {/* ================================================================= */}
      <section className="relative pt-20 sm:pt-28 pb-12 sm:pb-16 bg-navy overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/4 left-1/4 w-1/2 h-2/3 bg-coral/15 rounded-full blur-3xl animate-drift motion-reduce:animate-none" />
          <div className="absolute -bottom-1/4 right-0 w-1/2 h-2/3 bg-sky/15 rounded-full blur-3xl animate-drift motion-reduce:animate-none" style={{ animationDelay: '-10s' }} />
        </div>

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2 {...fadeUp} transition={{ duration: 0.7 }} className="text-3xl sm:text-5xl md:text-6xl font-bold text-white leading-tight">
            {closing.heading}
          </motion.h2>

          <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.12 }} className="mt-9 flex justify-center">
            <InteractiveHoverButton text={closing.cta} href="/vote" variant="primary" size="lg" />
          </motion.div>

          <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.2 }} className="mt-16 sm:mt-20">
            <p className="text-white/40 text-xs sm:text-sm font-medium uppercase tracking-widest mb-5 sm:mb-6">Explore the Full Website</p>
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
              {exploreLinks.map((link) => (
                <motion.div key={link.href} whileHover={{ y: -3, scale: 1.03 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }}>
                  <Link
                    href={link.href}
                    className="inline-block px-6 py-3 sm:px-7 sm:py-3.5 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold text-sm sm:text-base rounded-full hover:bg-white hover:text-navy transition-all duration-200"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
