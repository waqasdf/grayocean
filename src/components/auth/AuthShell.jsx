import { Link } from "react-router-dom";
import { GrayOceanWordmark, LogoMark } from "@/components/GrayOceanLogo";
import ThemeToggle from "@/components/ThemeToggle";

/**
 * Auth shell — centered card, wash, purple accent.
 * Works in light + dark via CSS variables.
 */
export function AuthBrandLogo() {
  return (
    <Link to="/" className="inline-flex items-center gap-2.5" aria-label="GrayOcean home">
      <LogoMark size={22} />
      <GrayOceanWordmark size="sm" />
    </Link>
  );
}

export function AuthShell({ children, maxWidth = "max-w-[420px]" }) {
  return (
    <div className="go-auth-shell relative min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>
      <div className={`relative z-[1] w-full ${maxWidth}`}>{children}</div>
    </div>
  );
}

export function AuthCard({ children }) {
  return <div className="go-auth-card">{children}</div>;
}

export function AuthTitle({ title, subtitle }) {
  return (
    <div className="mb-8 text-center">
      <h1 className="go-auth-title">{title}</h1>
      {subtitle ? <p className="go-auth-subtitle">{subtitle}</p> : null}
    </div>
  );
}

export function AuthFieldError({ message }) {
  if (!message) return null;
  return (
    <p className="text-[11px] mt-1.5 px-1" style={{ color: "var(--go-error)" }}>
      {message}
    </p>
  );
}

export function AuthAlert({ children, variant = "error" }) {
  const styles =
    variant === "success"
      ? {
          background: "var(--go-success-fill)",
          border: "1px solid var(--go-success-border)",
          color: "var(--go-success)",
        }
      : variant === "info"
        ? {
            background: "var(--go-accent-soft)",
            border: "1px solid var(--go-accent-border)",
            color: "var(--go-accent-text)",
          }
        : {
            background: "var(--go-error-fill)",
            border: "1px solid var(--go-error-border)",
            color: "var(--go-error)",
          };

  return (
    <div className="mb-4 px-3 py-2.5 rounded-xl text-[12px] leading-relaxed" style={styles}>
      {children}
    </div>
  );
}

export function AuthIconBadge({ children }) {
  return (
    <div
      className="mx-auto mb-5 flex h-11 w-11 items-center justify-center rounded-xl"
      style={{
        background: "var(--go-accent-soft)",
        border: "1px solid var(--go-accent-border)",
        color: "var(--go-accent-text)",
      }}
    >
      {children}
    </div>
  );
}

export function AuthFooterNote({ children }) {
  return <p className="go-auth-footer">{children}</p>;
}

export function AuthCopyright() {
  return <p className="go-auth-copyright">© {new Date().getFullYear()} GrayOcean</p>;
}
