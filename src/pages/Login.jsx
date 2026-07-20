import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
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

export default function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (isAuthenticated) navigate("/SSNLookup", { replace: true });
  }, [isAuthenticated, navigate]);

  const validate = () => {
    const e = {};
    if (!email) e.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Enter a valid email address.";
    if (!password) e.password = "Password is required.";
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
      await login({ email: email.trim(), password });
      navigate("/SSNLookup", { replace: true });
    } catch (error) {
      setSubmitError(error?.message || "Sign in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell>
      <div className="flex justify-center mb-10">
        <AuthBrandLogo />
      </div>

      <AuthTitle title="Sign in" subtitle="Enter your email and password" />

      <AuthCard>
        {submitError ? <AuthAlert>{submitError}</AuthAlert> : null}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label className="text-[11px] font-medium uppercase tracking-wider mb-1.5 block">
              Email address
            </label>
            <Input
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((p) => ({ ...p, email: undefined }));
              }}
              autoComplete="email"
            />
            <AuthFieldError message={errors.email} />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-medium uppercase tracking-wider">Password</label>
              <Link to="/forgot-password" className="text-[11px] font-medium">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors((p) => ({ ...p, password: undefined }));
                }}
                className="pr-10"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100 transition-opacity"
                style={{ color: "var(--go-auth-ink)" }}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
            <AuthFieldError message={errors.password} />
          </div>

          <Button type="submit" disabled={loading} className="go-auth-primary w-full gap-2 mt-1">
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Signing in...
              </span>
            ) : (
              <>
                Sign in <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </Button>
        </form>
      </AuthCard>

      <AuthFooterNote>
        Don&apos;t have an account?{" "}
        <Link to="/request-access" className="font-semibold">
          Request access
        </Link>
      </AuthFooterNote>

      <AuthCopyright />
    </AuthShell>
  );
}
