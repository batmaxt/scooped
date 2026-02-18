import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: React.ElementType;
  iconColor?: string;
  bgColor?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  iconColor = "text-pink-400",
  bgColor = "bg-pink-50",
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 px-6 text-center animate-in fade-in duration-300",
        className
      )}
    >
      <div className={cn("rounded-full p-5 mb-5", bgColor)}>
        <Icon className={cn("size-10", iconColor)} />
      </div>
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground max-w-xs mb-6 leading-relaxed">
          {description}
        </p>
      )}
      {action}
    </div>
  );
}
