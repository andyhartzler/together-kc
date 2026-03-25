# Unified Vote Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the separate `/vote-early` and `/find-polling` pages with a single mobile-first `/vote` page that answers "where do I vote?" in 2 taps.

**Architecture:** Single client component (`VotePage`) with extracted sub-components for each UI section. Shared utility modules for geocoding, timezone-safe time logic, and map management. List-first mobile layout with optional map. Date-aware mode switching between early voting and election day.

**Tech Stack:** Next.js App Router, React 18, TypeScript, framer-motion, Apple MapKit JS, Google Places API, Tailwind CSS

**Spec:** `docs/superpowers/specs/2026-03-25-unified-vote-page-design.md`

---

## File Structure

### New files
| File | Responsibility |
|------|---------------|
| `lib/voting-utils.ts` | Central Time helpers, open/closed status, directions URL, distance calc, voting mode detection |
| `lib/geocoding.ts` | Google Maps script loader, geocode-to-county, reverse geocode |
| `hooks/useUserLocation.ts` | Geolocation + county detection hook |
| `hooks/useAppleMap.ts` | MapKit JS lifecycle + annotation management hook |
| `app/(main)/vote/VotePage.tsx` | Main unified page (orchestrator, state management) |
| `app/(main)/vote/components/SmartBanner.tsx` | Date-aware hero banner |
| `app/(main)/vote/components/VotingModeToggle.tsx` | Early Voting / Election Day segmented control |
| `app/(main)/vote/components/LocationEntry.tsx` | "Use My Location" button + address input |
| `app/(main)/vote/components/LocationCard.tsx` | Individual location card (early + election day) |
| `app/(main)/vote/components/AssignedLocationCard.tsx` | Green "Your Assigned Location" card for Jackson County election day |
| `app/(main)/vote/components/CountyExternalCard.tsx` | Clay/Platte/Cass election day redirect card |
| `app/(main)/vote/components/MapView.tsx` | Optional Apple Maps view with inline mini-maps |
| `app/(main)/vote/components/VoterInfo.tsx` | ID requirements + election board contacts |

### Modified files
| File | Change |
|------|--------|
| `app/(main)/vote/page.tsx` | Replace ModalLandingPage with VotePage, update metadata |
| `lib/constants.ts` | Add "Vote" to NAV_LINKS |
| `components/layout/Navigation.tsx` | Add `/vote` to hasDarkHero |
| `next.config.ts` | Add redirects for `/vote-early` and `/find-polling` |
| `.env.local` | Add `NEXT_PUBLIC_GOOGLE_MAPS_KEY` |

### Deleted files (after new page is working)
| File | Reason |
|------|--------|
| `app/(main)/vote-early/VoteEarlyPage.tsx` | Replaced by unified VotePage |
| `app/(main)/vote-early/page.tsx` | Replaced by redirect |
| `app/(main)/find-polling/FindPollingPage.tsx` | Replaced by unified VotePage |
| `app/(main)/find-polling/page.tsx` | Replaced by redirect |

---

## Task 1: Shared Utilities - `lib/voting-utils.ts`

**Files:**
- Create: `lib/voting-utils.ts`

- [ ] **Step 1: Create voting-utils.ts with Central Time helpers**

```typescript
// lib/voting-utils.ts
import type { EarlyVotingLocation, ScheduleEntry } from './polling-data';

export type County = 'Jackson' | 'Clay' | 'Platte' | 'Cass';
export type VotingMode = 'early' | 'election-day';

const TZ = 'America/Chicago';

/** Get current date/time in Central Time */
export function getCentralTime(): Date {
  const str = new Date().toLocaleString('en-US', { timeZone: TZ });
  return new Date(str);
}

/** Get today's date string (YYYY-MM-DD) in Central Time */
export function getCentralDateStr(): string {
  const now = getCentralTime();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Determine voting mode based on current Central Time date */
export function getVotingMode(): VotingMode {
  const today = getCentralDateStr();
  return today >= '2026-04-07' ? 'election-day' : 'early';
}

/** Check if early voting period has ended */
export function hasEarlyVotingEnded(): boolean {
  const today = getCentralDateStr();
  return today > '2026-04-06';
}

/** Check if election is over */
export function hasElectionEnded(): boolean {
  const today = getCentralDateStr();
  return today > '2026-04-07';
}

/** Days remaining for early voting */
export function earlyVotingDaysLeft(): number {
  const now = getCentralTime();
  const end = new Date('2026-04-06T23:59:59');
  return Math.max(0, Math.ceil((end.getTime() - now.getTime()) / 86400000));
}

/** Parse "8:00 AM" -> [8, 0] */
function parseTime(timeStr: string): [number, number] {
  const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return [0, 0];
  let hours = parseInt(match[1]);
  const minutes = parseInt(match[2]);
  const period = match[3].toUpperCase();
  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;
  return [hours, minutes];
}

export interface LocationStatus {
  isOpen: boolean;
  status: string;
  closesAt?: string;
  opensAt?: string;
  minutesUntilClose?: number;
  todayHours?: { open: string; close: string };
}

/** Get open/closed status using Central Time */
export function getLocationStatus(location: EarlyVotingLocation): LocationStatus {
  const now = getCentralTime();
  const currentDay = now.getDay();
  const todayStr = getCentralDateStr();

  for (const schedule of location.hours) {
    if (schedule.closed) continue;
    if (todayStr < schedule.startDate || todayStr > schedule.endDate) continue;
    if (schedule.daysOfWeek && !schedule.daysOfWeek.includes(currentDay)) continue;

    const [openH, openM] = parseTime(schedule.open);
    const [closeH, closeM] = parseTime(schedule.close);
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const openMinutes = openH * 60 + openM;
    const closeMinutes = closeH * 60 + closeM;

    if (currentMinutes >= openMinutes && currentMinutes < closeMinutes) {
      const minutesLeft = closeMinutes - currentMinutes;
      return {
        isOpen: true,
        closesAt: schedule.close,
        minutesUntilClose: minutesLeft,
        status: minutesLeft <= 60
          ? `Closes in ${minutesLeft} min`
          : `Open until ${schedule.close}`,
        todayHours: { open: schedule.open, close: schedule.close },
      };
    } else if (currentMinutes < openMinutes) {
      return {
        isOpen: false,
        opensAt: schedule.open,
        status: `Opens at ${schedule.open}`,
        todayHours: { open: schedule.open, close: schedule.close },
      };
    } else {
      return { isOpen: false, status: 'Closed for today' };
    }
  }

  // Check closed-day entries
  for (const schedule of location.hours) {
    if (schedule.closed && todayStr >= schedule.startDate && todayStr <= schedule.endDate) {
      return { isOpen: false, status: 'Closed today' };
    }
  }

  // Find next open day
  const nextSchedule = location.hours.find(
    (s) => !s.closed && s.startDate > todayStr
  );
  if (nextSchedule) {
    return { isOpen: false, status: `Opens ${nextSchedule.dates}` };
  }

  return { isOpen: false, status: 'Not currently open' };
}

/** Platform-aware directions deep link */
export function getDirectionsUrl(address: string): string {
  const encoded = encodeURIComponent(address);
  if (typeof navigator !== 'undefined' && /iPhone|iPad|iPod|Macintosh/.test(navigator.userAgent)) {
    return `https://maps.apple.com/?daddr=${encoded}`;
  }
  return `https://www.google.com/maps/dir/?api=1&destination=${encoded}`;
}

/** Haversine distance in miles */
export function getDistanceMiles(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  const R = 3959;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** Full address string for a location */
export function fullAddress(loc: { address: string; city: string; state: string; zip: string }): string {
  return `${loc.address}, ${loc.city}, ${loc.state} ${loc.zip}`;
}

/** KC counties list */
export const KC_COUNTIES: County[] = ['Jackson', 'Clay', 'Platte', 'Cass'];

/** County center coordinates (for map centering when no user location) */
export const COUNTY_CENTERS: Record<County, { lat: number; lng: number }> = {
  Jackson: { lat: 39.0997, lng: -94.5786 },
  Clay: { lat: 39.3103, lng: -94.4204 },
  Platte: { lat: 39.3755, lng: -94.7723 },
  Cass: { lat: 38.6473, lng: -94.3546 },
};
```

- [ ] **Step 2: Verify no TypeScript errors**

Run: `cd /Users/andrew/together-kc && npx tsc --noEmit lib/voting-utils.ts 2>&1 | head -20`

- [ ] **Step 3: Commit**

```bash
git add lib/voting-utils.ts
git commit -m "feat(vote): add shared voting utilities with Central Time support"
```

---

## Task 2: Shared Utilities - `lib/geocoding.ts`

**Files:**
- Create: `lib/geocoding.ts`
- Modify: `.env.local` (add `NEXT_PUBLIC_GOOGLE_MAPS_KEY`)

- [ ] **Step 1: Create .env.local entry**

Add to `.env.local`:
```
NEXT_PUBLIC_GOOGLE_MAPS_KEY=AIzaSyA0tnMaQcXi8fn5azv72QOxF0UmsYY7d8k
```

- [ ] **Step 2: Create geocoding.ts**

```typescript
// lib/geocoding.ts
import type { County } from './voting-utils';

const GOOGLE_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || '';
const KC_BOUNDS = { sw: { lat: 38.8, lng: -94.8 }, ne: { lat: 39.4, lng: -94.3 } };

let loadPromise: Promise<void> | null = null;

/** Load Google Maps JS SDK (singleton, idempotent) */
export function loadGoogleMaps(): Promise<void> {
  if (loadPromise) return loadPromise;
  if (window.google?.maps?.Geocoder) {
    loadPromise = Promise.resolve();
    return loadPromise;
  }

  loadPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector('script[src*="maps.googleapis.com"]');
    if (existing) {
      if (window.google?.maps?.Geocoder) { resolve(); return; }
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('Google Maps failed')));
      return;
    }
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_KEY}&libraries=places`;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google Maps'));
    document.head.appendChild(script);
  });
  return loadPromise;
}

export interface GeocodeResult {
  lat: number;
  lng: number;
  county: County | null;
  formattedAddress: string;
  isInKC: boolean;
}

const VALID_COUNTIES = ['Jackson', 'Clay', 'Platte', 'Cass'];

/** Extract county from Google geocode address components */
function extractCounty(components: Array<{ long_name: string; types: string[] }>): County | null {
  const countyComp = components.find((c) => c.types.includes('administrative_area_level_2'));
  if (!countyComp) return null;
  const name = countyComp.long_name.replace(' County', '');
  return VALID_COUNTIES.includes(name) ? (name as County) : null;
}

/** Geocode an address and detect KC county */
export async function geocodeAddress(address: string): Promise<GeocodeResult | null> {
  await loadGoogleMaps();
  const geocoder = new window.google!.maps.Geocoder();

  const isZip = /^\d{5}(-\d{4})?$/.test(address.trim());
  const query = isZip ? `${address.trim()}, MO` : address;

  return new Promise((resolve) => {
    geocoder.geocode({ address: query }, (results, status) => {
      if (status !== 'OK' || !results?.length) {
        resolve(null);
        return;
      }
      const r = results[0];
      const county = extractCounty(r.address_components);
      resolve({
        lat: r.geometry.location.lat(),
        lng: r.geometry.location.lng(),
        county,
        formattedAddress: r.formatted_address,
        isInKC: county !== null,
      });
    });
  });
}

/** Reverse geocode coordinates to detect county */
export async function detectCountyFromCoords(lat: number, lng: number): Promise<GeocodeResult | null> {
  await loadGoogleMaps();
  const geocoder = new window.google!.maps.Geocoder();

  return new Promise((resolve) => {
    geocoder.geocode(
      { address: `${lat},${lng}` },
      (results, status) => {
        if (status !== 'OK' || !results?.length) {
          resolve({ lat, lng, county: null, formattedAddress: '', isInKC: false });
          return;
        }
        const r = results[0];
        const county = extractCounty(r.address_components);
        resolve({
          lat,
          lng,
          county,
          formattedAddress: r.formatted_address,
          isInKC: county !== null,
        });
      }
    );
  });
}

/** Initialize Google Places Autocomplete on an input */
export async function initAutocomplete(
  input: HTMLInputElement,
  onPlaceSelected: (result: GeocodeResult) => void
): Promise<void> {
  await loadGoogleMaps();
  if (!window.google?.maps?.places) return;

  const bounds = new window.google.maps.LatLngBounds(
    new window.google.maps.LatLng(KC_BOUNDS.sw.lat, KC_BOUNDS.sw.lng),
    new window.google.maps.LatLng(KC_BOUNDS.ne.lat, KC_BOUNDS.ne.lng)
  );

  const ac = new window.google.maps.places.Autocomplete(input, {
    types: ['address'],
    componentRestrictions: { country: 'us' },
    bounds,
    strictBounds: false,
    fields: ['formatted_address', 'address_components', 'geometry'],
  });

  ac.addListener('place_changed', () => {
    const place = ac.getPlace();
    if (!place.geometry?.location || !place.formatted_address) return;
    const county = extractCounty(place.address_components || []);
    onPlaceSelected({
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
      county,
      formattedAddress: place.formatted_address,
      isInKC: county !== null,
    });
  });
}
```

- [ ] **Step 3: Commit**

```bash
git add lib/geocoding.ts
git commit -m "feat(vote): add shared geocoding utilities with singleton loader"
```

---

## Task 3: Hooks - `useUserLocation` and `useAppleMap`

**Files:**
- Create: `hooks/useUserLocation.ts`
- Create: `hooks/useAppleMap.ts`

- [ ] **Step 1: Create useUserLocation hook**

```typescript
// hooks/useUserLocation.ts
'use client';

import { useState, useCallback } from 'react';
import { detectCountyFromCoords, type GeocodeResult } from '@/lib/geocoding';

interface UseUserLocationReturn {
  location: GeocodeResult | null;
  isLocating: boolean;
  error: string | null;
  requestLocation: () => void;
}

export function useUserLocation(): UseUserLocationReturn {
  const [location, setLocation] = useState<GeocodeResult | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const result = await detectCountyFromCoords(latitude, longitude);
          setLocation(result);
        } catch {
          setLocation({ lat: position.coords.latitude, lng: position.coords.longitude, county: null, formattedAddress: '', isInKC: false });
        } finally {
          setIsLocating(false);
        }
      },
      () => {
        setError('Unable to get your location. Please enter your address instead.');
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  return { location, isLocating, error, requestLocation };
}
```

- [ ] **Step 2: Create useAppleMap hook**

```typescript
// hooks/useAppleMap.ts
'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

const APPLE_MAPS_TOKEN =
  'eyJraWQiOiI2N1laVTdLOEFDIiwidHlwIjoiSldUIiwiYWxnIjoiRVMyNTYifQ.eyJpc3MiOiJGU1lBRENTRDY3IiwiaWF0IjoxNzc0NDA0NzY2LCJvcmlnaW4iOiJ0b2dldGhlci1rYy5jb20iLCJzY29wZSI6Im1hcGtpdF9qcyJ9.EnPx4CaGOKO0p_2_NQxZFO_XvHb5rNp2xiDA8KYBgn-_2_qZj1MEhM4UIHxqcRkIGBCDy-_egfJjBdlQ1Ib82w';

let mapkitLoadPromise: Promise<void> | null = null;

function loadMapKit(): Promise<void> {
  if (mapkitLoadPromise) return mapkitLoadPromise;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapkit = (window as any).mapkit;
  if (mapkit) { mapkitLoadPromise = Promise.resolve(); return mapkitLoadPromise; }

  mapkitLoadPromise = new Promise<void>((resolve) => {
    const existing = document.querySelector('script[src*="apple-mapkit"]');
    if (existing) {
      existing.addEventListener('load', () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mk = (window as any).mapkit;
        if (mk) try { mk.init({ authorizationCallback: (done: (t: string) => void) => done(APPLE_MAPS_TOKEN) }); } catch { /* already init */ }
        resolve();
      });
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdn.apple-mapkit.com/mk/5.x.x/mapkit.js';
    script.crossOrigin = 'anonymous';
    script.addEventListener('load', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mk = (window as any).mapkit;
      if (mk) try { mk.init({ authorizationCallback: (done: (t: string) => void) => done(APPLE_MAPS_TOKEN) }); } catch { /* already init */ }
      resolve();
    });
    document.head.appendChild(script);
  });
  return mapkitLoadPromise;
}

interface MapPin {
  id: string;
  lat: number;
  lng: number;
  title: string;
  subtitle?: string;
  color: string;
  glyphText?: string;
}

interface UseAppleMapOptions {
  center?: { lat: number; lng: number };
  zoom?: number; // camera distance
  pins?: MapPin[];
  onPinSelect?: (id: string) => void;
  enabled?: boolean;
}

export function useAppleMap(options: UseAppleMapOptions) {
  const { center, zoom = 80000, pins = [], onPinSelect, enabled = true } = options;
  const mapRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstanceRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const annotationsRef = useRef<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!enabled || !mapRef.current) return;
    let cancelled = false;

    loadMapKit().then(() => {
      if (cancelled || !mapRef.current) return;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mapkit = (window as any).mapkit;
      if (!mapkit || mapInstanceRef.current) return;

      const c = center || { lat: 39.05, lng: -94.55 };
      const map = new mapkit.Map(mapRef.current, {
        center: new mapkit.Coordinate(c.lat, c.lng),
        cameraDistance: zoom,
        colorScheme: mapkit.Map.ColorSchemes.Dark,
        showsCompass: mapkit.FeatureVisibility.Hidden,
        showsMapTypeControl: false,
        showsZoomControl: true,
        padding: new mapkit.Padding(40, 40, 40, 40),
      });

      mapInstanceRef.current = map;
      setIsLoaded(true);
    });

    return () => { cancelled = true; };
  }, [enabled]); // eslint-disable-line react-hooks/exhaustive-deps

  // Update annotations without destroying map
  useEffect(() => {
    if (!isLoaded || !mapInstanceRef.current) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mapkit = (window as any).mapkit;
    if (!mapkit) return;

    const map = mapInstanceRef.current;

    // Remove old
    if (annotationsRef.current.length > 0) {
      map.removeAnnotations(annotationsRef.current);
    }

    // Add new
    const newAnnotations = pins.map((pin) => {
      const a = new mapkit.MarkerAnnotation(
        new mapkit.Coordinate(pin.lat, pin.lng),
        {
          title: pin.title,
          subtitle: pin.subtitle || '',
          color: pin.color,
          glyphText: pin.glyphText || '•',
        }
      );
      if (onPinSelect) {
        a.addEventListener('select', () => onPinSelect(pin.id));
      }
      return a;
    });

    map.addAnnotations(newAnnotations);
    annotationsRef.current = newAnnotations;
  }, [isLoaded, pins, onPinSelect]);

  // Update center/zoom
  const centerOn = useCallback((lat: number, lng: number, distance?: number) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mapkit = (window as any).mapkit;
    if (!mapkit || !mapInstanceRef.current) return;
    mapInstanceRef.current.setCenterAnimated(new mapkit.Coordinate(lat, lng));
    if (distance) mapInstanceRef.current.setCameraDistanceAnimated(distance);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.destroy();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return { mapRef, isLoaded, centerOn };
}

/** Create a small inline map for a single location (used in card expand) */
export function useInlineMap(lat: number, lng: number, enabled: boolean) {
  return useAppleMap({
    center: { lat, lng },
    zoom: 5000,
    pins: [{ id: 'loc', lat, lng, title: '', color: '#e53935', glyphText: '•' }],
    enabled,
  });
}
```

- [ ] **Step 3: Commit**

```bash
git add hooks/useUserLocation.ts hooks/useAppleMap.ts
git commit -m "feat(vote): add useUserLocation and useAppleMap hooks"
```

---

## Task 4: Sub-Components (SmartBanner, VotingModeToggle, LocationEntry)

**Files:**
- Create: `app/(main)/vote/components/SmartBanner.tsx`
- Create: `app/(main)/vote/components/VotingModeToggle.tsx`
- Create: `app/(main)/vote/components/LocationEntry.tsx`

- [ ] **Step 1: Create SmartBanner**

```typescript
// app/(main)/vote/components/SmartBanner.tsx
'use client';

import { motion } from 'framer-motion';
import {
  getVotingMode,
  hasEarlyVotingEnded,
  hasElectionEnded,
  earlyVotingDaysLeft,
} from '@/lib/voting-utils';

export default function SmartBanner() {
  const mode = getVotingMode();
  const ended = hasElectionEnded();
  const earlyEnded = hasEarlyVotingEnded();
  const daysLeft = earlyVotingDaysLeft();

  if (ended) {
    return (
      <div className="bg-gradient-to-br from-navy via-navy to-white/5 py-8 px-4 text-center border-b border-white/10">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
          The Election Has Ended
        </h1>
        <p className="text-white/60 text-base">Thank you for voting!</p>
      </div>
    );
  }

  return (
    <div className="relative bg-gradient-to-br from-navy via-navy to-coral/10 py-6 md:py-8 px-4 text-center border-b border-white/10">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        {mode === 'early' && !earlyEnded && (
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-500/20 border border-green-500/40 text-green-300 text-sm font-medium mb-3">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-400" />
            </span>
            Early voting is open now
          </div>
        )}

        <h1 className="text-2xl md:text-3xl font-bold text-white mb-1.5">
          Where Do I Vote?
        </h1>

        <p className="text-white/60 text-sm md:text-base max-w-md mx-auto">
          {mode === 'early' && !earlyEnded
            ? `${daysLeft} day${daysLeft !== 1 ? 's' : ''} left to vote early. No excuse needed.`
            : mode === 'election-day'
            ? 'Election Day is today. Polls open 6:00 AM - 7:00 PM. Bring your photo ID.'
            : 'Early voting has ended. Find your Election Day polling place.'}
        </p>
      </motion.div>
    </div>
  );
}
```

- [ ] **Step 2: Create VotingModeToggle**

```typescript
// app/(main)/vote/components/VotingModeToggle.tsx
'use client';

import { motion } from 'framer-motion';
import type { VotingMode } from '@/lib/voting-utils';

interface Props {
  mode: VotingMode;
  onChange: (mode: VotingMode) => void;
}

export default function VotingModeToggle({ mode, onChange }: Props) {
  return (
    <div className="flex bg-white/5 rounded-xl p-1 border border-white/10">
      {(['early', 'election-day'] as const).map((m) => (
        <button
          key={m}
          onClick={() => onChange(m)}
          className="relative flex-1 py-2.5 px-4 text-sm font-semibold rounded-lg transition-colors"
        >
          {mode === m && (
            <motion.div
              layoutId="mode-toggle"
              className="absolute inset-0 bg-coral rounded-lg"
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          )}
          <span className={`relative z-10 ${mode === m ? 'text-white' : 'text-white/50'}`}>
            {m === 'early' ? 'Early Voting' : 'Election Day'}
          </span>
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Create LocationEntry**

```typescript
// app/(main)/vote/components/LocationEntry.tsx
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
  onLocationFound,
  onUseMyLocation,
  isLocating,
  locationError,
  isOutsideKC,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [addressInput, setAddressInput] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const acInitRef = useRef(false);

  // Init autocomplete
  useEffect(() => {
    if (!inputRef.current || acInitRef.current) return;
    acInitRef.current = true;
    initAutocomplete(inputRef.current, (result) => {
      setAddressInput(result.formattedAddress);
      onLocationFound(result);
    }).catch(() => { /* autocomplete unavailable, manual entry still works */ });
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
      {/* Use My Location - Primary CTA */}
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

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-white/10" />
        <span className="text-white/30 text-xs">or enter your address</span>
        <div className="flex-1 h-px bg-white/10" />
      </div>

      {/* Address Input */}
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

      {/* Outside KC banner */}
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
```

- [ ] **Step 4: Commit**

```bash
git add app/\(main\)/vote/components/SmartBanner.tsx app/\(main\)/vote/components/VotingModeToggle.tsx app/\(main\)/vote/components/LocationEntry.tsx
git commit -m "feat(vote): add SmartBanner, VotingModeToggle, LocationEntry components"
```

---

## Task 5: Sub-Components (LocationCard, AssignedLocationCard, CountyExternalCard)

**Files:**
- Create: `app/(main)/vote/components/LocationCard.tsx`
- Create: `app/(main)/vote/components/AssignedLocationCard.tsx`
- Create: `app/(main)/vote/components/CountyExternalCard.tsx`

- [ ] **Step 1: Create LocationCard**

This is the main card used for both early voting and election day locations. Expandable with inline mini-map.

```typescript
// app/(main)/vote/components/LocationCard.tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInlineMap } from '@/hooks/useAppleMap';
import {
  getLocationStatus,
  getDirectionsUrl,
  getDistanceMiles,
  fullAddress,
  type LocationStatus,
} from '@/lib/voting-utils';
import type { EarlyVotingLocation } from '@/lib/polling-data';
import type { ElectionDayLocation } from '@/lib/election-day-data';

type Location = EarlyVotingLocation | ElectionDayLocation;

interface Props {
  location: Location;
  userLat?: number;
  userLng?: number;
  isEarlyVoting: boolean;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

function isEarlyVotingLoc(loc: Location): loc is EarlyVotingLocation {
  return 'hours' in loc;
}

export default function LocationCard({
  location: loc,
  userLat,
  userLng,
  isEarlyVoting,
  isSelected,
  onSelect,
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const isExpanded = isSelected || expanded;

  const status: LocationStatus | null = isEarlyVotingLoc(loc)
    ? getLocationStatus(loc)
    : null;

  const distance =
    userLat !== undefined && userLng !== undefined && loc.lat !== 0
      ? getDistanceMiles(userLat, userLng, loc.lat, loc.lng)
      : null;

  const addr = fullAddress(loc);
  const isKCEB = isEarlyVotingLoc(loc) && loc.isElectionBoard;
  const isCass = loc.county === 'Cass';
  const ward = 'ward' in loc ? loc.ward : undefined;
  const room = 'room' in loc ? loc.room : undefined;

  // Inline map only loads when expanded
  const { mapRef: inlineMapRef, isLoaded: inlineMapLoaded } = useInlineMap(
    loc.lat,
    loc.lng,
    isExpanded && loc.lat !== 0
  );

  return (
    <button
      onClick={() => {
        onSelect(loc.id);
        setExpanded(!expanded);
      }}
      className={`w-full text-left rounded-xl p-4 transition-all ${
        isExpanded
          ? 'bg-coral/10 border-2 border-coral/40'
          : 'bg-white/5 border border-white/10 hover:bg-white/10'
      }`}
    >
      {/* Top row: status + distance */}
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          {status && (
            <span
              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${
                status.isOpen
                  ? status.minutesUntilClose && status.minutesUntilClose <= 60
                    ? 'bg-amber-500/20 text-amber-300'
                    : 'bg-green-500/20 text-green-300'
                  : 'bg-white/10 text-white/50'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  status.isOpen
                    ? status.minutesUntilClose && status.minutesUntilClose <= 60
                      ? 'bg-amber-400'
                      : 'bg-green-400'
                    : 'bg-white/30'
                }`}
              />
              {status.status}
            </span>
          )}
          {isKCEB && (
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-golden/20 text-golden border border-golden/30">
              HQ
            </span>
          )}
          {ward !== undefined && (
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono text-white/40 bg-white/5 border border-white/10">
              W{ward}
            </span>
          )}
        </div>
        {distance !== null && (
          <span className="text-sky text-xs font-medium">{distance.toFixed(1)} mi</span>
        )}
      </div>

      {/* Name */}
      <h3 className="text-white font-semibold text-sm">{loc.name}</h3>

      {/* Address */}
      <p className="text-white/50 text-xs mt-0.5">{loc.address}, {loc.city}</p>
      {room && <p className="text-white/40 text-[11px]">{room}</p>}

      {/* Today's hours */}
      {status?.todayHours && (
        <p className="text-white/40 text-xs mt-1">
          Today: {status.todayHours.open} - {status.todayHours.close}
        </p>
      )}

      {/* Cass early close warning */}
      {isCass && isEarlyVoting && (
        <p className="text-amber-400 text-[11px] mt-1 font-medium">
          Closes at 4:30 PM (earlier than other locations)
        </p>
      )}

      {/* Paper ballot note */}
      {isKCEB && isEarlyVoting && (
        <p className="text-golden/70 text-[11px] mt-1">Paper ballots available here</p>
      )}

      {/* Directions button - always visible, no expand needed */}
      <a
        href={getDirectionsUrl(addr)}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-coral text-white text-sm font-semibold hover:bg-coral/90 transition-colors min-h-[44px]"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        </svg>
        Get Directions
      </a>

      {/* Expanded details */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-3 pt-3 border-t border-white/10 space-y-3">
              {/* Inline mini-map */}
              {loc.lat !== 0 && (
                <div className="rounded-lg overflow-hidden h-[180px] bg-navy/50 border border-white/10">
                  <div ref={inlineMapRef} className="w-full h-full" />
                  {!inlineMapLoaded && (
                    <div className="flex items-center justify-center h-full">
                      <svg className="w-5 h-5 animate-spin text-white/30" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    </div>
                  )}
                </div>
              )}

              {/* Full schedule (early voting only) */}
              {isEarlyVotingLoc(loc) && (
                <div>
                  <p className="text-white/40 text-[10px] uppercase tracking-wider font-semibold mb-1">Hours</p>
                  {loc.hours.map((h, i) => (
                    <div key={i} className="flex justify-between text-xs py-0.5">
                      <span className="text-white/60">
                        {h.label} <span className="text-white/30">({h.dates})</span>
                      </span>
                      <span className={h.closed ? 'text-red-400' : 'text-white/80'}>
                        {h.closed ? 'Closed' : `${h.open} - ${h.close}`}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Election day ward/precinct info */}
              {'precincts' in loc && loc.precincts.length > 0 && (
                <p className="text-white/40 text-xs">
                  Ward {ward}{('letterCode' in loc && loc.letterCode) ? ` (${loc.letterCode})` : ''} - Precincts: {loc.precincts.join(', ')}
                </p>
              )}

              {/* Notes */}
              {isEarlyVotingLoc(loc) && loc.notes && (
                <p className="text-golden/80 text-xs bg-golden/10 rounded-lg px-3 py-2">
                  {loc.notes}
                </p>
              )}

              <p className="text-white/30 text-[11px]">{loc.county} County</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}
```

- [ ] **Step 2: Create AssignedLocationCard**

```typescript
// app/(main)/vote/components/AssignedLocationCard.tsx
'use client';

import { motion } from 'framer-motion';
import { getDirectionsUrl } from '@/lib/voting-utils';

interface PrecinctInfo {
  precinct: string;
  pollingPlace: string;
  pollingAddress: string;
  sampleBallot: string | null;
}

interface Props {
  info: PrecinctInfo | null;
  isLoading: boolean;
}

export default function AssignedLocationCard({ info, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="rounded-xl bg-green-500/10 border border-green-500/20 p-4 animate-pulse">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-full bg-green-500/20" />
          <div className="h-3 w-40 bg-green-500/20 rounded" />
        </div>
        <div className="h-4 w-56 bg-green-500/10 rounded mb-2" />
        <div className="h-3 w-44 bg-green-500/10 rounded" />
      </div>
    );
  }

  if (!info) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-500/30 p-4"
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="w-6 h-6 rounded-full bg-green-500/30 flex items-center justify-center">
          <svg className="w-4 h-4 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </span>
        <span className="text-green-300 text-xs font-semibold uppercase tracking-wider">
          Your Assigned Location
        </span>
      </div>

      <h3 className="text-white font-bold text-base">{info.pollingPlace}</h3>
      <p className="text-white/60 text-sm">{info.pollingAddress}</p>
      <p className="text-white/40 text-xs mt-1">{info.precinct}</p>

      <div className="flex gap-2 mt-3">
        <a
          href={getDirectionsUrl(info.pollingAddress)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg bg-green-500/30 text-green-200 text-sm font-semibold hover:bg-green-500/40 transition-colors min-h-[44px]"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          </svg>
          Directions
        </a>
        {info.sampleBallot && (
          <a
            href={info.sampleBallot}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg bg-white/10 text-white/70 text-sm font-semibold hover:bg-white/20 transition-colors min-h-[44px]"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Sample Ballot
          </a>
        )}
      </div>

      <p className="text-green-300/60 text-[10px] mt-3 leading-relaxed">
        Paper ballot at your assigned location. Vote at any other KC location with a ballot marking device.
      </p>
    </motion.div>
  );
}
```

- [ ] **Step 3: Create CountyExternalCard**

```typescript
// app/(main)/vote/components/CountyExternalCard.tsx
'use client';

import { COUNTY_ELECTION_BOARDS } from '@/lib/polling-data';
import { COUNTY_LOOKUP_INFO } from '@/lib/election-day-data';
import type { County } from '@/lib/voting-utils';

interface Props {
  county: County;
}

export default function CountyExternalCard({ county }: Props) {
  const board = COUNTY_ELECTION_BOARDS[county];
  const lookup = COUNTY_LOOKUP_INFO[county];

  return (
    <div className="rounded-xl bg-white/5 border border-white/10 p-5">
      <div className="text-center mb-4">
        <h2 className="text-lg font-bold text-white mb-1">{county} County</h2>
        <p className="text-white/60 text-sm">{lookup.message}</p>
        <p className="text-white/50 text-sm mt-1">
          Use your county&apos;s official lookup tool to find your exact polling place.
        </p>
      </div>

      <a
        href={lookup.lookupUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-coral text-white font-semibold text-base hover:bg-coral/90 transition-all min-h-[48px]"
      >
        {'lookupLabel' in lookup ? (lookup as { lookupLabel: string }).lookupLabel : 'Find Your Polling Place'}
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </a>

      {/* Contact info */}
      <div className="mt-5 pt-4 border-t border-white/10 space-y-2">
        <h3 className="text-white/60 font-semibold text-xs uppercase tracking-wider">{board.name}</h3>
        <div className="flex items-center gap-2 text-white/50 text-sm">
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          <a href={`tel:${board.phone.replace(/\D/g, '')}`} className="hover:text-white transition-colors">
            {board.phone}
          </a>
        </div>
        <div className="flex items-center gap-2 text-white/50 text-sm">
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          </svg>
          <span>{board.address}</span>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add app/\(main\)/vote/components/LocationCard.tsx app/\(main\)/vote/components/AssignedLocationCard.tsx app/\(main\)/vote/components/CountyExternalCard.tsx
git commit -m "feat(vote): add LocationCard, AssignedLocationCard, CountyExternalCard"
```

---

## Task 6: VoterInfo Component

**Files:**
- Create: `app/(main)/vote/components/VoterInfo.tsx`

- [ ] **Step 1: Create VoterInfo**

```typescript
// app/(main)/vote/components/VoterInfo.tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { COUNTY_ELECTION_BOARDS } from '@/lib/polling-data';

export default function VoterInfo() {
  const [idExpanded, setIdExpanded] = useState(false);

  return (
    <div className="border-t border-white/10 bg-navy">
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Voter ID - Collapsible */}
        <button
          onClick={() => setIdExpanded(!idExpanded)}
          className="w-full flex items-center justify-between rounded-xl bg-golden/10 border border-golden/20 px-4 py-3.5 min-h-[48px]"
        >
          <span className="flex items-center gap-2 text-golden font-semibold text-sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            What to Bring - Voter ID Required
          </span>
          <svg className={`w-4 h-4 text-golden transition-transform ${idExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <AnimatePresence>
          {idExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="rounded-xl bg-golden/5 border border-golden/10 px-4 py-4 space-y-3">
                <p className="text-white/60 text-sm">
                  Missouri requires a <strong className="text-white/80">valid government-issued photo ID</strong> to vote:
                </p>
                <ul className="text-white/60 text-sm space-y-1 ml-4 list-disc">
                  <li>Missouri driver&apos;s license or non-driver ID</li>
                  <li>U.S. passport</li>
                  <li>U.S. military ID</li>
                  <li>Other government-issued photo ID</li>
                </ul>
                <p className="text-white/50 text-xs">
                  Without a photo ID, you may cast a provisional ballot with your name, address, date of birth, and last 4 digits of your SSN.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Election Board Contacts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {(Object.entries(COUNTY_ELECTION_BOARDS) as [string, typeof COUNTY_ELECTION_BOARDS['Jackson']][]).map(
            ([county, info]) => (
              <div key={county} className="rounded-xl bg-white/5 border border-white/10 p-4">
                <h3 className="text-white font-semibold text-sm mb-0.5">{county} County</h3>
                <p className="text-white/40 text-xs mb-2">{info.name}</p>
                <a
                  href={`tel:${info.phone.replace(/\D/g, '')}`}
                  className="text-white/60 text-sm hover:text-white transition-colors"
                >
                  {info.phone}
                </a>
              </div>
            )
          )}
        </div>

        {/* MO SOS Link */}
        <div className="text-center">
          <a
            href="https://voteroutreach.sos.mo.gov/portal/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-white/60 text-sm font-medium hover:bg-white/10 transition-all min-h-[44px]"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Check Your Voter Registration (MO SOS)
          </a>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/\(main\)/vote/components/VoterInfo.tsx
git commit -m "feat(vote): add VoterInfo component with collapsible ID requirements"
```

---

## Task 7: Main VotePage Orchestrator

**Files:**
- Create: `app/(main)/vote/VotePage.tsx`
- Modify: `app/(main)/vote/page.tsx`

- [ ] **Step 1: Create VotePage.tsx**

This is the main orchestrator that composes all sub-components and manages state. Keep it focused on state + layout, delegating rendering to child components.

```typescript
// app/(main)/vote/VotePage.tsx
'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  getVotingMode,
  getDistanceMiles,
  type VotingMode,
  type County,
} from '@/lib/voting-utils';
import { type GeocodeResult } from '@/lib/geocoding';
import { EARLY_VOTING_LOCATIONS } from '@/lib/polling-data';
import { JACKSON_COUNTY_LOCATIONS, COUNTY_LOOKUP_INFO } from '@/lib/election-day-data';
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

  // Handle location result (from geolocation or address input)
  const handleLocationFound = useCallback((result: GeocodeResult) => {
    setUserCoords({ lat: result.lat, lng: result.lng });
    setCounty(result.county);
    setIsOutsideKC(!result.isInKC);
    setPrecinctInfo(null);

    // Auto-lookup precinct for Jackson County on election day
    if (result.county === 'Jackson' && result.isInKC) {
      lookupPrecinct(result.lat, result.lng);
    }
  }, []);

  // When geolocation resolves
  useEffect(() => {
    if (userLoc.location) {
      handleLocationFound(userLoc.location);
    }
  }, [userLoc.location, handleLocationFound]);

  // Precinct lookup
  const lookupPrecinct = async (lat: number, lng: number) => {
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
  };

  // Compute location lists
  const earlyLocations = useMemo(() => {
    let locs = [...EARLY_VOTING_LOCATIONS];

    // Filter by county if detected (but still show others below)
    if (county && !isOutsideKC) {
      const countyLocs = locs.filter((l) => l.county === county);
      const otherLocs = locs.filter((l) => l.county !== county);
      locs = [...countyLocs, ...otherLocs];
    }

    // Sort by distance if we have user coords
    if (userCoords) {
      locs = locs.map((l) => ({
        ...l,
        _dist: getDistanceMiles(userCoords.lat, userCoords.lng, l.lat, l.lng),
      })).sort((a, b) => a._dist - b._dist);
    }

    return locs;
  }, [county, userCoords, isOutsideKC]);

  const electionDayLocations = useMemo(() => {
    let locs = JACKSON_COUNTY_LOCATIONS.filter((l) => l.lat !== 0);

    if (userCoords) {
      locs = locs.map((l) => ({
        ...l,
        _dist: getDistanceMiles(userCoords.lat, userCoords.lng, l.lat, l.lng),
      })).sort((a, b) => a._dist - b._dist);
    }

    return locs;
  }, [userCoords]);

  const showElectionDayJackson = mode === 'election-day' && (county === 'Jackson' || isOutsideKC || !county);
  const showElectionDayExternal = mode === 'election-day' && county && county !== 'Jackson' && !isOutsideKC;
  const showEarly = mode === 'early';

  return (
    <div className="min-h-screen bg-navy">
      <SmartBanner />

      {/* Controls */}
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

      {/* County badge */}
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

      {/* Location Cards */}
      <div className="max-w-2xl mx-auto px-4 pb-6">
        {/* Early Voting */}
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

        {/* Election Day - Jackson County */}
        {showElectionDayJackson && (
          <div className="space-y-3">
            {/* Assigned location (if address provided) */}
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

        {/* Election Day - Clay/Platte/Cass */}
        {showElectionDayExternal && county && (
          <CountyExternalCard county={county} />
        )}
      </div>

      {/* Voter Info Footer */}
      <VoterInfo />
    </div>
  );
}
```

- [ ] **Step 2: Update page.tsx**

Replace the ModalLandingPage with VotePage:

```typescript
// app/(main)/vote/page.tsx
import type { Metadata } from 'next';
import VotePage from './VotePage';

export const metadata: Metadata = {
  title: 'Where Do I Vote? | Together KC',
  description:
    'Find your voting location for the April 7, 2026 Kansas City earnings tax election. Early voting locations, Election Day polling places, directions, and hours.',
  openGraph: {
    title: 'Where Do I Vote? | Together KC',
    description:
      'Find early voting and Election Day locations in Kansas City. Vote YES to renew the earnings tax.',
    url: 'https://together-kc.com/vote',
  },
};

export default function Page() {
  return <VotePage />;
}
```

- [ ] **Step 3: Build check**

Run: `cd /Users/andrew/together-kc && npx next build 2>&1 | tail -20`
Expected: Clean build with no errors.

- [ ] **Step 4: Commit**

```bash
git add app/\(main\)/vote/VotePage.tsx app/\(main\)/vote/page.tsx
git commit -m "feat(vote): add unified VotePage orchestrator and update page.tsx"
```

---

## Task 8: Navigation, Redirects, and Cleanup

**Files:**
- Modify: `lib/constants.ts`
- Modify: `components/layout/Navigation.tsx`
- Modify: `next.config.ts`
- Delete: `app/(main)/vote-early/VoteEarlyPage.tsx`
- Delete: `app/(main)/vote-early/page.tsx`
- Delete: `app/(main)/find-polling/FindPollingPage.tsx`
- Delete: `app/(main)/find-polling/page.tsx`

- [ ] **Step 1: Add "Vote" to NAV_LINKS in constants.ts**

In `lib/constants.ts`, add `{ href: '/vote', label: 'Vote' }` after the Home entry:

```typescript
export const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/vote', label: 'Vote' },
  { href: '/faqs', label: 'FAQs' },
  { href: '/endorsements', label: 'Endorsements' },
  { href: '/donate', label: 'Donate' },
] as const;
```

- [ ] **Step 2: Add /vote to hasDarkHero in Navigation.tsx**

In `components/layout/Navigation.tsx` line 19, update:

```typescript
const hasDarkHero = pathname === '/' || pathname === '/endorsements' || pathname === '/vote';
```

- [ ] **Step 3: Add redirects to next.config.ts**

Add to the `redirects()` array in `next.config.ts`:

```typescript
{
  source: '/vote-early',
  destination: '/vote',
  permanent: true,
},
{
  source: '/find-polling',
  destination: '/vote',
  permanent: true,
},
```

(Note: `/vote-yes` -> `/vote` redirect already exists in the config.)

- [ ] **Step 4: Delete old pages**

```bash
rm app/\(main\)/vote-early/VoteEarlyPage.tsx
rm app/\(main\)/vote-early/page.tsx
rmdir app/\(main\)/vote-early/
rm app/\(main\)/find-polling/FindPollingPage.tsx
rm app/\(main\)/find-polling/page.tsx
rmdir app/\(main\)/find-polling/
```

- [ ] **Step 5: Build check**

Run: `cd /Users/andrew/together-kc && npx next build 2>&1 | tail -20`
Expected: Clean build. Old routes redirect. New `/vote` page builds.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat(vote): add nav link, redirects, delete old vote-early and find-polling pages"
```

---

## Task 9: Final Build Verification and Push

- [ ] **Step 1: Full build**

Run: `cd /Users/andrew/together-kc && npx next build 2>&1 | tail -25`
Expected: Clean build, `/vote` in the route list.

- [ ] **Step 2: Push all commits**

```bash
git push origin main
```

- [ ] **Step 3: Verify redirects work**

After deploy, confirm:
- `/vote-early` -> 301 -> `/vote`
- `/find-polling` -> 301 -> `/vote`
- `/vote` loads the new unified page
- "Vote" appears in the nav
