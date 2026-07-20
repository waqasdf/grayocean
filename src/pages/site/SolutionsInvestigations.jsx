import { Search, Clock, Share2 } from "lucide-react";
import MarketingShell from "@/components/marketing/MarketingShell";
import {
  Section,
  Container,
  PageHero,
  FeatureGrid,
  CTABand,
  SimpleLink,
} from "@/components/marketing/primitives";

export default function SolutionsInvestigations() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="Solutions · Investigations"
        title="Built for investigation desks"
        subtitle="Validate identifiers, enrich context, and run skiptrace with a clear audit trail."
        actions={
          <>
            <SimpleLink to="/signup">Start free</SimpleLink>
            <SimpleLink to="/product/ssn-lookup" variant="ghost">SSN Lookup</SimpleLink>
          </>
        }
      />

      <Section className="!pt-0">
        <Container>
          <FeatureGrid
            items={[
              {
                icon: Search,
                title: "One workspace",
                body: "SSN, address, and skiptrace side by side — less tool-switching mid-case.",
              },
              {
                icon: Clock,
                title: "Faster triage",
                body: "Clear signals up front. Spend time on judgment, not formatting.",
              },
              {
                icon: Share2,
                title: "Clean handoffs",
                body: "Exports and history that supervisors and partners can follow.",
              },
            ]}
          />
        </Container>
      </Section>

      <Section>
        <Container className="max-w-2xl">
          <h2 className="go-h3 mb-4">Typical workflow</h2>
          <ol className="space-y-4 text-[15px] leading-relaxed list-decimal list-inside" style={{ color: "var(--go-text-secondary)" }}>
            <li>Intake verifies SSN and address before opening the full file.</li>
            <li>Analysts expand with skiptrace when contact trails go cold.</li>
            <li>Leads export a structured packet for case systems.</li>
          </ol>
        </Container>
      </Section>

      <CTABand
        title="Equip your investigation team"
        primary={<SimpleLink to="/signup">Sign up</SimpleLink>}
        secondary={<SimpleLink to="/contact" variant="ghost">Talk to sales</SimpleLink>}
      />
    </MarketingShell>
  );
}
