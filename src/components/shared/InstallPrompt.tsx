"use client";

import { useState, useEffect } from "react";
import { IceCreamCone, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Don't show if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) return;
    // Don't show if dismissed
    if (localStorage.getItem("scooped:install-dismissed")) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShow(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShow(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    localStorage.setItem("scooped:install-dismissed", "1");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-40 animate-in slide-in-from-bottom-4 duration-300">
      <div className="bg-white dark:bg-card rounded-2xl p-4 border border-[rgba(93,64,55,0.12)] dark:border-white/5 elevation-2 flex items-center gap-3">
        <div className="flex items-center justify-center size-10 rounded-full bg-gradient-to-br from-[#F46B8F] to-[#C4364A] shrink-0">
          <IceCreamCone className="size-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm text-[#2E1F1B] dark:text-[#F5E6DC]">Add to Home Screen</p>
          <p className="text-xs text-[#8C6F66] dark:text-[#A8897E]">Quick access to Scooped</p>
        </div>
        <button
          onClick={handleInstall}
          className="shrink-0 px-4 py-2 rounded-full bg-[#C4364A] text-white text-xs font-semibold btn-shadow-cta"
        >
          Install
        </button>
        <button onClick={handleDismiss} className="shrink-0 p-1 text-[#8C6F66]">
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
}
