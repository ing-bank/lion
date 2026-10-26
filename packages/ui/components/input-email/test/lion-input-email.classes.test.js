/**
 * Proves the preferred contract: the caller hands the suite its CLASSES - a map whose keys are Lion's
 * tag names without the `lion-` prefix. Lion's own element is the implicit default per key; an
 * extension layer passes its own subclasses here instead.
 */
import { LionInputEmail } from '@lion/ui/input-email.js';
import { runInputEmailSuite } from '../test-suites/lion-input-email.suite.js';

describe('lion-input-email.classes, run with an explicit classes map', () => {
  runInputEmailSuite({ classes: { host: LionInputEmail } });
});
