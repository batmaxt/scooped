"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapPin, Newspaper, User, IceCreamCone, Bell } from "lucide-react";
import { cn } from "@/lib/utils";

const SECTION_COLORS: Record<string, { active: string; dot: string }> = {
  "/discover": { active: "text-cyan-500 dark:text-cyan-400", dot: "bg-cyan-400" },
  "/feed": { active: "text-pink-500 dark:text-pink-400", dot: "bg-pink-400" },
  "/notifications": { active: "text-amber-500 dark:text-amber-400", dot: "bg-amber-400" },
  "/profile": { active: "text-purple-500 dark:text-purple-400", dot: "bg-purple-400" },
};

function NavLink({ href, label, icon: Icon }: { href: string; label: string; icon: typeof MapPin }) {
  const pathname = usePathname();
  const isActive = pathname.startsWith(href);
  const colors = SECTION_COLORS[href] || SECTION_COLORS["/discover"];

  return (
    <Link
      href={href}
      className={cn(
        "flex flex-col items-center justify-center gap-1 py-2 text-xs transition-all duration-200 relative flex-1",
        isActive
          ? colors.active
          : "text-neutral-400 dark:text-neutral-500 active:text-neutral-600"
      )}
    >
      <Icon className={cn("w-5 h-5 transition-transform duration-200", isActive && "scale-110")} />
      <span className="font-medium">{label}</span>
      {isActive && (
        <span className={cn("absolute -bottom-1 w-5 h-1 rounded-full transition-all duration-200", colors.dot)} />
      )}
    </Link>
  );
}

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-pink-100/40 dark:border-white/5 bg-gradient-to-t from-white via-white/95 to-white/85 dark:from-card dark:via-card/95 dark:to-card/85 backdrop-blur-xl pb-[env(safe-area-inset-bottom)]">
      {/* Centered FAB */}
      <Link
        href="/checkin/new"
        className="absolute left-1/2 -translate-x-1/2 -top-7 flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-cyan-400 text-white elevation-brand active:scale-95 transition-transform ring-4 ring-white dark:ring-card fab-glow"
      >
        <IceCreamCone className="size-7" />
      </Link>

      <div className="flex items-center h-16 max-w-lg mx-auto">
        <NavLink href="/discover" label="Discover" icon={MapPin} />
        <NavLink href="/feed" label="Feed" icon={Newspaper} />

        {/* Center spacer for FAB */}
        <div className="w-16 shrink-0" />

        <NavLink href="/notifications" label="Alerts" icon={Bell} />
        <NavLink href="/profile" label="Profile" icon={User} />
      </div>
    </nav>
  );
}
