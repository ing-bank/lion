/**
 * Proves the preferred contract: the caller hands the suite its CLASSES - a map whose keys are
 * Lion's tag names without the `lion-` prefix - and the suite runs against them. Kept in its own
 * file so it cannot share state with the `tagString` probe next to it.
 */
import { LionAccordion } from '@lion/ui/accordion.js';
import { runAccordionSuite } from '../test-suites/lion-accordion.suite.js';

class MyAccordion extends LionAccordion {}

describe('lion-accordion, run against a subclasser class (classes mode)', () => {
  runAccordionSuite({ classes: { accordion: MyAccordion } });
});
