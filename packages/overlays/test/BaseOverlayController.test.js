import { runBaseOverlaySuite } from '../test-suites/BaseOverlayController.suite.js';
import { BaseOverlayController } from '../src/BaseOverlayController.js';

describe('BaseOverlayController', () => {
  runBaseOverlaySuite((...args) => new BaseOverlayController(...args));
});
