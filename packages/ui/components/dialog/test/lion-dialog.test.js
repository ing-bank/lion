/* eslint-disable lit-a11y/no-autofocus */
import {
  expect,
  fixture as _fixture,
  html,
  unsafeStatic,
  aTimeout,
  defineCE,
  waitUntil,
} from '@open-wc/testing';
import sinon from 'sinon';
import { cache } from 'lit/directives/cache.js';
import { LitElement, nothing } from 'lit';
import { runOverlayMixinSuite } from '../../overlays/test-suites/OverlayMixin.suite.js';
import { isActiveElement } from '../../core/test-helpers/isActiveElement.js';
import '../test-helpers/test-router.js';
import '@lion/ui/define/lion-dialog.js';
import '@lion/ui/define/lion-tabs.js';

/**
 * @typedef {import('../src/LionDialog.js').LionDialog} LionDialog
 * @typedef {import('lit').TemplateResult} TemplateResult
 */
const fixture = /** @type {(arg: TemplateResult) => Promise<LionDialog>} */ (_fixture);

describe('lion-dialog', () => {
  // For some reason, globalRootNode is not cleared properly on disconnectedCallback from previous overlay test fixtures...
  // Not sure why this "bug" happens...
  beforeEach(() => {
    const globalRootNode = document.querySelector('.overlays');
    if (globalRootNode) {
      globalRootNode.innerHTML = '';
    }
  });

  describe('Integration tests', () => {
    const tagString = 'lion-dialog';
    const tag = unsafeStatic(tagString);

    runOverlayMixinSuite({
      tagString,
      tag,
      suffix: ' for lion-dialog',
    });
  });

  describe('Basic', () => {
    it('should show content on invoker click', async () => {
      const el = await fixture(html`
        <lion-dialog>
          <div slot="content" class="dialog">Hey there</div>
          <button slot="invoker">Popup button</button>
        </lion-dialog>
      `);
      const invoker = /** @type {HTMLElement} */ (el.querySelector('[slot="invoker"]'));
      invoker.click();
      // @ts-expect-error [allow-protected-in-tests]
      await el._overlayCtrl._showComplete;
      expect(el.opened).to.be.true;
    });

    it('supports nested overlays', async () => {
      const el = await fixture(html`
        <lion-dialog>
          <div slot="content">
            open nested overlay:
            <lion-dialog>
              <div slot="content">Nested content</div>
              <button slot="invoker">nested invoker button</button>
            </lion-dialog>
          </div>
          <button slot="invoker">invoker button</button>
        </lion-dialog>
      `);

      // @ts-expect-error [allow-protected-in-tests]
      el._overlayInvokerNode.click();
      // @ts-expect-error [allow-protected-in-tests]
      await el._overlayCtrl._showComplete;
      expect(el.opened).to.be.true;

      const nestedDialogEl = /** @type {LionDialog} */ (el.querySelector('lion-dialog'));
      // @ts-expect-error you're not allowed to call protected _overlayInvokerNode in public context, but for testing it's okay
      nestedDialogEl?._overlayInvokerNode.click();
      // @ts-expect-error [allow-protected-in-tests]
      await nestedDialogEl._overlayCtrl._showComplete;
      expect(nestedDialogEl.opened).to.be.true;
    });
  });

  describe('focus', () => {
    it('sets focus on contentSlot by default', async () => {
      const el = await fixture(html`
        <lion-dialog>
          <button slot="invoker">invoker button</button>
          <div slot="content">
            <label for="myInput">Label</label>
            <input id="myInput" />
          </div>
        </lion-dialog>
      `);
      // @ts-expect-error [allow-protected-in-tests]
      const invokerNode = el._overlayInvokerNode;
      invokerNode.focus();
      invokerNode.click();
      const contentNode = /** @type {Element} */ (el.querySelector('[slot="content"]'));
      expect(isActiveElement(contentNode)).to.be.true;
    });

    it('sets focus on autofocused element', async () => {
      const el = await fixture(html`
        <lion-dialog>
          <button slot="invoker">invoker button</button>
          <div slot="content">
            <label for="myInput">Label</label>
            <input id="myInput" autofocus />
          </div>
        </lion-dialog>
      `);
      // @ts-expect-error [allow-protected-in-tests]
      const invokerNode = el._overlayInvokerNode;
      invokerNode.focus();
      invokerNode.click();
      const input = /** @type {Element} */ (el.querySelector('input'));
      expect(isActiveElement(input)).to.be.true;
    });

    it('with trapsKeyboardFocus set to false the focus stays on the invoker', async () => {
      const el = /** @type {LionDialog} */ await fixture(html`
        <lion-dialog .config=${{ trapsKeyboardFocus: false }}>
          <button slot="invoker">invoker button</button>
          <div slot="content">
            <label for="myInput">Label</label>
            <input id="myInput" autofocus />
          </div>
        </lion-dialog>
      `);
      // @ts-expect-error [allow-protected-in-tests]
      const invokerNode = el._overlayInvokerNode;
      invokerNode.focus();
      invokerNode.click();
      expect(isActiveElement(invokerNode)).to.be.true;
    });

    it('opened-changed event should send detail object with opened state', async () => {
      const el = /** @type {LionDialog} */ await fixture(html`
        <lion-dialog .config=${{ trapsKeyboardFocus: false }}>
          <button slot="invoker">invoker button</button>
          <div slot="content">
            <label for="myInput">Label</label>
            <input id="myInput" autofocus />
          </div>
        </lion-dialog>
      `);

      el.setAttribute('opened', '');
      expect(el.opened).to.be.true;

      el.addEventListener('opened-changed', e => {
        // @ts-expect-error [allow-detail-since-custom-event]
        expect(e.detail.opened).to.be.false;
      });
      el.removeAttribute('opened');
    });

    it("opened-changed event's target should point to lion-dialog", async () => {
      const el = /** @type {LionDialog} */ await fixture(html`
        <lion-dialog .config=${{ trapsKeyboardFocus: false }}>
          <button slot="invoker">invoker button</button>
          <div slot="content">
            <label for="myInput">Label</label>
            <input id="myInput" autofocus />
          </div>
        </lion-dialog>
      `);

      el.addEventListener('opened-changed', e => {
        expect(e.target).to.equal(el);
      });
      el.setAttribute('opened', '');
    });
  });

  describe('Accessibility', () => {
    it('passes a11y audit', async () => {
      const el = await fixture(html`
        <lion-dialog>
          <button slot="invoker">Invoker</button>
          <div slot="content" class="dialog" aria-label="Dialog">Hey there</div>
        </lion-dialog>
      `);
      await expect(el).to.be.accessible();
    });

    it('passes a11y audit when opened', async () => {
      const el = await fixture(html`
        <lion-dialog opened>
          <button slot="invoker">Invoker</button>
          <div slot="content" class="dialog" aria-label="Dialog">Hey there</div>
        </lion-dialog>
      `);
      // error expected since we put role="none" on the dialog itself, which is valid but not recognized by Axe
      await expect(el).to.be.accessible({ ignoredRules: ['aria-allowed-role'] });
    });

    it('does not add [aria-expanded] to invoker button', async () => {
      const el = await fixture(
        html` <lion-dialog>
          <div slot="content" class="dialog">Hey there</div>
          <button slot="invoker">Popup button</button>
        </lion-dialog>`,
      );
      const invokerButton = /** @type {HTMLElement} */ (el.querySelector('[slot="invoker"]'));

      expect(invokerButton.getAttribute('aria-expanded')).to.equal(null);
      await invokerButton.click();
      await aTimeout(0);
      expect(invokerButton.getAttribute('aria-expanded')).to.equal(null);
      await invokerButton.click();
      await aTimeout(0);
      expect(invokerButton.getAttribute('aria-expanded')).to.equal(null);
    });

    it('has role="dialog" by default', async () => {
      const el = await fixture(
        html` <lion-dialog>
          <div slot="content" class="dialog">Hey there</div>
          <button slot="invoker">Popup button</button>
        </lion-dialog>`,
      );
      const contentNode = /** @type {HTMLElement} */ (el.querySelector('[slot="content"]'));

      expect(contentNode.getAttribute('role')).to.equal('dialog');
    });

    it('has role="alertdialog" by when "is-alert-dialog" is set', async () => {
      const el = await fixture(
        html` <lion-dialog is-alert-dialog>
          <div slot="content" class="dialog">Hey there</div>
          <button slot="invoker">Popup button</button>
        </lion-dialog>`,
      );
      const contentNode = /** @type {HTMLElement} */ (el.querySelector('[slot="content"]'));

      expect(contentNode.getAttribute('role')).to.equal('alertdialog');
    });

    it('passes a11y audit when opened and role="alertdialog"', async () => {
      const el = await fixture(html`
        <lion-dialog opened is-alert-dialog>
          <button slot="invoker">Invoker</button>
          <div slot="content" class="dialog" aria-label="Dialog">Hey there</div>
        </lion-dialog>
      `);
      // error expected since we put role="none" on the dialog itself, which is valid but not recognized by Axe
      await expect(el).to.be.accessible({ ignoredRules: ['aria-allowed-role'] });
    });
  });

  describe('Edge cases', () => {
    it('does not lose click event handler when was detached and reattached', async () => {
      const el = await fixture(html`
        <test-router
          .routingMap="${{
            a: html`
              <lion-dialog>
                <div slot="content" class="dialog">Hey there</div>
                <button slot="invoker">Popup button</button>
              </lion-dialog>
            `,
            b: html` <div>B</div> `,
          }}"
          path="a"
        ></test-router>
      `);

      const getDialog = () =>
        /** @type {LionDialog} */ (el.shadowRoot?.querySelector('lion-dialog'));
      const getInvoker = () =>
        /** @type {HTMLElement} */ (getDialog().querySelector('[slot="invoker"]'));

      getInvoker().click();
      const dialog = getDialog();
      // @ts-expect-error [allow-protected-in-tests]
      await dialog._overlayCtrl._showComplete;
      expect(dialog.opened).to.be.true;

      dialog.close();
      // @ts-expect-error [allow-protected-in-tests]
      await dialog._overlayCtrl._hideComplete;
      expect(dialog.opened).to.be.false;

      const buttonA = /** @type {HTMLElement} */ (el.shadowRoot?.querySelector('#path-a'));
      const buttonB = /** @type {HTMLElement} */ (el.shadowRoot?.querySelector('#path-b'));

      buttonB.click();
      await el.updateComplete;
      buttonA.click();
      await el.updateComplete;
      await el.updateComplete;

      getInvoker().click();

      const dialogAfterRouteChange = getDialog();
      // @ts-expect-error [allow-protected-in-tests]
      expect(dialogAfterRouteChange._overlayCtrl).not.to.be.undefined;
      // @ts-expect-error [allow-protected-in-tests]
      await dialogAfterRouteChange._overlayCtrl._showComplete;
      expect(dialogAfterRouteChange.opened).to.be.true;
    });

    it('should close the popup dialog after rendered from cache', async () => {
      /**
       *
       * @param {Event} e
       * @returns
       */
      const closeButtonHandler = e =>
        e.target?.dispatchEvent(new Event('close-overlay', { bubbles: true }));
      const dialog = html` <lion-dialog>
        <button slot="invoker" class="invoker-button">Click me to open dialog</button>
        <div slot="content" class="demo-dialog-content">
          Hello! You can close this dialog here:
          <button class="close-button" @click="${closeButtonHandler}">⨯</button>
        </div>
      </lion-dialog>`;

      /**
       * Note, inactive tab content is **destroyed** on every tab switch.
       */
      class Wrapper extends LitElement {
        static properties = {
          ...super.properties,
          activeTabIndex: { type: Number },
        };

        constructor() {
          super();
          this.activeTabIndex = 0;
        }

        /**
         * @param {number} index
         */
        changeActiveTabIndex(index) {
          this.activeTabIndex = index;
        }

        render() {
          const changeActiveTabIndexRef = this.changeActiveTabIndex.bind(this);
          return html`
            <lion-tabs>
              <button slot="tab" class="first-button" @click=${() => changeActiveTabIndexRef(0)}>
                First
              </button>
              <p slot="panel">${cache(this.activeTabIndex === 0 ? dialog : nothing)}</p>
              <button slot="tab" class="second-button" @click=${() => changeActiveTabIndexRef(1)}>
                Second
              </button>
              <p slot="panel">Info page with lots of information about us.</p>
            </lion-tabs>
          `;
        }
      }

      const wrapperFixture = /** @type {(arg: TemplateResult) => Promise<Wrapper>} */ (_fixture);
      const tagString = defineCE(Wrapper);
      const wrapperTag = unsafeStatic(tagString);
      const wrapperElement = /** @type {Wrapper} */ (
        await wrapperFixture(html`<${wrapperTag}></${wrapperTag}>`)
      );
      await wrapperElement.updateComplete;
      const wrapperElementShadowRoot = wrapperElement.shadowRoot;
      /**
       * @returns { HTMLElement | null | undefined }
       */
      const getFirstButton = () => wrapperElementShadowRoot?.querySelector('.first-button');
      /**
       * @returns { HTMLElement | null | undefined }
       */
      const getSecondButton = () => wrapperElementShadowRoot?.querySelector('.second-button');
      /**
       * @returns { HTMLElement | null | undefined }
       */
      const getInvokerButton = () => wrapperElementShadowRoot?.querySelector('.invoker-button');
      /**
       * @returns { HTMLElement | null | undefined }
       */
      const getCloseButton = () => wrapperElementShadowRoot?.querySelector('.close-button');
      /**
       * @returns { Element | null | undefined }
       */
      const getDialog = () =>
        wrapperElementShadowRoot?.querySelector('lion-dialog')?.shadowRoot?.querySelector('dialog');
      // @ts-ignore
      const isDialogVisible = () => getDialog()?.checkVisibility() === true;
      const isDialogRendered = () =>
        !!wrapperElement.shadowRoot?.querySelector('lion-dialog')?.shadowRoot?.childNodes.length;
      getInvokerButton()?.click();
      await waitUntil(isDialogVisible);
      getCloseButton()?.click();
      await waitUntil(() => !isDialogVisible());
      getSecondButton()?.click();
      await waitUntil(() => !isDialogRendered());
      getFirstButton()?.click();
      await waitUntil(isDialogRendered);
      getInvokerButton()?.click();
      await waitUntil(isDialogVisible);
      getCloseButton()?.click();
      await waitUntil(() => !isDialogVisible());
      expect(isDialogVisible()).to.equal(false);
    });
  });

  /**
   * The overlay marks its content with `data-open` while it is up. That is shadow-root safe, unlike
   * looking for the native `<dialog>` in the top layer, which the overlay hosts inside a shadow root.
   *
   * @param {LionDialog} el
   */
  const isOpen = el =>
    /** @type {HTMLElement} */ (el.querySelector('[slot="content"]')).hasAttribute('data-open');

  /**
   * Close through the public API and wait until the modal is gone, instead of awaiting an internal
   * promise that may resolve on another render. (Escape is covered by the shared overlay suite.)
   *
   * @param {LionDialog} el
   */
  async function closeModal(el) {
    const invoker = /** @type {HTMLElement} */ (el.querySelector('[slot="invoker"]'));
    invoker.click();
    await waitUntil(() => !isOpen(el), 'the modal is closed');
  }

  describe('focus capture', () => {
    /**
     * The override in `withModalDialogConfig` is `trapsKeyboardFocus: true`: the overlay is opened as a
     * *modal* `<dialog>` (top layer), which is what keeps Tab inside it, and on top of that Lion marks
     * the siblings `inert` + `aria-hidden` so a screen reader does not reach them either.
     *
     * @returns {Promise<{ el: LionDialog, invoker: HTMLElement, sibling: HTMLElement, open: () => Promise<void> }>}
     */
    async function fixtureModal() {
      const el = /** @type {LionDialog} */ (
        await _fixture(html`
          <div>
            <lion-dialog>
              <div slot="content" class="dialog">
                <p>Hey there</p>
                <button type="button" class="inside">Inside</button>
              </div>
              <button slot="invoker">Popup button</button>
            </lion-dialog>
            <button type="button" class="outside">Next</button>
          </div>
        `)
      );
      const invoker = /** @type {HTMLElement} */ (el.querySelector('[slot="invoker"]'));
      const sibling = /** @type {HTMLElement} */ (el.querySelector('.outside'));
      /** @type {() => Promise<void>} */
      const open = async () => {
        invoker.click();
        await waitUntil(() => isOpen(el), 'the modal is open');
      };
      return { el, invoker, sibling, open };
    }

    it('opens as a modal dialog and moves the focus inside it', async () => {
      const { el, open } = await fixtureModal();
      await open();

      const content = /** @type {HTMLElement} */ (el.querySelector('[slot="content"]'));
      expect(content.getAttribute('role'), 'the content is a dialog for a reader').to.equal(
        'dialog',
      );
      // Modality is not expressed with `aria-modal`: the overlay opens the native `<dialog>` as modal
      // (asserted in the test below), so the platform makes the rest of the page unreachable.
      await waitUntil(
        () => el.contains(document.activeElement) || document.activeElement === el,
        'the focus lands inside the dialog',
      );
    });

    it('opens the native modal dialog, which is what captures the focus', async () => {
      const showModal = sinon.spy(HTMLDialogElement.prototype, 'showModal');
      try {
        const { open } = await fixtureModal();
        await open();
        // The trap is the platform's: a `<dialog>` opened with showModal() sits in the top layer, where
        // the browser keeps Tab inside and marks the rest of the page unreachable. Lion deliberately does
        // not add its own `inert`/`aria-hidden` on top of that, so there is nothing to assert there - the
        // mechanism is this call.
        expect(showModal.called).to.equal(true);
      } finally {
        showModal.restore();
      }
    });

    it('gives the focus back to the invoker when the dialog closes', async () => {
      const { el, invoker, open } = await fixtureModal();
      await open();
      await waitUntil(
        () => el.contains(document.activeElement) || document.activeElement === el,
        'the focus lands inside the dialog',
      );

      await closeModal(el);
      expect(document.activeElement).to.equal(invoker);
    });

    it('keeps the focus inside a nested dialog and gives it back to the outer one', async () => {
      const el = await _fixture(html`
        <lion-dialog>
          <div slot="content" class="outer">
            <p>Outer</p>
            <button type="button" class="outer-inside">Outer button</button>
            <lion-dialog>
              <div slot="content" class="inner">
                <button type="button" class="inner-inside">Inner</button>
              </div>
              <button slot="invoker" class="inner-invoker">Open inner</button>
            </lion-dialog>
          </div>
          <button slot="invoker">Open outer</button>
        </lion-dialog>
      `);
      const outerInvoker = /** @type {HTMLElement} */ (
        el.querySelector(':scope > [slot="invoker"]')
      );
      outerInvoker.click();
      // @ts-expect-error [allow-protected-in-tests]
      await el._overlayCtrl._showComplete;

      const innerInvoker = /** @type {HTMLElement} */ (el.querySelector('.inner-invoker'));
      innerInvoker.click();
      const innerDialog = /** @type {LionDialog} */ (el.querySelector('lion-dialog lion-dialog'));
      // @ts-expect-error [allow-protected-in-tests]
      await innerDialog._overlayCtrl._showComplete;
      await waitUntil(
        () =>
          innerDialog.contains(document.activeElement) || document.activeElement === innerDialog,
        'the focus lands inside the inner dialog',
      );

      await closeModal(innerDialog);
      // Capture returns to the inner dialog's invoker - which lives inside the outer dialog - so the user
      // is not left without a focused element, and the outer dialog keeps the capture.
      await waitUntil(
        () => innerInvoker === document.activeElement,
        'the focus is back on the invoker inside the outer dialog',
      );
      expect(el.contains(document.activeElement)).to.equal(true);
    });
  });
});
