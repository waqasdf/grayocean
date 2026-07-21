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

  const signInWithGoogle = async () => {
    clearFeedback();
    setLoading(true);
    try {
      const nextPath = redirect.startsWith("http")
        ? createPageUrl("SSNLookup")
        : redirect.startsWith("/")
          ? redirect
          : `/${redirect}`;
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}${nextPath}`,
          queryParams: {
            access_type: "offline",
            prompt: "select_account",
          },
        },
      });
      if (oauthError) throw oauthError;
    } catch (err) {
      setError(err.message || "Google sign-in failed");
      setLoading(false);
    }
  };

  const showGoogle = mode === "signin" || mode === "signup";

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

        {showGoogle && (
          <div className="mt-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-go-border" />
              <span className="text-go-meta text-go-text-muted">or</span>
              <div className="h-px flex-1 bg-go-border" />
            </div>
            <Button
              type="button"
              variant="outline"
              className="w-full gap-2"
              disabled={loading}
              onClick={signInWithGoogle}
            >
              <svg className="size-4 shrink-0" viewBox="0 0 24 24" aria-hidden>
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>
          </div>
        )}

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
