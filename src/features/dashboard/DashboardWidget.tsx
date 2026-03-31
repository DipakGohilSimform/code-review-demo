import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";
import type { DashboardWidgetProps, StatsCardData, ActivityItem } from "@/types/dashboardTypes";

import { RecentActivity } from "./RecentActivity";
import { StatsCard } from "./StatsCard";

// ---------------------------------------------------------------------------
// Default data matching the Figma design (node 163-17447)
// ---------------------------------------------------------------------------

const DEFAULT_STATS: readonly StatsCardData[] = [
  {
    id: "total-users",
    title: "Total Users",
    value: "2,543",
    trend: "+12% from last month",
    trendDirection: "up",
  },
  {
    id: "revenue",
    title: "Revenue",
    value: "$45,231",
    trend: "+8% from last month",
    trendDirection: "up",
  },
  {
    id: "active-projects",
    title: "Active Projects",
    value: 12,
    trend: "3 completed",
    trendDirection: "neutral",
  },
  {
    id: "tasks-pending",
    title: "Tasks Pending",
    value: 24,
    trend: "8 overdue",
    trendDirection: "down",
  },
];

const DEFAULT_ACTIVITIES: readonly ActivityItem[] = [
  { id: "act-1", label: "New user registered", timestamp: "2 hours ago" },
  { id: "act-2", label: "Project completed", timestamp: "5 hours ago" },
  { id: "act-3", label: "Payment received", timestamp: "1 day ago" },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * DashboardWidget — full dashboard content area.
 *
 * Orchestrates the page header, 4-column stats grid, and 2-column recent
 * activity section.  All data is injected via props with Figma-matched
 * defaults so the component works out of the box with no configuration.
 *
 * Figma source: node-id 163-17447
 */
export function DashboardWidget({
  title = "Dashboard Demo",
  description = "Welcome back! Here's what's happening today.",
  onAddNew,
  stats = DEFAULT_STATS,
  activities = DEFAULT_ACTIVITIES,
  className,
}: DashboardWidgetProps): React.JSX.Element {
  return (
    <div className={cn("space-y-6", className)}>
      {/* ── Page header ─────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-foreground">{title}</h1>
          <p className="text-base text-muted-foreground">{description}</p>
        </div>

        <Button onClick={onAddNew} className="w-full sm:w-auto">
          Add New
        </Button>
      </div>

      {/* ── Stats grid (4 cols on lg, 2 on sm, 1 on mobile) ────────────── */}
      <div
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        aria-label="Key metrics"
      >
        {stats.map(stat => (
          <StatsCard
            key={stat.id}
            title={stat.title}
            value={stat.value}
            delta={stat.trend}
            deltaColor={stat.trendDirection ?? "neutral"}
          />
        ))}
      </div>

      {/* ── Recent activity (2 cols on md+, 1 on mobile) ────────────────── */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <RecentActivity items={activities} />
        <RecentActivity items={activities} />
      </div>
    </div>
  );
}

export default DashboardWidget;
