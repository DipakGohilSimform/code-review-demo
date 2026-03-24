import { useEffect, useState, type JSX } from "react";
import { TeamCard, type TeamMember } from "@/features/about";
import { cn } from "@/lib/utils";

// ── Types ────────────────────────────────────────────────────────────────────
interface PageStats {
  users: number;
  countries: number;
  uptime: string;
}

type TabKey = "team" | "mission" | "values";

const TABS: TabKey[] = ["team", "mission", "values"];

const VALUES = ["Transparency", "Speed", "Empathy", "Reliability"] as const;

// ── Fixtures ─────────────────────────────────────────────────────────────────
const TEAM: TeamMember[] = [
  {
    id: 1,
    name: "Sarah Mitchell",
    role: "Engineering Lead",
    bio: "10 years building scalable frontend systems.",
    avatarUrl: "https://i.pravatar.cc/150?img=5",
    likes: 24,
    socials: [
      {
        platform: "github",
        url: "https://github.com/sarah",
        label: "Sarah Mitchell on GitHub",
        iconPath:
          "M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77",
      },
    ],
  },
  {
    id: 2,
    name: "James Okafor",
    role: "Product Designer",
    bio: "Bridging design systems and developer experience.",
    avatarUrl: "https://i.pravatar.cc/150?img=8",
    likes: 18,
    socials: [
      {
        platform: "twitter",
        url: "https://twitter.com/james",
        label: "James Okafor on Twitter",
        iconPath: "M23 3a10.9 10.9 0 0 1-3.14 1.53A4.48 4.48 0 0 0 16 2",
      },
    ],
  },
  {
    id: 3,
    name: "Priya Nair",
    role: "Backend Engineer",
    bio: "Distributed systems, APIs, and coffee enthusiast.",
    avatarUrl: "https://i.pravatar.cc/150?img=9",
    likes: 31,
    socials: [],
  },
];

const STATS_LABELS: Record<keyof PageStats, string> = {
  users: "Users",
  countries: "Countries",
  uptime: "Uptime",
};

// ── Component ─────────────────────────────────────────────────────────────────
export default function AboutPage(): JSX.Element {
  const [activeTab, setActiveTab] = useState<TabKey>("team");
  const [stats, setStats] = useState<PageStats | null>(null);

  useEffect(() => {
    setStats({ users: 1200, countries: 42, uptime: "99.9%" });
  }, []);

  const handleTabKeyDown = (e: React.KeyboardEvent, currentTab: TabKey) => {
    const currentIndex = TABS.indexOf(currentTab);
    let nextTab: TabKey | null = null;

    if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      nextTab = currentIndex > 0 ? TABS[currentIndex - 1] : TABS[TABS.length - 1];
    } else if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      nextTab = currentIndex < TABS.length - 1 ? TABS[currentIndex + 1] : TABS[0];
    } else if (e.key === "Home") {
      e.preventDefault();
      nextTab = TABS[0];
    } else if (e.key === "End") {
      e.preventDefault();
      nextTab = TABS[TABS.length - 1];
    }

    if (nextTab) {
      setActiveTab(nextTab);
      // Focus the newly active tab button
      setTimeout(() => {
        document.getElementById(`tab-${nextTab}`)?.focus();
      }, 0);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      {/* Hero */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-foreground">About Us</h1>
        <p className="mx-auto mt-5 max-w-lg text-sm text-muted-foreground">
          We're a small team building a better way to manage healthcare providers — with
          transparency, speed, and care at our core.
        </p>
      </div>

      {/* Stats bar */}
      {stats && (
        <div className="mb-10 flex justify-around rounded-xl bg-pagination-bg px-8 py-6">
          {(Object.keys(stats) as Array<keyof PageStats>).map(key => (
            <div key={key} className="text-center">
              <p className="text-3xl font-bold text-pagination-active">{String(stats[key])}</p>
              <p className="mt-0.5 text-xs capitalize text-muted-foreground">{STATS_LABELS[key]}</p>
            </div>
          ))}
        </div>
      )}

      {/* Tabs — full ARIA tabs pattern */}
      <div className="mb-8 flex gap-2" role="tablist">
        {TABS.map(tab => (
          <button
            key={tab}
            id={`tab-${tab}`}
            role="tab"
            aria-selected={activeTab === tab}
            aria-controls={`panel-${tab}`}
            tabIndex={activeTab === tab ? 0 : -1}
            onClick={() => setActiveTab(tab)}
            onKeyDown={e => handleTabKeyDown(e, tab)}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-sm font-medium capitalize transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              activeTab === tab
                ? "bg-pagination-active text-white"
                : "bg-muted text-muted-foreground hover:bg-muted/70"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab panels — full ARIA tabs pattern */}
      {activeTab === "team" && (
        <div
          id="panel-team"
          role="tabpanel"
          aria-labelledby="tab-team"
          className="flex flex-wrap gap-4"
        >
          {TEAM.map(member => (
            <TeamCard key={member.id} member={member} />
          ))}
        </div>
      )}

      {activeTab === "mission" && (
        <div
          id="panel-mission"
          role="tabpanel"
          aria-labelledby="tab-mission"
          className="rounded-xl border bg-card p-8"
        >
          <h2 className="text-xl font-semibold text-foreground">Our Mission</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            To simplify healthcare provider management so teams can focus on what actually matters —
            delivering great care.
          </p>
        </div>
      )}

      {activeTab === "values" && (
        <div
          id="panel-values"
          role="tabpanel"
          aria-labelledby="tab-values"
          className="grid gap-4 sm:grid-cols-2"
        >
          {VALUES.map(v => (
            <div
              key={v}
              className="rounded-xl border border-l-4 border-pagination-active bg-card p-5"
            >
              <p className="font-medium text-foreground">{v}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
