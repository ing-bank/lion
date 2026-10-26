/**
 * Proves the preferred contract: the caller hands the suite its CLASSES - a map whose keys are Lion's
 * tag names without the `lion-` prefix. Lion's own element is the implicit default per key; an
 * extension layer passes its own subclasses here instead.
 */
import { LionTooltip } from '@lion/ui/tooltip.js';
import { runTooltipSuite } from '../test-suites/lion-tooltip.suite.js';

describe('lion-tooltip.classes, run with an explicit classes map', () => {
  runTooltipSuite({ classes: { host: LionTooltip } });
});
