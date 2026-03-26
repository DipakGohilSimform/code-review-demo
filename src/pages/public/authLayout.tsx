import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Left panel — branding / hero */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-pagination-bg p-12 lg:flex lg:w-1/2">
        {/* Decorative circles */}
        <div className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-pagination-active/20" />
        <div className="pointer-events-none absolute -bottom-24 -right-12 h-96 w-96 rounded-full bg-pagination-active/15" />
        <div className="pointer-events-none absolute left-1/2 top-1/3 h-48 w-48 -translate-x-1/2 rounded-full bg-pagination-active/10" />

        {/* Brand */}
        <div className="relative z-10 flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-pagination-active shadow-sm">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="size-4 text-white"
              aria-hidden="true"
            >
              <path
                d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="text-base font-semibold text-pagination-text">SSU Platform</span>
        </div>

        {/* Hero copy */}
        <div className="relative z-10 space-y-4">
          <h2 className="text-3xl font-bold leading-snug text-pagination-text">
            Manage everything
            <br />
            in one place
          </h2>
          <p className="max-w-xs text-sm leading-relaxed text-pagination-text/70">
            Access your dashboard, monitor activity, and keep your team in sync — all from a single,
            unified workspace.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-2 pt-2">
            {["Real-time analytics", "Role-based access", "Audit trail"].map(feature => (
              <span
                key={feature}
                className="rounded-full border border-tag-success-border bg-tag-success-bg px-3 py-1 text-xs font-medium text-tag-success-text"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>

        {/* Footer tagline */}
        <p className="relative z-10 text-xs text-pagination-text/50">
          © {new Date().getFullYear()} SSU. All rights reserved.
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex flex-1 items-center justify-center px-6 py-12 sm:px-12">
        <div className="w-full max-w-sm">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
