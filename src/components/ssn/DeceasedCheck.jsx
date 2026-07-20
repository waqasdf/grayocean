import React from 'react';
import { motion } from 'framer-motion';
import { MinimalBadge } from '@/components/ui/minimal-badge';
import { Skull, ShieldCheck, AlertTriangle, Loader2 } from 'lucide-react';

export default function DeceasedCheck({ data, isLoading }) {
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-lg border p-4"
        style={{ background: 'var(--go-bg-card)', borderColor: 'var(--go-border)' }}
      >
        <div className="flex items-center gap-3">
          <Loader2 className="w-4 h-4 animate-spin" style={{ color: 'var(--go-text-muted)' }} />
          <span className="text-[13px]" style={{ color: 'var(--go-text-secondary)' }}>Checking public death records...</span>
        </div>
      </motion.div>
    );
  }

  if (!data) return null;

  const isDeceased = data.deceased_match === true;
  const isUnknown = data.deceased_match === null || data.deceased_match === undefined;

  const borderColor = isDeceased
    ? 'var(--go-error-border)'
    : isUnknown
      ? 'var(--go-border)'
      : 'var(--go-success-border)';
  const bgColor = isDeceased
    ? 'var(--go-error-fill)'
    : isUnknown
      ? 'var(--go-bg-card)'
      : 'var(--go-success-fill)';
  const leftAccent = isDeceased ? 'border-l-4 border-l-[color:var(--go-error)]' : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-lg border ${leftAccent} p-4`}
      style={{ borderColor, background: bgColor }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          {isDeceased ? (
            <Skull className="w-4 h-4" style={{ color: 'var(--go-error)' }} />
          ) : isUnknown ? (
            <AlertTriangle className="w-4 h-4" style={{ color: 'var(--go-warning)' }} />
          ) : (
            <ShieldCheck className="w-4 h-4" style={{ color: 'var(--go-success)' }} />
          )}
          <span className="text-[13px] font-medium" style={{ color: 'var(--go-text)' }}>Death Record Check</span>
        </div>
        <div className="flex items-center gap-2">
          <MinimalBadge
            variant={isDeceased ? 'warning' : isUnknown ? 'neutral' : 'success'}
            size="xs"
          >
            {isDeceased ? 'MATCH FOUND' : isUnknown ? 'NO DATA' : 'NO MATCH'}
          </MinimalBadge>
          <MinimalBadge variant="neutral" size="xs">
            Public Records
          </MinimalBadge>
        </div>
      </div>

      <p className="text-[13px] leading-relaxed mb-3" style={{ color: 'var(--go-text-secondary)' }}>{data.summary}</p>

      {data.details && data.details.length > 0 && (
        <div className="space-y-1.5 mt-3 border-t pt-3" style={{ borderColor: 'var(--go-border)' }}>
          {data.details.map((detail, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-[13px] mt-0.5" style={{ color: 'var(--go-text-muted)' }}>•</span>
              <span className="text-[12px]" style={{ color: 'var(--go-text-muted)' }}>{detail}</span>
            </div>
          ))}
        </div>
      )}

      <p className="text-[12px] mt-3" style={{ color: 'var(--go-text-muted)' }}>
        Source: Public SSDI &amp; genealogy records (pre-2014). Does not cover recent deaths.
      </p>
    </motion.div>
  );
}
