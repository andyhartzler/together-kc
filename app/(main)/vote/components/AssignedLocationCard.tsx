'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { getDirectionsUrl } from '@/lib/voting-utils';

interface PrecinctInfo {
  precinct: string;
  pollingPlace: string;
  pollingAddress: string;
  sampleBallot: string | null;
}

interface Props {
  info: PrecinctInfo | null;
  isLoading: boolean;
}

export default function AssignedLocationCard({ info, isLoading }: Props) {
  const [showBallot, setShowBallot] = useState(false);
  if (isLoading) {
    return (
      <div className="rounded-xl bg-green-500/10 border border-green-500/20 p-4 animate-pulse">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-full bg-green-500/20" />
          <div className="h-3 w-40 bg-green-500/20 rounded" />
        </div>
        <div className="h-4 w-56 bg-green-500/10 rounded mb-2" />
        <div className="h-3 w-44 bg-green-500/10 rounded" />
      </div>
    );
  }

  if (!info) return null;

  return (
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-500/30 p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="w-6 h-6 rounded-full bg-green-500/30 flex items-center justify-center">
          <svg className="w-4 h-4 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </span>
        <span className="text-green-300 text-xs font-semibold uppercase tracking-wider">Your Assigned Location</span>
      </div>
      <h3 className="text-white font-bold text-base">{info.pollingPlace}</h3>
      <p className="text-white/60 text-sm">{info.pollingAddress}</p>
      <p className="text-white/40 text-xs mt-1">{info.precinct}</p>
      <div className="flex gap-2 mt-3">
        <a href={getDirectionsUrl(info.pollingAddress)} target="_blank" rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg bg-green-500/30 text-green-200 text-sm font-semibold hover:bg-green-500/40 transition-colors min-h-[44px]">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          </svg>
          Directions
        </a>
        {info.sampleBallot && (
          <button onClick={() => setShowBallot(true)}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg bg-white/10 text-white/70 text-sm font-semibold hover:bg-white/20 transition-colors min-h-[44px]">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Sample Ballot
          </button>
        )}
      </div>
      <p className="text-green-300/60 text-[10px] mt-3 leading-relaxed">
        You can also vote at any other KC polling location on Election Day.
      </p>
      {showBallot && info.sampleBallot && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col" onClick={() => setShowBallot(false)}>
          <div className="flex items-center justify-between p-4 bg-navy/90">
            <h3 className="text-white font-semibold text-sm">Sample Ballot - {info.precinct}</h3>
            <button onClick={() => setShowBallot(false)} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex-1" onClick={(e) => e.stopPropagation()}>
            <iframe src={info.sampleBallot} className="w-full h-full" title="Sample Ballot" />
          </div>
        </div>
      )}
    </motion.div>
  );
}
