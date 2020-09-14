import { expect, fixture, html, unsafeStatic } from '@open-wc/testing';

import '../lion-input.js';

/**
 * @typedef {import('../src/LionInput').LionInput} LionInput
 */

const tagString = 'lion-input';
const tag = unsafeStatic(tagString);

describe('<lion-input>', () => {
  it('delegates readOnly property and readonly attribute', async () => {
    const el = /** @type {LionInput} */ (await fixture(html`<${tag} readonly></${tag}>`));
    expect(el._inputNode.readOnly).to.equal(true);
    el.readOnly = false;
    await el.updateComplete;
    expect(el.readOnly).to.equal(false);
    expect(el._inputNode.readOnly).to.equal(false);
  });

  it('delegates value attribute', async () => {
    const el = /** @type {LionInput} */ (await fixture(html`<${tag} value="prefilled"></${tag}>`));
    expect(el._inputNode.getAttribute('value')).to.equal('prefilled');
  });

  it('automatically creates an <input> element if not provided by user', async () => {
    const el = /** @type {LionInput} */ (await fixture(html`
      <${tag}></${tag}>
    `));
    expect(el.querySelector('input')).to.equal(el._inputNode);
  });

  it('has a type which is reflected to an attribute and is synced down to the native input', async () => {
    const el = /** @type {LionInput} */ (await fixture(html`<${tag}></${tag}>`));
    expect(el.type).to.equal('text');
    expect(el.getAttribute('type')).to.equal('text');
    expect(el._inputNode.getAttribute('type')).to.equal('text');

    el.type = 'foo';
    await el.updateComplete;
    expect(el.getAttribute('type')).to.equal('foo');
    expect(el._inputNode.getAttribute('type')).to.equal('foo');
  });

  it('has an attribute that can be used to set the placeholder text of the input', async () => {
    const el = /** @type {LionInput} */ (await fixture(html`<${tag} placeholder="text"></${tag}>`));
    expect(el.getAttribute('placeholder')).to.equal('text');
    expect(el._inputNode.getAttribute('placeholder')).to.equal('text');

    el.placeholder = 'foo';
    await el.updateComplete;
    expect(el.getAttribute('placeholder')).to.equal('foo');
    expect(el._inputNode.getAttribute('placeholder')).to.equal('foo');
  });

  describe('Accessibility', () => {
    it('is accessible', async () => {
      const el = await fixture(html`<${tag} label="Label"></${tag}>`);
      await expect(el).to.be.accessible();
    });

    it('is accessible when readonly', async () => {
      const el = await fixture(html`<${tag} readonly label="Label"></${tag}>`);
      await expect(el).to.be.accessible();
    });

    it('is accessible when disabled', async () => {
      const el = await fixture(html`<${tag} disabled label="Label"></${tag}>`);
      await expect(el).to.be.accessible();
    });
  });
});
