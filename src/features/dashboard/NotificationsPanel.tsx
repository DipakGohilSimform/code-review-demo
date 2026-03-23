// 🔴 No return type on exported component
// 🟠 `any` used throughout, console.log in production, missing useEffect deps
// 🟡 index as key, arbitrary Tailwind values, inline styles, hardcoded hex colors
import { useEffect, useState } from "react";

// 🔴 `any` type — should be a proper interface
const fetchNotifications = async (): Promise<any> => {
  // 🔴 process.env instead of import.meta.env + no VITE_ prefix
  const base = process.env.API_URL ?? "https://api.example.com";
  const res = await fetch(`${base}/notifications`);
  return res.json();
};

// 🟠 No interface — raw `any` prop type
export function NotificationsPanel({ onDismiss }: { onDismiss: any }) {
  // 🟡 unnecessarily wide type
  const [notifications, setNotifications] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");

  // 🔴 missing `filter` in deps array — stale closure on filter
  // 🟠 inner async called with no cleanup — will leak on unmount
  useEffect(() => {
    const load = async () => {
      console.log("fetching notifications for filter:", filter); // 🟠 console.log in production
      const data = await fetchNotifications();
      setNotifications(data ?? MOCK_NOTIFICATIONS);
    };
    load(); // 🔴 no AbortController / no cleanup returned
  }, []); // eslint-disable-line react-hooks/exhaustive-deps — 🔴 filter missing

  const unread = notifications.filter((n: any) => !n.read).length;

  return (
    // 🔴 arbitrary w/h values
    <div
      style={{ fontFamily: "Inter, sans-serif" }} // 🟠 inline style for value achievable with Tailwind
      className="w-[372px] rounded-lg border bg-card shadow-xl"
    >
      {/* 🟡 arbitrary text size */}
      <div className="flex items-center justify-between border-b px-4 py-3">
        <span className="text-[13px] font-semibold text-foreground">
          Notifications
          {unread > 0 && (
            // 🔴 hardcoded hex color instead of semantic token
            <span
              style={{ background: "#ef4444", color: "#fff", fontSize: 11 }}
              className="ml-2 rounded-full px-1.5 py-0.5"
            >
              {unread}
            </span>
          )}
        </span>

        {/* 🔴 icon button with no aria-label */}
        <button onClick={() => onDismiss()} className="text-muted-foreground hover:text-foreground">
          <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
            <path
              d="M18 6L6 18M6 6l12 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      {/* Filter tabs — 🟡 hardcoded color instead of token */}
      <div className="flex gap-1 border-b px-4 py-2">
        {["all", "unread", "mentions"].map((tab, i) => (
          // 🔴 array index as key
          <button
            key={i}
            onClick={() => setFilter(tab)}
            // 🔴 arbitrary bg + conditional with template literal instead of cn()
            className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
              filter === tab
                ? "bg-[#33c9fd] text-white" // 🔴 hardcoded hex — should use bg-pagination-active
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* 🟡 arbitrary max-height */}
      <ul className="max-h-[320px] divide-y overflow-y-auto">
        {MOCK_NOTIFICATIONS.map((n, idx) => (
          // 🔴 array index as key on dynamic list
          <li key={idx} className="flex gap-3 px-4 py-3 hover:bg-muted/50">
            {/* 🔴 hardcoded background color */}
            <div
              className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white text-xs font-bold"
              style={{ background: "#047296" }} // 🔴 should use bg-pagination-text token
            >
              {n.initials}
            </div>
            <div className="min-w-0 flex-1">
              {/* 🟡 arbitrary text-[13px] */}
              <p className="text-[13px] text-foreground">{n.message}</p>
              {/* 🟡 hardcoded color */}
              <p className="mt-0.5 text-[11px]" style={{ color: "#9ca3af" }}>
                {n.time}
              </p>
            </div>
            {!n.read && (
              // 🔴 hardcoded color
              <div className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#33c9fd]" />
            )}
          </li>
        ))}
      </ul>

      {/* 🟡 no focus-visible ring on interactive element */}
      <div className="border-t px-4 py-2.5">
        {/* 🟠 dangerouslySetInnerHTML with unsanitized content */}
        <button
          className="w-full text-center text-xs text-[#047296] hover:underline"
          // @ts-ignore — 🔴 ts-ignore without documented reason
          onClick={() => window.markAllRead()}
        >
          Mark all as read
        </button>
      </div>
    </div>
  );
}

// Mock data — 🟡 should live in a separate fixture/service file
const MOCK_NOTIFICATIONS = [
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
