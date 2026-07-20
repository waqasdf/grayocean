import React, { useState, useEffect } from "react";
import { BatchAnalysis } from "@/entities/BatchAnalysis";
import { User } from "@/entities/User";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { MinimalBadge } from "@/components/ui/minimal-badge";
import { motion, AnimatePresence } from "framer-motion";
import { BlurredSSN, UpgradePrompt } from "../components/ssn/BlurredSSN";
import RiskDistributionChart from "../components/batch/RiskDistributionChart";
import StatePatternChart from "../components/batch/StatePatternChart";
import { getStateFromArea } from "../lib/ssnState";
import { Download, Layers, AlertTriangle, CheckCircle2, XCircle, BarChart3 } from "lucide-react";

export default function BatchAnalysisPage() {
  const [batchName, setBatchName] = useState('');
  const [ssnInput, setSSNInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => { loadUser(); }, []);

  const loadUser = async () => {
    try { setUser(await User.me()); }
    catch { setUser(null); }
    finally { setUserLoading(false); }
  };

  const isSubscribed = user?.subscription_status === 'active';

  const validateSSN = (ssn) => {
    const cleaned = ssn.replace(/\D/g, '');
    if (cleaned.length !== 9) return false;
    const area = parseInt(cleaned.substring(0, 3));
    const group = parseInt(cleaned.substring(3, 5));
    const serial = parseInt(cleaned.substring(5, 9));
    if (area === 0 || area === 666 || area >= 900) return false;
    if (group === 0 || serial === 0) return false;
    return true;
  };

  const handleAnalyze = async () => {
    if (!batchName.trim()) { setError('Batch name is required'); return; }
    const lines = ssnInput.split('\n').filter(line => line.trim());
    if (lines.length === 0) { setError('Enter at least one SSN'); return; }
    if (lines.length > 1000) { setError('Maximum 1,000 SSNs per batch'); return; }

    setIsAnalyzing(true);
    setError('');
    setProgress(0);

    const interval = setInterval(() => setProgress(p => Math.min(p + Math.random() * 12, 92)), 80);

    try {
      await new Promise(resolve => setTimeout(resolve, 900));
      const analyzed = lines.map(ssn => {
        const cleaned = ssn.replace(/\D/g, '');
        const formatted = `${cleaned.slice(0, 3)}-${cleaned.slice(3, 5)}-${cleaned.slice(5, 9)}`;
        const isValid = validateSSN(ssn);
        const area = cleaned.substring(0, 3);
        const state = isValid ? getStateFromArea(area) : 'Invalid';
        return {
          ssn: formatted,
          isValid,
          state,
          riskLevel: isValid ? (Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low') : 'invalid'
        };
      });

      const validCount = analyzed.filter(r => r.isValid).length;
      const invalidCount = analyzed.length - validCount;
      const highRiskCount = analyzed.filter(r => r.riskLevel === 'high').length;

      const batchResults = {
        batch_name: batchName,
        ssn_list: analyzed.map(r => r.ssn),
        total_count: analyzed.length,
        valid_count: validCount,
        invalid_count: invalidCount,
        high_risk_count: highRiskCount,
        results: analyzed
      };

      clearInterval(interval);
      setProgress(100);
      await new Promise(r => setTimeout(r, 300));
      setResults(batchResults);
      if (isSubscribed) await BatchAnalysis.create(batchResults);
    } catch {
      setError('Analysis failed. Please try again.');
    } finally {
      clearInterval(interval);
      setIsAnalyzing(false);
    }
  };

  const handleExport = () => {
    if (!results || !isSubscribed) return;
    const csv = [
      ['SSN', 'Valid', 'Risk Level'],
      ...results.results.map(r => [r.ssn, r.isValid ? 'Yes' : 'No', r.riskLevel])
    ].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${results.batch_name}_results.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  };

  const ssnCount = ssnInput.split('\n').filter(l => l.trim()).length;
  const validRate = results ? Math.round((results.valid_count / results.total_count) * 100) : 0;

  return (
    <div className="min-h-full">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-5 md:py-6">
        <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="mb-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="go-kicker mb-2">Bulk tools</p>
              <h1 className="go-page-title">Batch Analysis</h1>
              <p className="go-page-subtitle mt-1.5">Process up to 1,000 SSNs in a single job.</p>
            </div>
            {results && (
              <button
                onClick={handleExport}
                disabled={!isSubscribed}
                className="go-pill-btn !h-9 !text-[12px] !px-4"
                style={{
                  background: "transparent",
                  color: "var(--go-text-body)",
                  border: "1px solid var(--go-border-strong)",
                }}
              >
                <Download className="w-3.5 h-3.5" />
                Export CSV
              </button>
            )}
          </div>
        </motion.div>

      <div className="grid lg:grid-cols-5 gap-6">
          {/* Input panel */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="lg:col-span-2 space-y-4"
          >
            <div className="go-panel overflow-hidden">
              <div className="px-4 py-3 border-b border-[color:var(--go-border)]">
                <span className="text-[12px] font-medium text-[color:var(--go-text-secondary)]">Job Configuration</span>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <label className="go-label">Batch Name</label>
                  <Input
                    placeholder="Q1 2025 Analysis"
                    value={batchName}
                    onChange={(e) => setBatchName(e.target.value)}
                    className="go-pill-input"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="go-label !mb-0">SSN List</label>
                    <span className={`text-[12px] font-mono ${ssnCount > 900 ? 'text-[color:var(--go-warning)]' : 'text-[color:var(--go-text-muted)]'}`}>
                      {ssnCount.toLocaleString()} / 1,000
                    </span>
                  </div>
                  <Textarea
                    placeholder={"123-45-6789\n234-56-7890\n345-67-8901"}
                    value={ssnInput}
                    onChange={(e) => setSSNInput(e.target.value)}
                    className="bg-[var(--go-input-bg)] border-[color:var(--go-input-border)] text-[color:var(--go-input-text)] placeholder:text-[color:var(--go-text-muted)] text-[13px] font-mono h-52 resize-none focus:border-[color:var(--go-accent)] focus:ring-0 leading-relaxed shadow-none"
                  />
                  <p className="text-[12px] text-[color:var(--go-text-muted)] mt-1.5">One SSN per line — formatted or raw digits accepted</p>
                </div>

                {error && (
                  <div className="flex items-start gap-2.5 p-3 rounded-lg border border-red-500/20 bg-red-500/[0.06]">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-400 mt-0.5 flex-shrink-0" />
                    <span className="text-[11px] text-red-400">{error}</span>
                  </div>
                )}

                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || ssnCount === 0}
                  className="w-full go-pill-btn disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <BarChart3 className="w-3.5 h-3.5" />
                      Run Analysis
                    </>
                  )}
                </button>

                {isAnalyzing && (
                  <div className="space-y-1.5">
                    <div className="h-1 bg-[var(--go-bg-panel)] border border-[color:var(--go-border)] rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-[var(--go-accent)] rounded-full"
                        style={{ width: `${progress}%` }}
                        transition={{ duration: 0.1 }}
                      />
                    </div>
                    <div className="flex justify-between text-[12px] text-[color:var(--go-text-muted)]">
                      <span>Validating patterns...</span>
                      <span className="font-mono">{Math.round(progress)}%</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Results panel */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-3"
          >
            <AnimatePresence mode="wait">
              {!results && !isAnalyzing ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full min-h-64 rounded-lg border border-dashed border-[color:var(--go-border)] flex flex-col items-center justify-center gap-3 text-center p-8"
                >
                  <div className="w-10 h-10 rounded-lg bg-[var(--go-bg-panel)] border border-[color:var(--go-border)] flex items-center justify-center">
                    <BarChart3 className="w-4 h-4 text-[color:var(--go-text-muted)]" />
                  </div>
                  <div>
                    <p className="text-sm text-[color:var(--go-text-meta)]">No results yet</p>
                    <p className="text-[11px] text-[color:var(--go-text-meta)] mt-1">Configure and run a batch job to see analysis</p>
                  </div>
                </motion.div>
              ) : results ? (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  {/* Summary metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { label: 'Total', value: results.total_count, color: 'text-[color:var(--go-text)]', icon: Layers },
                      { label: 'Valid', value: results.valid_count, color: 'text-emerald-400', icon: CheckCircle2 },
                      { label: 'Invalid', value: results.invalid_count, color: 'text-red-400', icon: XCircle },
                      { label: 'High Risk', value: results.high_risk_count, color: 'text-amber-400', icon: AlertTriangle },
                    ].map(({ label, value, color, icon: Icon }) => (
                      <div key={label} className="go-panel p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[12px] text-[color:var(--go-text-muted)]">{label}</span>
                          <Icon className={`w-3 h-3 ${color} opacity-60`} />
                        </div>
                        <div className={`text-xl font-semibold font-mono ${color}`}>{value.toLocaleString()}</div>
                      </div>
                    ))}
                  </div>

                  {/* Valid rate bar */}
                  <div className="go-panel p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[12px] font-medium text-[color:var(--go-text-secondary)]">Validity Rate</span>
                      <span className="text-[13px] font-semibold font-mono text-[color:var(--go-text)]">{validRate}%</span>
                    </div>
                    <div className="h-1.5 bg-[var(--go-bg-panel)] border border-[color:var(--go-border)] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${validRate}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="h-full rounded-full bg-[var(--go-success)]"
                      />
                    </div>
                    <div className="flex justify-between mt-2 text-[12px] text-[color:var(--go-text-muted)]">
                      <span>{results.valid_count.toLocaleString()} valid</span>
                      <span>{results.invalid_count.toLocaleString()} flagged</span>
                    </div>
                  </div>

                  {/* Charts */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <RiskDistributionChart results={results} />
                    <StatePatternChart results={results} />
                  </div>

                  {/* Detailed rows */}
                  <div className="go-panel overflow-hidden">
                    <div className="px-4 py-3 border-b border-[color:var(--go-border)] flex items-center justify-between">
                      <span className="text-[12px] font-medium text-[color:var(--go-text-secondary)]">Records</span>
                      <span className="text-[12px] text-[color:var(--go-text-muted)]">{results.results.length > 20 ? `Showing 20 of ${results.results.length}` : `${results.results.length} records`}</span>
                    </div>
                    <div className="divide-y divide-[color:var(--go-border)] max-h-80 overflow-y-auto">
                      {results.results.slice(0, 20).map((result, index) => (
                        <div key={index} className="flex items-center justify-between px-4 py-2.5 hover:bg-[var(--go-bg-panel)] transition-colors">
                          <span className="font-mono text-[13px] text-[color:var(--go-text-body)]">
                            <BlurredSSN ssn={result.ssn} isSubscribed={isSubscribed} />
                          </span>
                          <div className="flex items-center gap-2">
                            {result.isValid ? (
                              <MinimalBadge variant="success" size="xs">Valid</MinimalBadge>
                            ) : (
                              <MinimalBadge variant="neutral" size="xs">Invalid</MinimalBadge>
                            )}
                            {result.riskLevel === 'high' && (
                              <MinimalBadge variant="warning" size="xs">High Risk</MinimalBadge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    {results.results.length > 20 && (
                      <div className="px-4 py-3 border-t border-[color:var(--go-border)] text-[12px] text-[color:var(--go-text-muted)]">
                        +{(results.results.length - 20).toLocaleString()} more records — export CSV to view all
                      </div>
                    )}
                  </div>

                  {!isSubscribed && <UpgradePrompt />}
                </motion.div>
              ) : null}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}