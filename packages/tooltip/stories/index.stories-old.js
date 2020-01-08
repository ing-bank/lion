import { css } from '@lion/core';
import { html, object, storiesOf, text, withKnobs } from '@open-wc/demoing-storybook';
import '../lion-tooltip-arrow.js';
import '../lion-tooltip.js';

const tooltipDemoStyle = css`
  .demo-box {
    width: 200px;
    background-color: white;
    border-radius: 2px;
    margin: 250px;
    padding: 8px;
  }

  .demo-box_placements {
    display: flex;
    flex-direction: column;
    width: max-content;
    margin: 0 auto;
    margin-top: 68px;
  }

  lion-tooltip {
    width: auto;
    margin: 10px;
  }

  .demo-box__column {
    display: flex;
    flex-direction: column;
  }

  .demo-tooltip-body {
    display: block;
    font-size: 16px;
    color: white;
    background-color: black;
    border-radius: 4px;
    padding: 8px;
  }
`;

storiesOf('Overlays Specific WC|Tooltip')
  .addDecorator(withKnobs)
  .add(
    'Test',
    () => html`
      <style>
        ${tooltipDemoStyle}
      </style>
      <div class="demo-box">
        <lion-tooltip>
          <lion-button slot="invoker">Tooltip button</lion-button>
          <div slot="content" class="demo-tooltip-body">Hey there</div>
          <lion-tooltip-arrow slot="arrow"></lion-tooltip-arrow>
        </lion-tooltip>
      </div>
    `,
  )
  .add(
    'Button tooltip',
    () => html`
      <style>
        ${tooltipDemoStyle}
      </style>
      <div class="demo-box">
        <lion-tooltip .config=${{ popperConfig: { placement: 'right' } }}>
          <button slot="invoker">Tooltip</button>
          <div slot="content" class="demo-tooltip-body">Hello there!</div>
          <lion-tooltip-arrow slot="arrow"></lion-tooltip-arrow>
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
        <lion-tooltip .config=${{ popperConfig: { placement: 'top' } }}>
          <button slot="invoker">Top</button>
          <div slot="content" class="demo-tooltip-body">Its top placement</div>
          <lion-tooltip-arrow slot="arrow"></lion-tooltip-arrow>
        </lion-tooltip>
        <lion-tooltip .config=${{ popperConfig: { placement: 'right' } }}>
          <button slot="invoker">Right</button>
          <div slot="content" class="demo-tooltip-body">Its right placement</div>
          <lion-tooltip-arrow slot="arrow"></lion-tooltip-arrow>
        </lion-tooltip>
        <lion-tooltip .config=${{ popperConfig: { placement: 'bottom' } }}>
          <button slot="invoker">Bottom</button>
          <div slot="content" class="demo-tooltip-body">Its bottom placement</div>
          <lion-tooltip-arrow slot="arrow"></lion-tooltip-arrow>
        </lion-tooltip>
        <lion-tooltip .config=${{ popperConfig: { placement: 'left' } }}>
          <button slot="invoker">Left</button>
          <div slot="content" class="demo-tooltip-body">Its left placement</div>
          <lion-tooltip-arrow slot="arrow"></lion-tooltip-arrow>
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
          .config="${{
            popperConfig: object('Popper Configuration', {
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
            }),
          }}"
        >
          <lion-button slot="invoker">${text('Invoker text', 'Hover me!')}</lion-button>
          <div slot="content" class="demo-tooltip-body">
            ${text('Content text', 'Hello, World!')}
          </div>
          <lion-tooltip-arrow slot="arrow"></lion-tooltip-arrow>
        </lion-tooltip>
      </div>
    `,
  );
