import * as React from "react"

import { cn } from "@/lib/utils"

export type CheckboxProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type"
> & {
  indeterminate?: boolean
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, indeterminate, ...props }, ref) => {
    const isControlled = props.checked !== undefined
    const hasOnChange = typeof props.onChange === "function"

    return (
      <input
        ref={ref}
        type="checkbox"
        aria-checked={indeterminate ? "mixed" : props.checked ? "true" : "false"}
        className={cn(
          "h-4 w-4 rounded border border-border bg-background text-primary accent-primary",
          className
        )}
        readOnly={isControlled && !hasOnChange ? true : props.readOnly}
        {...props}
      />
    )
  }
)

Checkbox.displayName = "Checkbox"
