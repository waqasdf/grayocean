import React, { useState } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";
import { motion } from "framer-motion";

const BAR_COLOR = "#4358a5";
const BAR_MUTED = "#3f3f46";

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="rounded-[8px] border border-go-border bg-go-surface-elevated px-3 py-2 shadow-go-sm">
      <div className="text-[12px] font-medium text-go-text">{d.state}</div>
      <div className="mt-0.5 font-mono text-[11px] text-go-text-secondary">
        {d.count} record{d.count !== 1 ? "s" : ""}
      </div>
      {d.pct > 0 && (
        <div className="mt-0.5 font-mono text-[11px] text-go-text-muted">
          {d.pct.toFixed(1)}% of batch
        </div>
      )}
    </div>
  );
}

export default function StatePatternChart({ results }) {
  const [activeIdx, setActiveIdx] = useState(null);

  const stateCounts = results.results.reduce((acc, r) => {
    const state = r.state || "Unknown";
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
      className="overflow-hidden rounded-[10px] border border-go-border bg-go-surface"
    >
      <div className="flex items-center justify-between border-b border-go-border px-5 py-4">
        <span className="text-[14px] font-medium text-go-text">State patterns</span>
        <span className="font-mono text-[12px] text-go-text-muted">
          {uniqueStates} state{uniqueStates !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="p-5">
        {!hasData ? (
          <div className="flex h-48 items-center justify-center text-[13px] text-go-text-muted">
            No state data
          </div>
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
                  tick={{ fill: "#71717a", fontSize: 10, fontFamily: "monospace" }}
                  tickLine={false}
                  axisLine={{ stroke: "rgba(255,255,255,0.08)" }}
                />
                <YAxis
                  type="category"
                  dataKey="state"
                  tick={{ fill: "#a1a1aa", fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  width={110}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: "rgba(255,255,255,0.03)" }}
                />
                <Bar
                  dataKey="count"
                  radius={[3, 4, 4, 3]}
                  animationDuration={900}
                  animationBegin={200}
                >
                  {data.map((_, i) => (
                    <Cell
                      key={i}
                      fill={i === 0 ? BAR_COLOR : BAR_MUTED}
                      opacity={activeIdx === null || activeIdx === i ? 1 : 0.45}
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
