import { useState } from "react";
import { Check } from "lucide-react";
import MarketingShell from "@/components/marketing/MarketingShell";
import {
  Section,
  Container,
  PageHero,
  FAQ,
  CTABand,
  SimpleLink,
} from "@/components/marketing/primitives";

const PLANS = [
  {
    name: "Free",
    monthly: 0,
    annual: 0,
    blurb: "Evaluate the workspace and core lookups.",
    cta: { to: "/signup", label: "Sign up" },
    features: [
      "Limited monthly lookups",
      "SSN Lookup & Address Intel",
      "1 seat",
      "Community support",
    ],
  },
  {
    name: "Team",
    monthly: 149,
    annual: 129,
    blurb: "Shared seats for growing desks.",
    highlight: true,
    cta: { to: "/signup", label: "Start Team" },
    features: [
      "Higher monthly limits",
      "Batch Analysis",
      "Skiptrace",
      "Up to 10 seats",
      "Email support",
      "API access",
    ],
  },
  {
    name: "Enterprise",
    monthly: null,
    annual: null,
    blurb: "Volume, SSO, and dedicated controls.",
    cta: { to: "/contact", label: "Contact sales" },
    features: [
      "Custom volume & SLAs",
      "SSO / SAML",
      "Audit exports",
      "Custom retention",
      "Priority support",
      "Private networking options",
    ],
  },
];

const COMPARISON = [
  { feature: "SSN Lookup", free: true, team: true, ent: true },
  { feature: "Address Intel", free: true, team: true, ent: true },
  { feature: "Skiptrace", free: false, team: true, ent: true },
  { feature: "Batch Analysis", free: false, team: true, ent: true },
  { feature: "API access", free: false, team: true, ent: true },
  { feature: "Seats", free: "1", team: "Up to 10", ent: "Custom" },
  { feature: "SSO", free: false, team: false, ent: true },
  { feature: "Custom retention", free: false, team: false, ent: true },
  { feature: "Support", free: "Community", team: "Email", ent: "Priority" },
];

const FAQS = [
  {
    q: "Is this the same as in-app billing?",
    a: "This page describes marketing plans for GrayOcean. In-app /Pricing may reflect your account’s live entitlements and usage.",
  },
  {
    q: "Can we switch between monthly and annual?",
    a: "Yes. Annual Team billing is discounted. Enterprise contracts are negotiated separately.",
  },
  {
    q: "What happens if we exceed limits?",
    a: "We notify workspace admins. Free pauses until reset; Team can upgrade or purchase capacity; Enterprise has contracted overages.",
  },
  {
    q: "Do you offer education or nonprofit pricing?",
    a: "Contact sales with your use case — we evaluate qualified programs case by case.",
  },
];

function Cell({ value }) {
  if (value === true) return <Check size={16} style={{ color: "var(--go-accent)" }} />;
  if (value === false) return <span style={{ color: "var(--go-text-muted)" }}>—</span>;
  return <span style={{ color: "var(--go-text-secondary)" }}>{value}</span>;
}

export default function Pricing() {
  const [annual, setAnnual] = useState(true);

  return (
    <MarketingShell>
      <PageHero
        eyebrow="Pricing"
        title="Plans for identity work"
        subtitle="Start free. Move to Team when you need seats and higher limits. Enterprise when policy and volume require it."
      />

      <Section className="!pt-0">
        <Container>
          <div className="flex justify-center mb-10">
            <div
              className="inline-flex p-1 rounded-xl border text-[13px]"
              style={{ borderColor: "var(--go-border)", background: "var(--go-bg-panel)" }}
              role="group"
              aria-label="Billing period"
            >
              <button
                type="button"
                onClick={() => setAnnual(false)}
                className="px-4 py-2 rounded-lg font-medium transition-colors"
                style={{
                  color: !annual ? "var(--go-text)" : "var(--go-text-muted)",
                  background: !annual ? "var(--go-bg-elevated)" : "transparent",
                }}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setAnnual(true)}
                className="px-4 py-2 rounded-lg font-medium transition-colors"
                style={{
                  color: annual ? "var(--go-text)" : "var(--go-text-muted)",
                  background: annual ? "var(--go-bg-elevated)" : "transparent",
                }}
              >
                Annual <span style={{ color: "var(--go-accent-text)" }}>−14%</span>
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 md:gap-5">
            {PLANS.map((plan) => {
              const price =
                plan.monthly === null
                  ? "Custom"
                  : plan.monthly === 0
                    ? "$0"
                    : `$${annual ? plan.annual : plan.monthly}`;
              return (
                <div
                  key={plan.name}
                  className="go-panel p-6 flex flex-col"
                  style={
                    plan.highlight
                      ? { borderColor: "var(--go-accent-border)", background: "var(--go-bg-elevated)" }
                      : undefined
                  }
                >
                  <div className="text-[13px] font-medium mb-1" style={{ color: "var(--go-accent-text)" }}>
                    {plan.name}
                  </div>
                  <div className="text-[32px] font-semibold tracking-tight mb-1" style={{ color: "var(--go-text)" }}>
                    {price}
                    {price !== "Custom" && price !== "$0" ? (
                      <span className="text-[14px] font-normal" style={{ color: "var(--go-text-muted)" }}>
                        /mo
                      </span>
                    ) : null}
                  </div>
                  {price !== "Custom" && price !== "$0" && annual ? (
                    <p className="text-[12px] mb-3" style={{ color: "var(--go-text-muted)" }}>
                      Billed annually
                    </p>
                  ) : (
                    <div className="mb-3 h-[18px]" />
                  )}
                  <p className="text-[14px] mb-6" style={{ color: "var(--go-text-secondary)" }}>
                    {plan.blurb}
                  </p>
                  <ul className="space-y-2.5 mb-8 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className="flex gap-2 text-[13px]" style={{ color: "var(--go-text-secondary)" }}>
                        <Check size={14} className="mt-0.5 shrink-0" style={{ color: "var(--go-accent)" }} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <SimpleLink to={plan.cta.to} variant={plan.highlight ? "primary" : "ghost"}>
                    {plan.cta.label}
                  </SimpleLink>
                </div>
              );
            })}
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <h2 className="go-h3 mb-8">Feature comparison</h2>
          <div className="go-panel overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[14px] min-w-[520px]">
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--go-border)" }}>
                    <th className="px-5 py-3.5 font-medium" style={{ color: "var(--go-text-muted)" }}>Feature</th>
                    <th className="px-5 py-3.5 font-medium" style={{ color: "var(--go-text)" }}>Free</th>
                    <th className="px-5 py-3.5 font-medium" style={{ color: "var(--go-text)" }}>Team</th>
                    <th className="px-5 py-3.5 font-medium" style={{ color: "var(--go-text)" }}>Enterprise</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON.map((row) => (
                    <tr key={row.feature} style={{ borderBottom: "1px solid var(--go-border-subtle)" }}>
                      <td className="px-5 py-3.5" style={{ color: "var(--go-text-secondary)" }}>{row.feature}</td>
                      <td className="px-5 py-3.5"><Cell value={row.free} /></td>
                      <td className="px-5 py-3.5"><Cell value={row.team} /></td>
                      <td className="px-5 py-3.5"><Cell value={row.ent} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid md:grid-cols-[1fr_1.2fr] gap-10">
            <h2 className="go-h3">FAQ</h2>
            <FAQ items={FAQS} />
          </div>
        </Container>
      </Section>

      <CTABand
        title="Questions about volume or SSO?"
        subtitle="We will map a plan to your desk size and policy needs."
        primary={<SimpleLink to="/contact">Contact sales</SimpleLink>}
        secondary={<SimpleLink to="/signup" variant="ghost">Sign up free</SimpleLink>}
      />
    </MarketingShell>
  );
}
