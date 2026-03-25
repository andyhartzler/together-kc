'use client';

import { motion } from 'framer-motion';
import {
  getVotingMode,
  hasEarlyVotingEnded,
  hasElectionEnded,
  earlyVotingDaysLeft,
} from '@/lib/voting-utils';

export default function SmartBanner() {
  const mode = getVotingMode();
  const ended = hasElectionEnded();
  const earlyEnded = hasEarlyVotingEnded();
  const daysLeft = earlyVotingDaysLeft();

  if (ended) {
    return (
      <div className="pt-20 md:pt-24 pb-8 px-4 text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">The Election Has Ended</h1>
        <p className="text-white/60 text-base">Thank you for voting!</p>
      </div>
    );
  }

  return (
    <div className="relative pt-20 md:pt-24 pb-6 md:pb-8 px-4 text-center">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">
        {mode === 'early' && !earlyEnded && (
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-500/20 border border-green-500/40 text-green-300 text-sm font-medium mb-3">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-400" />
            </span>
            Early voting is open now
          </div>
        )}
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Where Do I Vote?</h1>
        <p className="text-white/70 text-base md:text-lg max-w-md mx-auto font-medium">
          {mode === 'early' && !earlyEnded
            ? `${daysLeft} day${daysLeft !== 1 ? 's' : ''} left to vote early. No excuse needed.`
            : mode === 'election-day'
            ? 'Election Day is today. Polls open 6:00 AM - 7:00 PM. Bring your photo ID.'
            : 'Early voting has ended. Find your Election Day polling place.'}
        </p>
      </motion.div>
    </div>
  );
}
