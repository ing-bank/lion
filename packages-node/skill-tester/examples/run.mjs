#!/usr/bin/env node
/**
 * Runnable example: evaluate the `lion-ui` skill against a real model using the library API.
 *
 *   node examples/run.mjs deepseek --models deepseek-chat --limit 3
 *   node examples/run.mjs runware  --models deepseek-v4-flash --kind component --limit 2
 *   node examples/run.mjs local    --models my-model --base-url http://localhost:8080/v1
 *   node examples/run.mjs copilot  --models <copilot-model> --limit 1
 *
 * The preset only supplies a base URL and the name of the environment variable holding the key;
 * everything else is an ordinary CLI argument. See `README.md` in this folder for the equivalent
 * `npm run eval -- ...` command lines.
 */

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  defaultLionUiSkillLocation,
  loadLionUiScenarios,
  runSkillTester,
} from '../src/index.ts';
import { getPreset } from './presets.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '../../..');

const [presetName, ...rest] = process.argv.slice(2);
if (!presetName) {
  const { PRESETS } = await import('./presets.mjs');
  console.error(`Usage: node examples/run.mjs <${Object.keys(PRESETS).join('|')}> [options]`);
  process.exit(2);
}

const preset = getPreset(presetName);

/** Tiny argument reader: the flags the example supports, everything else falls back to defaults. */
function readArg(flag, fallback) {
  const index = rest.indexOf(flag);
  return index !== -1 && rest[index + 1] ? rest[index + 1] : fallback;
}
const models = readArg('--models', preset.exampleModel ?? '').split(',').filter(Boolean);
const samples = Number(readArg('--samples', '1'));
const limit = Number(readArg('--limit', '0')) || undefined;
const kind = readArg('--kind');
const baseUrl = readArg('--base-url', preset.baseUrl ?? undefined);

if (models.length === 0) {
  console.error('Pass --models <model> (this preset has no default model).');
  process.exit(2);
}

const apiKey = preset.apiKeyEnv ? process.env[preset.apiKeyEnv] : undefined;
if (preset.provider === 'openai' && !apiKey) {
  console.error(
    `No API key: set ${preset.apiKeyEnv} (or pass one to the CLI). ` +
      'An OpenAI-compatible endpoint without auth is fine — set the variable to any value.',
  );
  process.exit(2);
}

let scenarios = loadLionUiScenarios({ repoRoot });
if (kind) scenarios = scenarios.filter(scenario => scenario.kind === kind);
if (limit) scenarios = scenarios.slice(0, limit);

console.log(
  `Preset ${presetName}: ${preset.description}\n` +
    `  endpoint : ${baseUrl ?? '(handled by the SDK)'}\n` +
    `  models   : ${models.join(', ')}\n` +
    `  scenarios: ${scenarios.length} (${samples} sample(s) each)\n`,
);

const report = await runSkillTester({
  skillOrAgent: {
    name: 'lion-ui',
    type: 'skill',
    location: defaultLionUiSkillLocation(repoRoot),
  },
  scenarios,
  models,
  sampleSize: samples,
  llm: { provider: preset.provider, baseUrl, apiKey },
  passThreshold: 100,
}).catch(error => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});

console.log(`\nOverall quality score: ${(report.overall.mean * 100).toFixed(1)}%`);
for (const entry of report.perModel) {
  console.log(
    `  ${entry.model}: mean ${(entry.stats.mean * 100).toFixed(1)}%, ` +
      `min ${(entry.stats.min * 100).toFixed(1)}%, max ${(entry.stats.max * 100).toFixed(1)}% ` +
      `(std dev ${(entry.stats.stdDev * 100).toFixed(1)})`,
  );
}

process.exitCode = report.overall.mean >= 1 ? 0 : 1;
