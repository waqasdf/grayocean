import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import {
  WorkspacePage,
  WorkspacePanel,
  PrimaryButton,
  GhostButton,
} from "@/components/dashboard";
import { LookupCostHint } from "@/components/shared/LookupCostHint";

export default function ComparisonPage() {
  const [ssns, setSSNs] = useState(['', '', '']);
  const [results, setResults] = useState(null);
  const [isComparing, setIsComparing] = useState(false);

  const getStateFromArea = (area) => {
    const areaNum = parseInt(area);
    if (areaNum >= 1 && areaNum <= 3) return 'New Hampshire';
    if (areaNum >= 4 && areaNum <= 7) return 'Maine';
    if (areaNum >= 8 && areaNum <= 9) return 'Vermont';
    if (areaNum >= 10 && areaNum <= 34) return 'Massachusetts';
    if (areaNum >= 35 && areaNum <= 39) return 'Rhode Island';
    if (areaNum >= 40 && areaNum <= 49) return 'Connecticut';
    if (areaNum >= 50 && areaNum <= 134) return 'New York';
    if (areaNum >= 135 && areaNum <= 158) return 'New Jersey';
    if (areaNum >= 159 && areaNum <= 211) return 'Pennsylvania';
    if (areaNum >= 212 && areaNum <= 220) return 'Maryland';
    if (areaNum >= 221 && areaNum <= 222) return 'Delaware';
    if (areaNum >= 223 && areaNum <= 231) return 'Virginia';
    if (areaNum >= 232 && areaNum <= 236) return 'West Virginia';
    if (areaNum >= 237 && areaNum <= 246) return 'North Carolina';
    if (areaNum >= 247 && areaNum <= 251) return 'South Carolina';
    if (areaNum >= 252 && areaNum <= 260) return 'Georgia';
    if (areaNum >= 261 && areaNum <= 267) return 'Florida';
    if (areaNum >= 268 && areaNum <= 302) return 'Ohio';
    if (areaNum >= 303 && areaNum <= 317) return 'Indiana';
    if (areaNum >= 318 && areaNum <= 361) return 'Illinois';
    if (areaNum >= 362 && areaNum <= 386) return 'Michigan';
    if (areaNum >= 387 && areaNum <= 399) return 'Wisconsin';
    if (areaNum >= 400 && areaNum <= 407) return 'Kentucky';
    if (areaNum >= 408 && areaNum <= 415) return 'Tennessee';
    if (areaNum >= 416 && areaNum <= 424) return 'Alabama';
    if (areaNum >= 425 && areaNum <= 428) return 'Mississippi';
    if (areaNum >= 429 && areaNum <= 432) return 'Arkansas';
    if (areaNum >= 433 && areaNum <= 439) return 'Louisiana';
    if (areaNum >= 440 && areaNum <= 448) return 'Oklahoma';
    if (areaNum >= 449 && areaNum <= 467) return 'Texas';
    if (areaNum >= 468 && areaNum <= 477) return 'Minnesota';
    if (areaNum >= 478 && areaNum <= 485) return 'Iowa';
    if (areaNum >= 486 && areaNum <= 500) return 'Missouri';
    if (areaNum >= 501 && areaNum <= 502) return 'North Dakota';
    if (areaNum >= 503 && areaNum <= 504) return 'South Dakota';
    if (areaNum >= 505 && areaNum <= 508) return 'Nebraska';
    if (areaNum >= 509 && areaNum <= 515) return 'Kansas';
    if (areaNum >= 516 && areaNum <= 517) return 'Montana';
    if (areaNum >= 518 && areaNum <= 519) return 'Idaho';
    if (areaNum === 520) return 'Wyoming';
    if (areaNum >= 521 && areaNum <= 524) return 'Colorado';
    if (areaNum === 525) return 'New Mexico';
    if (areaNum >= 526 && areaNum <= 527) return 'Arizona';
    if (areaNum >= 528 && areaNum <= 529) return 'Utah';
    if (areaNum === 530) return 'Nevada';
    if (areaNum >= 531 && areaNum <= 539) return 'Washington';
    if (areaNum >= 540 && areaNum <= 544) return 'Oregon';
    if (areaNum >= 545 && areaNum <= 573) return 'California';
    if (areaNum === 574) return 'Alaska';
    if (areaNum >= 575 && areaNum <= 576) return 'Hawaii';
    if (areaNum >= 577 && areaNum <= 579) return 'District of Columbia';
    if (areaNum === 580) return 'Virgin Islands';
    if (areaNum >= 581 && areaNum <= 584) return 'Puerto Rico';
    if (areaNum >= 587 && areaNum <= 899) return 'Randomized (Post-2011)';
    return 'Unknown/Invalid';
  };

  const getYearRange = (area) => {
    const areaNum = parseInt(area);
    if (areaNum >= 1 && areaNum <= 9) return '1936-1972';
    if (areaNum >= 10 && areaNum <= 49) return '1936-1980';
    if (areaNum >= 50 && areaNum <= 134) return '1936-2011';
    if (areaNum >= 587 && areaNum <= 899) return '2011-Present';
    return '1936-2011';
  };

  const validateSSN = (ssn) => {
    const numbers = ssn.replace(/\D/g, '');
    if (numbers.length !== 9) return { isValid: false };

    const area = numbers.substring(0, 3);
    const group = numbers.substring(3, 5);
    const serial = numbers.substring(5, 9);

    const areaNum = parseInt(area);
    const groupNum = parseInt(group);
    const serialNum = parseInt(serial);

    if (areaNum === 0 || areaNum === 666 || areaNum >= 900) return { isValid: false };
    if (groupNum === 0) return { isValid: false };
    if (serialNum === 0) return { isValid: false };

    return { isValid: true };
  };

  const calculateRiskScore = (ssn) => {
    const numbers = ssn.replace(/\D/g, '');
    const area = numbers.substring(0, 3);
    const group = numbers.substring(3, 5);
    const serial = numbers.substring(5, 9);

    let score = 0;
    const areaNum = parseInt(area);
    const groupNum = parseInt(group);
    const serialNum = parseInt(serial);

    const validation = validateSSN(ssn);
    if (!validation.isValid) score += 85;

    if (areaNum === 0 || areaNum === 666 || areaNum >= 900 || groupNum === 0 || serialNum === 0) {
      score += 95;
    }

    if (serial === '1234' || serial === '0000' || serial === '9999') score += 60;
    if (group === '11' || group === '22' || group === '33') score += 25;

    const riskLevel = score > 70 ? 'high' : score > 40 ? 'medium' : 'low';
    return { score: Math.min(100, score), level: riskLevel };
  };

  const formatSSN = (val) => {
    const numbers = val.replace(/\D/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 5) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 5)}-${numbers.slice(5, 9)}`;
  };

  const handleSSNChange = (index, value) => {
    const formatted = formatSSN(value);
    const newSSNs = [...ssns];
    newSSNs[index] = formatted;
    setSSNs(newSSNs);
  };

  const addSSN = () => {
    if (ssns.length < 5) {
      setSSNs([...ssns, '']);
    }
  };

  const removeSSN = (index) => {
    if (ssns.length > 2) {
      const newSSNs = ssns.filter((_, i) => i !== index);
      setSSNs(newSSNs);
    }
  };

  const handleCompare = async () => {
    const validSSNs = ssns.filter(ssn => ssn.replace(/\D/g, '').length === 9);
    if (validSSNs.length < 2) return;

    setIsComparing(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    const comparisonResults = validSSNs.map(ssn => {
      const numbers = ssn.replace(/\D/g, '');
      const area = numbers.substring(0, 3);
      const group = numbers.substring(3, 5);
      const serial = numbers.substring(5, 9);

      const validation = validateSSN(ssn);
      const risk = calculateRiskScore(ssn);
      const state = getStateFromArea(area);
      const yearRange = getYearRange(area);

      return {
        ssn,
        area,
        group,
        serial,
        state,
        yearRange,
        isValid: validation.isValid,
        riskScore: risk.score,
        riskLevel: risk.level
      };
    });

    setResults(comparisonResults);
    setIsComparing(false);
  };

  const getComparisonInsights = () => {
    if (!results || results.length < 2) return null;

    const insights = [];

    // Check if all from same state
    const states = new Set(results.map(r => r.state));
    if (states.size === 1) {
      insights.push({
        type: 'info',
        message: `All SSNs are from ${results[0].state}`
      });
    } else {
      insights.push({
        type: 'info',
        message: `SSNs span ${states.size} different states: ${Array.from(states).join(', ')}`
      });
    }

    // Check risk variance
    const riskScores = results.map(r => r.riskScore);
    const maxRisk = Math.max(...riskScores);
    const minRisk = Math.min(...riskScores);
    const riskDiff = maxRisk - minRisk;

    if (riskDiff > 50) {
      insights.push({
        type: 'warning',
        message: `High risk variance: ${riskDiff} points difference between highest and lowest`
      });
    }

    // Check validity
    const invalidCount = results.filter(r => !r.isValid).length;
    if (invalidCount > 0) {
      insights.push({
        type: 'error',
        message: `${invalidCount} of ${results.length} SSNs are invalid`
      });
    }

    // Check time periods
    const hasOld = results.some(r => r.yearRange.includes('1936') && !r.yearRange.includes('2011'));
    const hasNew = results.some(r => r.yearRange.includes('2011-Present'));
    if (hasOld && hasNew) {
      insights.push({
        type: 'info',
        message: 'Mix of pre-2011 (state-based) and post-2011 (randomized) SSNs'
      });
    }

    return insights;
  };

  const insights = getComparisonInsights();

  return (
    <WorkspacePage
      title="SSN Comparison"
      description="Compare multiple SSNs side-by-side to identify patterns and differences"
      maxWidth="max-w-4xl"
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <WorkspacePanel title="Enter SSNs to Compare">
            <div className="space-y-4">
              {ssns.map((ssn, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-[8px] border border-go-border bg-go-surface-muted">
                    <span className="text-xs font-semibold text-go-text-muted">#{index + 1}</span>
                  </div>
                  <Input
                    type="text"
                    value={ssn}
                    onChange={(e) => handleSSNChange(index, e.target.value)}
                    placeholder="000-00-0000"
                    maxLength={11}
                    className="min-w-0 flex-1 font-mono"
                  />
                  {ssns.length > 2 && (
                    <GhostButton
                      onClick={() => removeSSN(index)}
                      className="h-10 w-10 flex-shrink-0 px-0 text-go-text-muted hover:text-go-danger sm:h-9 sm:w-auto sm:px-3"
                      aria-label={`Remove SSN ${index + 1}`}
                    >
                      <span className="sm:hidden">×</span>
                      <span className="hidden sm:inline">Remove</span>
                    </GhostButton>
                  )}
                </div>
              ))}

              {ssns.length < 5 && (
                <GhostButton onClick={addSSN} className="w-full">
                  Add Another SSN
                </GhostButton>
              )}

              <LookupCostHint
                label="SSN validation (per SSN)"
                costCents={
                  ssns.filter((s) => s.replace(/\D/g, "").length === 9).length * 10
                }
                className="mt-0"
              />
              <PrimaryButton
                onClick={handleCompare}
                disabled={ssns.filter(s => s.replace(/\D/g, '').length === 9).length < 2 || isComparing}
                className="w-full gap-2"
              >
                {isComparing ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                    Comparing...
                  </>
                ) : (
                  'Compare SSNs'
                )}
              </PrimaryButton>
            </div>
          </WorkspacePanel>

          <AnimatePresence>
            {results && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {insights && insights.length > 0 && (
                  <WorkspacePanel title="Comparison Insights">
                    <div className="space-y-3">
                      {insights.map((insight, index) => (
                        <div
                          key={index}
                          className={`flex items-start gap-3 rounded-[10px] border p-3 ${
                            insight.type === 'error'
                              ? 'border-go-danger/30 bg-go-danger-muted'
                              : insight.type === 'warning'
                              ? 'border-go-warning/30 bg-go-warning-muted'
                              : 'border-go-border bg-go-surface-muted'
                          }`}
                        >
                          <span
                            className={`flex-shrink-0 text-[13px] ${
                              insight.type === 'error'
                                ? 'text-go-danger'
                                : insight.type === 'warning'
                                ? 'text-go-warning'
                                : 'text-go-primary'
                            }`}
                          >
                            •
                          </span>
                          <p className="flex-1 text-[13px] text-go-text-secondary">
                            {insight.message}
                          </p>
                        </div>
                      ))}
                    </div>
                  </WorkspacePanel>
                )}

                <WorkspacePanel title="Side-by-side" bodyClassName="overflow-x-auto p-0 sm:p-0">
                  <div className="inline-block min-w-full align-middle">
                    <table className="w-full min-w-[640px] border-collapse">
                      <thead>
                        <tr className="border-b border-go-border">
                          <th className="px-4 py-3 text-left text-[11px] font-medium uppercase tracking-wider text-go-text-muted">
                            Attribute
                          </th>
                          {results.map((result, index) => (
                            <th key={index} className="px-4 py-3 text-left text-[11px] font-medium uppercase tracking-wider text-go-text-muted">
                              SSN #{index + 1}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-go-border bg-go-surface-muted/50">
                          <td className="px-4 py-3 text-[13px] text-go-text-muted">Number</td>
                          {results.map((result, index) => (
                            <td key={index} className="px-4 py-3 font-mono text-[13px] text-go-text">
                              <div className="truncate">{result.ssn}</div>
                            </td>
                          ))}
                        </tr>

                        <tr className="border-b border-go-border">
                          <td className="px-4 py-3 text-[13px] text-go-text-muted">Valid</td>
                          {results.map((result, index) => (
                            <td key={index} className="px-4 py-3">
                              <Badge
                                className={`text-[11px] ${
                                  result.isValid
                                    ? 'border-go-success/30 bg-go-success-muted text-go-success'
                                    : 'border-go-danger/30 bg-go-danger-muted text-go-danger'
                                }`}
                              >
                                {result.isValid ? 'Yes' : 'No'}
                              </Badge>
                            </td>
                          ))}
                        </tr>

                        <tr className="border-b border-go-border bg-go-surface-muted/50">
                          <td className="px-4 py-3 text-[13px] text-go-text-muted">State</td>
                          {results.map((result, index) => (
                            <td key={index} className="px-4 py-3 text-[13px] text-go-text">
                              <div className="truncate">{result.state}</div>
                            </td>
                          ))}
                        </tr>

                        <tr className="border-b border-go-border">
                          <td className="px-4 py-3 text-[13px] text-go-text-muted">Year Range</td>
                          {results.map((result, index) => (
                            <td key={index} className="px-4 py-3 font-mono text-[13px] text-go-text">
                              {result.yearRange}
                            </td>
                          ))}
                        </tr>

                        <tr className="border-b border-go-border bg-go-surface-muted/50">
                          <td className="px-4 py-3 text-[13px] text-go-text-muted">Area</td>
                          {results.map((result, index) => (
                            <td key={index} className="px-4 py-3 font-mono text-[13px] text-go-text">
                              {result.area}
                            </td>
                          ))}
                        </tr>

                        <tr className="border-b border-go-border">
                          <td className="px-4 py-3 text-[13px] text-go-text-muted">Group</td>
                          {results.map((result, index) => (
                            <td key={index} className="px-4 py-3 font-mono text-[13px] text-go-text">
                              {result.group}
                            </td>
                          ))}
                        </tr>

                        <tr className="border-b border-go-border bg-go-surface-muted/50">
                          <td className="px-4 py-3 text-[13px] text-go-text-muted">Serial</td>
                          {results.map((result, index) => (
                            <td key={index} className="px-4 py-3 font-mono text-[13px] text-go-text">
                              {result.serial}
                            </td>
                          ))}
                        </tr>

                        <tr className="border-b border-go-border">
                          <td className="px-4 py-3 text-[13px] text-go-text-muted">Risk Score</td>
                          {results.map((result, index) => (
                            <td key={index} className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-[13px] font-semibold text-go-text">
                                  {result.riskScore}
                                </span>
                                <div className="max-w-[60px] flex-1 md:max-w-[80px]">
                                  <div className="h-1.5 overflow-hidden rounded-full bg-go-surface-muted">
                                    <div
                                      className={`h-full rounded-full ${
                                        result.riskLevel === 'high'
                                          ? 'bg-go-danger'
                                          : result.riskLevel === 'medium'
                                          ? 'bg-go-warning'
                                          : 'bg-go-success'
                                      }`}
                                      style={{ width: `${result.riskScore}%` }}
                                    />
                                  </div>
                                </div>
                              </div>
                            </td>
                          ))}
                        </tr>

                        <tr>
                          <td className="px-4 py-3 text-[13px] text-go-text-muted">Risk Level</td>
                          {results.map((result, index) => (
                            <td key={index} className="px-4 py-3">
                              <Badge
                                className={`text-[11px] ${
                                  result.riskLevel === 'high'
                                    ? 'border-go-danger/30 bg-go-danger-muted text-go-danger'
                                    : result.riskLevel === 'medium'
                                    ? 'border-go-warning/30 bg-go-warning-muted text-go-warning'
                                    : 'border-go-success/30 bg-go-success-muted text-go-success'
                                }`}
                              >
                                {result.riskLevel.toUpperCase()}
                              </Badge>
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </WorkspacePanel>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div>
          <WorkspacePanel title="How to Use">
            <ol className="space-y-3 text-[13px] text-go-text-secondary">
              <li className="flex gap-3">
                <span className="flex-shrink-0 font-semibold text-go-primary">1.</span>
                <span>Enter 2-5 SSNs you want to compare</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 font-semibold text-go-primary">2.</span>
                <span>Click &quot;Compare SSNs&quot; to analyze</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 font-semibold text-go-primary">3.</span>
                <span>Review side-by-side comparison table</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 font-semibold text-go-primary">4.</span>
                <span>Check insights for patterns and anomalies</span>
              </li>
            </ol>

            <div className="mt-6 border-t border-go-border pt-6">
              <h3 className="mb-3 text-[11px] font-medium uppercase tracking-wider text-go-text-muted">
                Use Cases
              </h3>
              <ul className="space-y-2 text-[13px] text-go-text-muted">
                <li>• Identify test numbers vs real patterns</li>
                <li>• Compare risk scores across datasets</li>
                <li>• Find geographic patterns in SSNs</li>
                <li>• Validate batch consistency</li>
                <li>• Educational analysis</li>
              </ul>
            </div>
          </WorkspacePanel>
        </div>
      </div>
    </WorkspacePage>
  );
}