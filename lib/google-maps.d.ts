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
                  short_name: string;
                  types: string[];
                }>;
              }> | null,
              status: string
            ) => void
          ) => void;
        };
        places: {
          Autocomplete: new (
            input: HTMLInputElement,
            opts?: {
              types?: string[];
              componentRestrictions?: { country: string };
              bounds?: unknown;
              strictBounds?: boolean;
              fields?: string[];
            }
          ) => {
            addListener: (event: string, handler: () => void) => void;
            getPlace: () => {
              formatted_address?: string;
              address_components?: Array<{
                long_name: string;
                short_name: string;
                types: string[];
              }>;
            };
            setBounds: (bounds: unknown) => void;
          };
        };
        LatLngBounds: new (sw: unknown, ne: unknown) => unknown;
        LatLng: new (lat: number, lng: number) => unknown;
      };
    };
  }
}

export {};
