import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DEFAULT_OPENAI_BASE_URL,
  resolveLlmConfig,
  resolveProvider,
} from '../src/config.ts';

const MANAGED_ENV = [
  'SKILL_TESTER_PROVIDER',
  'SKILL_TESTER_BASE_URL',
  'SKILL_TESTER_API_KEY',
  'OPENAI_BASE_URL',
  'OPENAI_API_KEY',
];

/** Run `fn` with the managed env vars cleared, then restore the original values. */
function withEnv<T>(values: Record<string, string>, fn: () => T): T {
  const saved: Record<string, string | undefined> = {};
  for (const key of MANAGED_ENV) {
    saved[key] = process.env[key];
    delete process.env[key];
  }
  Object.assign(process.env, values);
  try {
    return fn();
  } finally {
    for (const key of MANAGED_ENV) {
      if (saved[key] === undefined) delete process.env[key];
      else process.env[key] = saved[key];
    }
  }
}

test('resolveProvider defaults to the OpenAI-compatible provider', () => {
  withEnv({}, () => assert.equal(resolveProvider(), 'openai'));
});

test('resolveProvider accepts aliases for both providers', () => {
  withEnv({}, () => {
    assert.equal(resolveProvider({ provider: 'copilot' }), 'copilot');
    assert.equal(resolveProvider({ provider: 'openai-compatible' }), 'openai');
    assert.equal(resolveProvider({ provider: 'openai' }), 'openai');
  });
});

test('resolveProvider rejects an unknown provider with a helpful message', () => {
  withEnv({}, () => {
    assert.throws(
      () => resolveProvider({ provider: 'bedrock' as never }),
      /Unknown provider "bedrock"\. Expected "openai".*or "copilot"/,
    );
  });
});

test('the provider can be selected through the environment', () => {
  withEnv({ SKILL_TESTER_PROVIDER: 'copilot' }, () => {
    assert.equal(resolveProvider(), 'copilot');
  });
});

test('no model is pinned: an unrecognised model name does not change the endpoint', () => {
  withEnv({}, () => {
    // A model name must never imply a vendor endpoint.
    assert.equal(resolveLlmConfig('deepseek-chat').baseUrl, DEFAULT_OPENAI_BASE_URL);
    assert.equal(resolveLlmConfig('some-local-model').baseUrl, DEFAULT_OPENAI_BASE_URL);
    assert.equal(resolveLlmConfig('deepseek-chat').model, 'deepseek-chat');
  });
});

test('an explicit base URL and key win over the defaults', () => {
  withEnv({ OPENAI_BASE_URL: 'https://env.example/v1', OPENAI_API_KEY: 'env-key' }, () => {
    assert.deepEqual(resolveLlmConfig('m', { baseUrl: 'https://explicit.example/v1/', apiKey: 'k' }), {
      provider: 'openai',
      baseUrl: 'https://explicit.example/v1',
      apiKey: 'k',
      model: 'm',
    });
  });
});

test('SKILL_TESTER_* variables take precedence over OPENAI_* ones', () => {
  withEnv(
    {
      SKILL_TESTER_BASE_URL: 'https://st.example/v1',
      SKILL_TESTER_API_KEY: 'st-key',
      OPENAI_BASE_URL: 'https://openai.example/v1',
      OPENAI_API_KEY: 'openai-key',
    },
    () => {
      const config = resolveLlmConfig('m');
      assert.equal(config.baseUrl, 'https://st.example/v1');
      assert.equal(config.apiKey, 'st-key');
    },
  );
});

test('the provider is carried into the resolved config', () => {
  withEnv({}, () => {
    assert.equal(resolveLlmConfig('m', { provider: 'copilot' }).provider, 'copilot');
  });
});
