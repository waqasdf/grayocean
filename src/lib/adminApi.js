import { supabase } from "@/lib/supabase";

export function formatCents(cents) {
  const n = Number(cents || 0) / 100;
  return n.toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
  });
}

export async function fetchAdminStats() {
  const { data, error } = await supabase.rpc("admin_dashboard_stats");
  if (error) throw error;
  return data;
}

export async function fetchAdminUsers() {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function fetchAdminUserDetail(userId) {
  const { data, error } = await supabase.rpc("admin_get_user_detail", {
    p_user_id: userId,
  });
  if (error) throw error;
  return data;
}

export async function adminSetUserRole(userId, role) {
  const { data, error } = await supabase.rpc("admin_set_user_role", {
    p_user_id: userId,
    p_role: role,
  });
  if (error) throw error;
  return data;
}

export async function adminAdjustCredits(
  userId,
  amountCents,
  description = "Manual adjustment",
  entryType = "manual_adjustment"
) {
  const { data, error } = await supabase.rpc("admin_adjust_credits", {
    p_user_id: userId,
    p_amount_cents: amountCents,
    p_description: description,
    p_entry_type: entryType,
  });
  if (error) throw error;
  return data;
}

export async function adminConfirmCreditOrder(orderId, creditedCents = null) {
  const payload = { p_order_id: orderId };
  if (creditedCents != null) payload.p_credited_cents = creditedCents;
  const { data, error } = await supabase.rpc("admin_confirm_credit_order", payload);
  if (error) throw error;
  return data;
}
