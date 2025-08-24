
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function askPerplexity(messages: Array<{ role: string, content: string }>, model = 'sonar-small-chat', temperature = 0.2) {
  const res = await fetch('/functions/v1/pplx-chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, model, temperature }),
  });
  return await res.json();
}

export async function askTinyBridgeRAG(question: string, jwt?: string) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (jwt) headers['Authorization'] = `Bearer ${jwt}`;
  const res = await fetch('/functions/v1/rag-answer', {
    method: 'POST',
    headers,
    body: JSON.stringify({ query: question }),
  });
  return await res.json();
}

export function parseCitations(text: string, chunks: any[]) {
  // Find [1], [2], etc. and map to chunk metadata
  const citationRegex = /\[(\d+)\]/g;
  const citations: Record<string, any> = {};
  let match;
  while ((match = citationRegex.exec(text)) !== null) {
    const idx = parseInt(match[1], 10) - 1;
    if (chunks[idx]) {
      citations[match[0]] = chunks[idx].metadata;
    }
  }
  return citations;
}
