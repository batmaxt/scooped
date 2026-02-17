"use client";

import { useState, useEffect, useCallback } from "react";

/**
 * SSR-safe localStorage hook.
 * Returns `defaultValue` during SSR / first render, then hydrates from localStorage.
 */
export function useLocalStorage<T>(
  key: string,
  defaultValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(defaultValue);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item !== null) {
        setStoredValue(JSON.parse(item));
      }
    } catch {
      // localStorage unavailable or bad JSON — keep default
    }
    setHydrated(true);
  }, [key]);

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const nextValue =
          value instanceof Function ? value(prev) : value;
        try {
          window.localStorage.setItem(key, JSON.stringify(nextValue));
        } catch {
          // quota exceeded or unavailable — silently fail
        }
        return nextValue;
      });
    },
    [key]
  );

  return [hydrated ? storedValue : defaultValue, setValue];
}
