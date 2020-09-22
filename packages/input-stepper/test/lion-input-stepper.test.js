import { expect, fixture, nextFrame, html } from '@open-wc/testing';
import '../lion-input-stepper.js';

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
      const incrementButton = el.shadowRoot.querySelector('[name=increment]');
      incrementButton.dispatchEvent(new Event('click'));
      expect(el.value).to.equal('1');
    });

    it('should decrement the value to -1 on - button click', async () => {
      const el = await fixture(defaultInputStepper);
      expect(el.value).to.equal('');
      const incrementButton = el.shadowRoot.querySelector('[name=decrement]');
      incrementButton.dispatchEvent(new Event('click'));
      expect(el.value).to.equal('-1');
    });

    it('should update min and max attributes when min and max property change', async () => {
      const el = await fixture(inputStepperWithAttrs);
      el.min = '100';
      el.max = '200';
      await nextFrame();
      expect(el._inputNode.min).to.equal(el.min);
      expect(el._inputNode.max).to.equal(el.max);
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
      const incrementButton = el.shadowRoot.querySelector('[name=increment]');
      incrementButton.dispatchEvent(new Event('click'));
      expect(el).to.have.attribute('aria-valuenow', '1');
    });
  });
});
