"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapPin, Newspaper, User, IceCreamCone } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS: {
  href: string;
  label: string;
  icon?: typeof MapPin;
  isAction?: boolean;
}[] = [
  { href: "/discover", label: "Discover", icon: MapPin },
  { href: "/feed", label: "Feed", icon: Newspaper },
  { href: "/checkin/new", label: "Check In", isAction: true },
  { href: "/profile", label: "Profile", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-pink-100/60 dark:border-white/5 bg-white/90 dark:bg-card/90 backdrop-blur-xl pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;

          if (item.isAction) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center justify-center -mt-6 w-16 h-16 rounded-full bg-gradient-to-br from-pink-400 via-rose-400 to-pink-500 text-white elevation-brand active:scale-95 transition-transform ring-4 ring-white dark:ring-card"
              >
                <IceCreamCone className="size-7" />
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-3 py-2 text-xs transition-all duration-200 relative",
                isActive
                  ? "text-pink-500 dark:text-pink-400"
                  : "text-neutral-400 dark:text-neutral-500 active:text-neutral-600"
              )}
            >
              {Icon && <Icon className={cn("w-5 h-5 transition-transform duration-200", isActive && "scale-110")} />}
              <span className="font-medium">{item.label}</span>
              {isActive && (
                <span className="absolute -bottom-1 w-5 h-1 rounded-full bg-pink-400 transition-all duration-200" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
