/* eslint-disable lit-a11y/click-events-have-key-events */
import { LionButton } from '@lion/components/button.js';
import { browserDetection } from '@lion/components/core.js';
import {
  aTimeout,
  defineCE,
  expect,
  fixture,
  html,
  oneEvent,
  unsafeStatic,
} from '@open-wc/testing';
import sinon from 'sinon';

export function LionButtonSuite({ klass = LionButton } = {}) {
  const tagStringButton = defineCE(class extends klass {});
  const tagButton = unsafeStatic(tagStringButton);

  describe('LionButton', () => {
    it('has .type="button" and type="button" by default', async () => {
      const el = /** @type {LionButton} */ (await fixture(html`<${tagButton}>foo</${tagButton}>`));
      expect(el.type).to.equal('button');
      expect(el.getAttribute('type')).to.be.equal('button');
    });

    it('is hidden when attribute hidden is true', async () => {
      const el = /** @type {LionButton} */ (
        await fixture(html`<${tagButton} hidden>foo</${tagButton}>`)
      );
      expect(el).not.to.be.displayed;
    });

    it('can be disabled imperatively', async () => {
      const el = /** @type {LionButton} */ (
        await fixture(html`<${tagButton} disabled>foo</${tagButton}>`)
      );
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

    describe('Active', () => {
      it('updates "active" attribute on host when mousedown/mouseup on button', async () => {
        const el = /** @type {LionButton} */ (await fixture(html`<${tagButton}>foo</${tagButton}`));
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
        const el = /** @type {LionButton} */ (
          await fixture(html`<${tagButton}>foo</${tagButton}>`)
        );

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
        const el = /** @type {LionButton} */ (
          await fixture(html`<${tagButton}>foo</${tagButton}>`)
        );

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
        const el = /** @type {LionButton} */ (
          await fixture(html`<${tagButton}>foo</${tagButton}>`)
        );

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
        const el = /** @type {LionButton} */ (
          await fixture(html`<${tagButton}>foo</${tagButton}>`)
        );

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
        const el = /** @type {LionButton} */ (
          await fixture(html`<${tagButton}>foo</${tagButton}>`)
        );

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

    describe('Accessibility', () => {
      it('has a role="button" by default', async () => {
        const el = /** @type {LionButton} */ (
          await fixture(html`<${tagButton}>foo</${tagButton}>`)
        );
        expect(el.getAttribute('role')).to.equal('button');
        el.setAttribute('role', 'foo');
        await el.updateComplete;
        expect(el.getAttribute('role')).to.equal('foo');
      });

      it('does not override user provided role', async () => {
        const el = /** @type {LionButton} */ (
          await fixture(html`<${tagButton} role="foo">foo</${tagButton}>`)
        );
        expect(el.getAttribute('role')).to.equal('foo');
      });

      it('has a tabindex="0" by default', async () => {
        const el = /** @type {LionButton} */ (
          await fixture(html`<${tagButton}>foo</${tagButton}>`)
        );
        expect(el.getAttribute('tabindex')).to.equal('0');
      });

      it('has a tabindex="-1" when disabled', async () => {
        const el = /** @type {LionButton} */ (
          await fixture(html`<${tagButton} disabled>foo</${tagButton}>`)
        );
        expect(el.getAttribute('tabindex')).to.equal('-1');
        el.disabled = false;
        await el.updateComplete;
        expect(el.getAttribute('tabindex')).to.equal('0');
        el.disabled = true;
        await el.updateComplete;
        expect(el.getAttribute('tabindex')).to.equal('-1');
      });

      it('does not override user provided tabindex', async () => {
        const el = /** @type {LionButton} */ (
          await fixture(html`<${tagButton} tabindex="5">foo</${tagButton}>`)
        );
        expect(el.getAttribute('tabindex')).to.equal('5');
      });

      it('disabled does not override user provided tabindex', async () => {
        const el = /** @type {LionButton} */ (
          await fixture(html`<${tagButton} tabindex="5" disabled>foo</${tagButton}>`)
        );
        expect(el.getAttribute('tabindex')).to.equal('-1');
        el.disabled = false;
        await el.updateComplete;
        expect(el.getAttribute('tabindex')).to.equal('5');
      });

      it('has an aria-labelledby and wrapper element in IE11', async () => {
        const browserDetectionStub = sinon.stub(browserDetection, 'isIE11').value(true);
        const el = /** @type {LionButton} */ (
          await fixture(html`<${tagButton}>foo</${tagButton}>`)
        );
        expect(el.hasAttribute('aria-labelledby')).to.be.true;
        const wrapperId = el.getAttribute('aria-labelledby');
        expect(/** @type {ShadowRoot} */ (el.shadowRoot).querySelector(`#${wrapperId}`)).to.exist;
        expect(
          /** @type {ShadowRoot} */ (el.shadowRoot).querySelector(`#${wrapperId}`),
        ).dom.to.equal(`<div class="button-content" id="${wrapperId}"><slot></slot></div>`);
        browserDetectionStub.restore();
      });

      it('does not override aria-labelledby when provided by user', async () => {
        const browserDetectionStub = sinon.stub(browserDetection, 'isIE11').value(true);
        const el = /** @type {LionButton} */ (
          await fixture(html`<${tagButton} aria-labelledby="some-id another-id">foo</${tagButton}>`)
        );
        expect(el.getAttribute('aria-labelledby')).to.equal('some-id another-id');
        browserDetectionStub.restore();
      });

      it('[axe] is accessible', async () => {
        const el = /** @type {LionButton} */ (
          await fixture(html`<${tagButton}>foo</${tagButton}>`)
        );
        await expect(el).to.be.accessible();
      });

      it('[axe] is accessible when disabled', async () => {
        const el = /** @type {LionButton} */ (
          await fixture(html`<${tagButton} disabled>foo</${tagButton}>`)
        );
        await expect(el).to.be.accessible({ ignoredRules: ['color-contrast'] });
      });
    });

    describe('Click event', () => {
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
        const el = /** @type {LionButton} */ (
          await fixture(html` <${tagButton} @click="${clickSpy}">foo</${tagButton}> `)
        );

        el.click();

        // trying to wait for other possible redispatched events
        await aTimeout(0);
        await aTimeout(0);

        expect(clickSpy).to.have.been.calledOnce;
      });

      describe('Native button behavior', async () => {
        /** @type {Event} */
        let nativeButtonEvent;
        /** @type {Event} */
        let lionButtonEvent;

        before(async () => {
          const nativeButtonEl = /** @type {LionButton} */ (await fixture('<button>foo</button>'));
          const lionButtonEl = /** @type {LionButton} */ (
            await fixture(html`<${tagButton}>foo</${tagButton}>`)
          );
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

      describe('Event target', async () => {
        it('is host by default', async () => {
          const el = /** @type {LionButton} */ (
            await fixture(html`<${tagButton}>foo</${tagButton}>`)
          );
          const event = await prepareClickEvent(el);
          expect(event.target).to.equal(el);
        });

        const useCases = [
          { container: 'div', type: 'submit' },
          { container: 'div', type: 'reset' },
          { container: 'div', type: 'button' },
          { container: 'form', type: 'submit' },
          { container: 'form', type: 'reset' },
          { container: 'form', type: 'button' },
        ];

        useCases.forEach(useCase => {
          const { container, type } = useCase;
          const targetName = 'host';
          it(`is ${targetName} with type ${type} and it is inside a ${container}`, async () => {
            const clickSpy = /** @type {EventListener} */ (sinon.spy(e => e.preventDefault()));
            const el = /** @type {LionButton} */ (
              await fixture(html`<${tagButton} type="${type}">foo</${tagButton}>`)
            );
            const tag = unsafeStatic(container);
            await fixture(html`<${tag} @click="${clickSpy}">${el}</${tag}>`);
            const event = await prepareClickEvent(el);

            expect(event.target).to.equal(el);
          });
        });
      });
    });

    describe('With click event', () => {
      it('behaves like native `button` when clicked', async () => {
        const formButtonClickedSpy = /** @type {EventListener} */ (sinon.spy());
        const form = await fixture(html`
          <form @submit=${/** @type {EventListener} */ ev => ev.preventDefault()}>
            <${tagButton} @click="${formButtonClickedSpy}" type="submit">foo</${tagButton}>
          </form>
        `);

        const button = /** @type {LionButton} */ (form.querySelector(tagStringButton));
        button.click();

        expect(formButtonClickedSpy).to.have.been.calledOnce;
      });

      it('behaves like native `button` when interacted with keyboard space', async () => {
        const formButtonClickedSpy = /** @type {EventListener} */ (sinon.spy());
        const form = await fixture(html`
          <form @submit=${/** @type {EventListener} */ ev => ev.preventDefault()}>
            <${tagButton} @click="${formButtonClickedSpy}" type="submit">foo</${tagButton}>
          </form>
        `);

        const lionButton = /** @type {LionButton} */ (form.querySelector(tagStringButton));
        lionButton.dispatchEvent(new KeyboardEvent('keyup', { key: ' ' }));
        await aTimeout(0);
        await aTimeout(0);

        expect(formButtonClickedSpy).to.have.been.calledOnce;
      });

      it('behaves like native `button` when interacted with keyboard enter', async () => {
        const formButtonClickedSpy = /** @type {EventListener} */ (sinon.spy());
        const form = await fixture(html`
          <form @submit=${/** @type {EventListener} */ ev => ev.preventDefault()}>
            <${tagButton} @click="${formButtonClickedSpy}" type="submit">foo</${tagButton}>
          </form>
        `);

        const button = /** @type {LionButton} */ (form.querySelector(tagStringButton));
        button.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter' }));
        await aTimeout(0);
        await aTimeout(0);

        expect(formButtonClickedSpy).to.have.been.calledOnce;
      });
    });
  });
}
