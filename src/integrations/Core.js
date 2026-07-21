import { supabase } from "@/lib/supabase";

/**
 * LLM helper — calls Supabase Edge Function `invoke-llm`.
 * Set OPENAI_API_KEY (or compatible) as a function secret.
 */
export async function InvokeLLM(options = {}) {
  const timeoutMs = 20000;
  const invoke = supabase.functions.invoke("invoke-llm", {
    body: options,
  });

  const { data, error } = await Promise.race([
    invoke,
    new Promise((_, reject) =>
      setTimeout(
        () => reject(new Error("LLM request timed out")),
        timeoutMs
      )
    ),
  ]);

  if (error) {
    console.error("InvokeLLM failed:", error);
    throw error;
  }

  // Compatibility: Base44 returned the parsed object / string directly
  if (data?.result !== undefined) return data.result;
  return data;
}

export async function UploadFile({ file } = {}) {
  if (!file) return { file_url: "" };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const path = `${user.id}/${Date.now()}-${file.name || "upload"}`;
  const { error } = await supabase.storage.from("uploads").upload(path, file);
  if (error) throw error;

  const { data: pub } = supabase.storage.from("uploads").getPublicUrl(path);
  return { file_url: pub?.publicUrl || "" };
}
