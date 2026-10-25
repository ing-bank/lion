import type { TestRunnerPlugin } from '@web/test-runner-core';

/**
 * The screen readers this flow can run against.
 *
 * - `virtual`: cross platform virtual screen reader, used for local runs on any OS
 * - `nvda`: Windows NVDA, one of the two blocking readers in CI
 * - `voiceover`: macOS VoiceOver, the other blocking reader in CI
 */
export type SrReader = 'virtual' | 'nvda' | 'voiceover';

/**
 * An expectation on the phrases a screen reader speaks.
 *
 * - `exact`: the spoken phrase log has to match `phrases` one to one
 * - `contains`: `phrases` have to appear in the log, in this order, allowing
 *   other phrases in between
 */
export type SrPhraseList =
  | { mode: 'exact'; phrases: string[] }
  | { mode: 'contains'; phrases: string[] }
  | { mode: 'containsLike'; phrases: string[] };

/**
 * What each reader is expected to speak for one state of a component.
 *
 * All three readers are required: `virtual` keeps the suite runnable on any
 * machine, `nvda` and `voiceover` are what CI blocks on. `virtual` is refused
 * when `CI` is set, so a virtual run can never be mistaken for the real check.
 */
export type SrExpectation = Record<SrReader, SrPhraseList>;

/** One observed run of `sr.expect()`, handed to the reporter. */
export interface SrObservation {
  reader: SrReader;
  mode: 'exact' | 'contains' | 'containsLike';
  expected: string[];
  heard: string[];
  ok: boolean;
}

export interface ScreenreaderPluginOptions {
  /**
   * The macOS application id of the browser the VoiceOver run drives, used to put it
   * in front so VoiceOver's cursor can reach its web content (Playwright's webkit
   * build by default: `org.webkit.Playwright`).
   */
  appId?: string;
  /** The screen reader this test run is bound to. */
  screenReader: SrReader;
}

/**
 * Web Test Runner plugin that exposes the `sr-*` commands used by
 * `test-runner-sr/commands.js`.
 */
export function screenreaderPlugin(options: ScreenreaderPluginOptions): TestRunnerPlugin;

/** Reporter that prints the phrases observed per test file. */
export function screenreaderReporter(): import('@web/test-runner-core').Reporter;
