import MarketingShell from "@/components/marketing/MarketingShell";
import {
  Section,
  Container,
  PageHero,
  SimpleLink,
} from "@/components/marketing/primitives";

const SDKS = [
  {
    name: "Node.js",
    install: "npm install @grayocean/sdk",
    note: "TypeScript types included. Works in Node 18+.",
  },
  {
    name: "Python",
    install: "pip install grayocean",
    note: "Async client available. Python 3.10+.",
  },
  {
    name: "Go",
    install: "go get github.com/grayocean/go-sdk",
    note: "Idiomatic client for server-side services.",
  },
];

export default function DocsSdk() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="Docs · SDKs"
        title="Client libraries"
        subtitle="Official SDKs wrap auth, retries, and response parsing. Versions below are illustrative placeholders."
        actions={
          <>
            <SimpleLink to="/docs/examples">Examples</SimpleLink>
            <SimpleLink to="/docs" variant="ghost">All docs</SimpleLink>
          </>
        }
      />

      <Section className="!pt-0">
        <Container className="max-w-2xl space-y-4">
          {SDKS.map((s) => (
            <div key={s.name} className="go-panel p-5 md:p-6">
              <h2 className="text-[15px] font-medium mb-2" style={{ color: "var(--go-text)" }}>
                {s.name}
              </h2>
              <pre
                className="text-[13px] font-mono px-3 py-2 rounded-lg mb-3"
                style={{ background: "var(--go-bg)", color: "var(--go-text-secondary)" }}
              >
                {s.install}
              </pre>
              <p className="text-[14px]" style={{ color: "var(--go-text-secondary)" }}>
                {s.note}
              </p>
            </div>
          ))}
        </Container>
      </Section>
    </MarketingShell>
  );
}
