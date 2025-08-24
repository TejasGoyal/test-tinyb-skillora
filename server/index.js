import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';
import jwt from 'jsonwebtoken';
import OpenAI from 'openai';
import { createRemoteJWKSet, jwtVerify } from 'jose';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing required Supabase environment variables. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your .env');
  // Exit early with non-zero status so it's obvious during local runs
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const app = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());
const upload = multer({ storage: multer.memoryStorage() });


async function callPerplexity(messages, model = 'pplx-7b-online', imageData = null) {
  if (!perplexityApiKey) {
    throw new Error('Perplexity API key is missing. Please set PERPLEXITY_API_KEY in your .env file.');
  }
  const lastUserMsg = messages.filter(m => m.role === 'user').pop()?.content || '';
  let body = {
    model: 'sonar-pro',
    messages: [
      {
        role: 'user',
        content: lastUserMsg,
      },
    ],
  };
  if (imageData) {
    body.image = imageData;
  }
  const response = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${perplexityApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  let data;
  const contentType = response.headers.get('content-type');
  if (!response.ok) {
    // Try to parse error as JSON, otherwise return text
    if (contentType && contentType.includes('application/json')) {
      const errJson = await response.json();
      throw new Error(errJson.error?.message || JSON.stringify(errJson));
    } else {
      const errText = await response.text();
      throw new Error('Perplexity API error: ' + errText.replace(/<[^>]+>/g, '').slice(0, 200));
    }
  }
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    throw new Error('Perplexity API did not return JSON.');
  }
  if (data.choices && data.choices[0]?.message?.content) {
    return data.choices[0].message.content;
  }
  throw new Error('No reply from Perplexity');
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const huggingfaceApiKey = process.env.HUGGINGFACE_API_KEY;

const perplexityApiKey = process.env.PERPLEXITY_API_KEY;


// Helper for Hugging Face
async function callHuggingFace(messages, model = 'mistralai/Mistral-7B-Instruct-v0.2') {
  // Use only the last user message for simplicity
  const lastUserMsg = messages.filter(m => m.role === 'user').pop()?.content || '';
  const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${huggingfaceApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ inputs: lastUserMsg }),
  });
  if (!response.ok) {
    const err = await response.text();
    throw new Error(err);
  }
  const data = await response.json();
  // Hugging Face returns array of generated_text
  if (Array.isArray(data) && data[0]?.generated_text) {
    return data[0].generated_text;
  }
  // Some models return { generated_text: ... }
  if (data.generated_text) {
    return data.generated_text;
  }
  throw new Error('No reply from Hugging Face');
}

app.post('/api/chat', upload.single('image'), async (req, res) => {
  try {
    let { messages, model = 'gpt-3.5-turbo', provider = 'openai' } = req.body;
    let imageData = null;
    if (req.file) {
      imageData = req.file.buffer.toString('base64');
    }
    // Support messages sent as JSON string (from FormData)
    if (typeof messages === 'string') {
      try {
        messages = JSON.parse(messages);
      } catch {
        return res.status(400).json({ error: 'Messages must be an array or a valid JSON string.' });
      }
    }
    if (!Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages must be an array.' });
    }

    // 1. Verify Supabase JWT by asking Supabase auth for the user
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid authorization header.' });
    }
    const token = authHeader.split(' ')[1];
    let user;
    try {
      // Try to verify JWT signature using Supabase project's JWKS
      // Supabase exposes JWKS at: https://<project>.supabase.co/auth/v1/.well-known/jwks.json
      const supabaseUrlHost = new URL(SUPABASE_URL).host;
      const jwksUrl = `https://${supabaseUrlHost}/auth/v1/.well-known/jwks.json`;
      const JWKS = createRemoteJWKSet(new URL(jwksUrl));
      try {
        const verified = await jwtVerify(token, JWKS, {
          issuer: `${SUPABASE_URL}/auth/v1`,
        });
        user = verified.payload;
      } catch (verifyErr) {
        // If signature verification fails, try Supabase server-side verification as a fallback
        const { data: userData, error: userErr } = await supabase.auth.getUser(token);
        if (userErr || !userData?.user) {
          return res.status(401).json({ error: 'Invalid Supabase JWT.' });
        }
        user = userData.user;
      }
    } catch (e) {
      // In case supabase client call fails, try decode but log the error
      console.error('Error verifying token with Supabase:', e.message || e);
      try {
        const decoded = jwt.decode(token);
        if (!decoded || !decoded.sub) {
          return res.status(401).json({ error: 'Invalid Supabase JWT.' });
        }
        user = decoded;
      } catch (err) {
        return res.status(401).json({ error: 'Invalid Supabase JWT.' });
      }
    }

    // 2. Fetch user profile and role
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.sub)
      .single();
    if (profileError || !profile) {
      // If user profile is not found, continue as a normal Perplexity chatbot (no user context)
      let chatMessages = [...messages];
      // If image is uploaded, add it to the chat context
      if (imageData) {
        chatMessages.push({ role: 'user', content: '[IMAGE]', image: imageData });
      }
      const disclaimer = "\n\n[Disclaimer: You were not found in backend. Please talk to admin to get full access.]";
      if (provider === 'perplexity') {
        const reply = await callPerplexity(chatMessages, 'pplx-7b-online', imageData);
        return res.json({ reply: reply + disclaimer });
      }
      if (provider === 'huggingface') {
        const reply = await callHuggingFace(chatMessages);
        return res.json({ reply: reply + disclaimer });
      } else {
        const completion = await openai.chat.completions.create({
          model,
          messages: chatMessages,
        });
        return res.json({ reply: completion.choices[0].message.content + disclaimer });
      }
    }

    let userData = {};
    if (profile.role === 'parent') {
      // Parent: fetch child and relevant teachers
      const { data: parentRow } = await supabase
        .from('parents')
        .select('child_id')
        .eq('user_id', user.sub)
        .single();
      if (parentRow && parentRow.child_id) {
        const { data: child } = await supabase
          .from('students')
          .select('*')
          .eq('id', parentRow.child_id)
          .single();
        const { data: teachers } = await supabase
          .from('teachers')
          .select('*, profiles(full_name, email)')
          .eq('class_id', child.class_id);
        userData = { child, teachers };
      }
    } else if (profile.role === 'teacher') {
      // Teacher: fetch class/section and students
      const { data: teacherRow } = await supabase
        .from('teachers')
        .select('class_id')
        .eq('user_id', user.sub)
        .single();
      if (teacherRow && teacherRow.class_id) {
        const { data: classInfo } = await supabase
          .from('classes')
          .select('*')
          .eq('id', teacherRow.class_id)
          .single();
        const { data: students } = await supabase
          .from('students')
          .select('*')
          .eq('class_id', teacherRow.class_id);
        userData = { class: classInfo, students };
      }
    }

    // 3. Inject userData into chat context
    const systemPrompt = `You are an assistant with access to the following info: ${JSON.stringify(userData)}`;
    const chatMessages = [
      { role: 'system', content: systemPrompt },
      ...messages,
    ];

    if (provider === 'perplexity') {
      const reply = await callPerplexity(chatMessages, 'pplx-7b-online', imageData);
      return res.json({ reply });
    }

    if (provider === 'huggingface') {
      const reply = await callHuggingFace(chatMessages);
      return res.json({ reply });
    } else {
      const completion = await openai.chat.completions.create({
        model,
        messages: chatMessages,
      });
      return res.json({ reply: completion.choices[0].message.content });
    }
  } catch (error) {
    res.status(500).json({ error: error.message || 'AI error' });
  }
});

app.listen(port, () => {
  console.log(`AI backend listening on port ${port}`);
});
