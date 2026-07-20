import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MinimalBadge } from "../ui/minimal-badge";
import { motion } from "framer-motion";
import { AlertCircle } from 'lucide-react';

// Helper function - now returns text as-is (no blurring)
const blurSSNInText = (text, ssnData, isSubscribed) => {
  return text;
};

export default function AIInsights({ insights, isLoading, isSubscribed = true, ssnData = null }) {
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="go-panel shadow-none">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-5 h-5 border-2 border-[color:var(--go-accent-border)] border-t-[color:var(--go-accent)] rounded-full animate-spin" />
                <div className="absolute inset-0 w-5 h-5 border-2 border-[color:var(--go-accent-soft)] rounded-full animate-ping" />
              </div>
              <div className="flex-1">
                <div className="text-xs font-medium mb-1" style={{ color: 'var(--go-text)' }}>AI Analysis in Progress</div>
                <div className="text-[10px]" style={{ color: 'var(--go-text-muted)' }}>Running forensic pattern analysis</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (!insights) return null;

  const isFallback = insights.summary?.includes("temporarily unavailable");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="go-panel shadow-none">
        <CardHeader className="border-b border-[color:var(--go-border)] pb-4">
          <CardTitle className="text-xs font-semibold text-[color:var(--go-text-body)] flex items-center gap-2">
            AI-Powered Forensic Analysis
            <span className="ml-auto">
              {isFallback ? (
                <MinimalBadge variant="neutral" size="xs">
                  Offline
                </MinimalBadge>
              ) : (
                <MinimalBadge variant="purple" size="xs">
                  Advanced
                </MinimalBadge>
              )}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {isFallback && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[var(--go-warning-fill)] border border-[color:var(--go-warning-border)] rounded-lg p-3 flex items-start gap-2"
            >
              <AlertCircle className="w-4 h-4 text-[color:var(--go-warning)] mt-0.5 flex-shrink-0" />
              <div className="text-[10px]" style={{ color: 'var(--go-text-secondary)' }}>
                AI insights are temporarily unavailable. All core analysis features are still fully functional below.
              </div>
            </motion.div>
          )}

          {insights.summary && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="text-[10px] font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--go-text)' }}>Executive Summary</h3>
              <p className="text-[10px] leading-relaxed" style={{ color: 'var(--go-text-secondary)' }}>
                {blurSSNInText(insights.summary, ssnData, isSubscribed)}
              </p>
            </motion.div>
          )}

          {insights.historical_context && !isFallback && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-[10px] font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--go-text)' }}>Historical Context</h3>
              <p className="text-[10px] leading-relaxed" style={{ color: 'var(--go-text-secondary)' }}>
                {blurSSNInText(insights.historical_context, ssnData, isSubscribed)}
              </p>
            </motion.div>
          )}

          {insights.pattern_analysis && !isFallback && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-[10px] font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--go-text)' }}>Pattern Analysis</h3>
              <p className="text-[10px] leading-relaxed" style={{ color: 'var(--go-text-secondary)' }}>
                {blurSSNInText(insights.pattern_analysis, ssnData, isSubscribed)}
              </p>
            </motion.div>
          )}

          {insights.security_notes && !isFallback && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-[10px] font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--go-text)' }}>Security Assessment</h3>
              <p className="text-[10px] leading-relaxed" style={{ color: 'var(--go-text-secondary)' }}>
                {blurSSNInText(insights.security_notes, ssnData, isSubscribed)}
              </p>
            </motion.div>
          )}

          {insights.recommendations && insights.recommendations.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h3 className="text-[10px] font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--go-text)' }}>Key Findings</h3>
              <ul className="space-y-2">
                {insights.recommendations.map((rec, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="flex gap-2 text-[10px] text-[color:var(--go-text-secondary)] p-3 rounded-lg bg-[var(--go-bg-panel)] border border-[color:var(--go-border)] hover:border-[color:var(--go-accent-border)] hover:bg-[var(--go-accent-soft)] transition-all"
                  >
                    <div className="w-1 h-1 rounded-full bg-[var(--go-accent)] mt-1.5 flex-shrink-0"></div>
                    <span>{blurSSNInText(rec, ssnData, isSubscribed)}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
