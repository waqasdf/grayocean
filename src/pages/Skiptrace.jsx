import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { SkiptraceSearch } from "@/entities/SkiptraceSearch";
import { Input } from "@/components/ui/input";
import { MinimalBadge } from "@/components/ui/minimal-badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { InvokeLLM } from "@/integrations/Core";
import { Download, Search, MapPin, Phone, Mail, Users, Briefcase, FileText, ExternalLink, AlertCircle, Copy, Check, Clock, ShieldAlert } from "lucide-react";
import {
  WorkspacePage,
  WorkspacePanel,
  PrimaryButton,
  GhostButton,
} from "@/components/dashboard";
import { LookupCostHint } from "@/components/shared/LookupCostHint";

export default function SkiptracePage() {
  const [user, setUser] = useState(null);
  const [fullName, setFullName] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [age, setAge] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(!!localStorage.getItem('skiptrace_terms_accepted'));
  const [copiedItem, setCopiedItem] = useState(null);
  const [searchHistory, setSearchHistory] = useState([]);
  const [estimatedTime, setEstimatedTime] = useState(30);

  useEffect(() => {
    User.me().then(setUser).catch(() => setUser(null));
  }, []);

  const isSubscribed = true;

  const handleSearch = async () => {
    if (!fullName.trim()) { setError('Full name is required'); return; }
    if (!acceptedTerms) { setError('You must accept the legal terms to continue'); return; }

    setIsSearching(true);
    setError('');
    setResults(null);
    setEstimatedTime(30);

    const timer = setInterval(() => setEstimatedTime(prev => Math.max(0, prev - 1)), 1000);

    try {
      const response = await InvokeLLM({
        prompt: `You are a skip tracing specialist. Search PUBLIC ONLINE RECORDS and freely accessible web sources to locate information about this person.\n\nName: ${fullName}\n${city ? `City: ${city}` : ''}\n${state ? `State: ${state}` : ''}\n${age ? `Age: approximately ${age} years old` : ''}\n\nUse only publicly available online data: public records databases, property records, court records, business registries, professional licensing boards, social media profiles, people-search aggregators, news articles, and other publicly accessible web sources. Do NOT use private, proprietary, or restricted databases.\n\nProvide: addresses (city/state only), phone numbers, emails, social profiles, relatives/associates, employment, and public records. Assign confidence (high/medium/low) per item based on source reliability and corroboration. Always cite the source for each finding.`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            summary: { type: "string" },
            addresses: { type: "array", items: { type: "object", properties: { city: { type: "string" }, state: { type: "string" }, zip: { type: "string" }, confidence: { type: "string", enum: ["high", "medium", "low"] }, source: { type: "string" } } } },
            phone_numbers: { type: "array", items: { type: "object", properties: { number: { type: "string" }, type: { type: "string" }, confidence: { type: "string", enum: ["high", "medium", "low"] }, source: { type: "string" } } } },
            emails: { type: "array", items: { type: "object", properties: { email: { type: "string" }, confidence: { type: "string", enum: ["high", "medium", "low"] }, source: { type: "string" } } } },
            social_profiles: { type: "array", items: { type: "object", properties: { platform: { type: "string" }, url: { type: "string" }, username: { type: "string" }, confidence: { type: "string", enum: ["high", "medium", "low"] } } } },
            relatives: { type: "array", items: { type: "object", properties: { name: { type: "string" }, relationship: { type: "string" }, confidence: { type: "string", enum: ["high", "medium", "low"] } } } },
            employment: { type: "object", properties: { company: { type: "string" }, title: { type: "string" }, location: { type: "string" }, confidence: { type: "string", enum: ["high", "medium", "low"] }, source: { type: "string" } } },
            public_records: { type: "array", items: { type: "object", properties: { type: { type: "string" }, details: { type: "string" }, date: { type: "string" }, source: { type: "string" } } } }
          }
        }
      });

      const allItems = [
        ...(response.addresses || []), ...(response.phone_numbers || []),
        ...(response.emails || []), ...(response.social_profiles || []),
        ...(response.relatives || []), ...(response.public_records || [])
      ];
      if (response.employment?.company) allItems.push(response.employment);

      const high = allItems.filter(i => i.confidence === 'high').length;
      const med = allItems.filter(i => i.confidence === 'medium').length;
      const confidenceScore = allItems.length > 0 ? Math.round(((high * 1.0 + med * 0.6) / allItems.length) * 100) : 0;

      const searchResult = {
        search_name: `${fullName} — ${city || state || 'Search'}`,
        full_name: fullName, city: city || null, state: state || null,
        age: age ? parseInt(age) : null, results: response,
        confidence_score: confidenceScore, sources_found: allItems.length
      };

      setResults(searchResult);
      if (isSubscribed) {
        await SkiptraceSearch.create(searchResult);
        const history = await SkiptraceSearch.list('-created_date', 10);
        setSearchHistory(history);
      }
    } catch {
      setError('Search failed. Please try again.');
    } finally {
      clearInterval(timer);
      setIsSearching(false);
    }
  };

  const handleAcceptTerms = (checked) => {
    setAcceptedTerms(checked);
    checked ? localStorage.setItem('skiptrace_terms_accepted', 'true') : localStorage.removeItem('skiptrace_terms_accepted');
  };

  const handleCopy = async (text, id) => {
    await navigator.clipboard.writeText(text);
    setCopiedItem(id);
    setTimeout(() => setCopiedItem(null), 2000);
  };

  const handleExport = () => {
    if (!results) return;
    const csv = [
      ['Type', 'Value', 'Confidence', 'Source'],
      ...(results.results.addresses?.map(a => ['Address', `${a.city}, ${a.state} ${a.zip}`, a.confidence, a.source]) || []),
      ...(results.results.phone_numbers?.map(p => ['Phone', p.number, p.confidence, p.source]) || []),
      ...(results.results.emails?.map(e => ['Email', e.email, e.confidence, e.source]) || []),
    ].map(row => row.map(i => `"${String(i || '').replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `skiptrace_${fullName.replace(/\s+/g, '_')}_${Date.now()}.csv`;
    document.body.appendChild(a); a.click();
    window.URL.revokeObjectURL(url); a.remove();
  };

  const confidenceBadge = (c) => {
    if (c === 'high') return <MinimalBadge variant="success" size="xs">High</MinimalBadge>;
    if (c === 'medium') return <MinimalBadge variant="info" size="xs">Medium</MinimalBadge>;
    return <MinimalBadge variant="neutral" size="xs">Low</MinimalBadge>;
  };

  const usStates = [
    'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY',
    'LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND',
    'OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY','DC'
  ];

  const ResultSection = ({ icon: Icon, title, children, count }) => (
    <div className="overflow-hidden rounded-[10px] border border-go-border bg-go-surface">
      <div className="flex items-center justify-between border-b border-go-border px-5 py-3.5">
        <div className="flex items-center gap-2">
          <Icon className="h-3.5 w-3.5 text-go-text-muted" />
          <span className="text-[14px] font-medium text-go-text">{title}</span>
        </div>
        {count !== undefined && <span className="font-mono text-[12px] text-go-text-muted">{count}</span>}
      </div>
      <div className="space-y-2 p-4">{children}</div>
    </div>
  );

  const DataRow = ({ primary, secondary, confidence, onCopy, copyId }) => (
    <div className="flex items-center justify-between gap-3 rounded-[10px] border border-go-border bg-go-surface-muted p-3 transition-colors hover:border-go-border-strong">
      <div className="min-w-0 flex-1">
        <div className="truncate text-[13px] font-medium text-go-text">{primary}</div>
        {secondary && <div className="mt-0.5 truncate text-[12px] text-go-text-muted">{secondary}</div>}
      </div>
      <div className="flex flex-shrink-0 items-center gap-2">
        {confidence && confidenceBadge(confidence)}
        {onCopy && (
          <button
            type="button"
            onClick={onCopy}
            aria-label="Copy"
            className="inline-flex size-10 items-center justify-center rounded-[8px] text-go-text-muted transition-colors hover:bg-white/[0.04] hover:text-go-text"
          >
            {copiedItem === copyId ? <Check className="h-3.5 w-3.5 text-go-success" /> : <Copy className="h-3.5 w-3.5" />}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <WorkspacePage
      title="Skiptrace"
      description="Aggregate public records and online intelligence"
      maxWidth="max-w-5xl"
      actions={
        results ? (
          <GhostButton onClick={handleExport}>
            <Download className="h-3.5 w-3.5" />
            Export
          </GhostButton>
        ) : null
      }
    >
      {!acceptedTerms && (
        <div className="mb-6 rounded-[10px] border border-go-warning/30 bg-go-warning-muted p-5">
          <div className="flex items-start gap-3">
            <ShieldAlert className="mt-0.5 h-4 w-4 flex-shrink-0 text-go-warning" />
            <div className="flex-1">
              <p className="mb-2 text-[13px] font-medium text-go-warning">Legal Notice — Required</p>
              <p className="mb-3 text-[13px] leading-relaxed text-go-text-secondary">
                This tool aggregates publicly available information only. By using this service you agree to use data for lawful purposes, comply with the FCRA, and not use information for harassment or stalking. This is NOT a consumer reporting agency.
              </p>
              <label className="flex cursor-pointer items-center gap-2.5">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => handleAcceptTerms(e.target.checked)}
                  className="h-3.5 w-3.5 rounded border-go-border bg-go-surface-elevated accent-[var(--go-primary)]"
                />
                <span className="text-[13px] text-go-text">I understand and accept these terms</span>
              </label>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="space-y-3 lg:col-span-2">
          <WorkspacePanel title="Search Parameters">
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-[12px] font-medium text-go-text-muted">
                  Full Name <span className="text-go-danger">*</span>
                </label>
                <Input
                  placeholder="Jane Smith"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-2 block text-[12px] font-medium text-go-text-muted">City</label>
                  <Input
                    placeholder="Houston"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-[12px] font-medium text-go-text-muted">Age</label>
                  <Input
                    type="number"
                    placeholder="35"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-[12px] font-medium text-go-text-muted">State</label>
                <Select value={state} onValueChange={setState}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent className="max-h-64">
                    {usStates.map(s => (
                      <SelectItem key={s} value={s} className="font-mono text-xs">{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {error && (
                <div className="flex items-start gap-2 rounded-[10px] border border-go-danger/30 bg-go-danger-muted p-3">
                  <AlertCircle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-go-danger" />
                  <span className="text-[13px] text-go-danger">{error}</span>
                </div>
              )}

              {acceptedTerms && (
                <>
                  <LookupCostHint label="Basic skiptrace" costCents={25} className="mt-0" />
                  <PrimaryButton
                    onClick={handleSearch}
                    disabled={isSearching || !fullName.trim()}
                    className="w-full gap-2"
                  >
                    {isSearching ? (
                      <>
                        <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        <span>Searching...</span>
                      </>
                    ) : (
                      <><Search className="h-3.5 w-3.5" /> Search Public Records</>
                    )}
                  </PrimaryButton>
                </>
              )}

              {isSearching && (
                <div className="flex items-center justify-center gap-2 text-[12px] text-go-text-muted">
                  <Clock className="h-3 w-3" />
                  <span>~{estimatedTime}s remaining</span>
                </div>
              )}

              {!acceptedTerms && (
                <div className="text-center text-[12px] text-go-text-muted">Accept the legal notice above to enable search</div>
              )}
            </div>
          </WorkspacePanel>

          {acceptedTerms && (
            <div className="flex items-center gap-2 rounded-[10px] border border-go-success/20 bg-go-success-muted px-3 py-2">
              <div className="h-1.5 w-1.5 rounded-full bg-go-success" />
              <span className="text-[12px] text-go-success">Legal terms accepted</span>
            </div>
          )}
        </div>

        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {!results && !isSearching && (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex min-h-64 flex-col items-center justify-center gap-3 rounded-[10px] border border-dashed border-go-border p-12 text-center"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-go-border bg-go-surface">
                  <Search className="h-4 w-4 text-go-text-muted" />
                </div>
                <div>
                  <p className="text-[13px] text-go-text-secondary">No results yet</p>
                  <p className="mt-1 text-[12px] text-go-text-muted">Enter a name and run a search</p>
                </div>
              </motion.div>
            )}

            {isSearching && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex min-h-64 flex-col items-center justify-center gap-4 rounded-[10px] border border-go-border bg-go-surface p-12"
              >
                <div className="h-10 w-10 animate-spin rounded-full border-2 border-go-border border-t-go-primary" />
                <div className="text-center">
                  <p className="mb-1 text-[13px] text-go-text">Scanning public records</p>
                  <p className="text-[13px] text-go-text-muted">Cross-referencing {['LinkedIn', 'property records', 'public databases', 'court records'][Math.floor(Date.now() / 3000) % 4]}...</p>
                </div>
              </motion.div>
            )}

            {results && !isSearching && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <div className="rounded-[10px] border border-go-border bg-go-surface p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <p className="mb-0.5 text-[14px] font-medium text-go-text">{results.full_name}</p>
                      <p className="text-[12px] text-go-text-muted">{results.sources_found} sources found</p>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-2xl font-semibold text-go-text">{results.confidence_score}<span className="text-base text-go-text-muted">%</span></div>
                      <div className="text-[11px] uppercase tracking-wider text-go-text-muted">Confidence</div>
                    </div>
                  </div>
                  <div className="h-1 overflow-hidden rounded-full bg-go-surface-muted">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${results.confidence_score}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className={`h-full rounded-full ${
                        results.confidence_score > 70
                          ? 'bg-go-success'
                          : results.confidence_score > 40
                          ? 'bg-go-primary'
                          : 'bg-go-text-muted'
                      }`}
                    />
                  </div>
                  {results.results.summary && (
                    <p className="mt-3 border-t border-go-border pt-3 text-[13px] leading-relaxed text-go-text-secondary">
                      {results.results.summary}
                    </p>
                  )}
                </div>

                {results.results.addresses?.length > 0 && (
                  <ResultSection icon={MapPin} title="Addresses" count={results.results.addresses.length}>
                    {results.results.addresses.map((a, i) => (
                      <DataRow key={i} primary={`${a.city}, ${a.state} ${a.zip || ''}`} secondary={a.source} confidence={a.confidence} onCopy={() => handleCopy(`${a.city}, ${a.state} ${a.zip}`, `addr-${i}`)} copyId={`addr-${i}`} />
                    ))}
                  </ResultSection>
                )}

                {results.results.phone_numbers?.length > 0 && (
                  <ResultSection icon={Phone} title="Phone Numbers" count={results.results.phone_numbers.length}>
                    {results.results.phone_numbers.map((p, i) => (
                      <DataRow key={i} primary={p.number} secondary={`${p.type || ''} · ${p.source || ''}`} confidence={p.confidence} onCopy={() => handleCopy(p.number, `phone-${i}`)} copyId={`phone-${i}`} />
                    ))}
                  </ResultSection>
                )}

                {results.results.emails?.length > 0 && (
                  <ResultSection icon={Mail} title="Email Addresses" count={results.results.emails.length}>
                    {results.results.emails.map((e, i) => (
                      <DataRow key={i} primary={e.email} secondary={e.source} confidence={e.confidence} onCopy={() => handleCopy(e.email, `email-${i}`)} copyId={`email-${i}`} />
                    ))}
                  </ResultSection>
                )}

                {results.results.social_profiles?.length > 0 && (
                  <ResultSection icon={ExternalLink} title="Social Profiles" count={results.results.social_profiles.length}>
                    {results.results.social_profiles.map((s, i) => (
                      <div key={i} className="flex items-center justify-between gap-3 rounded-[10px] border border-go-border bg-go-surface-muted p-3">
                        <div className="min-w-0 flex-1">
                          <div className="text-[13px] font-medium text-go-text">{s.platform}</div>
                          <a href={s.url} target="_blank" rel="noopener noreferrer" className="block truncate text-[12px] text-go-primary hover:text-go-primary-hover">
                            {s.url}
                          </a>
                        </div>
                        {confidenceBadge(s.confidence)}
                      </div>
                    ))}
                  </ResultSection>
                )}

                {results.results.relatives?.length > 0 && (
                  <ResultSection icon={Users} title="Relatives / Associates" count={results.results.relatives.length}>
                    {results.results.relatives.map((r, i) => (
                      <DataRow key={i} primary={r.name} secondary={r.relationship} confidence={r.confidence} />
                    ))}
                  </ResultSection>
                )}

                {results.results.employment?.company && (
                  <ResultSection icon={Briefcase} title="Employment">
                    <DataRow primary={`${results.results.employment.title} at ${results.results.employment.company}`} secondary={`${results.results.employment.location || ''} · ${results.results.employment.source || ''}`} confidence={results.results.employment.confidence} />
                  </ResultSection>
                )}

                {results.results.public_records?.length > 0 && (
                  <ResultSection icon={FileText} title="Public Records" count={results.results.public_records.length}>
                    {results.results.public_records.map((r, i) => (
                      <div key={i} className="rounded-[10px] border border-go-border bg-go-surface-muted p-3">
                        <div className="mb-1 text-[13px] font-medium text-go-text">{r.type}</div>
                        <div className="text-[13px] text-go-text-secondary">{r.details}</div>
                        {(r.date || r.source) && <div className="mt-1 text-[12px] text-go-text-muted">{r.date} · {r.source}</div>}
                      </div>
                    ))}
                  </ResultSection>
                )}

                <GhostButton
                  onClick={() => { setResults(null); setFullName(''); setCity(''); setState(''); setAge(''); }}
                  className="w-full"
                >
                  New search
                </GhostButton>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </WorkspacePage>
  );
}