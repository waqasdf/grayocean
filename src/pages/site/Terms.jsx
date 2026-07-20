import MarketingShell from "@/components/marketing/MarketingShell";
import {
  Section,
  Container,
  PageHero,
} from "@/components/marketing/primitives";

export default function Terms() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="Legal"
        title="Terms of service"
        subtitle="Placeholder terms for GrayOcean. Replace with counsel-approved terms before production launch."
      />

      <Section className="!pt-0">
        <Container className="max-w-2xl space-y-6 text-[15px] leading-relaxed" style={{ color: "var(--go-text-secondary)" }}>
          <div>
            <h2 className="text-[15px] font-medium mb-2" style={{ color: "var(--go-text)" }}>
              1. Service
            </h2>
            <p>
              GrayOcean provides identity intelligence tools and APIs. Access requires an account and compliance with these terms and applicable law.
            </p>
          </div>
          <div>
            <h2 className="text-[15px] font-medium mb-2" style={{ color: "var(--go-text)" }}>
              2. Acceptable use
            </h2>
            <p>
              You may only use the service for lawful purposes and with a permissible purpose for any consumer data accessed.
              You must not attempt to bypass security, scrape beyond allowed APIs, or misuse identity data.
            </p>
          </div>
          <div>
            <h2 className="text-[15px] font-medium mb-2" style={{ color: "var(--go-text)" }}>
              3. Accounts & billing
            </h2>
            <p>
              You are responsible for activity under your account. Paid plans renew per the pricing terms until canceled.
            </p>
          </div>
          <div>
            <h2 className="text-[15px] font-medium mb-2" style={{ color: "var(--go-text)" }}>
              4. Contact
            </h2>
            <p>
              Legal: legal@grayocean.io
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
