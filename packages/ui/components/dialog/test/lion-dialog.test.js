import { expect } from '@open-wc/testing';
import { LionDialog } from '@lion/ui/dialog.js';
import { runDialogSuite } from '../test-suites/lion-dialog.suite.js';

runDialogSuite();

describe('dialog with a header name', () => {
  let headerFixtures = 0;
  class HeaderDialog extends LionDialog {
    connectedCallback() {
      super.connectedCallback();
      if (this.querySelector('[slot="header"]')) {
        headerFixtures += 1;
      }
    }
  }

  runDialogSuite({
    classes: { host: HeaderDialog },
    usesHeaderSlotForAccessibleName: true,
  });

  after(() => {
    expect(headerFixtures).to.equal(2);
  });
});
