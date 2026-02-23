/**
 * Lightweight mood hint from keywords (no API). Used for Zen chat and to
 * complement journal mood so Insights can reflect both journal + chat.
 */
const KEYWORDS = {
  positive: ['happy', 'great', 'good', 'calm', 'relaxed', 'peaceful', 'grateful', 'hopeful', 'love', 'joy', 'better', 'relief', 'relieved', 'excited', 'amazing', 'wonderful', 'ok', 'okay', 'fine'],
  negative: ['sad', 'bad', 'angry', 'anxious', 'stressed', 'worried', 'scared', 'tired', 'overwhelmed', 'frustrated', 'lonely', 'down', 'terrible', 'awful', 'panic', 'depressed', 'hurt'],
  neutral: ['meh', 'nothing', 'same', 'idk', 'unsure', 'thinking'],
};

/**
 * Infer mood from text using keywords only (no API). Returns { emoji, label, confidence }.
 */
export function moodFromKeywords(text) {
  if (!text || typeof text !== 'string') return { emoji: '😐', label: 'Neutral', confidence: 0.5 };
  const lower = text.toLowerCase().trim();
  if (lower.length === 0) return { emoji: '😐', label: 'Neutral', confidence: 0.5 };

  let pos = 0;
  let neg = 0;
  for (const w of KEYWORDS.positive) {
    if (lower.includes(w)) pos++;
  }
  for (const w of KEYWORDS.negative) {
    if (lower.includes(w)) neg++;
  }

  if (pos > neg) return { emoji: '😊', label: 'Positive', confidence: 0.85 };
  if (neg > pos) return { emoji: '😔', label: 'Needing support', confidence: 0.85 };
  return { emoji: '😐', label: 'Neutral', confidence: 0.5 };
}
