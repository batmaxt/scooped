"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

const SIZE_MAP = {
  sm: { star: "w-5 h-5", text: "text-sm", gap: "gap-0.5" },
  md: { star: "w-7 h-7", text: "text-base", gap: "gap-1" },
  lg: { star: "w-9 h-9", text: "text-lg", gap: "gap-1.5" },
} as const;

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  size?: "sm" | "md" | "lg";
  label?: string;
  readOnly?: boolean;
}

export function StarRating({
  value,
  onChange,
  size = "md",
  label,
  readOnly = false,
}: StarRatingProps) {
  const styles = SIZE_MAP[size];

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <span className="text-sm font-medium text-neutral-700">{label}</span>
      )}
      <div className="flex items-center gap-2">
        <div className={cn("flex items-center", styles.gap)}>
          {[1, 2, 3, 4, 5].map((star) => {
            const isFilled = star <= value;
            return (
              <button
                key={star}
                type="button"
                disabled={readOnly}
                onClick={() => {
                  if (!readOnly && onChange) {
                    // Tap same star to deselect
                    onChange(star === value ? 0 : star);
                  }
                }}
                className={cn(
                  "transition-all duration-150 outline-none",
                  !readOnly && "active:scale-125 hover:scale-110",
                  readOnly && "cursor-default"
                )}
                aria-label={`Rate ${star} out of 5`}
              >
                <Star
                  className={cn(
                    styles.star,
                    "transition-colors duration-150",
                    isFilled
                      ? "fill-yellow-400 text-yellow-400"
                      : "fill-transparent text-neutral-300"
                  )}
                />
              </button>
            );
          })}
        </div>
        {value > 0 && (
          <span
            className={cn(
              "font-semibold text-neutral-700 tabular-nums",
              styles.text
            )}
          >
            {value.toFixed(1)}
          </span>
        )}
      </div>
    </div>
  );
}
