/* eslint-disable no-new */
import {
  aTimeout,
  defineCE,
  expect,
  fixture,
  html,
  unsafeStatic,
  fixtureSync,
} from '@open-wc/testing';
import sinon from 'sinon';
import { OverlayController, overlays } from '@lion/ui/overlays.js';
import { mimicClick } from '@lion/ui/overlays-test-helpers.js';

import { keyCodes } from '../src/utils/key-codes.js';
import { simulateTab } from '../src/utils/simulate-tab.js';

/**
 * @typedef {import('../types/OverlayConfig.js').OverlayConfig} OverlayConfig
 * @typedef {import('../types/OverlayConfig.js').ViewportPlacement} ViewportPlacement
 */

const wrappingDialogNodeStyle = 'display: none; z-index: 9999;';

/**
 * @param {HTMLElement} node
 */
function normalizeOverlayContentWapper(node) {
  if (node.hasAttribute('style') && !node.style.cssText) {
    node.removeAttribute('style');
  }
}

/**
 * @param {OverlayController} overlayControllerEl
 */
function getProtectedMembers(overlayControllerEl) {
  // @ts-ignore
  const { _contentId: contentId, _renderTarget: renderTarget } = overlayControllerEl;
  return {
    contentId,
    renderTarget,
  };
}

const withGlobalTestConfig = () =>
  /** @type {OverlayConfig} */ ({
    placementMode: 'global',
    contentNode: /** @type {HTMLElement} */ (fixtureSync(html`<div>my content</div>`)),
  });

const withLocalTestConfig = () =>
  /** @type {OverlayConfig} */ ({
    placementMode: 'local',
    contentNode: /** @type {HTMLElement} */ (fixtureSync(html`<div>my content</div>`)),
    invokerNode: /** @type {HTMLElement} */ (
      fixtureSync(html` <div role="button" style="width: 100px; height: 20px;">Invoker</div> `)
    ),
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
      expect(ctrl.contentNode.parentElement).to.equal(ctrl.contentWrapperNode);
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
          contentNode = /** @type {HTMLElement} */ (
            await fixture(html`
              <div class="z-index--${zIndexVal}">
                <style>
                  .z-index--${zIndexVal} {
                    z-index: ${zIndexVal};
                  }
                </style>
                I should be on top
              </div>
            `)
          );
        }
        if (mode === 'inline') {
          contentNode = /** @type {HTMLElement} */ (
            await fixture(html` <div>I should be on top</div> `)
          );
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
        // @ts-expect-error find out why config would/could be undfined
        expect(ctrl.content.style.zIndex).to.equal(`${ctrl.config.zIndex + 1}`);
        ctrl.updateConfig({ contentNode: await createZNode('auto', { mode: 'inline' }) });
        await ctrl.show();
        // @ts-expect-error find out why config would/could be undfined
        expect(ctrl.content.style.zIndex).to.equal(`${ctrl.config.zIndex + 1}`);

        ctrl.updateConfig({ contentNode: await createZNode('0', { mode: 'global' }) });
        await ctrl.show();
        // @ts-expect-error find out why config would/could be undfined
        expect(ctrl.content.style.zIndex).to.equal(`${ctrl.config.zIndex + 1}`);
        ctrl.updateConfig({ contentNode: await createZNode('0', { mode: 'inline' }) });
        await ctrl.show();
        // @ts-expect-error find out why config would/could be undfined
        expect(ctrl.content.style.zIndex).to.equal(`${ctrl.config.zIndex + 1}`);
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

    describe('Offline content', () => {
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
        const contentNode = /** @type {HTMLElement} */ (fixtureSync('<div>'));
        const overlay = new OverlayController({
          ...withLocalTestConfig(),
          contentNode,
        });
        expect(overlay.contentNode.isConnected).to.be.true;
      });
    });
  });

  // TODO: Add teardown feature tests
  describe('Teardown', () => {});

  describe('Node Configuration', () => {
    describe('Content', async () => {
      it('accepts a .contentNode for displaying content of the overlay', async () => {
        const myContentNode = /** @type {HTMLElement} */ (fixtureSync('<p>direct node</p>'));
        const ctrl = new OverlayController({
          ...withGlobalTestConfig(),
          contentNode: myContentNode,
        });
        expect(ctrl.contentNode).to.have.trimmed.text('direct node');
        expect(ctrl.contentNode).to.equal(myContentNode);
      });

      describe('Embedded dom structure', async () => {
        describe('When projected in shadow dom', async () => {
          it('wraps a .contentWrapperNode for style application and a <dialog role="none"> for top layer paints', async () => {
            const tagString = defineCE(
              class extends HTMLElement {
                constructor() {
                  super();
                  this.attachShadow({ mode: 'open' });
                }

                connectedCallback() {
                  /** @type {ShadowRoot} */
                  (this.shadowRoot).innerHTML = '<slot name="content"></slot>';
                  this.innerHTML = '<div slot="content">projected</div>';
                }
              },
            );

            const el = /** @type {HTMLElement} */ (fixtureSync(`<${tagString}></${tagString}>`));
            const myContentNode = /** @type {HTMLElement} */ (el.querySelector('[slot=content]'));
            const ctrl = new OverlayController({
              ...withGlobalTestConfig(),
              contentNode: myContentNode,
            });

            expect(ctrl.contentNode.assignedSlot?.parentElement).to.equal(ctrl.contentWrapperNode);
            expect(ctrl.contentWrapperNode.parentElement?.tagName).to.equal('DIALOG');

            normalizeOverlayContentWapper(ctrl.contentWrapperNode);

            // The total dom structure created...
            expect(el).shadowDom.to.equal(`
              <dialog data-overlay-outer-wrapper="" open="" role="none" style="${wrappingDialogNodeStyle}">
                <div data-id="content-wrapper">
                  <slot name="content">
                  </slot>
                </div>
              </dialog>
            `);

            expect(el).lightDom.to.equal(`<div slot="content">projected</div>`);
          });
        });

        describe('When in light dom', async () => {
          it('wraps a .contentWrapperNode for style application and a <dialog role="none"> for top layer paints', async () => {
            const el = fixtureSync('<section><div id="content">non projected</div></section>');
            const myContentNode = /** @type {HTMLElement} */ (el.querySelector('#content'));
            const ctrl = new OverlayController({
              ...withGlobalTestConfig(),
              contentNode: myContentNode,
            });
            expect(ctrl.contentNode.parentElement).to.equal(ctrl.contentWrapperNode);
            expect(ctrl.contentWrapperNode.parentElement?.tagName).to.equal('DIALOG');

            normalizeOverlayContentWapper(ctrl.contentWrapperNode);

            // The total dom structure created...
            expect(el).lightDom.to.equal(`
              <dialog data-overlay-outer-wrapper="" open="" role="none" style="${wrappingDialogNodeStyle}">
                <div data-id="content-wrapper">
                  <div id="content">non projected</div>
                </div>
              </dialog>
          `);
          });
        });

        describe('When .contenWrapperNode provided', async () => {
          it('keeps the .contentWrapperNode for style application and wraps a <dialog role="none"> for top layer paints', async () => {
            const tagString = defineCE(
              class extends HTMLElement {
                constructor() {
                  super();
                  this.attachShadow({ mode: 'open' });
                }

                connectedCallback() {
                  /** @type {ShadowRoot} */
                  (this.shadowRoot).innerHTML = '<div><slot name="content"></slot></div>';
                  this.innerHTML = '<div slot="content">projected</div>';
                }
              },
            );

            const el = /** @type {HTMLElement} */ (fixtureSync(`<${tagString}></${tagString}>`));
            const myContentNode = /** @type {HTMLElement} */ (el.querySelector('[slot=content]'));
            const myContentWrapper = /** @type {HTMLElement} */ (
              el.shadowRoot?.querySelector('div')
            );
            const ctrl = new OverlayController({
              ...withGlobalTestConfig(),
              contentNode: myContentNode,
              contentWrapperNode: myContentWrapper,
            });

            normalizeOverlayContentWapper(ctrl.contentWrapperNode);

            // The total dom structure created...
            expect(el).shadowDom.to.equal(`
              <dialog data-overlay-outer-wrapper="" open="" role="none" style="${wrappingDialogNodeStyle}">
                <div data-id="content-wrapper">
                  <slot name="content"></slot>
                </div>
              </dialog>
            `);
          });

          it("uses the .contentWrapperNode as container for Popper's arrow", async () => {
            const tagString = defineCE(
              class extends HTMLElement {
                constructor() {
                  super();
                  this.attachShadow({ mode: 'open' });
                }

                connectedCallback() {
                  /** @type {ShadowRoot} */
                  (this.shadowRoot).innerHTML = `
                    <div>
                      <div id="arrow"></div>
                      <slot name="content"></slot>
                    </div>`;
                  this.innerHTML = '<div slot="content">projected</div>';
                }
              },
            );

            const el = /** @type {HTMLElement} */ (fixtureSync(`<${tagString}></${tagString}>`));
            const myContentNode = /** @type {HTMLElement} */ (el.querySelector('[slot=content]'));
            const myContentWrapper = /** @type {HTMLElement} */ (
              el.shadowRoot?.querySelector('div')
            );
            const ctrl = new OverlayController({
              ...withLocalTestConfig(),
              contentNode: myContentNode,
              contentWrapperNode: myContentWrapper,
            });

            normalizeOverlayContentWapper(ctrl.contentWrapperNode);

            // The total dom structure created...
            expect(el).shadowDom.to.equal(`
              <dialog data-overlay-outer-wrapper="" open="" role="none" style="${wrappingDialogNodeStyle}">
                <div data-id="content-wrapper">
                  <div id="arrow"></div>
                  <slot name="content"></slot>
                </div>
              </dialog>
            `);
          });
        });
      });
    });

    describe('Invoker / Reference', async () => {
      it('accepts a .invokerNode to directly set invoker', async () => {
        const myInvokerNode = /** @type {HTMLElement} */ (fixtureSync('<button>invoke</button>'));
        const ctrl = new OverlayController({
          ...withGlobalTestConfig(),
          invokerNode: myInvokerNode,
        });
        expect(ctrl.invokerNode).to.equal(myInvokerNode);
        expect(ctrl.referenceNode).to.equal(undefined);
      });

      it('accepts a .referenceNode as positioning anchor different from .invokerNode', async () => {
        const myInvokerNode = /** @type {HTMLElement} */ (fixtureSync('<button>invoke</button>'));
        const myReferenceNode = /** @type {HTMLElement} */ (fixtureSync('<div>anchor</div>'));
        const ctrl = new OverlayController({
          ...withGlobalTestConfig(),
          invokerNode: myInvokerNode,
          referenceNode: myReferenceNode,
        });
        expect(ctrl.referenceNode).to.equal(myReferenceNode);
        expect(ctrl.invokerNode).to.not.equal(ctrl.referenceNode);
      });
    });

    describe('Backdrop', () => {
      it('creates a .backdropNode inside <dialog> for guaranteed top layer paints and positioning opportunities', async () => {
        const tagString = defineCE(
          class extends HTMLElement {
            constructor() {
              super();
              this.attachShadow({ mode: 'open' });
            }

            connectedCallback() {
              /** @type {ShadowRoot} */
              (this.shadowRoot).innerHTML = '<slot name="content"></slot>';
              this.innerHTML = '<div slot="content">projected</div>';
            }
          },
        );

        const el = /** @type {HTMLElement} */ (fixtureSync(`<${tagString}></${tagString}>`));
        const myContentNode = /** @type {HTMLElement} */ (el.querySelector('[slot=content]'));

        const ctrl = new OverlayController({
          ...withGlobalTestConfig(),
          contentNode: myContentNode,
          hasBackdrop: true,
        });

        normalizeOverlayContentWapper(ctrl.contentWrapperNode);

        // The total dom structure created...
        expect(el).shadowDom.to.equal(
          `
          <dialog data-overlay-outer-wrapper="" open="" role="none" style="${wrappingDialogNodeStyle}">
            <div class="overlays__backdrop"></div>
            <div data-id="content-wrapper">
              <slot name="content">
              </slot>
            </div>
          </dialog>
        `,
        );
      });
    });

    describe('When contentWrapperNode needs to be provided for correct arrow positioning', () => {
      it('uses contentWrapperNode as provided for local positioning', async () => {
        const el = /** @type {HTMLElement} */ (
          await fixture(html`
            <div id="contentWrapperNode">
              <div id="contentNode"></div>
              <my-arrow></my-arrow>
            </div>
          `)
        );

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
        const contentNode = /** @type {HTMLElement} */ (
          await fixture(html` <div><input id="input1" /><input id="input2" /></div> `)
        );
        const ctrl = new OverlayController({
          ...withGlobalTestConfig(),
          trapsKeyboardFocus: true,
          contentNode,
        });
        await ctrl.show();

        const elOutside = /** @type {HTMLElement} */ (
          await fixture(html`<button>click me</button>`)
        );
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
          trapsKeyboardFocus: false,
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

      it('does not hide when [escape] is pressed with modal <dialog> and "hidesOnEsc" is false', async () => {
        const ctrl = new OverlayController({
          ...withGlobalTestConfig(),
          trapsKeyboardFocus: true,
          hidesOnEsc: false,
        });
        await ctrl.show();
        ctrl.contentNode.dispatchEvent(new KeyboardEvent('keyup', { key: 'Escape' }));
        await aTimeout(0);
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
        mimicClick(document.body);
        await aTimeout(0);
        expect(ctrl.isShown).to.be.false;

        await ctrl.show();
        await mimicClick(document.body, { isAsync: true });
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

        // Don't hide on inside mousedown & outside mouseup
        ctrl.contentNode.dispatchEvent(new MouseEvent('mousedown'));
        await aTimeout(0);
        document.body.dispatchEvent(new MouseEvent('mouseup'));
        await aTimeout(0);
        expect(ctrl.isShown).to.be.true;

        // Important to check if it can be still shown after, because we do some hacks inside
        await ctrl.hide();
        expect(ctrl.isShown).to.be.false;
        await ctrl.show();
        expect(ctrl.isShown).to.be.true;
      });

      it('only hides when both mousedown and mouseup events are outside', async () => {
        const contentNode = /** @type {HTMLElement} */ (await fixture('<div>Content</div>'));
        const ctrl = new OverlayController({
          ...withGlobalTestConfig(),
          hidesOnOutsideClick: true,
          contentNode,
          invokerNode: /** @type {HTMLElement} */ (
            fixtureSync(html`
              <div role="button" style="width: 100px; height: 20px;">Invoker</div>
            `)
          ),
        });
        await ctrl.show();
        mimicClick(document.body, { releaseElement: contentNode });
        await aTimeout(0);
        expect(ctrl.isShown).to.be.true;

        mimicClick(contentNode, { releaseElement: document.body });
        await aTimeout(0);
        expect(ctrl.isShown).to.be.true;

        mimicClick(document.body, {
          releaseElement: /** @type {HTMLElement} */ (ctrl.invokerNode),
        });
        await aTimeout(0);
        expect(ctrl.isShown).to.be.true;

        mimicClick(/** @type {HTMLElement} */ (ctrl.invokerNode), {
          releaseElement: document.body,
        });
        await aTimeout(0);
        expect(ctrl.isShown).to.be.true;

        mimicClick(document.body);
        await aTimeout(0);
        expect(ctrl.isShown).to.be.false;
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
          contentNode: /** @type {HTMLElement} */ (
            await fixture(html`
            <div>
              <div>Content</div>
              <${tag}></${tag}>
            </div>
          `)
          ),
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
        const invokerNode = /** @type {HTMLElement} */ (
          await fixture('<div role="button">Invoker</div>')
        );
        const contentNode = /** @type {HTMLElement} */ (await fixture('<div>Content</div>'));
        const ctrl = new OverlayController({
          ...withLocalTestConfig(),
          hidesOnOutsideClick: true,
          contentNode,
          invokerNode,
        });
        const stopProp = (/** @type {Event} */ e) => e.stopPropagation();
        const dom = await fixture(
          `
          <div>
            <div id="popup">${invokerNode}${contentNode}</div>
            <div id="third-party-noise" @click="${stopProp}" @mousedown="${stopProp}" @mouseup="${stopProp}">
              This element prevents our handlers from reaching the document click handler.
            </div>
          </div>
        `,
        );

        await ctrl.show();
        expect(ctrl.isShown).to.equal(true);

        const noiseEl = /** @type {HTMLElement} */ (dom.querySelector('#third-party-noise'));

        mimicClick(noiseEl);
        await aTimeout(0);
        expect(ctrl.isShown).to.equal(false);

        // Important to check if it can be still shown after, because we do some hacks inside
        await ctrl.show();
        expect(ctrl.isShown).to.equal(true);
      });

      it('works with 3rd party code using "event.stopPropagation()" on capture phase', async () => {
        const invokerNode = /** @type {HTMLElement} */ (
          await fixture(html`<div role="button">Invoker</div>`)
        );
        const contentNode = /** @type {HTMLElement} */ (await fixture('<div>Content</div>'));
        const ctrl = new OverlayController({
          ...withLocalTestConfig(),
          hidesOnOutsideClick: true,
          contentNode,
          invokerNode,
        });
        const stopProp = (/** @type {Event} */ e) => e.stopPropagation();
        const dom = /** @type {HTMLElement} */ (
          await fixture(`
          <div>
            <div id="popup">${invokerNode}${ctrl.content}</div>
            <div id="third-party-noise">
              This element prevents our handlers from reaching the document click handler.
            </div>
          </div>
        `)
        );

        const noiseEl = /** @type {HTMLElement} */ (dom.querySelector('#third-party-noise'));

        noiseEl.addEventListener('click', stopProp, true);
        noiseEl.addEventListener('mousedown', stopProp, true);
        noiseEl.addEventListener('mouseup', stopProp, true);

        await ctrl.show();
        expect(ctrl.isShown).to.equal(true);

        mimicClick(noiseEl);
        await aTimeout(0);
        expect(ctrl.isShown).to.equal(false);

        // Important to check if it can be still shown after, because we do some hacks inside
        await ctrl.show();
        expect(ctrl.isShown).to.equal(true);
      });

      it('doesn\'t hide on "inside label" click', async () => {
        const contentNode = /** @type {HTMLElement} */ (
          await fixture(`
          <div>
            <label for="test">test</label>
            <input id="test">
            Content
          </div>`)
        );
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
        expect(document.activeElement).to.equal(document.body);
      });

      it('supports elementToFocusAfterHide option to focus it when hiding', async () => {
        const input = /** @type {HTMLElement} */ (await fixture('<input />'));
        const contentNode = /** @type {HTMLElement} */ (
          await fixture('<div><textarea></textarea></div>')
        );
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

      it('supports elementToFocusAfterHide option when shadowRoot involved involved', async () => {
        const input = /** @type {HTMLElement} */ (await fixture('<input />'));
        const contentNode = /** @type {HTMLElement} */ (
          await fixture('<div><textarea></textarea></div>')
        );

        const shadowEl = document.createElement('div');
        shadowEl.attachShadow({ mode: 'open' });
        /** @type {ShadowRoot} */ (shadowEl.shadowRoot).innerHTML = `<slot></slot>`;
        shadowEl.appendChild(contentNode);
        document.body.appendChild(shadowEl);

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

        document.body.removeChild(shadowEl);
      });

      it(`only sets focus when outside world didn't take over already`, async () => {
        const input = /** @type {HTMLElement} */ (await fixture('<input />'));
        const outsideButton = /** @type {HTMLButtonElement} */ (await fixture('<button></button>'));
        const contentNode = /** @type {HTMLElement} */ (await fixture('<div>/div>'));
        const ctrl = new OverlayController({
          ...withGlobalTestConfig(),
          elementToFocusAfterHide: input,
          contentNode,
        });

        await ctrl.show();
        // an outside element has taken over focus
        outsideButton.focus();
        expect(document.activeElement).to.equal(outsideButton);

        await ctrl.hide();
        expect(document.activeElement).to.equal(outsideButton);
      });

      it('allows to set elementToFocusAfterHide on show', async () => {
        const input = /** @type {HTMLElement} */ (await fixture('<input />'));
        const contentNode = /** @type {HTMLElement} */ (
          await fixture('<div><textarea></textarea></div>')
        );
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
        expect(Array.from(document.body.classList)).to.contain('overlays-scroll-lock');

        await ctrl.hide();
        expect(Array.from(document.body.classList)).to.not.contain('overlays-scroll-lock');
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
        expect(Array.from(document.body.classList)).to.contain('overlays-scroll-lock');
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
        expect(controllerWithBackdrop.backdropNode).to.have.class('overlays__backdrop');
      });

      it('reenables the backdrop when shown/hidden/shown', async () => {
        const ctrl = new OverlayController({
          ...withGlobalTestConfig(),
          hasBackdrop: true,
        });
        await ctrl.show();
        expect(ctrl.backdropNode).to.have.class('overlays__backdrop');
        await ctrl.hide();
        await ctrl.show();
        expect(ctrl.backdropNode).to.have.class('overlays__backdrop');
      });

      it('adds and stacks backdrops if .hasBackdrop is enabled', async () => {
        const ctrl0 = new OverlayController({
          ...withGlobalTestConfig(),
          hasBackdrop: true,
        });
        await ctrl0.show();
        expect(ctrl0.backdropNode).to.have.class('overlays__backdrop');

        const ctrl1 = new OverlayController({
          ...withGlobalTestConfig(),
          hasBackdrop: false,
        });
        await ctrl1.show();
        expect(ctrl0.backdropNode).to.have.class('overlays__backdrop');
        expect(ctrl1.backdropNode).to.be.undefined;

        const ctrl2 = new OverlayController({
          ...withGlobalTestConfig(),
          hasBackdrop: true,
        });
        await ctrl2.show();

        expect(ctrl0.backdropNode).to.have.class('overlays__backdrop');
        expect(ctrl1.backdropNode).to.be.undefined;
        expect(ctrl2.backdropNode).to.have.class('overlays__backdrop');
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
        expect(ctrl0.__wrappingDialogNode).to.not.be.displayed;
        expect(ctrl1.__wrappingDialogNode).to.not.be.displayed;
        expect(ctrl2.__wrappingDialogNode).to.be.displayed;

        await ctrl3.show();
        await ctrl3._showComplete;
        expect(ctrl3.__wrappingDialogNode).to.be.displayed;

        await ctrl2.hide();
        await ctrl2._hideComplete;
        expect(ctrl0.__wrappingDialogNode).to.be.displayed;
        expect(ctrl1.__wrappingDialogNode).to.be.displayed;

        await ctrl2.show(); // blocking
        expect(ctrl0.__wrappingDialogNode).to.not.be.displayed;
        expect(ctrl1.__wrappingDialogNode).to.not.be.displayed;
        expect(ctrl2.__wrappingDialogNode).to.be.displayed;
        expect(ctrl3.__wrappingDialogNode).to.not.be.displayed;
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

      expect(getComputedStyle(ctrl.content).display).to.equal('block');
      setTimeout(() => {
        hideTransitionFinished();
        setTimeout(() => {
          expect(getComputedStyle(ctrl.content).display).to.equal('none');
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
      expect(ctrl.contentWrapperNode.classList.contains('overlays__overlay-container--center'));
      expect(ctrl.isShown).to.be.true;

      ctrl.updateConfig({ viewportConfig: { placement: 'top-right' } });
      expect(ctrl.contentWrapperNode.classList.contains('overlays__overlay-container--top-right'));
      expect(ctrl.isShown).to.be.true;
    });
  });

  describe('Accessibility', () => {
    it('synchronizes [aria-expanded] on invoker', async () => {
      const invokerNode = /** @type {HTMLElement} */ (
        await fixture('<div role="button">invoker</div>')
      );
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
      const { contentId } = getProtectedMembers(ctrl);
      expect(ctrl.contentNode.id).to.contain(contentId);
    });

    it('preserves content id when present', async () => {
      const contentNode = /** @type {HTMLElement} */ (
        await fixture('<div id="preserved">content</div>')
      );
      const ctrl = new OverlayController({
        ...withLocalTestConfig(),
        handlesAccessibility: true,
        contentNode,
      });
      expect(ctrl.contentNode.id).to.contain('preserved');
    });

    it('adds [role=dialog] on content', async () => {
      const invokerNode = /** @type {HTMLElement} */ (
        await fixture('<div role="button">invoker</div>')
      );
      const ctrl = new OverlayController({
        ...withLocalTestConfig(),
        handlesAccessibility: true,
        invokerNode,
      });
      expect(ctrl.contentNode.getAttribute('role')).to.equal('dialog');
    });

    it('preserves [role] on content when present', async () => {
      const invokerNode = /** @type {HTMLElement} */ (
        await fixture('<div role="button">invoker</div>')
      );
      const contentNode = /** @type {HTMLElement} */ (
        await fixture('<div role="menu">invoker</div>')
      );
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
        throw new Error(/** @type {Error} */ (e).message);
      }
      expect(properlyInstantiated).to.be.true;
    });

    // TODO: check if we covered all functionality. "Inertness" should be handled by the platform with a modal overlay...
    it.skip('adds attributes inert and aria-hidden="true" on all siblings of rootNode if an overlay is shown', async () => {});
    it.skip('disables pointer events and selection on inert elements', async () => {});

    describe('Tooltip', () => {
      it('adds [aria-describedby] on invoker', async () => {
        const invokerNode = /** @type {HTMLElement} */ (
          await fixture('<div role="button">invoker</div>')
        );
        const ctrl = new OverlayController({
          ...withLocalTestConfig(),
          handlesAccessibility: true,
          isTooltip: true,
          invokerNode,
        });
        const { contentId } = getProtectedMembers(ctrl);

        expect(ctrl.invokerNode?.getAttribute('aria-describedby')).to.equal(contentId);
      });

      it('adds [aria-labelledby] on invoker when invokerRelation is label', async () => {
        const invokerNode = /** @type {HTMLElement} */ (
          await fixture('<div role="button">invoker</div>')
        );
        const ctrl = new OverlayController({
          ...withLocalTestConfig(),
          handlesAccessibility: true,
          isTooltip: true,
          invokerRelation: 'label',
          invokerNode,
        });
        const { contentId } = getProtectedMembers(ctrl);

        expect(ctrl.invokerNode?.getAttribute('aria-describedby')).to.equal(null);
        expect(ctrl.invokerNode?.getAttribute('aria-labelledby')).to.equal(contentId);
      });

      it('adds [role=tooltip] on content', async () => {
        const invokerNode = /** @type {HTMLElement} */ (
          await fixture('<div role="button">invoker</div>')
        );
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
          const invokerNode = /** @type {HTMLElement} */ (
            await fixture('<div role="button">invoker</div>')
          );
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
          const invokerNode = /** @type {HTMLElement} */ (
            await fixture('<div role="button">invoker</div>')
          );
          const contentNode = /** @type {HTMLElement} */ (
            await fixture('<div role="presentation">content</div>')
          );
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
          const invokerNode = /** @type {HTMLElement} */ (
            await fixture('<div role="button">invoker</div>')
          );
          const contentNode = /** @type {HTMLElement} */ (
            await fixture('<div role="presentation">content</div>')
          );
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
          const invokerNode = /** @type {HTMLElement} */ (
            await fixture('<div role="button">invoker</div>')
          );
          const contentNode = /** @type {HTMLElement} */ (
            await fixture('<div role="presentation">content</div>')
          );
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
