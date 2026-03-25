import { writeFileSync } from 'fs';

const API_KEY = 'AIzaSyA0tnMaQcXi8fn5azv72QOxF0UmsYY7d8k';

const pollingPlaces = [
  // Ward 1 - Jackson County
  { id: 1, name: "Tony Aguirre Community Ctr", address: "2050 West Pennway St", city: "Kansas City", state: "MO", ward: 1, county: "Jackson" },
  { id: 2, name: "Sacred Heart Hall", address: "814 W. 26th St", city: "Kansas City", state: "MO", ward: 1, county: "Jackson" },
  { id: 3, name: "Grace & Holy Trinity Cathedral", address: "415 W. 13th St", city: "Kansas City", state: "MO", ward: 1, county: "Jackson" },
  { id: 4, name: "WW I Museum", address: "2 Memorial Drive", city: "Kansas City", state: "MO", ward: 1, county: "Jackson" },
  // Ward 2 - Jackson County
  { id: 5, name: "Wayne Miner Court", address: "1940 E. 11th St", city: "Kansas City", state: "MO", ward: 2, county: "Jackson" },
  { id: 6, name: "Lincoln Middle School", address: "2012 E. 23rd St", city: "Kansas City", state: "MO", ward: 2, county: "Jackson" },
  // Ward 3 - Jackson County
  { id: 7, name: "Mohart Multi-Purpose Center", address: "3200 Wayne Ave", city: "Kansas City", state: "MO", ward: 3, county: "Jackson" },
  { id: 8, name: "Mt Sinai Baptist Church", address: "3634 Brooklyn Ave", city: "Kansas City", state: "MO", ward: 3, county: "Jackson" },
  { id: 9, name: "Mt Pleasant Baptist Church", address: "2200 Olive St", city: "Kansas City", state: "MO", ward: 3, county: "Jackson" },
  // Ward 4 - Jackson County
  { id: 10, name: "Central Presbyterian Church", address: "3501 Campbell St", city: "Kansas City", state: "MO", ward: 4, county: "Jackson" },
  { id: 11, name: "MCC-Penn Valley", address: "3201 Southwest Tfwy", city: "Kansas City", state: "MO", ward: 4, county: "Jackson" },
  // Ward 5 - Jackson County
  { id: 12, name: "All Souls Church", address: "4501 Walnut St", city: "Kansas City", state: "MO", ward: 5, county: "Jackson" },
  { id: 13, name: "Westport Presbyterian Church", address: "201 Westport Rd", city: "Kansas City", state: "MO", ward: 5, county: "Jackson" },
  { id: 14, name: "Roanoke Community Center", address: "3601 Roanoke Rd", city: "Kansas City", state: "MO", ward: 5, county: "Jackson" },
  // Ward 6 - Jackson County
  { id: 15, name: "Resurrection Brookside", address: "5144 Oak St", city: "Kansas City", state: "MO", ward: 6, county: "Jackson" },
  { id: 16, name: "Second Presbyterian Church", address: "318 E. 55th St", city: "Kansas City", state: "MO", ward: 6, county: "Jackson" },
  { id: 17, name: "Olive Branch Baptist Ch", address: "915 E. 59th St", city: "Kansas City", state: "MO", ward: 6, county: "Jackson" },
  // Ward 7 - Jackson County
  { id: 18, name: "Sunlight Missionary Baptist Ch", address: "4444 Woodland Ave", city: "Kansas City", state: "MO", ward: 7, county: "Jackson" },
  { id: 19, name: "Mary Williams-Neal Comm. Center", address: "3801 Emanuel Cleaver Blvd", city: "Kansas City", state: "MO", ward: 7, county: "Jackson" },
  // Ward 8 - Jackson County
  { id: 20, name: "Country Club Christian Ch", address: "6101 Ward Pkwy", city: "Kansas City", state: "MO", ward: 8, county: "Jackson" },
  { id: 21, name: "Wornall Road Baptist Church", address: "400 W. Meyer Blvd", city: "Kansas City", state: "MO", ward: 8, county: "Jackson" },
  { id: 22, name: "HJ's Youth Center", address: "6425 Wornall Rd", city: "Kansas City", state: "MO", ward: 8, county: "Jackson" },
  { id: 23, name: "Kansas City United Church of Christ", address: "205 W. 65th St", city: "Kansas City", state: "MO", ward: 8, county: "Jackson" },
  // Ward 9 - Jackson County
  { id: 24, name: "Keystone United Methodist Ch", address: "406 W. 74th St", city: "Kansas City", state: "MO", ward: 9, county: "Jackson" },
  { id: 25, name: "Waldo Library", address: "201 W. 75th St", city: "Kansas City", state: "MO", ward: 9, county: "Jackson" },
  { id: 26, name: "South Broadland Presbyterian Ch", address: "7850 Holmes Rd", city: "Kansas City", state: "MO", ward: 9, county: "Jackson" },
  // Ward 10 - Jackson County
  { id: 27, name: "Ivanhoe Masonic Lodge", address: "8640 Holmes Rd", city: "Kansas City", state: "MO", ward: 10, county: "Jackson" },
  { id: 28, name: "Elks Lodge #26", address: "515 E. 99th St", city: "Kansas City", state: "MO", ward: 10, county: "Jackson" },
  { id: 29, name: "Eden Church of the Nazarene", address: "801 W. 97th St", city: "Kansas City", state: "MO", ward: 10, county: "Jackson" },
  // Ward 11 - Jackson County
  { id: 30, name: "Garrison Community Center", address: "1124 E. 5th St", city: "Kansas City", state: "MO", ward: 11, county: "Jackson" },
  { id: 31, name: "Sons of Columbus Meeting Hall", address: "2415 Independence Ave", city: "Kansas City", state: "MO", ward: 11, county: "Jackson" },
  // Ward 12 - Jackson County
  { id: 32, name: "Northeast High School", address: "415 Van Brunt Blvd", city: "Kansas City", state: "MO", ward: 12, county: "Jackson" },
  { id: 33, name: "St. Anthony's Catholic Ch", address: "3208 Lexington Ave", city: "Kansas City", state: "MO", ward: 12, county: "Jackson" },
  // Ward 13 - Jackson County
  { id: 34, name: "Our Lady of Peace Catholic Church", address: "1029 Bennington Ave", city: "Kansas City", state: "MO", ward: 13, county: "Jackson" },
  { id: 35, name: "North-East Library", address: "6000 Wilson Ave", city: "Kansas City", state: "MO", ward: 13, county: "Jackson" },
  // Ward 14 - Jackson County
  { id: 36, name: "Wheatley Elem. School", address: "2415 Agnes Ave", city: "Kansas City", state: "MO", ward: 14, county: "Jackson" },
  { id: 37, name: "Cleveland Ave Baptist Ch", address: "2853 Cleveland Ave", city: "Kansas City", state: "MO", ward: 14, county: "Jackson" },
  // Ward 15 - Jackson County
  { id: 38, name: "J.A. Rogers Elem. School", address: "6400 E. 23rd St", city: "Kansas City", state: "MO", ward: 15, county: "Jackson" },
  { id: 39, name: "Sheet Metal Local #2", address: "2902 Blue Ridge Blvd", city: "Kansas City", state: "MO", ward: 15, county: "Jackson" },
  { id: 40, name: "Friendship Baptist Church", address: "3530 Chelsea Ave", city: "Kansas City", state: "MO", ward: 15, county: "Jackson" },
  { id: 41, name: "St Michael's Veteran Center", address: "3838 Chelsea Dr", city: "Kansas City", state: "MO", ward: 15, county: "Jackson" },
  // Ward 16 - Jackson County
  { id: 42, name: "Paradise Baptist Church", address: "1600 E. 58th St", city: "Kansas City", state: "MO", ward: 16, county: "Jackson" },
  { id: 43, name: "Covenant Presbyterian Church", address: "5931 Swope Pkwy", city: "Kansas City", state: "MO", ward: 16, county: "Jackson" },
  { id: 44, name: "The Rochester", address: "3949 Dr Martin Luther King Blvd", city: "Kansas City", state: "MO", ward: 16, county: "Jackson" },
  // Ward 17 - Jackson County
  { id: 45, name: "A.C. Prep Elem. School", address: "6410 Swope Parkway", city: "Kansas City", state: "MO", ward: 17, county: "Jackson" },
  { id: 46, name: "Southeast Community Center", address: "4201 E. 63rd St", city: "Kansas City", state: "MO", ward: 17, county: "Jackson" },
  { id: 47, name: "Southside Christian Ch", address: "7304 Cleveland Ave", city: "Kansas City", state: "MO", ward: 17, county: "Jackson" },
  // Ward 18 - Jackson County
  { id: 48, name: "The Mount Christian Worship Center", address: "1800 E. 79th St", city: "Kansas City", state: "MO", ward: 18, county: "Jackson" },
  { id: 49, name: "New Journey at Gregory Hills Ch", address: "7020 James A Reed Rd", city: "Kansas City", state: "MO", ward: 18, county: "Jackson" },
  { id: 50, name: "Laborer's Union Local #663", address: "7820 Prospect Ave", city: "Kansas City", state: "MO", ward: 18, county: "Jackson" },
  // Ward 19 - Jackson County
  { id: 51, name: "Grace Baptist Church", address: "8524 Blue Ridge Blvd", city: "Kansas City", state: "MO", ward: 19, county: "Jackson" },
  { id: 52, name: "Evangel Church", address: "1414 E. 103rd St", city: "Kansas City", state: "MO", ward: 19, county: "Jackson" },
  { id: 53, name: "Center High School", address: "8715 Holmes Rd", city: "Kansas City", state: "MO", ward: 19, county: "Jackson" },
  // Clay County
  { id: 54, name: "Highlands Community of Christ", address: "7615 N. Platte Purchase Dr", city: "Kansas City", state: "MO", ward: null, county: "Clay" },
  { id: 55, name: "Harmony Vineyard Church", address: "600 NE 46th St", city: "Kansas City", state: "MO", ward: null, county: "Clay" },
  { id: 56, name: "LifeBridge Baptist Church", address: "3710 N Holmes St", city: "Kansas City", state: "MO", ward: null, county: "Clay" },
  { id: 57, name: "KCN Community Center", address: "3930 NE Antioch Rd", city: "Kansas City", state: "MO", ward: null, county: "Clay" },
  { id: 58, name: "Eagle Heights Baptist Church", address: "5600 N Brighton Ave", city: "Kansas City", state: "MO", ward: null, county: "Clay" },
  { id: 59, name: "Avondale United Methodist Church", address: "3101 NE Winn Rd", city: "Kansas City", state: "MO", ward: null, county: "Clay" },
  { id: 60, name: "Good Shepherd Episcopal Church", address: "4947 NE Chouteau Dr", city: "Kansas City", state: "MO", ward: null, county: "Clay" },
  { id: 61, name: "Briarcliff Church", address: "800 NE Vivion Rd", city: "Kansas City", state: "MO", ward: null, county: "Clay" },
  { id: 62, name: "Northcross United Methodist Church", address: "1321 NE Vivion Rd", city: "Kansas City", state: "MO", ward: null, county: "Clay" },
  { id: 63, name: "Gashland Baptist Church", address: "601 NE Barry Rd", city: "Kansas City", state: "MO", ward: null, county: "Clay" },
  { id: 64, name: "Shoal Creek Community Church", address: "6816 N Church Rd", city: "Pleasant Valley", state: "MO", ward: null, county: "Clay" },
  { id: 65, name: "Campus Center Building", address: "2601 NE Barry Rd", city: "Kansas City", state: "MO", ward: null, county: "Clay" },
  { id: 66, name: "Northland Cathedral", address: "101 NW 99th St", city: "Kansas City", state: "MO", ward: null, county: "Clay" },
  { id: 67, name: "Tower View Baptist Church", address: "7301 NE 50th St", city: "Kansas City", state: "MO", ward: null, county: "Clay" },
  { id: 68, name: "Northside Christian Church", address: "5114 NW Old Pike Road", city: "Kansas City", state: "MO", ward: null, county: "Clay" },
  { id: 69, name: "Mid-Continent Library North Oak Branch", address: "8700 N Oak Trafficway", city: "Kansas City", state: "MO", ward: null, county: "Clay" },
  { id: 70, name: "Grace Fellowship", address: "10920 N Oak Trafficway", city: "Kansas City", state: "MO", ward: null, county: "Clay" },
];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function geocodeAddress(place) {
  const query = `${place.address}, ${place.city}, ${place.state}`;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&key=${API_KEY}`;

  const response = await fetch(url);
  const data = await response.json();

  if (data.status === 'OK' && data.results.length > 0) {
    const result = data.results[0];
    return {
      id: place.id,
      name: place.name,
      address: place.address,
      city: place.city,
      state: place.state,
      lat: result.geometry.location.lat,
      lng: result.geometry.location.lng,
      ward: place.ward,
      county: place.county,
      formatted_address: result.formatted_address,
    };
  } else {
    console.error(`  FAILED for "${place.name}" (${query}): ${data.status} - ${data.error_message || 'no error message'}`);
    return {
      id: place.id,
      name: place.name,
      address: place.address,
      city: place.city,
      state: place.state,
      lat: null,
      lng: null,
      ward: place.ward,
      county: place.county,
      formatted_address: null,
      error: data.status,
    };
  }
}

async function main() {
  console.log(`Geocoding ${pollingPlaces.length} polling places...\n`);

  const results = [];

  for (const place of pollingPlaces) {
    console.log(`[${place.id}/${pollingPlaces.length}] ${place.name} - ${place.address}, ${place.city}, ${place.state}`);
    const result = await geocodeAddress(place);
    if (result.lat !== null) {
      console.log(`  -> ${result.lat}, ${result.lng}`);
    }
    results.push(result);
    await delay(200);
  }

  const outputPath = '/Users/andrew/together-kc/scripts/geocoded-polling.json';
  writeFileSync(outputPath, JSON.stringify(results, null, 2));

  const successCount = results.filter(r => r.lat !== null).length;
  const failCount = results.filter(r => r.lat === null).length;

  console.log(`\nDone! ${successCount} succeeded, ${failCount} failed.`);
  console.log(`Output written to: ${outputPath}`);
}

main().catch(console.error);
