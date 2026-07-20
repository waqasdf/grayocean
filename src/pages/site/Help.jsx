import { Link } from "react-router-dom";
import MarketingShell from "@/components/marketing/MarketingShell";
import {
  Section,
  Container,
  PageHero,
  FAQ,
  SimpleLink,
} from "@/components/marketing/primitives";

const TOPICS = [
  { title: "Account & billing", href: "/pricing" },
  { title: "Getting started", href: "/docs/getting-started" },
  { title: "API & keys", href: "/docs/api" },
  { title: "Security & trust", href: "/security" },
];

export default function Help() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="Help Center"
        title="How can we help?"
        subtitle="Short answers and links. For account-specific issues, contact support from the app or the form below."
        actions={<SimpleLink to="/contact">Contact</SimpleLink>}
      />

      <Section className="!pt-0">
        <Container>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-14">
            {TOPICS.map((t) => (
              <Link
                key={t.title}
                to={t.href}
                className="go-panel p-4 text-[14px] font-medium transition-opacity hover:opacity-90"
                style={{ color: "var(--go-text)" }}
              >
                {t.title}
              </Link>
            ))}
          </div>

          <div className="grid md:grid-cols-[1fr_1.2fr] gap-10">
            <h2 className="go-h3">Popular questions</h2>
            <FAQ
              items={[
                {
                  q: "I cannot sign in",
                  a: "Use password reset from the login page. If SSO is enabled, sign in through your IdP. Contact support if invites expired.",
                },
                {
                  q: "Where do I find API keys?",
                  a: "In the app under API settings (Team and Enterprise). Sandbox keys are labeled separately from live keys.",
                },
                {
                  q: "How do I upgrade from Free?",
                  a: "Open Pricing in the marketing site or billing in-app, choose Team, and confirm seats.",
                },
                {
                  q: "Something looks wrong in a lookup",
                  a: "Capture the query id from history and contact support with approximate time — we can investigate.",
                },
              ]}
            />
          </div>
        </Container>
      </Section>
    </MarketingShell>
  );
}
