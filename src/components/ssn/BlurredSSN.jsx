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
        <Button size="sm" className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0 text-xs">
          Upgrade to View
        </Button>
      </Link>
    );
  }

  return (
    <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-lg p-4 mt-4">
      <div className="text-sm font-medium text-white mb-2">
        Upgrade to View Full Numbers
      </div>
      <div className="text-xs text-gray-300 mb-4">
        Subscribe to reveal complete SSN data and unlock all features
      </div>
      <Link to={createPageUrl('Pricing')}>
        <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0 text-xs">
          View Pricing
        </Button>
      </Link>
    </div>
  );
}