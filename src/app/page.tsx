"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Phase = "animate" | "hold" | "fade" | "done";

export default function SplashPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("animate");

  useEffect(() => {
    const holdTimer = setTimeout(() => setPhase("hold"), 1800);
    const fadeTimer = setTimeout(() => setPhase("fade"), 3000);
    const navTimer = setTimeout(() => {
      setPhase("done");
      router.replace("/discover");
    }, 3400);

    return () => {
      clearTimeout(holdTimer);
      clearTimeout(fadeTimer);
      clearTimeout(navTimer);
    };
  }, [router]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-animated overflow-hidden ${
        phase === "fade" || phase === "done" ? "animate-splash-fade-out" : ""
      }`}
    >
      {/* Floating shimmer dots */}
      {Array.from({ length: 12 }, (_, i) => {
        const colors = ["#ec4899", "#a855f7", "#06b6d4", "#f59e0b"];
        const sizes = [10, 14, 8, 12, 16, 10, 8, 14, 12, 10, 16, 8];
        const lefts = [12, 78, 25, 65, 45, 88, 8, 55, 35, 72, 20, 60];
        const tops = [15, 20, 70, 80, 12, 55, 40, 85, 30, 65, 50, 25];
        return (
          <div
            key={i}
            className="absolute rounded-full animate-shimmer"
            style={{
              width: `${sizes[i]}px`,
              height: `${sizes[i]}px`,
              background: colors[i % 4],
              left: `${lefts[i]}%`,
              top: `${tops[i]}%`,
              animationDelay: `${i * 0.25}s`,
              opacity: 0.4,
            }}
          />
        );
      })}

      {/* Ice cream cone assembly */}
      <div className="relative flex flex-col items-center mb-8">
        {/* Scoop 3 (top — mint/teal) */}
        <div
          className="css-scoop animate-scoop-bounce"
          style={{
            background: "radial-gradient(circle at 35% 35%, #67e8f9, #06b6d4 50%, #0891b2 85%)",
            animationDelay: "0.6s",
            zIndex: 3,
            marginBottom: "-14px",
          }}
        >
          {/* Chocolate chip speckles */}
          <span className="absolute w-[5px] h-[4px] rounded-full bg-[#5c3d1e] rotate-12" style={{ top: "28px", left: "18px" }} />
          <span className="absolute w-[4px] h-[5px] rounded-full bg-[#5c3d1e] -rotate-20" style={{ top: "42px", left: "50px" }} />
          <span className="absolute w-[5px] h-[3px] rounded-full bg-[#5c3d1e] rotate-45" style={{ top: "20px", left: "48px" }} />
          <span className="absolute w-[3px] h-[5px] rounded-full bg-[#5c3d1e] -rotate-30" style={{ top: "50px", left: "28px" }} />
          {/* Drip */}
          <div className="css-drip" style={{ left: "58px", background: "linear-gradient(180deg, #06b6d4, #0891b2)" }} />
        </div>

        {/* Scoop 2 (middle — purple/ube) */}
        <div
          className="css-scoop animate-scoop-bounce"
          style={{
            background: "radial-gradient(circle at 35% 35%, #d8b4fe, #a855f7 50%, #7e22ce 90%)",
            animationDelay: "0.3s",
            zIndex: 2,
            marginBottom: "-14px",
          }}
        >
          {/* Swirl streaks */}
          <span className="absolute rounded-full opacity-30" style={{ top: "22px", left: "12px", width: "32px", height: "6px", background: "#e9d5ff", transform: "rotate(-15deg)", borderRadius: "50%" }} />
          <span className="absolute rounded-full opacity-25" style={{ top: "40px", left: "30px", width: "26px", height: "5px", background: "#e9d5ff", transform: "rotate(10deg)", borderRadius: "50%" }} />
          {/* Drip */}
          <div className="css-drip" style={{ left: "16px", background: "linear-gradient(180deg, #a855f7, #7e22ce)" }} />
        </div>

        {/* Scoop 1 (bottom — strawberry pink) */}
        <div
          className="css-scoop animate-scoop-bounce"
          style={{
            background: "radial-gradient(circle at 35% 35%, #fda4af, #ec4899 50%, #be185d 90%)",
            animationDelay: "0s",
            zIndex: 1,
            marginBottom: "-8px",
          }}
        >
          {/* Strawberry seed speckles */}
          <span className="absolute w-[3px] h-[4px] rounded-full bg-[#9f1239]/40 rotate-45" style={{ top: "30px", left: "22px" }} />
          <span className="absolute w-[3px] h-[4px] rounded-full bg-[#9f1239]/40 -rotate-20" style={{ top: "45px", left: "42px" }} />
          <span className="absolute w-[3px] h-[4px] rounded-full bg-[#9f1239]/40 rotate-60" style={{ top: "22px", left: "55px" }} />
          <span className="absolute w-[3px] h-[4px] rounded-full bg-[#9f1239]/40 -rotate-45" style={{ top: "52px", left: "30px" }} />
          <span className="absolute w-[3px] h-[4px] rounded-full bg-[#9f1239]/40 rotate-20" style={{ top: "38px", left: "15px" }} />
        </div>

        {/* Cone */}
        <div
          className="css-cone animate-cone-rise"
          style={{ animationDelay: "0.1s", zIndex: 0 }}
        />
      </div>

      {/* Text */}
      <h1
        className="text-5xl font-extrabold text-white tracking-tight animate-splash-text drop-shadow-lg"
        style={{ animationDelay: "1.2s" }}
      >
        Scooped
      </h1>
      <p
        className="text-white/70 text-lg mt-2 animate-splash-text"
        style={{ animationDelay: "1.5s" }}
      >
        Discover. Rate. Share.
      </p>
    </div>
  );
}
