import { mapRow } from "@/lib/entityClient";
import { supabase } from "@/lib/supabase";

async function fetchProfile() {
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData?.user) {
    const err = new Error("Unauthorized");
    err.status = 401;
    throw err;
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", authData.user.id)
    .single();

  if (error) throw error;

  return {
    ...mapRow(data),
    email: data.email || authData.user.email,
    full_name:
      data.full_name ||
      authData.user.user_metadata?.full_name ||
      authData.user.email,
  };
}

export const User = {
  me: fetchProfile,

  async loginWithRedirect(redirectTo = window.location.href) {
    const next = encodeURIComponent(redirectTo);
    window.location.assign(`/Login?redirect=${next}`);
  },

  async logout(redirectTo = "/Login") {
    await supabase.auth.signOut();
    if (redirectTo) window.location.assign(redirectTo);
  },

  async updateMyProfile(patch) {
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError || !authData?.user) {
      const err = new Error("Unauthorized");
      err.status = 401;
      throw err;
    }
    const { data, error } = await supabase
      .from("profiles")
      .update(patch)
      .eq("id", authData.user.id)
      .select()
      .single();
    if (error) throw error;
    return mapRow(data);
  },
};
