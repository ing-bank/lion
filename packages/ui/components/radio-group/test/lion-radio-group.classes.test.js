/**
 * Proves the preferred contract: the caller hands the suite its CLASSES - a map whose keys are
 * Lion's tag names without the `lion-` prefix - and the suite runs against them. Kept in its own
 * file so it cannot share state with the `tagString` probe next to it.
 */
import { LionRadio, LionRadioGroup } from '@lion/ui/radio-group.js';
import { runRadioGroupSuite } from '../test-suites/lion-radio-group.suite.js';

class MyRadioGroup extends LionRadioGroup {}
class MyRadio extends LionRadio {}

describe('lion-radio-group, run against a subclasser class (classes mode)', () => {
  runRadioGroupSuite({ classes: { host: MyRadioGroup, radio: MyRadio } });
});
