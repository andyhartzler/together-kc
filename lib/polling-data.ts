// Polling location data for the April 7, 2026 election
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
  open: string; // e.g. "8:00 AM"
  close: string; // e.g. "6:00 PM"
  daysOfWeek?: number[]; // 0=Sun, 1=Mon, ... 6=Sat; if omitted, all days in range
  closed?: boolean; // if true, location is closed during this period
}

export interface ElectionDayLocation {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  room?: string;
  county: 'Jackson' | 'Clay' | 'Platte' | 'Cass';
  lat: number;
  lng: number;
  ward?: number;
  precincts: number[];
}

// ============================================================
// EARLY VOTING LOCATIONS
// No-Excuse Absentee Voting: March 24 - April 6, 2026
// ============================================================

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
    lat: 39.0113,
    lng: -94.5392,
    isElectionBoard: true,
    hours: [
      {
        label: 'Weekdays',
        dates: 'March 24 - April 3',
        startDate: '2026-03-24',
        endDate: '2026-04-03',
        open: '8:00 AM',
        close: '6:00 PM',
        daysOfWeek: [1, 2, 3, 4, 5],
      },
      {
        label: 'Saturday',
        dates: 'April 4',
        startDate: '2026-04-04',
        endDate: '2026-04-04',
        open: '8:00 AM',
        close: '12:00 PM',
        daysOfWeek: [6],
      },
      {
        label: 'Monday',
        dates: 'April 6',
        startDate: '2026-04-06',
        endDate: '2026-04-06',
        open: '8:00 AM',
        close: '5:00 PM',
        daysOfWeek: [1],
      },
    ],
    notes: 'Only location using pre-printed paper ballots. All other locations use Ballot Marking Devices only.',
  },
  {
    id: 'jc-fellowship',
    name: 'Fellowship Right Baptist Church',
    address: '4700 Pittman Rd',
    city: 'Kansas City',
    state: 'MO',
    zip: '64133',
    county: 'Jackson',
    lat: 39.0082,
    lng: -94.4891,
    hours: [
      {
        label: 'Weekdays',
        dates: 'March 24 - April 3',
        startDate: '2026-03-24',
        endDate: '2026-04-03',
        open: '10:00 AM',
        close: '6:00 PM',
        daysOfWeek: [1, 2, 3, 4, 5],
      },
      {
        label: 'Saturday',
        dates: 'April 4',
        startDate: '2026-04-04',
        endDate: '2026-04-04',
        open: '8:00 AM',
        close: '12:00 PM',
        daysOfWeek: [6],
      },
    ],
  },
  {
    id: 'jc-garrison',
    name: 'Garrison Community Center',
    address: '1124 E. 5th St',
    city: 'Kansas City',
    state: 'MO',
    zip: '64106',
    county: 'Jackson',
    lat: 39.1072,
    lng: -94.5668,
    hours: [
      {
        label: 'Weekdays',
        dates: 'March 24 - April 3',
        startDate: '2026-03-24',
        endDate: '2026-04-03',
        open: '10:00 AM',
        close: '6:00 PM',
        daysOfWeek: [1, 2, 3, 4, 5],
      },
      {
        label: 'Saturday, April 4',
        dates: 'April 4',
        startDate: '2026-04-04',
        endDate: '2026-04-04',
        open: '',
        close: '',
        closed: true,
      },
    ],
    notes: 'Will NOT be open on Saturday, April 4.',
  },
  {
    id: 'jc-mount-christian',
    name: 'Mount Christian Worship Center',
    address: '1800 E. 79th St',
    city: 'Kansas City',
    state: 'MO',
    zip: '64132',
    county: 'Jackson',
    lat: 38.9756,
    lng: -94.5563,
    hours: [
      {
        label: 'Weekdays',
        dates: 'March 24 - April 3',
        startDate: '2026-03-24',
        endDate: '2026-04-03',
        open: '10:00 AM',
        close: '6:00 PM',
        daysOfWeek: [1, 2, 3, 4, 5],
      },
      {
        label: 'Saturday',
        dates: 'April 4',
        startDate: '2026-04-04',
        endDate: '2026-04-04',
        open: '8:00 AM',
        close: '12:00 PM',
        daysOfWeek: [6],
      },
    ],
    notes: 'Corner of 79th and Paseo.',
  },
  {
    id: 'jc-palestine',
    name: 'Palestine Senior Center',
    address: '3325 Prospect Ave',
    city: 'Kansas City',
    state: 'MO',
    zip: '64128',
    county: 'Jackson',
    lat: 39.0523,
    lng: -94.5494,
    hours: [
      {
        label: 'Weekdays',
        dates: 'March 24 - April 3',
        startDate: '2026-03-24',
        endDate: '2026-04-03',
        open: '10:00 AM',
        close: '6:00 PM',
        daysOfWeek: [1, 2, 3, 4, 5],
      },
      {
        label: 'Saturday',
        dates: 'April 4',
        startDate: '2026-04-04',
        endDate: '2026-04-04',
        open: '8:00 AM',
        close: '12:00 PM',
        daysOfWeek: [6],
      },
    ],
  },
  {
    id: 'jc-second-pres',
    name: 'Second Presbyterian Church',
    address: '318 E. 55th St',
    city: 'Kansas City',
    state: 'MO',
    zip: '64113',
    county: 'Jackson',
    lat: 39.0085,
    lng: -94.5766,
    hours: [
      {
        label: 'Weekdays',
        dates: 'March 24 - April 3',
        startDate: '2026-03-24',
        endDate: '2026-04-03',
        open: '10:00 AM',
        close: '6:00 PM',
        daysOfWeek: [1, 2, 3, 4, 5],
      },
      {
        label: 'Saturday',
        dates: 'April 4',
        startDate: '2026-04-04',
        endDate: '2026-04-04',
        open: '8:00 AM',
        close: '12:00 PM',
        daysOfWeek: [6],
      },
    ],
  },
  {
    id: 'jc-united-believers',
    name: 'United Believers Community Church',
    address: '5600 E. 112th Ter',
    city: 'Kansas City',
    state: 'MO',
    zip: '64134',
    county: 'Jackson',
    lat: 38.9359,
    lng: -94.5173,
    hours: [
      {
        label: 'Weekdays',
        dates: 'March 24 - April 3',
        startDate: '2026-03-24',
        endDate: '2026-04-03',
        open: '10:00 AM',
        close: '6:00 PM',
        daysOfWeek: [1, 2, 3, 4, 5],
      },
      {
        label: 'Saturday',
        dates: 'April 4',
        startDate: '2026-04-04',
        endDate: '2026-04-04',
        open: '8:00 AM',
        close: '12:00 PM',
        daysOfWeek: [6],
      },
    ],
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
    lat: 39.2461,
    lng: -94.4190,
    isElectionBoard: true,
    hours: [
      {
        label: 'Weekdays',
        dates: 'March 24 - April 6',
        startDate: '2026-03-24',
        endDate: '2026-04-06',
        open: '8:00 AM',
        close: '5:00 PM',
        daysOfWeek: [1, 2, 3, 4, 5],
      },
    ],
    notes: 'Only early voting location for Clay County. Located at the Clay County Administration Building in Liberty.',
  },

  // ---- PLATTE COUNTY ----
  {
    id: 'pc-election-board',
    name: 'Platte County Election Board',
    address: '415 Third St',
    city: 'Platte City',
    state: 'MO',
    zip: '64079',
    county: 'Platte',
    lat: 39.3688,
    lng: -94.7823,
    isElectionBoard: true,
    hours: [
      {
        label: 'Weekdays',
        dates: 'March 24 - April 6',
        startDate: '2026-03-24',
        endDate: '2026-04-06',
        open: '8:00 AM',
        close: '5:00 PM',
        daysOfWeek: [1, 2, 3, 4, 5],
      },
    ],
    notes: 'Only early voting location for Platte County residents. Located in Platte City.',
  },

  // ---- CASS COUNTY ----
  {
    id: 'cass-election-board',
    name: 'Cass County Election Board',
    address: '2733 Cantrell Rd',
    city: 'Harrisonville',
    state: 'MO',
    zip: '64701',
    county: 'Cass',
    lat: 38.6531,
    lng: -94.3469,
    isElectionBoard: true,
    hours: [
      {
        label: 'Weekdays',
        dates: 'March 24 - April 6',
        startDate: '2026-03-24',
        endDate: '2026-04-06',
        open: '8:00 AM',
        close: '5:00 PM',
        daysOfWeek: [1, 2, 3, 4, 5],
      },
    ],
    notes: 'Only early voting location for Cass County residents. Located in Harrisonville.',
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

    // This schedule applies today
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
  const earlyVotingEnd = '2026-04-06';
  if (todayStr > earlyVotingEnd) {
    return { isOpen: false, status: 'Early voting has ended' as string };
  }
  if (todayStr < '2026-03-24') {
    return { isOpen: false, status: 'Opens March 24' as string };
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
  date: '2026-04-07',
  dateFormatted: 'April 7, 2026',
  hours: {
    open: '6:00 AM',
    close: '7:00 PM',
  },
  notes: 'On Election Day, voters must go to their assigned polling place based on their home address (ward and precinct).',
  lookupUrls: {
    jackson: 'https://www.kceb.org',
    clay: 'https://cceb.maps.arcgis.com/apps/instant/lookup/index.html?appid=0fcebdd0259945a9aded62759f77c311',
    platte: 'https://www.plattecountymovotes.gov',
    cass: 'https://casscounty.com/2355/Absentee-Information',
  },
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
    name: 'Platte County Election Board',
    phone: '(816) 858-2232',
    website: 'https://www.plattecountymovotes.gov',
    address: '415 Third St, Platte City, MO 64079',
  },
  Cass: {
    name: 'Cass County Clerk - Election Division',
    phone: '(816) 380-8108',
    website: 'https://casscounty.com/2355/Absentee-Information',
    address: '2733 Cantrell Rd, Harrisonville, MO 64701',
  },
} as const;
