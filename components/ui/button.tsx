import * as React from "react"

import { cn } from "@/lib/utils"

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "secondary" | "outline" | "ghost" | "destructive"
  size?: "default" | "sm" | "lg" | "icon"
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", type, ...props }, ref) => {
    const variantClass =
      variant === "secondary"
        ? "bg-secondary text-secondary-foreground hover:bg-secondary/80"
        : variant === "outline"
          ? "border border-border bg-background hover:bg-secondary/40"
          : variant === "ghost"
            ? "hover:bg-secondary/40"
            : variant === "destructive"
              ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
              : "bg-primary text-primary-foreground hover:bg-primary/90"

    const sizeClass =
      size === "sm"
        ? "h-9 rounded-md px-3 text-sm"
        : size === "lg"
          ? "h-11 rounded-md px-6"
          : size === "icon"
            ? "h-10 w-10 rounded-md"
            : "h-10 rounded-md px-4 py-2"

    return (
      <button
        ref={ref}
        type={type ?? "button"}
        className={cn(
          "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
          variantClass,
          sizeClass,
          className
        )}
        {...props}
      />
    )
  }
)

Button.displayName = "Button"
