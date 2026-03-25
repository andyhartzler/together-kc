'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

const APPLE_MAPS_TOKEN =
  'eyJraWQiOiI2N1laVTdLOEFDIiwidHlwIjoiSldUIiwiYWxnIjoiRVMyNTYifQ.eyJpc3MiOiJGU1lBRENTRDY3IiwiaWF0IjoxNzc0NDA0NzY2LCJvcmlnaW4iOiJ0b2dldGhlci1rYy5jb20iLCJzY29wZSI6Im1hcGtpdF9qcyJ9.EnPx4CaGOKO0p_2_NQxZFO_XvHb5rNp2xiDA8KYBgn-_2_qZj1MEhM4UIHxqcRkIGBCDy-_egfJjBdlQ1Ib82w';

let mapkitLoadPromise: Promise<void> | null = null;

function loadMapKit(): Promise<void> {
  if (mapkitLoadPromise) return mapkitLoadPromise;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapkit = (window as any).mapkit;
  if (mapkit) {
    mapkitLoadPromise = Promise.resolve();
    return mapkitLoadPromise;
  }

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
  zoom?: number;
  pins?: MapPin[];
  onPinSelect?: (id: string) => void;
  enabled?: boolean;
  showMobileMap?: boolean;
}

export function useAppleMap(options: UseAppleMapOptions) {
  const { center, zoom = 80000, pins = [], onPinSelect, enabled = true, showMobileMap } = options;
  const mapRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstanceRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const annotationsRef = useRef<any[]>([]);
  const pinsRef = useRef<MapPin[]>(pins);
  const onPinSelectRef = useRef(onPinSelect);
  const [isLoaded, setIsLoaded] = useState(false);

  // Keep refs current
  pinsRef.current = pins;
  onPinSelectRef.current = onPinSelect;

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

      // If pins already exist at init time, add them immediately
      const currentPins = pinsRef.current;
      if (currentPins.length > 0) {
        const annotations = currentPins.map((pin) => {
          const a = new mapkit.MarkerAnnotation(
            new mapkit.Coordinate(pin.lat, pin.lng),
            {
              title: pin.title,
              subtitle: pin.subtitle || '',
              color: pin.color,
              glyphText: pin.glyphText || '•',
            }
          );
          if (onPinSelectRef.current) {
            const cb = onPinSelectRef.current;
            a.addEventListener('select', () => cb(pin.id));
          }
          return a;
        });
        map.addAnnotations(annotations);
        annotationsRef.current = annotations;

        if (annotations.length > 1) {
          map.showItems(annotations, {
            animate: true,
            padding: new mapkit.Padding(30, 30, 30, 30),
            minimumSpan: new mapkit.CoordinateSpan(0.02, 0.02),
          });
        } else if (annotations.length === 1) {
          map.setCenterAnimated(annotations[0].coordinate);
          map.setCameraDistanceAnimated(8000);
        }
      }

      setIsLoaded(true);
    });

    return () => { cancelled = true; };
  }, [enabled]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!isLoaded || !mapInstanceRef.current) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mapkit = (window as any).mapkit;
    if (!mapkit) return;

    const map = mapInstanceRef.current;

    if (annotationsRef.current.length > 0) {
      map.removeAnnotations(annotationsRef.current);
    }

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

    // Auto-fit map to show all pins with padding
    if (newAnnotations.length > 1) {
      map.showItems(newAnnotations, {
        animate: true,
        padding: new mapkit.Padding(30, 30, 30, 30),
        minimumSpan: new mapkit.CoordinateSpan(0.02, 0.02),
      });
    } else if (newAnnotations.length === 1) {
      map.setCenterAnimated(newAnnotations[0].coordinate);
      map.setCameraDistanceAnimated(8000);
    }
  }, [isLoaded, pins, onPinSelect]);

  // Effect to handle mobile map toggle
  useEffect(() => {
    if (!isLoaded || !mapInstanceRef.current) return;
    // Trigger resize event so MapKit recalculates viewport
    window.dispatchEvent(new Event('resize'));
    // Then re-fit to pins after two animation frames (ensures layout is complete)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mapkit = (window as any).mapkit;
        const map = mapInstanceRef.current;
        if (!mapkit || !map) return;
        if (annotationsRef.current.length > 1) {
          map.showItems(annotationsRef.current, {
            animate: true,
            padding: new mapkit.Padding(30, 30, 30, 30),
            minimumSpan: new mapkit.CoordinateSpan(0.02, 0.02),
          });
        } else if (annotationsRef.current.length === 1) {
          map.setCenterAnimated(annotationsRef.current[0].coordinate);
          map.setCameraDistanceAnimated(8000);
        }
      });
    });
  }, [isLoaded, showMobileMap]);

  const centerOn = useCallback((lat: number, lng: number, distance?: number) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mapkit = (window as any).mapkit;
    if (!mapkit || !mapInstanceRef.current) return;
    const map = mapInstanceRef.current;
    const coord = new mapkit.Coordinate(lat, lng);
    if (distance) {
      // Single animated region change (smooth zoom + pan in one motion)
      const spanDeg = distance / 111000;
      const region = new mapkit.CoordinateRegion(coord, new mapkit.CoordinateSpan(spanDeg, spanDeg));
      map.setRegionAnimated(region);
    } else {
      map.setCenterAnimated(coord);
    }
  }, []);

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

export function useInlineMap(lat: number, lng: number, enabled: boolean) {
  return useAppleMap({
    center: { lat, lng },
    zoom: 3000,
    pins: [{ id: 'loc', lat, lng, title: '', color: '#e53935', glyphText: '•' }],
    enabled,
  });
}
