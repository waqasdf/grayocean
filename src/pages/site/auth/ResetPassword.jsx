import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
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

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [done, setDone] = useState(false);

  const validate = () => {
    const e = {};
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
  };

  return (
    <AuthShell>
      <div className="flex justify-center mb-10">
        <AuthBrandLogo />
      </div>

      <AuthTitle title="Set new password" subtitle="Choose a strong password for your account" />

      <AuthCard>
        {done ? (
          <div className="text-center py-2">
            <p className="text-[14px] font-medium" style={{ color: "var(--go-auth-ink)" }}>
              Password updated
            </p>
            <p className="text-[12.5px] mt-2" style={{ color: "var(--go-auth-muted)" }}>
              You can sign in with your new password.
            </p>
            <Link
              to="/login"
              className="go-auth-primary inline-flex items-center justify-center gap-2 w-full mt-5"
            >
              Sign in <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label className="text-[11px] font-medium uppercase tracking-wider mb-1.5 block">
                New password
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

            <Button type="submit" disabled={loading} className="go-auth-primary w-full gap-2 mt-1">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Saving…
                </span>
              ) : (
                <>
                  Update password <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </Button>
          </form>
        )}
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
