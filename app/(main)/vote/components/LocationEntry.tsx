'use client';

import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { initAutocomplete, geocodeAddress, type GeocodeResult } from '@/lib/geocoding';

interface Props {
  onLocationFound: (result: GeocodeResult) => void;
  onUseMyLocation: () => void;
  isLocating: boolean;
  locationError: string | null;
  isOutsideKC: boolean;
}

export default function LocationEntry({
  onLocationFound, onUseMyLocation, isLocating, locationError, isOutsideKC,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [addressInput, setAddressInput] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const acInitRef = useRef(false);

  useEffect(() => {
    if (!inputRef.current || acInitRef.current) return;
    acInitRef.current = true;
    initAutocomplete(inputRef.current, (result) => {
      setAddressInput(result.formattedAddress);
      onLocationFound(result);
    }).catch(() => {});
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
    <div className="space-y-3">
      <button
        onClick={onUseMyLocation}
        disabled={isLocating}
        className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl bg-coral text-white font-semibold text-base hover:bg-coral/90 disabled:opacity-60 transition-all min-h-[48px]"
      >
        {isLocating ? (
          <>
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Finding your location...
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Use My Location
          </>
        )}
      </button>

      {locationError && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-sm text-center">
          {locationError}
        </motion.p>
      )}

      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-white/10" />
        <span className="text-white/30 text-xs">or enter your address</span>
        <div className="flex-1 h-px bg-white/10" />
      </div>

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

      {isOutsideKC && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl bg-amber-500/10 border border-amber-500/30 px-4 py-3 text-center"
        >
          <p className="text-amber-300 text-sm">
            You don&apos;t appear to be in Kansas City, but here are all voting locations.
          </p>
        </motion.div>
      )}
    </div>
  );
}
