import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MinimalBadge } from "../ui/minimal-badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { SavedSSN } from "@/entities/SavedSSN";
// This import is kept as per outline, though not directly used here
import { User } from "@/entities/User";
import { Link } from 'react-router-dom'; // Assuming Link comes from react-router-dom

// Helper function for creating page URLs.
// In a full application, this would likely be part of a router utility or context.
const createPageUrl = (pageName) => {
  switch (pageName) {
    case 'Pricing':
      return '/pricing';
    // Add other page mappings as needed
    default:
      return `/${pageName.toLowerCase()}`;
  }
};

export default function IssuanceInfo({ state, yearRange, estimatedAge, isValid, validationIssues = [], fullData }) {
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await User.me(); // Assuming User.me() fetches the current user
      setUser(currentUser);
    } catch (err) {
      console.log('Not logged in or error fetching user:', err);
      // Optionally handle not logged in state, e.g., setUser({ subscription_status: 'guest' });
    }
  };

  const isSubscribed = user?.subscription_status === 'active';
  const confidenceScore = isValid ? 98 : 45;

  const handleSaveSSN = async () => {
    if (!isSubscribed) {
      console.log("User is not subscribed, cannot save SSN.");
      return; // Prevent saving if not subscribed
    }

    setIsSaving(true);
    try {
      await SavedSSN.create({
        ssn: fullData.ssn,
        area_number: fullData.area_number,
        group_number: fullData.group_number,
        serial_number: fullData.serial_number,
        state: state,
        year_range: yearRange,
        risk_score: fullData.risk_score || 0,
        validation_issues: validationIssues || [],
        notes: ""
      });
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (error) {
      console.error('Error saving SSN:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const getIssuanceStatus = () => {
    if (isValid) {
      return {
        label: 'LIKELY ISSUED',
        sublabel: 'This SSN format was allocated by the SSA',
        fill: 'var(--go-accent)',
        textColor: 'text-[color:var(--go-accent)]',
        borderColor: 'var(--go-accent-border)',
        indicator: 'bg-[color:var(--go-accent)]'
      };
    } else {
      return {
        label: 'NOT ISSUED',
        sublabel: 'This SSN was never allocated by the SSA',
        fill: 'var(--go-error)',
        textColor: 'text-[color:var(--go-error)]',
        borderColor: 'var(--go-error-border)',
        indicator: 'bg-[color:var(--go-error)]'
      };
    }
  };

  const issuanceStatus = getIssuanceStatus();

  const hasValidIssuanceInfo = state &&
    !state.includes('Unknown') &&
    !state.includes('Invalid') &&
    !state.includes('Randomized') &&
    yearRange &&
    !yearRange.includes('Unknown');

  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card
          className="rounded-lg border"
          style={{ background: 'var(--go-bg-card)', borderColor: 'var(--go-border)' }}
        >
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 border"
                style={{
                  background: 'var(--go-bg-panel)',
                  borderColor: issuanceStatus.borderColor,
                }}
              >
                <div className={`w-3 h-3 rounded-full ${issuanceStatus.indicator}`}></div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <div className={`text-[12px] font-medium ${issuanceStatus.textColor} uppercase tracking-wider`}>
                    {issuanceStatus.label}
                  </div>
                  <MinimalBadge variant={isValid ? 'info' : 'neutral'} size="xs">
                    {isValid ? 'Valid' : 'Invalid'}
                  </MinimalBadge>
                  {!isSubscribed && (
                    <MinimalBadge variant="cyan" size="xs">
                      Partial View
                    </MinimalBadge>
                  )}
                </div>
                <div className="text-[12px] mb-4" style={{ color: 'var(--go-text-secondary)' }}>
                  {issuanceStatus.sublabel}
                </div>

                <div className="flex items-center gap-3 mb-3">
                  <span className="text-[11px] uppercase tracking-wider font-medium" style={{ color: 'var(--go-text-muted)' }}>Analysis Confidence</span>
                  <div className="flex-1 max-w-[140px]">
                    <div
                      className="h-1.5 rounded-full overflow-hidden"
                      style={{ background: 'var(--go-bg-panel)' }}
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${confidenceScore}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full rounded-full"
                        style={{ background: issuanceStatus.fill }}
                      />
                    </div>
                  </div>
                  <span className={`text-[12px] font-semibold font-mono ${issuanceStatus.textColor}`}>
                    {confidenceScore}%
                  </span>
                </div>

                {isValid && (
                  <div
                    className="text-[12px] rounded-lg border p-3"
                    style={{
                      color: 'var(--go-text-secondary)',
                      background: 'var(--go-bg-panel)',
                      borderColor: 'var(--go-border)',
                    }}
                  >
                    <span className="font-medium" style={{ color: 'var(--go-text)' }}>Note:</span> This indicates the SSN follows valid SSA formatting rules and was allocated for use. It does not verify if it belongs to a specific individual.
                  </div>
                )}

                {!isValid && hasValidIssuanceInfo && (
                  <div className="space-y-3">
                    <div
                      className="text-[12px] rounded-lg border p-3"
                      style={{
                        color: 'var(--go-text-secondary)',
                        background: 'var(--go-accent-soft)',
                        borderColor: 'var(--go-accent-border)',
                      }}
                    >
                      <span className="font-medium" style={{ color: 'var(--go-accent)' }}>Alternative Use:</span> Since this number was never officially issued by the SSA, it may be suitable for use as a test number, placeholder, or in scenarios requiring fictional SSN data. This number will not conflict with any real issued SSN.
                    </div>

                    {isSubscribed ? (
                      <>
                        <Button
                          onClick={handleSaveSSN}
                          disabled={isSaving || isSaved}
                          className="w-full h-8 text-[13px] text-white border-0"
                          style={{ background: 'var(--go-accent)' }}
                        >
                          {isSaving ? (
                            <>
                              <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                              Saving...
                            </>
                          ) : isSaved ? (
                            <>
                              Saved to Records
                            </>
                          ) : (
                            <>
                              Save This Number
                            </>
                          )}
                        </Button>
                        <p className="text-[12px] text-center" style={{ color: 'var(--go-text-muted)' }}>
                          Save for future reference and analysis
                        </p>
                      </>
                    ) : (
                      <div
                        className="rounded-lg border p-4"
                        style={{
                          background: 'var(--go-accent-soft)',
                          borderColor: 'var(--go-accent-border)',
                        }}
                      >
                        <div className="text-[13px] font-medium mb-2" style={{ color: 'var(--go-text)' }}>
                          Upgrade to Save Numbers
                        </div>
                        <div className="text-[12px] mb-4" style={{ color: 'var(--go-text-secondary)' }}>
                          Subscribe to save unlimited records and access full SSN data
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
                    )}
                  </div>
                )}
              </div>
            </div>

            {validationIssues && validationIssues.length > 0 && (
              <div className="mt-4 pt-4 border-t space-y-2" style={{ borderColor: 'var(--go-border)' }}>
                <div className="text-[11px] font-medium uppercase tracking-wider mb-2" style={{ color: 'var(--go-text-muted)' }}>Validation Issues:</div>
                {validationIssues.map((issue, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="w-1 h-1 rounded-full mt-1.5" style={{ background: 'var(--go-warning)' }}></div>
                    <div className="text-[12px]" style={{ color: 'var(--go-text-secondary)' }}>{issue}</div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <Card
            className="rounded-lg border h-full transition-colors"
            style={{ background: 'var(--go-bg-card)', borderColor: 'var(--go-border)' }}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-[12px] font-medium" style={{ color: 'var(--go-text-secondary)' }}>
                Issuance Location
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-[13px] font-medium mb-1" style={{ color: 'var(--go-text)' }}>{state}</div>
              <div className="text-[11px] uppercase tracking-wider" style={{ color: 'var(--go-text-muted)' }}>Geographic region</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
        >
          <Card
            className="rounded-lg border h-full transition-colors"
            style={{ background: 'var(--go-bg-card)', borderColor: 'var(--go-border)' }}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-[12px] font-medium" style={{ color: 'var(--go-text-secondary)' }}>
                Issuance Period
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-[13px] font-medium font-mono mb-1" style={{ color: 'var(--go-text)' }}>{yearRange}</div>
              <div className="text-[11px] uppercase tracking-wider" style={{ color: 'var(--go-text-muted)' }}>Date range</div>
            </CardContent>
          </Card>
        </motion.div>

        {estimatedAge && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card
              className="rounded-lg border h-full transition-colors"
              style={{ background: 'var(--go-bg-card)', borderColor: 'var(--go-border)' }}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-[12px] font-medium" style={{ color: 'var(--go-text-secondary)' }}>
                  Estimated Age Range
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-[13px] font-medium mb-1" style={{ color: 'var(--go-text)' }}>
                  {estimatedAge.min} - {estimatedAge.max} years old
                </div>
                <div className="text-[11px] uppercase tracking-wider" style={{ color: 'var(--go-text-muted)' }}>Based on issuance period</div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
