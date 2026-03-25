'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { initAutocomplete, geocodeAddress, type GeocodeResult } from '@/lib/geocoding';
import type { County } from '@/lib/voting-utils';

interface Props {
  onCountySelect: (county: County) => void;
  onLocationFound: (result: GeocodeResult) => void;
}

const COUNTIES: { name: County; description: string }[] = [
  { name: 'Jackson', description: 'Downtown, Midtown, South KC, East KC' },
  { name: 'Clay', description: 'Northland, Liberty, Gladstone' },
  { name: 'Platte', description: 'KCI, Parkville, Platte City' },
  { name: 'Cass', description: 'Belton, Raymore, Harrisonville' },
];

export default function LocationEntry({ onCountySelect, onLocationFound }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [showAddressLookup, setShowAddressLookup] = useState(false);
  const [addressInput, setAddressInput] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const acInitRef = useRef(false);

  useEffect(() => {
    if (!showAddressLookup || !inputRef.current || acInitRef.current) return;
    acInitRef.current = true;
    initAutocomplete(inputRef.current, (result) => {
      setAddressInput(result.formattedAddress);
      onLocationFound(result);
    }).catch(() => {});
  }, [showAddressLookup]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleManualSearch = async () => {
    if (!addressInput.trim()) return;
    setIsSearching(true);
    setSearchError(null);
    try {
      const result = await geocodeAddress(addressInput.trim());
      if (result) {
        onLocationFound(result);
      } else {
        setSearchError("Couldn't find that address. Please check and try again.");
      }
    } catch {
      setSearchError('Something went wrong. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-5">
      <p className="text-white/70 text-center text-sm">
        Kansas City spans 4 counties. Select yours to find voting locations.
      </p>

      {/* 2x2 County Grid */}
      <div className="grid grid-cols-2 gap-3">
        {COUNTIES.map(({ name, description }) => (
          <button
            key={name}
            onClick={() => onCountySelect(name)}
            className="group relative p-4 rounded-xl overflow-hidden bg-navy border-2 border-white/10 hover:border-coral hover:bg-coral transition-all duration-200 text-left min-h-[80px]"
          >
            <h3 className="text-white font-bold text-base group-hover:text-white">
              {name}
            </h3>
            <p className="text-white/40 text-xs mt-0.5 group-hover:text-white/70">
              {description}
            </p>
            <div className="absolute top-3 right-3 text-white/20 group-hover:text-white/60 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        ))}
      </div>

      {/* Not sure which county? */}
      <div>
        <button
          onClick={() => setShowAddressLookup(!showAddressLookup)}
          className="w-full flex items-center justify-center gap-2 text-white/50 text-sm hover:text-white/70 transition-colors py-2"
        >
          <svg className={`w-4 h-4 transition-transform ${showAddressLookup ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
          Not sure which county?
        </button>

        <AnimatePresence>
          {showAddressLookup && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-2 space-y-2">
                <p className="text-white/40 text-xs text-center">Enter your address or zip code to detect your county.</p>
                <div className="flex gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={addressInput}
                    onChange={(e) => setAddressInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleManualSearch()}
                    placeholder="Address or zip code"
                    className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/30 focus:border-coral focus:ring-2 focus:ring-coral/20 outline-none text-base min-h-[48px]"
                  />
                  <button
                    onClick={handleManualSearch}
                    disabled={isSearching || !addressInput.trim()}
                    className="px-4 rounded-xl bg-white/10 border border-white/20 text-white/70 hover:bg-white/20 disabled:opacity-40 transition-all min-h-[48px]"
                  >
                    {isSearching ? (
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    )}
                  </button>
                </div>
                {searchError && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-sm text-center">
                    {searchError}
                  </motion.p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Voter registration link */}
      <div className="text-center">
        <a
          href="https://voteroutreach.sos.mo.gov/portal/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-white/40 text-xs hover:text-white/60 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          Check your voter registration
        </a>
      </div>
    </div>
  );
}
