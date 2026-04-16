"use client";

import { useState, useEffect, useCallback } from "react";
import { Bell, MapPin, Contact, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type PromptStep = "contacts" | "notifications" | "location" | "done";

// Check if Contact Picker API is available (Chrome Android, some mobile browsers)
function hasContactsAPI(): boolean {
  return "contacts" in navigator && "ContactsManager" in window;
}

export function PermissionPrompts() {
  const [step, setStep] = useState<PromptStep>("done");
  const [visible, setVisible] = useState(false);

  // Determine the next step after the current one
  const getNextStep = useCallback(
    async (after: PromptStep): Promise<PromptStep> => {
      if (after === "contacts") {
        // Check notifications
        const notificationsGranted =
          "Notification" in window && Notification.permission === "granted";
        if (!notificationsGranted) return "notifications";
        // Fall through to check location
      }
      if (after === "contacts" || after === "notifications") {
        // Check location
        try {
          if (navigator.permissions) {
            const geo = await navigator.permissions.query({
              name: "geolocation",
            });
            if (geo.state !== "granted") return "location";
          } else {
            return "location";
          }
        } catch {
          return "location";
        }
      }
      return "done";
    },
    []
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Only show prompts once per session (when app first opens)
    if (sessionStorage.getItem("scooped-permissions-shown")) return;

    const checkPermissions = async () => {
      const contactsShared = localStorage.getItem("scooped-contacts-shared");

      const notificationsGranted =
        "Notification" in window && Notification.permission === "granted";

      let locationGranted = false;
      try {
        if (navigator.permissions) {
          const geo = await navigator.permissions.query({
            name: "geolocation",
          });
          locationGranted = geo.state === "granted";
        }
      } catch {
        // Permissions API not supported
      }

      // Determine first step
      let firstStep: PromptStep = "done";
      if (!contactsShared) {
        firstStep = "contacts";
      } else if (!notificationsGranted) {
        firstStep = "notifications";
      } else if (!locationGranted) {
        firstStep = "location";
      }

      if (firstStep === "done") return;

      // Wait for splash overlay to finish (~4s) plus a small buffer
      const splashShown = sessionStorage.getItem("scooped-splash-shown");
      const delay = splashShown ? 4800 : 800;

      const timer = setTimeout(() => {
        sessionStorage.setItem("scooped-permissions-shown", "true");
        setStep(firstStep);
        setVisible(true);
      }, delay);

      return () => clearTimeout(timer);
    };

    checkPermissions();
  }, []);

  const handleContacts = useCallback(async () => {
    try {
      if (hasContactsAPI()) {
        // Use Contact Picker API on supported devices
        const contacts = await (navigator as any).contacts.select(
          ["name", "email", "tel"],
          { multiple: true }
        );
        // TODO: send contacts to backend for matching
        console.log("Contacts selected:", contacts?.length ?? 0);
      }
    } catch {
      // User cancelled or API not supported
    }
    localStorage.setItem("scooped-contacts-shared", "true");
    const next = await getNextStep("contacts");
    if (next === "done") {
      setStep("done");
      setVisible(false);
    } else {
      setStep(next);
    }
  }, [getNextStep]);

  const handleNotifications = useCallback(async () => {
    try {
      if ("Notification" in window) {
        await Notification.requestPermission();
      }
    } catch {
      // Permission denied or not supported
    }
    const next = await getNextStep("notifications");
    if (next === "done") {
      setStep("done");
      setVisible(false);
    } else {
      setStep(next);
    }
  }, [getNextStep]);

  const handleLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {},
        () => {},
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }
    setStep("done");
    setVisible(false);
  }, []);

  const handleSkip = useCallback(async () => {
    if (step === "contacts") {
      localStorage.setItem("scooped-contacts-shared", "true");
    }
    const next = await getNextStep(step);
    if (next === "done") {
      setStep("done");
      setVisible(false);
    } else {
      setStep(next);
    }
  }, [step, getNextStep]);

  const handleDismiss = useCallback(() => {
    if (step === "contacts") {
      localStorage.setItem("scooped-contacts-shared", "true");
    }
    setStep("done");
    setVisible(false);
  }, [step]);

  if (!visible || step === "done") return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-sm rounded-3xl bg-white dark:bg-card overflow-hidden elevation-3 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        {/* Gradient top bar */}
        <div className="h-1.5 bg-gradient-to-r from-[#F46B8F] via-[#F2B45A] to-[#2E1F1B]" />

        {/* Dismiss */}
        <button
          type="button"
          onClick={handleDismiss}
          className="absolute top-4 right-4 p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        >
          <X className="size-4" />
        </button>

        <div className="px-6 pt-8 pb-6 text-center">
          {step === "contacts" && (
            <>
              <div className="mx-auto mb-4 flex items-center justify-center size-16 rounded-full bg-gradient-to-br from-[#F2B45A] via-[#F46B8F] to-[#2E1F1B]">
                <Contact className="size-7 text-white" />
              </div>
              <h2 className="text-xl font-bold mb-2">Find your friends</h2>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                Allow access to your contacts to find friends already on
                Scooped and see what they&apos;re scooping.
              </p>
              <Button
                variant="brand-gradient"
                className="w-full h-12 text-base rounded-xl mb-3"
                onClick={handleContacts}
              >
                Allow Contacts
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

          {step === "notifications" && (
            <>
              <div className="mx-auto mb-4 flex items-center justify-center size-16 rounded-full bg-gradient-to-br from-[#F46B8F] via-[#F2B45A] to-[#2E1F1B]">
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
          )}

          {step === "location" && (
            <>
              <div className="mx-auto mb-4 flex items-center justify-center size-16 rounded-full bg-gradient-to-br from-[#2E1F1B] via-[#F2B45A] to-[#F46B8F]">
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
