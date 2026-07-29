import { visualDiff } from '@web/test-runner-visual-regression';

/**
 * Wrapper for visualDiff that allows tests to include visual regression checks.
 * When --visual-diff is passed, the plugin loads and captures screenshots.
 *
 * Usage:
 *   await visualDiffEnabled(element, 'screenshot-name');
 *
 * @param {Element} element - The element to capture
 * @param {string} name - Name for the screenshot
 */
export async function visualDiffEnabled(element, name) {
  return visualDiff(element, name);
}
