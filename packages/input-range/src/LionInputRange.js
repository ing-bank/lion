import { LionField } from '@lion/field';

function getInitialValue(minValue, maxValue, stepValue) {
  const min = parseFloat(minValue || 0);
  const max = parseFloat(maxValue || 100);
  const step = parseFloat(stepValue || 1);
  const value = (max - min) / 2 + min;

  return Math.floor(value / step) * step;
}

function parser(v) {
  return parseFloat(v);
}

/**
 * `LionInputRange` is an extension of lion-field with native input[type=range] element in place
 * and user friendly API.
 *
 * @customElement
 * @extends {LionField}
 */
export class LionInputRange extends LionField {
  static get syncObservers() {
    return {
      ...super.syncObservers,
      _onMinChanged: ['min'],
      _onMaxChanged: ['max'],
    };
  }

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
      autocomplete: {
        type: String,
      },
    };
  }

  constructor() {
    super();

    this.min = undefined;
    this.max = undefined;
    this.step = undefined;
    this.list = undefined;
    this.autocomplete = undefined;
    this.parser = parser;
  }

  get slots() {
    return {
      ...super.slots,
      input: () => {
        const native = document.createElement('input');

        native.setAttribute('type', 'range');

        if (this.hasAttribute('min')) {
          native.setAttribute('min', this.getAttribute('min'));
        }

        if (this.hasAttribute('max')) {
          native.setAttribute('max', this.getAttribute('max'));
        }

        if (this.hasAttribute('step')) {
          native.setAttribute('step', this.getAttribute('step'));
        }

        if (this.hasAttribute('value')) {
          native.setAttribute('value', this.getAttribute('value'));
        } else {
          native.setAttribute('value', getInitialValue(this.min, this.max, this.step));
        }

        return native;
      },
    };
  }

  _requestUpdate(name, oldValue) {
    super._requestUpdate(name, oldValue);

    switch (name) {
      case 'min':
        this.__delegateMin();
        break;
      case 'max':
        this.__delegateMax();
        break;
      case 'step':
        this.__delegateStep();
        break;
      case 'list':
        this.__delegateList();
        break;
      case 'autocomplete':
        this.__delegateAutocomplete();
        break;
      default:
    }
  }

  get valueAsNumber() {
    return this.inputElement && this.inputElement.valueAsNumber;
  }

  stepUp() {
    return this.inputElement && this.inputElement.stepUp();
  }

  stepDown() {
    return this.inputElement && this.inputElement.stepDown();
  }

  firstUpdated(c) {
    super.firstUpdated(c);

    this.__delegateMin();
    this.__delegateMax();
    this.__delegateStep();
    this.__delegateList();
    this.__delegateAutocomplete();
  }

  __delegateMin() {
    if (this.inputElement) {
      this.inputElement.min = this.min;
    }
  }

  __delegateMax() {
    if (this.inputElement) {
      this.inputElement.max = this.max;
    }
  }

  __delegateStep() {
    if (this.inputElement) {
      this.inputElement.step = this.step;
    }
  }

  __delegateList() {
    if (this.inputElement) {
      this.inputElement.setAttribute('list', this.getAttribute('list'));
    }
  }

  __delegateAutocomplete() {
    if (this.inputElement) {
      this.inputElement.autocomplete = this.autocomplete;
    }
  }

  _onModelValueChanged(...args) {
    super._onModelValueChanged(args);

    if (args && args[0] && this.inputElement) {
      this.inputElement.value = args[0].modelValue.toString();
    }
  }

  /**
   * Fired when min value changed. This method fires the 'change' event to
   * notify parent components that the input has been changed.
   * @protected
   */
  _onMinChanged() {
    if (this.inputElement) {
      const newValue = this.parser(this.inputElement.value);

      if (this.modelValue !== newValue) {
        this.modelValue = newValue;
        this.__fireEvent('min-changed');
      }
    }
  }

  /**
   * Fired when max value changed. This method fires the 'change' event to
   * notify parent components that the input has been changed.
   * @protected
   */
  _onMaxChanged() {
    if (this.inputElement) {
      const newValue = this.parser(this.inputElement.value);

      if (this.modelValue !== newValue) {
        this.modelValue = newValue;
        this.__fireEvent('max-changed');
      }
    }
  }

  /**
   * Fires the 'change' event from the inputElement.
   * @private
   */
  __fireEvent(eventName) {
    this.inputElement.dispatchEvent(
      new CustomEvent(eventName, {
        bubbles: true,
        composed: true,
      }),
    );
  }
}
