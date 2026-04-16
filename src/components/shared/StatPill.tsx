interface StatPillProps {
  value: string | number;
  label: string;
}

export function StatPill({ value, label }: StatPillProps) {
  return (
    <div className="flex-1 flex flex-col items-center gap-0.5 py-3 px-3 rounded-2xl bg-card dark:bg-card border border-[rgba(93,64,55,0.12)] dark:border-white/5">
      <span className="text-lg font-bold font-heading text-[#2E1F1B] dark:text-[#F5E6DC]">
        {value}
      </span>
      <span className="text-[10px] text-[#8C6F66] dark:text-[#A8897E] uppercase tracking-wider font-medium">
        {label}
      </span>
    </div>
  );
}
