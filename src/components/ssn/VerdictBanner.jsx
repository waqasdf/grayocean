import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ShieldAlert, ShieldX, Copy, Download } from 'lucide-react';
import { MinimalBadge } from '@/components/ui/minimal-badge';

export default function VerdictBanner({ results, riskScore }) {
  if (!results || !riskScore) return null;

  const isHighRisk = riskScore.risk_level === 'high';
  const isMediumRisk = riskScore.risk_level === 'medium';
  const isValid = results.is_valid;

  const borderColor = isHighRisk
    ? 'var(--go-error-border)'
    : isMediumRisk
      ? 'var(--go-warning-border)'
      : 'var(--go-success-border)';
  const bgColor = isHighRisk
    ? 'var(--go-error-fill)'
    : isMediumRisk
      ? 'var(--go-warning-fill)'
      : 'var(--go-success-fill)';
  const accentBar = isHighRisk
    ? 'var(--go-error)'
    : isMediumRisk
      ? 'var(--go-warning)'
      : 'var(--go-success)';

  const Icon = isHighRisk ? ShieldX : isMediumRisk ? ShieldAlert : ShieldCheck;
  const iconColor = isHighRisk
    ? 'text-[color:var(--go-error)]'
    : isMediumRisk
      ? 'text-[color:var(--go-warning)]'
      : 'text-[color:var(--go-success)]';
  const verdictText = isHighRisk ? 'HIGH RISK' : isMediumRisk ? 'MODERATE RISK' : 'LOW RISK';
  const verdictVariant = isHighRisk ? 'warning' : isMediumRisk ? 'cyan' : 'success';

  const criticalFlags = riskScore.flags?.filter(f => f.level === 'critical' || f.level === 'high') || [];

  const handleCopy = () => {
    const text = `SSN Lookup Result\nSSN: ${results.ssn}\nValid: ${isValid ? 'Yes' : 'No'}\nState: ${results.state}\nPeriod: ${results.year_range}\nRisk: ${riskScore.risk_level} (${riskScore.score}/100)\n${criticalFlags.map(f => `⚠ ${f.message}`).join('\n')}`;
    navigator.clipboard.writeText(text);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="rounded-lg border overflow-hidden"
      style={{ borderColor, background: bgColor }}
    >
      <div className="h-0.5 w-full" style={{ background: accentBar }} />
      <div className="p-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <Icon className={`w-6 h-6 ${iconColor} flex-shrink-0`} />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[14px] font-medium tracking-tight" style={{ color: 'var(--go-text)' }}>
                  {isValid ? 'Valid Format' : 'Invalid Format'}
                </span>
                <MinimalBadge variant={verdictVariant} size="sm">{verdictText}</MinimalBadge>
              </div>
              <p className="text-[12px]" style={{ color: 'var(--go-text-secondary)' }}>
                {results.state !== 'Unknown/Invalid' ? `Issued in ${results.state}` : 'State unknown'} · {results.year_range} · Score {riskScore.score}/100
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 h-8 px-3 rounded-md text-[12px] border transition-colors"
              style={{
                color: 'var(--go-text-secondary)',
                borderColor: 'var(--go-border)',
                background: 'transparent',
              }}
            >
              <Copy className="w-3 h-3" />
              Copy
            </button>
          </div>
        </div>

        {criticalFlags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {criticalFlags.slice(0, 3).map((flag, i) => (
              <div
                key={i}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[12px]"
                style={{
                  background: 'var(--go-error-fill)',
                  borderColor: 'var(--go-error-border)',
                  color: 'var(--go-error)',
                }}
              >
                <div className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: 'var(--go-error)' }} />
                {flag.message.length > 70 ? flag.message.substring(0, 70) + '…' : flag.message}
              </div>
            ))}
            {criticalFlags.length > 3 && (
              <div
                className="px-2.5 py-1 rounded-md border text-[12px]"
                style={{
                  background: 'var(--go-bg-panel)',
                  borderColor: 'var(--go-border)',
                  color: 'var(--go-text-muted)',
                }}
              >
                +{criticalFlags.length - 3} more flags
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
