import { expect, fixture as _fixture, html } from '@open-wc/testing';

import '../lion-collapsible.js';

/**

 * @typedef {import('../src/LionCollapsible').LionCollapsible} LionCollapsible
 * @typedef {import('lit-html').TemplateResult} TemplateResult
 */
const fixture = /** @type {(arg: TemplateResult) => Promise<LionCollapsible>} */ (_fixture);

const collapsibleTemplate = html`
  <button slot="invoker">More about cars</button>
  <div slot="content">
    Most definitions of cars say that they run primarily on roads, seat one to eight people, have
    four tires, and mainly transport people rather than goods.
  </div>
`;
let isCollapsibleOpen = false;
/** @param {boolean} state */
const collapsibleToggle = state => {
  isCollapsibleOpen = state;
};
const defaultCollapsible = html` <lion-collapsible>${collapsibleTemplate}</lion-collapsible> `;
const collapsibleWithEvents = html`
  <lion-collapsible
    @opened-changed=${/** @param {Event} e */ e =>
      collapsibleToggle(/** @type {LionCollapsible} */ (e.target)?.opened)}
  >
    ${collapsibleTemplate}
  </lion-collapsible>
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
      await collapsible.requestUpdate();
      expect(collapsible).to.have.attribute('opened');
    });

    it('should return content node height before and after collapsing', async () => {
      const collapsible = await fixture(defaultCollapsible);
      expect(collapsible._contentHeight).to.equal('0px');
      collapsible.show();
      await collapsible.requestUpdate();
      expect(collapsible._contentHeight).to.equal('36px');
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
      await collapsible.requestUpdate();
      expect(isCollapsibleOpen).to.equal(true);
      collapsible.hide();
      await collapsible.requestUpdate();
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
        await collapsibleElement.requestUpdate();
        expect(invoker).to.have.attribute('aria-expanded', 'true');
      });
    });

    describe('Contents', () => {
      it('adds aria-labelledby referring to invoker id', async () => {
        const collapsibleElement = await fixture(defaultCollapsible);
        const invoker = collapsibleElement.querySelector('[slot=invoker]');
        const content = collapsibleElement.querySelector('[slot=content]');
        expect(content).to.have.attribute('aria-labelledby', invoker?.id);
      });
    });
  });
});
