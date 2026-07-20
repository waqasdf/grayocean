import * as React from "react"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--go-accent-border)]",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[var(--go-accent-soft)] text-[color:var(--go-accent-text)]",
        secondary:
          "border-[color:var(--go-border)] bg-[var(--go-bg-panel)] text-[color:var(--go-text-secondary)]",
        destructive:
          "border-[color:var(--go-error-border)] bg-[var(--go-error-fill)] text-[color:var(--go-error)]",
        success:
          "border-[color:var(--go-success-border)] bg-[var(--go-success-fill)] text-[color:var(--go-success)]",
        warning:
          "border-[color:var(--go-warning-border)] bg-[var(--go-warning-fill)] text-[color:var(--go-warning)]",
        outline: "border-[color:var(--go-border)] text-[color:var(--go-text-secondary)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  ...props
}) {
  return (<div className={cn(badgeVariants({ variant }), className)} {...props} />);
}

export { Badge, badgeVariants }
