import React, { useState } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";
import { motion } from "framer-motion";

const BAR_COLORS = ['#3b82f6', '#60a5fa', '#2563eb', '#93c5fd', '#1d4ed8', '#38bdf8', '#22c55e', '#f59e0b'];

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="rounded-lg border border-[color:var(--go-border)] bg-[var(--go-bg-card)] px-3 py-2 shadow-none">
      <div className="text-[12px] font-medium text-[color:var(--go-text)]">{d.state}</div>
      <div className="text-[12px] text-[color:var(--go-text-muted)] mt-0.5 font-mono">{d.count} record{d.count !== 1 ? 's' : ''}</div>
      {d.pct > 0 && <div className="text-[12px] text-[color:var(--go-text-muted)] mt-0.5 font-mono">{d.pct.toFixed(1)}% of batch</div>}
    </div>
  );
}

export default function StatePatternChart({ results }) {
  const [activeIdx, setActiveIdx] = useState(null);

  const stateCounts = results.results.reduce((acc, r) => {
    const state = r.state || 'Unknown';
    acc[state] = (acc[state] || 0) + 1;
    return acc;
  }, {});

  const data = Object.entries(stateCounts)
    .map(([state, count]) => ({
      state,
      count,
      pct: results.total_count > 0 ? (count / results.total_count) * 100 : 0,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  const hasData = data.length > 0;
  const uniqueStates = Object.keys(stateCounts).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="go-panel overflow-hidden"
    >
      <div className="px-4 py-3 border-b border-[color:var(--go-border)] flex items-center justify-between">
        <span className="text-[12px] font-medium text-[color:var(--go-text-secondary)]">State Patterns</span>
        <span className="text-[12px] font-mono text-[color:var(--go-text-muted)]">{uniqueStates} state{uniqueStates !== 1 ? 's' : ''}</span>
      </div>

      <div className="p-4">
        {!hasData ? (
          <div className="h-48 flex items-center justify-center text-[12px] text-[color:var(--go-text-muted)]">No state data</div>
        ) : (
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                layout="vertical"
                margin={{ top: 4, right: 16, bottom: 4, left: 8 }}
                barCategoryGap={6}
              >
                <XAxis
                  type="number"
                  tick={{ fill: 'var(--go-text-muted)', fontSize: 10, fontFamily: 'monospace' }}
                  tickLine={false}
                  axisLine={{ stroke: 'var(--go-border)' }}
                />
                <YAxis
                  type="category"
                  dataKey="state"
                  tick={{ fill: 'var(--go-text-secondary)', fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  width={110}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: 'var(--go-accent-soft)' }}
                />
                <Bar
                  dataKey="count"
                  radius={[0, 4, 4, 0]}
                  animationDuration={900}
                  animationBegin={200}
                >
                  {data.map((_, i) => (
                    <Cell
                      key={i}
                      fill={BAR_COLORS[i % BAR_COLORS.length]}
                      opacity={activeIdx === null || activeIdx === i ? 1 : 0.4}
                      onMouseEnter={() => setActiveIdx(i)}
                      onMouseLeave={() => setActiveIdx(null)}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </motion.div>
  );
}
