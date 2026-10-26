/**
 * Proves the preferred contract: the caller hands the suite its CLASSES - a map whose keys are Lion's
 * tag names without the `lion-` prefix. Lion's own element is the implicit default per key; an
 * extension layer passes its own subclasses here instead.
 */
import { LionSwitch } from '@lion/ui/switch.js';
import { runSwitchSuite } from '../test-suites/lion-switch.suite.js';

describe('lion-switch.classes, run with an explicit classes map', () => {
  runSwitchSuite({ classes: { host: LionSwitch } });
});
