import { Link, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { db } from "@/api/localClient";
import { GrayOceanWordmark, LogoMark } from "@/components/GrayOceanLogo";
import ThemeToggle from "@/components/ThemeToggle";

export default function PageNotFound() {
  const location = useLocation();
  const pageName = location.pathname.substring(1);

  const { data: authData, isFetched } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      try {
        const user = await db.auth.me();
        return { user, isAuthenticated: true };
      } catch {
        return { user: null, isAuthenticated: false };
      }
    },
  });

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center px-4 py-12"
      style={{
        background: "var(--go-bg)",
        color: "var(--go-text)",
        fontFamily: 'Inter, "SF Pro Display", system-ui, sans-serif',
      }}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[55%]"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 0%, var(--go-accent-soft), transparent 70%)",
        }}
      />

      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>

      <div className="relative z-[1] w-full max-w-[420px] text-center">
        <Link to="/" className="inline-flex items-center gap-2.5 mb-10" aria-label="GrayOcean home">
          <LogoMark size={22} />
          <GrayOceanWordmark size="sm" />
        </Link>

        <p
          className="text-[64px] font-light leading-none tracking-tight mb-4"
          style={{ color: "var(--go-text-muted)" }}
        >
          404
        </p>
        <div
          className="h-px w-12 mx-auto mb-6"
          style={{ background: "var(--go-border-strong)" }}
        />

        <h1 className="text-[22px] font-medium tracking-tight mb-2" style={{ color: "var(--go-text)" }}>
          Page not found
        </h1>
        <p className="text-[14px] leading-relaxed mb-8" style={{ color: "var(--go-text-secondary)" }}>
          {pageName ? (
            <>
              <span className="font-medium" style={{ color: "var(--go-text)" }}>
                /{pageName}
              </span>{" "}
              doesn&apos;t exist or was moved.
            </>
          ) : (
            <>This page doesn&apos;t exist or was moved.</>
          )}
        </p>

        {isFetched && authData?.isAuthenticated && authData.user?.role === "admin" && (
          <div
            className="mb-8 text-left rounded-xl border px-4 py-3"
            style={{
              background: "var(--go-bg-card)",
              borderColor: "var(--go-border)",
              boxShadow: "var(--go-shadow-card)",
            }}
          >
            <p className="text-[12px] font-medium mb-1" style={{ color: "var(--go-warning)" }}>
              Admin note
            </p>
            <p className="text-[12.5px] leading-relaxed" style={{ color: "var(--go-text-secondary)" }}>
              This route may not be implemented yet.
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-2.5 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center h-10 px-4 rounded-lg text-[14px] font-medium text-white transition-[background,transform] duration-200 hover:scale-[1.02]"
            style={{
              background: "var(--go-accent)",
              boxShadow: "var(--go-shadow-btn)",
            }}
          >
            Go home
          </Link>
          <Link
            to="/SSNLookup"
            className="inline-flex items-center justify-center h-10 px-4 rounded-lg text-[14px] font-medium border transition-[background,transform] duration-200 hover:scale-[1.02]"
            style={{
              borderColor: "var(--go-border-strong)",
              color: "var(--go-text)",
              background: "transparent",
            }}
          >
            Open workspace
          </Link>
        </div>

        <p className="mt-10 text-[13px]" style={{ color: "var(--go-text-muted)" }}>
          © {new Date().getFullYear()} GrayOcean
        </p>
      </div>
    </div>
  );
}
