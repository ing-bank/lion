import { html } from 'lit/static-html.js';
import { LionButton } from '@lion/ui/button.js';
import { unsafeStatic, defineCE, expect, fixture } from '@open-wc/testing';
import { LionSelectInvoker } from '@lion/ui/select-rich.js';
import { resolveSuiteTag } from '../../core/test-helpers/resolveSuiteTag.js';

/**
 * @typedef {import('@lion/ui/types/test-suites.js').SuiteElement} SuiteElement
 * @typedef {import('../../listbox/src/LionOption.js').LionOption} LionOption
 */

/**
 * Runs the `lion-select-invoker` behavioural suite, moved out of `test/lion-select-invoker.test.js` so a Subclasser can run
 * the same guarantees against its own element. Pass `tagString` to point it at your registered
 * tag; see docs/guides/principles/test-suites.md.
 * `tagString`, `klass` and the older role tag keys are deprecated: pass `classes` instead (Lion
 * itself uses `classes` everywhere).
 * @param {import('@lion/ui/types/test-suites.js').SuiteConfig<{host: SuiteElement}, {
 *   configureSelectedElement?: (option: LionOption, scenario: 'children'|'text') => void;
 *   assertSelectedContent?: (invoker: LionSelectInvoker, scenario: 'children'|'text') => void;
 *   getAfterElement?: (invoker: LionSelectInvoker) => Element|null;
 * }>} [customConfig]
 */
export function runSelectInvokerSuite({
  classes: { host = LionSelectInvoker } = {},
  tagString: legacyTagString,
  configureSelectedElement = () => {},
  assertSelectedContent = (invoker, scenario) => {
    if (scenario === 'text') {
      expect(invoker._contentWrapperNode).lightDom.to.equal('just textContent');
    } else {
      expect(invoker._contentWrapperNode).lightDom.to.equal('Textnode<h2>I am</h2><p>2 lines</p>', {
        ignoreAttributes: ['class'],
      });
    }
  },
  getAfterElement = invoker => invoker.shadowRoot?.querySelector('slot[name="after"]') ?? null,
} = {}) {
  const tag = unsafeStatic(resolveSuiteTag(host, legacyTagString));

  describe('lion-select-invoker', () => {
    it('should behave as a button', async () => {
      const el = await fixture(html`<${tag}></${tag}>`);
      expect(el instanceof LionButton).to.be.true;
    });

    it('renders invoker info based on selectedElement child elements', async () => {
      const el = /** @type {LionSelectInvoker} */ (await fixture(html`<${tag}></${tag}>`));
      el.selectedElement = /** @type {LionOption} */ (
        await fixture(`<div class="option">Textnode<h2>I am</h2><p>2 lines</p></div>`)
      );
      configureSelectedElement(el.selectedElement, 'children');
      await el.updateComplete;

      assertSelectedContent(el, 'children');
    });

    it('renders invoker info based on selectedElement textContent', async () => {
      const el = /** @type {LionSelectInvoker} */ (await fixture(html`<${tag}></${tag}>`));
      el.selectedElement = /** @type {LionOption} */ (
        await fixture(`<div class="option">just textContent</div>`)
      );
      configureSelectedElement(el.selectedElement, 'text');
      await el.updateComplete;

      assertSelectedContent(el, 'text');
    });

    it('has tabindex="0"', async () => {
      const el = /** @type {LionSelectInvoker} */ (await fixture(html`<${tag}></${tag}>`));
      expect(el.tabIndex).to.equal(0);
      expect(el.getAttribute('tabindex')).to.equal('0');
    });

    it('should not render after slot when singleOption is true', async () => {
      const el = /** @type {LionSelectInvoker} */ (
        await fixture(html` <${tag} .singleOption="${true}"></${tag}> `)
      );

      expect(getAfterElement(el)).to.not.exist;
    });

    it('should render after slot when singleOption is not true', async () => {
      const el = /** @type {LionSelectInvoker} */ (await fixture(html`<${tag}></${tag}>`));

      expect(getAfterElement(el)).to.exist;
    });

    describe('Subclassers', () => {
      it('supports a custom _contentTemplate', async () => {
        const myTag = defineCE(
          class extends LionSelectInvoker {
            _contentTemplate() {
              if (this.selectedElement && this.selectedElement.textContent === 'cat') {
                return html`cat selected `;
              }
              return `no valid selection`;
            }
          },
        );
        const el = /** @type {LionSelectInvoker} */ (await fixture(`<${myTag}></${myTag}>`));

        el.selectedElement = /** @type {LionOption} */ (
          await fixture(`<div class="option">cat</div>`)
        );
        await el.updateComplete;
        expect(el._contentWrapperNode).lightDom.to.equal('cat selected');

        el.selectedElement = /** @type {LionOption} */ (
          await fixture(`<div class="option">dog</div>`)
        );
        await el.updateComplete;
        expect(el._contentWrapperNode).lightDom.to.equal('no valid selection');
      });
    });
  });
}
