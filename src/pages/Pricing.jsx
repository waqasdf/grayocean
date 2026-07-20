import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MinimalBadge } from "@/components/ui/minimal-badge";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[var(--go-bg)] py-5 md:py-6">
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-5 text-center"
        >
          <h1 className="go-page-title">
            Pricing
          </h1>
          <p className="go-page-subtitle mt-1.5 mx-auto">
            Free access for all users
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-2xl mx-auto"
        >
          <Card className="go-panel shadow-none ">
            <CardHeader className="border-b border-[color:var(--go-border)] text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <CardTitle className="text-xl font-semibold text-[color:var(--go-text)]">
                  Free Access
                </CardTitle>
                <MinimalBadge variant="info" size="sm">Active</MinimalBadge>
              </div>
              <div className="text-[28px] font-semibold tracking-tight text-[color:var(--go-text)] mb-2">
                $0
                <span className="text-[13px] text-[color:var(--go-text-secondary)] font-normal"> / forever</span>
              </div>
              <p className="text-[13px] text-[color:var(--go-text-secondary)]">
                All features included at no cost
              </p>
            </CardHeader>
            <CardContent className="p-5">
              <div className="space-y-4 mb-8">
                {[
                  'Unlimited SSN lookups and analysis',
                  'Address intelligence and demographics',
                  'Batch processing and comparison',
                  'Skiptrace public records search',
                  'SSN generator with full data',
                  'Save unlimited records',
                  'API access',
                  'All features included'
                ].map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[var(--go-accent-soft)] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-[color:var(--go-accent-text)]" />
                    </div>
                    <span className="text-sm text-[color:var(--go-text-body)]">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="bg-[var(--go-bg-panel)] border border-[color:var(--go-border)] rounded-lg p-4 text-center">
                <p className="text-xs text-[color:var(--go-text-secondary)]">
                  This application is free for all users. No payment required.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 text-center"
        >
          <p className="text-xs text-[color:var(--go-text-muted)]">
            Questions? Contact support for assistance
          </p>
        </motion.div>
      </div>
    </div>
  );
}