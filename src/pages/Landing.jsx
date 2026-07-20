import { Link } from "react-router-dom";
import { GrayOceanWordmark, LogoMark } from "@/components/GrayOceanLogo";
import ThemeToggle from "@/components/ThemeToggle";

/**
 * Marketing landing — Data Furnishing–style composition:
 * brand, one headline, support line, CTA group. No dashboard chrome.
 */
export default function Landing() {
  return (
    <div className="go-landing flex flex-col">
      <header className="flex items-center justify-between px-5 md:px-8 h-16">
        <Link to="/" className="inline-flex items-center gap-2.5" aria-label="GrayOcean home">
          <LogoMark size={20} />
          <GrayOceanWordmark size="sm" />
        </Link>
        <div className="flex items-center gap-2.5">
          <ThemeToggle />
          <Link to="/login" className="go-auth-outline hidden sm:inline-flex">
            Login
          </Link>
          <Link to="/request-access" className="go-auth-primary hidden sm:inline-flex">
            Request Access
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-5 pb-20 pt-8 text-center">
        <p
          className="text-[11px] font-medium uppercase tracking-[0.18em] mb-5"
          style={{ color: "var(--go-accent-text)" }}
        >
          SSN Intelligence Platform
        </p>

        <h1 className="go-landing-headline max-w-3xl mx-auto">
          SSN, address, and skiptrace in one workspace
        </h1>

        <p className="go-landing-support mx-auto mt-5">
          Validate SSNs, enrich addresses, run skiptrace, and batch analysis — in one place for investigation desks.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-9">
          <Link to="/request-access" className="go-auth-primary min-w-[160px]">
            Request Access
          </Link>
          <Link to="/login" className="go-auth-outline min-w-[160px]">
            Login
          </Link>
        </div>

        <p className="mt-10 text-[12px]" style={{ color: "var(--go-auth-muted)" }}>
          Already building?{" "}
          <Link to="/SSNLookup" className="font-medium" style={{ color: "var(--go-accent)" }}>
            Open workspace
          </Link>
        </p>
      </main>

      <footer className="px-5 py-6 text-center">
        <p className="go-auth-copyright !mt-0">© {new Date().getFullYear()} GrayOcean</p>
      </footer>
    </div>
  );
}
