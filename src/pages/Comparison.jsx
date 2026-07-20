import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom"; // Removed Plus, X, GitCompare
import { createPageUrl } from "@/utils";

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
    <div className="min-h-full">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-5 md:py-6">
        <div className="mb-5">
          <p className="go-kicker mb-2">Analysis</p>
          <h1 className="go-page-title">SSN Comparison</h1>
          <p className="go-page-subtitle mt-1.5">
            Compare SSNs side by side.
          </p>
        </div>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="go-panel shadow-none">
              <CardHeader className="border-b border-[color:var(--go-border)] px-4 py-3">
                <CardTitle className="go-label !mb-0">Enter SSNs to Compare</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                {ssns.map((ssn, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[var(--go-bg-panel)] border border-[color:var(--go-border)] flex items-center justify-center flex-shrink-0">
                      <span className="text-[12px] font-semibold text-[color:var(--go-text-secondary)]">#{index + 1}</span>
                    </div>
                    <Input
                      type="text"
                      value={ssn}
                      onChange={(e) => handleSSNChange(index, e.target.value)}
                      placeholder="000-00-0000"
                      maxLength={11}
                      className="go-pill-input flex-1 font-mono tracking-wider"
                    />
                    {ssns.length > 2 && (
                      <Button
                        onClick={() => removeSSN(index)}
                        size="sm"
                        variant="ghost"
                        className="text-[color:var(--go-text-secondary)] hover:text-red-400 flex-shrink-0"
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                ))}

                {ssns.length < 5 && (
                  <Button
                    onClick={addSSN}
                    variant="outline"
                    className="w-full border-[color:var(--go-border-strong)] text-[color:var(--go-text-secondary)] hover:text-[color:var(--go-text)]"
                  >
                    Add Another SSN
                  </Button>
                )}

                <Button
                  onClick={handleCompare}
                  disabled={ssns.filter(s => s.replace(/\D/g, '').length === 9).length < 2 || isComparing}
                  className="w-full h-8 go-pill-btn"
                >
                  {isComparing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                      Comparing...
                    </>
                  ) : (
                    <>
                      Compare SSNs
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <AnimatePresence>
              {results && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {insights && insights.length > 0 && (
                    <Card className="go-panel shadow-none ">
                      <CardHeader className="border-b border-[color:var(--go-border)]">
                        <CardTitle className="text-[11px] font-semibold text-[color:var(--go-text-body)] uppercase tracking-widest">
                          Comparison Insights
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 md:p-6 space-y-3">
                        {insights.map((insight, index) => (
                          <div
                            key={index}
                            className={`flex items-start gap-3 p-3 rounded-lg ${
                              insight.type === 'error'
                                ? 'bg-[var(--go-error-fill)] border border-[color:var(--go-error-border)]'
                                : insight.type === 'warning'
                                ? 'bg-[var(--go-warning-fill)] border border-[color:var(--go-warning-border)]'
                                : 'bg-[var(--go-accent-soft)] border border-[color:var(--go-accent-border)]'
                            }`}
                          >
                            <span
                                    className={`text-[12px] flex-shrink-0 ${
                                insight.type === 'error'
                                  ? 'text-[color:var(--go-error)]'
                                  : insight.type === 'warning'
                                  ? 'text-[color:var(--go-warning)]'
                                  : 'text-[color:var(--go-accent-text)]'
                              }`}
                            >
                              •
                            </span>
                            <p className="text-[11px] text-[color:var(--go-text-secondary)] flex-1">
                              {insight.message}
                            </p>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  )}

                  <div className="overflow-x-auto -mx-4 md:mx-0">
                    <div className="inline-block min-w-full align-middle px-4 md:px-0">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="border-b border-[color:var(--go-border)]">
                            <th className="text-left py-3 px-2 md:px-4 text-[10px] font-semibold text-[color:var(--go-text-meta)] uppercase tracking-widest">
                             Attribute
                            </th>
                            {results.map((result, index) => (
                             <th key={index} className="text-left py-3 px-2 md:px-4 text-[10px] font-semibold text-[color:var(--go-text-meta)] uppercase tracking-widest">
                                SSN #{index + 1}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-[color:var(--go-border)] bg-[var(--go-bg-panel)]">
                            <td className="py-3 px-2 md:px-4 text-[11px] text-[color:var(--go-text-muted)]">Number</td>
                            {results.map((result, index) => (
                              <td key={index} className="py-3 px-2 md:px-4 text-[11px] font-mono text-[color:var(--go-text-body)]">
                                <div className="truncate">{result.ssn}</div>
                              </td>
                            ))}
                          </tr>

                          <tr className="border-b border-[color:var(--go-border)]">
                            <td className="py-3 px-2 md:px-4 text-[11px] text-[color:var(--go-text-muted)]">Valid</td>
                            {results.map((result, index) => (
                              <td key={index} className="py-3 px-2 md:px-4">
                                <Badge
                                  className={`text-[10px] md:text-xs ${
                                    result.isValid
                                      ? 'bg-green-500/20 text-green-400 border-green-500/30'
                                      : 'bg-red-500/20 text-red-400 border-red-500/30'
                                  }`}
                                >
                                  {result.isValid ? 'Yes' : 'No'}
                                </Badge>
                              </td>
                            ))}
                          </tr>

                          <tr className="border-b border-[color:var(--go-border)] bg-[var(--go-bg-panel)]">
                            <td className="py-3 px-2 md:px-4 text-[11px] text-[color:var(--go-text-muted)]">State</td>
                            {results.map((result, index) => (
                              <td key={index} className="py-3 px-2 md:px-4 text-[11px] text-[color:var(--go-text-body)]">
                                <div className="truncate">{result.state}</div>
                              </td>
                            ))}
                          </tr>

                          <tr className="border-b border-[color:var(--go-border)]">
                            <td className="py-3 px-2 md:px-4 text-[11px] text-[color:var(--go-text-muted)]">Year Range</td>
                            {results.map((result, index) => (
                              <td key={index} className="py-3 px-2 md:px-4 text-[11px] text-[color:var(--go-text-body)] font-mono">
                                {result.yearRange}
                              </td>
                            ))}
                          </tr>

                          <tr className="border-b border-[color:var(--go-border)] bg-[var(--go-bg-panel)]">
                            <td className="py-3 px-2 md:px-4 text-[11px] text-[color:var(--go-text-muted)]">Area</td>
                            {results.map((result, index) => (
                              <td key={index} className="py-3 px-2 md:px-4 text-[11px] text-[color:var(--go-text-body)] font-mono">
                                {result.area}
                              </td>
                            ))}
                          </tr>

                          <tr className="border-b border-[color:var(--go-border)]">
                            <td className="py-3 px-2 md:px-4 text-[11px] text-[color:var(--go-text-muted)]">Group</td>
                            {results.map((result, index) => (
                              <td key={index} className="py-3 px-2 md:px-4 text-[11px] text-[color:var(--go-text-body)] font-mono">
                                {result.group}
                              </td>
                            ))}
                          </tr>

                          <tr className="border-b border-[color:var(--go-border)] bg-[var(--go-bg-panel)]">
                            <td className="py-3 px-2 md:px-4 text-[11px] text-[color:var(--go-text-muted)]">Serial</td>
                            {results.map((result, index) => (
                              <td key={index} className="py-3 px-2 md:px-4 text-[11px] text-[color:var(--go-text-body)] font-mono">
                                {result.serial}
                              </td>
                            ))}
                          </tr>

                          <tr className="border-b border-[color:var(--go-border)]">
                            <td className="py-3 px-2 md:px-4 text-[11px] text-[color:var(--go-text-muted)]">Risk Score</td>
                            {results.map((result, index) => (
                              <td key={index} className="py-3 px-2 md:px-4">
                                <div className="flex items-center gap-2">
                                  <span className="text-[11px] font-bold text-[color:var(--go-text-body)] font-mono">
                                    {result.riskScore}
                                  </span>
                                  <div className="flex-1 max-w-[60px] md:max-w-[80px]">
                                    <div className="h-1.5 bg-[var(--go-bg-panel)] border border-[color:var(--go-border)] rounded-full overflow-hidden">
                                      <div
                                        className={`h-full rounded-full ${
                                          result.riskLevel === 'high'
                                            ? 'bg-[var(--go-error)]'
                                            : result.riskLevel === 'medium'
                                            ? 'bg-[var(--go-warning)]'
                                            : 'bg-[var(--go-success)]'
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
                            <td className="py-3 px-2 md:px-4 text-[11px] text-[color:var(--go-text-muted)]">Risk Level</td>
                            {results.map((result, index) => (
                              <td key={index} className="py-3 px-2 md:px-4">
                                <Badge
                                  className={`text-[10px] md:text-xs ${
                                    result.riskLevel === 'high'
                                      ? 'bg-red-500/20 text-red-400 border-red-500/30'
                                      : result.riskLevel === 'medium'
                                      ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                                      : 'bg-green-500/20 text-green-400 border-green-500/30'
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
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div>
            <Card className="go-panel shadow-none ">
              <CardHeader className="border-b border-[color:var(--go-border)]">
                <CardTitle className="text-[11px] font-semibold text-[color:var(--go-text-body)] uppercase tracking-widest">
                  How to Use
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 md:p-6">
                <ol className="space-y-3 text-[11px] text-[color:var(--go-text-muted)]">
                  <li className="flex gap-3">
                    <span className="font-bold text-[color:var(--go-accent-text)] flex-shrink-0 text-[11px]">1.</span>
                    <span className="text-[11px] text-[color:var(--go-text-muted)]">Enter 2-5 SSNs you want to compare</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-[color:var(--go-accent-text)] flex-shrink-0 text-[11px]">2.</span>
                    <span className="text-[11px] text-[color:var(--go-text-muted)]">Click "Compare SSNs" to analyze</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-[color:var(--go-accent-text)] flex-shrink-0 text-[11px]">3.</span>
                    <span className="text-[11px] text-[color:var(--go-text-muted)]">Review side-by-side comparison table</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-[color:var(--go-accent-text)] flex-shrink-0 text-[11px]">4.</span>
                    <span className="text-[11px] text-[color:var(--go-text-muted)]">Check insights for patterns and anomalies</span>
                  </li>
                </ol>

                <div className="mt-6 pt-6 border-t border-[color:var(--go-border-strong)]">
                  <h3 className="text-[10px] font-semibold text-[color:var(--go-text-muted)] uppercase tracking-widest mb-3">
                    Use Cases
                  </h3>
                  <ul className="space-y-2 text-[11px] text-[color:var(--go-text-meta)]">
                    <li>• Identify test numbers vs real patterns</li>
                    <li>• Compare risk scores across datasets</li>
                    <li>• Find geographic patterns in SSNs</li>
                    <li>• Validate batch consistency</li>
                    <li>• Educational analysis</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}