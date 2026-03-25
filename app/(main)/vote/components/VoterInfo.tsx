'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { COUNTY_ELECTION_BOARDS } from '@/lib/polling-data';
import type { County } from '@/lib/voting-utils';

interface Props {
  county?: County | null;
}

export default function VoterInfo({ county }: Props) {
  const [idExpanded, setIdExpanded] = useState(false);
  const [expandedCounty, setExpandedCounty] = useState<string | null>(null);

  const countyEntries = county
    ? ([[county, COUNTY_ELECTION_BOARDS[county]]] as [string, typeof COUNTY_ELECTION_BOARDS['Jackson']][])
    : (Object.entries(COUNTY_ELECTION_BOARDS) as [string, typeof COUNTY_ELECTION_BOARDS['Jackson']][]);

  return (
    <div className="border-t border-white/10 bg-navy">
      <div className="max-w-2xl mx-auto px-4 pt-8 pb-20 space-y-6">
        <button
          onClick={() => setIdExpanded(!idExpanded)}
          className="w-full flex items-center justify-between rounded-xl bg-golden/10 border border-golden/20 px-4 py-3.5 min-h-[48px]"
        >
          <span className="flex items-center gap-2 text-golden font-semibold text-sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            What to Bring - Voter ID Required
          </span>
          <svg className={`w-4 h-4 text-golden transition-transform ${idExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <AnimatePresence>
          {idExpanded && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <div className="rounded-xl bg-golden/5 border border-golden/10 px-4 py-4 space-y-3">
                <p className="text-white/60 text-sm">
                  Missouri requires a <strong className="text-white/80">valid government-issued photo ID</strong> to vote:
                </p>
                <ul className="text-white/60 text-sm space-y-1 ml-4 list-disc">
                  <li>Missouri driver&apos;s license or non-driver ID</li>
                  <li>U.S. passport</li>
                  <li>U.S. military ID</li>
                  <li>Other government-issued photo ID</li>
                </ul>
                <p className="text-white/50 text-xs">
                  Without a photo ID, you may cast a provisional ballot with your name, address, date of birth, and last 4 digits of your SSN.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {countyEntries.map(([countyName, info]) => {
            const isOpen = expandedCounty === countyName;
            return (
              <div key={countyName}>
                <button
                  onClick={() => setExpandedCounty(isOpen ? null : countyName)}
                  className="w-full text-left rounded-xl bg-white/5 border border-white/10 p-4 hover:bg-white/8 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-semibold text-sm">{countyName} County</h3>
                      <p className="text-white/40 text-xs">{info.name}</p>
                    </div>
                    <svg className={`w-4 h-4 text-white/30 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                      <div className="rounded-b-xl bg-white/5 border border-t-0 border-white/10 px-4 py-3 space-y-2 -mt-1">
                        <a href={`tel:${info.phone.replace(/\D/g, '')}`} className="flex items-center gap-2 text-white/60 text-sm hover:text-white transition-colors">
                          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          {info.phone}
                        </a>
                        <p className="flex items-start gap-2 text-white/50 text-xs">
                          <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {info.address}
                        </p>
                        <a href={info.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sky text-xs hover:text-sky/80 transition-colors">
                          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          Visit website
                        </a>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        <div className="text-center">
          <a
            href="https://voteroutreach.sos.mo.gov/portal/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-white/60 text-sm font-medium hover:bg-white/10 transition-all min-h-[44px]"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Check Your Voter Registration
          </a>
        </div>
      </div>
    </div>
  );
}
