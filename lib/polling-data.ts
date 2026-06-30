// Polling location data for the August 4, 2026 election
// Kansas City spans Jackson, Clay, Platte, and Cass counties

export interface EarlyVotingLocation {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  county: 'Jackson' | 'Clay' | 'Platte' | 'Cass';
  lat: number;
  lng: number;
  hours: ScheduleEntry[];
  notes?: string;
  isElectionBoard?: boolean;
}

export interface ScheduleEntry {
  label: string;
  dates: string; // human-readable date range
  startDate: string; // ISO date for comparison
  endDate: string; // ISO date for comparison
  // Verified clock times. Leave as '' for window-only entries whose exact daily
  // hours are NOT confirmed (see unverifiedHours). Never present empty/unverified
  // times to users as fact.
  open: string; // e.g. "8:00 AM" ('' when hours are unverified)
  close: string; // e.g. "6:00 PM" ('' when hours are unverified)
  daysOfWeek?: number[]; // 0=Sun, 1=Mon, ... 6=Sat; if omitted, all days in range
  closed?: boolean; // if true, location is closed during this period
  // True when only the date window is verified and the exact daily open/close
  // clock times (and which weekdays) are NOT confirmed. Consumers must show the
  // window plus a "confirm at kceb.org" note instead of asserting clock times.
  unverifiedHours?: boolean;
}

// ============================================================
// EARLY VOTING LOCATIONS
// No-excuse early in-person voting: Tuesday, July 21 - Monday, August 3, 2026
//
// The verified, always-available early-voting site is each county's
// election board (the election authority). We do NOT list the April
// community satellite sites here, because their August dates and hours
// are not yet published. For the full list of early-voting satellite
// sites and their confirmed hours, send users to the Kansas City
// Election Board (see EARLY_VOTING_INFO below / https://kceb.org).
// ============================================================

// Where to send voters for the full, confirmed list of August early-voting
// satellite sites and hours (we do not fabricate those locations/hours).
export const EARLY_VOTING_INFO = {
  windowLabel: 'Tuesday, July 21 - Monday, August 3, 2026',
  startDate: '2026-07-21',
  endDate: '2026-08-03',
  satelliteSitesNote:
    'Your county election board is open for early in-person voting during this window. Additional early-voting satellite sites may be added closer to the election. For the full list of sites and confirmed hours, visit the Kansas City Election Board.',
  kcebUrl: 'https://kceb.org',
} as const;

export const EARLY_VOTING_LOCATIONS: EarlyVotingLocation[] = [
  // ---- JACKSON COUNTY (Kansas City Election Board) ----
  {
    id: 'jc-kceb',
    name: 'Kansas City Election Board',
    address: '4405 E. 50th Terrace',
    city: 'Kansas City',
    state: 'MO',
    zip: '64130',
    county: 'Jackson',
    lat: 39.0340263,
    lng: -94.5334411,
    isElectionBoard: true,
    hours: [
      {
        label: 'Early voting',
        dates: 'July 21 to Aug 3, 2026',
        startDate: '2026-07-21',
        endDate: '2026-08-03',
        open: '',
        close: '',
        unverifiedHours: true,
      },
    ],
    notes: 'Early in-person voting runs Tuesday, July 21 through Monday, August 3, 2026 at the election board. Confirm exact daily hours and find any additional early-voting satellite sites at the Kansas City Election Board (kceb.org).',
  },

  // ---- CLAY COUNTY ----
  {
    id: 'cc-election-board',
    name: 'Clay County Election Board',
    address: '100 W. Mississippi St',
    city: 'Liberty',
    state: 'MO',
    zip: '64068',
    county: 'Clay',
    lat: 39.2484968,
    lng: -94.4216175,
    isElectionBoard: true,
    hours: [
      {
        label: 'Early voting',
        dates: 'July 21 to Aug 3, 2026',
        startDate: '2026-07-21',
        endDate: '2026-08-03',
        open: '',
        close: '',
        unverifiedHours: true,
      },
    ],
    notes: 'Early in-person voting for Clay County, July 21 through August 3, 2026, at the Clay County Administration Building in Liberty. Confirm exact daily hours at the Kansas City Election Board (kceb.org).',
  },

  // ---- PLATTE COUNTY ----
  {
    id: 'pc-election-board',
    name: 'Platte County Board of Elections',
    address: '2600 NW Prairie View Rd',
    city: 'Platte City',
    state: 'MO',
    zip: '64079',
    county: 'Platte',
    lat: 39.3499953,
    lng: -94.7601388,
    isElectionBoard: true,
    hours: [
      {
        label: 'Early voting',
        dates: 'July 21 to Aug 3, 2026',
        startDate: '2026-07-21',
        endDate: '2026-08-03',
        open: '',
        close: '',
        unverifiedHours: true,
      },
    ],
    notes: 'Early in-person voting for Platte County residents, July 21 through August 3, 2026. About 20 min north of the Northland/KCI area. Confirm exact daily hours at the Kansas City Election Board (kceb.org).',
  },

  // ---- CASS COUNTY ----
  {
    id: 'cass-election-board',
    name: 'Cass County Clerk - Election Office',
    address: '102 E. Wall St',
    city: 'Harrisonville',
    state: 'MO',
    zip: '64701',
    county: 'Cass',
    lat: 38.6544446,
    lng: -94.3482519,
    isElectionBoard: true,
    hours: [
      {
        label: 'Early voting',
        dates: 'July 21 to Aug 3, 2026',
        startDate: '2026-07-21',
        endDate: '2026-08-03',
        open: '',
        close: '',
        unverifiedHours: true,
      },
    ],
    notes: 'Early in-person voting for Cass County residents, July 21 through August 3, 2026. Very few KC residents live in the Cass County portion of Kansas City. Confirm exact daily hours at the Kansas City Election Board (kceb.org).',
  },
];

// ============================================================
// HELPERS
// ============================================================

/**
 * Check if a location is currently open.
 * Returns { isOpen, opensAt, closesAt, nextOpen } based on current date/time.
 */
export function getLocationStatus(location: EarlyVotingLocation, now: Date = new Date()) {
  const currentDay = now.getDay(); // 0=Sun ... 6=Sat
  const todayStr = now.toISOString().slice(0, 10);

  for (const schedule of location.hours) {
    if (schedule.closed) continue;
    if (todayStr < schedule.startDate || todayStr > schedule.endDate) continue;
    if (schedule.daysOfWeek && !schedule.daysOfWeek.includes(currentDay)) continue;

    // Window-only entry: we know the date window but the exact daily open/close
    // clock times are NOT verified. Return an honest, non-clock status (positive
    // within the window) instead of asserting a specific closing time.
    if (schedule.unverifiedHours || !schedule.open || !schedule.close) {
      return {
        isOpen: true,
        status: 'Open July 21 to Aug 3' as string,
      };
    }

    // This schedule applies today (verified clock times)
    const [openH, openM] = parseTime(schedule.open);
    const [closeH, closeM] = parseTime(schedule.close);

    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const openMinutes = openH * 60 + openM;
    const closeMinutes = closeH * 60 + closeM;

    if (currentMinutes >= openMinutes && currentMinutes < closeMinutes) {
      return {
        isOpen: true,
        closesAt: schedule.close,
        status: `Open until ${schedule.close}` as string,
      };
    } else if (currentMinutes < openMinutes) {
      return {
        isOpen: false,
        opensAt: schedule.open,
        status: `Opens at ${schedule.open}` as string,
      };
    } else {
      return {
        isOpen: false,
        status: 'Closed for today' as string,
      };
    }
  }

  // Check if location is closed on a special day (like Garrison on Apr 4)
  for (const schedule of location.hours) {
    if (schedule.closed && todayStr >= schedule.startDate && todayStr <= schedule.endDate) {
      return { isOpen: false, status: 'Closed today' as string };
    }
  }

  // No matching schedule
  const earlyVotingEnd = '2026-08-03';
  if (todayStr > earlyVotingEnd) {
    return { isOpen: false, status: 'Early voting has ended' as string };
  }
  if (todayStr < '2026-07-21') {
    return { isOpen: false, status: 'Opens July 21' as string };
  }

  return { isOpen: false, status: 'Closed today' as string };
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

/**
 * Calculate distance between two lat/lng points in miles (Haversine formula)
 */
export function getDistanceMiles(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  const R = 3959; // Earth radius in miles
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

// ============================================================
// ELECTION DAY INFO
// ============================================================

export const ELECTION_DAY_INFO = {
  date: '2026-08-04',
  dateFormatted: 'August 4, 2026',
  hours: {
    open: '6:00 AM',
    close: '7:00 PM',
  },
  notes: 'On Election Day, voters must go to their assigned polling place based on their home address.',
  jacksonCountyNote: 'Jackson County voters can vote at ANY KC polling location on Election Day.',
  lookupUrls: {
    jackson: 'https://www.kceb.org',
    clay: 'https://cceb.maps.arcgis.com/apps/instant/lookup/index.html?appid=0fcebdd0259945a9aded62759f77c311',
    platte: 'https://www.plattecountymovotes.gov',
    cass: 'https://casscounty.com/2355/Absentee-Information',
  },
  voterLookup: 'https://voteroutreach.sos.mo.gov/portal/',
} as const;

// County election board contact info
export const COUNTY_ELECTION_BOARDS = {
  Jackson: {
    name: 'Kansas City Board of Election Commissioners',
    phone: '(816) 842-4820',
    website: 'https://www.kceb.org',
    address: '4405 E. 50th Terrace, Kansas City, MO 64130',
  },
  Clay: {
    name: 'Clay County Board of Election Commissioners',
    phone: '(816) 415-8683',
    website: 'https://www.voteclaycountymo.gov',
    address: '100 W. Mississippi St, Liberty, MO 64068',
  },
  Platte: {
    name: 'Platte County Board of Elections',
    phone: '(816) 858-4400',
    website: 'https://www.plattecountymovotes.gov',
    address: '2600 NW Prairie View Rd, Platte City, MO 64079',
  },
  Cass: {
    name: 'Cass County Clerk - Election Office',
    phone: '(816) 380-8102',
    website: 'https://casscounty.com/2355/Absentee-Information',
    address: '102 E. Wall St, Harrisonville, MO 64701',
  },
} as const;
