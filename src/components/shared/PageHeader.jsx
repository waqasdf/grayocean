import { cn } from "@/lib/utils"

/**
 * Standard page title block for workspace screens.
 * Presentational only — no routing or data fetching.
 */
export function PageHeader({
  title,
  description,
  actions,
  breadcrumb,
  className,
  children,
}) {
  return (
    <div
      className={cn(
        "mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-start sm:justify-between",
        className
      )}
    >
      <div className="min-w-0 flex-1 space-y-1">
        {breadcrumb ? (
          <div className="mb-1 text-[12px] text-go-text-muted">{breadcrumb}</div>
        ) : null}
        <h2 className="text-[28px] font-semibold tracking-tight text-go-text sm:text-[32px]">
          {title}
        </h2>
        {description ? (
          <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-go-text-secondary">
            {description}
          </p>
        ) : null}
        {children}
      </div>
      {actions ? (
        <div className="flex flex-shrink-0 flex-wrap items-center gap-2">{actions}</div>
      ) : null}
    </div>
  )
}
