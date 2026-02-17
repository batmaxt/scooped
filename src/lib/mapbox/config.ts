export const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

export const DEFAULT_CENTER = {
  longitude: -73.985,
  latitude: 40.748,
} as const;

export const DEFAULT_ZOOM = 12;

export const MAP_STYLE = "mapbox://styles/mapbox/light-v11";
export const MAP_STYLE_SATELLITE = "mapbox://styles/mapbox/satellite-streets-v12";
