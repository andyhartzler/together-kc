'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { AUGUST_BALLOT } from '@/lib/constants';
import Accordion from '@/components/ui/Accordion';
import { InteractiveHoverButton } from '@/components/ui/InteractiveHoverButton';
import Footer from '@/components/layout/Footer';

const { hero, intro, questionsSection, questions, costs, howToVote, faqsSection, faqs, closing, exploreLinks } =
  AUGUST_BALLOT;

// Per-question accent tokens (icon tile + top accent bar). YES buttons stay
// coral everywhere for CTA consistency; accents add tasteful topic variety.
const ACCENT: Record<string, { tile: string; bar: string }> = {
  sky: { tile: 'bg-sky/10', bar: 'from-sky via-sky to-navy' },
  navy: { tile: 'bg-navy/10', bar: 'from-navy via-navy to-sky' },
  coral: { tile: 'bg-coral/10', bar: 'from-coral via-coral to-golden' },
  golden: { tile: 'bg-golden/15', bar: 'from-golden via-golden to-coral' },
};

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
};

function Eyebrow({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold border',
        dark ? 'bg-white/10 text-white border-white/20' : 'bg-coral/10 text-coral border-coral/20'
      )}
    >
      <span className={cn('w-2 h-2 rounded-full animate-pulse', dark ? 'bg-white' : 'bg-coral')} />
      {children}
    </span>
  );
}

export default function AugustBallotPage() {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* ================================================================= */}
      {/* HERO                                                               */}
      {/* ================================================================= */}
      <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy/95 to-sky/80" />

        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-coral/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-1/4 -right-1/4 w-2/3 h-2/3 bg-sky/20 rounded-full blur-3xl" />
          <div className="absolute top-1/3 right-1/4 w-1/3 h-1/3 bg-golden/15 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 left-1/6 w-1/4 h-1/4 bg-golden/10 rounded-full blur-3xl" />
        </div>

        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />

        <div
          className="absolute -bottom-1 left-0 right-0 h-40 sm:h-72 z-20"
          style={{
            background:
              'linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.08) 30%, rgba(255,255,255,0.4) 60%, rgba(255,255,255,0.9) 90%, rgba(255,255,255,1) 100%)',
          }}
        />

        <motion.div
          className="relative z-20 text-center px-4 pt-10 pb-28 sm:pt-20 sm:pb-40 max-w-5xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } } }}
        >
          <motion.div
            variants={{ hidden: { opacity: 0, y: -20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
            className="flex justify-center mb-7 sm:mb-9"
          >
            <Image
              src="/images/together-kc-footer.png"
              alt="Together KC"
              width={260}
              height={99}
              className="h-14 sm:h-16 md:h-20 w-auto"
              priority
            />
          </motion.div>

          <motion.div
            variants={{
              hidden: { opacity: 0, scale: 0.8 },
              visible: { opacity: 1, scale: 1, transition: { duration: 0.5, type: 'spring', stiffness: 200 } },
            }}
            className="flex justify-center mb-6 sm:mb-8"
          >
            <Eyebrow dark>{hero.eyebrow}</Eyebrow>
          </motion.div>

          <motion.h1
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.6 } } }}
            className="text-4xl sm:text-6xl md:text-7xl font-bold text-white mb-5 sm:mb-7 leading-tight"
          >
            Vote{' '}
            <span
              className="text-coral relative"
              style={{ textShadow: '0 0 40px rgba(229, 57, 53, 0.5), 0 0 80px rgba(229, 57, 53, 0.3)' }}
            >
              YES
            </span>{' '}
            on all five.
          </motion.h1>

          <motion.p
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.6 } } }}
            className="text-base sm:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed mb-8 sm:mb-10"
          >
            {hero.subhead}
          </motion.p>

          <motion.div
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.6 } } }}
            className="flex justify-center gap-6 sm:gap-12 mb-9 sm:mb-11"
          >
            {hero.stats.map((stat, i) => (
              <div key={stat.label} className="flex items-center gap-6 sm:gap-12">
                {i > 0 && <div className="w-px h-12 sm:h-14 bg-white/20" />}
                <div className="text-center">
                  <div className="text-2xl sm:text-4xl font-bold text-white leading-none">{stat.value}</div>
                  <div className="text-xs sm:text-sm text-white/60 mt-1.5 max-w-[8rem]">{stat.label}</div>
                </div>
              </div>
            ))}
          </motion.div>

          <motion.div
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.6 } } }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
          >
            <InteractiveHoverButton text={hero.primaryCta} href="#questions" variant="primary" size="lg" arrowDirection="down" />
            <InteractiveHoverButton text={hero.secondaryCta} href="#vote" variant="outline" size="lg" />
          </motion.div>
        </motion.div>

        <motion.a
          href="#intro"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          className="absolute bottom-20 sm:bottom-28 left-1/2 -translate-x-1/2 z-20 cursor-pointer"
          aria-label="Scroll down"
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center animate-bounce">
            <div className="w-1.5 h-3 bg-white/50 rounded-full mt-2" />
          </div>
        </motion.a>
      </section>

      {/* ================================================================= */}
      {/* INTRO                                                              */}
      {/* ================================================================= */}
      <section id="intro" className="relative py-16 sm:py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div {...fadeUp} transition={{ duration: 0.6 }} className="mb-6">
            <Eyebrow>{intro.eyebrow}</Eyebrow>
          </motion.div>
          <motion.h2
            {...fadeUp}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-navy mb-6 sm:mb-8 leading-tight"
          >
            {intro.heading}
          </motion.h2>
          <motion.p
            {...fadeUp}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-lg sm:text-xl text-gray-600 leading-relaxed"
          >
            {intro.body}
          </motion.p>
        </div>
      </section>

      {/* ================================================================= */}
      {/* THE FIVE QUESTIONS                                                 */}
      {/* ================================================================= */}
      <section id="questions" className="relative py-16 sm:py-24 bg-gradient-to-b from-white via-light-gray/40 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} transition={{ duration: 0.7 }} className="text-center mb-12 sm:mb-16">
            <div className="mb-5">
              <Eyebrow>{questionsSection.eyebrow}</Eyebrow>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-navy mb-4 leading-tight">
              {questionsSection.heading}
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">{questionsSection.sub}</p>
          </motion.div>

          <div className="space-y-7 sm:space-y-9">
            {questions.map((q, i) => {
              const accent = ACCENT[q.accent] ?? ACCENT.coral;
              return (
                <motion.article
                  key={q.anchorId}
                  id={q.anchorId}
                  initial={{ opacity: 0, y: 36 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.6, delay: Math.min(i * 0.06, 0.18), ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="scroll-mt-24 relative bg-white rounded-3xl shadow-xl shadow-navy/5 border border-gray-100 overflow-hidden"
                >
                  <div className={cn('h-1.5 w-full bg-gradient-to-r', accent.bar)} />

                  <div className="p-6 sm:p-9">
                    <div className="flex items-start gap-4 sm:gap-5 mb-5">
                      <div
                        className={cn(
                          'flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl',
                          accent.tile
                        )}
                        aria-hidden
                      >
                        {q.icon}
                      </div>
                      <div className="pt-0.5">
                        <span className="inline-flex items-center gap-2 rounded-full bg-coral/10 text-coral text-xs sm:text-sm font-semibold border border-coral/20 px-3 py-1 mb-2.5">
                          {q.eyebrow}
                        </span>
                        <h3 className="text-xl sm:text-2xl md:text-[1.7rem] font-bold text-navy leading-snug">
                          {q.title}
                        </h3>
                      </div>
                    </div>

                    <p className="text-base sm:text-lg text-navy/80 font-medium leading-relaxed mb-4">{q.oneLiner}</p>
                    <p className="text-base text-gray-600 leading-relaxed mb-6">{q.body}</p>

                    <div className="rounded-2xl bg-light-gray/70 border border-gray-100 p-4 sm:p-5 mb-6">
                      <div className="flex items-start gap-3">
                        <span className="flex-shrink-0 mt-0.5 w-6 h-6 rounded-full bg-coral/10 text-coral flex items-center justify-center">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </span>
                        <div>
                          <p className="text-[0.7rem] uppercase tracking-widest font-semibold text-gray-400 mb-1">
                            What it costs you
                          </p>
                          <p className="text-sm text-navy/80 leading-relaxed">{q.costLine}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <InteractiveHoverButton text={q.yesCta} href="#vote" variant="primary" />
                      <p className="text-xs text-gray-400 leading-relaxed sm:max-w-sm sm:text-right">{q.sourceNote}</p>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* WHAT IT COSTS YOU                                                  */}
      {/* ================================================================= */}
      <section className="relative py-18 sm:py-28 bg-navy overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/4 right-0 w-1/2 h-1/2 bg-sky/15 rounded-full blur-3xl" />
          <div className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-coral/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <motion.div {...fadeUp} transition={{ duration: 0.7 }} className="text-center mb-10 sm:mb-14">
            <div className="mb-5">
              <Eyebrow dark>{costs.eyebrow}</Eyebrow>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-5 leading-tight">{costs.heading}</h2>
            <p className="text-base sm:text-lg text-white/75 max-w-2xl mx-auto leading-relaxed">{costs.body}</p>
          </motion.div>

          <div className="grid gap-4 sm:gap-5 mb-7">
            {costs.points.map((point, i) => (
              <motion.div
                key={i}
                {...fadeUp}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="flex items-start gap-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 p-5 sm:p-6"
              >
                <span className="flex-shrink-0 mt-0.5 w-7 h-7 rounded-full bg-coral text-white flex items-center justify-center shadow-lg shadow-coral/30">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <p className="text-sm sm:text-base text-white/90 leading-relaxed">{point}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="rounded-2xl bg-gradient-to-r from-coral/90 to-coral p-6 sm:p-7 text-center shadow-xl shadow-coral/20"
          >
            <p className="text-base sm:text-lg font-semibold text-white leading-relaxed">{costs.bottomLine}</p>
          </motion.div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* HOW TO VOTE                                                        */}
      {/* ================================================================= */}
      <section id="vote" className="relative py-16 sm:py-24 bg-white scroll-mt-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} transition={{ duration: 0.7 }} className="text-center mb-12 sm:mb-16">
            <div className="mb-5">
              <Eyebrow>{howToVote.eyebrow}</Eyebrow>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-navy leading-tight">{howToVote.heading}</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 mb-10 sm:mb-12">
            {[howToVote.registration, howToVote.earlyVoting, howToVote.electionDay].map((card, i) => (
              <motion.div
                key={card.title}
                {...fadeUp}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative bg-white rounded-2xl p-6 sm:p-7 shadow-xl shadow-navy/5 border border-gray-100 overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-coral via-golden to-sky" />
                <h3 className="text-lg sm:text-xl font-bold text-navy mb-3">{card.title}</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{card.line}</p>
              </motion.div>
            ))}
          </div>

          <motion.div {...fadeUp} transition={{ duration: 0.6 }} className="text-center">
            <p className="text-sm sm:text-base text-gray-500 max-w-2xl mx-auto mb-7 leading-relaxed">
              {howToVote.pollingNote}
            </p>
            <InteractiveHoverButton text="Find your polling place" href="/vote" variant="secondary" size="lg" />
          </motion.div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* FAQ                                                                */}
      {/* ================================================================= */}
      <section className="relative py-16 sm:py-24 bg-gradient-to-b from-light-gray/40 to-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} transition={{ duration: 0.7 }} className="text-center mb-10 sm:mb-14">
            <div className="mb-5">
              <Eyebrow>{faqsSection.eyebrow}</Eyebrow>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-navy leading-tight">{faqsSection.heading}</h2>
          </motion.div>
          <Accordion items={faqs} />
        </div>
      </section>

      {/* ================================================================= */}
      {/* CLOSING + EXPLORE THE FULL WEBSITE                                 */}
      {/* ================================================================= */}
      <section className="relative pt-18 sm:pt-28 pb-12 sm:pb-16 bg-navy overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/4 left-1/4 w-1/2 h-1/2 bg-coral/15 rounded-full blur-3xl" />
          <div className="absolute -bottom-1/4 right-0 w-1/2 h-2/3 bg-sky/15 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            {...fadeUp}
            transition={{ duration: 0.8 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 leading-tight"
          >
            {closing.heading}
          </motion.h2>
          <motion.p
            {...fadeUp}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-base sm:text-lg text-white/80 leading-relaxed mb-9 sm:mb-11 max-w-2xl mx-auto"
          >
            {closing.body}
          </motion.p>
          <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.15 }} className="flex justify-center">
            <InteractiveHoverButton text={closing.cta} href="/vote" variant="primary" size="lg" />
          </motion.div>

          {/* Explore the full website */}
          <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.2 }} className="mt-16 sm:mt-20">
            <p className="text-white/40 text-xs sm:text-sm font-medium uppercase tracking-widest mb-5 sm:mb-6">
              Explore the Full Website
            </p>
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
              {exploreLinks.map((link) => (
                <motion.div
                  key={link.href}
                  whileHover={{ y: -3, scale: 1.03 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                >
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

      {/* ================================================================= */}
      {/* FOOTER                                                             */}
      {/* ================================================================= */}
      <Footer />
    </div>
  );
}
