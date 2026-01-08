import { runDialogTests } from './dialog-test-suite.js';

/**
 * NVDA screen reader tests for lion-dialog component.
 * Uses the shared dialog test suite with NVDA-specific configuration.
 */
runDialogTests({
  screenReader: 'nvda',
});
