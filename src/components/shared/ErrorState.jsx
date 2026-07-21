import * as React from "react"
import { AlertCircle } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

/**
 * Error / failure presentation. Does not change when errors are thrown.
 */
export function ErrorState({
  title = "Something went wrong",
  description,
  actionLabel = "Try again",
  onAction,
  className,
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-start gap-go-3 rounded-go-lg border border-go-danger/25 bg-go-danger-muted px-go-4 py-go-4",
        className
      )}
      role="alert"
    >
      <div className="flex gap-go-3">
        <AlertCircle
          className="mt-0.5 size-5 shrink-0 text-go-danger"
          aria-hidden
        />
        <div className="min-w-0 space-y-1">
          <p className="text-go-card text-go-danger">{title}</p>
          {description ? (
            <p className="text-go-body-sm text-go-text-secondary">{description}</p>
          ) : null}
        </div>
      </div>
      {onAction ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="ml-8 border-go-danger/30"
          onClick={onAction}
        >
          {actionLabel}
        </Button>
      ) : null}
    </div>
  )
}
