import { cn } from "@/lib/utils";

/**
 * Shared workspace page chrome — matches SSN Lookup density and dark SaaS look.
 */
export function WorkspacePage({
  title,
  description,
  actions,
  children,
  className,
  contentClassName,
  maxWidth = "max-w-[900px]",
}) {
  return (
    <div className={cn("min-h-full bg-go-bg", className)}>
      <div
        className={cn(
          "mx-auto w-full px-3 pb-16 pt-8 sm:px-6 sm:pt-10 md:px-8 md:pt-14",
          maxWidth,
          contentClassName
        )}
      >
        {(title || description || actions) && (
          <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              {title ? (
                <h2 className="text-[28px] font-semibold tracking-tight text-go-text sm:text-[32px]">
                  {title}
                </h2>
              ) : null}
              {description ? (
                <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-go-text-secondary">
                  {description}
                </p>
              ) : null}
            </div>
            {actions ? (
              <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>
            ) : null}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

export function WorkspacePanel({
  title,
  description,
  actions,
  children,
  className,
  bodyClassName,
}) {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-[10px] border border-go-border bg-go-surface",
        className
      )}
    >
      {(title || description || actions) && (
        <div className="flex flex-col gap-2 border-b border-go-border px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div className="min-w-0">
            {title ? (
              <h3 className="text-[14px] font-medium text-go-text">{title}</h3>
            ) : null}
            {description ? (
              <p className="mt-0.5 text-[13px] text-go-text-muted">{description}</p>
            ) : null}
          </div>
          {actions ? <div className="flex shrink-0 flex-wrap gap-2">{actions}</div> : null}
        </div>
      )}
      <div className={cn("p-4 sm:p-5", bodyClassName)}>{children}</div>
    </section>
  );
}

export function PrimaryButton({ className, children, ...props }) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex h-11 items-center justify-center rounded-[10px] bg-go-primary px-5",
        "text-[14px] font-medium text-white go-transition hover:bg-go-primary-hover",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-go-primary",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function GhostButton({ className, children, ...props }) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex h-10 items-center justify-center gap-2 rounded-[10px] border border-go-border",
        "bg-transparent px-3.5 text-[13px] font-medium text-go-text-secondary go-transition",
        "hover:border-go-border-strong hover:bg-white/[0.04] hover:text-go-text",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-go-primary",
        "disabled:cursor-not-allowed disabled:opacity-40",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function fieldClassName(extra = "") {
  return cn(
    "h-11 w-full rounded-[10px] border border-go-border bg-go-surface-elevated px-3",
    "text-[14px] text-go-text placeholder:text-go-text-muted",
    "go-transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-go-primary",
    "disabled:cursor-not-allowed disabled:opacity-60",
    extra
  );
}
