/**
 * Proves the preferred contract: the caller hands the suite its CLASSES - a map whose keys are Lion's
 * tag names without the `lion-` prefix. Lion's own element is the implicit default per key; an
 * extension layer passes its own subclasses here instead.
 */
import { LionTextarea } from '@lion/ui/textarea.js';
import { runTextareaSuite } from '../test-suites/lion-textarea.suite.js';

describe('lion-textarea.classes, run with an explicit classes map', () => {
  runTextareaSuite({ classes: { host: LionTextarea } });
});
