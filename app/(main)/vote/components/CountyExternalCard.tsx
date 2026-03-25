'use client';

import { COUNTY_ELECTION_BOARDS } from '@/lib/polling-data';
import { COUNTY_LOOKUP_INFO } from '@/lib/election-day-data';
import type { County } from '@/lib/voting-utils';

interface Props { county: County; }

export default function CountyExternalCard({ county }: Props) {
  const board = COUNTY_ELECTION_BOARDS[county];
  const lookup = COUNTY_LOOKUP_INFO[county];

  return (
    <div className="rounded-xl bg-white/5 border border-white/10 p-5">
      <div className="text-center mb-4">
        <h2 className="text-lg font-bold text-white mb-1">{county} County</h2>
        <p className="text-white/60 text-sm">{lookup.message}</p>
        <p className="text-white/50 text-sm mt-1">Use your county&apos;s official lookup tool to find your exact polling place.</p>
      </div>
      <a href={lookup.lookupUrl} target="_blank" rel="noopener noreferrer"
        className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-coral text-white font-semibold text-base hover:bg-coral/90 transition-all min-h-[48px]">
        {('lookupLabel' in lookup ? (lookup as Record<string, string>).lookupLabel : null) ?? 'Find Your Polling Place'}
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </a>
      <div className="mt-5 pt-4 border-t border-white/10 space-y-2">
        <h3 className="text-white/60 font-semibold text-xs uppercase tracking-wider">{board.name}</h3>
        <div className="flex items-center gap-2 text-white/50 text-sm">
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          <a href={`tel:${board.phone.replace(/\D/g, '')}`} className="hover:text-white transition-colors">{board.phone}</a>
        </div>
        <div className="flex items-center gap-2 text-white/50 text-sm">
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          </svg>
          <span>{board.address}</span>
        </div>
      </div>
    </div>
  );
}
