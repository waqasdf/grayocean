import { Link } from "react-router-dom";
import { Search, Scale, Landmark, ShieldAlert, ArrowRight } from "lucide-react";
import MarketingShell from "@/components/marketing/MarketingShell";
import {
  Section,
  Container,
  PageHero,
  CTABand,
  SimpleLink,
} from "@/components/marketing/primitives";

const SOLUTIONS = [
  {
    to: "/solutions/investigations",
    icon: Search,
    title: "Investigations",
    body: "Faster lookups, cleaner handoffs, and a trail your supervisors can review.",
  },
  {
    to: "/solutions/compliance",
    icon: Scale,
    title: "Compliance",
    body: "Consistent validation and enrichment with retention and access controls.",
  },
  {
    to: "/solutions/lending",
    icon: Landmark,
    title: "Lending & KYC",
    body: "Identity checks that fit onboarding queues.",
  },
  {
    to: "/solutions/fraud",
    icon: ShieldAlert,
    title: "Fraud review",
    body: "Triage queues with shared signals across SSN, address, and skiptrace.",
  },
];

export default function Solutions() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="Solutions"
        title="Built for investigation desks"
        subtitle="GrayOcean fits investigation, compliance, lending, and fraud workflows — one identity workspace instead of a patchwork of tools."
        actions={
          <>
            <SimpleLink to="/signup">Sign up</SimpleLink>
            <SimpleLink to="/contact" variant="ghost">Talk to sales</SimpleLink>
          </>
        }
      />

      <Section className="!pt-0">
        <Container>
          <div className="grid sm:grid-cols-2 gap-4 md:gap-5">
            {SOLUTIONS.map((s) => (
              <Link
                key={s.to}
                to={s.to}
                className="go-panel p-6 md:p-8 group transition-opacity hover:opacity-90"
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center mb-5"
                  style={{
                    background: "var(--go-accent-soft)",
                    color: "var(--go-accent-text)",
                    border: "1px solid var(--go-accent-border)",
                  }}
                >
                  <s.icon size={18} strokeWidth={1.5} />
                </div>
                <h2 className="text-[17px] font-medium mb-2 flex items-center gap-2" style={{ color: "var(--go-text)" }}>
                  {s.title}
                  <ArrowRight size={14} className="opacity-0 group-hover:opacity-60 transition-opacity" />
                </h2>
                <p className="text-[14px] leading-relaxed" style={{ color: "var(--go-text-secondary)" }}>
                  {s.body}
                </p>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      <CTABand
        title="Not sure which fit?"
        subtitle="Describe your desk and we will suggest modules and a plan."
        primary={<SimpleLink to="/contact">Contact us</SimpleLink>}
        secondary={<SimpleLink to="/product" variant="ghost">Explore product</SimpleLink>}
      />
    </MarketingShell>
  );
}
