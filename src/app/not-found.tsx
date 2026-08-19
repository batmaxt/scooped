import Link from "next/link";
import { IceCreamCone, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-8 text-center bg-[#FFF7ED] dark:bg-background">
      <div className="flex items-center justify-center size-24 rounded-full bg-[#FFF3EE] dark:bg-[#332520]/40 mb-8 rotate-[168deg]">
        <IceCreamCone className="size-12 text-[#F46B8F]" aria-hidden />
      </div>
      <h1 className="text-2xl font-bold font-heading text-[#2E1F1B] dark:text-[#F5E6DC] mb-2">
        This scoop doesn&apos;t exist
      </h1>
      <p className="text-[15px] text-muted-foreground max-w-[30ch] mb-10 leading-relaxed">
        The page you&apos;re looking for melted away — or was never on the menu.
      </p>
      <Link
        href="/home"
        className="inline-flex items-center justify-center gap-2 h-12 px-10 rounded-full bg-[#C4364A] text-white text-sm font-semibold btn-shadow-cta active:scale-[0.98] transition-transform"
      >
        <Home className="size-4" />
        Back to home
      </Link>
      <Link
        href="/discover"
        className="mt-5 text-sm font-semibold text-[#8C6F66] hover:text-[#2E1F1B] dark:text-[#A8897E] dark:hover:text-[#F5E6DC] underline underline-offset-2"
      >
        Find ice cream instead
      </Link>
    </div>
  );
}
