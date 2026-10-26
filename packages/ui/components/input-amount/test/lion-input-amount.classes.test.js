/**
 * Proves the preferred contract: the caller hands the suite its CLASSES - a map whose keys are Lion's
 * tag names without the `lion-` prefix. Lion's own element is the implicit default per key; an
 * extension layer passes its own subclasses here instead.
 */
import { LionInputAmount } from '@lion/ui/input-amount.js';
import { runInputAmountSuite } from '../test-suites/lion-input-amount.suite.js';

describe('lion-input-amount.classes, run with an explicit classes map', () => {
  runInputAmountSuite({ classes: { host: LionInputAmount } });
});
