export interface LocationCoords {
  latitude: number;
  longitude: number;
}

export interface PlaceSuggestion {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

export interface PlaceDetails {
  address: string;
  coords: LocationCoords;
  city?: string;
  state?: string;
  zipCode?: string;
}

export interface LocationState {
  coords: LocationCoords;
  address: string;
  loading: boolean;
  error: string | null;
}

export interface LocationSelectResult {
  address: string;
  latitude: number;
  longitude: number;
}

export interface LocationPickerProps {
  value?: string;
  placeholder?: string;
  onSelect: (location: LocationSelectResult) => void;
}