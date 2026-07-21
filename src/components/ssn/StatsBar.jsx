import React from 'react';
import { motion } from 'framer-motion';
import { Activity, TrendingUp, Map } from 'lucide-react';

export default function StatsBar({ stats }) {
  const getRiskColor = (score) => {
    if (score === 0) return 'text-gray-500';
    if (score >= 70) return 'text-red-400';
    if (score >= 40) return 'text-amber-400';
    return 'text-green-400';
  };

  const statsConfig = [
    { 
      label: "Session Lookups", 
      value: stats.totalLookups, 
      icon: Activity,
      color: "text-white"
    },
    { 
      label: "Avg Risk Score", 
      value: stats.totalLookups > 0 ? `${stats.averageRiskScore}/100` : "—", 
      icon: TrendingUp,
      color: stats.totalLookups > 0 ? getRiskColor(stats.averageRiskScore) : "text-gray-500",
      subtitle: stats.totalLookups > 0 ? (
        stats.averageRiskScore >= 70 ? "High" : 
        stats.averageRiskScore >= 40 ? "Medium" : "Low"
      ) : null
    },
    { 
      label: "States Analyzed", 
      value: stats.uniqueStates, 
      icon: Map,
      color: "text-white"
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
      {statsConfig.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4 hover:bg-white/[0.05] transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-7 h-7 rounded-md bg-white/5 flex items-center justify-center`}>
                <stat.icon className={`w-3.5 h-3.5 text-gray-400`} />
              </div>
            </div>
            <div className={`text-2xl font-bold mb-1 ${stat.color}`}>
              {stat.value}
            </div>
            <div className="flex items-center justify-between">
              <div className="text-[10px] text-gray-600 uppercase tracking-wider">{stat.label}</div>
              {stat.subtitle && (
                <div className={`text-[10px] font-medium uppercase tracking-wider ${stat.color}`}>
                  {stat.subtitle}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}