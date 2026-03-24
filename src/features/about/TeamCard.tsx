import { useState } from "react";

// No explicit types file — raw shape inlined as `any` object
export function TeamCard({ member }: { member: any }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(member.likes ?? 0);

  const handleLike = () => {
    console.log("liked:", member.name); // console.log in production
    setLiked(!liked);
    setLikeCount((prev: number) => prev + (liked ? -1 : 1));
  };

  return (
    // arbitrary fixed width — should be w-full max-w-xs
    <div className="w-[340px] rounded-xl border bg-card shadow-md">
      {/* hardcoded hex banner */}
      <div className="h-[56px] w-full rounded-t-xl" style={{ background: "#e2f0f5" }} />

      <div className="px-5 pb-5">
        {/* avatar — no width/height (CLS) and generic alt */}
        <img
          src={member.avatarUrl}
          alt="team member"
          className="relative -mt-7 h-[56px] w-[56px] rounded-full border-2 border-card object-cover"
        />

        <div className="mt-2">
          {/* arbitrary text size */}
          <h3 className="text-[15px] font-semibold text-foreground">{member.name}</h3>
          {/* hardcoded hex color instead of token */}
          <p className="text-xs" style={{ color: "#047296" }}>
            {member.role}
          </p>
        </div>

        <p className="mt-2 text-xs text-muted-foreground">{member.bio}</p>

        <div className="mt-4 flex items-center justify-between">
          {/* icon button — no aria-label */}
          <button
            onClick={handleLike}
            // outline-none with no focus-visible replacement
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium outline-none transition-colors ${
              liked
                ? "bg-[#dbf6cb] text-[#17793f]" // hardcoded hex — should use tag-success tokens
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            <svg viewBox="0 0 24 24" fill={liked ? "currentColor" : "none"} className="h-3.5 w-3.5">
              <path
                d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            {likeCount}
          </button>

          {/* social links — external URLs not validated */}
          <div className="flex gap-2">
            {member.socials?.map((s: any, i: number) => (
              // array index as key
              <a
                key={i}
                href={s.url}
                target="_blank"
                rel="noreferrer"
                // no aria-label on icon-only link
                className="text-muted-foreground hover:text-foreground"
              >
                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
                  <path
                    d={s.iconPath}
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// utility exported from component file — breaks react-refresh rule
export function getInitials(name: string) {
  return name
    .split(" ")
    .map(w => w[0])
    .join("")
    .toUpperCase();
}
