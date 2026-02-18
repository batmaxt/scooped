"use client";

import { useCallback, useRef, useState, useEffect, Component, type ReactNode } from "react";
import Map, { Marker, NavigationControl, GeolocateControl } from "react-map-gl/mapbox";
import type { MapRef, ViewStateChangeEvent } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { MAPBOX_TOKEN, MAP_STYLE, MAP_STYLE_SATELLITE, DEFAULT_CENTER, DEFAULT_ZOOM } from "@/lib/mapbox/config";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useMapStore } from "@/stores/mapStore";
import type { Location } from "@/types/models";
import { LocationMarker } from "./LocationMarker";

interface MapViewProps {
  locations: Location[];
  onMarkerClick: (location: Location) => void;
  userPosition?: { latitude: number; longitude: number } | null;
}

// Error boundary to catch WebGL failures
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

function MapFallback({ locations, onMarkerClick }: { locations: Location[]; onMarkerClick: (location: Location) => void }) {
  return (
    <div className="w-full h-full bg-neutral-50 flex flex-col items-center justify-center p-4">
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4 max-w-sm text-center">
        <p className="text-sm text-yellow-800 font-medium">Map unavailable</p>
        <p className="text-xs text-yellow-600 mt-1">
          WebGL is required for the map. Try enabling hardware acceleration in Chrome Settings → System.
        </p>
      </div>
      <p className="text-sm text-neutral-500 mb-2">
        {locations.length} locations found — tap to view
      </p>
    </div>
  );
}

function MapInner({ locations, onMarkerClick, userPosition }: MapViewProps) {
  const mapRef = useRef<MapRef>(null);
  const { setViewport, selectedLocationId } = useMapStore();
  const [satelliteMap] = useLocalStorage("scooped:satelliteMap", false);
  const [webglSupported, setWebglSupported] = useState(true);
  const hasCenteredOnUser = useRef(false);

  // Check WebGL support before rendering map
  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) {
        setWebglSupported(false);
      }
    } catch {
      setWebglSupported(false);
    }
  }, []);

  // Fly to user position when it becomes available (after async geolocation)
  useEffect(() => {
    if (userPosition && !hasCenteredOnUser.current && mapRef.current) {
      hasCenteredOnUser.current = true;
      mapRef.current.flyTo({
        center: [userPosition.longitude, userPosition.latitude],
        zoom: DEFAULT_ZOOM,
        duration: 1500,
      });
    }
  }, [userPosition]);

  const handleMove = useCallback(
    (evt: ViewStateChangeEvent) => {
      setViewport({
        longitude: evt.viewState.longitude,
        latitude: evt.viewState.latitude,
        zoom: evt.viewState.zoom,
      });
    },
    [setViewport]
  );

  const initialViewState = userPosition
    ? { ...userPosition, zoom: DEFAULT_ZOOM }
    : { ...DEFAULT_CENTER, zoom: DEFAULT_ZOOM };

  // If we already have user position at mount time, mark as centered
  if (userPosition && !hasCenteredOnUser.current) {
    hasCenteredOnUser.current = true;
  }

  if (!webglSupported) {
    return <MapFallback locations={locations} onMarkerClick={onMarkerClick} />;
  }

  return (
    <Map
      ref={mapRef}
      mapboxAccessToken={MAPBOX_TOKEN}
      initialViewState={initialViewState}
      style={{ width: "100%", height: "100%" }}
      mapStyle={satelliteMap ? MAP_STYLE_SATELLITE : MAP_STYLE}
      onMove={handleMove}
      attributionControl={false}
    >
      <GeolocateControl position="bottom-right" trackUserLocation />
      <NavigationControl position="bottom-right" showCompass={false} />

      {locations.map((location) => (
        <Marker
          key={location.id}
          longitude={location.longitude}
          latitude={location.latitude}
          anchor="bottom"
          onClick={(e) => {
            e.originalEvent.stopPropagation();
            onMarkerClick(location);
          }}
        >
          <LocationMarker
            locationType={location.location_type}
            isSelected={selectedLocationId === location.id}
          />
        </Marker>
      ))}
    </Map>
  );
}

export function MapView(props: MapViewProps) {
  return (
    <MapErrorBoundary fallback={<MapFallback locations={props.locations} onMarkerClick={props.onMarkerClick} />}>
      <MapInner {...props} />
    </MapErrorBoundary>
  );
}
