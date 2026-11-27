import { LionInputRange } from '@lion/ui/input-range.js';
import { runInputRangeSuite } from '../test-suites/lion-input-range.suite.js';

runInputRangeSuite();

class LabelsOptInRange extends LionInputRange {
  constructor() {
    super();
    this.noMinMaxLabels = true;
  }
}

runInputRangeSuite({
  classes: { host: LabelsOptInRange },
  configureMinMaxLabels(host) {
    Object.assign(host, { noMinMaxLabels: false });
  },
});
