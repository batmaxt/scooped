import type { LucideIcon } from "lucide-react";

interface GradientHeroCardProps {
  icon: LucideIcon;
  text: string;
  gradient?: string;
}

export function GradientHeroCard({
  icon: Icon,
  text,
  gradient = "from-[#2E1F1B] to-[#5D4037]",
}: GradientHeroCardProps) {
  return (
    <div
      className={`bg-gradient-to-br ${gradient} rounded-2xl p-5 flex items-center gap-4`}
    >
      <div className="flex items-center justify-center size-12 rounded-full bg-white/15 shrink-0">
        <Icon className="size-6 text-white" />
      </div>
      <p className="text-sm font-medium text-white/90 leading-relaxed flex-1">
        {text}
      </p>
    </div>
  );
}
