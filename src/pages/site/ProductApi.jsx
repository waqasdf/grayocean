import { Code2, KeyRound, Gauge, BookOpen } from "lucide-react";
import MarketingShell from "@/components/marketing/MarketingShell";
import {
  Section,
  Container,
  PageHero,
  FeatureGrid,
  FAQ,
  CTABand,
  SimpleLink,
} from "@/components/marketing/primitives";

export default function ProductApi() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="Product · API"
        title="API for identity lookups"
        subtitle="Call SSN validation, address enrichment, and related endpoints with clear auth, rate limits, and response shapes."
        actions={
          <>
            <SimpleLink to="/docs/api">API reference</SimpleLink>
            <SimpleLink to="/docs/sdk" variant="ghost">SDKs</SimpleLink>
          </>
        }
      />

      <Section className="!pt-0">
        <Container>
          <FeatureGrid
            items={[
              {
                icon: KeyRound,
                title: "API keys & scopes",
                body: "Issue keys per environment. Restrict by workspace and capability.",
              },
              {
                icon: Gauge,
                title: "Predictable limits",
                body: "Rate limits and quotas you can plan capacity around.",
              },
              {
                icon: Code2,
                title: "Stable responses",
                body: "JSON shapes documented for validation, enrichment, and batch jobs.",
              },
              {
                icon: BookOpen,
                title: "Docs & examples",
                body: "Getting started, guides, and copy-paste examples for common flows.",
              },
            ]}
          />
        </Container>
      </Section>

      <Section>
        <Container>
          <div
            className="go-panel p-5 md:p-6 font-mono text-[13px] overflow-x-auto"
            style={{ color: "var(--go-text-secondary)" }}
          >
            <pre className="whitespace-pre">{`curl https://api.grayocean.io/v1/ssn/validate \\
  -H "Authorization: Bearer <key>" \\
  -H "Content-Type: application/json" \\
  -d '{"ssn":"545-23-0000"}'`}</pre>
          </div>
          <p className="mt-4 text-[13px]" style={{ color: "var(--go-text-muted)" }}>
            Illustrative request — see Docs for current paths and fields.
          </p>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid md:grid-cols-[1fr_1.2fr] gap-10">
            <h2 className="go-h3">FAQ</h2>
            <FAQ
              items={[
                {
                  q: "Sandbox available?",
                  a: "Yes. Use test keys in a sandbox workspace before production traffic.",
                },
                {
                  q: "Webhooks?",
                  a: "Batch completion and certain async jobs can notify your endpoint on Team and Enterprise.",
                },
                {
                  q: "Where do I manage keys?",
                  a: "In the app under API settings once your account is provisioned.",
                },
              ]}
            />
          </div>
        </Container>
      </Section>

      <CTABand
        title="Start building"
        primary={<SimpleLink to="/docs/api">Read API docs</SimpleLink>}
        secondary={<SimpleLink to="/signup" variant="ghost">Sign up</SimpleLink>}
      />
    </MarketingShell>
  );
}
