import { storiesOf, html } from '@open-wc/demoing-storybook';

import { css } from '@lion/core';
import { overlays, BottomsheetController } from '../index.js';

const bottomsheetDemoStyle = css`
  .demo-overlay {
    width: 100%;
    background-color: white;
    border: 1px solid lightgrey;
    text-align: center;
  }
`;

storiesOf('Global Overlay System|Bottomsheet', module).add('Default', () => {
  const bottomsheetCtrl = overlays.add(
    new BottomsheetController({
      contentTemplate: () => html`
        <div class="demo-overlay">
          <p>Bottomsheet</p>
          <button @click="${() => bottomsheetCtrl.hide()}">Close</button>
        </div>
      `,
    }),
  );

  return html`
    <style>
      ${bottomsheetDemoStyle}
    </style>
    <a href="#">Anchor 1</a>
    <button
      @click="${event => bottomsheetCtrl.show(event.target)}"
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
});
