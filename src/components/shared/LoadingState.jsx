import * as React from "react"
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

/**
 * Inline or block loading indicator. Does not invent progress percentages.
 */
export function LoadingState({
  label = "Loading…",
  description,
  variant = "spinner",
  className,
}) {
  if (variant === "skeleton") {
    return (
      <div
        className={cn("space-y-go-3 p-go-4", className)}
        role="status"
        aria-busy="true"
        aria-label={label}
      >
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-24 w-full" />
      </div>
    )
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-go-3 px-go-6 py-go-8 text-center",
        className
      )}
      role="status"
      aria-busy="true"
    >
      <Loader2
        className="size-5 animate-spin text-go-text-muted"
        aria-hidden
      />
      <div className="space-y-0.5">
        <p className="text-go-body font-medium text-go-text">{label}</p>
        {description ? (
          <p className="text-go-body-sm text-go-text-muted">{description}</p>
        ) : null}
      </div>
    </div>
  )
}
