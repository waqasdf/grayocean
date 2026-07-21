import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MinimalBadge } from "../ui/minimal-badge";
import { motion } from "framer-motion";

export default function AdditionalIntelligence({ insights }) {
  if (!insights) return null;

  const categories = [
    {
      title: "Schools & education",
      items: insights.schools || [],
      variant: "info",
    },
    {
      title: "Safety & crime",
      items: insights.crime || [],
      variant: "warning",
    },
    {
      title: "Walkability & transit",
      items: insights.walkability || [],
      variant: "success",
    },
    {
      title: "Local amenities",
      items: insights.amenities || [],
      variant: "neutral",
    },
  ];

  return (
    <Card>
      <CardHeader className="border-b border-go-border">
        <CardTitle className="text-[14px] font-medium text-go-text">
          Additional intelligence
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        {categories.map(
          (category, idx) =>
            category.items.length > 0 && (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className="mb-3 flex items-center gap-2">
                  <MinimalBadge variant={category.variant} size="xs">
                    {category.title}
                  </MinimalBadge>
                </div>
                <div className="space-y-2">
                  {category.items.map((item, index) => (
                    <div
                      key={index}
                      className="rounded-[8px] border border-go-border bg-go-surface-muted p-3"
                    >
                      <p className="text-[13px] text-go-text-secondary">{item}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )
        )}
      </CardContent>
    </Card>
  );
}
