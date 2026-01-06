import { runDialogTests } from './dialog-test-suite.js';

/**
 * VoiceOver screen reader tests for lion-dialog component.
 * Uses the shared dialog test suite with VoiceOver-specific configuration.
 */
runDialogTests({
  screenReader: 'voiceover',
});
