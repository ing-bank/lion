import { LitElement } from 'lit';
import { InteractionStateMixin, ValidateMixin } from '@lion/ui/form-core.js';
import { runInteractionStateMixinSuite } from '../test-suites/InteractionStateMixin.suite.js';

runInteractionStateMixinSuite();

class CustomFeedbackState extends InteractionStateMixin(ValidateMixin(LitElement)) {
  static get validationTypes() {
    return ['error', 'warning'];
  }

  connectedCallback() {
    super.connectedCallback();
    this.tabIndex = 0;
  }

  set modelValue(value) {
    /** @type {*} */
    this._modelValue = value;
    this.dispatchEvent(new CustomEvent('model-value-changed', { bubbles: true }));
    this.requestUpdate('modelValue');
  }

  /** @returns {*} */
  get modelValue() {
    return this._modelValue;
  }

  /**
   * @param {string} type
   * @param {object} meta
   * @param {(type: string, meta: object) => boolean} defaultCondition
   */
  feedbackCondition(type, meta, defaultCondition) {
    return type === 'warning' ? this.submitted : defaultCondition(type, meta);
  }
}

runInteractionStateMixinSuite({
  classes: { host: CustomFeedbackState },
  submittedFeedbackTypes: ['error', 'warning'],
});
