import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function DemographicCharts({ data }) {
  const metrics = [
    {
      label: "Income level",
      value: data.median_household_income,
      max: 200000,
      format: (v) => `$${(v / 1000).toFixed(0)}k`,
    },
    {
      label: "Home value",
      value: data.median_home_value,
      max: 1000000,
      format: (v) => `$${(v / 1000).toFixed(0)}k`,
    },
    {
      label: "Education (bachelor+)",
      value: data.education_bachelor_plus,
      max: 100,
      format: (v) => `${v.toFixed(1)}%`,
    },
    {
      label: "Population density",
      value: Math.min(data.population_density, 20000),
      max: 20000,
      format: (v) => `${(v / 1000).toFixed(1)}k`,
    },
  ];

  return (
    <Card>
      <CardHeader className="border-b border-go-border">
        <CardTitle className="text-[14px] font-medium text-go-text">
          Demographic breakdown
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.08 }}
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[13px] text-go-text-secondary">{metric.label}</span>
              <span className="text-[13px] font-medium text-go-text">
                {metric.format(metric.value)}
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-go-surface-muted">
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: `${Math.min((metric.value / metric.max) * 100, 100)}%`,
                }}
                transition={{ duration: 0.8, delay: index * 0.08 }}
                className="h-full rounded-full bg-go-primary"
              />
            </div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}
