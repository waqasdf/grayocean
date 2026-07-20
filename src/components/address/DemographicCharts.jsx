import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from 'framer-motion';

export default function DemographicCharts({ data }) {
  const metrics = [
    {
      label: 'Income Level',
      value: data.median_household_income,
      max: 200000,
      format: (v) => `$${(v / 1000).toFixed(0)}k`,
    },
    {
      label: 'Home Value',
      value: data.median_home_value,
      max: 1000000,
      format: (v) => `$${(v / 1000).toFixed(0)}k`,
    },
    {
      label: 'Education (Bachelor+)',
      value: data.education_bachelor_plus,
      max: 100,
      format: (v) => `${v.toFixed(1)}%`,
    },
    {
      label: 'Population Density',
      value: Math.min(data.population_density, 20000),
      max: 20000,
      format: (v) => `${(v / 1000).toFixed(1)}k`,
    }
  ];

  return (
    <Card className="go-panel shadow-none">
      <CardHeader className="border-b border-[color:var(--go-border)] px-4 py-3">
        <CardTitle className="text-[12px] font-medium text-[color:var(--go-text-secondary)]">
          Demographic Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-5">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[12px] text-[color:var(--go-text-muted)]">{metric.label}</span>
              <span className="text-[13px] font-semibold text-[color:var(--go-text)]">
                {metric.format(metric.value)}
              </span>
            </div>
            <div className="h-1.5 bg-[var(--go-bg-panel)] border border-[color:var(--go-border)] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((metric.value / metric.max) * 100, 100)}%` }}
                transition={{ duration: 1, delay: index * 0.1 }}
                className="h-full rounded-full bg-[var(--go-accent)]"
              />
            </div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}
