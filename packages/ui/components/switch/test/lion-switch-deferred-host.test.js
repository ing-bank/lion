import { LionSwitch } from '@lion/ui/switch.js';
import { runSwitchSuite } from '@lion/ui/switch-test-suites.js';

class DeferredSwitch extends LionSwitch {
  async scheduleUpdate() {
    await new Promise(resolve => {
      setTimeout(resolve, 0);
    });
    await super.scheduleUpdate();
  }
}

customElements.define('deferred-switch', DeferredSwitch);

describe('switch suite with deferred host rendering', () => {
  runSwitchSuite({ classes: { host: DeferredSwitch } });
});
