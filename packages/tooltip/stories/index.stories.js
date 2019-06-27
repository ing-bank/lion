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
    /* To display on top of elements with no z-index that are appear later in the DOM */
    z-index: 1;
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
        <lion-tooltip .placementConfig=${{ placement: 'right' }}>
          <div slot="content" class="tooltip">Hello there!</div>
          <lion-button slot="invoker">Tooltip</lion-button>
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
        <lion-tooltip .placementConfig=${{ placement: 'top' }}>
          <div slot="content" class="tooltip">Its top placement</div>
          <lion-button slot="invoker">Top</lion-button>
        </lion-tooltip>
        <lion-tooltip .placementConfig=${{ placement: 'right' }}>
          <div slot="content" class="tooltip">Its right placement</div>
          <lion-button slot="invoker">Right</lion-button>
        </lion-tooltip>
        <lion-tooltip .placementConfig=${{ placement: 'bottom' }}>
          <div slot="content" class="tooltip">Its bottom placement</div>
          <lion-button slot="invoker">Bottom</lion-button>
        </lion-tooltip>
        <lion-tooltip .placementConfig=${{ placement: 'left' }}>
          <div slot="content" class="tooltip">Its left placement</div>
          <lion-button slot="invoker">Left</lion-button>
        </lion-tooltip>
      </div>
    `,
  )
  .add(
    'Override placement configuration',
    () => html`
      <style>
        ${tooltipDemoStyle}
      </style>
      <p>Use the Storybook Knobs to dynamically change the placement configuration!</p>
      <div class="demo-box_placements">
        <lion-tooltip
          .placementConfig="${object('Placement Configuration', {
            placement: 'bottom-start',
            positionFixed: true,
            modifiers: {
              keepTogether: {
                enabled: true /* Prevents detachment of content element from reference element */,
              },
              preventOverflow: {
                enabled: false /* disables shifting/sliding behavior on secondary axis */,
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
          <div slot="content" class="tooltip">${text('Content text', 'Hello, World!')}</div>
          <lion-button slot="invoker">${text('Invoker text', 'Click me!')}</lion-button>
        </lion-tooltip>
      </div>
    `,
  );
