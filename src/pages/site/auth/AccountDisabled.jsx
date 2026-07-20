import { Link } from "react-router-dom";
import { Ban } from "lucide-react";
import {
  AuthBrandLogo,
  AuthCard,
  AuthCopyright,
  AuthFooterNote,
  AuthIconBadge,
  AuthShell,
  AuthTitle,
} from "@/components/auth/AuthShell";

export default function AccountDisabled() {
  return (
    <AuthShell>
      <div className="flex justify-center mb-10">
        <AuthBrandLogo />
      </div>

      <AuthTitle title="Account disabled" subtitle="This account can no longer sign in" />

      <AuthCard>
        <AuthIconBadge>
          <Ban className="w-5 h-5" strokeWidth={1.5} />
        </AuthIconBadge>

        <div className="text-center space-y-3">
          <p className="text-[13px] leading-relaxed" style={{ color: "var(--go-auth-muted)" }}>
            Your GrayOcean access has been suspended. This may be due to a billing issue, policy
            review, or an administrator action.
          </p>
          <p className="text-[12.5px]" style={{ color: "var(--go-auth-copyright)" }}>
            If you believe this is a mistake, contact your workspace admin or support.
          </p>
        </div>

        <Link
          to="/contact"
          className="go-auth-primary inline-flex items-center justify-center w-full mt-6"
        >
          Contact support
        </Link>
      </AuthCard>

      <AuthFooterNote>
        <Link to="/login" className="font-semibold">
          Back to sign in
        </Link>
      </AuthFooterNote>

      <AuthCopyright />
    </AuthShell>
  );
}
