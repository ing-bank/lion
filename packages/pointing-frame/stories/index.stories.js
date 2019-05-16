import { storiesOf, html, withKnobs } from '@open-wc/demoing-storybook';

// TODO: MR to @open-wc to export optionsKnob
// eslint-disable-next-line import/no-extraneous-dependencies
import { optionsKnob } from '@storybook/addon-knobs';

import { css, unsafeHTML } from '@lion/core';
import customPointerSvg from '../test/custom-pointer.svg.js';

import '../../button/lion-button.js';
import '../lion-pointing-frame.js';

const popupDemoStyle = css`
  .demo-box {
    margin: 150px auto 250px 300px;
  }
`;

// Sets up position toggler knob
const posOptions = {
  'Center of top': 'center-of-top',
  'Right of top': 'right-of-top',
  'Top of right': 'top-of-right',
  'Center of right': 'center-of-right',
  'Bottom of right': 'bottom-of-right',
  'Right of bottom': 'right-of-bottom',
  'Center of bottom': 'center-of-bottom',
  'Left of bottom': 'left-of-bottom',
  'Bottom of left': 'bottom-of-left',
  'Center of left': 'center-of-left',
  'Top of left': 'top-of-left',
  'Left of top': 'left-of-top',
};

storiesOf('Pointing Frame|Pointing Frame', module)
  .addDecorator(withKnobs)
  .add(
    'Default',
    () => html`
      <style>
        ${popupDemoStyle} .my-content {
          border: 1px solid black;
          padding: 5px;
        }
      </style>
      <p>Use the Storybook Knobs tab to switch positions!</p>
      <div class="demo-box">
        <lion-popup
          position=${optionsKnob('Position', posOptions, 'left-of-top', { display: 'radio' })}
        >
          <lion-pointing-frame
            style="outline: 1px solid pink;"
            slot="content"
            class="popup pointing-frame"
          >
            <div class="my-content">
              <div>Hello, Planet!</div>
              <div>How are you doing on this fine day?</div>
              <div>Hopefully you're doing great!</div>
            </div>
          </lion-pointing-frame>
          <button style="width: 100px; height: 50px;" slot="invoker">Click me!</button>
        </lion-popup>
      </div>
    `,
  )
  .add(
    'Small invoker',
    () => html`
      <style>
        ${popupDemoStyle} .my-content {
          border: 1px solid black;
          padding: 5px;
        }
      </style>
      <p>Use the Storybook Knobs tab to switch positions!</p>
      <div class="demo-box">
        <lion-popup
          position=${optionsKnob('Position', posOptions, 'left-of-top', { display: 'radio' })}
        >
          <lion-pointing-frame
            style="outline: 1px solid pink;"
            slot="content"
            class="popup pointing-frame"
          >
            <div class="my-content">
              <div>Hello, Planet!</div>
              <div>How are you doing on this fine day?</div>
              <div>Hopefully you're doing great!</div>
            </div>
          </lion-pointing-frame>
          <button style="width: 30px; height: 20px;" slot="invoker">Cl!</button>
        </lion-popup>
      </div>
    `,
  )
  .add(
    'Custom Pointer',
    () => html`
      <style>
        ${popupDemoStyle} .my-content {
          border: 1px solid black;
          padding: 5px;
        }
      </style>
      <p>Use the Storybook Knobs tab to switch positions!</p>
      <div class="demo-box">
        <lion-popup
          position=${optionsKnob('Position', posOptions, 'left-of-top', { display: 'radio' })}
        >
          <lion-pointing-frame
            style="outline: 1px solid pink; width: 300px;"
            slot="content"
            class="popup pointing-frame"
          >
            <div class="my-content">
              <div>Hello, Planet!</div>
              <div>How are you doing on this fine day?</div>
              <div>Hopefully you're doing great!</div>
            </div>
            <div slot="pointer">
              ${unsafeHTML(customPointerSvg)}
            </div>
          </lion-pointing-frame>
          <button style="width: 100px; height: 100px;" slot="invoker">Click me!</button>
        </lion-popup>
      </div>
    `,
  );
