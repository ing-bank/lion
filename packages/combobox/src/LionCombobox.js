// @ts-nocheck there's an error in cli that cannot be reproduced locally
import { html, css, browserDetection } from '@lion/core';
import { OverlayMixin, withDropdownConfig } from '@lion/overlays';
import { LionListbox } from '@lion/listbox';

// TODO: make ListboxOverlayMixin that is shared between SelectRich and Combobox
// TODO: extract option matching based on 'typed character cache' and share that logic
// on Listbox or ListNavigationWithActiveDescendantMixin

/**
 * @typedef {import('@lion/listbox').LionOption} LionOption
 * @typedef {import('@lion/listbox').LionOptions} LionOptions
 * @typedef {import('@lion/overlays/types/OverlayConfig').OverlayConfig} OverlayConfig
 * @typedef {import('@lion/core/types/SlotMixinTypes').SlotsMap} SlotsMap
 * @typedef {import('../types/SelectionDisplay').SelectionDisplay} SelectionDisplay
 */

/**
 * LionCombobox: implements the wai-aria combobox design pattern and integrates it as a Lion
 * FormControl
 */
export class LionCombobox extends OverlayMixin(LionListbox) {
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
      __shouldAutocompleteNextUpdate: Boolean,
    };
  }

  static get styles() {
    return [
      super.styles,
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

  /**
   * @enhance FormControlMixin - add slot[name=selection-display]
   */
  // eslint-disable-next-line class-methods-use-this
  _inputGroupInputTemplate() {
    // @ts-ignore
    return html`
      <div class="input-group__input">
        <slot name="selection-display"></slot>
        <slot name="input"></slot>
      </div>
    `;
  }

  // eslint-disable-next-line class-methods-use-this
  _overlayListboxTemplate() {
    // TODO: Localize the aria-label
    return html`
      <div id="overlay-content-node-wrapper" role="dialog" aria-label="Combobox options popup">
        <slot name="listbox"></slot>
      </div>
      <slot id="options-outlet"></slot>
    `;
  }

  /**
   * @enhance FormControlMixin - add overlay
   */
  _groupTwoTemplate() {
    return html` ${super._groupTwoTemplate()} ${this._overlayListboxTemplate()}`;
  }

  /**
   * @type {SlotsMap}
   */
  // @ts-ignore
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
   */
  get _comboboxNode() {
    return /** @type {HTMLElement} */ (this.querySelector('[slot="input"]'));
  }

  /**
   * @type {SelectionDisplay | null}
   */
  get _selectionDisplayNode() {
    return this.querySelector('[slot="selection-display"]');
  }

  /**
   * @configure FormControlMixin
   * Will tell FormControlMixin that a11y wrt labels / descriptions / feedback
   * should be applied here.
   */
  get _inputNode() {
    if (this._ariaVersion === '1.1') {
      return /** @type {HTMLInputElement} */ (this._comboboxNode.querySelector('input'));
    }
    return /** @type {HTMLInputElement} */ (this._comboboxNode);
  }

  /**
   * @configure OverlayMixin
   */
  get _overlayContentNode() {
    return this._listboxNode;
  }

  /**
   * @configure OverlayMixin
   */
  get _overlayReferenceNode() {
    return /** @type {ShadowRoot} */ (this.shadowRoot).querySelector('.input-group__container');
  }

  /**
   * @configure OverlayMixin
   */
  get _overlayInvokerNode() {
    return this._inputNode;
  }

  /**
   * @configure ListboxMixin
   */
  get _listboxNode() {
    return /** @type {LionOptions} */ ((this._overlayCtrl && this._overlayCtrl.contentNode) ||
      Array.from(this.children).find(child => child.slot === 'listbox'));
  }

  /**
   * @configure ListboxMixin
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
     * @configure ListboxMixin: the wai-aria pattern and <datalist> rotate
     */
    this.rotateKeyboardNavigation = true;
    /**
     * @configure ListboxMixin: the wai-aria pattern and <datalist> have selection follow focus
     */
    this.selectionFollowsFocus = true;

    /**
     * For optimal support, we allow aria v1.1 on newer browsers
     * @type {'1.1'|'1.0'}
     */
    this._ariaVersion = browserDetection.isChromium ? '1.1' : '1.0';

    /**
     * @configure ListboxMixin
     */
    this._listboxReceivesNoFocus = true;

    this.__prevCboxValueNonSelected = '';
    this.__prevCboxValue = '';

    /** @type {EventListener} */
    this.__requestShowOverlay = this.__requestShowOverlay.bind(this);
    /** @type {EventListener} */
    this._textboxOnInput = this._textboxOnInput.bind(this);
    /** @type {EventListener} */
    this._textboxOnKeydown = this._textboxOnKeydown.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    if (this._selectionDisplayNode) {
      this._selectionDisplayNode.comboboxElement = this;
    }
  }

  /**
   * @param {'disabled'|'modelValue'|'readOnly'} name
   * @param {unknown} oldValue
   */
  requestUpdateInternal(name, oldValue) {
    super.requestUpdateInternal(name, oldValue);
    if (name === 'disabled' || name === 'readOnly') {
      this.__setComboboxDisabledAndReadOnly();
    }
    if (name === 'modelValue' && this.modelValue && this.modelValue !== oldValue) {
      if (this._syncToTextboxCondition(this.modelValue, this.__oldModelValue)) {
        if (!this.multipleChoice) {
          this._setTextboxValue(this.modelValue);
        } else {
          this._syncToTextboxMultiple(this.modelValue, this.__oldModelValue);
        }
      }
    }
  }

  /**
   * @param {import('@lion/core').PropertyValues } changedProperties
   */
  updated(changedProperties) {
    super.updated(changedProperties);
    if (changedProperties.has('focused')) {
      if (this.focused) {
        this.__requestShowOverlay();
      }
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
    }

    if (typeof this._selectionDisplayNode?.onComboboxElementUpdated === 'function') {
      this._selectionDisplayNode.onComboboxElementUpdated(changedProperties);
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
    if (typeof option.choiceValue === 'string' && typeof textboxValue === 'string') {
      idx = option.choiceValue.toLowerCase().indexOf(textboxValue.toLowerCase());
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
   * @param {{ currentValue: string, lastKey:string }} options
   */
  // eslint-disable-next-line class-methods-use-this
  _showOverlayCondition({ lastKey }) {
    // when no keyboard action involved (on focused change), return current opened state
    if (!lastKey) {
      return this.opened;
    }
    const doNotShowOn = ['Tab', 'Esc', 'Enter'];
    return !doNotShowOn.includes(lastKey);
  }

  /**
   * @param {Event} ev
   */
  // eslint-disable-next-line no-unused-vars
  _textboxOnInput(ev) {
    // Schedules autocompletion of options
    this.__shouldAutocompleteNextUpdate = true;
  }

  /**
   * @param {KeyboardEvent} ev
   */
  _textboxOnKeydown(ev) {
    if (ev.key === 'Tab') {
      this.opened = false;
    }
  }

  /**
   * @param {MouseEvent} ev
   */
  _listboxOnClick(ev) {
    super._listboxOnClick(ev);
    if (!this.multipleChoice) {
      this.activeIndex = -1;
      this.opened = false;
    }
    this._inputNode.focus();
  }

  /**
   * @param {string} v
   */
  _setTextboxValue(v) {
    // Make sure that we don't loose inputNode.selectionStart and inputNode.selectionEnd
    if (this._inputNode.value !== v) {
      this._inputNode.value = v;
    }
  }

  __onOverlayClose() {
    if (!this.multipleChoice) {
      if (
        this.checkedIndex !== -1 &&
        this._syncToTextboxCondition(this.modelValue, this.__oldModelValue, {
          phase: 'overlay-close',
        })
      ) {
        this._inputNode.value = this.formElements[
          /** @type {number} */ (this.checkedIndex)
        ].choiceValue;
      }
    } else {
      this._syncToTextboxMultiple(this.modelValue, this.__oldModelValue);
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
   * @param {EventTarget & import('../types/choice-group/ChoiceInputMixinTypes').ChoiceInputHost} target
   */
  _repropagationCondition(target) {
    return super._repropagationCondition(target) || this.formElements.every(el => !el.checked);
  }

  /* eslint-disable no-param-reassign */
  /**
   * @overridable
   * @param {LionOption & {__originalInnerHTML?:string}} option
   * @param {string} matchingString
   */
  // eslint-disable-next-line class-methods-use-this
  _onFilterMatch(option, matchingString) {
    const { innerHTML } = option;
    option.__originalInnerHTML = innerHTML;
    const newInnerHTML = innerHTML.replace(new RegExp(`(${matchingString})`, 'i'), `<b>$1</b>`);
    // For Safari, we need to add a label to the element
    option.innerHTML = `<span aria-label="${option.textContent}">${newInnerHTML}</span>`;
    // Alternatively, an extension can add an animation here
    option.style.display = '';
  }

  /**
   * @overridable
   * @param {LionOption & {__originalInnerHTML?:string}} option
   * @param {string} [curValue]
   * @param {string} [prevValue]
   */
  // eslint-disable-next-line no-unused-vars, class-methods-use-this
  _onFilterUnmatch(option, curValue, prevValue) {
    if (option.__originalInnerHTML) {
      option.innerHTML = option.__originalInnerHTML;
    }
    // Alternatively, an extension can add an animation here
    option.style.display = 'none';
  }
  /* eslint-enable no-param-reassign */

  /**
   * Computes whether a user intends to autofill (inline autocomplete textbox)
   * @param {{ prevValue:string, curValue:string }} config
   */
  // eslint-disable-next-line class-methods-use-this
  __computeUserIntendsAutoFill({ prevValue, curValue }) {
    const userIsAddingChars = prevValue.length < curValue.length;
    const userStartsNewWord =
      prevValue.length &&
      curValue.length &&
      prevValue[0].toLowerCase() !== curValue[0].toLowerCase();
    return userIsAddingChars || userStartsNewWord;
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
   */
  _handleAutocompletion() {
    // TODO: this is captured by 'noFilter'
    // It should be removed and failing tests should be fixed. Currently, this line causes
    // an empty box to keep showing its options when autocomplete is 'none'.
    if (this.autocomplete === 'none') {
      return;
    }

    const hasSelection = this._inputNode.value.length !== this._inputNode.selectionStart;

    const curValue = this._inputNode.value;
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
    // @ts-ignore this.autocomplete === 'none' needs to be there if statement above is removed
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
            const stringValues =
              typeof option.choiceValue === 'string' && typeof curValue === 'string';
            const beginsWith =
              stringValues &&
              option.choiceValue.toLowerCase().indexOf(curValue.toLowerCase()) === 0;
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
    if (!hasAutoFilled && autoselect && !this.multipleChoice) {
      // This means there is no match for checkedIndex
      this.checkedIndex = -1;
    }

    // [8]. These values will help computing autofill intentions next autocomplete cycle
    this.__prevCboxValueNonSelected = curValue;
    // See test 'computation of "user intends autofill" works correctly afer autofill'
    this.__prevCboxValue = this._inputNode.value;
    this.__hadSelectionLastAutofill =
      this._inputNode.value.length !== this._inputNode.selectionStart;

    // [9]. Reposition overlay
    if (this._overlayCtrl && this._overlayCtrl._popper) {
      this._overlayCtrl._popper.update();
    }
  }

  __textboxInlineComplete(option = this.formElements[this.activeIndex]) {
    const prevLen = this._inputNode.value.length;
    this._inputNode.value = option.choiceValue;
    this._inputNode.selectionStart = prevLen;
    this._inputNode.selectionEnd = this._inputNode.value.length;
  }

  /**
   * When this condition is false, an end user will have to manually select a suggested
   * option from the list (by default when autocomplete is 'none' or 'list').
   * For autocomplete 'both' or 'inline', it will automatically select on a match.
   * @overridable
   */
  _autoSelectCondition() {
    return this.autocomplete === 'both' || this.autocomplete === 'inline';
  }

  /**
   * @enhance ListboxMixin
   */
  _setupListboxNode() {
    super._setupListboxNode();
    // Only the textbox should be focusable
    this._listboxNode.removeAttribute('tabindex');
  }

  /**
   * @configure OverlayMixin
   */
  // eslint-disable-next-line class-methods-use-this
  _defineOverlayConfig() {
    return /** @type {OverlayConfig} */ ({
      ...withDropdownConfig(),
      elementToFocusAfterHide: undefined,
    });
  }

  /**
   * @enhance OverlayMixin
   */
  _setupOverlayCtrl() {
    super._setupOverlayCtrl();
    this.__initFilterListbox();
    this.__setupCombobox();
  }

  /**
   * @enhance OverlayMixin
   */
  _setupOpenCloseListeners() {
    super._setupOpenCloseListeners();
    this._inputNode.addEventListener('keyup', this.__requestShowOverlay);
  }

  /**
   * @enhance OverlayMixin
   */
  _teardownOpenCloseListeners() {
    super._teardownOpenCloseListeners();
    this._inputNode.removeEventListener('keyup', this.__requestShowOverlay);
  }

  /**
   * @enhance ListboxMixin
   * @param {KeyboardEvent} ev
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
   */
  _syncToTextboxMultiple(modelValue, oldModelValue = []) {
    const diff = modelValue.filter(x => !oldModelValue.includes(x));
    this._setTextboxValue(diff); // or last selected value?
  }

  /**
   * @override FormControlMixin - add form-control to [slot=input] instead of _inputNode
   */
  _enhanceLightDomClasses() {
    if (this.querySelector('[slot=input]')) {
      this.querySelector('[slot=input]').classList.add('form-control');
    }
  }

  __initFilterListbox() {
    this._handleAutocompletion();
  }

  __setComboboxDisabledAndReadOnly() {
    if (this._comboboxNode) {
      this._comboboxNode.setAttribute('disabled', `${this.disabled}`);
      this._comboboxNode.setAttribute('readonly', `${this.readOnly}`);
    }
  }

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

  __teardownCombobox() {
    this._inputNode.removeEventListener('keydown', this._listboxOnKeyDown);
    this._inputNode.removeEventListener('input', this._textboxOnInput);
    this._inputNode.removeEventListener('keydown', this._textboxOnKeydown);
  }

  /**
   * @param {KeyboardEvent} [ev]
   */
  __requestShowOverlay(ev) {
    this.opened = this._showOverlayCondition({
      lastKey: ev && ev.key,
      currentValue: this._inputNode.value,
    });
  }
}
