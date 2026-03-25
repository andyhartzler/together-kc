'use client';

import { useState } from 'react';
import { COUNTY_ELECTION_BOARDS } from '@/lib/polling-data';
import type { County } from '@/lib/voting-utils';

interface Props {
  county?: County | null;
}

export default function VoterInfo({ county }: Props) {
  const countyEntries = county
    ? ([[county, COUNTY_ELECTION_BOARDS[county]]] as [string, typeof COUNTY_ELECTION_BOARDS['Jackson']][])
    : (Object.entries(COUNTY_ELECTION_BOARDS) as [string, typeof COUNTY_ELECTION_BOARDS['Jackson']][]);

  const isSingleCounty = !!county;
  const [showBoards, setShowBoards] = useState(false);

  if (isSingleCounty) {
    const info = COUNTY_ELECTION_BOARDS[county];
    return (
      <div className="max-w-6xl mx-auto px-4 pt-10 pb-24">
        {/* Section label */}
        <p className="text-white/30 text-[10px] uppercase tracking-[0.2em] font-semibold mb-5 text-center">Resources</p>

        {/* Mobile: Check Registration first, then What to Bring, then county contact */}
        {/* Desktop: 3-column horizontal layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Check Registration - second on mobile (order-2), third on desktop (md:order-3) */}
          <div className="rounded-2xl bg-white/[0.04] border border-sky/20 p-6 flex flex-col relative overflow-hidden order-2 md:order-3">
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-sky to-sky/30" />
            <div className="pl-3 flex flex-col flex-1">
              <h3 className="text-white font-bold text-base mb-3">Check Registration</h3>
              <p className="text-white/60 text-sm leading-relaxed mb-6">
                Verify your voter registration status with the Missouri Secretary of State.
              </p>
              <div className="mt-auto">
                <a
                  href="https://voteroutreach.sos.mo.gov/portal/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-xl bg-sky/15 border border-sky/30 text-white text-sm font-bold hover:bg-sky/25 hover:border-sky/40 transition-all min-h-[48px]"
                >
                  <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Check Your Voter Registration
                </a>
              </div>
            </div>
          </div>

          {/* What to Bring - first on mobile (order-first), first on desktop (md:order-1) */}
          <div className="rounded-2xl bg-white/[0.04] border border-golden/20 p-6 relative overflow-hidden order-first md:order-1">
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-golden to-golden/30" />
            <h3 className="text-golden font-bold text-base mb-4 pl-3">What to Bring</h3>
            <div className="space-y-3 pl-3">
              <p className="text-white/80 text-sm leading-relaxed">
                Missouri requires a <strong className="text-white">valid photo ID</strong> to vote.
              </p>
              <ul className="text-white/70 text-sm space-y-1.5 ml-4 list-disc marker:text-golden/50">
                <li>Missouri driver&apos;s license or non-driver ID</li>
                <li>U.S. passport</li>
                <li>U.S. military ID</li>
                <li>Other government-issued photo ID</li>
              </ul>
              <p className="text-white/40 text-xs leading-relaxed pt-1">
                No photo ID? Cast a provisional ballot with your name, address, DOB, and last 4 of SSN.
              </p>
            </div>
          </div>

          {/* County Election Board - third on mobile (order-3), second on desktop (md:order-2) */}
          <div className="rounded-2xl bg-white/[0.04] border border-white/[0.1] p-6 relative overflow-hidden order-3 md:order-2">
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-coral to-coral/30" />
            <div className="pl-3">
              <h3 className="text-white font-bold text-base mb-0.5">{county} County</h3>
              <p className="text-white/40 text-xs mb-5">{info.name}</p>
              <div className="space-y-4">
                <a
                  href={`tel:${info.phone.replace(/\D/g, '')}`}
                  className="flex items-center gap-3 text-coral text-base font-semibold hover:text-coral/80 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-coral/10 flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  {info.phone}
                </a>
                <div className="flex items-start gap-3 text-white/60 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                  </div>
                  <span className="leading-snug">{info.address}</span>
                </div>
                <a
                  href={info.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sky text-sm font-medium hover:text-sky/80 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-sky/10 flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                  Visit website
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // No county selected: show all 4 counties
  return (
    <div className="max-w-6xl mx-auto px-4 pt-10 pb-24">
      {/* Check Registration button - above election boards on mobile */}
      <div className="text-center mb-8">
        <a
          href="https://voteroutreach.sos.mo.gov/portal/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2.5 px-7 py-4 rounded-xl bg-sky/15 border border-sky/30 text-white text-sm font-bold hover:bg-sky/25 hover:border-sky/40 transition-all"
        >
          <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Check Your Voter Registration
        </a>
      </div>

      {/* What to Bring */}
      <div className="rounded-2xl bg-white/[0.04] border border-golden/20 p-6 mb-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-golden to-golden/30" />
        <h3 className="text-golden font-bold text-base mb-3 pl-3">What to Bring</h3>
        <p className="text-white/80 text-sm leading-relaxed pl-3">
          Missouri requires a <strong className="text-white">valid photo ID</strong> to vote: driver&apos;s license, passport, military ID, or other government-issued photo ID.
          <span className="text-white/40 text-xs block mt-2">
            No photo ID? Cast a provisional ballot with your name, address, DOB, and last 4 of SSN.
          </span>
        </p>
      </div>

      {/* Election Boards - collapsed by default */}
      <button
        onClick={() => setShowBoards(!showBoards)}
        className="flex items-center gap-2 mb-5 group"
      >
        <p className="text-white/30 text-[10px] uppercase tracking-[0.2em] font-semibold group-hover:text-white/50 transition-colors">Election Boards</p>
        <svg className={`w-3.5 h-3.5 text-white/30 transition-transform group-hover:text-white/50 ${showBoards ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {showBoards && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          {countyEntries.map(([countyName, info]) => (
            <div
              key={countyName}
              className="rounded-2xl bg-white/[0.04] border border-white/[0.1] p-6 hover:bg-white/[0.06] hover:border-white/[0.15] transition-all duration-300"
            >
              <h3 className="text-white font-bold text-base mb-0.5">{countyName} County</h3>
              <p className="text-white/40 text-xs mb-4">{info.name}</p>
              <div className="space-y-3">
                <a
                  href={`tel:${info.phone.replace(/\D/g, '')}`}
                  className="flex items-center gap-3 text-coral text-sm font-semibold hover:text-coral/80 transition-colors"
                >
                  <div className="w-7 h-7 rounded-md bg-coral/10 flex items-center justify-center shrink-0">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  {info.phone}
                </a>
                <div className="flex items-start gap-3 text-white/60 text-sm">
                  <div className="w-7 h-7 rounded-md bg-white/[0.06] flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                  </div>
                  <span className="leading-snug">{info.address}</span>
                </div>
                <a
                  href={info.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sky text-sm font-medium hover:text-sky/80 transition-colors"
                >
                  <div className="w-7 h-7 rounded-md bg-sky/10 flex items-center justify-center shrink-0">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                  Visit website
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
