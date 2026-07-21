import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { motion } from "framer-motion";

const RISK_META = [
  { key: "low", label: "Low risk", color: "#a1a1aa" },
  { key: "medium", label: "Medium", color: "#71717a" },
  { key: "high", label: "High risk", color: "#4358a5" },
  { key: "invalid", label: "Invalid", color: "#52525b" },
];

export default function RiskDistributionChart({ results }) {
  const counts = RISK_META.map((meta) => ({
    ...meta,
    value: results.results.filter((r) => r.riskLevel === meta.key).length,
  })).filter((d) => d.value > 0);

  const total = results.total_count;
  const highRiskPct = total > 0 ? Math.round((results.high_risk_count / total) * 100) : 0;
  const hasData = counts.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="overflow-hidden rounded-[10px] border border-go-border bg-go-surface"
    >
      <div className="flex items-center justify-between border-b border-go-border px-5 py-4">
        <span className="text-[14px] font-medium text-go-text">Risk distribution</span>
        <span className="font-mono text-[12px] text-go-text-muted">
          {total.toLocaleString()} total
        </span>
      </div>

      <div className="p-5">
        {!hasData ? (
          <div className="flex h-48 items-center justify-center text-[13px] text-go-text-muted">
            No risk data
          </div>
        ) : (
          <div className="flex flex-col items-center gap-6 md:flex-row">
            <div className="relative h-44 w-44 flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={counts}
                    dataKey="value"
                    nameKey="label"
                    innerRadius={52}
                    outerRadius={80}
                    paddingAngle={2}
                    stroke="none"
                    animationDuration={900}
                    animationBegin={150}
                  >
                    {counts.map((entry) => (
                      <Cell key={entry.key} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <div className="font-mono text-2xl font-semibold leading-none text-go-text">
                  {highRiskPct}
                  <span className="text-sm text-go-text-muted">%</span>
                </div>
                <div className="mt-1 text-[11px] text-go-text-muted">High risk</div>
              </div>
            </div>

            <div className="w-full flex-1 space-y-2">
              {counts.map((entry) => {
                const pct = total > 0 ? (entry.value / total) * 100 : 0;
                return (
                  <div key={entry.key} className="flex items-center gap-3">
                    <div
                      className="h-2 w-2 flex-shrink-0 rounded-full"
                      style={{ background: entry.color }}
                    />
                    <span className="flex-1 text-[13px] text-go-text-secondary">
                      {entry.label}
                    </span>
                    <span className="font-mono text-[12px] text-go-text">
                      {entry.value.toLocaleString()}
                    </span>
                    <span className="w-10 text-right font-mono text-[12px] text-go-text-muted">
                      {pct.toFixed(1)}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
