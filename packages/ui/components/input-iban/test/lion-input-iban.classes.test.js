/**
 * Proves the preferred contract: the caller hands the suite its CLASSES - a map whose keys are Lion's
 * tag names without the `lion-` prefix. Lion's own element is the implicit default per key; an
 * extension layer passes its own subclasses here instead.
 */
import { LionInputIban } from '@lion/ui/input-iban.js';
import { runInputIbanSuite } from '../test-suites/lion-input-iban.suite.js';

describe('lion-input-iban.classes, run with an explicit classes map', () => {
  runInputIbanSuite({ classes: { host: LionInputIban } });
});
