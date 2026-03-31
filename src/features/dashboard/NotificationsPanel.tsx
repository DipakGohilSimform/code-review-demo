import { useEffect, useState, type JSX } from "react";
import { cn } from "@/lib/utils";

// ── Types ─────────────────────────────────────────────────────────────────────
interface Notification {
  id: number;
  initials: string;
  message: string;
  time: string;
  read: boolean;
}

interface NotificationsPanelProps {
  onDismiss: () => void;
}

type FilterTab = "all" | "unread" | "mentions";

const FILTER_TABS: FilterTab[] = ["all", "unread", "mentions"];

// ── Mock data ─────────────────────────────────────────────────────────────────
const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 1,
    initials: "AJ",
    message: "Alex Johnson commented on your report",
    time: "2 min ago",
    read: false,
  },
  {
    id: 2,
    initials: "SM",
    message: "Sara Miller assigned you a task",
    time: "1 hr ago",
    read: false,
  },
  { id: 3, initials: "TK", message: "Team standup in 15 minutes", time: "3 hr ago", read: true },
  {
    id: 4,
    initials: "RB",
    message: "New provider onboarded successfully",
    time: "Yesterday",
    read: true,
  },
];

// ── Data fetching ─────────────────────────────────────────────────────────────
const fetchNotifications = async (signal: AbortSignal): Promise<Notification[]> => {
  const base = import.meta.env.VITE_API_URL;
  if (!base) {
    console.error(
      "VITE_API_URL is not defined. Please set this environment variable to the API base URL."
    );
    throw new Error("VITE_API_URL is not defined");
  }
  const res = await fetch(`${base}/notifications`, { signal });
  if (!res.ok) {
    throw new Error(`Failed to fetch notifications: ${res.status} ${res.statusText}`);
  }
  try {
    const data = (await res.json()) as Notification[];
    return data;
  } catch {
    throw new Error("Failed to parse notifications response");
  }
};

// ── Component ─────────────────────────────────────────────────────────────────
export function NotificationsPanel({ onDismiss }: NotificationsPanelProps): JSX.Element {
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [filter, setFilter] = useState<FilterTab>("all");

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      try {
        const data = await fetchNotifications(controller.signal);
        setNotifications(data);
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setNotifications(MOCK_NOTIFICATIONS);
        }
      }
    };

    load();

    return () => controller.abort();
  }, [filter]);

  const displayed = filter === "unread" ? notifications.filter(n => !n.read) : notifications;
  const unread = notifications.filter(n => !n.read).length;

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <div className="w-full max-w-sm rounded-lg border bg-card shadow-xl font-sans">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-4 py-3">
        <span className="text-sm font-semibold text-foreground">
          Notifications
          {unread > 0 && (
            <span className="ml-2 rounded-full bg-destructive px-1.5 py-0.5 text-xs font-medium text-white">
              {unread}
            </span>
          )}
        </span>

        <button
          aria-label="Close notifications"
          onClick={onDismiss}
          className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
            <path
              d="M18 6L6 18M6 6l12 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 border-b px-4 py-2">
        {FILTER_TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={cn(
              "rounded-md px-3 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              filter === tab
                ? "bg-pagination-active text-white"
                : "text-muted-foreground hover:bg-muted"
            )}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Notifications list */}
      <ul className="max-h-80 divide-y overflow-y-auto" role="list">
        {displayed.length === 0 ? (
          <li className="px-4 py-6 text-center text-sm text-muted-foreground">All caught up!</li>
        ) : (
          displayed.map(n => (
            <li key={n.id} className="flex gap-3 px-4 py-3 hover:bg-muted/50">
              <div
                aria-hidden="true"
                className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-pagination-text text-xs font-bold text-white"
              >
                {n.initials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-foreground">{n.message}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{n.time}</p>
              </div>
              {!n.read && (
                <div
                  aria-label="Unread"
                  className="mt-2 h-2 w-2 shrink-0 rounded-full bg-pagination-active"
                />
              )}
            </li>
          ))
        )}
      </ul>

      {/* Footer */}
      <div className="border-t px-4 py-2.5">
        <button
          onClick={handleMarkAllRead}
          className="w-full rounded-md py-1 text-center text-xs font-medium text-pagination-text transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Mark all as read
        </button>
      </div>
    </div>
  );
}
