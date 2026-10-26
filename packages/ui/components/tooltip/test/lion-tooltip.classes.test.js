/**
 * Proves the preferred contract: the caller hands the suite its CLASSES - a map whose keys are
 * Lion's tag names without the `lion-` prefix - and the suite runs against them. Kept in its own
 * file so it cannot share state with the `tagString` probe next to it.
 */
import { LionTooltip } from '@lion/ui/tooltip.js';
import { runTooltipSuite } from '../test-suites/lion-tooltip.suite.js';

class MyTooltip extends LionTooltip {}

describe('lion-tooltip, run against a subclasser class (classes mode)', () => {
  runTooltipSuite({ classes: { host: MyTooltip } });
});
