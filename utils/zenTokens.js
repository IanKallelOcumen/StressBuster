/**
 * Zen token economics — tune here to avoid hitting API rate limits.
 * Higher cost per message + lower distribution = fewer API calls.
 */

/** Tokens required and deducted per Zen chat message (high = expensive, limits use) */
export const ZEN_CHAT_COST = 25;

/** Tokens required and deducted per Zen tip */
export const ZEN_TIP_COST = 5;

/** Max Zen messages per user per day (fair-use; resets midnight PT) */
export const ZEN_DAILY_CAP = 10;

/** Tokens given to new users on signup */
export const ZEN_SIGNUP_TOKENS = 5;

/** Max tokens a user can hold */
export const ZEN_MAX_TOKENS = 400;

/** Daily streak reward: day 1 = this many, then streak * this (e.g. 3 → day 2 = 6, day 3 = 9) */
export const ZEN_DAILY_REWARD_PER_STREAK = 3;

/** Minigame rewards are multiplied by this (e.g. 0.5 = half tokens). Lower = fewer tokens from games. */
export const MINIGAME_REWARD_SCALE = 0.5;

/** Apply scale to a raw minigame reward; returns at least 1 when raw >= 1. */
export function scaleMinigameReward(raw) {
  if (raw == null || raw < 1) return 0;
  return Math.max(1, Math.round(Number(raw) * MINIGAME_REWARD_SCALE));
}
