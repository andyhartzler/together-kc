'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInlineMap } from '@/hooks/useAppleMap';
import {
  getLocationStatus,
  getDirectionsUrl,
  getDistanceMiles,
  fullAddress,
  getCentralDateStr,
  type LocationStatus,
} from '@/lib/voting-utils';
import { downloadEarlyVoteEvent } from '@/lib/calendar';
import { EARLY_VOTING_INFO, type EarlyVotingLocation } from '@/lib/polling-data';
import type { ElectionDayLocation } from '@/lib/election-day-data';
import SendToPhone from './SendToPhone';

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

/** Get available dates as a Set for O(1) lookup */
function getAvailableDateSet(loc: EarlyVotingLocation): Set<string> {
  const available = new Set<string>();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const end = new Date('2026-08-03T23:59:59');

  for (let d = new Date(today); d <= end; d.setDate(d.getDate() + 1)) {
    const iso = d.toISOString().split('T')[0];
    const dayOfWeek = d.getDay();
    for (const entry of loc.hours) {
      if (entry.closed) continue;
      if (iso < entry.startDate || iso > entry.endDate) continue;
      if (entry.daysOfWeek && !entry.daysOfWeek.includes(dayOfWeek)) continue;
      available.add(iso);
      break;
    }
  }
  return available;
}

/** Generate calendar weeks covering the early voting period: Jul 19 (Sun) - Aug 8 (Sat) */
function getCalendarWeeks(): string[][] {
  const start = new Date('2026-07-19T12:00:00');
  const weeks: string[][] = [];
  let week: string[] = [];
  for (let i = 0; i < 21; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    week.push(d.toISOString().split('T')[0]);
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }
  return weeks;
}

/** True when the board only has a verified date window, with no confirmed daily clock times. */
function hasUnverifiedHours(loc: EarlyVotingLocation): boolean {
  return loc.hours.some((h) => !h.closed && (h.unverifiedHours || !h.open || !h.close));
}

/** Honest, non-clock status for window-only boards (never asserts a closing time). */
function windowStatus(todayCentral: string): LocationStatus {
  if (todayCentral > EARLY_VOTING_INFO.endDate) return { isOpen: false, status: 'Early voting has ended' };
  if (todayCentral < EARLY_VOTING_INFO.startDate) return { isOpen: false, status: 'Opens July 21' };
  return { isOpen: true, status: 'Open July 21 to Aug 3' };
}

/** Get open/close times in 24h format for a given date at a location */
function getOpenHours(loc: EarlyVotingLocation, date: string): { min: string; max: string } | null {
  const d = new Date(date + 'T12:00:00');
  const dayOfWeek = d.getDay();
  for (const entry of loc.hours) {
    if (entry.closed) continue;
    if (date < entry.startDate || date > entry.endDate) continue;
    if (entry.daysOfWeek && !entry.daysOfWeek.includes(dayOfWeek)) continue;
    // Unverified window entry: no confirmed clock times to constrain the picker.
    if (entry.unverifiedHours || !entry.open || !entry.close) return null;
    const toTime24 = (s: string) => {
      const m = s.match(/(\d+):(\d+)\s*(AM|PM)/i);
      if (!m) return '00:00';
      let h = parseInt(m[1]);
      const min = m[2];
      if (m[3].toUpperCase() === 'PM' && h !== 12) h += 12;
      if (m[3].toUpperCase() === 'AM' && h === 12) h = 0;
      return `${String(h).padStart(2, '0')}:${min}`;
    };
    return { min: toTime24(entry.open), max: toTime24(entry.close) };
  }
  return null;
}

/** Format 24h "HH:MM" -> "h:MM AM/PM" */
function formatTime(t: string): string {
  const [hStr, mStr] = t.split(':');
  let h = parseInt(hStr, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  if (h === 0) h = 12;
  else if (h > 12) h -= 12;
  return `${h}:${mStr} ${ampm}`;
}

const DAY_HEADERS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const CALENDAR_WEEKS = getCalendarWeeks();

export default function LocationCard({ location: loc, userLat, userLng, isEarlyVoting, isSelected, onSelect }: Props) {
  const isExpanded = isSelected;

  const [showPlanToVote, setShowPlanToVote] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // Boards with only a verified date window get an honest window status instead
  // of the clock-derived one (which would otherwise compute a misleading time).
  const unverifiedHours = isEarlyVotingLoc(loc) && hasUnverifiedHours(loc);
  const status: LocationStatus | null = isEarlyVotingLoc(loc)
    ? (unverifiedHours ? windowStatus(getCentralDateStr()) : getLocationStatus(loc))
    : null;

  const distance = userLat !== undefined && userLng !== undefined && loc.lat !== 0
    ? getDistanceMiles(userLat, userLng, loc.lat, loc.lng) : null;

  const addr = fullAddress(loc);
  const isKCEB = isEarlyVotingLoc(loc) && loc.isElectionBoard;
  const ward = 'ward' in loc ? loc.ward : undefined;
  const room = 'room' in loc ? loc.room : undefined;

  const availableDateSet = useMemo(() => {
    if (!isEarlyVotingLoc(loc) || !isEarlyVoting) return new Set<string>();
    return getAvailableDateSet(loc);
  }, [loc, isEarlyVoting]);

  const openHours = useMemo(() => {
    if (!selectedDate || !isEarlyVotingLoc(loc)) return null;
    return getOpenHours(loc, selectedDate);
  }, [loc, selectedDate]);

  const { mapRef: inlineMapRef, isLoaded: inlineMapLoaded } = useInlineMap(loc.lat, loc.lng, isExpanded && loc.lat !== 0);

  const todayIso = useMemo(() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return t.toISOString().split('T')[0];
  }, []);

  const handlePlanToVote = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowPlanToVote(!showPlanToVote);
  };

  const handleDateSelect = (e: React.MouseEvent, date: string) => {
    e.stopPropagation();
    if (!availableDateSet.has(date)) return;
    if (date < todayIso) return;
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    setSelectedTime(e.target.value || null);
  };

  const handleAddToCalendar = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedDate || !selectedTime) return;
    const locationAddress = `${loc.address}, ${loc.city}, ${loc.state} ${loc.zip}`;
    downloadEarlyVoteEvent(selectedDate, selectedTime, loc.name, locationAddress);
  };

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

              {/* Make a Plan to Vote */}
              {isEarlyVoting && isEarlyVotingLoc(loc) && (
                <div>
                  <button
                    onClick={handlePlanToVote}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-sky/15 border border-sky/30 text-sky text-sm font-semibold hover:bg-sky/25 transition-colors min-h-[44px]"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {showPlanToVote ? 'Close Planner' : 'Make a Plan to Vote'}
                  </button>

                  <AnimatePresence>
                    {showPlanToVote && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="mt-3 rounded-xl bg-white/5 border border-white/10 p-4 space-y-4"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* Calendar grid date picker */}
                        <div>
                          <p className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-3">Pick a date</p>

                          {/* Day-of-week headers */}
                          <div className="grid grid-cols-7 gap-px mb-1">
                            {DAY_HEADERS.map((d) => (
                              <div key={d} className="text-center text-[10px] font-semibold uppercase tracking-wider text-white/40 py-1">
                                {d}
                              </div>
                            ))}
                          </div>

                          {/* Calendar weeks */}
                          <div className="grid gap-px">
                            {CALENDAR_WEEKS.map((week, wi) => (
                              <div key={wi} className="grid grid-cols-7 gap-px">
                                {week.map((dateStr) => {
                                  const dayNum = parseInt(dateStr.split('-')[2], 10);
                                  const isAvailable = availableDateSet.has(dateStr);
                                  const isPast = dateStr < todayIso;
                                  const isSelected = selectedDate === dateStr;
                                  const isDisabled = !isAvailable || isPast;

                                  return (
                                    <button
                                      key={dateStr}
                                      onClick={(e) => handleDateSelect(e, dateStr)}
                                      disabled={isDisabled}
                                      className={`
                                        relative aspect-square flex items-center justify-center rounded-lg text-xs font-medium transition-all
                                        ${isSelected
                                          ? 'bg-coral text-white shadow-lg shadow-coral/25'
                                          : isDisabled
                                            ? 'bg-white/[0.03] text-white/20 cursor-default'
                                            : 'bg-white/[0.03] text-white hover:bg-white/10 cursor-pointer'
                                        }
                                      `}
                                    >
                                      {dayNum}
                                    </button>
                                  );
                                })}
                              </div>
                            ))}
                          </div>

                          {/* Month labels */}
                          <div className="flex justify-between mt-1.5 px-1">
                            <span className="text-[10px] text-white/30 font-medium">July 2026</span>
                            <span className="text-[10px] text-white/30 font-medium">August 2026</span>
                          </div>
                        </div>

                        {/* Time picker - native input */}
                        <AnimatePresence>
                          {selectedDate && isEarlyVotingLoc(loc) && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            >
                              <p className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-2">Pick a time</p>
                              <div className="flex items-center gap-3">
                                <input
                                  type="time"
                                  value={selectedTime || ''}
                                  onChange={handleTimeChange}
                                  onClick={(e) => e.stopPropagation()}
                                  min={openHours?.min}
                                  max={openHours?.max}
                                  className="flex-1 px-4 py-2.5 rounded-lg bg-white/10 border border-white/10 text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-coral/50 focus:border-coral/50 transition-all [color-scheme:dark]"
                                />
                                <span className="text-white/40 text-xs whitespace-nowrap">
                                  {openHours ? `${formatTime(openHours.min)} - ${formatTime(openHours.max)}` : 'Confirm hours at kceb.org'}
                                </span>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Add to Calendar button */}
                        <AnimatePresence>
                          {selectedDate && selectedTime && (
                            <motion.button
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              onClick={handleAddToCalendar}
                              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-coral text-white text-sm font-bold hover:bg-coral/90 transition-colors min-h-[48px]"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              Add to Calendar
                            </motion.button>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Directions button */}
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

              <SendToPhone address={addr} locationName={loc.name} />

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

              {/* Today's hours (only when verified clock times exist) */}
              {status?.todayHours?.open && status?.todayHours?.close && (
                <p className="text-white/40 text-xs">Today: {status.todayHours.open} - {status.todayHours.close}</p>
              )}

              {/* Full schedule */}
              {isEarlyVotingLoc(loc) && (
                <div>
                  <p className="text-white/40 text-[10px] uppercase tracking-wider font-semibold mb-1">Hours</p>
                  {loc.hours.map((h, i) => {
                    const unverified = !h.closed && (h.unverifiedHours || !h.open || !h.close);
                    return (
                      <div key={i} className="flex justify-between text-xs py-0.5">
                        <span className="text-white/60">{h.label} <span className="text-white/30">({h.dates})</span></span>
                        <span className={h.closed ? 'text-red-400' : 'text-white/80'}>
                          {h.closed ? 'Closed' : unverified ? 'Confirm hours' : `${h.open} - ${h.close}`}
                        </span>
                      </div>
                    );
                  })}
                  {hasUnverifiedHours(loc) && (
                    <p className="text-white/40 text-[11px] mt-1.5">
                      Confirm exact hours at the Kansas City Election Board (
                      <a
                        href={EARLY_VOTING_INFO.kcebUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-sky underline"
                      >
                        kceb.org
                      </a>
                      ).
                    </p>
                  )}
                </div>
              )}

              {!isEarlyVoting && (
                <p className="text-white/50 text-xs">Election Day polls: 6:00 AM - 7:00 PM</p>
              )}


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
