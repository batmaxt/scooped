"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export function SplashOverlay() {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("scooped-splash-shown")) return;
    setVisible(true);
  }, []);

  const handleDismiss = () => {
    setExiting(true);
    sessionStorage.setItem("scooped-splash-shown", "1");
    setTimeout(() => setVisible(false), 500);
  };

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-between transition-opacity duration-500 ${
        exiting ? "opacity-0" : "opacity-100"
      }`}
      style={{ background: "linear-gradient(to bottom, #b6ded3, #b3dbd0)" }}
    >
      {/* Center content — the cone image at full resolution */}
      <div className="splash-logo-enter flex flex-col items-center w-full flex-1 px-6">
        <div className="relative w-full h-full max-w-sm">
          <Image
            src="/images/splash-cone.png"
            alt="Scooped — ice cream cone with cherry"
            fill
            sizes="(max-width: 384px) 100vw, 384px"
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* Headline */}
      <h1
        className="splash-text-enter mt-2 text-2xl font-bold uppercase tracking-wider text-[#2E1F1B] text-center px-8 leading-snug font-heading"
        style={{ animationDelay: "0.4s" }}
      >
        Find Your Favorite Flavors
      </h1>

      {/* Spacer middle */}
      <div className="min-h-[20px]" />

      {/* Bottom CTA */}
      <div
        className="splash-text-enter w-full px-8 pb-10 flex flex-col items-center gap-3"
        style={{ animationDelay: "0.7s" }}
      >
        <button
          onClick={handleDismiss}
          className="w-full max-w-sm h-14 rounded-full bg-[#C4364A] text-white text-lg font-semibold btn-shadow-cta active:scale-[0.98] transition-transform"
        >
          GET SCOOPIN&apos;
        </button>
      </div>
    </div>
  );
}
