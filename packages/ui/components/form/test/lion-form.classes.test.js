/**
 * Proves the preferred contract: the caller hands the suite its CLASSES - a map whose keys are Lion's
 * tag names without the `lion-` prefix. Lion's own element is the implicit default per key; an
 * extension layer passes its own subclasses here instead.
 */
import { LionForm } from '@lion/ui/form.js';
import { runFormSuite } from '../test-suites/lion-form.suite.js';

describe('lion-form.classes, run with an explicit classes map', () => {
  runFormSuite({ classes: { host: LionForm } });
});
