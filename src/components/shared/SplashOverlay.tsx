"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

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
      className={`fixed inset-0 z-[9999] flex flex-col items-center select-none transition-opacity duration-500 ${
        exiting ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      style={{ background: "linear-gradient(to bottom, #b6ded3, #b3dbd0)" }}
    >
      {/* Hero — the cone image, pulled toward the visual center */}
      <div className="splash-logo-enter flex flex-col items-center w-full flex-1 min-h-0 px-6 pt-6">
        <div className="relative w-full h-full max-w-sm">
          <Image
            src="/images/splash-cone.png"
            alt="Scooped — ice cream cone with cherry"
            fill
            sizes="(max-width: 384px) 100vw, 384px"
            className="object-contain object-bottom"
            priority
          />
        </div>
      </div>

      {/* Headline */}
      <h1
        className="splash-text-enter mt-8 text-[22px] font-bold uppercase text-[#2E1F1B] text-center px-10 leading-snug font-heading"
        style={{ animationDelay: "0.4s", letterSpacing: "0.06em" }}
      >
        Find Your Favorite Flavors
      </h1>

      {/* Bottom CTA */}
      <div
        className="splash-text-enter w-full px-8 mt-10 flex flex-col items-center gap-4"
        style={{
          animationDelay: "0.7s",
          paddingBottom: "max(3rem, env(safe-area-inset-bottom, 0px) + 2rem)",
        }}
      >
        <button
          onClick={handleDismiss}
          className="w-full max-w-sm h-14 rounded-full bg-[#C4364A] text-white text-lg font-semibold btn-shadow-cta active:scale-[0.98] transition-transform touch-manipulation"
        >
          GET SCOOPIN&apos;
        </button>
        <Link
          href="/login"
          onClick={() => sessionStorage.setItem("scooped-splash-shown", "1")}
          className="text-sm font-semibold text-[#2E1F1B]/70 hover:text-[#2E1F1B] py-1 touch-manipulation"
        >
          Already have an account? <span className="underline underline-offset-2">Sign in</span>
        </Link>
      </div>
    </div>
  );
}
