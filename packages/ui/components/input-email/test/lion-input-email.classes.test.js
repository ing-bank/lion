/**
 * Proves the preferred contract: the caller hands the suite its CLASSES - a map whose keys are
 * Lion's tag names without the `lion-` prefix - and the suite runs against them. Kept in its own
 * file so it cannot share state with the `tagString` probe next to it.
 */
import { LionInputEmail } from '@lion/ui/input-email.js';
import { runInputEmailSuite } from '../test-suites/lion-input-email.suite.js';

class MyInputEmail extends LionInputEmail {}

describe('lion-input-email, run against a subclasser class (classes mode)', () => {
  runInputEmailSuite({ classes: { 'input-email': MyInputEmail } });
});
