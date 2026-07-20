import { Link } from "react-router-dom";
import { Search, MapPin, Layers, FileSearch, Code2, ArrowRight } from "lucide-react";
import MarketingShell from "@/components/marketing/MarketingShell";
import ProductPreview from "@/components/marketing/ProductPreview";
import {
  Section,
  Container,
  PageHero,
  FeatureGrid,
  CTABand,
  SimpleLink,
} from "@/components/marketing/primitives";

const MODULES = [
  {
    to: "/product/ssn-lookup",
    icon: Search,
    title: "SSN Lookup",
    body: "Validate format, surface issue-state context, and screen death-record matches.",
  },
  {
    to: "/product/address-intel",
    icon: MapPin,
    title: "Address Intel",
    body: "Normalize and enrich addresses with history your reviewers can cite.",
  },
  {
    to: "/product/batch",
    icon: Layers,
    title: "Batch Analysis",
    body: "Score lists at desk scale and export structured results for queues.",
  },
  {
    to: "/product/skiptrace",
    icon: FileSearch,
    title: "Skiptrace",
    body: "Link people, phones, and places without leaving the workspace.",
  },
  {
    to: "/product/api",
    icon: Code2,
    title: "API",
    body: "Programmatic access with keys, rate limits, and predictable responses.",
  },
];

export default function Product() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="Product"
        title="Identity intelligence in one workspace"
        subtitle="SSN validation, address enrichment, skiptrace, and batch analysis — together for investigation and compliance desks."
        actions={
          <>
            <SimpleLink to="/signup">Sign up</SimpleLink>
            <SimpleLink to="/docs" variant="ghost">Read the docs</SimpleLink>
          </>
        }
      />

      <Section className="!pt-0">
        <Container>
          <ProductPreview />
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="max-w-2xl mb-10">
            <h2 className="go-h3 mb-3">Modules</h2>
            <p className="text-[15px]" style={{ color: "var(--go-text-secondary)" }}>
              Use what you need today. Add API and batch when volume grows.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {MODULES.map((m) => (
              <Link
                key={m.to}
                to={m.to}
                className="go-panel p-5 md:p-6 group transition-opacity hover:opacity-90"
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center mb-4"
                  style={{
                    background: "var(--go-accent-soft)",
                    color: "var(--go-accent-text)",
                    border: "1px solid var(--go-accent-border)",
                  }}
                >
                  <m.icon size={16} strokeWidth={1.5} />
                </div>
                <h3 className="text-[15px] font-medium mb-1.5 flex items-center gap-2" style={{ color: "var(--go-text)" }}>
                  {m.title}
                  <ArrowRight size={14} className="opacity-0 group-hover:opacity-60 transition-opacity" />
                </h3>
                <p className="text-[14px] leading-relaxed" style={{ color: "var(--go-text-secondary)" }}>
                  {m.body}
                </p>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <FeatureGrid
            items={[
              {
                title: "Built for daily review",
                body: "Dense results, keyboard paths, and exports that fit case systems.",
              },
              {
                title: "Shared workspace",
                body: "Seats, roles, and history so the desk stays consistent.",
              },
              {
                title: "Access and retention",
                body: "Controls and audit hooks for regulated workflows.",
              },
            ]}
          />
        </Container>
      </Section>

      <CTABand
        title="See it in the app"
        subtitle="Open the workspace or start with documentation."
        primary={<SimpleLink to="/SSNLookup">Open app</SimpleLink>}
        secondary={<SimpleLink to="/pricing" variant="ghost">View pricing</SimpleLink>}
      />
    </MarketingShell>
  );
}
