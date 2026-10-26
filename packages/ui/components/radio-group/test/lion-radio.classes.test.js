/**
 * Proves the preferred contract: the caller hands the suite its CLASSES - a map whose keys are
 * Lion's tag names without the `lion-` prefix - and the suite runs against them. Kept in its own
 * file so it cannot share state with the `tagString` probe next to it.
 */
import { LionRadio } from '@lion/ui/radio-group.js';
import { runRadioSuite } from '../test-suites/lion-radio.suite.js';

class MyRadio extends LionRadio {}

describe('lion-radio, run against a subclasser class (classes mode)', () => {
  runRadioSuite({ classes: { host: MyRadio } });
});
