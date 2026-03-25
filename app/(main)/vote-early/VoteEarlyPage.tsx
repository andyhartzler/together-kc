'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  EARLY_VOTING_LOCATIONS,
  getLocationStatus,
  getDistanceMiles,
  COUNTY_ELECTION_BOARDS,
  ELECTION_DAY_INFO,
  type EarlyVotingLocation,
} from '@/lib/polling-data';

const APPLE_MAPS_TOKEN =
  'eyJraWQiOiI2N1laVTdLOEFDIiwidHlwIjoiSldUIiwiYWxnIjoiRVMyNTYifQ.eyJpc3MiOiJGU1lBRENTRDY3IiwiaWF0IjoxNzc0NDA0NzY2LCJvcmlnaW4iOiJ0b2dldGhlci1rYy5jb20iLCJzY29wZSI6Im1hcGtpdF9qcyJ9.EnPx4CaGOKO0p_2_NQxZFO_XvHb5rNp2xiDA8KYBgn-_2_qZj1MEhM4UIHxqcRkIGBCDy-_egfJjBdlQ1Ib82w';

type County = 'Jackson' | 'Clay' | 'Platte' | 'Cass' | 'all';

export default function VoteEarlyPage() {
  const [selectedCounty, setSelectedCounty] = useState<County>('all');
  const [selectedLocation, setSelectedLocation] = useState<EarlyVotingLocation | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locatingUser, setLocatingUser] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [sortByDistance, setSortByDistance] = useState(false);
  const [now, setNow] = useState(new Date());
  const [mapLoaded, setMapLoaded] = useState(false);
  const [showMobileList, setShowMobileList] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstanceRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const annotationsRef = useRef<any[]>([]);
  const listRef = useRef<HTMLDivElement>(null);

  // Update clock every minute
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(interval);
  }, []);

  // Filter locations by county
  const filteredLocations = selectedCounty === 'all'
    ? EARLY_VOTING_LOCATIONS
    : EARLY_VOTING_LOCATIONS.filter((l) => l.county === selectedCounty);

  // Sort by distance if user location is available
  const sortedLocations = sortByDistance && userLocation
    ? [...filteredLocations].sort((a, b) => {
        const distA = getDistanceMiles(userLocation.lat, userLocation.lng, a.lat, a.lng);
        const distB = getDistanceMiles(userLocation.lat, userLocation.lng, b.lat, b.lng);
        return distA - distB;
      })
    : filteredLocations;

  // Load Apple MapKit JS
  useEffect(() => {
    if (mapLoaded) return;

    const script = document.createElement('script');
    script.src = 'https://cdn.apple-mapkit.com/mk/5.x.x/mapkit.js';
    script.crossOrigin = 'anonymous';
    script.addEventListener('load', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mapkit = (window as any).mapkit;
      if (!mapkit) return;

      mapkit.init({
        authorizationCallback: (done: (token: string) => void) => {
          done(APPLE_MAPS_TOKEN);
        },
      });

      setMapLoaded(true);
    });
    document.head.appendChild(script);
  }, [mapLoaded]);

  // Initialize map once loaded
  useEffect(() => {
    if (!mapLoaded || !mapRef.current || mapInstanceRef.current) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mapkit = (window as any).mapkit;
    if (!mapkit) return;

    const map = new mapkit.Map(mapRef.current, {
      center: new mapkit.Coordinate(39.05, -94.55),
      cameraDistance: 120000,
      colorScheme: mapkit.Map.ColorSchemes.Dark,
      showsCompass: mapkit.FeatureVisibility.Hidden,
      showsMapTypeControl: false,
      showsZoomControl: true,
      padding: new mapkit.Padding(50, 50, 50, 50),
    });

    mapInstanceRef.current = map;
    addAnnotations(map);
  }, [mapLoaded]); // eslint-disable-line react-hooks/exhaustive-deps

  // Update annotations when filter changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;
    // Remove old annotations
    map.removeAnnotations(annotationsRef.current);
    annotationsRef.current = [];
    addAnnotations(map);
  }, [selectedCounty, now]); // eslint-disable-line react-hooks/exhaustive-deps

  const addAnnotations = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (map: any) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mapkit = (window as any).mapkit;
      if (!mapkit) return;

      const locations =
        selectedCounty === 'all'
          ? EARLY_VOTING_LOCATIONS
          : EARLY_VOTING_LOCATIONS.filter((l) => l.county === selectedCounty);

      const annotations = locations.map((loc) => {
        const status = getLocationStatus(loc, now);
        const coord = new mapkit.Coordinate(loc.lat, loc.lng);

        const annotation = new mapkit.MarkerAnnotation(coord, {
          title: loc.name,
          subtitle: status.status,
          color: status.isOpen ? '#22c55e' : '#e53935',
          glyphText: status.isOpen ? '✓' : '•',
          displayPriority: loc.isElectionBoard
            ? mapkit.Annotation.DisplayPriority.Required
            : mapkit.Annotation.DisplayPriority.High,
          clusteringIdentifier: null,
        });

        annotation.addEventListener('select', () => {
          setSelectedLocation(loc);
          setShowMobileList(false);
        });

        return annotation;
      });

      map.addAnnotations(annotations);
      annotationsRef.current = annotations;

      // Fit map to show all annotations
      if (annotations.length > 0 && selectedCounty !== 'all') {
        map.showItems(annotations, {
          animate: true,
          padding: new mapkit.Padding(60, 60, 60, 60),
        });
      } else {
        map.setCenterAnimated(new mapkit.Coordinate(39.05, -94.55));
        map.setCameraDistanceAnimated(120000);
      }
    },
    [selectedCounty, now]
  );

  // Get user location
  const findNearMe = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }

    setLocatingUser(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        setSortByDistance(true);
        setLocatingUser(false);
        setSelectedCounty('all');

        // Add user location marker on map
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mapkit = (window as any).mapkit;
        if (mapkit && mapInstanceRef.current) {
          const userCoord = new mapkit.Coordinate(latitude, longitude);
          const userAnnotation = new mapkit.MarkerAnnotation(userCoord, {
            title: 'You are here',
            color: '#4a90d9',
            glyphText: '📍',
            displayPriority: 2000,
          });
          mapInstanceRef.current.addAnnotation(userAnnotation);
          mapInstanceRef.current.setCenterAnimated(userCoord);
          mapInstanceRef.current.setCameraDistanceAnimated(80000);
        }
      },
      () => {
        setLocationError('Unable to get your location. Please allow location access and try again.');
        setLocatingUser(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const selectLocationOnMap = (loc: EarlyVotingLocation) => {
    setSelectedLocation(loc);
    setShowMobileList(false);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mapkit = (window as any).mapkit;
    if (mapkit && mapInstanceRef.current) {
      const coord = new mapkit.Coordinate(loc.lat, loc.lng);
      mapInstanceRef.current.setCenterAnimated(coord);
      mapInstanceRef.current.setCameraDistanceAnimated(20000);

      // Select the matching annotation
      const match = annotationsRef.current.find(
        (a) => a.coordinate.latitude === loc.lat && a.coordinate.longitude === loc.lng
      );
      if (match) {
        mapInstanceRef.current.selectedAnnotation = match;
      }
    }
  };

  const getDirectionsUrl = (loc: EarlyVotingLocation) => {
    const addr = encodeURIComponent(`${loc.address}, ${loc.city}, ${loc.state} ${loc.zip}`);
    // Use Apple Maps on iOS/macOS, Google Maps elsewhere
    const isApple = /iPhone|iPad|iPod|Macintosh/.test(navigator.userAgent);
    return isApple
      ? `https://maps.apple.com/?daddr=${addr}`
      : `https://www.google.com/maps/dir/?api=1&destination=${addr}`;
  };

  // Calculate days remaining for early voting
  const earlyVotingEnd = new Date('2026-04-06T23:59:59');
  const earlyVotingStart = new Date('2026-03-24T00:00:00');
  const daysRemaining = Math.max(0, Math.ceil((earlyVotingEnd.getTime() - now.getTime()) / 86400000));
  const hasStarted = now >= earlyVotingStart;
  const hasEnded = now > earlyVotingEnd;

  return (
    <div className="min-h-screen bg-navy">
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-br from-navy via-navy to-sky/30 py-8 px-4 text-center border-b border-white/10">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          {!hasEnded && hasStarted && (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-500/20 border border-green-500/40 text-green-300 text-sm font-medium mb-4">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-400" />
              </span>
              Early voting is open now
            </div>
          )}
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Find Your Early Voting Location
          </h1>
          <p className="text-white/70 text-base md:text-lg max-w-xl mx-auto">
            {hasEnded
              ? 'Early voting has ended. Check your Election Day polling place below.'
              : hasStarted
              ? `${daysRemaining} day${daysRemaining !== 1 ? 's' : ''} left to vote early. No excuse needed.`
              : 'Early voting begins March 24. Find locations near you.'}
          </p>
        </motion.div>
      </div>

      {/* Controls Bar */}
      <div className="sticky top-0 z-30 bg-navy/95 backdrop-blur-md border-b border-white/10 px-3 md:px-4 py-2.5 md:py-3">
        <div className="max-w-7xl mx-auto">
          {/* Top row: county pills */}
          <div className="flex gap-1.5 overflow-x-auto scrollbar-none pb-2 md:pb-0">
            {(['all', 'Jackson', 'Clay', 'Platte', 'Cass'] as County[]).map((county) => (
              <button
                key={county}
                onClick={() => setSelectedCounty(county)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs md:text-sm font-medium transition-all shrink-0 ${
                  selectedCounty === county
                    ? 'bg-coral text-white shadow-lg shadow-coral/30'
                    : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                }`}
              >
                {county === 'all' ? 'All' : county}
              </button>
            ))}

            {/* Spacer to push action buttons right on mobile */}
            <div className="flex-1 min-w-2" />

            {/* Find near me button */}
            <button
              onClick={findNearMe}
              disabled={locatingUser}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-sky/20 text-sky border border-sky/30 text-xs md:text-sm font-medium hover:bg-sky/30 transition-all disabled:opacity-50 shrink-0"
            >
              {locatingUser ? (
                <>
                  <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span className="hidden sm:inline">Locating...</span>
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="hidden sm:inline">Near Me</span>
                </>
              )}
            </button>

            {/* Mobile list toggle */}
            <button
              onClick={() => setShowMobileList(!showMobileList)}
              className="md:hidden flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/10 text-white/70 text-xs font-medium hover:bg-white/20 transition-all shrink-0"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              List
            </button>
          </div>
        </div>

        {locationError && (
          <p className="max-w-7xl mx-auto text-red-400 text-sm mt-2">{locationError}</p>
        )}
      </div>

      {/* Main Content: Map + List */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row" style={{ height: 'calc(100dvh - 160px)' }}>
        {/* Location List (sidebar on desktop, overlay on mobile) */}
        <div
          ref={listRef}
          className={`${
            showMobileList
              ? 'fixed inset-x-0 bottom-0 top-[200px] z-40 bg-navy/98 backdrop-blur-md'
              : 'hidden'
          } md:block md:relative md:w-[400px] md:shrink-0 overflow-y-auto border-r border-white/10`}
        >
          {/* Mobile close button */}
          <div className="md:hidden sticky top-0 bg-navy/95 backdrop-blur-md border-b border-white/10 p-3 flex items-center justify-between">
            <span className="text-white font-semibold">
              {sortedLocations.length} Location{sortedLocations.length !== 1 ? 's' : ''}
            </span>
            <button
              onClick={() => setShowMobileList(false)}
              className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:text-white"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="p-3 space-y-2">
            {sortedLocations.map((loc) => {
              const status = getLocationStatus(loc, now);
              const distance = userLocation
                ? getDistanceMiles(userLocation.lat, userLocation.lng, loc.lat, loc.lng)
                : null;
              const isSelected = selectedLocation?.id === loc.id;

              return (
                <motion.button
                  key={loc.id}
                  onClick={() => selectLocationOnMap(loc)}
                  layout
                  className={`w-full text-left rounded-xl p-4 transition-all ${
                    isSelected
                      ? 'bg-coral/20 border-2 border-coral'
                      : 'bg-white/5 border border-white/10 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-white font-semibold text-sm truncate">{loc.name}</h3>
                        {loc.isElectionBoard && (
                          <span className="shrink-0 px-1.5 py-0.5 rounded text-[10px] font-bold bg-golden/20 text-golden border border-golden/30">
                            HQ
                          </span>
                        )}
                      </div>
                      <p className="text-white/50 text-xs mt-0.5">{loc.address}, {loc.city}</p>
                      <p className="text-white/40 text-xs">{loc.county} County</p>
                    </div>

                    <div className="text-right shrink-0">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                          status.isOpen
                            ? 'bg-green-500/20 text-green-300'
                            : 'bg-white/10 text-white/50'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${status.isOpen ? 'bg-green-400' : 'bg-white/30'}`} />
                        {status.isOpen ? 'Open' : 'Closed'}
                      </span>
                      {distance !== null && (
                        <p className="text-sky text-xs mt-1 font-medium">{distance.toFixed(1)} mi</p>
                      )}
                    </div>
                  </div>

                  {/* Expanded details when selected */}
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-3 pt-3 border-t border-white/10"
                      >
                        <p className="text-white/60 text-xs mb-2">{status.status}</p>

                        {/* Hours */}
                        <div className="space-y-1 mb-3">
                          <p className="text-white/40 text-[10px] uppercase tracking-wider font-semibold">Hours</p>
                          {loc.hours.map((h, i) => (
                            <div key={i} className="flex justify-between text-xs">
                              <span className="text-white/60">
                                {h.label} <span className="text-white/30">({h.dates})</span>
                              </span>
                              <span className={h.closed ? 'text-red-400' : 'text-white/80'}>
                                {h.closed ? 'Closed' : `${h.open} - ${h.close}`}
                              </span>
                            </div>
                          ))}
                        </div>

                        {loc.notes && (
                          <p className="text-golden/80 text-xs mb-3 bg-golden/10 rounded-lg px-3 py-2">
                            {loc.notes}
                          </p>
                        )}

                        {/* Actions */}
                        <div className="flex gap-2">
                          <a
                            href={getDirectionsUrl(loc)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-coral text-white text-xs font-semibold hover:bg-coral/90 transition-colors"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Directions
                          </a>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Map */}
        <div className="flex-1 relative">
          <div ref={mapRef} className="w-full h-full min-h-[400px]" />
          {!mapLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-navy/90">
              <div className="text-center">
                <svg className="w-8 h-8 animate-spin text-white/50 mx-auto mb-3" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <p className="text-white/50 text-sm">Loading map...</p>
              </div>
            </div>
          )}

          {/* Selected location detail panel (mobile overlay) */}
          <AnimatePresence>
            {selectedLocation && (
              <motion.div
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 100 }}
                className="md:hidden absolute bottom-0 inset-x-0 bg-navy/95 backdrop-blur-md border-t border-white/10 rounded-t-2xl p-5 shadow-2xl"
              >
                <button
                  onClick={() => setSelectedLocation(null)}
                  className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white/60"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                {(() => {
                  const status = getLocationStatus(selectedLocation, now);
                  return (
                    <>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-white font-bold text-lg">{selectedLocation.name}</h3>
                        {selectedLocation.isElectionBoard && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-golden/20 text-golden border border-golden/30">
                            HQ
                          </span>
                        )}
                      </div>
                      <p className="text-white/50 text-sm">{selectedLocation.address}, {selectedLocation.city}</p>
                      <div className="flex items-center gap-2 mt-2 mb-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                            status.isOpen
                              ? 'bg-green-500/20 text-green-300'
                              : 'bg-white/10 text-white/50'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${status.isOpen ? 'bg-green-400' : 'bg-white/30'}`} />
                          {status.status}
                        </span>
                        <span className="text-white/30 text-xs">{selectedLocation.county} County</span>
                      </div>
                      {selectedLocation.notes && (
                        <p className="text-golden/80 text-xs mb-3 bg-golden/10 rounded-lg px-3 py-2">
                          {selectedLocation.notes}
                        </p>
                      )}
                      <a
                        href={getDirectionsUrl(selectedLocation)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-coral text-white font-semibold hover:bg-coral/90 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Get Directions
                      </a>
                    </>
                  );
                })()}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Election Day Info Section */}
      <div className="bg-navy border-t border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold text-white mb-2 text-center">
            Election Day - {ELECTION_DAY_INFO.dateFormatted}
          </h2>
          <p className="text-white/60 text-center mb-3 max-w-2xl mx-auto">
            On Election Day, you must vote at your assigned polling place based on your home address.
            Polls are open {ELECTION_DAY_INFO.hours.open} - {ELECTION_DAY_INFO.hours.close}.
          </p>
          <div className="max-w-2xl mx-auto mb-8 rounded-lg bg-sky/10 border border-sky/20 px-4 py-3 text-center">
            <p className="text-sky text-sm">
              <strong>Jackson County voters:</strong> You can vote at any KC polling location on Election Day
              using a ballot marking device. For a paper ballot, go to your assigned location.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(Object.entries(COUNTY_ELECTION_BOARDS) as [string, typeof COUNTY_ELECTION_BOARDS[keyof typeof COUNTY_ELECTION_BOARDS]][]).map(([county, info]) => (
              <div
                key={county}
                className="rounded-xl bg-white/5 border border-white/10 p-5"
              >
                <h3 className="text-white font-semibold mb-1">{county} County</h3>
                <p className="text-white/50 text-sm mb-3">{info.name}</p>

                <div className="space-y-1.5 text-sm">
                  <div className="flex items-center gap-2 text-white/60">
                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <a href={`tel:${info.phone.replace(/\D/g, '')}`} className="hover:text-white transition-colors">
                      {info.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-white/60">
                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="truncate">{info.address}</span>
                  </div>
                </div>

                <a
                  href={info.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-coral/10 text-coral text-sm font-medium hover:bg-coral/20 transition-colors"
                >
                  Find Your Polling Place
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            ))}
          </div>

          {/* Voter ID reminder */}
          <div className="mt-8 rounded-xl bg-golden/10 border border-golden/20 p-5">
            <h3 className="text-golden font-semibold mb-2 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              What to Bring
            </h3>
            <p className="text-white/60 text-sm mb-3">
              Missouri requires a <strong className="text-white/80">valid government-issued photo ID</strong> to vote. Acceptable forms include:
            </p>
            <ul className="text-white/60 text-sm space-y-1 mb-3 ml-4 list-disc">
              <li>Missouri driver&apos;s license or non-driver ID</li>
              <li>U.S. passport</li>
              <li>U.S. military ID</li>
              <li>Other government-issued photo ID</li>
            </ul>
            <p className="text-white/50 text-xs">
              If you do not have a photo ID, you may cast a provisional ballot by providing your name, address, date of birth,
              and last 4 digits of your SSN. Contact your county election board for details.
            </p>
          </div>

          {/* SOS Voter Lookup */}
          <div className="mt-4 text-center">
            <a
              href="https://voteroutreach.sos.mo.gov/portal/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-white/70 text-sm font-medium hover:bg-white/10 hover:text-white transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Check Your Voter Registration (MO Secretary of State)
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
