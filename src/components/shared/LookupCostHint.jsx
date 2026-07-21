import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useAuth } from "@/lib/AuthContext";
import { formatCents } from "@/lib/creditsApi";
import { cn } from "@/lib/utils";

/**
 * Shows lookup cost + available credit balance before the user runs a search.
 * Presentational + reads auth balance; does not charge.
 */
export function LookupCostHint({
  label = "Lookup",
  costCents,
  className,
}) {
  const { user } = useAuth();
  const balance =
    typeof user?.credit_balance_cents === "number" ? user.credit_balance_cents : 0;
  const cost = Number(costCents) || 0;
  const short = cost > 0 && balance < cost;

  return (
    <div
      className={cn(
        "mt-3 flex flex-col gap-1 text-[13px] text-go-text-secondary sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-4 sm:gap-y-1",
        className
      )}
    >
      <span>
        {label}
        {": "}
        <span className="font-medium text-go-text">{formatCents(cost)}</span>
        <span className="text-go-text-muted"> credits</span>
      </span>
      <span>
        Available balance:{" "}
        <span className="font-medium text-go-text">{formatCents(balance)}</span>
      </span>
      {short ? (
        <Link
          to={createPageUrl("Pricing")}
          className="font-medium text-go-primary hover:text-go-primary-hover"
        >
          Add credits
        </Link>
      ) : null}
    </div>
  );
}
