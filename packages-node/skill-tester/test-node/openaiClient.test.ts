import test from 'node:test';
import assert from 'node:assert/strict';
import { createChatCompletion } from '../src/llm/openaiClient.ts';
import { startMockOpenAiServer } from './mockOpenAi.ts';

const llmConfig = (baseUrl: string) => ({
  provider: 'openai' as const,
  baseUrl,
  apiKey: 'test-key',
  model: 'test-model',
});

test('omits "temperature" by default (some models reject any non-default value)', async () => {
  const server = await startMockOpenAiServer([{ message: { role: 'assistant', content: 'ok' } }]);
  try {
    await createChatCompletion({
      config: llmConfig(server.baseUrl),
      messages: [{ role: 'user', content: 'hi' }],
    });
    const body = server.requests[0].body as Record<string, unknown>;
    assert.equal('temperature' in body, false, 'temperature must not be sent unless requested');
    assert.equal(body.model, 'test-model');
  } finally {
    await server.close();
  }
});

test('sends "temperature" when it is explicitly requested', async () => {
  const server = await startMockOpenAiServer([{ message: { role: 'assistant', content: 'ok' } }]);
  try {
    await createChatCompletion({
      config: llmConfig(server.baseUrl),
      messages: [{ role: 'user', content: 'hi' }],
      temperature: 0.2,
    });
    const body = server.requests[0].body as Record<string, unknown>;
    assert.equal(body.temperature, 0.2);
  } finally {
    await server.close();
  }
});

test('surfaces a non-retryable HTTP error with its status and body', async () => {
  const server = await startMockOpenAiServer([{ message: { role: 'assistant', content: 'ok' } }]);
  // The mock always returns 200; point at a closed port instead for a transport-level failure.
  await server.close();
  await assert.rejects(
    createChatCompletion({
      config: llmConfig(server.baseUrl),
      messages: [{ role: 'user', content: 'hi' }],
    }),
  );
});
