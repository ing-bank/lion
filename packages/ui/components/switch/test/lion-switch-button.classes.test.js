/**
 * Proves the preferred contract: the caller hands the suite its CLASSES - a map whose keys are
 * Lion's tag names without the `lion-` prefix - and the suite runs against them. Kept in its own
 * file so it cannot share state with the `tagString` probe next to it.
 */
import { LionSwitchButton } from '@lion/ui/switch.js';
import { runSwitchButtonSuite } from '../test-suites/lion-switch-button.suite.js';

class MySwitchButton extends LionSwitchButton {}

describe('lion-switch-button, run against a subclasser class (classes mode)', () => {
  runSwitchButtonSuite({ classes: { host: MySwitchButton } });
});
