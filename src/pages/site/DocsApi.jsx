import MarketingShell from "@/components/marketing/MarketingShell";
import {
  Section,
  Container,
  PageHero,
  SimpleLink,
} from "@/components/marketing/primitives";

const ENDPOINTS = [
  { method: "POST", path: "/v1/ssn/validate", desc: "Validate an SSN and return screening signals." },
  { method: "POST", path: "/v1/address/enrich", desc: "Normalize and enrich an address." },
  { method: "POST", path: "/v1/skiptrace", desc: "Run a skiptrace query." },
  { method: "POST", path: "/v1/batch", desc: "Create a batch job from uploaded rows." },
  { method: "GET", path: "/v1/batch/{id}", desc: "Fetch batch job status and results." },
];

export default function DocsApi() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="Docs · API"
        title="API reference"
        subtitle="Illustrative endpoints for GrayOcean identity intelligence. Confirm paths in your environment before use."
        actions={
          <>
            <SimpleLink to="/docs/examples">Examples</SimpleLink>
            <SimpleLink to="/docs" variant="ghost">All docs</SimpleLink>
          </>
        }
      />

      <Section className="!pt-0">
        <Container className="max-w-3xl">
          <div className="go-panel p-5 md:p-6 mb-8">
            <h2 className="text-[15px] font-medium mb-2" style={{ color: "var(--go-text)" }}>
              Authentication
            </h2>
            <p className="text-[14px] leading-relaxed mb-3" style={{ color: "var(--go-text-secondary)" }}>
              Send <code className="text-[13px]">Authorization: Bearer &lt;api_key&gt;</code> on every request.
              Use sandbox keys for development.
            </p>
            <p className="text-[13px]" style={{ color: "var(--go-text-muted)" }}>
              Base URL (illustrative): <code>https://api.grayocean.io</code>
            </p>
          </div>

          <h2 className="go-h3 mb-4">Endpoints</h2>
          <div className="space-y-3">
            {ENDPOINTS.map((e) => (
              <div key={e.path} className="go-panel p-4 md:p-5 flex flex-col sm:flex-row sm:items-start gap-3">
                <span
                  className="text-[11px] font-semibold uppercase tracking-wide px-2 py-1 rounded-md shrink-0 w-fit"
                  style={{
                    background: "var(--go-accent-soft)",
                    color: "var(--go-accent-text)",
                    border: "1px solid var(--go-accent-border)",
                  }}
                >
                  {e.method}
                </span>
                <div>
                  <code className="text-[13px]" style={{ color: "var(--go-text)" }}>{e.path}</code>
                  <p className="text-[14px] mt-1" style={{ color: "var(--go-text-secondary)" }}>{e.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>
    </MarketingShell>
  );
}
