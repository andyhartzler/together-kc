'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { downloadCalendarEvent } from '@/lib/calendar';
import EndorsementForm from '@/components/forms/EndorsementForm';

// Google Maps API for county lookup
const GOOGLE_API_KEY = 'AIzaSyChXG4uzQaS5lYmEH9nWmRI3_YRLwaqV0I';

type County = 'Jackson' | 'Clay' | 'Platte' | 'Cass';

const COUNTY_URLS: Record<County, string> = {
  Jackson: 'https://www.kceb.org',
  Clay: 'https://www.voteclaycountymo.gov',
  Platte: 'https://www.plattecountymovotes.gov',
  Cass: 'https://casscounty.com/2355/Absentee-Information',
};

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

const SOCIAL_LINKS = [
  { name: 'Facebook', href: 'https://www.facebook.com/TogetherKC/', icon: '/images/social/facebook.png' },
  { name: 'Instagram', href: 'https://www.instagram.com/togetherkcmo/', icon: '/images/social/instagram.png' },
  { name: 'TikTok', href: 'https://www.tiktok.com/@togetherkcmo', icon: '/images/social/tiktok.png' },
  { name: 'X', href: 'https://x.com/TogetherKCMO', icon: '/images/social/x.png' },
  { name: 'Threads', href: 'https://www.threads.com/@togetherkcmo', icon: '/images/social/threads.png' },
];

// Floating particles component
function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-white/10"
          initial={{
            x: typeof window !== 'undefined' ? Math.random() * 400 : 200,
            y: typeof window !== 'undefined' ? Math.random() * 800 : 400,
            opacity: 0,
          }}
          animate={{
            y: [null, -150],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: 12 + Math.random() * 8,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: 'linear',
          }}
          style={{
            left: `${10 + Math.random() * 80}%`,
          }}
        />
      ))}
    </div>
  );
}

// Gradient background with orbs
function GradientBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Animated gradient orbs */}
      <motion.div
        className="absolute -top-32 -left-32 w-64 h-64 rounded-full bg-coral/20 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 20, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute -bottom-32 -right-32 w-64 h-64 rounded-full bg-sky/20 blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          x: [0, -20, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute top-1/3 right-0 w-48 h-48 rounded-full bg-coral/10 blur-3xl"
        animate={{
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
}

// Premium link button component - simplified animations
function LinkButton({
  children,
  href,
  onClick,
  icon,
  description,
  index,
  variant = 'default',
  external = false,
}: {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  icon: React.ReactNode;
  description?: string;
  index: number;
  variant?: 'default' | 'primary' | 'glass';
  external?: boolean;
}) {
  const baseClasses = "relative w-full p-4 rounded-2xl flex items-center gap-4 transition-all duration-200 overflow-hidden group active:scale-[0.98]";

  const variantClasses = {
    default: "bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15 active:bg-white/20",
    primary: "bg-gradient-to-r from-coral to-coral/80 border border-coral/50 shadow-lg shadow-coral/25 hover:shadow-coral/40 active:shadow-coral/20",
    glass: "bg-white/5 backdrop-blur-lg border border-white/10 hover:bg-white/10",
  };

  const content = (
    <>
      {/* Icon container */}
      <div className="relative z-10 w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
        {icon}
      </div>

      {/* Text content */}
      <div className="relative z-10 flex-grow min-w-0">
        <span className="text-white font-semibold text-lg block">{children}</span>
        {description && (
          <span className="text-white/60 text-sm block truncate">{description}</span>
        )}
      </div>

      {/* Arrow */}
      <svg
        className="relative z-10 w-5 h-5 text-white/60 flex-shrink-0 transition-transform duration-200 group-hover:translate-x-1"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </>
  );

  const animationProps = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3, delay: index * 0.05 },
  };

  if (onClick) {
    return (
      <motion.button
        {...animationProps}
        onClick={onClick}
        className={`${baseClasses} ${variantClasses[variant]} text-left`}
      >
        {content}
      </motion.button>
    );
  }

  if (external) {
    return (
      <motion.a
        {...animationProps}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseClasses} ${variantClasses[variant]}`}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <Link href={href || '/'} className="block">
      <motion.div
        {...animationProps}
        className={`${baseClasses} ${variantClasses[variant]}`}
      >
        {content}
      </motion.div>
    </Link>
  );
}

// Social icon button - simplified
function SocialButton({ social, index }: { social: typeof SOCIAL_LINKS[0]; index: number }) {
  return (
    <motion.a
      href={social.href}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2, delay: 0.3 + index * 0.05 }}
      className="relative group"
      aria-label={`Follow us on ${social.name}`}
    >
      {/* Icon container */}
      <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center transition-all duration-200 group-hover:bg-white/20 group-hover:scale-110 group-active:scale-95">
        <Image
          src={social.icon}
          alt={social.name}
          width={24}
          height={24}
          className="w-6 h-6 object-contain"
        />
      </div>
    </motion.a>
  );
}

// Modal component - simplified animations
function Modal({
  isOpen,
  onClose,
  title,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full sm:max-w-md bg-gradient-to-b from-navy to-navy/95 sm:rounded-2xl rounded-t-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-navy/95 backdrop-blur-md p-4 border-b border-white/10 flex items-center justify-between z-10">
              <h2 className="text-xl font-bold text-white">{title}</h2>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-4">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function SocialLandingPage() {
  const [activeModal, setActiveModal] = useState<'polling' | 'endorse' | null>(null);
  const [calendarAdded, setCalendarAdded] = useState(false);
  const [selectedCounty, setSelectedCounty] = useState<County | null>(null);
  const [showAddressLookup, setShowAddressLookup] = useState(false);
  const [addressInput, setAddressInput] = useState('');
  const [isLooking, setIsLooking] = useState(false);
  const [lookupResult, setLookupResult] = useState<{ county: County; address: string } | null>(null);
  const [lookupError, setLookupError] = useState<string | null>(null);

  const handleCalendarDownload = () => {
    downloadCalendarEvent();
    setCalendarAdded(true);
    setTimeout(() => setCalendarAdded(false), 3000);
  };

  const resetPollingState = () => {
    setSelectedCounty(null);
    setShowAddressLookup(false);
    setAddressInput('');
    setLookupResult(null);
    setLookupError(null);
  };

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

    try {
      await loadGoogleMaps();

      const isZipOnly = /^\d{5}(-\d{4})?$/.test(addressInput.trim());
      const query = isZipOnly
        ? `${addressInput.trim()}, MO`
        : `${addressInput.trim()}, Kansas City, MO`;

      const geocoder = new window.google!.maps.Geocoder();

      geocoder.geocode({ address: query }, (results, status) => {
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
              setSelectedCounty(countyName as County);
            } else {
              setLookupError(`That address is in ${countyName} County, which is outside Kansas City.`);
            }
          } else {
            setLookupError("Couldn't determine the county. Try entering your zip code.");
          }
        } else {
          setLookupError("Couldn't find that address. Please try again.");
        }

        setIsLooking(false);
      });
    } catch {
      setLookupError("Something went wrong. Please try again.");
      setIsLooking(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy relative overflow-hidden">
      {/* Background effects */}
      <GradientBackground />
      <FloatingParticles />

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col px-4 py-8 max-w-md mx-auto">
        {/* Header / Logo */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-6"
        >
          {/* Logo */}
          <div className="relative inline-block mb-3">
            <Image
              src="/images/renew-kc-logo-white.png"
              alt="Together KC"
              width={200}
              height={70}
              className="h-14 w-auto object-contain"
              priority
            />
          </div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-white/90 text-lg font-semibold"
          >
            Vote YES on April 7
          </motion.p>
        </motion.div>

        {/* Social Links Row */}
        <div className="flex justify-center gap-3 mb-6">
          {SOCIAL_LINKS.map((social, index) => (
            <SocialButton key={social.name} social={social} index={index} />
          ))}
        </div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.5, duration: 0.3 }}
          className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-6"
        />

        {/* Action Links */}
        <div className="space-y-3 flex-grow">
          {/* Visit Website - NOW FIRST */}
          <LinkButton
            href="/"
            icon={<span className="text-2xl">🌐</span>}
            description="Learn more about the renewal"
            index={0}
            variant="glass"
          >
            Visit Website
          </LinkButton>

          {/* Check Registration */}
          <LinkButton
            href="https://voteroutreach.sos.mo.gov/portal/"
            external
            icon={<span className="text-2xl">📋</span>}
            description="Verify you're registered to vote"
            index={1}
          >
            Check Your Registration
          </LinkButton>

          {/* Add to Calendar */}
          <LinkButton
            onClick={handleCalendarDownload}
            icon={<span className="text-2xl">{calendarAdded ? '✓' : '📅'}</span>}
            description={calendarAdded ? 'Added to your calendar!' : 'Save Election Day'}
            index={2}
            variant={calendarAdded ? 'primary' : 'default'}
          >
            {calendarAdded ? 'Calendar Reminder Set!' : 'Remind Me to Vote'}
          </LinkButton>

          {/* Find Polling Location */}
          <LinkButton
            onClick={() => {
              resetPollingState();
              setActiveModal('polling');
            }}
            icon={<span className="text-2xl">📍</span>}
            description="Locate where to vote in your county"
            index={3}
          >
            Find My Polling Location
          </LinkButton>

          {/* Add Endorsement */}
          <LinkButton
            onClick={() => setActiveModal('endorse')}
            icon={<span className="text-2xl">❤️</span>}
            description="Join thousands of supporters"
            index={4}
            variant="primary"
          >
            Add Your Endorsement
          </LinkButton>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-center"
        >
          <p className="text-white/40 text-xs leading-relaxed">
            Paid for by Together KC, Dan Kopp, Treasurer.
            <br />
            Not authorized by any candidate or candidate committee.
          </p>
        </motion.div>
      </div>

      {/* Polling Location Modal */}
      <Modal
        isOpen={activeModal === 'polling'}
        onClose={() => setActiveModal(null)}
        title="Find My Polling Location"
      >
        <AnimatePresence mode="wait">
          {!selectedCounty ? (
            <motion.div
              key="select"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <p className="text-white/70 text-center mb-4">
                Kansas City spans 4 counties.<br />
                Select yours to find voting info.
              </p>

              <div className="grid grid-cols-2 gap-3 mb-6">
                {(['Jackson', 'Clay', 'Platte', 'Cass'] as County[]).map((county) => (
                  <button
                    key={county}
                    onClick={() => setSelectedCounty(county)}
                    className="p-4 rounded-xl bg-white/10 hover:bg-coral text-white font-semibold transition-colors active:scale-95"
                  >
                    {county} County
                  </button>
                ))}
              </div>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/20" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-navy px-3 text-sm text-white/50">or</span>
                </div>
              </div>

              {!showAddressLookup ? (
                <button
                  onClick={() => setShowAddressLookup(true)}
                  className="w-full text-center text-sm text-white/60 hover:text-white transition-colors"
                >
                  Not sure? <span className="underline">Look up by address</span>
                </button>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-3"
                >
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={addressInput}
                      onChange={(e) => setAddressInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && lookupCounty()}
                      placeholder="Enter address or zip code"
                      className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:border-coral focus:outline-none"
                    />
                    <button
                      onClick={lookupCounty}
                      disabled={isLooking || !addressInput.trim()}
                      className="px-4 py-3 bg-coral text-white rounded-xl font-medium disabled:opacity-50 transition-all"
                    >
                      {isLooking ? '...' : 'Find'}
                    </button>
                  </div>
                  {lookupError && (
                    <p className="text-sm text-coral text-center">{lookupError}</p>
                  )}
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl text-white bg-coral">
                ✓
              </div>

              <h3 className="text-xl font-bold text-white mb-1">
                {selectedCounty} County
              </h3>

              {lookupResult && (
                <p className="text-sm text-white/60 mb-4">{lookupResult.address}</p>
              )}

              <p className="text-white/70 mb-6">
                Visit your county&apos;s election board for polling locations and voting info.
              </p>

              <a
                href={COUNTY_URLS[selectedCounty]}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white font-semibold bg-coral hover:bg-coral/90 transition-colors"
              >
                Visit Election Board
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>

              <button
                onClick={resetPollingState}
                className="block w-full mt-4 text-sm text-white/50 hover:text-white transition-colors"
              >
                ← Choose a different county
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </Modal>

      {/* Endorsement Modal */}
      <Modal
        isOpen={activeModal === 'endorse'}
        onClose={() => setActiveModal(null)}
        title="Add Your Endorsement"
      >
        <div className="pb-4">
          <p className="text-white/70 text-center mb-6">
            Join thousands of Kansas Citians supporting the renewal.
          </p>
          <EndorsementForm compact onSuccess={() => setActiveModal(null)} />
        </div>
      </Modal>
    </div>
  );
}
