import { supabase } from "@/lib/supabase";

export function formatCents(cents) {
  const n = Number(cents);
  if (!Number.isFinite(n)) return "$0.00";
  return `$${(n / 100).toFixed(2)}`;
}

export function formatUsdc(amount) {
  const n = Number(amount);
  if (!Number.isFinite(n)) return "0";
  return n.toFixed(2).replace(/\.?0+$/, (m) => (m.includes(".") ? m.replace(/0+$/, "").replace(/\.$/, "") : m)) || String(n);
}

const PACKAGE_BLURBS = {
  starter: "For independent investigators and evaluation. Minimum initial purchase.",
  reload_50: "Reload when your credit balance is low. Available after your first purchase.",
  team: "For small teams running regular lookups.",
  operations: "For high-volume investigative workloads.",
};

export function packageBlurb(id) {
  return PACKAGE_BLURBS[id] || "Prepaid usage credits.";
}

export async function listCreditPackages() {
  const { data, error } = await supabase
    .from("credit_packages")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function listLookupPrices() {
  const { data, error } = await supabase
    .from("lookup_prices")
    .select("*")
    .order("retail_cents", { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function listMyCreditOrders(limit = 20) {
  const { data, error } = await supabase
    .from("credit_orders")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data || [];
}

export async function listMyLedger(limit = 30) {
  const { data, error } = await supabase
    .from("ledger_entries")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data || [];
}

export async function createCreditOrder(packageId) {
  const { data, error } = await supabase.rpc("create_credit_order", {
    p_package_id: packageId,
  });
  if (error) throw error;
  return data;
}

export async function submitCreditOrderTx(orderId, txHash) {
  const { data, error } = await supabase.rpc("submit_credit_order_tx", {
    p_order_id: orderId,
    p_tx_hash: txHash,
  });
  if (error) throw error;
  return data;
}

export async function getLookupPrice(searchType) {
  const { data, error } = await supabase
    .from("lookup_prices")
    .select("*")
    .eq("search_type", searchType)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function chargeLookup({
  searchType,
  inputMasked = null,
  vendor = null,
  vendorRequestId = null,
}) {
  const { data, error } = await supabase.rpc("charge_lookup", {
    p_search_type: searchType,
    p_input_masked: inputMasked,
    p_vendor: vendor,
    p_vendor_request_id: vendorRequestId,
  });
  if (error) throw error;
  return data;
}

export const ORDER_STATUS_LABELS = {
  awaiting_payment: "Awaiting payment",
  payment_detected: "Payment detected",
  confirming: "Confirming",
  credited: "Credited",
  underpaid: "Underpaid",
  overpaid: "Overpaid",
  expired: "Expired",
  wrong_asset: "Wrong asset",
  wrong_network: "Wrong network",
  manual_review: "Manual review",
  rejected: "Rejected",
};

export const LOOKUP_PRICE_ORDER = [
  "ssn_validation",
  "address_verification",
  "address_enrichment",
  "skiptrace_basic",
  "skiptrace_enhanced",
  "identity_report",
  "batch_unit",
];
