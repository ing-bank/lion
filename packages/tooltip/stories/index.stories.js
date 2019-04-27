import { storiesOf, html } from '@open-wc/demoing-storybook';
import { css } from '@lion/core';

import '@lion/icon/lion-icon.js';
import '@lion/button/lion-button.js';
import '../lion-tooltip.js';

const tooltipDemoStyle = css`
  .demo-box {
    width: 200px;
    background-color: white;
    border-radius: 2px;
    border: 1px solid grey;
    margin: 250px;
    padding: 8px;
  }

  .demo-box_positions {
    display: flex;
    flex-direction: column;
    width: 173px;
    margin: 0 auto;
    margin-top: 68px;
  }

  lion-tooltip {
    padding: 10px;
  }

  .demo-box__column {
    display: flex;
    flex-direction: column;
  }

  .tooltip {
    display: block;
    position: absolute;
    font-size: 16px;
    color: white;
    background-color: black;
    border-radius: 4px;
    padding: 8px;
  }

  @media (max-width: 480px) {
    .tooltip {
      display: none;
    }
  }
`;

storiesOf('Local Overlay System|Tooltip', module)
  .add(
    'Button tooltip',
    () => html`
      <style>
        ${tooltipDemoStyle}
      </style>
      <div class="demo-box">
        <lion-tooltip position="right">
          <div slot="content" class="tooltip">hey there</div>
          <lion-button slot="invoker">Tooltip</lion-button>
        </lion-tooltip>
      </div>
    `,
  )
  .add(
    'positions',
    () => html`
      <style>
        ${tooltipDemoStyle}
      </style>
      <div class="demo-box_positions">
        <lion-tooltip position="top">
          <div slot="content" class="tooltip">Its top position</div>
          <lion-button slot="invoker">Top</lion-button>
        </lion-tooltip>
        <lion-tooltip position="right">
          <div slot="content" class="tooltip">Its right position</div>
          <lion-button slot="invoker">Right</lion-button>
        </lion-tooltip>
        <lion-tooltip position="bottom">
          <div slot="content" class="tooltip">Its bottom position</div>
          <lion-button slot="invoker">Bottom</lion-button>
        </lion-tooltip>
        <lion-tooltip position="left">
          <div slot="content" class="tooltip">Its left position</div>
          <lion-button slot="invoker">Left</lion-button>
        </lion-tooltip>
      </div>
    `,
  );
