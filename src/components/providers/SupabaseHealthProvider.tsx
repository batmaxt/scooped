"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { IceCreamCone } from "lucide-react";

type HealthState = "checking" | "up" | "down";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const PING_TIMEOUT_MS = 6000;
const RETRY_INTERVAL_S = 8;

// A paused/unreachable Supabase project doesn't respond at all, so any HTTP
// response (even 4xx) counts as "reachable".
async function pingSupabase(): Promise<boolean> {
  if (!SUPABASE_URL) return true;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), PING_TIMEOUT_MS);
  try {
    await fetch(`${SUPABASE_URL}/auth/v1/health`, {
      method: "GET",
      signal: controller.signal,
      cache: "no-store",
      headers: SUPABASE_ANON_KEY ? { apikey: SUPABASE_ANON_KEY } : undefined,
    });
    return true;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}

// Dev-only escape hatch: ?skip-health lets us preview static pages while
// the database is down. Never active in production builds.
function devBypass(): boolean {
  return (
    process.env.NODE_ENV === "development" &&
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).has("skip-health")
  );
}

export function SupabaseHealthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [health, setHealth] = useState<HealthState>("checking");
  const [countdown, setCountdown] = useState(RETRY_INTERVAL_S);
  const [downSince, setDownSince] = useState<number | null>(null);
  const wasDown = useRef(false);
  const checking = useRef(false);

  const check = useCallback(async () => {
    if (checking.current) return;
    checking.current = true;
    const ok = await pingSupabase();
    checking.current = false;
    if (ok) {
      if (wasDown.current) {
        // Recovered from an outage — reload for a clean slate so every
        // query that failed while down refetches properly.
        window.location.reload();
        return;
      }
      setHealth("up");
    } else {
      wasDown.current = true;
      setDownSince((prev) => prev ?? Date.now());
      setHealth("down");
      setCountdown(RETRY_INTERVAL_S);
    }
  }, []);

  useEffect(() => {
    check();
  }, [check]);

  // Countdown ticker + auto-retry while down
  useEffect(() => {
    if (health !== "down") return;
    const tick = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          check();
          return RETRY_INTERVAL_S;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(tick);
  }, [health, check]);

  if (health === "down" && !devBypass()) {
    const waitedLong = downSince !== null && Date.now() - downSince > 75_000;
    return (
      <div
        className="fixed inset-0 z-[10000] flex flex-col items-center justify-center px-8 text-center select-none"
        style={{ background: "linear-gradient(to bottom, #b6ded3, #b3dbd0)" }}
      >
        <div className="animate-brand-bob flex items-center justify-center size-24 rounded-full bg-white/70 mb-8 elevation-2">
          <IceCreamCone className="size-12 text-[#C4364A]" aria-hidden />
        </div>
        <h1 className="text-2xl font-bold font-heading text-[#2E1F1B] mb-2">
          Scooped is waking up…
        </h1>
        <p className="text-[15px] text-[#2E1F1B]/70 max-w-[28ch] mb-10 leading-relaxed">
          {waitedLong
            ? "Taking longer than usual. Hang tight — we're still trying."
            : "The freezer is warming up the servers. This usually takes under a minute."}
        </p>

        <p className="text-sm text-[#2E1F1B]/60">
          Retrying in {countdown}s&ensp;·&ensp;
          <button
            onClick={check}
            className="font-semibold text-[#2E1F1B] underline underline-offset-2 touch-manipulation"
          >
            Try now
          </button>
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
