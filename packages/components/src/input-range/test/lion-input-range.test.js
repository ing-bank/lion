import { expect, fixture as _fixture, nextFrame, html } from '@open-wc/testing';

import '@lion/components/define/lion-input-range.js';

/**
 * @typedef {import('../src/LionInputRange').LionInputRange} LionInputRange
 * @typedef {import('@lion/core').TemplateResult} TemplateResult
 */
const fixture = /** @type {(arg: TemplateResult|string) => Promise<LionInputRange>} */ (_fixture);

describe('<lion-input-range>', () => {
  it('has a type = range', async () => {
    const el = await fixture(`<lion-input-range></lion-input-range>`);
    expect(el._inputNode.type).to.equal('range');
  });

  it('displays the modelValue and unit', async () => {
    const el = await fixture(html`
      <lion-input-range .modelValue=${75} unit="${`%`}"></lion-input-range>
    `);
    expect(
      /** @type {HTMLElement} */ (el.shadowRoot?.querySelector('.input-range__value')).innerText,
    ).to.equal('75');
    expect(
      /** @type {HTMLElement} */ (el.shadowRoot?.querySelector('.input-range__unit')).innerText,
    ).to.equal('%');
  });

  it('displays 2 tick labels (min and max values) by default', async () => {
    const el = await fixture(`<lion-input-range min="100" max="200"></lion-input-range>`);
    expect(el.shadowRoot?.querySelectorAll('.input-range__limits span').length).to.equal(2);
    expect(
      /** @type {HTMLElement} */ (el.shadowRoot?.querySelectorAll('.input-range__limits span')[0])
        .innerText,
    ).to.equal(el.min.toString());
    expect(
      /** @type {HTMLElement} */ (el.shadowRoot?.querySelectorAll('.input-range__limits span')[1])
        .innerText,
    ).to.equal(el.max.toString());
  });

  it('update min and max attributes when min and max property change', async () => {
    const el = await fixture(`<lion-input-range min="100" max="200"></lion-input-range>`);
    el.min = 120;
    el.max = 220;
    await nextFrame(); // sync to native element takes some time
    expect(el._inputNode.min).to.equal(el.min.toString());
    expect(el._inputNode.max).to.equal(el.max.toString());
  });

  it('can hide the tick labels', async () => {
    const el = await fixture(
      `<lion-input-range min="100" max="200" no-min-max-labels></lion-input-range>`,
    );
    expect(el.shadowRoot?.querySelectorAll('.input-group__input')[0]).dom.to.equal(`
      <div class="input-group__input">
        <slot name="input"></slot>
      </div>
    `);
  });

  it('parser method should return a value parsed into a number format', async () => {
    const el = await fixture(html`
      <lion-input-range min="100" max="200" .modelValue=${150}></lion-input-range>
    `);
    expect(el.modelValue).to.equal(150);
    el._inputNode.value = '130';
    el._inputNode.dispatchEvent(new Event('input'));
    expect(el.modelValue).to.equal(130);
  });

  it('is accessible', async () => {
    const el = await fixture(`<lion-input-range label="range"></lion-input-range>`);
    await expect(el).to.be.accessible();
  });

  it('is accessible when disabled', async () => {
    const el = await fixture(`<lion-input-range label="range" disabled></lion-input-range>`);
    await expect(el).to.be.accessible();
  });
});
