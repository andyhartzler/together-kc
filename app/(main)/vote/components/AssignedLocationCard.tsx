'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getDirectionsUrl } from '@/lib/voting-utils';
import { useInlineMap } from '@/hooks/useAppleMap';
import BallotViewer from './BallotViewer';

interface PrecinctInfo {
  precinct: string;
  pollingPlace: string;
  pollingAddress: string;
  sampleBallot: string | null;
}

interface Props {
  info: PrecinctInfo | null;
  isLoading: boolean;
  pinLat?: number;
  pinLng?: number;
}

export default function AssignedLocationCard({ info, isLoading, pinLat, pinLng }: Props) {
  const [showBallot, setShowBallot] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const hasCoords = pinLat !== undefined && pinLng !== undefined && pinLat !== 0;
  const { mapRef: inlineMapRef, isLoaded: inlineMapLoaded } = useInlineMap(pinLat || 0, pinLng || 0, expanded && hasCoords);

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
    <>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={() => setExpanded(!expanded)}
        className="rounded-xl bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-500/30 p-4 cursor-pointer hover:from-green-500/25 transition-all"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-green-500/30 flex items-center justify-center">
              <svg className="w-4 h-4 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </span>
            <span className="text-green-300 text-xs font-semibold uppercase tracking-wider">Your Assigned Location</span>
          </div>
          <svg className={`w-4 h-4 text-green-300/50 transition-transform ${expanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        <h3 className="text-white font-bold text-base">{info.pollingPlace}</h3>
        <p className="text-white/60 text-sm">{info.pollingAddress}</p>
        <p className="text-white/40 text-xs mt-1">{info.precinct}</p>

        {/* Always show on desktop, only when expanded on mobile */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden md:hidden"
            >
              <div className="mt-3 pt-3 border-t border-green-500/20 space-y-3">
                <div className="flex gap-2">
                  <a href={getDirectionsUrl(info.pollingAddress)} target="_blank" rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg bg-green-500/30 text-green-200 text-sm font-semibold hover:bg-green-500/40 transition-colors min-h-[44px]">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    Directions
                  </a>
                  {info.sampleBallot && (
                    <button onClick={(e) => { e.stopPropagation(); setShowBallot(true); }}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg bg-white/10 text-white/70 text-sm font-semibold hover:bg-white/20 transition-colors min-h-[44px]">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Sample Ballot
                    </button>
                  )}
                </div>
                {/* Inline map */}
                {hasCoords && (
                  <div className="rounded-lg overflow-hidden h-[200px] border border-white/10 relative">
                    <div ref={inlineMapRef} className="absolute inset-0" />
                    {!inlineMapLoaded && (
                      <div className="absolute inset-0 flex items-center justify-center bg-navy/50">
                        <svg className="w-5 h-5 animate-spin text-white/30" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Desktop: always show buttons */}
        <div className="hidden md:flex gap-2 mt-3">
          <a href={getDirectionsUrl(info.pollingAddress)} target="_blank" rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg bg-green-500/30 text-green-200 text-sm font-semibold hover:bg-green-500/40 transition-colors min-h-[44px]">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            Directions
          </a>
          {info.sampleBallot && (
            <button onClick={(e) => { e.stopPropagation(); setShowBallot(true); }}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg bg-white/10 text-white/70 text-sm font-semibold hover:bg-white/20 transition-colors min-h-[44px]">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Sample Ballot
            </button>
          )}
        </div>

        {!expanded && (
          <p className="md:hidden text-green-300/40 text-[11px] mt-2 text-center">Tap for directions & sample ballot</p>
        )}
      </motion.div>

      {info.sampleBallot && (
        <BallotViewer
          isOpen={showBallot}
          onClose={() => setShowBallot(false)}
          pdfUrl={info.sampleBallot}
          title="Sample Ballot"
          subtitle={info.precinct}
        />
      )}
    </>
  );
}
