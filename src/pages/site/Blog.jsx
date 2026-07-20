import { Link } from "react-router-dom";
import MarketingShell from "@/components/marketing/MarketingShell";
import {
  Section,
  Container,
  PageHero,
} from "@/components/marketing/primitives";

export const POSTS = [
  {
    slug: "desk-setup-checklist",
    title: "A checklist for standing up an identity desk",
    date: "Jun 12, 2026",
    excerpt: "Seats, roles, naming, and the first week of lookups that actually stick.",
  },
  {
    slug: "batch-without-spreadsheet-debt",
    title: "Batch analysis for CSV queues",
    date: "May 28, 2026",
    excerpt: "How teams map CSVs once and reuse columns week to week.",
  },
  {
    slug: "api-rate-limits-explained",
    title: "API rate limits, explained plainly",
    date: "May 4, 2026",
    excerpt: "What 429s mean, how to back off, and when to talk to us about capacity.",
  },
  {
    slug: "audit-trails-that-help",
    title: "Audit trails that help humans",
    date: "Apr 18, 2026",
    excerpt: "Query history is only useful if supervisors can read it in under a minute.",
  },
  {
    slug: "ssn-validation-basics",
    title: "SSN validation basics for operators",
    date: "Mar 30, 2026",
    excerpt: "Format, issue-state context, and death-record screens — explained plainly.",
  },
];

export default function Blog() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="Blog"
        title="Notes from the GrayOcean team"
        subtitle="Short posts on desks, APIs, and identity workflows."
      />

      <Section className="!pt-0">
        <Container className="max-w-2xl">
          <ul className="space-y-0">
            {POSTS.map((p) => (
              <li
                key={p.slug}
                className="py-6 border-b"
                style={{ borderColor: "var(--go-border)" }}
              >
                <p className="text-[12px] mb-2" style={{ color: "var(--go-text-muted)" }}>
                  {p.date}
                </p>
                <Link
                  to={`/blog/${p.slug}`}
                  className="text-[17px] font-medium hover:opacity-80 transition-opacity"
                  style={{ color: "var(--go-text)" }}
                >
                  {p.title}
                </Link>
                <p className="mt-2 text-[14px] leading-relaxed" style={{ color: "var(--go-text-secondary)" }}>
                  {p.excerpt}
                </p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>
    </MarketingShell>
  );
}
