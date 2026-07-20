import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useState, useEffect } from "react";
import { db } from "@/api/localClient";

import { GrayOceanWordmark, LogoMark } from "@/components/GrayOceanLogo";
import ThemeToggle from "@/components/ThemeToggle";
import {
  ShieldCheck,
  MapPin,
  LayoutList,
  GitCompare,
  Search,
  MessageSquare,
  Code2,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";

const NAV_ITEMS = [
  { name: "SSN Lookup", page: "SSNLookup", icon: ShieldCheck },
  { name: "Address Intel", page: "AddressLookup", icon: MapPin },
  { name: "Batch Analysis", page: "BatchAnalysis", icon: LayoutList },
  { name: "Compare", page: "Comparison", icon: GitCompare },
  { name: "Skiptrace", page: "Skiptrace", icon: Search },
  { name: "Forum", page: "Forum", icon: MessageSquare },
];

const API_ITEM = { name: "API", page: "API", icon: Code2 };

function SidebarNav({ collapsed, currentPageName, onClose }) {
  return (
    <nav className="flex flex-col h-full px-2 pt-2">
      <ul className="flex-1 space-y-px">
        {NAV_ITEMS.map(({ name, page, icon: Icon }) => {
          const active = currentPageName === page;
          return (
            <li key={page}>
              <Link
                to={createPageUrl(page)}
                onClick={onClose}
                title={collapsed ? name : undefined}
                className={`go-sidebar-nav-link ${active ? "is-active" : ""} ${
                  collapsed ? "justify-center !px-0" : ""
                }`}
              >
                <Icon size={18} strokeWidth={1.5} className="flex-shrink-0 opacity-80" />
                {!collapsed && <span className="truncate">{name}</span>}
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="pb-2 pt-2" style={{ borderTop: "1px solid var(--go-border-subtle)" }}>
        <Link
          to={createPageUrl(API_ITEM.page)}
          onClick={onClose}
          title={collapsed ? API_ITEM.name : undefined}
          className={`go-sidebar-nav-link ${
            currentPageName === "API" ? "is-active" : ""
          } ${collapsed ? "justify-center !px-0" : ""}`}
        >
          <Code2 size={18} strokeWidth={1.5} className="flex-shrink-0 opacity-80" />
          {!collapsed && <span>API</span>}
        </Link>
      </div>
    </nav>
  );
}

export default function Layout({ children, currentPageName }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    db.auth.me().then(setUser).catch(() => setUser(null));
  }, []);

  const initials = user?.full_name
    ? user.full_name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "GO";

  const pageTitleMap = {
    SSNLookup: "SSN Lookup",
    AddressLookup: "Address Intel",
    BatchAnalysis: "Batch Analysis",
    Comparison: "Compare",
    Skiptrace: "Skiptrace",
    Forum: "Forum",
    API: "API",
    Account: "Account",
    Pricing: "Pricing",
  };
  const pageTitle =
    pageTitleMap[currentPageName] ??
    currentPageName?.replace(/([A-Z])/g, " $1").trim();

  return (
    <div className="go-app-frame go-grain">
      <aside
        className={`go-sidebar hidden md:flex flex-col flex-shrink-0 transition-[width] duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          collapsed ? "w-[56px]" : "w-[220px]"
        }`}
      >
        <div
          className={`flex items-center h-13 px-3 ${
            collapsed ? "justify-center" : "justify-between"
          }`}
          style={{
            height: 52,
            borderBottom: "1px solid var(--go-border-subtle)",
          }}
        >
          {!collapsed ? (
            <Link to="/" className="inline-flex items-center gap-2.5 min-w-0 pl-0.5">
              <LogoMark size={18} />
              <GrayOceanWordmark size="sm" />
            </Link>
          ) : (
            <Link to="/" aria-label="GrayOcean home">
              <LogoMark size={18} />
            </Link>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg transition-colors hover:bg-[var(--go-bg-elevated)]"
            style={{ color: "var(--go-text-muted)" }}
            aria-label="Toggle sidebar"
          >
            {collapsed ? (
              <ChevronRight size={16} strokeWidth={1.5} />
            ) : (
              <ChevronLeft size={16} strokeWidth={1.5} />
            )}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden py-1">
          <SidebarNav
            collapsed={collapsed}
            currentPageName={currentPageName}
            onClose={() => {}}
          />
        </div>

        <div
          className={`px-2.5 py-3 flex items-center gap-2.5 ${collapsed ? "justify-center" : ""}`}
          style={{ borderTop: "1px solid var(--go-border-subtle)" }}
        >
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-medium flex-shrink-0"
            style={{
              background: "var(--go-bg-elevated)",
              border: "1px solid var(--go-border)",
              color: "var(--go-text-secondary)",
            }}
          >
            {initials}
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-medium truncate leading-tight" style={{ color: "var(--go-text)" }}>
                {user?.full_name || "Workspace"}
              </p>
              <p className="text-[12px] truncate leading-tight mt-0.5" style={{ color: "var(--go-text-muted)" }}>
                Local mode
              </p>
            </div>
          )}
        </div>
      </aside>

      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="go-sidebar w-[260px] flex flex-col backdrop-blur-[20px]">
            <div
              className="flex items-center justify-between px-3"
              style={{
                height: 52,
                borderBottom: "1px solid var(--go-border-subtle)",
              }}
            >
              <span className="inline-flex items-center gap-2.5">
                <LogoMark size={18} />
                <GrayOceanWordmark size="sm" />
              </span>
              <button onClick={() => setMobileOpen(false)} style={{ color: "var(--go-text-secondary)" }}>
                <X size={18} strokeWidth={1.5} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <SidebarNav
                collapsed={false}
                currentPageName={currentPageName}
                onClose={() => setMobileOpen(false)}
              />
            </div>
          </div>
          <div
            className="flex-1"
            style={{ background: "var(--go-bg-overlay)" }}
            onClick={() => setMobileOpen(false)}
          />
        </div>
      )}

      <div className="go-main-wash">
        <header className="go-topbar">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-1.5 rounded-lg hover:bg-[var(--go-bg-elevated)] transition-colors"
              style={{ color: "var(--go-text-secondary)" }}
            >
              <Menu size={18} strokeWidth={1.5} />
            </button>
            <span className="md:hidden inline-flex items-center gap-2">
              <LogoMark size={16} />
              <GrayOceanWordmark size="sm" />
            </span>
            <h1
              className="hidden md:block text-[14px] font-medium truncate"
              style={{ color: "var(--go-text)", letterSpacing: "-0.01em" }}
            >
              {pageTitle}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="hidden sm:inline-flex items-center gap-1.5 h-8 px-2.5 rounded-lg text-[12px] font-medium transition-colors hover:bg-[var(--go-bg-elevated)]"
              style={{ color: "var(--go-text-muted)" }}
              title="Marketing site"
            >
              <ExternalLink size={14} strokeWidth={1.5} />
              Site
            </Link>
            <ThemeToggle />
            <Link
              to={createPageUrl("Account")}
              title={user?.full_name || "Workspace"}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-medium select-none"
              style={{
                background: "var(--go-bg-elevated)",
                border: "1px solid var(--go-border)",
                color: "var(--go-text-secondary)",
              }}
            >
              {initials}
            </Link>
          </div>
        </header>

        <main className="go-main-scroll">{children}</main>
      </div>
    </div>
  );
}
