/**
 * Token rates per model, in USD per 1M tokens, each with the source it came from.
 *
 * Runware publishes a machine-readable rate sheet per model:
 *
 *   curl -s https://runware.ai/docs/models/<slug>/schema.json | jq '.info["x-pricing"]'
 *
 * Where that document exists, the numbers below were read from it and `confidence` says so. Where it
 * does not — measured: every deepseek text slug tried returns a 404 page, not JSON — the entry cites
 * what it did come from instead, and is marked as third-party so a reader can weigh it. Nothing here
 * is estimated or interpolated: a model with no published rate has no entry, and the results page
 * prints no cost for it rather than a plausible-looking number.
 *
 * Rates move. `retrievedAt` is part of the data, not a comment, so a stale row is visible on the page
 * instead of silently wrong.
 */

export type TokenRate = {
  /** USD per 1M input tokens. */
  input: number;
  /** USD per 1M output tokens. */
  output: number;
  /** USD per 1M cached input tokens, when the model publishes one. */
  cached?: number;
  /** The document the numbers were read from. */
  source: string;
  /**
   * `provider-schema` — the provider's own machine-readable rate sheet.
   * `aggregator` — a third party listing the provider's rates; usable, but a step removed.
   */
  confidence: 'provider-schema' | 'aggregator';
  /** ISO date the rates were read. */
  retrievedAt: string;
  /** Anything a reader needs to interpret the number correctly. */
  note?: string;
};

export const RATES: Record<string, TokenRate> = {
  'openai-gpt-5-mini': {
    input: 0.25,
    output: 2,
    cached: 0.025,
    source: 'https://runware.ai/docs/models/openai-gpt-5-mini/schema.json',
    confidence: 'provider-schema',
    retrievedAt: '2026-10-12',
  },
  'xai-grok-4-3': {
    input: 1.25,
    output: 2.5,
    cached: 0.2,
    source: 'https://runware.ai/docs/models/xai-grok-4-3/schema.json',
    confidence: 'provider-schema',
    retrievedAt: '2026-10-12',
  },
  'google-gemini-3-flash': {
    input: 0.5,
    output: 3,
    source: 'https://runware.ai/docs/models/google-gemini-3-flash/schema.json',
    confidence: 'provider-schema',
    retrievedAt: '2026-10-12',
    note: 'the schema publishes two input tiers, $0.50 and $1.00 per 1M; the lower one is used here',
  },
  'deepseek-v4-1-flash': {
    input: 0.15,
    output: 0.6,
    cached: 0.01,
    source: 'https://llmgateway.io/providers/runware',
    confidence: 'aggregator',
    retrievedAt: '2026-10-12',
    note: 'runware publishes no schema for this slug; the input rate matches runware.ai/pricing',
  },
  'deepseek-v4-flash': {
    input: 0.076,
    output: 0.153,
    cached: 0.014,
    source: 'https://llmgateway.io/providers/runware',
    confidence: 'aggregator',
    retrievedAt: '2026-10-12',
    note: 'runware publishes no schema for this slug; deepseek retire this id and serve it at the V4.1 Flash price',
  },
};

/** USD cost of one run, or undefined when the model has no published rate. */
export function costOf(
  model: string,
  promptTokens: number,
  completionTokens: number,
): number | undefined {
  const rate = RATES[model];
  if (!rate) return undefined;
  return (promptTokens / 1_000_000) * rate.input + (completionTokens / 1_000_000) * rate.output;
}

/** Two decimals reads better than six for per-run amounts; more precision is noise at this size. */
export function formatUsd(amount: number): string {
  return `$${amount < 0.01 ? amount.toFixed(4) : amount.toFixed(2)}`;
}
