import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import OpenAI from "https://deno.land/x/openai@v4.53.2/mod.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");
const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
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
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing Authorization header" }), {
        headers: { ...corsHeaders(origin), "Content-Type": "application/json" },
        status: 401,
      });
    }
    const jwt = authHeader.replace("Bearer ", "");
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: `Bearer ${jwt}` } }
    });
    const { query, k = 6, temperature = 0.2 } = await req.json();
    if (!query) {
      return new Response(JSON.stringify({ error: "Missing query" }), {
        headers: { ...corsHeaders(origin), "Content-Type": "application/json" },
        status: 400,
      });
    }
    // Step a: Create embedding
    if (!OPENAI_API_KEY) {
      return new Response(JSON.stringify({ error: 'Missing OPENAI_API_KEY' }), {
        headers: { ...corsHeaders(origin), "Content-Type": "application/json" },
        status: 500,
      });
    }
    const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
    const embedResp = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: query,
    });
    const embedding = embedResp.data[0].embedding;
    // Step b: Retrieve chunks
    const { data: chunks, error: chunkError } = await supabase.rpc("match_chunks_secure", {
      query_embedding: embedding,
      query_text: query,
      match_count: k,
    });
    if (chunkError) {
      return new Response(JSON.stringify({ error: chunkError.message }), {
        headers: { ...corsHeaders(origin), "Content-Type": "application/json" },
        status: 500,
      });
    }
    // Step c: Build grounded prompt
    let context = chunks.map((c, i) =>
      `[[Chunk ${i + 1}]]\n${c.content}\n(Metadata: ${JSON.stringify(c.metadata)})`
    ).join("\n\n");
    const prompt = [
      { role: "system", content: `You are a helpful assistant. Use only the following context to answer and cite sources as [1], [2], etc.:\n${context}` },
      { role: "user", content: query }
    ];
    // Step d: Call Perplexity
  const pplxResp = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${PPLX_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "sonar-small-chat",
        messages: prompt,
        temperature,
      }),
    });
    const pplxData = await pplxResp.json();
    // Step e: Return
    return new Response(JSON.stringify({ text: pplxData.choices?.[0]?.message?.content ?? '', chunks }), {
      headers: { ...corsHeaders(origin), "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders(origin), "Content-Type": "application/json" },
      status: 500,
    });
  }
});
