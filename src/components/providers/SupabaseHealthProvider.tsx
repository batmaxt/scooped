"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, RefreshCw } from "lucide-react";

type HealthState = "checking" | "up" | "down";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const PING_TIMEOUT_MS = 6000;
const RETRY_INTERVAL_MS = 6000;

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
    });
    return true;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}

export function SupabaseHealthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [health, setHealth] = useState<HealthState>("checking");
  const [retrying, setRetrying] = useState(false);
  const wasDown = useRef(false);

  const check = useCallback(async () => {
    const ok = await pingSupabase();
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
      setHealth("down");
    }
  }, []);

  useEffect(() => {
    check();
  }, [check]);

  // Auto-retry loop while down
  useEffect(() => {
    if (health !== "down") return;
    const interval = setInterval(check, RETRY_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [health, check]);

  const manualRetry = useCallback(async () => {
    setRetrying(true);
    await check();
    setRetrying(false);
  }, [check]);

  if (health === "down") {
    return (
      <div
        className="fixed inset-0 z-[10000] flex flex-col items-center justify-center px-8 text-center"
        style={{ background: "linear-gradient(to bottom, #b6ded3, #b3dbd0)" }}
      >
        <div className="text-7xl mb-6 animate-bounce" aria-hidden>
          🍦
        </div>
        <h1 className="text-2xl font-bold font-heading text-[#2E1F1B] mb-2">
          Scooped is waking up…
        </h1>
        <p className="text-sm text-[#2E1F1B]/70 max-w-xs mb-8 leading-relaxed">
          Our freezer is warming up the servers. This usually takes under a
          minute — we&apos;ll get you scooping the moment it&apos;s ready.
        </p>

        <div className="flex items-center gap-2 text-[#2E1F1B]/60 text-xs mb-6">
          <Loader2 className="size-3.5 animate-spin" />
          Checking again automatically…
        </div>

        <button
          onClick={manualRetry}
          disabled={retrying}
          className="inline-flex items-center gap-2 h-12 px-8 rounded-full bg-[#C4364A] text-white text-sm font-semibold active:scale-[0.98] transition-transform disabled:opacity-60"
        >
          {retrying ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <RefreshCw className="size-4" />
          )}
          Try now
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
