import { Link } from "react-router-dom";
import { Wrench } from "lucide-react";
import {
  AuthBrandLogo,
  AuthCard,
  AuthCopyright,
  AuthFooterNote,
  AuthIconBadge,
  AuthShell,
  AuthTitle,
} from "@/components/auth/AuthShell";

export default function Maintenance() {
  return (
    <AuthShell>
      <div className="flex justify-center mb-10">
        <AuthBrandLogo />
      </div>

      <AuthTitle
        title="Under maintenance"
        subtitle="GrayOcean is briefly unavailable while we finish upgrades"
      />

      <AuthCard>
        <AuthIconBadge>
          <Wrench className="w-5 h-5" strokeWidth={1.5} />
        </AuthIconBadge>

        <div className="text-center space-y-3">
          <p className="text-[13px] leading-relaxed" style={{ color: "var(--go-auth-muted)" }}>
            Lookups and the API are paused during this window. Existing sessions may not load until
            work is complete.
          </p>
          <p className="text-[12.5px]" style={{ color: "var(--go-auth-copyright)" }}>
            Check status for live updates.
          </p>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-2.5">
          <Link
            to="/status"
            className="go-auth-primary inline-flex items-center justify-center flex-1"
          >
            View status
          </Link>
          <Link
            to="/"
            className="go-auth-outline inline-flex items-center justify-center flex-1"
          >
            Go home
          </Link>
        </div>
      </AuthCard>

      <AuthFooterNote>
        Questions?{" "}
        <Link to="/contact" className="font-semibold">
          Contact support
        </Link>
      </AuthFooterNote>

      <AuthCopyright />
    </AuthShell>
  );
}
