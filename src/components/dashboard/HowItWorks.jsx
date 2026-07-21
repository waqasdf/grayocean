import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  "Enter an SSN",
  "Run verification",
  "Review signals",
];

export function HowItWorks({ className }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={cn("w-full", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={cn(
          "flex w-full items-center justify-center gap-2 py-2",
          "text-[13px] font-medium text-go-text-muted go-transition hover:text-go-text-secondary",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-go-primary rounded-[10px]"
        )}
      >
        How it works
        <ChevronDown
          className={cn(
            "size-4 go-transition",
            open && "rotate-180"
          )}
          aria-hidden
        />
      </button>

      {open ? (
        <ol className="mx-auto mt-2 max-w-sm space-y-2 pb-2 text-left">
          {STEPS.map((step, i) => (
            <li
              key={step}
              className="flex gap-3 text-[13px] text-go-text-secondary"
            >
              <span className="tabular-nums text-go-text-muted">{i + 1}.</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      ) : null}
    </div>
  );
}
