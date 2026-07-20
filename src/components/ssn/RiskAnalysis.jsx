import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MinimalBadge } from "../ui/minimal-badge";
import { motion } from "framer-motion";

export default function RiskAnalysis({ riskData }) {
  const getRiskColor = (level) => {
    switch (level) {
      case 'high':
        return {
          text: 'text-[color:var(--go-error)]',
          fill: 'var(--go-error)',
        };
      case 'medium':
        return {
          text: 'text-[color:var(--go-warning)]',
          fill: 'var(--go-warning)',
        };
      case 'low':
        return {
          text: 'text-[color:var(--go-success)]',
          fill: 'var(--go-success)',
        };
      default:
        return {
          text: 'text-[color:var(--go-text-muted)]',
          fill: 'var(--go-text-muted)',
        };
    }
  };

  const getFlagColor = (level) => {
    switch (level) {
      case 'critical':
        return 'bg-[color:var(--go-error)]';
      case 'high':
        return 'bg-[color:var(--go-warning)]';
      case 'medium':
        return 'bg-[color:var(--go-warning)]';
      case 'low':
        return 'bg-[color:var(--go-accent)]';
      default:
        return 'bg-[color:var(--go-text-muted)]';
    }
  };

  const colors = getRiskColor(riskData.risk_level);
  
  const hasDeathMasterFileMatch = riskData.flags?.some(flag => 
    flag.message.includes('Death Master File')
  );

  const isGoodMatch = riskData.is_smart_match;

  const borderStyle = riskData.risk_level === 'high'
    ? { borderColor: 'var(--go-error-border)' }
    : riskData.risk_level === 'medium'
    ? { borderColor: 'var(--go-warning-border)' }
    : { borderColor: 'var(--go-border)' };

  const leftAccent = riskData.risk_level === 'high'
    ? 'border-l-4 border-l-[color:var(--go-error)]'
    : riskData.risk_level === 'medium'
    ? 'border-l-4 border-l-[color:var(--go-warning)]'
    : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card
        className={`rounded-lg border ${leftAccent}`}
        style={{ background: 'var(--go-bg-card)', ...borderStyle }}
      >
        <CardHeader className="border-b pb-3" style={{ borderColor: 'var(--go-border)' }}>
          <div>
            <CardTitle className="text-[13px] font-medium" style={{ color: 'var(--go-text)' }}>
              Risk Analysis
            </CardTitle>
            <p className="text-[12px] mt-0.5" style={{ color: 'var(--go-text-muted)' }}>
              Assessment of potential security concerns and validity issues
            </p>
          </div>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          {hasDeathMasterFileMatch && (
            <motion.div
              initial={{ opacity: 0, y: 2 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg border p-4"
              style={{
                background: 'var(--go-error-fill)',
                borderColor: 'var(--go-error-border)',
              }}
            >
              <div className="text-[13px] font-medium mb-1" style={{ color: 'var(--go-error)' }}>
                Do Not Use This Number
              </div>
              <div className="text-[12px]" style={{ color: 'var(--go-text-secondary)' }}>
                This SSN may be associated with a deceased individual. Using this number could be illegal and is strongly discouraged.
              </div>
            </motion.div>
          )}

          {isGoodMatch && !hasDeathMasterFileMatch && (
            <motion.div
              initial={{ opacity: 0, y: 2 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg border p-4"
              style={{
                background: 'var(--go-success-fill)',
                borderColor: 'var(--go-success-border)',
              }}
            >
              <div className="text-[13px] font-medium mb-1" style={{ color: 'var(--go-success)' }}>
                Smart Match
              </div>
              <div className="text-[12px]" style={{ color: 'var(--go-text-secondary)' }}>
                This number was likely never issued by the SSA and has minimal risk indicators. Ideal for use as a test number or placeholder in scenarios requiring fictional SSN data.
              </div>
            </motion.div>
          )}

          <div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="text-[11px] font-medium uppercase tracking-wider" style={{ color: 'var(--go-text-muted)' }}>Risk Score</span>
                <p className="text-[12px] mt-0.5" style={{ color: 'var(--go-text-muted)' }}>
                  How problematic this number is. Higher = more issues detected
                </p>
              </div>
              <MinimalBadge 
                variant={
                  riskData.risk_level === 'high' ? 'warning' :
                  riskData.risk_level === 'medium' ? 'cyan' :
                  'success'
                }
                size="xs"
              >
                {riskData.risk_level.toUpperCase()}
              </MinimalBadge>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div
                  className="h-1.5 rounded-full overflow-hidden"
                  style={{ background: 'var(--go-bg-panel)' }}
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${riskData.score}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{ background: colors.fill }}
                  />
                </div>
              </div>
              <span className={`text-lg font-semibold font-mono ${colors.text}`}>
                {riskData.score}
              </span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="text-[11px] font-medium uppercase tracking-wider" style={{ color: 'var(--go-text-muted)' }}>Confidence Level</span>
                <p className="text-[12px] mt-0.5" style={{ color: 'var(--go-text-muted)' }}>
                  How certain we are about our findings
                </p>
              </div>
              <span className="text-[13px] font-mono" style={{ color: 'var(--go-text)' }}>{riskData.confidence}%</span>
            </div>
            <div
              className="h-1.5 rounded-full overflow-hidden"
              style={{ background: 'var(--go-bg-panel)' }}
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${riskData.confidence}%` }}
                transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                className="h-full rounded-full"
                style={{ background: 'var(--go-accent)' }}
              />
            </div>
          </div>

          {riskData.flags && riskData.flags.length > 0 && (
            <div>
              <h3 className="text-[11px] font-medium uppercase tracking-wider mb-3" style={{ color: 'var(--go-text-muted)' }}>Detection Flags</h3>
              <div className="space-y-2">
                {riskData.flags.map((flag, index) => {
                  const flagColor = getFlagColor(flag.level);
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 2 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-start gap-3 p-3 rounded-lg border transition-colors"
                      style={{
                        background: 'var(--go-bg-panel)',
                        borderColor: 'var(--go-border)',
                      }}
                    >
                      <div className={`w-1.5 h-1.5 rounded-full ${flagColor} mt-1.5 flex-shrink-0`}></div>
                      <div className="flex-1">
                        <p className="text-[12px]" style={{ color: 'var(--go-text-secondary)' }}>{flag.message}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
