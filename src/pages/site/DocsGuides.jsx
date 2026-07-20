import { Link } from "react-router-dom";
import MarketingShell from "@/components/marketing/MarketingShell";
import {
  Section,
  Container,
  PageHero,
  SimpleLink,
} from "@/components/marketing/primitives";

const GUIDES = [
  {
    title: "Setting up a shared desk",
    body: "Seats, roles, and naming conventions so query history stays readable.",
  },
  {
    title: "Batch CSV mapping",
    body: "How to map common column names and handle partial rows.",
  },
  {
    title: "Skiptrace handoff checklist",
    body: "What to capture before exporting to a case system.",
  },
  {
    title: "From UI to API",
    body: "Mirror a successful UI lookup in your first API call.",
  },
];

export default function DocsGuides() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="Docs · Guides"
        title="Workflow guides"
        subtitle="Practical write-ups for desks adopting GrayOcean."
        actions={<SimpleLink to="/docs" variant="ghost">All docs</SimpleLink>}
      />

      <Section className="!pt-0">
        <Container className="max-w-2xl space-y-0">
          {GUIDES.map((g) => (
            <article
              key={g.title}
              className="py-5 border-b"
              style={{ borderColor: "var(--go-border)" }}
            >
              <h2 className="text-[15px] font-medium mb-1.5" style={{ color: "var(--go-text)" }}>
                {g.title}
              </h2>
              <p className="text-[14px] leading-relaxed" style={{ color: "var(--go-text-secondary)" }}>
                {g.body}
              </p>
            </article>
          ))}
          <p className="pt-8 text-[13px]" style={{ color: "var(--go-text-muted)" }}>
            Prefer narrative posts? See the{" "}
            <Link to="/guides" style={{ color: "var(--go-accent-text)" }}>Guides</Link> section and{" "}
            <Link to="/blog" style={{ color: "var(--go-accent-text)" }}>Blog</Link>.
          </p>
        </Container>
      </Section>
    </MarketingShell>
  );
}
