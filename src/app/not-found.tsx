import Link from "next/link";
import { Home, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-8 text-center bg-[#FFF7ED] dark:bg-background">
      <div className="text-6xl mb-5" aria-hidden>
        🍧
      </div>
      <h1 className="text-2xl font-bold font-heading text-[#2E1F1B] dark:text-[#F5E6DC] mb-2">
        This scoop doesn&apos;t exist.
      </h1>
      <p className="text-sm text-muted-foreground max-w-xs mb-8 leading-relaxed">
        The page you&apos;re looking for melted away, or never existed in the
        first place.
      </p>
      <div className="flex flex-col gap-3 w-full max-w-xs">
        <Link
          href="/home"
          className="inline-flex items-center justify-center gap-2 h-12 rounded-full bg-[#C4364A] text-white text-sm font-semibold active:scale-[0.98] transition-transform"
        >
          <Home className="size-4" />
          Back to home
        </Link>
        <Link
          href="/discover"
          className="inline-flex items-center justify-center gap-2 h-12 rounded-full bg-white dark:bg-card border border-[rgba(93,64,55,0.15)] dark:border-white/10 text-sm font-semibold text-[#2E1F1B] dark:text-[#F5E6DC] active:scale-[0.98] transition-transform"
        >
          <Compass className="size-4" />
          Find ice cream instead
        </Link>
      </div>
    </div>
  );
}
