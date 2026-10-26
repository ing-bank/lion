import { expect, fixture as _fixture, unsafeStatic } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import '@lion/ui/define/lion-collapsible.js';
import { resolveSuiteTag } from '../../core/test-helpers/resolveSuiteTag.js';

/**
 * @typedef {import('../src/LionCollapsible.js').LionCollapsible} LionCollapsible
 * @typedef {import('lit').TemplateResult} TemplateResult
 */

/**
 * @param {LionCollapsible} el
 */
function getProtectedMembers(el) {
  return {
    // @ts-ignore
    contentHeight: el._contentHeight,
  };
}

/**
 * Runs the `<lion-collapsible>` behavioural suite. Pass `tagString` to run it against your own
 * registered element (see docs/guides/principles/test-suites.md).
 * @param {{ classes?: Record<string, CustomElementConstructor>, tagString?: string }} [customConfig]
 */
export function runCollapsibleSuite(customConfig = {}) {
  const cfg = {
    classes: /** @type {Record<string, CustomElementConstructor>} */ ({}),
    tagString: 'lion-collapsible',
    ...customConfig,
  };

  cfg.tagString = resolveSuiteTag(cfg.classes.collapsible, cfg.tagString, 'lion-collapsible');
  const tag = unsafeStatic(cfg.tagString);
  const fixture = /** @type {(arg: TemplateResult) => Promise<LionCollapsible>} */ (_fixture);

  const collapsibleTemplate = html`
    <button slot="invoker">More about cars</button>
    <div slot="content" style="font-size: 12px; line-height: 16px; font-family: Arial;">
      Most definitions of cars say that they run primarily on roads, seat one to eight people, have
      four tires, and mainly transport people rather than goods.
    </div>
  `;
  let isCollapsibleOpen = false;
  /** @param {boolean} state */
  const collapsibleToggle = state => {
    isCollapsibleOpen = state;
  };
  const defaultCollapsible = html` <${tag}>${collapsibleTemplate}</${tag}> `;
  const collapsibleWithEvents = html`
    <${tag}
      @opened-changed=${
        /** @param {Event} e */ e =>
          collapsibleToggle(/** @type {LionCollapsible} */ (e.target)?.opened)
      }
    >
      ${collapsibleTemplate}
    </${tag}>
  `;

  describe('<lion-collapsible>', () => {
    describe('Collapsible', () => {
      it('sets opened to false by default', async () => {
        const collapsible = await fixture(defaultCollapsible);
        expect(collapsible.opened).to.equal(false);
      });

      it('has [opened] on current expanded invoker which serves as styling hook', async () => {
        const collapsible = await fixture(defaultCollapsible);
        collapsible.opened = true;
        await collapsible.updateComplete;
        expect(collapsible).to.have.attribute('opened');
      });

      it('should return content node height before and after collapsing', async () => {
        const collapsible = await fixture(defaultCollapsible);
        const collHeight1 = getProtectedMembers(collapsible);
        expect(collHeight1.contentHeight).to.equal('0px');
        collapsible.show();
        await collapsible.updateComplete;
        const collHeight2 = getProtectedMembers(collapsible);
        expect(collHeight2.contentHeight).to.equal('32px');
      });
    });

    describe('User interaction', () => {
      it('opens a invoker on click', async () => {
        const collapsible = await fixture(defaultCollapsible);
        const invoker = collapsible.querySelector('[slot=invoker]');
        invoker?.dispatchEvent(new Event('click'));
        expect(collapsible.opened).to.equal(true);
      });

      it('should toggle the content using `toggle()`', async () => {
        const collapsible = await fixture(defaultCollapsible);
        collapsible.toggle();
        expect(collapsible.opened).to.equal(true);
      });

      it('should expand and collapse the content using `show()` and `hide()`', async () => {
        const collapsible = await fixture(defaultCollapsible);
        collapsible.show();
        expect(collapsible.opened).to.equal(true);
        collapsible.hide();
        expect(collapsible.opened).to.equal(false);
      });

      it('should listen to the open and close state change', async () => {
        const collapsible = await fixture(collapsibleWithEvents);
        collapsible.show();
        await collapsible.updateComplete;
        expect(isCollapsibleOpen).to.equal(true);
        collapsible.hide();
        await collapsible.updateComplete;
        expect(isCollapsibleOpen).to.equal(false);
      });
    });

    describe('Accessibility', () => {
      it('[collapsed] is a11y AXE accessible', async () => {
        const collapsible = await fixture(defaultCollapsible);
        await expect(collapsible).to.be.accessible();
      });

      it('[expanded] is a11y AXE accessible', async () => {
        const collapsible = await fixture(defaultCollapsible);
        collapsible.show();
        await expect(collapsible).to.be.accessible();
      });

      describe('Invoker', () => {
        it('links id of content items to invoker via [aria-controls]', async () => {
          const collapsibleElement = await fixture(defaultCollapsible);
          const invoker = collapsibleElement.querySelector('[slot=invoker]');
          const content = collapsibleElement.querySelector('[slot=content]');
          expect(invoker?.getAttribute('aria-controls')).to.equal(content?.id);
        });

        it('adds aria-expanded="false" to invoker when its content is not expanded', async () => {
          const collapsibleElement = await fixture(defaultCollapsible);
          const invoker = collapsibleElement.querySelector('[slot=invoker]');
          expect(invoker).to.have.attribute('aria-expanded', 'false');
        });

        it('adds aria-expanded="true" to invoker when its content is expanded', async () => {
          const collapsibleElement = await fixture(defaultCollapsible);
          const invoker = collapsibleElement.querySelector('[slot=invoker]');
          collapsibleElement.opened = true;
          await collapsibleElement.updateComplete;
          expect(invoker).to.have.attribute('aria-expanded', 'true');
        });
      });
    });
  });
}
