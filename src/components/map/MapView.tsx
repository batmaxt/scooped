"use client";

import { useCallback, useRef, useEffect, Component, type ReactNode } from "react";
import { APIProvider, Map, AdvancedMarker, useMap } from "@vis.gl/react-google-maps";
import type { MapCameraChangedEvent } from "@vis.gl/react-google-maps";
import { GOOGLE_MAPS_API_KEY, GOOGLE_MAP_ID, DEFAULT_CENTER, DEFAULT_ZOOM } from "@/lib/google-maps/config";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useMapStore } from "@/stores/mapStore";
import type { Location } from "@/types/models";
import { LocationMarker } from "./LocationMarker";

interface MapViewProps {
  locations: Location[];
  onMarkerClick: (location: Location) => void;
  userPosition?: { latitude: number; longitude: number } | null;
}

// Error boundary to catch rendering failures
class MapErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode; fallback: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

function MapFallback({ locations }: { locations: Location[] }) {
  return (
    <div className="w-full h-full bg-neutral-50 flex flex-col items-center justify-center p-4">
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4 max-w-sm text-center">
        <p className="text-sm text-yellow-800 font-medium">Map unavailable</p>
        <p className="text-xs text-yellow-600 mt-1">
          Could not load Google Maps. Please check your connection.
        </p>
      </div>
      <p className="text-sm text-neutral-500 mb-2">
        {locations.length} locations found — tap to view
      </p>
    </div>
  );
}

function MapInner({ locations, onMarkerClick, userPosition }: MapViewProps) {
  const map = useMap();
  const { setViewport, selectedLocationId } = useMapStore();
  const [satelliteMap] = useLocalStorage("scooped:satelliteMap", false);
  const hasCenteredOnUser = useRef(false);

  // Pan to user position when it becomes available
  useEffect(() => {
    if (userPosition && !hasCenteredOnUser.current && map) {
      hasCenteredOnUser.current = true;
      map.panTo({ lat: userPosition.latitude, lng: userPosition.longitude });
      map.setZoom(DEFAULT_ZOOM);
    }
  }, [userPosition, map]);

  // Handle satellite toggle changes
  useEffect(() => {
    if (map) {
      map.setMapTypeId(satelliteMap ? "hybrid" : "roadmap");
    }
  }, [satelliteMap, map]);

  const handleCameraChanged = useCallback(
    (ev: MapCameraChangedEvent) => {
      const center = ev.detail.center;
      const zoom = ev.detail.zoom;
      setViewport({
        longitude: center.lng,
        latitude: center.lat,
        zoom,
      });
    },
    [setViewport]
  );

  const initialCenter = userPosition
    ? { lat: userPosition.latitude, lng: userPosition.longitude }
    : DEFAULT_CENTER;

  // If we already have user position at mount time, mark as centered
  if (userPosition && !hasCenteredOnUser.current) {
    hasCenteredOnUser.current = true;
  }

  return (
    <Map
      defaultCenter={initialCenter}
      defaultZoom={DEFAULT_ZOOM}
      mapId={GOOGLE_MAP_ID}
      gestureHandling="greedy"
      disableDefaultUI={false}
      zoomControl={true}
      fullscreenControl={false}
      streetViewControl={false}
      mapTypeControl={false}
      style={{ width: "100%", height: "100%" }}
      onCameraChanged={handleCameraChanged}
    >
      {locations.map((location) => (
        <AdvancedMarker
          key={location.id}
          position={{ lat: location.latitude, lng: location.longitude }}
          onClick={() => onMarkerClick(location)}
        >
          <LocationMarker
            locationType={location.location_type}
            isSelected={selectedLocationId === location.id}
          />
        </AdvancedMarker>
      ))}
    </Map>
  );
}

export function MapView(props: MapViewProps) {
  return (
    <MapErrorBoundary fallback={<MapFallback locations={props.locations} />}>
      <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
        <MapInner {...props} />
      </APIProvider>
    </MapErrorBoundary>
  );
}
