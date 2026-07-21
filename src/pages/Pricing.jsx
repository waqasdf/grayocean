import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Check, Copy, CheckCircle2, X } from "lucide-react";
import { createPageUrl } from "@/utils";
import { useAuth } from "@/lib/AuthContext";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  listCreditPackages,
  listLookupPrices,
  createCreditOrder,
  submitCreditOrderTx,
  formatCents,
  ORDER_STATUS_LABELS,
  LOOKUP_PRICE_ORDER,
} from "@/lib/creditsApi";

const TIER_META = {
  starter: {
    subtitle: "For independent investigators and evaluation.",
    cta: "Get started",
    highlight: false,
    features: [
      "$100 prepaid credit balance",
      "SSN validation & address tools",
      "Batch analysis (unit price)",
      "Skiptrace basic",
      "USDC on Base funding",
    ],
  },
  team: {
    subtitle: "For small teams running regular lookups.",
    cta: "Get started",
    highlight: true,
    badge: "Recommended",
    features: [
      "$500 prepaid credit balance",
      "Everything in Starter",
      "Higher practical volume",
      "Shared investigative workflow",
      "USDC on Base funding",
    ],
  },
  operations: {
    subtitle: "For high-volume investigative workloads.",
    cta: "Get started",
    highlight: false,
    features: [
      "$1,000 prepaid credit balance",
      "Everything in Team",
      "Priority batch processing*",
      "Ops-scale credit runway",
      "USDC on Base funding",
    ],
  },
};

const ENTERPRISE_TIER = {
  id: "enterprise",
  name: "Enterprise",
  priceLabel: "Custom",
  subtitle: "Annual invoicing & negotiated terms.",
  cta: "Contact sales",
  features: [
    "Everything in Operations",
    "Custom invoicing / PO",
    "API, team controls & limits",
    "Negotiated lookup pricing",
    "Dedicated onboarding support",
  ],
};

const COMPARE_SECTIONS = [
  {
    title: "Credits & funding",
    rows: [
      {
        label: "Prepaid credit packages",
        values: ["$100", "$500", "$1,000", "Custom"],
      },
      {
        label: "USDC on Base only",
        values: [true, true, true, true],
      },
      {
        label: "Minimum initial purchase $100",
        values: [true, true, true, "Negotiated"],
      },
      {
        label: "$50 reload after first purchase",
        values: [true, true, true, true],
      },
      {
        label: "Credits withdrawable / transferable",
        values: [false, false, false, false],
      },
    ],
  },
  {
    title: "Lookups",
    rows: [
      { label: "SSN validation", values: [true, true, true, true] },
      {
        label: "Address verification & enrichment",
        values: [true, true, true, true],
      },
      { label: "Batch analysis", values: [true, true, true, true] },
      { label: "Basic skiptrace", values: [true, true, true, true] },
      { label: "Enhanced skiptrace", values: [true, true, true, true] },
      {
        label: "Price shown before each search",
        values: [true, true, true, true],
      },
    ],
  },
  {
    title: "Platform",
    rows: [
      { label: "Forum access", values: [true, true, true, true] },
      { label: "API access", values: [false, false, "Priority*", true] },
      { label: "Team admin controls", values: [false, false, false, true] },
      { label: "Invoice / PO billing", values: [false, false, false, true] },
      { label: "Priority support", values: [false, false, true, true] },
    ],
  },
];

function CircleCheck({ className, muted = false }) {
  return (
    <span
      className={cn(
        "inline-flex size-[18px] shrink-0 items-center justify-center rounded-full",
        muted
          ? "bg-white/[0.08] text-go-text-secondary"
          : "bg-go-primary text-white",
        className
      )}
      aria-hidden
    >
      <Check className="size-2.5 stroke-[3]" />
    </span>
  );
}

function CellValue({ value }) {
  if (value === true) {
    return (
      <span className="inline-flex justify-center">
        <CircleCheck />
      </span>
    );
  }
  if (value === false) {
    return (
      <span
        className="inline-flex justify-center text-go-text-muted/70"
        aria-label="Not included"
      >
        <X className="size-3.5 stroke-[1.5]" />
      </span>
    );
  }
  return <span className="text-[13px] text-go-text-secondary">{value}</span>;
}

function CopyField({ label, value }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(String(value));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  };
  return (
    <div className="space-y-2">
      <div className="text-[11px] font-medium uppercase tracking-[0.06em] text-go-text-muted">
        {label}
      </div>
      <div className="flex items-center gap-2">
        <code className="min-w-0 flex-1 truncate rounded-xl border border-go-border bg-go-surface-elevated px-3.5 py-2.5 font-mono text-[12px] text-go-text">
          {value}
        </code>
        <button
          type="button"
          onClick={copy}
          className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl border border-go-border text-go-text-secondary go-transition hover:border-go-border-strong hover:bg-white/[0.04] hover:text-go-text"
        >
          {copied ? <CheckCircle2 className="size-3.5" /> : <Copy className="size-3.5" />}
        </button>
      </div>
    </div>
  );
}

function PlanCta({ highlight, disabled, onClick, children, className }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "mt-auto inline-flex h-11 w-full items-center justify-center rounded-full px-5",
        "text-[13px] font-medium tracking-[-0.01em] go-transition",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-go-primary focus-visible:ring-offset-2 focus-visible:ring-offset-go-bg",
        "disabled:cursor-not-allowed disabled:opacity-50",
        highlight
          ? "bg-go-primary text-white shadow-[0_0_0_1px_rgba(67,88,165,0.35)] hover:bg-go-primary-hover"
          : "border border-go-border bg-transparent text-go-text hover:border-go-border-strong hover:bg-white/[0.04]",
        className
      )}
    >
      {children}
    </button>
  );
}

function TierColumn({
  name,
  price,
  priceNote,
  networkNote,
  subtitle,
  features,
  highlight,
  badge,
  cta,
  busy,
  onCta,
  className,
}) {
  return (
    <div
      className={cn(
        "group relative flex flex-col rounded-2xl px-5 py-6 sm:px-6 sm:py-7",
        "go-transition",
        highlight
          ? "bg-go-surface ring-1 ring-go-border-strong"
          : "bg-transparent hover:bg-white/[0.02]",
        className
      )}
    >
      <div className="mb-5 flex min-h-[28px] items-center gap-2">
        <h3 className="text-[17px] font-semibold tracking-tight text-go-text">
          {name}
        </h3>
        {badge ? (
          <span className="rounded-full bg-go-primary/15 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.06em] text-[#8b9bd4]">
            {badge}
          </span>
        ) : null}
      </div>

      <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0">
        <span className="text-[34px] font-semibold leading-none tracking-tight text-go-text sm:text-[36px]">
          {price}
        </span>
        {priceNote ? (
          <span className="text-[13px] text-go-text-muted">{priceNote}</span>
        ) : null}
      </div>

      {networkNote ? (
        <p className="mt-2.5 text-[12px] text-go-text-muted">{networkNote}</p>
      ) : null}

      <p className="mt-4 min-h-[44px] text-[13px] leading-relaxed text-go-text-secondary">
        {subtitle}
      </p>

      <div className="my-6 h-px w-full bg-go-border" />

      <ul className="mb-8 flex-1 space-y-3">
        {features.map((f) => (
          <li
            key={f}
            className="flex items-start gap-2.5 text-[13px] leading-snug text-go-text-secondary"
          >
            <CircleCheck className="mt-0.5" muted={!highlight} />
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <PlanCta highlight={highlight} disabled={busy} onClick={onCta}>
        {cta}
      </PlanCta>
    </div>
  );
}

export default function PricingPage() {
  const { user, checkAppState } = useAuth();
  const [packages, setPackages] = useState([]);
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);
  const [activeOrder, setActiveOrder] = useState(null);
  const [txHash, setTxHash] = useState("");
  const [txBusy, setTxBusy] = useState(false);
  const [txMsg, setTxMsg] = useState("");

  const balance =
    typeof user?.credit_balance_cents === "number" ? user.credit_balance_cents : 0;

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [pkgs, pr] = await Promise.all([
        listCreditPackages(),
        listLookupPrices(),
      ]);
      setPackages(pkgs);
      setPrices(pr);
    } catch (err) {
      setError(err.message || "Failed to load pricing");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const mainPackages = useMemo(() => {
    const order = ["starter", "team", "operations"];
    return order.map((id) => packages.find((p) => p.id === id)).filter(Boolean);
  }, [packages]);

  const reloadPkg = useMemo(
    () => packages.find((p) => p.id === "reload_50"),
    [packages]
  );

  const sortedPrices = useMemo(() => {
    const map = Object.fromEntries(prices.map((p) => [p.search_type, p]));
    return LOOKUP_PRICE_ORDER.map((k) => map[k]).filter(Boolean);
  }, [prices]);

  const handleSelect = async (pkg) => {
    setBusyId(pkg.id);
    setError("");
    setTxMsg("");
    try {
      const order = await createCreditOrder(pkg.id);
      setActiveOrder(order);
      setTxHash("");
      requestAnimationFrame(() => {
        document.getElementById("payment-request")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    } catch (err) {
      setError(err.message || "Could not create payment request");
    } finally {
      setBusyId(null);
    }
  };

  const handleSubmitTx = async (e) => {
    e.preventDefault();
    if (!activeOrder?.id || !txHash.trim()) return;
    setTxBusy(true);
    setTxMsg("");
    try {
      const updated = await submitCreditOrderTx(activeOrder.id, txHash.trim());
      setActiveOrder(updated);
      setTxMsg("Transaction submitted for review. Credits post after confirmation.");
      await checkAppState();
    } catch (err) {
      setTxMsg(err.message || "Could not submit transaction");
    } finally {
      setTxBusy(false);
    }
  };

  return (
    <div className="relative min-h-full overflow-hidden bg-go-bg">
      {/* Soft atmospheric depth — restrained, not decorative fluff */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[420px]"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% -10%, rgba(67,88,165,0.12), transparent 70%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-6xl px-3 pb-20 pt-8 sm:px-6 sm:pb-24 sm:pt-10 md:px-8 md:pt-14">
        {/* Hero */}
        <header className="mb-14 max-w-3xl sm:mb-16">
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-go-border bg-go-surface/80 px-3 py-1 text-[11px] font-medium tracking-[0.04em] text-go-text-secondary">
              Prepaid usage · USDC on Base
            </span>
            <span className="font-mono text-[12px] text-go-text-muted">
              Balance {formatCents(balance)}
            </span>
          </div>

          <h2 className="text-[32px] font-semibold leading-[1.08] tracking-[-0.03em] text-go-text sm:text-[40px] md:text-[48px]">
            Pricing
          </h2>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-go-text-secondary sm:text-[16px]">
            Buy credits once. Run lookups until the balance covers the next search.
            Not a crypto wallet — credits cannot be withdrawn or transferred.
          </p>
        </header>

        {error ? (
          <div className="mb-8 rounded-xl border border-go-danger/30 bg-go-danger-muted px-4 py-3 text-[13px] text-go-danger">
            {error}
          </div>
        ) : null}

        {loading ? (
          <div className="flex justify-center py-28">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-go-border border-t-go-text" />
          </div>
        ) : (
          <>
            {/* Plans */}
            <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4 xl:gap-2">
              {mainPackages.map((pkg) => {
                const meta = TIER_META[pkg.id] || {
                  subtitle: "",
                  cta: "Get started",
                  highlight: false,
                  features: [],
                };
                return (
                  <TierColumn
                    key={pkg.id}
                    name={pkg.name}
                    price={formatCents(pkg.credit_amount_cents)}
                    priceNote="in credits"
                    networkNote={`${Number(pkg.usdc_amount).toFixed(0)} USDC on Base`}
                    subtitle={meta.subtitle}
                    features={meta.features}
                    highlight={meta.highlight}
                    badge={meta.badge}
                    busy={busyId === pkg.id}
                    cta={busyId === pkg.id ? "Creating…" : meta.cta}
                    onCta={() => handleSelect(pkg)}
                  />
                );
              })}

              <TierColumn
                name={ENTERPRISE_TIER.name}
                price={ENTERPRISE_TIER.priceLabel}
                networkNote="Annual billing"
                subtitle={ENTERPRISE_TIER.subtitle}
                features={ENTERPRISE_TIER.features}
                highlight={false}
                busy={false}
                cta={ENTERPRISE_TIER.cta}
                onCta={() => {}}
              />
            </div>

            {/* Trust line */}
            <p className="mb-16 text-center text-[12px] leading-relaxed text-go-text-muted">
              Minimum initial purchase $100 · Minimum reload $50 · Exact USDC amount per
              order · Network: Base only
            </p>

            {reloadPkg ? (
              <div className="mb-16 flex flex-col items-start justify-between gap-5 rounded-2xl border border-go-border bg-go-surface/50 px-6 py-5 sm:flex-row sm:items-center">
                <div>
                  <div className="text-[15px] font-medium text-go-text">Need more credits?</div>
                  <p className="mt-1 text-[13px] text-go-text-secondary">
                    Reload {formatCents(reloadPkg.credit_amount_cents)} after your first
                    credited purchase.
                  </p>
                </div>
                <PlanCta
                  highlight
                  disabled={busyId === reloadPkg.id}
                  onClick={() => handleSelect(reloadPkg)}
                  className="mt-0 sm:w-auto sm:min-w-[168px]"
                >
                  {busyId === reloadPkg.id
                    ? "Creating…"
                    : `Add ${formatCents(reloadPkg.credit_amount_cents)}`}
                </PlanCta>
              </div>
            ) : null}

            {activeOrder ? (
              <section
                id="payment-request"
                className="mb-16 scroll-mt-24 rounded-2xl border border-go-border bg-go-surface p-6 sm:p-8"
              >
                <div className="mb-8 flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-[20px] font-semibold tracking-tight text-go-text">
                      Payment request
                    </h3>
                    <p className="mt-1.5 text-[13px] text-go-text-secondary">
                      Send the exact USDC amount on Base, then submit the transaction hash.
                    </p>
                  </div>
                  <span className="rounded-full border border-go-border bg-go-bg px-3 py-1 text-[12px] text-go-text-secondary">
                    {ORDER_STATUS_LABELS[activeOrder.status] || activeOrder.status}
                  </span>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <CopyField label="Order ID" value={activeOrder.id} />
                  <div className="space-y-2">
                    <div className="text-[11px] font-medium uppercase tracking-[0.06em] text-go-text-muted">
                      Network
                    </div>
                    <div className="rounded-xl border border-go-border bg-go-surface-elevated px-3.5 py-2.5 text-[13px] font-medium text-go-text">
                      USDC on Base only
                    </div>
                  </div>
                  <CopyField
                    label="Exact USDC amount"
                    value={Number(activeOrder.usdc_amount).toFixed(6)}
                  />
                  <CopyField
                    label="Credit amount"
                    value={formatCents(activeOrder.usd_credit_amount_cents)}
                  />
                  <div className="md:col-span-2">
                    <CopyField
                      label="Receiving address"
                      value={activeOrder.receiving_address}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="text-[11px] font-medium uppercase tracking-[0.06em] text-go-text-muted">
                      Expires
                    </div>
                    <div className="text-[13px] text-go-text">
                      {new Date(activeOrder.expires_at).toLocaleString()}
                    </div>
                  </div>
                </div>

                {activeOrder.status === "awaiting_payment" ||
                activeOrder.status === "manual_review" ? (
                  <form
                    onSubmit={handleSubmitTx}
                    className="mt-8 space-y-3 border-t border-go-border pt-8"
                  >
                    <label className="block text-[13px] text-go-text-secondary">
                      Transaction hash (Base)
                    </label>
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <Input
                        value={txHash}
                        onChange={(e) => setTxHash(e.target.value)}
                        placeholder="0x…"
                        className="h-11 rounded-full font-mono text-[13px]"
                        disabled={
                          activeOrder.status === "manual_review" && !!activeOrder.tx_hash
                        }
                      />
                      <button
                        type="submit"
                        disabled={
                          txBusy ||
                          !txHash.trim() ||
                          (activeOrder.status === "manual_review" &&
                            !!activeOrder.tx_hash)
                        }
                        className="inline-flex h-11 shrink-0 items-center justify-center rounded-full bg-go-primary px-6 text-[13px] font-medium text-white go-transition hover:bg-go-primary-hover disabled:opacity-50"
                      >
                        {txBusy ? "Submitting…" : "Submit for review"}
                      </button>
                    </div>
                    {txMsg ? (
                      <p className="text-[13px] text-go-text-secondary">{txMsg}</p>
                    ) : null}
                  </form>
                ) : null}
              </section>
            ) : null}

            {/* Compare */}
            <section className="mb-16">
              <div className="mb-8">
                <h3 className="text-[22px] font-semibold tracking-tight text-go-text">
                  Compare plans
                </h3>
                <p className="mt-1.5 text-[13px] text-go-text-secondary">
                  Same tools across packages — scale is about credit runway and controls.
                </p>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-go-border">
                <table className="w-full min-w-[760px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-go-border bg-go-surface">
                      <th className="px-5 py-4 text-[13px] font-medium text-go-text-muted">
                        Features
                      </th>
                      {["Starter", "Team", "Operations", "Enterprise"].map((name, i) => (
                        <th
                          key={name}
                          className={cn(
                            "px-3 py-4 text-center text-[13px] font-semibold text-go-text",
                            i === 1 && "bg-go-primary/[0.06]"
                          )}
                        >
                          {name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {COMPARE_SECTIONS.map((section) => (
                      <React.Fragment key={section.title}>
                        <tr className="border-b border-go-border">
                          <td
                            colSpan={5}
                            className="bg-go-bg px-5 pb-2 pt-6 text-[13px] font-semibold text-go-text"
                          >
                            {section.title}
                          </td>
                        </tr>
                        {section.rows.map((row, i) => (
                          <tr
                            key={row.label}
                            className={cn(
                              "border-b border-go-border/60 last:border-0",
                              i % 2 === 0 ? "bg-white/[0.015]" : "bg-transparent"
                            )}
                          >
                            <td className="px-5 py-3.5 text-[13px] text-go-text-secondary">
                              {row.label}
                            </td>
                            {row.values.map((v, vi) => (
                              <td
                                key={vi}
                                className={cn(
                                  "px-3 py-3.5 text-center",
                                  vi === 1 && "bg-go-primary/[0.04]"
                                )}
                              >
                                <CellValue value={v} />
                              </td>
                            ))}
                          </tr>
                        ))}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Lookup retail */}
            <section className="mb-14">
              <div className="mb-6">
                <h3 className="text-[22px] font-semibold tracking-tight text-go-text">
                  Lookup pricing
                </h3>
                <p className="mt-1.5 text-[13px] text-go-text-secondary">
                  Displayed before you run a search. System errors are not charged.
                </p>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-go-border">
                <table className="w-full min-w-[440px] border-collapse">
                  <thead>
                    <tr className="border-b border-go-border bg-go-surface">
                      <th className="px-5 py-3.5 text-left text-[12px] font-medium uppercase tracking-[0.05em] text-go-text-muted">
                        Search type
                      </th>
                      <th className="px-5 py-3.5 text-right text-[12px] font-medium uppercase tracking-[0.05em] text-go-text-muted">
                        Retail
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedPrices.map((row, i) => (
                      <tr
                        key={row.search_type}
                        className={cn(
                          "border-b border-go-border/50 last:border-0",
                          i % 2 === 0 ? "bg-white/[0.015]" : "bg-transparent"
                        )}
                      >
                        <td className="px-5 py-3.5 text-[14px] text-go-text-secondary">
                          {row.description || row.search_type}
                        </td>
                        <td className="px-5 py-3.5 text-right font-mono text-[14px] font-medium text-go-text">
                          {formatCents(row.retail_cents)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <p className="text-center text-[13px] text-go-text-muted">
              Manage your balance on{" "}
              <Link
                to={createPageUrl("Account")}
                className="text-go-text underline-offset-4 hover:underline"
              >
                Account
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
