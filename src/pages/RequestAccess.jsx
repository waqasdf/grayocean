import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/AuthContext";
import {
  AuthAlert,
  AuthBrandLogo,
  AuthCard,
  AuthCopyright,
  AuthFieldError,
  AuthFooterNote,
  AuthShell,
  AuthTitle,
} from "@/components/auth/AuthShell";

export default function RequestAccess() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const e = {};
    if (!fullName.trim()) e.fullName = "Full name is required.";
    if (!email) e.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Enter a valid email address.";
    if (!password || password.length < 6) e.password = "Password must be at least 6 characters.";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      await login({
        email: email.trim(),
        password,
        full_name: fullName.trim(),
        company: company.trim(),
      });
      setSubmitted(true);
      setTimeout(() => navigate("/SSNLookup", { replace: true }), 900);
    } catch (error) {
      setSubmitError(error?.message || "Request failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell>
      <div className="flex justify-center mb-10">
        <AuthBrandLogo />
      </div>

      <AuthTitle
        title="Request access"
        subtitle="Request access to GrayOcean"
      />

      <AuthCard>
        {submitted ? (
          <div className="text-center py-4">
            <p className="text-[14px] font-medium" style={{ color: "var(--go-auth-ink)" }}>
              Access granted
            </p>
            <p className="text-[12.5px] mt-2" style={{ color: "var(--go-auth-muted)" }}>
              Taking you to your workspace…
            </p>
          </div>
        ) : (
          <>
            {submitError ? <AuthAlert>{submitError}</AuthAlert> : null}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div>
                <label className="text-[11px] font-medium uppercase tracking-wider mb-1.5 block">
                  Full name
                </label>
                <Input
                  type="text"
                  placeholder="Jane Smith"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  autoComplete="name"
                />
                <AuthFieldError message={errors.fullName} />
              </div>

              <div>
                <label className="text-[11px] font-medium uppercase tracking-wider mb-1.5 block">
                  Work email
                </label>
                <Input
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
                <AuthFieldError message={errors.email} />
              </div>

              <div>
                <label className="text-[11px] font-medium uppercase tracking-wider mb-1.5 block">
                  Company <span className="normal-case tracking-normal opacity-60">(optional)</span>
                </label>
                <Input
                  type="text"
                  placeholder="Acme Investigations"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  autoComplete="organization"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium uppercase tracking-wider mb-1.5 block">
                  Password
                </label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                />
                <AuthFieldError message={errors.password} />
              </div>

              <Button type="submit" disabled={loading} className="go-auth-primary w-full gap-2 mt-1">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Submitting...
                  </span>
                ) : (
                  <>
                    Request access <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </Button>
            </form>
          </>
        )}
      </AuthCard>

      <AuthFooterNote>
        Already have an account?{" "}
        <Link to="/login" className="font-semibold">
          Sign in
        </Link>
      </AuthFooterNote>

      <AuthCopyright />
    </AuthShell>
  );
}
