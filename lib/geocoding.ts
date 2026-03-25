import type { County } from './voting-utils';

const GOOGLE_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || 'AIzaSyA0tnMaQcXi8fn5azv72QOxF0UmsYY7d8k';
const KC_BOUNDS = { sw: { lat: 38.55, lng: -94.9 }, ne: { lat: 39.45, lng: -94.2 } };

let loadPromise: Promise<void> | null = null;

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

function extractCounty(components: Array<{ long_name: string; types: string[] }>): County | null {
  const countyComp = components.find((c) => c.types.includes('administrative_area_level_2'));
  if (!countyComp) return null;
  const name = countyComp.long_name.replace(' County', '');
  return VALID_COUNTIES.includes(name) ? (name as County) : null;
}

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

export async function detectCountyFromCoords(lat: number, lng: number): Promise<GeocodeResult | null> {
  await loadGoogleMaps();
  const geocoder = new window.google!.maps.Geocoder();

  return new Promise((resolve) => {
    geocoder.geocode(
      { location: { lat, lng } },
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
    types: ['geocode'],
    componentRestrictions: { country: 'us' },
    bounds,
    strictBounds: true,
    fields: ['formatted_address', 'address_components', 'geometry'],
  });
  // Force re-bind bounds after creation (some API versions ignore constructor bounds)
  ac.setBounds(bounds);

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
