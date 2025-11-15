import { expect, fixture as _fixture, nextFrame } from '@open-wc/testing';
import { html } from 'lit/static-html.js';
import sinon from 'sinon';
import { formatNumber } from '@lion/ui/localize-no-side-effects.js';
import '@lion/ui/define/lion-input-stepper.js';

/**
 * @typedef {import('../src/LionInputStepper.js').LionInputStepper} LionInputStepper
 * @typedef {import('lit').TemplateResult} TemplateResult
 */
const fixture = /** @type {(arg: TemplateResult|string) => Promise<LionInputStepper>} */ (_fixture);

const defaultInputStepper = html`
  <lion-input-stepper name="year" label="Years"></lion-input-stepper>
`;
const inputStepperWithAttrs = html`<lion-input-stepper
  step="10"
  min="100"
  max="200"
  label="Label"
></lion-input-stepper>`;

describe('<lion-input-stepper>', () => {
  describe('Stepper', () => {
    it('has a type text', async () => {
      const el = await fixture(defaultInputStepper);
      expect(el._inputNode.type).to.equal('text');
    });

    it('has a default min and max of Infinity', async () => {
      const el = await fixture(defaultInputStepper);
      expect(el.getAttribute('min')).to.equal('Infinity');
      expect(el.getAttribute('max')).to.equal('Infinity');
    });

    it('has a default step of 1', async () => {
      const el = await fixture(defaultInputStepper);
      expect(el.getAttribute('step')).to.equal('1');
    });

    it('can set a step with which the value increases', async () => {
      const el = await fixture(defaultInputStepper);
      el.step = 10;
      await el.updateComplete;
      expect(el.value).to.equal('');
      expect(el.getAttribute('step')).to.equal('10');

      const incrementButton = el.querySelector('[slot=suffix]');
      incrementButton?.dispatchEvent(new Event('click'));
      expect(el.value).to.equal('10');
    });
  });

  describe('Formatter', () => {
    it('uses formatNumber for formatting', async () => {
      const el = await fixture(defaultInputStepper);
      expect(el.formatter).to.equal(formatNumber);
    });

    it('formatNumber uses locale provided in formatOptions', async () => {
      let el = await fixture(html`
        <lion-input-stepper
          .formatOptions="${{ locale: 'en-GB' }}"
          .modelValue="${1234.56}"
        ></lion-input-stepper>
      `);
      expect(el.formattedValue).to.equal('1,234.56');
      el = await fixture(html`
        <lion-input-stepper
          .formatOptions="${{ locale: 'nl-NL' }}"
          .modelValue="${1234.56}"
        ></lion-input-stepper>
      `);
      expect(el.formattedValue).to.equal('1.234,56');
    });

    it('supports overriding decimalSeparator in formatOptions', async () => {
      const el = await fixture(
        html`<lion-input-stepper
          .formatOptions="${{ locale: 'nl-NL', decimalSeparator: '.' }}"
          .modelValue="${12.34}"
        ></lion-input-stepper>`,
      );
      expect(el.formattedValue).to.equal('12.34');
    });

    it('supports overriding groupSeparator in formatOptions', async () => {
      const el = await fixture(
        html`<lion-input-stepper
          .formatOptions="${{ locale: 'nl-NL', groupSeparator: ',', decimalSeparator: '.' }}"
          .modelValue="${1234.56}"
        ></lion-input-stepper>`,
      );
      expect(el.formattedValue).to.equal('1,234.56');
    });
  });

  describe('User interaction', () => {
    it('should increment the value to 1 on [ArrowUp]', async () => {
      const el = await fixture(defaultInputStepper);
      expect(el.value).to.equal('');
      el.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
      await el.updateComplete;
      expect(el.value).to.equal('1');
    });

    it('should increment the value to minValue on [ArrowUp] if value is below min', async () => {
      const el = await fixture(inputStepperWithAttrs);
      expect(el.value).to.equal('');
      el.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
      await el.updateComplete;
      expect(el.value).to.equal('100');
    });

    it('should decrement the value to -1 on [ArrowDown]', async () => {
      const el = await fixture(defaultInputStepper);
      expect(el.value).to.equal('');
      el.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
      await el.updateComplete;
      expect(el.value).to.equal('−1');
    });

    it('should increment the value to minValue on [ArrowDown] if value is below min', async () => {
      const el = await fixture(inputStepperWithAttrs);
      el.modelValue = 600;
      el.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
      await el.updateComplete;
      expect(el.value).to.equal('200');
    });

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
      expect(el.value).to.equal('−1');
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

    it('fires a leave event ("blur") on button clicks', async () => {
      const blurSpy = sinon.spy();
      const el = await fixture(html`
        <lion-input-stepper @blur=${blurSpy} name="year" label="Years"></lion-input-stepper>
      `);

      expect(el.value).to.equal('');
      const decrementButton = el.querySelector('[slot=prefix]');
      decrementButton?.dispatchEvent(new Event('focus'));
      decrementButton?.dispatchEvent(new Event('click'));
      decrementButton?.dispatchEvent(new Event('blur'));
      expect(el.value).to.equal('−1');
      expect(blurSpy.calledOnce).to.be.true;
      expect(el.touched).to.be.true;

      el.touched = false;
      const incrementButton = el.querySelector('[slot=suffix]');
      incrementButton?.dispatchEvent(new Event('focus'));
      incrementButton?.dispatchEvent(new Event('click'));
      incrementButton?.dispatchEvent(new Event('blur'));
      expect(el.value).to.equal('0');
      expect(blurSpy.calledTwice).to.be.true;
      expect(el.touched).to.be.true;
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

    describe('It align to steps', () => {
      it('aligns the value to the nearest step when incrementing', async () => {
        let el = await fixture(
          html`<lion-input-stepper step="10" min="0" max="100" value="55"></lion-input-stepper>`,
        );
        let incrementButton = el.querySelector('[slot=suffix]');
        incrementButton?.dispatchEvent(new Event('click'));
        await el.updateComplete;
        expect(el.modelValue).to.equal(60, 'Fail + : (0 > 100 by 10; val 55)');

        // min 1
        el = await fixture(
          html`<lion-input-stepper step="10" min="1" max="100" value="55"></lion-input-stepper>`,
        );
        incrementButton = el.querySelector('[slot=suffix]');
        incrementButton?.dispatchEvent(new Event('click'));
        await el.updateComplete;
        expect(el.modelValue).to.equal(61, 'Fail + : (1 > 100 by 10; val 55)');

        // min 34
        el = await fixture(
          html`<lion-input-stepper step="10" min="34" max="100" value="55"></lion-input-stepper>`,
        );
        incrementButton = el.querySelector('[slot=suffix]');
        incrementButton?.dispatchEvent(new Event('click'));
        await el.updateComplete;
        expect(el.modelValue).to.equal(64, 'Fail + : (34 > 100 by 10; val 55)');

        // min -23
        el = await fixture(
          html`<lion-input-stepper step="10" min="-23" max="100" value="55"></lion-input-stepper>`,
        );
        incrementButton = el.querySelector('[slot=suffix]');
        incrementButton?.dispatchEvent(new Event('click'));
        await el.updateComplete;
        expect(el.modelValue).to.equal(57, 'Fail + : (-23 > 100 by 10; val 55)'); // -23 > -13 > -3 > 7 > ... > 57

        // min -23
        el = await fixture(
          html`<lion-input-stepper step="10" min="-23" max="100" value="-9"></lion-input-stepper>`,
        );
        incrementButton = el.querySelector('[slot=suffix]');
        incrementButton?.dispatchEvent(new Event('click'));
        await el.updateComplete;
        expect(el.modelValue).to.equal(-3, 'Fail + : (-23 > 100 by 10; val 55)'); // -23 > -13 > -3 > 7
      });

      it('aligns the value to the nearest step when decrementing', async () => {
        let el = await fixture(
          html`<lion-input-stepper step="10" min="0" max="100" value="55"></lion-input-stepper>`,
        );
        let decrementButton = el.querySelector('[slot=prefix]');
        decrementButton?.dispatchEvent(new Event('click'));
        await el.updateComplete;
        expect(el.modelValue).to.equal(50, 'Fail - : (0 > 100 by 10; val 55)');

        // min 1
        el = await fixture(
          html`<lion-input-stepper step="10" min="1" max="100" value="55"></lion-input-stepper>`,
        );
        decrementButton = el.querySelector('[slot=prefix]');
        decrementButton?.dispatchEvent(new Event('click'));
        await el.updateComplete;
        expect(el.modelValue).to.equal(51, 'Fail - : (1 > 100 by 10; val 55)');

        // min 34
        el = await fixture(
          html`<lion-input-stepper step="10" min="34" max="100" value="55"></lion-input-stepper>`,
        );
        decrementButton = el.querySelector('[slot=prefix]');
        decrementButton?.dispatchEvent(new Event('click'));
        await el.updateComplete;
        expect(el.modelValue).to.equal(54, 'Fail - : (34 > 100 by 10; val 55)');

        // min -23
        el = await fixture(
          html`<lion-input-stepper step="10" min="-23" max="100" value="55"></lion-input-stepper>`,
        );
        decrementButton = el.querySelector('[slot=prefix]');
        decrementButton?.dispatchEvent(new Event('click'));
        await el.updateComplete;
        expect(el.modelValue).to.equal(47, 'Fail - : (-23 > 100 by 10; val 55)'); // -23 > -13 > -3 > 7 > ... > 47

        // min -23
        el = await fixture(
          html`<lion-input-stepper step="10" min="-23" max="100" value="-9"></lion-input-stepper>`,
        );
        decrementButton = el.querySelector('[slot=prefix]');
        decrementButton?.dispatchEvent(new Event('click'));
        await el.updateComplete;
        expect(el.modelValue).to.equal(-13, 'Fail - : (-23 > 100 by 10; val 55)'); // -23 > -13 > -3 > 7
      });

      it('handles decimal step values correctly', async () => {
        // Test with decimal step 0.1
        let el = await fixture(
          html`<lion-input-stepper step="0.1" min="0" max="9" value="5.55"></lion-input-stepper>`,
        );

        // Test increment with decimal step
        let incrementButton = el.querySelector('[slot=suffix]');
        incrementButton?.dispatchEvent(new Event('click'));
        await el.updateComplete;
        expect(el.modelValue).to.equal(5.6, 'Fail + : (0 > 9 by 0.1; val 5.55)');

        // Test decrement with decimal step
        let decrementButton = el.querySelector('[slot=prefix]');
        decrementButton?.dispatchEvent(new Event('click'));
        await el.updateComplete;
        expect(el.modelValue).to.equal(5.5, 'Fail - : (0 > 9 by 0.1; val 5.6)');

        // Test with value that needs alignment
        el = await fixture(
          html`<lion-input-stepper step="0.1" min="0" max="9" value="3.27"></lion-input-stepper>`,
        );

        // Should align to next step when incrementing
        incrementButton = el.querySelector('[slot=suffix]');
        incrementButton?.dispatchEvent(new Event('click'));
        await el.updateComplete;
        expect(el.modelValue).to.equal(3.3, 'Fail + alignment: (0 > 9 by 0.1; val 3.27)');

        // Reset and test decrement alignment
        el = await fixture(
          html`<lion-input-stepper step="0.1" min="0" max="9" value="3.27"></lion-input-stepper>`,
        );

        // Should align to previous step when decrementing
        decrementButton = el.querySelector('[slot=prefix]');
        decrementButton?.dispatchEvent(new Event('click'));
        await el.updateComplete;
        expect(el.modelValue).to.equal(3.2, 'Fail - alignment: (0 > 9 by 0.1; val 3.27)');
      });
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

    it('has role="spinbutton"', async () => {
      const el = await fixture(defaultInputStepper);
      expect(el._inputNode.hasAttribute('role')).to.be.true;
      expect(el._inputNode.getAttribute('role')).to.equal('spinbutton');
    });

    it('updates aria-valuenow when stepper is changed', async () => {
      const el = await fixture(defaultInputStepper);
      el.modelValue = 1;

      await el.updateComplete;
      expect(el._inputNode.hasAttribute('aria-valuenow')).to.be.true;
      expect(el._inputNode.getAttribute('aria-valuenow')).to.equal('1');

      el.modelValue = '';
      await el.updateComplete;
      expect(el._inputNode.hasAttribute('aria-valuenow')).to.be.false;
    });

    it('updates aria-valuetext when stepper is changed', async () => {
      // VoiceOver announces percentages once the valuemin or valuemax are used.
      // This can be fixed by setting valuetext to the same value as valuenow
      // https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-valuenow
      const el = await fixture(defaultInputStepper);
      el.modelValue = 1;
      await el.updateComplete;

      expect(el._inputNode.hasAttribute('aria-valuetext')).to.be.true;
      expect(el._inputNode.getAttribute('aria-valuetext')).to.equal('1');

      el.modelValue = '';
      await el.updateComplete;
      expect(el._inputNode.hasAttribute('aria-valuetext')).to.be.false;
    });

    it('can give aria-valuetext to override default value as a human-readable text alternative', async () => {
      const values = {
        1: 'first',
        2: 'second',
        3: 'third',
      };
      const el = await fixture(html`
        <lion-input-stepper min="1" max="3" .valueTextMapping="${values}"></lion-input-stepper>
      `);
      el.modelValue = 1;
      await el.updateComplete;
      expect(el._inputNode.hasAttribute('aria-valuetext')).to.be.true;
      expect(el._inputNode.getAttribute('aria-valuetext')).to.equal('first');
    });

    it('updates aria-valuemin when stepper is changed', async () => {
      const el = await fixture(inputStepperWithAttrs);
      const incrementButton = el.querySelector('[slot=suffix]');
      incrementButton?.dispatchEvent(new Event('click'));
      expect(el._inputNode.hasAttribute('aria-valuemin')).to.be.true;
      expect(el._inputNode.getAttribute('aria-valuemin')).to.equal('100');

      el.min = 0;
      await el.updateComplete;
      expect(el._inputNode.hasAttribute('aria-valuemin')).to.be.true;
      expect(el._inputNode.getAttribute('aria-valuemin')).to.equal('0');
    });

    it('updates aria-valuemax when stepper is changed', async () => {
      const el = await fixture(inputStepperWithAttrs);
      const incrementButton = el.querySelector('[slot=suffix]');
      incrementButton?.dispatchEvent(new Event('click'));
      expect(el._inputNode.hasAttribute('aria-valuemax')).to.be.true;
      expect(el._inputNode.getAttribute('aria-valuemax')).to.equal('200');

      el.max = 1000;
      await el.updateComplete;
      expect(el._inputNode.hasAttribute('aria-valuemax')).to.be.true;
      expect(el._inputNode.getAttribute('aria-valuemax')).to.equal('1000');
    });

    it('when decrease button gets focus, it sets aria-live to input-stepper__value', async () => {
      const el = await fixture(inputStepperWithAttrs);
      const stepperValue = el.shadowRoot?.querySelector('.input-stepper__value');
      const decrementButton = el.querySelector('[slot=prefix]');

      decrementButton?.dispatchEvent(new Event('focus'));
      expect(stepperValue?.hasAttribute('aria-live')).to.be.true;
      expect(stepperValue?.getAttribute('aria-live')).to.equal('assertive');

      decrementButton?.dispatchEvent(new Event('blur'));
      expect(stepperValue?.hasAttribute('aria-live')).to.be.false;
    });

    it('when increase button gets focus, it sets aria-live to input-stepper__value', async () => {
      const el = await fixture(inputStepperWithAttrs);
      const stepperValue = el.shadowRoot?.querySelector('.input-stepper__value');
      const incrementButton = el.querySelector('[slot=suffix]');

      incrementButton?.dispatchEvent(new Event('focus'));
      expect(stepperValue?.hasAttribute('aria-live')).to.be.true;
      expect(stepperValue?.getAttribute('aria-live')).to.equal('assertive');

      incrementButton?.dispatchEvent(new Event('blur'));
      expect(stepperValue?.hasAttribute('aria-live')).to.be.false;
    });

    it('decrease button should have aria-label with the component label', async () => {
      const el = await fixture(inputStepperWithAttrs);
      const decrementButton = el.querySelector('[slot=prefix]');

      expect(decrementButton?.hasAttribute('aria-label')).to.be.true;
      expect(decrementButton?.getAttribute('aria-label')).to.equal('Decrease Label');
    });

    it('increase button should have aria-label with the component label', async () => {
      const el = await fixture(inputStepperWithAttrs);
      const incrementButton = el.querySelector('[slot=suffix]');

      expect(incrementButton?.hasAttribute('aria-label')).to.be.true;
      expect(incrementButton?.getAttribute('aria-label')).to.equal('Increase Label');
    });
  });
});
