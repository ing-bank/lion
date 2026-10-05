/**
 * Public API of skill-tester.
 *
 * ```js
 * import { runSkillTester, loadLionUiScenarios, defaultLionUiSkillLocation } from 'skill-tester';
 *
 * const report = await runSkillTester({
 *   skillOrAgent: { name: 'lion-ui', type: 'skill', location: defaultLionUiSkillLocation() },
 *   scenarios: loadLionUiScenarios({ repoRoot: process.cwd() }),
 *   models: ['gpt-5-mini'],
 *   sampleSize: 1,
 * });
 * console.log(report.overall.mean);
 * ```
 */

export {
  runSkillTester,
  loadSkillOrAgent,
  createAgentConfig,
  defaultLionUiSkillLocation,
  type SkillOrAgent,
  type SkillTesterConfig,
  type SkillTesterReport,
  type ScenarioRunResult,
  type ModelScenarioSummary,
  type RunRecordMetadata,
} from './skillTester.ts';

export {
  loadLionUiScenarios,
  discoverComponentNames,
  discoverSystemNames,
  discoverKnownTags,
  discoverDefineEntrypoints,
  manualScenarios,
  NON_VISUAL_COMPONENT_DIRS,
  SYSTEM_NAMES,
  defineEntrypointFor,
  type TestScenario,
  type ScenarioCheck,
  type LionUiScenarioContext,
} from './scenarios/index.ts';

export {
  createComponentScenario,
  createSystemScenario,
  createLionUiScenarios,
  entrypointFor,
} from './scenarios/lionUi.ts';

export {
  scoreScenario,
  scoreFile,
  applyGates,
  evaluateCheck,
  lineSimilarity,
  normalizeContent,
  aggregate,
  type ScenarioScore,
  type FileScore,
  type CheckOutcome,
  type AggregateStats,
} from './scoring/qualityScore.ts';

export {
  runGates,
  syntaxGate,
  importPolicyGate,
  type GateResult,
  type GateFailure,
} from './scoring/gates.ts';

export { writeRunRecord, renderRunRecord } from './report/runRecord.ts';

export {
  resolveLlmConfig,
  resolveProvider,
  describeOpenAiCredentialSource,
  DEFAULT_OPENAI_BASE_URL,
  type Provider,
  type LlmConfig,
} from './config.ts';

export { runAgent as runOpenAiCompatibleAgent, type AgentRunResult, type AgentEvent } from './llm/agentRunner.ts';

export { runCopilotAgent, isCopilotSdkAvailable, type CopilotAgentOptions } from './llm/copilotRunner.ts';

export { createFileToolset } from './llm/tools.ts';

export { createProjectSandbox, type ProjectMock } from './createProjectSandbox.ts';
