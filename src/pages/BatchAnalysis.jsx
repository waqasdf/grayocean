import React, { useState, useEffect } from "react";
import { BatchAnalysis } from "@/entities/BatchAnalysis";
import { User } from "@/entities/User";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { MinimalBadge } from "@/components/ui/minimal-badge";
import { AnimatePresence, motion } from "framer-motion";
import { BlurredSSN, UpgradePrompt } from "../components/ssn/BlurredSSN";
import RiskDistributionChart from "../components/batch/RiskDistributionChart";
import StatePatternChart from "../components/batch/StatePatternChart";
import { getStateFromArea } from "../lib/ssnState";
import {
  WorkspacePage,
  WorkspacePanel,
  PrimaryButton,
  GhostButton,
} from "@/components/dashboard";
import { LookupCostHint } from "@/components/shared/LookupCostHint";
import { Download, AlertTriangle, CheckCircle2, XCircle, Layers, BarChart3 } from "lucide-react";

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
    <WorkspacePage
      title="Batch Analysis"
      description="Process up to 1,000 SSNs in a single job."
      maxWidth="max-w-6xl"
      actions={
        results ? (
          <GhostButton onClick={handleExport} disabled={!isSubscribed}>
            <Download className="size-3.5" />
            Export CSV
          </GhostButton>
        ) : null
      }
    >
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="space-y-4 lg:col-span-2">
          <WorkspacePanel title="Job configuration">
            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-[13px] text-go-text-secondary">
                  Batch name
                </label>
                <Input
                  placeholder="Q1 2025 Analysis"
                  value={batchName}
                  onChange={(e) => setBatchName(e.target.value)}
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-[13px] text-go-text-secondary">SSN list</label>
                  <span
                    className={`font-mono text-[12px] ${
                      ssnCount > 900 ? "text-go-warning" : "text-go-text-muted"
                    }`}
                  >
                    {ssnCount.toLocaleString()} / 1,000
                  </span>
                </div>
                <Textarea
                  placeholder={"123-45-6789\n234-56-7890\n345-67-8901"}
                  value={ssnInput}
                  onChange={(e) => setSSNInput(e.target.value)}
                  className="h-52 resize-none font-mono text-[13px] leading-relaxed"
                />
                <p className="mt-1.5 text-[12px] text-go-text-muted">
                  One SSN per line — formatted or raw digits accepted
                </p>
              </div>

              {error && (
                <div className="flex items-start gap-2.5 rounded-[10px] border border-go-danger/30 bg-go-danger/10 p-3">
                  <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-go-danger" />
                  <span className="text-[13px] text-go-danger">{error}</span>
                </div>
              )}

              <LookupCostHint
                label="Batch (unit × rows)"
                costCents={Math.max(ssnCount, 0) * 10}
                className="mt-0 mb-3"
              />
              <PrimaryButton
                onClick={handleAnalyze}
                disabled={isAnalyzing || ssnCount === 0}
                className="w-full"
              >
                {isAnalyzing ? (
                  <>
                    <div className="size-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Processing...
                  </>
                ) : (
                  <>
                    <BarChart3 className="size-3.5" />
                    Run analysis
                  </>
                )}
              </PrimaryButton>

              {isAnalyzing && (
                <div className="space-y-1.5">
                  <div className="h-0.5 overflow-hidden rounded-full bg-go-border">
                    <motion.div
                      className="h-full rounded-full bg-go-primary"
                      style={{ width: `${progress}%` }}
                      transition={{ duration: 0.1 }}
                    />
                  </div>
                  <div className="flex justify-between text-[12px] text-go-text-muted">
                    <span>Validating patterns...</span>
                    <span className="font-mono">{Math.round(progress)}%</span>
                  </div>
                </div>
              )}
            </div>
          </WorkspacePanel>
        </div>

        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {!results && !isAnalyzing ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex min-h-64 flex-col items-center justify-center gap-3 rounded-[10px] border border-dashed border-go-border p-12 text-center"
              >
                <BarChart3 className="size-5 text-go-text-muted" />
                <div>
                  <p className="text-[14px] text-go-text-secondary">No results yet</p>
                  <p className="mt-1 text-[13px] text-go-text-muted">
                    Configure and run a batch job to see analysis
                  </p>
                </div>
              </motion.div>
            ) : results ? (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  {[
                    { label: "Total", value: results.total_count, icon: Layers },
                    { label: "Valid", value: results.valid_count, icon: CheckCircle2 },
                    { label: "Invalid", value: results.invalid_count, icon: XCircle },
                    { label: "High risk", value: results.high_risk_count, icon: AlertTriangle },
                  ].map(({ label, value, icon: Icon }) => (
                    <div
                      key={label}
                      className="rounded-[10px] border border-go-border bg-go-surface p-4"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-[13px] text-go-text-muted">{label}</span>
                        <Icon className="size-3 text-go-text-muted" />
                      </div>
                      <div className="font-mono text-2xl font-semibold text-go-text">
                        {value.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="rounded-[10px] border border-go-border bg-go-surface p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-[14px] font-medium text-go-text">Validity rate</span>
                    <span className="font-mono text-sm font-semibold text-go-text">
                      {validRate}%
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-go-border">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${validRate}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="h-full rounded-full bg-go-primary"
                    />
                  </div>
                  <div className="mt-2 flex justify-between text-[12px] text-go-text-muted">
                    <span>{results.valid_count.toLocaleString()} valid</span>
                    <span>{results.invalid_count.toLocaleString()} flagged</span>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <RiskDistributionChart results={results} />
                  <StatePatternChart results={results} />
                </div>

                <WorkspacePanel
                  title="Records"
                  actions={
                    <span className="text-[12px] text-go-text-muted">
                      {results.results.length > 20
                        ? `Showing 20 of ${results.results.length}`
                        : `${results.results.length} records`}
                    </span>
                  }
                  bodyClassName="p-0"
                >
                  <div className="max-h-80 divide-y divide-go-border overflow-y-auto">
                    {results.results.slice(0, 20).map((result, index) => (
                      <div
                        key={index}
                        className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5 sm:py-2.5 go-transition hover:bg-white/[0.02]"
                      >
                        <span className="min-w-0 font-mono text-[13px] text-go-text-secondary">
                          <BlurredSSN ssn={result.ssn} isSubscribed={isSubscribed} />
                        </span>
                        <div className="flex flex-wrap items-center gap-2">
                          {result.isValid ? (
                            <MinimalBadge variant="success" size="xs">
                              Valid
                            </MinimalBadge>
                          ) : (
                            <MinimalBadge variant="neutral" size="xs">
                              Invalid
                            </MinimalBadge>
                          )}
                          {result.riskLevel === "high" && (
                            <MinimalBadge variant="warning" size="xs">
                              High Risk
                            </MinimalBadge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  {results.results.length > 20 && (
                    <div className="border-t border-go-border px-5 py-3 text-[12px] text-go-text-muted">
                      +{(results.results.length - 20).toLocaleString()} more records — export CSV
                      to view all
                    </div>
                  )}
                </WorkspacePanel>

                {!isSubscribed && <UpgradePrompt />}
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </WorkspacePage>
  );
}
