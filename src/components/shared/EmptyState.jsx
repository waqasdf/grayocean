import * as React from "react"
import { Inbox } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

/**
 * Calm empty placeholder for lists, tables, and result areas.
 */
export function EmptyState({
  icon: Icon = Inbox,
  title = "Nothing to show",
  description,
  actionLabel,
  onAction,
  className,
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center px-go-6 py-go-8 text-center",
        className
      )}
      role="status"
    >
      <div className="mb-go-3 flex size-10 items-center justify-center rounded-go border border-go-border bg-go-surface-muted text-go-text-muted">
        <Icon className="size-5" aria-hidden />
      </div>
      <p className="text-go-card text-go-text">{title}</p>
      {description ? (
        <p className="mt-1 max-w-sm text-go-body-sm text-go-text-muted">
          {description}
        </p>
      ) : null}
      {actionLabel && onAction ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-go-4"
          onClick={onAction}
        >
          {actionLabel}
        </Button>
      ) : null}
    </div>
  )
}
