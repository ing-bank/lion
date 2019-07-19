import { html, css, nothing, dedupeMixin, SlotMixin } from '@lion/core';
import { ObserverMixin } from '@lion/core/src/ObserverMixin.js';
import { FormRegisteringMixin } from './FormRegisteringMixin.js';

/**
 * #FormControlMixin :
 *
 * This Mixin is a shared fundament for all form components, it's applied on:
 * - LionField (which is extended to LionInput, LionTextarea, LionSelect etc. etc.)
 * - LionFieldset (which is extended to LionRadioGroup, LionCheckboxGroup, LionForm)
 *
 * @polymerMixin
 * @mixinFunction
 */
export const FormControlMixin = dedupeMixin(
  superclass =>
    // eslint-disable-next-line no-shadow, no-unused-vars
    class FormControlMixin extends FormRegisteringMixin(ObserverMixin(SlotMixin(superclass))) {
      static get properties() {
        return {
          ...super.properties,
          /**
           * A list of ids that will be put on the inputElement as a serialized string
           */
          _ariaDescribedby: {
            type: String,
          },

          /**
           * A list of ids that will be put on the inputElement as a serialized string
           */
          _ariaLabelledby: {
            type: String,
          },

          /**
           * When no light dom defined and prop set
           */
          label: {
            type: String,
          },

          /**
           * When no light dom defined and prop set
           */
          helpText: {
            type: String,
            attribute: 'help-text',
          },
        };
      }

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

      static get asyncObservers() {
        return {
          ...super.asyncObservers,
          _onAriaLabelledbyChanged: ['_ariaLabelledby'],
          _onAriaDescribedbyChanged: ['_ariaDescribedby'],
          _onLabelChanged: ['label'],
          _onHelpTextChanged: ['helpText'],
        };
      }

      /** @deprecated will be this._inputNode in next breaking release */
      get inputElement() {
        return this.__getDirectSlotChild('input');
      }

      get _labelNode() {
        return this.__getDirectSlotChild('label');
      }

      get _helpTextNode() {
        return this.__getDirectSlotChild('help-text');
      }

      get _feedbackNode() {
        return this.__getDirectSlotChild('feedback');
      }

      constructor() {
        super();
        this._inputId = `${this.localName}-${Math.random()
          .toString(36)
          .substr(2, 10)}`;
        this._ariaLabelledby = '';
        this._ariaDescribedby = '';
      }

      connectedCallback() {
        super.connectedCallback();
        this._enhanceLightDomClasses();
        this._enhanceLightDomA11y();
      }

      /**
       * Public methods
       */

      _enhanceLightDomClasses() {
        if (this.inputElement) {
          this.inputElement.classList.add('form-control');
        }
      }

      _enhanceLightDomA11y() {
        const { inputElement, _labelNode, _helpTextNode, _feedbackNode } = this;

        if (inputElement) {
          inputElement.id = inputElement.id || this._inputId;
        }
        if (_labelNode) {
          _labelNode.setAttribute('for', this._inputId);
          _labelNode.id = _labelNode.id || `label-${this._inputId}`;
          const labelledById = ` ${_labelNode.id}`;
          if (this._ariaLabelledby.indexOf(labelledById) === -1) {
            this._ariaLabelledby += ` ${_labelNode.id}`;
          }
        }
        if (_helpTextNode) {
          _helpTextNode.id = _helpTextNode.id || `help-text-${this._inputId}`;
          const describeIdHelpText = ` ${_helpTextNode.id}`;
          if (this._ariaDescribedby.indexOf(describeIdHelpText) === -1) {
            this._ariaDescribedby += ` ${_helpTextNode.id}`;
          }
        }
        if (_feedbackNode) {
          _feedbackNode.id = _feedbackNode.id || `feedback-${this._inputId}`;
          const describeIdFeedback = ` ${_feedbackNode.id}`;
          if (this._ariaDescribedby.indexOf(describeIdFeedback) === -1) {
            this._ariaDescribedby += ` ${_feedbackNode.id}`;
          }
        }
        this._enhanceLightDomA11yForAdditionalSlots();
      }

      /**
       * Enhances additional slots(prefix, suffix, before, after) defined by developer.
       *
       * When boolean attribute data-label or data-description is found,
       * the slot element will be connected to the input via aria-labelledby or aria-describedby
       */
      _enhanceLightDomA11yForAdditionalSlots(
        additionalSlots = ['prefix', 'suffix', 'before', 'after'],
      ) {
        additionalSlots.forEach(additionalSlot => {
          const element = this.__getDirectSlotChild(additionalSlot);
          if (element) {
            element.id = element.id || `${additionalSlot}-${this._inputId}`;
            if (element.hasAttribute('data-label') === true) {
              this._ariaLabelledby += ` ${element.id}`;
            }
            if (element.hasAttribute('data-description') === true) {
              this._ariaDescribedby += ` ${element.id}`;
            }
          }
        });
      }

      /**
       * Will handle label, prefix/suffix/before/after (if they contain data-label flag attr).
       * Also, contents of id references that will be put in the <lion-field>._ariaLabelledby property
       * from an external context, will be read by a screen reader.
       */
      _onAriaLabelledbyChanged({ _ariaLabelledby }) {
        if (this.inputElement) {
          this.inputElement.setAttribute('aria-labelledby', _ariaLabelledby);
        }
      }

      /**
       * Will handle help text, validation feedback and character counter,
       * prefix/suffix/before/after (if they contain data-description flag attr).
       * Also, contents of id references that will be put in the <lion-field>._ariaDescribedby property
       * from an external context, will be read by a screen reader.
       */
      _onAriaDescribedbyChanged({ _ariaDescribedby }) {
        if (this.inputElement) {
          this.inputElement.setAttribute('aria-describedby', _ariaDescribedby);
        }
      }

      _onLabelChanged({ label }) {
        if (this._labelNode) {
          this._labelNode.textContent = label;
        }
      }

      _onHelpTextChanged({ helpText }) {
        if (this._helpTextNode) {
          this._helpTextNode.textContent = helpText;
        }
      }

      /**
       *
       * Default Render Result:
       *   <div class="form-field__label">
       *     <slot name="label"></slot>
       *   </div>
       *   <small class="form-field__help-text">
       *     <slot name="help-text"></slot>
       *   </small>
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
       */
      render() {
        return html`
          ${this.labelTemplate()} ${this.helpTextTemplate()} ${this.inputGroupTemplate()}
          ${this.feedbackTemplate()}
        `;
      }

      // eslint-disable-next-line class-methods-use-this
      labelTemplate() {
        return html`
          <div class="form-field__label">
            <slot name="label"></slot>
          </div>
        `;
      }

      // eslint-disable-next-line class-methods-use-this
      helpTextTemplate() {
        return html`
          <small class="form-field__help-text">
            <slot name="help-text"></slot>
          </small>
        `;
      }

      inputGroupTemplate() {
        return html`
          <div class="input-group">
            ${this.inputGroupBeforeTemplate()}
            <div class="input-group__container">
              ${this.inputGroupPrefixTemplate()} ${this.inputGroupInputTemplate()}
              ${this.inputGroupSuffixTemplate()}
            </div>
            ${this.inputGroupAfterTemplate()}
          </div>
        `;
      }

      // eslint-disable-next-line class-methods-use-this
      inputGroupBeforeTemplate() {
        return html`
          <div class="input-group__before">
            <slot name="before"></slot>
          </div>
        `;
      }

      inputGroupPrefixTemplate() {
        return !this.$$slot('prefix')
          ? nothing
          : html`
              <div class="input-group__prefix">
                <slot name="prefix"></slot>
              </div>
            `;
      }

      // eslint-disable-next-line class-methods-use-this
      inputGroupInputTemplate() {
        return html`
          <div class="input-group__input">
            <slot name="input"></slot>
          </div>
        `;
      }

      inputGroupSuffixTemplate() {
        return !this.$$slot('suffix')
          ? nothing
          : html`
              <div class="input-group__suffix">
                <slot name="suffix"></slot>
              </div>
            `;
      }

      // eslint-disable-next-line class-methods-use-this
      inputGroupAfterTemplate() {
        return html`
          <div class="input-group__after">
            <slot name="after"></slot>
          </div>
        `;
      }

      // eslint-disable-next-line class-methods-use-this
      feedbackTemplate() {
        return html`
          <div class="form-field__feedback">
            <slot name="feedback"></slot>
          </div>
        `;
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
       *
       * TODO: find best naming convention: https://en.bem.info/methodology/naming-convention/
       * (react style would align better with JSS)
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
       * - {state} .state-disabled : when .form-control (<input>, <textarea> etc.) has disabled set
       *            to true
       * - {state} .state-focused: when .form-control (<input>, <textarea> etc.) <input> has focus
       * - {state} .state-filled: whether <input> has a value
       * - {state} .state-touched: whether the user had blurred the field once
       * - {state} .state-dirty: whether the value has changed since initial value
       *
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
          css`
            /**********************
          {block} .form-field
             ********************/

            :host {
              display: block;
            }

            :host(.state-disabled) {
              pointer-events: none;
            }

            :host(.state-disabled) .form-field__label ::slotted(*),
            :host(.state-disabled) .form-field__help-text ::slotted(*) {
              color: var(--disabled-text-color, #adadad);
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

            /***** {state} .state-disabled *****/
            :host(.state-disabled) .input-group ::slotted(*) {
              color: var(--disabled-text-color, #adadad);
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

      // Extend validity showing conditions of ValidateMixin
      showErrorCondition(newStates) {
        return super.showErrorCondition(newStates) && this._interactionStateFeedbackCondition();
      }

      showWarningCondition(newStates) {
        return super.showWarningCondition(newStates) && this._interactionStateFeedbackCondition();
      }

      showInfoCondition(newStates) {
        return super.showInfoCondition(newStates) && this._interactionStateFeedbackCondition();
      }

      showSuccessCondition(newStates, oldStates) {
        return (
          super.showSuccessCondition(newStates, oldStates) &&
          this._interactionStateFeedbackCondition()
        );
      }

      _interactionStateFeedbackCondition() {
        /**
         *   Show the validity feedback when one of the following conditions is met:
         *
         * - submitted
         *   If the form is submitted, always show the error message.
         *
         * - prefilled
         *   the user already filled in something, or the value is prefilled
         *   when the form is initially rendered.
         *
         * - touched && dirty && !prefilled
         *   When a user starts typing for the first time in a field with for instance `required`
         *   validation, error message should not be shown until a field becomes `touched`
         *   (a user leaves(blurs) a field).
         *   When a user enters a field without altering the value(making it `dirty`),
         *   an error message shouldn't be shown either.
         *
         */
        return (this.touched && this.dirty && !this.prefilled) || this.prefilled || this.submitted;
      }

      // aria-labelledby and aria-describedby helpers
      // TODO: consider extracting to generic ariaLabel helper mixin

      /**
       * Let the order of adding ids to aria element by DOM order, so that the screen reader
       * respects visual order when reading:
       * https://developers.google.com/web/fundamentals/accessibility/focus/dom-order-matters
       * @param {array} descriptionElements - holds references to description or label elements whose
       * id should be returned
       * @returns {array} sorted set of elements based on dom order
       *
       * TODO: make this method part of a more generic mixin or util and also use for lion-field
       */
      static _getAriaElementsInRightDomOrder(descriptionElements) {
        const putPrecedingSiblingsAndLocalParentsFirst = (a, b) => {
          // https://developer.mozilla.org/en-US/docs/Web/API/Node/compareDocumentPosition
          const pos = a.compareDocumentPosition(b);
          if (
            pos === Node.DOCUMENT_POSITION_PRECEDING ||
            pos === Node.DOCUMENT_POSITION_CONTAINED_BY
          ) {
            return 1;
          }
          return -1;
        };

        const descriptionEls = descriptionElements.filter(el => el); // filter out null references
        return descriptionEls.sort(putPrecedingSiblingsAndLocalParentsFirst);
      }

      // Returns dom references to all elements that should be referred to by field(s)
      _getAriaDescriptionElements() {
        return [this._helpTextNode, this._feedbackNode];
      }

      /**
       * Meant for Application Developers wanting to add to aria-labelledby attribute.
       * @param {string} id - should be the id of an element that contains the label for the
       * concerned field or fieldset, living in the same shadow root as the host element of field or
       * fieldset.
       */
      addToAriaLabel(id) {
        this._ariaLabelledby += ` ${id}`;
      }

      /**
       * Meant for Application Developers wanting to add to aria-describedby attribute.
       * @param {string} id - should be the id of an element that contains the label for the
       * concerned field or fieldset, living in the same shadow root as the host element of field or
       * fieldset.
       */
      addToAriaDescription(id) {
        this._ariaDescribedby += ` ${id}`;
      }

      __getDirectSlotChild(slotName) {
        return [...this.children].find(el => el.slot === slotName);
      }
    },
);
