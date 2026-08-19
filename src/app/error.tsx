"use client";

import { useEffect } from "react";
import { IceCreamCone, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Route error:", error?.message || error);
  }, [error]);

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-8 text-center bg-[#FFF7ED] dark:bg-background">
      <div className="flex items-center justify-center size-24 rounded-full bg-[#FFF3EE] dark:bg-[#332520]/40 mb-8 rotate-[168deg]">
        <IceCreamCone className="size-12 text-[#F46B8F]" aria-hidden />
      </div>
      <h1 className="text-2xl font-bold font-heading text-[#2E1F1B] dark:text-[#F5E6DC] mb-2">
        Well, that melted
      </h1>
      <p className="text-[15px] text-muted-foreground max-w-[30ch] mb-10 leading-relaxed">
        Something went wrong on this page. It&apos;s not you — give it another
        scoop.
      </p>
      <button
        onClick={reset}
        className="inline-flex items-center justify-center gap-2 h-12 px-10 rounded-full bg-[#C4364A] text-white text-sm font-semibold btn-shadow-cta active:scale-[0.98] transition-transform"
      >
        <RefreshCw className="size-4" />
        Try again
      </button>
      <Link
        href="/home"
        className="mt-5 text-sm font-semibold text-[#8C6F66] hover:text-[#2E1F1B] dark:text-[#A8897E] dark:hover:text-[#F5E6DC] underline underline-offset-2"
      >
        Back to home
      </Link>
    </div>
  );
}
