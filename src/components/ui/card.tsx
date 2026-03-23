import * as React from "react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
        className
      )}
      {...props}
    />
  );
}

type CardHeaderProps = React.ComponentProps<"div"> & {
  icon?: LucideIcon;
  iconClassName?: string;
};

function CardHeader({ className, icon: Icon, iconClassName, children, ...props }: CardHeaderProps) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      )}
      {...props}
    >
      {Icon && (
        <div className="mb-1 flex items-center gap-2">
          <Icon className={cn("size-5 text-muted-foreground", iconClassName)} aria-hidden="true" />
        </div>
      )}
      {children}
    </div>
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none font-semibold", className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn("col-start-2 row-span-2 row-start-1 self-start justify-self-end", className)}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-content" className={cn("px-6", className)} {...props} />;
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
      {...props}
    />
  );
}

type CardIconProps = {
  icon: LucideIcon;
  className?: string;
  containerClassName?: string;
};

function CardIcon({ icon: Icon, className, containerClassName }: CardIconProps) {
  return (
    <div
      data-slot="card-icon"
      className={cn(
        "flex size-10 items-center justify-center rounded-lg bg-muted text-muted-foreground",
        containerClassName
      )}
    >
      <Icon className={cn("size-5", className)} aria-hidden="true" />
    </div>
  );
}

export { Card, CardHeader, CardFooter, CardTitle, CardAction, CardDescription, CardContent, CardIcon };
