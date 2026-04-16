import { create } from "zustand";

interface MapState {
  viewport: {
    longitude: number;
    latitude: number;
    zoom: number;
  };
  selectedLocationId: string | null;
  filters: {
    locationTypes: string[];
    searchQuery: string;
  };
  setViewport: (viewport: MapState["viewport"]) => void;
  setSelectedLocationId: (id: string | null) => void;
  setFilters: (filters: Partial<MapState["filters"]>) => void;
  resetFilters: () => void;
}

const DEFAULT_FILTERS = {
  locationTypes: [],
  searchQuery: "",
};

export const useMapStore = create<MapState>((set) => ({
  viewport: {
    longitude: -73.985,
    latitude: 40.748,
    zoom: 12,
  },
  selectedLocationId: null,
  filters: { ...DEFAULT_FILTERS },
  setViewport: (viewport) => set({ viewport }),
  setSelectedLocationId: (id) => set({ selectedLocationId: id }),
  setFilters: (filters) =>
    set((state) => ({
      filters: { ...state.filters, ...filters },
    })),
  resetFilters: () => set({ filters: { ...DEFAULT_FILTERS } }),
}));
