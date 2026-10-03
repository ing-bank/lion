/**
 * A legacy slot template may return a raw Element (the SlotMixin convention) instead of a
 * TemplateResult; lit renders it as a node. LionSelectInvoker uses that for its `after` icon, so it
 * exercises the case on a real component now that it runs on LightRenderMixin.
 */
import { expect } from '@open-wc/testing';
import { LionSelectInvoker } from '@lion/ui/select-rich.js';

// `lion-select-invoker` is registered in the scoped registry of `lion-select-rich`, not globally,
// so register it globally here to be able to create one standalone.
const tag = 'light-render-test-select-invoker';
if (!customElements.get(tag)) {
  customElements.define(tag, LionSelectInvoker);
}

describe('LionSelectInvoker light dom', () => {
  it('renders the `after` slot, whose template returns a raw Element', async () => {
    const el = /** @type {HTMLElement} */ (document.createElement(tag));
    document.body.appendChild(el);
    await /** @type {any} */ (el).updateComplete;

    const icon = /** @type {HTMLElement} */ (el.querySelector('[slot="after"]'));
    expect(icon).to.exist;
    expect(icon.tagName).to.equal('SPAN');
    expect(icon.textContent).to.equal('▼');
    expect(icon.getAttribute('aria-hidden')).to.equal('true');
  });

  it('leaves a consumer provided slot alone', async () => {
    const el = /** @type {HTMLElement} */ (document.createElement(tag));
    el.innerHTML = '<span slot="after">own icon</span>';
    document.body.appendChild(el);
    await /** @type {any} */ (el).updateComplete;

    const slots = el.querySelectorAll('[slot="after"]');
    expect(slots.length).to.equal(1);
    expect(slots[0].textContent).to.equal('own icon');
  });
});
