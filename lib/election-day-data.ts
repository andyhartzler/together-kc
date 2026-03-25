// Election Day Polling Location Data - April 7, 2026
// Auto-generated with geocoded coordinates from Google Maps API

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
  letterCode?: string;
  precincts: number[];
  distance?: number;
}

// JACKSON COUNTY - 53 Election Day Polling Locations (Wards 1-19)
// ANY registered KC voter can vote at ANY of these on Election Day
export const JACKSON_COUNTY_LOCATIONS: ElectionDayLocation[] = [
  { id: 'jc-w1a', name: 'Tony Aguirre Community Ctr', address: '2050 West Pennway St', city: 'Kansas City', state: 'MO', zip: '64108', room: 'Meeting Room', county: 'Jackson' as const, lat: 39.0881715, lng: -94.5951099, ward: 1, letterCode: 'A', precincts: [1, 5, 10] },
  { id: 'jc-w1b', name: 'Sacred Heart Hall', address: '814 W. 26th St', city: 'Kansas City', state: 'MO', zip: '64108', room: 'Hall - Basement', county: 'Jackson' as const, lat: 39.0804921, lng: -94.5947714, ward: 1, letterCode: 'B', precincts: [2, 7] },
  { id: 'jc-w1c', name: 'Grace & Holy Trinity Cathedral', address: '415 W. 13th St', city: 'Kansas City', state: 'MO', zip: '64105', room: 'Haden Hall - Enter North Side', county: 'Jackson' as const, lat: 39.0981201, lng: -94.5894433, ward: 1, letterCode: 'C', precincts: [3, 4, 8, 11] },
  { id: 'jc-w1d', name: 'WW I Museum', address: '2 Memorial Drive', city: 'Kansas City', state: 'MO', zip: '64108', room: 'South Lawn Parking', county: 'Jackson' as const, lat: 39.080663, lng: -94.5860835, ward: 1, letterCode: 'D', precincts: [6, 9] },
  { id: 'jc-w2a', name: 'Wayne Miner Court', address: '1940 E. 11th St', city: 'Kansas City', state: 'MO', zip: '64106', room: 'Gym', county: 'Jackson' as const, lat: 39.1006813, lng: -94.5768839, ward: 2, letterCode: 'A', precincts: [1, 2, 3, 6, 10, 11, 13, 15, 16, 17, 18, 23, 25, 26, 27, 28] },
  { id: 'jc-w2b', name: 'Lincoln Middle School', address: '2012 E. 23rd St', city: 'Kansas City', state: 'MO', zip: '64127', room: 'Gym', county: 'Jackson' as const, lat: 39.0851958, lng: -94.5589638, ward: 2, letterCode: 'B', precincts: [4, 5, 7, 8, 9, 12, 14, 19, 20, 21, 22, 24] },
  { id: 'jc-w3a', name: 'Mohart Multi-Purpose Center', address: '3200 Wayne Ave', city: 'Kansas City', state: 'MO', zip: '64109', room: 'Multipurpose Room', county: 'Jackson' as const, lat: 39.0680571, lng: -94.5651669, ward: 3, letterCode: 'A', precincts: [1, 2, 3, 12, 16, 21] },
  { id: 'jc-w3b', name: 'Mt Sinai Baptist Church', address: '3634 Brooklyn Ave', city: 'Kansas City', state: 'MO', zip: '64109', room: 'Gym', county: 'Jackson' as const, lat: 39.0599711, lng: -94.55818939999999, ward: 3, letterCode: 'B', precincts: [4, 5, 6, 7, 8, 11, 14] },
  { id: 'jc-w3c', name: 'Mt Pleasant Baptist Church', address: '2200 Olive St', city: 'Kansas City', state: 'MO', zip: '64127', room: 'Fellowship Hall', county: 'Jackson' as const, lat: 39.0852131, lng: -94.55460079999999, ward: 3, letterCode: 'C', precincts: [9, 10, 13, 15, 17, 18, 19, 20] },
  { id: 'jc-w4a', name: 'Central Presbyterian Church', address: '3501 Campbell St', city: 'Kansas City', state: 'MO', zip: '64109', room: 'Use Back Entrance', county: 'Jackson' as const, lat: 39.0629685, lng: -94.5737863, ward: 4, letterCode: 'A', precincts: [1, 7, 8, 9, 10, 12, 13, 14, 15, 16, 17, 18, 19] },
  { id: 'jc-w4b', name: 'MCC-Penn Valley', address: '3201 Southwest Tfwy', city: 'Kansas City', state: 'MO', zip: '64111', room: 'Education Center (Use 31st St Ent)', county: 'Jackson' as const, lat: 39.069596, lng: -94.5934436, ward: 4, letterCode: 'B', precincts: [2, 3, 4, 5, 6, 11] },
  { id: 'jc-w5a', name: 'All Souls Church', address: '4501 Walnut St', city: 'Kansas City', state: 'MO', zip: '64111', room: 'Conover Room', county: 'Jackson' as const, lat: 39.045852, lng: -94.5845762, ward: 5, letterCode: 'A', precincts: [1, 2, 6, 7, 8, 10, 12] },
  { id: 'jc-w5b', name: 'Westport Presbyterian Church', address: '201 Westport Rd', city: 'Kansas City', state: 'MO', zip: '64111', room: 'Meeting Room', county: 'Jackson' as const, lat: 39.0538889, lng: -94.5883333, ward: 5, letterCode: 'B', precincts: [3, 5, 9] },
  { id: 'jc-w5c', name: 'Roanoke Community Center', address: '3601 Roanoke Rd', city: 'Kansas City', state: 'MO', zip: '64111', room: 'Gym', county: 'Jackson' as const, lat: 39.0603209, lng: -94.6001659, ward: 5, letterCode: 'C', precincts: [4, 11] },
  { id: 'jc-w6a', name: 'Resurrection Brookside', address: '5144 Oak St', city: 'Kansas City', state: 'MO', zip: '64112', room: 'Connect Room', county: 'Jackson' as const, lat: 39.0328654, lng: -94.58353079999999, ward: 6, letterCode: 'A', precincts: [1, 4, 5, 6, 21, 23] },
  { id: 'jc-w6b', name: 'Second Presbyterian Church', address: '318 E. 55th St', city: 'Kansas City', state: 'MO', zip: '64113', room: 'Westminster Room (Enter North Door)', county: 'Jackson' as const, lat: 39.0277082, lng: -94.58404349999999, ward: 6, letterCode: 'B', precincts: [2, 3, 7, 8, 16, 18, 19, 20, 22, 24] },
  { id: 'jc-w6c', name: 'Olive Branch Baptist Ch', address: '915 E. 59th St', city: 'Kansas City', state: 'MO', zip: '64110', room: 'Fellowship Hall', county: 'Jackson' as const, lat: 39.0197753, lng: -94.57586339999999, ward: 6, letterCode: 'C', precincts: [9, 10, 11, 12, 13, 14, 15, 17] },
  { id: 'jc-w7a', name: 'Sunlight Missionary Baptist Ch', address: '4444 Woodland Ave', city: 'Kansas City', state: 'MO', zip: '64110', room: 'Sanctuary', county: 'Jackson' as const, lat: 39.0453654, lng: -94.563655, ward: 7, letterCode: 'A', precincts: [1, 2, 3, 5, 7, 8, 9, 10, 12, 15] },
  { id: 'jc-w7b', name: 'Mary Williams-Neal Comm Center', address: '3801 Emanuel Cleaver Blvd', city: 'Kansas City', state: 'MO', zip: '64130', room: 'Formerly Brush Creek Comm Ctr', county: 'Jackson' as const, lat: 39.0378379, lng: -94.54012469999999, ward: 7, letterCode: 'B', precincts: [4, 6, 11, 13, 14, 16, 17, 18] },
  { id: 'jc-w8a', name: 'Country Club Christian Ch', address: '6101 Ward Pkwy', city: 'Kansas City', state: 'MO', zip: '64113', room: 'Social Room', county: 'Jackson' as const, lat: 39.016953, lng: -94.6011912, ward: 8, letterCode: 'A', precincts: [1, 4, 14] },
  { id: 'jc-w8b', name: 'Wornall Road Baptist Church', address: '400 W. Meyer Blvd', city: 'Kansas City', state: 'MO', zip: '64113', room: 'Basement', county: 'Jackson' as const, lat: 39.0129593, lng: -94.59354839999999, ward: 8, letterCode: 'B', precincts: [2, 3, 11, 13, 15, 16, 17, 21, 22] },
  { id: 'jc-w8c', name: 'HJ Youth Center', address: '6425 Wornall Rd', city: 'Kansas City', state: 'MO', zip: '64113', room: 'Meeting Room', county: 'Jackson' as const, lat: 39.0112582, lng: -94.592868, ward: 8, letterCode: 'C', precincts: [5, 6, 12] },
  { id: 'jc-w8d', name: 'KC United Church of Christ', address: '205 W. 65th St', city: 'Kansas City', state: 'MO', zip: '64113', room: 'Fellowship Hall', county: 'Jackson' as const, lat: 39.010058, lng: -94.591318, ward: 8, letterCode: 'D', precincts: [7, 8, 9, 10, 18, 19, 20] },
  { id: 'jc-w9a', name: 'Keystone United Methodist Ch', address: '406 W. 74th St', city: 'Kansas City', state: 'MO', zip: '64114', room: 'Fellowship Hall', county: 'Jackson' as const, lat: 38.9945058, lng: -94.59465120000002, ward: 9, letterCode: 'A', precincts: [1, 2, 6, 7, 8, 15] },
  { id: 'jc-w9b', name: 'Waldo Library', address: '201 W. 75th St', city: 'Kansas City', state: 'MO', zip: '64114', room: 'Large Meeting Room', county: 'Jackson' as const, lat: 38.99161850000001, lng: -94.5867237, ward: 9, letterCode: 'B', precincts: [3, 4, 5, 12, 13, 14] },
  { id: 'jc-w9c', name: 'South Broadland Presbyterian', address: '7850 Holmes Rd', city: 'Kansas City', state: 'MO', zip: '64131', room: 'Sanctuary', county: 'Jackson' as const, lat: 38.9855504, lng: -94.5812234, ward: 9, letterCode: 'C', precincts: [9, 10, 11, 16] },
  { id: 'jc-w10a', name: 'Ivanhoe Masonic Lodge', address: '8640 Holmes Rd', city: 'Kansas City', state: 'MO', zip: '64131', room: 'Dining Room', county: 'Jackson' as const, lat: 38.9712024, lng: -94.5818208, ward: 10, letterCode: 'A', precincts: [1, 2, 3, 12] },
  { id: 'jc-w10b', name: 'Elks Lodge #26', address: '515 E. 99th St', city: 'Kansas City', state: 'MO', zip: '64131', room: 'Multi-Purpose Hall', county: 'Jackson' as const, lat: 38.9481324, lng: -94.5852228, ward: 10, letterCode: 'B', precincts: [4, 7, 8, 9] },
  { id: 'jc-w10c', name: 'Eden Church of the Nazarene', address: '801 W. 97th St', city: 'Kansas City', state: 'MO', zip: '64114', room: 'Basement-Fellowship Hall', county: 'Jackson' as const, lat: 38.9523652, lng: -94.6004454, ward: 10, letterCode: 'C', precincts: [5, 6, 10, 11] },
  { id: 'jc-w11a', name: 'Garrison Community Center', address: '1124 E. 5th St', city: 'Kansas City', state: 'MO', zip: '64106', room: 'Gym', county: 'Jackson' as const, lat: 39.1113925, lng: -94.5687153, ward: 11, letterCode: 'A', precincts: [1, 5, 6, 7, 8] },
  { id: 'jc-w11b', name: 'Sons of Columbus Meeting Hall', address: '2415 Independence Ave', city: 'Kansas City', state: 'MO', zip: '64124', room: 'Main Hall', county: 'Jackson' as const, lat: 39.10621, lng: -94.55230999999999, ward: 11, letterCode: 'B', precincts: [2, 3, 4, 9, 10, 11, 12, 13] },
  { id: 'jc-w12a', name: 'Northeast High School', address: '415 Van Brunt Blvd', city: 'Kansas City', state: 'MO', zip: '64124', room: 'Gym', county: 'Jackson' as const, lat: 39.108404, lng: -94.525303, ward: 12, letterCode: 'A', precincts: [1, 2, 5, 6, 7] },
  { id: 'jc-w12b', name: 'St Anthony Catholic Ch', address: '3208 Lexington Ave', city: 'Kansas City', state: 'MO', zip: '64124', room: 'Fellowship Hall', county: 'Jackson' as const, lat: 39.1108725, lng: -94.5442611, ward: 12, letterCode: 'B', precincts: [3, 4, 8, 9] },
  { id: 'jc-w13a', name: 'Our Lady of Peace Catholic Church', address: '1029 Bennington Ave', city: 'Kansas City', state: 'MO', zip: '64126', room: 'Gym', county: 'Jackson' as const, lat: 39.0989184, lng: -94.50516979999999, ward: 13, letterCode: 'A', precincts: [1, 2, 3, 4, 5, 8, 9, 10, 11, 13, 16] },
  { id: 'jc-w13b', name: 'North-East Library', address: '6000 Wilson Ave', city: 'Kansas City', state: 'MO', zip: '64123', room: 'Meeting Room', county: 'Jackson' as const, lat: 39.1065709, lng: -94.5112888, ward: 13, letterCode: 'B', precincts: [6, 7, 12, 14, 15, 17] },
  { id: 'jc-w14a', name: 'Wheatley Elem School', address: '2415 Agnes Ave', city: 'Kansas City', state: 'MO', zip: '64127', room: 'Art Room', county: 'Jackson' as const, lat: 39.0823791, lng: -94.5474194, ward: 14, letterCode: 'A', precincts: [1, 2, 3, 6, 7, 18] },
  { id: 'jc-w14b', name: 'Cleveland Ave Baptist Ch', address: '2853 Cleveland Ave', city: 'Kansas City', state: 'MO', zip: '64128', room: 'Fellowship Hall - Lower Level', county: 'Jackson' as const, lat: 39.0729958, lng: -94.5386472, ward: 14, letterCode: 'B', precincts: [4, 5, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 19] },
  { id: 'jc-w15a', name: 'J.A. Rogers Elem School', address: '6400 E. 23rd St', city: 'Kansas City', state: 'MO', zip: '64127', room: 'Gym', county: 'Jackson' as const, lat: 39.0462148, lng: -94.5396954, ward: 15, letterCode: 'A', precincts: [1, 4, 11, 21, 22, 23, 24] },
  { id: 'jc-w15b', name: 'Sheet Metal Local #2', address: '2902 Blue Ridge Blvd', city: 'Kansas City', state: 'MO', zip: '64129', room: 'Meeting Hall', county: 'Jackson' as const, lat: 39.0702606, lng: -94.4716886, ward: 15, letterCode: 'B', precincts: [2, 15, 16, 17, 18, 19] },
  { id: 'jc-w15c', name: 'Friendship Baptist Church', address: '3530 Chelsea Ave', city: 'Kansas City', state: 'MO', zip: '64128', room: 'Gym', county: 'Jackson' as const, lat: 39.0599046, lng: -94.5274343, ward: 15, letterCode: 'C', precincts: [3, 5, 7, 8, 9, 14, 20] },
  { id: 'jc-w15d', name: 'St Michael Veteran Center', address: '3838 Chelsea Dr', city: 'Kansas City', state: 'MO', zip: '64128', room: 'Meeting Room', county: 'Jackson' as const, lat: 39.0564628, lng: -94.5243399, ward: 15, letterCode: 'D', precincts: [6, 10, 12, 13] },
  { id: 'jc-w16a', name: 'Paradise Baptist Church', address: '1600 E. 58th St', city: 'Kansas City', state: 'MO', zip: '64110', room: 'Fellowship Hall (Basement)', county: 'Jackson' as const, lat: 39.0218109, lng: -94.5661375, ward: 16, letterCode: 'A', precincts: [1, 2, 3, 6, 9] },
  { id: 'jc-w16b', name: 'Covenant Presbyterian Church', address: '5931 Swope Pkwy', city: 'Kansas City', state: 'MO', zip: '64130', room: 'Scouts Cabin', county: 'Jackson' as const, lat: 39.0175838, lng: -94.54146519999999, ward: 16, letterCode: 'B', precincts: [4, 5, 8, 10, 11, 17] },
  { id: 'jc-w16c', name: 'The Rochester', address: '3949 Dr Martin Luther King Blvd', city: 'Kansas City', state: 'MO', zip: '64130', room: 'First Floor', county: 'Jackson' as const, lat: 39.034412, lng: -94.5379597, ward: 16, letterCode: 'C', precincts: [7, 12, 13, 14, 15, 16] },
  { id: 'jc-w17a', name: 'A.C. Prep Elem School', address: '6410 Swope Parkway', city: 'Kansas City', state: 'MO', zip: '64132', room: 'Gym', county: 'Jackson' as const, lat: 39.0097839, lng: -94.5433449, ward: 17, letterCode: 'A', precincts: [1, 2, 3, 5, 11] },
  { id: 'jc-w17b', name: 'Southeast Community Center', address: '4201 E. 63rd St', city: 'Kansas City', state: 'MO', zip: '64130', room: 'Meeting Room', county: 'Jackson' as const, lat: 39.0109711, lng: -94.5354392, ward: 17, letterCode: 'B', precincts: [4, 6, 7, 8, 9, 15, 16, 17] },
  { id: 'jc-w17c', name: 'Southside Christian Ch', address: '7304 Cleveland Ave', city: 'Kansas City', state: 'MO', zip: '64132', room: 'Fellowship Hall', county: 'Jackson' as const, lat: 38.9935489, lng: -94.54374179999999, ward: 17, letterCode: 'C', precincts: [10, 12, 13, 14] },
  { id: 'jc-w18a', name: 'Mount Christian Worship Center', address: '1800 E. 79th St', city: 'Kansas City', state: 'MO', zip: '64132', room: 'Fellowship Hall', county: 'Jackson' as const, lat: 38.984099, lng: -94.5661537, ward: 18, letterCode: 'A', precincts: [1, 2, 3, 4] },
  { id: 'jc-w18b', name: 'New Journey at Gregory Hills', address: '7020 James A Reed Rd', city: 'Kansas City', state: 'MO', zip: '64133', room: 'Christian Life Center', county: 'Jackson' as const, lat: 38.9963524, lng: -94.4923248, ward: 18, letterCode: 'B', precincts: [5, 7, 8, 11, 13, 14, 15, 16, 18] },
  { id: 'jc-w18c', name: 'Laborers Union Local #663', address: '7820 Prospect Ave', city: 'Kansas City', state: 'MO', zip: '64132', room: 'Lower Level - Use North Side', county: 'Jackson' as const, lat: 38.9837514, lng: -94.55784729999999, ward: 18, letterCode: 'C', precincts: [6, 9, 10, 12, 17, 19] },
  { id: 'jc-w19a', name: 'Grace Baptist Church', address: '8524 Blue Ridge Blvd', city: 'Kansas City', state: 'MO', zip: '64138', room: 'Hall', county: 'Jackson' as const, lat: 38.9693279, lng: -94.49755379999999, ward: 19, letterCode: 'A', precincts: [1, 2, 3, 6, 9, 13, 16] },
  { id: 'jc-w19b', name: 'Evangel Church', address: '1414 E. 103rd St', city: 'Kansas City', state: 'MO', zip: '64131', room: 'Fellowship Hall - Park in Rear', county: 'Jackson' as const, lat: 38.9414138, lng: -94.57247160000001, ward: 19, letterCode: 'B', precincts: [4, 7, 12, 14, 15, 18, 19, 20] },
  { id: 'jc-w19c', name: 'Center High School', address: '8715 Holmes Rd', city: 'Kansas City', state: 'MO', zip: '64131', room: 'Small Gym', county: 'Jackson' as const, lat: 38.9682089, lng: -94.5794628, ward: 19, letterCode: 'C', precincts: [5, 8, 10, 11, 17] },
];

export const ALL_ELECTION_DAY_LOCATIONS = [...JACKSON_COUNTY_LOCATIONS];

export const COUNTY_LOOKUP_INFO = {
  Jackson: {
    type: 'any-location' as const,
    message: 'You can vote at ANY polling location in Kansas City on Election Day using a ballot marking device.',
    paperBallotNote: 'For a pre-printed paper ballot, go to your assigned ward location.',
    lookupUrl: 'https://www.kceb.org',
  },
  Clay: {
    type: 'assigned' as const,
    message: 'You must vote at your assigned precinct polling place on Election Day.',
    lookupUrl: 'https://cceb.maps.arcgis.com/apps/instant/lookup/index.html?appid=0fcebdd0259945a9aded62759f77c311',
    lookupLabel: 'Find Your Clay County Polling Place',
  },
  Platte: {
    type: 'assigned' as const,
    message: 'You must vote at your assigned precinct polling place on Election Day.',
    lookupUrl: 'https://voteroutreach.sos.mo.gov/portal/',
    lookupLabel: 'MO Voter Lookup (SOS)',
  },
  Cass: {
    type: 'assigned' as const,
    message: 'You must vote at your assigned precinct polling place on Election Day.',
    lookupUrl: 'https://voteroutreach.sos.mo.gov/portal/',
    lookupLabel: 'MO Voter Lookup (SOS)',
  },
} as const;
