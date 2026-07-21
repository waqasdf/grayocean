import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * Bordered content panel for grouping related fields — not a decorative card.
 */
export function DataPanel({
  title,
  description,
  actions,
  footer,
  className,
  bodyClassName,
  children,
}) {
  return (
    <section
      className={cn(
        "rounded-go-lg border border-go-border bg-go-surface shadow-go-xs overflow-hidden",
        className
      )}
    >
      {(title || description || actions) && (
        <div className="flex flex-col gap-2 border-b border-go-border px-go-4 py-go-3 sm:flex-row sm:items-center sm:justify-between md:px-go-5">
          <div className="min-w-0 space-y-0.5">
            {title ? (
              <h3 className="text-go-card text-go-text">{title}</h3>
            ) : null}
            {description ? (
              <p className="text-go-body-sm text-go-text-muted">{description}</p>
            ) : null}
          </div>
          {actions ? (
            <div className="flex flex-shrink-0 flex-wrap items-center gap-2">
              {actions}
            </div>
          ) : null}
        </div>
      )}
      <div className={cn("px-go-4 py-go-4 md:px-go-5", bodyClassName)}>{children}</div>
      {footer ? (
        <div className="border-t border-go-border bg-go-surface-muted/60 px-go-4 py-go-3 md:px-go-5">
          {footer}
        </div>
      ) : null}
    </section>
  )
}
