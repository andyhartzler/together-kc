'use client';

import { motion } from 'framer-motion';
import type { VotingMode } from '@/lib/voting-utils';

interface Props {
  mode: VotingMode;
  onChange: (mode: VotingMode) => void;
}

export default function VotingModeToggle({ mode, onChange }: Props) {
  return (
    <div className="flex bg-white/5 rounded-xl p-1 border border-white/10">
      {(['early', 'election-day'] as const).map((m) => (
        <button
          key={m}
          onClick={() => onChange(m)}
          className="relative flex-1 py-2.5 px-4 text-sm font-semibold rounded-lg transition-colors"
        >
          {mode === m && (
            <motion.div
              layoutId="mode-toggle"
              className="absolute inset-0 bg-coral rounded-lg"
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          )}
          <span className={`relative z-10 ${mode === m ? 'text-white' : 'text-white/50'}`}>
            {m === 'early' ? 'Early Voting' : 'Election Day'}
          </span>
        </button>
      ))}
    </div>
  );
}
