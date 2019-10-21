import { expect, fixture, html, aTimeout, oneEvent } from '@open-wc/testing';
import sinon from 'sinon';
import {
  makeMouseEvent,
  pressEnter,
  pressSpace,
  down,
  up,
  keyDownOn,
  keyUpOn,
} from '@polymer/iron-test-helpers/mock-interactions.js';
import { LionButton } from '../src/LionButton.js';

import '../lion-button.js';

function getTopElement(el) {
  const { left, top, width, height } = el.getBoundingClientRect();
  // to support elementFromPoint() in polyfilled browsers we have to use document
  const crossBrowserRoot =
    el.shadowRoot && el.shadowRoot.elementFromPoint ? el.shadowRoot : document;
  return crossBrowserRoot.elementFromPoint(left + width / 2, top + height / 2);
}

let originalIsIE11Method;
function mockIsIE11() {
  originalIsIE11Method = LionButton.__isIE11;
  LionButton.__isIE11 = () => true;
}

function restoreMockIsIE11() {
  LionButton.__isIE11 = originalIsIE11Method;
}

describe('lion-button', () => {
  it('behaves like native `button` in terms of a11y', async () => {
    const el = await fixture(`<lion-button>foo</lion-button>`);
    expect(el.getAttribute('role')).to.equal('button');
    expect(el.getAttribute('tabindex')).to.equal('0');
  });

  it('has .type="submit" and type="submit" by default', async () => {
    const el = await fixture(`<lion-button>foo</lion-button>`);
    expect(el.type).to.equal('submit');
    expect(el.getAttribute('type')).to.be.equal('submit');
    expect(el._nativeButtonNode.type).to.equal('submit');
    expect(el._nativeButtonNode.getAttribute('type')).to.be.equal('submit');
  });

  it('sync type down to the native button', async () => {
    const el = await fixture(`<lion-button type="button">foo</lion-button>`);
    expect(el.type).to.equal('button');
    expect(el.getAttribute('type')).to.be.equal('button');
    expect(el._nativeButtonNode.type).to.equal('button');
    expect(el._nativeButtonNode.getAttribute('type')).to.be.equal('button');
  });

  it('hides the native button in the UI', async () => {
    const el = await fixture(`<lion-button>foo</lion-button>`);
    expect(el._nativeButtonNode.getAttribute('tabindex')).to.equal('-1');
    // TODO: If we abstract to an srOnlyMixin, we should test that the styling equals that of the srOnlyMixin output
    expect(window.getComputedStyle(el._nativeButtonNode).clip).to.equal('rect(0px, 0px, 0px, 0px)');
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

  describe('active', () => {
    it('updates "active" attribute on host when mousedown/mouseup on button', async () => {
      const el = await fixture(`<lion-button>foo</lion-button>`);
      const topEl = getTopElement(el);

      down(topEl);
      expect(el.active).to.be.true;
      await el.updateComplete;
      expect(el.hasAttribute('active')).to.be.true;

      up(topEl);
      expect(el.active).to.be.false;
      await el.updateComplete;
      expect(el.hasAttribute('active')).to.be.false;
    });

    it('updates "active" attribute on host when mousedown on button and mouseup anywhere else', async () => {
      const el = await fixture(`<lion-button>foo</lion-button>`);
      const topEl = getTopElement(el);

      down(topEl);
      expect(el.active).to.be.true;
      await el.updateComplete;
      expect(el.hasAttribute('active')).to.be.true;

      up(document.body);
      expect(el.active).to.be.false;
      await el.updateComplete;
      expect(el.hasAttribute('active')).to.be.false;
    });

    it('updates "active" attribute on host when space keydown/keyup on button', async () => {
      const el = await fixture(`<lion-button>foo</lion-button>`);
      const topEl = getTopElement(el);

      keyDownOn(topEl, 32);
      expect(el.active).to.be.true;
      await el.updateComplete;
      expect(el.hasAttribute('active')).to.be.true;

      keyUpOn(topEl, 32);
      expect(el.active).to.be.false;
      await el.updateComplete;
      expect(el.hasAttribute('active')).to.be.false;
    });

    it('updates "active" attribute on host when space keydown on button and space keyup anywhere else', async () => {
      const el = await fixture(`<lion-button>foo</lion-button>`);
      const topEl = getTopElement(el);

      keyDownOn(topEl, 32);
      expect(el.active).to.be.true;
      await el.updateComplete;
      expect(el.hasAttribute('active')).to.be.true;

      keyUpOn(document.body, 32);
      expect(el.active).to.be.false;
      await el.updateComplete;
      expect(el.hasAttribute('active')).to.be.false;
    });

    it('updates "active" attribute on host when enter keydown/keyup on button', async () => {
      const el = await fixture(`<lion-button>foo</lion-button>`);
      const topEl = getTopElement(el);

      keyDownOn(topEl, 13);
      expect(el.active).to.be.true;
      await el.updateComplete;
      expect(el.hasAttribute('active')).to.be.true;

      keyUpOn(topEl, 13);
      expect(el.active).to.be.false;
      await el.updateComplete;
      expect(el.hasAttribute('active')).to.be.false;
    });

    it('updates "active" attribute on host when enter keydown on button and space keyup anywhere else', async () => {
      const el = await fixture(`<lion-button>foo</lion-button>`);
      const topEl = getTopElement(el);

      keyDownOn(topEl, 13);
      expect(el.active).to.be.true;
      await el.updateComplete;
      expect(el.hasAttribute('active')).to.be.true;

      keyUpOn(document.body, 13);
      expect(el.active).to.be.false;
      await el.updateComplete;
      expect(el.hasAttribute('active')).to.be.false;
    });
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

    it('has an aria-labelledby and wrapper element in IE11', async () => {
      mockIsIE11();
      const el = await fixture(`<lion-button>foo</lion-button>`);
      expect(el.hasAttribute('aria-labelledby')).to.be.true;
      const wrapperId = el.getAttribute('aria-labelledby');
      expect(el.shadowRoot.querySelector(`#${wrapperId}`)).to.exist;
      expect(el.shadowRoot.querySelector(`#${wrapperId}`)).dom.to.equal(
        `<div id="${wrapperId}"><slot></slot></div>`,
      );
      restoreMockIsIE11();
    });
  });

  describe('form integration', () => {
    describe('with submit event', () => {
      it('behaves like native `button` when clicked', async () => {
        const formSubmitSpy = sinon.spy(e => e.preventDefault());
        const form = await fixture(html`
          <form @submit="${formSubmitSpy}">
            <lion-button type="submit">foo</lion-button>
          </form>
        `);

        const button = form.querySelector('lion-button');
        getTopElement(button).click();

        expect(formSubmitSpy.callCount).to.equal(1);
      });

      it('behaves like native `button` when interacted with keyboard space', async () => {
        const formSubmitSpy = sinon.spy(e => e.preventDefault());
        const form = await fixture(html`
          <form @submit="${formSubmitSpy}">
            <lion-button type="submit">foo</lion-button>
          </form>
        `);

        pressSpace(form.querySelector('lion-button'));
        await aTimeout();
        await aTimeout();

        expect(formSubmitSpy.callCount).to.equal(1);
      });

      it('behaves like native `button` when interacted with keyboard enter', async () => {
        const formSubmitSpy = sinon.spy(e => e.preventDefault());
        const form = await fixture(html`
          <form @submit="${formSubmitSpy}">
            <lion-button type="submit">foo</lion-button>
          </form>
        `);

        pressEnter(form.querySelector('lion-button'));
        await aTimeout();
        await aTimeout();

        expect(formSubmitSpy.callCount).to.equal(1);
      });

      it('supports resetting form inputs in a native form', async () => {
        const form = await fixture(html`
          <form>
            <input name="firstName" />
            <input name="lastName" />
            <lion-button type="reset">reset</lion-button>
          </form>
        `);
        const btn = form.querySelector('lion-button');
        const firstName = form.querySelector('input[name=firstName]');
        const lastName = form.querySelector('input[name=lastName]');
        firstName.value = 'Foo';
        lastName.value = 'Bar';

        expect(firstName.value).to.equal('Foo');
        expect(lastName.value).to.equal('Bar');

        btn.click();

        expect(firstName.value).to.be.empty;
        expect(lastName.value).to.be.empty;
      });

      // input "enter" keypress mock doesn't seem to work right now, but should be tested in the future (maybe with Selenium)
      it.skip('works with implicit form submission on-enter inside an input', async () => {
        const formSubmitSpy = sinon.spy(e => e.preventDefault());
        const form = await fixture(html`
          <form @submit="${formSubmitSpy}">
            <input name="foo" />
            <input name="foo2" />
            <lion-button type="submit">foo</lion-button>
          </form>
        `);

        pressEnter(form.querySelector('input[name="foo2"]'));
        await aTimeout();
        await aTimeout();

        expect(formSubmitSpy.callCount).to.equal(1);
      });
    });

    describe('with click event', () => {
      it('behaves like native `button` when clicked', async () => {
        const formButtonClickedSpy = sinon.spy();
        const form = await fixture(html`
          <form @submit=${ev => ev.preventDefault()}>
            <lion-button @click="${formButtonClickedSpy}" type="submit">foo</lion-button>
          </form>
        `);

        const button = form.querySelector('lion-button');
        getTopElement(button).click();

        expect(formButtonClickedSpy.callCount).to.equal(1);
      });

      it('behaves like native `button` when interacted with keyboard space', async () => {
        const formButtonClickedSpy = sinon.spy();
        const form = await fixture(html`
          <form @submit=${ev => ev.preventDefault()}>
            <lion-button @click="${formButtonClickedSpy}" type="submit">foo</lion-button>
          </form>
        `);

        pressSpace(form.querySelector('lion-button'));
        await aTimeout();
        await aTimeout();

        expect(formButtonClickedSpy.callCount).to.equal(1);
      });

      it('behaves like native `button` when interacted with keyboard enter', async () => {
        const formButtonClickedSpy = sinon.spy();
        const form = await fixture(html`
          <form @submit=${ev => ev.preventDefault()}>
            <lion-button @click="${formButtonClickedSpy}" type="submit">foo</lion-button>
          </form>
        `);

        pressEnter(form.querySelector('lion-button'));
        await aTimeout();
        await aTimeout();

        expect(formButtonClickedSpy.callCount).to.equal(1);
      });

      // input "enter" keypress mock doesn't seem to work right now, but should be tested in the future (maybe with Selenium)
      it.skip('works with implicit form submission on-enter inside an input', async () => {
        const formButtonClickedSpy = sinon.spy();
        const form = await fixture(html`
          <form @submit=${ev => ev.preventDefault()}>
            <input name="foo" />
            <input name="foo2" />
            <lion-button @click="${formButtonClickedSpy}" type="submit">foo</lion-button>
          </form>
        `);

        pressEnter(form.querySelector('input[name="foo2"]'));
        await aTimeout();
        await aTimeout();

        expect(formButtonClickedSpy.callCount).to.equal(1);
      });
    });
  });

  describe('click event', () => {
    it('is fired once', async () => {
      const clickSpy = sinon.spy();
      const el = await fixture(
        html`
          <lion-button @click="${clickSpy}">foo</lion-button>
        `,
      );

      getTopElement(el).click();

      // trying to wait for other possible redispatched events
      await aTimeout();
      await aTimeout();

      expect(clickSpy.callCount).to.equal(1);
    });

    describe('native button behavior', async () => {
      async function prepareClickEvent(el) {
        setTimeout(() => {
          makeMouseEvent('click', { x: 11, y: 11 }, getTopElement(el));
        });
        return oneEvent(el, 'click');
      }

      let nativeButtonEvent;
      let lionButtonEvent;

      before(async () => {
        const nativeButtonEl = await fixture('<button>foo</button>');
        const lionButtonEl = await fixture('<lion-button>foo</lion-button>');
        nativeButtonEvent = await prepareClickEvent(nativeButtonEl);
        lionButtonEvent = await prepareClickEvent(lionButtonEl);
      });

      const sameProperties = [
        'constructor',
        'composed',
        'bubbles',
        'cancelable',
        'clientX',
        'clientY',
      ];

      sameProperties.forEach(property => {
        it(`has same value of the property "${property}" as in native button event`, () => {
          expect(lionButtonEvent[property]).to.equal(nativeButtonEvent[property]);
        });
      });

      it('has host in the target property', async () => {
        const el = await fixture('<lion-button>foo</lion-button>');
        const event = await prepareClickEvent(el);
        expect(event.target).to.equal(el);
      });
    });
  });
});
