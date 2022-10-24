import { html, css, render } from 'lit';
import { LionInput } from '@lion/ui/input.js';
import { IsNumber, MinNumber, MaxNumber } from '@lion/ui/form-core.js';

/**
 * @typedef {import('@lion/core').RenderOptions} RenderOptions
 */

/**
 * `LionInputStepper` is a class for custom input-stepper element (`<lion-input-stepper>` web component).
 *
 * @customElement lion-input-stepper
 */
export class LionInputStepper extends LionInput {
  static get styles() {
    return [
      ...super.styles,
      css`
        .input-group__container > .input-group__input ::slotted(.form-control) {
          text-align: center;
        }
      `,
    ];
  }

  /** @type {any} */
  static get properties() {
    return {
      min: {
        type: Number,
        reflect: true,
      },
      max: {
        type: Number,
        reflect: true,
      },
      step: {
        type: Number,
        reflect: true,
      },
    };
  }

  /**
   * @returns {number}
   */
  get currentValue() {
    return parseFloat(this.value) || 0;
  }

  get _inputNode() {
    return /** @type {HTMLInputElement} */ (super._inputNode);
  }

  constructor() {
    super();
    /** @param {string} modelValue */
    this.parser = modelValue => parseFloat(modelValue);
    this.min = Infinity;
    this.max = Infinity;
    this.step = 1;
    this.values = {
      max: this.max,
      min: this.min,
      step: this.step,
    };

    this.__increment = this.__increment.bind(this);
    this.__decrement = this.__decrement.bind(this);
    this.__boundOnLeaveButton = this._onLeaveButton.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this.values = {
      max: this.max,
      min: this.min,
      step: this.step,
    };

    this.role = 'spinbutton';
    this.addEventListener('keydown', this.__keyDownHandler);
    this._inputNode.setAttribute('inputmode', 'decimal');
    this._inputNode.setAttribute('autocomplete', 'off');
    this.setAttribute('aria-label', this.label);
    this.step = this.hasAttribute('step') ? this.step : 1;
    this.__setAriaLabelsAndValidator();
    this.__toggleSpinnerButtonsState();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('keydown', this.__keyDownHandler);
  }

  /** @param {import('@lion/core').PropertyValues } changedProperties */
  updated(changedProperties) {
    super.updated(changedProperties);

    if (changedProperties.has('modelValue')) {
      this.__toggleSpinnerButtonsState();
    }

    if (changedProperties.has('min')) {
      this._inputNode.min = `${this.min}`;
      this.values.min = this.min;
      this.__toggleSpinnerButtonsState();
    }

    if (changedProperties.has('max')) {
      this._inputNode.max = `${this.max}`;
      this.values.max = this.max;
      this.__toggleSpinnerButtonsState();
    }

    if (changedProperties.has('step')) {
      this._inputNode.step = `${this.step}`;
      this.values.step = this.step;
    }
  }

  get slots() {
    return {
      ...super.slots,
      prefix: () => this.__getDecrementButtonNode(),
      suffix: () => this.__getIncrementButtonNode(),
    };
  }

  /**
   * Set aria labels and apply validators
   * @private
   */
  __setAriaLabelsAndValidator() {
    const ariaAttributes = {
      'aria-valuemax': this.values.max,
      'aria-valuemin': this.values.min,
    };

    const minMaxValidators = /** @type {(MaxNumber | MinNumber)[]} */ (
      Object.entries(ariaAttributes)
        .map(([key, val]) => {
          if (val !== Infinity) {
            this.setAttribute(key, `${val}`);
            return key === 'aria-valuemax' ? new MaxNumber(val) : new MinNumber(val);
          }
          return null;
        })
        .filter(validator => validator !== null)
    );
    const validators = [new IsNumber(), ...minMaxValidators];
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
    const decrementButton = this.__getSlot('prefix');
    const incrementButton = this.__getSlot('suffix');
    const disableIncrementor = this.currentValue >= max && max !== Infinity;
    const disableDecrementor = this.currentValue <= min && min !== Infinity;
    decrementButton[disableDecrementor ? 'setAttribute' : 'removeAttribute']('disabled', 'true');
    incrementButton[disableIncrementor ? 'setAttribute' : 'removeAttribute']('disabled', 'true');
    this.setAttribute('aria-valuenow', `${this.currentValue}`);
  }

  /**
   * Get slotted element
   * @param {String} slotName - slot name
   * @returns {HTMLButtonElement|Object}
   * @private
   */
  __getSlot(slotName) {
    return (
      /** @type {HTMLElement[]} */ (Array.from(this.children)).find(
        child => child.slot === slotName,
      ) || {}
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
      this.value = `${newValue}`;
      this.__toggleSpinnerButtonsState();
      this._proxyInputEvent();
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
      this.value = `${newValue}`;
      this.__toggleSpinnerButtonsState();
      this._proxyInputEvent();
    }
  }

  /**
   * Get the increment button node
   * @returns {Element|null}
   * @private
   */
  __getIncrementButtonNode() {
    const renderParent = document.createElement('div');
    render(
      this._incrementorTemplate(),
      renderParent,
      /** @type {RenderOptions} */ ({
        scopeName: this.localName,
        eventContext: this,
      }),
    );
    return renderParent.firstElementChild;
  }

  /**
   * Get the decrement button node
   * @returns {Element|null}
   * @private
   */
  __getDecrementButtonNode() {
    const renderParent = document.createElement('div');
    render(
      this._decrementorTemplate(),
      renderParent,
      /** @type {RenderOptions} */ ({
        scopeName: this.localName,
        eventContext: this,
      }),
    );
    return renderParent.firstElementChild;
  }

  /**
   * Toggle +/- buttons on change
   * @override
   * @protected
   */
  _onChange() {
    super._onChange();
    this.__toggleSpinnerButtonsState();
  }

  /**
   * Get the decrementor button sign template
   * @returns {String|import('@lion/core').TemplateResult}
   * @protected
   */
  // eslint-disable-next-line class-methods-use-this
  _decrementorSignTemplate() {
    return '－';
  }

  /**
   * Get the incrementor button sign template
   * @returns {String|import('@lion/core').TemplateResult}
   * @protected
   */
  // eslint-disable-next-line class-methods-use-this
  _incrementorSignTemplate() {
    return '＋';
  }

  /**
   * Get the increment button template
   * @returns {import('@lion/core').TemplateResult}
   * @protected
   */
  _decrementorTemplate() {
    return html`
      <button
        ?disabled=${this.disabled || this.readOnly}
        @click=${this.__decrement}
        @blur=${this.__boundOnLeaveButton}
        tabindex="-1"
        type="button"
        aria-label="decrement"
      >
        ${this._decrementorSignTemplate()}
      </button>
    `;
  }

  /**
   * Get the decrement button template
   * @returns {import('@lion/core').TemplateResult}
   * @protected
   */
  _incrementorTemplate() {
    return html`
      <button
        ?disabled=${this.disabled || this.readOnly}
        @click=${this.__increment}
        @blur=${this.__boundOnLeaveButton}
        tabindex="-1"
        type="button"
        aria-label="increment"
      >
        ${this._incrementorSignTemplate()}
      </button>
    `;
  }

  /**
   * Redispatch leave event on host when catching leave event
   * on the incrementor and decrementor button.
   *
   * This redispatched leave event will be caught by
   * InteractionStateMixin to set "touched" state to true.
   *
   * Interacting with the buttons is "user interactions"
   * the same way as focusing + blurring the field (native input)
   */
  _onLeaveButton() {
    this.dispatchEvent(new Event(this._leaveEvent));
  }
}
