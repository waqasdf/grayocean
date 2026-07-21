// GrayOcean LLM edge function — replaces Base44 InvokeLLM
// Secrets: OPENAI_API_KEY (or compatible OpenAI-style API)

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const prompt = body.prompt || body.message || "";
    const responseJsonSchema = body.response_json_schema;

    const apiKey = Deno.env.get("OPENAI_API_KEY");
    if (!apiKey) {
      // Dev fallback so UI can load without a key — structured empty result
      const fallback = responseJsonSchema
        ? {}
        : "LLM is not configured. Set OPENAI_API_KEY on the invoke-llm function.";
      return new Response(JSON.stringify({ result: fallback }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const messages = [
      {
        role: "system",
        content: responseJsonSchema
          ? "Respond with valid JSON only matching the requested schema. No markdown."
          : "You are a careful analyst for identity-investigation workflows. Be factual and concise.",
      },
      { role: "user", content: prompt },
    ];

    const openaiBody = {
      model: Deno.env.get("OPENAI_MODEL") || "gpt-4o-mini",
      messages,
      temperature: 0.2,
      ...(responseJsonSchema
        ? { response_format: { type: "json_object" } }
        : {}),
    };

    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(openaiBody),
    });

    if (!openaiRes.ok) {
      const errText = await openaiRes.text();
      return new Response(
        JSON.stringify({ error: "Upstream LLM error", detail: errText }),
        {
          status: 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const openaiJson = await openaiRes.json();
    const content = openaiJson.choices?.[0]?.message?.content ?? "";

    let result = content;
    if (responseJsonSchema) {
      try {
        result = JSON.parse(content);
      } catch {
        result = { raw: content };
      }
    }

    return new Response(JSON.stringify({ result }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
