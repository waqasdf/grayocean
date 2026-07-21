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
        <Card className="border border-white/10 bg-white/[0.03] backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-5 h-5 border-2 border-blue-500/20 border-t-blue-400 rounded-full animate-spin" />
                <div className="absolute inset-0 w-5 h-5 border-2 border-blue-500/10 rounded-full animate-ping" />
              </div>
              <div className="flex-1">
                <div className="text-xs text-white font-medium mb-1">AI Analysis in Progress</div>
                <div className="text-[10px] text-gray-400">Running forensic pattern analysis</div>
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
      <Card className="border border-white/10 bg-white/[0.03] backdrop-blur-sm">
        <CardHeader className="border-b border-white/10 pb-4">
          <CardTitle className="text-xs font-semibold text-white flex items-center gap-2">
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
              className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 flex items-start gap-2"
            >
              <AlertCircle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
              <div className="text-[10px] text-gray-300">
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
              <h3 className="text-[10px] font-semibold text-white uppercase tracking-wider mb-3">Executive Summary</h3>
              <p className="text-[10px] text-gray-200 leading-relaxed">
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
              <h3 className="text-[10px] font-semibold text-white uppercase tracking-wider mb-3">Historical Context</h3>
              <p className="text-[10px] text-gray-200 leading-relaxed">
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
              <h3 className="text-[10px] font-semibold text-white uppercase tracking-wider mb-3">Pattern Analysis</h3>
              <p className="text-[10px] text-gray-200 leading-relaxed">
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
              <h3 className="text-[10px] font-semibold text-white uppercase tracking-wider mb-3">Security Assessment</h3>
              <p className="text-[10px] text-gray-200 leading-relaxed">
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
              <h3 className="text-[10px] font-semibold text-white uppercase tracking-wider mb-3">Key Findings</h3>
              <ul className="space-y-2">
                {insights.recommendations.map((rec, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="flex gap-2 text-[10px] text-gray-200 p-3 rounded-lg bg-white/5 border border-white/10 hover:border-blue-500/30 hover:bg-gradient-to-r hover:from-blue-500/5 hover:to-gray-500/5 transition-all"
                  >
                    <div className="w-1 h-1 rounded-full bg-blue-400 mt-1.5 flex-shrink-0"></div>
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