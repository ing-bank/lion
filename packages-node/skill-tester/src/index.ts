/**
 * Public API of skill-tester.
 *
 * ```js
 * import { runSkillTester, loadLionUiScenarios, defaultLionUiSkillLocation } from 'skill-tester';
 *
 * const report = await runSkillTester({
 *   skillOrAgent: { name: 'lion-ui', type: 'skill', location: defaultLionUiSkillLocation() },
 *   scenarios: loadLionUiScenarios({ repoRoot: process.cwd() }),
 *   models: ['deepseek-chat'],
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
  manualScenarios,
  NON_VISUAL_COMPONENT_DIRS,
  SYSTEM_NAMES,
  type TestScenario,
  type ScenarioCheck,
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
  evaluateCheck,
  lineSimilarity,
  normalizeContent,
  aggregate,
  type ScenarioScore,
  type FileScore,
  type CheckOutcome,
  type AggregateStats,
} from './scoring/qualityScore.ts';

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
