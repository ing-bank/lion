import { LionField } from '@lion/field';

function getInitialValue(input) {
  const min = parseFloat(input.min || 0);
  const max = parseFloat(input.max || 100);
  const step = parseFloat(input.step || 1);
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

  constructor() {
    super();

    this.parser = parser;
  }

  get delegations() {
    return {
      ...super.delegations,
      target: () => this.inputElement,
      attributes: [...super.delegations.attributes, 'min', 'max', 'step', 'list', 'autocomplete'],
      properties: [
        ...super.delegations.properties,
        'min',
        'max',
        'step',
        'list',
        'autocomplete',
        'valueAsNumber',
        'stepUp',
        'stepDown',
      ],
    };
  }

  get slots() {
    return {
      ...super.slots,
      input: () => {
        const native = document.createElement('input');

        native.setAttribute('type', 'range');

        if (this.min) {
          this.__setAttribute(native, 'min', this.min);
        }

        if (this.max) {
          this.__setAttribute(native, 'max', this.max);
        }

        if (this.step) {
          this.__setAttribute(native, 'step', this.step);
        }

        this.__setAttribute(native, 'value', getInitialValue(native));

        return native;
      },
    };
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
    const newValue = this.parser(this.inputElement.value);

    if (this.modelValue !== newValue) {
      this.modelValue = newValue;
      this.__fireEvent('min-changed');
    }
  }

  /**
   * Fired when max value changed. This method fires the 'change' event to
   * notify parent components that the input has been changed.
   * @protected
   */
  _onMaxChanged() {
    const newValue = this.parser(this.inputElement.value);

    if (this.modelValue !== newValue) {
      this.modelValue = newValue;
      this.__fireEvent('max-changed');
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

  __setAttribute(native, name, defaultValue) {
    native.setAttribute(name, this.hasAttribute(name) ? this.getAttribute(name) : defaultValue);
  }
}
