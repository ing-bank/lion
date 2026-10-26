/**
 * Proves the preferred contract: the caller hands the suite its CLASSES - a map whose keys are Lion's
 * tag names without the `lion-` prefix. Lion's own element is the implicit default per key; an
 * extension layer passes its own subclasses here instead.
 */
import { LionCombobox } from '@lion/ui/combobox.js';
import { runComboboxSuite } from '../test-suites/lion-combobox.suite.js';

describe('lion-combobox.classes, run with an explicit classes map', () => {
  runComboboxSuite({ classes: { host: LionCombobox } });
});
