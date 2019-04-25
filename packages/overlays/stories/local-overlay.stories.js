import { storiesOf, html } from '@open-wc/storybook';
import { css } from '@lion/core';
import { overlays } from '../src/overlays.js';
import { LocalOverlayController } from '../src/LocalOverlayController.js';

const popupDemoStyle = css`
  .demo-box {
    width: 200px;
    height: 40px;
    background-color: white;
    border-radius: 2px;
    border: 1px solid grey;
    margin: 240px auto 240px 240px;
    padding: 8px;
  }

  .demo-popup {
    display: block;
    max-width: 250px;
    position: absolute;
    background-color: white;
    border-radius: 2px;
    border: 1px solid grey;
    box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.12), 0 6px 6px 0 rgba(0, 0, 0, 0.24);
    padding: 8px;
  }
`;

storiesOf('Overlay System|Local/Local Overlay', module)
  .add('Basic', () => {
    const popup = overlays.add(
      new LocalOverlayController({
        hidesOnEsc: true,
        hidesOnOutsideClick: true,
        contentTemplate: () =>
          html`
            <div class="demo-popup">United Kingdom</div>
          `,
        invokerTemplate: () =>
          html`
            <button @click=${() => popup.show()}>UK</button>
          `,
      }),
    );
    return html`
      <style>
        ${popupDemoStyle}
      </style>
      <div class="demo-box">
        In the ${popup.invoker}${popup.content} the weather is nice.
      </div>
    `;
  })
  .add('Change preferred position', () => {
    const popup = overlays.add(
      new LocalOverlayController({
        hidesOnEsc: true,
        hidesOnOutsideClick: true,
        placement: 'top right',
        contentTemplate: () =>
          html`
            <div class="demo-popup">United Kingdom</div>
          `,
        invokerTemplate: () =>
          html`
            <button @click=${() => popup.show()}>UK</button>
          `,
      }),
    );
    return html`
      <style>
        ${popupDemoStyle}
      </style>
      <div class="demo-box">
        In the ${popup.invoker}${popup.content} the weather is nice.
      </div>
    `;
  })
  .add('Single placement parameter', () => {
    const popup = overlays.add(
      new LocalOverlayController({
        hidesOnEsc: true,
        hidesOnOutsideClick: true,
        placement: 'bottom',
        contentTemplate: () => html`
          <div class="demo-popup">
            Supplying placement with a single parameter will assume 'center' for the other.
          </div>
        `,
        invokerTemplate: () =>
          html`
            <button @click=${() => popup.show()}>Click me</button>
          `,
      }),
    );
    return html`
      <style>
        ${popupDemoStyle}
      </style>
      <div class="demo-box">
        ${popup.invoker}${popup.content}
      </div>
    `;
  })
  .add('On hover', () => {
    const popup = overlays.add(
      new LocalOverlayController({
        hidesOnEsc: true,
        hidesOnOutsideClick: true,
        placement: 'bottom',
        contentTemplate: () =>
          html`
            <div class="demo-popup">United Kingdom</div>
          `,
        invokerTemplate: () => html`
          <button @mouseenter=${() => popup.show()} @mouseleave=${() => popup.hide()}>UK</button>
        `,
      }),
    );
    return html`
      <style>
        ${popupDemoStyle}
      </style>
      <div class="demo-box">
        In the beautiful ${popup.invoker}${popup.content} the weather is nice.
      </div>
    `;
  })
  .add('On an input', () => {
    const popup = overlays.add(
      new LocalOverlayController({
        contentTemplate: () =>
          html`
            <div class="demo-popup">United Kingdom</div>
          `,
        invokerTemplate: () =>
          html`
            <input
              id="input"
              type="text"
              @focus=${() => popup.show()}
              @blur=${() => popup.hide()}
            />
          `,
      }),
    );
    return html`
      <style>
        ${popupDemoStyle}
      </style>
      <div class="demo-box">
        <label for="input">Input with a dropdown</label>
        ${popup.invoker}${popup.content}
      </div>
    `;
  })
  .add('On toggle', () => {
    const popup = overlays.add(
      new LocalOverlayController({
        hidesOnEsc: true,
        hidesOnOutsideClick: true,
        contentTemplate: () =>
          html`
            <div class="demo-popup">United Kingdom</div>
          `,
        invokerTemplate: () =>
          html`
            <button @click=${() => popup.toggle()}>UK</button>
          `,
      }),
    );
    return html`
      <style>
        ${popupDemoStyle}
      </style>
      <div class="demo-box">
        <label for="input">Weather in ${popup.invoker}${popup.content} toggles.</label>
      </div>
    `;
  })
  .add('trapsKeyboardFocus', () => {
    const popup = overlays.add(
      new LocalOverlayController({
        hidesOnEsc: true,
        hidesOnOutsideClick: true,
        trapsKeyboardFocus: true,
        contentTemplate: () => html`
          <div class="demo-popup">
            <button id="el1">Button</button>
            <a id="el2" href="#">Anchor</a>
            <div id="el3" tabindex="0">Tabindex</div>
            <input id="el4" placeholder="Input" />
            <div id="el5" contenteditable>Content editable</div>
            <textarea id="el6">Textarea</textarea>
            <select id="el7">
              <option>1</option>
            </select>
          </div>
        `,
        invokerTemplate: () =>
          html`
            <button @click=${() => popup.show()}>UK</button>
          `,
      }),
    );
    return html`
      <style>
        ${popupDemoStyle}
      </style>
      <div class="demo-box">
        ${popup.invoker}${popup.content}
      </div>
    `;
  });
