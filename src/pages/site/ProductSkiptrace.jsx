import { FileSearch, Phone, UserRound, GitBranch } from "lucide-react";
import MarketingShell from "@/components/marketing/MarketingShell";
import {
  Section,
  Container,
  PageHero,
  FeatureGrid,
  FAQ,
  CTABand,
  SimpleLink,
} from "@/components/marketing/primitives";

export default function ProductSkiptrace() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="Product · Skiptrace"
        title="Connect people, phones, and places"
        subtitle="Run Skiptrace in the same GrayOcean workspace as your other identity lookups."
        actions={
          <>
            <SimpleLink to="/Skiptrace">Open Skiptrace</SimpleLink>
            <SimpleLink to="/docs/guides" variant="ghost">Workflow guides</SimpleLink>
          </>
        }
      />

      <Section className="!pt-0">
        <Container>
          <FeatureGrid
            items={[
              {
                icon: UserRound,
                title: "Name & identity links",
                body: "Start from a name or known identifier and expand related contacts carefully.",
              },
              {
                icon: Phone,
                title: "Phone associations",
                body: "Surface phone connections that matter for outreach and verification.",
              },
              {
                icon: FileSearch,
                title: "Location trails",
                body: "Tie addresses to people without losing the audit context.",
              },
              {
                icon: GitBranch,
                title: "Case-friendly output",
                body: "Results structured for notes, exports, and handoffs.",
              },
            ]}
          />
        </Container>
      </Section>

      <Section>
        <Container className="max-w-2xl">
          <h2 className="go-h3 mb-4">Responsible use</h2>
          <p className="text-[15px] leading-relaxed" style={{ color: "var(--go-text-secondary)" }}>
            Skiptrace is intended for lawful investigation, compliance, and fraud review.
            Teams should follow their policy on permissible purpose and data handling.
            See Trust and Terms for how GrayOcean approaches access and use.
          </p>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid md:grid-cols-[1fr_1.2fr] gap-10">
            <h2 className="go-h3">FAQ</h2>
            <FAQ
              items={[
                {
                  q: "Is this a public people-search site?",
                  a: "No. Skiptrace is a workspace module for authorized teams with account controls and history.",
                },
                {
                  q: "Can results feed other modules?",
                  a: "Yes. Continue into Address Intel or SSN Lookup when the case requires it.",
                },
              ]}
            />
          </div>
        </Container>
      </Section>

      <CTABand
        title="Open Skiptrace"
        primary={<SimpleLink to="/Skiptrace">Open app</SimpleLink>}
        secondary={<SimpleLink to="/product" variant="ghost">All products</SimpleLink>}
      />
    </MarketingShell>
  );
}
