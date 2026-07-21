import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * Compact label/value rows for investigation result data.
 */
export function DefinitionList({ items = [], className, columns = 1 }) {
  return (
    <dl
      className={cn(
        "grid gap-x-go-6 gap-y-go-3",
        columns === 2 && "sm:grid-cols-2",
        columns === 3 && "sm:grid-cols-2 lg:grid-cols-3",
        className
      )}
    >
      {items.map((item) => (
        <div key={item.key ?? item.label} className="min-w-0">
          <dt className="text-go-label text-go-text-muted">{item.label}</dt>
          <dd className="mt-0.5 text-go-body text-go-text break-words">
            {item.value ?? "—"}
          </dd>
        </div>
      ))}
    </dl>
  )
}

/**
 * Single definition row for custom layouts.
 */
export function DefinitionRow({ label, children, className }) {
  return (
    <div
      className={cn(
        "flex flex-col gap-0.5 border-b border-go-border py-go-3 last:border-b-0 sm:flex-row sm:gap-go-6",
        className
      )}
    >
      <dt className="w-full shrink-0 text-go-label text-go-text-muted sm:w-40">
        {label}
      </dt>
      <dd className="min-w-0 flex-1 text-go-body text-go-text">{children}</dd>
    </div>
  )
}
