import { ShieldAlert, GitCompare, Radar } from "lucide-react";
import MarketingShell from "@/components/marketing/MarketingShell";
import {
  Section,
  Container,
  PageHero,
  FeatureGrid,
  CTABand,
  SimpleLink,
} from "@/components/marketing/primitives";

export default function SolutionsFraud() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="Solutions · Fraud review"
        title="Triage with shared identity signals"
        subtitle="Give fraud analysts a consistent view across SSN, address, and skiptrace so queues move and exceptions get attention."
        actions={
          <>
            <SimpleLink to="/signup">Sign up</SimpleLink>
            <SimpleLink to="/product/batch" variant="ghost">Batch Analysis</SimpleLink>
          </>
        }
      />

      <Section className="!pt-0">
        <Container>
          <FeatureGrid
            items={[
              {
                icon: Radar,
                title: "Fast first pass",
                body: "Validate identifiers and flag mismatches before deep investigation.",
              },
              {
                icon: GitCompare,
                title: "Cross-module context",
                body: "Move from SSN to address to skiptrace without losing case context.",
              },
              {
                icon: ShieldAlert,
                title: "Queue-friendly exports",
                body: "Push structured results into review tools and ticketing systems.",
              },
            ]}
          />
        </Container>
      </Section>

      <Section>
        <Container className="max-w-2xl">
          <h2 className="go-h3 mb-4">Pair with your rules engine</h2>
          <p className="text-[15px] leading-relaxed" style={{ color: "var(--go-text-secondary)" }}>
            GrayOcean does not replace your fraud platform. It supplies identity signals
            your rules and analysts can use — via UI, batch, or API.
          </p>
        </Container>
      </Section>

      <CTABand
        title="Speed up fraud review"
        primary={<SimpleLink to="/SSNLookup">Open app</SimpleLink>}
        secondary={<SimpleLink to="/contact" variant="ghost">Contact sales</SimpleLink>}
      />
    </MarketingShell>
  );
}
