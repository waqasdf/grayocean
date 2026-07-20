import MarketingShell from "@/components/marketing/MarketingShell";
import {
  Section,
  Container,
  PageHero,
  SimpleLink,
} from "@/components/marketing/primitives";

const EXAMPLES = [
  {
    title: "Validate an SSN",
    lang: "curl",
    code: `curl https://api.grayocean.io/v1/ssn/validate \\
  -H "Authorization: Bearer $GO_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"ssn":"545-23-0000"}'`,
  },
  {
    title: "Enrich an address",
    lang: "curl",
    code: `curl https://api.grayocean.io/v1/address/enrich \\
  -H "Authorization: Bearer $GO_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"line1":"1 Market St","city":"San Francisco","state":"CA","postal":"94105"}'`,
  },
  {
    title: "Poll a batch job",
    lang: "curl",
    code: `curl https://api.grayocean.io/v1/batch/bat_123 \\
  -H "Authorization: Bearer $GO_KEY"`,
  },
];

export default function DocsExamples() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="Docs · Examples"
        title="Examples"
        subtitle="Copy-paste starters. Replace keys and payloads with your sandbox values."
        actions={<SimpleLink to="/docs/api" variant="ghost">API reference</SimpleLink>}
      />

      <Section className="!pt-0">
        <Container className="max-w-3xl space-y-6">
          {EXAMPLES.map((ex) => (
            <div key={ex.title}>
              <h2 className="text-[15px] font-medium mb-3" style={{ color: "var(--go-text)" }}>
                {ex.title}
              </h2>
              <pre
                className="go-panel p-4 md:p-5 overflow-x-auto text-[12px] md:text-[13px] font-mono leading-relaxed"
                style={{ color: "var(--go-text-secondary)" }}
              >
                {ex.code}
              </pre>
            </div>
          ))}
        </Container>
      </Section>
    </MarketingShell>
  );
}
