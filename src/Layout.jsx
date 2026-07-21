import { useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import AnnouncementBox from "@/components/AnnouncementBox";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { TopHeader } from "@/components/dashboard/TopHeader";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  ShieldCheck,
  MapPin,
  LayoutList,
  GitCompare,
  Search,
  MessageSquare,
  Code2,
  Fingerprint,
  Shield,
  CreditCard,
} from "lucide-react";

const NAV_GROUPS = [
  {
    label: "Workspace",
    items: [
      { name: "SSN Lookup", page: "SSNLookup", icon: ShieldCheck },
      { name: "Address Intelligence", page: "AddressLookup", icon: MapPin },
      { name: "Batch Analysis", page: "BatchAnalysis", icon: LayoutList },
      { name: "Compare", page: "Comparison", icon: GitCompare },
      { name: "Skiptrace", page: "Skiptrace", icon: Search },
      { name: "TLO Lookup", page: null, icon: Fingerprint, soon: true },
    ],
  },
  {
    label: "Account",
    items: [{ name: "Pricing", page: "Pricing", icon: CreditCard }],
  },
  {
    label: "Community",
    items: [{ name: "Forum", page: "Forum", icon: MessageSquare }],
  },
  {
    label: "Developers",
    items: [{ name: "API", page: "API", icon: Code2 }],
  },
  {
    label: "Administration",
    adminOnly: true,
    items: [{ name: "Admin", page: "Admin", icon: Shield }],
  },
];

const PAGE_TITLES = {
  SSNLookup: "SSN Lookup",
  AddressLookup: "Address Intelligence",
  BatchAnalysis: "Batch Analysis",
  Comparison: "Compare",
  Skiptrace: "Skiptrace",
  Forum: "Forum",
  API: "API",
  Account: "Account",
  Pricing: "Pricing",
  Admin: "Admin",
};

export default function Layout({ children, currentPageName }) {
  const { user, navigateToLogin } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isAdmin = user?.role === "admin";

  const initials = user?.full_name
    ? user.full_name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : user?.email
      ? user.email.slice(0, 2).toUpperCase()
      : "?";

  const pageTitle =
    PAGE_TITLES[currentPageName] ??
    currentPageName?.replace(/([A-Z])/g, " $1").trim();

  const groups = NAV_GROUPS.filter((g) => !g.adminOnly || isAdmin);
  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      <div className="flex h-screen overflow-hidden bg-go-bg">
        <div className="hidden md:block">
          <AppSidebar
            groups={groups}
            currentPageName={currentPageName}
            user={user}
            initials={initials}
            onSignIn={navigateToLogin}
          />
        </div>

        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent
            side="left"
            className="w-[min(100vw,276px)] border-go-border bg-go-sidebar p-0 sm:max-w-[276px] [&>button]:right-2 [&>button]:top-4 [&>button]:flex [&>button]:size-10 [&>button]:items-center [&>button]:justify-center [&>button]:text-go-text-muted"
          >
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <SheetDescription className="sr-only">
              Gray Ocean workspace navigation
            </SheetDescription>
            <AppSidebar
              groups={groups}
              currentPageName={currentPageName}
              user={user}
              initials={initials}
              onNavigate={closeMobile}
              onSignIn={() => {
                closeMobile();
                navigateToLogin();
              }}
              className="border-r-0"
            />
          </SheetContent>
        </Sheet>

        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <TopHeader
            title={pageTitle}
            onOpenNav={() => setMobileOpen(true)}
            user={user}
            initials={initials}
          />
          <main className="min-h-0 flex-1 overflow-y-auto bg-go-bg">
            {children}
          </main>
        </div>
      </div>
      <AnnouncementBox />
    </>
  );
}
