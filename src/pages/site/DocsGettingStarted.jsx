import { Link } from "react-router-dom";
import MarketingShell from "@/components/marketing/MarketingShell";
import {
  Section,
  Container,
  PageHero,
  SimpleLink,
} from "@/components/marketing/primitives";

const STEPS = [
  {
    title: "Create an account",
    body: "Sign up and confirm your email. Free includes enough lookups to evaluate the workspace.",
  },
  {
    title: "Run a single lookup",
    body: "Open SSN Lookup or Address Intel. Enter a test identifier and review the result panels.",
  },
  {
    title: "Invite your team",
    body: "On Team and Enterprise, add seats and assign roles so history stays attributable.",
  },
  {
    title: "Optional: API key",
    body: "Generate a sandbox key and follow the API reference for your first request.",
  },
];

export default function DocsGettingStarted() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="Docs · Getting started"
        title="Your first hour with GrayOcean"
        subtitle="From account creation to a useful lookup, then optional API setup."
        actions={<SimpleLink to="/docs" variant="ghost">All docs</SimpleLink>}
      />

      <Section className="!pt-0">
        <Container className="max-w-2xl">
          <ol className="space-y-8">
            {STEPS.map((s, i) => (
              <li key={s.title} className="flex gap-4">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-[13px] font-medium"
                  style={{
                    background: "var(--go-accent-soft)",
                    color: "var(--go-accent-text)",
                    border: "1px solid var(--go-accent-border)",
                  }}
                >
                  {i + 1}
                </div>
                <div>
                  <h2 className="text-[15px] font-medium mb-1.5" style={{ color: "var(--go-text)" }}>
                    {s.title}
                  </h2>
                  <p className="text-[14px] leading-relaxed" style={{ color: "var(--go-text-secondary)" }}>
                    {s.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-12 pt-8 border-t flex flex-wrap gap-3" style={{ borderColor: "var(--go-border)" }}>
            <Link to="/docs/guides" className="text-[14px]" style={{ color: "var(--go-accent-text)" }}>
              Next: Guides →
            </Link>
            <Link to="/docs/api" className="text-[14px]" style={{ color: "var(--go-text-secondary)" }}>
              API reference
            </Link>
          </div>
        </Container>
      </Section>
    </MarketingShell>
  );
}
