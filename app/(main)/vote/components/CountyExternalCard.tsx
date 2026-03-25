'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { initAutocomplete, geocodeAddress } from '@/lib/geocoding';
import { COUNTY_ELECTION_BOARDS } from '@/lib/polling-data';
import { COUNTY_LOOKUP_INFO } from '@/lib/election-day-data';
import { findPlattePollingPlace, PLATTE_ARCGIS_URL, type PlatteCountyLocation } from '@/lib/platte-county-data';
import { getDirectionsUrl } from '@/lib/voting-utils';
import type { County } from '@/lib/voting-utils';

interface ClayBallotResult {
  precinct: string;
  ballotStyle: number;
  ballotUrl: string;
}

const lookupClayBallot = async (lat: number, lng: number): Promise<ClayBallotResult | null> => {
  const params = new URLSearchParams({
    geometry: `${lng},${lat}`,
    geometryType: 'esriGeometryPoint',
    spatialRel: 'esriSpatialRelIntersects',
    outFields: 'precinct,subprecinct,BallotStyleNumber',
    f: 'json',
    returnGeometry: 'false',
    inSR: '4326',
  });
  const res = await fetch(
    `https://services3.arcgis.com/kJEeRPrdQ0Y3Jq8x/arcgis/rest/services/sub_precinct/FeatureServer/0/query?${params}`
  );
  const data = await res.json();
  if (data.features?.length > 0) {
    const attrs = data.features[0].attributes;
    const styleNum = String(attrs.BallotStyleNumber).padStart(3, '0');
    return {
      precinct: attrs.precinct,
      ballotStyle: attrs.BallotStyleNumber,
      ballotUrl: `/ballots/clay/style-${styleNum}.pdf`,
    };
  }
  return null;
};

const lookupPlattePrecinct = async (lat: number, lng: number): Promise<PlatteCountyLocation | null> => {
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
    return findPlattePollingPlace(precinctName);
  }
  return null;
};

interface Props { county: County; }

export default function CountyExternalCard({ county }: Props) {
  const board = COUNTY_ELECTION_BOARDS[county];
  const lookup = COUNTY_LOOKUP_INFO[county];

  // Clay County ballot lookup state
  const [clayAddress, setClayAddress] = useState('');
  const [claySearching, setClaySearching] = useState(false);
  const [clayError, setClayError] = useState<string | null>(null);
  const [clayResult, setClayResult] = useState<ClayBallotResult | null>(null);
  const [showBallot, setShowBallot] = useState(false);
  const clayInputRef = useRef<HTMLInputElement>(null);
  const clayAcRef = useRef(false);

  // Platte County polling place lookup state
  const [platteAddress, setPlatteAddress] = useState('');
  const [platteSearching, setPlatteSearching] = useState(false);
  const [platteError, setPlatteError] = useState<string | null>(null);
  const [platteResult, setPlatteResult] = useState<PlatteCountyLocation | null>(null);
  const platteInputRef = useRef<HTMLInputElement>(null);
  const platteAcRef = useRef(false);

  // Platte / Cass PDF viewer state
  const [showPdf, setShowPdf] = useState(false);

  // Init Google Places autocomplete for Clay County
  useEffect(() => {
    if (county !== 'Clay') return;
    if (!clayInputRef.current || clayAcRef.current) return;
    clayAcRef.current = true;
    initAutocomplete(clayInputRef.current, async (result) => {
      setClayAddress(result.formattedAddress);
      setClaySearching(true);
      setClayError(null);
      try {
        const ballot = await lookupClayBallot(result.lat, result.lng);
        if (ballot) {
          setClayResult(ballot);
        } else {
          setClayError('No ballot found for this address. Make sure the address is in Clay County.');
        }
      } catch {
        setClayError('Something went wrong. Please try again.');
      } finally {
        setClaySearching(false);
      }
    }).catch(() => {});
  }, [county]);

  // Init Google Places autocomplete for Platte County
  useEffect(() => {
    if (county !== 'Platte') return;
    if (!platteInputRef.current || platteAcRef.current) return;
    platteAcRef.current = true;
    initAutocomplete(platteInputRef.current, async (result) => {
      setPlatteAddress(result.formattedAddress);
      setPlatteSearching(true);
      setPlatteError(null);
      try {
        const place = await lookupPlattePrecinct(result.lat, result.lng);
        if (place) {
          setPlatteResult(place);
        } else {
          setPlatteError('No polling place found for this address. Make sure the address is in Platte County.');
        }
      } catch {
        setPlatteError('Something went wrong. Please try again.');
      } finally {
        setPlatteSearching(false);
      }
    }).catch(() => {});
  }, [county]);

  const handlePlatteSearch = async () => {
    if (!platteAddress.trim()) return;
    setPlatteSearching(true);
    setPlatteError(null);
    try {
      const result = await geocodeAddress(platteAddress.trim());
      if (result && result.lat && result.lng) {
        const place = await lookupPlattePrecinct(result.lat, result.lng);
        if (place) {
          setPlatteResult(place);
        } else {
          setPlatteError('No polling place found for this address. Make sure the address is in Platte County.');
        }
      } else {
        setPlatteError("Couldn't find that address. Please check and try again.");
      }
    } catch {
      setPlatteError('Something went wrong. Please try again.');
    } finally {
      setPlatteSearching(false);
    }
  };

  const handleClaySearch = async () => {
    if (!clayAddress.trim()) return;
    setClaySearching(true);
    setClayError(null);
    try {
      const result = await geocodeAddress(clayAddress.trim());
      if (result && result.lat && result.lng) {
        const ballot = await lookupClayBallot(result.lat, result.lng);
        if (ballot) {
          setClayResult(ballot);
        } else {
          setClayError('No ballot found for this address. Make sure the address is in Clay County.');
        }
      } else {
        setClayError("Couldn't find that address. Please check and try again.");
      }
    } catch {
      setClayError('Something went wrong. Please try again.');
    } finally {
      setClaySearching(false);
    }
  };

  // --- CLAY COUNTY ---
  if (county === 'Clay') {
    return (
      <div className="space-y-4">
        {/* Ballot lookup card */}
        <div className="rounded-2xl bg-white/5 border border-white/10 p-5 space-y-4">
          <AnimatePresence mode="wait">
            {!clayResult ? (
              <motion.div key="clay-search" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="text-center">
                  <div className="w-14 h-14 rounded-full bg-coral/20 flex items-center justify-center mx-auto mb-3">
                    <svg className="w-7 h-7 text-coral" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-white font-bold text-lg mb-1">Find Your Sample Ballot</h3>
                  <p className="text-white/50 text-sm">
                    Enter your Clay County address to look up your ballot style and view your sample ballot.
                  </p>
                </div>

                <div className="flex gap-2 mt-4">
                  <input
                    ref={clayInputRef}
                    type="text"
                    value={clayAddress}
                    onChange={(e) => setClayAddress(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleClaySearch()}
                    placeholder="Enter your home address"
                    className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/30 focus:border-coral focus:ring-2 focus:ring-coral/20 outline-none text-base min-h-[48px]"
                  />
                  <button
                    onClick={handleClaySearch}
                    disabled={claySearching || !clayAddress.trim()}
                    className="px-5 rounded-xl bg-coral text-white font-semibold hover:bg-coral/90 disabled:opacity-40 transition-all min-h-[48px]"
                  >
                    {claySearching ? (
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    ) : 'Find'}
                  </button>
                </div>

                {clayError && (
                  <p className="text-red-400 text-sm text-center mt-3">{clayError}</p>
                )}

                <p className="text-white/30 text-xs text-center mt-3">
                  Clay County voters must vote at their assigned precinct polling place on Election Day.
                </p>
              </motion.div>
            ) : (
              <motion.div key="clay-result" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 rounded-full bg-green-500/30 flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <span className="text-green-300 text-xs font-semibold uppercase tracking-wider">Ballot Found</span>
                </div>
                <div className="space-y-1 mb-3">
                  <p className="text-white/60 text-sm">Precinct: <span className="text-white font-semibold">{clayResult.precinct}</span></p>
                  <p className="text-white/60 text-sm">Ballot Style: <span className="text-white font-semibold">{clayResult.ballotStyle}</span></p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowBallot(true)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg bg-coral text-white text-sm font-semibold hover:bg-coral/90 transition-colors min-h-[44px]"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    View Sample Ballot
                  </button>
                  <button
                    onClick={() => { setClayResult(null); setClayAddress(''); clayAcRef.current = false; }}
                    className="px-4 py-2.5 rounded-lg bg-white/10 text-white/60 text-sm font-medium hover:bg-white/20 transition-colors min-h-[44px]"
                  >
                    New Search
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Polling place lookup link */}
        <div className="rounded-xl bg-white/5 border border-white/10 p-4 space-y-3">
          <h3 className="text-white/60 font-semibold text-xs uppercase tracking-wider">Find Your Polling Place</h3>
          <a
            href={lookup.lookupUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/10 text-white/70 font-semibold text-sm hover:bg-white/20 transition-all min-h-[44px]"
          >
            {('lookupLabel' in lookup ? (lookup as Record<string, string>).lookupLabel : null) ?? 'Find Your Polling Place'}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
          <div className="text-center">
            <a
              href="https://voteroutreach.sos.mo.gov/portal/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-white/40 text-xs hover:text-white/60 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Or look up your registration on the MO Secretary of State site
            </a>
          </div>
        </div>

        {/* County contact info */}
        <CountyContactCard board={board} />

        {/* Fullscreen ballot viewer */}
        {showBallot && clayResult && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col" onClick={() => setShowBallot(false)}>
            <div className="flex items-center justify-between p-4 bg-navy/90">
              <h3 className="text-white font-semibold text-sm">
                Sample Ballot - Precinct {clayResult.precinct}, Style {clayResult.ballotStyle}
              </h3>
              <button onClick={() => setShowBallot(false)} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1" onClick={(e) => e.stopPropagation()}>
              <iframe src={clayResult.ballotUrl} className="w-full h-full" title="Sample Ballot" />
            </div>
          </div>
        )}
      </div>
    );
  }

  // --- PLATTE COUNTY ---
  if (county === 'Platte') {
    const platteFullAddress = platteResult
      ? `${platteResult.address}, ${platteResult.city}, ${platteResult.state} ${platteResult.zip}`
      : '';

    return (
      <div className="space-y-4">
        {/* Polling place lookup card */}
        <div className="rounded-2xl bg-white/5 border border-white/10 p-5 space-y-4">
          <AnimatePresence mode="wait">
            {!platteResult ? (
              <motion.div key="platte-search" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="text-center">
                  <div className="w-14 h-14 rounded-full bg-coral/20 flex items-center justify-center mx-auto mb-3">
                    <svg className="w-7 h-7 text-coral" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h3 className="text-white font-bold text-lg mb-1">Find Your Polling Place</h3>
                  <p className="text-white/50 text-sm">
                    Enter your Platte County address to find your assigned Election Day polling location.
                  </p>
                </div>

                <div className="flex gap-2 mt-4">
                  <input
                    ref={platteInputRef}
                    type="text"
                    value={platteAddress}
                    onChange={(e) => setPlatteAddress(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handlePlatteSearch()}
                    placeholder="Enter your home address"
                    className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/30 focus:border-coral focus:ring-2 focus:ring-coral/20 outline-none text-base min-h-[48px]"
                  />
                  <button
                    onClick={handlePlatteSearch}
                    disabled={platteSearching || !platteAddress.trim()}
                    className="px-5 rounded-xl bg-coral text-white font-semibold hover:bg-coral/90 disabled:opacity-40 transition-all min-h-[48px]"
                  >
                    {platteSearching ? (
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    ) : 'Find'}
                  </button>
                </div>

                {platteError && (
                  <p className="text-red-400 text-sm text-center mt-3">{platteError}</p>
                )}

                <p className="text-white/30 text-xs text-center mt-3">
                  Platte County voters must vote at their assigned precinct polling place on Election Day.
                </p>
              </motion.div>
            ) : (
              <motion.div key="platte-result" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 rounded-full bg-green-500/30 flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <span className="text-green-300 text-xs font-semibold uppercase tracking-wider">Polling Place Found</span>
                </div>
                <div className="space-y-1 mb-3">
                  <p className="text-white font-bold text-lg">{platteResult.name}</p>
                  <p className="text-white/60 text-sm">{platteFullAddress}</p>
                </div>
                <div className="flex gap-2">
                  <a
                    href={getDirectionsUrl(platteFullAddress)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg bg-coral text-white text-sm font-semibold hover:bg-coral/90 transition-colors min-h-[44px]"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Get Directions
                  </a>
                  <button
                    onClick={() => { setPlatteResult(null); setPlatteAddress(''); platteAcRef.current = false; }}
                    className="px-4 py-2.5 rounded-lg bg-white/10 text-white/60 text-sm font-medium hover:bg-white/20 transition-colors min-h-[44px]"
                  >
                    New Search
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Candidates & issues PDF card */}
        <div className="rounded-xl bg-white/5 border border-white/10 p-4 space-y-3">
          <h3 className="text-white/60 font-semibold text-xs uppercase tracking-wider">Ballot Info</h3>
          <button
            onClick={() => setShowPdf(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/10 text-white/70 font-semibold text-sm hover:bg-white/20 transition-all min-h-[44px]"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            View Candidates &amp; Issues
          </button>
          <div className="text-center">
            <a
              href="https://voteroutreach.sos.mo.gov/portal/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-white/40 text-xs hover:text-white/60 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Or look up your registration on the MO Secretary of State site
            </a>
          </div>
        </div>

        {/* County contact info */}
        <CountyContactCard board={board} />

        {/* Fullscreen PDF viewer */}
        {showPdf && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col" onClick={() => setShowPdf(false)}>
            <div className="flex items-center justify-between p-4 bg-navy/90">
              <h3 className="text-white font-semibold text-sm">Platte County - Candidates &amp; Issues</h3>
              <button onClick={() => setShowPdf(false)} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1" onClick={(e) => e.stopPropagation()}>
              <iframe src="/ballots/platte/candidates-and-questions.pdf" className="w-full h-full" title="Platte County Candidates and Issues" />
            </div>
          </div>
        )}
      </div>
    );
  }

  // --- CASS COUNTY ---
  if (county === 'Cass') {
    return (
      <div className="space-y-4">
        {/* Cass County card */}
        <div className="rounded-2xl bg-white/5 border border-white/10 p-5 space-y-4">
          <div className="text-center">
            <div className="w-14 h-14 rounded-full bg-coral/20 flex items-center justify-center mx-auto mb-3">
              <svg className="w-7 h-7 text-coral" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-white font-bold text-lg mb-1">Cass County Ballot Info</h3>
            <p className="text-white/50 text-sm">
              Cass County voters must vote at their assigned precinct polling place on Election Day.
            </p>
          </div>

          {/* E-tax note */}
          <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-3 flex items-start gap-2.5">
            <svg className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-amber-200/80 text-sm">
              The KC earnings tax is not on Cass County ballots.
            </p>
          </div>

          <button
            onClick={() => setShowPdf(true)}
            className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-coral text-white font-semibold text-base hover:bg-coral/90 transition-all min-h-[48px]"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            View Sample Ballot
          </button>

          <a
            href={lookup.lookupUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/10 text-white/70 font-semibold text-sm hover:bg-white/20 transition-all min-h-[44px]"
          >
            Cass County Elections
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>

        {/* County contact info */}
        <CountyContactCard board={board} />

        {/* Fullscreen PDF viewer */}
        {showPdf && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col" onClick={() => setShowPdf(false)}>
            <div className="flex items-center justify-between p-4 bg-navy/90">
              <h3 className="text-white font-semibold text-sm">Cass County - Sample Ballot</h3>
              <button onClick={() => setShowPdf(false)} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1" onClick={(e) => e.stopPropagation()}>
              <iframe src="/ballots/cass/sample-ballot.pdf" className="w-full h-full" title="Cass County Sample Ballot" />
            </div>
          </div>
        )}
      </div>
    );
  }

  // --- FALLBACK (shouldn't happen, but just in case) ---
  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-white/5 border border-white/10 p-5 space-y-4">
        <div className="text-center">
          <div className="w-14 h-14 rounded-full bg-coral/20 flex items-center justify-center mx-auto mb-3">
            <svg className="w-7 h-7 text-coral" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 className="text-white font-bold text-lg mb-1">Find Your Assigned Polling Place</h3>
          <p className="text-white/50 text-sm">
            {county} County assigns voters to a specific polling location based on your home address.
            Use the official {county} County lookup tool to find yours.
          </p>
        </div>
        <a
          href={lookup.lookupUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-coral text-white font-semibold text-base hover:bg-coral/90 transition-all min-h-[48px]"
        >
          {('lookupLabel' in lookup ? (lookup as Record<string, string>).lookupLabel : null) ?? 'Find Your Polling Place'}
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
        <div className="text-center">
          <a
            href="https://voteroutreach.sos.mo.gov/portal/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-white/40 text-xs hover:text-white/60 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Or look up your registration on the MO Secretary of State site
          </a>
        </div>
      </div>
      <CountyContactCard board={board} />
    </div>
  );
}

// Shared county contact info card
function CountyContactCard({ board }: { board: { name: string; phone: string; address: string } }) {
  return (
    <div className="rounded-xl bg-white/5 border border-white/10 p-4 space-y-2">
      <h3 className="text-white/60 font-semibold text-xs uppercase tracking-wider">{board.name}</h3>
      <div className="flex items-center gap-2 text-white/50 text-sm">
        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
        <a href={`tel:${board.phone.replace(/\D/g, '')}`} className="hover:text-white transition-colors">{board.phone}</a>
      </div>
      <div className="flex items-center gap-2 text-white/50 text-sm">
        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        </svg>
        <span>{board.address}</span>
      </div>
    </div>
  );
}
