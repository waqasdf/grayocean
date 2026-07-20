import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { MinimalBadge } from "@/components/ui/minimal-badge";
import { motion } from "framer-motion";
import { Copy, Check, Key, Lock, Zap } from "lucide-react";

export default function APIPage() {
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const [copied, setCopied] = useState(null);

  useEffect(() => { loadUser(); }, []);

  const loadUser = async () => {
    try { setUser(await User.me()); }
    catch { setUser(null); }
    finally { setUserLoading(false); }
  };

  const isSubscribed = user?.subscription_status === 'active';

  const copy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const apiEndpoints = [
    {
      name: "SSN Lookup",
      method: "POST",
      endpoint: "/api/ssn-lookup",
      description: "Validate and analyze a Social Security Number — state, era, risk score.",
      request: { ssn: "123-45-6789" },
      response: { ssn: "123-45-6789", area_number: "123", state: "Maine", year_range: "1936-1972", is_valid: false, risk_score: 85, risk_level: "high" }
    },
    {
      name: "Address Intelligence",
      method: "POST",
      endpoint: "/api/address-lookup",
      description: "Full demographic profile for any US address — income, density, home value.",
      request: { street_address: "1600 Pennsylvania Avenue NW", city: "Washington", state: "DC", zip_code: "20500" },
      response: { is_valid: true, latitude: 38.8977, longitude: -77.0365, median_household_income: 85203, income_bracket: "above_average", area_type: "urban", neighborhood_score: 78 }
    },
    {
      name: "Batch Analysis",
      method: "POST",
      endpoint: "/api/batch-analysis",
      description: "Process up to 1,000 SSNs in a single request with aggregated risk metrics.",
      request: { batch_name: "Q1 Analysis", ssn_list: ["123-45-6789", "987-65-4321"] },
      response: { batch_name: "Q1 Analysis", total_count: 2, valid_count: 1, invalid_count: 1, average_risk_score: 42.5, results: [] }
    }
  ];

  const methodColor = { GET: 'text-emerald-400', POST: 'text-[color:var(--go-accent-text)]', PUT: 'text-amber-400', DELETE: 'text-red-400' };

  return (
    <div className="min-h-screen bg-[var(--go-bg)]">
      {/* Page header */}
      <div className="border-b border-[color:var(--go-border)] bg-[var(--go-bg)]">
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-5 md:py-6">
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2 mb-1.5">
              <h1 className="go-page-title">API Reference</h1>
              <MinimalBadge variant="neutral" size="xs">v1</MinimalBadge>
            </div>
            <p className="go-page-subtitle">API reference and keys</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-6 py-5 md:py-6 space-y-5">
        {/* Auth card */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <div className="go-panel overflow-hidden">
            <div className="px-6 py-4 border-b border-[color:var(--go-border)] flex items-center gap-2.5">
              <Key className="w-3.5 h-3.5 text-[color:var(--go-text-muted)]" />
              <span className="text-[11px] font-semibold text-[color:var(--go-text-body)] uppercase tracking-widest">Authentication</span>
            </div>
            <div className="p-6 grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-xs text-[color:var(--go-text-muted)] leading-relaxed mb-4">
                  All API requests require a Bearer token in the <code className="text-[color:var(--go-accent-text)] font-mono">Authorization</code> header. Your key is tied to your account and rate-limited by plan.
                </p>
                <div className="rounded-lg border border-[color:var(--go-border)] bg-[var(--go-bg)] p-4">
                  <div className="text-[10px] text-[color:var(--go-text-meta)] mb-2 uppercase tracking-widest">Header format</div>
                  <code className="font-mono text-xs text-[color:var(--go-text-body)]">Authorization: Bearer YOUR_API_KEY</code>
                </div>
              </div>
              <div>
                {isSubscribed ? (
                  <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/[0.05] p-4 h-full flex flex-col justify-between">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span className="text-[10px] text-emerald-400 font-semibold uppercase tracking-widest">Active Key</span>
                    </div>
                    <code className="font-mono text-xs text-[color:var(--go-text)] break-all bg-black/30 rounded-lg p-3 block">
                      grayocean_{user?.id}_prod
                    </code>
                    <button
                      onClick={() => copy(`grayocean_${user?.id}_prod`, 'apikey')}
                      className="mt-3 flex items-center gap-1.5 text-[10px] text-[color:var(--go-text-muted)] hover:text-[color:var(--go-text)] transition-colors"
                    >
                      {copied === 'apikey' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      {copied === 'apikey' ? 'Copied' : 'Copy key'}
                    </button>
                  </div>
                ) : (
                  <div className="rounded-lg border border-amber-500/20 bg-amber-500/[0.05] p-4 h-full flex flex-col justify-center">
                    <Lock className="w-5 h-5 text-amber-500/60 mb-3" />
                    <p className="text-xs text-amber-400/80 mb-3">Subscribe to get your API key and begin making requests.</p>
                    <a href="/Pricing" className="inline-flex items-center gap-1.5 text-[11px] font-medium text-amber-400 hover:text-amber-300 transition-colors">
                      View plans <Zap className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Endpoints */}
        <div className="space-y-4">
          {apiEndpoints.map((ep, index) => (
            <motion.div
              key={ep.name}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.06 }}
              className="go-panel overflow-hidden"
            >
              {/* Endpoint header */}
              <div className="px-6 py-4 border-b border-[color:var(--go-border)] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`font-mono text-xs font-bold ${methodColor[ep.method] || 'text-[color:var(--go-text-secondary)]'}`}>
                    {ep.method}
                  </span>
                  <span className="font-mono text-xs text-[color:var(--go-text-secondary)] bg-white/[0.04] px-2.5 py-1 rounded border border-[color:var(--go-border)]">
                    {ep.endpoint}
                  </span>
                  <button
                    onClick={() => copy(ep.endpoint, `ep-${index}`)}
                    className="text-[color:var(--go-text-meta)] hover:text-[color:var(--go-text-secondary)] transition-colors"
                  >
                    {copied === `ep-${index}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
                <span className="text-[11px] font-semibold text-[color:var(--go-text)]">{ep.name}</span>
              </div>

              <div className="p-6">
                <p className="text-xs text-[color:var(--go-text-muted)] mb-5">{ep.description}</p>
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Request */}
                  <div>
                    <div className="flex items-center gap-1.5 mb-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[var(--go-accent)]/60" />
                      <span className="text-[10px] text-[color:var(--go-text-meta)] uppercase tracking-widest font-medium">Request body</span>
                    </div>
                    <div className="rounded-lg border border-[color:var(--go-border)] bg-[var(--go-bg)] p-4 overflow-x-auto">
                      <pre className="font-mono text-[11px] text-[color:var(--go-text-body)] leading-relaxed">
                        {JSON.stringify(ep.request, null, 2)}
                      </pre>
                    </div>
                  </div>
                  {/* Response */}
                  <div>
                    <div className="flex items-center gap-1.5 mb-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/60" />
                      <span className="text-[10px] text-[color:var(--go-text-meta)] uppercase tracking-widest font-medium">Response</span>
                    </div>
                    <div className="rounded-lg border border-[color:var(--go-border)] bg-[var(--go-bg)] p-4 overflow-x-auto">
                      <pre className="font-mono text-[11px] text-[color:var(--go-text-body)] leading-relaxed">
                        {JSON.stringify(ep.response, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Rate limits */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <div className="go-panel p-6">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-3.5 h-3.5 text-[color:var(--go-text-muted)]" />
              <span className="text-[11px] font-semibold text-[color:var(--go-text-body)] uppercase tracking-widest">Rate Limits</span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[
                { plan: 'Free', rpm: '10', rpd: '100' },
                { plan: 'Pro', rpm: '60', rpd: '5,000' },
                { plan: 'Enterprise', rpm: 'Unlimited', rpd: 'Unlimited' },
              ].map(({ plan, rpm, rpd }) => (
                <div key={plan} className="rounded-lg border border-[color:var(--go-border)] bg-[var(--go-bg)] p-4">
                  <div className="text-[10px] text-[color:var(--go-text-meta)] uppercase tracking-widest mb-2">{plan}</div>
                  <div className="text-lg font-bold font-mono text-[color:var(--go-text)] mb-0.5">{rpm}</div>
                  <div className="text-[10px] text-[color:var(--go-text-meta)]">req/min</div>
                  <div className="mt-2 pt-2 border-t border-[color:var(--go-border)]">
                    <div className="text-sm font-bold font-mono text-[color:var(--go-text-secondary)]">{rpd}</div>
                    <div className="text-[10px] text-[color:var(--go-text-meta)]">req/day</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}