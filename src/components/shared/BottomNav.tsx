"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapPin, Newspaper, User } from "lucide-react";
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
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white/80 backdrop-blur-lg pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;

          if (item.isAction) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center justify-center -mt-5 w-14 h-14 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 text-white shadow-lg shadow-rose-300/50 active:scale-95 transition-transform"
              >
                <span className="text-2xl leading-none" role="img" aria-label="Ice cream">
                  🍦
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-3 py-2 text-xs transition-colors relative",
                isActive
                  ? "text-neutral-900"
                  : "text-neutral-400 active:text-neutral-600"
              )}
            >
              {Icon && <Icon className="w-5 h-5" />}
              <span>{item.label}</span>
              {isActive && (
                <span className="absolute -bottom-1 w-1 h-1 rounded-full bg-rose-400" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
