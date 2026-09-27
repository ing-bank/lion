import { expect, fixture, html } from '@open-wc/testing';
import '@lion/ui/define/lion-input.js';

/**
 * VANILLA adapter row of the interop matrix.
 * These must pass without any framework — they are the baseline the others measure against.
 */
describe('integrations-form: vanilla', () => {
  it('binds modelValue as a PROPERTY (typed value survives)', async () => {
    const el = await fixture(html`<lion-input name="a" label="a"></lion-input>`);
    el.modelValue = 1234;
    await el.updateComplete;
    expect(el.modelValue).to.equal(1234);
    expect(el.value).to.equal('1234'); // view value is a string
  });

  it('fires model-value-changed with formPath + isTriggeredByUser meta', async () => {
    const el = await fixture(html`<lion-input name="a" label="a"></lion-input>`);
    const spy = new Promise(resolve => {
      el.addEventListener('model-value-changed', ev => resolve(ev.detail), { once: true });
    });
    el.modelValue = 'x';
    const detail = await spy;
    expect(detail).to.have.property('formPath');
    expect(detail).to.have.property('isTriggeredByUser', false);
  });
});
