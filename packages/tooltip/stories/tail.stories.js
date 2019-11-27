import { storiesOf } from '@open-wc/demoing-storybook';
import { html } from '@lion/core';

import '@lion/button/lion-button.js';
import '../lion-tooltip.js';

storiesOf('Tooltip', module).add('Tail', () => {
  const bw = 6;
  const bc = 'black';
  const popperConfig = {
    modifiers: {
      keepTogether: {
        enabled: true,
      },
      arrow: {
        enabled: true,
      },
    },
  };
  const placements = [
    'top-start',
    'top',
    'top-end',
    'right-start',
    'right',
    'right-end',
    'bottom-start',
    'bottom',
    'bottom-end',
    'left-start',
    'left',
    'left-end',
  ];
  return html`
    <style>
      .wrapper {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        column-gap: 16px;
        row-gap: 16px;
        width: 900px;
        margin: 100px auto;
      }

      .box {
        border: 1px solid silver;
      }

      .canvas {
        display: flex;
        flex-direction: column;

        align-items: center;
        justify-content: center;

        height: 100px;

        border-bottom: 1px solid silver;
      }

      .config {
        display: block;
        padding: 16px;
      }

      lion-button span {
        padding: 16px 0;
      }

      .tooltip {
        position: absolute;
        background: black;
        color: white;
        padding: 16px;
      }

      .arrow {
        position: absolute;
        width: 0;
        height: 0;

        border-color: red;
        border-style: solid;
      }

      [x-placement^='top'] .arrow {
        border-width: ${bw}px ${bw}px 0 ${bw}px;
        border-color: ${bc} transparent transparent transparent;
        bottom: -${bw}px;
      }

      [x-placement^='right'] .arrow {
        border-width: ${bw}px ${bw}px ${bw}px 0;
        border-color: transparent ${bc} transparent transparent;
        left: -${bw}px;
      }

      [x-placement^='bottom'] .arrow {
        border-width: 0 ${bw}px ${bw}px ${bw}px;
        border-color: transparent transparent ${bc} transparent;
        top: -${bw}px;
      }

      [x-placement^='left'] .arrow {
        border-width: ${bw}px 0 ${bw}px ${bw}px;
        border-color: transparent transparent transparent ${bc};
        right: -${bw}px;
      }
    </style>
    <div class="wrapper">
      ${placements.map(
        placement => html`
          <div class="box">
            <div class="canvas">
              <lion-tooltip .popperConfig="${{ placement, ...popperConfig }}">
                <lion-button slot="invoker">
                  <span>${placement} tooltip long loooooooong</span>
                </lion-button>
                <div slot="content" class="tooltip">
                  Content
                  <div class="arrow" x-arrow></div>
                </div>
              </lion-tooltip>
            </div>
            <pre class="config"><!--
          -->${JSON.stringify({ placement, ...popperConfig }, null, 2)}
          </pre>
          </div>
        `,
      )}
    </div>
  `;
});
