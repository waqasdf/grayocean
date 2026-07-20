import MarketingShell from "@/components/marketing/MarketingShell";
import {
  Section,
  Container,
  PageHero,
} from "@/components/marketing/primitives";

export default function Privacy() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="Legal"
        title="Privacy policy"
        subtitle="Placeholder policy for the GrayOcean marketing site and product. Replace with counsel-approved text before production launch."
      />

      <Section className="!pt-0">
        <Container className="max-w-2xl space-y-6 text-[15px] leading-relaxed" style={{ color: "var(--go-text-secondary)" }}>
          <div>
            <h2 className="text-[15px] font-medium mb-2" style={{ color: "var(--go-text)" }}>
              1. What we collect
            </h2>
            <p>
              Account information (name, email), usage data, and identity query inputs you submit to the service.
              Marketing pages may collect analytics and contact form fields you choose to send.
            </p>
          </div>
          <div>
            <h2 className="text-[15px] font-medium mb-2" style={{ color: "var(--go-text)" }}>
              2. How we use data
            </h2>
            <p>
              To provide and improve the service, secure accounts, communicate about the product, and meet legal obligations.
              We do not sell personal information.
            </p>
          </div>
          <div>
            <h2 className="text-[15px] font-medium mb-2" style={{ color: "var(--go-text)" }}>
              3. Retention
            </h2>
            <p>
              Retention depends on product settings and plan. Enterprise customers may configure stricter policies.
            </p>
          </div>
          <div>
            <h2 className="text-[15px] font-medium mb-2" style={{ color: "var(--go-text)" }}>
              4. Contact
            </h2>
            <p>
              Privacy questions: privacy@grayocean.io
            </p>
          </div>
          <p className="text-[13px]" style={{ color: "var(--go-text-muted)" }}>
            Last updated: July 19, 2026
          </p>
        </Container>
      </Section>
    </MarketingShell>
  );
}
