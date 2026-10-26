/**
 * Proves the preferred contract: the caller hands the suite its CLASSES - a map whose keys are Lion's
 * tag names without the `lion-` prefix. Lion's own element is the implicit default per key; an
 * extension layer passes its own subclasses here instead.
 */
import { LionAccordion } from '@lion/ui/accordion.js';
import { runAccordionSuite } from '../test-suites/lion-accordion.suite.js';

describe('lion-accordion.classes, run with an explicit classes map', () => {
  runAccordionSuite({ classes: { host: LionAccordion } });
});
