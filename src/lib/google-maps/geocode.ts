export interface GeocodeFeature {
  name: string;
  full_address: string;
  latitude: number;
  longitude: number;
  place_id: string;
}

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

/**
 * Forward geocode an address query using Google Geocoding API.
 * Returns up to 5 address/place suggestions.
 */
export async function geocodeForward(
  query: string
): Promise<GeocodeFeature[]> {
  if (!API_KEY || query.trim().length < 3) return [];

  const params = new URLSearchParams({
    address: query,
    key: API_KEY,
    components: "country:US",
    language: "en",
  });

  try {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?${params}`
    );
    if (!res.ok) return [];

    const data = await res.json();
    const results = data.results || [];

    return results.slice(0, 5).map(
      (r: {
        address_components: { long_name: string }[];
        formatted_address: string;
        geometry: { location: { lat: number; lng: number } };
        place_id: string;
      }) => ({
        name: r.address_components?.[0]?.long_name || r.formatted_address,
        full_address: r.formatted_address,
        latitude: r.geometry.location.lat,
        longitude: r.geometry.location.lng,
        place_id: r.place_id,
      })
    );
  } catch {
    return [];
  }
}
