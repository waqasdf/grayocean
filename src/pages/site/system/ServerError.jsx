import { Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import {
  AuthBrandLogo,
  AuthCard,
  AuthCopyright,
  AuthFooterNote,
  AuthIconBadge,
  AuthShell,
  AuthTitle,
} from "@/components/auth/AuthShell";

export default function ServerError() {
  return (
    <AuthShell>
      <div className="flex justify-center mb-10">
        <AuthBrandLogo />
      </div>

      <AuthTitle title="Something went wrong" subtitle="Error 500 — we couldn't complete that request" />

      <AuthCard>
        <AuthIconBadge>
          <AlertTriangle className="w-5 h-5" strokeWidth={1.5} />
        </AuthIconBadge>

        <p className="text-center text-[13px] leading-relaxed" style={{ color: "var(--go-auth-muted)" }}>
          An unexpected error occurred on our side. Try again in a moment. If it keeps happening,
          contact support with the time of the request.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row gap-2.5">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="go-auth-primary inline-flex items-center justify-center flex-1"
          >
            Try again
          </button>
          <Link
            to="/"
            className="go-auth-outline inline-flex items-center justify-center flex-1"
          >
            Go home
          </Link>
        </div>
      </AuthCard>

      <AuthFooterNote>
        <Link to="/SSNLookup" className="font-semibold">
          Open workspace
        </Link>
      </AuthFooterNote>

      <AuthCopyright />
    </AuthShell>
  );
}
