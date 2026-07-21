import { useState } from "react";
import { Lock, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { LookupCostHint } from "@/components/shared/LookupCostHint";

function formatSSN(raw) {
  const digits = String(raw || "").replace(/\D/g, "").slice(0, 9);
  if (digits.length <= 3) return digits;
  if (digits.length <= 5) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5)}`;
}

export function SearchForm({
  value,
  onChange,
  onLookup,
  isProcessing = false,
  error = "",
  costCents = 10,
  className,
}) {
  const [touched, setTouched] = useState(false);
  const digits = String(value || "").replace(/\D/g, "");
  const canSubmit = digits.length === 9 && !isProcessing;
  const showValidation =
    touched && digits.length > 0 && digits.length < 9;

  const handleChange = (e) => {
    const next = formatSSN(e.target.value);
    onChange?.(next);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched(true);
    if (digits.length !== 9) return;
    onLookup?.(formatSSN(digits));
  };

  return (
    <div className={cn("w-full", className)}>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 sm:flex-row sm:items-stretch"
      >
        <div className="relative min-w-0 flex-1">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-go-text-muted"
            aria-hidden
          />
          <input
            type="text"
            inputMode="numeric"
            autoComplete="off"
            spellCheck={false}
            value={value}
            onChange={handleChange}
            onBlur={() => setTouched(true)}
            placeholder="Enter 9-digit SSN (e.g. 545-23-4567)"
            aria-invalid={Boolean(error) || showValidation}
            aria-describedby={
              error || showValidation ? "ssn-search-hint" : undefined
            }
            disabled={isProcessing}
            className={cn(
              "h-12 w-full rounded-[10px] border border-go-border bg-go-surface-elevated pl-10 pr-4",
              "text-[15px] text-go-text placeholder:text-go-text-muted",
              "go-transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-go-primary focus-visible:ring-offset-0",
              "disabled:cursor-not-allowed disabled:opacity-60"
            )}
          />
        </div>
        <button
          type="submit"
          disabled={!canSubmit}
          className={cn(
            "inline-flex h-12 shrink-0 items-center justify-center rounded-[10px] px-6",
            "bg-go-primary text-[14px] font-medium text-white go-transition",
            "hover:bg-go-primary-hover",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-go-primary focus-visible:ring-offset-2 focus-visible:ring-offset-go-bg",
            "disabled:cursor-not-allowed disabled:opacity-50"
          )}
        >
          {isProcessing ? "Looking up…" : "Lookup"}
        </button>
      </form>

      <LookupCostHint label="SSN validation" costCents={costCents} />

      {(error || showValidation) && (
        <p id="ssn-search-hint" className="mt-2 text-[13px] text-go-text-muted" role="status">
          {error || "Enter all 9 digits to run a lookup."}
        </p>
      )}

      <p className="mt-3 flex items-center gap-1.5 text-[12px] text-go-text-muted">
        <Lock className="size-3.5 shrink-0" aria-hidden />
        Your search is encrypted and secure
      </p>
    </div>
  );
}

export { formatSSN };
