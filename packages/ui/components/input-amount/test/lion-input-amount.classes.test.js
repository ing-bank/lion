/**
 * Proves the preferred contract: the caller hands the suite its CLASSES - a map whose keys are
 * Lion's tag names without the `lion-` prefix - and the suite runs against them. Kept in its own
 * file so it cannot share state with the `tagString` probe next to it.
 */
import { LionInputAmount } from '@lion/ui/input-amount.js';
import { runInputAmountSuite } from '../test-suites/lion-input-amount.suite.js';

class MyInputAmount extends LionInputAmount {}

describe('lion-input-amount, run against a subclasser class (classes mode)', () => {
  runInputAmountSuite({ classes: { 'input-amount': MyInputAmount } });
});
