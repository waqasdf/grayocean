import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogoMark } from "@/components/GrayOceanLogo";
import { createPageUrl } from "@/utils";

const TITLES = {
  signin: "Sign in",
  signup: "Create account",
  forgot: "Reset password",
  reset: "Choose a new password",
};

const SUBTITLES = {
  signin: "Prepaid USDC credits power lookups. Verify your email after signup.",
  signup: "Prepaid USDC credits power lookups. Verify your email after signup.",
  forgot: "Enter your account email and we will send a reset link.",
  reset: "Enter a new password for your Gray Ocean account.",
};

export default function LoginPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const redirect = params.get("redirect") || createPageUrl("SSNLookup");
  const initialMode = params.get("mode") === "reset" ? "reset" : "signin";

  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, "");
    const hashParams = new URLSearchParams(hash);
    const type = hashParams.get("type") || params.get("type");
    if (type === "recovery" || params.get("mode") === "reset") {
      setMode("reset");
    }

    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setMode("reset");
        setError("");
        setMessage("Enter a new password to finish resetting your account.");
      }
    });

    return () => sub?.subscription?.unsubscribe();
  }, [params]);

  const clearFeedback = () => {
    setError("");
    setMessage("");
  };

  const switchMode = (next) => {
    clearFeedback();
    setPassword("");
    setConfirmPassword("");
    setMode(next);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    clearFeedback();
    setLoading(true);

    try {
      if (mode === "forgot") {
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(
          email.trim(),
          {
            redirectTo: `${window.location.origin}/Login?mode=reset`,
          }
        );
        if (resetError) throw resetError;
        setMessage(
          "If an account exists for that email, a reset link is on the way. Check your inbox and spam folder."
        );
        return;
      }

      if (mode === "reset") {
        if (password.length < 8) {
          throw new Error("Password must be at least 8 characters.");
        }
        if (password !== confirmPassword) {
          throw new Error("Passwords do not match.");
        }
        const { error: updateError } = await supabase.auth.updateUser({
          password,
        });
        if (updateError) throw updateError;
        setMessage("Password updated. Redirecting…");
        navigate(
          redirect.startsWith("http") ? createPageUrl("SSNLookup") : redirect,
          { replace: true }
        );
        return;
      }

      if (mode === "signin") {
        const { error: signError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signError) throw signError;
        navigate(
          redirect.startsWith("http") ? createPageUrl("SSNLookup") : redirect,
          { replace: true }
        );
        return;
      }

      const { data, error: signError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName || email.split("@")[0] },
          emailRedirectTo: `${window.location.origin}/Login`,
        },
      });
      if (signError) throw signError;
      if (data.session) {
        navigate(createPageUrl("SSNLookup"), { replace: true });
      } else {
        setMessage("Check your email to verify your account, then sign in.");
        setMode("signin");
      }
    } catch (err) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const submitLabel = () => {
    if (loading) return "Please wait…";
    if (mode === "signin") return "Sign in";
    if (mode === "signup") return "Create account";
    if (mode === "forgot") return "Send reset link";
    return "Update password";
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-go-bg px-3 py-8 sm:px-4 sm:py-10">
      <div className="w-full max-w-md rounded-go-lg border border-go-border bg-go-surface p-5 shadow-go-sm sm:p-6 md:p-8">
        <div className="mb-6 flex items-center gap-2.5">
          <LogoMark size={22} />
          <span className="text-go-body font-semibold text-go-text">Gray Ocean</span>
        </div>

        <h1 className="text-go-page text-go-text">{TITLES[mode]}</h1>
        <p className="mt-1 text-go-body-sm text-go-text-muted">{SUBTITLES[mode]}</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          {mode === "signup" && (
            <div className="space-y-1.5">
              <Label htmlFor="fullName">Full name</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                autoComplete="name"
              />
            </div>
          )}

          {(mode === "signin" || mode === "signup" || mode === "forgot") && (
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
          )}

          {(mode === "signin" || mode === "signup" || mode === "reset") && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <Label htmlFor="password">
                  {mode === "reset" ? "New password" : "Password"}
                </Label>
                {mode === "signin" && (
                  <button
                    type="button"
                    className="text-go-meta font-medium text-go-primary hover:text-go-primary-hover"
                    onClick={() => switchMode("forgot")}
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <Input
                id="password"
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={
                  mode === "signin" ? "current-password" : "new-password"
                }
              />
            </div>
          )}

          {mode === "reset" && (
            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword">Confirm new password</Label>
              <Input
                id="confirmPassword"
                type="password"
                required
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
              />
            </div>
          )}

          {error ? (
            <p className="text-go-body-sm text-go-danger" role="alert">
              {error}
            </p>
          ) : null}
          {message ? (
            <p className="text-go-body-sm text-go-success" role="status">
              {message}
            </p>
          ) : null}

          <Button type="submit" className="w-full" disabled={loading}>
            {submitLabel()}
          </Button>
        </form>

        <p className="mt-4 text-go-body-sm text-go-text-muted">
          {mode === "signin" && (
            <>
              No account?{" "}
              <button
                type="button"
                className="font-medium text-go-primary hover:text-go-primary-hover"
                onClick={() => switchMode("signup")}
              >
                Sign up
              </button>
            </>
          )}
          {mode === "signup" && (
            <>
              Already registered?{" "}
              <button
                type="button"
                className="font-medium text-go-primary hover:text-go-primary-hover"
                onClick={() => switchMode("signin")}
              >
                Sign in
              </button>
            </>
          )}
          {(mode === "forgot" || mode === "reset") && (
            <>
              Remembered it?{" "}
              <button
                type="button"
                className="font-medium text-go-primary hover:text-go-primary-hover"
                onClick={() => switchMode("signin")}
              >
                Back to sign in
              </button>
            </>
          )}
        </p>

        <p className="mt-6 text-go-meta text-go-text-muted">
          By continuing you agree to use prepaid credits for lookups. Credits are not a
          crypto wallet and cannot be withdrawn.
        </p>
      </div>
    </div>
  );
}
