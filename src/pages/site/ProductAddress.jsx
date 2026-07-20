import { MapPin, Home, Link2, Download } from "lucide-react";
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

export default function ProductAddress() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="Product · Address Intel"
        title="Address enrichment for review"
        subtitle="Normalize, verify, and enrich addresses so investigators and KYC teams share a citable view."
        actions={
          <>
            <SimpleLink to="/AddressLookup">Open Address Intel</SimpleLink>
            <SimpleLink to="/docs/guides" variant="ghost">Guides</SimpleLink>
          </>
        }
      />

      <Section className="!pt-0">
        <Container>
          <FeatureGrid
            items={[
              {
                icon: MapPin,
                title: "Normalize & verify",
                body: "Standardize messy inputs and flag incomplete or invalid records.",
              },
              {
                icon: Home,
                title: "Residence context",
                body: "Surface occupancy and history signals relevant to identity review.",
              },
              {
                icon: Link2,
                title: "Connect to people",
                body: "Pair with SSN and skiptrace when the case needs a fuller picture.",
              },
              {
                icon: Download,
                title: "Export-ready",
                body: "Pull structured fields into case tools and spreadsheets.",
              },
            ]}
          />
        </Container>
      </Section>

      <Section>
        <Container className="max-w-2xl">
          <h2 className="go-h3 mb-4">Built for desk workflows</h2>
          <p className="text-[15px] leading-relaxed mb-4" style={{ color: "var(--go-text-secondary)" }}>
            Address Intel is for people who paste messy strings all day.
            Results emphasize validity, consistency, and history.
          </p>
          <p className="text-[15px] leading-relaxed" style={{ color: "var(--go-text-secondary)" }}>
            Combine with Batch Analysis when onboarding lists, or call the API from your existing intake forms.
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
                  q: "Do you geocode for maps?",
                  a: "Focus is verification and enrichment for identity work. Mapping overlays are not the primary surface.",
                },
                {
                  q: "International coverage?",
                  a: "US-first today. Talk to sales if you need additional regions on Enterprise.",
                },
              ]}
            />
          </div>
        </Container>
      </Section>

      <CTABand
        title="Enrich your next address"
        primary={<SimpleLink to="/AddressLookup">Open app</SimpleLink>}
        secondary={<SimpleLink to="/product" variant="ghost">All products</SimpleLink>}
      />
    </MarketingShell>
  );
}
