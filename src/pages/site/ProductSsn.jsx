import { Search, ShieldCheck, Map, History } from "lucide-react";
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

export default function ProductSsn() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="Product · SSN Lookup"
        title="SSN validation for investigation desks"
        subtitle="Check format, issue-state signals, and death-record screening in one lookup — for investigation and compliance teams."
        actions={
          <>
            <SimpleLink to="/SSNLookup">Open SSN Lookup</SimpleLink>
            <SimpleLink to="/docs/getting-started" variant="ghost">Getting started</SimpleLink>
          </>
        }
      />

      <Section className="!pt-0">
        <Container>
          <FeatureGrid
            items={[
              {
                icon: Search,
                title: "Format & structure",
                body: "Catch invalid patterns early so analysts do not chase dead ends.",
              },
              {
                icon: Map,
                title: "Issue-state context",
                body: "Surface issuance geography and period signals when available.",
              },
              {
                icon: ShieldCheck,
                title: "Death-record screen",
                body: "Flag potential matches so review queues stay accurate.",
              },
              {
                icon: History,
                title: "Query history",
                body: "Keep a trail of who looked up what — for audits and coaching.",
              },
            ]}
          />
        </Container>
      </Section>

      <Section>
        <Container className="max-w-2xl">
          <h2 className="go-h3 mb-4">How teams use it</h2>
          <ul className="space-y-4 text-[15px] leading-relaxed" style={{ color: "var(--go-text-secondary)" }}>
            <li>Intake desks verify identifiers before opening a full case file.</li>
            <li>Compliance reviews spot-check applicant data against known signals.</li>
            <li>Fraud analysts triage queues with a consistent risk score view.</li>
          </ul>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid md:grid-cols-[1fr_1.2fr] gap-10">
            <div>
              <h2 className="go-h3 mb-3">FAQ</h2>
            </div>
            <FAQ
              items={[
                {
                  q: "Is this a credit bureau pull?",
                  a: "No. SSN Lookup focuses on validation and screening signals for operational review, not consumer credit files.",
                },
                {
                  q: "Can we batch SSNs?",
                  a: "Yes. Use Batch Analysis for list scoring, or the API for automated pipelines.",
                },
                {
                  q: "What about retention?",
                  a: "Plans include retention controls. Enterprise can customize policies and networking.",
                },
              ]}
            />
          </div>
        </Container>
      </Section>

      <CTABand
        title="Run your first SSN lookup"
        primary={<SimpleLink to="/SSNLookup">Open app</SimpleLink>}
        secondary={<SimpleLink to="/product" variant="ghost">All products</SimpleLink>}
      />
    </MarketingShell>
  );
}
