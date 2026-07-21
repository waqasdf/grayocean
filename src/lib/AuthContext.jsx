import React, { createContext, useState, useContext, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@/entities/User";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [appPublicSettings, setAppPublicSettings] = useState({
    id: "grayocean",
    public_settings: {},
  });

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      setIsLoadingPublicSettings(true);
      setAuthError(null);

      try {
        const { data: sessionData } = await supabase.auth.getSession();
        if (!mounted) return;

        if (sessionData.session) {
          try {
            const profile = await User.me();
            if (!mounted) return;
            setUser(profile);
            setIsAuthenticated(true);
          } catch (err) {
            console.error("Profile load failed:", err);
            setUser(null);
            setIsAuthenticated(false);
            setAuthError({
              type: "auth_required",
              message: "Authentication required",
            });
          }
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Auth init failed:", error);
        if (mounted) {
          setAuthError({
            type: "unknown",
            message: error.message || "Failed to initialize auth",
          });
        }
      } finally {
        if (mounted) {
          setIsLoadingAuth(false);
          setIsLoadingPublicSettings(false);
        }
      }
    };

    init();

    const { data: sub } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      if (event === "SIGNED_OUT" || !session) {
        setUser(null);
        setIsAuthenticated(false);
        return;
      }
      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED" || event === "INITIAL_SESSION") {
        try {
          const profile = await User.me();
          if (!mounted) return;
          setUser(profile);
          setIsAuthenticated(true);
          setAuthError(null);
        } catch {
          setUser(null);
          setIsAuthenticated(false);
        }
      }
    });

    return () => {
      mounted = false;
      sub?.subscription?.unsubscribe();
    };
  }, []);

  const logout = async (shouldRedirect = true) => {
    setUser(null);
    setIsAuthenticated(false);
    await supabase.auth.signOut();
    if (shouldRedirect) {
      window.location.assign("/Login");
    }
  };

  const navigateToLogin = () => {
    const next = encodeURIComponent(window.location.href);
    window.location.assign(`/Login?redirect=${next}`);
  };

  const checkAppState = async () => {
    setIsLoadingAuth(true);
    try {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        const profile = await User.me();
        setUser(profile);
        setIsAuthenticated(true);
        setAuthError(null);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      setAuthError({
        type: "unknown",
        message: error.message || "Failed to refresh auth",
      });
    } finally {
      setIsLoadingAuth(false);
      setIsLoadingPublicSettings(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isAdmin: user?.role === "admin",
        isLoadingAuth,
        isLoadingPublicSettings,
        authError,
        appPublicSettings,
        logout,
        navigateToLogin,
        checkAppState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
