// Platte County Election Day Polling Sites - August 4, 2026
// 45 Precincts across 29 Polling Sites
// Source: Platte County Board of Elections (2/21/2025)
// Coordinates: Google Places API

export interface PlatteCountyLocation {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  lat: number;
  lng: number;
  precincts: string[];
  isKC?: boolean;
}

export const PLATTE_COUNTY_LOCATIONS: PlatteCountyLocation[] = [
  { id: 'pc-1', name: 'Riverside Community Center', address: '4498 NW High Drive', city: 'Riverside', state: 'MO', zip: '64151', lat: 39.1758375, lng: -94.617454, precincts: ["Riverside", "Northmoor"], isKC: true },
  { id: 'pc-2', name: 'Hope Fellowship Baptist Church', address: '8350 N Conant Ave', city: 'Kansas City', state: 'MO', zip: '64152', lat: 39.2459173, lng: -94.67550089999999, precincts: ["Prairie Pt"], isKC: true },
  { id: 'pc-3', name: 'Hills of Walden Clubhouse', address: '5858 N Polk Drive', city: 'Kansas City', state: 'MO', zip: '64151', lat: 39.2013715, lng: -94.6360357, precincts: ["Houston Lake", "Southeast"], isKC: true },
  { id: 'pc-4', name: 'Parkville Presbyterian Church', address: '819 Main Street', city: 'Parkville', state: 'MO', zip: '64152', lat: 39.1940193, lng: -94.68347709999999, precincts: ["Parkville"], isKC: false },
  { id: 'pc-5', name: 'Walnut Creek Clubhouse', address: '5502 Clubhouse Cove', city: 'Parkville', state: 'MO', zip: '64152', lat: 39.1954765, lng: -94.71143, precincts: ["Par 4"], isKC: false },
  { id: 'pc-6', name: 'Northwest Bible Church', address: '6520 NW 64th St', city: 'Kansas City', state: 'MO', zip: '64151', lat: 39.2114212, lng: -94.6576688, precincts: ["Platte Hills", "Hampton East"], isKC: true },
  { id: 'pc-7', name: 'Platte Woods Methodist Church', address: '7310 NW Prairie View Rd', city: 'Kansas City', state: 'MO', zip: '64151', lat: 39.2280273, lng: -94.656006, precincts: ["Platte Woods", "Park Hill"], isKC: true },
  { id: 'pc-8', name: 'Lake Waukomis City Hall', address: '1147 S Shore Dr', city: 'Lake Waukomis', state: 'MO', zip: '64151', lat: 39.2274635, lng: -94.63394740000001, precincts: ["Lake Waukomis"], isKC: false },
  { id: 'pc-9', name: 'Weatherby Lake Community Center', address: '8230 NW Potomac', city: 'Weatherby Lake', state: 'MO', zip: '64152', lat: 39.2462042, lng: -94.6948274, precincts: ["Weatherby Lake"], isKC: false },
  { id: 'pc-10', name: 'Embassy Park Clubhouse', address: '5700 NW 82nd St', city: 'Kansas City', state: 'MO', zip: '64151', lat: 39.2441547, lng: -94.64587709999999, precincts: ["Embassy"], isKC: true },
  { id: 'pc-11', name: 'St. Johns Lutheran Church', address: '98 Main St', city: 'Farley', state: 'MO', zip: '64028', lat: 39.280377, lng: -94.8319475, precincts: ["Farley"], isKC: false },
  { id: 'pc-12', name: 'Fellowship Kansas City', address: '7310 NW Hampton Rd', city: 'Kansas City', state: 'MO', zip: '64152', lat: 39.228153, lng: -94.734129, precincts: ["Hampton West"], isKC: true },
  { id: 'pc-13', name: 'Platte City YMCA', address: '3101 Running Horse Rd', city: 'Platte City', state: 'MO', zip: '64079', lat: 39.3473428, lng: -94.7595796, precincts: ["Platte City"], isKC: false },
  { id: 'pc-14', name: 'Tracy City Hall', address: '414 Hwy 273', city: 'Tracy', state: 'MO', zip: '64079', lat: 39.3781016, lng: -94.7956268, precincts: ["Beverly", "Tracy", "Settles Station"], isKC: false },
  { id: 'pc-15', name: 'First Baptist Church of Weston', address: '160 Walnut St', city: 'Weston', state: 'MO', zip: '64098', lat: 39.4106797, lng: -94.8890646, precincts: ["Weston", "Lakeview", "Pisgah", "Dye", "Iatan"], isKC: false },
  { id: 'pc-16', name: 'Robert S Bryan Community Center', address: '202 N Commercial St', city: 'Dearborn', state: 'MO', zip: '64439', lat: 39.5239972, lng: -94.77366649999999, precincts: ["New Market", "Dearborn"], isKC: false },
  { id: 'pc-17', name: 'American Legion Hall', address: '503 Belt St', city: 'Edgerton', state: 'MO', zip: '64444', lat: 39.5047336, lng: -94.6314392, precincts: ["Edgerton", "Ridgely"], isKC: false },
  { id: 'pc-18', name: 'Camden Point Baptist Church', address: '500 Third St', city: 'Camden Point', state: 'MO', zip: '64018', lat: 39.4544898, lng: -94.7456233, precincts: ["Camden Point"], isKC: false },
  { id: 'pc-19', name: 'Hoover Christian Church', address: '15180 Hwy B', city: 'Platte City', state: 'MO', zip: '64079', lat: 39.3682955, lng: -94.6675088, precincts: ["Hoover", "Shiloh"], isKC: false },
  { id: 'pc-20', name: 'The Hub at East Platte', address: '12220 NW Skyview Ave', city: 'Kansas City', state: 'MO', zip: '64164', lat: 39.3156054, lng: -94.6494838, precincts: ["Ferrelview", "Mid Continent", "Linkville"], isKC: true },
  { id: 'pc-21', name: 'Riverstone Retirement Center', address: '9000 N Congress Ave', city: 'Kansas City', state: 'MO', zip: '64153', lat: 39.2581053, lng: -94.66934099999999, precincts: ["Tiffany Springs"], isKC: true },
  { id: 'pc-22', name: 'Green Hills Branch Library', address: '8581 N Green Hills Rd', city: 'Kansas City', state: 'MO', zip: '64154', lat: 39.2495521, lng: -94.6303676, precincts: ["Barry East"], isKC: true },
  { id: 'pc-23', name: 'Gloria Dei Lutheran Church', address: '5409 NW 72nd St', city: 'Kansas City', state: 'MO', zip: '64151', lat: 39.2245684, lng: -94.64402659999999, precincts: ["Northern Heights"], isKC: true },
  { id: 'pc-24', name: 'Line Creek Community Center', address: '5940 NW Waukomis Dr', city: 'Kansas City', state: 'MO', zip: '64151', lat: 39.2025927, lng: -94.6102727, precincts: ["Line Creek"], isKC: true },
  { id: 'pc-25', name: 'Coves North Clubhouse', address: '8615 NW Waukomis Dr', city: 'Kansas City', state: 'MO', zip: '64154', lat: 39.2500597, lng: -94.6424617, precincts: ["Barry North"], isKC: true },
  { id: 'pc-26', name: 'Church of the Redeemer', address: '7110 NW Hwy 9', city: 'Kansas City', state: 'MO', zip: '64152', lat: 39.2247589, lng: -94.6607688, precincts: ["Park Hill North"], isKC: true },
  { id: 'pc-27', name: 'Coves Clubhouse', address: '8221 NW Overland Dr', city: 'Kansas City', state: 'MO', zip: '64151', lat: 39.2467212, lng: -94.6401493, precincts: ["Barry South"], isKC: true },
  { id: 'pc-28', name: 'Seven Bridges Clubhouse', address: '17800 NW Seven Bridges Rd', city: 'Platte City', state: 'MO', zip: '64079', lat: 39.3269108, lng: -94.7863907, precincts: ["Seven Bridges"], isKC: false },
  { id: 'pc-29', name: 'Oasis Clubhouse', address: '6040 N Nevada Ave', city: 'Parkville', state: 'MO', zip: '64152', lat: 39.204697, lng: -94.7473285, precincts: ["Parkville West"], isKC: false },
];

// ArcGIS precinct name normalization
const ARCGIS_NAME_MAP: Record<string, string> = {
  'Riveside': 'Riverside',
  'Prairie Point': 'Prairie Pt',
  'Par4': 'Par 4',
  'MidContinent': 'Mid Continent',
  'SouthEast': 'Southeast',
  'Farley Stillings': 'Farley',
};

/** Given an ArcGIS precinct name (e.g. "Park Hill 36"), find the polling site */
export function findPlattePollingPlace(arcgisPrecinctName: string): PlatteCountyLocation | null {
  const baseName = arcgisPrecinctName.replace(/\s*\d+$/, '').trim();
  const normalized = ARCGIS_NAME_MAP[baseName] || baseName;

  return PLATTE_COUNTY_LOCATIONS.find(loc =>
    loc.precincts.some(p =>
      p.toLowerCase() === normalized.toLowerCase() ||
      p.toLowerCase() === baseName.toLowerCase()
    )
  ) || null;
}

/** Platte County ArcGIS precinct boundary service URL */
export const PLATTE_ARCGIS_URL = 'https://services.arcgis.com/KP64F8Xif9MkUwD4/arcgis/rest/services/Voting_Precincts/FeatureServer/0/query';
