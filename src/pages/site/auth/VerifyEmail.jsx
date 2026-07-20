import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AuthAlert,
  AuthBrandLogo,
  AuthCard,
  AuthCopyright,
  AuthFooterNote,
  AuthIconBadge,
  AuthShell,
  AuthTitle,
} from "@/components/auth/AuthShell";

export default function VerifyEmail() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleResend = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    setLoading(false);
    setSent(true);
  };

  return (
    <AuthShell>
      <div className="flex justify-center mb-10">
        <AuthBrandLogo />
      </div>

      <AuthTitle
        title="Verify your email"
        subtitle="Confirm your address to finish setting up your account"
      />

      <AuthCard>
        <AuthIconBadge>
          <Mail className="w-5 h-5" strokeWidth={1.5} />
        </AuthIconBadge>

        <p className="text-center text-[13px] leading-relaxed" style={{ color: "var(--go-auth-muted)" }}>
          We sent a verification link to your inbox. Open it to continue. The link expires in 24 hours.
        </p>

        {sent ? (
          <AuthAlert variant="success">
            <span className="block text-center">A new link has been sent.</span>
          </AuthAlert>
        ) : null}

        <Button
          type="button"
          disabled={loading || sent}
          onClick={handleResend}
          className="go-auth-outline w-full mt-5"
        >
          {loading ? "Sending…" : sent ? "Link sent" : "Resend verification email"}
        </Button>
      </AuthCard>

      <AuthFooterNote>
        Wrong account?{" "}
        <Link to="/login" className="font-semibold">
          Sign in
        </Link>
      </AuthFooterNote>

      <AuthCopyright />
    </AuthShell>
  );
}
