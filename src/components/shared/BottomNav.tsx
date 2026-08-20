"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, IceCreamCone, Bell, User } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/discover", label: "Discover", icon: Compass },
  { href: "/flavor-catalog", label: "Flavors", icon: IceCreamCone },
  { href: "/alerts", label: "Alerts", icon: Bell },
  { href: "/profile", label: "Profile", icon: User },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[rgba(93,64,55,0.12)] dark:border-white/5 bg-[#FFF3EE] dark:bg-card pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center h-16 max-w-lg mx-auto">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 py-2 text-xs transition-all duration-200 flex-1",
                isActive
                  ? "text-[#F46B8F]"
                  : "text-[#8C6F66] dark:text-neutral-500"
              )}
            >
              <Icon
                className={cn(
                  "w-5 h-5 transition-transform duration-200",
                  isActive && "scale-110"
                )}
                fill={isActive ? "currentColor" : "none"}
              />
              <span className={cn("font-medium", isActive && "font-semibold")}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
