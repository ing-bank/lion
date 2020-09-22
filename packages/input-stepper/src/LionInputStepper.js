import { html, css } from '@lion/core';
import { LionInput } from '@lion/input';
import { IsNumber, MinNumber, MaxNumber } from '@lion/form-core';

/**
 * `LionInputStepper` is a class for custom input-stepper element (`<lion-input-stepper>` web component).
 *
 * @customElement lion-input-stepper
 * @extends LitElement
 */
export class LionInputStepper extends LionInput {
  static get styles() {
    return [
      super.styles,
      css`
        .input-group__container > .input-group__input ::slotted(.form-control) {
          text-align: center;
        }
      `,
    ];
  }

  static get properties() {
    return {
      min: Number,
      max: Number,
      step: Number,
      modelValue: Number,
      __disableIncrementor: Boolean,
      __disableDecrementor: Boolean,
    };
  }

  get currentValue() {
    return parseFloat(this.value || 0);
  }

  constructor() {
    super();
    this.parser = modelValue => parseFloat(modelValue);
    this.__disableIncrementor = false;
    this.__disableDecrementor = false;
  }

  connectedCallback() {
    if (super.connectedCallback) {
      super.connectedCallback();
    }
    this.role = 'spinbutton';
    this.addEventListener('keydown', this.__keyDownHandler);
    this._inputNode.setAttribute('inputmode', 'decimal');
    this._inputNode.setAttribute('autocomplete', 'off');
    this.step = this.hasAttribute('step') ? this.step : 1;
    this.__setAriaLabelsAndValidator();
    this.__toggleSpinnerButtonsState();
  }

  disconnectedCallback() {
    if (super.disconnectedCallback) {
      super.disconnectedCallback();
    }
    this.removeEventListener('keydown', this.__keyDownHandler);
  }

  /**
   * Update native input values
   * @param {Object} changedProps - changed props
   */
  updated(changedProps) {
    super.updated(changedProps);

    if (changedProps.has('min')) {
      this._inputNode.min = this.min;
    }

    if (changedProps.has('max')) {
      this._inputNode.max = this.max;
    }

    if (changedProps.has('step')) {
      this._inputNode.step = this.step;
    }
  }

  /**
   * Set aria labels and apply validators
   * @private
   */
  __setAriaLabelsAndValidator() {
    this.values = {
      max: parseFloat(this.max || Infinity),
      min: parseFloat(this.min || Infinity),
      step: parseFloat(this.step),
    };

    const ariaAttributes = {
      'aria-valuemax': this.values.max,
      'aria-valuemin': this.values.min,
    };

    let validators = Object.entries(ariaAttributes)
      .map(([key, val]) => {
        if (val !== Infinity) {
          this.setAttribute(key, val);
          return key === 'aria-valuemax' ? new MaxNumber(val) : new MinNumber(val);
        }
        return null;
      })
      .filter(validator => validator);
    validators = [new IsNumber(), ...validators];
    this.defaultValidators.push(...validators);
  }

  /**
   * Update values on keyboard arrow up and down event
   * @param {KeyboardEvent} e - keyboard event
   * @private
   */
  __keyDownHandler(e) {
    if (e.key === 'ArrowUp') {
      this.__increment();
    }

    if (e.key === 'ArrowDown') {
      this.__decrement();
    }
  }

  /**
   * Toggle disabled state for the buttons
   * @private
   */
  __toggleSpinnerButtonsState() {
    const { min, max } = this.values;
    this.__disableIncrementor = this.currentValue >= max && max !== Infinity;
    this.__disableDecrementor = this.currentValue <= min && min !== Infinity;
    this.setAttribute('aria-valuenow', this.currentValue);
    this.dispatchEvent(
      new CustomEvent('user-input-changed', {
        bubbles: true,
      }),
    );
  }

  /**
   * Increment the value based on given step or default step value is 1
   * @private
   */
  __increment() {
    const { step, max } = this.values;
    const newValue = this.currentValue + step;
    if (newValue <= max || max === Infinity) {
      this.value = newValue;
      this.__toggleSpinnerButtonsState();
    }
  }

  /**
   * Decrement the value based on given step or default step value is 1
   * @private
   */
  __decrement() {
    const { step, min } = this.values;
    const newValue = this.currentValue - step;
    if (newValue >= min || min === Infinity) {
      this.value = newValue;
      this.__toggleSpinnerButtonsState();
    }
  }

  /**
   * Toggle +/- buttons on change
   * @override
   */
  _onChange() {
    super._onChange();
    this.__toggleSpinnerButtonsState();
  }

  /**
   * Override after template to none
   * @override
   */
  // eslint-disable-next-line class-methods-use-this
  _inputGroupAfterTemplate() {
    return html``;
  }

  /**
   * Override before template to none
   * @override
   */
  // eslint-disable-next-line class-methods-use-this
  _inputGroupBeforeTemplate() {
    return html``;
  }

  /**
   * Override prefix template for the increment button
   * @override
   */
  // eslint-disable-next-line class-methods-use-this
  _inputGroupPrefixTemplate() {
    return html`
      <button
        ?disabled=${this.disabled || this.readOnly || this.__disableDecrementor}
        @click=${this.__decrement}
        tabindex="-1"
        name="decrement"
        type="button"
        aria-label="decrement"
      >
        -
      </button>
    `;
  }

  /**
   * Override suffix template for the decrement button and add after slot
   * @override
   */
  // eslint-disable-next-line class-methods-use-this
  _inputGroupSuffixTemplate() {
    return html`
      <button
        ?disabled=${this.disabled || this.readOnly || this.__disableIncrementor}
        @click=${this.__increment}
        tabindex="-1"
        name="increment"
        type="button"
        aria-label="increment"
      >
        +
      </button>
      <slot name="after"></slot>
    `;
  }
}
