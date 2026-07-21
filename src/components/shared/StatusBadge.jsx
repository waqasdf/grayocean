import * as React from "react"
import { cva } from "class-variance-authority"
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info,
  CircleHelp,
  MinusCircle,
} from "lucide-react"

import { cn } from "@/lib/utils"

const statusBadgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-go-sm border px-2 py-0.5 text-go-meta font-medium",
  {
    variants: {
      status: {
        success:
          "border-go-success/25 bg-go-success-muted text-go-success",
        warning:
          "border-go-warning/25 bg-go-warning-muted text-go-warning",
        danger:
          "border-go-danger/25 bg-go-danger-muted text-go-danger",
        info:
          "border-go-info/25 bg-go-info-muted text-go-info",
        neutral:
          "border-go-border bg-go-surface-muted text-go-text-secondary",
        unknown:
          "border-go-border bg-go-surface text-go-text-muted",
      },
    },
    defaultVariants: {
      status: "neutral",
    },
  }
)

const statusIcons = {
  success: CheckCircle2,
  warning: AlertTriangle,
  danger: XCircle,
  info: Info,
  neutral: MinusCircle,
  unknown: CircleHelp,
}

/**
 * Status chip with text + icon (not color alone).
 * Prefer over MinimalBadge for new UI.
 */
export function StatusBadge({
  status = "neutral",
  label,
  children,
  showIcon = true,
  className,
}) {
  const Icon = statusIcons[status] ?? statusIcons.neutral
  const content = label ?? children

  return (
    <span className={cn(statusBadgeVariants({ status }), className)}>
      {showIcon ? <Icon className="size-3.5 shrink-0" aria-hidden /> : null}
      <span>{content}</span>
    </span>
  )
}
