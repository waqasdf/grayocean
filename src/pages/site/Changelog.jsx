import MarketingShell from "@/components/marketing/MarketingShell";
import {
  Section,
  Container,
  PageHero,
} from "@/components/marketing/primitives";

const ENTRIES = [
  {
    version: "0.9.2",
    date: "Jul 10, 2026",
    items: [
      "Improved SSN result layout density on narrow screens.",
      "Batch export includes issue-state fields when present.",
      "Docs: clarified API error codes for invalid payloads.",
    ],
  },
  {
    version: "0.9.1",
    date: "Jun 22, 2026",
    items: [
      "Skiptrace export columns stabilized for case systems.",
      "Team plan seat invites no longer require a page refresh.",
    ],
  },
  {
    version: "0.9.0",
    date: "Jun 1, 2026",
    items: [
      "Public marketing site shell and pricing page.",
      "Sandbox API keys for new Team workspaces.",
      "Address Intel normalization improvements for PO boxes.",
    ],
  },
];

export default function Changelog() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="Changelog"
        title="What shipped"
        subtitle="Product updates, fixes, and docs changes — newest first."
      />

      <Section className="!pt-0">
        <Container className="max-w-2xl space-y-10">
          {ENTRIES.map((e) => (
            <article key={e.version}>
              <div className="flex items-baseline gap-3 mb-3">
                <h2 className="text-[15px] font-medium" style={{ color: "var(--go-text)" }}>
                  {e.version}
                </h2>
                <span className="text-[13px]" style={{ color: "var(--go-text-muted)" }}>
                  {e.date}
                </span>
              </div>
              <ul className="space-y-2">
                {e.items.map((item) => (
                  <li
                    key={item}
                    className="text-[14px] leading-relaxed flex gap-2.5"
                    style={{ color: "var(--go-text-secondary)" }}
                  >
                    <span
                      className="mt-[0.45em] w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ background: "var(--go-border-strong)" }}
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </Container>
      </Section>
    </MarketingShell>
  );
}
