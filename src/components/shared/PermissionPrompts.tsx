"use client";

import { useState, useEffect, useCallback } from "react";
import { Bell, MapPin, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "scooped-permissions-prompted";

type PromptStep = "notifications" | "location" | "done";

export function PermissionPrompts() {
  const [step, setStep] = useState<PromptStep>("done");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only show once
    if (typeof window === "undefined") return;
    const alreadyPrompted = localStorage.getItem(STORAGE_KEY);
    if (alreadyPrompted) return;

    // Small delay so the page settles first
    const timer = setTimeout(() => {
      setStep("notifications");
      setVisible(true);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const handleNotifications = useCallback(async () => {
    try {
      if ("Notification" in window) {
        await Notification.requestPermission();
      }
    } catch {
      // Permission denied or not supported
    }
    setStep("location");
  }, []);

  const handleLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {}, // success — no-op, useLocation hook picks it up
        () => {}, // error — no-op
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }
    localStorage.setItem(STORAGE_KEY, "true");
    setStep("done");
    setVisible(false);
  }, []);

  const handleSkip = useCallback(() => {
    if (step === "notifications") {
      setStep("location");
    } else {
      localStorage.setItem(STORAGE_KEY, "true");
      setStep("done");
      setVisible(false);
    }
  }, [step]);

  const handleDismiss = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, "true");
    setStep("done");
    setVisible(false);
  }, []);

  if (!visible || step === "done") return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-sm rounded-3xl bg-white dark:bg-card overflow-hidden elevation-3 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        {/* Gradient top bar */}
        <div className="h-1.5 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400" />

        {/* Dismiss */}
        <button
          type="button"
          onClick={handleDismiss}
          className="absolute top-4 right-4 p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        >
          <X className="size-4" />
        </button>

        <div className="px-6 pt-8 pb-6 text-center">
          {step === "notifications" ? (
            <>
              <div className="mx-auto mb-4 flex items-center justify-center size-16 rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-cyan-400">
                <Bell className="size-7 text-white" />
              </div>
              <h2 className="text-xl font-bold mb-2">Stay in the loop</h2>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                Get notified when friends check in, like your scoops, or when
                new flavors drop nearby.
              </p>
              <Button
                variant="brand-gradient"
                className="w-full h-12 text-base rounded-xl mb-3"
                onClick={handleNotifications}
              >
                Enable Notifications
              </Button>
              <button
                type="button"
                onClick={handleSkip}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Maybe later
              </button>
            </>
          ) : (
            <>
              <div className="mx-auto mb-4 flex items-center justify-center size-16 rounded-full bg-gradient-to-br from-cyan-400 via-teal-400 to-emerald-400">
                <MapPin className="size-7 text-white" />
              </div>
              <h2 className="text-xl font-bold mb-2">Find scoops near you</h2>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                Allow location access to discover ice cream shops, see what
                flavors are available, and check in at your favorites.
              </p>
              <Button
                variant="brand-gradient"
                className="w-full h-12 text-base rounded-xl mb-3"
                onClick={handleLocation}
              >
                Enable Location
              </Button>
              <button
                type="button"
                onClick={handleSkip}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Maybe later
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
