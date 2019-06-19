import { expect, fixture, html, aTimeout, defineCE, unsafeStatic } from '@open-wc/testing';

import { keyUpOn } from '@polymer/iron-test-helpers/mock-interactions.js';
import { LionLitElement } from '@lion/core/src/LionLitElement.js';
import { keyCodes } from '../src/utils/key-codes.js';
import { simulateTab } from '../src/utils/simulate-tab.js';

import { LocalOverlayController } from '../src/LocalOverlayController.js';

import { overlays } from '../src/overlays.js';

describe('LocalOverlayController', () => {
  describe('templates', () => {
    it('creates a controller with methods: show, hide, sync and syncInvoker', () => {
      const controller = new LocalOverlayController({
        contentTemplate: () =>
          html`
            <p>Content</p>
          `,
        invokerTemplate: () =>
          html`
            <button>Invoker</button>
          `,
      });
      expect(controller.show).to.be.a('function');
      expect(controller.hide).to.be.a('function');
      expect(controller.sync).to.be.a('function');
      expect(controller.syncInvoker).to.be.a('function');
    });

    it('will render holders for invoker and content', async () => {
      const controller = new LocalOverlayController({
        contentTemplate: () =>
          html`
            <p>Content</p>
          `,
        invokerTemplate: () =>
          html`
            <button>Invoker</button>
          `,
      });
      const el = await fixture(html`
        <div>
          ${controller.invoker} ${controller.content}
        </div>
      `);
      expect(el.querySelectorAll('div')[0].textContent.trim()).to.equal('Invoker');
      controller.show();
      expect(el.querySelectorAll('div')[1].textContent.trim()).to.equal('Content');
    });

    it('will add/remove the content on show/hide', async () => {
      const controller = new LocalOverlayController({
        contentTemplate: () =>
          html`
            <p>Content</p>
          `,
        invokerTemplate: () =>
          html`
            <button>Invoker</button>
          `,
      });
      const el = await fixture(html`
        <div>
          ${controller.invoker} ${controller.content}
        </div>
      `);

      expect(el.querySelectorAll('div')[1].textContent.trim()).to.equal('');

      controller.show();
      expect(el.querySelectorAll('div')[1].textContent.trim()).to.equal('Content');

      controller.hide();
      expect(el.querySelectorAll('div')[1].textContent.trim()).to.equal('');
    });

    it('will hide and show html nodes provided to overlay', async () => {
      const tagString = defineCE(
        class extends LionLitElement {
          render() {
            return html`
              <slot></slot>
            `;
          }
        },
      );

      const element = unsafeStatic(tagString);
      const elem = await fixture(html`
        <${element}>
          <div slot="content">content</div>
          <div slot="invoker"><button>invoker</button></div>
          <${element}> </${element}
        ></${element}>
      `);

      const controller = overlays.add(
        new LocalOverlayController({
          hidesOnEsc: true,
          hidesOnOutsideClick: true,
          contentNode: elem.querySelector('[slot="content"]'),
          invokerNode: elem.querySelector('[slot="invoker"]'),
        }),
      );

      expect(elem.querySelector('[slot="content"]').style.display).to.equal('none');
      controller.show();
      expect(elem.querySelector('[slot="content"]').style.display).to.equal('inline-block');
      controller.hide();
      expect(elem.querySelector('[slot="content"]').style.display).to.equal('none');
    });

    it('exposes isShown state for reading', async () => {
      const controller = new LocalOverlayController({
        contentTemplate: () =>
          html`
            <p>Content</p>
          `,
        invokerTemplate: () =>
          html`
            <button>Invoker</button>
          `,
      });
      await fixture(html`
        <div>
          ${controller.invoker} ${controller.content}
        </div>
      `);
      expect(controller.isShown).to.equal(false);
      controller.show();
      expect(controller.isShown).to.equal(true);
      controller.hide();
      expect(controller.isShown).to.equal(false);
    });

    it('can update the invoker data', async () => {
      const controller = new LocalOverlayController({
        contentTemplate: () =>
          html`
            <p>Content</p>
          `,
        invokerTemplate: (data = { text: 'foo' }) =>
          html`
            <button>${data.text}</button>
          `,
      });

      expect(controller.invoker.textContent.trim()).to.equal('foo');
      controller.syncInvoker({ data: { text: 'bar' } });
      expect(controller.invoker.textContent.trim()).to.equal('bar');
    });

    it('can synchronize the content data', async () => {
      const controller = new LocalOverlayController({
        contentTemplate: data =>
          html`
            <p>${data.text}</p>
          `,
        invokerTemplate: () =>
          html`
            <button>Invoker</button>
          `,
      });

      controller.show();
      controller.sync({ data: { text: 'foo' } });
      expect(controller.content.textContent.trim()).to.equal('foo');

      controller.sync({ data: { text: 'bar' } });
      expect(controller.content.textContent.trim()).to.equal('bar');
    });

    it.skip('can reuse an existing node for the invoker (disables syncInvoker())', async () => {
      const controller = new LocalOverlayController({
        contentTemplate: () =>
          html`
            <p>Content</p>
          `,
        invokerReference: null, // TODO: invokerReference
      });
      await fixture(`
        <div>
          <button @click=${() => controller.show()}>Invoker</button>
          ${controller.content}
        </div>
      `);
      expect(controller.invoker.textContent.trim()).to.equal('Invoker');
      controller.show();
      expect(controller.content.textContent.trim()).to.equal('Content');
    });
  });

  // Please use absolute positions in the tests below to prevent the HTML generated by
  // the test runner from interfering.
  describe('positioning', () => {
    it('positions correctly', async () => {
      // smoke test for integration of positioning system
      const controller = new LocalOverlayController({
        contentTemplate: () =>
          html`
            <p>Content</p>
          `,
        invokerTemplate: () =>
          html`
            <button>Invoker</button>
          `,
      });

      controller.show();
      expect(controller.contentNode.style.top).to.equal('8px');
    });

    it('uses top as the default placement', async () => {
      const controller = new LocalOverlayController({
        contentTemplate: () =>
          html`
            <p>Content</p>
          `,
        invokerTemplate: () => html`
          <button style="padding: 16px;" @click=${() => controller.show()}>
            Invoker
          </button>
        `,
      });
      await fixture(html`
        <div style="position: absolute; left: 100px; top: 50px;">
          ${controller.invoker} ${controller.content}
        </div>
      `);
      controller.show();
      const { contentNode } = controller;
      expect(contentNode.getAttribute('js-positioning-vertical')).to.equal('top');
      expect(contentNode.getAttribute('js-positioning-horizontal')).to.equal('centerHorizontal');
    });

    it('positions to preferred place if placement is set and space is available', async () => {
      const controller = new LocalOverlayController({
        invokerTemplate: () => html`
          <button style="padding: 16px;" @click=${() => controller.show()}>
            Invoker
          </button>
        `,
        contentTemplate: () =>
          html`
            <p>Content</p>
          `,
        placement: 'top right',
      });
      await fixture(html`
        <div style="position: absolute; left: 100px; top: 50px;">
          ${controller.invoker} ${controller.content}
        </div>
      `);

      controller.show();
      const { contentNode } = controller;
      expect(contentNode.getAttribute('js-positioning-vertical')).to.equal('top');
      expect(contentNode.getAttribute('js-positioning-horizontal')).to.equal('right');
    });

    it('positions to different place if placement is set and no space is available', async () => {
      const controller = new LocalOverlayController({
        contentTemplate: () =>
          html`
            <p>Content</p>
          `,
        invokerTemplate: () => html`
          <button style="padding: 16px;" @click=${() => controller.show()}>
            Invoker
          </button>
        `,
        placement: 'top right',
      });
      await fixture(`
        <div style="position: absolute; top: 0;">
          ${controller.invoker} ${controller.content}
        </div>
      `);

      controller.show();
      const { contentNode } = controller;
      expect(contentNode.getAttribute('js-positioning-vertical')).to.equal('bottom');
      expect(contentNode.getAttribute('js-positioning-horizontal')).to.equal('right');
    });
  });

  describe('a11y', () => {
    it('adds and removes aria-expanded on invoker', async () => {
      const controller = new LocalOverlayController({
        contentTemplate: () =>
          html`
            <p>Content</p>
          `,
        invokerTemplate: () =>
          html`
            <button>Invoker</button>
          `,
      });

      expect(controller.invokerNode.getAttribute('aria-controls')).to.contain(
        controller.content.id,
      );
      expect(controller.invokerNode.getAttribute('aria-expanded')).to.equal('false');
      controller.show();
      expect(controller.invokerNode.getAttribute('aria-expanded')).to.equal('true');
      controller.hide();
      expect(controller.invokerNode.getAttribute('aria-expanded')).to.equal('false');
    });

    it('traps the focus via option { trapsKeyboardFocus: true }', async () => {
      const controller = new LocalOverlayController({
        contentTemplate: () => html`
          <div>
            <button id="el1">Button</button>
            <a id="el2" href="#">Anchor</a>
          </div>
        `,
        invokerTemplate: () =>
          html`
            <button>Invoker</button>
          `,
        trapsKeyboardFocus: true,
      });
      // make sure we're connected to the dom
      await fixture(html`
        ${controller.invoker}${controller.content}
      `);
      controller.show();

      const elOutside = await fixture(`<button>click me</button>`);
      const [el1, el2] = [].slice.call(controller.contentNode.querySelectorAll('[id]'));
      el2.focus();
      // this mimics a tab within the contain-focus system used
      const event = new CustomEvent('keydown', { detail: 0, bubbles: true });
      event.keyCode = keyCodes.tab;
      window.dispatchEvent(event);

      expect(elOutside).to.not.equal(document.activeElement);
      expect(el1).to.equal(document.activeElement);
    });

    it('traps the focus via option { trapsKeyboardFocus: true } when using contentNode', async () => {
      const invokerNode = await fixture('<button>Invoker</button>');
      const contentNode = await fixture(`
        <div>
          <button id="el1">Button</button>
          <a id="el2" href="#">Anchor</a>
        </div>
      `);

      const controller = new LocalOverlayController({
        contentNode,
        invokerNode,
        trapsKeyboardFocus: true,
      });
      // make sure we're connected to the dom
      await fixture(html`
        ${controller.invoker}${controller.content}
      `);
      controller.show();

      const elOutside = await fixture(`<button>click me</button>`);
      const [el1, el2] = [].slice.call(controller.contentNode.querySelectorAll('[id]'));

      el2.focus();
      // this mimics a tab within the contain-focus system used
      const event = new CustomEvent('keydown', { detail: 0, bubbles: true });
      event.keyCode = keyCodes.tab;
      window.dispatchEvent(event);

      expect(elOutside).to.not.equal(document.activeElement);
      expect(el1).to.equal(document.activeElement);
    });

    it('allows to move the focus outside of the overlay if trapsKeyboardFocus is disabled', async () => {
      const controller = new LocalOverlayController({
        contentTemplate: () => html`
          <div>
            <button id="el1">Button</button>
          </div>
        `,
        invokerTemplate: () =>
          html`
            <button>Invoker</button>
          `,
        trapsKeyboardFocus: false,
      });
      // make sure we're connected to the dom
      await fixture(
        html`
          ${controller.invoker}${controller.content}
        `,
      );
      const elOutside = await fixture(`<button>click me</button>`);
      controller.show();
      const el1 = controller.content.querySelector('button');

      el1.focus();
      simulateTab();
      expect(elOutside).to.equal(document.activeElement);
    });
  });

  describe('hidesOnEsc', () => {
    it('hides when [escape] is pressed', async () => {
      const ctrl = new LocalOverlayController({
        hidesOnEsc: true,
        contentTemplate: () =>
          html`
            <p>Content</p>
          `,
        invokerTemplate: () =>
          html`
            <button>Invoker</button>
          `,
      });
      await fixture(
        html`
          ${ctrl.invoker}${ctrl.content}
        `,
      );
      ctrl.show();

      keyUpOn(ctrl.contentNode, keyCodes.escape);
      ctrl.updateComplete;
      expect(ctrl.isShown).to.equal(false);
    });

    it('stays shown when [escape] is pressed on outside element', async () => {
      const ctrl = new LocalOverlayController({
        hidesOnEsc: true,
        contentTemplate: () =>
          html`
            <p>Content</p>
          `,
        invokerTemplate: () =>
          html`
            <button>Invoker</button>
          `,
      });
      await fixture(
        html`
          ${ctrl.invoker}${ctrl.content}
        `,
      );
      ctrl.show();

      keyUpOn(document, keyCodes.escape);
      ctrl.updateComplete;
      expect(ctrl.isShown).to.equal(true);
    });
  });

  describe('hidesOnOutsideClick', () => {
    it('hides on outside click', async () => {
      const controller = new LocalOverlayController({
        hidesOnOutsideClick: true,
        contentTemplate: () =>
          html`
            <p>Content</p>
          `,
        invokerTemplate: () =>
          html`
            <button>Invoker</button>
          `,
      });
      await fixture(
        html`
          ${controller.invoker}${controller.content}
        `,
      );
      const { content } = controller;
      controller.show();
      expect(content.textContent.trim()).to.equal('Content');

      document.body.click();
      await aTimeout();
      expect(content.textContent.trim()).to.equal('');
    });

    it('doesn\'t hide on "inside" click', async () => {
      const ctrl = new LocalOverlayController({
        hidesOnOutsideClick: true,
        contentTemplate: () =>
          html`
            <p>Content</p>
          `,
        invokerTemplate: () =>
          html`
            <button @click="${() => ctrl.show()}">Invoker</button>
          `,
      });
      const { content, invoker } = ctrl;
      await fixture(html`
        ${invoker}${content}
      `);

      // Don't hide on first invoker click
      ctrl.invokerNode.click();
      await aTimeout();
      expect(ctrl.isShown).to.equal(true);

      // Don't hide on inside (content) click
      ctrl.contentNode.click();
      await aTimeout();
      expect(ctrl.isShown).to.equal(true);

      // Don't hide on invoker click when shown
      ctrl.invokerNode.click();
      await aTimeout();
      expect(ctrl.isShown).to.equal(true);

      // Works as well when clicked content element lives in shadow dom
      ctrl.show();
      await aTimeout();
      const tag = defineCE(
        class extends HTMLElement {
          constructor() {
            super();
            this.attachShadow({ mode: 'open' });
          }

          connectedCallback() {
            this.shadowRoot.innerHTML = '<div><button>click me</button></div>';
          }
        },
      );
      const shadowEl = document.createElement(tag);
      content.appendChild(shadowEl);
      shadowEl.shadowRoot.querySelector('button').click();
      await aTimeout();
      expect(ctrl.isShown).to.equal(true);

      // Important to check if it can be still shown after, because we do some hacks inside
      ctrl.hide();
      expect(ctrl.isShown).to.equal(true);
      ctrl.show();
      expect(ctrl.isShown).to.equal(true);
    });

    it('works with 3rd party code using "event.stopPropagation()" on bubble phase', async () => {
      const ctrl = new LocalOverlayController({
        hidesOnOutsideClick: true,
        contentTemplate: () =>
          html`
            <p>Content</p>
          `,
        invokerTemplate: () =>
          html`
            <button @click="${() => ctrl.show()}">Invoker</button>
          `,
      });
      const { content, invoker } = ctrl;
      const dom = await fixture(`
        <div>
          <div id="popup">${invoker}${content}</div>
          <div
            id="regular-sibling"
            @click="${() => {
              /* propagates */
            }}"
          ></div>
          <third-party-noise @click="${e => e.stopPropagation()}">
            This element prevents our handlers from reaching the document click handler.
          </third-party-noise>
        </div>
      `);

      ctrl.show();
      expect(ctrl.isShown).to.equal(true);

      dom.querySelector('third-party-noise').click();
      await aTimeout();
      expect(ctrl.isShown).to.equal(false);

      // Important to check if it can be still shown after, because we do some hacks inside
      ctrl.show();
      expect(ctrl.isShown).to.equal(true);
    });

    it('works with 3rd party code using "event.stopPropagation()" on capture phase', async () => {
      const ctrl = new LocalOverlayController({
        hidesOnOutsideClick: true,
        contentTemplate: () =>
          html`
            <p>Content</p>
          `,
        invokerTemplate: () =>
          html`
            <button @click="${() => ctrl.show()}">Invoker</button>
          `,
      });
      const { content, invoker } = ctrl;
      const dom = await fixture(`
        <div>
          <div id="popup">${invoker}${content}</div>
          <div
            id="regular-sibling"
            @click="${() => {
              /* propagates */
            }}"
          ></div>
          <third-party-noise>
            This element prevents our handlers from reaching the document click handler.
          </third-party-noise>
        </div>
      `);

      dom.querySelector('third-party-noise').addEventListener(
        'click',
        event => {
          event.stopPropagation();
        },
        true,
      );

      ctrl.show();
      expect(ctrl.isShown).to.equal(true);

      dom.querySelector('third-party-noise').click();
      await aTimeout();
      expect(ctrl.isShown).to.equal(false);

      // Important to check if it can be still shown after, because we do some hacks inside
      ctrl.show();
      expect(ctrl.isShown).to.equal(true);
    });
  });

  describe('toggles', () => {
    it('toggles on clicks', async () => {
      const ctrl = new LocalOverlayController({
        hidesOnOutsideClick: true,
        contentTemplate: () =>
          html`
            <p>Content</p>
          `,
        invokerTemplate: () =>
          html`
            <button @click="${() => ctrl.toggle()}">Invoker</button>
          `,
      });
      const { content, invoker, invokerNode } = ctrl;
      await fixture(
        html`
          ${invoker}${content}
        `,
      );

      // Show content on first invoker click
      invokerNode.click();
      await aTimeout();
      expect(ctrl.isShown).to.equal(true);

      // Hide content on click when shown
      invokerNode.click();
      await aTimeout();
      expect(ctrl.isShown).to.equal(false);

      // Show contnet on invoker click when hidden
      invokerNode.click();
      await aTimeout();
      expect(ctrl.isShown).to.equal(true);
    });
  });
});
