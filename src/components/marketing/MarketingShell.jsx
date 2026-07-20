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
        className="inline-flex items-center gap-1 h-9 px-2.5 text-[13px] font-medium rounded-lg transition-colors"
        style={{ color: "var(--go-text-secondary)" }}
      >
        {label}
        <ChevronDown size={14} strokeWidth={1.5} className="opacity-60" />
      </button>
      <div
        className="invisible opacity-0 group-hover:visible group-hover:opacity-100 absolute top-full left-0 pt-2 transition-opacity duration-150 z-50"
      >
        <div
          className="min-w-[200px] py-1.5 rounded-xl border"
          style={{
            background: "var(--go-bg-card)",
            borderColor: "var(--go-border)",
            boxShadow: "var(--go-shadow-card)",
          }}
        >
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="block px-3.5 py-2 text-[13px] transition-colors hover:bg-[var(--go-bg-elevated)]"
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
      <h3
        className="text-[12px] font-medium uppercase tracking-[0.04em] mb-3"
        style={{ color: "var(--go-text-muted)" }}
      >
        {title}
      </h3>
      <ul className="space-y-2">
        {links.map((l) => (
          <li key={l.to}>
            <Link
              to={l.to}
              className="text-[13px] transition-opacity hover:opacity-80"
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
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <div className="go-landing go-grain min-h-screen flex flex-col" style={{ position: "relative" }}>
      <header
        className="sticky top-0 z-40 border-b"
        style={{
          background: "var(--go-bg-header)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderColor: "var(--go-border-subtle)",
        }}
      >
        <div className="max-w-[1120px] mx-auto px-5 md:px-8 h-14 flex items-center justify-between gap-4">
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
                className="h-9 px-2.5 inline-flex items-center text-[13px] font-medium rounded-lg"
                style={{ color: "var(--go-text-secondary)" }}
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
              className="hidden sm:inline-flex h-8 px-3 items-center text-[13px] font-medium rounded-lg transition-opacity hover:opacity-80"
              style={{ color: "var(--go-text-secondary)" }}
            >
              Log in
            </Link>
            <Link
              to="/signup"
              className="hidden sm:inline-flex go-pill-btn !min-h-8 !h-8 !px-3 !text-[13px]"
            >
              Sign up
            </Link>
            <Link
              to="/SSNLookup"
              className="hidden md:inline-flex go-btn-ghost !min-h-8 !h-8 !px-3 !text-[13px]"
            >
              Open app
            </Link>
            <button
              type="button"
              className="lg:hidden p-2 rounded-lg"
              style={{ color: "var(--go-text-secondary)" }}
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X size={18} strokeWidth={1.5} /> : <Menu size={18} strokeWidth={1.5} />}
            </button>
          </div>
        </div>

        {open && (
          <div
            className="lg:hidden border-t px-5 py-4 space-y-4 max-h-[70vh] overflow-y-auto"
            style={{
              borderColor: "var(--go-border-subtle)",
              background: "var(--go-bg-sidebar)",
            }}
          >
            {[
              ["Product", PRODUCT_LINKS],
              ["Solutions", SOLUTION_LINKS],
              ["Resources", RESOURCE_LINKS],
              ["Company", COMPANY_LINKS],
            ].map(([title, links]) => (
              <div key={title}>
                <p className="text-[11px] font-medium uppercase tracking-wide mb-2" style={{ color: "var(--go-text-muted)" }}>
                  {title}
                </p>
                <div className="space-y-1">
                  {links.map((l) => (
                    <Link
                      key={l.to}
                      to={l.to}
                      onClick={() => setOpen(false)}
                      className="block py-2 text-[14px]"
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
            <Link to="/pricing" onClick={() => setOpen(false)} className="block py-2 text-[14px]" style={{ color: "var(--go-text-secondary)" }}>
              Pricing
            </Link>
            <div className="flex gap-2 pt-2">
              <Link to="/login" onClick={() => setOpen(false)} className="go-btn-ghost flex-1 !text-[13px]">
                Log in
              </Link>
              <Link to="/signup" onClick={() => setOpen(false)} className="go-pill-btn flex-1 !text-[13px]">
                Sign up
              </Link>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1 relative z-[2]">{children}</main>

      <footer
        className="relative z-[2] border-t mt-auto"
        style={{ borderColor: "var(--go-border-subtle)", background: "var(--go-bg)" }}
      >
        <div className="max-w-[1120px] mx-auto px-5 md:px-8 py-14 md:py-16">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-6 mb-12">
            <div className="col-span-2 md:col-span-1">
              <Link to="/" className="inline-flex items-center gap-2 mb-3">
                <LogoMark size={16} />
                <GrayOceanWordmark size="sm" />
              </Link>
              <p className="text-[13px] leading-relaxed max-w-[200px]" style={{ color: "var(--go-text-muted)" }}>
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
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-6 border-t text-[12px]"
            style={{ borderColor: "var(--go-border-subtle)", color: "var(--go-text-muted)" }}
          >
            <p>© {new Date().getFullYear()} GrayOcean Inc.</p>
            <div className="flex gap-4">
              <Link to="/privacy" className="hover:opacity-80">Privacy</Link>
              <Link to="/terms" className="hover:opacity-80">Terms</Link>
              <Link to="/security" className="hover:opacity-80">Security</Link>
              <Link to="/status" className="hover:opacity-80">Status</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
