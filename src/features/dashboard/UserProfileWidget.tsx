import { useCallback, useState, type JSX } from "react";
import { cn } from "@/lib/utils";

// ── Types ─────────────────────────────────────────────────────────────────────
export const USER_ROLES = {
  Admin: "admin",
  Editor: "editor",
  Viewer: "viewer",
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export interface UserData {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

interface UserProfileWidgetProps {
  userId: number;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
  /** Plain-text biography — rendered safely as text, never as HTML. */
  bio: string;
  onSave: (data: UserData) => void;
  onDelete: () => void;
}

// ── Component ─────────────────────────────────────────────────────────────────
export function UserProfileWidget({
  userId,
  name,
  email,
  role,
  avatarUrl,
  bio,
  onSave,
  onDelete,
}: UserProfileWidgetProps): JSX.Element {
  const [isEditing, setIsEditing] = useState(false);
  const [localName, setLocalName] = useState(name);

  const displayName = localName.trim();
  const isAdmin = role === USER_ROLES.Admin;

  const handleSave = useCallback(() => {
    onSave({ id: userId, name: localName.trim(), email, role });
    setIsEditing(false);
  }, [userId, localName, email, role, onSave]);

  return (
    <div className="w-full max-w-sm rounded-xl border bg-card shadow-lg">
      {/* Banner */}
      <div className="h-20 w-full rounded-t-xl bg-gradient-to-br from-pagination-active to-pagination-text" />

      <div className="px-6 pb-6">
        {/* Avatar */}
        <div className="relative -mt-9 mb-3 flex items-end justify-between">
          <img
            src={avatarUrl}
            alt={name}
            width={64}
            height={64}
            className="h-16 w-16 rounded-full border-4 border-card object-cover"
          />
          {isAdmin && (
            <span className="rounded-full border border-tag-success-border bg-tag-success-bg px-2 py-0.5 text-xs font-semibold text-tag-success-text">
              Admin
            </span>
          )}
        </div>

        {/* Name */}
        {isEditing ? (
          <div className="mb-1">
            <label htmlFor="profile-name" className="sr-only">
              Full name
            </label>
            <input
              id="profile-name"
              value={localName}
              onChange={e => setLocalName(e.target.value)}
              className="w-full rounded-md border border-border bg-background px-2 py-1 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
        ) : (
          <h3 className="text-base font-semibold text-foreground">{displayName}</h3>
        )}

        <p className="text-xs text-muted-foreground">{email}</p>

        {/* Role badge */}
        <span
          className={cn(
            "mt-2 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium",
            isAdmin ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground"
          )}
        >
          {role}
        </span>

        {/* Bio — plain text, never rendered as HTML to prevent XSS */}
        <p className="mt-3 text-sm text-muted-foreground">{bio}</p>

        {/* Actions */}
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            className="flex-1 rounded-lg bg-pagination-active py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 active:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {isEditing ? "Save" : "Edit Profile"}
          </button>

          <button
            aria-label={`Delete ${name}'s profile`}
            onClick={onDelete}
            className="rounded-lg px-4 py-2 text-sm text-destructive transition-colors hover:bg-destructive/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
