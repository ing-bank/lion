import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { isCopilotSdkAvailable, runCopilotAgent } from '../src/llm/copilotRunner.ts';
import { runSkillTester } from '../src/skillTester.ts';

const COPILOT_SDK_INSTALLED = await isCopilotSdkAvailable();
const skipWhenInstalled = COPILOT_SDK_INSTALLED
  ? 'the optional @github/copilot-sdk is installed here'
  : false;

function tempDir(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'skill-tester-copilot-'));
}

/** A real agent markdown file, since the orchestrator loads it before choosing a provider. */
function writeAgentFile(): string {
  const file = path.join(tempDir(), 'a.md');
  fs.writeFileSync(file, '---\ndescription: test agent\n---\n\nYou are a test agent.\n');
  return file;
}

test('the Copilot provider stays available while the SDK is optional', () => {
  // Guards the contract: the Copilot path exists and is discoverable, without the SDK being a hard
  // requirement of the package.
  assert.equal(typeof runCopilotAgent, 'function');
  assert.equal(typeof COPILOT_SDK_INSTALLED, 'boolean');
});

test(
  'the Copilot provider explains the optional dependency when it is missing',
  { skip: skipWhenInstalled },
  async () => {
    await assert.rejects(
      runCopilotAgent({
        llmConfig: { provider: 'copilot', baseUrl: '', apiKey: '', model: 'some-model' },
        systemPrompt: 'You are a test agent.',
        userPrompt: 'Do something.',
        sandboxRoot: tempDir(),
      }),
      (error: unknown) => {
        assert.ok(error instanceof Error);
        assert.match(error.message, /@github\/copilot-sdk/);
        assert.match(error.message, /npm install @github\/copilot-sdk/);
        // The message must point at the escape hatch.
        assert.match(error.message, /--provider openai/);
        return true;
      },
    );
  },
);

test(
  'a copilot run surfaces the same actionable error through the orchestrator',
  { skip: skipWhenInstalled },
  async () => {
    await assert.rejects(
      runSkillTester({
        skillOrAgent: { name: 'test-skill', type: 'agent', location: writeAgentFile() },
        scenarios: [
          {
            name: 'test/noop',
            kind: 'integration',
            description: 'noop',
            prompt: 'noop',
            targetFile: 'src/example.js',
            files: { 'src/example.js': '// x\n' },
            checks: [{ type: 'exists', file: 'src/example.js' }],
          },
        ],
        models: ['some-model'],
        llm: { provider: 'copilot' },
        sandboxBaseDir: tempDir(),
        reportDir: false,
        onProgress: () => {},
      }),
      /@github\/copilot-sdk/,
    );
  },
);
