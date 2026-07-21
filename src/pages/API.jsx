import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { MinimalBadge } from "@/components/ui/minimal-badge";
import { Copy, Check, Key, Lock, Zap } from "lucide-react";
import {
  WorkspacePage,
  WorkspacePanel,
  GhostButton,
} from "@/components/dashboard";

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

  return (
    <WorkspacePage
      title="API Reference"
      description="Programmatic access to GrayOcean intelligence."
      maxWidth="max-w-6xl"
      actions={<MinimalBadge variant="neutral" size="xs">v1</MinimalBadge>}
    >
      <div className="space-y-6">
        <WorkspacePanel title="Authentication">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <p className="mb-4 text-[13px] leading-relaxed text-go-text-secondary">
                All API requests require a Bearer token in the{" "}
                <code className="font-mono text-go-text">Authorization</code> header. Your key
                is tied to your account and rate-limited by plan.
              </p>
              <div className="overflow-x-auto rounded-[10px] border border-go-border bg-go-bg p-4">
                <div className="mb-2 text-[12px] text-go-text-muted">Header format</div>
                <code className="break-all font-mono text-[13px] text-go-text-secondary">
                  Authorization: Bearer YOUR_API_KEY
                </code>
              </div>
            </div>
            <div>
              {isSubscribed ? (
                <div className="flex h-full flex-col justify-between rounded-[10px] border border-go-border bg-go-bg p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <Key className="size-3.5 text-go-text-muted" />
                    <span className="text-[13px] font-medium text-go-text">Active key</span>
                  </div>
                  <code className="block break-all rounded-[8px] border border-go-border bg-go-surface p-3 font-mono text-[13px] text-go-text">
                    grayocean_{user?.id}_prod
                  </code>
                  <GhostButton
                    type="button"
                    className="mt-3 h-8 self-start px-2.5 text-[12px]"
                    onClick={() => copy(`grayocean_${user?.id}_prod`, "apikey")}
                  >
                    {copied === "apikey" ? (
                      <Check className="size-3" />
                    ) : (
                      <Copy className="size-3" />
                    )}
                    {copied === "apikey" ? "Copied" : "Copy key"}
                  </GhostButton>
                </div>
              ) : (
                <div className="flex h-full flex-col justify-center rounded-[10px] border border-go-border bg-go-bg p-4">
                  <Lock className="mb-3 size-5 text-go-text-muted" />
                  <p className="mb-3 text-[13px] text-go-text-secondary">
                    Subscribe to unlock your API key and begin making requests.
                  </p>
                  <a
                    href="/Pricing"
                    className="inline-flex items-center gap-1.5 text-[13px] font-medium text-go-primary hover:text-go-primary-hover go-transition"
                  >
                    View plans <Zap className="size-3" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </WorkspacePanel>

        <div className="space-y-4">
          {apiEndpoints.map((ep, index) => (
            <WorkspacePanel
              key={ep.name}
              title={ep.name}
              actions={
                <div className="flex max-w-full flex-wrap items-center gap-2">
                  <span className="font-mono text-[12px] font-medium text-go-text-muted">
                    {ep.method}
                  </span>
                  <span className="max-w-full truncate rounded-[6px] border border-go-border bg-go-bg px-2 py-0.5 font-mono text-[12px] text-go-text-secondary">
                    {ep.endpoint}
                  </span>
                  <button
                    type="button"
                    onClick={() => copy(ep.endpoint, `ep-${index}`)}
                    className="inline-flex size-10 items-center justify-center rounded-[8px] text-go-text-muted go-transition hover:bg-white/[0.04] hover:text-go-text"
                    aria-label="Copy endpoint"
                  >
                    {copied === `ep-${index}` ? (
                      <Check className="size-3.5" />
                    ) : (
                      <Copy className="size-3.5" />
                    )}
                  </button>
                </div>
              }
            >
              <p className="mb-5 text-[13px] text-go-text-secondary">{ep.description}</p>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <div className="mb-2 text-[13px] font-medium text-go-text">Request body</div>
                  <div className="overflow-x-auto rounded-[10px] border border-go-border bg-go-bg p-4">
                    <pre className="font-mono text-[12px] leading-relaxed text-go-text-secondary">
                      {JSON.stringify(ep.request, null, 2)}
                    </pre>
                  </div>
                </div>
                <div>
                  <div className="mb-2 text-[13px] font-medium text-go-text">Response</div>
                  <div className="overflow-x-auto rounded-[10px] border border-go-border bg-go-bg p-4">
                    <pre className="font-mono text-[12px] leading-relaxed text-go-text-secondary">
                      {JSON.stringify(ep.response, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            </WorkspacePanel>
          ))}
        </div>

        <WorkspacePanel title="Rate limits">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              { plan: "Free", rpm: "10", rpd: "100" },
              { plan: "Pro", rpm: "60", rpd: "5,000" },
              { plan: "Enterprise", rpm: "Unlimited", rpd: "Unlimited" },
            ].map(({ plan, rpm, rpd }) => (
              <div
                key={plan}
                className="rounded-[10px] border border-go-border bg-go-bg p-4"
              >
                <div className="mb-2 text-[13px] text-go-text-muted">{plan}</div>
                <div className="mb-0.5 font-mono text-lg font-semibold text-go-text">{rpm}</div>
                <div className="text-[12px] text-go-text-muted">req/min</div>
                <div className="mt-2 border-t border-go-border pt-2">
                  <div className="font-mono text-sm font-semibold text-go-text-secondary">
                    {rpd}
                  </div>
                  <div className="text-[12px] text-go-text-muted">req/day</div>
                </div>
              </div>
            ))}
          </div>
        </WorkspacePanel>
      </div>
    </WorkspacePage>
  );
}
