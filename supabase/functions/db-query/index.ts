import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");
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
    const { question } = await req.json();
    if (!question) {
      return new Response(JSON.stringify({ error: "Missing question" }), {
        headers: { ...corsHeaders(origin), "Content-Type": "application/json" },
        status: 400,
      });
    }
    // Simple parser: demo only, expand for production
    let result = null;
    if (/students in class ([\w\d]+)/i.test(question)) {
      const match = question.match(/students in class ([\w\d]+)/i);
      const className = match[1];
      const { data: classRow } = await supabase.from("classes").select("id").eq("grade", className).single();
      if (classRow) {
        const { data: students } = await supabase.from("students").select("name").eq("class_id", classRow.id);
        result = students?.map(s => s.name) ?? [];
      }
    } else if (/teachers for class ([\w\d]+)/i.test(question)) {
      const match = question.match(/teachers for class ([\w\d]+)/i);
      const className = match[1];
      const { data: classRow } = await supabase.from("classes").select("id").eq("grade", className).single();
      if (classRow) {
        const { data: teachers } = await supabase.from("teachers").select("subject").eq("class_id", classRow.id);
        result = teachers?.map(t => t.subject) ?? [];
      }
    } else {
      result = "Sorry, I can only answer questions about students or teachers for a class.";
    }
    return new Response(JSON.stringify({ result }), {
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
