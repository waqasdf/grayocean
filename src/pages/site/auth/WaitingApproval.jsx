import { Link } from "react-router-dom";
import { Clock } from "lucide-react";
import {
  AuthBrandLogo,
  AuthCard,
  AuthCopyright,
  AuthFooterNote,
  AuthIconBadge,
  AuthShell,
  AuthTitle,
} from "@/components/auth/AuthShell";

export default function WaitingApproval() {
  return (
    <AuthShell>
      <div className="flex justify-center mb-10">
        <AuthBrandLogo />
      </div>

      <AuthTitle
        title="Waiting for approval"
        subtitle="Your request is with an administrator"
      />

      <AuthCard>
        <AuthIconBadge>
          <Clock className="w-5 h-5" strokeWidth={1.5} />
        </AuthIconBadge>

        <div className="text-center space-y-3">
          <p className="text-[13px] leading-relaxed" style={{ color: "var(--go-auth-muted)" }}>
            Access to GrayOcean is invite-only for some workspaces. You&apos;ll get an email when your
            account is approved.
          </p>
          <p className="text-[12.5px]" style={{ color: "var(--go-auth-copyright)" }}>
            Typical review time is under one business day.
          </p>
        </div>

        <Link to="/" className="go-auth-outline inline-flex items-center justify-center w-full mt-6">
          Back to home
        </Link>
      </AuthCard>

      <AuthFooterNote>
        Need help?{" "}
        <Link to="/contact" className="font-semibold">
          Contact support
        </Link>
      </AuthFooterNote>

      <AuthCopyright />
    </AuthShell>
  );
}
