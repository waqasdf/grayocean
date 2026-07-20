import { Link } from "react-router-dom";
import MarketingShell from "@/components/marketing/MarketingShell";
import {
  Section,
  Container,
  PageHero,
  SimpleLink,
} from "@/components/marketing/primitives";

const DOCS = [
  { name: "Security overview", status: "Available", href: "/security" },
  { name: "Privacy policy", status: "Available", href: "/privacy" },
  { name: "Terms of service", status: "Available", href: "/terms" },
  { name: "SOC 2 Type II report", status: "On request", href: "/contact" },
  { name: "Penetration test summary", status: "On request", href: "/contact" },
  { name: "Subprocessor list", status: "On request", href: "/contact" },
];

export default function Trust() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="Trust Center"
        title="Trust & compliance resources"
        subtitle="Public documents and requestable artifacts for security and procurement reviews."
        actions={<SimpleLink to="/contact">Request materials</SimpleLink>}
      />

      <Section className="!pt-0">
        <Container className="max-w-2xl">
          <ul className="go-panel overflow-hidden divide-y" style={{ borderColor: "var(--go-border)" }}>
            {DOCS.map((d) => (
              <li
                key={d.name}
                className="flex items-center justify-between gap-4 px-5 py-4"
                style={{ borderColor: "var(--go-border-subtle)" }}
              >
                <Link to={d.href} className="text-[14px] font-medium hover:opacity-80" style={{ color: "var(--go-text)" }}>
                  {d.name}
                </Link>
                <span className="text-[12px] shrink-0" style={{ color: "var(--go-text-muted)" }}>
                  {d.status}
                </span>
              </li>
            ))}
          </ul>
        </Container>
      </Section>
    </MarketingShell>
  );
}
