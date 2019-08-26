import { expect, fixture, html } from '@open-wc/testing';

import '../lion-input-range.js';

describe('lion-input-range', () => {
  it('delegates min property and min attribute', async () => {
    const element = await fixture(html`
      <lion-input-range min="10"><label slot="label">Testing min</label></lion-input-range>
    `);

    expect(element.inputElement.min).to.equal('10');

    element.min = 30;
    await element.updateComplete;

    expect(element.min).to.equal(30);
    expect(element.inputElement.min).to.equal('30');
  });

  it('delegates max property and max attribute', async () => {
    const element = await fixture(html`
      <lion-input-range max="80"><label slot="label">Testing max</label></lion-input-range>
    `);

    expect(element.inputElement.max).to.equal('80');

    element.max = 50;
    await element.updateComplete;

    expect(element.max).to.equal(50);
    expect(element.inputElement.max).to.equal('50');
  });

  it('delegates step property and step attribute', async () => {
    const element = await fixture(html`
      <lion-input-range step="10"><label slot="label">Testing step</label></lion-input-range>
    `);

    expect(element.inputElement.step).to.equal('10');

    element.step = 30;
    await element.updateComplete;

    expect(element.step).to.equal(30);
    expect(element.inputElement.step).to.equal('30');
  });

  it('delegates list property', async () => {
    const container = await fixture(html`
      <div>
        <lion-input-range list="tickmarks"
          ><label slot="label">Testing list</label></lion-input-range
        >
        <datalist id="tickmarks">
          <option value="0" label="0%"> </option>
          <option value="100" label="100%"> </option>
        </datalist>
      </div>
    `);
    const element = container.querySelector('lion-input-range');
    const datalist = container.querySelector('datalist');

    expect(element.inputElement.list).to.equal(datalist);
  });

  it('delegates autocomplete property and autocomplete attribute', async () => {
    const element = await fixture(html`
      <lion-input-range autocomplete="off"
        ><label slot="label">Testing autocomplete</label></lion-input-range
      >
    `);

    expect(element.inputElement.autocomplete).to.equal('off');

    element.autocomplete = 'on';
    await element.updateComplete;

    expect(element.autocomplete).to.equal('on');
    expect(element.inputElement.autocomplete).to.equal('on');
  });

  it('delegates valueAsNumber property', async () => {
    const element = await fixture(html`
      <lion-input-range value="40"
        ><label slot="label">Testing valueAsNumber</label></lion-input-range
      >
    `);

    expect(element.valueAsNumber).to.equal(40);
  });

  it('delegates stepUp() method', async () => {
    const element = await fixture(html`
      <lion-input-range value="40"><label slot="label">Testing stepUp()</label></lion-input-range>
    `);

    element.stepUp();
    await element.updateComplete;

    expect(element.value).to.equal('41');
  });

  it('delegates stepDown() method', async () => {
    const element = await fixture(html`
      <lion-input-range value="40"><label slot="label">Testing stepDown()</label></lion-input-range>
    `);

    element.stepDown();
    await element.updateComplete;

    expect(element.value).to.equal('39');
  });

  it('delegates value property', async () => {
    const element = await fixture(html`
      <lion-input-range value="40"><label slot="label">Testing value</label></lion-input-range>
    `);

    expect(element.inputElement.value).to.equal('40');
  });

  it('should set the input value according the modelValue property', async () => {
    const element = await fixture(html`
      <lion-input-range .modelValue="${40}"
        ><label slot="label">Testing modelValue</label></lion-input-range
      >
    `);

    expect(element.inputElement.value).to.equal('40');
  });

  it('should change the input value if modelValue property changes', async () => {
    const element = await fixture(html`
      <lion-input-range .modelValue="${40}"
        ><label slot="label">Testing modelValue</label></lion-input-range
      >
    `);

    expect(element.inputElement.value).to.equal('40');

    element.modelValue = 60;
    await element.updateComplete;

    expect(element.inputElement.value).to.equal('60');
  });

  it('automatically creates an <input> element if not provided by user', async () => {
    const element = await fixture(html`
      <lion-input-range></lion-input-range>
    `);

    expect(element.querySelector('input')).to.equal(element.inputElement);
  });

  it('sets de modelValue according the value property', async () => {
    const element = await fixture(html`
      <lion-input-range value="50"></lion-input-range>
    `);

    expect(element.modelValue).to.equal(50);
  });

  it('sets the middle value of the range by default', async () => {
    const element1 = await fixture(html`
      <lion-input-range max="1000"></lion-input-range>
    `);
    const element2 = await fixture(html`
      <lion-input-range min="50"></lion-input-range>
    `);
    const element3 = await fixture(html`
      <lion-input-range min="30" max="1000"></lion-input-range>
    `);

    expect(element1.modelValue).to.equal(500);
    expect(element2.modelValue).to.equal(75);
    expect(element3.modelValue).to.equal(515);
  });

  it('sets the middle stepped value of the range by default', async () => {
    const element1 = await fixture(html`
      <lion-input-range min="50" step="2"></lion-input-range>
    `);
    const element2 = await fixture(html`
      <lion-input-range min="30" max="1000" step="10"></lion-input-range>
    `);

    expect(element1.modelValue).to.equal(74);
    expect(element2.modelValue).to.equal(510);
  });

  it("updates the modelValue if min is updated over it's value", async () => {
    const element = await fixture(html`
      <lion-input-range value="20"></lion-input-range>
    `);

    expect(element.modelValue).to.equal(20);

    element.min = 50;
    await element.updateComplete;

    expect(element.inputElement.valueAsNumber).to.equal(50);
  });

  it("updates the modelValue if max is updated under it's value", async () => {
    const element = await fixture(html`
      <lion-input-range value="70"></lion-input-range>
    `);

    expect(element.modelValue).to.equal(70);

    element.max = 50;
    await element.updateComplete;

    expect(element.inputElement.valueAsNumber).to.equal(50);
  });
});
