import { runDialogTests } from './lion-dialog.guidepup-wtr.test.mjs';

/**
 * NVDA screen reader tests for lion-dialog component.
 * Uses the shared dialog test suite with NVDA-specific configuration.
 */
runDialogTests({
  screenReader: 'nvda',
});
