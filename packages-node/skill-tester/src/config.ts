/**
 * Resolves the endpoint/model configuration for the OpenAI-compatible chat client.
 *
 * The tester talks to any OpenAI-compatible `/chat/completions` endpoint (OpenAI, DeepSeek,
 * Azure OpenAI, a local llama.cpp/Ollama server, ...). GitHub Copilot is not required.
 *
 * Precedence (first match wins):
 *   1. explicit per-call overrides (passed from the run config)
 *   2. `SKILL_TESTER_*` environment variables
 *   3. provider-specific defaults derived from the model name
 */

export type LlmConfig = {
  /** Base URL *including* the API version prefix, e.g. `https://api.deepseek.com/v1`. */
  baseUrl: string;
  apiKey: string;
  model: string;
};

export type LlmConfigOverrides = {
  baseUrl?: string;
  apiKey?: string;
};

const DEFAULT_OPENAI_BASE_URL = 'https://api.openai.com/v1';
const DEFAULT_DEEPSEEK_BASE_URL = 'https://api.deepseek.com/v1';

/** DeepSeek model ids look like `deepseek-chat` / `deepseek-reasoner`. */
export function isDeepSeekModel(model: string): boolean {
  return /^deepseek/i.test(model);
}

function firstDefined(...values: (string | undefined)[]): string | undefined {
  return values.find(value => typeof value === 'string' && value.length > 0);
}

/**
 * Resolve the endpoint + credential to use for a given model name.
 * Model names are matched case-insensitively against known providers so a run can mix
 * e.g. `['gpt-4.1', 'deepseek-chat']` and still route each one correctly.
 */
export function resolveLlmConfig(model: string, overrides: LlmConfigOverrides = {}): LlmConfig {
  const deepseek = isDeepSeekModel(model);

  const baseUrl = firstDefined(
    overrides.baseUrl,
    process.env.SKILL_TESTER_BASE_URL,
    deepseek ? process.env.DEEPSEEK_BASE_URL : undefined,
    process.env.OPENAI_BASE_URL,
    deepseek ? DEFAULT_DEEPSEEK_BASE_URL : DEFAULT_OPENAI_BASE_URL,
  )!;

  const apiKey = firstDefined(
    overrides.apiKey,
    process.env.SKILL_TESTER_API_KEY,
    deepseek ? process.env.DEEPSEEK_API_KEY : undefined,
    process.env.OPENAI_API_KEY,
    '',
  )!;

  return { baseUrl: baseUrl.replace(/\/+$/, ''), apiKey, model };
}

/** Human-readable description of where a credential for `model` is expected to come from. */
export function describeCredentialSource(model: string): string {
  return isDeepSeekModel(model)
    ? 'DEEPSEEK_API_KEY (or SKILL_TESTER_API_KEY / OPENAI_API_KEY)'
    : 'OPENAI_API_KEY (or SKILL_TESTER_API_KEY)';
}
