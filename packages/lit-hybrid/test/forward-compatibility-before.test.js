// By calling the provider, the lit1 ("before 2.50.0") _core2 eports will be active
import '../provider/provide-hybrid-lit2-forward-compatible.js.js.js';
import * as core2Exports from '../index.js.js.js';
import { runForwardCompatibilitySuite } from '../test-suites/forward-compatibility.suite.js';

describe('Forward compatibility before 2.50.0', () => {
  runForwardCompatibilitySuite(core2Exports, { isBefore: true });
});
