import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { SkiptraceSearch } from "@/entities/SkiptraceSearch";
import { Input } from "@/components/ui/input";
import { MinimalBadge } from "@/components/ui/minimal-badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { InvokeLLM } from "@/integrations/Core";
import { Download, Search, MapPin, Phone, Mail, Users, Briefcase, FileText, ExternalLink, AlertCircle, Copy, Check, Clock, ShieldAlert } from "lucide-react";

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
    if (c === 'medium') return <MinimalBadge variant="cyan" size="xs">Medium</MinimalBadge>;
    return <MinimalBadge variant="neutral" size="xs">Low</MinimalBadge>;
  };

  const usStates = [
    'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY',
    'LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND',
    'OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY','DC'
  ];

  const ResultSection = ({ icon: Icon, title, children, count }) => (
    <div className="go-panel overflow-hidden">
      <div className="px-5 py-3.5 border-b border-[color:var(--go-border)] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="w-3.5 h-3.5 text-[color:var(--go-text-muted)]" />
          <span className="text-[11px] font-semibold text-[color:var(--go-text-body)] uppercase tracking-widest">{title}</span>
        </div>
        {count !== undefined && <span className="text-[10px] font-mono text-[color:var(--go-text-meta)]">{count}</span>}
      </div>
      <div className="p-4 space-y-2">{children}</div>
    </div>
  );

  const DataRow = ({ primary, secondary, confidence, onCopy, copyId }) => (
    <div className="flex items-center justify-between gap-3 p-3 rounded-lg bg-[var(--go-bg-panel)] border border-[color:var(--go-border)] hover:border-white/[0.09] transition-colors">
      <div className="min-w-0 flex-1">
        <div className="text-xs text-[color:var(--go-text)] font-medium truncate">{primary}</div>
        {secondary && <div className="text-[10px] text-[color:var(--go-text-meta)] mt-0.5 truncate">{secondary}</div>}
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {confidence && confidenceBadge(confidence)}
        {onCopy && (
          <button onClick={onCopy} className="text-[color:var(--go-text-meta)] hover:text-[color:var(--go-text-secondary)] transition-colors">
            {copiedItem === copyId ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-full">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-5 md:py-6">
        <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="mb-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="go-kicker mb-2">People search</p>
              <h1 className="go-page-title">Skiptrace</h1>
              <p className="go-page-subtitle mt-1.5">
                Search public records by name and location.
              </p>
            </div>
            {results && (
              <button
                onClick={handleExport}
                className="go-pill-btn !h-9 !text-[12px] !px-4"
                style={{
                  background: "transparent",
                  color: "var(--go-text-body)",
                  border: "1px solid var(--go-border-strong)",
                }}
              >
                <Download className="w-3.5 h-3.5" />
                Export
              </button>
            )}
          </div>
        </motion.div>

        {/* Legal notice */}
        {!acceptedTerms && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <div className="rounded-lg border border-[color:var(--go-warning-border)] bg-[var(--go-warning-fill)] p-4">
              <div className="flex items-start gap-3">
                <ShieldAlert className="w-4 h-4 text-[color:var(--go-warning)] mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-[13px] font-semibold text-[color:var(--go-warning)] mb-2">Legal Notice — Required</p>
                  <p className="text-[13px] text-[color:var(--go-text-secondary)] leading-relaxed mb-3">
                    This tool aggregates publicly available information only. By using this service you agree to use data for lawful purposes, comply with the FCRA, and not use information for harassment or stalking. This is NOT a consumer reporting agency.
                  </p>
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={acceptedTerms}
                      onChange={(e) => handleAcceptTerms(e.target.checked)}
                      className="w-3.5 h-3.5 rounded border-[color:var(--go-border)] bg-[var(--go-bg-panel)] accent-[var(--go-accent)]"
                    />
                    <span className="text-[11px] text-[color:var(--go-text)]">I understand and accept these terms</span>
                  </label>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Search panel */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="lg:col-span-2 space-y-3"
          >
            <div className="go-panel overflow-hidden">
              <div className="px-5 py-4 border-b border-[color:var(--go-border)]">
                <span className="text-[11px] font-semibold text-[color:var(--go-text-body)] uppercase tracking-widest">Search Parameters</span>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <label className="block text-[10px] text-[color:var(--go-text-muted)] uppercase tracking-widest mb-2">Full Name <span className="text-red-400">*</span></label>
                  <Input
                    placeholder="Jane Smith"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    className="bg-[var(--go-bg)] border-[color:var(--go-border-strong)] text-[color:var(--go-text)] text-sm placeholder:text-[color:var(--go-text-meta)] focus:border-[color:var(--go-accent)] focus:ring-0 h-9"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-[color:var(--go-text-muted)] uppercase tracking-widest mb-2">City</label>
                    <Input
                      placeholder="Houston"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="bg-[var(--go-bg)] border-[color:var(--go-border-strong)] text-[color:var(--go-text)] text-sm placeholder:text-[color:var(--go-text-meta)] focus:border-[color:var(--go-accent)] focus:ring-0 h-9"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-[color:var(--go-text-muted)] uppercase tracking-widest mb-2">Age</label>
                    <Input
                      type="number"
                      placeholder="35"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="bg-[var(--go-bg)] border-[color:var(--go-border-strong)] text-[color:var(--go-text)] text-sm placeholder:text-[color:var(--go-text-meta)] focus:border-[color:var(--go-accent)] focus:ring-0 h-9"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] text-[color:var(--go-text-muted)] uppercase tracking-widest mb-2">State</label>
                  <Select value={state} onValueChange={setState}>
                    <SelectTrigger className="bg-[var(--go-bg)] border-[color:var(--go-border-strong)] text-[color:var(--go-text)] text-sm h-9 focus:ring-0">
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a1a1a] border-[color:var(--go-border-strong)] max-h-64">
                      {usStates.map(s => (
                        <SelectItem key={s} value={s} className="text-[color:var(--go-text)] hover:bg-[var(--go-bg-panel)] text-xs font-mono">{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {error && (
                  <div className="flex items-start gap-2 p-3 rounded-lg border border-red-500/20 bg-red-500/[0.06]">
                    <AlertCircle className="w-3.5 h-3.5 text-red-400 mt-0.5 flex-shrink-0" />
                    <span className="text-[11px] text-red-400">{error}</span>
                  </div>
                )}

                {acceptedTerms && (
                  <button
                    onClick={handleSearch}
                    disabled={isSearching || !fullName.trim()}
                    className="w-full flex items-center justify-center gap-2 h-10 rounded-lg bg-[var(--go-accent)] hover:bg-[var(--go-accent-hover)] text-white text-[14px] font-medium transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {isSearching ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Searching<span className="animate-pulse">...</span></span>
                      </>
                    ) : (
                      <><Search className="w-3.5 h-3.5" /> Search Public Records</>
                    )}
                  </button>
                )}

                {isSearching && (
                  <div className="flex items-center justify-center gap-2 text-[10px] text-[color:var(--go-text-meta)]">
                    <Clock className="w-3 h-3" />
                    <span>~{estimatedTime}s remaining</span>
                  </div>
                )}

                {!acceptedTerms && (
                  <div className="text-center text-[10px] text-[color:var(--go-text-meta)]">Accept the legal notice above to enable search</div>
                )}
              </div>
            </div>

            {/* Terms indicator if accepted */}
            {acceptedTerms && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-emerald-500/15 bg-emerald-500/[0.04]">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-[10px] text-emerald-500/80">Legal terms accepted</span>
              </div>
            )}
          </motion.div>

          {/* Results */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {!results && !isSearching && (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="min-h-64 rounded-lg border border-dashed border-[color:var(--go-border)] flex flex-col items-center justify-center gap-3 text-center p-8"
                >
                  <div className="w-10 h-10 rounded-lg bg-[var(--go-bg-panel)] border border-[color:var(--go-border)] flex items-center justify-center">
                    <Search className="w-4 h-4 text-[color:var(--go-text-meta)]" />
                  </div>
                  <div>
                    <p className="text-[11px] text-[color:var(--go-text-meta)]">No results yet</p>
                    <p className="text-[10px] text-[color:var(--go-text-meta)] mt-1">Enter a name and run a search</p>
                  </div>
                </motion.div>
              )}

              {isSearching && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="min-h-64 go-panel flex flex-col items-center justify-center gap-4 p-12"
                >
                  <div className="relative w-12 h-12">
                    <div className="absolute inset-0 rounded-full border-2 border-[color:var(--go-accent-border)]" />
                    <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[color:var(--go-accent)] animate-spin" />
                    <div className="absolute inset-2 rounded-full border border-[color:var(--go-border)]" />
                  </div>
                  <div className="text-center">
                    <p className="text-[11px] text-[color:var(--go-text)] mb-1">Scanning public records</p>
                    <p className="text-[11px] text-[color:var(--go-text-meta)]">Cross-referencing {['LinkedIn', 'property records', 'public databases', 'court records'][Math.floor(Date.now() / 3000) % 4]}...</p>
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
                  {/* Score header */}
                  <div className="go-panel p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-[13px] font-semibold text-[color:var(--go-text)] mb-0.5">{results.full_name}</p>
                        <p className="text-[12px] text-[color:var(--go-text-muted)]">{results.sources_found} sources found</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-semibold font-mono text-[color:var(--go-text)]">{results.confidence_score}<span className="text-base text-[color:var(--go-text-muted)]">%</span></div>
                        <div className="text-[12px] text-[color:var(--go-text-muted)]">Confidence</div>
                      </div>
                    </div>
                    <div className="h-1 bg-[var(--go-bg-panel)] border border-[color:var(--go-border)] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${results.confidence_score}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className={`h-full rounded-full ${results.confidence_score > 70 ? 'bg-[var(--go-success)]' : results.confidence_score > 40 ? 'bg-[var(--go-accent)]' : 'bg-[var(--go-text-muted)]'}`}
                      />
                    </div>
                    {results.results.summary && (
                      <p className="text-[11px] text-[color:var(--go-text-muted)] mt-3 leading-relaxed border-t border-[color:var(--go-border)] pt-3">
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
                        <div key={i} className="flex items-center justify-between gap-3 p-3 rounded-lg bg-[var(--go-bg-panel)] border border-[color:var(--go-border)]">
                          <div className="min-w-0 flex-1">
                            <div className="text-xs text-[color:var(--go-text)] font-medium">{s.platform}</div>
                            <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-[color:var(--go-accent-text)] hover:text-[color:var(--go-accent-text-hover)] truncate block">
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
                        <div key={i} className="p-3 rounded-lg bg-[var(--go-bg-panel)] border border-[color:var(--go-border)]">
                          <div className="text-xs text-[color:var(--go-text)] font-medium mb-1">{r.type}</div>
                          <div className="text-[11px] text-[color:var(--go-text-secondary)]">{r.details}</div>
                          {(r.date || r.source) && <div className="text-[10px] text-[color:var(--go-text-meta)] mt-1">{r.date} · {r.source}</div>}
                        </div>
                      ))}
                    </ResultSection>
                  )}

                  <button
                    onClick={() => { setResults(null); setFullName(''); setCity(''); setState(''); setAge(''); }}
                    className="w-full py-2.5 rounded-lg border border-[color:var(--go-border)] text-xs text-[color:var(--go-text-meta)] hover:text-[color:var(--go-text-secondary)] hover:border-[color:var(--go-border-strong)] transition-all"
                  >
                    New search
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}