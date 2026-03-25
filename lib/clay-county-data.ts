// Clay County Election Day Polling Sites - April 7, 2026
// 58 Polling Places with precinct-to-location mapping
// Source: Clay County Board of Election Commissioners
// Coordinates: Google Places API

export interface ClayCountyLocation {
  id: string;
  name: string;
  address: string;
  city: string;
  zip: string;
  lat: number;
  lng: number;
  precincts: string[];
}

export const CLAY_COUNTY_LOCATIONS: ClayCountyLocation[] = [
  { id: 'cc-1', name: 'Highlands Community of Christ', address: '7615 N. Platte Purchase Dr', city: 'Kansas City', zip: '64118', lat: 39.2338777, lng: -94.5997089, precincts: ['21 Gallatin 1', '21 Gallatin 29'] },
  { id: 'cc-2', name: 'Harmony Vineyard Church', address: '600 NE 46th St', city: 'Kansas City', zip: '64116', lat: 39.1780738, lng: -94.5746832, precincts: ['21 Gallatin 2'] },
  { id: 'cc-3', name: 'LifeBridge Baptist Church', address: '3710 N Holmes St', city: 'Kansas City', zip: '64116', lat: 39.1620404, lng: -94.5727273, precincts: ['21 Gallatin 3'] },
  { id: 'cc-4', name: 'KCN Community Center', address: '3930 NE Antioch Rd', city: 'Kansas City', zip: '64117', lat: 39.1661547, lng: -94.5496079, precincts: ['21 Gallatin 4'] },
  { id: 'cc-5', name: 'Eagle Heights Baptist Church', address: '5600 N Brighton Ave', city: 'Kansas City', zip: '64119', lat: 39.1964319, lng: -94.5218502, precincts: ['21 Gallatin 5'] },
  { id: 'cc-6', name: 'Avondale United Methodist Church', address: '3101 NE Winn Rd', city: 'Kansas City', zip: '64117', lat: 39.1593499, lng: -94.5441486, precincts: ['21 Gallatin 6'] },
  { id: 'cc-7', name: 'Good Shepherd Episcopal Church', address: '4947 NE Chouteau Dr', city: 'Kansas City', zip: '64119', lat: 39.1852613, lng: -94.5402812, precincts: ['21 Gallatin 7', '21 Gallatin 20'] },
  { id: 'cc-8', name: 'Briarcliff Church', address: '800 NE Vivion Rd', city: 'Kansas City', zip: '64118', lat: 39.1818471, lng: -94.5702483, precincts: ['21 Gallatin 8', 'Gallatin 4'] },
  { id: 'cc-9', name: 'Northcross United Methodist Church', address: '1321 NE Vivion Rd', city: 'Kansas City', zip: '64118', lat: 39.1803778, lng: -94.5634402, precincts: ['21 Gallatin 9'] },
  { id: 'cc-10', name: 'Gashland Baptist Church', address: '601 NE Barry Rd', city: 'Kansas City', zip: '64155', lat: 39.2458525, lng: -94.5733468, precincts: ['21 Gallatin 10'] },
  { id: 'cc-11', name: 'Shoal Creek Community Church', address: '6816 N Church Rd', city: 'Pleasant Valley', zip: '64068', lat: 39.2178922, lng: -94.475221, precincts: ['21 Chouteau 11'] },
  { id: 'cc-12', name: 'Campus Center Building', address: '2601 NE Barry Rd', city: 'Kansas City', zip: '64156', lat: 39.2462678, lng: -94.5461106, precincts: ['21 Chouteau 12'] },
  { id: 'cc-13', name: 'Northland Cathedral', address: '101 NW 99th St', city: 'Kansas City', zip: '64155', lat: 39.2730844, lng: -94.5817665, precincts: ['21 Chouteau 13', '21 Chouteau 26', '21 Chouteau 30'] },
  { id: 'cc-14', name: 'Tower View Baptist Church', address: '7301 NE 50th St', city: 'Kansas City', zip: '64119', lat: 39.1837694, lng: -94.4948607, precincts: ['21 Gallatin 14'] },
  { id: 'cc-15', name: 'Northside Christian Church', address: '5114 NW Old Pike Road', city: 'Kansas City', zip: '64116', lat: 39.1874154, lng: -94.5852597, precincts: ['21 Gallatin 15'] },
  { id: 'cc-16', name: 'Mid-Continent Library North Oak Branch', address: '8700 N Oak Trafficway', city: 'Kansas City', zip: '64155', lat: 39.2516906, lng: -94.5763595, precincts: ['21 Chouteau 16'] },
  { id: 'cc-17', name: 'Grace Fellowship', address: '10920 N Oak Trafficway', city: 'Kansas City', zip: '64155', lat: 39.292251, lng: -94.5761361, precincts: ['21 Chouteau 17'] },
  { id: 'cc-18', name: 'McMurry Methodist Church', address: '25 Eugene Fields Rd', city: 'Kansas City', zip: '64119', lat: 39.1966706, lng: -94.5069849, precincts: ['21 Chouteau 18'] },
  { id: 'cc-19', name: 'Claycomo Community Building', address: '28 S. Drake St', city: 'Claycomo', zip: '64119', lat: 39.1975784, lng: -94.5036163, precincts: ['21 Chouteau 19', 'Chouteau 8'] },
  { id: 'cc-21', name: 'Gracemor Christian Church', address: '5600 NE San Rafael Dr', city: 'Kansas City', zip: '64119', lat: 39.1943426, lng: -94.4831697, precincts: ['21 Chouteau 21'] },
  { id: 'cc-22', name: 'Birmingham Community Church', address: '421 Spratley St', city: 'Kansas City', zip: '64161', lat: 39.1658975, lng: -94.4498564, precincts: ['21 Chouteau 22'] },
  { id: 'cc-23', name: 'Immanuel Presbyterian Church', address: '3800 NE Parvin Rd', city: 'Kansas City', zip: '64117', lat: 39.1634911, lng: -94.5344415, precincts: ['21 Gallatin 23'] },
  { id: 'cc-24', name: 'Bethel United Church of Christ', address: '4900 NE Parvin Rd', city: 'Kansas City', zip: '64117', lat: 39.1678529, lng: -94.5227614, precincts: ['21 Gallatin 24'] },
  { id: 'cc-25', name: 'Gashland United Methodist Church', address: '7715 N Oak Trfwy', city: 'Kansas City', zip: '64118', lat: 39.2347771, lng: -94.5756807, precincts: ['21 Gallatin 25'] },
  { id: 'cc-27', name: 'New Life Church', address: '10500 N Central St', city: 'Kansas City', zip: '64155', lat: 39.2834394, lng: -94.583801, precincts: ['21 Chouteau 27', '21 Platte 1'] },
  { id: 'cc-28', name: 'The Venue North', address: '232 NE Barry Road', city: 'Kansas City', zip: '64155', lat: 39.246788, lng: -94.5780071, precincts: ['21 Chouteau 28'] },
  { id: 'cc-32', name: 'North Star United Methodist Church', address: '11250 N Eastern Rd', city: 'Kansas City', zip: '64156', lat: 39.2975903, lng: -94.492636, precincts: ['21 Platte 2'] },
  { id: 'cc-33', name: 'Providence Baptist Church', address: '12206 N Stark Ave', city: 'Kansas City', zip: '64167', lat: 39.3137387, lng: -94.4735877, precincts: ['21 Liberty 1'] },
  { id: 'cc-34', name: 'Kansas City Church', address: '7700 N Church Rd', city: 'Kansas City', zip: '64158', lat: 39.2337745, lng: -94.4652172, precincts: ['21 Liberty 2', '21 Liberty 9'] },
  { id: 'cc-35', name: 'Woodneath Library Center', address: '8900 NE Flintlock Road', city: 'Kansas City', zip: '64157', lat: 39.2536027, lng: -94.4673794, precincts: ['21 Liberty 3', '21 Liberty 5'] },
  { id: 'cc-36', name: 'Hosanna Lutheran Church', address: '2800 N Church Road', city: 'Liberty', zip: '64068', lat: 39.2818066, lng: -94.437263, precincts: ['21 Liberty 4'] },
  { id: 'cc-38', name: 'Pleasant Valley Baptist Church', address: '1600 N 291 Hwy', city: 'Liberty', zip: '64068', lat: 39.2652958, lng: -94.4521255, precincts: ['21 Liberty 6', '21 Liberty 7', '21 Liberty 8'] },
  { id: 'cc-42', name: 'NKC YMCA', address: '1999 Iron St', city: 'North Kansas City', zip: '64116', lat: 39.1423635, lng: -94.5706444, precincts: ['Gallatin 1', 'Gallatin 2'] },
  { id: 'cc-44', name: 'Faubion United Methodist Church', address: '7113 N Troost Ave', city: 'Gladstone', zip: '64118', lat: 39.224477, lng: -94.5665056, precincts: ['Gallatin 3'] },
  { id: 'cc-46', name: 'Fairview Christian Church', address: '1800 NE 65th St', city: 'Gladstone', zip: '64156', lat: 39.2122725, lng: -94.5584135, precincts: ['Gallatin 5', 'Gallatin 6'] },
  { id: 'cc-48', name: 'a Turning Point', address: '1900 NE Englewood Rd', city: 'Gladstone', zip: '64118', lat: 39.196247, lng: -94.5574862, precincts: ['Gallatin 7'] },
  { id: 'cc-50', name: 'St. Charles Borromeo Church', address: '900 NE Shady Lane Dr', city: 'Gladstone', zip: '64118', lat: 39.2105751, lng: -94.5708627, precincts: ['Gallatin 9'] },
  { id: 'cc-51', name: 'Gladstone Community Center', address: '6901 N Holmes St', city: 'Gladstone', zip: '64118', lat: 39.2204446, lng: -94.5704917, precincts: ['Gallatin 10'] },
  { id: 'cc-52', name: 'Mid-Continent Library Antioch Branch', address: '6060 Chestnut Ave', city: 'Gladstone', zip: '64119', lat: 39.2039889, lng: -94.5465857, precincts: ['Gallatin 11'] },
  { id: 'cc-53', name: 'Antioch Bible Baptist Church', address: '800 NE 72nd St', city: 'Gladstone', zip: '64118', lat: 39.2251783, lng: -94.5704418, precincts: ['Gallatin 12'] },
  { id: 'cc-54', name: 'A Turning Point', address: '1900 NE Englewood Rd', city: 'Gladstone', zip: '64118', lat: 39.196247, lng: -94.5574862, precincts: ['Gallatin 13'] },
  { id: 'cc-55', name: 'Flander Hall', address: '107 W Broadway', city: 'Excelsior Springs', zip: '64024', lat: 39.342114, lng: -94.2235565, precincts: ['Fishing River 1'] },
  { id: 'cc-56', name: 'MidContinent Public Library Excelsior Springs', address: '1460 Kearney Rd', city: 'Excelsior Springs', zip: '64024', lat: 39.3405696, lng: -94.2440934, precincts: ['Fishing River 2'] },
  { id: 'cc-57', name: 'Mosby City Hall', address: '12312 4th St', city: 'Mosby', zip: '64024', lat: 39.315651, lng: -94.2944122, precincts: ['Fishing River 3'] },
  { id: 'cc-58', name: 'Missouri City School', address: '700 E Main St', city: 'Missouri City', zip: '64072', lat: 39.2412284, lng: -94.2878798, precincts: ['Fishing River 4'] },
  { id: 'cc-59', name: 'Holt City Hall', address: '315 Main St', city: 'Holt', zip: '64048', lat: 39.4529832, lng: -94.3422501, precincts: ['Kearney 1'] },
  { id: 'cc-60', name: 'Kearney Annunciation Center', address: '705 N Jefferson St', city: 'Kearney', zip: '64060', lat: 39.3825715, lng: -94.3687602, precincts: ['Kearney 2'] },
  { id: 'cc-61', name: 'Mid-Continent Library Kearney Branch', address: '100 S. Platte-Clay Way', city: 'Kearney', zip: '64060', lat: 39.3712298, lng: -94.3679315, precincts: ['Kearney 3'] },
  { id: 'cc-62', name: 'Trinity Lutheran Church', address: '1715 S. Jefferson St', city: 'Kearney', zip: '64060', lat: 39.3557584, lng: -94.3598456, precincts: ['Kearney 4'] },
  { id: 'cc-63', name: 'First Christian Church', address: '2151 S. Jefferson St', city: 'Kearney', zip: '64060', lat: 39.3496427, lng: -94.3603435, precincts: ['Kearney 5'] },
  { id: 'cc-68', name: 'Pleasant Valley Community Center', address: '6805 Sobbie Rd', city: 'Pleasant Valley', zip: '64068', lat: 39.2171988, lng: -94.4790073, precincts: ['Liberty 5'] },
  { id: 'cc-72', name: 'Chandler Baptist Church', address: '11401 MO-33', city: 'Liberty', zip: '64068', lat: 39.3000585, lng: -94.3736799, precincts: ['Liberty 9'] },
  { id: 'cc-75', name: 'Liberty Community Center', address: '1600 S Withers Rd', city: 'Liberty', zip: '64068', lat: 39.2242091, lng: -94.4382244, precincts: ['Liberty 13'] },
  { id: 'cc-77', name: 'Grace Community Church', address: '1520 DD Highway', city: 'Smithville', zip: '64089', lat: 39.3890953, lng: -94.5636679, precincts: ['Platte 1'] },
  { id: 'cc-78', name: 'Mid-Continent Library Smithville Branch', address: '120 Richardson St', city: 'Smithville', zip: '64089', lat: 39.3745612, lng: -94.5818708, precincts: ['Platte 2'] },
  { id: 'cc-79', name: 'Smithville Family Worship Center', address: '98 Stonebridge Lane', city: 'Smithville', zip: '64089', lat: 39.3721936, lng: -94.580365, precincts: ['Platte 3'] },
  { id: 'cc-80', name: 'Excelsior Springs Baptist Church', address: '1500 Rosalea St', city: 'Excelsior Springs', zip: '64024', lat: 39.3576989, lng: -94.2397321, precincts: ['Washington 1', 'Washington 2'] },
  { id: 'cc-82', name: 'First United Methodist Church', address: '1000 E 92 Hwy', city: 'Kearney', zip: '64060', lat: 39.3686739, lng: -94.3399959, precincts: ['Washington 3'] },
];

// ArcGIS short-name to full-name mapping
// The Clay County ArcGIS returns abbreviated precinct names like "Lib 1", "Gal 5", "Cho 11"
// These need to be mapped to the full precinct names used in our data
const ARCGIS_SHORT_NAME_MAP: Record<string, string> = {
  'Lib': '21 Liberty',
  'Gal': 'Gallatin',
  'Cho': 'Chouteau',
  'FR': 'Fishing River',
  'Kear': 'Kearney',
  'Wash': 'Washington',
  'Plat': 'Platte',
  'Pla': 'Platte',
};

// Direct precinct name mapping for "21-XX" style names from ArcGIS
// e.g. "21-14" -> "21 Gallatin 14"
const ARCGIS_21_PREFIX_MAP: Record<string, string> = {
  '21-1': '21 Gallatin 1',
  '21-2': '21 Gallatin 2',
  '21-3': '21 Gallatin 3',
  '21-4': '21 Gallatin 4',
  '21-5': '21 Gallatin 5',
  '21-6': '21 Gallatin 6',
  '21-7': '21 Gallatin 7',
  '21-8': '21 Gallatin 8',
  '21-9': '21 Gallatin 9',
  '21-10': '21 Gallatin 10',
  '21-14': '21 Gallatin 14',
  '21-15': '21 Gallatin 15',
  '21-20': '21 Gallatin 20',
  '21-23': '21 Gallatin 23',
  '21-24': '21 Gallatin 24',
  '21-25': '21 Gallatin 25',
  '21-29': '21 Gallatin 29',
};

/**
 * Normalize an ArcGIS precinct name to match our data.
 *
 * ArcGIS returns names like:
 *   "Lib 1" -> "21 Liberty 1"
 *   "Gal 5" -> "Gallatin 5"
 *   "21-14" -> "21 Gallatin 14"
 *   "Cho 11" -> "21 Chouteau 11"
 *   "FR 1" -> "Fishing River 1"
 *   "Kear 2" -> "Kearney 2"
 *   "Wash 1" -> "Washington 1"
 *   "21 Gal 8" -> "21 Gallatin 8" (alternate)
 *
 * We try multiple strategies to find a match.
 */
function normalizeArcgisPrecinctName(raw: string): string[] {
  const trimmed = raw.trim();
  const candidates: string[] = [trimmed];

  // Strategy 1: Direct "21-XX" mapping
  if (ARCGIS_21_PREFIX_MAP[trimmed]) {
    candidates.push(ARCGIS_21_PREFIX_MAP[trimmed]);
  }

  // Strategy 2: Short abbreviation with number, e.g. "Lib 1", "Gal 5", "Cho 11"
  const shortMatch = trimmed.match(/^(\w+)\s+(\d+)$/);
  if (shortMatch) {
    const [, abbrev, num] = shortMatch;
    const fullName = ARCGIS_SHORT_NAME_MAP[abbrev];
    if (fullName) {
      candidates.push(`${fullName} ${num}`);
      candidates.push(`21 ${fullName} ${num}`);
    }
  }

  // Strategy 3: "21 Lib 1" or "21 Gal 5" format
  const prefixMatch = trimmed.match(/^21\s+(\w+)\s+(\d+)$/);
  if (prefixMatch) {
    const [, abbrev, num] = prefixMatch;
    const fullName = ARCGIS_SHORT_NAME_MAP[abbrev];
    if (fullName) {
      candidates.push(`21 ${fullName} ${num}`);
      candidates.push(`${fullName} ${num}`);
    }
  }

  // Strategy 4: Already a full name (pass-through)
  // e.g. "Gallatin 5", "21 Liberty 1", "Fishing River 3"
  // These are already in candidates[0]

  return candidates;
}

/** Given an ArcGIS precinct name (e.g. "Lib 1", "21-14", "Gal 5"), find the polling site */
export function findClayPollingPlace(arcgisPrecinctName: string): ClayCountyLocation | null {
  const candidates = normalizeArcgisPrecinctName(arcgisPrecinctName);

  for (const candidate of candidates) {
    const found = CLAY_COUNTY_LOCATIONS.find(loc =>
      loc.precincts.some(p =>
        p.toLowerCase() === candidate.toLowerCase()
      )
    );
    if (found) return found;
  }

  // Fallback: fuzzy match - strip "21 " prefix and try partial matching
  const stripped = arcgisPrecinctName.replace(/^21[\s-]+/, '').trim();
  const strippedCandidates = normalizeArcgisPrecinctName(stripped);

  for (const candidate of strippedCandidates) {
    const found = CLAY_COUNTY_LOCATIONS.find(loc =>
      loc.precincts.some(p => {
        const pStripped = p.replace(/^21\s*/, '').trim();
        return pStripped.toLowerCase() === candidate.toLowerCase();
      })
    );
    if (found) return found;
  }

  return null;
}

/** Clay County ArcGIS sub-precinct boundary service URL */
export const CLAY_ARCGIS_URL = 'https://services3.arcgis.com/kJEeRPrdQ0Y3Jq8x/arcgis/rest/services/sub_precinct/FeatureServer/0/query';
