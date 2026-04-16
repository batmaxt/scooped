"use client";

interface QuickSuggestionPillsProps {
  suggestions: string[];
  onSelect: (suggestion: string) => void;
}

export function QuickSuggestionPills({
  suggestions,
  onSelect,
}: QuickSuggestionPillsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar px-5 pb-2">
      {suggestions.map((suggestion) => (
        <button
          key={suggestion}
          onClick={() => onSelect(suggestion)}
          className="shrink-0 px-4 py-2 rounded-full text-sm font-medium bg-[#FFF3EE] dark:bg-[#2E1F1B]/40 text-[#2E1F1B] dark:text-[rgba(93,64,55,0.12)] border border-[rgba(93,64,55,0.12)] dark:border-[#332520]/50 hover:bg-[rgba(93,64,55,0.12)] dark:hover:bg-[#2E1F1B]/60 transition-colors"
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
}
