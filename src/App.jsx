import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClientInstance } from "@/lib/query-client";
import NavigationTracker from "@/lib/NavigationTracker";
import { pagesConfig } from "./pages.config";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import PageNotFound from "./lib/PageNotFound";
import { AuthProvider, useAuth } from "@/lib/AuthContext";
import UserNotRegisteredError from "@/components/UserNotRegisteredError";
import Login from "./pages/Login";

/** Supabase email links often land on Site URL `/#...&type=recovery` — send them to Login reset. */
function AuthHashRedirect() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const hash = location.hash?.replace(/^#/, "") || "";
    if (!hash) return;
    const params = new URLSearchParams(hash);
    const type = params.get("type");
    if (type !== "recovery" && type !== "signup") return;

    const onLogin = location.pathname.toLowerCase() === "/login";
    if (onLogin) return;

    navigate(
      {
        pathname: "/Login",
        search: type === "recovery" ? "?mode=reset" : "",
        hash: location.hash,
      },
      { replace: true }
    );
  }, [location.hash, location.pathname, navigate]);

  return null;
}

const { Pages, Layout, mainPage } = pagesConfig;
const mainPageKey = mainPage ?? Object.keys(Pages)[0];
const MainPage = mainPageKey ? Pages[mainPageKey] : () => null;

const LayoutWrapper = ({ children, currentPageName }) =>
  Layout ? (
    <Layout currentPageName={currentPageName}>{children}</Layout>
  ) : (
    <>{children}</>
  );

const AuthenticatedApp = () => {
  const {
    isLoadingAuth,
    isLoadingPublicSettings,
    authError,
    isAuthenticated,
  } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-go-bg">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-go-border border-t-go-primary" />
      </div>
    );
  }

  if (authError?.type === "user_not_registered") {
    return <UserNotRegisteredError />;
  }

  return (
    <Routes>
      <Route path="/Login" element={<Login />} />
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <LayoutWrapper currentPageName={mainPageKey}>
              <MainPage />
            </LayoutWrapper>
          ) : (
            <Navigate to="/Login" replace />
          )
        }
      />
      {Object.entries(Pages).map(([path, Page]) => (
        <Route
          key={path}
          path={`/${path}`}
          element={
            isAuthenticated ? (
              <LayoutWrapper currentPageName={path}>
                <Page />
              </LayoutWrapper>
            ) : (
              <Navigate to="/Login" replace />
            )
          }
        />
      ))}
      <Route
        path="*"
        element={
          isAuthenticated ? <PageNotFound /> : <Navigate to="/Login" replace />
        }
      />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthHashRedirect />
          <NavigationTracker />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;
