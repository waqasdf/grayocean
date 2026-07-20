import { Link } from "react-router-dom";

export function Section({ children, className = "", id }) {
  return (
    <section id={id} className={`py-16 md:py-24 lg:py-28 ${className}`}>
      {children}
    </section>
  );
}

export function Container({ children, className = "", narrow = false, wide = false }) {
  const width = narrow ? "go-container-narrow" : wide ? "go-container-wide" : "";
  return (
    <div className={`go-container ${width} ${className}`}>
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

export function PageHero({ eyebrow, title, subtitle, actions, centered = false }) {
  return (
    <Section className="!pt-16 md:!pt-24 lg:!pt-28 !pb-12 md:!pb-16">
      <Container narrow className={centered ? "text-center" : ""}>
        {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
        <h1 className="go-h1 mb-4">{title}</h1>
        {subtitle ? (
          <p className="go-lead max-w-2xl mx-auto">{subtitle}</p>
        ) : null}
        {actions ? (
          <div className={`flex flex-wrap gap-3 mt-8 ${centered ? "justify-center" : ""}`}>
            {actions}
          </div>
        ) : null}
      </Container>
    </Section>
  );
}

export function FeatureGrid({ items }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
      {items.map((item) => (
        <div key={item.title} className="go-panel p-5 md:p-6">
          {item.icon ? (
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center mb-4"
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
          <p className="go-body">{item.body}</p>
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
          style={{ borderColor: "var(--go-border-subtle)" }}
        >
          <summary
            className="cursor-pointer list-none flex items-center justify-between gap-4 text-[15px] font-medium min-h-[44px]"
            style={{ color: "var(--go-text)" }}
          >
            {item.q}
            <span
              className="text-[var(--go-text-muted)] group-open:rotate-45 transition-transform duration-150 text-lg leading-none shrink-0"
              aria-hidden="true"
            >
              +
            </span>
          </summary>
          <p className="mt-2 pb-2 go-body">{item.a}</p>
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
          className="rounded-[var(--go-radius-lg)] border px-6 py-10 md:px-12 md:py-14 text-center"
          style={{
            background: "var(--go-bg-card)",
            borderColor: "var(--go-border)",
          }}
        >
          <h2 className="go-h3 mb-3">{title}</h2>
          {subtitle ? (
            <p className="go-lead max-w-lg mx-auto mb-8">{subtitle}</p>
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

export function MetricRow({ items }) {
  return (
    <div className="grid sm:grid-cols-3 gap-6 md:gap-8">
      {items.map((m) => (
        <div key={m.label} className="text-center sm:text-left">
          <div className="go-metric mb-1">{m.value}</div>
          <div className="go-body">{m.label}</div>
        </div>
      ))}
    </div>
  );
}
