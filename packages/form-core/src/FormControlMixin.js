import { css, dedupeMixin, html, nothing, SlotMixin, DisabledMixin } from '@lion/core';
import { FormRegisteringMixin } from './registration/FormRegisteringMixin.js';
import { getAriaElementsInRightDomOrder } from './utils/getAriaElementsInRightDomOrder.js';
import { Unparseable } from './validate/Unparseable.js';

/**
 * @typedef {import('@lion/core').TemplateResult} TemplateResult
 * @typedef {import('@lion/core').CSSResult} CSSResult
 * @typedef {import('@lion/core').nothing} nothing
 * @typedef {import('@lion/core/types/SlotMixinTypes').SlotsMap} SlotsMap
 * @typedef {import('../types/FormControlMixinTypes.js').FormControlMixin} FormControlMixin
 * @typedef {import('../types/FormControlMixinTypes.js').ModelValueEventDetails} ModelValueEventDetails
 */

/**
 * Generates random unique identifier (for dom elements)
 * @param {string} prefix
 */
function uuid(prefix) {
  return `${prefix}-${Math.random().toString(36).substr(2, 10)}`;
}

/**
 * #FormControlMixin :
 *
 * This Mixin is a shared fundament for all form components, it's applied on:
 * - LionField (which is extended to LionInput, LionTextarea, LionSelect etc. etc.)
 * - LionFieldset (which is extended to LionRadioGroup, LionCheckboxGroup, LionForm)
 * @param {import('@open-wc/dedupe-mixin').Constructor<import('@lion/core').LitElement>} superclass
 * @type {FormControlMixin}
 */
const FormControlMixinImplementation = superclass =>
  // eslint-disable-next-line no-shadow, no-unused-vars
  class FormControlMixin extends FormRegisteringMixin(DisabledMixin(SlotMixin(superclass))) {
    /** @type {any} */
    static get properties() {
      return {
        /**
         * The name the element will be registered on to the .formElements collection
         * of the parent.
         */
        name: {
          type: String,
          reflect: true,
        },
        /**
         * A Boolean attribute which, if present, indicates that the user should not be able to edit
         * the value of the input. The difference between disabled and readonly is that read-only
         * controls can still function, whereas disabled controls generally do not function as
         * controls until they are enabled.
         *
         * (From: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-readonly)
         */
        readOnly: {
          type: Boolean,
          attribute: 'readonly',
          reflect: true,
        },
        /**
         * The label text for the input node.
         * When no light dom defined via [slot=label], this value will be used
         */
        label: String, // FIXME: { attribute: false } breaks a bunch of tests, but shouldn't...
        /**
         * The helpt text for the input node.
         * When no light dom defined via [slot=help-text], this value will be used
         */
        helpText: {
          type: String,
          attribute: 'help-text',
        },

        /**
         * The model value is the result of the parser function(when available).
         * It should be considered as the internal value used for validation and reasoning/logic.
         * The model value is 'ready for consumption' by the outside world (think of a Date
         * object or a float). The modelValue can(and is recommended to) be used as both input
         * value and output value of the `LionField`.
         *
         * Examples:
         * - For a date input: a String '20/01/1999' will be converted to new Date('1999/01/20')
         * - For a number input: a formatted String '1.234,56' will be converted to a Number:
         *   1234.56
         */
        modelValue: { attribute: false },

        /**
         * Contains all elements that should end up in aria-labelledby of `._inputNode`
         */
        _ariaLabelledNodes: { attribute: false },
        /**
         * Contains all elements that should end up in aria-describedby of `._inputNode`
         */
        _ariaDescribedNodes: { attribute: false },
        /**
         * Based on the role, details of handling model-value-changed repropagation differ.
         */
        _repropagationRole: { attribute: false },
        /**
         * By default, a field with _repropagationRole 'choice-group' will act as an
         * 'endpoint'. This means it will be considered as an individual field: for
         * a select, individual options will not be part of the formPath. They
         * will.
         * Similarly, components that (a11y wise) need to be fieldsets, but 'interaction wise'
         * (from Application Developer perspective) need to be more like fields
         * (think of an amount-input with a currency select box next to it), can set this
         * to true to hide private internals in the formPath.
         */
        _isRepropagationEndpoint: { attribute: false },
      };
    }

    /**
     * @return {string}
     */
    get label() {
      return this.__label || (this._labelNode && this._labelNode.textContent) || '';
    }

    /**
     * @param {string} newValue
     */
    set label(newValue) {
      const oldValue = this.label;
      /** @type {string} */
      this.__label = newValue;
      this.requestUpdate('label', oldValue);
    }

    /**
     * @return {string}
     */
    get helpText() {
      return this.__helpText || (this._helpTextNode && this._helpTextNode.textContent) || '';
    }

    /**
     * @param {string} newValue
     */
    set helpText(newValue) {
      const oldValue = this.helpText;
      /** @type {string} */
      this.__helpText = newValue;
      this.requestUpdate('helpText', oldValue);
    }

    /**
     * @return {string}
     */
    get fieldName() {
      return this.__fieldName || this.label || this.name || '';
    }

    /**
     * @param {string} value
     */
    set fieldName(value) {
      /** @type {string} */
      this.__fieldName = value;
    }

    /**
     * @return {SlotsMap}
     */
    get slots() {
      return {
        ...super.slots,
        label: () => {
          const label = document.createElement('label');
          label.textContent = this.label;
          return label;
        },
        'help-text': () => {
          const helpText = document.createElement('div');
          helpText.textContent = this.helpText;
          return helpText;
        },
      };
    }

    get _inputNode() {
      return this.__getDirectSlotChild('input');
    }

    get _labelNode() {
      return this.__getDirectSlotChild('label');
    }

    get _helpTextNode() {
      return this.__getDirectSlotChild('help-text');
    }

    get _feedbackNode() {
      return /** @type {import('./validate/LionValidationFeedback').LionValidationFeedback | undefined} */ (this.__getDirectSlotChild(
        'feedback',
      ));
    }

    constructor() {
      super();
      /** @type {string | undefined} */
      this.name = undefined;
      /** @type {string} */
      this._inputId = uuid(this.localName);
      /** @type {HTMLElement[]} */
      this._ariaLabelledNodes = [];
      /** @type {HTMLElement[]} */
      this._ariaDescribedNodes = [];
      /** @type {'child'|'choice-group'|'fieldset'} */
      this._repropagationRole = 'child';
      this._isRepropagationEndpoint = false;
      this.addEventListener(
        'model-value-changed',
        /** @type {EventListenerOrEventListenerObject} */ (this.__repropagateChildrenValues),
      );
      /** @type {EventListener} */
      this._onLabelClick = this._onLabelClick.bind(this);
    }

    connectedCallback() {
      super.connectedCallback();
      this._enhanceLightDomClasses();
      this._enhanceLightDomA11y();
      this._triggerInitialModelValueChangedEvent();

      if (this._labelNode) {
        this._labelNode.addEventListener('click', this._onLabelClick);
      }
    }

    disconnectedCallback() {
      super.disconnectedCallback();
      if (this._labelNode) {
        this._labelNode.removeEventListener('click', this._onLabelClick);
      }
    }

    /** @param {import('@lion/core').PropertyValues } changedProperties */
    updated(changedProperties) {
      super.updated(changedProperties);

      if (changedProperties.has('_ariaLabelledNodes')) {
        this.__reflectAriaAttr(
          'aria-labelledby',
          this._ariaLabelledNodes,
          this.__reorderAriaLabelledNodes,
        );
      }

      if (changedProperties.has('_ariaDescribedNodes')) {
        this.__reflectAriaAttr(
          'aria-describedby',
          this._ariaDescribedNodes,
          this.__reorderAriaDescribedNodes,
        );
      }

      if (changedProperties.has('label') && this._labelNode) {
        this._labelNode.textContent = this.label;
      }

      if (changedProperties.has('helpText') && this._helpTextNode) {
        this._helpTextNode.textContent = this.helpText;
      }

      if (changedProperties.has('name')) {
        this.dispatchEvent(
          new CustomEvent('form-element-name-changed', {
            detail: { oldName: changedProperties.get('name'), newName: this.name },
            bubbles: true,
          }),
        );
      }
    }

    _triggerInitialModelValueChangedEvent() {
      this.__dispatchInitialModelValueChangedEvent();
    }

    _enhanceLightDomClasses() {
      if (this._inputNode) {
        this._inputNode.classList.add('form-control');
      }
    }

    _enhanceLightDomA11y() {
      const { _inputNode, _labelNode, _helpTextNode, _feedbackNode } = this;

      if (_inputNode) {
        _inputNode.id = _inputNode.id || this._inputId;
      }
      if (_labelNode) {
        _labelNode.setAttribute('for', this._inputId);
        this.addToAriaLabelledBy(_labelNode, { idPrefix: 'label' });
      }
      if (_helpTextNode) {
        this.addToAriaDescribedBy(_helpTextNode, { idPrefix: 'help-text' });
      }
      if (_feedbackNode) {
        _feedbackNode.setAttribute('aria-live', 'polite');
        this.addToAriaDescribedBy(_feedbackNode, { idPrefix: 'feedback' });
      }
      this._enhanceLightDomA11yForAdditionalSlots();
    }

    /**
     * Enhances additional slots(prefix, suffix, before, after) defined by developer.
     *
     * When boolean attribute data-label or data-description is found,
     * the slot element will be connected to the input via aria-labelledby or aria-describedby
     * @param {string[]} additionalSlots
     */
    _enhanceLightDomA11yForAdditionalSlots(
      additionalSlots = ['prefix', 'suffix', 'before', 'after'],
    ) {
      additionalSlots.forEach(additionalSlot => {
        const element = this.__getDirectSlotChild(additionalSlot);
        if (element) {
          if (element.hasAttribute('data-label') === true) {
            this.addToAriaLabelledBy(element, { idPrefix: additionalSlot });
          }
          if (element.hasAttribute('data-description') === true) {
            this.addToAriaDescribedBy(element, { idPrefix: additionalSlot });
          }
        }
      });
    }

    /**
     * Will handle help text, validation feedback and character counter,
     * prefix/suffix/before/after (if they contain data-description flag attr).
     * Also, contents of id references that will be put in the <lion-field>._ariaDescribedby property
     * from an external context, will be read by a screen reader.
     * @param {string} attrName
     * @param {HTMLElement[]} nodes
     * @param {boolean|undefined} reorder
     */
    __reflectAriaAttr(attrName, nodes, reorder) {
      if (this._inputNode) {
        if (reorder) {
          const insideNodes = nodes.filter(n => this.contains(n));
          const outsideNodes = nodes.filter(n => !this.contains(n));
          // eslint-disable-next-line no-param-reassign
          nodes = [...getAriaElementsInRightDomOrder(insideNodes), ...outsideNodes];
        }
        const string = nodes.map(n => n.id).join(' ');
        this._inputNode.setAttribute(attrName, string);
      }
    }

    /**
     * Default Render Result:
     * <div class="form-field__group-one">
     *   <div class="form-field__label">
     *     <slot name="label"></slot>
     *   </div>
     *   <small class="form-field__help-text">
     *     <slot name="help-text"></slot>
     *   </small>
     * </div>
     * <div class="form-field__group-two">
     *   <div class="input-group">
     *     <div class="input-group__before">
     *       <slot name="before"></slot>
     *     </div>
     *     <div class="input-group__container">
     *       <div class="input-group__prefix">
     *         <slot name="prefix"></slot>
     *       </div>
     *       <div class="input-group__input">
     *         <slot name="input"></slot>
     *       </div>
     *       <div class="input-group__suffix">
     *         <slot name="suffix"></slot>
     *       </div>
     *     </div>
     *     <div class="input-group__after">
     *       <slot name="after"></slot>
     *     </div>
     *   </div>
     *   <div class="form-field__feedback">
     *     <slot name="feedback"></slot>
     *   </div>
     * </div>
     */
    render() {
      return html`
        <div class="form-field__group-one">${this._groupOneTemplate()}</div>
        <div class="form-field__group-two">${this._groupTwoTemplate()}</div>
      `;
    }

    /**
     * @return {TemplateResult}
     */
    _groupOneTemplate() {
      return html` ${this._labelTemplate()} ${this._helpTextTemplate()} `;
    }

    /**
     * @return {TemplateResult}
     */
    _groupTwoTemplate() {
      return html` ${this._inputGroupTemplate()} ${this._feedbackTemplate()} `;
    }

    /**
     * @return {TemplateResult}
     */
    // eslint-disable-next-line class-methods-use-this
    _labelTemplate() {
      return html`
        <div class="form-field__label">
          <slot name="label"></slot>
        </div>
      `;
    }

    /**
     * @return {TemplateResult}
     */
    // eslint-disable-next-line class-methods-use-this
    _helpTextTemplate() {
      return html`
        <small class="form-field__help-text">
          <slot name="help-text"></slot>
        </small>
      `;
    }

    /**
     * @return {TemplateResult}
     */
    _inputGroupTemplate() {
      return html`
        <div class="input-group">
          ${this._inputGroupBeforeTemplate()}
          <div class="input-group__container">
            ${this._inputGroupPrefixTemplate()} ${this._inputGroupInputTemplate()}
            ${this._inputGroupSuffixTemplate()}
          </div>
          ${this._inputGroupAfterTemplate()}
        </div>
      `;
    }

    /**
     * @return {TemplateResult}
     */
    // eslint-disable-next-line class-methods-use-this
    _inputGroupBeforeTemplate() {
      return html`
        <div class="input-group__before">
          <slot name="before"></slot>
        </div>
      `;
    }

    /**
     * @return {TemplateResult | nothing}
     */
    _inputGroupPrefixTemplate() {
      return !Array.from(this.children).find(child => child.slot === 'prefix')
        ? nothing
        : html`
            <div class="input-group__prefix">
              <slot name="prefix"></slot>
            </div>
          `;
    }

    /**
     * @return {TemplateResult}
     */
    // eslint-disable-next-line class-methods-use-this
    _inputGroupInputTemplate() {
      return html`
        <div class="input-group__input">
          <slot name="input"></slot>
        </div>
      `;
    }

    /**
     * @return {TemplateResult | nothing}
     */
    _inputGroupSuffixTemplate() {
      return !Array.from(this.children).find(child => child.slot === 'suffix')
        ? nothing
        : html`
            <div class="input-group__suffix">
              <slot name="suffix"></slot>
            </div>
          `;
    }

    /**
     * @return {TemplateResult}
     */
    // eslint-disable-next-line class-methods-use-this
    _inputGroupAfterTemplate() {
      return html`
        <div class="input-group__after">
          <slot name="after"></slot>
        </div>
      `;
    }

    /**
     * @return {TemplateResult}
     */
    // eslint-disable-next-line class-methods-use-this
    _feedbackTemplate() {
      return html`
        <div class="form-field__feedback">
          <slot name="feedback"></slot>
        </div>
      `;
    }

    /**
     * @param {?} modelValue
     * @return {boolean}
     */
    // @ts-ignore FIXME: Move to FormatMixin? Since there we have access to modelValue prop
    _isEmpty(modelValue = this.modelValue) {
      let value = modelValue;
      // @ts-ignore
      if (this.modelValue instanceof Unparseable) {
        // @ts-ignore
        value = this.modelValue.viewValue;
      }

      // Checks for empty platform types: Objects, Arrays, Dates
      if (typeof value === 'object' && value !== null && !(value instanceof Date)) {
        return !Object.keys(value).length;
      }

      // eslint-disable-next-line no-mixed-operators
      // Checks for empty platform types: Numbers, Booleans
      const isNumberValue = typeof value === 'number' && (value === 0 || Number.isNaN(value));
      const isBooleanValue = typeof value === 'boolean' && value === false;

      return !value && !isNumberValue && !isBooleanValue;
    }

    /**
     * All CSS below is written from a generic mindset, following BEM conventions:
     * https://en.bem.info/methodology/
     * Although the CSS and HTML are implemented by the component, they should be regarded as
     * totally decoupled.
     *
     * Not only does this force us to write better structured css, it also allows for future
     * reusability in many different ways like:
     *  - disabling shadow DOM for a component (for water proof encapsulation can be combined with
     *    a build step)
     *  - easier translation to more flexible, WebComponents agnostic solutions like JSS
     *    (allowing extends, mixins, reasoning, IDE integration, tree shaking etc.)
     *  - export to a CSS module for reuse in an outer context
     *
     *
     * Please note that the HTML structure is purposely 'loose', allowing multiple design systems
     * to be compatible
     * with the CSS component.
     * Note that every occurence of '::slotted(*)' can be rewritten to '> *' for use in an other
     * context
     */

    /**
     * {block} .form-field
     *
     * Structure:
     * - {element}  .form-field__label : a wrapper element around the projected label
     * - {element}  .form-field__help-text (optional) : a wrapper element around the projected
     *               help-text
     * - {block}    .input-group : a container around the input element, including prefixes and
     *               suffixes
     * - {element}  .form-field__feedback (optional) : a wrapper element around the projected
     *               (validation) feedback message
     *
     * Modifiers:
     * - {state} [disabled] when .form-control (<input>, <textarea> etc.) has disabled set
     *            to true
     * - {state} [filled] whether <input> has a value
     * - {state} [touched] whether the user had blurred the field once
     * - {state} [dirty] whether the value has changed since initial value
     *
     * TODO: update states below
     * These classes are now attributes. Check them agains the new attribute names inside ValidateMixin
     * and InteractionStateMixin. Some states got renamed. Make sure to use the correct ones!
     * - {state} .state-focused: when .form-control (<input>, <textarea> etc.) <input> has focus
     * - {state} .state-invalid: when input has error(s) (regardless of whether they should be
     *            shown to the user)
     * - {state} .state-error: when input has error(s) and this/these should be shown to the user
     * - {state} .state-warning: when input has warning(s) and this/these should be shown to the
     *            user
     * - {state} .state-info: when input has info feedback message(s) and this/these should be shown
     *            to the user
     * - {state} .state-success: when input has success feedback message(s) and this/these should be
     *            shown to the user
     */

    /**
     * {block} .input-group
     *
     * Structure:
     * - {element} .input-group__before (optional) : a prefix that resides outside the container
     * - {element} .input-group__container : an inner container: this element contains all styling
     *  - {element} .input-group__prefix (optional) : a prefix that resides in the container,
     *               allowing it to be detectable as a :first-child
     *  - {element} .input-group__input : a wrapper around the form-control component
     *   - {block} .form-control : the actual input element (input/select/textarea)
     *  - {element} .input-group__suffix (optional) : a suffix that resides inside the container,
     *               allowing it to be detectable as a :last-child
     *  - {element} .input-group__bottom (optional) : placeholder element for additional styling
     *               (like an animated line for material design input)
     * - {element} .input-group__after (optional) :  a suffix that resides outside the container
     */
    static get styles() {
      return [
        super.styles || [],
        css`
          /**********************
            {block} .form-field
           ********************/

          :host {
            display: block;
          }

          :host([hidden]) {
            display: none;
          }

          :host([disabled]) {
            pointer-events: none;
          }

          :host([disabled]) .form-field__label ::slotted(*),
          :host([disabled]) .form-field__help-text ::slotted(*) {
            color: var(--disabled-text-color, #767676);
          }

          /***********************
            {block} .input-group
           *********************/

          .input-group__container {
            display: flex;
          }

          .input-group__input {
            flex: 1;
            display: flex;
          }

          /***** {state} :disabled *****/
          :host([disabled]) .input-group ::slotted(slot='input') {
            color: var(--disabled-text-color, #767676);
          }

          /***********************
            {block} .form-control
           **********************/

          .input-group__container > .input-group__input ::slotted(.form-control) {
            flex: 1 1 auto;
            margin: 0; /* remove input margin in Safari */
            font-size: 100%; /* normalize default input font-size */
          }
        `,
      ];
    }

    /**
     * @return {Array.<HTMLElement|undefined>}
     */
    // Returns dom references to all elements that should be referred to by field(s)
    _getAriaDescriptionElements() {
      return [this._helpTextNode, this._feedbackNode];
    }

    /**
     * Meant for Application Developers wanting to add to aria-labelledby attribute.
     * @param {HTMLElement} element
     * @param {{idPrefix?:string; reorder?: boolean}} customConfig
     */
    addToAriaLabelledBy(element, customConfig = {}) {
      const { idPrefix, reorder } = {
        reorder: true,
        ...customConfig,
      };

      // eslint-disable-next-line no-param-reassign
      element.id = element.id || `${idPrefix}-${this._inputId}`;
      if (!this._ariaLabelledNodes.includes(element)) {
        this._ariaLabelledNodes = [...this._ariaLabelledNodes, element];
        // This value will be read when we need to reflect to attr
        /** @type {boolean} */
        this.__reorderAriaLabelledNodes = Boolean(reorder);
      }
    }

    /**
     * Meant for Application Developers wanting to add to aria-describedby attribute.
     * @param {HTMLElement} element
     * @param {{idPrefix?:string; reorder?: boolean}} customConfig
     */
    addToAriaDescribedBy(element, customConfig = {}) {
      const { idPrefix, reorder } = {
        // chronologically sorts children of host element('this')
        reorder: true,
        ...customConfig,
      };

      // eslint-disable-next-line no-param-reassign
      element.id = element.id || `${idPrefix}-${this._inputId}`;
      if (!this._ariaDescribedNodes.includes(element)) {
        this._ariaDescribedNodes = [...this._ariaDescribedNodes, element];
        // This value will be read when we need to reflect to attr
        /** @type {boolean} */
        this.__reorderAriaDescribedNodes = Boolean(reorder);
      }
    }

    /**
     * @param {string} slotName
     * @return {HTMLElement | undefined}
     */
    __getDirectSlotChild(slotName) {
      return /** @type {HTMLElement[]} */ (Array.from(this.children)).find(
        el => el.slot === slotName,
      );
    }

    __dispatchInitialModelValueChangedEvent() {
      // When we are not a fieldset / choice-group, we don't need to wait for our children
      // to send a unified event
      if (this._repropagationRole === 'child') {
        return;
      }

      // Initially we don't repropagate model-value-changed events coming
      // from children. On firstUpdated we re-dispatch this event to maintain
      // 'count consistency' (to not confuse the application developer with a
      // large number of initial events). Initially the source field will not
      // be part of the formPath but afterwards it will.
      /** @type {boolean} */
      this.__repropagateChildrenInitialized = true;
      this.dispatchEvent(
        new CustomEvent('model-value-changed', {
          bubbles: true,
          detail: /** @type {ModelValueEventDetails} */ ({
            formPath: [this],
            initialize: true,
            isTriggeredByUser: false,
          }),
        }),
      );
    }

    /**
     * @param {CustomEvent} ev
     */
    // eslint-disable-next-line class-methods-use-this, no-unused-vars
    _onBeforeRepropagateChildrenValues(ev) {}

    /**
     * @param {CustomEvent} ev
     */
    __repropagateChildrenValues(ev) {
      // Allows sub classes to internally listen to the children change events
      // (before stopImmediatePropagation is called below).
      this._onBeforeRepropagateChildrenValues(ev);
      // Normalize target, we also might get it from 'portals' (rich select)
      const target = (ev.detail && ev.detail.element) || ev.target;
      const isEndpoint =
        this._isRepropagationEndpoint || this._repropagationRole === 'choice-group';

      // Prevent eternal loops after we sent the event below.
      if (target === this) {
        return;
      }

      // A. Stop sibling handlers
      //
      // Make sure our sibling event listeners (added by Application developers) will not get
      // the child model-value-changed event, but the repropagated one at the bottom of this
      // method
      ev.stopImmediatePropagation();

      // B1. Are we still initializing? If so, halt...
      //
      // Stop repropagating children events before firstUpdated and make sure we de not
      // repropagate init events of our children (we already sent our own
      // initial model-value-change event in firstUpdated)
      const isGroup = this._repropagationRole !== 'child'; // => fieldset or choice-group
      const isSelfInitializing = isGroup && !this.__repropagateChildrenInitialized;
      const isChildGroupInitializing = ev.detail && ev.detail.initialize;
      if (isSelfInitializing || isChildGroupInitializing) {
        return;
      }

      // B2. Are we a single choice choice-group? If so, halt when target unchecked
      // and something else is checked, meaning we will get
      // another model-value-changed dispatch for the checked target
      //
      // We only send the checked changed up (not the unchecked). In this way a choice group
      // (radio-group, checkbox-group, select/listbox) acts as an 'endpoint' (a single Field)
      // just like the native <select>
      if (!this._repropagationCondition(target)) {
        return;
      }

      // C1. We are ready to dispatch. Create a formPath
      //
      // Compute the formPath. Choice groups are regarded 'end points'
      let parentFormPath = [];
      if (!isEndpoint) {
        parentFormPath = (ev.detail && ev.detail.formPath) || [target];
      }
      const formPath = [...parentFormPath, this];

      // C2. Finally, redispatch a fresh model-value-changed event from our host, consumable
      // for an Application Developer
      //
      // Since for a11y everything needs to be in lightdom, we don't add 'composed:true'
      this.dispatchEvent(
        new CustomEvent('model-value-changed', {
          bubbles: true,
          detail: /** @type {ModelValueEventDetails} */ ({
            formPath,
            isTriggeredByUser: Boolean(ev.detail?.isTriggeredByUser),
          }),
        }),
      );
    }

    /**
     * TODO: Extend this in choice group so that target is always a choice input and multipleChoice exists.
     * This will fix the types and reduce the need for ignores/expect-errors
     * @param {EventTarget & import('../types/choice-group/ChoiceInputMixinTypes').ChoiceInputHost} target
     */
    _repropagationCondition(target) {
      return !(
        this._repropagationRole === 'choice-group' &&
        // @ts-expect-error multipleChoice is not directly available but only as side effect
        !this.multipleChoice &&
        !target.checked
      );
    }

    /**
     * @overridable
     * A Subclasser should only override this method if the interactive element
     * ([slot=input]) is not a native element(like input, textarea, select)
     * that already receives focus on label click.
     *
     * @example
     * _onLabelClick() {
     *   this._invokerNode.focus();
     * }
     */
    // eslint-disable-next-line class-methods-use-this
    _onLabelClick() {}
  };

export const FormControlMixin = dedupeMixin(FormControlMixinImplementation);
