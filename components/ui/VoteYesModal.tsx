'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { downloadCalendarEvent } from '@/lib/calendar';

type County = 'Jackson' | 'Clay' | 'Platte' | 'Cass';

const COUNTY_URLS: Record<County, string> = {
  Jackson: 'https://www.kceb.org',
  Clay: 'https://www.voteclaycountymo.gov',
  Platte: 'https://www.plattecountymovotes.gov',
  Cass: 'https://casscounty.com/2355/Absentee-Information',
};

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

interface VoteYesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ModalView = 'main' | 'findPolling' | 'countyResult';

const VoteYesModal: React.FC<VoteYesModalProps> = ({ isOpen, onClose }) => {
  const [view, setView] = useState<ModalView>('main');
  const [selectedCounty, setSelectedCounty] = useState<County | null>(null);
  const [showAddressLookup, setShowAddressLookup] = useState(false);
  const [addressInput, setAddressInput] = useState('');
  const [isLooking, setIsLooking] = useState(false);
  const [lookupResult, setLookupResult] = useState<{ county: County; address: string } | null>(null);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [calendarDownloaded, setCalendarDownloaded] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const resetModal = () => {
    setView('main');
    setSelectedCounty(null);
    setShowAddressLookup(false);
    setAddressInput('');
    setLookupResult(null);
    setLookupError(null);
    setCalendarDownloaded(false);
  };

  const handleClose = () => {
    onClose();
    setTimeout(resetModal, 300);
  };

  const handleCalendarDownload = () => {
    downloadCalendarEvent();
    setCalendarDownloaded(true);
    setTimeout(() => setCalendarDownloaded(false), 2000);
  };

  // Load Google Maps script
  const loadGoogleMaps = useCallback(() => {
    return new Promise<void>((resolve, reject) => {
      if (window.google?.maps?.Geocoder) {
        resolve();
        return;
      }

      const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
      if (existingScript) {
        if (window.google?.maps?.Geocoder) {
          resolve();
        } else {
          existingScript.addEventListener('load', () => resolve());
        }
        return;
      }

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

    const timeoutId = setTimeout(() => {
      setLookupError("Address lookup is taking too long. Please try again or select your county above.");
      setIsLooking(false);
    }, 10000);

    try {
      await loadGoogleMaps();

      const isZipOnly = /^\d{5}(-\d{4})?$/.test(addressInput.trim());
      const query = isZipOnly
        ? `${addressInput.trim()}, MO`
        : `${addressInput.trim()}, Kansas City, MO`;

      const geocoder = new window.google!.maps.Geocoder();

      geocoder.geocode({ address: query }, (results, status) => {
        clearTimeout(timeoutId);

        if (status === 'OK' && results && results.length > 0) {
          const result = results[0];
          const countyComponent = result.address_components.find(
            (c) => c.types.includes('administrative_area_level_2')
          );

          if (countyComponent) {
            const countyName = countyComponent.long_name.replace(' County', '');

            if (['Jackson', 'Clay', 'Platte', 'Cass'].includes(countyName)) {
              setLookupResult({
                county: countyName as County,
                address: result.formatted_address,
              });
              setView('countyResult');
            } else {
              setLookupError(`That address is in ${countyName} County, which is outside Kansas City's boundaries.`);
            }
          } else {
            setLookupError("Couldn't determine the county for that address. Try entering your zip code.");
          }
        } else {
          setLookupError("Couldn't find that address. Please check and try again.");
        }

        setIsLooking(false);
      });
    } catch (err) {
      clearTimeout(timeoutId);
      setLookupError("Something went wrong. Please try again or select your county above.");
      setIsLooking(false);
    }
  };

  const handleCountySelect = (county: County) => {
    setSelectedCounty(county);
    setView('countyResult');
  };

  const CountyButton: React.FC<{ county: County }> = ({ county }) => (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => handleCountySelect(county)}
      className="group relative p-4 rounded-xl overflow-hidden bg-navy hover:bg-coral transition-all duration-200"
    >
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
              <h2 className="text-2xl font-bold text-white">Early Voting Begins March 24th</h2>
              <div className="mt-3 inline-block bg-coral/20 rounded-lg px-4 py-2">
                <p className="text-white/90 text-sm">Last Day to Register to Vote</p>
                <p className="text-coral font-bold text-xl">March 11</p>
              </div>
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
                {view === 'main' && (
                  <motion.div
                    key="main"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-3"
                  >
                    {/* Check Registration */}
                    <a
                      href="https://voteroutreach.sos.mo.gov/portal/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors group"
                    >
                      <div className="w-12 h-12 bg-coral/10 rounded-full flex items-center justify-center text-2xl">
                        📋
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-semibold text-navy">Check Your Registration</h3>
                        <p className="text-sm text-gray-600">Verify you&apos;re registered to vote</p>
                      </div>
                      <svg className="w-5 h-5 text-gray-400 group-hover:text-coral transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>

                    {/* Remind to Vote */}
                    <button
                      onClick={handleCalendarDownload}
                      className="flex items-center gap-4 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors group w-full text-left"
                    >
                      <div className="w-12 h-12 bg-sky/10 rounded-full flex items-center justify-center text-2xl">
                        {calendarDownloaded ? '✓' : '📅'}
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-semibold text-navy">
                          {calendarDownloaded ? 'Added to Calendar!' : 'Remind Me to Vote'}
                        </h3>
                        <p className="text-sm text-gray-600">Add Election Day to your calendar</p>
                      </div>
                      <svg className="w-5 h-5 text-gray-400 group-hover:text-sky transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </button>

                    {/* Find Polling Location */}
                    <button
                      onClick={() => setView('findPolling')}
                      className="flex items-center gap-4 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors group w-full text-left"
                    >
                      <div className="w-12 h-12 bg-navy/10 rounded-full flex items-center justify-center text-2xl">
                        📍
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-semibold text-navy">Find My Polling Location</h3>
                        <p className="text-sm text-gray-600">Locate where to vote in your county</p>
                      </div>
                      <svg className="w-5 h-5 text-gray-400 group-hover:text-navy transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </motion.div>
                )}

                {view === 'findPolling' && (
                  <motion.div
                    key="findPolling"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <button
                      onClick={() => setView('main')}
                      className="flex items-center gap-1 text-sm text-gray-500 hover:text-navy mb-4 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      Back
                    </button>

                    <p className="text-center text-gray-600 mb-4">
                      Kansas City spans 4 counties. Select yours to find voting info.
                    </p>

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
                )}

                {view === 'countyResult' && (
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
                      {selectedCounty || lookupResult?.county} County
                    </h3>

                    {lookupResult && (
                      <p className="text-sm text-gray-500 mb-4">
                        {lookupResult.address}
                      </p>
                    )}

                    <p className="text-gray-600 mb-6">
                      Visit your county&apos;s election board to find your polling location and voting info.
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
                      onClick={() => {
                        setSelectedCounty(null);
                        setLookupResult(null);
                        setView('findPolling');
                      }}
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
  );
};

export { VoteYesModal };
