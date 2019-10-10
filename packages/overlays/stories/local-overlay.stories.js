import { storiesOf, html } from '@open-wc/demoing-storybook';
import { fixtureSync } from '@open-wc/testing-helpers';
import { css } from '@lion/core';
import { OverlayController } from '../index.js';

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
    background-color: white;
    border-radius: 2px;
    box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.12), 0 6px 6px 0 rgba(0, 0, 0, 0.24);
    padding: 8px;
  }
`;

storiesOf('Local Overlay System|Local Overlay', module)
  .add('Basic', () => {
    const popup = new OverlayController({
      placementMode: 'local',
      hidesOnEsc: true,
      hidesOnOutsideClick: true,
      contentNode: fixtureSync(html`
        <div class="demo-popup">United Kingdom</div>
      `),
      invokerNode: fixtureSync(html`
        <button @click=${() => popup.toggle()}>UK</button>
      `),
    });

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
    const popup = new OverlayController({
      placementMode: 'local',
      hidesOnEsc: true,
      hidesOnOutsideClick: true,
      popperConfig: {
        placement: 'top-end',
      },
      contentNode: fixtureSync(html`
        <div class="demo-popup">United Kingdom</div>
      `),
      invokerNode: fixtureSync(html`
        <button @click=${() => popup.toggle()}>UK</button>
      `),
    });

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
    const popup = new OverlayController({
      placementMode: 'local',
      hidesOnEsc: true,
      hidesOnOutsideClick: true,
      popperConfig: {
        placement: 'bottom',
      },
      contentNode: fixtureSync(html`
        <div class="demo-popup">
          Supplying placement with a single parameter will assume 'center' for the other.
        </div>
      `),
      invokerNode: fixtureSync(html`
        <button @click=${() => popup.toggle()}>UK</button>
      `),
    });

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
    const popup = new OverlayController({
      placementMode: 'local',
      hidesOnEsc: true,
      hidesOnOutsideClick: true,
      popperConfig: {
        placement: 'bottom',
      },
      contentNode: fixtureSync(html`
        <div class="demo-popup">United Kingdom</div>
      `),
      invokerNode: fixtureSync(html`
        <button @mouseenter=${() => popup.show()} @mouseleave=${() => popup.hide()}>UK</button>
      `),
    });

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
    const popup = new OverlayController({
      placementMode: 'local',
      contentNode: fixtureSync(html`
        <div class="demo-popup">United Kingdom</div>
      `),
      invokerNode: fixtureSync(html`
        <input
          id="input"
          type="text"
          @focusin=${() => popup.show()}
          @focusout=${() => popup.hide()}
        />
      `),
    });

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
  .add('trapsKeyboardFocus', () => {
    const popup = new OverlayController({
      placementMode: 'local',
      hidesOnEsc: true,
      hidesOnOutsideClick: true,
      trapsKeyboardFocus: true,
      contentNode: fixtureSync(html`
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
      `),
      invokerNode: fixtureSync(html`
        <button @click=${() => popup.toggle()}>UK</button>
      `),
    });

    return html`
      <style>
        ${popupDemoStyle}
      </style>
      <div class="demo-box">
        ${popup.invoker}${popup.content}
      </div>
    `;
  });
