# Skillora Bridge Backend (ChatGPT Proxy)

## Setup
1. Copy `.env.example` to `.env` and add your OpenAI API key.
2. Run `npm install` in this folder.
3. Start the server with `npm start`.

## API
- POST `/api/chat`
  - Body: `{ "messages": [{ role: 'user'|'assistant', content: string }], "model"?: string }`
  - Returns: `{ reply: string }`

This backend securely proxies chat requests to OpenAI, keeping your API key safe.
