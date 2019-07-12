import { expect, fixture, html, aTimeout, oneEvent } from '@open-wc/testing';
import sinon from 'sinon';
import {
  makeMouseEvent,
  pressEnter,
  pressSpace,
} from '@polymer/iron-test-helpers/mock-interactions.js';

import '../lion-button.js';

function getTopElement(el) {
  const { left, top } = el.getBoundingClientRect();
  // to support elementFromPoint() in polyfilled browsers we have to use document
  const crossBrowserRoot = el.shadowRoot.elementFromPoint ? el.shadowRoot : document;
  return crossBrowserRoot.elementFromPoint(left, top);
}

describe('lion-button', () => {
  it('behaves like native `button` in terms of a11y', async () => {
    const el = await fixture(`<lion-button>foo</lion-button>`);
    expect(el.getAttribute('role')).to.equal('button');
    expect(el.getAttribute('tabindex')).to.equal('0');
  });

  it('has no type by default on the native button', async () => {
    const el = await fixture(`<lion-button>foo</lion-button>`);
    const nativeButton = el.$$slot('_button');
    expect(nativeButton.getAttribute('type')).to.be.null;
  });

  it('has type="submit" on the native button when set', async () => {
    const el = await fixture(`<lion-button type="submit">foo</lion-button>`);
    const nativeButton = el.$$slot('_button');
    expect(nativeButton.getAttribute('type')).to.equal('submit');
  });

  it('hides the native button in the UI', async () => {
    const el = await fixture(`<lion-button>foo</lion-button>`);
    const nativeButton = el.$$slot('_button');
    expect(nativeButton.getAttribute('tabindex')).to.equal('-1');
    expect(window.getComputedStyle(nativeButton).visibility).to.equal('hidden');
  });

  it('can be disabled imperatively', async () => {
    const el = await fixture(`<lion-button disabled>foo</lion-button>`);
    expect(el.getAttribute('tabindex')).to.equal('-1');

    el.disabled = false;
    await el.updateComplete;
    expect(el.getAttribute('tabindex')).to.equal('0');
    expect(el.hasAttribute('disabled')).to.equal(false);

    el.disabled = true;
    await el.updateComplete;
    expect(el.getAttribute('tabindex')).to.equal('-1');
    expect(el.hasAttribute('disabled')).to.equal(true);
  });

  describe('a11y', () => {
    it('has a role="button" by default', async () => {
      const el = await fixture(`<lion-button>foo</lion-button>`);
      expect(el.getAttribute('role')).to.equal('button');
      el.role = 'foo';
      await el.updateComplete;
      expect(el.getAttribute('role')).to.equal('foo');
    });

    it('does not override user provided role', async () => {
      const el = await fixture(`<lion-button role="foo">foo</lion-button>`);
      expect(el.getAttribute('role')).to.equal('foo');
    });

    it('has a tabindex="0" by default', async () => {
      const el = await fixture(`<lion-button>foo</lion-button>`);
      expect(el.getAttribute('tabindex')).to.equal('0');
    });

    it('has a tabindex="-1" when disabled', async () => {
      const el = await fixture(`<lion-button disabled>foo</lion-button>`);
      expect(el.getAttribute('tabindex')).to.equal('-1');
      el.disabled = false;
      await el.updateComplete;
      expect(el.getAttribute('tabindex')).to.equal('0');
      el.disabled = true;
      await el.updateComplete;
      expect(el.getAttribute('tabindex')).to.equal('-1');
    });

    it('does not override user provided tabindex', async () => {
      const el = await fixture(`<lion-button tabindex="5">foo</lion-button>`);
      expect(el.getAttribute('tabindex')).to.equal('5');
    });

    it('disabled does not override user provided tabindex', async () => {
      const el = await fixture(`<lion-button tabindex="5" disabled>foo</lion-button>`);
      expect(el.getAttribute('tabindex')).to.equal('-1');
      el.disabled = false;
      await el.updateComplete;
      expect(el.getAttribute('tabindex')).to.equal('5');
    });
  });

  describe('form integration', () => {
    it('behaves like native `button` when clicked', async () => {
      const formSubmitSpy = sinon.spy(e => e.preventDefault());
      const form = await fixture(html`
        <form @submit="${formSubmitSpy}">
          <lion-button type="submit">foo</lion-button>
        </form>
      `);

      const button = form.querySelector('lion-button');
      getTopElement(button).click();

      expect(formSubmitSpy.called).to.be.true;
    });

    it('behaves like native `button` when interected with keyboard space', async () => {
      const formSubmitSpy = sinon.spy(e => e.preventDefault());
      const form = await fixture(html`
        <form @submit="${formSubmitSpy}">
          <lion-button type="submit">foo</lion-button>
        </form>
      `);

      pressSpace(form.querySelector('lion-button'));
      await aTimeout();
      await aTimeout();

      expect(formSubmitSpy.called).to.be.true;
    });

    it('behaves like native `button` when interected with keyboard enter', async () => {
      const formSubmitSpy = sinon.spy(e => e.preventDefault());
      const form = await fixture(html`
        <form @submit="${formSubmitSpy}">
          <lion-button type="submit">foo</lion-button>
        </form>
      `);

      pressEnter(form.querySelector('lion-button'));
      await aTimeout();
      await aTimeout();

      expect(formSubmitSpy.called).to.be.true;
    });
  });

  describe('click event', () => {
    it('is fired once', async () => {
      const clickSpy = sinon.spy();
      const el = await fixture(
        html`
          <lion-button @click="${clickSpy}"></lion-button>
        `,
      );

      getTopElement(el).click();

      // trying to wait for other possible redispatched events
      await aTimeout();
      await aTimeout();

      expect(clickSpy.callCount).to.equal(1);
    });

    describe('event after redispatching', async () => {
      async function prepareClickEvent(el, host) {
        setTimeout(() => {
          if (host) {
            // click on host like in native button
            makeMouseEvent('click', { x: 11, y: 11 }, el);
          } else {
            // click on click-area which is then redispatched
            makeMouseEvent('click', { x: 11, y: 11 }, getTopElement(el));
          }
        });
        return oneEvent(el, 'click');
      }

      let hostEvent;
      let redispatchedEvent;

      before(async () => {
        const el = await fixture('<lion-button></lion-button>');
        hostEvent = await prepareClickEvent(el, true);
        redispatchedEvent = await prepareClickEvent(el, false);
      });

      const sameProperties = [
        'constructor',
        'composed',
        'bubbles',
        'cancelable',
        'clientX',
        'clientY',
        'target',
      ];

      sameProperties.forEach(property => {
        it(`has same value of the property "${property}"`, async () => {
          expect(redispatchedEvent[property]).to.equal(hostEvent[property]);
        });
      });
    });
  });
});
