import { html } from 'lit/static-html.js';
import {
  expect,
  fixture as _fixture,
  unsafeStatic,
  aTimeout,
  defineCE,
  waitUntil,
} from '@open-wc/testing';
import { cache } from 'lit/directives/cache.js';
import { LitElement, nothing } from 'lit';
import { runOverlayMixinSuite } from '../../overlays/test-suites/OverlayMixin.suite.js';
import { resolveSuiteTag } from '../../core/test-helpers/resolveSuiteTag.js';
import { isActiveElement } from '../../core/test-helpers/isActiveElement.js';
import '../test-helpers/test-router.js';
import '@lion/ui/define/lion-dialog.js';
import '@lion/ui/define/lion-tabs.js';
import { isElementVisible } from '../../core/test-helpers/isElementVisible.js';

/* eslint-disable lit-a11y/no-autofocus */

/**
 * @typedef {import('../src/LionDialog.js').LionDialog} LionDialog
 * @typedef {import('lit').TemplateResult} TemplateResult
 */
const fixture = /** @type {(arg: TemplateResult) => Promise<LionDialog>} */ (_fixture);

/**
 * Runs the `lion-dialog` behavioural suite, moved out of `test/lion-dialog.test.js` so a Subclasser can run
 * the same guarantees against its own element. Pass your own tag names to point it at them
 * (see docs/guides/principles/test-suites.md).
 * `tagString`, `klass` and the older role tag keys are deprecated: pass `classes` instead (Lion
 * itself uses `classes` everywhere).
 * @param {{ classes?: Record<string, CustomElementConstructor>, tabsTagString?: string, tagString?: string }} [customConfig]
 */
export function runDialogSuite(customConfig = {}) {
  const cfg = {
    classes: /** @type {Record<string, CustomElementConstructor>} */ ({}),
    tagString: 'lion-dialog',
    ...customConfig,
  };
  cfg.tagString = resolveSuiteTag(cfg.classes.host, cfg.tagString, 'lion-dialog');
  const tag = unsafeStatic(cfg.tagString);
  const tagNameTabs = resolveSuiteTag(cfg.classes.tabs, cfg.tabsTagString, 'lion-tabs');
  const tagTabs = unsafeStatic(tagNameTabs);

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
      const { tagString } = cfg;
      runOverlayMixinSuite({
        tagString,
        tag,
        suffix: ' for lion-dialog',
      });
    });

    describe('Basic', () => {
      it('should show content on invoker click', async () => {
        const el = await fixture(html`
          <${tag}>
            <div slot="content" class="dialog">Hey there</div>
            <button slot="invoker">Popup button</button>
          </${tag}>
        `);
        const invoker = /** @type {HTMLElement} */ (el.querySelector('[slot="invoker"]'));
        invoker.click();
        // @ts-expect-error [allow-protected-in-tests]
        await el._overlayCtrl._showComplete;
        expect(el.opened).to.be.true;
      });

      it('supports nested overlays', async () => {
        const el = await fixture(html`
          <${tag}>
            <div slot="content">
              open nested overlay:
              <${tag}>
                <div slot="content">Nested content</div>
                <button slot="invoker">nested invoker button</button>
              </${tag}>
            </div>
            <button slot="invoker">invoker button</button>
          </${tag}>
        `);

        // @ts-expect-error [allow-protected-in-tests]
        el._overlayInvokerNode.click();
        // @ts-expect-error [allow-protected-in-tests]
        await el._overlayCtrl._showComplete;
        expect(el.opened).to.be.true;

        const nestedDialogEl = /** @type {LionDialog} */ (el.querySelector(cfg.tagString));
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
          <${tag}>
            <button slot="invoker">invoker button</button>
            <div slot="content">
              <label for="myInput">Label</label>
              <input id="myInput" />
            </div>
          </${tag}>
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
          <${tag}>
            <button slot="invoker">invoker button</button>
            <div slot="content">
              <label for="myInput">Label</label>
              <input id="myInput" autofocus />
            </div>
          </${tag}>
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
          <${tag} .config=${{ trapsKeyboardFocus: false }}>
            <button slot="invoker">invoker button</button>
            <div slot="content">
              <label for="myInput">Label</label>
              <input id="myInput" autofocus />
            </div>
          </${tag}>
        `);
        // @ts-expect-error [allow-protected-in-tests]
        const invokerNode = el._overlayInvokerNode;
        invokerNode.focus();
        invokerNode.click();
        expect(isActiveElement(invokerNode)).to.be.true;
      });

      it('opened-changed event should send detail object with opened state', async () => {
        const el = /** @type {LionDialog} */ await fixture(html`
          <${tag} .config=${{ trapsKeyboardFocus: false }}>
            <button slot="invoker">invoker button</button>
            <div slot="content">
              <label for="myInput">Label</label>
              <input id="myInput" autofocus />
            </div>
          </${tag}>
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
          <${tag} .config=${{ trapsKeyboardFocus: false }}>
            <button slot="invoker">invoker button</button>
            <div slot="content">
              <label for="myInput">Label</label>
              <input id="myInput" autofocus />
            </div>
          </${tag}>
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
          <${tag}>
            <button slot="invoker">Invoker</button>
            <div slot="content" class="dialog" aria-label="Dialog">Hey there</div>
          </${tag}>
        `);
        await expect(el).to.be.accessible();
      });

      it('passes a11y audit when opened', async () => {
        const el = await fixture(html`
          <${tag} opened>
            <button slot="invoker">Invoker</button>
            <div slot="content" class="dialog" aria-label="Dialog">Hey there</div>
          </${tag}>
        `);
        // error expected since we put role="none" on the dialog itself, which is valid but not recognized by Axe
        await expect(el).to.be.accessible({ ignoredRules: ['aria-allowed-role'] });
      });

      it('does not add [aria-expanded] to invoker button', async () => {
        const el = await fixture(
          html` <${tag}>
            <div slot="content" class="dialog">Hey there</div>
            <button slot="invoker">Popup button</button>
          </${tag}>`,
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
          html` <${tag}>
            <div slot="content" class="dialog">Hey there</div>
            <button slot="invoker">Popup button</button>
          </${tag}>`,
        );
        const contentNode = /** @type {HTMLElement} */ (el.querySelector('[slot="content"]'));

        expect(contentNode.getAttribute('role')).to.equal('dialog');
      });

      it('has role="alertdialog" by when "is-alert-dialog" is set', async () => {
        const el = await fixture(
          html` <${tag} is-alert-dialog>
            <div slot="content" class="dialog">Hey there</div>
            <button slot="invoker">Popup button</button>
          </${tag}>`,
        );
        const contentNode = /** @type {HTMLElement} */ (el.querySelector('[slot="content"]'));

        expect(contentNode.getAttribute('role')).to.equal('alertdialog');
      });

      it('passes a11y audit when opened and role="alertdialog"', async () => {
        const el = await fixture(html`
          <${tag} opened is-alert-dialog>
            <button slot="invoker">Invoker</button>
            <div slot="content" class="dialog" aria-label="Dialog">Hey there</div>
          </${tag}>
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
                <${tag}>
                  <div slot="content" class="dialog">Hey there</div>
                  <button slot="invoker">Popup button</button>
                </${tag}>
              `,
              b: html` <div>B</div> `,
            }}"
            path="a"
          ></test-router>
        `);

        const getDialog = () =>
          /** @type {LionDialog} */ (el.shadowRoot?.querySelector(cfg.tagString));
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
        const dialog = html` <${tag}>
          <button slot="invoker" class="invoker-button">Click me to open dialog</button>
          <div slot="content" class="demo-dialog-content">
            Hello! You can close this dialog here:
            <button class="close-button" @click="${closeButtonHandler}">⨯</button>
          </div>
        </${tag}>`;

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
              <${tagTabs}>
                <button slot="tab" class="first-button" @click=${() => changeActiveTabIndexRef(0)}>
                  First
                </button>
                <p slot="panel">${cache(this.activeTabIndex === 0 ? dialog : nothing)}</p>
                <button slot="tab" class="second-button" @click=${() => changeActiveTabIndexRef(1)}>
                  Second
                </button>
                <p slot="panel">Info page with lots of information about us.</p>
              </${tagTabs}>
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
          wrapperElementShadowRoot
            ?.querySelector(cfg.tagString)
            ?.shadowRoot?.querySelector('dialog');
        // @ts-ignore
        const isDialogVisible = () => isElementVisible(getDialog());
        const isDialogRendered = () =>
          !!wrapperElement.shadowRoot?.querySelector(cfg.tagString)?.shadowRoot?.childNodes.length;
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
  });
}
