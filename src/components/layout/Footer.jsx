import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function Footer() {
  return (
    <footer
      className="mt-12"
      style={{ borderTop: "1px solid var(--go-border)" }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span
              className="text-[13px] font-medium"
              style={{ color: "var(--go-text)" }}
            >
              GrayOcean
            </span>
            <span className="text-[12px]" style={{ color: "var(--go-text-muted)" }}>
              © {new Date().getFullYear()}
            </span>
          </div>

          <nav className="flex items-center flex-wrap justify-center gap-4 text-[12px]">
            {[
              ["SSNLookup", "SSN Lookup"],
              ["AddressLookup", "Address Intel"],
              ["Skiptrace", "Skiptrace"],
              ["Forum", "Forum"],
              ["API", "API"],
            ].map(([page, label]) => (
              <Link
                key={page}
                to={createPageUrl(page)}
                className="transition-opacity hover:opacity-80"
                style={{ color: "var(--go-text-muted)" }}
              >
                {label}
              </Link>
            ))}
          </nav>

          <div
            className="flex items-center gap-3 text-[12px]"
            style={{ color: "var(--go-text-muted)" }}
          >
            <a
              href="mailto:support@grayocean.io"
              className="transition-opacity hover:opacity-80"
            >
              Contact
            </a>
            <span>·</span>
            <span>Privacy</span>
            <span>·</span>
            <span>Terms</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
