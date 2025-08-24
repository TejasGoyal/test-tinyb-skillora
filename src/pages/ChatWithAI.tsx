import React, { useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { askTinyBridgeRAG, askPerplexity } from '@/lib/rag';

type Provider = 'openai' | 'huggingface' | 'perplexity' | 'rag' | 'db';

const ChatWithAI: React.FC = () => {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [provider, setProvider] = useState<Provider>('perplexity');
  const [autoProvider, setAutoProvider] = useState<Provider | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [docUploaded, setDocUploaded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { session } = useAuth();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file || !session?.access_token) return;
    setLoading(true);
    setError(null);
    try {
      const text = await file.text();
      // Ingest document via rag-ingest
      const res = await fetch('/functions/v1/rag-ingest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': process.env.NEXT_PUBLIC_ADMIN_TOKEN || '',
        },
        body: JSON.stringify({
          tenantId: (session.user as any)?.tenant_id || session.user?.id,
          title: file.name,
          content: text,
        }),
      });
      const data = await res.json();
      if (data.error) setError(data.error);
      else {
        setError(`Document uploaded: ${data.document_id}, chunks: ${data.inserted_chunks}`);
        setDocUploaded(true);
      }
    } catch (err: any) {
      setError(err.message || 'Upload error');
    } finally {
      setLoading(false);
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const sendMessage = async () => {
    if (!input.trim() && !image) return;
    const newMessages = [...messages, { role: 'user' as 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    setError(null);
    try {
      let reply = '';
      let chosenProvider: Provider = provider;
      if (docUploaded && /doc|file|upload|content|paragraph|section|chapter|text|summar/i.test(input)) {
        chosenProvider = 'rag';
      } else if (/table|row|column|db|database|sql|record|schema|supabase/i.test(input)) {
        chosenProvider = 'db';
      } else if (/openai|gpt|chatgpt|huggingface|mistral|perplexity/i.test(input)) {
        if (/openai|gpt|chatgpt/i.test(input)) chosenProvider = 'openai';
        else if (/huggingface|mistral/i.test(input)) chosenProvider = 'huggingface';
        else if (/perplexity/i.test(input)) chosenProvider = 'perplexity';
      } else if (docUploaded) {
        chosenProvider = 'rag';
      } else {
        chosenProvider = 'perplexity';
      }
      setAutoProvider(chosenProvider);
      if (chosenProvider === 'rag') {
        const jwt = session?.access_token;
        const { text, chunks, error: ragError } = await askTinyBridgeRAG(input, jwt);
        if (ragError) setError(ragError);
        reply = text;
      } else if (chosenProvider === 'db') {
        const jwt = session?.access_token;
        const res = await fetch('/functions/v1/db-query', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwt}`,
          },
          body: JSON.stringify({ question: input }),
        });
        const data = await res.json();
        if (data.error) setError(data.error);
        reply = typeof data.result === 'string' ? data.result : JSON.stringify(data.result);
      } else if (image) {
        // Send image to chat endpoint. Set Authorization header; messages in a field.
        const formData = new FormData();
        formData.append('image', image);
        formData.append('provider', chosenProvider);
        formData.append('messages', JSON.stringify(newMessages));
        const headers: Record<string, string> = {};
        if (session?.access_token) headers['Authorization'] = `Bearer ${session.access_token}`;
        const serverUrl = typeof window !== 'undefined' ? (process.env.NEXT_PUBLIC_AI_SERVER_URL || 'http://localhost:5001') : 'http://localhost:5001';
        const res = await fetch(`${serverUrl}/api/chat`, {
          method: 'POST',
          headers,
          body: formData,
        });
        const data = await res.json();
        if (data.reply) reply = data.reply;
        else setError(data.error || 'No reply from AI');
        setImage(null);
      } else {
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (session?.access_token) headers['Authorization'] = `Bearer ${session.access_token}`;
        const res = await fetch('http://localhost:5001/api/chat', {
          method: 'POST',
          headers,
          body: JSON.stringify({ messages: newMessages, provider: chosenProvider }),
        });
        const data = await res.json();
        if (data.reply) reply = data.reply;
        else setError(data.error || 'No reply from AI');
      }
      if (reply) setMessages([...newMessages, { role: 'assistant' as 'assistant', content: reply }]);
    } catch (err: any) {
      setError(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Chat with AI</h1>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-300">Provider:</label>
          <select
            className="bg-slate-800 text-white border border-gray-600 rounded px-2 py-1"
            value={provider}
            onChange={e => setProvider(e.target.value as Provider)}
            disabled={loading}
          >
            <option value="perplexity">Perplexity AI</option>
            <option value="rag">RAG (Docs)</option>
            <option value="db">Supabase DB</option>
            <option value="openai">OpenAI</option>
            <option value="huggingface">Hugging Face (Mistral)</option>
          </select>
          <span className="text-xs text-gray-400 ml-2">Chosen: {autoProvider || provider}</span>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            disabled={loading}
            accept=".txt,.md,.pdf"
          />
          <button
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
            onClick={handleUpload}
            disabled={loading || !file}
          >
            Upload
          </button>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="file"
            onChange={handleImageChange}
            disabled={loading}
            accept="image/*"
          />
          <span className="text-xs text-gray-400 ml-2">Send an image to describe</span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto bg-slate-900 rounded-lg p-4 mb-4 shadow-inner">
        {messages.length === 0 && <div className="text-gray-400">Start the conversation...</div>}
        {messages.map((msg, idx) => (
          <div key={idx} className={`mb-2 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`px-4 py-2 rounded-lg max-w-[80%] ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-100'}`}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && <div className="text-gray-400">AI is typing...</div>}
        {error && <div className="text-red-500">{error}</div>}
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 border border-gray-600 rounded-lg px-3 py-2 bg-slate-800 text-white focus:outline-none"
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') sendMessage(); }}
          placeholder="Type your message..."
          disabled={loading}
        />
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-smooth"
          onClick={sendMessage}
          disabled={loading || !input.trim()}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWithAI;
