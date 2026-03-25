'use client';

import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { getVotingMode, getDistanceMiles, type VotingMode, type County, COUNTY_CENTERS } from '@/lib/voting-utils';
import { type GeocodeResult, initAutocomplete, geocodeAddress } from '@/lib/geocoding';
import { EARLY_VOTING_LOCATIONS } from '@/lib/polling-data';
import { JACKSON_COUNTY_LOCATIONS } from '@/lib/election-day-data';
import { useAppleMap } from '@/hooks/useAppleMap';
import { useUserLocation } from '@/hooks/useUserLocation';
import { downloadCalendarEvent } from '@/lib/calendar';
import SmartBanner from './components/SmartBanner';
import VotingModeToggle from './components/VotingModeToggle';
import LocationEntry from './components/LocationEntry';
import LocationCard from './components/LocationCard';
import AssignedLocationCard from './components/AssignedLocationCard';
import CountyExternalCard from './components/CountyExternalCard';
import VoterInfo from './components/VoterInfo';

interface PrecinctInfo {
  precinct: string;
  pollingPlace: string;
  pollingAddress: string;
  sampleBallot: string | null;
}

export default function VotePage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Read initial state from URL
  const urlCounty = searchParams.get('county');
  const urlMode = searchParams.get('mode');

  const [mode, setMode] = useState<VotingMode>(() => {
    if (urlMode === 'election-day') return 'election-day';
    if (urlMode === 'early') return 'early';
    return getVotingMode();
  });

  const initialCounty = (() => {
    if (!urlCounty) return null;
    const normalized = urlCounty.charAt(0).toUpperCase() + urlCounty.slice(1).toLowerCase();
    if (['Jackson', 'Clay', 'Platte', 'Cass'].includes(normalized)) return normalized as County;
    return null;
  })();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [county, setCounty] = useState<County | null>(initialCounty);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [precinctInfo, setPrecinctInfo] = useState<PrecinctInfo | null>(null);
  const [precinctLoading, setPrecinctLoading] = useState(false);
  const [showMobileMap, setShowMobileMap] = useState(false);
  const [electionDayAddress, setElectionDayAddress] = useState('');
  const [electionDaySearching, setElectionDaySearching] = useState(false);
  const [electionDayError, setElectionDayError] = useState<string | null>(null);
  const [showAllElectionDay, setShowAllElectionDay] = useState(false);
  const [calendarAdded, setCalendarAdded] = useState(false);
  const electionDayInputRef = useRef<HTMLInputElement>(null);
  const electionDayAcRef = useRef(false);

  // Sync state to URL params
  useEffect(() => {
    const params = new URLSearchParams();
    if (county) params.set('county', county.toLowerCase());
    if (mode !== getVotingMode()) params.set('mode', mode);
    const search = params.toString();
    const newUrl = search ? `/vote?${search}` : '/vote';
    router.replace(newUrl, { scroll: false });
  }, [county, mode, router]);

  const userLoc = useUserLocation();

  // Call KCEB ArcGIS directly from browser (CORS enabled, skips Vercel cold start)
  const lookupPrecinct = useCallback(async (lat: number, lng: number) => {
    setPrecinctLoading(true);
    try {
      const params = new URLSearchParams({
        geometry: `${lng},${lat}`,
        geometryType: 'esriGeometryPoint',
        spatialRel: 'esriSpatialRelIntersects',
        outFields: 'Name,Precinct,Home_Poll_Name,Home_Poll_Address,Sample',
        f: 'json',
        returnGeometry: 'false',
        inSR: '4326',
      });
      const res = await fetch(
        `https://services3.arcgis.com/Ayu3EsYWkD5ZwKLW/arcgis/rest/services/Precincts_2023_view/FeatureServer/22/query?${params}`
      );
      const data = await res.json();
      if (data.features?.length > 0) {
        const attrs = data.features[0].attributes;
        // Parse address HTML
        let pollAddress = attrs.Home_Poll_Address || '';
        pollAddress = pollAddress.replace(/<[^>]+>/g, '').trim();
        // Parse sample ballot HTML -> local PDF path
        let sampleBallot: string | null = null;
        const sampleMatch = (attrs.Sample || '').match(/href="([^"]+)"/);
        if (sampleMatch) {
          const filename = sampleMatch[1].split('/').pop();
          sampleBallot = `/ballots/${filename}`;
        }
        setPrecinctInfo({
          precinct: attrs.Name,
          pollingPlace: attrs.Home_Poll_Name,
          pollingAddress: pollAddress,
          sampleBallot,
        });
      }
    } catch { /* non-critical */ }
    setPrecinctLoading(false);
  }, []);

  const handleCountySelect = useCallback((selected: County) => {
    setCounty(selected);
    setUserCoords(null);
    setPrecinctInfo(null);
  }, []);

  const handleLocationFound = useCallback((result: GeocodeResult) => {
    setUserCoords({ lat: result.lat, lng: result.lng });
    if (result.county) {
      setCounty(result.county);
    }
    setPrecinctInfo(null);

    if (result.county === 'Jackson' && result.isInKC) {
      lookupPrecinct(result.lat, result.lng);
    }
  }, [lookupPrecinct]);

  const handleNearMe = useCallback(() => {
    userLoc.requestLocation();
  }, [userLoc]);

  // When geolocation resolves, apply it
  const lastLocRef = useMemo(() => ({ applied: null as GeocodeResult | null }), []);
  if (userLoc.location && userLoc.location !== lastLocRef.applied) {
    lastLocRef.applied = userLoc.location;
    // Schedule state update after render
    setTimeout(() => handleLocationFound(userLoc.location!), 0);
  }

  // Init autocomplete for election day address input
  useEffect(() => {
    if (!electionDayInputRef.current || electionDayAcRef.current) return;
    if (!(mode === 'election-day' && county === 'Jackson' && !precinctInfo)) return;
    electionDayAcRef.current = true;
    initAutocomplete(electionDayInputRef.current, (result) => {
      setElectionDayAddress(result.formattedAddress);
      setUserCoords({ lat: result.lat, lng: result.lng });
      lookupPrecinct(result.lat, result.lng);
    }).catch(() => {});
  }, [mode, county, precinctInfo, lookupPrecinct]);

  const handleElectionDaySearch = useCallback(async () => {
    if (!electionDayAddress.trim()) return;
    setElectionDaySearching(true);
    setElectionDayError(null);
    try {
      const result = await geocodeAddress(electionDayAddress.trim());
      if (result && result.lat && result.lng) {
        setUserCoords({ lat: result.lat, lng: result.lng });
        lookupPrecinct(result.lat, result.lng);
      } else {
        setElectionDayError("Couldn't find that address. Please check and try again.");
      }
    } catch {
      setElectionDayError('Something went wrong. Please try again.');
    } finally {
      setElectionDaySearching(false);
    }
  }, [electionDayAddress, lookupPrecinct]);

  const handleChangeCounty = useCallback(() => {
    setCounty(null);
    setUserCoords(null);
    setPrecinctInfo(null);
    setSelectedId(null);
    setElectionDayAddress('');
    setElectionDayError(null);
    setShowAllElectionDay(false);
    electionDayAcRef.current = false;
  }, []);

  // Filter early voting locations by county
  const earlyLocations = useMemo(() => {
    if (!county) return [];
    const locs = EARLY_VOTING_LOCATIONS.filter((l) => l.county === county);
    if (!userCoords) return locs;
    return [...locs].sort((a, b) =>
      getDistanceMiles(userCoords.lat, userCoords.lng, a.lat, a.lng) -
      getDistanceMiles(userCoords.lat, userCoords.lng, b.lat, b.lng)
    );
  }, [county, userCoords]);

  // Election day: Jackson County shows all 53 locations
  const electionDayLocations = useMemo(() => {
    let locs = JACKSON_COUNTY_LOCATIONS.filter((l) => l.lat !== 0);
    if (userCoords) {
      locs = [...locs].sort((a, b) =>
        getDistanceMiles(userCoords.lat, userCoords.lng, a.lat, a.lng) -
        getDistanceMiles(userCoords.lat, userCoords.lng, b.lat, b.lng)
      );
    }
    return locs;
  }, [userCoords]);

  const showElectionDayJackson = mode === 'election-day' && county === 'Jackson';
  const showElectionDayExternal = mode === 'election-day' && county && county !== 'Jackson';
  const showEarly = mode === 'early';

  // Determine which locations to show for map pins
  const visibleLocations = useMemo(() => {
    if (showEarly) return earlyLocations;
    if (showElectionDayJackson && showAllElectionDay) return electionDayLocations;
    // Don't show all 53 pins by default on election day
    return [];
  }, [showEarly, showElectionDayJackson, showAllElectionDay, earlyLocations, electionDayLocations]);

  // Map pins from visible locations
  const mapPins = useMemo(() => {
    return visibleLocations
      .filter((l) => l.lat !== 0)
      .map((loc) => ({
        id: loc.id,
        lat: loc.lat,
        lng: loc.lng,
        title: loc.name,
        subtitle: `${loc.address}, ${loc.city}`,
        color: '#E53935',
        glyphText: 'ward' in loc && loc.ward ? `${loc.ward}` : undefined,
      }));
  }, [visibleLocations]);

  // Map center based on county
  const mapCenter = useMemo(() => {
    if (userCoords) return userCoords;
    if (county) return COUNTY_CENTERS[county];
    return { lat: 39.0997, lng: -94.5786 };
  }, [county, userCoords]);

  const mapZoom = useMemo(() => {
    if (showElectionDayJackson) return 120000;
    if (county === 'Jackson') return 80000;
    return 50000;
  }, [county, showElectionDayJackson]);

  const { mapRef, isLoaded: mapLoaded, centerOn } = useAppleMap({
    center: mapCenter,
    zoom: mapZoom,
    pins: mapPins,
    onPinSelect: (id) => setSelectedId(id),
    enabled: !!county,
    showMobileMap,
  });

  const handleCardSelect = useCallback((id: string) => {
    setSelectedId((prev) => prev === id ? null : id);
    const loc = visibleLocations.find((l) => l.id === id);
    if (loc && loc.lat !== 0) {
      centerOn(loc.lat, loc.lng, 10000);
    }
  }, [visibleLocations, centerOn]);

  // Step 1: No county selected - show county selection
  if (!county) {
    return (
      <div className="min-h-screen bg-navy">
        <SmartBanner />
        <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
          <VotingModeToggle mode={mode} onChange={setMode} />
          <LocationEntry
            onCountySelect={handleCountySelect}
            onLocationFound={handleLocationFound}
            mode={mode}
          />
        </div>
        <VoterInfo county={county} />
      </div>
    );
  }

  // Step 2: County selected - show locations + map
  return (
    <div className="min-h-screen bg-navy">
      <SmartBanner />

      {/* Controls bar */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex-1 w-full sm:w-auto">
            <VotingModeToggle mode={mode} onChange={setMode} />
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* County badge + Change County */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-coral/20 border border-coral/30">
              <span className="text-coral text-xs font-bold">{county} County</span>
              <button
                onClick={handleChangeCounty}
                className="text-coral/60 hover:text-coral transition-colors text-xs font-medium"
              >
                Change
              </button>
            </div>

            {/* Near Me button */}
            <button
              onClick={handleNearMe}
              disabled={userLoc.isLocating}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-white/60 text-xs font-medium hover:bg-white/20 transition-all disabled:opacity-50"
            >
              {userLoc.isLocating ? (
                <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
              )}
              Near Me
            </button>

            {/* Mobile map toggle */}
            <button
              onClick={() => setShowMobileMap(!showMobileMap)}
              className="md:hidden inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-white/60 text-xs font-medium hover:bg-white/20 transition-all"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              {showMobileMap ? 'List' : 'Map'}
            </button>
          </div>
        </div>

        {userLoc.error && (
          <p className="text-red-400 text-xs mt-2">{userLoc.error}</p>
        )}
      </div>

      {/* Desktop: two-column layout (list LEFT, map RIGHT) */}
      {/* Mobile: list or map based on toggle */}
      <div className="max-w-7xl mx-auto px-4 pb-6">
        <div className="flex gap-4">
          {/* Left column - location cards */}
          <div className={`w-full md:w-[400px] md:flex-shrink-0 ${showMobileMap ? 'hidden md:block' : 'block'}`}>
            <div className="md:max-h-[calc(100vh-200px)] md:overflow-y-auto md:pr-2 space-y-3 scrollbar-thin scrollbar-thumb-white/10">
              {showEarly && (
                <>
                  <p className="text-white/50 text-sm">
                    {county === 'Jackson'
                      ? `${earlyLocations.length} early voting locations. Vote at any one.`
                      : `${county} County has ${earlyLocations.length} early voting location.`}
                  </p>
                  {earlyLocations.map((loc) => (
                    <LocationCard
                      key={loc.id}
                      location={loc}
                      userLat={userCoords?.lat}
                      userLng={userCoords?.lng}
                      isEarlyVoting
                      isSelected={selectedId === loc.id}
                      onSelect={handleCardSelect}
                    />
                  ))}
                </>
              )}

              {/* Calendar reminder - shown on election day for all counties */}
              {mode === 'election-day' && (
                <button
                  onClick={() => {
                    downloadCalendarEvent();
                    setCalendarAdded(true);
                    setTimeout(() => setCalendarAdded(false), 3000);
                  }}
                  className="w-full flex items-center gap-3 p-4 rounded-xl bg-sky/10 border border-sky/20 hover:bg-sky/15 transition-all text-left"
                >
                  <div className="w-10 h-10 rounded-full bg-sky/20 flex items-center justify-center shrink-0 text-lg">
                    {calendarAdded ? '✓' : '📅'}
                  </div>
                  <div>
                    <h4 className="text-white font-semibold text-sm">
                      {calendarAdded ? 'Added to Calendar!' : 'Remind Me to Vote'}
                    </h4>
                    <p className="text-white/40 text-xs">Add Election Day (April 7) to your calendar</p>
                  </div>
                </button>
              )}

              {showElectionDayJackson && (
                <>
                  {/* Step A: No precinct found yet - prompt for address */}
                  {!precinctInfo && !precinctLoading && (
                    <div className="rounded-2xl bg-white/5 border border-white/10 p-5 space-y-4">
                      <div className="text-center">
                        <div className="w-14 h-14 rounded-full bg-coral/20 flex items-center justify-center mx-auto mb-3">
                          <svg className="w-7 h-7 text-coral" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <h3 className="text-white font-bold text-lg mb-1">Find Your Assigned Polling Place</h3>
                        <p className="text-white/50 text-sm">Enter your home address to find your designated Election Day polling location.</p>
                      </div>

                      <div className="flex gap-2">
                        <input
                          ref={electionDayInputRef}
                          type="text"
                          value={electionDayAddress}
                          onChange={(e) => setElectionDayAddress(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleElectionDaySearch()}
                          placeholder="Enter your home address"
                          className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/30 focus:border-coral focus:ring-2 focus:ring-coral/20 outline-none text-base min-h-[48px]"
                        />
                        <button
                          onClick={handleElectionDaySearch}
                          disabled={electionDaySearching || !electionDayAddress.trim()}
                          className="px-5 rounded-xl bg-coral text-white font-semibold hover:bg-coral/90 disabled:opacity-40 transition-all min-h-[48px]"
                        >
                          {electionDaySearching ? (
                            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                          ) : 'Find'}
                        </button>
                      </div>

                      {electionDayError && (
                        <p className="text-red-400 text-sm text-center">{electionDayError}</p>
                      )}

                      <p className="text-white/30 text-xs text-center">
                        On Election Day, you can vote at any KC polling location. Your assigned location is the only place you can get a paper ballot.
                      </p>
                    </div>
                  )}

                  {/* Step B: Loading precinct */}
                  {precinctLoading && (
                    <AssignedLocationCard info={null} isLoading />
                  )}

                  {/* Step C: Precinct found - show assigned + option to see all */}
                  {precinctInfo && (
                    <>
                      <AssignedLocationCard info={precinctInfo} isLoading={false} />

                      <button
                        onClick={() => setShowAllElectionDay(!showAllElectionDay)}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-white/10 text-white/50 text-sm font-medium hover:bg-white/10 hover:text-white/70 transition-all"
                      >
                        <svg className={`w-4 h-4 transition-transform ${showAllElectionDay ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                        {showAllElectionDay ? 'Hide other locations' : `View all ${electionDayLocations.length} KC polling locations`}
                      </button>

                      {showAllElectionDay && (
                        <div className="space-y-3">
                          <p className="text-white/40 text-xs">
                            You can also vote at any of these locations using a ballot marking device.
                          </p>
                          {electionDayLocations.map((loc) => (
                            <LocationCard
                              key={loc.id}
                              location={loc}
                              userLat={userCoords?.lat}
                              userLng={userCoords?.lng}
                              isEarlyVoting={false}
                              isSelected={selectedId === loc.id}
                              onSelect={handleCardSelect}
                            />
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </>
              )}

              {showElectionDayExternal && county && (
                <CountyExternalCard county={county} />
              )}
            </div>
          </div>

          {/* Right column - Apple Maps (desktop always, mobile toggle) */}
          <div className={`flex-1 min-h-[400px] md:min-h-[calc(100vh-200px)] ${showMobileMap ? 'block' : 'hidden md:block'}`}>
            <div className="relative w-full h-full min-h-[400px] md:min-h-[calc(100vh-200px)] rounded-xl overflow-hidden border border-white/10">
              <div ref={mapRef} className="absolute inset-0" />
              {!mapLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-navy/80">
                  <div className="text-center">
                    <svg className="w-8 h-8 animate-spin text-white/30 mx-auto mb-2" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <p className="text-white/40 text-sm">Loading map...</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <VoterInfo />
    </div>
  );
}
