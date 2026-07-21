import { Menu, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { cn } from "@/lib/utils";
import { formatCents } from "@/lib/creditsApi";

export function TopHeader({
  title,
  onOpenNav,
  user,
  initials,
  className,
}) {
  const balance =
    typeof user?.credit_balance_cents === "number" ? user.credit_balance_cents : null;

  return (
    <header
      className={cn(
        "z-20 flex h-16 shrink-0 items-center justify-between gap-2 border-b border-go-border bg-go-bg px-3 sm:h-20 sm:gap-3 sm:px-4 md:px-8",
        className
      )}
    >
      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={onOpenNav}
          className="inline-flex size-10 shrink-0 items-center justify-center rounded-[10px] text-go-text-secondary go-transition hover:bg-white/[0.04] hover:text-go-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-go-primary md:hidden"
          aria-label="Open navigation"
        >
          <Menu className="size-5" />
        </button>
        <h1 className="truncate text-[14px] font-medium text-go-text sm:text-[15px]">
          {title}
        </h1>
      </div>

      <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
        {balance != null ? (
          <Link
            to={createPageUrl("Pricing")}
            className="flex items-center gap-1.5 rounded-[10px] border border-go-border px-2 py-1.5 go-transition hover:bg-white/[0.04] sm:gap-2 sm:px-3"
            title="Credit balance"
          >
            <span className="hidden text-[11px] text-go-text-muted sm:inline">
              Balance
            </span>
            <span className="font-mono text-[12px] font-medium text-go-text sm:text-[13px]">
              {formatCents(balance)}
            </span>
          </Link>
        ) : null}
        <button
          type="button"
          className="inline-flex size-10 items-center justify-center rounded-[10px] text-go-text-muted go-transition hover:bg-white/[0.04] hover:text-go-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-go-primary"
          aria-label="Help"
        >
          <HelpCircle className="size-[18px]" />
        </button>
        {user ? (
          <Link
            to={createPageUrl("Account")}
            className="flex size-10 items-center justify-center rounded-full border border-go-border bg-go-surface-elevated text-[11px] font-semibold text-go-text go-transition hover:border-go-border-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-go-primary"
            aria-label="Account"
            title={user.full_name || user.email}
          >
            {initials}
          </Link>
        ) : null}
      </div>
    </header>
  );
}
