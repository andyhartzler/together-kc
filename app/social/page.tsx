'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { AUGUST_BALLOT } from '@/lib/constants';

const { hero, measures, voteSteps } = AUGUST_BALLOT;

// Official ballot order (Question 1 to 5), same display sort as the hub.
const ballotOrderNum = (m: (typeof measures)[number]) =>
  parseInt(m.officialQuestion.number.replace(/\D/g, ''), 10);
const orderedMeasures = [...measures].sort((a, b) => ballotOrderNum(a) - ballotOrderNum(b));

const SOCIAL_LINKS = [
  { name: 'Facebook', href: 'https://www.facebook.com/TogetherKC/', icon: '/images/social/facebook.png' },
  { name: 'Instagram', href: 'https://www.instagram.com/togetherkcmo/', icon: '/images/social/instagram.png' },
  { name: 'TikTok', href: 'https://www.tiktok.com/@togetherkcmo', icon: '/images/social/tiktok.png' },
  { name: 'X', href: 'https://x.com/TogetherKCMO', icon: '/images/social/x.png' },
  { name: 'Threads', href: 'https://www.threads.com/@togetherkcmo', icon: '/images/social/threads.png' },
];

// ===========================================================================
// Social landing page (link in bio) - August 4, 2026 five questions edition
// ===========================================================================
export default function SocialLandingPage() {
  return (
    <div className="min-h-screen bg-navy relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-64 h-64 rounded-full bg-coral/20 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-64 h-64 rounded-full bg-sky/20 blur-3xl" />
        <div className="absolute top-1/2 right-0 w-48 h-48 rounded-full bg-golden/10 blur-3xl" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col px-4 py-8 max-w-md mx-auto">
        {/* ---- Logo ---- */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-6"
        >
          <Image
            src="/images/august-logo-white.png"
            alt="Vote YES on all 5"
            width={220}
            height={80}
            className="h-16 w-auto object-contain mx-auto"
            priority
          />
        </motion.div>

        {/* ---- Social Links ---- */}
        <div className="flex justify-center gap-3 mb-5">
          {SOCIAL_LINKS.map((social, i) => (
            <motion.a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: 0.3 + i * 0.05 }}
              className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center active:scale-95 transition-transform"
              aria-label={`Follow us on ${social.name}`}
            >
              <Image src={social.icon} alt={social.name} width={22} height={22} className="w-5.5 h-5.5 object-contain" />
            </motion.a>
          ))}
        </div>

        {/* ---- Divider ---- */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.5, duration: 0.3 }}
          className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-8"
        />

        {/* ---- HERO ---- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 bg-white/10 text-white/90 px-4 py-2 rounded-full text-xs font-semibold mb-5 border border-white/20">
            <span className="w-2 h-2 bg-coral rounded-full animate-pulse motion-reduce:animate-none" />
            Election Day &middot; Tuesday, August 4, 2026
          </div>

          <h1 className="text-4xl font-extrabold text-white leading-tight [text-wrap:balance]">
            Vote{' '}
            <span className="text-coral" style={{ textShadow: '0 0 40px rgba(229, 57, 53, 0.5)' }}>
              YES
            </span>{' '}
            on all five.
          </h1>

          <div className="flex justify-center gap-6 text-white/50 mt-5">
            <div className="text-center">
              <div className="text-lg font-bold text-white tabular-nums">$1.7B</div>
              <div className="text-[11px]">{hero.hook[0].label}</div>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="text-center">
              <div className="text-lg font-bold text-white tabular-nums">$0</div>
              <div className="text-[11px]">new tax rates</div>
            </div>
          </div>
        </motion.div>

        {/* ---- THE FIVE QUESTIONS ---- */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <p className="text-white/50 text-xs font-medium uppercase tracking-widest mb-3 text-center">
            The five Kansas City questions
          </p>
          <div className="space-y-2.5">
            {orderedMeasures.map((m, i) => (
              <motion.div
                key={m.slug}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.08 }}
              >
                <Link
                  href={`/questions/${m.slug}`}
                  className="group flex items-center gap-3.5 bg-white/5 rounded-2xl px-4 py-3.5 border border-white/10 active:bg-white/10 transition-colors"
                >
                  <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: m.accent.swatch }}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-white/40">
                      {m.officialQuestion.number}
                    </span>
                    <span className="block text-base font-bold text-white leading-snug">
                      {m.name}
                    </span>
                    <span className="block text-xs text-white/55 leading-snug mt-0.5">
                      {m.cardPunch}
                    </span>
                  </span>
                  <svg
                    className="w-4 h-4 shrink-0 text-white/30 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </motion.div>
            ))}
          </div>
          <p className="text-[11px] text-white/35 text-center leading-relaxed mt-3">
            August 4 is a primary election; your ballot will include other races too.
          </p>
        </motion.div>

        {/* ---- KEY DATES ---- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <p className="text-white/50 text-xs font-medium uppercase tracking-widest mb-3 text-center">
            Make your plan
          </p>
          <div className="grid grid-cols-3 gap-2">
            {voteSteps.map((s, i) => (
              <motion.div
                key={s.date}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/5 rounded-xl p-3 text-center border border-white/10"
              >
                <div className="text-[10px] text-white/45 uppercase tracking-wider mb-1">{s.kicker}</div>
                <div className="text-sm font-bold text-white leading-tight">{s.date}</div>
                <div className="text-[10px] text-white/55 mt-1 leading-snug">{s.title}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ---- CTA ---- */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-8 space-y-3"
        >
          <Link
            href="/vote"
            className="block w-full text-center bg-coral text-white font-bold text-base rounded-full px-6 py-4 shadow-lg shadow-coral/25 active:scale-[0.99] transition-transform"
          >
            Find your polling place
          </Link>
          <Link
            href="/"
            className="block w-full text-center bg-white/10 text-white font-semibold text-sm rounded-full px-6 py-3.5 border border-white/20 active:bg-white/20 transition-colors"
          >
            Explore the full website
          </Link>
        </motion.div>

        {/* ---- Footer ---- */}
        <div className="mt-auto pt-6 text-center">
          <div className="flex justify-center mb-3">
            <Image
              src="/images/together-kc-footer.png"
              alt="Together KC"
              width={200}
              height={60}
              className="max-w-[160px] h-auto w-auto object-contain"
            />
          </div>
          <p className="text-white/40 text-xs leading-relaxed">
            Paid for by Together KC, Dan Kopp, Treasurer.
            <br />
            Not authorized by any candidate or candidate committee.
          </p>
        </div>
      </div>
    </div>
  );
}
