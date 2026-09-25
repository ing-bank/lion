/**
 * Concrete provider presets used by the examples.
 *
 * These are examples, not built-in defaults: the library itself never assumes a vendor. Each
 * preset only names a base URL, the environment variable holding the key, and a model id you
 * could start from — pass `--models` to override.
 */

export const PRESETS = {
  openai: {
    description: 'OpenAI (the reference OpenAI-compatible endpoint)',
    provider: 'openai',
    baseUrl: 'https://api.openai.com/v1',
    apiKeyEnv: 'OPENAI_API_KEY',
    exampleModel: 'gpt-5-mini',
  },
  runware: {
    description: 'Runware — one OpenAI-compatible endpoint for many Western models',
    provider: 'openai',
    baseUrl: 'https://api.runware.ai/v1',
    apiKeyEnv: 'RUNWARE_API_KEY',
    exampleModel: 'openai-gpt-5-mini',
  },
  local: {
    description: 'Any local OpenAI-compatible server (Ollama, llama.cpp, vLLM, a gateway)',
    provider: 'openai',
    baseUrl: process.env.SKILL_TESTER_BASE_URL ?? 'http://localhost:8080/v1',
    apiKeyEnv: 'SKILL_TESTER_API_KEY',
    exampleModel: 'local-model',
  },
  copilot: {
    description: 'GitHub Copilot (needs the optional @github/copilot-sdk + Copilot auth)',
    provider: 'copilot',
    baseUrl: null,
    apiKeyEnv: null,
    exampleModel: null,
  },
};

export function getPreset(name) {
  const preset = PRESETS[name];
  if (!preset) {
    throw new Error(`Unknown preset "${name}". Available: ${Object.keys(PRESETS).join(', ')}`);
  }
  return preset;
}
