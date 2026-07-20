import { Layers, Upload, BarChart3, FileOutput } from "lucide-react";
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

export default function ProductBatch() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="Product · Batch Analysis"
        title="Score lists at desk scale"
        subtitle="Upload CSVs, run validation and enrichment, and export results your queue can use."
        actions={
          <>
            <SimpleLink to="/BatchAnalysis">Open Batch</SimpleLink>
            <SimpleLink to="/docs/examples" variant="ghost">Examples</SimpleLink>
          </>
        }
      />

      <Section className="!pt-0">
        <Container>
          <FeatureGrid
            items={[
              {
                icon: Upload,
                title: "Simple upload",
                body: "Drop a CSV, map columns, and start a run without custom scripts.",
              },
              {
                icon: Layers,
                title: "Consistent scoring",
                body: "Same signals as single lookup — applied across the whole list.",
              },
              {
                icon: BarChart3,
                title: "Exception focus",
                body: "See distributions and prioritize high-risk or incomplete rows.",
              },
              {
                icon: FileOutput,
                title: "Structured export",
                body: "Download results ready for review tools and case systems.",
              },
            ]}
          />
        </Container>
      </Section>

      <Section>
        <Container className="max-w-2xl">
          <h2 className="go-h3 mb-4">When to use Batch</h2>
          <ul className="space-y-3 text-[15px] leading-relaxed" style={{ color: "var(--go-text-secondary)" }}>
            <li>Morning queues with hundreds of applicant or lead rows.</li>
            <li>Periodic re-screens for compliance programs.</li>
            <li>Migrations where you need a baseline before API automation.</li>
          </ul>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid md:grid-cols-[1fr_1.2fr] gap-10">
            <h2 className="go-h3">FAQ</h2>
            <FAQ
              items={[
                {
                  q: "What file formats are supported?",
                  a: "CSV is the primary format. Column mapping covers common SSN and address field names.",
                },
                {
                  q: "Limits?",
                  a: "Free and Team include monthly row caps. Enterprise supports higher volume and dedicated capacity.",
                },
                {
                  q: "Prefer API over upload?",
                  a: "Use the Batch endpoints or stream single lookups — Docs cover both patterns.",
                },
              ]}
            />
          </div>
        </Container>
      </Section>

      <CTABand
        title="Process your next list"
        primary={<SimpleLink to="/BatchAnalysis">Open Batch</SimpleLink>}
        secondary={<SimpleLink to="/pricing" variant="ghost">See plan limits</SimpleLink>}
      />
    </MarketingShell>
  );
}
