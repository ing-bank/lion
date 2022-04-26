// By not calling the provider, the default ("after 2.50.0") _core2 eports (aka lit2 hybrid) will be active
import * as core2Exports from '../index.js';
import { runForwardCompatibilitySuite } from '../test-suites/forward-compatibility.suite.js';

describe('Forward compatibility after 2.50.0', () => {
  runForwardCompatibilitySuite(core2Exports, { isBefore: false });
});
