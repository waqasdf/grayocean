import { Scale, FileCheck, Lock } from "lucide-react";
import MarketingShell from "@/components/marketing/MarketingShell";
import {
  Section,
  Container,
  PageHero,
  FeatureGrid,
  CTABand,
  SimpleLink,
} from "@/components/marketing/primitives";

export default function SolutionsCompliance() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="Solutions · Compliance"
        title="Identity checks with controls"
        subtitle="Consistent validation and enrichment, plus retention and access patterns compliance programs expect."
        actions={
          <>
            <SimpleLink to="/security">Security</SimpleLink>
            <SimpleLink to="/trust" variant="ghost">Trust Center</SimpleLink>
          </>
        }
      />

      <Section className="!pt-0">
        <Container>
          <FeatureGrid
            items={[
              {
                icon: FileCheck,
                title: "Consistent process",
                body: "Same lookup standards across analysts. Fewer ad-hoc consumer sites.",
              },
              {
                icon: Scale,
                title: "Audit-friendly history",
                body: "Know who queried what, when — exportable for reviews.",
              },
              {
                icon: Lock,
                title: "Access & retention",
                body: "Roles, workspace controls, and retention options for sensitive data.",
              },
            ]}
          />
        </Container>
      </Section>

      <Section>
        <Container className="max-w-2xl">
          <h2 className="go-h3 mb-4">Where compliance teams start</h2>
          <p className="text-[15px] leading-relaxed mb-4" style={{ color: "var(--go-text-secondary)" }}>
            Most programs begin with SSN and Address Intel for spot checks, then add Batch for periodic re-screens.
            Enterprise adds SSO and custom retention when policy requires it.
          </p>
        </Container>
      </Section>

      <CTABand
        title="Align GrayOcean with your program"
        primary={<SimpleLink to="/contact">Contact sales</SimpleLink>}
        secondary={<SimpleLink to="/docs" variant="ghost">Documentation</SimpleLink>}
      />
    </MarketingShell>
  );
}
