import { dedupeMixin } from '@open-wc/dedupe-mixin';
import { FormControlMixin } from './FormControlMixin.js';

/**
 * @typedef {import('../types/InteractionStateMixinTypes.js').InteractionStateMixin} InteractionStateMixin
 * @typedef {import('../types/InteractionStateMixinTypes.js').InteractionStates} InteractionStates
 */

/**
 * @desc `InteractionStateMixin` adds meta information about touched and dirty states, that can
 * be read by other form components (ing-uic-input-error for instance, uses the touched state
 * to determine whether an error message needs to be shown).
 * Interaction states will be set when a user:
 * - leaves a form field(blur) -> 'touched' will be set to true. 'prefilled' when a
 *   field is left non-empty
 * - on keyup (actually, on the model-value-changed event) -> 'dirty' will be set to true
 *
 * @type {InteractionStateMixin}
 * @param {import('@open-wc/dedupe-mixin').Constructor<LitElement>} superclass
 */
const InteractionStateMixinImplementation = superclass =>
  // @ts-ignore https://github.com/microsoft/TypeScript/issues/36821#issuecomment-588375051
  class InteractionStateMixin extends FormControlMixin(superclass) {
    /** @type {any} */
    static get properties() {
      return {
        touched: { type: Boolean, reflect: true },
        dirty: { type: Boolean, reflect: true },
        filled: { type: Boolean, reflect: true },
        prefilled: { attribute: false },
        submitted: { attribute: false },
      };
    }

    /**
     * @param {string} [name]
     * @param {unknown} [oldValue]
     * @param {PropertyDeclaration} [options]
     * @returns {void}
     */
    requestUpdate(name, oldValue, options) {
      super.requestUpdate(name, oldValue, options);
      if (name === 'touched' && this.touched !== oldValue) {
        this._onTouchedChanged();
      }

      if (name === 'modelValue') {
        // We do this in requestUpdate because we don't want to fire another re-render (e.g. when doing this in updated)
        // Furthermore, we cannot do it on model-value-changed event because it isn't fired initially.
        this.filled = !this._isEmpty();
      }

      if (name === 'dirty' && this.dirty !== oldValue) {
        this._onDirtyChanged();
      }
    }

    constructor() {
      super();

      /**
       * True when user has focused and left(blurred) the field.
       * @type {boolean}
       */
      this.touched = false;

      /**
       * True when user has changed the value of the field.
       * @type {boolean}
       */
      this.dirty = false;

      /**
       * True when user has left non-empty field or input is prefilled.
       * The name must be seen from the point of view of the input field:
       * once the user enters the input field, the value is non-empty.
       * @type {boolean}
       */
      this.prefilled = false;

      /**
       * True when the modelValue is non-empty (see _isEmpty in FormControlMixin)
       * @type {boolean}
       */
      this.filled = false;

      /**
       * True when user has attempted to submit the form, e.g. through a button
       * of type="submit"
       * @type {boolean}
       */
      // TODO: [v1] this might be fixable by scheduling property effects till firstUpdated
      // this.submitted = false;

      /**
       * The event that triggers the touched state
       * @type {string}
       * @protected
       */
      this._leaveEvent = 'blur';

      /**
       * The event that triggers the dirty state
       * @type {string}
       * @protected
       */
      this._valueChangedEvent = 'model-value-changed';

      /**
       * @type {(event: Event) => unknown}
       * @protected
       */
      this._iStateOnLeave = this._iStateOnLeave.bind(this);

      /**
       * @type {(event: Event) => unknown}
       * @protected
       */
      this._iStateOnValueChange = this._iStateOnValueChange.bind(this);
    }

    /**
     * Register event handlers and validate prefilled inputs
     */
    connectedCallback() {
      super.connectedCallback();
      this.addEventListener(this._leaveEvent, this._iStateOnLeave);
      this.addEventListener(this._valueChangedEvent, this._iStateOnValueChange);
      this.initInteractionState();
    }

    disconnectedCallback() {
      super.disconnectedCallback();
      this.removeEventListener(this._leaveEvent, this._iStateOnLeave);
      this.removeEventListener(this._valueChangedEvent, this._iStateOnValueChange);
    }

    /**
     * Evaluations performed on connectedCallback.
     * This method is public, so it can be called at a later moment (when we need to wait for
     * registering children for instance) as well.
     * Since this method will be called twice in last mentioned scenario, it must stay idempotent.
     */
    initInteractionState() {
      this.dirty = false;
      this.prefilled = !this._isEmpty();
    }

    /**
     * Sets touched value to true and reevaluates prefilled state.
     * When false, on next interaction, user will start with a clean state.
     * @protected
     */
    _iStateOnLeave() {
      this.touched = true;
      this.prefilled = !this._isEmpty();
    }

    /**
     * Sets dirty value and validates when already touched or invalid
     * @protected
     */
    _iStateOnValueChange() {
      this.dirty = true;
    }

    /**
     * Resets touched and dirty, and recomputes prefilled
     */
    resetInteractionState() {
      this.touched = false;
      this.submitted = false;
      this.dirty = false;
      this.prefilled = !this._isEmpty();
    }

    /**
     * Dispatches event on touched state change
     * @protected
     */
    _onTouchedChanged() {
      /** @protectedEvent touched-changed */
      this.dispatchEvent(new Event('touched-changed', { bubbles: true, composed: true }));
    }

    /**
     * Dispatches event on touched state change
     * @protected
     */
    _onDirtyChanged() {
      /** @protectedEvent dirty-changed */
      this.dispatchEvent(new Event('dirty-changed', { bubbles: true, composed: true }));
    }

    /**
     * @override ValidateMixin
     * Show the validity feedback when one of the following conditions is met:
     *
     * - submitted
     *   If the form is submitted, always show the error message.
     *
     * - prefilled
     *   the user already filled in something, or the value is prefilled
     *   when the form is initially rendered.
     *
     * - touched && dirty
     *   When a user starts typing for the first time in a field with for instance `required`
     *   validation, error message should not be shown until a field becomes `touched`
     *   (a user leaves(blurs) a field).
     *   When a user enters a field without altering the value(making it `dirty`),
     *   an error message shouldn't be shown either.
     * @protected
     * @param {string} type
     * @param {InteractionStates} meta
     */
    // @ts-expect-error FIXME: istatemixin should implement validatemixin, then @override is valid
    // eslint-disable-next-line class-methods-use-this, no-unused-vars
    _showFeedbackConditionFor(type, meta) {
      return (meta.touched && meta.dirty) || meta.prefilled || meta.submitted;
    }

    /**
     * @enhance ValidateMixin
     */
    get _feedbackConditionMeta() {
      return {
        // @ts-ignore to fix, InteractionStateMixin needs to depend on ValidateMixin
        ...super._feedbackConditionMeta,
        submitted: this.submitted,
        touched: this.touched,
        dirty: this.dirty,
        filled: this.filled,
        prefilled: this.prefilled,
      };
    }
  };

export const InteractionStateMixin = dedupeMixin(InteractionStateMixinImplementation);
