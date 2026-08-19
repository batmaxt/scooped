"use client";

import {
  useCallback,
  useRef,
  useEffect,
  useState,
  Component,
  type ReactNode,
} from "react";
import { APIProvider, Map, AdvancedMarker, useMap } from "@vis.gl/react-google-maps";
import type { MapCameraChangedEvent } from "@vis.gl/react-google-maps";
import { MarkerClusterer, SuperClusterAlgorithm } from "@googlemaps/markerclusterer";
import type { Marker } from "@googlemaps/markerclusterer";
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

// Warm brand-colored cluster bubbles instead of Google's default blue
function clusterRenderer() {
  return {
    render: (
      { count, position }: { count: number; position: google.maps.LatLng },
    ) => {
      const el = document.createElement("div");
      const size = count < 10 ? 34 : count < 100 ? 40 : 46;
      el.style.cssText = `
        width:${size}px;height:${size}px;border-radius:9999px;
        background:#C4364A;color:#fff;display:flex;align-items:center;
        justify-content:center;font-weight:700;font-size:12px;
        box-shadow:0 2px 8px rgba(46,31,27,.3);border:2px solid rgba(255,255,255,.9);
        cursor:pointer;`;
      el.textContent = String(count);
      return new google.maps.marker.AdvancedMarkerElement({
        position,
        content: el,
        zIndex: 1000 + count,
      });
    },
  };
}

function ClusteredMarkers({
  locations,
  onMarkerClick,
}: {
  locations: Location[];
  onMarkerClick: (location: Location) => void;
}) {
  const map = useMap();
  const { selectedLocationId } = useMapStore();
  const [markers, setMarkers] = useState<Record<string, Marker>>({});
  const clusterer = useRef<MarkerClusterer | null>(null);

  useEffect(() => {
    if (!map || clusterer.current) return;
    clusterer.current = new MarkerClusterer({
      map,
      renderer: clusterRenderer(),
      algorithm: new SuperClusterAlgorithm({ radius: 120, maxZoom: 15 }),
    });
    return () => {
      clusterer.current?.clearMarkers();
      clusterer.current = null;
    };
  }, [map]);

  useEffect(() => {
    if (!clusterer.current) return;
    clusterer.current.clearMarkers();
    clusterer.current.addMarkers(Object.values(markers));
  }, [markers]);

  // Stable ref callbacks per location id — a fresh inline ref each render
  // makes React detach/reattach every marker on every render, which loops.
  const refCallbacks = useRef<Record<string, (m: Marker | null) => void>>({});
  const getMarkerRef = useCallback((id: string) => {
    if (!refCallbacks.current[id]) {
      refCallbacks.current[id] = (marker: Marker | null) => {
        setMarkers((prev) => {
          if (marker) {
            if (prev[id] === marker) return prev;
            return { ...prev, [id]: marker };
          }
          if (!(id in prev)) return prev;
          const next = { ...prev };
          delete next[id];
          return next;
        });
      };
    }
    return refCallbacks.current[id];
  }, []);

  return (
    <>
      {locations.map((location) => (
        <AdvancedMarker
          key={location.id}
          position={{ lat: location.latitude, lng: location.longitude }}
          onClick={() => onMarkerClick(location)}
          ref={getMarkerRef(location.id)}
        >
          <LocationMarker
            locationType={location.location_type}
            isSelected={selectedLocationId === location.id}
          />
        </AdvancedMarker>
      ))}
    </>
  );
}

function MapInner({ locations, onMarkerClick, userPosition }: MapViewProps) {
  const map = useMap();
  const { setViewport } = useMapStore();
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
      colorScheme="LIGHT"
      gestureHandling="greedy"
      disableDefaultUI={false}
      zoomControl={true}
      fullscreenControl={false}
      streetViewControl={false}
      mapTypeControl={false}
      style={{ width: "100%", height: "100%" }}
      onCameraChanged={handleCameraChanged}
    >
      <ClusteredMarkers locations={locations} onMarkerClick={onMarkerClick} />
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
