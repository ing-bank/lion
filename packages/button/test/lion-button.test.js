import { browserDetection } from '@lion/core';
import { aTimeout, expect, fixture, html, oneEvent, unsafeStatic } from '@open-wc/testing';
import sinon from 'sinon';
import '@lion/core/src/differentKeyEventNamesShimIE.js';
import '../lion-button.js';

/**
 * @typedef {import('@lion/button/src/LionButton').LionButton} LionButton
 */

describe('lion-button', () => {
  it('behaves like native `button` in terms of a11y', async () => {
    const el = /** @type {LionButton} */ (await fixture(`<lion-button>foo</lion-button>`));
    expect(el.getAttribute('role')).to.equal('button');
    expect(el.getAttribute('tabindex')).to.equal('0');
  });

  it('has .type="submit" and type="submit" by default', async () => {
    const el = /** @type {LionButton} */ (await fixture(`<lion-button>foo</lion-button>`));
    expect(el.type).to.equal('submit');
    expect(el.getAttribute('type')).to.be.equal('submit');
    expect(el._nativeButtonNode.type).to.equal('submit');
    expect(el._nativeButtonNode.getAttribute('type')).to.be.equal('submit');
  });

  it('sync type down to the native button', async () => {
    const el = /** @type {LionButton} */ (await fixture(
      `<lion-button type="button">foo</lion-button>`,
    ));
    expect(el.type).to.equal('button');
    expect(el.getAttribute('type')).to.be.equal('button');
    expect(el._nativeButtonNode.type).to.equal('button');
    expect(el._nativeButtonNode.getAttribute('type')).to.be.equal('button');
  });

  it('hides the native button in the UI', async () => {
    const el = /** @type {LionButton} */ (await fixture(`<lion-button>foo</lion-button>`));
    expect(el._nativeButtonNode.getAttribute('tabindex')).to.equal('-1');
    expect(window.getComputedStyle(el._nativeButtonNode).clip).to.equal('rect(0px, 0px, 0px, 0px)');
  });

  it('is hidden when attribute hidden is true', async () => {
    const el = /** @type {LionButton} */ (await fixture(`<lion-button hidden>foo</lion-button>`));
    expect(el).not.to.be.displayed;
  });

  it('can be disabled imperatively', async () => {
    const el = /** @type {LionButton} */ (await fixture(`<lion-button disabled>foo</lion-button>`));
    expect(el.getAttribute('tabindex')).to.equal('-1');
    expect(el.getAttribute('aria-disabled')).to.equal('true');

    el.disabled = false;
    await el.updateComplete;
    expect(el.getAttribute('tabindex')).to.equal('0');
    expect(el.getAttribute('aria-disabled')).to.equal('false');
    expect(el.hasAttribute('disabled')).to.equal(false);

    el.disabled = true;
    await el.updateComplete;
    expect(el.getAttribute('tabindex')).to.equal('-1');
    expect(el.getAttribute('aria-disabled')).to.equal('true');
    expect(el.hasAttribute('disabled')).to.equal(true);
  });

  describe('active', () => {
    it('updates "active" attribute on host when mousedown/mouseup on button', async () => {
      const el = /** @type {LionButton} */ (await fixture(`<lion-button>foo</lion-button>`));
      el.dispatchEvent(new Event('mousedown'));

      expect(el.active).to.be.true;
      await el.updateComplete;
      expect(el.hasAttribute('active')).to.be.true;

      el.dispatchEvent(new Event('mouseup'));
      expect(el.active).to.be.false;
      await el.updateComplete;
      expect(el.hasAttribute('active')).to.be.false;
    });

    it('updates "active" attribute on host when mousedown on button and mouseup anywhere else', async () => {
      const el = /** @type {LionButton} */ (await fixture(`<lion-button>foo</lion-button>`));

      el.dispatchEvent(new Event('mousedown'));
      expect(el.active).to.be.true;
      await el.updateComplete;
      expect(el.hasAttribute('active')).to.be.true;

      document.dispatchEvent(new Event('mouseup'));
      expect(el.active).to.be.false;
      await el.updateComplete;
      expect(el.hasAttribute('active')).to.be.false;
    });

    it('updates "active" attribute on host when space keydown/keyup on button', async () => {
      const el = /** @type {LionButton} */ (await fixture(`<lion-button>foo</lion-button>`));

      el.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
      expect(el.active).to.be.true;
      await el.updateComplete;
      expect(el.hasAttribute('active')).to.be.true;

      el.dispatchEvent(new KeyboardEvent('keyup', { key: ' ' }));
      expect(el.active).to.be.false;
      await el.updateComplete;
      expect(el.hasAttribute('active')).to.be.false;
    });

    it('updates "active" attribute on host when space keydown on button and space keyup anywhere else', async () => {
      const el = /** @type {LionButton} */ (await fixture(`<lion-button>foo</lion-button>`));

      el.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
      expect(el.active).to.be.true;
      await el.updateComplete;
      expect(el.hasAttribute('active')).to.be.true;

      el.dispatchEvent(new KeyboardEvent('keyup', { key: ' ' }));
      expect(el.active).to.be.false;
      await el.updateComplete;
      expect(el.hasAttribute('active')).to.be.false;
    });

    it('updates "active" attribute on host when enter keydown/keyup on button', async () => {
      const el = /** @type {LionButton} */ (await fixture(`<lion-button>foo</lion-button>`));

      el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      expect(el.active).to.be.true;
      await el.updateComplete;
      expect(el.hasAttribute('active')).to.be.true;

      el.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter' }));
      expect(el.active).to.be.false;
      await el.updateComplete;
      expect(el.hasAttribute('active')).to.be.false;
    });

    it('updates "active" attribute on host when enter keydown on button and space keyup anywhere else', async () => {
      const el = /** @type {LionButton} */ (await fixture(`<lion-button>foo</lion-button>`));

      el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      expect(el.active).to.be.true;
      await el.updateComplete;
      expect(el.hasAttribute('active')).to.be.true;

      document.body.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter' }));
      expect(el.active).to.be.false;
      await el.updateComplete;
      expect(el.hasAttribute('active')).to.be.false;
    });
  });

  describe('a11y', () => {
    it('has a role="button" by default', async () => {
      const el = /** @type {LionButton} */ (await fixture(`<lion-button>foo</lion-button>`));
      expect(el.getAttribute('role')).to.equal('button');
      el.role = 'foo';
      await el.updateComplete;
      expect(el.getAttribute('role')).to.equal('foo');
    });

    it('does not override user provided role', async () => {
      const el = /** @type {LionButton} */ (await fixture(
        `<lion-button role="foo">foo</lion-button>`,
      ));
      expect(el.getAttribute('role')).to.equal('foo');
    });

    it('has a tabindex="0" by default', async () => {
      const el = /** @type {LionButton} */ (await fixture(`<lion-button>foo</lion-button>`));
      expect(el.getAttribute('tabindex')).to.equal('0');
    });

    it('has a tabindex="-1" when disabled', async () => {
      const el = /** @type {LionButton} */ (await fixture(
        `<lion-button disabled>foo</lion-button>`,
      ));
      expect(el.getAttribute('tabindex')).to.equal('-1');
      el.disabled = false;
      await el.updateComplete;
      expect(el.getAttribute('tabindex')).to.equal('0');
      el.disabled = true;
      await el.updateComplete;
      expect(el.getAttribute('tabindex')).to.equal('-1');
    });

    it('does not override user provided tabindex', async () => {
      const el = /** @type {LionButton} */ (await fixture(
        `<lion-button tabindex="5">foo</lion-button>`,
      ));
      expect(el.getAttribute('tabindex')).to.equal('5');
    });

    it('disabled does not override user provided tabindex', async () => {
      const el = /** @type {LionButton} */ (await fixture(
        `<lion-button tabindex="5" disabled>foo</lion-button>`,
      ));
      expect(el.getAttribute('tabindex')).to.equal('-1');
      el.disabled = false;
      await el.updateComplete;
      expect(el.getAttribute('tabindex')).to.equal('5');
    });

    it('has an aria-labelledby and wrapper element in IE11', async () => {
      const browserDetectionStub = sinon.stub(browserDetection, 'isIE11').value(true);
      const el = /** @type {LionButton} */ (await fixture(`<lion-button>foo</lion-button>`));
      expect(el.hasAttribute('aria-labelledby')).to.be.true;
      const wrapperId = el.getAttribute('aria-labelledby');
      expect(/** @type {ShadowRoot} */ (el.shadowRoot).querySelector(`#${wrapperId}`)).to.exist;
      expect(/** @type {ShadowRoot} */ (el.shadowRoot).querySelector(`#${wrapperId}`)).dom.to.equal(
        `<div class="button-content" id="${wrapperId}"><slot></slot></div>`,
      );
      browserDetectionStub.restore();
    });

    it('does not override aria-labelledby when provided by user', async () => {
      const browserDetectionStub = sinon.stub(browserDetection, 'isIE11').value(true);
      const el = /** @type {LionButton} */ (await fixture(
        `<lion-button aria-labelledby="some-id another-id">foo</lion-button>`,
      ));
      expect(el.getAttribute('aria-labelledby')).to.equal('some-id another-id');
      browserDetectionStub.restore();
    });

    it('has a native button node with aria-hidden set to true', async () => {
      const el = /** @type {LionButton} */ (await fixture('<lion-button></lion-button>'));

      expect(el._nativeButtonNode.getAttribute('aria-hidden')).to.equal('true');
    });

    it('is accessible', async () => {
      const el = /** @type {LionButton} */ (await fixture(`<lion-button>foo</lion-button>`));
      await expect(el).to.be.accessible();
    });

    it('is accessible when disabled', async () => {
      const el = /** @type {LionButton} */ (await fixture(
        `<lion-button disabled>foo</lion-button>`,
      ));
      await expect(el).to.be.accessible({ ignoredRules: ['color-contrast'] });
    });
  });

  describe('form integration', () => {
    describe('with submit event', () => {
      it('behaves like native `button` when clicked', async () => {
        const formSubmitSpy = /** @type {EventListener} */ (sinon.spy(e => e.preventDefault()));
        const form = await fixture(html`
          <form @submit="${formSubmitSpy}">
            <lion-button type="submit">foo</lion-button>
          </form>
        `);
        const button /** @type {LionButton} */ = /** @type {LionButton} */ (form.querySelector(
          'lion-button',
        ));
        button.click();
        expect(formSubmitSpy).to.have.been.calledOnce;
      });

      it('behaves like native `button` when interacted with keyboard space', async () => {
        const formSubmitSpy = /** @type {EventListener} */ (sinon.spy(e => e.preventDefault()));
        const form = await fixture(html`
          <form @submit="${formSubmitSpy}">
            <lion-button type="submit">foo</lion-button>
          </form>
        `);
        const button /** @type {LionButton} */ = /** @type {LionButton} */ (form.querySelector(
          'lion-button',
        ));
        button.dispatchEvent(new KeyboardEvent('keyup', { key: ' ' }));
        await aTimeout(0);
        await aTimeout(0);
        expect(formSubmitSpy).to.have.been.calledOnce;
      });

      it('behaves like native `button` when interacted with keyboard enter', async () => {
        const formSubmitSpy = /** @type {EventListener} */ (sinon.spy(e => e.preventDefault()));
        const form = await fixture(html`
          <form @submit="${formSubmitSpy}">
            <lion-button type="submit">foo</lion-button>
          </form>
        `);

        const button = /** @type {LionButton} */ (form.querySelector('lion-button'));
        button.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter' }));
        await aTimeout(0);
        await aTimeout(0);

        expect(formSubmitSpy).to.have.been.calledOnce;
      });

      it('supports resetting form inputs in a native form', async () => {
        const form = await fixture(html`
          <form>
            <input name="firstName" />
            <input name="lastName" />
            <lion-button type="reset">reset</lion-button>
          </form>
        `);
        const btn /** @type {LionButton} */ = /** @type {LionButton} */ (form.querySelector(
          'lion-button',
        ));
        const firstName = /** @type {HTMLInputElement} */ (form.querySelector(
          'input[name=firstName]',
        ));
        const lastName = /** @type {HTMLInputElement} */ (form.querySelector(
          'input[name=lastName]',
        ));
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
        const formSubmitSpy = /** @type {EventListener} */ (sinon.spy(e => e.preventDefault()));
        const form = await fixture(html`
          <form @submit="${formSubmitSpy}">
            <input name="foo" />
            <input name="foo2" />
            <lion-button type="submit">foo</lion-button>
          </form>
        `);

        const input2 = /** @type {HTMLInputElement} */ (form.querySelector('input[name="foo2"]'));
        input2.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter' }));
        await aTimeout(0);
        await aTimeout(0);

        expect(formSubmitSpy).to.have.been.calledOnce;
      });
    });

    describe('with click event', () => {
      it('behaves like native `button` when clicked', async () => {
        const formButtonClickedSpy = /** @type {EventListener} */ (sinon.spy());
        const form = await fixture(html`
          <form @submit=${/** @type {EventListener} */ ev => ev.preventDefault()}>
            <lion-button @click="${formButtonClickedSpy}" type="submit">foo</lion-button>
          </form>
        `);

        const button = /** @type {LionButton} */ (form.querySelector('lion-button'));
        button.click();

        expect(formButtonClickedSpy).to.have.been.calledOnce;
      });

      it('behaves like native `button` when interacted with keyboard space', async () => {
        const formButtonClickedSpy = /** @type {EventListener} */ (sinon.spy());
        const form = await fixture(html`
          <form @submit=${/** @type {EventListener} */ ev => ev.preventDefault()}>
            <lion-button @click="${formButtonClickedSpy}" type="submit">foo</lion-button>
          </form>
        `);

        /** @type {LionButton} */ form
          .querySelector('lion-button')
          .dispatchEvent(new KeyboardEvent('keyup', { key: ' ' }));
        await aTimeout(0);
        await aTimeout(0);

        expect(formButtonClickedSpy).to.have.been.calledOnce;
      });

      it('behaves like native `button` when interacted with keyboard enter', async () => {
        const formButtonClickedSpy = /** @type {EventListener} */ (sinon.spy());
        const form = await fixture(html`
          <form @submit=${/** @type {EventListener} */ ev => ev.preventDefault()}>
            <lion-button @click="${formButtonClickedSpy}" type="submit">foo</lion-button>
          </form>
        `);

        const button = /** @type {LionButton} */ (form.querySelector('lion-button'));
        button.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter' }));
        await aTimeout(0);
        await aTimeout(0);

        expect(formButtonClickedSpy).to.have.been.calledOnce;
      });

      // input "enter" keypress mock doesn't seem to work right now, but should be tested in the future (maybe with Selenium)
      it.skip('works with implicit form submission on-enter inside an input', async () => {
        const formButtonClickedSpy = /** @type {EventListener} */ (sinon.spy());
        const form = await fixture(html`
          <form @submit=${/** @type {EventListener} */ ev => ev.preventDefault()}>
            <input name="foo" />
            <input name="foo2" />
            <lion-button @click="${formButtonClickedSpy}" type="submit">foo</lion-button>
          </form>
        `);

        const input2 = /** @type {HTMLInputElement} */ (form.querySelector('input[name="foo2"]'));
        input2.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter' }));
        await aTimeout(0);
        await aTimeout(0);

        expect(formButtonClickedSpy).to.have.been.calledOnce;
      });
    });
  });

  describe('click event', () => {
    /**
     * @param {HTMLButtonElement | LionButton} el
     */
    async function prepareClickEvent(el) {
      setTimeout(() => {
        el.click();
      });
      return oneEvent(el, 'click');
    }

    it('is fired once', async () => {
      const clickSpy = /** @type {EventListener} */ (sinon.spy());
      const el = /** @type {LionButton} */ (await fixture(
        html` <lion-button @click="${clickSpy}">foo</lion-button> `,
      ));

      el.click();

      // trying to wait for other possible redispatched events
      await aTimeout(0);
      await aTimeout(0);

      expect(clickSpy).to.have.been.calledOnce;
    });

    it('is fired one inside a form', async () => {
      const formClickSpy = /** @type {EventListener} */ (sinon.spy(e => e.preventDefault()));
      const el = /** @type {HTMLFormElement} */ (await fixture(
        html`
          <form @click="${formClickSpy}">
            <lion-button>foo</lion-button>
          </form>
        `,
      ));

      // @ts-ignore
      el.querySelector('lion-button').click();

      // trying to wait for other possible redispatched events
      await aTimeout(0);
      await aTimeout(0);

      expect(formClickSpy).to.have.been.calledOnce;
    });

    describe('native button behavior', async () => {
      /** @type {Event} */
      let nativeButtonEvent;
      /** @type {Event} */
      let lionButtonEvent;

      before(async () => {
        const nativeButtonEl = /** @type {LionButton} */ (await fixture('<button>foo</button>'));
        const lionButtonEl = /** @type {LionButton} */ (await fixture(
          '<lion-button>foo</lion-button>',
        ));
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
    });

    describe('event target', async () => {
      it('is host by default', async () => {
        const el = /** @type {LionButton} */ (await fixture('<lion-button>foo</lion-button>'));
        const event = await prepareClickEvent(el);
        expect(event.target).to.equal(el);
      });

      const useCases = [
        { container: 'div', type: 'submit', targetHost: true },
        { container: 'div', type: 'reset', targetHost: true },
        { container: 'div', type: 'button', targetHost: true },
        { container: 'form', type: 'submit', targetHost: false },
        { container: 'form', type: 'reset', targetHost: false },
        { container: 'form', type: 'button', targetHost: true },
      ];

      useCases.forEach(useCase => {
        const { container, type, targetHost } = useCase;
        const targetName = targetHost ? 'host' : 'native button';
        it(`is ${targetName} with type ${type} and it is inside a ${container}`, async () => {
          const clickSpy = /** @type {EventListener} */ (sinon.spy(e => e.preventDefault()));
          const el = /** @type {LionButton} */ (await fixture(
            `<lion-button type="${type}">foo</lion-button>`,
          ));
          const tag = unsafeStatic(container);
          await fixture(html`<${tag} @click="${clickSpy}">${el}</${tag}>`);
          const event = await prepareClickEvent(el);

          if (targetHost) {
            expect(event.target).to.equal(el);
          } else {
            expect(event.target).to.equal(el._nativeButtonNode);
          }
        });
      });
    });
  });
});
