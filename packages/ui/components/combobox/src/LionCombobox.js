import { browserDetection } from '@lion/ui/core.js';
import { Unparseable } from '@lion/ui/form-core.js';
import { LionListbox } from '@lion/ui/listbox.js';
import { LocalizeMixin } from '@lion/ui/localize-no-side-effects.js';
import { OverlayMixin, withDropdownConfig } from '@lion/ui/overlays.js';
import { css, html } from 'lit';
import { makeMatchingTextBold, unmakeMatchingTextBold } from './utils/makeMatchingTextBold.js';
import { IsMatchingAnOption } from './validators.js';

const matchA11ySpanReverseFns = new WeakMap();

// TODO: make ListboxOverlayMixin that is shared between SelectRich and Combobox
// TODO: extract option matching based on 'typed character cache' and share that logic
// on Listbox or ListNavigationWithActiveDescendantMixin

/**
 * @typedef {import('@lion/ui/listbox.js').LionOption} LionOption
 * @typedef {import('@lion/ui/listbox.js').LionOptions} LionOptions
 * @typedef {import('@lion/ui/types/overlays.js').OverlayConfig} OverlayConfig
 * @typedef {import('@lion/ui/types/core.js').SlotsMap} SlotsMap
 * @typedef {import('@lion/ui/types/form-core.js').ChoiceInputHost} ChoiceInputHost
 * @typedef {import('@lion/ui/types/form-core.js').FormControlHost} FormControlHost
 * @typedef {import('../types/SelectionDisplay.js').SelectionDisplay} SelectionDisplay
 */

/**
 * LionCombobox: implements the wai-aria combobox design pattern and integrates it as a Lion
 * FormControl
 */
export class LionCombobox extends LocalizeMixin(OverlayMixin(LionListbox)) {
  /** @type {any} */
  static get properties() {
    return {
      autocomplete: { type: String, reflect: true },
      matchMode: {
        type: String,
        attribute: 'match-mode',
      },
      showAllOnEmpty: {
        type: Boolean,
        attribute: 'show-all-on-empty',
      },
      requireOptionMatch: {
        type: Boolean,
      },
      __shouldAutocompleteNextUpdate: Boolean,
    };
  }

  static get styles() {
    return [
      ...super.styles,
      css`
        .input-group__input {
          display: flex;
          flex: 1;
        }

        .input-group__container {
          display: flex;
          border-bottom: 1px solid;
        }

        * > ::slotted([slot='input']) {
          outline: none;
          flex: 1;
          box-sizing: border-box;
          border: none;
          width: 100%;
          /* border-bottom: 1px solid; */
        }

        * > ::slotted([role='listbox']) {
          max-height: 200px;
          display: block;
          overflow: auto;
          z-index: 1;
          background: white;
        }
      `,
    ];
  }

  static get localizeNamespaces() {
    return [
      {
        'lion-combobox': /** @param {string} locale */ locale => {
          switch (locale) {
            case 'bg-BG':
            case 'bg':
              return import('@lion/ui/combobox-translations/bg.js');
            case 'cs-CZ':
            case 'cs':
              return import('@lion/ui/combobox-translations/cs.js');
            case 'de-AT':
            case 'de-DE':
            case 'de':
              return import('@lion/ui/combobox-translations/de.js');
            case 'en-AU':
            case 'en-GB':
            case 'en-PH':
            case 'en-US':
            case 'en':
              return import('@lion/ui/combobox-translations/en.js');
            case 'es-ES':
            case 'es':
              return import('@lion/ui/combobox-translations/es.js');
            case 'fr-FR':
            case 'fr-BE':
            case 'fr':
              return import('@lion/ui/combobox-translations/fr.js');
            case 'hu-HU':
            case 'hu':
              return import('@lion/ui/combobox-translations/hu.js');
            case 'it-IT':
            case 'it':
              return import('@lion/ui/combobox-translations/it.js');
            case 'nl-BE':
            case 'nl-NL':
            case 'nl':
              return import('@lion/ui/combobox-translations/nl.js');
            case 'pl-PL':
            case 'pl':
              return import('@lion/ui/combobox-translations/pl.js');
            case 'ro-RO':
            case 'ro':
              return import('@lion/ui/combobox-translations/ro.js');
            case 'ru-RU':
            case 'ru':
              return import('@lion/ui/combobox-translations/ru.js');
            case 'sk-SK':
            case 'sk':
              return import('@lion/ui/combobox-translations/sk.js');
            case 'uk-UA':
            case 'uk':
              return import('@lion/ui/combobox-translations/uk.js');
            case 'zh-CN':
            case 'zh':
              return import('@lion/ui/combobox-translations/zh.js');
            default:
              return import('@lion/ui/combobox-translations/en.js');
          }
        },
      },
      ...super.localizeNamespaces,
    ];
  }

  /**
   * @override ChoiceGroupMixin
   */
  // @ts-ignore
  get modelValue() {
    const choiceGroupModelValue = super.modelValue;
    if (choiceGroupModelValue !== '') {
      return choiceGroupModelValue;
    }
    // Since the FormatMixin can't be applied to a [FormGroup](https://github.com/ing-bank/lion/blob/master/packages/ui/components/form-core/src/form-group/FormGroupMixin.js)
    // atm, we treat it in a way analogue to InteractionStateMixin (basically same apis, w/o Mixin applied).
    // Hence, modelValue has no reactivity by default and we need to call parser manually here...
    return this.parser(this.value);
  }

  // Duplicating from ChoiceGroupMixin, because you cannot independently inherit/override getter + setter.
  // If you override one, gotta override the other, they go in pairs.
  /**
   * @override ChoiceGroupMixin
   */
  set modelValue(value) {
    super.modelValue = value;
  }

  /**
   * We define the value getter/setter below as also defined in LionField (via FormatMixin). 
   * Since FormatMixin is meant for Formgroups/ChoiceGroup it's not applied on Combobox; 
   * Combobox is somewhat of a hybrid between a ChoiceGroup and LionField, therefore we copy over 
   * some of the LionField members to align with its interface. 
   * 
   * The view value. Will be delegated to `._inputNode.value`
   */
  get value() {
    return this._inputNode?.value || this.__value || '';
  }

  /** @param {string} value */
  set value(value) {
    // if not yet connected to dom can't change the value
    if (this._inputNode) {
      this._inputNode.value = value;
      /** @type {string | undefined} */
      this.__value = undefined;
    } else {
      this.__value = value;
    }
  }

  reset() {
    super.reset();
    // @ts-ignore _initialModelValue comes from ListboxMixin
    this.value = this._initialModelValue;
  }

  /**
   * @enhance FormControlMixin - add slot[name=selection-display]
   * @protected
   */
  // eslint-disable-next-line class-methods-use-this
  _inputGroupInputTemplate() {
    return html`
      <div class="input-group__input">
        <slot name="selection-display"></slot>
        <slot name="input"></slot>
      </div>
    `;
  }

  /**
   * @protected
   */
  // eslint-disable-next-line class-methods-use-this
  _overlayListboxTemplate() {
    return html`
      <div
        id="overlay-content-node-wrapper"
        role="dialog"
        aria-label="${this.msgLit(`lion-combobox:optionsPopup`)}"
      >
        <slot name="listbox"></slot>
      </div>
      <slot id="options-outlet"></slot>
    `;
  }

  /**
   * @enhance FormControlMixin - add overlay
   * @protected
   */
  _groupTwoTemplate() {
    return html` ${super._groupTwoTemplate()} ${this._overlayListboxTemplate()}`;
  }

  /**
   * @type {SlotsMap}
   */
  get slots() {
    return {
      ...super.slots,
      /**
       * The interactive element that can receive focus
       */
      input: () => {
        if (this._ariaVersion === '1.1') {
          /**
           * According to the 1.1 specs, the input should be either wrapped in an element with
           * [role=combobox], or element with [role=combobox] should have [aria-owns=input-id].
           * For best cross browser compatibility, we choose the first option.
           */
          const combobox = document.createElement('div');
          const textbox = document.createElement('input');

          // Reset textbox styles so that it 'merges' with parent [role=combobox]
          // that is styled by Subclassers
          textbox.style.cssText = `
          border: none;
          outline: none;
          width: 100%;
          height: 100%;
          font: inherit;
          background: inherit;
          color: inherit;
          border-radius: inherit;
          box-sizing: border-box;
          padding: 0;`;

          combobox.appendChild(textbox);
          return combobox;
        }
        // ._ariaVersion === '1.0'
        /**
         * For browsers not supporting aria 1.1 spec, we implement the 1.0 spec.
         * That means we have one (input) element that has [role=combobox]
         */
        return document.createElement('input');
      },
      /**
       * As opposed to our parent (LionListbox), the end user doesn't interact with the
       * element that has [role=listbox] (in a combobox, it has no tabindex), but with
       * the text box (<input>) element.
       */
      listbox: super.slots.input,
    };
  }

  /**
   * Wrapper with combobox role for the text input that the end user controls the listbox with.
   * @type {HTMLElement}
   * @protected
   */
  get _comboboxNode() {
    return /** @type {HTMLElement} */ (this.querySelector('[slot="input"]'));
  }

  /**
   * @type {SelectionDisplay | null}
   * @protected
   */
  get _selectionDisplayNode() {
    return this.querySelector('[slot="selection-display"]');
  }

  /**
   * @configure FormControlMixin
   * Will tell FormControlMixin that a11y wrt labels / descriptions / feedback
   * should be applied here.
   * @protected
   */
  get _inputNode() {
    if (this._ariaVersion === '1.1' && this._comboboxNode) {
      return /** @type {HTMLInputElement} */ (this._comboboxNode.querySelector('input'));
    }
    return /** @type {HTMLInputElement} */ (this._comboboxNode);
  }

  /**
   * @configure OverlayMixin
   * @protected
   */
  get _overlayContentNode() {
    return this._listboxNode;
  }

  /**
   * @configure OverlayMixin
   * @protected
   */
  get _overlayReferenceNode() {
    return /** @type {ShadowRoot} */ (this.shadowRoot).querySelector('.input-group__container');
  }

  /**
   * @configure OverlayMixin
   * @protected
   */
  get _overlayInvokerNode() {
    return this._inputNode;
  }

  /**
   * @configure ListboxMixin
   * @protected
   */
  get _listboxNode() {
    return /** @type {LionOptions} */ (
      (this._overlayCtrl && this._overlayCtrl.contentNode) ||
        Array.from(this.children).find(child => child.slot === 'listbox')
    );
  }

  /**
   * @configure ListboxMixin
   * @protected
   */
  get _activeDescendantOwnerNode() {
    return this._inputNode;
  }

  constructor() {
    super();
    /**
     * When "list", will filter listbox suggestions based on textbox value.
     * When "both", an inline completion string will be added to the textbox as well.
     * @type {'none'|'list'|'inline'|'both'}
     */
    this.autocomplete = 'both';
    /**
     * When typing in the textbox, will by default be set on 'begin',
     * only matching the beginning part in suggestion list.
     * => 'a' will match 'apple' from ['apple', 'pear', 'citrus'].
     * When set to 'all', will match middle of the word as well
     * => 'a' will match 'apple' and 'pear'
     * @type {'begin'|'all'}
     */
    this.matchMode = 'all';
    /**
     * When true, the listbox is open and textbox goes from a value to empty, all options are shown.
     * By default, the listbox closes on empty, similar to wai-aria example and <datalist>
     */
    this.showAllOnEmpty = false;
    /**
     * If set to false, the value is allowed to not match any of the options.
     * We set the default to true for backwards compatibility
     */
    this.requireOptionMatch = true;
    /**
     * @configure ListboxMixin: the wai-aria pattern and <datalist> rotate
     */
    this.rotateKeyboardNavigation = true;
    /**
     * @configure ListboxMixin: the wai-aria pattern and <datalist> have selection follow focus
     */
    this.selectionFollowsFocus = true;
    this.defaultValidators.push(new MatchesOption());
    /**
     * For optimal support, we allow aria v1.1 on newer browsers
     * @type {'1.1'|'1.0'}
     * @protected
     */
    this._ariaVersion = browserDetection.isChromium ? '1.1' : '1.0';

    /**
     * @configure ListboxMixin
     * @protected
     */
    this._listboxReceivesNoFocus = true;
    /**
     * @configure ListboxMixin
     * @protected
     */
    this._noTypeAhead = true;
    /**
     * @private
     */
    this.__prevCboxValueNonSelected = '';
    /**
     * @private
     */
    this.__prevCboxValue = '';
    /**
     * @type {boolean}
     * @private
     */
    this.__hadUserIntendsInlineAutoFill = false;
    /**
     * @type {boolean}
     * @private
     */
    this.__listboxContentChanged = false;

    /** @type {EventListener}
     * @private
     */
    this.__requestShowOverlay = this.__requestShowOverlay.bind(this);
    /** @type {EventListener}
     * @protected
     */
    this._textboxOnInput = this._textboxOnInput.bind(this);
    /** @type {EventListener}
     * @protected
     */
    this._textboxOnKeydown = this._textboxOnKeydown.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    if (this._selectionDisplayNode) {
      this._selectionDisplayNode.comboboxElement = this;
    }
  }

  /**
   * @param {string} [name]
   * @param {unknown} [oldValue]
   * @param {import('lit').PropertyDeclaration} [options]
   * @returns {void}
   */
  requestUpdate(name, oldValue, options) {
    super.requestUpdate(name, oldValue, options);
    if (name === 'disabled' || name === 'readOnly') {
      this.__setComboboxDisabledAndReadOnly();
    }
    if (name === 'modelValue' && this.modelValue && this.modelValue !== oldValue) {
      if (this._syncToTextboxCondition(this.modelValue, this._oldModelValue)) {
        if (!this.multipleChoice) {
          const textboxValue = this._getTextboxValueFromOption(
            this.formElements[/** @type {number} */ (this.checkedIndex)],
          );
          this._setTextboxValue(textboxValue);
        } else {
          this._syncToTextboxMultiple(this.modelValue, this._oldModelValue);
        }
      }
    }
    if (name === 'focused' && this.focused) {
      this.__requestShowOverlay();
    }
  }

  /**
   * Converts viewValue to modelValue
   * @param {string} value - viewValue: the formatted value inside <input>
   * @returns {*} modelValue
   */
  parser(value) {
    if (this.requireOptionMatch && this.checkedIndex === -1 && value !== '') {
      return new Unparseable(value);
    }
    return value;
  }

  /**
   * When textbox value doesn't match checkedIndex anymore, update accordingly...
   * @protected
   */
  __unsyncCheckedIndexOnInputChange() {
    const autoselect = this._autoSelectCondition();
    const checkedElement = this.formElements[/** @type {number} */ (this.checkedIndex)];
    if (!this.multipleChoice && !autoselect && checkedElement) {
      const textboxValue = this._getTextboxValueFromOption(checkedElement);
      if (!this._inputNode.value.startsWith(textboxValue)) {
        this.setCheckedIndex(-1);
      }
    }
  }

  /**
   * @param {import('lit').PropertyValues } changedProperties
   */
  updated(changedProperties) {
    super.updated(changedProperties);

    if (changedProperties.has('__shouldAutocompleteNextUpdate')) {
      // This check should take place before those below of 'opened' and
      // '__shouldAutocompleteNextUpdate', to avoid race conditions
      this.__unsyncCheckedIndexOnInputChange();
    }

    if (changedProperties.has('opened')) {
      if (this.opened) {
        // Note we always start with -1 as a 'fundament'
        // For [autocomplete="inline|both"] activeIndex might be changed by a match
        this.activeIndex = -1;
      }

      if (!this.opened && changedProperties.get('opened') !== undefined) {
        this.__onOverlayClose();
        this.activeIndex = -1;
      }
    }
    if (changedProperties.has('autocomplete')) {
      this._inputNode.setAttribute('aria-autocomplete', this.autocomplete);
    }
    if (changedProperties.has('disabled')) {
      this.setAttribute('aria-disabled', `${this.disabled}`); // create mixin if we need it in more places
    }
    if (
      changedProperties.has('__shouldAutocompleteNextUpdate') &&
      this.__shouldAutocompleteNextUpdate
    ) {
      // Only update list in render cycle
      this._handleAutocompletion();
      this.__shouldAutocompleteNextUpdate = false;
      this.__listboxContentChanged = false;
    }

    if (typeof this._selectionDisplayNode?.onComboboxElementUpdated === 'function') {
      this._selectionDisplayNode.onComboboxElementUpdated(changedProperties);
    }

    if (changedProperties.has('requireOptionMatch') || changedProperties.has('multipleChoice')) {
      if (!this.requireOptionMatch && this.multipleChoice) {
        // TODO implement !requireOptionMatch and multipleChoice flow
        throw new Error(
          "multipleChoice and requireOptionMatch=false can't be used at the same time (yet).",
        );
      }
    }
  }

  /**
   * When the preconfigurable `match-mode` conditions are not sufficient,
   * one can define a custom matching function.
   *
   * @overridable
   * @param {LionOption} option
   * @param {string} textboxValue current ._inputNode value
   */
  matchCondition(option, textboxValue) {
    let idx = -1;
    const inputValue = this._getTextboxValueFromOption(option);
    if (typeof inputValue === 'string' && typeof textboxValue === 'string') {
      idx = inputValue.toLowerCase().indexOf(textboxValue.toLowerCase());
    }

    if (this.matchMode === 'all') {
      return idx > -1; // matches part of word
    }
    return idx === 0; // matches beginning of value
  }

  /**
   * @overridable
   * Allows Sub Classer to control when the overlay should become visible
   * Note that this condition is separate from whether the option listbox is
   * shown (use 'showAllOnEmpty, matchMode and autocomplete configurations for this')
   *
   * Separating these conditions allows the user to show different content in the dialog/overlay
   * that wraps the listbox with options
   *
   * @example
   * _showOverlayCondition(options) {
   *   return this.focused || super._showOverlayCondition(options);
   * }
   *
   * @example
   * _showOverlayCondition({ lastKey }) {
   *   return lastKey === 'ArrowDown';
   * }
   *
   * @example
   * _showOverlayCondition(options) {
   *   return options.currentValue.length > 4 && super._showOverlayCondition(options);
   * }
   *
   * @param {{ currentValue?: string, lastKey?: string }} options
   * @protected
   * @returns {boolean}
   */
  // TODO: batch all pending condition triggers in __pendingShowTriggers, reducing race conditions
  // eslint-disable-next-line class-methods-use-this
  _showOverlayCondition({ lastKey }) {
    const hideOn = ['Tab', 'Escape', 'Enter'];
    if (lastKey && hideOn.includes(lastKey)) {
      return false;
    }

    if (this.showAllOnEmpty && this.focused) {
      return true;
    }
    // when no keyboard action involved (on focused change), return current opened state
    if (!lastKey) {
      return /** @type {boolean} */ (this.opened);
    }
    return true;
  }

  /**
   * Return the value to be used for the input value
   * @overridable
   * @param {LionOption} option
   * @returns {string}
   */
  // eslint-disable-next-line class-methods-use-this
  _getTextboxValueFromOption(option) {
    if (option) {
      return option.choiceValue;
    }
    if (this.modelValue instanceof Unparseable) {
      return this.modelValue.viewValue;
    }
    return this.modelValue;
  }

  /**
   * @configure ListboxMixin whenever the options are changed (potentially due to external causes
   * like server side filtering of nodes), schedule autocompletion for proper highlighting
   * @protected
   */
  _onListboxContentChanged() {
    super._onListboxContentChanged();
    this.__shouldAutocompleteNextUpdate = true;
    this.__listboxContentChanged = true;
  }

  // eslint-disable-next-line no-unused-vars
  _textboxOnInput() {
    this.__shouldAutocompleteNextUpdate = true;
  }

  /**
   * @param {KeyboardEvent} ev
   * @protected
   */
  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  _textboxOnKeydown(ev) {
    // N.B. the check in _showOverlayCondition() is on keyup, and there is a subtle difference
    // (see tests)
    if (ev.key === 'Tab') {
      this.opened = false;
    }
  }

  /**
   * @param {MouseEvent} ev
   * @protected
   */
  _listboxOnClick(ev) {
    super._listboxOnClick(ev);

    this._inputNode.focus();
    if (!this.multipleChoice) {
      this.activeIndex = -1;
      this.opened = false;
    }
  }

  /**
   * @param {string} v
   * @protected
   */
  _setTextboxValue(v) {
    // Make sure that we don't loose inputNode.selectionStart and inputNode.selectionEnd
    if (this._inputNode.value !== v) {
      this._inputNode.value = v;
    }
  }

  /**
   * @private
   */
  __onOverlayClose() {
    if (!this.multipleChoice) {
      if (
        this.checkedIndex !== -1 &&
        this._syncToTextboxCondition(this.modelValue, this._oldModelValue, {
          phase: 'overlay-close',
        })
      ) {
        this._inputNode.value = this._getTextboxValueFromOption(
          this.formElements[/** @type {number} */ (this.checkedIndex)],
        );
      }
    } else {
      this._syncToTextboxMultiple(this.modelValue, this._oldModelValue);
    }
  }

  /**
   * @enhance FormControlMixin
   * We need to extend the repropagation prevention conditions here.
   * Usually form groups with single choice will not repropagate model-value-changed of an option upwards
   * if this option itself is not the checked one. We want to prevent duplicates. However, for combobox
   * it is reasonable that an option can become unchecked without another one becoming checked, because
   * users can enter any text they want, whether it matches an option or not.
   *
   * Therefore, extend the condition to fail by checking if there is any elements checked. If so, then we
   * should indeed not repropagate as normally. If there is no elements checked, this will be the only
   * model-value-changed event that gets received, and we should repropagate it.
   *
   * @param {FormControlHost} target
   */
  _repropagationCondition(target) {
    return super._repropagationCondition(target) || this.formElements.every(el => !el.checked);
  }

  /* eslint-disable no-param-reassign */
  /**
   * @overridable
   * @param {LionOption & {__originalInnerHTML?:string}} option
   * @param {string} matchingString
   * @protected
   */
  _onFilterMatch(option, matchingString) {
    this._highlightMatchedOption(option, matchingString);

    // Alternatively, an extension can add an animation here
    option.style.display = '';
  }

  /**
   * @overridable
   * @param {Element} option
   * @param {string} matchingString
   * @protected
   */
  // eslint-disable-next-line class-methods-use-this
  _highlightMatchedOption(option, matchingString) {
    makeMatchingTextBold(option, matchingString);

    // For Safari, we need to add a label to the element
    if (option.textContent) {
      const a11ySpan = document.createElement('span');
      a11ySpan.setAttribute('aria-label', option.textContent.replace(/\s+/g, ' '));
      Array.from(option.childNodes).forEach(childNode => {
        a11ySpan.appendChild(childNode);
      });
      option.appendChild(a11ySpan);

      matchA11ySpanReverseFns.set(option, () => {
        Array.from(a11ySpan.childNodes).forEach(childNode => {
          option.appendChild(childNode);
        });
        if (option.contains(a11ySpan)) {
          option.removeChild(a11ySpan);
        }
      });
    }
  }

  /**
   * @overridable
   * @param {LionOption & {__originalInnerHTML?:string}} option
   * @param {string} [curValue]
   * @param {string} [prevValue]
   * @protected
   */
  // eslint-disable-next-line no-unused-vars, class-methods-use-this
  _onFilterUnmatch(option, curValue, prevValue) {
    this._unhighlightMatchedOption(option);

    // Alternatively, an extension can add an animation here
    option.style.display = 'none';
  }

  /**
   * @overridable
   * @param {Element} option
   * @protected
   */
  // eslint-disable-next-line class-methods-use-this
  _unhighlightMatchedOption(option) {
    unmakeMatchingTextBold(option);

    if (matchA11ySpanReverseFns.has(option)) {
      matchA11ySpanReverseFns.get(option)();
    }
  }
  /* eslint-enable no-param-reassign */

  /**
   * Computes whether a user intends to autofill (inline autocomplete textbox)
   * @param {{ prevValue:string, curValue:string }} config
   * @private
   */
  // eslint-disable-next-line class-methods-use-this
  __computeUserIntendsAutoFill({ prevValue, curValue }) {
    const userIsAddingChars = prevValue.length < curValue.length;
    const userStartsNewWord =
      prevValue.length &&
      curValue.length &&
      prevValue[0].toLowerCase() !== curValue[0].toLowerCase();
    return (
      userIsAddingChars ||
      userStartsNewWord ||
      (this.__listboxContentChanged && this.__hadUserIntendsInlineAutoFill)
    );
  }

  /* eslint-enable no-param-reassign, class-methods-use-this */

  /**
   * Handles autocompletion. This entails:
   * - list: shows a list on keydown character press
   * - filter: filters list of potential matches according to matchmode or provided matchCondition
   * - focus: automatically focuses closest match (makes it the activedescendant)
   * - check: automatically checks/selects closest match when selection-follows-focus is enabled
   * (this is the default configuration)
   * - complete: completes the textbox value inline (the 'missing characters' will be added as
   * selected text)
   *
   * @protected
   */
  _handleAutocompletion() {
    const hasSelection = this._inputNode.value.length !== this._inputNode.selectionStart;

    const inputValue = this._inputNode.value;
    const inputSelectionStart = this._inputNode.selectionStart;
    const curValue =
      hasSelection && inputSelectionStart ? inputValue.slice(0, inputSelectionStart) : inputValue;

    const prevValue =
      hasSelection || this.__hadSelectionLastAutofill
        ? this.__prevCboxValueNonSelected
        : this.__prevCboxValue;
    const isEmpty = !curValue;

    /**
     * The filtered list of options that will match in this autocompletion cycle
     * @type {LionOption[]}
     */
    const visibleOptions = [];
    /** Whether autofill (activeIndex/checkedIndex and ) has taken place in this 'cycle' */
    let hasAutoFilled = false;
    const userIntendsInlineAutoFill = this.__computeUserIntendsAutoFill({ prevValue, curValue });
    const isInlineAutoFillCandidate =
      this.autocomplete === 'both' || this.autocomplete === 'inline';
    const autoselect = this._autoSelectCondition();
    const noFilter = this.autocomplete === 'inline' || this.autocomplete === 'none';

    /** @typedef {LionOption & { onFilterUnmatch?:function, onFilterMatch?:function }} OptionWithFilterFn */
    this.formElements.forEach((/** @type {OptionWithFilterFn} */ option, i) => {
      // [1]. Decide whether option should be shown
      const matches = this.matchCondition(option, curValue);
      let show = false;
      if (isEmpty) {
        show = this.showAllOnEmpty;
      } else {
        show = noFilter || matches;
      }

      // [2]. Synchronize ._inputNode value and active descendant with closest match
      if (autoselect && !hasAutoFilled && matches && !option.disabled) {
        const doAutoSelect = () => {
          this.activeIndex = i;
          if (this.selectionFollowsFocus && !this.multipleChoice) {
            this.setCheckedIndex(this.activeIndex);
          }
          hasAutoFilled = true;
        };

        if (userIntendsInlineAutoFill) {
          // We should never directly select when removing chars or starting a new word
          // This leads to bad UX and unwanted syncing of modelValue (based on checkedIndex)
          // and _inputNode.value

          if (isInlineAutoFillCandidate) {
            const textboxValue = this._getTextboxValueFromOption(option);
            const stringValues =
              textboxValue && typeof textboxValue === 'string' && typeof curValue === 'string';
            const beginsWith =
              stringValues && textboxValue.toLowerCase().indexOf(curValue.toLowerCase()) === 0;
            // We only can do proper inline autofilling when the beginning of the word matches
            if (beginsWith) {
              this.__textboxInlineComplete(option);
              doAutoSelect();
            }
          } else {
            doAutoSelect();
          }
        }
      }

      // [3]. Cleanup previous matching states
      if (option.onFilterUnmatch) {
        option.onFilterUnmatch(curValue, prevValue);
      } else {
        this._onFilterUnmatch(option, curValue, prevValue);
      }

      // [4]. Cleanup previous visibility and a11y states
      option.setAttribute('aria-hidden', 'true');
      option.removeAttribute('aria-posinset');
      option.removeAttribute('aria-setsize');

      // [5]. Add options that meet matching criteria
      if (show) {
        visibleOptions.push(option);
        if (option.onFilterMatch) {
          option.onFilterMatch(curValue);
        } else {
          this._onFilterMatch(option, curValue);
        }
      }
    });

    // [6]. Enable a11y, visibility and user interaction for visible options
    const setSize = visibleOptions.length;
    visibleOptions.forEach((option, idx) => {
      option.setAttribute('aria-posinset', `${idx + 1}`);
      option.setAttribute('aria-setsize', `${setSize}`);
      option.removeAttribute('aria-hidden');
    });

    // [7]. If no autofill took place, we are left with the previously matched option; correct this
    if (autoselect && !hasAutoFilled && !this.multipleChoice) {
      // This means there is no match for checkedIndex
      this.setCheckedIndex(-1);
      this.modelValue = this.parser(inputValue);
    }

    // [8]. These values will help computing autofill intentions next autocomplete cycle
    this.__prevCboxValueNonSelected = curValue;
    // See test 'computation of "user intends autofill" works correctly afer autofill'
    this.__prevCboxValue = this._inputNode.value;
    this.__hadSelectionLastAutofill =
      this._inputNode.value.length !== this._inputNode.selectionStart;
    this.__hadUserIntendsInlineAutoFill = userIntendsInlineAutoFill;

    // [9]. Reposition overlay
    if (this._overlayCtrl && this._overlayCtrl._popper) {
      this._overlayCtrl._popper.update();
    }
  }

  /**
   * @private
   */
  __textboxInlineComplete(option = this.formElements[this.activeIndex]) {
    const newValue = this._getTextboxValueFromOption(option);

    // Make sure that we don't lose inputNode.selectionStart and inputNode.selectionEnd
    if (this._inputNode.value !== newValue) {
      const prevLen = this._inputNode.value.length;
      this._inputNode.value = newValue;
      this._inputNode.selectionStart = prevLen;
      this._inputNode.selectionEnd = this._inputNode.value.length;
    }
  }

  /**
   * When this condition is false, an end user will have to manually select a suggested
   * option from the list (by default when autocomplete is 'none' or 'list').
   * For autocomplete 'both' or 'inline', it will automatically select on a match.
   * @overridable
   * @protected
   */
  _autoSelectCondition() {
    return this.autocomplete === 'both' || this.autocomplete === 'inline';
  }

  /**
   * @enhance ListboxMixin
   * @protected
   */
  _setupListboxNode() {
    super._setupListboxNode();
    // Only the textbox should be focusable
    this._listboxNode.removeAttribute('tabindex');
  }

  /**
   * @configure OverlayMixin
   * @protected
   */
  // eslint-disable-next-line class-methods-use-this
  _defineOverlayConfig() {
    return /** @type {OverlayConfig} */ ({
      ...withDropdownConfig(),
      elementToFocusAfterHide: undefined,
      invokerNode: this._comboboxNode,
      visibilityTriggerFunction: undefined,
    });
  }

  /**
   * @enhance OverlayMixin
   * @protected
   */
  _setupOverlayCtrl() {
    super._setupOverlayCtrl();
    this.__shouldAutocompleteNextUpdate = true;
    this.__setupCombobox();
  }

  /**
   * @enhance OverlayMixin
   * @protected
   */
  _teardownOverlayCtrl() {
    super._teardownOverlayCtrl();
    this.__teardownCombobox();
  }

  /**
   * @enhance OverlayMixin
   * @protected
   */
  _setupOpenCloseListeners() {
    super._setupOpenCloseListeners();
    this._inputNode.addEventListener('keyup', this.__requestShowOverlay);
  }

  /**
   * @enhance OverlayMixin
   * @protected
   */
  _teardownOpenCloseListeners() {
    super._teardownOpenCloseListeners();
    this._inputNode.removeEventListener('keyup', this.__requestShowOverlay);
  }

  /**
   * @enhance ListboxMixin
   * @param {KeyboardEvent} ev
   * @protected
   */
  _listboxOnKeyDown(ev) {
    super._listboxOnKeyDown(ev);
    const { key } = ev;
    switch (key) {
      case 'Escape':
        this.opened = false;
        this._setTextboxValue('');
        break;
      case 'Enter':
        if (!this.formElements[this.activeIndex]) {
          return;
        }
        if (!this.multipleChoice) {
          this.opened = false;
        }
        break;
      /* no default */
    }
  }

  /**
   * @overridable
   * @param {string|string[]} modelValue
   * @param {string|string[]} oldModelValue
   * @param {{phase?:string}} config
   * @protected
   */
  // eslint-disable-next-line no-unused-vars
  _syncToTextboxCondition(modelValue, oldModelValue, { phase } = {}) {
    return (
      this.autocomplete === 'inline' || this.autocomplete === 'both' || phase === 'overlay-close'
    );
  }

  /**
   * @overridable
   * Allows to control what happens when checkedIndexes change
   * @param {string[]} modelValue
   * @param {string[]} oldModelValue
   * @protected
   */
  // eslint-disable-next-line no-unused-vars
  _syncToTextboxMultiple(modelValue, oldModelValue = []) {
    const diff = modelValue.filter(x => !oldModelValue.includes(x));
    const newValue = this.formElements
      .filter(option => diff.includes(option.choiceValue))
      .map(option => this._getTextboxValueFromOption(option))
      .join(' ');
    this._setTextboxValue(newValue); // or last selected value?
  }

  /**
   * @override FormControlMixin - add form-control to [slot=input] instead of _inputNode
   */
  _enhanceLightDomClasses() {
    const formControl = /** @type {HTMLInputElement} */ (this.querySelector('[slot=input]'));
    if (formControl) {
      formControl.classList.add('form-control');
    }
  }

  /**
   * @private
   */
  __setComboboxDisabledAndReadOnly() {
    if (this._comboboxNode) {
      this._comboboxNode.setAttribute('disabled', `${this.disabled}`);
      this._comboboxNode.setAttribute('readonly', `${this.readOnly}`);
    }
  }

  /**
   * @private
   */
  __setupCombobox() {
    // With regard to accessibility: aria-expanded and -labelledby will
    // be handled by OverlayMixin and FormControlMixin respectively.

    this._comboboxNode.setAttribute('role', 'combobox');
    this._comboboxNode.setAttribute('aria-haspopup', 'listbox');
    this._inputNode.setAttribute('aria-autocomplete', this.autocomplete);

    if (this._ariaVersion === '1.1') {
      this._comboboxNode.setAttribute('aria-owns', this._listboxNode.id);
      this._inputNode.setAttribute('aria-controls', this._listboxNode.id);
    } else {
      this._inputNode.setAttribute('aria-owns', this._listboxNode.id);
    }

    this._listboxNode.setAttribute('aria-labelledby', this._labelNode.id);

    this._inputNode.addEventListener('keydown', this._listboxOnKeyDown);
    this._inputNode.addEventListener('input', this._textboxOnInput);
    this._inputNode.addEventListener('keydown', this._textboxOnKeydown);
  }

  /**
   * @private
   */
  __teardownCombobox() {
    this._inputNode.removeEventListener('keydown', this._listboxOnKeyDown);
    this._inputNode.removeEventListener('input', this._textboxOnInput);
    this._inputNode.removeEventListener('keydown', this._textboxOnKeydown);
  }

  /**
   * @param {KeyboardEvent} [ev]
   * @private
   */
  __requestShowOverlay(ev) {
    const lastKey = ev && ev.key;
    this.opened = this._showOverlayCondition({
      lastKey,
      currentValue: this._inputNode.value,
    });
  }

  clear() {
    super.clear();
    this.value = '';
  }
}
