"use client";

import { useState, useEffect, useCallback } from "react";

interface GeoPosition {
  latitude: number;
  longitude: number;
}

interface UseLocationReturn {
  position: GeoPosition | null;
  error: string | null;
  isLoading: boolean;
  requestLocation: () => void;
}

const STORAGE_KEY = "scooped:userPosition";
const MAX_AGE_MS = 10 * 60 * 1000; // 10 minutes

function getCachedPosition(): GeoPosition | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const cached = JSON.parse(raw);
    if (Date.now() - cached.timestamp > MAX_AGE_MS) {
      sessionStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return { latitude: cached.latitude, longitude: cached.longitude };
  } catch {
    return null;
  }
}

function cachePosition(pos: GeoPosition) {
  try {
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...pos, timestamp: Date.now() })
    );
  } catch {
    // sessionStorage not available — ignore
  }
}

export function useLocation(): UseLocationReturn {
  const [position, setPosition] = useState<GeoPosition | null>(
    () => getCachedPosition()
  );
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newPos = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        };
        setPosition(newPos);
        cachePosition(newPos);
        setIsLoading(false);
      },
      (err) => {
        setError(err.message);
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5 * 60 * 1000, // 5 minutes
      }
    );
  }, []);

  useEffect(() => {
    // Only prompt for location if we don't have a cached position
    if (!getCachedPosition()) {
      requestLocation();
    }
  }, [requestLocation]);

  return { position, error, isLoading, requestLocation };
}
