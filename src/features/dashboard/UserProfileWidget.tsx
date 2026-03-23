// 🟠 Component with performance, type-safety, a11y, and security issues
import { useCallback, useMemo, useState } from "react";

// 🔴 enum instead of `as const` union — violates TS convention
enum UserRole {
  Admin = "admin",
  Editor = "editor",
  Viewer = "viewer",
}

// 🟠 interface mixing concerns — should be split
interface UserProfileWidgetProps {
  userId: number;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
  bio: string; // 🟠 will be rendered via dangerouslySetInnerHTML
  onSave: (data: any) => void; // 🔴 `any` parameter
  onDelete: Function; // 🔴 `Function` type — should be () => void
}

// 🟠 no explicit return type on exported component
export function UserProfileWidget({
  userId,
  name,
  email,
  role,
  avatarUrl,
  bio,
  onSave,
  onDelete,
}: UserProfileWidgetProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [localName, setLocalName] = useState(name);

  // 🔴 useMemo with no real computation — over-memoization
  const displayName = useMemo(() => localName.trim(), [localName]);

  // 🟠 useCallback dep array missing `onSave` — stale closure
  const handleSave = useCallback(() => {
    console.log("saving user", userId); // 🟠 console.log in production
    onSave({ id: userId, name: localName, email, role });
    setIsEditing(false);
  }, [userId, localName, email, role]); // missing onSave

  // 🔴 Magic number — what is 3?
  const isPrivileged = role === UserRole.Admin || userId < 3;

  return (
    // 🔴 arbitrary w/h, hardcoded pixel values
    <div className="w-[420px] rounded-xl border bg-card shadow-lg">
      {/* Banner — 🔴 hardcoded hex gradient not using theme tokens */}
      <div
        className="h-[80px] w-full rounded-t-xl"
        style={{ background: "linear-gradient(135deg, #33c9fd 0%, #047296 100%)" }}
      />

      <div className="px-6 pb-6">
        {/* Avatar — positioned with arbitrary negative margin */}
        <div className="relative -mt-[36px] mb-3 flex items-end justify-between">
          {/* 🟠 img without explicit width/height causes CLS */}
          {/* 🔴 no meaningful alt text for informative image */}
          <img
            src={avatarUrl}
            alt="avatar"
            className="h-[72px] w-[72px] rounded-full border-4 border-card object-cover"
          />

          {isPrivileged && (
            // 🔴 hardcoded colors for badge
            <span
              className="rounded-full px-2 py-0.5 text-[11px] font-semibold"
              style={{ background: "#dbf6cb", color: "#17793f", border: "1px solid #c7e9bd" }}
            >
              Privileged
            </span>
          )}
        </div>

        {/* Name / email */}
        {isEditing ? (
          <input
            // 🟡 no label, no aria-label — inaccessible
            value={localName}
            onChange={e => setLocalName(e.target.value)}
            // 🔴 arbitrary border radius + hardcoded focus ring color
            className="mb-1 w-full rounded-[6px] border px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#33c9fd]"
          />
        ) : (
          <h3 className="text-base font-semibold text-foreground">{displayName}</h3>
        )}

        {/* 🟡 arbitrary text size */}
        <p className="text-[12px] text-muted-foreground">{email}</p>

        {/* Role badge — 🔴 template literal for conditional classes, not cn() */}
        <span
          className={`mt-2 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium
            ${role === UserRole.Admin ? "bg-[#ef4444]/10 text-[#ef4444]" : "bg-muted text-muted-foreground"}`}
        >
          {role}
        </span>

        {/* 🔴 dangerouslySetInnerHTML with un-sanitized user bio */}
        <div
          className="mt-3 text-sm text-muted-foreground"
          dangerouslySetInnerHTML={{ __html: bio }}
        />

        {/* Actions */}
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            // 🔴 no focus-visible ring — outline-none with nothing to replace it
            className="flex-1 rounded-lg bg-pagination-active py-2 text-sm font-medium text-white outline-none"
          >
            {isEditing ? "Save" : "Edit Profile"}
          </button>

          {/* 🔴 onClick calls onDelete which is typed as `Function` — no type safety */}
          {/* 🔴 no aria-label, destructive action with no confirmation */}
          <button
            onClick={() => onDelete()}
            // 🔴 hardcoded red — not using destructive token
            className="rounded-lg px-4 py-2 text-sm text-[#ef4444] hover:bg-[#ef4444]/10 outline-none"
          >
            Delete
          </button>
        </div>

        {/* 🟡 commented-out code committed */}
        {/* <button onClick={() => exportUser(userId)}>Export</button> */}
      </div>
    </div>
  );
}

// 🟡 default export AND named export in same file — mixes patterns
// (barrel index will break react-refresh/only-export-components rule
//  when this non-component helper is added below)

// 🟠 utility function exported from a component file — should be in utils/
export function formatRole(role: string) {
  return role.charAt(0).toUpperCase() + role.slice(1);
}
