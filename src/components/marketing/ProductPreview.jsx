/**
 * Static product preview — CSS mock of the workspace.
 * No screenshots required; keeps the landing self-contained.
 */
export default function ProductPreview() {
  return (
    <div
      className="rounded-2xl border overflow-hidden"
      style={{
        background: "var(--go-bg-card)",
        borderColor: "var(--go-border)",
        boxShadow: "var(--go-shadow-card)",
      }}
      aria-hidden
    >
      <div
        className="flex items-center gap-2 px-4 h-10 border-b"
        style={{ borderColor: "var(--go-border-subtle)", background: "var(--go-bg-panel)" }}
      >
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: "var(--go-border-strong)" }} />
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: "var(--go-border-strong)" }} />
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: "var(--go-border-strong)" }} />
        </div>
        <div
          className="ml-3 flex-1 h-6 rounded-md text-[11px] flex items-center px-2.5"
          style={{
            background: "var(--go-bg)",
            color: "var(--go-text-muted)",
            border: "1px solid var(--go-border)",
          }}
        >
          app.grayocean.io / SSN Lookup
        </div>
      </div>

      <div className="flex min-h-[320px] md:min-h-[400px]">
        <aside
          className="hidden sm:flex w-[160px] flex-col gap-1 p-3 border-r"
          style={{ borderColor: "var(--go-border-subtle)", background: "var(--go-bg-sidebar)" }}
        >
          {["SSN Lookup", "Address Intel", "Batch", "Compare", "Skiptrace", "API"].map((label, i) => (
            <div
              key={label}
              className="h-8 rounded-lg px-2.5 flex items-center text-[12px]"
              style={{
                background: i === 0 ? "var(--go-bg-elevated)" : "transparent",
                color: i === 0 ? "var(--go-text)" : "var(--go-text-muted)",
              }}
            >
              {label}
            </div>
          ))}
        </aside>

        <div className="flex-1 p-4 md:p-6 space-y-4" style={{ background: "var(--go-bg)" }}>
          <div>
            <div className="text-[11px] mb-1 uppercase tracking-wide" style={{ color: "var(--go-text-muted)" }}>
              Identity intelligence
            </div>
            <div className="text-[18px] font-medium" style={{ color: "var(--go-text)" }}>
              SSN Lookup
            </div>
          </div>

          <div
            className="rounded-xl border p-4"
            style={{ background: "var(--go-bg-card)", borderColor: "var(--go-border)" }}
          >
            <div className="text-[12px] mb-2" style={{ color: "var(--go-text-secondary)" }}>
              Social Security Number
            </div>
            <div
              className="h-11 rounded-lg border flex items-center justify-center font-mono text-[15px] tracking-widest"
              style={{
                background: "var(--go-input-bg)",
                borderColor: "var(--go-border)",
                color: "var(--go-text)",
              }}
            >
              545-23-••••
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            {[
              { k: "State", v: "California" },
              { k: "Period", v: "1985–1988" },
              { k: "Risk", v: "Low" },
            ].map((cell) => (
              <div
                key={cell.k}
                className="rounded-xl border p-3"
                style={{ background: "var(--go-bg-card)", borderColor: "var(--go-border)" }}
              >
                <div className="text-[11px] mb-1" style={{ color: "var(--go-text-muted)" }}>
                  {cell.k}
                </div>
                <div className="text-[13px] font-medium" style={{ color: "var(--go-text)" }}>
                  {cell.v}
                </div>
              </div>
            ))}
          </div>

          <div
            className="rounded-xl border p-3 flex items-center gap-3"
            style={{
              background: "var(--go-success-fill)",
              borderColor: "var(--go-success-border)",
            }}
          >
            <div className="w-2 h-2 rounded-full" style={{ background: "var(--go-success)" }} />
            <div className="text-[12px]" style={{ color: "var(--go-text-secondary)" }}>
              Valid format · No death-record match · Score 18/100
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
