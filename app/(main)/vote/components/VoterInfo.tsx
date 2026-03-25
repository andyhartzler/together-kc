'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { COUNTY_ELECTION_BOARDS } from '@/lib/polling-data';

export default function VoterInfo() {
  const [idExpanded, setIdExpanded] = useState(false);

  return (
    <div className="border-t border-white/10 bg-navy">
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
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
          {(Object.entries(COUNTY_ELECTION_BOARDS) as [string, typeof COUNTY_ELECTION_BOARDS['Jackson']][]).map(
            ([county, info]) => (
              <div key={county} className="rounded-xl bg-white/5 border border-white/10 p-4">
                <h3 className="text-white font-semibold text-sm mb-0.5">{county} County</h3>
                <p className="text-white/40 text-xs mb-2">{info.name}</p>
                <a href={`tel:${info.phone.replace(/\D/g, '')}`} className="text-white/60 text-sm hover:text-white transition-colors">
                  {info.phone}
                </a>
              </div>
            )
          )}
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
            Check Your Voter Registration (MO SOS)
          </a>
        </div>
      </div>
    </div>
  );
}
