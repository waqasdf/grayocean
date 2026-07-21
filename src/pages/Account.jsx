import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "@/entities/User";
import { createPageUrl } from "@/utils";
import { MinimalBadge } from "@/components/ui/minimal-badge";
import {
  WorkspacePage,
  WorkspacePanel,
  PrimaryButton,
  GhostButton,
} from "@/components/dashboard";
import {
  listMyCreditOrders,
  listMyLedger,
  formatCents,
  ORDER_STATUS_LABELS,
} from "@/lib/creditsApi";

export default function AccountPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [ledger, setLedger] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadUser = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const currentUser = await User.me();
      setUser(currentUser);
      const [o, l] = await Promise.all([
        listMyCreditOrders(10),
        listMyLedger(15),
      ]);
      setOrders(o);
      setLedger(l);
    } catch (err) {
      console.error("Error loading user:", err);
      if (
        err.message?.includes("Unauthorized") ||
        err.message?.includes("not authenticated") ||
        err.status === 401
      ) {
        await User.loginWithRedirect(window.location.href);
        return;
      }
      setError("Failed to load account information. Please try again.");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  if (loading) {
    return (
      <div className="flex min-h-full items-center justify-center bg-go-bg">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-go-border border-t-go-text" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-full items-center justify-center bg-go-bg px-4">
        <WorkspacePanel className="w-full max-w-md">
          <div className="text-center">
            <div className="mb-4 text-sm text-go-danger">{error}</div>
            <PrimaryButton onClick={loadUser}>Retry</PrimaryButton>
          </div>
        </WorkspacePanel>
      </div>
    );
  }

  const balance =
    typeof user?.credit_balance_cents === "number" ? user.credit_balance_cents : 0;

  return (
    <WorkspacePage
      title="Account"
      description="Prepaid usage balance and account details. Credits are not a crypto wallet."
      maxWidth="max-w-4xl"
    >
      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-6 md:col-span-2">
          <WorkspacePanel title="Credit balance">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
              <div>
                <div className="text-[12px] text-go-text-muted">Available balance</div>
                <div className="mt-1 text-[32px] font-semibold tracking-tight text-go-text">
                  {formatCents(balance)}
                </div>
              </div>
              <PrimaryButton
                type="button"
                onClick={() => navigate(createPageUrl("Pricing"))}
              >
                Add credits
              </PrimaryButton>
            </div>
            <p className="text-[13px] leading-relaxed text-go-text-secondary">
              Lookups deduct from this prepaid usage balance. Credits cannot be withdrawn,
              transferred, or converted back to USDC. Network for purchases:{" "}
              <span className="font-medium text-go-text">USDC on Base only</span>.
            </p>
          </WorkspacePanel>

          <WorkspacePanel title="Account details">
            <div className="space-y-4">
              <div>
                <div className="mb-1 text-[12px] text-go-text-muted">Name</div>
                <div className="text-sm text-go-text">{user?.full_name || "Not provided"}</div>
              </div>
              <div>
                <div className="mb-1 text-[12px] text-go-text-muted">Email</div>
                <div className="text-sm break-all text-go-text">{user?.email}</div>
              </div>
              <div>
                <div className="mb-1 text-[12px] text-go-text-muted">Role</div>
                <div className="text-sm capitalize text-go-text">{user?.role || "user"}</div>
              </div>
            </div>
          </WorkspacePanel>

          <WorkspacePanel title="Recent credit orders">
            {orders.length === 0 ? (
              <p className="text-[13px] text-go-text-muted">No orders yet.</p>
            ) : (
              <div className="divide-y divide-go-border">
                {orders.map((o) => (
                  <div
                    key={o.id}
                    className="flex flex-wrap items-center justify-between gap-2 py-3 first:pt-0 last:pb-0"
                  >
                    <div>
                      <div className="font-mono text-[12px] text-go-text-muted">
                        {o.id.slice(0, 8)}…
                      </div>
                      <div className="text-[13px] text-go-text">
                        {formatCents(o.usd_credit_amount_cents)} · {Number(o.usdc_amount)} USDC
                      </div>
                    </div>
                    <MinimalBadge variant="neutral" size="sm">
                      {ORDER_STATUS_LABELS[o.status] || o.status}
                    </MinimalBadge>
                  </div>
                ))}
              </div>
            )}
          </WorkspacePanel>

          <WorkspacePanel title="Ledger">
            {ledger.length === 0 ? (
              <p className="text-[13px] text-go-text-muted">No ledger entries yet.</p>
            ) : (
              <div className="divide-y divide-go-border">
                {ledger.map((e) => (
                  <div
                    key={e.id}
                    className="flex flex-wrap items-center justify-between gap-2 py-3 first:pt-0 last:pb-0"
                  >
                    <div>
                      <div className="text-[13px] text-go-text">{e.entry_type}</div>
                      <div className="text-[12px] text-go-text-muted">
                        {e.description || new Date(e.created_at).toLocaleString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`font-mono text-[13px] ${
                          e.amount_cents < 0 ? "text-go-text-secondary" : "text-go-text"
                        }`}
                      >
                        {e.amount_cents > 0 ? "+" : ""}
                        {formatCents(e.amount_cents)}
                      </div>
                      <div className="text-[11px] text-go-text-muted">
                        bal {formatCents(e.balance_after_cents)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </WorkspacePanel>
        </div>

        <div className="space-y-6">
          <WorkspacePanel title="Quick actions">
            <div className="space-y-2">
              <GhostButton
                className="w-full justify-start"
                type="button"
                onClick={() => navigate(createPageUrl("Pricing"))}
              >
                Pricing & packages
              </GhostButton>
              <GhostButton
                className="w-full justify-start"
                type="button"
                onClick={() => User.logout()}
              >
                Sign out
              </GhostButton>
            </div>
          </WorkspacePanel>
        </div>
      </div>
    </WorkspacePage>
  );
}
