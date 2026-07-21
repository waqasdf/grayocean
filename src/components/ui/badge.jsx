import * as React from "react"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-go-sm border px-2 py-0.5 text-go-meta font-medium go-transition focus:outline-none focus-visible:ring-2 focus-visible:ring-go-focus focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-go-primary text-go-primary-foreground",
        secondary:
          "border-go-border bg-go-surface-muted text-go-text-secondary",
        destructive:
          "border-transparent bg-go-danger text-white",
        outline:
          "border-go-border text-go-text-secondary bg-go-surface",
        success:
          "border-go-success/20 bg-go-success-muted text-go-success",
        warning:
          "border-go-warning/20 bg-go-warning-muted text-go-warning",
        danger:
          "border-go-danger/20 bg-go-danger-muted text-go-danger",
        info:
          "border-go-info/20 bg-go-info-muted text-go-info",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({ className, variant, ...props }) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
