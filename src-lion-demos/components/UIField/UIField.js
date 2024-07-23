import { html, nothing } from 'lit';
import { UIBaseElement } from '../../../src/components/shared/UIBaseElement.js';
import { UIPartDirective } from '../../../src/components/shared/UIPartDirective.js';
import { assertPresentation } from '../../../src/components/shared/element-assertions.js';

import {
  InteractionStateMixin,
  FormControlMixin,
  ValidateMixin,
  FormatMixin,
  FocusMixin,
} from '@lion/ui/form-core.js';
import { SlotMixin } from '@lion/ui/core.js';

function assertLabel(element) {
  return element.tagName === 'LABEL';
}

export class SlotController {
  constructor(host, { slots }) {
    (this.host = host).addController(this);
    this.slots = slots;

    // Patch all slots templates of host.templates

    // Hook into the update lifecycle
  }
}

export class UIInputDirective extends UIPartDirective {
  setup(part, [context, name, localContext]) {
    const ctor = this.constructor;
    switch (name) {
      case 'root':
        ctor._setupRoot(part, { context, localContext });
        break;
      default:
        throw new Error(`Unknown part ${name}`);
    }
  }

  static _setupRoot({ element }, { context, localContext }) {
    assertPresentation(element);
    element.setAttribute('data-part', 'root');
    context.registerRef('root', element);
  }

  static _setupLabel({ element }, { context, localContext }) {
    assertLabel(element);
    element.setAttribute('data-part', 'label');
    context.registerRef('label', element);
  }

  static _setupHelpText({ element }, { context, localContext }) {
    // assertPresentation(element);
    element.setAttribute('data-part', 'help-text');
    context.registerRef('help-text', element);
  }
}

export class UIField extends FormControlMixin(
  InteractionStateMixin(FocusMixin(FormatMixin(ValidateMixin(SlotMixin(UIBaseElement))))),
) {
  static _partDirective = UIInputDirective;
  static tagName = 'ui-field';

  /**
   * @param {import('lit').PropertyValues} changedProperties
   */
  firstUpdated(changedProperties) {
    super.firstUpdated(changedProperties);
    /** @type {any} */
    this._initialModelValue = this.modelValue;
  }

  connectedCallback() {
    super.connectedCallback();
    this._onChange = this._onChange.bind(this);
    this._inputNode.addEventListener('change', this._onChange);
    this.classList.add('form-field'); // eslint-disable-line
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._inputNode.removeEventListener('change', this._onChange);
  }

  resetInteractionState() {
    super.resetInteractionState();
    this.submitted = false;
  }

  /**
   * Resets modelValue to initial value.
   * Interaction states are cleared
   */
  reset() {
    this.modelValue = this._initialModelValue;
    this.resetInteractionState();
  }

  /**
   * Clears modelValue.
   * Interaction states are not cleared (use resetInteractionState for this)
   */
  clear() {
    // TODO: [v1] set to undefined
    this.modelValue = '';
  }

  /**
   * Dispatches custom bubble event
   * @param {Event=} ev
   * @protected
   */
  // eslint-disable-next-line no-unused-vars
  _onChange(ev) {
    /** @protectedEvent user-input-changed */
    this.dispatchEvent(new Event('user-input-changed', { bubbles: true }));
  }

  /**
   * @configure InteractionStateMixin, ValidateMixin
   */
  get _feedbackConditionMeta() {
    return { ...super._feedbackConditionMeta, focused: this.focused };
  }

  /**
   * @configure FocusMixin
   */
  get _focusableNode() {
    return this._inputNode;
  }

  constructor() {
    super();

    this._slotController = new SlotController(this, { slots: ['label', 'help-text'] });
  }

  get templateContext() {
    const context = super.templateContext;
    return {
      ...context,
      data: {
        ...context.data,
        label: this.label,
        helpText: this.helpText,
      },
    };
  }

  static templates = {
    root(context) {
      const { data, templates, part } = context;

      return html`${templates.label(context)}${templates.helpText(context)}${templates.control(
        context,
      )}`;
    },
    label(context) {
      const { data, templates, part } = context;

      return html`<label>${data.label}</label>`;
    },
    helpText(context) {
      const { data, templates, part } = context;

      return html`<div>${data.helpText}</div>`;
    },
    control(context) {
      const { data, templates, part } = context;

      return html`<input />`;
    },
  };
}
UIField.prototype.render = UIBaseElement.prototype.render;
