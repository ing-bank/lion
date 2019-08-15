import { LitElement } from '@lion/core';
import { FormRegistrarMixin } from '@lion/field';

function uuid() {
  return Math.random()
    .toString(36)
    .substr(2, 10);
}

/**
 * LionOptions
 *
 * @customElement lion-options
 * @extends LitElement
 */
export class LionOptions extends FormRegistrarMixin(LitElement) {
  static get properties() {
    return {
      role: {
        type: String,
        reflect: true,
      },
      tabIndex: {
        type: Number,
        reflect: true,
        attribute: 'tabindex',
      },
    };
  }

  constructor() {
    super();
    this.role = 'listbox';
    // we made it a Lit-Element property because of this
    // eslint-disable-next-line wc/no-constructor-attributes
    this.tabIndex = 0;
  }

  createRenderRoot() {
    return this;
  }

  /**
   * Overrides FormRegistrar adding to make sure children have specific default states when added
   *
   * @override
   * @param {FormControl} child
   */
  addFormElement(child) {
    super.addFormElement(child);
    // we need to adjust the elements being registered
    /* eslint-disable no-param-reassign */
    child.id = child.id || `${this.localName}-option-${uuid()}`;

    if (this.disabled) {
      child.makeRequestToBeDisabled();
    }
    // the first elements checked by default
    if (!this.__hasInitialSelectedFormElement && (!child.disabled || this.disabled)) {
      child.active = true;
      child.checked = true;
      this.__hasInitialSelectedFormElement = true;
    }

    this.__setAttributeForAllFormElements('aria-setsize', this.formElements.length);
    child.setAttribute('aria-posinset', this.formElements.length);

    console.log('addFormElement', child);


    // TODO: notify parent and do there
    // this.__onChildModelValueChanged({ target: child });
    // this.resetInteractionState();
    /* eslint-enable no-param-reassign */
  }

  __setAttributeForAllFormElements(attribute, value) {
    this.formElements.forEach(formElement => {
      formElement.setAttribute(attribute, value);
    });
  }
}
