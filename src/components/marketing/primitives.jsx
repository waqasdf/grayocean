import { Link } from "react-router-dom";

export function Section({ children, className = "", id }) {
  return (
    <section id={id} className={`py-16 md:py-24 ${className}`}>
      {children}
    </section>
  );
}

export function Container({ children, className = "" }) {
  return (
    <div className={`max-w-[1120px] mx-auto px-5 md:px-8 ${className}`}>
      {children}
    </div>
  );
}

export function Eyebrow({ children }) {
  return (
    <p className="go-kicker mb-3" style={{ color: "var(--go-accent-text)" }}>
      {children}
    </p>
  );
}

export function PageHero({ eyebrow, title, subtitle, actions }) {
  return (
    <Section className="!pt-16 md:!pt-24 !pb-12 md:!pb-16">
      <Container className="max-w-3xl">
        {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
        <h1 className="go-h2 mb-4">{title}</h1>
        {subtitle ? (
          <p className="text-[16px] leading-relaxed" style={{ color: "var(--go-text-secondary)" }}>
            {subtitle}
          </p>
        ) : null}
        {actions ? <div className="flex flex-wrap gap-3 mt-8">{actions}</div> : null}
      </Container>
    </Section>
  );
}

export function FeatureGrid({ items }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
      {items.map((item) => (
        <div
          key={item.title}
          className="go-panel p-5 md:p-6"
        >
          {item.icon ? (
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center mb-4"
              style={{
                background: "var(--go-accent-soft)",
                color: "var(--go-accent-text)",
                border: "1px solid var(--go-accent-border)",
              }}
            >
              <item.icon size={16} strokeWidth={1.5} />
            </div>
          ) : null}
          <h3 className="text-[15px] font-medium mb-1.5" style={{ color: "var(--go-text)" }}>
            {item.title}
          </h3>
          <p className="text-[14px] leading-relaxed" style={{ color: "var(--go-text-secondary)" }}>
            {item.body}
          </p>
        </div>
      ))}
    </div>
  );
}

export function FAQ({ items }) {
  return (
    <div className="max-w-2xl space-y-0">
      {items.map((item) => (
        <details
          key={item.q}
          className="group border-b py-4"
          style={{ borderColor: "var(--go-border)" }}
        >
          <summary
            className="cursor-pointer list-none flex items-center justify-between gap-4 text-[15px] font-medium"
            style={{ color: "var(--go-text)" }}
          >
            {item.q}
            <span className="text-[var(--go-text-muted)] group-open:rotate-45 transition-transform duration-150 text-lg leading-none">
              +
            </span>
          </summary>
          <p className="mt-3 text-[14px] leading-relaxed" style={{ color: "var(--go-text-secondary)" }}>
            {item.a}
          </p>
        </details>
      ))}
    </div>
  );
}

export function CTABand({ title, subtitle, primary, secondary }) {
  return (
    <Section>
      <Container>
        <div
          className="rounded-2xl border px-6 py-10 md:px-12 md:py-14 text-center"
          style={{
            background: "var(--go-bg-card)",
            borderColor: "var(--go-border)",
          }}
        >
          <h2 className="go-h3 mb-3">{title}</h2>
          {subtitle ? (
            <p className="text-[15px] max-w-lg mx-auto mb-8" style={{ color: "var(--go-text-secondary)" }}>
              {subtitle}
            </p>
          ) : null}
          <div className="flex flex-wrap justify-center gap-3">
            {primary}
            {secondary}
          </div>
        </div>
      </Container>
    </Section>
  );
}

export function SimpleLink({ to, children, variant = "primary" }) {
  if (variant === "ghost") {
    return (
      <Link to={to} className="go-btn-ghost">
        {children}
      </Link>
    );
  }
  return (
    <Link to={to} className="go-pill-btn">
      {children}
    </Link>
  );
}
