import React, { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataPanel } from "@/components/shared/DataPanel";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";
import { SearchInput } from "@/components/shared/SearchInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  adminAdjustCredits,
  adminConfirmCreditOrder,
  adminSetUserRole,
  fetchAdminStats,
  fetchAdminUserDetail,
  fetchAdminUsers,
  formatCents,
} from "@/lib/adminApi";
import { Shield, Users, Wallet, Clock } from "lucide-react";

function roleStatus(role) {
  return role === "admin" ? "info" : "neutral";
}

function subscriptionStatus(status) {
  if (status === "active") return "success";
  if (status === "expired" || status === "cancelled") return "danger";
  if (status === "trial") return "warning";
  return "neutral";
}

export default function AdminPage() {
  const { user, isAuthenticated } = useAuth();
  const isAdmin = user?.role === "admin";

  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [actionError, setActionError] = useState("");
  const [actionBusy, setActionBusy] = useState(false);

  const [creditAmount, setCreditAmount] = useState("10.00");
  const [creditNote, setCreditNote] = useState("Manual adjustment");
  const [creditType, setCreditType] = useState("manual_adjustment");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [s, list] = await Promise.all([
        fetchAdminStats(),
        fetchAdminUsers(),
      ]);
      setStats(s);
      setUsers(list);
    } catch (err) {
      setError(err.message || "Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) load();
  }, [isAdmin]);

  useEffect(() => {
    if (!selectedId || !isAdmin) {
      setDetail(null);
      return;
    }
    let cancelled = false;
    (async () => {
      setDetailLoading(true);
      setActionError("");
      try {
        const data = await fetchAdminUserDetail(selectedId);
        if (!cancelled) setDetail(data);
      } catch (err) {
        if (!cancelled) setActionError(err.message || "Failed to load user");
      } finally {
        if (!cancelled) setDetailLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [selectedId, isAdmin]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) => {
      const hay = `${u.email || ""} ${u.full_name || ""} ${u.role || ""} ${u.id}`.toLowerCase();
      return hay.includes(q);
    });
  }, [users, query]);

  if (!isAuthenticated) return <Navigate to="/Login" replace />;
  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-lg px-go-page-x py-go-8">
        <ErrorState
          title="Admin access required"
          description="Your account is not an admin. Ask an existing admin to promote you, or run the first-admin SQL in SUPABASE_SETUP.md."
        />
      </div>
    );
  }

  const profile = detail?.profile;

  const onSetRole = async (role) => {
    if (!selectedId) return;
    setActionBusy(true);
    setActionError("");
    try {
      await adminSetUserRole(selectedId, role);
      await load();
      const data = await fetchAdminUserDetail(selectedId);
      setDetail(data);
    } catch (err) {
      setActionError(err.message || "Role update failed");
    } finally {
      setActionBusy(false);
    }
  };

  const onAdjustCredits = async (sign) => {
    if (!selectedId) return;
    const dollars = Number(creditAmount);
    if (!Number.isFinite(dollars) || dollars <= 0) {
      setActionError("Enter a positive dollar amount");
      return;
    }
    const cents = Math.round(dollars * 100) * sign;
    setActionBusy(true);
    setActionError("");
    try {
      await adminAdjustCredits(selectedId, cents, creditNote, creditType);
      await load();
      const data = await fetchAdminUserDetail(selectedId);
      setDetail(data);
    } catch (err) {
      setActionError(err.message || "Credit adjustment failed");
    } finally {
      setActionBusy(false);
    }
  };

  const onConfirmOrder = async (orderId) => {
    setActionBusy(true);
    setActionError("");
    try {
      await adminConfirmCreditOrder(orderId);
      await load();
      if (selectedId) {
        const data = await fetchAdminUserDetail(selectedId);
        setDetail(data);
      }
    } catch (err) {
      setActionError(err.message || "Could not confirm order");
    } finally {
      setActionBusy(false);
    }
  };

  return (
    <div className="min-h-full bg-go-bg">
      <div className="mx-auto max-w-[1100px] px-3 py-8 sm:px-4 sm:py-10 md:px-8">
        <PageHeader
          title="Admin"
          description="Manage users, roles, and prepaid credit balances."
          actions={
            <Button type="button" variant="outline" size="sm" onClick={load}>
              Refresh
            </Button>
          }
        />

        <div className="space-y-6">
        {loading ? <LoadingState label="Loading admin dashboard…" /> : null}
        {error ? (
          <ErrorState title="Could not load admin data" description={error} onAction={load} />
        ) : null}

        {!loading && !error && stats ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard icon={Users} label="Users" value={String(stats.user_count ?? 0)} />
            <StatCard icon={Shield} label="Admins" value={String(stats.admin_count ?? 0)} />
            <StatCard
              icon={Wallet}
              label="Total credits"
              value={formatCents(stats.total_credit_balance_cents)}
            />
            <StatCard
              icon={Clock}
              label="Pending orders"
              value={String(stats.pending_orders ?? 0)}
            />
          </div>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <DataPanel
            title="Users"
            description="Select a user to view full account detail."
            actions={
              <div className="w-full sm:w-64">
                <SearchInput
                  placeholder="Search name, email, role…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
            }
            bodyClassName="p-0"
          >
            {filtered.length === 0 ? (
              <EmptyState title="No users found" description="Try a different search." />
            ) : (
              <div className="overflow-x-auto">
              <Table className="min-w-[560px]">
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Credits</TableHead>
                    <TableHead className="hidden sm:table-cell">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((u) => (
                    <TableRow
                      key={u.id}
                      className={
                        selectedId === u.id
                          ? "bg-go-primary-muted cursor-pointer"
                          : "cursor-pointer"
                      }
                      onClick={() => setSelectedId(u.id)}
                    >
                      <TableCell>
                        <div className="min-w-0">
                          <p className="truncate font-medium text-go-text">
                            {u.full_name || "—"}
                          </p>
                          <p className="truncate text-go-meta text-go-text-muted">
                            {u.email}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <StatusBadge
                          status={roleStatus(u.role)}
                          label={u.role || "user"}
                        />
                      </TableCell>
                      <TableCell className="tabular-nums">
                        {formatCents(u.credit_balance_cents)}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <StatusBadge
                          status={subscriptionStatus(u.subscription_status)}
                          label={u.subscription_status || "—"}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              </div>
            )}
          </DataPanel>

          <div className="space-y-4">
            {!selectedId ? (
              <DataPanel title="User detail">
                <EmptyState
                  title="Select a user"
                  description="Choose a row to inspect credits, ledger, and roles."
                />
              </DataPanel>
            ) : detailLoading ? (
              <DataPanel title="User detail">
                <LoadingState label="Loading user…" />
              </DataPanel>
            ) : profile ? (
              <>
                <DataPanel
                  title={profile.full_name || profile.email || "User"}
                  description={profile.email}
                  actions={
                    <StatusBadge
                      status={roleStatus(profile.role)}
                      label={profile.role}
                    />
                  }
                >
                  <dl className="grid gap-3 sm:grid-cols-2">
                    <InfoItem label="User ID" value={profile.id} mono />
                    <InfoItem
                      label="Credit balance"
                      value={formatCents(profile.credit_balance_cents)}
                    />
                    <InfoItem
                      label="Subscription"
                      value={profile.subscription_status || "—"}
                    />
                    <InfoItem
                      label="Verified"
                      value={profile.is_verified ? "Yes" : "No"}
                    />
                    <InfoItem
                      label="Trial ends"
                      value={
                        profile.trial_ends
                          ? new Date(profile.trial_ends).toLocaleString()
                          : "—"
                      }
                    />
                    <InfoItem
                      label="Last payment"
                      value={
                        profile.last_payment_date
                          ? new Date(profile.last_payment_date).toLocaleString()
                          : "—"
                      }
                    />
                    <InfoItem
                      label="Created"
                      value={
                        profile.created_at
                          ? new Date(profile.created_at).toLocaleString()
                          : "—"
                      }
                    />
                    <InfoItem
                      label="Plan"
                      value={profile.plan_type || "—"}
                    />
                  </dl>

                  {actionError ? (
                    <p className="mt-3 text-[13px] text-go-danger" role="alert">
                      {actionError}
                    </p>
                  ) : null}

                  <div className="mt-4 flex flex-wrap gap-2 border-t border-go-border pt-4">
                    {profile.role === "admin" ? (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={actionBusy || profile.id === user.id}
                        onClick={() => onSetRole("user")}
                      >
                        Remove admin
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        size="sm"
                        disabled={actionBusy}
                        onClick={() => onSetRole("admin")}
                      >
                        Make admin
                      </Button>
                    )}
                    {profile.id === user.id ? (
                      <span className="self-center text-[12px] text-go-text-muted">
                        You cannot demote yourself here.
                      </span>
                    ) : null}
                  </div>
                </DataPanel>

                <DataPanel title="Adjust credits" description="Creates an immutable ledger entry.">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="creditAmount">Amount (USD)</Label>
                      <Input
                        id="creditAmount"
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={creditAmount}
                        onChange={(e) => setCreditAmount(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Entry type</Label>
                      <Select value={creditType} onValueChange={setCreditType}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="manual_adjustment">Manual adjustment</SelectItem>
                          <SelectItem value="promotional_credit">Promotional credit</SelectItem>
                          <SelectItem value="refund_adjustment">Refund adjustment</SelectItem>
                          <SelectItem value="expired_credit">Expired credit</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label htmlFor="creditNote">Note</Label>
                      <Input
                        id="creditNote"
                        value={creditNote}
                        onChange={(e) => setCreditNote(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button
                      type="button"
                      size="sm"
                      disabled={actionBusy}
                      onClick={() => onAdjustCredits(1)}
                    >
                      Add credits
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      disabled={actionBusy}
                      onClick={() => onAdjustCredits(-1)}
                    >
                      Deduct credits
                    </Button>
                  </div>
                </DataPanel>

                <DataPanel title="Ledger (recent)">
                  <MiniTable
                    empty="No ledger entries"
                    rows={detail.ledger || []}
                    columns={[
                      {
                        key: "created_at",
                        label: "When",
                        render: (r) => new Date(r.created_at).toLocaleString(),
                      },
                      { key: "entry_type", label: "Type" },
                      {
                        key: "amount_cents",
                        label: "Amount",
                        render: (r) => formatCents(r.amount_cents),
                      },
                      {
                        key: "balance_after_cents",
                        label: "Balance",
                        render: (r) => formatCents(r.balance_after_cents),
                      },
                    ]}
                  />
                </DataPanel>

                <DataPanel title="Credit orders">
                  <MiniTable
                    empty="No credit orders"
                    rows={detail.credit_orders || []}
                    columns={[
                      {
                        key: "created_at",
                        label: "When",
                        render: (r) => new Date(r.created_at).toLocaleString(),
                      },
                      { key: "status", label: "Status" },
                      {
                        key: "usd_credit_amount_cents",
                        label: "Credits",
                        render: (r) => formatCents(r.usd_credit_amount_cents),
                      },
                      { key: "network", label: "Network" },
                      {
                        key: "actions",
                        label: "Action",
                        render: (r) =>
                          r.status !== "credited" &&
                          r.status !== "rejected" &&
                          r.status !== "expired" ? (
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              disabled={actionBusy}
                              onClick={() => onConfirmOrder(r.id)}
                            >
                              Confirm & credit
                            </Button>
                          ) : (
                            "—"
                          ),
                      },
                    ]}
                  />
                </DataPanel>

                <DataPanel title="Lookup charges">
                  <MiniTable
                    empty="No lookup charges"
                    rows={detail.lookup_charges || []}
                    columns={[
                      {
                        key: "created_at",
                        label: "When",
                        render: (r) => new Date(r.created_at).toLocaleString(),
                      },
                      { key: "search_type", label: "Type" },
                      { key: "search_status", label: "Status" },
                      {
                        key: "retail_charge_cents",
                        label: "Charge",
                        render: (r) => formatCents(r.retail_charge_cents),
                      },
                    ]}
                  />
                </DataPanel>
              </>
            ) : (
              <ErrorState
                title="User detail unavailable"
                description={actionError || "Try selecting another user."}
              />
            )}
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-go-lg border border-go-border bg-go-surface px-go-4 py-go-3 shadow-go-xs">
      <div className="flex items-center gap-2 text-go-text-muted">
        <Icon className="size-4" aria-hidden />
        <span className="text-go-meta font-medium">{label}</span>
      </div>
      <p className="mt-1 text-go-section text-go-text tabular-nums">{value}</p>
    </div>
  );
}

function InfoItem({ label, value, mono }) {
  return (
    <div className="min-w-0">
      <dt className="text-go-label text-go-text-muted">{label}</dt>
      <dd
        className={`mt-0.5 text-go-body text-go-text break-all ${mono ? "font-mono text-go-body-sm" : ""}`}
      >
        {value}
      </dd>
    </div>
  );
}

function MiniTable({ rows, columns, empty }) {
  if (!rows?.length) {
    return <p className="text-go-body-sm text-go-text-muted">{empty}</p>;
  }
  return (
    <div className="-mx-go-4 overflow-x-auto md:-mx-go-5">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((c) => (
              <TableHead key={c.key}>{c.label}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, idx) => (
            <TableRow key={row.id || idx}>
              {columns.map((c) => (
                <TableCell key={c.key} className="text-go-body-sm">
                  {c.render ? c.render(row) : row[c.key] ?? "—"}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
