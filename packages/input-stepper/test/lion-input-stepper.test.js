import { expect, fixture as _fixture, nextFrame } from '@open-wc/testing';
import { html } from 'lit/static-html.js';
import '@lion/input-stepper/define';

/**
 * @typedef {import('../src/LionInputStepper').LionInputStepper} LionInputStepper
 * @typedef {import('@lion/core').TemplateResult} TemplateResult
 */
const fixture = /** @type {(arg: TemplateResult|string) => Promise<LionInputStepper>} */ (_fixture);

const defaultInputStepper = html`
  <lion-input-stepper name="year" label="Years"></lion-input-stepper>
`;
const inputStepperWithAttrs = html`<lion-input-stepper min="100" max="200"></lion-input-stepper>`;

describe('<lion-input-stepper>', () => {
  describe('Stepper', () => {
    it('has a type text', async () => {
      const el = await fixture(defaultInputStepper);
      expect(el._inputNode.type).to.equal('text');
    });
  });

  describe('User interaction', () => {
    it('should increment the value to 1 on + button click', async () => {
      const el = await fixture(defaultInputStepper);
      expect(el.value).to.equal('');
      const incrementButton = el.querySelector('[slot=suffix]');
      incrementButton?.dispatchEvent(new Event('click'));
      expect(el.value).to.equal('1');
    });

    it('should decrement the value to -1 on - button click', async () => {
      const el = await fixture(defaultInputStepper);
      expect(el.value).to.equal('');
      const decrementButton = el.querySelector('[slot=prefix]');
      decrementButton?.dispatchEvent(new Event('click'));
      expect(el.value).to.equal('-1');
    });

    it('fires one "user-input-changed" event on + button click', async () => {
      let counter = 0;
      const el = await fixture(html`
        <lion-input-stepper
          name="year"
          label="Years"
          @user-input-changed="${() => {
            counter += 1;
          }}"
        >
        </lion-input-stepper>
      `);
      const incrementButton = el.querySelector('[slot=suffix]');
      incrementButton?.dispatchEvent(new Event('click'));
      expect(counter).to.equal(1);
    });

    it('fires one "user-input-changed" event on - button click', async () => {
      let counter = 0;
      const el = await fixture(html`
        <lion-input-stepper
          name="year"
          label="Years"
          @user-input-changed="${() => {
            counter += 1;
          }}"
        >
        </lion-input-stepper>
      `);
      const decrementButton = el.querySelector('[slot=prefix]');
      decrementButton?.dispatchEvent(new Event('click'));
      expect(counter).to.equal(1);
    });

    it('should update min and max attributes when min and max property change', async () => {
      const el = await fixture(inputStepperWithAttrs);
      el.min = 100;
      el.max = 200;
      await nextFrame();
      expect(el._inputNode.min).to.equal(el.min.toString());
      expect(el._inputNode.max).to.equal(el.max.toString());
    });

    it('should remove the disabled attribute of the decrement button when the min property changes to below the modelvalue', async () => {
      const el = await fixture(inputStepperWithAttrs);
      const decrementButton = el.querySelector('[slot=prefix]');
      el.modelValue = 100;
      await nextFrame();
      expect(decrementButton?.getAttribute('disabled')).to.equal('true');
      el.min = 99;
      await nextFrame();
      expect(decrementButton?.getAttribute('disabled')).to.equal(null);
    });

    it('should add the disabled attribute of the decrement button when the min property changes to the modelvalue', async () => {
      const el = await fixture(inputStepperWithAttrs);
      const decrementButton = el.querySelector('[slot=prefix]');
      el.modelValue = 101;
      await nextFrame();
      expect(decrementButton?.getAttribute('disabled')).to.equal(null);
      el.min = 101;
      await nextFrame();
      expect(decrementButton?.getAttribute('disabled')).to.equal('true');
    });

    it('should remove the disabled attribute of the increment button when the max property changes to above the modelvalue', async () => {
      const el = await fixture(inputStepperWithAttrs);
      const incrementButton = el.querySelector('[slot=suffix]');
      el.modelValue = 200;
      await nextFrame();
      expect(incrementButton?.getAttribute('disabled')).to.equal('true');
      el.max = 201;
      await nextFrame();
      expect(incrementButton?.getAttribute('disabled')).to.equal(null);
    });

    it('should add the disabled attribute of the increment button when the max property changes to the modelvalue', async () => {
      const el = await fixture(inputStepperWithAttrs);
      const incrementButton = el.querySelector('[slot=suffix]');
      el.modelValue = 199;
      await nextFrame();
      expect(incrementButton?.getAttribute('disabled')).to.equal(null);
      el.max = 199;
      await nextFrame();
      expect(incrementButton?.getAttribute('disabled')).to.equal('true');
    });

    it('should react to changes in the modelValue by adjusting the disabled state of the button', async () => {
      const el = await fixture(inputStepperWithAttrs);
      const incrementButton = el.querySelector('[slot=suffix]');
      el.modelValue = 199;
      await nextFrame();
      expect(incrementButton?.getAttribute('disabled')).to.equal(null);
      el.modelValue = 200;
      await nextFrame();
      expect(incrementButton?.getAttribute('disabled')).to.equal('true');
    });
  });

  describe('Accessibility', () => {
    it('is a11y AXE accessible', async () => {
      const el = await fixture(defaultInputStepper);
      await expect(el).to.be.accessible();
    });

    it('is accessible when disabled', async () => {
      const el = await fixture(`<lion-input-stepper label="rsvp" disabled></lion-input-stepper>`);
      await expect(el).to.be.accessible();
    });

    it('adds aria-valuemax and aria-valuemin when min and max are provided', async () => {
      const el = await fixture(inputStepperWithAttrs);
      expect(el).to.have.attribute('aria-valuemax', '200');
      expect(el).to.have.attribute('aria-valuemin', '100');
    });

    it('updates aria-valuenow when stepper is changed', async () => {
      const el = await fixture(inputStepperWithAttrs);
      const incrementButton = el.querySelector('[slot=suffix]');
      incrementButton?.dispatchEvent(new Event('click'));
      expect(el).to.have.attribute('aria-valuenow', '1');
    });
  });
});
