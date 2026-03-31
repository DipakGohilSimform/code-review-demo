import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { cn } from "@/lib/utils";
import type { ActivityItem } from "@/types/dashboardTypes";

const DEFAULT_ITEMS: readonly ActivityItem[] = [
  { id: "1", label: "New user registered", timestamp: "2 hours ago" },
  { id: "2", label: "Project completed", timestamp: "5 hours ago" },
  { id: "3", label: "Payment received", timestamp: "1 day ago" },
];

interface RecentActivityProps {
  title?: string;
  items?: readonly ActivityItem[];
  className?: string;
}

export function RecentActivity({
  title = "Recent Activity",
  items = DEFAULT_ITEMS,
  className,
}: RecentActivityProps): React.JSX.Element {
  return (
    <Card className={cn("gap-0 py-0", className)}>
      <CardHeader className="border-b border-border px-6 py-5">
        <CardTitle className="text-xl font-semibold text-card-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent className="px-6 py-5">
        <ul className="space-y-4" aria-label={title}>
          {items.map(item => (
            <li key={item.id} className="flex items-start gap-4">
              <span
                aria-hidden="true"
                className="mt-2 size-2 shrink-0 rounded-full bg-foreground"
              />
              <div className="flex-1 space-y-0.5">
                <p className="text-sm font-medium text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.timestamp}</p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

export default RecentActivity;
