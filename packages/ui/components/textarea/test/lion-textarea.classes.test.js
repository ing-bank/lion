/**
 * Proves the preferred contract: the caller hands the suite its CLASSES - a map whose keys are
 * Lion's tag names without the `lion-` prefix - and the suite runs against them. Kept in its own
 * file so it cannot share state with the `tagString` probe next to it.
 */
import { LionTextarea } from '@lion/ui/textarea.js';
import { runTextareaSuite } from '../test-suites/lion-textarea.suite.js';

class MyTextarea extends LionTextarea {}

describe('lion-textarea, run against a subclasser class (classes mode)', () => {
  runTextareaSuite({ classes: { textarea: MyTextarea } });
});
