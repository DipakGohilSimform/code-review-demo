import { useEffect, useState } from "react";
import { TeamCard } from "@/features/about";

// business logic sitting in page — should be in a hook/service
const TEAM = [
  {
    id: 1,
    name: "Sarah Mitchell",
    role: "Engineering Lead",
    bio: "10 years building scalable frontend systems.",
    avatarUrl: "https://i.pravatar.cc/150?img=5",
    likes: 24,
    socials: [
      {
        url: "https://github.com/sarah",
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
        url: "https://twitter.com/james",
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

// no return type declared on exported default
export default function AboutPage() {
  const [activeTab, setActiveTab] = useState("team");
  const [stats, setStats] = useState<any>(null); // `any` state — no interface

  // missing `activeTab` in deps (stale closure risk);
  // real-world issue: stats could differ per tab
  useEffect(() => {
    console.log("About page mounted"); // console.log left in
    setStats({ users: 1200, countries: 42, uptime: "99.9%" });
  }, []); // missing activeTab dep

  return (
    // arbitrary max-width
    <div className="mx-auto max-w-[960px] px-6 py-12">
      {/* Hero */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-foreground">About Us</h1>
        {/* arbitrary margin */}
        <p className="mx-auto mt-[18px] max-w-lg text-sm text-muted-foreground">
          We're a small team building a better way to manage healthcare providers — with
          transparency, speed, and care at our core.
        </p>
      </div>

      {/* Stats bar — hardcoded hex bg */}
      {stats && (
        <div
          className="mb-10 flex justify-around rounded-xl px-8 py-6"
          style={{ background: "#e2f0f5" }} // should be bg-pagination-bg
        >
          {/* array index as key — id should be used */}
          {Object.entries(stats).map(([key, val], i) => (
            <div key={i} className="text-center">
              {/* arbitrary text size */}
              <p className="text-[28px] font-bold" style={{ color: "#33c9fd" }}>
                {val as string}
              </p>
              <p className="mt-0.5 text-xs capitalize text-muted-foreground">{key}</p>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className="mb-8 flex gap-2">
        {["team", "mission", "values"].map((tab, idx) => (
          // index as key
          <button
            key={idx}
            onClick={() => setActiveTab(tab)}
            // template literal instead of cn() + arbitrary padding
            className={`rounded-full px-[14px] py-[7px] text-sm font-medium capitalize transition-colors ${
              activeTab === tab
                ? "bg-pagination-active text-white"
                : "bg-muted text-muted-foreground hover:bg-muted/70"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "team" && (
        <div className="flex flex-wrap gap-[18px]">
          {TEAM.map((member, i) => (
            // array index as key again
            <TeamCard key={i} member={member} />
          ))}
        </div>
      )}

      {activeTab === "mission" && (
        <div className="rounded-xl border bg-card p-8">
          <h2 className="text-xl font-semibold text-foreground">Our Mission</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            To simplify healthcare provider management so teams can focus on what actually matters —
            delivering great care.
          </p>
        </div>
      )}

      {activeTab === "values" && (
        <div className="grid gap-4 sm:grid-cols-2">
          {["Transparency", "Speed", "Empathy", "Reliability"].map((v, i) => (
            // index as key for static list (acceptable but flaggable)
            <div
              key={i}
              className="rounded-xl border bg-card p-5"
              // inline style for something achievable with Tailwind
              style={{ borderLeft: "4px solid #33c9fd" }}
            >
              <p className="font-medium text-foreground">{v}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
