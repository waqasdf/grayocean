import MarketingShell from "@/components/marketing/MarketingShell";
import {
  Section,
  Container,
  PageHero,
  FeatureGrid,
  CTABand,
  SimpleLink,
} from "@/components/marketing/primitives";
import { MessageSquare, BookOpen, Megaphone } from "lucide-react";

export default function Community() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="Community"
        title="Operators comparing notes"
        subtitle="A place for GrayOcean users to share desk patterns, ask questions, and follow product updates."
        actions={
          <>
            <SimpleLink to="/Forum">Open forum</SimpleLink>
            <SimpleLink to="/blog" variant="ghost">Blog</SimpleLink>
          </>
        }
      />

      <Section className="!pt-0">
        <Container>
          <FeatureGrid
            items={[
              {
                icon: MessageSquare,
                title: "Forum",
                body: "Ask workflow questions and share how your desk runs lookups and batch jobs.",
              },
              {
                icon: BookOpen,
                title: "Docs & guides",
                body: "Start with documentation before posting — many answers live there already.",
              },
              {
                icon: Megaphone,
                title: "Changelog",
                body: "Follow releases so your team knows when exports or API shapes change.",
              },
            ]}
          />
        </Container>
      </Section>

      <CTABand
        title="Need private help?"
        subtitle="Team and Enterprise customers can reach support directly."
        primary={<SimpleLink to="/help">Help Center</SimpleLink>}
        secondary={<SimpleLink to="/contact" variant="ghost">Contact</SimpleLink>}
      />
    </MarketingShell>
  );
}
