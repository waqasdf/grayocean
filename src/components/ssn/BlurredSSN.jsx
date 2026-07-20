import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export function BlurredSSN({ ssn, isSubscribed, showUpgradeButton = false, className = "" }) {
  return <span className={className}>{ssn}</span>;
}

export function BlurredNumber({ value, isSubscribed, padLength = 4, className = "" }) {
  return <span className={className}>{value}</span>;
}

export function UpgradePrompt({ compact = false }) {
  if (compact) {
    return (
      <Link to={createPageUrl('Pricing')}>
        <Button
          size="sm"
          className="h-8 text-[13px] text-white border-0"
          style={{ background: 'var(--go-accent)' }}
        >
          Upgrade to View
        </Button>
      </Link>
    );
  }

  return (
    <div
      className="rounded-lg border p-4 mt-4"
      style={{
        background: 'var(--go-accent-soft)',
        borderColor: 'var(--go-accent-border)',
      }}
    >
      <div className="text-[13px] font-medium mb-2" style={{ color: 'var(--go-text)' }}>
        Upgrade to View Full Numbers
      </div>
      <div className="text-[12px] mb-4" style={{ color: 'var(--go-text-secondary)' }}>
        Subscribe to reveal complete SSN data and access all features
      </div>
      <Link to={createPageUrl('Pricing')}>
        <Button
          className="w-full h-8 text-[13px] text-white border-0"
          style={{ background: 'var(--go-accent)' }}
        >
          View Pricing
        </Button>
      </Link>
    </div>
  );
}
