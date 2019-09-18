import { storiesOf, html } from '@open-wc/demoing-storybook';
import { css } from '@lion/core';
import { overlays, LocalOverlayController } from '../index.js';

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
    box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.12), 0 6px 6px 0 rgba(0, 0, 0, 0.24);
    padding: 8px;
  }
`;

storiesOf('Local Overlay System|Local Overlay', module)
  .add('Basic', () => {
    let popup;
    const invokerNode = document.createElement('button');
    invokerNode.innerHTML = 'UK';
    invokerNode.addEventListener('click', () => popup.toggle());

    popup = overlays.add(
      new LocalOverlayController({
        hidesOnEsc: true,
        hidesOnOutsideClick: true,
        contentTemplate: () => html`
          <div class="demo-popup">United Kingdom</div>
        `,
        invokerNode,
      }),
    );
    return html`
      <style>
        ${popupDemoStyle}
      </style>
      <div class="demo-box">
        In the ${invokerNode}${popup.content} the weather is nice.
      </div>
    `;
  })
  .add('Change preferred position', () => {
    let popup;
    const invokerNode = document.createElement('button');
    invokerNode.innerHTML = 'UK';
    invokerNode.addEventListener('click', () => popup.toggle());

    popup = overlays.add(
      new LocalOverlayController({
        hidesOnEsc: true,
        hidesOnOutsideClick: true,
        popperConfig: {
          placement: 'top-end',
        },
        contentTemplate: () => html`
          <div class="demo-popup">United Kingdom</div>
        `,
        invokerNode,
      }),
    );
    return html`
      <style>
        ${popupDemoStyle}
      </style>
      <div class="demo-box">
        In the ${invokerNode}${popup.content} the weather is nice.
      </div>
    `;
  })
  .add('Single placement parameter', () => {
    let popup;
    const invokerNode = document.createElement('button');
    invokerNode.innerHTML = 'Click me';
    invokerNode.addEventListener('click', () => popup.toggle());

    popup = overlays.add(
      new LocalOverlayController({
        hidesOnEsc: true,
        hidesOnOutsideClick: true,
        popperConfig: {
          placement: 'bottom',
        },
        contentTemplate: () => html`
          <div class="demo-popup">
            Supplying placement with a single parameter will assume 'center' for the other.
          </div>
        `,
        invokerNode,
      }),
    );
    return html`
      <style>
        ${popupDemoStyle}
      </style>
      <div class="demo-box">
        ${invokerNode}${popup.content}
      </div>
    `;
  })
  .add('On hover', () => {
    let popup;
    const invokerNode = document.createElement('button');
    invokerNode.innerHTML = 'UK';
    invokerNode.addEventListener('mouseenter', () => popup.show());
    invokerNode.addEventListener('mouseleave', () => popup.hide());

    popup = overlays.add(
      new LocalOverlayController({
        hidesOnEsc: true,
        hidesOnOutsideClick: true,
        popperConfig: {
          placement: 'bottom',
        },
        contentTemplate: () =>
          html`
            <div class="demo-popup">United Kingdom</div>
          `,
        invokerNode,
      }),
    );
    return html`
      <style>
        ${popupDemoStyle}
      </style>
      <div class="demo-box">
        In the beautiful ${invokerNode}${popup.content} the weather is nice.
      </div>
    `;
  })
  .add('On an input', () => {
    let popup;
    const invokerNode = document.createElement('input');
    invokerNode.id = 'input';
    invokerNode.type = 'text';
    invokerNode.addEventListener('focusin', () => popup.show());
    invokerNode.addEventListener('focusout', () => popup.hide());

    popup = overlays.add(
      new LocalOverlayController({
        contentTemplate: () => html`
          <div class="demo-popup">United Kingdom</div>
        `,
        invokerNode,
      }),
    );
    return html`
      <style>
        ${popupDemoStyle}
      </style>
      <div class="demo-box">
        <label for="input">Input with a dropdown</label>
        ${invokerNode}${popup.content}
      </div>
    `;
  })
  .add('trapsKeyboardFocus', () => {
    let popup;
    const invokerNode = document.createElement('button');
    invokerNode.innerHTML = 'Click me';
    invokerNode.addEventListener('click', () => popup.toggle());

    popup = overlays.add(
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
        invokerNode,
      }),
    );
    return html`
      <style>
        ${popupDemoStyle}
      </style>
      <div class="demo-box">
        ${invokerNode}${popup.content}
      </div>
    `;
  })
  .add('trapsKeyboardFocus with nodes', () => {
    const invokerNode = document.createElement('button');
    invokerNode.innerHTML = 'Invoker Button';

    const contentNode = document.createElement('div');
    contentNode.classList.add('demo-popup');
    const contentButton = document.createElement('button');
    contentButton.innerHTML = 'Content Button';
    const contentInput = document.createElement('input');
    contentNode.appendChild(contentButton);
    contentNode.appendChild(contentInput);

    const popup = overlays.add(
      new LocalOverlayController({
        hidesOnEsc: true,
        hidesOnOutsideClick: true,
        trapsKeyboardFocus: true,
        contentNode,
        invokerNode,
      }),
    );

    invokerNode.addEventListener('click', () => {
      popup.toggle();
    });
    return html`
      <style>
        ${popupDemoStyle}
      </style>
      <div class="demo-box">
        ${invokerNode}${popup.content}
      </div>
    `;
  });
