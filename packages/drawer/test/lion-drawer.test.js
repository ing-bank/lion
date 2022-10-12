import { expect, fixture as _fixture } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

import '@lion/drawer/define';

/**
 * @typedef {import('../src/LionDrawer').LionDrawer} LionDrawer
 * @typedef {import('@lion/core').TemplateResult} TemplateResult
 */
const fixture = /** @type {(arg: TemplateResult) => Promise<LionDrawer>} */ (_fixture);

const template = html`
  <lion-drawer>
    <button slot="invoker">Open</button>
    <p slot="headline">Headline</p>
    <div slot="content" class="drawer">This is the content of the drawer</div>
    <button slot="bottom-invoker">Open</button>
  </lion-drawer>
`;

describe('<lion-drawer>', () => {
  describe('Drawer', () => {
    it('sets position to "left" by default', async () => {
      const drawer = await fixture(template);
      expect(drawer.position).to.equal('left');
    });

    it('has [position] attribute which serves as styling hook', async () => {
      const drawer = await fixture(template);
      expect(drawer).to.have.attribute('position').equal('left');
    });

    it('sets the minimum and maximum width when position=left', async () => {
      const drawer = await fixture(template);
      const minWidth = getComputedStyle(drawer).getPropertyValue('--min-width');
      const maxWidth = getComputedStyle(drawer).getPropertyValue('--max-width');

      expect(drawer.minWidth).to.equal(minWidth);
      expect(drawer.maxWidth).to.equal(maxWidth);
    });

    it('sets the minimum and maximum width when position=right', async () => {
      const drawer = await fixture(template);
      drawer.position = 'right';
      await drawer.updateComplete;

      const minWidth = getComputedStyle(drawer).getPropertyValue('--min-width');
      const maxWidth = getComputedStyle(drawer).getPropertyValue('--max-width');

      expect(drawer.minWidth).to.equal(minWidth);
      expect(drawer.maxWidth).to.equal(maxWidth);
    });

    it('sets the minimum and maximum height when position=top', async () => {
      const drawer = await fixture(template);
      drawer.position = 'top';
      await drawer.updateComplete;

      const minHeight = getComputedStyle(drawer).getPropertyValue('--min-height');
      const maxHeight = getComputedStyle(drawer).getPropertyValue('--max-height');

      expect(drawer.minHeight).to.equal(minHeight);
      expect(drawer.maxHeight).to.equal(maxHeight);
    });
  });

  describe('User interaction', () => {
    it('opens when bottom invoker is clicked', async () => {
      const drawer = await fixture(template);
      const invoker = drawer.querySelector('[slot="bottom-invoker"]');
      invoker?.dispatchEvent(new Event('click'));
      expect(drawer.opened).to.equal(true);
    });
  });

  describe('Accessibility', () => {
    it('[collapsed] is a11y AXE accessible', async () => {
      const drawer = await fixture(template);
      await expect(drawer).to.be.accessible();
    });

    it('[opened] is a11y AXE accessible', async () => {
      const drawer = await fixture(template);
      drawer.opened = true;
      await expect(drawer).to.be.accessible();
    });

    describe('Invoker', () => {
      it('links id of content items to invoker via [aria-controls]', async () => {
        const drawerElement = await fixture(template);
        const invoker = drawerElement.querySelector('[slot=invoker]');
        const content = drawerElement.querySelector('[slot=content]');
        expect(invoker?.getAttribute('aria-controls')).to.equal(content?.id);
      });

      it('links id of content items to bottom-invoker via [aria-controls]', async () => {
        const collapsibleElement = await fixture(template);
        const invoker = collapsibleElement.querySelector('[slot="bottom-invoker"]');
        const content = collapsibleElement.querySelector('[slot=content]');
        expect(invoker?.getAttribute('aria-controls')).to.equal(content?.id);
      });

      it('links id of content items to bottom-invoker via [aria-controls]', async () => {
        const drawerElement = await fixture(template);
        const invoker = drawerElement.querySelector('[slot="bottom-invoker"]');
        const content = drawerElement.querySelector('[slot=content]');
        expect(invoker?.getAttribute('aria-controls')).to.equal(content?.id);
      });

      it('adds aria-expanded="false" to invoker when its content is not expanded', async () => {
        const drawerElement = await fixture(template);
        const invoker = drawerElement.querySelector('[slot=invoker]');
        expect(invoker).to.have.attribute('aria-expanded', 'false');
      });

      it('adds aria-expanded="true" to invoker when its content is expanded', async () => {
        const drawerElement = await fixture(template);
        const invoker = drawerElement.querySelector('[slot=invoker]');
        drawerElement.opened = true;
        await drawerElement.updateComplete;
        expect(invoker).to.have.attribute('aria-expanded', 'true');
      });

      it('adds aria-expanded="false" to bottom-invoker when its content is not expanded', async () => {
        const drawerElement = await fixture(template);
        const invoker = drawerElement.querySelector('[slot="bottom-invoker"]');
        expect(invoker).to.have.attribute('aria-expanded', 'false');
      });

      it('adds aria-expanded="true" to bottom-invoker when its content is expanded', async () => {
        const drawerElement = await fixture(template);
        const invoker = drawerElement.querySelector('[slot="bottom-invoker"]');
        drawerElement.opened = true;
        await drawerElement.updateComplete;
        expect(invoker).to.have.attribute('aria-expanded', 'true');
      });
    });

    describe('Contents', () => {
      it('adds aria-labelledby referring to invoker id', async () => {
        const drawerElement = await fixture(template);
        const invoker = drawerElement.querySelector('[slot=invoker]');
        const content = drawerElement.querySelector('[slot=content]');
        expect(content).to.have.attribute('aria-labelledby', invoker?.id);
      });
    });
  });
});
