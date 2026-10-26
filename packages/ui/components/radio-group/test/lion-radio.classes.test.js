/**
 * Proves the preferred contract: the caller hands the suite its CLASSES - a map whose keys are Lion's
 * tag names without the `lion-` prefix. Lion's own element is the implicit default per key; an
 * extension layer passes its own subclasses here instead.
 */
import { LionRadio } from '@lion/ui/radio-group.js';
import { runRadioSuite } from '../test-suites/lion-radio.suite.js';

describe('lion-radio.classes, run with an explicit classes map', () => {
  runRadioSuite({ classes: { host: LionRadio } });
});
