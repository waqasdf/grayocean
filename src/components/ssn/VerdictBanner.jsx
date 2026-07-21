import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ShieldAlert, ShieldX, Copy, Download } from 'lucide-react';
import { MinimalBadge } from '@/components/ui/minimal-badge';

export default function VerdictBanner({ results, riskScore }) {
  if (!results || !riskScore) return null;

  const isHighRisk = riskScore.risk_level === 'high';
  const isMediumRisk = riskScore.risk_level === 'medium';
  const isValid = results.is_valid;

  const borderColor = isHighRisk ? 'border-red-500/50' : isMediumRisk ? 'border-amber-500/40' : 'border-green-500/30';
  const bgColor = isHighRisk ? 'bg-red-500/10' : isMediumRisk ? 'bg-amber-500/8' : 'bg-green-500/8';
  const accentColor = isHighRisk ? 'from-red-500/20 to-transparent' : isMediumRisk ? 'from-amber-500/15 to-transparent' : 'from-green-500/10 to-transparent';

  const Icon = isHighRisk ? ShieldX : isMediumRisk ? ShieldAlert : ShieldCheck;
  const iconColor = isHighRisk ? 'text-red-400' : isMediumRisk ? 'text-amber-400' : 'text-green-400';
  const verdictText = isHighRisk ? 'HIGH RISK' : isMediumRisk ? 'MODERATE RISK' : 'LOW RISK';
  const verdictVariant = isHighRisk ? 'warning' : isMediumRisk ? 'cyan' : 'success';

  const criticalFlags = riskScore.flags?.filter(f => f.level === 'critical' || f.level === 'high') || [];

  const handleCopy = () => {
    const text = `SSN Lookup Result\nSSN: ${results.ssn}\nValid: ${isValid ? 'Yes' : 'No'}\nState: ${results.state}\nPeriod: ${results.year_range}\nRisk: ${riskScore.risk_level} (${riskScore.score}/100)\n${criticalFlags.map(f => `⚠ ${f.message}`).join('\n')}`;
    navigator.clipboard.writeText(text);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35 }}
      className={`rounded-xl border ${borderColor} ${bgColor} overflow-hidden`}
    >
      <div className={`h-0.5 w-full bg-gradient-to-r ${accentColor}`} />
      <div className="p-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-4">
            <Icon className={`w-8 h-8 ${iconColor} flex-shrink-0`} />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-base font-bold text-white tracking-tight">
                  {isValid ? 'Valid Format' : 'Invalid Format'}
                </span>
                <MinimalBadge variant={verdictVariant} size="sm">{verdictText}</MinimalBadge>
              </div>
              <p className="text-xs text-gray-400">
                {results.state !== 'Unknown/Invalid' ? `Issued in ${results.state}` : 'State unknown'} · {results.year_range} · Score {riskScore.score}/100
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-gray-400 hover:text-white border border-white/10 hover:border-white/20 transition-all"
            >
              <Copy className="w-3 h-3" />
              Copy
            </button>
          </div>
        </div>

        {criticalFlags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {criticalFlags.slice(0, 3).map((flag, i) => (
              <div key={i} className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-500/10 border border-red-500/20 text-[10px] text-red-300">
                <div className="w-1 h-1 rounded-full bg-red-400 flex-shrink-0" />
                {flag.message.length > 70 ? flag.message.substring(0, 70) + '…' : flag.message}
              </div>
            ))}
            {criticalFlags.length > 3 && (
              <div className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] text-gray-500">
                +{criticalFlags.length - 3} more flags
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}