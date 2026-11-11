import { LionInput } from '@lion/ui/input.js';
import { runFormatMixinSuite } from '../test-suites/FormatMixin.suite.js';

runFormatMixinSuite({
  classes: { host: LionInput },
  modelValueType: String,
});
