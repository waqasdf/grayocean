import { Link } from "react-router-dom";
import { Search, BookOpen, Compass, Code2, Lightbulb, Box } from "lucide-react";
import MarketingShell from "@/components/marketing/MarketingShell";
import {
  Section,
  Container,
  PageHero,
} from "@/components/marketing/primitives";

const CATEGORIES = [
  {
    to: "/docs/getting-started",
    icon: BookOpen,
    title: "Getting started",
    body: "Create an account, run your first lookup, invite a teammate.",
  },
  {
    to: "/docs/guides",
    icon: Compass,
    title: "Guides",
    body: "Workflows for batch, skiptrace, and desk setup.",
  },
  {
    to: "/docs/api",
    icon: Code2,
    title: "API reference",
    body: "Endpoints, auth, errors, and rate limits.",
  },
  {
    to: "/docs/examples",
    icon: Lightbulb,
    title: "Examples",
    body: "Copy-paste patterns for common integrations.",
  },
  {
    to: "/docs/sdk",
    icon: Box,
    title: "SDKs",
    body: "Client libraries and installation notes.",
  },
];

export default function Docs() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="Documentation"
        title="Build with GrayOcean"
        subtitle="Guides, API reference, and examples for the workspace and API."
      />

      <Section className="!pt-0">
        <Container>
          <label className="block max-w-xl mx-auto mb-12">
            <span className="sr-only">Search docs</span>
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2"
                style={{ color: "var(--go-text-muted)" }}
              />
              <input
                type="search"
                placeholder="Search documentation…"
                className="w-full h-11 pl-10 pr-4 rounded-xl border text-[14px] outline-none"
                style={{
                  background: "var(--go-input-bg)",
                  borderColor: "var(--go-border)",
                  color: "var(--go-text)",
                }}
              />
            </div>
            <p className="mt-2 text-[12px] text-center" style={{ color: "var(--go-text-muted)" }}>
              Search UI only — wire to your docs index later.
            </p>
          </label>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {CATEGORIES.map((c) => (
              <Link
                key={c.to}
                to={c.to}
                className="go-panel p-5 md:p-6 transition-opacity hover:opacity-90"
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center mb-4"
                  style={{
                    background: "var(--go-accent-soft)",
                    color: "var(--go-accent-text)",
                    border: "1px solid var(--go-accent-border)",
                  }}
                >
                  <c.icon size={16} strokeWidth={1.5} />
                </div>
                <h2 className="text-[15px] font-medium mb-1.5" style={{ color: "var(--go-text)" }}>
                  {c.title}
                </h2>
                <p className="text-[14px] leading-relaxed" style={{ color: "var(--go-text-secondary)" }}>
                  {c.body}
                </p>
              </Link>
            ))}
          </div>
        </Container>
      </Section>
    </MarketingShell>
  );
}
