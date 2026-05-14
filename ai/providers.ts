import 'dotenv/config';
import OpenAI from 'openai';

export type Provider = 'deepseek' | 'gpt-4o-mini' | 'gpt-4o';

export interface ProviderConfig {
  id:          Provider;
  label:       string;
  model:       string;
  baseURL?:    string;
  envKey:      string;
  inputPricePerM:  number;  // USD per million tokens
  outputPricePerM: number;
  supportsCache:   boolean; // DeepSeek cache miss/hit pricing
}

export const PROVIDERS: Record<Provider, ProviderConfig> = {
  'deepseek': {
    id:    'deepseek',
    label: 'DeepSeek V3',
    model: 'deepseek-chat',
    baseURL: 'https://api.deepseek.com',
    envKey: 'DEEPSEEK_API_KEY',
    inputPricePerM:  0.27,
    outputPricePerM: 1.10,
    supportsCache: true,
  },
  'gpt-4o-mini': {
    id:    'gpt-4o-mini',
    label: 'GPT-4o mini',
    model: 'gpt-4o-mini',
    envKey: 'OPENAI_API_KEY',
    inputPricePerM:  0.15,
    outputPricePerM: 0.60,
    supportsCache: false,
  },
  'gpt-4o': {
    id:    'gpt-4o',
    label: 'GPT-4o',
    model: 'gpt-4o',
    envKey: 'OPENAI_API_KEY',
    inputPricePerM:  2.50,
    outputPricePerM: 10.00,
    supportsCache: false,
  },
};

export function getClient(provider: Provider): OpenAI {
  const cfg = PROVIDERS[provider];
  const apiKey = process.env[cfg.envKey];
  if (!apiKey) throw new Error(`${cfg.envKey} is not set in .env`);
  return new OpenAI({ apiKey, baseURL: cfg.baseURL, maxRetries: 2 });
}

export function getOpenAIClient(): OpenAI | null {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return null;
  return new OpenAI({ apiKey: key, maxRetries: 2 });
}

export function estimateCost(
  provider: Provider,
  usage: { inputTokens: number; outputTokens: number; cacheReadTokens: number; cacheCreationTokens: number },
): number {
  const cfg = PROVIDERS[provider];
  if (cfg.supportsCache) {
    // DeepSeek: cache miss at full price, cache hit at ~26% price
    return (
      (usage.cacheCreationTokens * cfg.inputPricePerM) / 1_000_000 +
      (usage.cacheReadTokens     * 0.07)               / 1_000_000 +
      (usage.outputTokens        * cfg.outputPricePerM) / 1_000_000
    );
  }
  return (
    (usage.inputTokens  * cfg.inputPricePerM)  / 1_000_000 +
    (usage.outputTokens * cfg.outputPricePerM) / 1_000_000
  );
}

// Approximate cost estimate before generation (for UI display)
// Based on average token counts per generation type
export function estimateGenerationCost(provider: Provider, pageCount: number): number {
  const cfg = PROVIDERS[provider];
  const inputPerSite  = 8_000 + pageCount * 4_000;
  const outputPerSite = 2_000 + pageCount * 5_000;
  return (inputPerSite * cfg.inputPricePerM + outputPerSite * cfg.outputPricePerM) / 1_000_000;
}
