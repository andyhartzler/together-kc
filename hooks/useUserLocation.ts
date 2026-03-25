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
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            county: null,
            formattedAddress: '',
            isInKC: false,
          });
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
