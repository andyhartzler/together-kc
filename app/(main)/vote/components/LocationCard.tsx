'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useInlineMap } from '@/hooks/useAppleMap';
import {
  getLocationStatus,
  getDirectionsUrl,
  getDistanceMiles,
  fullAddress,
  type LocationStatus,
} from '@/lib/voting-utils';
import type { EarlyVotingLocation } from '@/lib/polling-data';
import type { ElectionDayLocation } from '@/lib/election-day-data';

type Location = EarlyVotingLocation | ElectionDayLocation;

interface Props {
  location: Location;
  userLat?: number;
  userLng?: number;
  isEarlyVoting: boolean;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

function isEarlyVotingLoc(loc: Location): loc is EarlyVotingLocation {
  return 'hours' in loc;
}

export default function LocationCard({ location: loc, userLat, userLng, isEarlyVoting, isSelected, onSelect }: Props) {
  const isExpanded = isSelected;

  const status: LocationStatus | null = isEarlyVotingLoc(loc) ? getLocationStatus(loc) : null;

  const distance = userLat !== undefined && userLng !== undefined && loc.lat !== 0
    ? getDistanceMiles(userLat, userLng, loc.lat, loc.lng) : null;

  const addr = fullAddress(loc);
  const isKCEB = isEarlyVotingLoc(loc) && loc.isElectionBoard;
  const isCass = loc.county === 'Cass';
  const ward = 'ward' in loc ? loc.ward : undefined;
  const room = 'room' in loc ? loc.room : undefined;

  const { mapRef: inlineMapRef, isLoaded: inlineMapLoaded } = useInlineMap(loc.lat, loc.lng, isExpanded && loc.lat !== 0);

  return (
    <div
      onClick={() => { onSelect(loc.id); }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(loc.id); } }}
      className={`w-full text-left rounded-xl p-4 transition-all cursor-pointer ${
        isExpanded ? 'bg-coral/10 border-2 border-coral/40' : 'bg-white/5 border border-white/10 hover:bg-white/10'
      }`}
    >
      {/* Always visible: status, name, address, distance */}
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          {status && (
            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${
              status.isOpen
                ? status.minutesUntilClose && status.minutesUntilClose <= 60 ? 'bg-amber-500/20 text-amber-300' : 'bg-green-500/20 text-green-300'
                : 'bg-white/10 text-white/50'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${
                status.isOpen
                  ? status.minutesUntilClose && status.minutesUntilClose <= 60 ? 'bg-amber-400' : 'bg-green-400'
                  : 'bg-white/30'
              }`} />
              {status.status}
            </span>
          )}
          {isKCEB && <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-golden/20 text-golden border border-golden/30">HQ</span>}
          {ward !== undefined && <span className="px-1.5 py-0.5 rounded text-[10px] font-mono text-white/40 bg-white/5 border border-white/10">W{ward}</span>}
        </div>
        {distance !== null && <span className="text-sky text-xs font-medium">{distance.toFixed(1)} mi</span>}
      </div>

      <h3 className="text-white font-semibold text-sm">{loc.name}</h3>
      <p className="text-white/50 text-xs mt-0.5">{loc.address}, {loc.city}</p>
      {room && <p className="text-white/40 text-[11px]">{room}</p>}

      {/* Expand indicator */}
      <div className="flex items-center gap-1 mt-2">
        <svg className={`w-3 h-3 text-white/30 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
        <span className="text-white/30 text-[11px]">{isExpanded ? 'Less' : 'More info & directions'}</span>
      </div>

      {/* Expanded section: directions, map, hours, notes */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className="mt-3 pt-3 border-t border-white/10 space-y-3">
              {/* Directions button - now inside expanded only */}
              <a
                href={getDirectionsUrl(addr)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-coral text-white text-sm font-semibold hover:bg-coral/90 transition-colors min-h-[44px]"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                Get Directions
              </a>

              {/* Inline map - mobile only (desktop has the sidebar map) */}
              {loc.lat !== 0 && (
                <div className="md:hidden rounded-lg overflow-hidden h-[180px] bg-navy/50 border border-white/10 relative">
                  <div ref={inlineMapRef} className="absolute inset-0" />
                  {!inlineMapLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg className="w-5 h-5 animate-spin text-white/30" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    </div>
                  )}
                </div>
              )}

              {/* Today's hours */}
              {status?.todayHours && (
                <p className="text-white/40 text-xs">Today: {status.todayHours.open} - {status.todayHours.close}</p>
              )}

              {/* Full schedule */}
              {isEarlyVotingLoc(loc) && (
                <div>
                  <p className="text-white/40 text-[10px] uppercase tracking-wider font-semibold mb-1">Hours</p>
                  {loc.hours.map((h, i) => (
                    <div key={i} className="flex justify-between text-xs py-0.5">
                      <span className="text-white/60">{h.label} <span className="text-white/30">({h.dates})</span></span>
                      <span className={h.closed ? 'text-red-400' : 'text-white/80'}>{h.closed ? 'Closed' : `${h.open} - ${h.close}`}</span>
                    </div>
                  ))}
                </div>
              )}

              {!isEarlyVoting && (
                <p className="text-white/50 text-xs">Election Day polls: 6:00 AM - 7:00 PM</p>
              )}

              {isCass && isEarlyVoting && <p className="text-amber-400 text-[11px] font-medium">Closes at 4:30 PM (earlier than other locations)</p>}
              {isKCEB && isEarlyVoting && <p className="text-golden/70 text-[11px]">Paper ballots available here</p>}

              {'precincts' in loc && loc.precincts.length > 0 && (
                <p className="text-white/40 text-xs">
                  Ward {ward}{('letterCode' in loc && loc.letterCode) ? ` (${loc.letterCode})` : ''} - Precincts: {loc.precincts.join(', ')}
                </p>
              )}

              {isEarlyVotingLoc(loc) && loc.notes && (
                <p className="text-golden/80 text-xs bg-golden/10 rounded-lg px-3 py-2">{loc.notes}</p>
              )}

              <p className="text-white/30 text-[11px]">{loc.county} County</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
