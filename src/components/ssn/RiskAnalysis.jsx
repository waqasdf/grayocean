import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MinimalBadge } from "../ui/minimal-badge"; // Updated import from Badge to MinimalBadge
import { motion } from "framer-motion";

export default function RiskAnalysis({ riskData }) {
  const getRiskColor = (level) => {
    switch (level) {
      case 'high':
        return {
          text: 'text-red-400',
          gradient: 'from-red-500 to-orange-500',
        };
      case 'medium':
        return {
          text: 'text-amber-400',
          gradient: 'from-amber-500 to-yellow-500',
        };
      case 'low':
        return {
          text: 'text-green-400',
          gradient: 'from-green-500 to-emerald-500',
        };
      default:
        return {
          text: 'text-gray-400',
          gradient: 'from-gray-500 to-gray-400',
        };
    }
  };

  const getFlagColor = (level) => {
    switch (level) {
      case 'critical':
        return 'bg-red-400';
      case 'high':
        return 'bg-amber-400';
      case 'medium':
        return 'bg-yellow-400';
      case 'low':
        return 'bg-blue-400';
      default:
        return 'bg-gray-400';
    }
  };

  const colors = getRiskColor(riskData.risk_level);
  
  const hasDeathMasterFileMatch = riskData.flags?.some(flag => 
    flag.message.includes('Death Master File')
  );

  const isGoodMatch = riskData.is_smart_match;

  const borderClass = riskData.risk_level === 'high'
    ? 'border-red-500/30'
    : riskData.risk_level === 'medium'
    ? 'border-amber-500/25'
    : 'border-white/10';

  const leftAccent = riskData.risk_level === 'high'
    ? 'border-l-4 border-l-red-500'
    : riskData.risk_level === 'medium'
    ? 'border-l-4 border-l-amber-500'
    : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className={`border ${borderClass} ${leftAccent} bg-white/[0.03] backdrop-blur-sm`}>
        <CardHeader className="border-b border-white/10 pb-4">
          <div>
            <CardTitle className="text-xs font-semibold text-white mb-1">
              Risk Analysis
            </CardTitle>
            <p className="text-[10px] text-gray-500">
              Assessment of potential security concerns and validity issues
            </p>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {hasDeathMasterFileMatch && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-500/20 border-2 border-red-500 rounded-lg p-4"
            >
              <div className="text-xs font-semibold text-red-400 mb-1">
                Do Not Use This Number
              </div>
              <div className="text-[10px] text-gray-300">
                This SSN may be associated with a deceased individual. Using this number could be illegal and is strongly discouraged.
              </div>
            </motion.div>
          )}

          {isGoodMatch && !hasDeathMasterFileMatch && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-green-500/20 border-2 border-green-500 rounded-lg p-4"
            >
              <div className="text-xs font-semibold text-green-400 mb-1">
                Smart Match
              </div>
              <div className="text-[10px] text-gray-300">
                This number was likely never issued by the SSA and has minimal risk indicators. Ideal for use as a test number or placeholder in scenarios requiring fictional SSN data.
              </div>
            </motion.div>
          )}

          <div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Risk Score</span>
                <p className="text-[10px] text-gray-600 mt-0.5">
                  How problematic this number is. Higher = more issues detected
                </p>
              </div>
              {/* Replaced Badge with MinimalBadge */}
              <MinimalBadge 
                variant={
                  riskData.risk_level === 'high' ? 'warning' :
                  riskData.risk_level === 'medium' ? 'cyan' :
                  'success' // Assuming 'low' maps to 'success'
                }
                size="xs"
              >
                {riskData.risk_level.toUpperCase()}
              </MinimalBadge>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${riskData.score}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-full rounded-full bg-gradient-to-r ${colors.gradient}`}
                  />
                </div>
              </div>
              <span className={`text-xl font-bold font-mono ${colors.text}`}>
                {riskData.score}
              </span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Confidence Level</span>
                <p className="text-[10px] text-gray-600 mt-0.5">
                  How certain we are about our findings
                </p>
              </div>
              <span className="text-xs font-mono text-white">{riskData.confidence}%</span>
            </div>
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${riskData.confidence}%` }}
                transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                className="h-full rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500"
              />
            </div>
          </div>

          {riskData.flags && riskData.flags.length > 0 && (
            <div>
              <h3 className="text-[10px] font-semibold text-white uppercase tracking-wider mb-3">Detection Flags</h3>
              <div className="space-y-2">
                {riskData.flags.map((flag, index) => {
                  const flagColor = getFlagColor(flag.level);
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3 p-3 bg-white/5 border border-white/10 rounded-lg hover:border-blue-500/30 hover:bg-gradient-to-r hover:from-blue-500/5 hover:to-gray-500/5 transition-all"
                    >
                      <div className={`w-1.5 h-1.5 rounded-full ${flagColor} mt-1.5 flex-shrink-0`}></div>
                      <div className="flex-1">
                        <p className="text-[10px] text-gray-300">{flag.message}</p>
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