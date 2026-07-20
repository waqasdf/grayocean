import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MinimalBadge } from "../ui/minimal-badge";
import { motion } from 'framer-motion';

export default function AdditionalIntelligence({ insights }) {
  if (!insights) return null;

  const categories = [
    {
      title: 'Schools & Education',
      items: insights.schools || [],
      variant: 'info',
    },
    {
      title: 'Safety & Crime',
      items: insights.crime || [],
      variant: 'warning',
    },
    {
      title: 'Walkability & Transit',
      items: insights.walkability || [],
      variant: 'success',
    },
    {
      title: 'Local Amenities',
      items: insights.amenities || [],
      variant: 'neutral',
    }
  ];

  return (
    <Card className="go-panel shadow-none">
      <CardHeader className="border-b border-[color:var(--go-border)] px-4 py-3">
        <CardTitle className="text-[12px] font-medium text-[color:var(--go-text-secondary)] text-center">
          Additional Intelligence
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-5">
        {categories.map((category, idx) => (
          category.items.length > 0 && (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <MinimalBadge variant={category.variant} size="xs">
                  {category.title}
                </MinimalBadge>
              </div>
              <div className="space-y-2">
                {category.items.map((item, index) => (
                  <div
                    key={index}
                    className="p-3 rounded-lg bg-[var(--go-bg-panel)] border border-[color:var(--go-border)] text-center"
                  >
                    <p className="text-[13px] text-[color:var(--go-text-body)]">{item}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )
        ))}
      </CardContent>
    </Card>
  );
}
