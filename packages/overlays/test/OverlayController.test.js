/* eslint-disable no-new */
import '@lion/core/test-helpers/keyboardEventShimIE.js';
import {
  aTimeout,
  defineCE,
  expect,
  fixture,
  html,
  nextFrame,
  unsafeStatic,
} from '@open-wc/testing';
import { fixtureSync } from '@open-wc/testing-helpers';
import sinon from 'sinon';
import { OverlayController } from '../src/OverlayController.js';
import { overlays } from '../src/overlays.js';
import { keyCodes } from '../src/utils/key-codes.js';
import { simulateTab } from '../src/utils/simulate-tab.js';

/**
 * @typedef {import('../types/OverlayConfig').OverlayConfig} OverlayConfig
 * @typedef {import('../types/OverlayConfig').ViewportPlacement} ViewportPlacement
 */

const withGlobalTestConfig = () =>
  /** @type {OverlayConfig} */ ({
    placementMode: 'global',
    contentNode: /** @type {HTMLElement} */ (fixtureSync(html`<div>my content</div>`)),
  });

const withLocalTestConfig = () =>
  /** @type {OverlayConfig} */ ({
    placementMode: 'local',
    contentNode: /** @type {HTMLElement} */ (fixtureSync(html`<div>my content</div>`)),
    invokerNode: /** @type {HTMLElement} */ (fixtureSync(html`
      <div role="button" style="width: 100px; height: 20px;">Invoker</div>
    `)),
  });

afterEach(() => {
  overlays.teardown();
});

describe('OverlayController', () => {
  describe('Init', () => {
    it('adds OverlayController instance to OverlayManager', async () => {
      const ctrl = new OverlayController({
        ...withGlobalTestConfig(),
      });
      expect(ctrl.manager).to.equal(overlays);
      expect(overlays.list).to.include(ctrl);
    });

    it('prepares a content node wrapper', async () => {
      const ctrl = new OverlayController({
        ...withGlobalTestConfig(),
      });
      expect(ctrl.content).not.to.be.undefined;
      expect(ctrl.contentNode.parentElement).to.equal(ctrl.content);
    });

    describe('Z-index on local overlays', () => {
      /** @type {HTMLElement} */
      let contentNode;
      /**
       * @param {string} zIndexVal
       * @param {{ mode?: string }} options
       */
      async function createZNode(zIndexVal, { mode } = {}) {
        if (mode === 'global') {
          contentNode = /** @type {HTMLElement} */ (await fixture(html`
            <div class="z-index--${zIndexVal}">
              <style>
                .z-index--${zIndexVal} {
                  z-index: ${zIndexVal};
                }
              </style>
              I should be on top
            </div>
          `));
        }
        if (mode === 'inline') {
          contentNode = /** @type {HTMLElement} */ (await fixture(
            html` <div>I should be on top</div> `,
          ));
          contentNode.style.zIndex = zIndexVal;
        }
        return contentNode;
      }

      it('sets a z-index to make sure overlay is painted on top of siblings', async () => {
        const ctrl = new OverlayController({
          ...withLocalTestConfig(),
          contentNode: await createZNode('auto', { mode: 'global' }),
        });
        await ctrl.show();
        expect(ctrl.content.style.zIndex).to.equal('1');
        ctrl.updateConfig({ contentNode: await createZNode('auto', { mode: 'inline' }) });
        await ctrl.show();
        expect(ctrl.content.style.zIndex).to.equal('1');

        ctrl.updateConfig({ contentNode: await createZNode('0', { mode: 'global' }) });
        await ctrl.show();
        expect(ctrl.content.style.zIndex).to.equal('1');
        ctrl.updateConfig({ contentNode: await createZNode('0', { mode: 'inline' }) });
        await ctrl.show();
        expect(ctrl.content.style.zIndex).to.equal('1');
      });

      it.skip("doesn't set a z-index when contentNode already has >= 1", async () => {
        const ctrl = new OverlayController({
          ...withLocalTestConfig(),
          contentNode: await createZNode('1', { mode: 'global' }),
        });
        await ctrl.show();
        expect(ctrl.content.style.zIndex).to.equal('');
        ctrl.updateConfig({ contentNode: await createZNode('auto', { mode: 'inline' }) });
        await ctrl.show();
        expect(ctrl.content.style.zIndex).to.equal('');

        ctrl.updateConfig({ contentNode: await createZNode('2', { mode: 'global' }) });
        await ctrl.show();
        expect(ctrl.content.style.zIndex).to.equal('');
        ctrl.updateConfig({ contentNode: await createZNode('2', { mode: 'inline' }) });
        await ctrl.show();
        expect(ctrl.content.style.zIndex).to.equal('');
      });

      it("doesn't touch the value of .contentNode", async () => {
        const ctrl = new OverlayController({
          ...withLocalTestConfig(),
          contentNode: await createZNode('auto', { mode: 'global' }),
        });
        expect(ctrl.contentNode.style.zIndex).to.equal('');
      });
    });

    describe('Render target', () => {
      it('creates global target for placement mode "global"', async () => {
        const ctrl = new OverlayController({
          ...withGlobalTestConfig(),
        });
        expect(ctrl._renderTarget).to.equal(overlays.globalRootNode);
      });

      it.skip('creates local target next to sibling for placement mode "local"', async () => {
        const ctrl = new OverlayController({
          ...withLocalTestConfig(),
          invokerNode: /** @type {HTMLElement} */ (await fixture(html`<button>Invoker</button>`)),
        });
        expect(ctrl._renderTarget).to.be.undefined;
        expect(ctrl.content).to.equal(ctrl.invokerNode?.nextElementSibling);
      });

      it('keeps local target for placement mode "local" when already connected', async () => {
        const parentNode = /** @type {HTMLElement} */ (await fixture(html`
          <div id="parent">
            <div id="content">Content</div>
          </div>
        `));
        const contentNode = /** @type {HTMLElement} */ (parentNode.querySelector('#content'));
        const ctrl = new OverlayController({
          ...withLocalTestConfig(),
          contentNode,
        });
        expect(ctrl._renderTarget).to.equal(parentNode);
      });

      it('throws when passing a content node that was created "offline"', async () => {
        const contentNode = document.createElement('div');
        const createOverlayController = () => {
          new OverlayController({
            ...withLocalTestConfig(),
            contentNode,
          });
        };
        expect(createOverlayController).to.throw(
          '[OverlayController] Could not find a render target, since the provided contentNode is not connected to the DOM. Make sure that it is connected, e.g. by doing "document.body.appendChild(contentNode)", before passing it on.',
        );
      });

      it('succeeds when passing a content node that was created "online"', async () => {
        const contentNode = document.createElement('div');
        document.body.appendChild(contentNode);
        const overlay = new OverlayController({
          ...withLocalTestConfig(),
          contentNode,
        });
        expect(overlay.contentNode.isConnected).to.be.true;
        expect(overlay._renderTarget).to.not.be.undefined;
      });
    });
  });

  // TODO: Add teardown feature tests
  describe('Teardown', () => {
    it('removes the contentWrapperNode from global rootnode upon teardown', async () => {
      const ctrl = new OverlayController({
        ...withGlobalTestConfig(),
      });

      expect(ctrl.manager.globalRootNode.children.length).to.equal(1);
      ctrl.teardown();
      expect(ctrl.manager.globalRootNode.children.length).to.equal(0);
    });

    it('[global] restores contentNode if it was/is a projected node', async () => {
      const shadowHost = document.createElement('div');
      shadowHost.id = 'shadowHost';
      shadowHost.attachShadow({ mode: 'open' });
      /** @type {ShadowRoot} */
      (shadowHost.shadowRoot).innerHTML = `
        <div id="contentWrapperNode">
          <slot name="contentNode"></slot>
          <my-arrow></my-arrow>
        </div>
      `;
      const contentNode = document.createElement('div');
      contentNode.slot = 'contentNode';
      shadowHost.appendChild(contentNode);

      const wrapper = /** @type {HTMLElement} */ (await fixture('<div id="wrapper"></div>'));
      // Ensure the contentNode is connected to DOM
      wrapper.appendChild(shadowHost);

      // has one child = <div slot="contentNode"></div>
      expect(shadowHost.children.length).to.equal(1);

      const ctrl = new OverlayController({
        ...withLocalTestConfig(),
        placementMode: 'global',
        contentNode,
        contentWrapperNode: shadowHost,
      });

      // has no children as content gets moved to the body
      expect(shadowHost.children.length).to.equal(0);
      ctrl.teardown();

      // restores original light dom in teardown
      expect(shadowHost.children.length).to.equal(1);
    });
  });

  describe('Node Configuration', () => {
    it('accepts an .contentNode<Node> to directly set content', async () => {
      const ctrl = new OverlayController({
        ...withGlobalTestConfig(),
        contentNode: /** @type {HTMLElement} */ (await fixture('<p>direct node</p>')),
      });
      expect(ctrl.contentNode).to.have.trimmed.text('direct node');
    });

    it('accepts an .invokerNode<Node> to directly set invoker', async () => {
      const ctrl = new OverlayController({
        ...withGlobalTestConfig(),
        invokerNode: /** @type {HTMLElement} */ (await fixture('<button>invoke</button>')),
      });
      expect(ctrl.invokerNode).to.have.trimmed.text('invoke');
    });

    describe('When contentWrapperNode projects contentNode', () => {
      it('recognizes projected contentNode', async () => {
        const shadowHost = document.createElement('div');
        shadowHost.attachShadow({ mode: 'open' });
        /** @type {ShadowRoot} */ (shadowHost.shadowRoot).innerHTML = `
          <div id="contentWrapperNode">
            <slot name="contentNode"></slot>
            <my-arrow></my-arrow>
          </div>
        `;
        const contentNode = document.createElement('div');
        contentNode.slot = 'contentNode';
        shadowHost.appendChild(contentNode);

        // Ensure the contentNode is connected to DOM
        document.body.appendChild(shadowHost);

        const ctrl = new OverlayController({
          ...withLocalTestConfig(),
          contentNode,
          contentWrapperNode: /** @type {HTMLElement} */ (
            /** @type {ShadowRoot} */ (shadowHost.shadowRoot).getElementById('contentWrapperNode')
          ),
        });

        expect(ctrl.__isContentNodeProjected).to.be.true;
      });
    });

    describe('When contentWrapperNode needs to be provided for correct arrow positioning', () => {
      it('uses contentWrapperNode as provided for local positioning', async () => {
        const el = /** @type {HTMLElement} */ (await fixture(html`
          <div id="contentWrapperNode">
            <div id="contentNode"></div>
            <my-arrow></my-arrow>
          </div>
        `));

        const contentNode = /** @type {HTMLElement} */ (el.querySelector('#contentNode'));
        const contentWrapperNode = el;

        const ctrl = new OverlayController({
          ...withLocalTestConfig(),
          contentNode,
          contentWrapperNode,
        });

        expect(ctrl.contentWrapperNode).to.equal(contentWrapperNode);
      });
    });
  });

  describe('Feature Configuration', () => {
    describe('trapsKeyboardFocus', () => {
      it('offers an hasActiveTrapsKeyboardFocus flag', async () => {
        const ctrl = new OverlayController({
          ...withGlobalTestConfig(),
          trapsKeyboardFocus: true,
        });
        expect(ctrl.hasActiveTrapsKeyboardFocus).to.be.false;

        await ctrl.show();
        expect(ctrl.hasActiveTrapsKeyboardFocus).to.be.true;
      });

      it('focuses the overlay on show', async () => {
        const ctrl = new OverlayController({
          ...withGlobalTestConfig(),
          trapsKeyboardFocus: true,
        });
        await ctrl.show();
        expect(ctrl.contentNode).to.equal(document.activeElement);
      });

      it('keeps focus within the overlay e.g. you can not tab out by accident', async () => {
        const contentNode = /** @type {HTMLElement} */ (await fixture(html`
          <div><input id="input1" /><input id="input2" /></div>
        `));
        const ctrl = new OverlayController({
          ...withGlobalTestConfig(),
          trapsKeyboardFocus: true,
          contentNode,
        });
        await ctrl.show();

        const elOutside = /** @type {HTMLElement} */ (await fixture(
          html`<button>click me</button>`,
        ));
        const input1 = ctrl.contentNode.querySelectorAll('input')[0];
        const input2 = ctrl.contentNode.querySelectorAll('input')[1];

        input2.focus();
        // this mimics a tab within the contain-focus system used
        const event = new CustomEvent('keydown', { detail: 0, bubbles: true });
        // @ts-ignore override private key
        event.keyCode = keyCodes.tab;
        window.dispatchEvent(event);

        expect(elOutside).to.not.equal(document.activeElement);
        expect(input1).to.equal(document.activeElement);
      });

      it('allows to move the focus outside of the overlay if trapsKeyboardFocus is disabled', async () => {
        const contentNode = /** @type {HTMLElement} */ (await fixture(html`<div><input /></div>`));

        const ctrl = new OverlayController({
          ...withGlobalTestConfig(),
          contentNode,
          trapsKeyboardFocus: true,
        });
        // add element to dom to allow focus
        /** @type {HTMLElement} */ (await fixture(html`${ctrl.content}`));
        await ctrl.show();

        const elOutside = /** @type {HTMLElement} */ (await fixture(html`<input />`));
        const input = /** @type {HTMLInputElement} */ (ctrl.contentNode.querySelector('input'));

        input.focus();
        simulateTab();

        expect(elOutside).to.equal(document.activeElement);
      });

      it('keeps focus within overlay with multiple overlays with all traps on true', async () => {
        const ctrl0 = new OverlayController({
          ...withGlobalTestConfig(),
          trapsKeyboardFocus: true,
        });

        const ctrl1 = new OverlayController({
          ...withGlobalTestConfig(),
          trapsKeyboardFocus: true,
        });

        await ctrl0.show();
        await ctrl1.show();
        expect(ctrl0.hasActiveTrapsKeyboardFocus).to.be.false;
        expect(ctrl1.hasActiveTrapsKeyboardFocus).to.be.true;

        await ctrl1.hide();
        expect(ctrl0.hasActiveTrapsKeyboardFocus).to.be.true;
        expect(ctrl1.hasActiveTrapsKeyboardFocus).to.be.false;
      });
    });

    describe('hidesOnEsc', () => {
      it('hides when [escape] is pressed', async () => {
        const ctrl = new OverlayController({
          ...withGlobalTestConfig(),
          hidesOnEsc: true,
        });
        await ctrl.show();
        ctrl.contentNode.dispatchEvent(new KeyboardEvent('keyup', { key: 'Escape' }));
        await aTimeout(0);
        expect(ctrl.isShown).to.be.false;
      });

      it('stays shown when [escape] is pressed on outside element', async () => {
        const ctrl = new OverlayController({
          ...withGlobalTestConfig(),
          hidesOnEsc: true,
        });
        await ctrl.show();
        document.dispatchEvent(new KeyboardEvent('keyup', { key: 'Escape' }));
        expect(ctrl.isShown).to.be.true;
      });
    });

    describe('hidesOnOutsideEsc', () => {
      it('hides when [escape] is pressed on outside element', async () => {
        const ctrl = new OverlayController({
          ...withGlobalTestConfig(),
          hidesOnOutsideEsc: true,
        });
        await ctrl.show();
        document.dispatchEvent(new KeyboardEvent('keyup', { key: 'Escape' }));
        await aTimeout(0);
        expect(ctrl.isShown).to.be.false;
      });

      it('stays shown when [escape] is pressed on inside element', async () => {
        const ctrl = new OverlayController({
          ...withGlobalTestConfig(),
          hidesOnOutsideEsc: true,
        });
        await ctrl.show();
        ctrl.contentNode.dispatchEvent(new KeyboardEvent('keyup', { key: 'Escape' }));
        expect(ctrl.isShown).to.be.true;
      });
    });

    describe('hidesOnOutsideClick', () => {
      it('hides on outside click', async () => {
        const contentNode = /** @type {HTMLElement} */ (await fixture('<div>Content</div>'));
        const ctrl = new OverlayController({
          ...withGlobalTestConfig(),
          hidesOnOutsideClick: true,
          contentNode,
        });
        await ctrl.show();

        document.body.click();
        await aTimeout(0);
        expect(ctrl.isShown).to.be.false;
      });

      it('doesn\'t hide on "inside" click', async () => {
        const invokerNode = /** @type {HTMLElement} */ (await fixture('<button>Invoker</button>'));
        const contentNode = /** @type {HTMLElement} */ (await fixture('<div>Content</div>'));
        const ctrl = new OverlayController({
          ...withGlobalTestConfig(),
          hidesOnOutsideClick: true,
          contentNode,
          invokerNode,
        });
        await ctrl.show();

        // Don't hide on invoker click
        ctrl.invokerNode?.click();
        await aTimeout(0);
        expect(ctrl.isShown).to.be.true;

        // Don't hide on inside (content) click
        ctrl.contentNode.click();
        await aTimeout(0);

        expect(ctrl.isShown).to.be.true;

        // Important to check if it can be still shown after, because we do some hacks inside
        await ctrl.hide();
        expect(ctrl.isShown).to.be.false;
        await ctrl.show();
        expect(ctrl.isShown).to.be.true;
      });

      it('doesn\'t hide on "inside sub shadow dom" click', async () => {
        const invokerNode = /** @type {HTMLElement} */ (await fixture('<button>Invoker</button>'));
        const contentNode = /** @type {HTMLElement} */ (await fixture('<div>Content</div>'));
        const ctrl = new OverlayController({
          ...withGlobalTestConfig(),
          hidesOnOutsideClick: true,
          contentNode,
          invokerNode,
        });
        await ctrl.show();

        // Works as well when clicked content element lives in shadow dom
        const tagString = defineCE(
          class extends HTMLElement {
            constructor() {
              super();
              this.attachShadow({ mode: 'open' });
            }

            connectedCallback() {
              /** @type {ShadowRoot} */
              (this.shadowRoot).innerHTML = '<div><button>click me</button></div>';
            }
          },
        );
        const tag = unsafeStatic(tagString);
        ctrl.updateConfig({
          contentNode: /** @type {HTMLElement} */ (await fixture(html`
            <div>
              <div>Content</div>
              <${tag}></${tag}>
            </div>
          `)),
        });
        await ctrl.show();

        // Don't hide on inside shadowDom click
        /** @type {ShadowRoot} */
        // @ts-expect-error
        (ctrl.contentNode.querySelector(tagString).shadowRoot).querySelector('button').click();

        await aTimeout(0);
        expect(ctrl.isShown).to.be.true;

        // Important to check if it can be still shown after, because we do some hacks inside
        await ctrl.hide();
        expect(ctrl.isShown).to.be.false;
        await ctrl.show();
        expect(ctrl.isShown).to.be.true;
      });

      it('works with 3rd party code using "event.stopPropagation()" on bubble phase', async () => {
        const invokerNode = /** @type {HTMLElement} */ (await fixture(
          '<div role="button">Invoker</div>',
        ));
        const contentNode = /** @type {HTMLElement} */ (await fixture('<div>Content</div>'));
        const ctrl = new OverlayController({
          ...withLocalTestConfig(),
          hidesOnOutsideClick: true,
          contentNode,
          invokerNode,
        });
        const dom = await fixture(
          /**
           * @param {{ stopPropagation: () => any; }} e
           */
          `
          <div>
            <div id="popup">${invokerNode}${contentNode}</div>
            <div
              id="regular-sibling"
              @click="${() => {
                /* propagates */
              }}"
            ></div>
            <third-party-noise @click="${(/** @type {Event} */ e) => e.stopPropagation()}">
              This element prevents our handlers from reaching the document click handler.
            </third-party-noise>
          </div>
        `,
        );

        await ctrl.show();
        expect(ctrl.isShown).to.equal(true);

        /** @type {HTMLElement} */
        (dom.querySelector('third-party-noise')).click();
        await aTimeout(0);
        expect(ctrl.isShown).to.equal(false);

        // Important to check if it can be still shown after, because we do some hacks inside
        await ctrl.show();
        expect(ctrl.isShown).to.equal(true);
      });

      it('works with 3rd party code using "event.stopPropagation()" on capture phase', async () => {
        const invokerNode = /** @type {HTMLElement} */ (await fixture(
          html`<div role="button">Invoker</div>`,
        ));
        const contentNode = /** @type {HTMLElement} */ (await fixture('<div>Content</div>'));
        const ctrl = new OverlayController({
          ...withLocalTestConfig(),
          hidesOnOutsideClick: true,
          contentNode,
          invokerNode,
        });
        const dom = /** @type {HTMLElement} */ (await fixture(`
          <div>
            <div id="popup">${invokerNode}${ctrl.content}</div>
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
        `));

        /** @type {HTMLElement} */
        (dom.querySelector('third-party-noise')).addEventListener(
          'click',
          (/** @type {Event} */ event) => {
            event.stopPropagation();
          },
          true,
        );

        await ctrl.show();
        expect(ctrl.isShown).to.equal(true);

        /** @type {HTMLElement} */
        (dom.querySelector('third-party-noise')).click();
        await aTimeout(0);
        expect(ctrl.isShown).to.equal(false);

        // Important to check if it can be still shown after, because we do some hacks inside
        await ctrl.show();
        expect(ctrl.isShown).to.equal(true);
      });

      it('doesn\'t hide on "inside label" click', async () => {
        const contentNode = /** @type {HTMLElement} */ (await fixture(`
          <div>
            <label for="test">test</label>
            <input id="test">
            Content
          </div>`));
        const labelNode = /** @type {HTMLElement} */ (contentNode.querySelector('label[for=test]'));
        const ctrl = new OverlayController({
          ...withGlobalTestConfig(),
          hidesOnOutsideClick: true,
          contentNode,
        });
        await ctrl.show();

        // Don't hide on label click
        labelNode.click();
        await aTimeout(0);

        expect(ctrl.isShown).to.be.true;
      });
    });

    describe('elementToFocusAfterHide', () => {
      it('focuses body when hiding by default', async () => {
        const contentNode = /** @type {HTMLElement} */ (await fixture('<div><input /></div>'));
        const ctrl = new OverlayController({
          ...withGlobalTestConfig(),
          viewportConfig: {
            placement: 'top-left',
          },
          contentNode,
        });

        await ctrl.show();
        const input = /** @type {HTMLInputElement} */ (contentNode.querySelector('input'));
        input.focus();
        expect(document.activeElement).to.equal(input);

        await ctrl.hide();
        await nextFrame(); // moving focus to body takes time?
        expect(document.activeElement).to.equal(document.body);
      });

      it('supports elementToFocusAfterHide option to focus it when hiding', async () => {
        const input = /** @type {HTMLElement} */ (await fixture('<input />'));
        const contentNode = /** @type {HTMLElement} */ (await fixture(
          '<div><textarea></textarea></div>',
        ));
        const ctrl = new OverlayController({
          ...withGlobalTestConfig(),
          elementToFocusAfterHide: input,
          contentNode,
        });

        await ctrl.show();
        const textarea = /** @type {HTMLTextAreaElement} */ (contentNode.querySelector('textarea'));
        textarea.focus();
        expect(document.activeElement).to.equal(textarea);

        await ctrl.hide();
        expect(document.activeElement).to.equal(input);
      });

      it('allows to set elementToFocusAfterHide on show', async () => {
        const input = /** @type {HTMLElement} */ (await fixture('<input />'));
        const contentNode = /** @type {HTMLElement} */ (await fixture(
          '<div><textarea></textarea></div>',
        ));
        const ctrl = new OverlayController({
          ...withGlobalTestConfig(),
          viewportConfig: {
            placement: 'top-left',
          },
          contentNode,
        });

        await ctrl.show(input);
        const textarea = /** @type {HTMLTextAreaElement} */ (contentNode.querySelector('textarea'));
        textarea.focus();
        expect(document.activeElement).to.equal(textarea);

        await ctrl.hide();
        expect(document.activeElement).to.equal(input);
      });
    });

    describe('preventsScroll', () => {
      it('prevent scrolling the background', async () => {
        const ctrl = new OverlayController({
          ...withGlobalTestConfig(),
          preventsScroll: true,
        });

        await ctrl.show();
        expect(getComputedStyle(document.body).overflow).to.equal('hidden');

        await ctrl.hide();
        expect(getComputedStyle(document.body).overflow).to.equal('visible');
      });

      it('keeps preventing of scrolling when multiple overlays are opened and closed', async () => {
        const ctrl0 = new OverlayController({
          ...withGlobalTestConfig(),
          preventsScroll: true,
        });
        const ctrl1 = new OverlayController({
          ...withGlobalTestConfig(),
          preventsScroll: true,
        });

        await ctrl0.show();
        await ctrl1.show();
        await ctrl1.hide();
        expect(getComputedStyle(document.body).overflow).to.equal('hidden');
      });
    });

    describe('hasBackdrop', () => {
      it('has no backdrop by default', async () => {
        const ctrl = new OverlayController({
          ...withGlobalTestConfig(),
        });
        await ctrl.show();
        expect(ctrl.backdropNode).to.be.undefined;
      });

      it('supports a backdrop option', async () => {
        const ctrl = new OverlayController({
          ...withGlobalTestConfig(),
          hasBackdrop: false,
        });
        await ctrl.show();
        expect(ctrl.backdropNode).to.be.undefined;
        await ctrl.hide();

        const controllerWithBackdrop = new OverlayController({
          ...withGlobalTestConfig(),
          hasBackdrop: true,
        });
        await controllerWithBackdrop.show();
        expect(controllerWithBackdrop.backdropNode).to.have.class('global-overlays__backdrop');
      });

      it('reenables the backdrop when shown/hidden/shown', async () => {
        const ctrl = new OverlayController({
          ...withGlobalTestConfig(),
          hasBackdrop: true,
        });
        await ctrl.show();
        expect(ctrl.backdropNode).to.have.class('global-overlays__backdrop');
        await ctrl.hide();
        await ctrl.show();
        expect(ctrl.backdropNode).to.have.class('global-overlays__backdrop');
      });

      it('adds and stacks backdrops if .hasBackdrop is enabled', async () => {
        const ctrl0 = new OverlayController({
          ...withGlobalTestConfig(),
          hasBackdrop: true,
        });
        await ctrl0.show();
        expect(ctrl0.backdropNode).to.have.class('global-overlays__backdrop');

        const ctrl1 = new OverlayController({
          ...withGlobalTestConfig(),
          hasBackdrop: false,
        });
        await ctrl1.show();
        expect(ctrl0.backdropNode).to.have.class('global-overlays__backdrop');
        expect(ctrl1.backdropNode).to.be.undefined;

        const ctrl2 = new OverlayController({
          ...withGlobalTestConfig(),
          hasBackdrop: true,
        });
        await ctrl2.show();

        expect(ctrl0.backdropNode).to.have.class('global-overlays__backdrop');
        expect(ctrl1.backdropNode).to.be.undefined;
        expect(ctrl2.backdropNode).to.have.class('global-overlays__backdrop');
      });
    });

    describe('locally placed overlay with hasBackdrop', () => {
      it('has no backdrop by default', async () => {
        const ctrl = new OverlayController({
          ...withLocalTestConfig(),
        });
        await ctrl.show();
        expect(ctrl.backdropNode).to.be.undefined;
      });

      it('supports a backdrop option', async () => {
        const ctrl = new OverlayController({
          ...withLocalTestConfig(),
          hasBackdrop: false,
        });
        await ctrl.show();
        expect(ctrl.backdropNode).to.be.undefined;
        await ctrl.hide();

        const backdropNode = document.createElement('div');
        backdropNode.classList.add('custom-backdrop');

        const controllerWithBackdrop = new OverlayController({
          ...withLocalTestConfig(),
          hasBackdrop: true,
          backdropNode,
        });
        await controllerWithBackdrop.show();
        expect(controllerWithBackdrop.backdropNode).to.have.class('custom-backdrop');
      });

      it('reenables the backdrop when shown/hidden/shown', async () => {
        const backdropNode = document.createElement('div');
        backdropNode.classList.add('custom-backdrop');

        const ctrl = new OverlayController({
          ...withLocalTestConfig(),
          hasBackdrop: true,
          backdropNode,
        });
        await ctrl.show();
        expect(ctrl.backdropNode).to.have.class('custom-backdrop');
        await ctrl.hide();
        await ctrl.show();
        expect(ctrl.backdropNode).to.have.class('custom-backdrop');
      });

      it('adds and stacks backdrops if .hasBackdrop is enabled', async () => {
        const backdropNode = document.createElement('div');
        backdropNode.classList.add('custom-backdrop-zero');

        const ctrl0 = new OverlayController({
          ...withLocalTestConfig(),
          hasBackdrop: true,
          backdropNode,
        });
        await ctrl0.show();
        expect(ctrl0.backdropNode).to.have.class('custom-backdrop-zero');

        const ctrl1 = new OverlayController({
          ...withLocalTestConfig(),
          hasBackdrop: false,
        });
        await ctrl1.show();
        expect(ctrl0.backdropNode).to.have.class('custom-backdrop-zero');
        expect(ctrl1.backdropNode).to.be.undefined;

        const anotherBackdropNode = document.createElement('div');
        anotherBackdropNode.classList.add('custom-backdrop-two');

        const ctrl2 = new OverlayController({
          ...withLocalTestConfig(),
          hasBackdrop: true,
          backdropNode: anotherBackdropNode,
        });
        await ctrl2.show();

        expect(ctrl0.backdropNode).to.have.class('custom-backdrop-zero');
        expect(ctrl1.backdropNode).to.be.undefined;
        expect(ctrl2.backdropNode).to.have.class('custom-backdrop-two');
      });
    });

    describe('isBlocking', () => {
      it('prevents showing of other overlays', async () => {
        const ctrl0 = new OverlayController({
          ...withGlobalTestConfig(),
          isBlocking: false,
        });
        const ctrl1 = new OverlayController({
          ...withGlobalTestConfig(),
          isBlocking: false,
        });
        const ctrl2 = new OverlayController({
          ...withGlobalTestConfig(),
          isBlocking: true,
        });
        const ctrl3 = new OverlayController({
          ...withGlobalTestConfig(),
          isBlocking: false,
        });

        await ctrl0.show();
        await ctrl1.show();
        await ctrl2.show(); // blocking
        expect(ctrl0.content).to.not.be.displayed;
        expect(ctrl1.content).to.not.be.displayed;
        expect(ctrl2.content).to.be.displayed;

        await ctrl3.show();
        expect(ctrl3.content).to.be.displayed;

        await ctrl2.hide();
        expect(ctrl0.content).to.be.displayed;
        expect(ctrl1.content).to.be.displayed;

        await ctrl2.show(); // blocking
        expect(ctrl0.content).to.not.be.displayed;
        expect(ctrl1.content).to.not.be.displayed;
        expect(ctrl2.content).to.be.displayed;
        expect(ctrl3.content).to.not.be.displayed;
      });

      it('keeps backdrop status when used in combination with blocking', async () => {
        const ctrl0 = new OverlayController({
          ...withGlobalTestConfig(),
          isBlocking: false,
          hasBackdrop: true,
        });
        await ctrl0.show();

        const ctrl1 = new OverlayController({
          ...withGlobalTestConfig(),
          isBlocking: false,
          hasBackdrop: true,
        });
        await ctrl1.show();
        await ctrl1.hide();
        expect(ctrl0.hasActiveBackdrop).to.be.true;
        expect(ctrl1.hasActiveBackdrop).to.be.false;

        await ctrl1.show();
        expect(ctrl0.hasActiveBackdrop).to.be.true;
        expect(ctrl1.hasActiveBackdrop).to.be.true;
      });
    });
  });

  describe('Show / Hide / Toggle', () => {
    it('has .isShown which defaults to false', async () => {
      const ctrl = new OverlayController({
        ...withGlobalTestConfig(),
      });
      expect(ctrl.isShown).to.be.false;
    });

    it('has async show() which shows the overlay', async () => {
      const ctrl = new OverlayController({
        ...withGlobalTestConfig(),
      });
      await ctrl.show();
      expect(ctrl.isShown).to.be.true;
      expect(ctrl.show()).to.be.instanceOf(Promise);
    });

    it('has async hide() which hides the overlay', async () => {
      const ctrl = new OverlayController({
        ...withGlobalTestConfig(),
      });

      await ctrl.hide();
      expect(ctrl.isShown).to.be.false;
      expect(ctrl.hide()).to.be.instanceOf(Promise);
    });

    it('fires "show" event once overlay becomes shown', async () => {
      const showSpy = sinon.spy();
      const ctrl = new OverlayController({
        ...withGlobalTestConfig(),
      });

      ctrl.addEventListener('show', showSpy);
      await ctrl.show();
      expect(showSpy.callCount).to.equal(1);
      await ctrl.show();
      expect(showSpy.callCount).to.equal(1);
    });

    it('fires "before-show" event right before overlay becomes shown', async () => {
      const ctrl = new OverlayController({
        ...withGlobalTestConfig(),
      });

      const eventSpy = sinon.spy();

      ctrl.addEventListener('before-show', eventSpy);
      ctrl.addEventListener('show', eventSpy);

      await ctrl.show();
      expect(eventSpy.getCall(0).args[0].type).to.equal('before-show');
      expect(eventSpy.getCall(1).args[0].type).to.equal('show');

      expect(eventSpy.callCount).to.equal(2);
      await ctrl.show();
      expect(eventSpy.callCount).to.equal(2);
    });

    it('fires "hide" event once overlay becomes hidden', async () => {
      const hideSpy = sinon.spy();
      const ctrl = new OverlayController({
        ...withGlobalTestConfig(),
      });

      ctrl.addEventListener('hide', hideSpy);
      await ctrl.show();
      await ctrl.hide();
      expect(hideSpy.callCount).to.equal(1);
      await ctrl.hide();
      expect(hideSpy.callCount).to.equal(1);
    });

    it('fires "before-hide" event right before overlay becomes hidden', async () => {
      const ctrl = new OverlayController({
        ...withGlobalTestConfig(),
      });

      const eventSpy = sinon.spy();

      ctrl.addEventListener('before-hide', eventSpy);
      ctrl.addEventListener('hide', eventSpy);

      await ctrl.show();
      await ctrl.hide();
      expect(eventSpy.getCall(0).args[0].type).to.equal('before-hide');
      expect(eventSpy.getCall(1).args[0].type).to.equal('hide');

      expect(eventSpy.callCount).to.equal(2);
      await ctrl.hide();
      expect(eventSpy.callCount).to.equal(2);
    });

    it('can be toggled', async () => {
      const ctrl = new OverlayController({
        ...withGlobalTestConfig(),
      });

      await ctrl.toggle();
      expect(ctrl.isShown).to.be.true;

      await ctrl.toggle();
      expect(ctrl.isShown).to.be.false;

      await ctrl.toggle();
      expect(ctrl.isShown).to.be.true;

      // check for hide
      expect(ctrl.toggle()).to.be.instanceOf(Promise);
      // check for show
      expect(ctrl.toggle()).to.be.instanceOf(Promise);
    });

    it('makes sure the latest shown overlay is visible', async () => {
      const ctrl0 = new OverlayController({
        ...withGlobalTestConfig(),
      });
      const ctrl1 = new OverlayController({
        ...withGlobalTestConfig(),
      });
      await ctrl0.show();
      const rect = ctrl0.contentNode.getBoundingClientRect();
      const getTopEl = () => document.elementFromPoint(Math.ceil(rect.left), Math.ceil(rect.top));

      await ctrl0.show();
      expect(getTopEl()).to.equal(ctrl0.contentNode);

      await ctrl1.show();
      expect(getTopEl()).to.equal(ctrl1.contentNode);

      await ctrl0.show();
      expect(getTopEl()).to.equal(ctrl0.contentNode);
    });

    it('awaits a "transitionHide" hook before hiding for real', done => {
      const ctrl = new OverlayController({
        ...withGlobalTestConfig(),
      });
      ctrl.show();

      /** @type {{ (): void; (value?: void | PromiseLike<void> | undefined): void; }} */
      let hideTransitionFinished;
      ctrl.transitionHide = () =>
        new Promise(resolve => {
          hideTransitionFinished = resolve;
        });

      ctrl.hide();

      expect(getComputedStyle(ctrl.contentWrapperNode).display).to.equal('block');
      setTimeout(() => {
        hideTransitionFinished();
        setTimeout(() => {
          expect(getComputedStyle(ctrl.contentWrapperNode).display).to.equal('none');
          done();
        }, 0);
      }, 0);
    });

    it('awaits a "transitionShow" hook before finishing the show method', done => {
      const ctrl = new OverlayController({
        ...withGlobalTestConfig(),
      });

      /** @type {{ (): void; (value?: void | PromiseLike<void> | undefined): void; }} */
      let showTransitionFinished;
      ctrl.transitionShow = () =>
        new Promise(resolve => {
          showTransitionFinished = resolve;
        });
      ctrl.show();

      let showIsDone = false;

      /** @type {Promise<void>} */ (ctrl._showComplete).then(() => {
        showIsDone = true;
      });

      expect(showIsDone).to.be.false;
      setTimeout(() => {
        showTransitionFinished();
        setTimeout(() => {
          expect(showIsDone).to.be.true;
          done();
        }, 0);
      }, 0);
    });
  });

  describe('Update Configuration', () => {
    it('reinitializes content', async () => {
      const ctrl = new OverlayController({
        ...withLocalTestConfig(),
        contentNode: /** @type {HTMLElement} */ (await fixture(html`<div>content1</div>`)),
      });
      await ctrl.show(); // Popper adds inline styles
      expect(ctrl.content.style.transform).not.to.be.undefined;
      expect(ctrl.contentNode.textContent).to.include('content1');

      ctrl.updateConfig({
        placementMode: 'local',
        contentNode: /** @type {HTMLElement} */ (await fixture(html`<div>content2</div>`)),
      });
      expect(ctrl.contentNode.textContent).to.include('content2');
    });

    it('respects the initial config provided to new OverlayController(initialConfig)', async () => {
      const contentNode = /** @type {HTMLElement} */ (fixtureSync(html`<div>my content</div>`));

      const ctrl = new OverlayController({
        // This is the shared config
        placementMode: 'global',
        handlesAccessibility: true,
        contentNode,
      });
      ctrl.updateConfig({
        // This is the added config
        placementMode: 'local',
        hidesOnEsc: true,
      });
      expect(ctrl.placementMode).to.equal('local');
      expect(ctrl.handlesAccessibility).to.equal(true);
      expect(ctrl.contentNode).to.equal(contentNode);
    });

    // Currently not working, enable again when we fix updateConfig
    it.skip('allows for updating viewport config placement only, while keeping the content shown', async () => {
      const contentNode = /** @type {HTMLElement} */ (fixtureSync(html`<div>my content</div>`));

      const ctrl = new OverlayController({
        // This is the shared config
        placementMode: 'global',
        handlesAccessibility: true,
        contentNode,
      });

      ctrl.show();
      expect(
        ctrl.contentWrapperNode.classList.contains('global-overlays__overlay-container--center'),
      );
      expect(ctrl.isShown).to.be.true;

      ctrl.updateConfig({ viewportConfig: { placement: 'top-right' } });
      expect(
        ctrl.contentWrapperNode.classList.contains('global-overlays__overlay-container--top-right'),
      );
      expect(ctrl.isShown).to.be.true;
    });
  });

  describe('Accessibility', () => {
    it('synchronizes [aria-expanded] on invoker', async () => {
      const invokerNode = /** @type {HTMLElement} */ (await fixture(
        '<div role="button">invoker</div>',
      ));
      const ctrl = new OverlayController({
        ...withLocalTestConfig(),
        handlesAccessibility: true,
        invokerNode,
      });
      expect(ctrl.invokerNode?.getAttribute('aria-expanded')).to.equal('false');
      await ctrl.show();
      expect(ctrl.invokerNode?.getAttribute('aria-expanded')).to.equal('true');
      await ctrl.hide();
      expect(ctrl.invokerNode?.getAttribute('aria-expanded')).to.equal('false');
    });

    it('creates unique id for content', async () => {
      const ctrl = new OverlayController({
        ...withLocalTestConfig(),
        handlesAccessibility: true,
      });
      expect(ctrl.contentNode.id).to.contain(ctrl._contentId);
    });

    it('preserves content id when present', async () => {
      const contentNode = /** @type {HTMLElement} */ (await fixture(
        '<div id="preserved">content</div>',
      ));
      const ctrl = new OverlayController({
        ...withLocalTestConfig(),
        handlesAccessibility: true,
        contentNode,
      });
      expect(ctrl.contentNode.id).to.contain('preserved');
    });

    it('adds [role=dialog] on content', async () => {
      const invokerNode = /** @type {HTMLElement} */ (await fixture(
        '<div role="button">invoker</div>',
      ));
      const ctrl = new OverlayController({
        ...withLocalTestConfig(),
        handlesAccessibility: true,
        invokerNode,
      });
      expect(ctrl.contentNode.getAttribute('role')).to.equal('dialog');
    });

    it('preserves [role] on content when present', async () => {
      const invokerNode = /** @type {HTMLElement} */ (await fixture(
        '<div role="button">invoker</div>',
      ));
      const contentNode = /** @type {HTMLElement} */ (await fixture(
        '<div role="menu">invoker</div>',
      ));
      const ctrl = new OverlayController({
        ...withLocalTestConfig(),
        handlesAccessibility: true,
        invokerNode,
        contentNode,
      });
      expect(ctrl.contentNode.getAttribute('role')).to.equal('menu');
    });

    it('allows to not provide an invokerNode', async () => {
      let properlyInstantiated = false;
      try {
        new OverlayController({
          ...withLocalTestConfig(),
          handlesAccessibility: true,
          invokerNode: undefined,
        });
        properlyInstantiated = true;
      } catch (e) {
        throw new Error(e);
      }
      expect(properlyInstantiated).to.be.true;
    });

    it('adds attributes inert and aria-hidden="true" on all siblings of rootNode if an overlay is shown', async () => {
      const ctrl = new OverlayController({
        ...withGlobalTestConfig(),
        trapsKeyboardFocus: true,
      });

      const sibling1 = document.createElement('div');
      const sibling2 = document.createElement('div');
      document.body.insertBefore(sibling1, ctrl.manager.globalRootNode);
      document.body.appendChild(sibling2);

      await ctrl.show();

      [sibling1, sibling2].forEach(sibling => {
        expect(sibling).to.have.attribute('aria-hidden', 'true');
        expect(sibling).to.have.attribute('inert');
      });
      expect(ctrl.content.hasAttribute('aria-hidden')).to.be.false;
      expect(ctrl.content.hasAttribute('inert')).to.be.false;

      await ctrl.hide();

      [sibling1, sibling2].forEach(sibling => {
        expect(sibling).to.not.have.attribute('aria-hidden');
        expect(sibling).to.not.have.attribute('inert');
      });

      // cleanup
      document.body.removeChild(sibling1);
      document.body.removeChild(sibling2);
    });

    /**
     * style.userSelect:
     *   - chrome: 'none'
     *   - rest: undefined
     *
     * style.pointerEvents:
     *   - chrome: auto
     *   - IE11: visiblePainted
     */
    it('disables pointer events and selection on inert elements', async () => {
      const ctrl = new OverlayController({
        ...withGlobalTestConfig(),
        trapsKeyboardFocus: true,
      });

      // show+hide are needed to create a root node
      await ctrl.show();
      await ctrl.hide();

      const sibling1 = document.createElement('div');
      const sibling2 = document.createElement('div');
      document.body.insertBefore(sibling1, ctrl.manager.globalRootNode);
      document.body.appendChild(sibling2);

      await ctrl.show();

      [sibling1, sibling2].forEach(sibling => {
        expect(window.getComputedStyle(sibling).userSelect).to.be.oneOf(['none', undefined]);
        expect(window.getComputedStyle(sibling).pointerEvents).to.equal('none');
      });

      expect(window.getComputedStyle(ctrl.contentNode).userSelect).to.be.oneOf(['auto', undefined]);
      expect(window.getComputedStyle(ctrl.contentNode).pointerEvents).to.be.oneOf([
        'auto',
        'visiblePainted',
      ]);

      await ctrl.hide();

      [sibling1, sibling2].forEach(sibling => {
        expect(window.getComputedStyle(sibling).userSelect).to.be.oneOf(['auto', undefined]);
        expect(window.getComputedStyle(sibling).pointerEvents).to.be.oneOf([
          'auto',
          'visiblePainted',
        ]);
      });

      // cleanup
      document.body.removeChild(sibling1);
      document.body.removeChild(sibling2);
    });

    describe('Tooltip', () => {
      it('adds [aria-describedby] on invoker', async () => {
        const invokerNode = /** @type {HTMLElement} */ (await fixture(
          '<div role="button">invoker</div>',
        ));
        const ctrl = new OverlayController({
          ...withLocalTestConfig(),
          handlesAccessibility: true,
          isTooltip: true,
          invokerNode,
        });
        expect(ctrl.invokerNode?.getAttribute('aria-describedby')).to.equal(ctrl._contentId);
      });

      it('adds [aria-labelledby] on invoker when invokerRelation is label', async () => {
        const invokerNode = /** @type {HTMLElement} */ (await fixture(
          '<div role="button">invoker</div>',
        ));
        const ctrl = new OverlayController({
          ...withLocalTestConfig(),
          handlesAccessibility: true,
          isTooltip: true,
          invokerRelation: 'label',
          invokerNode,
        });
        expect(ctrl.invokerNode?.getAttribute('aria-describedby')).to.equal(null);
        expect(ctrl.invokerNode?.getAttribute('aria-labelledby')).to.equal(ctrl._contentId);
      });

      it('adds [role=tooltip] on content', async () => {
        const invokerNode = /** @type {HTMLElement} */ (await fixture(
          '<div role="button">invoker</div>',
        ));
        const ctrl = new OverlayController({
          ...withLocalTestConfig(),
          handlesAccessibility: true,
          isTooltip: true,
          invokerNode,
        });
        expect(ctrl.contentNode.getAttribute('role')).to.equal('tooltip');
      });

      describe('Teardown', () => {
        it('restores [role] on dialog content', async () => {
          const invokerNode = /** @type {HTMLElement} */ (await fixture(
            '<div role="button">invoker</div>',
          ));
          const ctrl = new OverlayController({
            ...withLocalTestConfig(),
            handlesAccessibility: true,
            invokerNode,
          });
          expect(ctrl.contentNode.getAttribute('role')).to.equal('dialog');
          ctrl.teardown();
          expect(ctrl.contentNode.getAttribute('role')).to.equal(null);
        });

        it('restores [role] on tooltip content', async () => {
          const invokerNode = /** @type {HTMLElement} */ (await fixture(
            '<div role="button">invoker</div>',
          ));
          const contentNode = /** @type {HTMLElement} */ (await fixture(
            '<div role="presentation">content</div>',
          ));
          const ctrl = new OverlayController({
            ...withLocalTestConfig(),
            handlesAccessibility: true,
            isTooltip: true,
            invokerNode,
            contentNode,
          });
          expect(contentNode.getAttribute('role')).to.equal('tooltip');
          ctrl.teardown();
          expect(contentNode.getAttribute('role')).to.equal('presentation');
        });

        it('restores [aria-describedby] on content', async () => {
          const invokerNode = /** @type {HTMLElement} */ (await fixture(
            '<div role="button">invoker</div>',
          ));
          const contentNode = /** @type {HTMLElement} */ (await fixture(
            '<div role="presentation">content</div>',
          ));
          const ctrl = new OverlayController({
            ...withLocalTestConfig(),
            handlesAccessibility: true,
            isTooltip: true,
            invokerNode,
            contentNode,
          });
          expect(invokerNode.getAttribute('aria-describedby')).to.equal(contentNode.id);
          ctrl.teardown();
          expect(invokerNode.getAttribute('aria-describedby')).to.equal(null);
        });

        it('restores [aria-labelledby] on content', async () => {
          const invokerNode = /** @type {HTMLElement} */ (await fixture(
            '<div role="button">invoker</div>',
          ));
          const contentNode = /** @type {HTMLElement} */ (await fixture(
            '<div role="presentation">content</div>',
          ));
          const ctrl = new OverlayController({
            ...withLocalTestConfig(),
            handlesAccessibility: true,
            isTooltip: true,
            invokerNode,
            contentNode,
            invokerRelation: 'label',
          });
          expect(invokerNode.getAttribute('aria-labelledby')).to.equal(contentNode.id);
          ctrl.teardown();
          expect(invokerNode.getAttribute('aria-labelledby')).to.equal(null);
        });
      });
    });
  });

  describe('Exception handling', () => {
    it('throws if no .placementMode gets passed on', async () => {
      const contentNode = document.createElement('div');
      // Ensure the contentNode is connected to DOM
      document.body.appendChild(contentNode);
      expect(() => {
        new OverlayController({
          contentNode,
        });
      }).to.throw('[OverlayController] You need to provide a .placementMode ("global"|"local")');
    });

    it('throws if invalid .placementMode gets passed on', async () => {
      expect(() => {
        new OverlayController({
          // @ts-ignore
          placementMode: 'invalid',
        });
      }).to.throw(
        '[OverlayController] "invalid" is not a valid .placementMode, use ("global"|"local")',
      );
    });

    it('throws if no .contentNode gets passed on', async () => {
      expect(() => {
        new OverlayController({
          placementMode: 'global',
        });
      }).to.throw('[OverlayController] You need to provide a .contentNode');
    });

    it('throws if contentNodeWrapper is not provided for projected contentNode', async () => {
      const shadowHost = document.createElement('div');
      shadowHost.attachShadow({ mode: 'open' });
      /** @type {ShadowRoot} */ (shadowHost.shadowRoot).innerHTML = `
        <div id="contentWrapperNode">
          <slot name="contentNode"></slot>
          <my-arrow></my-arrow>
        </div>
      `;
      const contentNode = document.createElement('div');
      contentNode.slot = 'contentNode';
      shadowHost.appendChild(contentNode);

      // Ensure the contentNode is connected to DOM
      document.body.appendChild(shadowHost);

      expect(() => {
        new OverlayController({
          ...withLocalTestConfig(),
          contentNode,
        });
      }).to.throw(
        '[OverlayController] You need to provide a .contentWrapperNode when .contentNode is projected',
      );
    });

    it('throws if placementMode is global for a tooltip', async () => {
      const contentNode = document.createElement('div');
      document.body.appendChild(contentNode);
      expect(() => {
        new OverlayController({
          placementMode: 'global',
          contentNode,
          isTooltip: true,
          handlesAccessibility: true,
        });
      }).to.throw(
        '[OverlayController] .isTooltip should be configured with .placementMode "local"',
      );
    });

    it('throws if handlesAccessibility is false for a tooltip', async () => {
      const contentNode = document.createElement('div');
      document.body.appendChild(contentNode);
      expect(() => {
        new OverlayController({
          placementMode: 'local',
          contentNode,
          isTooltip: true,
          handlesAccessibility: false,
        });
      }).to.throw(
        '[OverlayController] .isTooltip only takes effect when .handlesAccessibility is enabled',
      );
    });
  });
});
