import { Link } from "react-router-dom";
import MarketingShell from "@/components/marketing/MarketingShell";
import {
  Section,
  Container,
  PageHero,
} from "@/components/marketing/primitives";

const ITEMS = [
  {
    title: "Standing up SSN Lookup for a new team",
    href: "/docs/getting-started",
    tag: "Ops",
  },
  {
    title: "CSV mapping for Batch Analysis",
    href: "/docs/guides",
    tag: "Batch",
  },
  {
    title: "Calling the validate endpoint",
    href: "/docs/examples",
    tag: "API",
  },
  {
    title: "Roles and query history",
    href: "/docs/guides",
    tag: "Admin",
  },
];

export default function Guides() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="Guides"
        title="Practical how-tos"
        subtitle="Walkthroughs for desks adopting GrayOcean. Technical reference lives in Docs."
      />

      <Section className="!pt-0">
        <Container className="max-w-2xl">
          <ul>
            {ITEMS.map((item) => (
              <li
                key={item.title}
                className="py-5 border-b flex items-start justify-between gap-4"
                style={{ borderColor: "var(--go-border)" }}
              >
                <div>
                  <Link
                    to={item.href}
                    className="text-[15px] font-medium hover:opacity-80"
                    style={{ color: "var(--go-text)" }}
                  >
                    {item.title}
                  </Link>
                </div>
                <span className="text-[12px] shrink-0" style={{ color: "var(--go-text-muted)" }}>
                  {item.tag}
                </span>
              </li>
            ))}
          </ul>
        </Container>
      </Section>
    </MarketingShell>
  );
}
