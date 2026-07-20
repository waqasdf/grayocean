import MarketingShell from "@/components/marketing/MarketingShell";
import {
  Section,
  Container,
  PageHero,
} from "@/components/marketing/primitives";

const SERVICES = [
  { name: "App (app.grayocean.io)", status: "Operational" },
  { name: "API", status: "Operational" },
  { name: "Batch processing", status: "Operational" },
  { name: "Auth & sessions", status: "Operational" },
  { name: "Status page", status: "Operational" },
];

export default function Status() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="Status"
        title="System status"
        subtitle="Placeholder status page. Wire to your monitoring provider when ready."
      />

      <Section className="!pt-0">
        <Container className="max-w-2xl">
          <div
            className="go-panel p-4 mb-6 flex items-center gap-3"
            style={{
              background: "var(--go-success-fill)",
              borderColor: "var(--go-success-border)",
            }}
          >
            <span className="w-2 h-2 rounded-full" style={{ background: "var(--go-success)" }} />
            <span className="text-[14px]" style={{ color: "var(--go-text-secondary)" }}>
              All systems operational
            </span>
          </div>

          <ul className="go-panel divide-y overflow-hidden" style={{ borderColor: "var(--go-border)" }}>
            {SERVICES.map((s) => (
              <li
                key={s.name}
                className="flex items-center justify-between px-5 py-4 text-[14px]"
                style={{ borderColor: "var(--go-border-subtle)" }}
              >
                <span style={{ color: "var(--go-text)" }}>{s.name}</span>
                <span style={{ color: "var(--go-success)" }}>{s.status}</span>
              </li>
            ))}
          </ul>

          <p className="mt-8 text-[13px]" style={{ color: "var(--go-text-muted)" }}>
            No recent incidents to display.
          </p>
        </Container>
      </Section>
    </MarketingShell>
  );
}
