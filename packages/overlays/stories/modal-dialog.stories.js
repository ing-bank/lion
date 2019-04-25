/* eslint-disable no-underscore-dangle, class-methods-use-this */
import { storiesOf, html } from '@open-wc/storybook';

import { css } from '@lion/core';
import { overlays } from '../src/overlays.js';
import { ModalDialogController } from '../src/ModalDialogController.js';

const modalDialogDemoStyle = css`
  .demo-overlay {
    background-color: white;
    position: fixed;
    top: 20px;
    left: 20px;
    width: 200px;
    border: 1px solid blue;
  }

  .demo-overlay--2 {
    left: 240px;
  }
`;

storiesOf('Overlay System|Global/Modal Dialog', module)
  .add('Default', () => {
    const dialogCtrl = overlays.add(
      new ModalDialogController({
        contentTemplate: () => html`
          <div class="demo-overlay">
            <p>Modal dialog</p>
            <button @click="${() => dialogCtrl.hide()}">Close</button>
          </div>
        `,
      }),
    );

    return html`
      <style>
        ${modalDialogDemoStyle}
      </style>
      <a href="#">Anchor 1</a>
      <button
        @click="${event => dialogCtrl.show(event.target)}"
        aria-haspopup="dialog"
        aria-expanded="false"
      >
        Open dialog
      </button>
      <a href="#">Anchor 2</a>
      ${Array(50).fill(
        html`
          <p>Lorem ipsum</p>
        `,
      )}
    `;
  })
  .add('Option "isBlocking"', () => {
    const blockingDialogCtrl = overlays.add(
      new ModalDialogController({
        isBlocking: true,
        contentTemplate: () => html`
          <div class="demo-overlay demo-overlay--2">
            <p>Hides other dialogs</p>
            <button @click="${() => blockingDialogCtrl.hide()}">Close</button>
          </div>
        `,
      }),
    );

    const normalDialogCtrl = overlays.add(
      new ModalDialogController({
        contentTemplate: () => html`
          <div class="demo-overlay">
            <p>Normal dialog</p>
            <button
              @click="${event => blockingDialogCtrl.show(event.target)}"
              aria-haspopup="dialog"
              aria-expanded="false"
            >
              Open blocking dialog
            </button>
            <button @click="${() => normalDialogCtrl.hide()}">Close</button>
          </div>
        `,
      }),
    );

    return html`
      <style>
        ${modalDialogDemoStyle}
      </style>
      <button
        @click="${event => normalDialogCtrl.show(event.target)}"
        aria-haspopup="dialog"
        aria-expanded="false"
      >
        Open dialog
      </button>
    `;
  });
