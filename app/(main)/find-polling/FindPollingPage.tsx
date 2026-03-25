'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  JACKSON_COUNTY_LOCATIONS,
  COUNTY_LOOKUP_INFO,
  type ElectionDayLocation,
} from '@/lib/election-day-data';
import { getDistanceMiles, COUNTY_ELECTION_BOARDS } from '@/lib/polling-data';

const GOOGLE_API_KEY = 'AIzaSyA0tnMaQcXi8fn5azv72QOxF0UmsYY7d8k';
const APPLE_MAPS_TOKEN =
  'eyJraWQiOiI2N1laVTdLOEFDIiwidHlwIjoiSldUIiwiYWxnIjoiRVMyNTYifQ.eyJpc3MiOiJGU1lBRENTRDY3IiwiaWF0IjoxNzc0NDA0NzY2LCJvcmlnaW4iOiJ0b2dldGhlci1rYy5jb20iLCJzY29wZSI6Im1hcGtpdF9qcyJ9.EnPx4CaGOKO0p_2_NQxZFO_XvHb5rNp2xiDA8KYBgn-_2_qZj1MEhM4UIHxqcRkIGBCDy-_egfJjBdlQ1Ib82w';

type County = 'Jackson' | 'Clay' | 'Platte' | 'Cass';
type Step = 'address' | 'result';

interface LookupResult {
  county: County;
  address: string;
  lat: number;
  lng: number;
}

export default function FindPollingPage() {
  const [step, setStep] = useState<Step>('address');
  const [addressInput, setAddressInput] = useState('');
  const [isLooking, setIsLooking] = useState(false);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [result, setResult] = useState<LookupResult | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<ElectionDayLocation | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [showAllLocations, setShowAllLocations] = useState(false);

  const mapRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstanceRef = useRef<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const autocompleteRef = useRef<any>(null);

  // Load Google Maps for geocoding + autocomplete
  const loadGoogleMaps = useCallback(() => {
    return new Promise<void>((resolve, reject) => {
      if (window.google?.maps?.Geocoder) { resolve(); return; }
      const existing = document.querySelector('script[src*="maps.googleapis.com"]');
      if (existing) {
        if (window.google?.maps?.Geocoder) resolve();
        else existing.addEventListener('load', () => resolve());
        return;
      }
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}&libraries=places`;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Google Maps'));
      document.head.appendChild(script);
    });
  }, []);

  // Init Google Places autocomplete
  useEffect(() => {
    if (step !== 'address' || !inputRef.current || autocompleteRef.current) return;
    (async () => {
      try {
        await loadGoogleMaps();
        if (!window.google?.maps?.places || !inputRef.current) return;
        const kcBounds = new window.google.maps.LatLngBounds(
          new window.google.maps.LatLng(38.8, -94.8),
          new window.google.maps.LatLng(39.4, -94.3)
        );
        const ac = new window.google.maps.places.Autocomplete(inputRef.current, {
          types: ['address'],
          componentRestrictions: { country: 'us' },
          bounds: kcBounds,
          strictBounds: false,
          fields: ['formatted_address', 'address_components', 'geometry'],
        });
        ac.addListener('place_changed', () => {
          const place = ac.getPlace();
          if (place.formatted_address) {
            setAddressInput(place.formatted_address);
            // Auto-lookup
            doLookup(place);
          }
        });
        autocompleteRef.current = ac;
      } catch { /* silent */ }
    })();
  }, [step, loadGoogleMaps]); // eslint-disable-line react-hooks/exhaustive-deps

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const doLookup = async (place?: any) => {
    const addr = place?.formatted_address || addressInput.trim();
    if (!addr) return;

    setIsLooking(true);
    setLookupError(null);

    const timeout = setTimeout(() => {
      setLookupError('Lookup is taking too long. Please try again.');
      setIsLooking(false);
    }, 10000);

    try {
      await loadGoogleMaps();

      // If we already have geometry from Places, use it
      if (place?.geometry?.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const countyComp = place.address_components?.find(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (c: any) => c.types.includes('administrative_area_level_2')
        );
        if (countyComp) {
          const countyName = countyComp.long_name.replace(' County', '');
          if (['Jackson', 'Clay', 'Platte', 'Cass'].includes(countyName)) {
            clearTimeout(timeout);
            setResult({ county: countyName as County, address: addr, lat, lng });
            setStep('result');
            setIsLooking(false);
            return;
          }
        }
      }

      // Fall back to geocoding
      const isZip = /^\d{5}(-\d{4})?$/.test(addr);
      const query = isZip ? `${addr}, MO` : `${addr}, Kansas City, MO`;

      const geocoder = new window.google!.maps.Geocoder();
      geocoder.geocode({ address: query }, (results, status) => {
        clearTimeout(timeout);
        if (status === 'OK' && results && results.length > 0) {
          const r = results[0];
          const countyComp = r.address_components.find(
            (c) => c.types.includes('administrative_area_level_2')
          );
          if (countyComp) {
            const name = countyComp.long_name.replace(' County', '');
            if (['Jackson', 'Clay', 'Platte', 'Cass'].includes(name)) {
              setResult({
                county: name as County,
                address: r.formatted_address,
                lat: r.geometry.location.lat(),
                lng: r.geometry.location.lng(),
              });
              setStep('result');
            } else {
              setLookupError(`That address is in ${name} County, outside Kansas City.`);
            }
          } else {
            setLookupError("Couldn't determine your county. Try entering your full address.");
          }
        } else {
          setLookupError("Couldn't find that address. Please check and try again.");
        }
        setIsLooking(false);
      });
    } catch {
      clearTimeout(timeout);
      setLookupError('Something went wrong. Please try again.');
      setIsLooking(false);
    }
  };

  // Load Apple MapKit JS
  useEffect(() => {
    if (step !== 'result' || mapLoaded) return;
    const existing = document.querySelector('script[src*="apple-mapkit"]');
    if (existing) { setMapLoaded(true); return; }
    const script = document.createElement('script');
    script.src = 'https://cdn.apple-mapkit.com/mk/5.x.x/mapkit.js';
    script.crossOrigin = 'anonymous';
    script.addEventListener('load', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mapkit = (window as any).mapkit;
      if (!mapkit) return;
      try {
        mapkit.init({
          authorizationCallback: (done: (token: string) => void) => done(APPLE_MAPS_TOKEN),
        });
      } catch { /* already initialized */ }
      setMapLoaded(true);
    });
    document.head.appendChild(script);
  }, [step, mapLoaded]);

  // Initialize map for result view
  useEffect(() => {
    if (!mapLoaded || !mapRef.current || !result) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mapkit = (window as any).mapkit;
    if (!mapkit) return;

    // Clean up previous map
    if (mapInstanceRef.current) {
      mapInstanceRef.current.destroy();
      mapInstanceRef.current = null;
    }

    const map = new mapkit.Map(mapRef.current, {
      center: new mapkit.Coordinate(result.lat, result.lng),
      cameraDistance: 40000,
      colorScheme: mapkit.Map.ColorSchemes.Dark,
      showsCompass: mapkit.FeatureVisibility.Hidden,
      showsMapTypeControl: false,
      showsZoomControl: true,
    });

    // User location marker
    const userAnnotation = new mapkit.MarkerAnnotation(
      new mapkit.Coordinate(result.lat, result.lng),
      { title: 'Your Address', color: '#4a90d9', glyphText: '📍' }
    );
    map.addAnnotation(userAnnotation);

    // Add polling location markers for Jackson County
    if (result.county === 'Jackson') {
      const locations = showAllLocations
        ? JACKSON_COUNTY_LOCATIONS
        : JACKSON_COUNTY_LOCATIONS
            .map((loc) => ({
              ...loc,
              dist: loc.lat !== 0 ? getDistanceMiles(result.lat, result.lng, loc.lat, loc.lng) : 999,
            }))
            .sort((a, b) => a.dist - b.dist)
            .slice(0, 10);

      locations.forEach((loc) => {
        if (loc.lat === 0 && loc.lng === 0) return;
        const a = new mapkit.MarkerAnnotation(
          new mapkit.Coordinate(loc.lat, loc.lng),
          {
            title: loc.name,
            subtitle: loc.room || '',
            color: '#e53935',
            glyphText: loc.ward ? `W${loc.ward}` : '•',
          }
        );
        a.addEventListener('select', () => setSelectedLocation(loc));
        map.addAnnotation(a);
      });
    }

    mapInstanceRef.current = map;
  }, [mapLoaded, result, showAllLocations]); // eslint-disable-line react-hooks/exhaustive-deps

  const getDirectionsUrl = (loc: ElectionDayLocation) => {
    const addr = encodeURIComponent(`${loc.address}, ${loc.city}, ${loc.state} ${loc.zip}`);
    const isApple = /iPhone|iPad|iPod|Macintosh/.test(navigator.userAgent);
    return isApple
      ? `https://maps.apple.com/?daddr=${addr}`
      : `https://www.google.com/maps/dir/?api=1&destination=${addr}`;
  };

  const resetLookup = () => {
    setStep('address');
    setResult(null);
    setSelectedLocation(null);
    setAddressInput('');
    setLookupError(null);
    setShowAllLocations(false);
    autocompleteRef.current = null;
    if (mapInstanceRef.current) {
      mapInstanceRef.current.destroy();
      mapInstanceRef.current = null;
    }
  };

  // Get sorted locations for Jackson County
  const sortedJacksonLocations = result?.county === 'Jackson'
    ? JACKSON_COUNTY_LOCATIONS
        .filter((l) => l.lat !== 0)
        .map((loc) => ({
          ...loc,
          distance: getDistanceMiles(result.lat, result.lng, loc.lat, loc.lng),
        }))
        .sort((a, b) => a.distance - b.distance)
    : [];

  const displayLocations = showAllLocations
    ? sortedJacksonLocations
    : sortedJacksonLocations.slice(0, 10);

  return (
    <div className="min-h-screen bg-navy">
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-navy via-navy to-coral/10 py-8 md:py-12 px-4 text-center border-b border-white/10">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Find Your Polling Place
          </h1>
          <p className="text-white/60 text-base md:text-lg">
            Election Day is <strong className="text-coral">April 7, 2026</strong>. Polls open 6:00 AM - 7:00 PM.
          </p>
        </motion.div>
      </div>

      <AnimatePresence mode="wait">
        {step === 'address' && (
          <motion.div
            key="address"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-lg mx-auto px-4 py-12"
          >
            {/* Address Input Card */}
            <div className="rounded-2xl bg-white/5 border border-white/10 p-6 md:p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-full bg-coral/20 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-coral" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-white mb-1">Enter Your Address</h2>
                <p className="text-white/50 text-sm">
                  We&apos;ll find the right polling locations for you based on which county you&apos;re in.
                </p>
              </div>

              <div className="space-y-3">
                <input
                  ref={inputRef}
                  type="text"
                  value={addressInput}
                  onChange={(e) => setAddressInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && doLookup()}
                  placeholder="Enter your home address or zip code"
                  className="w-full px-4 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/30 focus:border-coral focus:ring-2 focus:ring-coral/20 outline-none text-base"
                  autoFocus
                />

                <button
                  onClick={() => doLookup()}
                  disabled={isLooking || !addressInput.trim()}
                  className="w-full py-3.5 rounded-xl bg-coral text-white font-semibold text-base hover:bg-coral/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                  {isLooking ? (
                    <>
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Looking up...
                    </>
                  ) : (
                    'Find My Polling Place'
                  )}
                </button>

                {lookupError && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-400 text-sm text-center"
                  >
                    {lookupError}
                  </motion.p>
                )}
              </div>

              {/* Quick county buttons */}
              <div className="mt-6 pt-6 border-t border-white/10">
                <p className="text-white/40 text-xs text-center mb-3">Or select your county directly</p>
                <div className="grid grid-cols-2 gap-2">
                  {(['Jackson', 'Clay', 'Platte', 'Cass'] as County[]).map((county) => (
                    <button
                      key={county}
                      onClick={() => {
                        setResult({ county, address: '', lat: 39.0997, lng: -94.5786 });
                        setStep('result');
                      }}
                      className="py-2 px-3 rounded-lg bg-white/5 border border-white/10 text-white/60 text-sm font-medium hover:bg-white/10 hover:text-white transition-all"
                    >
                      {county} County
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Link to early voting */}
            <div className="mt-6 text-center">
              <a
                href="/vote-early"
                className="text-sky text-sm hover:text-sky/80 transition-colors"
              >
                Looking for early voting? View early voting locations &rarr;
              </a>
            </div>
          </motion.div>
        )}

        {step === 'result' && result && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {/* County result header */}
            <div className="bg-white/5 border-b border-white/10 px-4 py-4">
              <div className="max-w-5xl mx-auto flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded-full bg-coral/20 text-coral text-xs font-bold">
                      {result.county} County
                    </span>
                    {result.address && (
                      <span className="text-white/40 text-xs truncate max-w-[200px] md:max-w-none">
                        {result.address}
                      </span>
                    )}
                  </div>
                  <p className="text-white/70 text-sm">
                    {COUNTY_LOOKUP_INFO[result.county].message}
                  </p>
                </div>
                <button
                  onClick={resetLookup}
                  className="shrink-0 px-3 py-1.5 rounded-lg bg-white/10 text-white/60 text-xs font-medium hover:bg-white/20 transition-all"
                >
                  Change Address
                </button>
              </div>
            </div>

            {/* Jackson County: Show map + nearest locations */}
            {result.county === 'Jackson' && (
              <div className="max-w-7xl mx-auto flex flex-col md:flex-row" style={{ height: 'calc(100dvh - 280px)', minHeight: '500px' }}>
                {/* List */}
                <div className="md:w-[380px] md:shrink-0 overflow-y-auto border-r border-white/10 order-2 md:order-1">
                  <div className="p-3">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-white font-semibold text-sm">
                        {showAllLocations ? 'All 70' : 'Nearest 10'} Polling Locations
                      </h3>
                      <button
                        onClick={() => setShowAllLocations(!showAllLocations)}
                        className="text-sky text-xs hover:text-sky/80 transition-colors"
                      >
                        {showAllLocations ? 'Show Nearest' : 'Show All 70'}
                      </button>
                    </div>

                    <div className="space-y-2">
                      {displayLocations.map((loc) => {
                        const isSelected = selectedLocation?.id === loc.id;
                        return (
                          <button
                            key={loc.id}
                            onClick={() => setSelectedLocation(loc)}
                            className={`w-full text-left rounded-xl p-3 transition-all ${
                              isSelected
                                ? 'bg-coral/20 border-2 border-coral'
                                : 'bg-white/5 border border-white/10 hover:bg-white/10'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="shrink-0 w-6 h-6 rounded bg-navy flex items-center justify-center text-[10px] text-white/60 font-mono border border-white/10">
                                    {loc.ward}
                                  </span>
                                  <h4 className="text-white font-medium text-sm truncate">{loc.name}</h4>
                                </div>
                                <p className="text-white/40 text-xs mt-0.5 ml-8">{loc.address}</p>
                                {loc.room && (
                                  <p className="text-white/30 text-xs ml-8">{loc.room}</p>
                                )}
                              </div>
                              <span className="text-sky text-xs font-medium shrink-0">
                                {loc.distance.toFixed(1)} mi
                              </span>
                            </div>

                            <AnimatePresence>
                              {isSelected && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="mt-3 pt-3 border-t border-white/10 ml-8"
                                >
                                  <p className="text-white/50 text-xs mb-2">
                                    Ward {loc.ward}{loc.letterCode ? ` (${loc.letterCode})` : ''} - Serves precincts: {loc.precincts.join(', ')}
                                  </p>
                                  <a
                                    href={getDirectionsUrl(loc)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-coral text-white text-xs font-semibold hover:bg-coral/90 transition-colors"
                                  >
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    </svg>
                                    Get Directions
                                  </a>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Map */}
                <div className="flex-1 relative order-1 md:order-2 min-h-[300px] md:min-h-0">
                  <div ref={mapRef} className="w-full h-full" />
                  {!mapLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-navy/90">
                      <svg className="w-8 h-8 animate-spin text-white/50" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    </div>
                  )}

                  {/* Mobile selected location card */}
                  <AnimatePresence>
                    {selectedLocation && (
                      <motion.div
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 100 }}
                        className="md:hidden absolute bottom-0 inset-x-0 bg-navy/95 backdrop-blur-md border-t border-white/10 rounded-t-2xl p-4"
                      >
                        <button
                          onClick={() => setSelectedLocation(null)}
                          className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white/60"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                        <h3 className="text-white font-bold">{selectedLocation.name}</h3>
                        <p className="text-white/50 text-sm">{selectedLocation.address}</p>
                        {selectedLocation.room && <p className="text-white/40 text-xs">{selectedLocation.room}</p>}
                        <a
                          href={getDirectionsUrl(selectedLocation)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-coral text-white font-semibold"
                        >
                          Get Directions
                        </a>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {/* Clay/Platte/Cass: Show assigned lookup */}
            {result.county !== 'Jackson' && (
              <div className="max-w-lg mx-auto px-4 py-12">
                <div className="rounded-2xl bg-white/5 border border-white/10 p-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-golden/20 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-golden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>

                  <h2 className="text-xl font-bold text-white mb-2">{result.county} County</h2>
                  <p className="text-white/60 text-sm mb-6">
                    {COUNTY_LOOKUP_INFO[result.county].message}
                    {' '}Use your county&apos;s official lookup tool to find your exact polling place.
                  </p>

                  <a
                    href={COUNTY_LOOKUP_INFO[result.county].lookupUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-coral text-white font-semibold text-base hover:bg-coral/90 transition-all shadow-lg shadow-coral/20"
                  >
                    {'lookupLabel' in COUNTY_LOOKUP_INFO[result.county]
                      ? (COUNTY_LOOKUP_INFO[result.county] as { lookupLabel: string }).lookupLabel
                      : 'Find Your Polling Place'}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>

                  {/* County contact info */}
                  <div className="mt-8 pt-6 border-t border-white/10 text-left">
                    <h3 className="text-white/80 font-semibold text-sm mb-3">Contact {result.county} County Election Board</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-white/60">
                        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <a href={`tel:${COUNTY_ELECTION_BOARDS[result.county].phone.replace(/\D/g, '')}`} className="hover:text-white transition-colors">
                          {COUNTY_ELECTION_BOARDS[result.county].phone}
                        </a>
                      </div>
                      <div className="flex items-center gap-2 text-white/60">
                        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                        <span>{COUNTY_ELECTION_BOARDS[result.county].address}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
