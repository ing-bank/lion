import { runDialogTests } from './lion-dialog.guidepup-wtr.test.mjs';

/**
 * Headless browser accessibility tests for dialog patterns.
 *
 * This test runs in CI without a real screen reader, using Playwright
 * to verify accessibility attributes and keyboard interactions.
 *
 * Uses the shared runDialogTests suite with lion-dialog components.
 */

runDialogTests({
  screenReader: 'virtual',
});
