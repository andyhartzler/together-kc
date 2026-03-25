import type { EarlyVotingLocation } from './polling-data';

export type County = 'Jackson' | 'Clay' | 'Platte' | 'Cass';
export type VotingMode = 'early' | 'election-day';

const TZ = 'America/Chicago';

/** @deprecated Use getCentralHoursMinutes() for time comparisons; this re-parse approach
 *  can silently produce wrong results for users outside Central Time. Kept for backward compat. */
export function getCentralTime(): Date {
  const str = new Date().toLocaleString('en-US', { timeZone: TZ });
  return new Date(str);
}

function getCentralHoursMinutes(): { hours: number; minutes: number } {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: TZ,
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  });
  const parts = formatter.formatToParts(new Date());
  return {
    hours: parseInt(parts.find((p) => p.type === 'hour')!.value),
    minutes: parseInt(parts.find((p) => p.type === 'minute')!.value),
  };
}

export function getCentralDateStr(): string {
  const now = getCentralTime();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getVotingMode(): VotingMode {
  const today = getCentralDateStr();
  return today >= '2026-04-07' ? 'election-day' : 'early';
}

export function hasEarlyVotingEnded(): boolean {
  return getCentralDateStr() > '2026-04-06';
}

export function hasElectionEnded(): boolean {
  return getCentralDateStr() > '2026-04-07';
}

export function earlyVotingDaysLeft(): number {
  const todayStr = getCentralDateStr();
  const endStr = '2026-04-06';
  if (todayStr > endStr) return 0;
  const today = new Date(todayStr + 'T00:00:00');
  const end = new Date(endStr + 'T00:00:00');
  return Math.ceil((end.getTime() - today.getTime()) / 86400000) + 1;
}

function parseTime(timeStr: string): [number, number] {
  const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return [0, 0];
  let hours = parseInt(match[1]);
  const minutes = parseInt(match[2]);
  const period = match[3].toUpperCase();
  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;
  return [hours, minutes];
}

export interface LocationStatus {
  isOpen: boolean;
  status: string;
  closesAt?: string;
  opensAt?: string;
  minutesUntilClose?: number;
  todayHours?: { open: string; close: string };
}

export function getLocationStatus(location: EarlyVotingLocation): LocationStatus {
  const todayStr = getCentralDateStr();
  const dayFormatter = new Intl.DateTimeFormat('en-US', { timeZone: TZ, weekday: 'short' });
  const dayMap: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  const currentDay = dayMap[dayFormatter.format(new Date())] ?? new Date().getDay();

  for (const schedule of location.hours) {
    if (schedule.closed) continue;
    if (todayStr < schedule.startDate || todayStr > schedule.endDate) continue;
    if (schedule.daysOfWeek && !schedule.daysOfWeek.includes(currentDay)) continue;

    const [openH, openM] = parseTime(schedule.open);
    const [closeH, closeM] = parseTime(schedule.close);
    const { hours: centralH, minutes: centralM } = getCentralHoursMinutes();
    const currentMinutes = centralH * 60 + centralM;
    const openMinutes = openH * 60 + openM;
    const closeMinutes = closeH * 60 + closeM;

    if (currentMinutes >= openMinutes && currentMinutes < closeMinutes) {
      const minutesLeft = closeMinutes - currentMinutes;
      return {
        isOpen: true,
        closesAt: schedule.close,
        minutesUntilClose: minutesLeft,
        status: minutesLeft <= 60
          ? `Closes in ${minutesLeft} min`
          : `Open until ${schedule.close}`,
        todayHours: { open: schedule.open, close: schedule.close },
      };
    } else if (currentMinutes < openMinutes) {
      return {
        isOpen: false,
        opensAt: schedule.open,
        status: `Opens at ${schedule.open}`,
        todayHours: { open: schedule.open, close: schedule.close },
      };
    } else {
      return { isOpen: false, status: 'Closed for today' };
    }
  }

  for (const schedule of location.hours) {
    if (schedule.closed && todayStr >= schedule.startDate && todayStr <= schedule.endDate) {
      return { isOpen: false, status: 'Closed today' };
    }
  }

  const nextSchedule = location.hours.find((s) => !s.closed && s.startDate > todayStr);
  if (nextSchedule) {
    return { isOpen: false, status: `Opens ${nextSchedule.dates}` };
  }

  return { isOpen: false, status: 'Not currently open' };
}

export function getDirectionsUrl(address: string): string {
  const encoded = encodeURIComponent(address);
  if (typeof navigator !== 'undefined' && /iPhone|iPad|iPod|Macintosh/.test(navigator.userAgent)) {
    return `https://maps.apple.com/?daddr=${encoded}`;
  }
  return `https://www.google.com/maps/dir/?api=1&destination=${encoded}`;
}

export function getDistanceMiles(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 3959;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function fullAddress(loc: { address: string; city: string; state: string; zip: string }): string {
  return `${loc.address}, ${loc.city}, ${loc.state} ${loc.zip}`;
}

export const KC_COUNTIES: County[] = ['Jackson', 'Clay', 'Platte', 'Cass'];

export const COUNTY_CENTERS: Record<County, { lat: number; lng: number }> = {
  Jackson: { lat: 39.0997, lng: -94.5786 },
  Clay: { lat: 39.3103, lng: -94.4204 },
  Platte: { lat: 39.3755, lng: -94.7723 },
  Cass: { lat: 38.6473, lng: -94.3546 },
};
