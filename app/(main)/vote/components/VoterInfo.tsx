'use client';

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

  // Single county selected: horizontal 3-card layout
  if (isSingleCounty) {
    const info = COUNTY_ELECTION_BOARDS[county];
    return (
      <div className="max-w-7xl mx-auto px-4 pt-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: What to Bring */}
          <div className="rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-white/[0.08] p-5 hover:bg-white/[0.06] hover:border-white/[0.12] transition-all duration-300">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-6 rounded-full bg-golden" />
              <h3 className="text-golden font-semibold text-sm">What to Bring</h3>
            </div>
            <p className="text-white/60 text-sm mb-3">
              Missouri requires a <strong className="text-white/80">valid photo ID</strong> to vote:
            </p>
            <ul className="text-white/60 text-sm space-y-1 ml-4 list-disc">
              <li>Missouri driver&apos;s license or non-driver ID</li>
              <li>U.S. passport</li>
              <li>U.S. military ID</li>
              <li>Other government-issued photo ID</li>
            </ul>
            <p className="text-white/40 text-xs mt-3">
              No photo ID? You may cast a provisional ballot with your name, address, DOB, and last 4 of SSN.
            </p>
          </div>

          {/* Card 2: County Election Board */}
          <div className="rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-white/[0.08] p-5 hover:bg-white/[0.06] hover:border-white/[0.12] transition-all duration-300">
            <h3 className="text-white font-semibold text-sm mb-1">{county} County</h3>
            <p className="text-white/40 text-xs mb-4">{info.name}</p>
            <div className="space-y-3">
              <a
                href={`tel:${info.phone.replace(/\D/g, '')}`}
                className="flex items-center gap-2 text-coral text-sm font-medium hover:text-coral/80 transition-colors"
              >
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {info.phone}
              </a>
              <p className="flex items-start gap-2 text-white/50 text-xs">
                <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                {info.address}
              </p>
              <a
                href={info.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.1] text-white/60 text-xs font-medium hover:bg-white/[0.1] hover:text-white/80 transition-all"
              >
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Visit website
              </a>
            </div>
          </div>

          {/* Card 3: Check Registration */}
          <div className="rounded-2xl bg-sky/[0.08] backdrop-blur-sm border border-sky/20 p-5 hover:bg-sky/[0.12] hover:border-sky/30 transition-all duration-300 flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-6 rounded-full bg-sky" />
              <h3 className="text-white font-semibold text-sm">Check Registration</h3>
            </div>
            <p className="text-white/70 text-sm mb-4">
              Verify your voter registration status with the Missouri Secretary of State.
            </p>
            <div className="mt-auto">
              <a
                href="https://voteroutreach.sos.mo.gov/portal/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-sky/20 border border-sky/40 text-white text-sm font-semibold hover:bg-sky/30 transition-all min-h-[48px]"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Check Your Voter Registration
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // No county selected: show all 4 counties in a grid
  return (
    <div className="max-w-7xl mx-auto px-4 pt-8 pb-20">
      {/* What to Bring - always visible compact section */}
      <div className="rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-white/[0.08] p-5 mb-6 hover:bg-white/[0.06] hover:border-white/[0.12] transition-all duration-300">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1 h-6 rounded-full bg-golden" />
          <h3 className="text-golden font-semibold text-sm">What to Bring</h3>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-start gap-3">
          <p className="text-white/60 text-sm flex-1">
            Missouri requires a <strong className="text-white/80">valid photo ID</strong>: driver&apos;s license, passport, military ID, or other government-issued photo ID.
            <span className="text-white/40 text-xs block mt-1">
              No photo ID? You may cast a provisional ballot with your name, address, DOB, and last 4 of SSN.
            </span>
          </p>
        </div>
      </div>

      {/* Section title */}
      <p className="text-white/60 text-[11px] uppercase tracking-widest font-medium mb-4">Your Election Board</p>

      {/* 2x2 county grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {countyEntries.map(([countyName, info]) => (
          <div
            key={countyName}
            className="rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-white/[0.08] p-5 hover:bg-white/[0.06] hover:border-white/[0.12] transition-all duration-300"
          >
            <h3 className="text-white font-bold text-sm mb-0.5">{countyName} County</h3>
            <p className="text-white/40 text-xs mb-3">{info.name}</p>
            <div className="space-y-2">
              <a
                href={`tel:${info.phone.replace(/\D/g, '')}`}
                className="flex items-center gap-2 text-coral text-sm font-medium hover:text-coral/80 transition-colors"
              >
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {info.phone}
              </a>
              <p className="flex items-start gap-2 text-white/50 text-xs">
                <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                {info.address}
              </p>
              <a
                href={info.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.1] text-white/60 text-xs font-medium hover:bg-white/[0.1] hover:text-white/80 transition-all"
              >
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Visit website
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Check Registration button */}
      <div className="text-center">
        <a
          href="https://voteroutreach.sos.mo.gov/portal/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-sky/15 border border-sky/30 text-sky text-sm font-semibold hover:bg-sky/25 transition-all"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Check Your Voter Registration
        </a>
      </div>
    </div>
  );
}
