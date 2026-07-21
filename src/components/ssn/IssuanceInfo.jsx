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
        gradient: 'from-blue-500 to-gray-500',
        textColor: 'text-blue-400',
        borderColor: 'border-blue-500/30',
        indicator: 'bg-blue-400'
      };
    } else {
      return {
        label: 'NOT ISSUED',
        sublabel: 'This SSN was never allocated by the SSA',
        gradient: 'from-red-500 to-orange-500',
        textColor: 'text-red-400',
        borderColor: 'border-red-500/30',
        indicator: 'bg-red-400'
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
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="border border-white/10 bg-white/[0.03] backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 bg-white/5 border ${issuanceStatus.borderColor}`}>
                <div className={`w-4 h-4 rounded-full ${issuanceStatus.indicator}`}></div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <div className={`text-xs font-bold ${issuanceStatus.textColor} uppercase tracking-wider`}>
                    {issuanceStatus.label}
                  </div>
                  <MinimalBadge variant={isValid ? 'info' : 'neutral'} size="xs">
                    {isValid ? 'Valid' : 'Invalid'}
                  </MinimalBadge>
                  {!isSubscribed && (
                    <MinimalBadge variant="purple" size="xs">
                      Partial View
                    </MinimalBadge>
                  )}
                </div>
                <div className="text-[10px] text-gray-300 mb-4">
                  {issuanceStatus.sublabel}
                </div>

                <div className="flex items-center gap-3 mb-3">
                  <span className="text-[10px] text-gray-600 uppercase tracking-wider font-medium">Analysis Confidence</span>
                  <div className="flex-1 max-w-[140px]">
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${confidenceScore}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className={`h-full rounded-full bg-gradient-to-r ${issuanceStatus.gradient}`}
                      />
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold font-mono ${issuanceStatus.textColor}`}>
                    {confidenceScore}%
                  </span>
                </div>

                {isValid && (
                  <div className="text-[10px] text-gray-400 bg-white/5 border border-white/10 rounded-lg p-3">
                    <span className="font-medium text-white">Note:</span> This indicates the SSN follows valid SSA formatting rules and was allocated for use. It does not verify if it belongs to a specific individual.
                  </div>
                )}

                {!isValid && hasValidIssuanceInfo && (
                  <div className="space-y-3">
                    <div className="text-[10px] text-gray-300 bg-gradient-to-r from-blue-500/10 to-gray-500/10 border border-blue-500/20 rounded-lg p-3">
                      <span className="font-medium text-blue-400">Alternative Use:</span> Since this number was never officially issued by the SSA, it may be suitable for use as a test number, placeholder, or in scenarios requiring fictional SSN data. This number will not conflict with any real issued SSN.
                    </div>

                    {isSubscribed ? (
                      <>
                        <Button
                          onClick={handleSaveSSN}
                          disabled={isSaving || isSaved}
                          className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0 text-xs"
                        >
                          {isSaving ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
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
                        <p className="text-[10px] text-gray-500 text-center">
                          Save for future reference and analysis
                        </p>
                      </>
                    ) : (
                      <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-lg p-4">
                        <div className="text-sm font-medium text-white mb-2">
                          Upgrade to Save Numbers
                        </div>
                        <div className="text-xs text-gray-300 mb-4">
                          Subscribe to save unlimited records and access full SSN data
                        </div>
                        <Link to={createPageUrl('Pricing')}>
                          <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0 text-xs">
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
              <div className="mt-4 pt-4 border-t border-white/10 space-y-2">
                <div className="text-[10px] font-semibold text-white uppercase tracking-wider mb-2">Validation Issues:</div>
                {validationIssues.map((issue, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="w-1 h-1 rounded-full bg-amber-400 mt-1.5"></div>
                    <div className="text-[10px] text-gray-400">{issue}</div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border border-white/10 bg-white/[0.03] backdrop-blur-sm h-full hover:border-blue-500/30 hover:bg-gradient-to-br hover:from-blue-500/5 hover:to-gray-500/5 transition-all">
            <CardHeader className="pb-3">
              <CardTitle className="text-[10px] font-medium text-gray-400">
                Issuance Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs font-semibold text-white mb-1">{state}</div>
              <div className="text-[10px] text-gray-600 uppercase tracking-wider">Geographic region</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card className="border border-white/10 bg-white/[0.03] backdrop-blur-sm h-full hover:border-blue-500/30 hover:bg-gradient-to-br hover:from-blue-500/5 hover:to-gray-500/5 transition-all">
            <CardHeader className="pb-3">
              <CardTitle className="text-[10px] font-medium text-gray-400">
                Issuance Period
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs font-semibold text-white font-mono mb-1">{yearRange}</div>
              <div className="text-[10px] text-gray-600 uppercase tracking-wider">Date range</div>
            </CardContent>
          </Card>
        </motion.div>

        {estimatedAge && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border border-white/10 bg-white/[0.03] backdrop-blur-sm h-full hover:border-purple-500/30 hover:bg-gradient-to-br hover:from-purple-500/5 hover:to-gray-500/5 transition-all">
              <CardHeader className="pb-3">
                <CardTitle className="text-[10px] font-medium text-gray-400">
                  Estimated Age Range
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs font-semibold text-white mb-1">
                  {estimatedAge.min} - {estimatedAge.max} years old
                </div>
                <div className="text-[10px] text-gray-600 uppercase tracking-wider">Based on issuance period</div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}