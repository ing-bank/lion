import { css } from 'lit';
import { LionTooltip } from '@lion/ui/tooltip.js';
import { runTooltipSuite } from '../test-suites/lion-tooltip.suite.js';

runTooltipSuite();

class CustomTooltip extends LionTooltip {
  static get styles() {
    return [
      ...super.styles,
      css`
        :host {
          --tooltip-arrow-width: 16px;
        }
      `,
    ];
  }

  constructor() {
    super();
    /** @type {'label'|'description'} */
    this.invokerRelation = 'label';
  }
}

runTooltipSuite({
  classes: { host: CustomTooltip },
  arrowWidth: 16,
  defaultInvokerRelation: 'label',
});
