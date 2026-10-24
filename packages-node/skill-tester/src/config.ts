/**
 * Provider configuration for skill-tester.
 *
 * Two providers are supported, chosen explicitly (never guessed from the model name):
 *
 *   - `openai`  — any OpenAI-compatible `/chat/completions` endpoint: OpenAI, Azure OpenAI,
 *                 Anthropic or Google models behind a gateway, a local server, ...
 *   - `copilot` — GitHub Copilot, via the optional `@github/copilot-sdk`.
 *
 * Precedence (first match wins): explicit per-call overrides → `SKILL_TESTER_*` environment
 * variables → generic `OPENAI_*` variables → documented defaults.
 *
 * No model is pinned: the model is whatever the caller passes.
 */

export type Provider = 'openai' | 'copilot';

export type LlmConfig = {
  provider: Provider;
  /** Base URL for the `openai` provider (ignored by `copilot`). */
  baseUrl: string;
  /** API key for the `openai` provider (may be empty for local servers). */
  apiKey: string;
  model: string;
};

export type LlmConfigOverrides = {
  provider?: Provider;
  baseUrl?: string;
  apiKey?: string;
};

export const DEFAULT_OPENAI_BASE_URL = 'https://api.openai.com/v1';

/** Aliases accepted for each provider, so `--provider openai-compatible` works too. */
const PROVIDER_ALIASES: Record<string, Provider> = {
  openai: 'openai',
  'openai-compatible': 'openai',
  compatible: 'openai',
  copilot: 'copilot',
  'github-copilot': 'copilot',
};

const PROVIDER_ALIAS_LIST = '"openai" (any OpenAI-compatible endpoint) or "copilot"';

function firstDefined(...values: (string | undefined)[]): string | undefined {
  return values.find(value => typeof value === 'string' && value.length > 0);
}

export function resolveProvider(overrides: LlmConfigOverrides = {}): Provider {
  const raw = firstDefined(overrides.provider, process.env.SKILL_TESTER_PROVIDER) ?? 'openai';
  const provider = PROVIDER_ALIASES[raw.toLowerCase()];
  if (!provider) {
    throw new Error(`Unknown provider "${raw}". Expected ${PROVIDER_ALIAS_LIST}.`);
  }
  return provider;
}

/**
 * Resolve the provider, endpoint and credential to use for a given model.
 * The model name is passed through untouched — no vendor-specific defaults are derived from it.
 */
export function resolveLlmConfig(model: string, overrides: LlmConfigOverrides = {}): LlmConfig {
  const baseUrl = firstDefined(
    overrides.baseUrl,
    process.env.SKILL_TESTER_BASE_URL,
    process.env.OPENAI_BASE_URL,
    DEFAULT_OPENAI_BASE_URL,
  )!;

  const apiKey = firstDefined(
    overrides.apiKey,
    process.env.SKILL_TESTER_API_KEY,
    process.env.OPENAI_API_KEY,
    '',
  )!;

  return {
    provider: resolveProvider(overrides),
    baseUrl: baseUrl.replace(/\/+$/, ''),
    apiKey,
    model,
  };
}

/** Where the credential for the `openai` provider is expected to come from (for messages/docs). */
export function describeOpenAiCredentialSource(): string {
  return 'SKILL_TESTER_API_KEY or OPENAI_API_KEY';
}
