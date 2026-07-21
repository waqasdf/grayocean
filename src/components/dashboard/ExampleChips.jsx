import { cn } from "@/lib/utils";

const DEFAULT_EXAMPLES = ["078-05-1120", "545-23-4567", "212-14-8832"];

export function ExampleChips({
  examples = DEFAULT_EXAMPLES,
  onSelect,
  className,
}) {
  return (
    <div className={cn("text-center", className)}>
      <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.1em] text-go-text-muted">
        Try an example
      </p>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {examples.map((ex) => (
          <button
            key={ex}
            type="button"
            onClick={() => onSelect?.(ex)}
            className={cn(
              "min-h-10 rounded-[10px] border border-go-border bg-go-surface-elevated px-3 py-2",
              "font-mono text-[12px] text-go-text-secondary go-transition",
              "hover:border-go-border-strong hover:text-go-text",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-go-primary"
            )}
          >
            {ex}
          </button>
        ))}
      </div>
    </div>
  );
}
