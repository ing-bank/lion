/**
 * Proves the preferred contract: the caller hands the suite its CLASSES - a map whose keys are Lion's
 * tag names without the `lion-` prefix. Lion's own element is the implicit default per key; an
 * extension layer passes its own subclasses here instead.
 */
import { LionRadio, LionRadioGroup } from '@lion/ui/radio-group.js';
import { runRadioGroupSuite } from '../test-suites/lion-radio-group.suite.js';

describe('lion-radio-group.classes, run with an explicit classes map', () => {
  runRadioGroupSuite({ classes: { host: LionRadioGroup, radio: LionRadio } });
});
