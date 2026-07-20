import { Link } from "react-router-dom";
import {
  Shield,
  Search,
  MapPin,
  Layers,
  FileSearch,
  Zap,
  Lock,
  Check,
  Minus,
} from "lucide-react";
import MarketingShell from "@/components/marketing/MarketingShell";
import ProductPreview from "@/components/marketing/ProductPreview";
import IdentitySignalField from "@/components/marketing/IdentitySignalField";
import {
  Section,
  Container,
  Eyebrow,
  FeatureGrid,
  FAQ,
  CTABand,
  SimpleLink,
  MetricRow,
} from "@/components/marketing/primitives";

const LOGOS = ["Northfield", "Apex Counsel", "Ledgerly", "Harbor Risk", "Clearpath KYC", "Orion Ops"];

const FEATURES = [
  {
    icon: Search,
    title: "SSN validation",
    body: "Format checks, issue-state signals, and death-record screening in a single lookup.",
  },
  {
    icon: MapPin,
    title: "Address intelligence",
    body: "Normalize, verify, and enrich addresses with history that investigation teams can trust.",
  },
  {
    icon: FileSearch,
    title: "Skiptrace",
    body: "Connect names, phones, and locations in the same workspace.",
  },
  {
    icon: Layers,
    title: "Batch analysis",
    body: "Upload lists, score at scale, and export structured results for review queues.",
  },
  {
    icon: Zap,
    title: "API-first",
    body: "Wire GrayOcean into your stack with clear endpoints, keys, and usage controls.",
  },
  {
    icon: Shield,
    title: "Audit-ready",
    body: "Role access, query history, and retention controls built for regulated workflows.",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Look up or upload",
    body: "Start with a single SSN, address, or a CSV. Same workspace either way.",
  },
  {
    n: "02",
    title: "Review signals",
    body: "See validation, risk markers, and enrichment side by side.",
  },
  {
    n: "03",
    title: "Export or automate",
    body: "Hand off to analysts, push via API, or keep a trail for compliance.",
  },
];

const WHY = [
  {
    title: "One surface for identity work",
    body: "SSN, address, skiptrace, and batch in the same product.",
  },
  {
    title: "Built for operators",
    body: "Keyboard-friendly UI, dense results, and exports that fit existing case systems.",
  },
  {
    title: "Clear pricing, clear limits",
    body: "Know what each plan includes. No surprise overages for routine investigation volume.",
  },
];

const COMPARE = [
  { feature: "SSN + address in one place", go: true, sheets: false, adhoc: false },
  { feature: "Batch scoring & export", go: true, sheets: "partial", adhoc: false },
  { feature: "Skiptrace workflows", go: true, sheets: false, adhoc: "partial" },
  { feature: "API access", go: true, sheets: false, adhoc: "partial" },
  { feature: "Audit trail", go: true, sheets: false, adhoc: false },
  { feature: "Team roles", go: true, sheets: "partial", adhoc: false },
];

const TESTIMONIALS = [
  {
    quote: "We replaced three tools and a spreadsheet. Lookups are faster, and the audit trail is usable.",
    name: "Maya Chen",
    role: "Investigations lead, Harbor Risk",
  },
  {
    quote: "Batch analysis cut our morning queue in half. Analysts spend time on exceptions instead of formatting CSVs.",
    name: "Jordan Blake",
    role: "Ops manager, Clearpath KYC",
  },
  {
    quote: "Predictable API responses and clear rate limits. Easy to wire into our review flow.",
    name: "Sam Ortiz",
    role: "Engineering, Ledgerly",
  },
];

const FAQS = [
  {
    q: "Who is GrayOcean for?",
    a: "Investigation, compliance, lending, and fraud teams that need reliable identity signals across SSN, address, and skiptrace.",
  },
  {
    q: "Do you store Social Security Numbers?",
    a: "Lookups are processed under strict retention controls. Enterprise plans support custom retention and private networking options.",
  },
  {
    q: "Can we start without an API?",
    a: "Yes. The workspace covers single lookups, batch upload, and exports. Add the API when you are ready to automate.",
  },
  {
    q: "How does pricing work?",
    a: "Free for evaluation, Team for growing desks, Enterprise for volume, SSO, and custom contracts. See Pricing for details.",
  },
  {
    q: "Is there a trial for Team?",
    a: "Sign up for Free and upgrade when you need seats, higher limits, and shared workspaces. Sales can arrange a guided pilot.",
  },
];

function CellMark({ value }) {
  if (value === true) {
    return <Check size={16} strokeWidth={1.75} style={{ color: "var(--go-accent)" }} />;
  }
  if (value === "partial") {
    return <span className="text-[12px]" style={{ color: "var(--go-text-muted)" }}>Limited</span>;
  }
  return <Minus size={16} strokeWidth={1.5} style={{ color: "var(--go-text-muted)" }} />;
}

export default function Landing() {
  return (
    <MarketingShell>
      {/* Hero */}
      <Section className="!pt-16 md:!pt-24 lg:!pt-28 !pb-10 md:!pb-14 relative overflow-hidden">
        <IdentitySignalField />
        <Container className="text-center max-w-3xl relative z-[1]">
          <Eyebrow>Identity intelligence</Eyebrow>
          <h1 className="go-display mb-5 max-w-[14ch] mx-auto">
            SSN, address, and skiptrace in one workspace
          </h1>
          <p className="go-lead mb-8 mx-auto">
            Validate SSNs, enrich addresses, run skiptrace, and batch analysis — built for investigation desks.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <SimpleLink to="/signup">Sign up</SimpleLink>
            <SimpleLink to="/SSNLookup" variant="ghost">Open app</SimpleLink>
          </div>
        </Container>
      </Section>

      {/* Product preview */}
      <Section className="!pt-0 !pb-16 md:!pb-24">
        <Container>
          <ProductPreview />
        </Container>
      </Section>

      {/* Social proof */}
      <Section className="!py-10 md:!py-12">
        <Container>
          <p className="text-center text-[12px] uppercase tracking-[0.08em] mb-8" style={{ color: "var(--go-text-muted)" }}>
            Used by investigation and compliance teams
          </p>
          <div className="flex flex-wrap justify-center gap-x-10 gap-y-4">
            {LOGOS.map((name) => (
              <span
                key={name}
                className="text-[14px] font-medium tracking-tight"
                style={{ color: "var(--go-text-muted)" }}
              >
                {name}
              </span>
            ))}
          </div>
        </Container>
      </Section>

      {/* Metrics */}
      <Section className="!py-12 md:!py-16">
        <Container>
          <MetricRow
            items={[
              { value: "12M+", label: "Lookups processed" },
              { value: "99.9%", label: "API uptime (trailing 12 mo)" },
              { value: "<200ms", label: "Median validation latency" },
            ]}
          />
        </Container>
      </Section>

      {/* Features */}
      <Section>
        <Container>
          <div className="max-w-2xl mb-10">
            <Eyebrow>Product</Eyebrow>
            <h2 className="go-h3 mb-3">Identity review tools</h2>
            <p className="text-[15px]" style={{ color: "var(--go-text-secondary)" }}>
              Lookups, queues, and audits for investigation and compliance desks.
            </p>
          </div>
          <FeatureGrid items={FEATURES} />
        </Container>
      </Section>

      {/* Workflow */}
      <Section>
        <Container>
          <div className="max-w-2xl mb-10">
            <Eyebrow>Workflow</Eyebrow>
            <h2 className="go-h3 mb-3">From query to decision</h2>
            <p className="text-[15px]" style={{ color: "var(--go-text-secondary)" }}>
              A short path for analysts, with the controls compliance needs.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-4 md:gap-5">
            {STEPS.map((s) => (
              <div key={s.n} className="go-panel p-5 md:p-6">
                <div className="text-[12px] font-medium mb-3" style={{ color: "var(--go-accent-text)" }}>
                  {s.n}
                </div>
                <h3 className="text-[15px] font-medium mb-1.5" style={{ color: "var(--go-text)" }}>
                  {s.title}
                </h3>
                <p className="text-[14px] leading-relaxed" style={{ color: "var(--go-text-secondary)" }}>
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Why */}
      <Section>
        <Container>
          <div className="max-w-2xl mb-10">
            <Eyebrow>Why GrayOcean</Eyebrow>
            <h2 className="go-h3 mb-3">Built for investigation desks</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 md:gap-10">
            {WHY.map((w) => (
              <div key={w.title}>
                <h3 className="text-[15px] font-medium mb-2" style={{ color: "var(--go-text)" }}>
                  {w.title}
                </h3>
                <p className="text-[14px] leading-relaxed" style={{ color: "var(--go-text-secondary)" }}>
                  {w.body}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Comparison */}
      <Section>
        <Container>
          <div className="max-w-2xl mb-10">
            <Eyebrow>Compare</Eyebrow>
            <h2 className="go-h3 mb-3">GrayOcean vs the usual stack</h2>
            <p className="text-[15px]" style={{ color: "var(--go-text-secondary)" }}>
              Spreadsheets and one-off tools work early on. They struggle with audit trails and higher volume.
            </p>
          </div>
          <div className="go-panel overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[14px] min-w-[560px]">
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--go-border)" }}>
                    <th className="px-5 py-3.5 font-medium" style={{ color: "var(--go-text-muted)" }}>Capability</th>
                    <th className="px-5 py-3.5 font-medium" style={{ color: "var(--go-text)" }}>GrayOcean</th>
                    <th className="px-5 py-3.5 font-medium" style={{ color: "var(--go-text-muted)" }}>Spreadsheets</th>
                    <th className="px-5 py-3.5 font-medium" style={{ color: "var(--go-text-muted)" }}>Ad-hoc tools</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARE.map((row) => (
                    <tr key={row.feature} style={{ borderBottom: "1px solid var(--go-border-subtle)" }}>
                      <td className="px-5 py-3.5" style={{ color: "var(--go-text-secondary)" }}>{row.feature}</td>
                      <td className="px-5 py-3.5"><CellMark value={row.go} /></td>
                      <td className="px-5 py-3.5"><CellMark value={row.sheets} /></td>
                      <td className="px-5 py-3.5"><CellMark value={row.adhoc} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Container>
      </Section>

      {/* Testimonials */}
      <Section>
        <Container>
          <div className="max-w-2xl mb-10">
            <Eyebrow>Customers</Eyebrow>
            <h2 className="go-h3">What teams say</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4 md:gap-5">
            {TESTIMONIALS.map((t) => (
              <blockquote key={t.name} className="go-panel p-5 md:p-6 flex flex-col">
                <p className="text-[14px] leading-relaxed flex-1 mb-5" style={{ color: "var(--go-text-secondary)" }}>
                  “{t.quote}”
                </p>
                <footer>
                  <div className="text-[13px] font-medium" style={{ color: "var(--go-text)" }}>{t.name}</div>
                  <div className="text-[12px] mt-0.5" style={{ color: "var(--go-text-muted)" }}>{t.role}</div>
                </footer>
              </blockquote>
            ))}
          </div>
        </Container>
      </Section>

      {/* FAQ */}
      <Section>
        <Container>
          <div className="grid md:grid-cols-[1fr_1.2fr] gap-10 md:gap-16">
            <div>
              <Eyebrow>FAQ</Eyebrow>
              <h2 className="go-h3 mb-3">Common questions</h2>
              <p className="text-[15px]" style={{ color: "var(--go-text-secondary)" }}>
                Short answers. For deeper detail, see Docs or Contact.
              </p>
            </div>
            <FAQ items={FAQS} />
          </div>
        </Container>
      </Section>

      {/* Pricing preview */}
      <Section>
        <Container>
          <div className="max-w-2xl mb-10">
            <Eyebrow>Pricing</Eyebrow>
            <h2 className="go-h3 mb-3">Simple plans</h2>
            <p className="text-[15px]" style={{ color: "var(--go-text-secondary)" }}>
              Start free. Scale when the desk is ready.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-4 md:gap-5">
            {[
              {
                name: "Free",
                price: "$0",
                blurb: "Evaluate lookups and explore the workspace.",
                points: ["Limited monthly lookups", "SSN + address tools", "Community support"],
              },
              {
                name: "Team",
                price: "$149",
                blurb: "Shared seats for investigation desks.",
                points: ["Higher limits", "Batch analysis", "Email support"],
                highlight: true,
              },
              {
                name: "Enterprise",
                price: "Custom",
                blurb: "Volume, SSO, and dedicated controls.",
                points: ["Custom contracts", "SSO & audit exports", "Priority support"],
              },
            ].map((plan) => (
              <Link
                key={plan.name}
                to="/pricing"
                className="go-panel p-5 md:p-6 block transition-opacity hover:opacity-90"
                style={
                  plan.highlight
                    ? { borderColor: "var(--go-accent-border)", background: "var(--go-bg-elevated)" }
                    : undefined
                }
              >
                <div className="text-[13px] font-medium mb-1" style={{ color: "var(--go-accent-text)" }}>
                  {plan.name}
                </div>
                <div className="text-[28px] font-semibold tracking-tight mb-2" style={{ color: "var(--go-text)" }}>
                  {plan.price}
                  {plan.price !== "Custom" ? (
                    <span className="text-[14px] font-normal" style={{ color: "var(--go-text-muted)" }}>/mo</span>
                  ) : null}
                </div>
                <p className="text-[14px] mb-4" style={{ color: "var(--go-text-secondary)" }}>
                  {plan.blurb}
                </p>
                <ul className="space-y-2">
                  {plan.points.map((p) => (
                    <li key={p} className="flex items-start gap-2 text-[13px]" style={{ color: "var(--go-text-secondary)" }}>
                      <Check size={14} className="mt-0.5 shrink-0" style={{ color: "var(--go-accent)" }} />
                      {p}
                    </li>
                  ))}
                </ul>
              </Link>
            ))}
          </div>
          <p className="mt-6 text-[13px]" style={{ color: "var(--go-text-muted)" }}>
            <Link to="/pricing" className="hover:opacity-80" style={{ color: "var(--go-accent-text)" }}>
              Full pricing & comparison →
            </Link>
          </p>
        </Container>
      </Section>

      {/* Security */}
      <Section>
        <Container>
          <div
            className="go-panel p-6 md:p-10 flex flex-col md:flex-row md:items-center gap-6 md:gap-10"
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{
                background: "var(--go-accent-soft)",
                color: "var(--go-accent-text)",
                border: "1px solid var(--go-accent-border)",
              }}
            >
              <Lock size={18} strokeWidth={1.5} />
            </div>
            <div className="flex-1">
              <h2 className="go-h3 mb-2">Security</h2>
              <p className="text-[15px] leading-relaxed" style={{ color: "var(--go-text-secondary)" }}>
                Encryption in transit, access controls, and retention policies for sensitive identity data.
                See Security and Trust for details.
              </p>
            </div>
            <div className="flex gap-3 shrink-0">
              <SimpleLink to="/security" variant="ghost">Security</SimpleLink>
              <SimpleLink to="/trust">Trust Center</SimpleLink>
            </div>
          </div>
        </Container>
      </Section>

      {/* Final CTA */}
      <CTABand
        title="Start with a lookup"
        subtitle="Create an account or open the workspace and run your first validation."
        primary={<SimpleLink to="/signup">Sign up</SimpleLink>}
        secondary={<SimpleLink to="/SSNLookup" variant="ghost">Open app</SimpleLink>}
      />
    </MarketingShell>
  );
}
