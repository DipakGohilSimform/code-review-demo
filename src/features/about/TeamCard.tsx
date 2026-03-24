import { useState, type JSX } from "react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

// ── Types ────────────────────────────────────────────────────────────────────
export interface SocialLink {
  /** Stable unique identifier for the platform (e.g. "github", "twitter"). */
  platform: string;
  /** Fully-qualified HTTPS URL — validated at the data layer. */
  url: string;
  iconPath: string;
  label: string;
}

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  bio: string;
  avatarUrl: string;
  likes: number;
  socials: SocialLink[];
}

interface TeamCardProps {
  member: TeamMember;
}

// ── Component ────────────────────────────────────────────────────────────────
export function TeamCard({ member }: TeamCardProps): JSX.Element {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(member.likes);

  const handleLike = () => {
    setLiked(prevLiked => {
      const nextLiked = !prevLiked;
      setLikeCount(prevCount => prevCount + (nextLiked ? 1 : -1));
      return nextLiked;
    });
  };

  return (
    <div className="w-full max-w-xs rounded-xl border bg-card shadow-md">
      {/* Banner */}
      <div className="h-14 w-full rounded-t-xl bg-pagination-bg" />

      <div className="px-5 pb-5">
        {/* Avatar */}
        <img
          src={member.avatarUrl}
          alt={member.name}
          width={56}
          height={56}
          className="relative -mt-7 h-14 w-14 rounded-full border-2 border-card object-cover"
        />

        <div className="mt-2">
          <h3 className="text-sm font-semibold text-foreground">{member.name}</h3>
          <p className="text-xs text-pagination-text">{member.role}</p>
        </div>

        <p className="mt-2 text-xs text-muted-foreground">{member.bio}</p>

        <div className="mt-4 flex items-center justify-between">
          {/* Like button */}
          <button
            aria-label={liked ? `Unlike ${member.name}` : `Like ${member.name}`}
            onClick={handleLike}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              liked
                ? "bg-tag-success-bg text-tag-success-text"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            <svg
              viewBox="0 0 24 24"
              fill={liked ? "currentColor" : "none"}
              className="h-3.5 w-3.5"
              aria-hidden="true"
            >
              <path
                d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            {likeCount}
          </button>

          {/* Social links */}
          <div className="flex gap-2">
            {member.socials.map(s => (
              <Link
                key={s.platform}
                to={s.url}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={s.label}
                className="rounded-md p-0.5 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
                  <path
                    d={s.iconPath}
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
