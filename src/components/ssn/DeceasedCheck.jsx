import React from 'react';
import { motion } from 'framer-motion';
import { MinimalBadge } from '@/components/ui/minimal-badge';
import { Skull, ShieldCheck, AlertTriangle, Loader2 } from 'lucide-react';

export default function DeceasedCheck({ data, isLoading }) {
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-white/10 bg-white/[0.03] p-5"
      >
        <div className="flex items-center gap-3">
          <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
          <span className="text-xs text-gray-400">Checking public death records...</span>
        </div>
      </motion.div>
    );
  }

  if (!data) return null;

  const isDeceased = data.deceased_match === true;
  const isUnknown = data.deceased_match === null || data.deceased_match === undefined;

  const borderColor = isDeceased ? 'border-red-500/60' : isUnknown ? 'border-white/10' : 'border-green-500/25';
  const bgColor = isDeceased ? 'bg-red-500/10' : isUnknown ? 'bg-white/[0.03]' : 'bg-green-500/5';
  const leftAccent = isDeceased ? 'border-l-4 border-l-red-500' : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl border ${borderColor} ${bgColor} ${leftAccent} p-5`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          {isDeceased ? (
            <Skull className="w-4 h-4 text-red-400" />
          ) : isUnknown ? (
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          ) : (
            <ShieldCheck className="w-4 h-4 text-green-400" />
          )}
          <span className="text-xs font-semibold text-white">Death Record Check</span>
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

      <p className="text-xs text-gray-400 leading-relaxed mb-3">{data.summary}</p>

      {data.details && data.details.length > 0 && (
        <div className="space-y-1.5 mt-3 border-t border-white/5 pt-3">
          {data.details.map((detail, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-gray-600 text-xs mt-0.5">•</span>
              <span className="text-xs text-gray-500">{detail}</span>
            </div>
          ))}
        </div>
      )}

      <p className="text-[10px] text-gray-600 mt-3">
        Source: Public SSDI &amp; genealogy records (pre-2014). Does not cover recent deaths.
      </p>
    </motion.div>
  );
}