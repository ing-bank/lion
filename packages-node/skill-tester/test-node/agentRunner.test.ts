import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { runSkillTester } from '../src/skillTester.ts';
import { startMockOpenAiServer, writeFileToolCall } from './mockOpenAi.ts';
import type { TestScenario } from '../src/scenarios/types.ts';

const EXPECTED_CONTENT = [
  "import { LionButton } from '@lion/ui/button.js';",
  "import { LitElement, html } from '@lion/ui/core.js';",
  'export const example = () => html`<lion-button>Click</lion-button>`;',
  '',
].join('\n');

function scenario(): TestScenario {
  return {
    name: 'test/write-button-example',
    kind: 'integration',
    description: 'Write a button usage example.',
    prompt: 'Add a usage example to src/example.js',
    targetFile: 'src/example.js',
    files: { 'src/example.js': '// TODO: add a usage example.\n' },
    expectedTransformedFiles: { 'src/example.js': EXPECTED_CONTENT },
  };
}

function tempDir(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'skill-tester-run-'));
}

/** Write a minimal agent markdown file and return its absolute path. */
function writeAgentFile(): string {
  const file = path.join(tempDir(), 'agent.md');
  fs.writeFileSync(file, '---\ndescription: test agent\n---\n\nYou are a test agent.\n');
  return file;
}

test('runs a scenario end to end against an OpenAI-compatible endpoint', async () => {
  const server = await startMockOpenAiServer([
    { message: writeFileToolCall('src/example.js', EXPECTED_CONTENT) },
    { message: { role: 'assistant', content: 'Done.' } },
  ]);

  try {
    const report = await runSkillTester({
      skillOrAgent: {
        name: 'test-skill',
        type: 'agent',
        location: writeAgentFile(),
        extraFiles: {},
      },
      scenarios: [scenario()],
      models: ['deepseek-chat'],
      sampleSize: 1,
      llm: { baseUrl: server.baseUrl, apiKey: 'test-key' },
      sandboxBaseDir: tempDir(),
      reportDir: false,
      onProgress: () => {},
    });

    assert.equal(report.runs.length, 1);
    assert.equal(report.overall.mean, 1, 'expected a perfect score');
    assert.equal(report.runs[0].agentRun.toolCalls, 1);
    assert.equal(report.runs[0].agentRun.finished, true);

    // The mock endpoint must have received our tool definitions and the bearer token.
    assert.equal(server.requests.length, 2);
    const tools = server.requests[0].body.tools as { function: { name: string } }[];
    assert.ok(Array.isArray(tools));
    const toolNames = tools.map(tool => tool.function.name);
    assert.ok(toolNames.includes('write_file'), `tools were ${toolNames.join(', ')}`);
    assert.equal(server.requests[0].authorization, 'Bearer test-key');

    // The second request must carry the tool result back to the model.
    const secondMessages = server.requests[1].body.messages as { role: string }[];
    assert.ok(secondMessages.some(message => message.role === 'tool'));
  } finally {
    await server.close();
  }
});

test('reports a low score and evidence when the model produces the wrong output', async () => {
  const server = await startMockOpenAiServer([
    { message: writeFileToolCall('src/example.js', "import { LionButton } from '@lion/button';\n") },
    { message: { role: 'assistant', content: 'Done.' } },
  ]);

  try {
    const report = await runSkillTester({
      skillOrAgent: { name: 'test-skill', type: 'agent', location: writeAgentFile() },
      scenarios: [
        {
          ...scenario(),
          expectedTransformedFiles: undefined,
          checks: [
            {
              type: 'matches',
              file: 'src/example.js',
              pattern: "from\\s+['\"]@lion/ui/button\\.js['\"]",
              description: "imports from '@lion/ui/button.js'",
            },
            {
              type: 'notMatches',
              file: 'src/example.js',
              pattern: "from\\s+['\"]@lion/button['\"]",
              description: "does not import '@lion/button'",
            },
          ],
        },
      ],
      models: ['deepseek-chat'],
      sampleSize: 1,
      llm: { baseUrl: server.baseUrl, apiKey: 'test-key' },
      sandboxBaseDir: tempDir(),
      reportDir: false,
      onProgress: () => {},
    });

    assert.ok(report.overall.mean < 1, 'expected a non-perfect score');
    const failing = report.runs[0].score.checks.filter(check => !check.passed);
    assert.equal(failing.length, 2, JSON.stringify(failing));
    const descriptions = failing.map(check => check.description).sort();
    assert.deepEqual(descriptions, [
      "does not import '@lion/button'",
      "imports from '@lion/ui/button.js'",
    ].sort());
  } finally {
    await server.close();
  }
});

test('an unknown tool name is reported back to the model instead of crashing', async () => {
  const server = await startMockOpenAiServer([
    {
      message: {
        role: 'assistant',
        content: null,
        tool_calls: [
          { id: 'c1', type: 'function', function: { name: 'make_coffee', arguments: '{}' } },
        ],
      },
    },
    { message: { role: 'assistant', content: 'Could not complete.' } },
  ]);

  try {
    const report = await runSkillTester({
      skillOrAgent: { name: 'test-skill', type: 'agent', location: writeAgentFile() },
      scenarios: [scenario()],
      models: ['deepseek-chat'],
      sampleSize: 1,
      llm: { baseUrl: server.baseUrl, apiKey: 'test-key' },
      sandboxBaseDir: tempDir(),
      reportDir: false,
      onProgress: () => {},
    });

    assert.equal(report.runs[0].agentRun.toolErrors, 1);
    assert.equal(report.runs[0].agentRun.finished, true);
  } finally {
    await server.close();
  }
});
