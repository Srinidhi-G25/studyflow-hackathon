import * as React from "react"

import { cn } from "@/lib/utils"

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: "default" | "secondary" | "destructive" | "outline"
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const variantClass =
      variant === "secondary"
        ? "bg-secondary text-secondary-foreground"
        : variant === "destructive"
          ? "bg-destructive text-destructive-foreground"
          : variant === "outline"
            ? "border border-border text-foreground"
            : "bg-primary text-primary-foreground"

    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
          variantClass,
          className
        )}
        {...props}
      />
    )
  }
)

Badge.displayName = "Badge"
