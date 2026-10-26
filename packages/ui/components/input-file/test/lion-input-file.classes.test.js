/**
 * Proves the preferred contract: the caller hands the suite its CLASSES - a map whose keys are
 * Lion's tag names without the `lion-` prefix - and the suite runs against them. Kept in its own
 * file so it cannot share state with the `tagString` probe next to it.
 */
import { LionInputFile } from '@lion/ui/input-file.js';
import { runInputFileSuite } from '../test-suites/lion-input-file.suite.js';

class MyInputFile extends LionInputFile {}

describe('lion-input-file, run against a subclasser class (classes mode)', () => {
  runInputFileSuite({ classes: { 'input-file': MyInputFile } });
});
