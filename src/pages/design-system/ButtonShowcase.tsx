import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

/* ── variant → label mapping ── */
const textVariants = ["default", "destructive", "secondary", "outline", "ghost", "link"] as const;

const textVariantLabels: Record<(typeof textVariants)[number], string> = {
  default: "Primary",
  destructive: "Destructive",
  secondary: "Secondary",
  outline: "Bordered",
  ghost: "Text",
  link: "Link",
};

/* Icon-only columns */
const iconVariants = ["default", "outline", "ghost"] as const;
const iconLabels: Record<(typeof iconVariants)[number], string> = {
  default: "Icon Filled",
  outline: "Icon Bordered",
  ghost: "Icon Only",
};

/* Hover-class overrides (mimics hover look for static capture) */
const hoverText: Record<(typeof textVariants)[number], string> = {
  default: "!bg-primary/90",
  destructive: "!bg-destructive/90",
  secondary: "!bg-secondary/80",
  outline: "!bg-accent !text-accent-foreground",
  ghost: "!bg-accent !text-accent-foreground",
  link: "!underline",
};
const hoverIcon: Record<(typeof iconVariants)[number], string> = {
  default: "!bg-primary/90",
  outline: "!bg-accent !text-accent-foreground",
  ghost: "!bg-accent !text-accent-foreground",
};

type State = "Enabled" | "Hover" | "Disabled";
const states: State[] = ["Enabled", "Hover", "Disabled"];

/* ── The grid for one size group ── */
function SizeGroup({
  label,
  btnSize,
  iconSize,
}: {
  label: string;
  btnSize: "default" | "sm" | "lg";
  iconSize: "icon" | "icon-sm" | "icon-lg";
}) {
  return (
    <section className="mb-14">
      <h2 className="mb-6 text-lg font-semibold tracking-wide text-muted-foreground">{label}</h2>

      {/* Column headers */}
      <div className="mb-3 grid grid-cols-[100px_repeat(9,minmax(110px,1fr))] items-end gap-x-6">
        <span />
        {textVariants.map(v => (
          <span
            key={v}
            className="text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground"
          >
            {textVariantLabels[v]}
          </span>
        ))}
        {iconVariants.map(v => (
          <span
            key={`ih-${v}`}
            className="text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground"
          >
            {iconLabels[v]}
          </span>
        ))}
      </div>

      {/* State rows */}
      {states.map(state => (
        <div
          key={state}
          className="mb-4 grid grid-cols-[100px_repeat(9,minmax(110px,1fr))] items-center gap-x-6"
        >
          {/* Row label */}
          <span className="text-sm font-medium">{state}</span>

          {/* Text buttons */}
          {textVariants.map(variant => {
            const isLink = variant === "link";
            return (
              <div key={variant} className="flex justify-center">
                <Button
                  variant={variant}
                  size={btnSize}
                  disabled={state === "Disabled"}
                  className={state === "Hover" ? hoverText[variant] : undefined}
                >
                  <Settings className="size-4" />
                  {isLink ? "Button" : "BUTTON"}
                  <Settings className="size-4" />
                </Button>
              </div>
            );
          })}

          {/* Icon-only buttons */}
          {iconVariants.map(variant => (
            <div key={`i-${variant}`} className="flex justify-center">
              <Button
                variant={variant}
                size={iconSize}
                disabled={state === "Disabled"}
                className={state === "Hover" ? hoverIcon[variant] : undefined}
              >
                <Settings className="size-4" />
              </Button>
            </div>
          ))}
        </div>
      ))}
    </section>
  );
}

/* ── Main showcase page ── */
export default function ButtonShowcase() {
  return (
    <div className="min-h-screen bg-background p-12">
      {/* Title */}
      <div className="mb-10 inline-block rounded-md border border-border bg-card px-4 py-1.5 text-sm font-semibold shadow-sm">
        Button
      </div>

      {/* Showcase card */}
      <div className="rounded-2xl border border-border bg-card p-10 shadow-sm">
        <SizeGroup label="Default Size" btnSize="default" iconSize="icon" />
        <SizeGroup label="Small Size" btnSize="sm" iconSize="icon-sm" />
        <SizeGroup label="Large Size" btnSize="lg" iconSize="icon-lg" />
      </div>
    </div>
  );
}
