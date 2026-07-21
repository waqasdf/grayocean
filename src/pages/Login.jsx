import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogoMark } from "@/components/GrayOceanLogo";
import { createPageUrl } from "@/utils";

export default function LoginPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const redirect = params.get("redirect") || createPageUrl("SSNLookup");

  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      if (mode === "signin") {
        const { error: signError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signError) throw signError;
        navigate(redirect.startsWith("http") ? createPageUrl("SSNLookup") : redirect, {
          replace: true,
        });
      } else {
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
      }
    } catch (err) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-go-bg px-3 py-8 sm:px-4 sm:py-10">
      <div className="w-full max-w-md rounded-go-lg border border-go-border bg-go-surface p-5 shadow-go-sm sm:p-6 md:p-8">
        <div className="mb-6 flex items-center gap-2.5">
          <LogoMark size={22} />
          <span className="text-go-body font-semibold text-go-text">Gray Ocean</span>
        </div>

        <h1 className="text-go-page text-go-text">
          {mode === "signin" ? "Sign in" : "Create account"}
        </h1>
        <p className="mt-1 text-go-body-sm text-go-text-muted">
          Prepaid USDC credits power lookups. Verify your email after signup.
        </p>

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
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
            />
          </div>

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
            {loading
              ? "Please wait…"
              : mode === "signin"
                ? "Sign in"
                : "Create account"}
          </Button>
        </form>

        <p className="mt-4 text-go-body-sm text-go-text-muted">
          {mode === "signin" ? (
            <>
              No account?{" "}
              <button
                type="button"
                className="font-medium text-go-primary hover:text-go-primary-hover"
                onClick={() => setMode("signup")}
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already registered?{" "}
              <button
                type="button"
                className="font-medium text-go-primary hover:text-go-primary-hover"
                onClick={() => setMode("signin")}
              >
                Sign in
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
