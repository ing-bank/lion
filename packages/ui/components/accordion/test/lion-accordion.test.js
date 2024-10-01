import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit/static-html.js';
import sinon from 'sinon';

import '@lion/ui/define/lion-accordion.js';

/**
 * @typedef {import('../src/LionAccordion.js').LionAccordion} LionAccordion
 */

const basicAccordion = html`
  <lion-accordion>
    <h2 slot="invoker"><button>invoker 1</button></h2>
    <div slot="content">content 1</div>
    <h2 slot="invoker"><button>invoker 2</button></h2>
    <div slot="content">content 2</div>
    <h2 slot="invoker"><button>invoker 3</button></h2>
    <div slot="content">content 3</div>
  </lion-accordion>
`;

/**
 * @param {Element} el
 */
function getAccordionChildren(el) {
  if (el.shadowRoot) {
    const slot = el.shadowRoot?.querySelector('slot[name=_accordion]');

    return slot && slot instanceof HTMLSlotElement ? slot.assignedElements() : [];
  }

  return [];
}

/**
 * @param {LionAccordion} el
 */
function getInvokers(el) {
  return getAccordionChildren(el).filter(child => child.classList.contains('invoker'));
}

/**
 * @param {LionAccordion} el
 */
function getContents(el) {
  return getAccordionChildren(el).filter(child => child.classList.contains('content'));
}

describe('<lion-accordion>', () => {
  describe('Accordion', () => {
    it('sets expanded to [] by default', async () => {
      const el = /** @type {LionAccordion} */ (await fixture(basicAccordion));
      expect(el.expanded).to.deep.equal([]);
    });

    it('can programmatically set expanded', async () => {
      const el = /** @type {LionAccordion} */ (
        await fixture(html`
          <lion-accordion .expanded=${[1]}>
            <h2 slot="invoker"><button>invoker 1</button></h2>
            <div slot="content">content 1</div>
            <h2 slot="invoker"><button>invoker 2</button></h2>
            <div slot="content">content 2</div>
          </lion-accordion>
        `)
      );
      expect(el.expanded).to.deep.equal([1]);

      expect(
        Array.from(getAccordionChildren(el)).find(
          child => child.className === 'invoker' && child.hasAttribute('expanded'),
        )?.textContent,
      ).to.equal('invoker 2');

      el.expanded = [0];
      expect(
        Array.from(getAccordionChildren(el)).find(
          child => child.className === 'invoker' && child.hasAttribute('expanded'),
        )?.textContent,
      ).to.equal('invoker 1');
    });

    it('updates expanded with a new array when an invoker is clicked', async () => {
      const el = /** @type {LionAccordion} */ (await fixture(basicAccordion));
      const invokers = getInvokers(el);
      const oldExpanded = el.expanded;
      invokers[1].firstElementChild?.dispatchEvent(new Event('click'));
      expect(el.expanded).to.not.equal(oldExpanded);
    });

    it('has [expanded] on current expanded invoker which serves as styling hook', async () => {
      const el = /** @type {LionAccordion} */ (await fixture(basicAccordion));
      const invokers = getInvokers(el);
      el.expanded = [0];
      expect(invokers[0]).to.have.attribute('expanded');
      expect(invokers[1]).to.not.have.attribute('expanded');

      el.expanded = [1];
      expect(invokers[0]).to.not.have.attribute('expanded');
      expect(invokers[1]).to.have.attribute('expanded');
    });

    it('has [expanded] on current expanded invoker first child which serves as styling hook', async () => {
      const el = /** @type {LionAccordion} */ (await fixture(basicAccordion));
      const invokers = getInvokers(el);
      el.expanded = [0];
      expect(invokers[0].firstElementChild).to.have.attribute('expanded');
      expect(invokers[1].firstElementChild).to.not.have.attribute('expanded');

      el.expanded = [1];
      expect(invokers[0].firstElementChild).to.not.have.attribute('expanded');
      expect(invokers[1].firstElementChild).to.have.attribute('expanded');
    });

    it('supports [exclusive] attribute, allowing one collapsible to be open at a time', async () => {
      const el = /** @type {LionAccordion} */ (
        await fixture(html`
          <lion-accordion exclusive>
            <h2 slot="invoker"><button>invoker 1</button></h2>
            <div slot="content">content 1</div>
            <h2 slot="invoker"><button>invoker 2</button></h2>
            <div slot="content">content 2</div>
            <h2 slot="invoker"><button>invoker 3</button></h2>
            <div slot="content">content 3</div>
          </lion-accordion>
        `)
      );

      const invokerButtons = Array.from(getInvokers(el)).map(
        invokerHeadingEl => /** @type {HTMLButtonElement} */ (invokerHeadingEl.firstElementChild),
      );

      // We open the first... (nothing different from not [exclusive] so far)
      invokerButtons[0].click();
      expect(invokerButtons[0]).to.have.attribute('expanded');
      expect(invokerButtons[1]).to.not.have.attribute('expanded');
      expect(invokerButtons[2]).to.not.have.attribute('expanded');

      // We click the second...
      invokerButtons[1].click();
      expect(invokerButtons[0]).to.not.have.attribute('expanded');
      expect(invokerButtons[1]).to.have.attribute('expanded');
      expect(invokerButtons[2]).to.not.have.attribute('expanded');

      // We click the third...
      invokerButtons[2].click();
      expect(invokerButtons[0]).to.not.have.attribute('expanded');
      expect(invokerButtons[1]).to.not.have.attribute('expanded');
      expect(invokerButtons[2]).to.have.attribute('expanded');

      el.exclusive = false;

      // We open the first... (behaving as default (not [exclusive]) again)
      invokerButtons[0].click();
      expect(invokerButtons[0]).to.have.attribute('expanded');
      expect(invokerButtons[1]).to.not.have.attribute('expanded');
      expect(invokerButtons[2]).to.have.attribute('expanded');
    });

    it('sends event "expanded-changed" for every expanded state change', async () => {
      const el = /** @type {LionAccordion} */ (await fixture(basicAccordion));
      const spy = sinon.spy();
      el.addEventListener('expanded-changed', spy);
      el.expanded = [1];
      expect(spy).to.have.been.calledOnce;
    });

    it('logs warning if unequal amount of invokers and contents', async () => {
      const stub = sinon.stub(console, 'warn');
      await fixture(html`
        <lion-accordion>
          <h2 slot="invoker"><button>invoker</button></h2>
          <div slot="content">content 1</div>
          <div slot="content">content 2</div>
        </lion-accordion>
      `);
      expect(stub).to.be.calledOnceWithExactly(
        `The amount of invokers (1) doesn't match the amount of contents (2).`,
      );
      stub.restore();
    });

    it('does not select any elements with slot="invoker" and slot="content" inside slotted elements', async () => {
      const stub = sinon.stub(console, 'warn');
      const el = /** @type {LionAccordion} */ (
        await fixture(html`
          <lion-accordion>
            <h2 slot="invoker">
              <button>invoker 1</button>
              <button slot="invoker">Nested invoker</button>
            </h2>
            <h2 slot="invoker"><button>invoker 2</button></h2>
            <div slot="content">
              content 1
              <p slot="content">Nested content 1</p>
            </div>
            <div slot="content">
              content 2
              <p slot="content">Nested content 2</p>
            </div>
          </lion-accordion>
        `)
      );

      const invokers = Array.from(getInvokers(el));
      const contents = Array.from(getContents(el));

      expect(stub.called).to.be.false;
      expect(invokers.length).to.equal(contents.length);

      stub.restore();
    });
  });

  describe('Accordion navigation', () => {
    it('sets focusedIndex to null by default', async () => {
      const el = /** @type {LionAccordion} */ (await fixture(basicAccordion));
      expect(el.focusedIndex).to.equal(-1);
    });

    it('can programmatically set focusedIndex', async () => {
      const el = /** @type {LionAccordion} */ (
        await fixture(html`
          <lion-accordion .focusedIndex=${1}>
            <h2 slot="invoker"><button>invoker 1</button></h2>
            <div slot="content">content 1</div>
            <h2 slot="invoker"><button>invoker 2</button></h2>
            <div slot="content">content 2</div>
          </lion-accordion>
        `)
      );
      expect(el.focusedIndex).to.equal(1);

      expect(
        Array.from(getInvokers(el)).find(child => child.firstElementChild?.hasAttribute('focused'))
          ?.textContent,
      ).to.equal('invoker 2');

      el.focusedIndex = 0;
      expect(
        Array.from(getInvokers(el)).find(child => child.firstElementChild?.hasAttribute('focused'))
          ?.textContent,
      ).to.equal('invoker 1');
    });

    it('has [focused] on current focused invoker first child which serves as styling hook', async () => {
      const el = /** @type {LionAccordion} */ (await fixture(basicAccordion));
      const invokers = getInvokers(el);
      el.focusedIndex = 0;
      expect(invokers[0]).to.not.have.attribute('focused');
      expect(invokers[1]).to.not.have.attribute('focused');
      expect(invokers[0].firstElementChild).to.have.attribute('focused');
      expect(invokers[1].firstElementChild).to.not.have.attribute('focused');

      el.focusedIndex = 1;
      expect(invokers[0]).to.not.have.attribute('focused');
      expect(invokers[1]).to.not.have.attribute('focused');
      expect(invokers[0].firstElementChild).to.not.have.attribute('focused');
      expect(invokers[1].firstElementChild).to.have.attribute('focused');
    });

    it('sends event "focused-changed" for every focused state change', async () => {
      const el = /** @type {LionAccordion} */ (await fixture(basicAccordion));
      const spy = sinon.spy();
      el.addEventListener('focused-changed', spy);
      el.focusedIndex = 1;
      expect(spy).to.have.been.calledOnce;
    });

    it('tabbing sets the focusedIndex correctly', async () => {
      const el = /** @type {LionAccordion} */ (await fixture(basicAccordion));
      const invokers = getInvokers(el);
      el.focusedIndex = 0;
      expect(el.focusedIndex).to.equal(0);
      invokers[2].firstElementChild?.dispatchEvent(new Event('focusin'));
      expect(el.focusedIndex).to.equal(2);
      invokers[1].firstElementChild?.dispatchEvent(new Event('focusin'));
      expect(el.focusedIndex).to.equal(1);
    });
  });

  describe('Accordion Contents (slot=content)', () => {
    it('are visible when corresponding invoker is expanded', async () => {
      const el = /** @type {LionAccordion} */ (await fixture(basicAccordion));
      el.expanded = [0];

      const contents = getContents(el);

      setTimeout(() => {
        expect(contents[0]).to.be.visible;
        expect(contents[1]).to.be.not.visible;

        el.expanded = [1];

        expect(contents[0]).to.be.not.visible;
        expect(contents[1]).to.be.visible;
      }, 250);
    });

    it.skip('have a DOM structure that allows them to be animated ', async () => {});
  });

  /**
   * We will immediately switch content as all our content comes from light dom.
   *
   * See Note at https://www.w3.org/TR/wai-aria-practices/#keyboard-interaction-19
   * > It is recommended that invokers activate automatically when they receive focus as long as their
   * > associated invoker contents are displayed without noticeable latency. This typically requires invoker
   * > content content to be preloaded.
   */
  describe('User interaction', () => {
    it('opens a invoker on click', async () => {
      const el = /** @type {LionAccordion} */ (await fixture(basicAccordion));
      const invokers = getInvokers(el);
      invokers[1].firstElementChild?.dispatchEvent(new Event('click'));
      expect(el.expanded).to.deep.equal([1]);
    });

    it('selects a invoker on click', async () => {
      const el = /** @type {LionAccordion} */ (await fixture(basicAccordion));
      const invokers = getInvokers(el);
      invokers[1].firstElementChild?.dispatchEvent(new Event('click'));
      expect(el.focusedIndex).to.equal(1);
    });

    it.skip('opens/close invoker on [enter] and [space]', async () => {
      const el = /** @type {LionAccordion} */ (await fixture(basicAccordion));
      const invokers = getInvokers(el);
      invokers[0].firstElementChild?.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter' }));
      expect(el.expanded).to.deep.equal([0]);
      invokers[0].firstElementChild?.dispatchEvent(new KeyboardEvent('keyup', { key: ' ' }));
      expect(el.expanded).to.deep.equal([]);
    });

    it('selects next invoker on [arrow-right] and [arrow-down]', async () => {
      const el = /** @type {LionAccordion} */ (await fixture(basicAccordion));
      const invokers = getInvokers(el);
      el.focusedIndex = 0;
      invokers[0].firstElementChild?.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowRight' }),
      );
      expect(el.focusedIndex).to.equal(1);
      invokers[0].firstElementChild?.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowDown' }),
      );
      expect(el.focusedIndex).to.equal(2);
    });

    it('selects previous invoker on [arrow-left] and [arrow-up]', async () => {
      const el = /** @type {LionAccordion} */ (
        await fixture(html`
          <lion-accordion .focusedIndex=${1}>
            <h2 slot="invoker"><button>invoker 1</button></h2>
            <div slot="content">content 1</div>
            <h2 slot="invoker"><button>invoker 2</button></h2>
            <div slot="content">content 2</div>
            <h2 slot="invoker"><button>invoker 3</button></h2>
            <div slot="content">content 3</div>
          </lion-accordion>
        `)
      );
      const invokers = getInvokers(el);
      el.focusedIndex = 2;
      invokers[2].firstElementChild?.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowLeft' }),
      );
      expect(el.focusedIndex).to.equal(1);
      invokers[1].firstElementChild?.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowUp' }),
      );
      expect(el.focusedIndex).to.equal(0);
    });

    it('selects first invoker on [home]', async () => {
      const el = /** @type {LionAccordion} */ (
        await fixture(html`
          <lion-accordion .focusedIndex=${1}>
            <h2 slot="invoker"><button>invoker 1</button></h2>
            <div slot="content">content 1</div>
            <h2 slot="invoker"><button>invoker 2</button></h2>
            <div slot="content">content 2</div>
          </lion-accordion>
        `)
      );
      const invokers = getInvokers(el);
      invokers[1].firstElementChild?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home' }));
      expect(el.focusedIndex).to.equal(0);
    });

    it('selects last invoker on [end]', async () => {
      const el = /** @type {LionAccordion} */ (await fixture(basicAccordion));
      const invokers = getInvokers(el);
      invokers[0].firstElementChild?.dispatchEvent(new KeyboardEvent('keydown', { key: 'End' }));
      expect(el.focusedIndex).to.equal(2);
    });

    it('stays on last invoker on [arrow-right]', async () => {
      const el = /** @type {LionAccordion} */ (
        await fixture(html`
          <lion-accordion focusedIndex="2">
            <h2 slot="invoker"><button>invoker 1</button></h2>
            <div slot="content">content 1</div>
            <h2 slot="invoker"><button>invoker 2</button></h2>
            <div slot="content">content 2</div>
            <h2 slot="invoker"><button>invoker 3</button></h2>
            <div slot="content">content 3</div>
          </lion-accordion>
        `)
      );
      const invokers = getInvokers(el);
      invokers[2].firstElementChild?.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowRight' }),
      );
      expect(el.focusedIndex).to.equal(2);
    });

    it('stays on first invoker on [arrow-left]', async () => {
      const el = /** @type {LionAccordion} */ (
        await fixture(html`
          <lion-accordion>
            <h2 slot="invoker"><button>invoker 1</button></h2>
            <div slot="content">content 1</div>
            <h2 slot="invoker"><button>invoker 2</button></h2>
            <div slot="content">content 2</div>
            <h2 slot="invoker"><button>invoker 3</button></h2>
            <div slot="content">content 3</div>
          </lion-accordion>
        `)
      );
      const invokers = getInvokers(el);
      invokers[0].firstElementChild?.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowLeft' }),
      );
      expect(el.focusedIndex).to.equal(-1);
    });
  });

  describe('Content distribution', () => {
    it('should work with append children', async () => {
      const el = /** @type {LionAccordion} */ (await fixture(basicAccordion));
      for (let i = 4; i < 6; i += 1) {
        const invoker = document.createElement('h2');
        const button = document.createElement('button');
        invoker.setAttribute('slot', 'invoker');
        button.innerText = `invoker ${i}`;
        invoker.appendChild(button);
        const content = document.createElement('div');
        content.setAttribute('slot', 'content');
        content.innerText = `content ${i}`;
        el.append(invoker);
        el.append(content);
      }
      el.expanded = [4];
      await el.updateComplete;

      expect(
        Array.from(getInvokers(el)).find(child => child.hasAttribute('expanded'))?.textContent,
      ).to.equal('invoker 5');
      expect(
        Array.from(getContents(el)).find(child => child.hasAttribute('expanded'))?.textContent,
      ).to.equal('content 5');
    });

    it('should add order style property to each invoker and content', async () => {
      const el = /** @type {LionAccordion} */ (await fixture(basicAccordion));
      for (let i = 4; i < 6; i += 1) {
        const invoker = document.createElement('h2');
        const button = document.createElement('button');
        invoker.setAttribute('slot', 'invoker');
        button.innerText = `invoker ${i}`;
        invoker.appendChild(button);
        const content = document.createElement('div');
        content.setAttribute('slot', 'content');
        content.innerText = `content ${i}`;
        el.append(invoker);
        el.append(content);
      }
      await el.updateComplete;
      const invokers = /** @type {HTMLElement[]} */ (
        Array.from(el.querySelectorAll('[slot=invoker]'))
      );
      const contents = /** @type {HTMLElement[]} */ (
        Array.from(el.querySelectorAll('[slot=content]'))
      );
      invokers.forEach((invoker, index) => {
        const content = contents[index];
        expect(invoker.style.getPropertyValue('order')).to.equal(`${index + 1}`);
        expect(content.style.getPropertyValue('order')).to.equal(`${index + 1}`);
      });
    });
  });

  describe('Accessibility', () => {
    it('does not make contents focusable', async () => {
      const el = await fixture(html`
        <lion-accordion>
          <h2 slot="invoker"><button>invoker 1</button></h2>
          <div slot="content">content 1</div>
          <h2 slot="invoker"><button>invoker 2</button></h2>
          <div slot="content">content 2</div>
        </lion-accordion>
      `);

      // console.log(getAccordionChildren(el));
      expect(
        Array.from(getAccordionChildren(el)).find(child => child.classList.contains('content')),
      ).to.not.have.attribute('tabindex');
      expect(
        Array.from(getAccordionChildren(el)).find(child => child.classList.contains('content')),
      ).to.not.have.attribute('tabindex');
    });

    describe('Invokers', () => {
      it('links ids of content items to invoker first child via [aria-controls]', async () => {
        const el = /** @type {LionAccordion} */ (
          await fixture(html`
            <lion-accordion>
              <h2 id="h1" slot="invoker"><button>invoker 1</button></h2>
              <div id="p1" slot="content">content 1</div>
              <h2 id="h2" slot="invoker"><button>invoker 2</button></h2>
              <div id="p2" slot="content">content 2</div>
            </lion-accordion>
          `)
        );
        const invokers = getInvokers(el);
        const contents = getContents(el);
        expect(invokers[0].firstElementChild?.getAttribute('aria-controls')).to.equal(
          contents[0].id,
        );
        expect(invokers[1].firstElementChild?.getAttribute('aria-controls')).to.equal(
          contents[1].id,
        );
      });

      it('adds aria-expanded="false" to invoker when its content is not expanded', async () => {
        const el = /** @type {LionAccordion} */ (
          await fixture(html`
            <lion-accordion>
              <h2 slot="invoker"><button>invoker</button></h2>
              <div slot="content">content</div>
            </lion-accordion>
          `)
        );
        expect(Array.from(getInvokers(el))[0]?.firstElementChild).to.have.attribute(
          'aria-expanded',
          'false',
        );
      });

      it('adds aria-expanded="true" to invoker when its content is expanded', async () => {
        const el = /** @type {LionAccordion} */ (
          await fixture(html`
            <lion-accordion>
              <h2 slot="invoker"><button>invoker</button></h2>
              <div slot="content">content</div>
            </lion-accordion>
          `)
        );
        el.expanded = [0];
        expect(Array.from(getInvokers(el))[0]?.firstElementChild).to.have.attribute(
          'aria-expanded',
          'true',
        );
      });
    });

    describe('Contents', () => {
      it('adds aria-labelledby referring to invoker ids', async () => {
        const el = /** @type {LionAccordion} */ (
          await fixture(html`
            <lion-accordion>
              <h2 slot="invoker"><button>invoker 1</button></h2>
              <div slot="content">content 1</div>
              <h2 slot="invoker"><button>invoker 2</button></h2>
              <div slot="content">content 2</div>
            </lion-accordion>
          `)
        );
        const contents = getContents(el);
        const invokers = getInvokers(el);
        expect(contents[0]).to.have.attribute('aria-labelledby', invokers[0].firstElementChild?.id);
        expect(contents[1]).to.have.attribute('aria-labelledby', invokers[1].firstElementChild?.id);
      });
    });
  });
});
