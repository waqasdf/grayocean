import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Loader2 } from 'lucide-react';

const steps = [
  { id: 'validate', label: 'Validating SSN format & patterns' },
  { id: 'risk', label: 'Computing risk score' },
  { id: 'deceased', label: 'Checking death records...' },
];

export default function LoadingStatus({ isLoadingDeceased, hasDeceased }) {
  const getStepStatus = (id) => {
    if (id === 'validate') return 'done';
    if (id === 'risk') return 'done';
    if (id === 'deceased') return isLoadingDeceased ? 'loading' : hasDeceased ? 'done' : 'pending';
    return 'pending';
  };

  if (!isLoadingDeceased && hasDeceased) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="flex flex-wrap items-center gap-x-4 gap-y-1 px-1"
    >
      {steps.map((step) => {
        const status = getStepStatus(step.id);
        if (status === 'pending') return null;
        return (
          <div key={step.id} className="flex items-center gap-1.5">
            {status === 'loading' ? (
              <Loader2 className="w-3 h-3 animate-spin" style={{ color: 'var(--go-text-muted)' }} />
            ) : (
              <CheckCircle2 className="w-3 h-3" style={{ color: 'var(--go-text-muted)' }} />
            )}
            <span className="text-[12px]" style={{ color: 'var(--go-text-muted)' }}>
              {step.label}
            </span>
          </div>
        );
      })}
    </motion.div>
  );
}
