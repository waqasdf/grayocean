import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Loader2 } from 'lucide-react';

const steps = [
  { id: 'validate', label: 'Validating SSN format & patterns' },
  { id: 'risk', label: 'Computing risk score' },
  { id: 'deceased', label: 'Checking death records...' },
  { id: 'ai', label: 'Running forensic AI analysis...' },
];

export default function LoadingStatus({ isLoadingDeceased, isLoadingInsights, hasDeceased, hasInsights }) {
  const getStepStatus = (id) => {
    if (id === 'validate') return 'done';
    if (id === 'risk') return 'done';
    if (id === 'deceased') return isLoadingDeceased ? 'loading' : hasDeceased ? 'done' : 'pending';
    if (id === 'ai') return isLoadingInsights ? 'loading' : hasInsights ? 'done' : 'pending';
    return 'pending';
  };

  const anyLoading = isLoadingDeceased || isLoadingInsights;
  if (!anyLoading && hasDeceased && hasInsights) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex flex-wrap items-center gap-x-4 gap-y-1 px-1"
    >
      {steps.map((step) => {
        const status = getStepStatus(step.id);
        if (status === 'pending') return null;
        return (
          <div key={step.id} className="flex items-center gap-1.5">
            {status === 'loading' ? (
              <Loader2 className="w-3 h-3 text-blue-400 animate-spin" />
            ) : (
              <CheckCircle2 className="w-3 h-3 text-green-500" />
            )}
            <span className={`text-[10px] ${status === 'loading' ? 'text-blue-400' : 'text-gray-600'}`}>
              {step.label}
            </span>
          </div>
        );
      })}
    </motion.div>
  );
}