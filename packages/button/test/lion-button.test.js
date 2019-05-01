import { expect, fixture, html } from '@open-wc/testing';
import sinon from 'sinon';
import { pressEnter, pressSpace } from '@polymer/iron-test-helpers/mock-interactions.js';

import '../lion-button.js';

describe('lion-button', () => {
  it('behaves like native `button` in terms of a11y', async () => {
    const lionButton = await fixture(`<lion-button>foo</lion-button>`);
    expect(lionButton.getAttribute('role')).to.equal('button');
    expect(lionButton.getAttribute('tabindex')).to.equal('0');
  });

  it('has no type by default on the native button', async () => {
    const lionButton = await fixture(`<lion-button>foo</lion-button>`);
    const nativeButton = lionButton.$$slot('_button');
    expect(nativeButton.getAttribute('type')).to.be.null;
  });

  it('has type="submit" on the native button when set', async () => {
    const lionButton = await fixture(`<lion-button type="submit">foo</lion-button>`);
    const nativeButton = lionButton.$$slot('_button');
    expect(nativeButton.getAttribute('type')).to.equal('submit');
  });

  it('hides the native button in the UI', async () => {
    const lionButton = await fixture(`<lion-button>foo</lion-button>`);
    const nativeButton = lionButton.$$slot('_button');
    expect(nativeButton.getAttribute('tabindex')).to.equal('-1');
    expect(window.getComputedStyle(nativeButton).visibility).to.equal('hidden');
  });

  it('can be disabled imperatively', async () => {
    const lionButton = await fixture(`<lion-button disabled>foo</lion-button>`);
    expect(lionButton.getAttribute('tabindex')).to.equal('-1');

    lionButton.disabled = false;
    await lionButton.updateComplete;
    expect(lionButton.getAttribute('tabindex')).to.equal('0');
    expect(lionButton.hasAttribute('disabled')).to.equal(false);

    lionButton.disabled = true;
    await lionButton.updateComplete;
    expect(lionButton.getAttribute('tabindex')).to.equal('-1');
    expect(lionButton.hasAttribute('disabled')).to.equal(true);
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
      const { left, top } = button.getBoundingClientRect();
      // to support elementFromPoint() in polyfilled browsers we have to use document
      const crossBrowserRoot = button.shadowRoot.elementFromPoint ? button.shadowRoot : document;
      const shadowClickAreaElement = crossBrowserRoot.elementFromPoint(left, top);
      shadowClickAreaElement.click();

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

      expect(formSubmitSpy.called).to.be.true;
    });
  });
});
