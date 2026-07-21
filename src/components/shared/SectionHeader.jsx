import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * In-page section title with optional description and actions.
 */
export function SectionHeader({
  title,
  description,
  actions,
  as: Comp = "h2",
  className,
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-go-4",
        className
      )}
    >
      <div className="min-w-0 space-y-0.5">
        <Comp className="text-go-section text-go-text">{title}</Comp>
        {description ? (
          <p className="text-go-body-sm text-go-text-muted">{description}</p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex flex-shrink-0 flex-wrap items-center gap-2 pt-1 sm:pt-0">
          {actions}
        </div>
      ) : null}
    </div>
  )
}
