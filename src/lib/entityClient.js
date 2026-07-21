import { supabase } from "@/lib/supabase";

/** Map DB row → Base44-ish shape (created_date / updated_date aliases). */
export function mapRow(row) {
  if (!row) return null;
  return {
    ...row,
    created_date: row.created_at,
    updated_date: row.updated_at,
  };
}

async function requireUserId() {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    const err = new Error("Unauthorized");
    err.status = 401;
    throw err;
  }
  return data.user.id;
}

/**
 * Base44-compatible entity client over a Supabase table.
 * Methods: create, get, update, delete, list, filter
 */
export function createEntity(tableName, { scopedToUser = true } = {}) {
  return {
    async create(payload = {}) {
      const userId = scopedToUser ? await requireUserId() : null;
      const insert = {
        ...payload,
        ...(scopedToUser ? { user_id: userId } : {}),
      };
      delete insert.id;
      delete insert.created_date;
      delete insert.updated_date;
      delete insert.created_at;
      delete insert.updated_at;

      const { data, error } = await supabase
        .from(tableName)
        .insert(insert)
        .select()
        .single();
      if (error) throw error;
      return mapRow(data);
    },

    async get(id) {
      const { data, error } = await supabase
        .from(tableName)
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return mapRow(data);
    },

    async update(id, payload = {}) {
      const patch = { ...payload };
      delete patch.id;
      delete patch.user_id;
      delete patch.created_date;
      delete patch.updated_date;
      delete patch.created_at;

      const { data, error } = await supabase
        .from(tableName)
        .update(patch)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return mapRow(data);
    },

    async delete(id) {
      const { error } = await supabase.from(tableName).delete().eq("id", id);
      if (error) throw error;
      return { id };
    },

    /**
     * @param {string} [order] e.g. '-created_date' or 'created_date'
     * @param {number} [limit]
     */
    async list(order = "-created_at", limit = 100) {
      let col = order.replace(/^-/, "");
      if (col === "created_date") col = "created_at";
      if (col === "updated_date") col = "updated_at";
      const ascending = !String(order).startsWith("-");

      let q = supabase.from(tableName).select("*").order(col, { ascending });
      if (limit) q = q.limit(limit);
      const { data, error } = await q;
      if (error) throw error;
      return (data || []).map(mapRow);
    },

    async filter(criteria = {}, order = "-created_at", limit = 100) {
      let col = String(order).replace(/^-/, "");
      if (col === "created_date") col = "created_at";
      if (col === "updated_date") col = "updated_at";
      const ascending = !String(order).startsWith("-");

      let q = supabase.from(tableName).select("*");
      for (const [key, value] of Object.entries(criteria)) {
        q = q.eq(key, value);
      }
      q = q.order(col, { ascending });
      if (limit) q = q.limit(limit);
      const { data, error } = await q;
      if (error) throw error;
      return (data || []).map(mapRow);
    },
  };
}
