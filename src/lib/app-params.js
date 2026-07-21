/**
 * App URL params — Supabase era (Base44 token params removed).
 * Kept as a thin helper for redirect / deep-link needs.
 */
export const appParams = {
  fromUrl: typeof window !== "undefined" ? window.location.href : "",
};
