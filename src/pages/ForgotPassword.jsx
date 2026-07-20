import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AuthBrandLogo,
  AuthCard,
  AuthCopyright,
  AuthFieldError,
  AuthFooterNote,
  AuthShell,
  AuthTitle,
} from "@/components/auth/AuthShell";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email address.");
      return;
    }
    setLoading(true);
    // Local stub — no email backend yet.
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);
    setSent(true);
  };

  return (
    <AuthShell>
      <div className="flex justify-center mb-10">
        <AuthBrandLogo />
      </div>

      <AuthTitle
        title="Reset password"
        subtitle="We'll send a reset link if an account exists for that email"
      />

      <AuthCard>
        {sent ? (
          <div className="text-center py-2">
            <p className="text-[14px] font-medium" style={{ color: "var(--go-auth-ink)" }}>
              Check your inbox
            </p>
            <p className="text-[12.5px] mt-2 leading-relaxed" style={{ color: "var(--go-auth-muted)" }}>
              If <span className="font-medium">{email}</span> is registered, a reset link will arrive
              shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label className="text-[11px] font-medium uppercase tracking-wider mb-1.5 block">
                Email address
              </label>
              <Input
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
              <AuthFieldError message={error} />
            </div>

            <Button type="submit" disabled={loading} className="go-auth-primary w-full gap-2 mt-1">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Sending...
                </span>
              ) : (
                <>
                  Send reset link <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </Button>
          </form>
        )}
      </AuthCard>

      <AuthFooterNote>
        Remembered it?{" "}
        <Link to="/login" className="font-semibold">
          Back to sign in
        </Link>
      </AuthFooterNote>

      <AuthCopyright />
    </AuthShell>
  );
}
