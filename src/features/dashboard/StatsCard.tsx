import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import type { TrendDirection } from "@/types/dashboardTypes";

interface StatsCardProps {
  title: string;
  value: ReactNode;
  delta?: string;
  deltaColor?: TrendDirection | "green" | "red" | "muted";
  smallText?: ReactNode;
  className?: string;
}

export function StatsCard({
  title,
  value,
  delta,
  deltaColor = "muted",
  smallText,
  className,
}: StatsCardProps): React.JSX.Element {
  const trendClass = cn(
    "text-xs",
    (deltaColor === "green" || deltaColor === "up") && "text-green-600 dark:text-green-400",
    (deltaColor === "red" || deltaColor === "down") && "text-destructive",
    (deltaColor === "muted" || deltaColor === "neutral") && "text-muted-foreground"
  );

  return (
    <div
      className={cn(
        "bg-card text-card-foreground flex flex-col gap-2 rounded-xl border border-border p-6 shadow-sm",
        className
      )}
    >
      <div className="space-y-2 p-2">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <p className="text-3xl font-bold text-foreground">{value}</p>
        {delta ? (
          <p className={trendClass}>{delta}</p>
        ) : smallText ? (
          <p className="text-xs text-muted-foreground">{smallText}</p>
        ) : null}
      </div>
    </div>
  );
}

export default StatsCard;
