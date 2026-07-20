import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { GrayOceanWordmark, LogoMark } from "@/components/GrayOceanLogo";
import ThemeToggle from "@/components/ThemeToggle";

const PRODUCT_LINKS = [
  { to: "/product", label: "Overview" },
  { to: "/product/ssn-lookup", label: "SSN Lookup" },
  { to: "/product/address-intel", label: "Address Intel" },
  { to: "/product/batch", label: "Batch Analysis" },
  { to: "/product/skiptrace", label: "Skiptrace" },
  { to: "/product/api", label: "API" },
];

const SOLUTION_LINKS = [
  { to: "/solutions", label: "All solutions" },
  { to: "/solutions/investigations", label: "Investigations" },
  { to: "/solutions/compliance", label: "Compliance" },
  { to: "/solutions/lending", label: "Lending & KYC" },
  { to: "/solutions/fraud", label: "Fraud review" },
];

const RESOURCE_LINKS = [
  { to: "/docs", label: "Documentation" },
  { to: "/guides", label: "Guides" },
  { to: "/blog", label: "Blog" },
  { to: "/changelog", label: "Changelog" },
  { to: "/roadmap", label: "Roadmap" },
  { to: "/status", label: "Status" },
  { to: "/community", label: "Community" },
  { to: "/help", label: "Help Center" },
];

const COMPANY_LINKS = [
  { to: "/about", label: "About" },
  { to: "/careers", label: "Careers" },
  { to: "/contact", label: "Contact" },
  { to: "/security", label: "Security" },
  { to: "/trust", label: "Trust Center" },
];

function DesktopDropdown({ label, links }) {
  return (
    <div className="relative group">
      <button
        type="button"
        className="inline-flex items-center gap-1 h-9 px-2.5 text-[13px] font-medium rounded-lg transition-colors hover:bg-[var(--go-bg-hover)]"
        style={{ color: "var(--go-text-secondary)" }}
      >
        {label}
        <ChevronDown size={14} strokeWidth={1.5} className="opacity-60" />
      </button>
      <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100 absolute top-full left-0 pt-2 transition-opacity duration-150 z-50">
        <div
          className="min-w-[200px] py-1.5 rounded-xl border"
          style={{
            background: "var(--go-bg-elevated)",
            borderColor: "var(--go-border)",
            boxShadow: "var(--go-shadow-elevated)",
          }}
        >
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="block px-3.5 py-2 text-[13px] transition-colors hover:bg-[var(--go-bg-hover)] focus-visible:outline-none focus-visible:bg-[var(--go-bg-hover)]"
              style={{ color: "var(--go-text-secondary)" }}
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function FooterCol({ title, links }) {
  return (
    <div>
      <h3 className="go-kicker mb-3">{title}</h3>
      <ul className="space-y-2">
        {links.map((l) => (
          <li key={l.to}>
            <Link
              to={l.to}
              className="text-[13px] transition-colors hover:text-[color:var(--go-text)]"
              style={{ color: "var(--go-text-secondary)" }}
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function MarketingShell({ children }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="go-landing go-grain min-h-[100dvh] flex flex-col relative">
      <a href="#main-content" className="go-skip-link">
        Skip to content
      </a>

      <header className={`go-site-header ${scrolled ? "is-scrolled" : ""}`}>
        <div className="go-container !max-w-[1200px] h-full flex items-center justify-between gap-4">
          <div className="flex items-center gap-6 min-w-0">
            <Link to="/" className="inline-flex items-center gap-2.5 shrink-0" aria-label="GrayOcean home">
              <LogoMark size={18} />
              <GrayOceanWordmark size="sm" />
            </Link>

            <nav className="hidden lg:flex items-center gap-0.5" aria-label="Primary">
              <DesktopDropdown label="Product" links={PRODUCT_LINKS} />
              <DesktopDropdown label="Solutions" links={SOLUTION_LINKS} />
              <NavLink
                to="/pricing"
                className="h-9 px-2.5 inline-flex items-center text-[13px] font-medium rounded-lg hover:bg-[var(--go-bg-hover)]"
                style={({ isActive }) => ({
                  color: isActive ? "var(--go-text)" : "var(--go-text-secondary)",
                })}
              >
                Pricing
              </NavLink>
              <DesktopDropdown label="Resources" links={RESOURCE_LINKS} />
              <DesktopDropdown label="Company" links={COMPANY_LINKS} />
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              to="/login"
              className="hidden sm:inline-flex h-9 px-3 items-center text-[13px] font-medium rounded-lg hover:bg-[var(--go-bg-hover)] transition-colors"
              style={{ color: "var(--go-text-secondary)" }}
            >
              Log in
            </Link>
            <Link to="/signup" className="hidden sm:inline-flex go-pill-btn !min-h-9 !h-9 !px-3.5 !text-[13px]">
              Sign up
            </Link>
            <Link
              to="/SSNLookup"
              className="hidden md:inline-flex go-btn-ghost !min-h-9 !h-9 !px-3.5 !text-[13px]"
            >
              Open app
            </Link>
            <button
              type="button"
              className="lg:hidden p-2 rounded-lg hover:bg-[var(--go-bg-hover)] min-h-[44px] min-w-[44px] flex items-center justify-center"
              style={{ color: "var(--go-text-secondary)" }}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X size={18} strokeWidth={1.5} /> : <Menu size={18} strokeWidth={1.5} />}
            </button>
          </div>
        </div>

        {open && (
          <>
            <div
              className="lg:hidden fixed inset-0 z-40 bg-[var(--go-bg-overlay)]"
              onClick={() => setOpen(false)}
              aria-hidden="true"
            />
            <div
              className="lg:hidden fixed inset-y-0 right-0 z-50 w-[min(100%,320px)] border-l flex flex-col"
              style={{
                background: "var(--go-bg-sidebar)",
                borderColor: "var(--go-border-subtle)",
              }}
              role="dialog"
              aria-label="Mobile navigation"
            >
              <div
                className="flex items-center justify-between px-4 h-16 border-b"
                style={{ borderColor: "var(--go-border-subtle)" }}
              >
                <GrayOceanWordmark size="sm" />
                <button
                  onClick={() => setOpen(false)}
                  className="p-2 rounded-lg hover:bg-[var(--go-bg-hover)] min-h-[44px] min-w-[44px] flex items-center justify-center"
                  style={{ color: "var(--go-text-secondary)" }}
                  aria-label="Close menu"
                >
                  <X size={18} strokeWidth={1.5} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
                {[
                  ["Product", PRODUCT_LINKS],
                  ["Solutions", SOLUTION_LINKS],
                  ["Resources", RESOURCE_LINKS],
                  ["Company", COMPANY_LINKS],
                ].map(([title, links]) => (
                  <div key={title}>
                    <p className="go-kicker mb-2">{title}</p>
                    <div className="space-y-0.5">
                      {links.map((l) => (
                        <Link
                          key={l.to}
                          to={l.to}
                          onClick={() => setOpen(false)}
                          className="block py-2.5 text-[14px] min-h-[44px] flex items-center"
                          style={{
                            color:
                              location.pathname === l.to
                                ? "var(--go-text)"
                                : "var(--go-text-secondary)",
                          }}
                        >
                          {l.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
                <Link
                  to="/pricing"
                  onClick={() => setOpen(false)}
                  className="block py-2.5 text-[14px]"
                  style={{ color: "var(--go-text-secondary)" }}
                >
                  Pricing
                </Link>
                <div className="flex flex-col gap-2 pt-4 border-t" style={{ borderColor: "var(--go-border-subtle)" }}>
                  <Link to="/login" onClick={() => setOpen(false)} className="go-btn-ghost !text-[13px] w-full">
                    Log in
                  </Link>
                  <Link to="/signup" onClick={() => setOpen(false)} className="go-pill-btn !text-[13px] w-full">
                    Sign up
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}
      </header>

      <main id="main-content" className="flex-1 relative z-[2]">
        {children}
      </main>

      <footer
        className="relative z-[2] border-t mt-auto"
        style={{ borderColor: "var(--go-border-subtle)", background: "var(--go-bg)" }}
      >
        <div className="go-container !max-w-[1200px] py-14 md:py-16">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-6 mb-12">
            <div className="col-span-2 md:col-span-1">
              <Link to="/" className="inline-flex items-center gap-2 mb-3">
                <LogoMark size={16} />
                <GrayOceanWordmark size="sm" />
              </Link>
              <p className="go-small max-w-[220px]">
                Identity intelligence for investigation and compliance teams.
              </p>
            </div>
            <FooterCol title="Product" links={PRODUCT_LINKS.slice(0, 5)} />
            <FooterCol title="Solutions" links={SOLUTION_LINKS} />
            <FooterCol title="Resources" links={RESOURCE_LINKS.slice(0, 5)} />
            <FooterCol
              title="Company"
              links={[
                ...COMPANY_LINKS,
                { to: "/privacy", label: "Privacy" },
                { to: "/terms", label: "Terms" },
              ]}
            />
          </div>
          <div
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-6 border-t go-small"
            style={{ borderColor: "var(--go-border-subtle)" }}
          >
            <p>© {new Date().getFullYear()} GrayOcean Inc.</p>
            <div className="flex flex-wrap gap-4">
              <Link to="/privacy" className="hover:text-[color:var(--go-text)]">Privacy</Link>
              <Link to="/terms" className="hover:text-[color:var(--go-text)]">Terms</Link>
              <Link to="/security" className="hover:text-[color:var(--go-text)]">Security</Link>
              <Link to="/status" className="hover:text-[color:var(--go-text)]">Status</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
