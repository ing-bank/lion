import { css } from 'lit';
import { LionCollapsible } from '@lion/ui/collapsible.js';
import { runCollapsibleSuite } from '@lion/ui/collapsible-test-suites.js';

class WideCollapsible extends LionCollapsible {
  static get styles() {
    return [
      ...super.styles,
      css`
        :host {
          display: block;
          width: 2000px;
        }
      `,
    ];
  }
}

customElements.define('wide-collapsible', WideCollapsible);

describe('collapsible suite with wide host layout', () => {
  runCollapsibleSuite({ classes: { host: WideCollapsible } });
});
