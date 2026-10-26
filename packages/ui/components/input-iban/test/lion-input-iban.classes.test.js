/**
 * Proves the preferred contract: the caller hands the suite its CLASSES - a map whose keys are
 * Lion's tag names without the `lion-` prefix - and the suite runs against them. Kept in its own
 * file so it cannot share state with the `tagString` probe next to it.
 */
import { LionInputIban } from '@lion/ui/input-iban.js';
import { runInputIbanSuite } from '../test-suites/lion-input-iban.suite.js';

class MyInputIban extends LionInputIban {}

describe('lion-input-iban, run against a subclasser class (classes mode)', () => {
  runInputIbanSuite({ classes: { host: MyInputIban } });
});
