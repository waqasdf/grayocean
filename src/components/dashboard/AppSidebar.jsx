import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { cn } from "@/lib/utils";
import { BrandLockup } from "@/components/dashboard/BrandLockup";
import { ChevronUp } from "lucide-react";

export function AppSidebar({
  groups,
  currentPageName,
  onNavigate,
  onSignIn,
  user,
  initials,
  className,
}) {
  return (
    <aside
      className={cn(
        "flex h-full w-[276px] flex-col border-r border-go-border bg-go-sidebar",
        className
      )}
    >
      <div className="flex h-20 shrink-0 items-center border-b border-go-border px-5">
        <BrandLockup onNavigate={onNavigate} />
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-5" aria-label="Main">
        <div className="flex flex-col gap-6">
          {groups.map((group) => (
            <div key={group.label}>
              <p className="mb-2 px-3 text-[11px] font-medium uppercase tracking-[0.08em] text-go-text-muted">
                {group.label}
              </p>
              <ul className="flex flex-col gap-0.5">
                {group.items.map((item) => {
                  const active =
                    item.page != null && currentPageName === item.page;
                  const Icon = item.icon;

                  if (item.soon) {
                    return (
                      <li key={item.name}>
                        <span
                          className="flex h-11 cursor-not-allowed items-center gap-3 rounded-[10px] px-3 text-[14px] text-go-text-muted opacity-70"
                          aria-disabled="true"
                        >
                          <Icon className="size-[18px] shrink-0" aria-hidden />
                          <span className="flex min-w-0 flex-1 items-center justify-between gap-2">
                            <span className="truncate">{item.name}</span>
                            <span className="rounded-md border border-go-border px-1.5 py-0.5 text-[10px] font-medium text-go-text-muted">
                              Soon
                            </span>
                          </span>
                        </span>
                      </li>
                    );
                  }

                  return (
                    <li key={item.name}>
                      <Link
                        to={createPageUrl(item.page)}
                        onClick={onNavigate}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "flex h-11 items-center gap-3 rounded-[10px] px-3 text-[14px] go-transition",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-go-primary",
                          active
                            ? "border border-go-border bg-white/[0.06] font-medium text-go-text"
                            : "border border-transparent text-go-text-secondary hover:bg-white/[0.04] hover:text-go-text"
                        )}
                      >
                        <Icon
                          className={cn(
                            "size-[18px] shrink-0",
                            active ? "text-go-text" : "text-go-text-muted"
                          )}
                          aria-hidden
                        />
                        <span className="truncate">{item.name}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </nav>

      <div className="shrink-0 border-t border-go-border p-3">
        {user ? (
          <Link
            to={createPageUrl("Account")}
            onClick={onNavigate}
            className="flex items-center gap-3 rounded-[10px] px-2 py-2 go-transition hover:bg-white/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-go-primary"
          >
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full border border-go-border bg-go-surface-elevated text-[11px] font-semibold text-go-text">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-medium text-go-text leading-tight">
                {user.full_name || "User"}
              </p>
              <p className="truncate text-[12px] text-go-text-muted">
                {user.email}
              </p>
            </div>
            <ChevronUp className="size-4 shrink-0 text-go-text-muted" aria-hidden />
          </Link>
        ) : (
          <button
            type="button"
            onClick={onSignIn}
            className="w-full rounded-[10px] px-3 py-2 text-left text-[13px] font-medium text-go-text-secondary hover:bg-white/[0.04]"
          >
            Sign in
          </button>
        )}
      </div>
    </aside>
  );
}
