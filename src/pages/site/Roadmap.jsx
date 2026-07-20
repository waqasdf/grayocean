import MarketingShell from "@/components/marketing/MarketingShell";
import {
  Section,
  Container,
  PageHero,
  SimpleLink,
} from "@/components/marketing/primitives";

const COLUMNS = [
  {
    title: "Now",
    items: [
      "Bulk invite improvements for Team workspaces",
      "Address history depth on Enterprise",
      "Webhook retries with signed payloads",
    ],
  },
  {
    title: "Next",
    items: [
      "Saved views for batch exceptions",
      "Stronger CSV template library",
      "SOC 2 report self-serve download in Trust",
    ],
  },
  {
    title: "Later",
    items: [
      "Additional regional address coverage",
      "Mobile review queue",
      "Partner marketplace listings",
    ],
  },
];

export default function Roadmap() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="Roadmap"
        title="Where we are headed"
        subtitle="A public sketch of priorities. Dates are directional, not commitments. Tell us what your desk needs."
        actions={<SimpleLink to="/contact" variant="ghost">Share feedback</SimpleLink>}
      />

      <Section className="!pt-0">
        <Container>
          <div className="grid md:grid-cols-3 gap-4 md:gap-5">
            {COLUMNS.map((col) => (
              <div key={col.title} className="go-panel p-5 md:p-6">
                <h2
                  className="text-[12px] font-medium uppercase tracking-[0.06em] mb-4"
                  style={{ color: "var(--go-accent-text)" }}
                >
                  {col.title}
                </h2>
                <ul className="space-y-3">
                  {col.items.map((item) => (
                    <li key={item} className="text-[14px] leading-relaxed" style={{ color: "var(--go-text-secondary)" }}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      </Section>
    </MarketingShell>
  );
}
