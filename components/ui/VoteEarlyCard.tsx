'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const GOOGLE_API_KEY = 'AIzaSyChXG4uzQaS5lYmEH9nWmRI3_YRLwaqV0I';

// Extend window for Google Maps
declare global {
  interface Window {
    google?: {
      maps: {
        Geocoder: new () => {
          geocode: (
            request: { address: string },
            callback: (
              results: Array<{
                formatted_address: string;
                address_components: Array<{
                  long_name: string;
                  types: string[];
                }>;
              }> | null,
              status: string
            ) => void
          ) => void;
        };
      };
    };
  }
}

interface VoteEarlyCardProps {
  title: string;
  description: string;
  icon?: string;
  buttonText?: string;
  className?: string;
}

type County = 'Jackson' | 'Clay' | 'Platte' | 'Cass';

const COUNTY_URLS: Record<County, string> = {
  Jackson: 'https://www.kceb.org',
  Clay: 'https://www.voteclaycountymo.gov',
  Platte: 'https://www.plattecountymovotes.gov',
  Cass: 'https://casscounty.com/2355/Absentee-Information',
};



const VoteEarlyCard: React.FC<VoteEarlyCardProps> = ({
  className,
  title,
  description,
  icon,
  buttonText = 'Learn How'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCounty, setSelectedCounty] = useState<County | null>(null);
  const [showAddressLookup, setShowAddressLookup] = useState(false);
  const [addressInput, setAddressInput] = useState('');
  const [isLooking, setIsLooking] = useState(false);
  const [lookupResult, setLookupResult] = useState<{ county: County; address: string } | null>(null);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const resetModal = () => {
    setSelectedCounty(null);
    setShowAddressLookup(false);
    setAddressInput('');
    setLookupResult(null);
    setLookupError(null);
  };

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(resetModal, 300);
  };

  // Load Google Maps script
  const loadGoogleMaps = useCallback(() => {
    return new Promise<void>((resolve, reject) => {
      if (window.google?.maps?.Geocoder) {
        resolve();
        return;
      }

      // Check if script is already loading
      const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
      if (existingScript) {
        // Script tag exists - check if it's already loaded
        if (window.google?.maps?.Geocoder) {
          console.log('[VoteEarlyCard] Google Maps already loaded');
          resolve();
        } else {
          // Script still loading, wait for it
          console.log('[VoteEarlyCard] Waiting for existing Google Maps script to load');
          existingScript.addEventListener('load', () => resolve());
        }
        return;
      }

      console.log('[VoteEarlyCard] Loading Google Maps script');
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}`;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Google Maps'));
      document.head.appendChild(script);
    });
  }, []);

  const lookupCounty = async () => {
    if (!addressInput.trim()) return;

    setIsLooking(true);
    setLookupError(null);
    setLookupResult(null);

    // Add timeout protection - 10 seconds
    const timeoutId = setTimeout(() => {
      console.log('[VoteEarlyCard] Lookup timed out');
      setLookupError("Address lookup is taking too long. Please try again or select your county above.");
      setIsLooking(false);
    }, 10000);

    try {
      // Load Google Maps API
      console.log('[VoteEarlyCard] Starting Google Maps load');
      await loadGoogleMaps();
      console.log('[VoteEarlyCard] Google Maps loaded, creating geocoder');

      // Build the address query
      const isZipOnly = /^\d{5}(-\d{4})?$/.test(addressInput.trim());
      const query = isZipOnly
        ? `${addressInput.trim()}, MO`
        : `${addressInput.trim()}, Kansas City, MO`;

      console.log('[VoteEarlyCard] Looking up address:', query);

      const geocoder = new window.google!.maps.Geocoder();

      geocoder.geocode({ address: query }, (results, status) => {
        clearTimeout(timeoutId);
        console.log('[VoteEarlyCard] Geocoding response:', status, results);

        if (status === 'OK' && results && results.length > 0) {
          const result = results[0];
          console.log('[VoteEarlyCard] Address components:', result.address_components);

          const countyComponent = result.address_components.find(
            (c) => c.types.includes('administrative_area_level_2')
          );

          console.log('[VoteEarlyCard] County component:', countyComponent);

          if (countyComponent) {
            const countyName = countyComponent.long_name.replace(' County', '');
            console.log('[VoteEarlyCard] County name:', countyName);

            if (['Jackson', 'Clay', 'Platte', 'Cass'].includes(countyName)) {
              setLookupResult({
                county: countyName as County,
                address: result.formatted_address,
              });
            } else {
              setLookupError(`That address is in ${countyName} County, which is outside Kansas City's boundaries.`);
            }
          } else {
            setLookupError("Couldn't determine the county for that address. Try entering your zip code.");
          }
        } else {
          console.log('[VoteEarlyCard] Geocoding failed with status:', status);
          setLookupError("Couldn't find that address. Please check and try again.");
        }

        setIsLooking(false);
      });
    } catch (err) {
      clearTimeout(timeoutId);
      console.error('[VoteEarlyCard] Geocoding error:', err);
      setLookupError("Something went wrong. Please try again or select your county above.");
      setIsLooking(false);
    }
  };

  const CountyButton: React.FC<{ county: County }> = ({ county }) => (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => setSelectedCounty(county)}
      className="group relative p-4 rounded-xl overflow-hidden bg-navy hover:bg-coral transition-all duration-200"
    >

      {/* Content */}
      <div className="relative flex items-center justify-center gap-2">
        <span className="text-white font-semibold text-lg">{county} County</span>
        <svg
          className="w-4 h-4 text-white/80 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
        </svg>
      </div>
    </motion.button>
  );

  return (
    <>
      {/* Card */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className={cn(
          'group relative flex h-56 w-full flex-col justify-between overflow-hidden text-left',
          'rounded-xl p-6 bg-white/10 backdrop-blur-sm border border-white/20',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2',
          className
        )}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.03, y: -5 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="z-10">
          <h3 className="mb-2 text-xl font-semibold text-white">{title}</h3>
          <p className="max-w-[75%] text-sm text-white/70">{description}</p>
        </div>

        <div className="z-10">
          <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-coral text-white group-hover:bg-coral/90 transition-all">
            {buttonText}
            <svg
              className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>

        {icon && (
          <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4">
            <span className="text-[7rem] opacity-20 group-hover:opacity-40 transition-opacity duration-300 select-none">
              {icon}
            </span>
          </div>
        )}
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={handleClose}
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-navy/80 backdrop-blur-sm"
            />

            {/* Modal Content */}
            <motion.div
              ref={modalRef}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-br from-navy to-navy/90 p-6 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: 'spring' }}
                  className="text-5xl mb-3"
                >
                  🗳️
                </motion.div>
                <h2 className="text-2xl font-bold text-white">Vote Early</h2>
                <p className="text-white/70 text-sm mt-1">
                  Kansas City spans 4 counties. Select yours to find voting info.
                </p>
              </div>

              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Content */}
              <div className="p-6">
                <AnimatePresence mode="wait">
                  {!selectedCounty && !lookupResult ? (
                    <motion.div
                      key="select"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {/* County Selection */}
                      <div className="grid grid-cols-2 gap-3 mb-6">
                        <CountyButton county="Jackson" />
                        <CountyButton county="Clay" />
                        <CountyButton county="Platte" />
                        <CountyButton county="Cass" />
                      </div>

                      {/* Divider */}
                      <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-gray-200" />
                        </div>
                        <div className="relative flex justify-center">
                          <span className="bg-white px-3 text-sm text-gray-500">or</span>
                        </div>
                      </div>

                      {/* Address Lookup */}
                      {!showAddressLookup ? (
                        <button
                          onClick={() => setShowAddressLookup(true)}
                          className="w-full text-center text-sm text-navy/70 hover:text-navy transition-colors"
                        >
                          Not sure which county? <span className="underline font-medium">Find your county</span>
                        </button>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="space-y-3"
                        >
                          <p className="text-sm text-gray-600 text-center">
                            Enter your address or zip code
                          </p>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={addressInput}
                              onChange={(e) => setAddressInput(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && lookupCounty()}
                              placeholder="e.g. 1234 Main St or 64108"
                              className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 focus:border-coral focus:ring-2 focus:ring-coral/20 outline-none text-sm"
                            />
                            <button
                              onClick={lookupCounty}
                              disabled={isLooking || !addressInput.trim()}
                              className="px-4 py-2.5 bg-coral text-white rounded-lg font-medium text-sm hover:bg-coral/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                              {isLooking ? (
                                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                              ) : (
                                'Find'
                              )}
                            </button>
                          </div>
                          {lookupError && (
                            <motion.p
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="text-sm text-red-500 text-center"
                            >
                              {lookupError}
                            </motion.p>
                          )}
                        </motion.div>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="result"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-center"
                    >
                      {/* Result */}
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', delay: 0.1 }}
                        className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl text-white bg-coral shadow-lg"
                      >
                        ✓
                      </motion.div>

                      <h3 className="text-xl font-bold text-navy mb-1">
                        {selectedCounty || lookupResult!.county} County
                      </h3>

                      {lookupResult && (
                        <p className="text-sm text-gray-500 mb-4">
                          {lookupResult.address}
                        </p>
                      )}

                      <p className="text-gray-600 mb-6">
                        Visit your county&apos;s election board to learn about early voting, absentee ballots, and polling locations.
                      </p>

                      <a
                        href={COUNTY_URLS[selectedCounty || lookupResult!.county]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white font-semibold bg-coral shadow-lg hover:shadow-xl hover:bg-coral/90 transition-all"
                      >
                        Visit Election Board
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>

                      <button
                        onClick={resetModal}
                        className="block w-full mt-4 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        ← Choose a different county
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export { VoteEarlyCard };
