import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

export default function Signup() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [done, setDone] = useState(false);

  const validate = () => {
    const e = {};
    if (!fullName.trim()) e.fullName = "Full name is required.";
    if (!email) e.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Enter a valid email address.";
    if (!password || password.length < 8) e.password = "Password must be at least 8 characters.";
    if (confirm !== password) e.confirm = "Passwords do not match.";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    setLoading(false);
    setDone(true);
    setTimeout(() => navigate("/SSNLookup", { replace: true }), 800);
  };

  return (
    <AuthShell>
      <div className="flex justify-center mb-10">
        <AuthBrandLogo />
      </div>

      <AuthTitle title="Create account" subtitle="Set up your GrayOcean workspace" />

      <AuthCard>
        {done ? (
          <div className="text-center py-2">
            <p className="text-[14px] font-medium" style={{ color: "var(--go-auth-ink)" }}>
              Account ready
            </p>
            <p className="text-[12.5px] mt-2" style={{ color: "var(--go-auth-muted)" }}>
              Taking you to your workspace…
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label className="text-[11px] font-medium uppercase tracking-wider mb-1.5 block">
                Full name
              </label>
              <Input
                type="text"
                placeholder="Jane Smith"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  if (errors.fullName) setErrors((p) => ({ ...p, fullName: undefined }));
                }}
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
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((p) => ({ ...p, email: undefined }));
                }}
                autoComplete="email"
              />
              <AuthFieldError message={errors.email} />
            </div>

            <div>
              <label className="text-[11px] font-medium uppercase tracking-wider mb-1.5 block">
                Password
              </label>
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
                  autoComplete="new-password"
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

            <div>
              <label className="text-[11px] font-medium uppercase tracking-wider mb-1.5 block">
                Confirm password
              </label>
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={confirm}
                onChange={(e) => {
                  setConfirm(e.target.value);
                  if (errors.confirm) setErrors((p) => ({ ...p, confirm: undefined }));
                }}
                autoComplete="new-password"
              />
              <AuthFieldError message={errors.confirm} />
            </div>

            <AuthAlert variant="info">
              By creating an account you agree to GrayOcean&apos;s Terms and Privacy Policy.
            </AuthAlert>

            <Button type="submit" disabled={loading} className="go-auth-primary w-full gap-2 mt-1">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Creating…
                </span>
              ) : (
                <>
                  Create account <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </Button>
          </form>
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
