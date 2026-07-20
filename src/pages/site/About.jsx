import MarketingShell from "@/components/marketing/MarketingShell";
import {
  Section,
  Container,
  PageHero,
  CTABand,
  SimpleLink,
} from "@/components/marketing/primitives";

export default function About() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="About"
        title="Identity intelligence for desks"
        subtitle="GrayOcean builds tools for investigation, compliance, lending, and fraud teams who need reliable identity signals."
      />

      <Section className="!pt-0">
        <Container className="max-w-2xl space-y-5">
          <p className="text-[15px] leading-relaxed" style={{ color: "var(--go-text-secondary)" }}>
            Desks still stitch together spreadsheets, one-off lookup sites, and half-documented APIs.
            We started GrayOcean to put SSN validation, address intelligence, skiptrace, and batch analysis
            in one workspace — with an API when you are ready to automate.
          </p>
          <p className="text-[15px] leading-relaxed" style={{ color: "var(--go-text-secondary)" }}>
            We focus on dense UI, clear responses, honest pricing, and security that matches
            the sensitivity of the data.
          </p>
          <p className="text-[15px] leading-relaxed" style={{ color: "var(--go-text-secondary)" }}>
            Based in the United States. Building for operators first.
          </p>
        </Container>
      </Section>

      <CTABand
        title="Work with us"
        primary={<SimpleLink to="/careers">Careers</SimpleLink>}
        secondary={<SimpleLink to="/contact" variant="ghost">Contact</SimpleLink>}
      />
    </MarketingShell>
  );
}
