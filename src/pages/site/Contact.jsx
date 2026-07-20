import { useState } from "react";
import MarketingShell from "@/components/marketing/MarketingShell";
import {
  Section,
  Container,
  PageHero,
} from "@/components/marketing/primitives";

export default function Contact() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <MarketingShell>
      <PageHero
        eyebrow="Contact"
        title="Talk to GrayOcean"
        subtitle="Sales, support, or press — send a note. This form is UI-only and does not post to a backend yet."
      />

      <Section className="!pt-0">
        <Container className="max-w-xl">
          {sent ? (
            <div className="go-panel p-6 text-[15px]" style={{ color: "var(--go-text-secondary)" }}>
              Thanks — message captured locally for demo. Wire this form to your inbox or CRM when ready.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-[13px] mb-1.5" style={{ color: "var(--go-text-secondary)" }}>
                  Name
                </label>
                <input
                  required
                  name="name"
                  className="w-full h-11 px-3 rounded-xl border text-[14px] outline-none"
                  style={{
                    background: "var(--go-input-bg)",
                    borderColor: "var(--go-border)",
                    color: "var(--go-text)",
                  }}
                />
              </div>
              <div>
                <label className="block text-[13px] mb-1.5" style={{ color: "var(--go-text-secondary)" }}>
                  Work email
                </label>
                <input
                  required
                  type="email"
                  name="email"
                  className="w-full h-11 px-3 rounded-xl border text-[14px] outline-none"
                  style={{
                    background: "var(--go-input-bg)",
                    borderColor: "var(--go-border)",
                    color: "var(--go-text)",
                  }}
                />
              </div>
              <div>
                <label className="block text-[13px] mb-1.5" style={{ color: "var(--go-text-secondary)" }}>
                  Topic
                </label>
                <select
                  name="topic"
                  className="w-full h-11 px-3 rounded-xl border text-[14px] outline-none"
                  style={{
                    background: "var(--go-input-bg)",
                    borderColor: "var(--go-border)",
                    color: "var(--go-text)",
                  }}
                  defaultValue="sales"
                >
                  <option value="sales">Sales</option>
                  <option value="support">Support</option>
                  <option value="security">Security</option>
                  <option value="press">Press</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-[13px] mb-1.5" style={{ color: "var(--go-text-secondary)" }}>
                  Message
                </label>
                <textarea
                  required
                  name="message"
                  rows={5}
                  className="w-full px-3 py-2.5 rounded-xl border text-[14px] outline-none resize-y"
                  style={{
                    background: "var(--go-input-bg)",
                    borderColor: "var(--go-border)",
                    color: "var(--go-text)",
                  }}
                />
              </div>
              <button type="submit" className="go-pill-btn">
                Send message
              </button>
            </form>
          )}

          <p className="mt-10 text-[13px]" style={{ color: "var(--go-text-muted)" }}>
            Or email{" "}
            <a href="mailto:hello@grayocean.io" style={{ color: "var(--go-accent-text)" }}>
              hello@grayocean.io
            </a>
          </p>
        </Container>
      </Section>
    </MarketingShell>
  );
}
