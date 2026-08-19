"use client";

import { useState } from "react";
import { monogramGradient } from "@/lib/location-utils";

// Google Places photo references need the /media suffix and an API key to
// resolve to an actual image.
function resolvePhotoUrl(photoUrl: string): string {
  if (photoUrl.startsWith("https://places.googleapis.com/")) {
    const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    const base = photoUrl.endsWith("/media") ? photoUrl : `${photoUrl}/media`;
    return `${base}?maxHeightPx=600&maxWidthPx=800&key=${key}`;
  }
  return photoUrl;
}

interface LocationPhotoProps {
  name: string;
  photoUrl?: string | null;
  /** Tailwind classes for the monogram letter, e.g. "text-lg" or "text-5xl" */
  letterClass?: string;
}

// Renders the location's real photo when available, and falls back to a warm
// branded monogram tile when there's no photo or it fails to load.
export function LocationPhoto({
  name,
  photoUrl,
  letterClass = "text-lg",
}: LocationPhotoProps) {
  const [failed, setFailed] = useState(false);
  const [from, to] = monogramGradient(name);

  if (!photoUrl || failed) {
    return (
      <div
        className="w-full h-full flex items-center justify-center"
        style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
      >
        <span
          className={`font-bold font-heading text-white/90 select-none ${letterClass}`}
        >
          {name[0]}
        </span>
      </div>
    );
  }

  return (
    <img
      src={resolvePhotoUrl(photoUrl)}
      alt={name}
      className="w-full h-full object-cover"
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}
