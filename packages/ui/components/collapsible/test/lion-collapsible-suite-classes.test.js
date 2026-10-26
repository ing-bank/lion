/**
 * Proves the preferred contract: the caller hands the suite its CLASSES - a map whose keys are Lion's
 * tag names without the `lion-` prefix. Lion's own element is the implicit default per key; an
 * extension layer passes its own subclasses here instead.
 */
import { LionCollapsible } from '@lion/ui/collapsible.js';
import { runCollapsibleSuite } from '../test-suites/LionCollapsible.suite.js';

describe('lion-collapsible-suite-classes, run with an explicit classes map', () => {
  runCollapsibleSuite({ classes: { host: LionCollapsible } });
});
