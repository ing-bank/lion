import type { TestRunnerPlugin } from '@web/test-runner-core';

export interface ScreenreaderPluginOptions {
  /**
   * The screen reader to use.
   * - 'virtual': Cross-platform virtual screen reader (default)
   * - 'voiceover': macOS VoiceOver
   * - 'nvda': Windows NVDA
   */
  screenReader?: 'voiceover' | 'nvda' | 'virtual';
}

/**
 * Web Test Runner plugin that provides screen reader testing commands.
 *
 * @example
 * ```js
 * // web-test-runner.config.mjs
 * import { screenreaderPlugin } from '@lion/test-runner-sr';
 *
 * export default {
 *   plugins: [screenreaderPlugin({ screenReader: 'virtual' })],
 * };
 * ```
 */
export function screenreaderPlugin(options?: ScreenreaderPluginOptions): TestRunnerPlugin;
