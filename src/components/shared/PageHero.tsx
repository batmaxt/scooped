interface PageHeroProps {
  label: string;
  headline: string;
}

export function PageHero({ label, headline }: PageHeroProps) {
  return (
    <div className="px-5 pt-14 pb-6">
      <p className="text-xs font-semibold uppercase tracking-widest text-[#F46B8F] mb-1">
        {label}
      </p>
      <h1 className="text-2xl font-heading font-bold text-[#2E1F1B] dark:text-[#F5E6DC] leading-tight">
        {headline}
      </h1>
    </div>
  );
}
