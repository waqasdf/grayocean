import { Lock, KeyRound, Server, Eye } from "lucide-react";
import MarketingShell from "@/components/marketing/MarketingShell";
import {
  Section,
  Container,
  PageHero,
  FeatureGrid,
  CTABand,
  SimpleLink,
} from "@/components/marketing/primitives";

export default function Security() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="Security"
        title="Security practices"
        subtitle="Identity data needs careful handling. How GrayOcean approaches encryption, access, and operations — summary only; contact us for questionnaires."
        actions={
          <>
            <SimpleLink to="/trust">Trust Center</SimpleLink>
            <SimpleLink to="/contact" variant="ghost">Security inquiry</SimpleLink>
          </>
        }
      />

      <Section className="!pt-0">
        <Container>
          <FeatureGrid
            items={[
              {
                icon: Lock,
                title: "Encryption",
                body: "TLS in transit. Encryption at rest for primary datastores.",
              },
              {
                icon: KeyRound,
                title: "Access control",
                body: "Workspace roles, API key scopes, and SSO on Enterprise.",
              },
              {
                icon: Server,
                title: "Infrastructure",
                body: "Hardened cloud environments with logging and least-privilege ops access.",
              },
              {
                icon: Eye,
                title: "Visibility",
                body: "Query history and audit exports for Team and Enterprise programs.",
              },
            ]}
          />
        </Container>
      </Section>

      <Section>
        <Container className="max-w-2xl">
          <h2 className="go-h3 mb-4">Responsible disclosure</h2>
          <p className="text-[15px] leading-relaxed" style={{ color: "var(--go-text-secondary)" }}>
            If you find a vulnerability, email security@grayocean.io with steps to reproduce.
            Please give us reasonable time to respond before public disclosure.
          </p>
        </Container>
      </Section>

      <CTABand
        title="Need a security packet?"
        primary={<SimpleLink to="/trust">Trust Center</SimpleLink>}
        secondary={<SimpleLink to="/contact" variant="ghost">Contact</SimpleLink>}
      />
    </MarketingShell>
  );
}
