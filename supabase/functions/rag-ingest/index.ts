import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import OpenAI from "https://deno.land/x/openai@v4.53.2/mod.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
const ADMIN_TOKEN = Deno.env.get("ADMIN_TOKEN");
const ALLOWED_ORIGINS = Deno.env.get("ALLOWED_ORIGINS") ?? "*";

function corsHeaders(origin: string) {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-admin-token",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };
}

serve(async (req) => {
  const origin = req.headers.get("origin") ?? ALLOWED_ORIGINS;
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders(origin) });
  }
  try {
    const adminToken = req.headers.get("x-admin-token");
    if (adminToken !== ADMIN_TOKEN) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        headers: { ...corsHeaders(origin), "Content-Type": "application/json" },
        status: 401,
      });
    }
    const body = await req.json();
    const {
      tenantId, title, source, sourceId, content, storagePath, metadata = {}
    } = body;
    if (!tenantId || (!content && !storagePath)) {
      return new Response(JSON.stringify({ error: "Missing tenantId or content/storagePath" }), {
        headers: { ...corsHeaders(origin), "Content-Type": "application/json" },
        status: 400,
      });
    }
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    if (!OPENAI_API_KEY) {
      return new Response(JSON.stringify({ error: 'Missing OPENAI_API_KEY' }), {
        headers: { ...corsHeaders(origin), "Content-Type": "application/json" },
        status: 500,
      });
    }
    let docContent = content;
    // TODO: If storagePath, fetch file from Supabase Storage or signed URL and extract text
    // For now, just use content
    // TODO: Add PDF/text parser here if needed
    // Chunking
    const chunkSize = 900;
    const overlap = 150;
    const chunks: string[] = [];
    if (docContent) {
      for (let i = 0; i < docContent.length; i += chunkSize - overlap) {
        chunks.push(docContent.slice(i, i + chunkSize));
      }
    }
    // Insert document
    const { data: doc, error: docError } = await supabase
      .from("documents")
      .insert({
        tenant_id: tenantId,
        title,
        source,
        source_id: sourceId,
        metadata,
      })
      .select()
      .single();
    if (docError) {
      return new Response(JSON.stringify({ error: docError.message }), {
        headers: { ...corsHeaders(origin), "Content-Type": "application/json" },
        status: 500,
      });
    }
    // Embed and insert chunks
  const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
    let inserted = 0;
    for (let idx = 0; idx < chunks.length; idx++) {
      const chunk = chunks[idx];
      const embedResp = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: chunk,
      });
      const embedding = embedResp.data[0].embedding;
      const { error: chunkError } = await supabase
        .from("doc_chunks")
        .insert({
          tenant_id: tenantId,
          document_id: doc.id,
          chunk_index: idx,
          content: chunk,
          tokens: chunk.length,
          metadata,
          embedding,
        });
      if (!chunkError) inserted++;
    }
    return new Response(JSON.stringify({ document_id: doc.id, inserted_chunks: inserted }), {
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
