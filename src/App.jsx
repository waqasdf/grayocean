import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import NavigationTracker from '@/lib/NavigationTracker'
import { pagesConfig } from './pages.config'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import { ThemeProvider } from '@/lib/ThemeProvider';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';

import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import RequestAccess from './pages/RequestAccess';

import {
  Landing,
  Product,
  ProductSsn,
  ProductAddress,
  ProductBatch,
  ProductSkiptrace,
  ProductApi,
  Solutions,
  SolutionsInvestigations,
  SolutionsCompliance,
  SolutionsLending,
  SolutionsFraud,
  SitePricing,
  Docs,
  DocsGettingStarted,
  DocsGuides,
  DocsApi,
  DocsExamples,
  DocsSdk,
  Blog,
  BlogPost,
  Guides,
  Changelog,
  Roadmap,
  Status,
  Community,
  Help,
  About,
  Careers,
  Contact,
  Security,
  Trust,
  Privacy,
  Terms,
  Signup,
  ResetPassword,
  VerifyEmail,
  Invite,
  MagicLink,
  WaitingApproval,
  AccountDisabled,
  ServerError,
  Maintenance,
} from './pages/site';

const { Pages, Layout, mainPage } = pagesConfig;
const mainPageKey = mainPage ?? Object.keys(Pages)[0];

const LayoutWrapper = ({ children, currentPageName }) => Layout ?
  <Layout currentPageName={currentPageName}>{children}</Layout>
  : <>{children}</>;

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="go-app-loading">
        <div className="go-app-spinner" />
      </div>
    );
  }

  if (authError?.type === 'user_not_registered') {
    return <UserNotRegisteredError />;
  }

  return (
    <Routes>
      {/* Marketing */}
      <Route path="/" element={<Landing />} />
      <Route path="/product" element={<Product />} />
      <Route path="/product/ssn-lookup" element={<ProductSsn />} />
      <Route path="/product/address-intel" element={<ProductAddress />} />
      <Route path="/product/batch" element={<ProductBatch />} />
      <Route path="/product/skiptrace" element={<ProductSkiptrace />} />
      <Route path="/product/api" element={<ProductApi />} />
      <Route path="/solutions" element={<Solutions />} />
      <Route path="/solutions/investigations" element={<SolutionsInvestigations />} />
      <Route path="/solutions/compliance" element={<SolutionsCompliance />} />
      <Route path="/solutions/lending" element={<SolutionsLending />} />
      <Route path="/solutions/fraud" element={<SolutionsFraud />} />
      <Route path="/pricing" element={<SitePricing />} />
      <Route path="/docs" element={<Docs />} />
      <Route path="/docs/getting-started" element={<DocsGettingStarted />} />
      <Route path="/docs/guides" element={<DocsGuides />} />
      <Route path="/docs/api" element={<DocsApi />} />
      <Route path="/docs/examples" element={<DocsExamples />} />
      <Route path="/docs/sdk" element={<DocsSdk />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:slug" element={<BlogPost />} />
      <Route path="/guides" element={<Guides />} />
      <Route path="/changelog" element={<Changelog />} />
      <Route path="/roadmap" element={<Roadmap />} />
      <Route path="/status" element={<Status />} />
      <Route path="/community" element={<Community />} />
      <Route path="/help" element={<Help />} />
      <Route path="/about" element={<About />} />
      <Route path="/careers" element={<Careers />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/security" element={<Security />} />
      <Route path="/trust" element={<Trust />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />

      {/* Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/request-access" element={<RequestAccess />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/invite" element={<Invite />} />
      <Route path="/magic-link" element={<MagicLink />} />
      <Route path="/waiting-approval" element={<WaitingApproval />} />
      <Route path="/account-disabled" element={<AccountDisabled />} />

      {/* System */}
      <Route path="/500" element={<ServerError />} />
      <Route path="/maintenance" element={<Maintenance />} />

      {/* App workspace shortcut */}
      <Route path="/app" element={<Navigate to={`/${mainPageKey}`} replace />} />

      {/* Existing product pages (dashboard) */}
      {Object.entries(Pages).map(([path, Page]) => (
        <Route
          key={path}
          path={`/${path}`}
          element={
            <LayoutWrapper currentPageName={path}>
              <Page />
            </LayoutWrapper>
          }
        />
      ))}

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <AuthProvider>
        <QueryClientProvider client={queryClientInstance}>
          <Router>
            <NavigationTracker />
            <AuthenticatedApp />
          </Router>
          <Toaster />
        </QueryClientProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
