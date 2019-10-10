import { storiesOf, html, withKnobs, object, text } from '@open-wc/demoing-storybook';
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

  .demo-box_placements {
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
  .addDecorator(withKnobs)
  .add(
    'Button tooltip',
    () => html`
      <style>
        ${tooltipDemoStyle}
      </style>
      <div class="demo-box">
        <lion-tooltip .popperConfig=${{ placement: 'right' }}>
          <lion-button slot="invoker">Tooltip</lion-button>
          <div slot="content" class="tooltip">Hello there!</div>
        </lion-tooltip>
      </div>
    `,
  )
  .add(
    'placements',
    () => html`
      <style>
        ${tooltipDemoStyle}
      </style>
      <div class="demo-box_placements">
        <lion-tooltip .popperConfig=${{ placement: 'top' }}>
          <lion-button slot="invoker">Top</lion-button>
          <div slot="content" class="tooltip">Its top placement</div>
        </lion-tooltip>
        <lion-tooltip .popperConfig=${{ placement: 'right' }}>
          <lion-button slot="invoker">Right</lion-button>
          <div slot="content" class="tooltip">Its right placement</div>
        </lion-tooltip>
        <lion-tooltip .popperConfig=${{ placement: 'bottom' }}>
          <lion-button slot="invoker">Bottom</lion-button>
          <div slot="content" class="tooltip">Its bottom placement</div>
        </lion-tooltip>
        <lion-tooltip .popperConfig=${{ placement: 'left' }}>
          <lion-button slot="invoker">Left</lion-button>
          <div slot="content" class="tooltip">Its left placement</div>
        </lion-tooltip>
      </div>
    `,
  )
  .add(
    'Override popper configuration',
    () => html`
      <style>
        ${tooltipDemoStyle}
      </style>
      <p>Use the Storybook Knobs to dynamically change the popper configuration!</p>
      <div class="demo-box_placements">
        <lion-tooltip
          .popperConfig="${object('Popper Configuration', {
            placement: 'bottom-start',
            positionFixed: true,
            modifiers: {
              keepTogether: {
                enabled: true /* Prevents detachment of content element from reference element */,
              },
              preventOverflow: {
                enabled: false /* disables shifting/sliding behavior on secondary axis */,
                boundariesElement: 'viewport',
                padding: 16 /* when enabled, this is the viewport-margin for shifting/sliding */,
              },
              flip: {
                boundariesElement: 'viewport',
                padding: 4 /* viewport-margin for flipping on primary axis */,
              },
              offset: {
                enabled: true,
                offset: `0, 4px` /* horizontal and vertical margin (distance between popper and referenceElement) */,
              },
            },
          })}"
        >
          <lion-button slot="invoker">${text('Invoker text', 'Hover me!')}</lion-button>
          <div slot="content" class="tooltip">${text('Content text', 'Hello, World!')}</div>
        </lion-tooltip>
      </div>
    `,
  );
