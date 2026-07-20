import React from "react";
import { motion } from "framer-motion";
import { Activity, TrendingUp, Map } from "lucide-react";

export default function StatsBar({ stats }) {
  const getRiskColor = (score) => {
    if (score === 0) return "var(--go-text-muted)";
    if (score >= 70) return "var(--go-error)";
    if (score >= 40) return "var(--go-warning)";
    return "var(--go-success)";
  };

  const statsConfig = [
    {
      label: "Session Lookups",
      value: stats.totalLookups,
      color: "var(--go-text)",
    },
    {
      label: "Avg Risk Score",
      value: stats.totalLookups > 0 ? `${stats.averageRiskScore}/100` : "—",
      color:
        stats.totalLookups > 0
          ? getRiskColor(stats.averageRiskScore)
          : "var(--go-text-muted)",
      subtitle:
        stats.totalLookups > 0
          ? stats.averageRiskScore >= 70
            ? "High"
            : stats.averageRiskScore >= 40
              ? "Medium"
              : "Low"
          : null,
    },
    {
      label: "States Analyzed",
      value: stats.uniqueStates,
      color: "var(--go-text)",
    },
  ];

  const icons = [Activity, TrendingUp, Map];

  return (
    <div className="grid grid-cols-3 gap-2.5">
      {statsConfig.map((stat, index) => {
        const Icon = icons[index];
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04, duration: 0.15 }}
          >
            <div
              className="rounded-lg p-3"
              style={{
                background: "var(--go-bg-card)",
                border: "1px solid var(--go-border)",
              }}
            >
              <div className="flex items-start justify-between mb-2">
                <div
                  className="w-6 h-6 rounded-md flex items-center justify-center"
                  style={{
                    background: "var(--go-bg)",
                    border: "1px solid var(--go-border)",
                  }}
                >
                  <Icon size={13} style={{ color: "var(--go-text-muted)" }} />
                </div>
              </div>
              <div
                className="text-[18px] font-semibold tabular-nums mb-0.5"
                style={{ color: stat.color }}
              >
                {stat.value}
              </div>
              <div className="flex items-center justify-between gap-1">
                <div
                  className="text-[11px]"
                  style={{ color: "var(--go-text-muted)" }}
                >
                  {stat.label}
                </div>
                {stat.subtitle && (
                  <div
                    className="text-[11px] font-medium"
                    style={{ color: stat.color }}
                  >
                    {stat.subtitle}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
