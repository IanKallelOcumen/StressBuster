/**
 * Zen chat: multiple providers (Gemini, Groq, OpenAI, etc.) so you can
 * throw in different APIs and rotate when one hits rate limit.
 * Set ZEN_PROVIDERS=gemini,groq in .env and add the keys for each.
 */

function toOpenAIMessages(systemInstruction, contents) {
  const messages = [{ role: 'system', content: systemInstruction }];
  for (const c of contents) {
    const role = c.role === 'model' ? 'assistant' : 'user';
    const text = c.parts?.map(p => p.text).filter(Boolean).join('\n') || '';
    if (text) messages.push({ role, content: text });
  }
  return messages;
}

async function providerGemini(apiKey, systemInstruction, contents) {
  if (!apiKey?.trim()) throw new Error('No Gemini key');
  let list = contents.map(({ role, parts }) => ({ role, parts }));
  while (list.length > 0 && list[0].role === 'model') list = list.slice(1);
  if (list.length === 0) throw new Error('No user message');
  const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent';
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey.trim() },
    body: JSON.stringify({
      contents: list,
      systemInstruction: { parts: [{ text: systemInstruction }] },
      generationConfig: { temperature: 0.7, maxOutputTokens: 500 },
    }),
  });
  const data = await res.json();
  if (!res.ok) {
    const err = new Error(data?.error?.message || `HTTP ${res.status}`);
    err.status = res.status;
    err.code = data?.error?.code;
    throw err;
  }
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (text != null) return String(text).trim();
  throw new Error('No text in Gemini response');
}

async function providerGroq(apiKey, systemInstruction, contents) {
  if (!apiKey?.trim()) throw new Error('No Groq key');
  const messages = toOpenAIMessages(systemInstruction, contents);
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey.trim()}`,
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      messages,
      max_tokens: 500,
      temperature: 0.7,
    }),
  });
  const data = await res.json();
  if (!res.ok) {
    const err = new Error(data?.error?.message || `HTTP ${res.status}`);
    err.status = res.status;
    throw err;
  }
  const text = data?.choices?.[0]?.message?.content;
  if (text != null) return String(text).trim();
  throw new Error('No text in Groq response');
}

async function providerOpenAI(apiKey, systemInstruction, contents) {
  if (!apiKey?.trim()) throw new Error('No OpenAI key');
  const messages = toOpenAIMessages(systemInstruction, contents);
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey.trim()}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages,
      max_tokens: 500,
      temperature: 0.7,
    }),
  });
  const data = await res.json();
  if (!res.ok) {
    const err = new Error(data?.error?.message || `HTTP ${res.status}`);
    err.status = res.status;
    throw err;
  }
  const text = data?.choices?.[0]?.message?.content;
  if (text != null) return String(text).trim();
  throw new Error('No text in OpenAI response');
}

const PROVIDERS = {
  gemini: providerGemini,
  groq: providerGroq,
  openai: providerOpenAI,
};

/**
 * Try each provider in order; return first successful reply.
 * keys: { geminiApiKey, groqApiKey, openAiApiKey }
 * providerNames: ['gemini', 'groq'] etc (from ZEN_PROVIDERS env)
 */
export async function tryProviders(providerNames, keys, systemInstruction, contents) {
  const list = Array.isArray(providerNames) ? providerNames : String(providerNames || 'gemini').split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
  if (list.length === 0) list.push('gemini');
  let lastError;
  for (const name of list) {
    const fn = PROVIDERS[name];
    if (!fn) continue;
    const key = name === 'gemini' ? keys?.geminiApiKey : name === 'groq' ? keys?.groqApiKey : keys?.openAiApiKey;
    if (!key?.trim()) continue;
    try {
      const text = await fn(key, systemInstruction, contents);
      if (text?.trim()) return text;
    } catch (e) {
      lastError = e;
      if (typeof console !== 'undefined' && console.warn) {
        console.warn(`[Zen] Provider ${name} failed:`, e?.message || e);
      }
    }
  }
  throw lastError || new Error('No Zen provider available. Add GEMINI_API_KEY or GROQ_API_KEY to .env');
}
