import { expect, fixture, html } from '@open-wc/testing';
import sinon from 'sinon';

/**
 * @typedef {import('../src/LionTabs.js').LionTabs} LionTabs
 */
import '@lion/tabs/define';

const basicTabs = html`
  <lion-tabs>
    <button slot="tab">tab 1</button>
    <div slot="panel">panel 1</div>
    <button slot="tab">tab 2</button>
    <div slot="panel">panel 2</div>
    <button slot="tab">tab 3</button>
    <div slot="panel">panel 3</div>
  </lion-tabs>
`;

describe('<lion-tabs>', () => {
  describe('Tabs', () => {
    it('sets selectedIndex to 0 by default', async () => {
      const el = /** @type {LionTabs} */ (await fixture(basicTabs));
      expect(el.selectedIndex).to.equal(0);
    });

    it('can programmatically set selectedIndex', async () => {
      const el = /** @type {LionTabs} */ (await fixture(html`
        <lion-tabs .selectedIndex=${1}>
          <div slot="tab">tab 1</div>
          <div slot="panel">panel 1</div>
          <div slot="tab">tab 2</div>
          <div slot="panel">panel 2</div>
        </lion-tabs>
      `));
      expect(el.selectedIndex).to.equal(1);
      let selectedTab = /** @type {Element} */ (Array.from(el.children).find(
        child => child.slot === 'tab' && child.hasAttribute('selected'),
      ));
      expect(selectedTab.textContent).to.equal('tab 2');

      el.selectedIndex = 0;
      selectedTab = /** @type {Element} */ (Array.from(el.children).find(
        child => child.slot === 'tab' && child.hasAttribute('selected'),
      ));
      expect(selectedTab.textContent).to.equal('tab 1');
    });

    it('has [selected] on current selected tab which serves as styling hook', async () => {
      const el = /** @type {LionTabs} */ (await fixture(basicTabs));
      const tabs = el.querySelectorAll('[slot=tab]');
      el.selectedIndex = 0;
      expect(tabs[0]).to.have.attribute('selected');
      expect(tabs[1]).to.not.have.attribute('selected');

      el.selectedIndex = 1;
      expect(tabs[0]).to.not.have.attribute('selected');
      expect(tabs[1]).to.have.attribute('selected');
    });

    it('sends event "selected-changed" for every selected state change', async () => {
      const el = /** @type {LionTabs} */ (await fixture(basicTabs));
      const spy = sinon.spy();
      el.addEventListener('selected-changed', spy);
      el.selectedIndex = 1;
      expect(spy).to.have.been.calledOnce;
    });

    it('logs warning if unequal amount of tabs and panels', async () => {
      const stub = sinon.stub(console, 'warn');
      await fixture(html`
        <lion-tabs>
          <button slot="tab">tab</button>
          <div slot="panel">panel 1</div>
          <div slot="panel">panel 2</div>
        </lion-tabs>
      `);
      expect(stub).to.be.calledOnceWithExactly(
        `The amount of tabs (1) doesn't match the amount of panels (2).`,
      );
      stub.restore();
    });

    it('only takes direct children into account', async () => {
      const el = /** @type {LionTabs} */ (await fixture(html`
        <lion-tabs>
          <button slot="tab">tab 1</button>
          <div slot="panel">
            <button slot="tab">nested tab</button>
            <div slot="panel">nested panel</div>
          </div>
          <button slot="tab">tab 2</button>
          <div slot="panel">panel 2</div>
        </lion-tabs>
      `));
      el.selectedIndex = 1;
      const selectedTab = /** @type {Element} */ (Array.from(el.children).find(
        child => child.slot === 'tab' && child.hasAttribute('selected'),
      ));
      expect(selectedTab.textContent).to.equal('tab 2');
    });
  });

  describe('Tabs ([slot=tab])', () => {
    it('adds role=tab', async () => {
      const el = /** @type {LionTabs} */ (await fixture(html`
        <lion-tabs>
          <button slot="tab">tab</button>
          <div slot="panel">panel</div>
        </lion-tabs>
      `));
      expect(Array.from(el.children).find(child => child.slot === 'tab')).to.have.attribute(
        'role',
        'tab',
      );
    });

    /**
     * Not in scope:
     * - has flexible html that allows animations like the material design underline
     */
  });

  describe('Tab Panels (slot=panel)', () => {
    it('are visible when corresponding tab is selected ', async () => {
      const el = /** @type {LionTabs} */ (await fixture(basicTabs));
      const panels = el.querySelectorAll('[slot=panel]');
      el.selectedIndex = 0;
      expect(panels[0]).to.be.visible;
      expect(panels[1]).to.be.not.visible;

      el.selectedIndex = 1;
      expect(panels[0]).to.be.not.visible;
      expect(panels[1]).to.be.visible;
    });

    it.skip('have a DOM structure that allows them to be animated ', async () => {});
  });

  /**
   * We will immediately switch content as all our content comes from light dom.
   *
   * See Note at https://www.w3.org/TR/wai-aria-practices/#keyboard-interaction-19
   * > It is recommended that tabs activate automatically when they receive focus as long as their
   * > associated tab panels are displayed without noticeable latency. This typically requires tab
   * > panel content to be preloaded.
   */
  describe('User interaction', () => {
    it('selects a tab on click', async () => {
      const el = /** @type {LionTabs} */ (await fixture(basicTabs));
      const tabs = el.querySelectorAll('[slot=tab]');
      tabs[1].dispatchEvent(new Event('click'));
      expect(el.selectedIndex).to.equal(1);
    });

    it('selects next tab on [arrow-right] and [arrow-down]', async () => {
      const el = /** @type {LionTabs} */ (await fixture(basicTabs));
      const tabs = el.querySelectorAll('[slot=tab]');
      tabs[0].dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowRight' }));
      expect(el.selectedIndex).to.equal(1);
      tabs[1].dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowDown' }));
      expect(el.selectedIndex).to.equal(2);
    });

    it('selects previous tab on [arrow-left] and [arrow-up]', async () => {
      const el = /** @type {LionTabs} */ (await fixture(html`
        <lion-tabs .selectedIndex=${1}>
          <button slot="tab">tab 1</button>
          <div slot="panel">panel 1</div>
          <button slot="tab">tab 2</button>
          <div slot="panel">panel 2</div>
          <button slot="tab">tab 3</button>
          <div slot="panel">panel 3</div>
        </lion-tabs>
      `));
      const tabs = el.querySelectorAll('[slot=tab]');
      el.selectedIndex = 2;
      tabs[2].dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowLeft' }));
      expect(el.selectedIndex).to.equal(1);
      tabs[1].dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowUp' }));
      expect(el.selectedIndex).to.equal(0);
    });

    it('selects first tab on [home]', async () => {
      const el = /** @type {LionTabs} */ (await fixture(html`
        <lion-tabs .selectedIndex=${1}>
          <button slot="tab">tab 1</button>
          <div slot="panel">panel 1</div>
          <button slot="tab">tab 2</button>
          <div slot="panel">panel 2</div>
        </lion-tabs>
      `));
      const tabs = el.querySelectorAll('[slot=tab]');
      tabs[1].dispatchEvent(new KeyboardEvent('keyup', { key: 'Home' }));
      expect(el.selectedIndex).to.equal(0);
    });

    it('selects last tab on [end]', async () => {
      const el = /** @type {LionTabs} */ (await fixture(basicTabs));
      const tabs = el.querySelectorAll('[slot=tab]');
      tabs[0].dispatchEvent(new KeyboardEvent('keyup', { key: 'End' }));
      expect(el.selectedIndex).to.equal(2);
    });

    it('selects first tab on [arrow-right] if on last tab', async () => {
      const el = /** @type {LionTabs} */ (await fixture(html`
        <lion-tabs .selectedIndex=${2}>
          <button slot="tab">tab 1</button>
          <div slot="panel">panel 1</div>
          <button slot="tab">tab 2</button>
          <div slot="panel">panel 2</div>
          <button slot="tab">tab 3</button>
          <div slot="panel">panel 3</div>
        </lion-tabs>
      `));
      const tabs = el.querySelectorAll('[slot=tab]');
      tabs[2].dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowRight' }));
      expect(el.selectedIndex).to.equal(0);
    });

    it('selects last tab on [arrow-left] if on first tab', async () => {
      const el = /** @type {LionTabs} */ (await fixture(html`
        <lion-tabs>
          <button slot="tab">tab 1</button>
          <div slot="panel">panel 1</div>
          <button slot="tab">tab 2</button>
          <div slot="panel">panel 2</div>
          <button slot="tab">tab 3</button>
          <div slot="panel">panel 3</div>
        </lion-tabs>
      `));
      const tabs = el.querySelectorAll('[slot=tab]');
      tabs[0].dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowLeft' }));
      expect(el.selectedIndex).to.equal(2);
    });
  });

  describe('Content distribution', () => {
    it('should work with append children', async () => {
      const el = /** @type {LionTabs} */ (await fixture(basicTabs));
      const c = 2;
      const n = el.children.length / 2;
      for (let i = n + 1; i < n + c + 1; i += 1) {
        const tab = document.createElement('button');
        tab.setAttribute('slot', 'tab');
        tab.innerText = `tab ${i}`;
        const panel = document.createElement('panel');
        panel.setAttribute('slot', 'panel');
        panel.innerText = `panel ${i}`;
        el.append(tab);
        el.append(panel);
      }
      el.selectedIndex = el.children.length / 2 - 1;
      await el.updateComplete;
      const selectedTab = Array.from(el.children).find(
        child => child.slot === 'tab' && child.hasAttribute('selected'),
      );
      expect(selectedTab && selectedTab.textContent).to.equal('tab 5');

      const selectedPanel = Array.from(el.children).find(
        child => child.slot === 'panel' && child.hasAttribute('selected'),
      );
      expect(selectedPanel && selectedPanel.textContent).to.equal('panel 5');
    });
  });

  describe('Initializing without Focus', () => {
    it('does not focus a tab when setting selectedIndex property', async () => {
      const el = /** @type {LionTabs} */ (await fixture(html`
        <lion-tabs>
          <button slot="tab">tab 1</button>
          <div slot="panel">panel 1</div>
          <button slot="tab">tab 2</button>
          <div slot="panel">panel 2</div>
        </lion-tabs>
      `));

      el.selectedIndex = 1;
      expect(el.querySelector('[slot="tab"]:nth-of-type(2)') === document.activeElement).to.be
        .false;
    });

    it('does not focus a tab on firstUpdate', async () => {
      const el = /** @type {LionTabs} */ (await fixture(html`
        <lion-tabs>
          <button slot="tab">tab 1</button>
          <div slot="panel">panel 1</div>
          <button slot="tab">tab 2</button>
          <div slot="panel">panel 2</div>
        </lion-tabs>
      `));
      const tabs = Array.from(el.children).filter(child => child.slot === 'tab');
      expect(tabs.some(tab => tab === document.activeElement)).to.be.false;
    });

    it('focuses on a tab when setting with _setSelectedIndexWithFocus method', async () => {
      const el = /** @type {LionTabs} */ (await fixture(html`
        <lion-tabs>
          <button slot="tab">tab 1</button>
          <div slot="panel">panel 1</div>
          <button slot="tab">tab 2</button>
          <div slot="panel">panel 2</div>
        </lion-tabs>
      `));

      // @ts-ignore : this el is LionTabs
      el._setSelectedIndexWithFocus(1);
      expect(el.querySelector('[slot="tab"]:nth-of-type(2)') === document.activeElement).to.be.true;
    });
  });

  it('focuses on a tab when the selected tab is changed by user interaction', async () => {
    const el = /** @type {LionTabs} */ (await fixture(html`
      <lion-tabs>
        <button slot="tab">tab 1</button>
        <div slot="panel">panel 1</div>
        <button slot="tab">tab 2</button>
        <div slot="panel">panel 2</div>
      </lion-tabs>
    `));
    const secondTab = /** @type {Element} */ (el.querySelector('[slot="tab"]:nth-of-type(2)'));
    secondTab.dispatchEvent(new MouseEvent('click'));
    expect(secondTab === document.activeElement).to.be.true;
  });

  describe('Accessibility', () => {
    it('does not make panels focusable', async () => {
      const el = /** @type {LionTabs} */ (await fixture(html`
        <lion-tabs>
          <button slot="tab">tab 1</button>
          <div slot="panel">panel 1</div>
          <button slot="tab">tab 2</button>
          <div slot="panel">panel 2</div>
        </lion-tabs>
      `));
      expect(Array.from(el.children).find(child => child.slot === 'panel')).to.not.have.attribute(
        'tabindex',
      );
      expect(Array.from(el.children).find(child => child.slot === 'panel')).to.not.have.attribute(
        'tabindex',
      );
    });

    it('makes selected tab focusable (other tabs are unfocusable)', async () => {
      const el = /** @type {LionTabs} */ (await fixture(html`
        <lion-tabs>
          <button slot="tab">tab 1</button>
          <div slot="panel">panel 1</div>
          <button slot="tab">tab 2</button>
          <div slot="panel">panel 2</div>
          <button slot="tab">tab 3</button>
          <div slot="panel">panel 3</div>
        </lion-tabs>
      `));
      const tabs = el.querySelectorAll('[slot=tab]');
      expect(tabs[0]).to.have.attribute('tabindex', '0');
      expect(tabs[1]).to.have.attribute('tabindex', '-1');
      expect(tabs[2]).to.have.attribute('tabindex', '-1');
    });

    describe('Tabs', () => {
      it('links ids of content items to tab via [aria-controls]', async () => {
        const el = /** @type {LionTabs} */ (await fixture(html`
          <lion-tabs>
            <button id="t1" slot="tab">tab 1</button>
            <div id="p1" slot="panel">panel 1</div>
            <button id="t2" slot="tab">tab 2</button>
            <div id="p2" slot="panel">panel 2</div>
          </lion-tabs>
        `));
        const tabs = el.querySelectorAll('[slot=tab]');
        const panels = el.querySelectorAll('[slot=panel]');
        expect(tabs[0].getAttribute('aria-controls')).to.equal(panels[0].id);
        expect(tabs[1].getAttribute('aria-controls')).to.equal(panels[1].id);
      });

      it('adds aria-selected=“true” to selected tab', async () => {
        const el = /** @type {LionTabs} */ (await fixture(html`
          <lion-tabs>
            <button id="t1" slot="tab">tab 1</button>
            <div id="p1" slot="panel">panel 1</div>
            <button id="t2" slot="tab">tab 2</button>
            <div id="p2" slot="panel">panel 2</div>
            <button id="t3" slot="tab">tab 3</button>
            <div id="p3" slot="panel">panel 3</div>
          </lion-tabs>
        `));

        const tabs = el.querySelectorAll('[slot=tab]');
        expect(tabs[0].getAttribute('aria-selected')).to.equal('true');
        expect(tabs[1].getAttribute('aria-selected')).to.equal('false');
        expect(tabs[2].getAttribute('aria-selected')).to.equal('false');
      });
    });

    describe('panels', () => {
      it('adds role="tabpanel" to panels', async () => {
        const el = /** @type {LionTabs} */ (await fixture(html`
          <lion-tabs>
            <button slot="tab">tab 1</button>
            <div slot="panel">panel 1</div>
            <button slot="tab">tab 2</button>
            <div slot="panel">panel 2</div>
          </lion-tabs>
        `));
        const panels = el.querySelectorAll('[slot=panel]');
        expect(panels[0]).to.have.attribute('role', 'tabpanel');
        expect(panels[1]).to.have.attribute('role', 'tabpanel');
      });

      it('adds aria-labelledby referring to tab ids', async () => {
        const el = /** @type {LionTabs} */ (await fixture(html`
          <lion-tabs>
            <button slot="tab">tab 1</button>
            <div slot="panel">panel 1</div>
            <button slot="tab">tab 2</button>
            <div slot="panel">panel 2</div>
          </lion-tabs>
        `));
        const panels = el.querySelectorAll('[slot=panel]');
        const tabs = el.querySelectorAll('[slot=tab]');
        expect(panels[0]).to.have.attribute('aria-labelledby', tabs[0].id);
        expect(panels[1]).to.have.attribute('aria-labelledby', tabs[1].id);
      });
    });
  });

  /**
   * Not in scope:
   * - allow to delete tabs
   *
   * For extending layer with Design system:
   * - add options for alignment (justify, right, left,center) of tabs
   * - add option for large tabs
   */
});
