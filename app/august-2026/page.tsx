'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { AUGUST_BALLOT } from '@/lib/constants';
import Accordion from '@/components/ui/Accordion';
import { InteractiveHoverButton } from '@/components/ui/InteractiveHoverButton';
import { FlipText } from '@/components/ui/FlipText';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { Marquee } from '@/components/ui/Marquee';
import { fadeUp, EASE } from '@/components/ui/Reveal';
import MeasureCard from '@/components/august/MeasureCard';
import BallotSnapshot from '@/components/august/BallotSnapshot';
import BarChartReveal from '@/components/august/BarChartReveal';
import Footer from '@/components/layout/Footer';

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

// Render the hub cards in official ballot order (Question 1 to 5) so they match
// the BallotSnapshot scorecard above. The source measures array keeps its own
// order for detail-page prev/next, so we sort a copy here for display only.
const ballotOrderNum = (m: (typeof measures)[number]) =>
  parseInt(m.officialQuestion.number.replace(/\D/g, ''), 10);
const cardMeasures = [...measures].sort((a, b) => ballotOrderNum(a) - ballotOrderNum(b));

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

        {/* Top padding clears the fixed transparent nav (h-16 / md:h-20); the
            nav now carries the Together KC wordmark, so the hero no longer
            repeats it. */}
        <motion.div
          className="relative z-20 text-center px-4 pt-28 pb-28 sm:pt-32 sm:pb-32 max-w-4xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } } }}
        >
          <motion.div
            variants={{ hidden: { opacity: 0, scale: 0.85 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.5, type: 'spring', stiffness: 200 } } }}
            className="flex justify-center mb-7 sm:mb-9"
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm text-white px-4 py-2 text-xs sm:text-sm font-semibold border border-white/20">
              <span className="w-2 h-2 rounded-full bg-coral animate-pulse motion-reduce:animate-none" />
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
            <FlipText words={[...hero.flipWords]} duration={1800} className="text-2xl sm:text-3xl md:text-4xl text-coral" />
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
      {/* BALLOT SNAPSHOT (kinetic centerpiece, leads into the card grid)    */}
      {/* ================================================================= */}
      <section className="relative py-16 sm:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} transition={{ duration: 0.6, ease: EASE }} className="text-center mb-10 sm:mb-12">
            <span className="inline-flex items-center gap-2 rounded-full bg-coral/10 text-coral text-sm font-semibold border border-coral/20 px-4 py-1.5 mb-5">
              <span className="w-2 h-2 rounded-full bg-coral animate-pulse motion-reduce:animate-none" />
              Sample ballot
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold text-navy leading-tight">Here is what your YES looks like</h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto mt-5 leading-relaxed">
              Five questions, in the order you will see them. Tap any one for the full breakdown below.
            </p>
          </motion.div>

          <BallotSnapshot measures={measures} />
        </div>
      </section>

      {/* ================================================================= */}
      {/* THE FIVE MEASURES (clickable hub cards -> detail pages)            */}
      {/* ================================================================= */}
      <section id="questions" className="relative py-16 sm:py-24 bg-gradient-to-b from-white via-light-gray/40 to-white scroll-mt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} transition={{ duration: 0.6, ease: EASE }} className="text-center mb-11 sm:mb-14">
            <span className="inline-flex items-center gap-2 rounded-full bg-coral/10 text-coral text-sm font-semibold border border-coral/20 px-4 py-1.5 mb-5">
              <span className="w-2 h-2 rounded-full bg-coral animate-pulse motion-reduce:animate-none" />
              {questionsSection.eyebrow}
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold text-navy leading-tight">Five questions. Five yeses.</h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto mt-5 leading-relaxed">
              Tap any question for the full breakdown, the official ballot language, and the sources behind it.
            </p>
          </motion.div>

          <div className="space-y-6 sm:space-y-8">
            {cardMeasures.map((m, i) => (
              <MeasureCard key={m.slug} measure={m} index={i} />
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

          <motion.h2 {...fadeUp} transition={{ duration: 0.7, delay: 0.1, ease: EASE }} className="text-2xl sm:text-4xl font-bold text-white mt-8 sm:mt-10 leading-tight">
            {costsShort.headline}
          </motion.h2>

          <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.2, ease: EASE }} className="mt-9 sm:mt-11 flex flex-wrap justify-center gap-3">
            {costsShort.chips.map((chip) => (
              <span key={chip} className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 text-white/90 text-sm font-medium px-4 py-2">
                <svg className="w-4 h-4 text-coral shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
                {chip}
              </span>
            ))}
          </motion.div>

          <motion.div
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
            className="mt-12 sm:mt-14 rounded-3xl bg-white p-6 sm:p-9 text-left shadow-2xl shadow-black/30"
          >
            <BarChartReveal
              heading="Where the $1.7 billion goes"
              rows={[
                { label: 'Clean Water (Question 4)', value: 750_000_000 },
                { label: 'Sewers (Question 5)', value: 750_000_000 },
                { label: 'Affordable Housing (Question 1)', value: 100_000_000 },
                { label: 'Civic Buildings (Question 2)', value: 100_000_000 },
              ]}
              total={1_700_000_000}
              accent="#e53935"
              caption="The four bond questions total $1.7 billion. Question 3 (Central City) is a sales-tax renewal, not a bond, so it carries no new authorization."
            />
          </motion.div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* HOW TO VOTE                                                        */}
      {/* ================================================================= */}
      <section id="vote" className="relative py-16 sm:py-24 bg-white scroll-mt-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} transition={{ duration: 0.6, ease: EASE }} className="text-center mb-11 sm:mb-14">
            <span className="inline-flex items-center gap-2 rounded-full bg-coral/10 text-coral text-sm font-semibold border border-coral/20 px-4 py-1.5 mb-5">
              <span className="w-2 h-2 rounded-full bg-coral animate-pulse motion-reduce:animate-none" />
              {howToVote.eyebrow}
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold text-navy leading-tight">Make your plan to vote</h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-11 sm:mb-12">
            {voteSteps.map((s, i) => (
              <motion.div
                key={s.date}
                {...fadeUp}
                transition={{ duration: 0.5, delay: i * 0.1, ease: EASE }}
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

          <motion.div {...fadeUp} transition={{ duration: 0.6, ease: EASE }} className="text-center">
            <InteractiveHoverButton text="Find your polling place" href="/vote" variant="secondary" size="lg" />
            <p className="text-xs sm:text-sm text-gray-400 max-w-xl mx-auto mt-5 leading-relaxed">{howToVote.pollingNote}</p>
          </motion.div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* SHORT FAQ (deep answers live on each measure page)                 */}
      {/* ================================================================= */}
      <section id="faqs" className="relative py-16 sm:py-24 bg-gradient-to-b from-light-gray/40 to-white scroll-mt-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} transition={{ duration: 0.6, ease: EASE }} className="text-center mb-10 sm:mb-12">
            <span className="inline-flex items-center gap-2 rounded-full bg-coral/10 text-coral text-sm font-semibold border border-coral/20 px-4 py-1.5 mb-5">
              <span className="w-2 h-2 rounded-full bg-coral animate-pulse motion-reduce:animate-none" />
              {faqsSection.eyebrow}
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold text-navy leading-tight">{faqsSection.heading}</h2>
          </motion.div>
          <Accordion items={shortFaqs} />

          <motion.div {...fadeUp} transition={{ duration: 0.6, ease: EASE }} className="text-center mt-9 sm:mt-10">
            <Link
              href="#questions"
              className="inline-flex items-center gap-2 text-sm font-bold text-coral hover:text-navy transition-colors"
            >
              See every measure in detail
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
              </svg>
            </Link>
          </motion.div>
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
          <motion.h2 {...fadeUp} transition={{ duration: 0.7, ease: EASE }} className="text-3xl sm:text-5xl md:text-6xl font-bold text-white leading-tight">
            {closing.heading}
          </motion.h2>

          <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.12, ease: EASE }} className="mt-9 flex justify-center">
            <InteractiveHoverButton text={closing.cta} href="/vote" variant="primary" size="lg" />
          </motion.div>

          <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.2, ease: EASE }} className="mt-16 sm:mt-20">
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
