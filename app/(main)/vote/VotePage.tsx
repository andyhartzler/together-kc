'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { getVotingMode, getDistanceMiles, type VotingMode, type County } from '@/lib/voting-utils';
import { type GeocodeResult } from '@/lib/geocoding';
import { EARLY_VOTING_LOCATIONS } from '@/lib/polling-data';
import { JACKSON_COUNTY_LOCATIONS } from '@/lib/election-day-data';
import { useUserLocation } from '@/hooks/useUserLocation';
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
  const [mode, setMode] = useState<VotingMode>(getVotingMode);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [county, setCounty] = useState<County | null>(null);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [isOutsideKC, setIsOutsideKC] = useState(false);
  const [precinctInfo, setPrecinctInfo] = useState<PrecinctInfo | null>(null);
  const [precinctLoading, setPrecinctLoading] = useState(false);

  const userLoc = useUserLocation();

  const lookupPrecinct = useCallback(async (lat: number, lng: number) => {
    setPrecinctLoading(true);
    try {
      const res = await fetch(`/api/precinct-lookup?lat=${lat}&lng=${lng}`);
      const data = await res.json();
      if (data.found) {
        setPrecinctInfo({
          precinct: data.precinct,
          pollingPlace: data.pollingPlace,
          pollingAddress: data.pollingAddress,
          sampleBallot: data.sampleBallot,
        });
      }
    } catch { /* non-critical */ }
    setPrecinctLoading(false);
  }, []);

  const handleLocationFound = useCallback((result: GeocodeResult) => {
    setUserCoords({ lat: result.lat, lng: result.lng });
    setCounty(result.county);
    setIsOutsideKC(!result.isInKC);
    setPrecinctInfo(null);

    if (result.county === 'Jackson' && result.isInKC) {
      lookupPrecinct(result.lat, result.lng);
    }
  }, [lookupPrecinct]);

  useEffect(() => {
    if (userLoc.location) {
      handleLocationFound(userLoc.location);
    }
  }, [userLoc.location, handleLocationFound]);

  const earlyLocations = useMemo(() => {
    const locs = [...EARLY_VOTING_LOCATIONS];
    if (!userCoords) return locs;
    return locs.sort((a, b) =>
      getDistanceMiles(userCoords.lat, userCoords.lng, a.lat, a.lng) -
      getDistanceMiles(userCoords.lat, userCoords.lng, b.lat, b.lng)
    );
  }, [userCoords]);

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

  const showElectionDayJackson = mode === 'election-day' && (county === 'Jackson' || isOutsideKC || !county);
  const showElectionDayExternal = mode === 'election-day' && county && county !== 'Jackson' && !isOutsideKC;
  const showEarly = mode === 'early';

  return (
    <div className="min-h-screen bg-navy">
      <SmartBanner />

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        <VotingModeToggle mode={mode} onChange={setMode} />
        <LocationEntry
          onLocationFound={handleLocationFound}
          onUseMyLocation={userLoc.requestLocation}
          isLocating={userLoc.isLocating}
          locationError={userLoc.error}
          isOutsideKC={isOutsideKC}
        />
      </div>

      {county && !isOutsideKC && (
        <div className="max-w-2xl mx-auto px-4 pb-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-coral/20 border border-coral/30"
          >
            <span className="text-coral text-xs font-bold">{county} County</span>
            <button
              onClick={() => { setCounty(null); setUserCoords(null); setIsOutsideKC(false); setPrecinctInfo(null); }}
              className="text-coral/60 hover:text-coral transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </motion.div>
        </div>
      )}

      <div className="max-w-2xl mx-auto px-4 pb-6">
        {showEarly && (
          <div className="space-y-3">
            {county && !isOutsideKC && (
              <p className="text-white/50 text-sm">
                {county === 'Jackson'
                  ? 'Vote at any of these locations. No excuse needed.'
                  : `${county} County has 1 early voting location.`}
              </p>
            )}

            {earlyLocations.map((loc) => (
              <LocationCard
                key={loc.id}
                location={loc}
                userLat={userCoords?.lat}
                userLng={userCoords?.lng}
                isEarlyVoting
                isSelected={selectedId === loc.id}
                onSelect={setSelectedId}
              />
            ))}
          </div>
        )}

        {showElectionDayJackson && (
          <div className="space-y-3">
            {(precinctLoading || precinctInfo) && county === 'Jackson' && (
              <AssignedLocationCard info={precinctInfo} isLoading={precinctLoading} />
            )}

            {county === 'Jackson' && !precinctInfo && !precinctLoading && userCoords && (
              <p className="text-white/50 text-sm">
                You can vote at any of these {JACKSON_COUNTY_LOCATIONS.length} KC locations.
              </p>
            )}

            {!county && !isOutsideKC && (
              <p className="text-white/50 text-sm">
                Enter your address to find your assigned polling place, or browse all {JACKSON_COUNTY_LOCATIONS.length} KC locations.
              </p>
            )}

            {precinctInfo && (
              <div className="flex items-center gap-3 py-2">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-white/30 text-xs">Or vote at any KC location</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>
            )}

            {electionDayLocations.map((loc) => (
              <LocationCard
                key={loc.id}
                location={loc}
                userLat={userCoords?.lat}
                userLng={userCoords?.lng}
                isEarlyVoting={false}
                isSelected={selectedId === loc.id}
                onSelect={setSelectedId}
              />
            ))}
          </div>
        )}

        {showElectionDayExternal && county && (
          <CountyExternalCard county={county} />
        )}
      </div>

      <VoterInfo />
    </div>
  );
}
