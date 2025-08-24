import { serve } from "https://deno.land/std/http/server.ts";

const PPLX_API_KEY = Deno.env.get("PPLX_API_KEY");
const ALLOWED_ORIGINS = Deno.env.get("ALLOWED_ORIGINS") ?? "*";

function corsHeaders(origin: string) {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };
}

serve(async (req) => {
  const origin = req.headers.get("origin") ?? ALLOWED_ORIGINS;
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders(origin) });
  }
  try {
    const body = await req.json();
    const resp = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${PPLX_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const data = await resp.json();
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders(origin), "Content-Type": "application/json" },
      status: resp.status,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders(origin), "Content-Type": "application/json" },
      status: 500,
    });
  }
});
