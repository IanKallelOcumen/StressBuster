# Free API options for Zen (listening / chat)

Your app currently uses **Gemini 2.5 Flash-Lite** (Google) — **1,000 free requests/day**, with a per-user daily cap so a batch of students shares the quota fairly.

If you ever want to switch or add another free option:

---

## Current setup (Gemini, no pay)

- **Model:** `gemini-2.5-flash-lite` (first), then `gemini-2.5-flash`, etc.
- **Free tier:** 1,000 requests/day, 15/min (Flash-Lite).
- **Fair-use:** 25 messages per user per day (resets midnight PT) so many students can use it.

---

## Other free APIs (no payment)

| Service | Free tier | Best for |
|--------|-----------|----------|
| **Groq** | 30 req/min, generous daily | Fast inference, easy REST API. Good for chat. |
| **Ollama** | Unlimited (runs on your machine) | Self-hosted, no key. Students need to run Ollama locally or you host one server. |
| **Hugging Face** | Rate-limited free inference | Open models, need to pick a chat model. |
| **Mistral** | Free tier with limits | Similar to Gemini, another key to manage. |

### Multiple providers (rotate when one hits limits)

Zen can use **several APIs in order** so you can “throw in” different companies and rotate when one hits rate limit.

- **Env:** `ZEN_PROVIDERS=gemini,groq` (or `gemini,groq,openai`). Order = try order.
- **Keys (optional):**  
  - `GEMINI_API_KEY` (or encrypted) — always used if `gemini` is in the list.  
  - `GROQ_API_KEY` — used when `groq` is in `ZEN_PROVIDERS`.  
  - `OPENAI_API_KEY` — used when `openai` is in `ZEN_PROVIDERS`.
- **Behaviour:** For each user message, the app tries the first provider; if it fails (e.g. 429), it tries the next. No payment required for free tiers.

Example `.env` for Gemini + Groq:

```env
GEMINI_API_KEY=your_gemini_key
ZEN_PROVIDERS=gemini,groq
GROQ_API_KEY=your_groq_key
```

You can add **Vercel AI SDK / server routes** later: point the app at your own API route that calls these same providers (keys stay on the server).

---

## Summary

- **Staying on Gemini:** Already set to Flash-Lite + per-user cap. No payment, good for a student batch.
- **More free capacity:** Set `ZEN_PROVIDERS=gemini,groq` (and add `GROQ_API_KEY`) to rotate; add `openai` and `OPENAI_API_KEY` if you use OpenAI. Optional: Vercel API routes can proxy these providers so keys stay server-side.
