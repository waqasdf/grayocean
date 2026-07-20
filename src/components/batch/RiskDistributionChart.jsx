import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { motion } from "framer-motion";

const RISK_META = [
  { key: 'low', label: 'Low Risk', color: '#4cb782' },
  { key: 'medium', label: 'Medium', color: '#5e6ad2' },
  { key: 'high', label: 'High Risk', color: '#e5a550' },
  { key: 'invalid', label: 'Invalid', color: '#e5484d' },
];

export default function RiskDistributionChart({ results }) {
  const counts = RISK_META.map(meta => ({
    ...meta,
    value: results.results.filter(r => r.riskLevel === meta.key).length,
  })).filter(d => d.value > 0);

  const total = results.total_count;
  const highRiskPct = total > 0 ? Math.round((results.high_risk_count / total) * 100) : 0;
  const hasData = counts.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="go-panel overflow-hidden"
    >
      <div className="px-4 py-3 border-b border-[color:var(--go-border)] flex items-center justify-between">
        <span className="text-[12px] font-medium text-[color:var(--go-text-secondary)]">Risk Distribution</span>
        <span className="text-[12px] font-mono text-[color:var(--go-text-muted)]">{total.toLocaleString()} total</span>
      </div>

      <div className="p-4">
        {!hasData ? (
          <div className="h-48 flex items-center justify-center text-[12px] text-[color:var(--go-text-muted)]">No risk data</div>
        ) : (
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Donut */}
            <div className="relative w-44 h-44 flex-shrink-0">
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
                    {counts.map(entry => (
                      <Cell key={entry.key} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              {/* Center label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <div className="text-2xl font-semibold font-mono text-[color:var(--go-text)] leading-none">
                  {highRiskPct}<span className="text-sm text-[color:var(--go-text-muted)]">%</span>
                </div>
                <div className="text-[12px] text-[color:var(--go-text-muted)] mt-1">High Risk</div>
              </div>
            </div>

            {/* Legend */}
            <div className="flex-1 w-full space-y-2">
              {counts.map(entry => {
                const pct = total > 0 ? (entry.value / total) * 100 : 0;
                return (
                  <div key={entry.key} className="flex items-center gap-3">
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ background: entry.color }}
                    />
                    <span className="text-[13px] text-[color:var(--go-text-secondary)] flex-1">{entry.label}</span>
                    <span className="text-[13px] font-mono text-[color:var(--go-text)]">{entry.value.toLocaleString()}</span>
                    <span className="text-[12px] font-mono text-[color:var(--go-text-muted)] w-10 text-right">{pct.toFixed(1)}%</span>
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
