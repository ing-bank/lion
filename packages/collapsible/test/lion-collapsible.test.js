import { expect, fixture, html } from '@open-wc/testing';

import '../lion-collapsible.js';

const defaultCollapsible = html`
  <lion-collapsible>
    <button slot="invoker">More about cars</button>
    <div slot="content">
      Most definitions of cars say that they run primarily on roads, seat one to eight people, have
      four tires, and mainly transport people rather than goods.
    </div>
  </lion-collapsible>
`;

describe('<lion-collapsible>', () => {
  describe('Collapsible', () => {
    it('sets expanded to false by default', async () => {
      const collapsible = await fixture(defaultCollapsible);
      expect(collapsible.expanded).to.equal(false);
    });

    it('has [expanded] on current expanded invoker which serves as styling hook', async () => {
      const collapsible = await fixture(defaultCollapsible);
      collapsible.expanded = true;
      await collapsible.requestUpdate();
      expect(collapsible).to.have.attribute('expanded');
    });
  });

  /*
  describe('User interaction', () => {
    it('opens a invoker on click', async () => {
      const collapsible = await fixture(defaultCollapsible);
      const invoker = collapsible.querySelector('[slot=invoker]');
      invoker.dispatchEvent(new Event('click'));
      expect(collapsible.expanded).to.equal(true);
    });
  });
  */

  describe('Accessibility', () => {
    it('is a11y AXE accessible', async () => {
      const collapsible = await fixture(defaultCollapsible);
      expect(collapsible).to.be.accessible();
    });

    it('does not make contents focusable', async () => {
      const collapsibleElement = await fixture(defaultCollapsible);
      expect(
        Array.from(collapsibleElement.children).find(child => child.slot === 'content'),
      ).to.not.have.attribute('tabindex');
    });

    describe('Invoker', () => {
      it('links id of content items to invoker via [aria-controls]', async () => {
        const collapsibleElement = await fixture(defaultCollapsible);
        const invoker = collapsibleElement.querySelector('[slot=invoker]');
        const content = collapsibleElement.querySelector('[slot=content]');
        expect(invoker.getAttribute('aria-controls')).to.equal(content.id);
      });

      it('adds aria-expanded="false" to invoker when its content is not expanded', async () => {
        const collapsibleElement = await fixture(defaultCollapsible);
        const invoker = collapsibleElement.querySelector('[slot=invoker]');
        expect(invoker).to.have.attribute('aria-expanded', 'false');
      });

      it('adds aria-expanded="true" to invoker when its content is expanded', async () => {
        const collapsibleElement = await fixture(defaultCollapsible);
        const invoker = collapsibleElement.querySelector('[slot=invoker]');
        collapsibleElement.expanded = true;
        await collapsibleElement.requestUpdate();
        expect(invoker).to.have.attribute('aria-expanded', 'true');
      });
    });

    describe('Contents', () => {
      it('adds aria-labelledby referring to invoker id', async () => {
        const collapsibleElement = await fixture(defaultCollapsible);
        const invoker = collapsibleElement.querySelector('[slot=invoker]');
        const content = collapsibleElement.querySelector('[slot=content]');
        expect(content).to.have.attribute('aria-labelledby', invoker.id);
      });
    });
  });
});
