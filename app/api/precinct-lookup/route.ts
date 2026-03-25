import { NextRequest, NextResponse } from 'next/server';

// KCEB ArcGIS Precincts layer - official KC Election Board data
const KCEB_PRECINCTS_URL =
  'https://services3.arcgis.com/Ayu3EsYWkD5ZwKLW/arcgis/rest/services/Precincts_2023_view/FeatureServer/22/query';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');

  if (!lat || !lng) {
    return NextResponse.json({ error: 'lat and lng parameters required' }, { status: 400 });
  }

  try {
    const params = new URLSearchParams({
      geometry: `${lng},${lat}`,
      geometryType: 'esriGeometryPoint',
      spatialRel: 'esriSpatialRelIntersects',
      outFields: 'Name,Precinct,RV,Home_Poll_Name,Home_Poll_Address,Sample',
      f: 'json',
      returnGeometry: 'false',
      inSR: '4326',
    });

    const response = await fetch(`${KCEB_PRECINCTS_URL}?${params}`, {
      next: { revalidate: 86400 }, // Cache for 24 hours
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to query KCEB' }, { status: 502 });
    }

    const data = await response.json();

    if (data.features && data.features.length > 0) {
      const attrs = data.features[0].attributes;

      // Parse address - remove HTML link if present
      let pollAddress = attrs.Home_Poll_Address || '';
      const hrefMatch = pollAddress.match(/href='([^']+)'/);
      const mapsUrl = hrefMatch ? hrefMatch[1] : null;
      pollAddress = pollAddress.replace(/<[^>]+>/g, '').trim();

      return NextResponse.json({
        found: true,
        precinct: attrs.Name, // e.g. "WD 1 PCT 1"
        precinctCode: attrs.Precinct, // e.g. 101
        registeredVoters: attrs.RV,
        pollingPlace: attrs.Home_Poll_Name,
        pollingAddress: pollAddress,
        mapsUrl,
        sampleBallot: attrs.Sample || null,
      });
    }

    return NextResponse.json({
      found: false,
      message: 'Address is not within Kansas City Election Board boundaries.',
    });
  } catch {
    return NextResponse.json({ error: 'Failed to look up precinct' }, { status: 500 });
  }
}
