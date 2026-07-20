import { Landmark, UserCheck, Layers } from "lucide-react";
import MarketingShell from "@/components/marketing/MarketingShell";
import {
  Section,
  Container,
  PageHero,
  FeatureGrid,
  CTABand,
  SimpleLink,
} from "@/components/marketing/primitives";

export default function SolutionsLending() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="Solutions · Lending & KYC"
        title="Identity checks for onboarding queues"
        subtitle="Validate applicants and enrich addresses without adding another vendor to your stack."
        actions={
          <>
            <SimpleLink to="/signup">Start free</SimpleLink>
            <SimpleLink to="/product/api" variant="ghost">API overview</SimpleLink>
          </>
        }
      />

      <Section className="!pt-0">
        <Container>
          <FeatureGrid
            items={[
              {
                icon: UserCheck,
                title: "Applicant checks",
                body: "SSN and address validation that fits KYC and underwriting intake.",
              },
              {
                icon: Layers,
                title: "Batch onboarding",
                body: "Screen lists when volume spikes — same signals as single lookup.",
              },
              {
                icon: Landmark,
                title: "API into LOS",
                body: "Wire results into loan origination and CRM without manual re-keying.",
              },
            ]}
          />
        </Container>
      </Section>

      <Section>
        <Container className="max-w-2xl">
          <h2 className="go-h3 mb-4">Built for throughput</h2>
          <p className="text-[15px] leading-relaxed" style={{ color: "var(--go-text-secondary)" }}>
            Lending teams need predictable latency and clear failures.
            GrayOcean returns structured fields you can map into existing decisioning rules.
          </p>
        </Container>
      </Section>

      <CTABand
        title="Fit GrayOcean into onboarding"
        primary={<SimpleLink to="/contact">Talk to sales</SimpleLink>}
        secondary={<SimpleLink to="/pricing" variant="ghost">Pricing</SimpleLink>}
      />
    </MarketingShell>
  );
}
