'use client';

import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { getVotingMode, getDistanceMiles, type VotingMode, type County, COUNTY_CENTERS } from '@/lib/voting-utils';
import { type GeocodeResult, initAutocomplete, geocodeAddress, findPlaceCoordinates } from '@/lib/geocoding';
import { EARLY_VOTING_LOCATIONS, COUNTY_ELECTION_BOARDS } from '@/lib/polling-data';
import { JACKSON_COUNTY_LOCATIONS } from '@/lib/election-day-data';
import { PLATTE_COUNTY_LOCATIONS, findPlattePollingPlace, PLATTE_ARCGIS_URL } from '@/lib/platte-county-data';
import { CLAY_COUNTY_LOCATIONS, findClayPollingPlace, CLAY_ARCGIS_URL } from '@/lib/clay-county-data';
import { useAppleMap } from '@/hooks/useAppleMap';
import { useUserLocation } from '@/hooks/useUserLocation';
import { downloadElectionDayEvent } from '@/lib/calendar';
import SmartBanner from './components/SmartBanner';
import VotingModeToggle from './components/VotingModeToggle';
import LocationEntry from './components/LocationEntry';
import LocationCard from './components/LocationCard';
import AssignedLocationCard from './components/AssignedLocationCard';
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
  const [showCountyDropdown, setShowCountyDropdown] = useState(false);
  const [electionDayAddress, setElectionDayAddress] = useState('');
  const [electionDaySearching, setElectionDaySearching] = useState(false);
  const [electionDayError, setElectionDayError] = useState<string | null>(null);
  const [showAllElectionDay, setShowAllElectionDay] = useState(false);
  const [calendarAdded, setCalendarAdded] = useState(false);
  const electionDayInputRef = useRef<HTMLInputElement>(null);
  const electionDayAcRef = useRef(false);

  // Sync state to URL params - push on county change (for back button), replace on mode change
  const prevCountyRef = useRef<County | null>(initialCounty);
  useEffect(() => {
    const params = new URLSearchParams();
    if (county) params.set('county', county.toLowerCase());
    if (mode !== getVotingMode()) params.set('mode', mode);
    const search = params.toString();
    const newUrl = search ? `/vote?${search}` : '/vote';

    const countyChanged = county !== prevCountyRef.current;
    prevCountyRef.current = county;

    if (countyChanged && county !== null) {
      // County selected = forward navigation, push so back button works
      router.push(newUrl, { scroll: false });
    } else {
      // Mode toggle or county cleared = replace (don't add history entries)
      router.replace(newUrl, { scroll: false });
    }
  }, [county, mode, router]);

  // Handle bfcache restoration - reset state when page is restored from back-forward cache
  useEffect(() => {
    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        // Page was restored from bfcache - reset state
        setCounty(initialCounty);
        setPrecinctInfo(null);
      }
    };
    window.addEventListener('pageshow', handlePageShow);
    return () => window.removeEventListener('pageshow', handlePageShow);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Close county dropdown when clicking outside
  useEffect(() => {
    if (!showCountyDropdown) return;
    const close = () => setShowCountyDropdown(false);
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [showCountyDropdown]);

  const userLoc = useUserLocation();

  // Unified precinct lookup for ALL counties
  const lookupPrecinct = useCallback(async (lat: number, lng: number, forCounty: County) => {
    setPrecinctLoading(true);
    try {
      if (forCounty === 'Jackson') {
        // KCEB ArcGIS lookup
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
          let pollAddress = attrs.Home_Poll_Address || '';
          pollAddress = pollAddress.replace(/<[^>]+>/g, '').trim();
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
        } else {
          setElectionDayError("We couldn't find your assigned polling place. Please contact your county election board.");
        }
      } else if (forCounty === 'Platte') {
        const params = new URLSearchParams({
          geometry: `${lng},${lat}`,
          geometryType: 'esriGeometryPoint',
          inSR: '4326',
          spatialRel: 'esriSpatialRelIntersects',
          outFields: 'VOTINGPNAM',
          returnGeometry: 'false',
          f: 'json',
        });
        const res = await fetch(`${PLATTE_ARCGIS_URL}?${params}`);
        const data = await res.json();
        if (data.features?.length > 0) {
          const precinctName = data.features[0].attributes.VOTINGPNAM;
          const site = findPlattePollingPlace(precinctName);
          if (site) {
            setPrecinctInfo({
              precinct: precinctName,
              pollingPlace: site.name,
              pollingAddress: `${site.address}, ${site.city}, MO ${site.zip}`,
              sampleBallot: null,
            });
          } else {
            setElectionDayError("We couldn't find your assigned polling place. Please contact your county election board.");
          }
        } else {
          setElectionDayError("We couldn't find your assigned polling place. Please contact your county election board.");
        }
      } else if (forCounty === 'Clay') {
        const params = new URLSearchParams({
          geometry: `${lng},${lat}`,
          geometryType: 'esriGeometryPoint',
          spatialRel: 'esriSpatialRelIntersects',
          outFields: 'precinct,subprecinct,BallotStyleNumber',
          f: 'json',
          returnGeometry: 'false',
          inSR: '4326',
        });
        const res = await fetch(`${CLAY_ARCGIS_URL}?${params}`);
        const data = await res.json();
        if (data.features?.length > 0) {
          const attrs = data.features[0].attributes;
          const site = findClayPollingPlace(attrs.precinct);
          if (site) {
            const ballotStyle = attrs.BallotStyleNumber;
            const styleNum = String(ballotStyle).padStart(3, '0');
            setPrecinctInfo({
              precinct: attrs.precinct,
              pollingPlace: site.name,
              pollingAddress: `${site.address}, ${site.city}, MO ${site.zip}`,
              sampleBallot: `/ballots/clay/style-${styleNum}.pdf`,
            });
          } else {
            setElectionDayError("We couldn't find your assigned polling place. Please contact your county election board.");
          }
        } else {
          setElectionDayError("We couldn't find your assigned polling place. Please contact your county election board.");
        }
      } else if (forCounty === 'Cass') {
        // Cass County doesn't have ArcGIS boundary data
        // Show inline contact info
        setPrecinctInfo({
          precinct: 'Cass County',
          pollingPlace: 'Cass County Clerk - Election Office',
          pollingAddress: '102 E Wall St, Harrisonville, MO 64701',
          sampleBallot: '/ballots/cass/sample-ballot.pdf',
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

    if (result.county && result.isInKC) {
      lookupPrecinct(result.lat, result.lng, result.county);
    }
  }, [lookupPrecinct]);

  const handleNearMe = useCallback(() => {
    userLoc.requestLocation();
  }, [userLoc]);

  // When geolocation resolves, apply it
  useEffect(() => {
    if (userLoc.location) {
      handleLocationFound(userLoc.location);
    }
  }, [userLoc.location, handleLocationFound]);

  // Reset autocomplete ref when precinctInfo is cleared (e.g. county change)
  useEffect(() => {
    if (precinctInfo === null) {
      electionDayAcRef.current = false;
    }
  }, [precinctInfo]);

  // Init autocomplete for election day address input - works for ALL counties
  useEffect(() => {
    if (!electionDayInputRef.current || electionDayAcRef.current) return;
    if (!(mode === 'election-day' && county && !precinctInfo)) return;
    electionDayAcRef.current = true;
    const currentCounty = county;
    initAutocomplete(electionDayInputRef.current, (result) => {
      setElectionDayAddress(result.formattedAddress);
      setUserCoords({ lat: result.lat, lng: result.lng });
      lookupPrecinct(result.lat, result.lng, currentCounty);
    }).catch(() => {});
  }, [mode, county, precinctInfo, lookupPrecinct]);

  const handleElectionDaySearch = useCallback(async () => {
    if (!electionDayAddress.trim() || !county) return;
    setElectionDaySearching(true);
    setElectionDayError(null);
    try {
      const result = await geocodeAddress(electionDayAddress.trim());
      if (result && result.lat && result.lng) {
        if (!result.isInKC) {
          setElectionDayError("That address doesn't appear to be in Kansas City. Please check your address.");
        } else {
          setUserCoords({ lat: result.lat, lng: result.lng });
          lookupPrecinct(result.lat, result.lng, county);
        }
      } else {
        setElectionDayError("Couldn't find that address. Please check and try again.");
      }
    } catch {
      setElectionDayError('Something went wrong. Please try again.');
    } finally {
      setElectionDaySearching(false);
    }
  }, [electionDayAddress, lookupPrecinct, county]);

  const handleModeChange = useCallback((newMode: VotingMode) => {
    setMode(newMode);
    setShowMobileMap(false);
    setSelectedId(null);
    if (newMode === 'election-day') {
      // Don't carry over county from early voting - prompt for address
      setCounty(null);
      setUserCoords(null);
      setPrecinctInfo(null);
      setElectionDayAddress('');
      setElectionDayError(null);
      electionDayAcRef.current = false;
    }
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

  const showElectionDay = mode === 'election-day' && !!county;
  const showEarly = mode === 'early';

  // Platte County election day locations for map pins + list (KC-only for map overview)
  const platteElectionDayLocations = useMemo(() => {
    return PLATTE_COUNTY_LOCATIONS
      .filter((loc) => loc.isKC !== false)
      .map((loc) => ({
        id: loc.id,
        name: loc.name,
        address: loc.address,
        city: loc.city,
        state: loc.state,
        zip: loc.zip,
        lat: loc.lat,
        lng: loc.lng,
        county: 'Platte' as County,
        precincts: [] as number[],
      }));
  }, []);

  // Clay County election day locations for map pins + list (KC-only for map overview)
  const clayElectionDayLocations = useMemo(() => {
    return CLAY_COUNTY_LOCATIONS
      .filter((loc) => loc.isKC !== false)
      .map((loc) => ({
        id: loc.id,
        name: loc.name,
        address: loc.address,
        city: loc.city,
        state: 'MO',
        zip: loc.zip,
        lat: loc.lat,
        lng: loc.lng,
        county: 'Clay' as County,
        precincts: [] as number[],
      }));
  }, []);

  // Determine which locations to show for map pins
  const visibleLocations = useMemo(() => {
    if (showEarly) return earlyLocations;
    if (showElectionDay) {
      if (county === 'Jackson' && showAllElectionDay) return electionDayLocations;
      if (county === 'Platte') return platteElectionDayLocations;
      if (county === 'Clay') return clayElectionDayLocations;
      // Cass has 1 location or just the assigned pin
      return [];
    }
    return [];
  }, [showEarly, showElectionDay, county, showAllElectionDay, earlyLocations, electionDayLocations, platteElectionDayLocations, clayElectionDayLocations]);

  // Geocode the assigned polling place address for map pin
  const [assignedPin, setAssignedPin] = useState<{
    id: string; lat: number; lng: number; title: string; subtitle: string; color: string; glyphText: string;
  } | null>(null);

  useEffect(() => {
    if (!precinctInfo) { setAssignedPin(null); return; }

    (async () => {
      try {
        // Use Places API for exact building location (more accurate than geocoding)
        const coords = await findPlaceCoordinates(
          precinctInfo.pollingPlace,
          precinctInfo.pollingAddress
        );
        if (coords) {
          setAssignedPin({
            id: 'assigned',
            lat: coords.lat,
            lng: coords.lng,
            title: precinctInfo.pollingPlace,
            subtitle: precinctInfo.pollingAddress,
            color: '#22c55e',
            glyphText: '\u2605',
          });
        }
      } catch { /* silent */ }
    })();
  }, [precinctInfo]);

  // Map pins from visible locations + assigned polling place
  const mapPins = useMemo(() => {
    const pins = visibleLocations
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
    // Add assigned polling place pin (green, prominent)
    if (assignedPin) {
      pins.unshift(assignedPin);
    }
    return pins;
  }, [visibleLocations, assignedPin]);

  // Map center based on county
  const mapCenter = useMemo(() => {
    // Center on assigned polling place if found
    if (assignedPin) return { lat: assignedPin.lat, lng: assignedPin.lng };
    if (userCoords) return userCoords;
    if (county) return COUNTY_CENTERS[county];
    return { lat: 39.0997, lng: -94.5786 };
  }, [county, userCoords, assignedPin]);

  const mapZoom = useMemo(() => {
    if (assignedPin && !showAllElectionDay) return 2000;
    // These are fallbacks - showItems() auto-fits when pins load
    return 40000;
  }, [assignedPin, showAllElectionDay]);

  const { mapRef, isLoaded: mapLoaded, centerOn } = useAppleMap({
    center: mapCenter,
    zoom: mapZoom,
    pins: mapPins,
    onPinSelect: (id) => setSelectedId(id),
    enabled: !!county,
    showMobileMap,
  });

  // When assigned location is found, zoom map to it
  useEffect(() => {
    if (assignedPin && mapLoaded) {
      centerOn(assignedPin.lat, assignedPin.lng, 2000);
    }
  }, [assignedPin, mapLoaded, centerOn]);

  const handleCardSelect = useCallback((id: string) => {
    setSelectedId((prev) => prev === id ? null : id);
    const loc = visibleLocations.find((l) => l.id === id);
    if (loc && loc.lat !== 0) {
      centerOn(loc.lat, loc.lng, 2000);
    }
  }, [visibleLocations, centerOn]);

  // "Just exploring" - show Jackson County with all locations
  const handleExplore = useCallback(() => {
    setCounty('Jackson');
    setShowAllElectionDay(true);
  }, []);

  // Get the "view all" location count for the current county
  const allLocationsCount = useMemo(() => {
    if (county === 'Jackson') return electionDayLocations.length;
    if (county === 'Platte') return platteElectionDayLocations.length;
    if (county === 'Clay') return clayElectionDayLocations.length;
    return 0;
  }, [county, electionDayLocations.length, platteElectionDayLocations.length, clayElectionDayLocations.length]);

  // Get the "view all" locations list for the current county
  const allLocationsList = useMemo(() => {
    if (county === 'Jackson') return electionDayLocations;
    if (county === 'Platte') return platteElectionDayLocations;
    if (county === 'Clay') return clayElectionDayLocations;
    return [];
  }, [county, electionDayLocations, platteElectionDayLocations, clayElectionDayLocations]);

  // County-specific helper text for the address prompt
  const countyAddressPromptText = useMemo(() => {
    if (county === 'Jackson') return 'Enter your address to find your assigned polling place.';
    if (county === 'Cass') return 'Cass County voters must vote at their assigned precinct polling place.';
    return `${county} County voters must vote at their assigned precinct polling place on Election Day.`;
  }, [county]);

  // Step 1: No county selected - show county selection
  if (!county) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Animated gradient background - matches Hero */}
        <div className="fixed inset-0 bg-gradient-to-br from-navy via-navy/95 to-sky/80" />
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-coral/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-1/4 -right-1/4 w-2/3 h-2/3 bg-sky/10 rounded-full blur-3xl" />
          <div className="absolute top-1/3 right-1/4 w-1/3 h-1/3 bg-golden/5 rounded-full blur-3xl" />
        </div>
        <div className="fixed inset-0 opacity-[0.02] pointer-events-none" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }} />

        {/* Content */}
        <div className="relative z-10">
          <SmartBanner />
          <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
            <VotingModeToggle mode={mode} onChange={handleModeChange} />
            <LocationEntry
              onCountySelect={handleCountySelect}
              onLocationFound={handleLocationFound}
              onExplore={handleExplore}
              mode={mode}
            />
          </div>
          <VoterInfo county={county} />
        </div>
      </div>
    );
  }

  // Step 2: County selected - show locations + map
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated gradient background - matches Hero */}
      <div className="fixed inset-0 bg-gradient-to-br from-navy via-navy/95 to-sky/80" />
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-coral/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-1/4 -right-1/4 w-2/3 h-2/3 bg-sky/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-1/3 h-1/3 bg-golden/5 rounded-full blur-3xl" />
      </div>
      <div className="fixed inset-0 opacity-[0.02] pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
        backgroundSize: '50px 50px',
      }} />

      {/* Content */}
      <div className="relative z-10">
      <SmartBanner />

      {/* Controls bar */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex-1 w-full sm:w-auto">
            <VotingModeToggle mode={mode} onChange={handleModeChange} />
          </div>
          <div className={`flex items-center gap-2 flex-shrink-0 ${mode === 'election-day' ? 'w-full sm:w-auto justify-center sm:justify-end' : ''}`}>
            {/* County selector */}
            <div className="relative">
              <button
                onClick={(e) => { e.stopPropagation(); setShowCountyDropdown(!showCountyDropdown); }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-sm font-bold hover:bg-white/15 transition-all"
              >
                {county} County
                <svg className={`w-4 h-4 text-white/50 transition-transform ${showCountyDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <AnimatePresence>
                {showCountyDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -5, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -5, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full mt-2 left-0 z-50 min-w-[180px] rounded-xl bg-navy/95 backdrop-blur-xl border border-white/15 shadow-2xl overflow-hidden"
                  >
                    {(['Jackson', 'Clay', 'Platte', 'Cass'] as County[]).map((c) => (
                      <button
                        key={c}
                        onClick={() => {
                          setCounty(c);
                          setUserCoords(null);
                          setPrecinctInfo(null);
                          setSelectedId(null);
                          setShowAllElectionDay(false);
                          setElectionDayAddress('');
                          setElectionDayError(null);
                          electionDayAcRef.current = false;
                          setShowCountyDropdown(false);
                        }}
                        className={`w-full text-left px-5 py-3 text-sm font-medium transition-colors ${
                          c === county
                            ? 'text-coral bg-coral/10'
                            : 'text-white/80 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        {c} County
                        {c === county && (
                          <svg className="inline w-4 h-4 ml-2 text-coral" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Near Me button - only for early voting */}
            {showEarly && (
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
            )}

            {/* Mobile map toggle - only for early voting */}
            {showEarly && (
              <button
                onClick={() => setShowMobileMap(!showMobileMap)}
                className="md:hidden inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-white/60 text-xs font-medium hover:bg-white/20 transition-all"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                {showMobileMap ? 'List' : 'Map'}
              </button>
            )}
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

              {/* Calendar reminder - shown on election day after address is entered */}

              {/* UNIFIED ELECTION DAY FLOW - same for ALL counties */}
              {showElectionDay && (
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
                        {countyAddressPromptText}
                      </p>
                    </div>
                  )}

                  {/* Step B: Loading precinct */}
                  {precinctLoading && (
                    <AssignedLocationCard info={null} isLoading />
                  )}

                  {/* Step C: Precinct found */}
                  {precinctInfo && (
                    <>
                      {/* Cass County special note */}
                      {county === 'Cass' && (
                        <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-3 flex items-start gap-2.5">
                          <svg className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <div className="text-amber-200/80 text-sm">
                            <p>Contact the Cass County Clerk for your polling place assignment.</p>
                            <a href={`tel:${COUNTY_ELECTION_BOARDS.Cass.phone.replace(/\D/g, '')}`} className="text-amber-300 font-semibold hover:underline">{COUNTY_ELECTION_BOARDS.Cass.phone}</a>
                          </div>
                        </div>
                      )}

                      {/* Polls hours - ABOVE the green card */}
                      <div className="rounded-xl bg-white/[0.06] border border-white/10 p-4 text-center">
                        <p className="text-white font-bold text-lg">Polls open 6:00 AM - 7:00 PM</p>
                        <p className="text-white/50 text-sm mt-1">Tuesday, April 7, 2026</p>
                      </div>

                      {/* Assigned location card */}
                      <AssignedLocationCard info={precinctInfo} isLoading={false} pinLat={assignedPin?.lat} pinLng={assignedPin?.lng} />


                      {/* Remind me to vote - BELOW the card */}
                      <button
                        onClick={() => {
                          downloadElectionDayEvent(precinctInfo.pollingPlace, precinctInfo.pollingAddress);
                          setCalendarAdded(true);
                          setTimeout(() => setCalendarAdded(false), 3000);
                        }}
                        className="w-full flex items-center gap-3 p-4 rounded-xl bg-sky/10 border border-sky/20 hover:bg-sky/15 transition-all text-left"
                      >
                        <div className="w-10 h-10 rounded-full bg-sky/20 flex items-center justify-center shrink-0 text-lg">
                          {calendarAdded ? '\u2713' : '\ud83d\udcc5'}
                        </div>
                        <div>
                          <h4 className="text-white font-semibold text-sm">
                            {calendarAdded ? 'Added to Calendar!' : 'Remind Me to Vote'}
                          </h4>
                          <p className="text-white/40 text-xs">Add Election Day at {precinctInfo.pollingPlace} to your calendar</p>
                        </div>
                      </button>
                    </>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Right column - Apple Maps (desktop always, mobile toggle) */}
          <div className={`flex-1 ${(assignedPin && mode === 'election-day') ? 'min-h-[250px] md:min-h-[calc(100vh-200px)]' : 'min-h-[400px] md:min-h-[calc(100vh-200px)]'} ${(showMobileMap || (assignedPin && mode === 'election-day')) ? 'block' : 'hidden md:block'}`}>
            <div className="relative w-full h-full min-h-[250px] md:min-h-[calc(100vh-200px)] rounded-xl overflow-hidden border border-white/10">
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

      <VoterInfo county={county} />
      </div>
    </div>
  );
}
