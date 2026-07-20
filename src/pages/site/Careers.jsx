import MarketingShell from "@/components/marketing/MarketingShell";
import {
  Section,
  Container,
  PageHero,
  CTABand,
  SimpleLink,
} from "@/components/marketing/primitives";

const ROLES = [
  {
    title: "Senior product engineer",
    loc: "Remote (US)",
    type: "Full-time",
  },
  {
    title: "Customer success, investigations",
    loc: "Remote (US)",
    type: "Full-time",
  },
  {
    title: "Security engineer",
    loc: "Remote (US)",
    type: "Full-time",
  },
];

export default function Careers() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="Careers"
        title="Build for operators"
        subtitle="We are a small team building identity tools for investigation and compliance desks."
      />

      <Section className="!pt-0">
        <Container className="max-w-2xl">
          <h2 className="go-h3 mb-6">Open roles</h2>
          <ul>
            {ROLES.map((r) => (
              <li
                key={r.title}
                className="py-5 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
                style={{ borderColor: "var(--go-border)" }}
              >
                <div>
                  <div className="text-[15px] font-medium" style={{ color: "var(--go-text)" }}>
                    {r.title}
                  </div>
                  <div className="text-[13px] mt-1" style={{ color: "var(--go-text-muted)" }}>
                    {r.loc} · {r.type}
                  </div>
                </div>
                <SimpleLink to="/contact" variant="ghost">Apply</SimpleLink>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-[14px]" style={{ color: "var(--go-text-secondary)" }}>
            Do not see a fit? Send a note via Contact — we keep a light talent pool.
          </p>
        </Container>
      </Section>

      <CTABand
        title="Say hello"
        primary={<SimpleLink to="/contact">Contact</SimpleLink>}
        secondary={<SimpleLink to="/about" variant="ghost">About</SimpleLink>}
      />
    </MarketingShell>
  );
}
