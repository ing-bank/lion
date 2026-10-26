/**
 * Proves the preferred contract: the caller hands the suite its CLASSES - a map whose keys are
 * Lion's tag names without the `lion-` prefix - and the suite runs against them. Kept in its own
 * file so it cannot share state with the `tagString` probe next to it.
 */
import { LionForm } from '@lion/ui/form.js';
import { runFormSuite } from '../test-suites/lion-form.suite.js';

class MyForm extends LionForm {}

describe('lion-form, run against a subclasser class (classes mode)', () => {
  runFormSuite({ classes: { host: MyForm } });
});
