export type TrendDirection = "up" | "down" | "neutral";

export interface StatsCardData {
  id: string;
  title: string;
  value: string | number;
  trend?: string;
  trendDirection?: TrendDirection;
}

export interface ActivityItem {
  id: string;
  label: string;
  timestamp: string;
}

export interface DashboardWidgetProps {
  title?: string;
  description?: string;
  onAddNew?: () => void;
  stats?: readonly StatsCardData[];
  activities?: readonly ActivityItem[];
  className?: string;
}
